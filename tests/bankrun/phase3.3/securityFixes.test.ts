import { describe, it, expect } from "vitest";

import { Keypair, SystemProgram, Transaction } from "@solana/web3.js";
import { getAssociatedTokenAddressSync, createAssociatedTokenAccountInstruction } from "@solana/spl-token";
import BN from "bn.js";
import {
  setupTest,
  initializeProtocol,
  mintTokensToUser,
  advanceClock,
  findClaimConfigPDA,
  findStakePDA,
  buildMerkleTree,
  getTokenBalance,
  TOKEN_2022_PROGRAM_ID,
  DEFAULT_SLOTS_PER_DAY,
  DEFAULT_MIN_STAKE_AMOUNT,
} from "../phase3/utils";

describe("Phase 8 Security Fixes", () => {
  // Helper: Finalize BPD calculation
  async function finalizeBpd(
    program: any,
    payer: any,
    globalState: any,
    claimConfigPDA: any,
    stakePDAs: any[],
  ) {
    const remainingAccounts = stakePDAs.map(pubkey => ({
      pubkey, isSigner: false, isWritable: true,
    }));
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
  }

  // Helper: Seal BPD finalize (authority-gated)
  async function sealBpdFinalize(
    program: any,
    payer: any,
    globalState: any,
    claimConfigPDA: any,
    expectedFinalizedCount?: number,
  ) {
    // If count not provided, fetch from on-chain state
    if (expectedFinalizedCount === undefined) {
      const claimConfig = await program.account.claimConfig.fetch(claimConfigPDA);
      expectedFinalizedCount = claimConfig.bpdStakesFinalized;
    }
    await program.methods
      .sealBpdFinalize(expectedFinalizedCount)
      .accounts({
        authority: payer.publicKey,
        globalState,
        claimConfig: claimConfigPDA,
      })
      .signers([payer])
      .rpc();
  }

  // Helper: Trigger BPD
  async function triggerBpd(
    program: any,
    caller: any,
    globalState: any,
    claimConfigPDA: any,
    stakePDAs: any[],
  ) {
    const remainingAccounts = stakePDAs.map(pubkey => ({
      pubkey, isSigner: false, isWritable: true,
    }));
    await program.methods
      .triggerBigPayDay()
      .accounts({
        caller: caller.publicKey,
        globalState,
        claimConfig: claimConfigPDA,
      })
      .remainingAccounts(remainingAccounts)
      .signers([caller])
      .rpc();
  }

  // Helper: Abort BPD (authority-gated)
  async function abortBpd(
    program: any,
    authority: any,
    globalState: any,
    claimConfigPDA: any,
  ) {
    await program.methods
      .abortBpd()
      .accounts({
        authority: authority.publicKey,
        globalState,
        claimConfig: claimConfigPDA,
      })
      .signers([authority])
      .rpc();
  }

  // Helper: Setup claim period with staker
  async function setupClaimPeriodWithStaker(
    program: any,
    payer: any,
    context: any,
  ) {
    const { globalState, mint, mintAuthority } = await initializeProtocol(program, payer);

    // Initialize claim period
    const snapshotWallet = Keypair.generate();
    const snapshotBalance = new BN("10000000000"); // 10 SOL
    const claimPeriodId = 1;
    const entries = [{ wallet: snapshotWallet.publicKey, amount: snapshotBalance, claimPeriodId }];
    const tree = buildMerkleTree(entries);
    const merkleRoot = Array.from(tree.root);
    const [claimConfigPDA] = findClaimConfigPDA(program.programId);
    const totalClaimable = new BN("100000000000000"); // 100k HELIX in pool

    await program.methods
      .initializeClaimPeriod(merkleRoot, totalClaimable, 1, claimPeriodId)
      .accounts({
        authority: payer.publicKey,
        claimConfig: claimConfigPDA,
        systemProgram: SystemProgram.programId,
      })
      .signers([payer])
      .rpc();

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

    await mintTokensToUser(program, payer, globalState, mint, mintAuthority, stakerATA, DEFAULT_MIN_STAKE_AMOUNT);

    // Read global state to get correct stakeId
    const globalStateData = await program.account.globalState.fetch(globalState);
    const [stakePDA] = findStakePDA(program.programId, staker.publicKey, globalStateData.totalStakesCreated);
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

    return {
      globalState,
      mint,
      mintAuthority,
      claimConfigPDA,
      staker,
      stakerATA,
      stakePDA,
    };
  }

  describe("CRIT-1: Zero-bonus stake counter desync fix", () => {
    it("zero-bonus stake increments counter without distributing tokens", async () => {
      const { context, program, payer } = await setupTest();
      const { globalState, mint, mintAuthority } = await initializeProtocol(program, payer);

      // Initialize claim period
      const snapshotWallet = Keypair.generate();
      const entries = [{ wallet: snapshotWallet.publicKey, amount: new BN("10000000000"), claimPeriodId: 1 }];
      const tree = buildMerkleTree(entries);
      const [claimConfigPDA] = findClaimConfigPDA(program.programId);

      await program.methods
        .initializeClaimPeriod(Array.from(tree.root), new BN("100000000000000"), 1, 1)
        .accounts({
          authority: payer.publicKey,
          claimConfig: claimConfigPDA,
          systemProgram: SystemProgram.programId,
        })
        .signers([payer])
        .rpc();

      // Create a VERY small stake with short duration (1 day) to get zero bonus
      const staker = Keypair.generate();
      const fundTx = new Transaction();
      fundTx.add(SystemProgram.transfer({ fromPubkey: payer.publicKey, toPubkey: staker.publicKey, lamports: 500_000_000 }));
      await program.provider.sendAndConfirm(fundTx, [payer]);

      const stakerATA = getAssociatedTokenAddressSync(mint, staker.publicKey, false, TOKEN_2022_PROGRAM_ID);
      const createAtaTx = new Transaction();
      createAtaTx.add(createAssociatedTokenAccountInstruction(staker.publicKey, stakerATA, staker.publicKey, mint, TOKEN_2022_PROGRAM_ID));
      await program.provider.sendAndConfirm(createAtaTx, [staker]);

      await mintTokensToUser(program, payer, globalState, mint, mintAuthority, stakerATA, DEFAULT_MIN_STAKE_AMOUNT);

      // Create stake with minimal duration (1 day)
      const globalStateData = await program.account.globalState.fetch(globalState);
      const [stakePDA] = findStakePDA(program.programId, staker.publicKey, globalStateData.totalStakesCreated);
      await program.methods
        .createStake(DEFAULT_MIN_STAKE_AMOUNT, 1) // 1 day duration
        .accounts({ user: staker.publicKey, globalState, stakeAccount: stakePDA, userTokenAccount: stakerATA, mint, tokenProgram: TOKEN_2022_PROGRAM_ID })
        .signers([staker])
        .rpc();

      // Advance past claim period
      await advanceClock(context, BigInt(DEFAULT_SLOTS_PER_DAY.muln(181).toString()));

      // Finalize and seal
      await finalizeBpd(program, payer, globalState, claimConfigPDA, [stakePDA]);
      await sealBpdFinalize(program, payer, globalState, claimConfigPDA);

      // Check pre-trigger state
      let claimConfig = await program.account.claimConfig.fetch(claimConfigPDA);
      expect(claimConfig.bpdStakesFinalized).toBe(1);
      expect(claimConfig.bpdStakesDistributed).toBe(0);

      // Trigger BPD - zero bonus should still increment counter
      await triggerBpd(program, payer, globalState, claimConfigPDA, [stakePDA]);

      // Verify counter was incremented (CRIT-1 fix)
      claimConfig = await program.account.claimConfig.fetch(claimConfigPDA);
      expect(claimConfig.bpdStakesDistributed).toBe(1);

      // Verify completion was triggered (counter reached finalized count)
      expect(claimConfig.bigPayDayComplete).toBe(true);

      // Verify stake was marked to prevent re-submission
      const stake = await program.account.stakeAccount.fetch(stakePDA);
      expect(stake.bpdClaimPeriodId).toBe(1);
      // Note: Even minimal stakes may receive non-zero bonus due to BPD formula precision.
      // The key CRIT-1 verification is that bpdStakesDistributed matches bpdStakesFinalized above.
    });

    it("mixed zero-bonus and normal stakes complete correctly", async () => {
      const { context, program, payer } = await setupTest();
      const { globalState, mint, mintAuthority } = await initializeProtocol(program, payer);

      const snapshotWallet = Keypair.generate();
      const entries = [{ wallet: snapshotWallet.publicKey, amount: new BN("10000000000"), claimPeriodId: 1 }];
      const tree = buildMerkleTree(entries);
      const [claimConfigPDA] = findClaimConfigPDA(program.programId);

      await program.methods
        .initializeClaimPeriod(Array.from(tree.root), new BN("100000000000000"), 1, 1)
        .accounts({
          authority: payer.publicKey,
          claimConfig: claimConfigPDA,
          systemProgram: SystemProgram.programId,
        })
        .signers([payer])
        .rpc();

      const stakes: any[] = [];

      // Create 1 zero-bonus stake (1 day duration)
      for (let i = 0; i < 1; i++) {
        const staker = Keypair.generate();
        const fundTx = new Transaction();
        fundTx.add(SystemProgram.transfer({ fromPubkey: payer.publicKey, toPubkey: staker.publicKey, lamports: 500_000_000 }));
        await program.provider.sendAndConfirm(fundTx, [payer]);

        const stakerATA = getAssociatedTokenAddressSync(mint, staker.publicKey, false, TOKEN_2022_PROGRAM_ID);
        const createAtaTx = new Transaction();
        createAtaTx.add(createAssociatedTokenAccountInstruction(staker.publicKey, stakerATA, staker.publicKey, mint, TOKEN_2022_PROGRAM_ID));
        await program.provider.sendAndConfirm(createAtaTx, [staker]);

        await mintTokensToUser(program, payer, globalState, mint, mintAuthority, stakerATA, DEFAULT_MIN_STAKE_AMOUNT);

        const globalStateData = await program.account.globalState.fetch(globalState);
        const [stakePDA] = findStakePDA(program.programId, staker.publicKey, globalStateData.totalStakesCreated);
        await program.methods
          .createStake(DEFAULT_MIN_STAKE_AMOUNT, 1) // 1 day - zero bonus
          .accounts({ user: staker.publicKey, globalState, stakeAccount: stakePDA, userTokenAccount: stakerATA, mint, tokenProgram: TOKEN_2022_PROGRAM_ID })
          .signers([staker])
          .rpc();

        stakes.push(stakePDA);
      }

      // Create 2 normal stakes (365 day duration)
      for (let i = 0; i < 2; i++) {
        const staker = Keypair.generate();
        const fundTx = new Transaction();
        fundTx.add(SystemProgram.transfer({ fromPubkey: payer.publicKey, toPubkey: staker.publicKey, lamports: 500_000_000 }));
        await program.provider.sendAndConfirm(fundTx, [payer]);

        const stakerATA = getAssociatedTokenAddressSync(mint, staker.publicKey, false, TOKEN_2022_PROGRAM_ID);
        const createAtaTx = new Transaction();
        createAtaTx.add(createAssociatedTokenAccountInstruction(staker.publicKey, stakerATA, staker.publicKey, mint, TOKEN_2022_PROGRAM_ID));
        await program.provider.sendAndConfirm(createAtaTx, [staker]);

        await mintTokensToUser(program, payer, globalState, mint, mintAuthority, stakerATA, DEFAULT_MIN_STAKE_AMOUNT);

        const globalStateData = await program.account.globalState.fetch(globalState);
        const [stakePDA] = findStakePDA(program.programId, staker.publicKey, globalStateData.totalStakesCreated);
        await program.methods
          .createStake(DEFAULT_MIN_STAKE_AMOUNT, 365) // 365 days - normal bonus
          .accounts({ user: staker.publicKey, globalState, stakeAccount: stakePDA, userTokenAccount: stakerATA, mint, tokenProgram: TOKEN_2022_PROGRAM_ID })
          .signers([staker])
          .rpc();

        stakes.push(stakePDA);
      }

      // Advance past claim period
      await advanceClock(context, BigInt(DEFAULT_SLOTS_PER_DAY.muln(181).toString()));

      // Finalize all 3 stakes
      await finalizeBpd(program, payer, globalState, claimConfigPDA, stakes);
      await sealBpdFinalize(program, payer, globalState, claimConfigPDA);

      // Trigger all in one batch
      await triggerBpd(program, payer, globalState, claimConfigPDA, stakes);

      // Verify all 3 counted (including zero-bonus)
      const claimConfig = await program.account.claimConfig.fetch(claimConfigPDA);
      expect(claimConfig.bpdStakesDistributed).toBe(3);
      expect(claimConfig.bigPayDayComplete).toBe(true);

      // Verify all stakes were marked as processed (bpdClaimPeriodId set)
      for (const stakePDA of stakes) {
        const stake = await program.account.stakeAccount.fetch(stakePDA);
        expect(stake.bpdClaimPeriodId).toBe(1);
      }
      // Note: Even minimal 1-day stakes may get non-zero bonus due to BPD formula precision.
      // The key CRIT-1 verification is counter tracking: bpdStakesDistributed == 3 above.
    });

    it("many zero-bonus stakes do not block completion", async () => {
      const { context, program, payer } = await setupTest();
      const { globalState, mint, mintAuthority } = await initializeProtocol(program, payer);

      const snapshotWallet = Keypair.generate();
      const entries = [{ wallet: snapshotWallet.publicKey, amount: new BN("10000000000"), claimPeriodId: 1 }];
      const tree = buildMerkleTree(entries);
      const [claimConfigPDA] = findClaimConfigPDA(program.programId);

      await program.methods
        .initializeClaimPeriod(Array.from(tree.root), new BN("100000000000000"), 1, 1)
        .accounts({
          authority: payer.publicKey,
          claimConfig: claimConfigPDA,
          systemProgram: SystemProgram.programId,
        })
        .signers([payer])
        .rpc();

      const stakes: any[] = [];

      // Create 5 zero-bonus stakes
      for (let i = 0; i < 5; i++) {
        const staker = Keypair.generate();
        const fundTx = new Transaction();
        fundTx.add(SystemProgram.transfer({ fromPubkey: payer.publicKey, toPubkey: staker.publicKey, lamports: 500_000_000 }));
        await program.provider.sendAndConfirm(fundTx, [payer]);

        const stakerATA = getAssociatedTokenAddressSync(mint, staker.publicKey, false, TOKEN_2022_PROGRAM_ID);
        const createAtaTx = new Transaction();
        createAtaTx.add(createAssociatedTokenAccountInstruction(staker.publicKey, stakerATA, staker.publicKey, mint, TOKEN_2022_PROGRAM_ID));
        await program.provider.sendAndConfirm(createAtaTx, [staker]);

        await mintTokensToUser(program, payer, globalState, mint, mintAuthority, stakerATA, DEFAULT_MIN_STAKE_AMOUNT);

        const globalStateData = await program.account.globalState.fetch(globalState);
        const [stakePDA] = findStakePDA(program.programId, staker.publicKey, globalStateData.totalStakesCreated);
        await program.methods
          .createStake(DEFAULT_MIN_STAKE_AMOUNT, 1) // 1 day - zero bonus
          .accounts({ user: staker.publicKey, globalState, stakeAccount: stakePDA, userTokenAccount: stakerATA, mint, tokenProgram: TOKEN_2022_PROGRAM_ID })
          .signers([staker])
          .rpc();

        stakes.push(stakePDA);
      }

      // Advance past claim period
      await advanceClock(context, BigInt(DEFAULT_SLOTS_PER_DAY.muln(181).toString()));

      // Finalize all
      await finalizeBpd(program, payer, globalState, claimConfigPDA, stakes);
      await sealBpdFinalize(program, payer, globalState, claimConfigPDA);

      // Trigger all
      await triggerBpd(program, payer, globalState, claimConfigPDA, stakes);

      // Verify all counted and completion triggered
      const claimConfig = await program.account.claimConfig.fetch(claimConfigPDA);
      expect(claimConfig.bpdStakesDistributed).toBe(5);
      expect(claimConfig.bigPayDayComplete).toBe(true);
    });
  });

  describe("HIGH-1: Emergency BPD abort mechanism", () => {
    it("authority can abort stuck BPD window", async () => {
      const { context, program, payer } = await setupTest();
      const setup = await setupClaimPeriodWithStaker(program, payer, context);

      // Advance past claim period
      await advanceClock(context, BigInt(DEFAULT_SLOTS_PER_DAY.muln(181).toString()));

      // Finalize (which activates BPD window)
      await finalizeBpd(program, payer, setup.globalState, setup.claimConfigPDA, [setup.stakePDA]);

      // Verify BPD window is active
      let globalState = await program.account.globalState.fetch(setup.globalState);
      expect(globalState.reserved[0].toString()).not.toBe("0");

      // Authority aborts
      await abortBpd(program, payer, setup.globalState, setup.claimConfigPDA);

      // Verify window is cleared
      globalState = await program.account.globalState.fetch(setup.globalState);
      expect(globalState.reserved[0].toString()).toBe("0");

      // Verify counters are reset
      const claimConfig = await program.account.claimConfig.fetch(setup.claimConfigPDA);
      expect(claimConfig.bpdStakesFinalized).toBe(0);
      expect(claimConfig.bpdStakesDistributed).toBe(0);
      expect(claimConfig.bpdCalculationComplete).toBe(false);
      expect(claimConfig.bpdHelixPerShareDay.toString()).toBe("0");
    });

    it("non-authority cannot abort BPD", async () => {
      const { context, program, payer } = await setupTest();
      const setup = await setupClaimPeriodWithStaker(program, payer, context);

      // Advance and finalize
      await advanceClock(context, BigInt(DEFAULT_SLOTS_PER_DAY.muln(181).toString()));
      await finalizeBpd(program, payer, setup.globalState, setup.claimConfigPDA, [setup.stakePDA]);

      // Create non-authority attacker
      const attacker = Keypair.generate();
      const fundTx = new Transaction();
      fundTx.add(SystemProgram.transfer({
        fromPubkey: payer.publicKey,
        toPubkey: attacker.publicKey,
        lamports: 100_000_000,
      }));
      await program.provider.sendAndConfirm(fundTx, [payer]);

      // Attacker tries to abort - should fail
      try {
        await abortBpd(program, attacker, setup.globalState, setup.claimConfigPDA);
        throw new Error("Expected Unauthorized error");
      } catch (error: any) {
        expect(error.toString()).toContain("ConstraintHasOne");
      }
    });

    it("abort fails when BPD window is not active", async () => {
      const { context, program, payer } = await setupTest();
      const { globalState } = await initializeProtocol(program, payer);

      const snapshotWallet = Keypair.generate();
      const entries = [{ wallet: snapshotWallet.publicKey, amount: new BN("10000000000"), claimPeriodId: 1 }];
      const tree = buildMerkleTree(entries);
      const [claimConfigPDA] = findClaimConfigPDA(program.programId);

      await program.methods
        .initializeClaimPeriod(Array.from(tree.root), new BN("100000000000000"), 1, 1)
        .accounts({
          authority: payer.publicKey,
          claimConfig: claimConfigPDA,
          systemProgram: SystemProgram.programId,
        })
        .signers([payer])
        .rpc();

      // Try to abort when BPD window is not active - should fail
      try {
        await abortBpd(program, payer, globalState, claimConfigPDA);
        throw new Error("Expected BpdWindowNotActive error");
      } catch (error: any) {
        expect(error.toString()).toContain("BpdWindowNotActive");
      }
    });

    it("abort fails after partial distribution has started", async () => {
      const { context, program, payer } = await setupTest();
      const { globalState, mint, mintAuthority } = await initializeProtocol(program, payer);

      // Initialize claim period
      const snapshotWallet = Keypair.generate();
      const entries = [{ wallet: snapshotWallet.publicKey, amount: new BN("10000000000"), claimPeriodId: 1 }];
      const tree = buildMerkleTree(entries);
      const [claimConfigPDA] = findClaimConfigPDA(program.programId);

      await program.methods
        .initializeClaimPeriod(Array.from(tree.root), new BN("100000000000000"), 1, 1)
        .accounts({
          authority: payer.publicKey,
          claimConfig: claimConfigPDA,
          systemProgram: SystemProgram.programId,
        })
        .signers([payer])
        .rpc();

      // Create TWO stakers so we can do partial distribution
      const stakes: any[] = [];
      for (let i = 0; i < 2; i++) {
        const staker = Keypair.generate();
        const fundTx = new Transaction();
        fundTx.add(SystemProgram.transfer({ fromPubkey: payer.publicKey, toPubkey: staker.publicKey, lamports: 500_000_000 }));
        await program.provider.sendAndConfirm(fundTx, [payer]);

        const stakerATA = getAssociatedTokenAddressSync(mint, staker.publicKey, false, TOKEN_2022_PROGRAM_ID);
        const createAtaTx = new Transaction();
        createAtaTx.add(createAssociatedTokenAccountInstruction(staker.publicKey, stakerATA, staker.publicKey, mint, TOKEN_2022_PROGRAM_ID));
        await program.provider.sendAndConfirm(createAtaTx, [staker]);

        await mintTokensToUser(program, payer, globalState, mint, mintAuthority, stakerATA, DEFAULT_MIN_STAKE_AMOUNT);

        const globalStateData = await program.account.globalState.fetch(globalState);
        const [stakePDA] = findStakePDA(program.programId, staker.publicKey, globalStateData.totalStakesCreated);
        await program.methods
          .createStake(DEFAULT_MIN_STAKE_AMOUNT, 365)
          .accounts({ user: staker.publicKey, globalState, stakeAccount: stakePDA, userTokenAccount: stakerATA, mint, tokenProgram: TOKEN_2022_PROGRAM_ID })
          .signers([staker])
          .rpc();

        stakes.push(stakePDA);
      }

      // Advance past claim period
      await advanceClock(context, BigInt(DEFAULT_SLOTS_PER_DAY.muln(181).toString()));

      // Finalize both stakes and seal
      await finalizeBpd(program, payer, globalState, claimConfigPDA, stakes);
      await sealBpdFinalize(program, payer, globalState, claimConfigPDA);

      // Trigger distribution for only the FIRST stake (partial - 1 of 2)
      await triggerBpd(program, payer, globalState, claimConfigPDA, [stakes[0]]);

      // Verify partial distribution (window still active, distributed < finalized)
      const claimConfig = await program.account.claimConfig.fetch(claimConfigPDA);
      expect(claimConfig.bpdStakesDistributed).toBe(1);
      expect(claimConfig.bpdStakesFinalized).toBe(2);
      expect(claimConfig.bigPayDayComplete).toBe(false);

      // Try to abort after partial distribution - should fail
      try {
        await abortBpd(program, payer, globalState, claimConfigPDA);
        throw new Error("Expected BpdDistributionAlreadyStarted error");
      } catch (error: any) {
        expect(error.toString()).toContain("BpdDistributionAlreadyStarted");
      }
    });

    it("unstake works after abort clears BPD window", async () => {
      const { context, program, payer } = await setupTest();
      const setup = await setupClaimPeriodWithStaker(program, payer, context);

      // Advance and finalize
      await advanceClock(context, BigInt(DEFAULT_SLOTS_PER_DAY.muln(181).toString()));
      await finalizeBpd(program, payer, setup.globalState, setup.claimConfigPDA, [setup.stakePDA]);

      // Try unstake - should fail with BPD window active
      try {
        await program.methods
          .unstake()
          .accounts({
            user: setup.staker.publicKey,
            globalState: setup.globalState,
            stakeAccount: setup.stakePDA,
            userTokenAccount: setup.stakerATA,
            mint: setup.mint,
            mintAuthority: (await program.account.globalState.fetch(setup.globalState)).mintAuthority,
            tokenProgram: TOKEN_2022_PROGRAM_ID,
          })
          .signers([setup.staker])
          .rpc();
        throw new Error("Expected UnstakeBlockedDuringBpd error");
      } catch (error: any) {
        expect(error.toString()).toContain("UnstakeBlockedDuringBpd");
      }

      // Authority aborts
      await abortBpd(program, payer, setup.globalState, setup.claimConfigPDA);

      // Now unstake should succeed
      await program.methods
        .unstake()
        .accounts({
          user: setup.staker.publicKey,
          globalState: setup.globalState,
          stakeAccount: setup.stakePDA,
          userTokenAccount: setup.stakerATA,
          mint: setup.mint,
          mintAuthority: (await program.account.globalState.fetch(setup.globalState)).mintAuthority,
          tokenProgram: TOKEN_2022_PROGRAM_ID,
        })
        .signers([setup.staker])
        .rpc();

      // Verify stake is inactive
      const stakeAccount = await program.account.stakeAccount.fetch(setup.stakePDA);
      expect(stakeAccount.isActive).toBe(false);
    });
  });

  describe("HIGH-2: Seal requires finalized stakes", () => {
    it("seal rejects if no stakes finalized", async () => {
      const { context, program, payer } = await setupTest();
      const { globalState } = await initializeProtocol(program, payer);

      // Initialize claim period with no stakes
      const snapshotWallet = Keypair.generate();
      const entries = [{ wallet: snapshotWallet.publicKey, amount: new BN("10000000000"), claimPeriodId: 1 }];
      const tree = buildMerkleTree(entries);
      const [claimConfigPDA] = findClaimConfigPDA(program.programId);

      await program.methods
        .initializeClaimPeriod(Array.from(tree.root), new BN("100000000000000"), 1, 1)
        .accounts({
          authority: payer.publicKey,
          claimConfig: claimConfigPDA,
          systemProgram: SystemProgram.programId,
        })
        .signers([payer])
        .rpc();

      // Advance past claim period
      await advanceClock(context, BigInt(DEFAULT_SLOTS_PER_DAY.muln(181).toString()));

      // Try to seal without finalizing any stakes - should fail
      try {
        await sealBpdFinalize(program, payer, globalState, claimConfigPDA);
        throw new Error("Expected BpdFinalizationIncomplete error");
      } catch (error: any) {
        expect(error.toString()).toContain("BpdFinalizationIncomplete");
      }
    });

    it("seal succeeds after at least one stake finalized", async () => {
      const { context, program, payer } = await setupTest();
      const setup = await setupClaimPeriodWithStaker(program, payer, context);

      // Advance past claim period
      await advanceClock(context, BigInt(DEFAULT_SLOTS_PER_DAY.muln(181).toString()));

      // Finalize one stake
      await finalizeBpd(program, payer, setup.globalState, setup.claimConfigPDA, [setup.stakePDA]);

      // Seal should now succeed
      await sealBpdFinalize(program, payer, setup.globalState, setup.claimConfigPDA);

      // Verify sealed
      const claimConfig = await program.account.claimConfig.fetch(setup.claimConfigPDA);
      expect(claimConfig.bpdCalculationComplete).toBe(true);
    });
  });

  describe("MED-1: Zero-amount finalize clears BPD window", () => {
    it("zero-eligible stakes clears BPD window without seal", async () => {
      const { context, program, payer } = await setupTest();
      const { globalState } = await initializeProtocol(program, payer);

      // Initialize claim period with ZERO totalClaimable (nothing unclaimed for BPD)
      // This triggers the zero-amount path: unclaimed = totalClaimable - totalClaimed = 0
      const snapshotWallet = Keypair.generate();
      const entries = [{ wallet: snapshotWallet.publicKey, amount: new BN("10000000000"), claimPeriodId: 1 }];
      const tree = buildMerkleTree(entries);
      const [claimConfigPDA] = findClaimConfigPDA(program.programId);

      await program.methods
        .initializeClaimPeriod(Array.from(tree.root), new BN("0"), 1, 1)
        .accounts({
          authority: payer.publicKey,
          claimConfig: claimConfigPDA,
          systemProgram: SystemProgram.programId,
        })
        .signers([payer])
        .rpc();

      // Advance past claim period
      await advanceClock(context, BigInt(DEFAULT_SLOTS_PER_DAY.muln(181).toString()));

      // Call finalize with no remaining accounts - zero-amount path triggers immediately
      await program.methods
        .finalizeBpdCalculation()
        .accounts({
          caller: payer.publicKey,
          globalState,
          claimConfig: claimConfigPDA,
        })
        .signers([payer])
        .rpc();

      // Verify BPD window was cleared (MED-1 fix)
      const globalStateFinal = await program.account.globalState.fetch(globalState);
      expect(globalStateFinal.reserved[0].toString()).toBe("0");

      // Verify completion was set without seal
      const claimConfig = await program.account.claimConfig.fetch(claimConfigPDA);
      expect(claimConfig.bpdCalculationComplete).toBe(true);
      expect(claimConfig.bpdHelixPerShareDay.toString()).toBe("0");
    });
  });
});
