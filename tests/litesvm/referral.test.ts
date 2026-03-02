import { describe, it, expect } from "vitest";

import { PublicKey, Keypair, Transaction, SystemProgram } from "@solana/web3.js";
import {
  getAssociatedTokenAddressSync,
  createAssociatedTokenAccountInstruction,
} from "@solana/spl-token";
import BN from "bn.js";
import {
  setupTest,
  initializeProtocol,
  mintTokensToUser,
  getTokenBalance,
  findStakePDA,
  findReferralRecordPDA,
  findMintAuthorityPDA,
  TOKEN_2022_PROGRAM_ID,
  DEFAULT_MIN_STAKE_AMOUNT,
} from "./utils";

// Helper: fund a keypair with SOL from payer
async function fundKeypair(program: any, payer: any, recipient: Keypair, lamports = 500_000_000) {
  const tx = new Transaction();
  tx.add(
    SystemProgram.transfer({
      fromPubkey: payer.publicKey,
      toPubkey: recipient.publicKey,
      lamports,
    })
  );
  await program.provider.sendAndConfirm(tx, [payer]);
}

// Helper: create an ATA for a user (Token-2022), funded by the specified fee payer
async function createATA(
  program: any,
  feePayer: Keypair,
  mint: PublicKey,
  owner: PublicKey
): Promise<PublicKey> {
  const ata = getAssociatedTokenAddressSync(mint, owner, false, TOKEN_2022_PROGRAM_ID);
  const tx = new Transaction();
  tx.add(
    createAssociatedTokenAccountInstruction(
      feePayer.publicKey,
      ata,
      owner,
      mint,
      TOKEN_2022_PROGRAM_ID
    )
  );
  await program.provider.sendAndConfirm(tx, [feePayer]);
  return ata;
}

describe("Referral System", () => {
  it("Test 1: Referee receives +10% T-share bonus compared to non-referred stake", async () => {
    const { client, program, payer } = setupTest();
    const { globalState, mint, mintAuthority } = await initializeProtocol(program, payer);

    // Create control staker (no referral)
    const controlStaker = Keypair.generate();
    await fundKeypair(program, payer, controlStaker);
    const controlATA = await createATA(program, controlStaker, mint, controlStaker.publicKey);

    // Create referrer and referee
    const referrer = Keypair.generate();
    const referee = Keypair.generate();
    await fundKeypair(program, payer, referrer);
    await fundKeypair(program, payer, referee);
    const referrerATA = await createATA(program, referrer, mint, referrer.publicKey);
    const refereeATA = await createATA(program, referee, mint, referee.publicKey);

    const stakeAmount = DEFAULT_MIN_STAKE_AMOUNT;
    const stakeDays = 100;

    // Fund parties with tokens
    await mintTokensToUser(program, payer, globalState, mint, mintAuthority, controlATA, stakeAmount);
    await mintTokensToUser(program, payer, globalState, mint, mintAuthority, refereeATA, stakeAmount);
    // Referrer needs at least a token account with the correct mint
    await mintTokensToUser(program, payer, globalState, mint, mintAuthority, referrerATA, new BN(1));

    // Control stake (no referral) — uses controlStaker as fee payer
    const [controlStakePDA] = findStakePDA(program.programId, controlStaker.publicKey, 0);
    await program.methods
      .createStake(stakeAmount, stakeDays)
      .accounts({
        user: controlStaker.publicKey,
        globalState,
        stakeAccount: controlStakePDA,
        userTokenAccount: controlATA,
        mint,
        tokenProgram: TOKEN_2022_PROGRAM_ID,
      })
      .signers([controlStaker])
      .rpc();
    const controlStakeAccount = await program.account.stakeAccount.fetch(controlStakePDA);
    const baseTShares = controlStakeAccount.tShares as BN;

    // Get the current stake counter for the referee's stake PDA
    const globalStateAccount = await program.account.globalState.fetch(globalState);
    const nextStakeId = globalStateAccount.totalStakesCreated;
    const [referralStakePDA] = findStakePDA(program.programId, referee.publicKey, nextStakeId);
    const [referralRecordPDA] = findReferralRecordPDA(
      program.programId,
      referrer.publicKey,
      referee.publicKey
    );
    const [mintAuthorityPDA] = findMintAuthorityPDA(program.programId);

    await program.methods
      .createStakeWithReferral(stakeAmount, stakeDays, referrer.publicKey)
      .accounts({
        user: referee.publicKey,
        globalState,
        stakeAccount: referralStakePDA,
        userTokenAccount: refereeATA,
        referrerTokenAccount: referrerATA,
        referralRecord: referralRecordPDA,
        mint,
        mintAuthority: mintAuthorityPDA,
        tokenProgram: TOKEN_2022_PROGRAM_ID,
      })
      .signers([referee])
      .rpc();

    const referralStakeAccount = await program.account.stakeAccount.fetch(referralStakePDA);
    const referralTShares = referralStakeAccount.tShares as BN;

    // +10% bonus: referral_t_shares = base_t_shares + floor(base_t_shares * 1000 / 10000)
    const expectedBonus = baseTShares.muln(1000).divn(10000);
    const expectedReferralTShares = baseTShares.add(expectedBonus);

    // Allow ±1 for rounding
    const diff = referralTShares.sub(expectedReferralTShares).abs();
    expect(diff.lten(1)).toBe(true);
    expect(referralTShares.gt(baseTShares)).toBe(true);
  });

  it("Test 2: Referrer receives +5% token bonus minted to their account", async () => {
    const { client, program, payer } = setupTest();
    const { globalState, mint, mintAuthority } = await initializeProtocol(program, payer);

    const referrer = Keypair.generate();
    const referee = Keypair.generate();
    await fundKeypair(program, payer, referrer);
    await fundKeypair(program, payer, referee);
    const referrerATA = await createATA(program, referrer, mint, referrer.publicKey);
    const refereeATA = await createATA(program, referee, mint, referee.publicKey);

    const stakeAmount = DEFAULT_MIN_STAKE_AMOUNT;
    await mintTokensToUser(program, payer, globalState, mint, mintAuthority, refereeATA, stakeAmount);
    // Give referrer initial balance so we can track the change
    await mintTokensToUser(program, payer, globalState, mint, mintAuthority, referrerATA, new BN(1));

    const referrerBalanceBefore = await getTokenBalance(client, referrerATA);

    const [referralStakePDA] = findStakePDA(program.programId, referee.publicKey, 0);
    const [referralRecordPDA] = findReferralRecordPDA(
      program.programId,
      referrer.publicKey,
      referee.publicKey
    );
    const [mintAuthorityPDA] = findMintAuthorityPDA(program.programId);

    await program.methods
      .createStakeWithReferral(stakeAmount, 100, referrer.publicKey)
      .accounts({
        user: referee.publicKey,
        globalState,
        stakeAccount: referralStakePDA,
        userTokenAccount: refereeATA,
        referrerTokenAccount: referrerATA,
        referralRecord: referralRecordPDA,
        mint,
        mintAuthority: mintAuthorityPDA,
        tokenProgram: TOKEN_2022_PROGRAM_ID,
      })
      .signers([referee])
      .rpc();

    const referrerBalanceAfter = await getTokenBalance(client, referrerATA);
    const referrerGain = referrerBalanceAfter - referrerBalanceBefore;

    // Expected: amount * 500 / 10000 = amount * 5%
    const expectedBonus = BigInt(stakeAmount.toString()) * BigInt(500) / BigInt(10000);
    const diff = referrerGain > expectedBonus
      ? referrerGain - expectedBonus
      : expectedBonus - referrerGain;

    expect(diff <= BigInt(1)).toBe(true);
    expect(referrerGain > BigInt(0)).toBe(true);
  });

  it("Test 3: Self-referral attempt fails with SelfReferral error", async () => {
    const { program, payer } = setupTest();
    const { globalState, mint, mintAuthority } = await initializeProtocol(program, payer);

    const user = Keypair.generate();
    await fundKeypair(program, payer, user);
    const userATA = await createATA(program, user, mint, user.publicKey);

    const stakeAmount = DEFAULT_MIN_STAKE_AMOUNT;
    await mintTokensToUser(program, payer, globalState, mint, mintAuthority, userATA, stakeAmount);

    const [stakePDA] = findStakePDA(program.programId, user.publicKey, 0);
    // For self-referral: referrer == user.publicKey, so PDA is [referral, user, user]
    const [referralRecordPDA] = findReferralRecordPDA(
      program.programId,
      user.publicKey,
      user.publicKey
    );
    const [mintAuthorityPDA] = findMintAuthorityPDA(program.programId);

    let errorCaught = false;
    try {
      await program.methods
        .createStakeWithReferral(stakeAmount, 100, user.publicKey) // referrer == self
        .accounts({
          user: user.publicKey,
          globalState,
          stakeAccount: stakePDA,
          userTokenAccount: userATA,
          referrerTokenAccount: userATA,    // same ATA for self-referral
          referralRecord: referralRecordPDA,
          mint,
          mintAuthority: mintAuthorityPDA,
          tokenProgram: TOKEN_2022_PROGRAM_ID,
        })
        .signers([user])
        .rpc();
    } catch (err: any) {
      errorCaught = true;
      const errStr = err.toString();
      // SelfReferral error — match either the name or any error code
      // The on-chain check `require!(referrer != user.key, HelixError::SelfReferral)` fires before account init
      expect(
        errStr.includes("SelfReferral") ||
        errStr.includes("6157") ||
        errStr.includes("custom program error")
      ).toBe(true);
    }
    expect(errorCaught).toBe(true);
  });

  it("Test 4: Duplicate referral from same referrer to same referee fails", async () => {
    const { program, payer } = setupTest();
    const { globalState, mint, mintAuthority } = await initializeProtocol(program, payer);

    const referrer = Keypair.generate();
    const referee = Keypair.generate();
    await fundKeypair(program, payer, referrer);
    await fundKeypair(program, payer, referee);
    const referrerATA = await createATA(program, referrer, mint, referrer.publicKey);
    const refereeATA = await createATA(program, referee, mint, referee.publicKey);

    const stakeAmount = DEFAULT_MIN_STAKE_AMOUNT;
    // Mint enough for two potential stakes
    await mintTokensToUser(program, payer, globalState, mint, mintAuthority, refereeATA, stakeAmount.muln(2));
    await mintTokensToUser(program, payer, globalState, mint, mintAuthority, referrerATA, new BN(1));

    const [mintAuthorityPDA] = findMintAuthorityPDA(program.programId);
    const [referralRecordPDA] = findReferralRecordPDA(
      program.programId,
      referrer.publicKey,
      referee.publicKey
    );

    // First referral — should succeed
    const [stakePDA1] = findStakePDA(program.programId, referee.publicKey, 0);
    await program.methods
      .createStakeWithReferral(stakeAmount, 100, referrer.publicKey)
      .accounts({
        user: referee.publicKey,
        globalState,
        stakeAccount: stakePDA1,
        userTokenAccount: refereeATA,
        referrerTokenAccount: referrerATA,
        referralRecord: referralRecordPDA,
        mint,
        mintAuthority: mintAuthorityPDA,
        tokenProgram: TOKEN_2022_PROGRAM_ID,
      })
      .signers([referee])
      .rpc();

    // Second referral with same referrer-referee pair — should fail (PDA already in use)
    const globalStateAccount = await program.account.globalState.fetch(globalState);
    const nextStakeId = globalStateAccount.totalStakesCreated;
    const [stakePDA2] = findStakePDA(program.programId, referee.publicKey, nextStakeId);

    let errorCaught = false;
    try {
      await program.methods
        .createStakeWithReferral(stakeAmount, 100, referrer.publicKey)
        .accounts({
          user: referee.publicKey,
          globalState,
          stakeAccount: stakePDA2,
          userTokenAccount: refereeATA,
          referrerTokenAccount: referrerATA,
          referralRecord: referralRecordPDA, // same PDA — Anchor init will fail
          mint,
          mintAuthority: mintAuthorityPDA,
          tokenProgram: TOKEN_2022_PROGRAM_ID,
        })
        .signers([referee])
        .rpc();
    } catch (err: any) {
      errorCaught = true;
      const errStr = err.toString();
      // Anchor init constraint fails when PDA already exists
      expect(
        errStr.includes("already in use") ||
        errStr.includes("custom program error") ||
        errStr.includes("0x0")
      ).toBe(true);
    }
    expect(errorCaught).toBe(true);
  });

  it("Test 5: Different referrers can each refer the same referee (independent PDAs)", async () => {
    const { program, payer } = setupTest();
    const { globalState, mint, mintAuthority } = await initializeProtocol(program, payer);

    const referrerA = Keypair.generate();
    const referrerB = Keypair.generate();
    const referee = Keypair.generate();

    await fundKeypair(program, payer, referrerA);
    await fundKeypair(program, payer, referrerB);
    await fundKeypair(program, payer, referee);

    const referrerAATA = await createATA(program, referrerA, mint, referrerA.publicKey);
    const referrerBATA = await createATA(program, referrerB, mint, referrerB.publicKey);
    const refereeATA = await createATA(program, referee, mint, referee.publicKey);

    const stakeAmount = DEFAULT_MIN_STAKE_AMOUNT;
    // Mint enough for two stakes
    await mintTokensToUser(program, payer, globalState, mint, mintAuthority, refereeATA, stakeAmount.muln(2));
    await mintTokensToUser(program, payer, globalState, mint, mintAuthority, referrerAATA, new BN(1));
    await mintTokensToUser(program, payer, globalState, mint, mintAuthority, referrerBATA, new BN(1));

    const [mintAuthorityPDA] = findMintAuthorityPDA(program.programId);

    // Referrer A -> Referee
    const [referralRecordA] = findReferralRecordPDA(program.programId, referrerA.publicKey, referee.publicKey);
    const [stakePDA1] = findStakePDA(program.programId, referee.publicKey, 0);
    await program.methods
      .createStakeWithReferral(stakeAmount, 100, referrerA.publicKey)
      .accounts({
        user: referee.publicKey,
        globalState,
        stakeAccount: stakePDA1,
        userTokenAccount: refereeATA,
        referrerTokenAccount: referrerAATA,
        referralRecord: referralRecordA,
        mint,
        mintAuthority: mintAuthorityPDA,
        tokenProgram: TOKEN_2022_PROGRAM_ID,
      })
      .signers([referee])
      .rpc();

    // Referrer B -> Referee (different PDA — should succeed)
    const [referralRecordB] = findReferralRecordPDA(program.programId, referrerB.publicKey, referee.publicKey);

    // Verify the two PDAs are different
    expect(referralRecordA.toBase58()).not.toBe(referralRecordB.toBase58());

    const globalStateAccount = await program.account.globalState.fetch(globalState);
    const nextStakeId = globalStateAccount.totalStakesCreated;
    const [stakePDA2] = findStakePDA(program.programId, referee.publicKey, nextStakeId);

    await program.methods
      .createStakeWithReferral(stakeAmount, 100, referrerB.publicKey)
      .accounts({
        user: referee.publicKey,
        globalState,
        stakeAccount: stakePDA2,
        userTokenAccount: refereeATA,
        referrerTokenAccount: referrerBATA,
        referralRecord: referralRecordB,
        mint,
        mintAuthority: mintAuthorityPDA,
        tokenProgram: TOKEN_2022_PROGRAM_ID,
      })
      .signers([referee])
      .rpc();

    // Both referral records should exist and be correct
    const recordA = await program.account.referralRecord.fetch(referralRecordA);
    const recordB = await program.account.referralRecord.fetch(referralRecordB);

    expect(recordA.referrer.toBase58()).toBe(referrerA.publicKey.toBase58());
    expect(recordB.referrer.toBase58()).toBe(referrerB.publicKey.toBase58());
    expect(recordA.referee.toBase58()).toBe(referee.publicKey.toBase58());
    expect(recordB.referee.toBase58()).toBe(referee.publicKey.toBase58());
  });

  it("Test 6: ReferralRecord is populated correctly after successful referral", async () => {
    const { client, program, payer } = setupTest();
    const { globalState, mint, mintAuthority } = await initializeProtocol(program, payer);

    const referrer = Keypair.generate();
    const referee = Keypair.generate();
    await fundKeypair(program, payer, referrer);
    await fundKeypair(program, payer, referee);
    const referrerATA = await createATA(program, referrer, mint, referrer.publicKey);
    const refereeATA = await createATA(program, referee, mint, referee.publicKey);

    const stakeAmount = DEFAULT_MIN_STAKE_AMOUNT;
    await mintTokensToUser(program, payer, globalState, mint, mintAuthority, refereeATA, stakeAmount);
    await mintTokensToUser(program, payer, globalState, mint, mintAuthority, referrerATA, new BN(1));

    const [stakePDA] = findStakePDA(program.programId, referee.publicKey, 0);
    const [referralRecordPDA] = findReferralRecordPDA(
      program.programId,
      referrer.publicKey,
      referee.publicKey
    );
    const [mintAuthorityPDA] = findMintAuthorityPDA(program.programId);

    // Get clock slot before transaction
    const clockBefore = client.getClock();

    await program.methods
      .createStakeWithReferral(stakeAmount, 100, referrer.publicKey)
      .accounts({
        user: referee.publicKey,
        globalState,
        stakeAccount: stakePDA,
        userTokenAccount: refereeATA,
        referrerTokenAccount: referrerATA,
        referralRecord: referralRecordPDA,
        mint,
        mintAuthority: mintAuthorityPDA,
        tokenProgram: TOKEN_2022_PROGRAM_ID,
      })
      .signers([referee])
      .rpc();

    const referralRecord = await program.account.referralRecord.fetch(referralRecordPDA);

    expect(referralRecord.referrer.toBase58()).toBe(referrer.publicKey.toBase58());
    expect(referralRecord.referee.toBase58()).toBe(referee.publicKey.toBase58());
    // Slot should be >= the slot before the transaction
    expect(referralRecord.slot.toNumber()).toBeGreaterThanOrEqual(Number(clockBefore.slot));
  });
});
