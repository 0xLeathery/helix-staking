import { describe, it, expect } from "vitest";

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
  calculateSpeedBonus,
  TOKEN_2022_PROGRAM_ID,
  DEFAULT_SLOTS_PER_DAY,
  findMintAuthorityPDA,
  findMintPDA,
  findGlobalStatePDA,
  SPEED_BONUS_WEEK1_BPS,
  SPEED_BONUS_WEEK2_4_BPS,
  IMMEDIATE_RELEASE_BPS,
  BPS_SCALER,
  MIN_SOL_BALANCE,
} from "./utils";

describe("FreeClaim", () => {
  async function setupClaimPeriod(program: any, payer: any, entries: { wallet: any; amount: BN; claimPeriodId: number }[]) {
    const tree = buildMerkleTree(entries);
    const merkleRoot = Array.from(tree.root);

    const [claimConfigPDA] = findClaimConfigPDA(program.programId);

    const totalClaimable = entries.reduce((sum, e) => sum.add(e.amount.muln(1000)), new BN(0));

    await program.methods
      .initializeClaimPeriod(merkleRoot, totalClaimable, entries.length, entries[0].claimPeriodId)
      .accounts({
        authority: payer.publicKey,
        claimConfig: claimConfigPDA,
        systemProgram: SystemProgram.programId,
      })
      .signers([payer])
      .rpc();

    return { tree, claimConfigPDA };
  }

  it("claims tokens with valid merkle proof and signature", async () => {
    const { context, provider, program, payer } = await setupTest();

    // Initialize protocol
    const { globalState, mint, mintAuthority } = await initializeProtocol(program, payer);

    // Create a snapshot wallet that will claim
    const snapshotWallet = Keypair.generate();
    const snapshotBalance = new BN("1000000000"); // 1 SOL in lamports
    const claimPeriodId = 1;

    // Build Merkle tree
    const entries = [
      { wallet: snapshotWallet.publicKey, amount: snapshotBalance, claimPeriodId },
    ];
    const { tree, claimConfigPDA } = await setupClaimPeriod(program, payer, entries);

    // Get proof for snapshot wallet
    const proof = getMerkleProof(tree, snapshotWallet.publicKey);

    // Calculate expected claim amount
    const { totalAmount } = calculateSpeedBonus(snapshotBalance, 0);
    const immediateAmount = totalAmount.muln(IMMEDIATE_RELEASE_BPS).divn(BPS_SCALER);

    // Create claimer's ATA
    const claimerATA = getAssociatedTokenAddressSync(
      mint,
      snapshotWallet.publicKey,
      false,
      TOKEN_2022_PROGRAM_ID
    );

    // Fund snapshot wallet for rent
    const fundTx = new Transaction();
    fundTx.add(
      SystemProgram.transfer({
        fromPubkey: payer.publicKey,
        toPubkey: snapshotWallet.publicKey,
        lamports: 100_000_000,
      })
    );
    await program.provider.sendAndConfirm(fundTx, [payer]);

    // Create ATA
    const createAtaTx = new Transaction();
    createAtaTx.add(
      createAssociatedTokenAccountInstruction(
        snapshotWallet.publicKey,
        claimerATA,
        snapshotWallet.publicKey,
        mint,
        TOKEN_2022_PROGRAM_ID
      )
    );
    await program.provider.sendAndConfirm(createAtaTx, [snapshotWallet]);

    // Build claim transaction with Ed25519 verify instruction
    const ed25519Ix = createEd25519Instruction(snapshotWallet, snapshotBalance);

    const [claimStatusPDA] = findClaimStatusPDA(
      program.programId,
      tree.root,
      snapshotWallet.publicKey
    );

    // Build and send claim transaction
    const claimTx = new Transaction();
    claimTx.add(ed25519Ix);

    const claimIx = await program.methods
      .freeClaim(snapshotBalance, proof.map(p => Array.from(p)))
      .accounts({
        claimer: snapshotWallet.publicKey,
        snapshotWallet: snapshotWallet.publicKey,
        globalState,
        claimConfig: claimConfigPDA,
        claimStatus: claimStatusPDA,
        claimerTokenAccount: claimerATA,
        mint,
        mintAuthority,
        instructionsSysvar: SYSVAR_INSTRUCTIONS_PUBKEY,
        tokenProgram: TOKEN_2022_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
      })
      .instruction();

    claimTx.add(claimIx);
    await program.provider.sendAndConfirm(claimTx, [snapshotWallet]);

    // Verify ClaimStatus created
    const claimStatus = await program.account.claimStatus.fetch(claimStatusPDA);
    expect(claimStatus.isClaimed).toBe(true);
    expect(claimStatus.claimedAmount.toString()).toBe(totalAmount.toString());
    expect(claimStatus.bonusBps).toBe(SPEED_BONUS_WEEK1_BPS); // Day 0 = week 1 bonus
    expect(claimStatus.withdrawnAmount.toString()).toBe(immediateAmount.toString());

    // Verify tokens were minted (immediate portion only)
    const accountInfo = await context.banksClient.getAccount(claimerATA);
    const tokenBalance = Buffer.from(accountInfo!.data).readBigUInt64LE(64);
    expect(tokenBalance.toString()).toBe(immediateAmount.toString());
  });

  it("applies +20% speed bonus in week 1", async () => {
    const { context, provider, program, payer } = await setupTest();
    const { globalState, mint, mintAuthority } = await initializeProtocol(program, payer);

    const snapshotWallet = Keypair.generate();
    const snapshotBalance = new BN("1000000000"); // 1 SOL
    const claimPeriodId = 1;

    const entries = [{ wallet: snapshotWallet.publicKey, amount: snapshotBalance, claimPeriodId }];
    const { tree, claimConfigPDA } = await setupClaimPeriod(program, payer, entries);

    // Advance 3 days (still in week 1)
    await advanceClock(context, BigInt(DEFAULT_SLOTS_PER_DAY.muln(3).toString()));

    const proof = getMerkleProof(tree, snapshotWallet.publicKey);
    const { bonusBps, totalAmount } = calculateSpeedBonus(snapshotBalance, 3);
    expect(bonusBps).toBe(SPEED_BONUS_WEEK1_BPS); // +20%

    // Fund and setup claimer
    const claimerATA = getAssociatedTokenAddressSync(mint, snapshotWallet.publicKey, false, TOKEN_2022_PROGRAM_ID);
    const fundTx = new Transaction();
    fundTx.add(SystemProgram.transfer({ fromPubkey: payer.publicKey, toPubkey: snapshotWallet.publicKey, lamports: 100_000_000 }));
    await program.provider.sendAndConfirm(fundTx, [payer]);

    const createAtaTx = new Transaction();
    createAtaTx.add(createAssociatedTokenAccountInstruction(snapshotWallet.publicKey, claimerATA, snapshotWallet.publicKey, mint, TOKEN_2022_PROGRAM_ID));
    await program.provider.sendAndConfirm(createAtaTx, [snapshotWallet]);

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

    const claimStatus = await program.account.claimStatus.fetch(claimStatusPDA);
    expect(claimStatus.bonusBps).toBe(SPEED_BONUS_WEEK1_BPS);
    expect(claimStatus.claimedAmount.toString()).toBe(totalAmount.toString());
  });

  it("applies +10% speed bonus in weeks 2-4", async () => {
    const { context, provider, program, payer } = await setupTest();
    const { globalState, mint, mintAuthority } = await initializeProtocol(program, payer);

    const snapshotWallet = Keypair.generate();
    const snapshotBalance = new BN("1000000000"); // 1 SOL
    const claimPeriodId = 1;

    const entries = [{ wallet: snapshotWallet.publicKey, amount: snapshotBalance, claimPeriodId }];
    const { tree, claimConfigPDA } = await setupClaimPeriod(program, payer, entries);

    // Advance 15 days (week 3 - should get +10% bonus)
    await advanceClock(context, BigInt(DEFAULT_SLOTS_PER_DAY.muln(15).toString()));

    const proof = getMerkleProof(tree, snapshotWallet.publicKey);
    const { bonusBps, totalAmount } = calculateSpeedBonus(snapshotBalance, 15);
    expect(bonusBps).toBe(SPEED_BONUS_WEEK2_4_BPS); // +10%

    // Setup claimer
    const claimerATA = getAssociatedTokenAddressSync(mint, snapshotWallet.publicKey, false, TOKEN_2022_PROGRAM_ID);
    const fundTx = new Transaction();
    fundTx.add(SystemProgram.transfer({ fromPubkey: payer.publicKey, toPubkey: snapshotWallet.publicKey, lamports: 100_000_000 }));
    await program.provider.sendAndConfirm(fundTx, [payer]);

    const createAtaTx = new Transaction();
    createAtaTx.add(createAssociatedTokenAccountInstruction(snapshotWallet.publicKey, claimerATA, snapshotWallet.publicKey, mint, TOKEN_2022_PROGRAM_ID));
    await program.provider.sendAndConfirm(createAtaTx, [snapshotWallet]);

    const ed25519Ix = createEd25519Instruction(snapshotWallet, snapshotBalance);
    const [claimStatusPDA] = findClaimStatusPDA(program.programId, tree.root, snapshotWallet.publicKey);

    const claimTx = new Transaction();
    claimTx.add(ed25519Ix);
    claimTx.add(await program.methods
      .freeClaim(snapshotBalance, proof.map(p => Array.from(p)))
      .accounts({
        claimer: snapshotWallet.publicKey, snapshotWallet: snapshotWallet.publicKey,
        globalState, claimConfig: claimConfigPDA, claimStatus: claimStatusPDA,
        claimerTokenAccount: claimerATA, mint, mintAuthority,
        instructionsSysvar: SYSVAR_INSTRUCTIONS_PUBKEY,
        tokenProgram: TOKEN_2022_PROGRAM_ID, systemProgram: SystemProgram.programId,
      }).instruction());

    await program.provider.sendAndConfirm(claimTx, [snapshotWallet]);

    const claimStatus = await program.account.claimStatus.fetch(claimStatusPDA);
    expect(claimStatus.bonusBps).toBe(SPEED_BONUS_WEEK2_4_BPS);
  });

  it("applies no bonus after day 28", async () => {
    const { context, provider, program, payer } = await setupTest();
    const { globalState, mint, mintAuthority } = await initializeProtocol(program, payer);

    const snapshotWallet = Keypair.generate();
    const snapshotBalance = new BN("1000000000");
    const claimPeriodId = 1;

    const entries = [{ wallet: snapshotWallet.publicKey, amount: snapshotBalance, claimPeriodId }];
    const { tree, claimConfigPDA } = await setupClaimPeriod(program, payer, entries);

    // Advance 50 days (past bonus period)
    await advanceClock(context, BigInt(DEFAULT_SLOTS_PER_DAY.muln(50).toString()));

    const proof = getMerkleProof(tree, snapshotWallet.publicKey);
    const { bonusBps, baseAmount, totalAmount } = calculateSpeedBonus(snapshotBalance, 50);
    expect(bonusBps).toBe(0); // No bonus
    expect(totalAmount.toString()).toBe(baseAmount.toString()); // Total = base

    // Setup claimer
    const claimerATA = getAssociatedTokenAddressSync(mint, snapshotWallet.publicKey, false, TOKEN_2022_PROGRAM_ID);
    const fundTx = new Transaction();
    fundTx.add(SystemProgram.transfer({ fromPubkey: payer.publicKey, toPubkey: snapshotWallet.publicKey, lamports: 100_000_000 }));
    await program.provider.sendAndConfirm(fundTx, [payer]);

    const createAtaTx = new Transaction();
    createAtaTx.add(createAssociatedTokenAccountInstruction(snapshotWallet.publicKey, claimerATA, snapshotWallet.publicKey, mint, TOKEN_2022_PROGRAM_ID));
    await program.provider.sendAndConfirm(createAtaTx, [snapshotWallet]);

    const ed25519Ix = createEd25519Instruction(snapshotWallet, snapshotBalance);
    const [claimStatusPDA] = findClaimStatusPDA(program.programId, tree.root, snapshotWallet.publicKey);

    const claimTx = new Transaction();
    claimTx.add(ed25519Ix);
    claimTx.add(await program.methods
      .freeClaim(snapshotBalance, proof.map(p => Array.from(p)))
      .accounts({
        claimer: snapshotWallet.publicKey, snapshotWallet: snapshotWallet.publicKey,
        globalState, claimConfig: claimConfigPDA, claimStatus: claimStatusPDA,
        claimerTokenAccount: claimerATA, mint, mintAuthority,
        instructionsSysvar: SYSVAR_INSTRUCTIONS_PUBKEY,
        tokenProgram: TOKEN_2022_PROGRAM_ID, systemProgram: SystemProgram.programId,
      }).instruction());

    await program.provider.sendAndConfirm(claimTx, [snapshotWallet]);

    const claimStatus = await program.account.claimStatus.fetch(claimStatusPDA);
    expect(claimStatus.bonusBps).toBe(0);
    expect(claimStatus.claimedAmount.toString()).toBe(baseAmount.toString());
  });

  it("splits tokens 10% immediate / 90% vesting", async () => {
    const { context, provider, program, payer } = await setupTest();
    const { globalState, mint, mintAuthority } = await initializeProtocol(program, payer);

    const snapshotWallet = Keypair.generate();
    const snapshotBalance = new BN("1000000000");
    const claimPeriodId = 1;

    const entries = [{ wallet: snapshotWallet.publicKey, amount: snapshotBalance, claimPeriodId }];
    const { tree, claimConfigPDA } = await setupClaimPeriod(program, payer, entries);

    const proof = getMerkleProof(tree, snapshotWallet.publicKey);
    const { totalAmount } = calculateSpeedBonus(snapshotBalance, 0);
    const immediateAmount = totalAmount.muln(IMMEDIATE_RELEASE_BPS).divn(BPS_SCALER);
    const vestingAmount = totalAmount.sub(immediateAmount);

    // Setup claimer
    const claimerATA = getAssociatedTokenAddressSync(mint, snapshotWallet.publicKey, false, TOKEN_2022_PROGRAM_ID);
    const fundTx = new Transaction();
    fundTx.add(SystemProgram.transfer({ fromPubkey: payer.publicKey, toPubkey: snapshotWallet.publicKey, lamports: 100_000_000 }));
    await program.provider.sendAndConfirm(fundTx, [payer]);

    const createAtaTx = new Transaction();
    createAtaTx.add(createAssociatedTokenAccountInstruction(snapshotWallet.publicKey, claimerATA, snapshotWallet.publicKey, mint, TOKEN_2022_PROGRAM_ID));
    await program.provider.sendAndConfirm(createAtaTx, [snapshotWallet]);

    const ed25519Ix = createEd25519Instruction(snapshotWallet, snapshotBalance);
    const [claimStatusPDA] = findClaimStatusPDA(program.programId, tree.root, snapshotWallet.publicKey);

    const claimTx = new Transaction();
    claimTx.add(ed25519Ix);
    claimTx.add(await program.methods
      .freeClaim(snapshotBalance, proof.map(p => Array.from(p)))
      .accounts({
        claimer: snapshotWallet.publicKey, snapshotWallet: snapshotWallet.publicKey,
        globalState, claimConfig: claimConfigPDA, claimStatus: claimStatusPDA,
        claimerTokenAccount: claimerATA, mint, mintAuthority,
        instructionsSysvar: SYSVAR_INSTRUCTIONS_PUBKEY,
        tokenProgram: TOKEN_2022_PROGRAM_ID, systemProgram: SystemProgram.programId,
      }).instruction());

    await program.provider.sendAndConfirm(claimTx, [snapshotWallet]);

    const claimStatus = await program.account.claimStatus.fetch(claimStatusPDA);
    // withdrawn_amount starts at immediate portion
    expect(claimStatus.withdrawnAmount.toString()).toBe(immediateAmount.toString());
    // claimedAmount = total (immediate + vesting)
    expect(claimStatus.claimedAmount.toString()).toBe(totalAmount.toString());
    // Verify 10/90 split
    expect(immediateAmount.muln(9).toString()).toBe(vestingAmount.toString());
  });

  it("rejects invalid merkle proof", async () => {
    const { context, provider, program, payer } = await setupTest();
    const { globalState, mint, mintAuthority } = await initializeProtocol(program, payer);

    const snapshotWallet = Keypair.generate();
    const wrongWallet = Keypair.generate();
    const snapshotBalance = new BN("1000000000");
    const claimPeriodId = 1;

    // Only include wrongWallet in the tree
    const entries = [{ wallet: wrongWallet.publicKey, amount: snapshotBalance, claimPeriodId }];
    const { tree, claimConfigPDA } = await setupClaimPeriod(program, payer, entries);

    // Try to use proof for wrongWallet but claim as snapshotWallet
    const proof = getMerkleProof(tree, wrongWallet.publicKey);

    // Setup claimer
    const claimerATA = getAssociatedTokenAddressSync(mint, snapshotWallet.publicKey, false, TOKEN_2022_PROGRAM_ID);
    const fundTx = new Transaction();
    fundTx.add(SystemProgram.transfer({ fromPubkey: payer.publicKey, toPubkey: snapshotWallet.publicKey, lamports: 100_000_000 }));
    await program.provider.sendAndConfirm(fundTx, [payer]);

    const createAtaTx = new Transaction();
    createAtaTx.add(createAssociatedTokenAccountInstruction(snapshotWallet.publicKey, claimerATA, snapshotWallet.publicKey, mint, TOKEN_2022_PROGRAM_ID));
    await program.provider.sendAndConfirm(createAtaTx, [snapshotWallet]);

    const ed25519Ix = createEd25519Instruction(snapshotWallet, snapshotBalance);
    const [claimStatusPDA] = findClaimStatusPDA(program.programId, tree.root, snapshotWallet.publicKey);

    const claimTx = new Transaction();
    claimTx.add(ed25519Ix);
    claimTx.add(await program.methods
      .freeClaim(snapshotBalance, proof.map(p => Array.from(p)))
      .accounts({
        claimer: snapshotWallet.publicKey, snapshotWallet: snapshotWallet.publicKey,
        globalState, claimConfig: claimConfigPDA, claimStatus: claimStatusPDA,
        claimerTokenAccount: claimerATA, mint, mintAuthority,
        instructionsSysvar: SYSVAR_INSTRUCTIONS_PUBKEY,
        tokenProgram: TOKEN_2022_PROGRAM_ID, systemProgram: SystemProgram.programId,
      }).instruction());

    try {
      await program.provider.sendAndConfirm(claimTx, [snapshotWallet]);
      throw new Error("Expected InvalidMerkleProof error");
    } catch (error: any) {
      expect(error.toString()).to.include("InvalidMerkleProof");
    }
  });

  it("rejects missing Ed25519 signature", async () => {
    const { context, provider, program, payer } = await setupTest();
    const { globalState, mint, mintAuthority } = await initializeProtocol(program, payer);

    const snapshotWallet = Keypair.generate();
    const snapshotBalance = new BN("1000000000");
    const claimPeriodId = 1;

    const entries = [{ wallet: snapshotWallet.publicKey, amount: snapshotBalance, claimPeriodId }];
    const { tree, claimConfigPDA } = await setupClaimPeriod(program, payer, entries);
    const proof = getMerkleProof(tree, snapshotWallet.publicKey);

    // Setup claimer
    const claimerATA = getAssociatedTokenAddressSync(mint, snapshotWallet.publicKey, false, TOKEN_2022_PROGRAM_ID);
    const fundTx = new Transaction();
    fundTx.add(SystemProgram.transfer({ fromPubkey: payer.publicKey, toPubkey: snapshotWallet.publicKey, lamports: 100_000_000 }));
    await program.provider.sendAndConfirm(fundTx, [payer]);

    const createAtaTx = new Transaction();
    createAtaTx.add(createAssociatedTokenAccountInstruction(snapshotWallet.publicKey, claimerATA, snapshotWallet.publicKey, mint, TOKEN_2022_PROGRAM_ID));
    await program.provider.sendAndConfirm(createAtaTx, [snapshotWallet]);

    // DO NOT add Ed25519 instruction - this should fail
    const [claimStatusPDA] = findClaimStatusPDA(program.programId, tree.root, snapshotWallet.publicKey);

    const claimTx = new Transaction();
    claimTx.add(await program.methods
      .freeClaim(snapshotBalance, proof.map(p => Array.from(p)))
      .accounts({
        claimer: snapshotWallet.publicKey, snapshotWallet: snapshotWallet.publicKey,
        globalState, claimConfig: claimConfigPDA, claimStatus: claimStatusPDA,
        claimerTokenAccount: claimerATA, mint, mintAuthority,
        instructionsSysvar: SYSVAR_INSTRUCTIONS_PUBKEY,
        tokenProgram: TOKEN_2022_PROGRAM_ID, systemProgram: SystemProgram.programId,
      }).instruction());

    try {
      await program.provider.sendAndConfirm(claimTx, [snapshotWallet]);
      throw new Error("Expected MissingEd25519Instruction error");
    } catch (error: any) {
      expect(error.toString()).to.include("MissingEd25519Instruction");
    }
  });

  it("rejects wrong signer", async () => {
    const { context, provider, program, payer } = await setupTest();
    const { globalState, mint, mintAuthority } = await initializeProtocol(program, payer);

    const snapshotWallet = Keypair.generate();
    const wrongSigner = Keypair.generate();
    const snapshotBalance = new BN("1000000000");
    const claimPeriodId = 1;

    const entries = [{ wallet: snapshotWallet.publicKey, amount: snapshotBalance, claimPeriodId }];
    const { tree, claimConfigPDA } = await setupClaimPeriod(program, payer, entries);
    const proof = getMerkleProof(tree, snapshotWallet.publicKey);

    // Fund wrong signer
    const fundTx = new Transaction();
    fundTx.add(SystemProgram.transfer({ fromPubkey: payer.publicKey, toPubkey: wrongSigner.publicKey, lamports: 100_000_000 }));
    await program.provider.sendAndConfirm(fundTx, [payer]);

    // Setup claimer ATA for wrong signer
    const claimerATA = getAssociatedTokenAddressSync(mint, wrongSigner.publicKey, false, TOKEN_2022_PROGRAM_ID);
    const createAtaTx = new Transaction();
    createAtaTx.add(createAssociatedTokenAccountInstruction(wrongSigner.publicKey, claimerATA, wrongSigner.publicKey, mint, TOKEN_2022_PROGRAM_ID));
    await program.provider.sendAndConfirm(createAtaTx, [wrongSigner]);

    // Sign with wrong signer (not snapshotWallet)
    const ed25519Ix = createEd25519Instruction(wrongSigner, snapshotBalance);
    const [claimStatusPDA] = findClaimStatusPDA(program.programId, tree.root, snapshotWallet.publicKey);

    const claimTx = new Transaction();
    claimTx.add(ed25519Ix);
    claimTx.add(await program.methods
      .freeClaim(snapshotBalance, proof.map(p => Array.from(p)))
      .accounts({
        claimer: wrongSigner.publicKey, snapshotWallet: snapshotWallet.publicKey,
        globalState, claimConfig: claimConfigPDA, claimStatus: claimStatusPDA,
        claimerTokenAccount: claimerATA, mint, mintAuthority,
        instructionsSysvar: SYSVAR_INSTRUCTIONS_PUBKEY,
        tokenProgram: TOKEN_2022_PROGRAM_ID, systemProgram: SystemProgram.programId,
      }).instruction());

    try {
      await program.provider.sendAndConfirm(claimTx, [wrongSigner]);
      throw new Error("Expected InvalidSignature error");
    } catch (error: any) {
      expect(error.toString()).to.include("Unauthorized");
    }
  });

  it("rejects double claim (same wallet)", async () => {
    const { context, provider, program, payer } = await setupTest();
    const { globalState, mint, mintAuthority } = await initializeProtocol(program, payer);

    const snapshotWallet = Keypair.generate();
    const snapshotBalance = new BN("1000000000");
    const claimPeriodId = 1;

    const entries = [{ wallet: snapshotWallet.publicKey, amount: snapshotBalance, claimPeriodId }];
    const { tree, claimConfigPDA } = await setupClaimPeriod(program, payer, entries);
    const proof = getMerkleProof(tree, snapshotWallet.publicKey);

    // Setup claimer
    const claimerATA = getAssociatedTokenAddressSync(mint, snapshotWallet.publicKey, false, TOKEN_2022_PROGRAM_ID);
    const fundTx = new Transaction();
    fundTx.add(SystemProgram.transfer({ fromPubkey: payer.publicKey, toPubkey: snapshotWallet.publicKey, lamports: 100_000_000 }));
    await program.provider.sendAndConfirm(fundTx, [payer]);

    const createAtaTx = new Transaction();
    createAtaTx.add(createAssociatedTokenAccountInstruction(snapshotWallet.publicKey, claimerATA, snapshotWallet.publicKey, mint, TOKEN_2022_PROGRAM_ID));
    await program.provider.sendAndConfirm(createAtaTx, [snapshotWallet]);

    const [claimStatusPDA] = findClaimStatusPDA(program.programId, tree.root, snapshotWallet.publicKey);

    // First claim succeeds
    const ed25519Ix1 = createEd25519Instruction(snapshotWallet, snapshotBalance);
    const claimTx1 = new Transaction();
    claimTx1.add(ed25519Ix1);
    claimTx1.add(await program.methods
      .freeClaim(snapshotBalance, proof.map(p => Array.from(p)))
      .accounts({
        claimer: snapshotWallet.publicKey, snapshotWallet: snapshotWallet.publicKey,
        globalState, claimConfig: claimConfigPDA, claimStatus: claimStatusPDA,
        claimerTokenAccount: claimerATA, mint, mintAuthority,
        instructionsSysvar: SYSVAR_INSTRUCTIONS_PUBKEY,
        tokenProgram: TOKEN_2022_PROGRAM_ID, systemProgram: SystemProgram.programId,
      }).instruction());
    await program.provider.sendAndConfirm(claimTx1, [snapshotWallet]);

    // Second claim should fail (ClaimStatus PDA already exists)
    const ed25519Ix2 = createEd25519Instruction(snapshotWallet, snapshotBalance);
    const claimTx2 = new Transaction();
    claimTx2.add(ed25519Ix2);
    claimTx2.add(await program.methods
      .freeClaim(snapshotBalance, proof.map(p => Array.from(p)))
      .accounts({
        claimer: snapshotWallet.publicKey, snapshotWallet: snapshotWallet.publicKey,
        globalState, claimConfig: claimConfigPDA, claimStatus: claimStatusPDA,
        claimerTokenAccount: claimerATA, mint, mintAuthority,
        instructionsSysvar: SYSVAR_INSTRUCTIONS_PUBKEY,
        tokenProgram: TOKEN_2022_PROGRAM_ID, systemProgram: SystemProgram.programId,
      }).instruction());

    try {
      await program.provider.sendAndConfirm(claimTx2, [snapshotWallet]);
      throw new Error("Expected error for double claim");
    } catch (error: any) {
      // Account already exists - Anchor throws constraint error
      expect(error.toString().toLowerCase()).to.satisfy((msg: string) =>
        msg.includes("already in use") ||
        msg.includes("constraint") ||
        msg.includes("0x0") ||
        msg.includes("already been processed") ||
        msg.includes("account already exists")
      );
    }
  });

  it("rejects claim after period ends", async () => {
    const { context, provider, program, payer } = await setupTest();
    const { globalState, mint, mintAuthority } = await initializeProtocol(program, payer);

    const snapshotWallet = Keypair.generate();
    const snapshotBalance = new BN("1000000000");
    const claimPeriodId = 1;

    const entries = [{ wallet: snapshotWallet.publicKey, amount: snapshotBalance, claimPeriodId }];
    const { tree, claimConfigPDA } = await setupClaimPeriod(program, payer, entries);
    const proof = getMerkleProof(tree, snapshotWallet.publicKey);

    // Advance past end slot (180 days + 1)
    await advanceClock(context, BigInt(DEFAULT_SLOTS_PER_DAY.muln(181).toString()));

    // Setup claimer
    const claimerATA = getAssociatedTokenAddressSync(mint, snapshotWallet.publicKey, false, TOKEN_2022_PROGRAM_ID);
    const fundTx = new Transaction();
    fundTx.add(SystemProgram.transfer({ fromPubkey: payer.publicKey, toPubkey: snapshotWallet.publicKey, lamports: 100_000_000 }));
    await program.provider.sendAndConfirm(fundTx, [payer]);

    const createAtaTx = new Transaction();
    createAtaTx.add(createAssociatedTokenAccountInstruction(snapshotWallet.publicKey, claimerATA, snapshotWallet.publicKey, mint, TOKEN_2022_PROGRAM_ID));
    await program.provider.sendAndConfirm(createAtaTx, [snapshotWallet]);

    const ed25519Ix = createEd25519Instruction(snapshotWallet, snapshotBalance);
    const [claimStatusPDA] = findClaimStatusPDA(program.programId, tree.root, snapshotWallet.publicKey);

    const claimTx = new Transaction();
    claimTx.add(ed25519Ix);
    claimTx.add(await program.methods
      .freeClaim(snapshotBalance, proof.map(p => Array.from(p)))
      .accounts({
        claimer: snapshotWallet.publicKey, snapshotWallet: snapshotWallet.publicKey,
        globalState, claimConfig: claimConfigPDA, claimStatus: claimStatusPDA,
        claimerTokenAccount: claimerATA, mint, mintAuthority,
        instructionsSysvar: SYSVAR_INSTRUCTIONS_PUBKEY,
        tokenProgram: TOKEN_2022_PROGRAM_ID, systemProgram: SystemProgram.programId,
      }).instruction());

    try {
      await program.provider.sendAndConfirm(claimTx, [snapshotWallet]);
      throw new Error("Expected ClaimPeriodEnded error");
    } catch (error: any) {
      expect(error.toString()).to.include("ClaimPeriodEnded");
    }
  });

  it("rejects claim before period starts", async () => {
    const { context, provider, program, payer } = await setupTest();
    const { globalState, mint, mintAuthority } = await initializeProtocol(program, payer);

    const snapshotWallet = Keypair.generate();
    const snapshotBalance = new BN("1000000000");
    const claimPeriodId = 1;

    // Build tree but DON'T initialize claim period
    const entries = [{ wallet: snapshotWallet.publicKey, amount: snapshotBalance, claimPeriodId }];
    const tree = buildMerkleTree(entries);
    const proof = getMerkleProof(tree, snapshotWallet.publicKey);

    const [claimConfigPDA] = findClaimConfigPDA(program.programId);
    const [claimStatusPDA] = findClaimStatusPDA(program.programId, tree.root, snapshotWallet.publicKey);

    // Setup claimer
    const claimerATA = getAssociatedTokenAddressSync(mint, snapshotWallet.publicKey, false, TOKEN_2022_PROGRAM_ID);
    const fundTx = new Transaction();
    fundTx.add(SystemProgram.transfer({ fromPubkey: payer.publicKey, toPubkey: snapshotWallet.publicKey, lamports: 100_000_000 }));
    await program.provider.sendAndConfirm(fundTx, [payer]);

    const createAtaTx = new Transaction();
    createAtaTx.add(createAssociatedTokenAccountInstruction(snapshotWallet.publicKey, claimerATA, snapshotWallet.publicKey, mint, TOKEN_2022_PROGRAM_ID));
    await program.provider.sendAndConfirm(createAtaTx, [snapshotWallet]);

    const ed25519Ix = createEd25519Instruction(snapshotWallet, snapshotBalance);

    const claimTx = new Transaction();
    claimTx.add(ed25519Ix);
    claimTx.add(await program.methods
      .freeClaim(snapshotBalance, proof.map(p => Array.from(p)))
      .accounts({
        claimer: snapshotWallet.publicKey, snapshotWallet: snapshotWallet.publicKey,
        globalState, claimConfig: claimConfigPDA, claimStatus: claimStatusPDA,
        claimerTokenAccount: claimerATA, mint, mintAuthority,
        instructionsSysvar: SYSVAR_INSTRUCTIONS_PUBKEY,
        tokenProgram: TOKEN_2022_PROGRAM_ID, systemProgram: SystemProgram.programId,
      }).instruction());

    try {
      await program.provider.sendAndConfirm(claimTx, [snapshotWallet]);
      throw new Error("Expected error for claim before period starts");
    } catch (error: any) {
      // ClaimConfig doesn't exist, so should fail
      expect(error.toString().toLowerCase()).to.satisfy((msg: string) =>
        msg.includes("claimperiodnotstarted") ||
        msg.includes("account not found") ||
        msg.includes("accountnotinitialized") ||
        msg.includes("not initialized")
      );
    }
  });

  it("rejects snapshot balance below minimum", async () => {
    const { context, provider, program, payer } = await setupTest();
    const { globalState, mint, mintAuthority } = await initializeProtocol(program, payer);

    const snapshotWallet = Keypair.generate();
    // 0.05 SOL = 50_000_000 lamports (below 0.1 SOL minimum)
    const snapshotBalance = new BN("50000000");
    const claimPeriodId = 1;

    const entries = [{ wallet: snapshotWallet.publicKey, amount: snapshotBalance, claimPeriodId }];
    const { tree, claimConfigPDA } = await setupClaimPeriod(program, payer, entries);
    const proof = getMerkleProof(tree, snapshotWallet.publicKey);

    // Setup claimer
    const claimerATA = getAssociatedTokenAddressSync(mint, snapshotWallet.publicKey, false, TOKEN_2022_PROGRAM_ID);
    const fundTx = new Transaction();
    fundTx.add(SystemProgram.transfer({ fromPubkey: payer.publicKey, toPubkey: snapshotWallet.publicKey, lamports: 100_000_000 }));
    await program.provider.sendAndConfirm(fundTx, [payer]);

    const createAtaTx = new Transaction();
    createAtaTx.add(createAssociatedTokenAccountInstruction(snapshotWallet.publicKey, claimerATA, snapshotWallet.publicKey, mint, TOKEN_2022_PROGRAM_ID));
    await program.provider.sendAndConfirm(createAtaTx, [snapshotWallet]);

    const ed25519Ix = createEd25519Instruction(snapshotWallet, snapshotBalance);
    const [claimStatusPDA] = findClaimStatusPDA(program.programId, tree.root, snapshotWallet.publicKey);

    const claimTx = new Transaction();
    claimTx.add(ed25519Ix);
    claimTx.add(await program.methods
      .freeClaim(snapshotBalance, proof.map(p => Array.from(p)))
      .accounts({
        claimer: snapshotWallet.publicKey, snapshotWallet: snapshotWallet.publicKey,
        globalState, claimConfig: claimConfigPDA, claimStatus: claimStatusPDA,
        claimerTokenAccount: claimerATA, mint, mintAuthority,
        instructionsSysvar: SYSVAR_INSTRUCTIONS_PUBKEY,
        tokenProgram: TOKEN_2022_PROGRAM_ID, systemProgram: SystemProgram.programId,
      }).instruction());

    try {
      await program.provider.sendAndConfirm(claimTx, [snapshotWallet]);
      throw new Error("Expected SnapshotBalanceTooLow error");
    } catch (error: any) {
      expect(error.toString()).to.include("SnapshotBalanceTooLow");
    }
  });

  it("applies +20% bonus on day 7 (last day of week 1)", async () => {
    const { context, provider, program, payer } = await setupTest();
    const { globalState, mint, mintAuthority } = await initializeProtocol(program, payer);

    const snapshotWallet = Keypair.generate();
    const snapshotBalance = new BN("1000000000");
    const claimPeriodId = 1;

    const entries = [{ wallet: snapshotWallet.publicKey, amount: snapshotBalance, claimPeriodId }];
    const { tree, claimConfigPDA } = await setupClaimPeriod(program, payer, entries);

    // Advance exactly 7 days (still in week 1 bonus period)
    await advanceClock(context, BigInt(DEFAULT_SLOTS_PER_DAY.muln(7).toString()));

    const proof = getMerkleProof(tree, snapshotWallet.publicKey);
    const { bonusBps } = calculateSpeedBonus(snapshotBalance, 7);
    expect(bonusBps).toBe(SPEED_BONUS_WEEK1_BPS); // Still +20%

    // Setup claimer
    const claimerATA = getAssociatedTokenAddressSync(mint, snapshotWallet.publicKey, false, TOKEN_2022_PROGRAM_ID);
    const fundTx = new Transaction();
    fundTx.add(SystemProgram.transfer({ fromPubkey: payer.publicKey, toPubkey: snapshotWallet.publicKey, lamports: 100_000_000 }));
    await program.provider.sendAndConfirm(fundTx, [payer]);

    const createAtaTx = new Transaction();
    createAtaTx.add(createAssociatedTokenAccountInstruction(snapshotWallet.publicKey, claimerATA, snapshotWallet.publicKey, mint, TOKEN_2022_PROGRAM_ID));
    await program.provider.sendAndConfirm(createAtaTx, [snapshotWallet]);

    const ed25519Ix = createEd25519Instruction(snapshotWallet, snapshotBalance);
    const [claimStatusPDA] = findClaimStatusPDA(program.programId, tree.root, snapshotWallet.publicKey);

    const claimTx = new Transaction();
    claimTx.add(ed25519Ix);
    claimTx.add(await program.methods
      .freeClaim(snapshotBalance, proof.map(p => Array.from(p)))
      .accounts({
        claimer: snapshotWallet.publicKey, snapshotWallet: snapshotWallet.publicKey,
        globalState, claimConfig: claimConfigPDA, claimStatus: claimStatusPDA,
        claimerTokenAccount: claimerATA, mint, mintAuthority,
        instructionsSysvar: SYSVAR_INSTRUCTIONS_PUBKEY,
        tokenProgram: TOKEN_2022_PROGRAM_ID, systemProgram: SystemProgram.programId,
      }).instruction());

    await program.provider.sendAndConfirm(claimTx, [snapshotWallet]);

    const claimStatus = await program.account.claimStatus.fetch(claimStatusPDA);
    expect(claimStatus.bonusBps).toBe(SPEED_BONUS_WEEK1_BPS);
  });

  it("applies +10% bonus on day 28 (last day of bonus period)", async () => {
    const { context, provider, program, payer } = await setupTest();
    const { globalState, mint, mintAuthority } = await initializeProtocol(program, payer);

    const snapshotWallet = Keypair.generate();
    const snapshotBalance = new BN("1000000000");
    const claimPeriodId = 1;

    const entries = [{ wallet: snapshotWallet.publicKey, amount: snapshotBalance, claimPeriodId }];
    const { tree, claimConfigPDA } = await setupClaimPeriod(program, payer, entries);

    // Advance exactly 28 days (last day of +10% bonus)
    await advanceClock(context, BigInt(DEFAULT_SLOTS_PER_DAY.muln(28).toString()));

    const proof = getMerkleProof(tree, snapshotWallet.publicKey);
    const { bonusBps } = calculateSpeedBonus(snapshotBalance, 28);
    expect(bonusBps).toBe(SPEED_BONUS_WEEK2_4_BPS); // Still +10%

    // Setup claimer
    const claimerATA = getAssociatedTokenAddressSync(mint, snapshotWallet.publicKey, false, TOKEN_2022_PROGRAM_ID);
    const fundTx = new Transaction();
    fundTx.add(SystemProgram.transfer({ fromPubkey: payer.publicKey, toPubkey: snapshotWallet.publicKey, lamports: 100_000_000 }));
    await program.provider.sendAndConfirm(fundTx, [payer]);

    const createAtaTx = new Transaction();
    createAtaTx.add(createAssociatedTokenAccountInstruction(snapshotWallet.publicKey, claimerATA, snapshotWallet.publicKey, mint, TOKEN_2022_PROGRAM_ID));
    await program.provider.sendAndConfirm(createAtaTx, [snapshotWallet]);

    const ed25519Ix = createEd25519Instruction(snapshotWallet, snapshotBalance);
    const [claimStatusPDA] = findClaimStatusPDA(program.programId, tree.root, snapshotWallet.publicKey);

    const claimTx = new Transaction();
    claimTx.add(ed25519Ix);
    claimTx.add(await program.methods
      .freeClaim(snapshotBalance, proof.map(p => Array.from(p)))
      .accounts({
        claimer: snapshotWallet.publicKey, snapshotWallet: snapshotWallet.publicKey,
        globalState, claimConfig: claimConfigPDA, claimStatus: claimStatusPDA,
        claimerTokenAccount: claimerATA, mint, mintAuthority,
        instructionsSysvar: SYSVAR_INSTRUCTIONS_PUBKEY,
        tokenProgram: TOKEN_2022_PROGRAM_ID, systemProgram: SystemProgram.programId,
      }).instruction());

    await program.provider.sendAndConfirm(claimTx, [snapshotWallet]);

    const claimStatus = await program.account.claimStatus.fetch(claimStatusPDA);
    expect(claimStatus.bonusBps).toBe(SPEED_BONUS_WEEK2_4_BPS);
  });
});
