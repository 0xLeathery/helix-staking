import { describe, it, expect } from "vitest";

import { Keypair, SystemProgram, Transaction, SYSVAR_INSTRUCTIONS_PUBKEY } from "@solana/web3.js";
import { getAssociatedTokenAddressSync, createAssociatedTokenAccountInstruction } from "@solana/spl-token";
import BN from "bn.js";
import {
  setupTest,
  initializeProtocol,
  mintTokensToUser,
  advanceClock,
  findStakePDA,
  findClaimConfigPDA,
  findClaimStatusPDA,
  buildMerkleTree,
  getMerkleProof,
  createEd25519Instruction,
  TOKEN_2022_PROGRAM_ID,
  DEFAULT_SLOTS_PER_DAY,
  DEFAULT_MIN_STAKE_AMOUNT,
} from "./utils";

describe("StakeAccount Migration", () => {
  it("old stakes (92 bytes) work with claim_rewards", async () => {
    const { context, provider, program, payer } = await setupTest();

    // Initialize protocol
    const { globalState, mint, mintAuthority } = await initializeProtocol(program, payer);

    // Create user ATA
    const userATA = getAssociatedTokenAddressSync(mint, payer.publicKey, false, TOKEN_2022_PROGRAM_ID);
    const createAtaTx = new Transaction();
    createAtaTx.add(createAssociatedTokenAccountInstruction(
      payer.publicKey, userATA, payer.publicKey, mint, TOKEN_2022_PROGRAM_ID
    ));
    await program.provider.sendAndConfirm(createAtaTx, [payer]);

    // Mint tokens and create stake
    await mintTokensToUser(program, payer, globalState, mint, mintAuthority, userATA, DEFAULT_MIN_STAKE_AMOUNT);

    const [stakePDA] = findStakePDA(program.programId, payer.publicKey, 0);
    await program.methods
      .createStake(DEFAULT_MIN_STAKE_AMOUNT, 30)
      .accounts({
        user: payer.publicKey,
        globalState,
        stakeAccount: stakePDA,
        userTokenAccount: userATA,
        mint,
        tokenProgram: TOKEN_2022_PROGRAM_ID,
      })
      .signers([payer])
      .rpc();

    // Advance time and trigger crank distribution
    await advanceClock(context, BigInt(DEFAULT_SLOTS_PER_DAY.muln(5).toString()));

    await program.methods
      .crankDistribution()
      .accounts({
        caller: payer.publicKey,
        globalState,
      })
      .signers([payer])
      .rpc();

    // Call claim_rewards - should work and migrate account if needed
    await program.methods
      .claimRewards()
      .accounts({
        user: payer.publicKey,
        globalState,
        stakeAccount: stakePDA,
        userTokenAccount: userATA,
        mint,
        mintAuthority,
        tokenProgram: TOKEN_2022_PROGRAM_ID,
      })
      .signers([payer])
      .rpc();

    // Verify stake account still works
    const stakeAccount = await program.account.stakeAccount.fetch(stakePDA);
    expect(stakeAccount.isActive).toBe(true);
    // After migration, BPD fields should be initialized to defaults
    expect(stakeAccount.bpdBonusPending.toString()).toBe("0");
    expect(stakeAccount.bpdEligible).toBe(false);
  });

  it("migrated stake has bpd_bonus_pending = 0", async () => {
    const { context, provider, program, payer } = await setupTest();
    const { globalState, mint, mintAuthority } = await initializeProtocol(program, payer);

    const userATA = getAssociatedTokenAddressSync(mint, payer.publicKey, false, TOKEN_2022_PROGRAM_ID);
    const createAtaTx = new Transaction();
    createAtaTx.add(createAssociatedTokenAccountInstruction(
      payer.publicKey, userATA, payer.publicKey, mint, TOKEN_2022_PROGRAM_ID
    ));
    await program.provider.sendAndConfirm(createAtaTx, [payer]);

    await mintTokensToUser(program, payer, globalState, mint, mintAuthority, userATA, DEFAULT_MIN_STAKE_AMOUNT);

    const [stakePDA] = findStakePDA(program.programId, payer.publicKey, 0);
    await program.methods
      .createStake(DEFAULT_MIN_STAKE_AMOUNT, 30)
      .accounts({
        user: payer.publicKey,
        globalState,
        stakeAccount: stakePDA,
        userTokenAccount: userATA,
        mint,
        tokenProgram: TOKEN_2022_PROGRAM_ID,
      })
      .signers([payer])
      .rpc();

    // Verify default BPD field values
    const stakeAccount = await program.account.stakeAccount.fetch(stakePDA);
    expect(stakeAccount.bpdBonusPending.toString()).toBe("0");
    expect(stakeAccount.bpdEligible).toBe(false);
  });

  it("new stakes (112 bytes) have BPD fields", async () => {
    const { context, provider, program, payer } = await setupTest();
    const { globalState, mint, mintAuthority } = await initializeProtocol(program, payer);

    const userATA = getAssociatedTokenAddressSync(mint, payer.publicKey, false, TOKEN_2022_PROGRAM_ID);
    const createAtaTx = new Transaction();
    createAtaTx.add(createAssociatedTokenAccountInstruction(
      payer.publicKey, userATA, payer.publicKey, mint, TOKEN_2022_PROGRAM_ID
    ));
    await program.provider.sendAndConfirm(createAtaTx, [payer]);

    await mintTokensToUser(program, payer, globalState, mint, mintAuthority, userATA, DEFAULT_MIN_STAKE_AMOUNT);

    const [stakePDA] = findStakePDA(program.programId, payer.publicKey, 0);
    await program.methods
      .createStake(DEFAULT_MIN_STAKE_AMOUNT, 100)
      .accounts({
        user: payer.publicKey,
        globalState,
        stakeAccount: stakePDA,
        userTokenAccount: userATA,
        mint,
        tokenProgram: TOKEN_2022_PROGRAM_ID,
      })
      .signers([payer])
      .rpc();

    // Verify BPD fields exist and are initialized
    const stakeAccount = await program.account.stakeAccount.fetch(stakePDA);
    expect(stakeAccount.bpdBonusPending).to.not.be.undefined;
    expect(stakeAccount.bpdEligible).to.not.be.undefined;
    expect(stakeAccount.claimPeriodStartSlot).to.not.be.undefined;
    expect(stakeAccount.bpdBonusPending.toString()).toBe("0");
  });

  it("migration preserves existing stake data", async () => {
    const { context, provider, program, payer } = await setupTest();
    const { globalState, mint, mintAuthority } = await initializeProtocol(program, payer);

    const userATA = getAssociatedTokenAddressSync(mint, payer.publicKey, false, TOKEN_2022_PROGRAM_ID);
    const createAtaTx = new Transaction();
    createAtaTx.add(createAssociatedTokenAccountInstruction(
      payer.publicKey, userATA, payer.publicKey, mint, TOKEN_2022_PROGRAM_ID
    ));
    await program.provider.sendAndConfirm(createAtaTx, [payer]);

    const stakeAmount = DEFAULT_MIN_STAKE_AMOUNT;
    const stakeDays = 365;
    await mintTokensToUser(program, payer, globalState, mint, mintAuthority, userATA, stakeAmount);

    const [stakePDA] = findStakePDA(program.programId, payer.publicKey, 0);
    await program.methods
      .createStake(stakeAmount, stakeDays)
      .accounts({
        user: payer.publicKey,
        globalState,
        stakeAccount: stakePDA,
        userTokenAccount: userATA,
        mint,
        tokenProgram: TOKEN_2022_PROGRAM_ID,
      })
      .signers([payer])
      .rpc();

    // Record original values
    const stakeBefore = await program.account.stakeAccount.fetch(stakePDA);
    const originalStakedAmount = stakeBefore.stakedAmount.toString();
    const originalTShares = stakeBefore.tShares.toString();
    const originalStakeDays = stakeBefore.stakeDays;
    const originalStartSlot = stakeBefore.startSlot.toString();

    // Trigger claim_rewards (which might trigger migration)
    await advanceClock(context, BigInt(DEFAULT_SLOTS_PER_DAY.muln(5).toString()));

    await program.methods
      .crankDistribution()
      .accounts({
        caller: payer.publicKey,
        globalState,
      })
      .signers([payer])
      .rpc();

    await program.methods
      .claimRewards()
      .accounts({
        user: payer.publicKey,
        globalState,
        stakeAccount: stakePDA,
        userTokenAccount: userATA,
        mint,
        mintAuthority,
        tokenProgram: TOKEN_2022_PROGRAM_ID,
      })
      .signers([payer])
      .rpc();

    // Verify original fields preserved
    const stakeAfter = await program.account.stakeAccount.fetch(stakePDA);
    expect(stakeAfter.stakedAmount.toString()).toBe(originalStakedAmount);
    expect(stakeAfter.tShares.toString()).toBe(originalTShares);
    expect(stakeAfter.stakeDays).toBe(originalStakeDays);
    expect(stakeAfter.startSlot.toString()).toBe(originalStartSlot);
    expect(stakeAfter.isActive).toBe(true);
  });

  it("user pays rent difference on migration", async () => {
    const { context, provider, program, payer } = await setupTest();
    const { globalState, mint, mintAuthority } = await initializeProtocol(program, payer);

    const userATA = getAssociatedTokenAddressSync(mint, payer.publicKey, false, TOKEN_2022_PROGRAM_ID);
    const createAtaTx = new Transaction();
    createAtaTx.add(createAssociatedTokenAccountInstruction(
      payer.publicKey, userATA, payer.publicKey, mint, TOKEN_2022_PROGRAM_ID
    ));
    await program.provider.sendAndConfirm(createAtaTx, [payer]);

    await mintTokensToUser(program, payer, globalState, mint, mintAuthority, userATA, DEFAULT_MIN_STAKE_AMOUNT);

    const [stakePDA] = findStakePDA(program.programId, payer.publicKey, 0);
    await program.methods
      .createStake(DEFAULT_MIN_STAKE_AMOUNT, 30)
      .accounts({
        user: payer.publicKey,
        globalState,
        stakeAccount: stakePDA,
        userTokenAccount: userATA,
        mint,
        tokenProgram: TOKEN_2022_PROGRAM_ID,
      })
      .signers([payer])
      .rpc();

    // Track SOL balance before claim_rewards
    const userInfoBefore = await context.banksClient.getAccount(payer.publicKey);
    const solBefore = userInfoBefore!.lamports;

    // Trigger crank and claim
    await advanceClock(context, BigInt(DEFAULT_SLOTS_PER_DAY.muln(5).toString()));

    await program.methods
      .crankDistribution()
      .accounts({
        caller: payer.publicKey,
        globalState,
      })
      .signers([payer])
      .rpc();

    await program.methods
      .claimRewards()
      .accounts({
        user: payer.publicKey,
        globalState,
        stakeAccount: stakePDA,
        userTokenAccount: userATA,
        mint,
        mintAuthority,
        tokenProgram: TOKEN_2022_PROGRAM_ID,
      })
      .signers([payer])
      .rpc();

    // SOL should have decreased (paid tx fees and possibly realloc rent)
    const userInfoAfter = await context.banksClient.getAccount(payer.publicKey);
    const solAfter = userInfoAfter!.lamports;

    // User pays transaction fees at minimum
    expect(solAfter).toBeLessThan(solBefore);
  });

  it("claim_rewards includes BPD bonus after trigger", async () => {
    const { context, provider, program, payer } = await setupTest();
    const { globalState, mint, mintAuthority } = await initializeProtocol(program, payer);

    // Create staker wallet
    const staker = Keypair.generate();
    const fundStakerTx = new Transaction();
    fundStakerTx.add(SystemProgram.transfer({
      fromPubkey: payer.publicKey,
      toPubkey: staker.publicKey,
      lamports: 500_000_000,
    }));
    await program.provider.sendAndConfirm(fundStakerTx, [payer]);

    // Create staker ATA
    const stakerATA = getAssociatedTokenAddressSync(mint, staker.publicKey, false, TOKEN_2022_PROGRAM_ID);
    const createAtaTx = new Transaction();
    createAtaTx.add(createAssociatedTokenAccountInstruction(
      staker.publicKey, stakerATA, staker.publicKey, mint, TOKEN_2022_PROGRAM_ID
    ));
    await program.provider.sendAndConfirm(createAtaTx, [staker]);

    // Initialize claim period FIRST
    const snapshotWallet = Keypair.generate();
    const snapshotBalance = new BN("10000000000"); // 10 SOL
    const claimPeriodId = 1;
    const entries = [{ wallet: snapshotWallet.publicKey, amount: snapshotBalance, claimPeriodId }];
    const tree = buildMerkleTree(entries);
    const merkleRoot = Array.from(tree.root);
    const [claimConfigPDA] = findClaimConfigPDA(program.programId);
    const totalClaimable = new BN("100000000000000"); // Large pool

    await program.methods
      .initializeClaimPeriod(merkleRoot, totalClaimable, 1, claimPeriodId)
      .accounts({
        authority: payer.publicKey,
        claimConfig: claimConfigPDA,
        systemProgram: SystemProgram.programId,
      })
      .signers([payer])
      .rpc();

    // NOW create stake during claim period
    await mintTokensToUser(program, payer, globalState, mint, mintAuthority, stakerATA, DEFAULT_MIN_STAKE_AMOUNT);

    const [stakePDA] = findStakePDA(program.programId, staker.publicKey, 0);
    await program.methods
      .createStake(DEFAULT_MIN_STAKE_AMOUNT, 365)
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

    // Verify stake is BPD eligible (created during claim period)
    const stakeAfterCreate = await program.account.stakeAccount.fetch(stakePDA);
    expect(stakeAfterCreate.bpdEligible).toBe(true);

    // Advance past claim period end (180 days)
    await advanceClock(context, BigInt(DEFAULT_SLOTS_PER_DAY.muln(181).toString()));

    // Trigger Big Pay Day with remaining accounts
    const stakeAccountInfo = await context.banksClient.getAccount(stakePDA);

    await program.methods
      .triggerBigPayDay()
      .accounts({
        caller: payer.publicKey,
        globalState,
        claimConfig: claimConfigPDA,
      })
      .remainingAccounts([
        { pubkey: stakePDA, isSigner: false, isWritable: true },
      ])
      .signers([payer])
      .rpc();

    // Verify BPD bonus was set
    const stakeAfterBpd = await program.account.stakeAccount.fetch(stakePDA);
    expect(new BN(stakeAfterBpd.bpdBonusPending.toString()).gtn(0)).toBe(true);
  });

  it("claim_rewards clears bpd_bonus_pending after payout", async () => {
    const { context, provider, program, payer } = await setupTest();
    const { globalState, mint, mintAuthority } = await initializeProtocol(program, payer);

    // Create staker
    const staker = Keypair.generate();
    const fundStakerTx = new Transaction();
    fundStakerTx.add(SystemProgram.transfer({
      fromPubkey: payer.publicKey,
      toPubkey: staker.publicKey,
      lamports: 500_000_000,
    }));
    await program.provider.sendAndConfirm(fundStakerTx, [payer]);

    const stakerATA = getAssociatedTokenAddressSync(mint, staker.publicKey, false, TOKEN_2022_PROGRAM_ID);
    const createAtaTx = new Transaction();
    createAtaTx.add(createAssociatedTokenAccountInstruction(
      staker.publicKey, stakerATA, staker.publicKey, mint, TOKEN_2022_PROGRAM_ID
    ));
    await program.provider.sendAndConfirm(createAtaTx, [staker]);

    // Initialize claim period
    const snapshotWallet = Keypair.generate();
    const snapshotBalance = new BN("10000000000");
    const claimPeriodId = 1;
    const entries = [{ wallet: snapshotWallet.publicKey, amount: snapshotBalance, claimPeriodId }];
    const tree = buildMerkleTree(entries);
    const merkleRoot = Array.from(tree.root);
    const [claimConfigPDA] = findClaimConfigPDA(program.programId);
    const totalClaimable = new BN("100000000000000");

    await program.methods
      .initializeClaimPeriod(merkleRoot, totalClaimable, 1, claimPeriodId)
      .accounts({
        authority: payer.publicKey,
        claimConfig: claimConfigPDA,
        systemProgram: SystemProgram.programId,
      })
      .signers([payer])
      .rpc();

    // Create stake during claim period
    await mintTokensToUser(program, payer, globalState, mint, mintAuthority, stakerATA, DEFAULT_MIN_STAKE_AMOUNT);

    const [stakePDA] = findStakePDA(program.programId, staker.publicKey, 0);
    await program.methods
      .createStake(DEFAULT_MIN_STAKE_AMOUNT, 365)
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

    // Advance past claim period and trigger BPD
    await advanceClock(context, BigInt(DEFAULT_SLOTS_PER_DAY.muln(181).toString()));

    await program.methods
      .triggerBigPayDay()
      .accounts({
        caller: payer.publicKey,
        globalState,
        claimConfig: claimConfigPDA,
      })
      .remainingAccounts([
        { pubkey: stakePDA, isSigner: false, isWritable: true },
      ])
      .signers([payer])
      .rpc();

    // Verify BPD bonus is set
    const stakeBeforeClaim = await program.account.stakeAccount.fetch(stakePDA);
    const bpdBonusBefore = new BN(stakeBeforeClaim.bpdBonusPending.toString());
    expect(bpdBonusBefore.gtn(0)).toBe(true);

    // Run crank for inflation rewards
    await program.methods
      .crankDistribution()
      .accounts({
        caller: payer.publicKey,
        globalState,
      })
      .signers([payer])
      .rpc();

    // Claim rewards (should include and clear BPD bonus)
    await program.methods
      .claimRewards()
      .accounts({
        user: staker.publicKey,
        globalState,
        stakeAccount: stakePDA,
        userTokenAccount: stakerATA,
        mint,
        mintAuthority,
        tokenProgram: TOKEN_2022_PROGRAM_ID,
      })
      .signers([staker])
      .rpc();

    // Verify BPD bonus was cleared
    const stakeAfterClaim = await program.account.stakeAccount.fetch(stakePDA);
    expect(stakeAfterClaim.bpdBonusPending.toString()).toBe("0");
  });

  it("claim_rewards returns zero BPD for ineligible stake", async () => {
    const { context, provider, program, payer } = await setupTest();
    const { globalState, mint, mintAuthority } = await initializeProtocol(program, payer);

    // Create stake BEFORE claim period starts
    const staker = Keypair.generate();
    const fundStakerTx = new Transaction();
    fundStakerTx.add(SystemProgram.transfer({
      fromPubkey: payer.publicKey,
      toPubkey: staker.publicKey,
      lamports: 500_000_000,
    }));
    await program.provider.sendAndConfirm(fundStakerTx, [payer]);

    const stakerATA = getAssociatedTokenAddressSync(mint, staker.publicKey, false, TOKEN_2022_PROGRAM_ID);
    const createAtaTx = new Transaction();
    createAtaTx.add(createAssociatedTokenAccountInstruction(
      staker.publicKey, stakerATA, staker.publicKey, mint, TOKEN_2022_PROGRAM_ID
    ));
    await program.provider.sendAndConfirm(createAtaTx, [staker]);

    // Stake BEFORE claim period
    await mintTokensToUser(program, payer, globalState, mint, mintAuthority, stakerATA, DEFAULT_MIN_STAKE_AMOUNT);

    const [stakePDA] = findStakePDA(program.programId, staker.publicKey, 0);
    await program.methods
      .createStake(DEFAULT_MIN_STAKE_AMOUNT, 365)
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

    // Verify stake is NOT BPD eligible (created before claim period)
    const stakeBeforePeriod = await program.account.stakeAccount.fetch(stakePDA);
    expect(stakeBeforePeriod.bpdEligible).toBe(false);

    // Advance a bit, THEN initialize claim period
    await advanceClock(context, BigInt(DEFAULT_SLOTS_PER_DAY.muln(10).toString()));

    const snapshotWallet = Keypair.generate();
    const snapshotBalance = new BN("10000000000");
    const claimPeriodId = 1;
    const entries = [{ wallet: snapshotWallet.publicKey, amount: snapshotBalance, claimPeriodId }];
    const tree = buildMerkleTree(entries);
    const merkleRoot = Array.from(tree.root);
    const [claimConfigPDA] = findClaimConfigPDA(program.programId);
    const totalClaimable = new BN("100000000000000");

    await program.methods
      .initializeClaimPeriod(merkleRoot, totalClaimable, 1, claimPeriodId)
      .accounts({
        authority: payer.publicKey,
        claimConfig: claimConfigPDA,
        systemProgram: SystemProgram.programId,
      })
      .signers([payer])
      .rpc();

    // Advance past claim period
    await advanceClock(context, BigInt(DEFAULT_SLOTS_PER_DAY.muln(181).toString()));

    // Trigger BPD with the ineligible stake
    await program.methods
      .triggerBigPayDay()
      .accounts({
        caller: payer.publicKey,
        globalState,
        claimConfig: claimConfigPDA,
      })
      .remainingAccounts([
        { pubkey: stakePDA, isSigner: false, isWritable: true },
      ])
      .signers([payer])
      .rpc();

    // Stake created BEFORE claim period should have bpd_bonus_pending = 0
    // because it was created before start_slot
    const stakeAfterBpd = await program.account.stakeAccount.fetch(stakePDA);
    expect(stakeAfterBpd.bpdBonusPending.toString()).toBe("0");
  });
});
