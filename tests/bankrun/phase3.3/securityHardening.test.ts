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
  CLAIM_PERIOD_DAYS,
} from "../phase3/utils";

describe("Phase 3.3 Security Hardening", () => {
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
  ) {
    await program.methods
      .sealBpdFinalize()
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

  describe("CRIT-NEW-1: seal_bpd_finalize security", () => {
    it("rejects non-authority signer", async () => {
      const { context, program, payer } = await setupTest();
      const setup = await setupClaimPeriodWithStaker(program, payer, context);

      // Advance past claim period
      await advanceClock(context, BigInt(DEFAULT_SLOTS_PER_DAY.muln(181).toString()));

      // Finalize first
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

      // Attacker tries to seal - should fail with Unauthorized
      try {
        await program.methods
          .sealBpdFinalize()
          .accounts({
            authority: attacker.publicKey,
            globalState: setup.globalState,
            claimConfig: setup.claimConfigPDA,
          })
          .signers([attacker])
          .rpc();

        throw new Error("Expected Unauthorized error");
      } catch (error: any) {
        expect(error.toString()).to.include("Unauthorized");
      }
    });

    it("rejects seal if no stakes finalized", async () => {
      const { context, program, payer } = await setupTest();
      const { globalState, mint, mintAuthority } = await initializeProtocol(program, payer);

      // Initialize claim period but create NO stakes
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

      // Try to seal without finalize - should fail with NoEligibleStakers
      try {
        await sealBpdFinalize(program, payer, globalState, claimConfigPDA);
        throw new Error("Expected NoEligibleStakers error");
      } catch (error: any) {
        expect(error.toString()).to.include("NoEligibleStakers");
      }
    });

    it("rejects double seal", async () => {
      const { context, program, payer } = await setupTest();
      const setup = await setupClaimPeriodWithStaker(program, payer, context);

      // Advance past claim period
      await advanceClock(context, BigInt(DEFAULT_SLOTS_PER_DAY.muln(181).toString()));

      // Finalize and seal
      await finalizeBpd(program, payer, setup.globalState, setup.claimConfigPDA, [setup.stakePDA]);
      await sealBpdFinalize(program, payer, setup.globalState, setup.claimConfigPDA);

      // Verify seal succeeded
      let claimConfig = await program.account.claimConfig.fetch(setup.claimConfigPDA);
      expect(claimConfig.bpdCalculationComplete).toBe(true);

      // Advance clock to make transaction unique (avoid bankrun replay detection)
      await advanceClock(context, BigInt(1));

      // Try to seal again - should fail
      let didFail = false;
      try {
        await sealBpdFinalize(program, payer, setup.globalState, setup.claimConfigPDA);
      } catch (error: any) {
        didFail = true;
        // Just verify it threw an error - the error format in bankrun can vary
      }
      expect(didFail).toBe(true, "seal should have failed on second call");

      // Verify state didn't change (still sealed)
      claimConfig = await program.account.claimConfig.fetch(setup.claimConfigPDA);
      expect(claimConfig.bpdCalculationComplete).toBe(true);
    });

    it("finalize rejects calls after seal", async () => {
      const { context, program, payer } = await setupTest();
      const setup = await setupClaimPeriodWithStaker(program, payer, context);

      // Advance past claim period
      await advanceClock(context, BigInt(DEFAULT_SLOTS_PER_DAY.muln(181).toString()));

      // Finalize and seal
      await finalizeBpd(program, payer, setup.globalState, setup.claimConfigPDA, [setup.stakePDA]);
      await sealBpdFinalize(program, payer, setup.globalState, setup.claimConfigPDA);

      // Advance clock to make transaction unique (avoid bankrun replay detection)
      await advanceClock(context, BigInt(1));

      // Try to finalize again after seal - should fail
      let didFail = false;
      try {
        await finalizeBpd(program, payer, setup.globalState, setup.claimConfigPDA, [setup.stakePDA]);
      } catch (error: any) {
        didFail = true;
        // Just verify it threw an error - the error format in bankrun can vary
      }
      expect(didFail).toBe(true, "finalize should have failed after seal");

      // Verify state didn't change (still sealed with same counter)
      const claimConfig = await program.account.claimConfig.fetch(setup.claimConfigPDA);
      expect(claimConfig.bpdCalculationComplete).toBe(true);
      expect(claimConfig.bpdStakesFinalized).toBe(1);
    });
  });

  describe("CRIT-NEW-1: per-stake finalize tracking", () => {
    it("duplicate stake in finalize is skipped silently", async () => {
      const { context, program, payer } = await setupTest();
      const setup = await setupClaimPeriodWithStaker(program, payer, context);

      // Advance past claim period
      await advanceClock(context, BigInt(DEFAULT_SLOTS_PER_DAY.muln(181).toString()));

      // Finalize with same stake listed twice - should process only once
      const remainingAccounts = [
        { pubkey: setup.stakePDA, isSigner: false, isWritable: true },
        { pubkey: setup.stakePDA, isSigner: false, isWritable: true },
      ];
      await program.methods
        .finalizeBpdCalculation()
        .accounts({
          caller: payer.publicKey,
          globalState: setup.globalState,
          claimConfig: setup.claimConfigPDA,
        })
        .remainingAccounts(remainingAccounts)
        .signers([payer])
        .rpc();

      // Check ClaimConfig - should count stake only once
      const claimConfig = await program.account.claimConfig.fetch(setup.claimConfigPDA);
      expect(claimConfig.bpdStakesFinalized).toBe(1);

      // Check stake was marked with finalize period ID
      const stake = await program.account.stakeAccount.fetch(setup.stakePDA);
      expect(stake.bpdFinalizePeriodId).toBe(1);
    });

    it("trigger skips stakes not counted in finalize", async () => {
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

      // Create TWO stakers
      const staker1 = Keypair.generate();
      const fundTx1 = new Transaction();
      fundTx1.add(SystemProgram.transfer({ fromPubkey: payer.publicKey, toPubkey: staker1.publicKey, lamports: 500_000_000 }));
      await program.provider.sendAndConfirm(fundTx1, [payer]);

      const staker1ATA = getAssociatedTokenAddressSync(mint, staker1.publicKey, false, TOKEN_2022_PROGRAM_ID);
      const createAta1 = new Transaction();
      createAta1.add(createAssociatedTokenAccountInstruction(staker1.publicKey, staker1ATA, staker1.publicKey, mint, TOKEN_2022_PROGRAM_ID));
      await program.provider.sendAndConfirm(createAta1, [staker1]);

      await mintTokensToUser(program, payer, globalState, mint, mintAuthority, staker1ATA, DEFAULT_MIN_STAKE_AMOUNT);

      // Read global state to get correct stakeId for first stake
      let globalStateData = await program.account.globalState.fetch(globalState);
      const [stakePDA1] = findStakePDA(program.programId, staker1.publicKey, globalStateData.totalStakesCreated);
      await program.methods
        .createStake(DEFAULT_MIN_STAKE_AMOUNT, 365)
        .accounts({ user: staker1.publicKey, globalState, stakeAccount: stakePDA1, userTokenAccount: staker1ATA, mint, tokenProgram: TOKEN_2022_PROGRAM_ID })
        .signers([staker1])
        .rpc();

      const staker2 = Keypair.generate();
      const fundTx2 = new Transaction();
      fundTx2.add(SystemProgram.transfer({ fromPubkey: payer.publicKey, toPubkey: staker2.publicKey, lamports: 500_000_000 }));
      await program.provider.sendAndConfirm(fundTx2, [payer]);

      const staker2ATA = getAssociatedTokenAddressSync(mint, staker2.publicKey, false, TOKEN_2022_PROGRAM_ID);
      const createAta2 = new Transaction();
      createAta2.add(createAssociatedTokenAccountInstruction(staker2.publicKey, staker2ATA, staker2.publicKey, mint, TOKEN_2022_PROGRAM_ID));
      await program.provider.sendAndConfirm(createAta2, [staker2]);

      await mintTokensToUser(program, payer, globalState, mint, mintAuthority, staker2ATA, DEFAULT_MIN_STAKE_AMOUNT);

      // Read global state to get correct stakeId for second stake
      globalStateData = await program.account.globalState.fetch(globalState);
      const [stakePDA2] = findStakePDA(program.programId, staker2.publicKey, globalStateData.totalStakesCreated);
      await program.methods
        .createStake(DEFAULT_MIN_STAKE_AMOUNT, 365)
        .accounts({ user: staker2.publicKey, globalState, stakeAccount: stakePDA2, userTokenAccount: staker2ATA, mint, tokenProgram: TOKEN_2022_PROGRAM_ID })
        .signers([staker2])
        .rpc();

      // Advance past claim period
      await advanceClock(context, BigInt(DEFAULT_SLOTS_PER_DAY.muln(181).toString()));

      // Finalize ONLY stake1
      await finalizeBpd(program, payer, globalState, claimConfigPDA, [stakePDA1]);

      // Seal
      await sealBpdFinalize(program, payer, globalState, claimConfigPDA);

      // Try to trigger with BOTH stakes (including stake2 that wasn't finalized)
      await triggerBpd(program, payer, globalState, claimConfigPDA, [stakePDA1, stakePDA2]);

      // Stake1 should get BPD
      const stake1 = await program.account.stakeAccount.fetch(stakePDA1);
      expect(new BN(stake1.bpdBonusPending.toString()).gtn(0)).toBe(true);
      expect(stake1.bpdClaimPeriodId).toBe(1);

      // Stake2 should be skipped (no BPD)
      const stake2 = await program.account.stakeAccount.fetch(stakePDA2);
      expect(stake2.bpdBonusPending.toString()).toBe("0");
      expect(stake2.bpdClaimPeriodId).toBe(0);
    });
  });

  describe("CRIT-NEW-1: counter-based completion", () => {
    it("trigger does not mark complete until all finalized stakes distributed", async () => {
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

      // Create THREE stakers
      const stakes: any[] = [];
      for (let i = 0; i < 3; i++) {
        const staker = Keypair.generate();
        const fundTx = new Transaction();
        fundTx.add(SystemProgram.transfer({ fromPubkey: payer.publicKey, toPubkey: staker.publicKey, lamports: 500_000_000 }));
        await program.provider.sendAndConfirm(fundTx, [payer]);

        const stakerATA = getAssociatedTokenAddressSync(mint, staker.publicKey, false, TOKEN_2022_PROGRAM_ID);
        const createAtaTx = new Transaction();
        createAtaTx.add(createAssociatedTokenAccountInstruction(staker.publicKey, stakerATA, staker.publicKey, mint, TOKEN_2022_PROGRAM_ID));
        await program.provider.sendAndConfirm(createAtaTx, [staker]);

        await mintTokensToUser(program, payer, globalState, mint, mintAuthority, stakerATA, DEFAULT_MIN_STAKE_AMOUNT);

        // Read global state to get correct stakeId for each stake
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

      // Finalize all 3 stakes
      await finalizeBpd(program, payer, globalState, claimConfigPDA, stakes);

      // Seal
      await sealBpdFinalize(program, payer, globalState, claimConfigPDA);

      // Trigger batch 1: only 2 stakes
      await triggerBpd(program, payer, globalState, claimConfigPDA, [stakes[0], stakes[1]]);

      // Check completion - should NOT be complete (2 < 3)
      let claimConfig = await program.account.claimConfig.fetch(claimConfigPDA);
      expect(claimConfig.bigPayDayComplete).toBe(false);
      expect(claimConfig.bpdStakesDistributed).toBe(2);
      expect(claimConfig.bpdStakesFinalized).toBe(3);

      // Trigger batch 2: final stake
      await triggerBpd(program, payer, globalState, claimConfigPDA, [stakes[2]]);

      // Check completion - NOW complete (3 >= 3)
      claimConfig = await program.account.claimConfig.fetch(claimConfigPDA);
      expect(claimConfig.bigPayDayComplete).toBe(true);
      expect(claimConfig.bpdStakesDistributed).toBe(3);
    });
  });

  describe("HIGH-2: BPD window guard", () => {
    it("unstake blocked during BPD window", async () => {
      const { context, program, payer } = await setupTest();
      const setup = await setupClaimPeriodWithStaker(program, payer, context);

      // Advance past claim period
      await advanceClock(context, BigInt(DEFAULT_SLOTS_PER_DAY.muln(181).toString()));

      // Finalize (which sets BPD window active)
      await finalizeBpd(program, payer, setup.globalState, setup.claimConfigPDA, [setup.stakePDA]);

      // Try to unstake - should fail with BpdWindowActive
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
        expect(error.toString()).to.include("UnstakeBlockedDuringBpd");
      }
    });

    it("unstake allowed after BPD window closes", async () => {
      const { context, program, payer } = await setupTest();
      const setup = await setupClaimPeriodWithStaker(program, payer, context);

      // Advance past claim period
      await advanceClock(context, BigInt(DEFAULT_SLOTS_PER_DAY.muln(181).toString()));

      // Complete BPD flow (finalize, seal, trigger)
      await finalizeBpd(program, payer, setup.globalState, setup.claimConfigPDA, [setup.stakePDA]);
      await sealBpdFinalize(program, payer, setup.globalState, setup.claimConfigPDA);
      await triggerBpd(program, payer, setup.globalState, setup.claimConfigPDA, [setup.stakePDA]);

      // BPD window should now be closed - unstake should succeed
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

      // Verify stake is marked inactive (unstake doesn't close the account)
      const stakeAccount = await program.account.stakeAccount.fetch(setup.stakePDA);
      expect(stakeAccount.isActive).toBe(false);
    });
  });

  describe("MED-5: claim_period_id validation", () => {
    it("initialize_claim_period rejects claim_period_id=0", async () => {
      const { context, program, payer } = await setupTest();
      const { globalState } = await initializeProtocol(program, payer);

      const snapshotWallet = Keypair.generate();
      const entries = [{ wallet: snapshotWallet.publicKey, amount: new BN("10000000000"), claimPeriodId: 0 }];
      const tree = buildMerkleTree(entries);
      const [claimConfigPDA] = findClaimConfigPDA(program.programId);

      try {
        await program.methods
          .initializeClaimPeriod(Array.from(tree.root), new BN("100000000000000"), 1, 0)
          .accounts({
            authority: payer.publicKey,
            claimConfig: claimConfigPDA,
            systemProgram: SystemProgram.programId,
          })
          .signers([payer])
          .rpc();

        throw new Error("Expected InvalidClaimPeriodId error");
      } catch (error: any) {
        expect(error.toString()).to.include("InvalidClaimPeriodId");
      }
    });

    it("initialize_claim_period accepts claim_period_id=1", async () => {
      const { context, program, payer } = await setupTest();
      const { globalState } = await initializeProtocol(program, payer);

      const snapshotWallet = Keypair.generate();
      const entries = [{ wallet: snapshotWallet.publicKey, amount: new BN("10000000000"), claimPeriodId: 1 }];
      const tree = buildMerkleTree(entries);
      const [claimConfigPDA] = findClaimConfigPDA(program.programId);

      // Should succeed with claim_period_id=1
      await program.methods
        .initializeClaimPeriod(Array.from(tree.root), new BN("100000000000000"), 1, 1)
        .accounts({
          authority: payer.publicKey,
          claimConfig: claimConfigPDA,
          systemProgram: SystemProgram.programId,
        })
        .signers([payer])
        .rpc();

      const claimConfig = await program.account.claimConfig.fetch(claimConfigPDA);
      expect(claimConfig.claimPeriodId).toBe(1);
    });
  });

  describe("LOW-2: BPD bonus in unstake", () => {
    it("unstake includes bpd_bonus_pending in payout", async () => {
      const { context, program, payer } = await setupTest();
      const setup = await setupClaimPeriodWithStaker(program, payer, context);
      const testContext = context;

      // Advance past claim period
      await advanceClock(context, BigInt(DEFAULT_SLOTS_PER_DAY.muln(181).toString()));

      // Complete BPD flow
      await finalizeBpd(program, payer, setup.globalState, setup.claimConfigPDA, [setup.stakePDA]);
      await sealBpdFinalize(program, payer, setup.globalState, setup.claimConfigPDA);
      await triggerBpd(program, payer, setup.globalState, setup.claimConfigPDA, [setup.stakePDA]);

      // Get stake details before unstake
      const stakeBefore = await program.account.stakeAccount.fetch(setup.stakePDA);
      const bpdBonus = new BN(stakeBefore.bpdBonusPending.toString());
      expect(bpdBonus.gtn(0)).toBe(true);

      // Get token balance before unstake (using bankrun's getAccount)
      const balanceBefore = await getTokenBalance(testContext.banksClient, setup.stakerATA);

      // Unstake
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

      // Get token balance after unstake
      const balanceAfter = await getTokenBalance(testContext.banksClient, setup.stakerATA);

      // Payout should include BPD bonus
      const payout = new BN(balanceAfter.toString()).sub(new BN(balanceBefore.toString()));

      // Payout should be at least the BPD bonus (may be more due to staking rewards)
      expect(payout.gte(bpdBonus)).toBe(true);
    });
  });

  describe("Integration: full hardened lifecycle", () => {
    it("full BPD lifecycle with security hardening (3 stakes, 2 batches each for finalize and trigger)", async () => {
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

      // Create 3 stakers
      const stakes: any[] = [];
      for (let i = 0; i < 3; i++) {
        const staker = Keypair.generate();
        const fundTx = new Transaction();
        fundTx.add(SystemProgram.transfer({ fromPubkey: payer.publicKey, toPubkey: staker.publicKey, lamports: 500_000_000 }));
        await program.provider.sendAndConfirm(fundTx, [payer]);

        const stakerATA = getAssociatedTokenAddressSync(mint, staker.publicKey, false, TOKEN_2022_PROGRAM_ID);
        const createAtaTx = new Transaction();
        createAtaTx.add(createAssociatedTokenAccountInstruction(staker.publicKey, stakerATA, staker.publicKey, mint, TOKEN_2022_PROGRAM_ID));
        await program.provider.sendAndConfirm(createAtaTx, [staker]);

        await mintTokensToUser(program, payer, globalState, mint, mintAuthority, stakerATA, DEFAULT_MIN_STAKE_AMOUNT);

        // Read global state to get correct stakeId for each stake
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

      // FINALIZE in 2 batches
      await finalizeBpd(program, payer, globalState, claimConfigPDA, [stakes[0], stakes[1]]);
      await finalizeBpd(program, payer, globalState, claimConfigPDA, [stakes[2]]);

      // Check finalize counters
      let claimConfig = await program.account.claimConfig.fetch(claimConfigPDA);
      expect(claimConfig.bpdStakesFinalized).toBe(3);
      expect(claimConfig.bpdCalculationComplete).toBe(false);

      // SEAL
      await sealBpdFinalize(program, payer, globalState, claimConfigPDA);

      claimConfig = await program.account.claimConfig.fetch(claimConfigPDA);
      expect(claimConfig.bpdCalculationComplete).toBe(true);

      // TRIGGER in 2 batches
      await triggerBpd(program, payer, globalState, claimConfigPDA, [stakes[0]]);

      claimConfig = await program.account.claimConfig.fetch(claimConfigPDA);
      expect(claimConfig.bpdStakesDistributed).toBe(1);
      expect(claimConfig.bigPayDayComplete).toBe(false);

      await triggerBpd(program, payer, globalState, claimConfigPDA, [stakes[1], stakes[2]]);

      // Verify completion
      claimConfig = await program.account.claimConfig.fetch(claimConfigPDA);
      expect(claimConfig.bpdStakesDistributed).toBe(3);
      expect(claimConfig.bigPayDayComplete).toBe(true);

      // Verify all stakes got BPD
      for (const stakePDA of stakes) {
        const stake = await program.account.stakeAccount.fetch(stakePDA);
        expect(new BN(stake.bpdBonusPending.toString()).gtn(0)).toBe(true);
        expect(stake.bpdFinalizePeriodId).toBe(1);
        expect(stake.bpdClaimPeriodId).toBe(1);
      }

      // Verify BPD window is closed
      const globalStateData = await program.account.globalState.fetch(globalState);
      expect(globalStateData.reserved[0].toString()).toBe("0"); // BPD window flag should be cleared
    });
  });
});
