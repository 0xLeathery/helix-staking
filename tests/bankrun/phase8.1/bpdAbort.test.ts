import { describe, it, expect } from "vitest";
import { Keypair, SystemProgram, Transaction } from "@solana/web3.js";
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
  getDefaultInitializeParams,
  buildMerkleTree,
  TOKEN_2022_PROGRAM_ID,
  DEFAULT_SLOTS_PER_DAY,
  DEFAULT_MIN_STAKE_AMOUNT,
} from "../phase3/utils";
import {
  getAssociatedTokenAddressSync,
  createAssociatedTokenAccountInstruction,
} from "@solana/spl-token";

const SEAL_DELAY_SLOTS = BigInt(216_000);

/**
 * Phase 8.1 (FR-015/T036): BPD abort idempotency tests.
 *
 * Verifies that:
 * 1. abort_bpd succeeds when BPD window is active
 * 2. Calling abort_bpd again (already aborted) is a no-op (idempotent)
 * 3. abort_bpd on a fresh protocol (no BPD) is also a no-op
 */

// Helper: Create funded staker with an active stake
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

describe("BPD Abort Idempotency Tests", () => {
  it("abort_bpd succeeds when BPD window is active, then second abort is a no-op", async () => {
    const { context, program, payer } = await setupTest();
    const { globalState, mint, mintAuthority } = await initializeProtocol(program, payer);
    const [globalStatePDA] = findGlobalStatePDA(program.programId);
    const [claimConfigPDA] = findClaimConfigPDA(program.programId);

    // Set up claim period
    const snapshotWallet = Keypair.generate();
    const entries = [
      {
        wallet: snapshotWallet.publicKey,
        amount: new BN("10000000000"),
        claimPeriodId: 1,
      },
    ];
    const tree = buildMerkleTree(entries);
    const totalClaimable = new BN("100000000000000");

    await program.methods
      .initializeClaimPeriod(
        Array.from(tree.root),
        totalClaimable,
        1,
        1,
      )
      .accounts({
        authority: payer.publicKey,
        claimConfig: claimConfigPDA,
        systemProgram: SystemProgram.programId,
      })
      .signers([payer])
      .rpc();

    // Create a staker to participate in BPD
    const { stakePDA } = await createFundedStaker(
      program,
      payer,
      globalState,
      mint,
      mintAuthority,
      DEFAULT_MIN_STAKE_AMOUNT,
      365,
    );

    // Advance past claim period end
    await advanceClock(context, BigInt(DEFAULT_SLOTS_PER_DAY.toNumber() * 200));

    // Start BPD finalization (first batch)
    const remainingAccounts = [{
      pubkey: stakePDA,
      isSigner: false,
      isWritable: true,
    }];

    await program.methods
      .finalizeBpdCalculation()
      .accounts({
        caller: payer.publicKey,
        globalState,
        claimConfig: claimConfigPDA,
      })
      .remainingAccounts(remainingAccounts)
      .signers([payer])
      .rpc();

    // Verify BPD window is now active
    const stateBeforeAbort = await program.account.globalState.fetch(globalState);
    expect(stateBeforeAbort.flags & 1).toBe(1); // bpd_window_active flag

    // First abort — should succeed
    await program.methods
      .abortBpd()
      .accounts({
        globalState,
        claimConfig: claimConfigPDA,
        authority: payer.publicKey,
      })
      .signers([payer])
      .rpc();

    // Verify BPD window is now inactive
    const stateAfterAbort = await program.account.globalState.fetch(globalState);
    expect(stateAfterAbort.flags & 1).toBe(0);

    // Second abort — should be a no-op (idempotent), NOT throw an error
    await program.methods
      .abortBpd()
      .accounts({
        globalState,
        claimConfig: claimConfigPDA,
        authority: payer.publicKey,
      })
      .signers([payer])
      .rpc();

    // Still inactive — no error thrown
    const stateAfterSecondAbort = await program.account.globalState.fetch(globalState);
    expect(stateAfterSecondAbort.flags & 1).toBe(0);
  });

  it("abort_bpd on fresh protocol (no active BPD) is a no-op", async () => {
    const { program, payer } = await setupTest();
    await initializeProtocol(program, payer);
    const [globalStatePDA] = findGlobalStatePDA(program.programId);
    const [claimConfigPDA] = findClaimConfigPDA(program.programId);

    // Set up claim period (needed for claimConfig to exist)
    const snapshotWallet = Keypair.generate();
    const entries = [
      {
        wallet: snapshotWallet.publicKey,
        amount: new BN("10000000000"),
        claimPeriodId: 1,
      },
    ];
    const tree = buildMerkleTree(entries);

    await program.methods
      .initializeClaimPeriod(
        Array.from(tree.root),
        new BN("100000000000000"),
        1,
        1,
      )
      .accounts({
        authority: payer.publicKey,
        claimConfig: claimConfigPDA,
        systemProgram: SystemProgram.programId,
      })
      .signers([payer])
      .rpc();

    // Abort without ever starting BPD — should be a no-op
    await program.methods
      .abortBpd()
      .accounts({
        globalState: globalStatePDA,
        claimConfig: claimConfigPDA,
        authority: payer.publicKey,
      })
      .signers([payer])
      .rpc();

    // Verify state unchanged
    const state = await program.account.globalState.fetch(globalStatePDA);
    expect(state.flags & 1).toBe(0);
  });
});
