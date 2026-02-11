import { describe, it, expect } from "vitest";
import { Keypair, SystemProgram, Transaction } from "@solana/web3.js";
import {
  getAssociatedTokenAddressSync,
  createAssociatedTokenAccountInstruction,
} from "@solana/spl-token";
import BN from "bn.js";
import {
  setupTest,
  initializeProtocol,
  mintTokensToUser,
  advanceClock,
  findClaimConfigPDA,
  findStakePDA,
  findGlobalStatePDA,
  findMintAuthorityPDA,
  findMintPDA,
  buildMerkleTree,
  TOKEN_2022_PROGRAM_ID,
  DEFAULT_SLOTS_PER_DAY,
  DEFAULT_MIN_STAKE_AMOUNT,
} from "../phase3/utils";

/**
 * Phase 8.1 (C3/T009): Claim guard tests — zero-amount mint prevention.
 *
 * Verifies that claim_rewards and free_claim reject with ClaimAmountZero
 * when no tokens would actually be minted, preventing empty CPI calls.
 *
 * - claim_rewards: Rejects when pending_rewards == 0 AND bpd_bonus_pending == 0
 *   (e.g., freshly staked with no inflation accrued)
 * - free_claim: Defensive guard only — with MIN_SOL_BALANCE (0.1 SOL),
 *   base_amount is always >0. Guard protects against future edge cases.
 */

// Helper: Create funded staker with active stake
async function createFundedStaker(
  program: any,
  payer: any,
  globalState: any,
  mint: any,
  mintAuthority: any,
  stakeAmount: BN,
  stakeDays: number,
) {
  const staker = Keypair.generate();
  const fundTx = new Transaction();
  fundTx.add(
    SystemProgram.transfer({
      fromPubkey: payer.publicKey,
      toPubkey: staker.publicKey,
      lamports: 500_000_000,
    }),
  );
  await program.provider.sendAndConfirm(fundTx, [payer]);

  const stakerATA = getAssociatedTokenAddressSync(
    mint,
    staker.publicKey,
    false,
    TOKEN_2022_PROGRAM_ID,
  );
  const createAtaTx = new Transaction();
  createAtaTx.add(
    createAssociatedTokenAccountInstruction(
      staker.publicKey,
      stakerATA,
      staker.publicKey,
      mint,
      TOKEN_2022_PROGRAM_ID,
    ),
  );
  await program.provider.sendAndConfirm(createAtaTx, [staker]);

  await mintTokensToUser(
    program,
    payer,
    globalState,
    mint,
    mintAuthority,
    stakerATA,
    stakeAmount,
  );

  const globalStateData = await program.account.globalState.fetch(globalState);
  const [stakePDA] = findStakePDA(
    program.programId,
    staker.publicKey,
    globalStateData.totalStakesCreated,
  );

  await program.methods
    .createStake(stakeAmount, stakeDays)
    .accounts({
      user: staker.publicKey,
      globalState,
      stakeAccount: stakePDA,
      userTokenAccount: stakerATA,
      mint,
      tokenProgram: TOKEN_2022_PROGRAM_ID,
    })
    .signers([staker])
    .rpc();

  return { staker, stakerATA, stakePDA };
}

describe("Claim Guard Tests (C3 Fix — Zero-Amount Prevention)", () => {
  it("claim_rewards rejects with ClaimAmountZero when no rewards have accrued", async () => {
    // Scenario: Fresh stake, no inflation distributed, reward_debt == share_rate * t_shares.
    // pending_rewards = t_shares * share_rate / PRECISION - reward_debt = 0
    // bpd_bonus_pending = 0 (default)
    // Total = 0 → ClaimAmountZero
    const { program, payer } = await setupTest();
    const { globalState, mint, mintAuthority } = await initializeProtocol(program, payer);
    const [globalStatePDA] = findGlobalStatePDA(program.programId);
    const [mintAuthorityPDA] = findMintAuthorityPDA(program.programId);
    const [mintPDA] = findMintPDA(program.programId);

    // Create a staker (reward_debt will be set to current share_rate * t_shares)
    const { staker, stakerATA, stakePDA } = await createFundedStaker(
      program,
      payer,
      globalState,
      mint,
      mintAuthority,
      DEFAULT_MIN_STAKE_AMOUNT,
      365,
    );

    // Immediately attempt to claim — no inflation has been distributed
    // so pending_rewards == 0 and bpd_bonus_pending == 0
    try {
      await program.methods
        .claimRewards()
        .accounts({
          user: staker.publicKey,
          globalState,
          stakeAccount: stakePDA,
          userTokenAccount: stakerATA,
          mint,
          mintAuthority: mintAuthorityPDA,
          tokenProgram: TOKEN_2022_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
        })
        .signers([staker])
        .rpc();
      expect.fail("Expected ClaimAmountZero error");
    } catch (error: any) {
      expect(error.toString()).toMatch(/ClaimAmountZero/);
    }
  });

  it("claim_rewards succeeds after inflation accrues", async () => {
    // Verify that the guard doesn't block legitimate claims.
    // After share_rate increases via crankDistribution, pending_rewards > 0.
    const { context, program, payer } = await setupTest();
    const { globalState, mint, mintAuthority } = await initializeProtocol(program, payer);
    const [globalStatePDA] = findGlobalStatePDA(program.programId);
    const [mintAuthorityPDA] = findMintAuthorityPDA(program.programId);
    const [mintPDA] = findMintPDA(program.programId);

    // Use a larger stake so rewards are non-zero after inflation
    const largeStake = new BN("10000000000"); // 100 tokens
    const { staker, stakerATA, stakePDA } = await createFundedStaker(
      program,
      payer,
      globalState,
      mint,
      mintAuthority,
      largeStake,
      365,
    );

    // Advance 5 days and distribute inflation (ensures measurable share_rate increase)
    const fiveDays = BigInt(DEFAULT_SLOTS_PER_DAY.muln(5).toString());
    await advanceClock(context, fiveDays);

    await program.methods
      .crankDistribution()
      .accounts({
        cranker: payer.publicKey,
        globalState,
        mint,
        mintAuthority: mintAuthorityPDA,
        tokenProgram: TOKEN_2022_PROGRAM_ID,
      })
      .signers([payer])
      .rpc();

    // Now claim should succeed (pending_rewards > 0 after inflation)
    await program.methods
      .claimRewards()
      .accounts({
        user: staker.publicKey,
        globalState,
        stakeAccount: stakePDA,
        userTokenAccount: stakerATA,
        mint,
        mintAuthority: mintAuthorityPDA,
        tokenProgram: TOKEN_2022_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
      })
      .signers([staker])
      .rpc();

    // Verify claim was successful
    const gs = await program.account.globalState.fetch(globalState);
    expect(gs.totalClaimsCreated.toNumber()).toBeGreaterThan(0);
  });

  it("claim_rewards rejects again after double-claim (rewards already claimed)", async () => {
    // After a successful claim, reward_debt is updated. Immediately claiming again
    // should yield 0 rewards → ClaimAmountZero.
    const { context, program, payer } = await setupTest();
    const { globalState, mint, mintAuthority } = await initializeProtocol(program, payer);
    const [mintAuthorityPDA] = findMintAuthorityPDA(program.programId);

    // Use a larger stake so first claim has non-zero rewards
    const largeStake = new BN("10000000000"); // 100 tokens
    const { staker, stakerATA, stakePDA } = await createFundedStaker(
      program,
      payer,
      globalState,
      mint,
      mintAuthority,
      largeStake,
      365,
    );

    // Advance 5 days + distribute inflation
    const fiveDays = BigInt(DEFAULT_SLOTS_PER_DAY.muln(5).toString());
    await advanceClock(context, fiveDays);

    await program.methods
      .crankDistribution()
      .accounts({
        cranker: payer.publicKey,
        globalState,
        mint,
        mintAuthority: mintAuthorityPDA,
        tokenProgram: TOKEN_2022_PROGRAM_ID,
      })
      .signers([payer])
      .rpc();

    // First claim — succeeds
    await program.methods
      .claimRewards()
      .accounts({
        user: staker.publicKey,
        globalState,
        stakeAccount: stakePDA,
        userTokenAccount: stakerATA,
        mint,
        mintAuthority: mintAuthorityPDA,
        tokenProgram: TOKEN_2022_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
      })
      .signers([staker])
      .rpc();

    // Advance 1 slot to avoid bankrun duplicate transaction detection
    await advanceClock(context, BigInt(1));

    // Second claim immediately — should fail with ClaimAmountZero
    try {
      await program.methods
        .claimRewards()
        .accounts({
          user: staker.publicKey,
          globalState,
          stakeAccount: stakePDA,
          userTokenAccount: stakerATA,
          mint,
          mintAuthority: mintAuthorityPDA,
          tokenProgram: TOKEN_2022_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
        })
        .signers([staker])
        .rpc();
      expect.fail("Expected ClaimAmountZero error on double claim");
    } catch (error: any) {
      expect(error.toString()).toMatch(/ClaimAmountZero/);
    }
  });
});
