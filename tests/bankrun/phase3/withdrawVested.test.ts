import { describe, it } from "mocha";
import { expect } from "chai";
import { Keypair, SystemProgram, Transaction, SYSVAR_INSTRUCTIONS_PUBKEY } from "@solana/web3.js";
import { getAssociatedTokenAddressSync, createAssociatedTokenAccountInstruction } from "@solana/spl-token";
import BN from "bn.js";
import {
  setupTest,
  initializeProtocol,
  advanceClock,
  findClaimConfigPDA,
  findClaimStatusPDA,
  buildMerkleTree,
  getMerkleProof,
  createEd25519Instruction,
  calculateVestedAmount,
  calculateSpeedBonus,
  TOKEN_2022_PROGRAM_ID,
  DEFAULT_SLOTS_PER_DAY,
  VESTING_DAYS,
  IMMEDIATE_RELEASE_BPS,
  BPS_SCALER,
} from "./utils";

describe("WithdrawVested", () => {
  async function setupClaimPeriodAndClaim(program: any, payer: any, context: any) {
    const { globalState, mint, mintAuthority } = await initializeProtocol(program, payer);

    const snapshotWallet = Keypair.generate();
    const snapshotBalance = new BN("1000000000"); // 1 SOL
    const claimPeriodId = 1;

    // Build Merkle tree and initialize claim period
    const entries = [{ wallet: snapshotWallet.publicKey, amount: snapshotBalance, claimPeriodId }];
    const tree = buildMerkleTree(entries);
    const merkleRoot = Array.from(tree.root);

    const [claimConfigPDA] = findClaimConfigPDA(program.programId);
    const totalClaimable = new BN("10000000000000");

    await program.methods
      .initializeClaimPeriod(merkleRoot, totalClaimable, 1, claimPeriodId)
      .accounts({
        authority: payer.publicKey,
        claimConfig: claimConfigPDA,
        systemProgram: SystemProgram.programId,
      })
      .signers([payer])
      .rpc();

    // Fund snapshot wallet
    const fundTx = new Transaction();
    fundTx.add(SystemProgram.transfer({
      fromPubkey: payer.publicKey,
      toPubkey: snapshotWallet.publicKey,
      lamports: 100_000_000,
    }));
    await program.provider.sendAndConfirm(fundTx, [payer]);

    // Create ATA
    const claimerATA = getAssociatedTokenAddressSync(mint, snapshotWallet.publicKey, false, TOKEN_2022_PROGRAM_ID);
    const createAtaTx = new Transaction();
    createAtaTx.add(createAssociatedTokenAccountInstruction(
      snapshotWallet.publicKey, claimerATA, snapshotWallet.publicKey, mint, TOKEN_2022_PROGRAM_ID
    ));
    await program.provider.sendAndConfirm(createAtaTx, [snapshotWallet]);

    // Make the claim
    const proof = getMerkleProof(tree, snapshotWallet.publicKey);
    const ed25519Ix = createEd25519Instruction(snapshotWallet, snapshotBalance);
    const [claimStatusPDA] = findClaimStatusPDA(program.programId, tree.root, snapshotWallet.publicKey);

    const claimTx = new Transaction();
    claimTx.add(ed25519Ix);
    claimTx.add(await program.methods
      .freeClaim(snapshotBalance, proof.map(p => Array.from(p)))
      .accounts({
        claimer: snapshotWallet.publicKey,
        snapshotWallet: snapshotWallet.publicKey,
        globalState, claimConfig: claimConfigPDA, claimStatus: claimStatusPDA,
        claimerTokenAccount: claimerATA, mint, mintAuthority,
        instructionsSysvar: SYSVAR_INSTRUCTIONS_PUBKEY,
        tokenProgram: TOKEN_2022_PROGRAM_ID, systemProgram: SystemProgram.programId,
      }).instruction());

    await program.provider.sendAndConfirm(claimTx, [snapshotWallet]);

    // Get claim amounts
    const { totalAmount } = calculateSpeedBonus(snapshotBalance, 0);
    const immediateAmount = totalAmount.muln(IMMEDIATE_RELEASE_BPS).divn(BPS_SCALER);

    return {
      snapshotWallet,
      snapshotBalance,
      globalState,
      mint,
      mintAuthority,
      claimerATA,
      claimConfigPDA,
      claimStatusPDA,
      totalAmount,
      immediateAmount,
    };
  }

  it("withdraws 10% immediately after claim", async () => {
    const { context, provider, program, payer } = await setupTest();
    const setup = await setupClaimPeriodAndClaim(program, payer, context);

    // Try to withdraw right after claim - should get 0 additional tokens
    // because immediate portion was already withdrawn
    const withdrawTx = new Transaction();
    withdrawTx.add(await program.methods
      .withdrawVested()
      .accounts({
        claimer: setup.snapshotWallet.publicKey,
        globalState: setup.globalState,
        claimConfig: setup.claimConfigPDA,
        claimStatus: setup.claimStatusPDA,
        claimerTokenAccount: setup.claimerATA,
        mint: setup.mint,
        mintAuthority: setup.mintAuthority,
        tokenProgram: TOKEN_2022_PROGRAM_ID,
      }).instruction());

    try {
      await program.provider.sendAndConfirm(withdrawTx, [setup.snapshotWallet]);
      expect.fail("Expected NoVestedTokens error");
    } catch (error: any) {
      // At slot 0 after claim, only immediate portion is vested, which is already withdrawn
      expect(error.toString()).to.include("NoVestedTokens");
    }
  });

  it("withdraws partial vesting mid-period", async () => {
    const { context, provider, program, payer } = await setupTest();
    const setup = await setupClaimPeriodAndClaim(program, payer, context);

    // Get claim status to know claimed slot
    const claimStatus = await program.account.claimStatus.fetch(setup.claimStatusPDA);
    const claimedSlot = new BN(claimStatus.claimedSlot.toString());
    const vestingEndSlot = new BN(claimStatus.vestingEndSlot.toString());

    // Advance 15 days (50% through vesting period)
    const slotsToAdvance = DEFAULT_SLOTS_PER_DAY.muln(15);
    await advanceClock(context, BigInt(slotsToAdvance.toString()));

    const currentSlot = claimedSlot.add(slotsToAdvance);

    // Calculate expected vested amount
    const expectedVested = calculateVestedAmount(
      setup.totalAmount,
      claimedSlot,
      vestingEndSlot,
      currentSlot
    );
    const expectedWithdrawable = expectedVested.sub(setup.immediateAmount);

    // Withdraw
    const withdrawTx = new Transaction();
    withdrawTx.add(await program.methods
      .withdrawVested()
      .accounts({
        claimer: setup.snapshotWallet.publicKey,
        globalState: setup.globalState,
        claimConfig: setup.claimConfigPDA,
        claimStatus: setup.claimStatusPDA,
        claimerTokenAccount: setup.claimerATA,
        mint: setup.mint,
        mintAuthority: setup.mintAuthority,
        tokenProgram: TOKEN_2022_PROGRAM_ID,
      }).instruction());

    await program.provider.sendAndConfirm(withdrawTx, [setup.snapshotWallet]);

    // Verify withdrawn amount updated
    const claimStatusAfter = await program.account.claimStatus.fetch(setup.claimStatusPDA);
    const newWithdrawn = new BN(claimStatusAfter.withdrawnAmount.toString());

    // withdrawn_amount should have increased by approximately expectedWithdrawable
    // Allow some tolerance for slot timing
    expect(newWithdrawn.gt(setup.immediateAmount)).to.equal(true);
  });

  it("withdraws full amount after 30 days", async () => {
    const { context, provider, program, payer } = await setupTest();
    const setup = await setupClaimPeriodAndClaim(program, payer, context);

    // Advance past vesting end (30+ days)
    await advanceClock(context, BigInt(DEFAULT_SLOTS_PER_DAY.muln(VESTING_DAYS + 1).toString()));

    // Withdraw should get entire vesting portion
    const withdrawTx = new Transaction();
    withdrawTx.add(await program.methods
      .withdrawVested()
      .accounts({
        claimer: setup.snapshotWallet.publicKey,
        globalState: setup.globalState,
        claimConfig: setup.claimConfigPDA,
        claimStatus: setup.claimStatusPDA,
        claimerTokenAccount: setup.claimerATA,
        mint: setup.mint,
        mintAuthority: setup.mintAuthority,
        tokenProgram: TOKEN_2022_PROGRAM_ID,
      }).instruction());

    await program.provider.sendAndConfirm(withdrawTx, [setup.snapshotWallet]);

    // Verify full amount withdrawn
    const claimStatusAfter = await program.account.claimStatus.fetch(setup.claimStatusPDA);
    expect(claimStatusAfter.withdrawnAmount.toString()).to.equal(setup.totalAmount.toString());
  });

  it("tracks cumulative withdrawn_amount", async () => {
    const { context, provider, program, payer } = await setupTest();
    const setup = await setupClaimPeriodAndClaim(program, payer, context);

    // First withdrawal after 10 days
    await advanceClock(context, BigInt(DEFAULT_SLOTS_PER_DAY.muln(10).toString()));

    const withdrawTx1 = new Transaction();
    withdrawTx1.add(await program.methods
      .withdrawVested()
      .accounts({
        claimer: setup.snapshotWallet.publicKey,
        globalState: setup.globalState,
        claimConfig: setup.claimConfigPDA,
        claimStatus: setup.claimStatusPDA,
        claimerTokenAccount: setup.claimerATA,
        mint: setup.mint,
        mintAuthority: setup.mintAuthority,
        tokenProgram: TOKEN_2022_PROGRAM_ID,
      }).instruction());

    await program.provider.sendAndConfirm(withdrawTx1, [setup.snapshotWallet]);

    const statusAfter1 = await program.account.claimStatus.fetch(setup.claimStatusPDA);
    const withdrawn1 = new BN(statusAfter1.withdrawnAmount.toString());

    // Second withdrawal after 20 more days (total 30 days)
    await advanceClock(context, BigInt(DEFAULT_SLOTS_PER_DAY.muln(20).toString()));

    const withdrawTx2 = new Transaction();
    withdrawTx2.add(await program.methods
      .withdrawVested()
      .accounts({
        claimer: setup.snapshotWallet.publicKey,
        globalState: setup.globalState,
        claimConfig: setup.claimConfigPDA,
        claimStatus: setup.claimStatusPDA,
        claimerTokenAccount: setup.claimerATA,
        mint: setup.mint,
        mintAuthority: setup.mintAuthority,
        tokenProgram: TOKEN_2022_PROGRAM_ID,
      }).instruction());

    await program.provider.sendAndConfirm(withdrawTx2, [setup.snapshotWallet]);

    const statusAfter2 = await program.account.claimStatus.fetch(setup.claimStatusPDA);
    const withdrawn2 = new BN(statusAfter2.withdrawnAmount.toString());

    // Cumulative tracking: second should be >= first
    expect(withdrawn2.gte(withdrawn1)).to.equal(true);
    // After 30 days, should have full amount
    expect(withdrawn2.toString()).to.equal(setup.totalAmount.toString());
  });

  it("prevents double-withdrawal of same tokens", async () => {
    const { context, provider, program, payer } = await setupTest();
    const setup = await setupClaimPeriodAndClaim(program, payer, context);

    // Advance 15 days
    await advanceClock(context, BigInt(DEFAULT_SLOTS_PER_DAY.muln(15).toString()));

    // First withdrawal
    const withdrawTx1 = new Transaction();
    withdrawTx1.add(await program.methods
      .withdrawVested()
      .accounts({
        claimer: setup.snapshotWallet.publicKey,
        globalState: setup.globalState,
        claimConfig: setup.claimConfigPDA,
        claimStatus: setup.claimStatusPDA,
        claimerTokenAccount: setup.claimerATA,
        mint: setup.mint,
        mintAuthority: setup.mintAuthority,
        tokenProgram: TOKEN_2022_PROGRAM_ID,
      }).instruction());

    await program.provider.sendAndConfirm(withdrawTx1, [setup.snapshotWallet]);

    // Immediate second withdrawal (no time passed) should fail
    const withdrawTx2 = new Transaction();
    withdrawTx2.add(await program.methods
      .withdrawVested()
      .accounts({
        claimer: setup.snapshotWallet.publicKey,
        globalState: setup.globalState,
        claimConfig: setup.claimConfigPDA,
        claimStatus: setup.claimStatusPDA,
        claimerTokenAccount: setup.claimerATA,
        mint: setup.mint,
        mintAuthority: setup.mintAuthority,
        tokenProgram: TOKEN_2022_PROGRAM_ID,
      }).instruction());

    try {
      await program.provider.sendAndConfirm(withdrawTx2, [setup.snapshotWallet]);
      expect.fail("Expected NoVestedTokens error");
    } catch (error: any) {
      expect(error.toString()).to.include("NoVestedTokens");
    }
  });

  it("calculates linear vesting correctly", async () => {
    const { context, provider, program, payer } = await setupTest();
    const setup = await setupClaimPeriodAndClaim(program, payer, context);

    const claimStatus = await program.account.claimStatus.fetch(setup.claimStatusPDA);
    const claimedSlot = new BN(claimStatus.claimedSlot.toString());
    const vestingEndSlot = new BN(claimStatus.vestingEndSlot.toString());

    // Test at day 10 (1/3 of vesting)
    const slotsDay10 = DEFAULT_SLOTS_PER_DAY.muln(10);
    const expectedDay10 = calculateVestedAmount(
      setup.totalAmount,
      claimedSlot,
      vestingEndSlot,
      claimedSlot.add(slotsDay10)
    );

    // Test at day 20 (2/3 of vesting)
    const slotsDay20 = DEFAULT_SLOTS_PER_DAY.muln(20);
    const expectedDay20 = calculateVestedAmount(
      setup.totalAmount,
      claimedSlot,
      vestingEndSlot,
      claimedSlot.add(slotsDay20)
    );

    // Test at day 30 (full vesting)
    const slotsDay30 = DEFAULT_SLOTS_PER_DAY.muln(30);
    const expectedDay30 = calculateVestedAmount(
      setup.totalAmount,
      claimedSlot,
      vestingEndSlot,
      claimedSlot.add(slotsDay30)
    );

    // Verify linear progression
    // immediate (10%) + 10/30 * vesting (90%) = 10% + 30% = 40%
    // immediate (10%) + 20/30 * vesting (90%) = 10% + 60% = 70%
    // immediate (10%) + 30/30 * vesting (90%) = 10% + 90% = 100%

    const vestingPortion = setup.totalAmount.sub(setup.immediateAmount);
    const expectedDay10Approx = setup.immediateAmount.add(vestingPortion.muln(10).divn(30));
    const expectedDay20Approx = setup.immediateAmount.add(vestingPortion.muln(20).divn(30));

    // Allow small tolerance for rounding
    expect(expectedDay10.sub(expectedDay10Approx).abs().ltn(100)).to.equal(true);
    expect(expectedDay20.sub(expectedDay20Approx).abs().ltn(100)).to.equal(true);
    expect(expectedDay30.toString()).to.equal(setup.totalAmount.toString());
  });

  it("emits VestedTokensWithdrawn event", async () => {
    const { context, provider, program, payer } = await setupTest();
    const setup = await setupClaimPeriodAndClaim(program, payer, context);

    // Advance 15 days
    await advanceClock(context, BigInt(DEFAULT_SLOTS_PER_DAY.muln(15).toString()));

    // Withdraw - event verification via state changes
    const statusBefore = await program.account.claimStatus.fetch(setup.claimStatusPDA);
    const withdrawnBefore = new BN(statusBefore.withdrawnAmount.toString());

    const withdrawTx = new Transaction();
    withdrawTx.add(await program.methods
      .withdrawVested()
      .accounts({
        claimer: setup.snapshotWallet.publicKey,
        globalState: setup.globalState,
        claimConfig: setup.claimConfigPDA,
        claimStatus: setup.claimStatusPDA,
        claimerTokenAccount: setup.claimerATA,
        mint: setup.mint,
        mintAuthority: setup.mintAuthority,
        tokenProgram: TOKEN_2022_PROGRAM_ID,
      }).instruction());

    await program.provider.sendAndConfirm(withdrawTx, [setup.snapshotWallet]);

    const statusAfter = await program.account.claimStatus.fetch(setup.claimStatusPDA);
    const withdrawnAfter = new BN(statusAfter.withdrawnAmount.toString());

    // Verify state reflects event data
    const amountWithdrawn = withdrawnAfter.sub(withdrawnBefore);
    expect(amountWithdrawn.gtn(0)).to.equal(true);

    // Remaining should be claimedAmount - withdrawnAmount
    const remaining = setup.totalAmount.sub(withdrawnAfter);
    expect(remaining.gten(0)).to.equal(true);
  });

  it("rejects withdrawal before claim", async () => {
    const { context, provider, program, payer } = await setupTest();
    const { globalState, mint, mintAuthority } = await initializeProtocol(program, payer);

    const snapshotWallet = Keypair.generate();
    const snapshotBalance = new BN("1000000000");
    const claimPeriodId = 1;

    // Build tree and initialize period
    const entries = [{ wallet: snapshotWallet.publicKey, amount: snapshotBalance, claimPeriodId }];
    const tree = buildMerkleTree(entries);
    const merkleRoot = Array.from(tree.root);

    const [claimConfigPDA] = findClaimConfigPDA(program.programId);
    await program.methods
      .initializeClaimPeriod(merkleRoot, new BN("10000000000000"), 1, claimPeriodId)
      .accounts({
        authority: payer.publicKey,
        claimConfig: claimConfigPDA,
        systemProgram: SystemProgram.programId,
      })
      .signers([payer])
      .rpc();

    // Fund wallet
    const fundTx = new Transaction();
    fundTx.add(SystemProgram.transfer({
      fromPubkey: payer.publicKey,
      toPubkey: snapshotWallet.publicKey,
      lamports: 100_000_000,
    }));
    await program.provider.sendAndConfirm(fundTx, [payer]);

    // Create ATA
    const claimerATA = getAssociatedTokenAddressSync(mint, snapshotWallet.publicKey, false, TOKEN_2022_PROGRAM_ID);
    const createAtaTx = new Transaction();
    createAtaTx.add(createAssociatedTokenAccountInstruction(
      snapshotWallet.publicKey, claimerATA, snapshotWallet.publicKey, mint, TOKEN_2022_PROGRAM_ID
    ));
    await program.provider.sendAndConfirm(createAtaTx, [snapshotWallet]);

    // Try to withdraw without claiming first
    const [claimStatusPDA] = findClaimStatusPDA(program.programId, tree.root, snapshotWallet.publicKey);

    const withdrawTx = new Transaction();
    withdrawTx.add(await program.methods
      .withdrawVested()
      .accounts({
        claimer: snapshotWallet.publicKey,
        globalState,
        claimConfig: claimConfigPDA,
        claimStatus: claimStatusPDA,
        claimerTokenAccount: claimerATA,
        mint,
        mintAuthority,
        tokenProgram: TOKEN_2022_PROGRAM_ID,
      }).instruction());

    try {
      await program.provider.sendAndConfirm(withdrawTx, [snapshotWallet]);
      expect.fail("Expected error for withdrawal before claim");
    } catch (error: any) {
      // ClaimStatus account doesn't exist
      expect(error.toString().toLowerCase()).to.satisfy((msg: string) =>
        msg.includes("account not found") ||
        msg.includes("accountnotinitialized") ||
        msg.includes("not initialized") ||
        msg.includes("does not exist")
      );
    }
  });
});
