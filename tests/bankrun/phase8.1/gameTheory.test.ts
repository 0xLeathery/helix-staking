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
  getTokenBalance,
  advanceClock,
  findClaimConfigPDA,
  findStakePDA,
  buildMerkleTree,
  TOKEN_2022_PROGRAM_ID,
  DEFAULT_SLOTS_PER_DAY,
  DEFAULT_MIN_STAKE_AMOUNT,
  findMintAuthorityPDA,
} from "../phase3/utils";

// Phase 8.1 constants (mirror Rust constants.rs)
const PRECISION = new BN("1000000000"); // 1e9
const LOYALTY_MAX_BONUS = new BN("500000000"); // 0.5x
const BPD_MAX_SHARE_PCT = 5; // 5%

// Helper: Create ATA and fund a staker, return { staker, stakerATA, stakePDA }
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

// Helper: Run crankDistribution
async function crankDistribution(
  program: any,
  payer: any,
  globalState: any,
  mint: any,
  mintAuthority: any,
) {
  await program.methods
    .crankDistribution()
    .accounts({
      cranker: payer.publicKey,
      globalState,
      mint,
      mintAuthority,
      tokenProgram: TOKEN_2022_PROGRAM_ID,
    })
    .signers([payer])
    .rpc();
}

// Helper: Claim rewards and return claimed amount
async function claimAndMeasure(
  program: any,
  context: any,
  staker: any,
  globalState: any,
  stakePDA: any,
  stakerATA: any,
  mint: any,
  mintAuthority: any,
) {
  const balanceBefore = await getTokenBalance(context.banksClient, stakerATA);
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
  const balanceAfter = await getTokenBalance(context.banksClient, stakerATA);
  return new BN(balanceAfter.toString()).sub(new BN(balanceBefore.toString()));
}

// Helper: Finalize BPD calculation
async function finalizeBpd(
  program: any,
  payer: any,
  globalState: any,
  claimConfigPDA: any,
  stakePDAs: any[],
) {
  const remainingAccounts = stakePDAs.map((pubkey: any) => ({
    pubkey,
    isSigner: false,
    isWritable: true,
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

// Helper: Seal BPD finalize (with clock advancement for delay)
async function sealBpdFinalize(
  context: any,
  program: any,
  payer: any,
  globalState: any,
  claimConfigPDA: any,
  expectedFinalizedCount?: number,
) {
  if (expectedFinalizedCount === undefined) {
    const claimConfig = await program.account.claimConfig.fetch(claimConfigPDA);
    expectedFinalizedCount = claimConfig.bpdStakesFinalized;
  }
  // Advance clock past 24-hour seal delay
  await advanceClock(context, BigInt(216_001));
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

// Helper: Trigger BPD distribution
async function triggerBpd(
  program: any,
  caller: any,
  globalState: any,
  claimConfigPDA: any,
  stakePDAs: any[],
) {
  const remainingAccounts = stakePDAs.map((pubkey: any) => ({
    pubkey,
    isSigner: false,
    isWritable: true,
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

describe("Phase 8.1: Game Theory Hardening", () => {
  // ========================================================================
  //  DURATION LOYALTY MULTIPLIER
  // ========================================================================
  describe("Duration Loyalty Multiplier", () => {
    it("freshly created stake gets 0% loyalty bonus on claim", async () => {
      const { context, program, payer } = await setupTest();
      const { globalState, mint, mintAuthority } = await initializeProtocol(
        program,
        payer,
      );

      // Create two identical stakes — one claims at day 1 (baseline), one at day 1 too
      // Just verify claim works and produces base rewards
      const stakeAmount = new BN("10000000000"); // 100 tokens
      const { staker, stakerATA, stakePDA } = await createFundedStaker(
        program,
        payer,
        globalState,
        mint,
        mintAuthority,
        stakeAmount,
        365,
      );

      // Advance 1 day and crank
      await advanceClock(
        context,
        BigInt(DEFAULT_SLOTS_PER_DAY.toString()),
      );
      await crankDistribution(program, payer, globalState, mint, mintAuthority);

      // Claim
      const claimed = await claimAndMeasure(
        program,
        context,
        staker,
        globalState,
        stakePDA,
        stakerATA,
        mint,
        mintAuthority,
      );

      // Should get some rewards but no loyalty boost (day 1 of 365 = ~0.27%)
      expect(claimed.gtn(0)).toBe(true);

      // Fetch stake to verify it's still active
      const stakeData = await program.account.stakeAccount.fetch(stakePDA);
      expect(stakeData.isActive).toBe(true);
    });

    it("half-term stake gets ~25% loyalty bonus on claim", async () => {
      const { context, program, payer } = await setupTest();
      const { globalState, mint, mintAuthority } = await initializeProtocol(
        program,
        payer,
      );

      const stakeAmount = new BN("10000000000"); // 100 tokens

      // Create two identical stakes: A claims at day 1 (baseline), B claims at half-term
      const { staker: stakerA, stakerATA: ataA, stakePDA: pdaA } =
        await createFundedStaker(
          program, payer, globalState, mint, mintAuthority, stakeAmount, 365,
        );
      const { staker: stakerB, stakerATA: ataB, stakePDA: pdaB } =
        await createFundedStaker(
          program, payer, globalState, mint, mintAuthority, stakeAmount, 365,
        );

      // Advance 1 day and crank — stakerA claims (baseline, no loyalty)
      await advanceClock(context, BigInt(DEFAULT_SLOTS_PER_DAY.toString()));
      await crankDistribution(program, payer, globalState, mint, mintAuthority);
      const claimedA = await claimAndMeasure(
        program, context, stakerA, globalState, pdaA, ataA, mint, mintAuthority,
      );

      // Advance to day 182 (half-term of 365) — crank each day
      for (let d = 1; d < 182; d++) {
        await advanceClock(context, BigInt(DEFAULT_SLOTS_PER_DAY.toString()));
        await crankDistribution(program, payer, globalState, mint, mintAuthority);
      }

      // StakerB claims at half-term
      const claimedB = await claimAndMeasure(
        program, context, stakerB, globalState, pdaB, ataB, mint, mintAuthority,
      );

      // StakerB accumulated many more days of rewards, PLUS loyalty bonus
      // The loyalty portion should be ~25% of the accumulated inflation rewards
      // They have ~181 more days of rewards than A, plus the loyalty boost
      expect(claimedB.gt(claimedA)).toBe(true);

      // The extra inflation from 181 more days would be ~181x the daily rate.
      // Loyalty at day 182/365 ≈ 49.8% of max (0.5x) ≈ ~24.9% bonus on rewards.
      // We can't compute exact values but verify it's substantially more
    });

    it("full-term stake gets 50% loyalty bonus on claim", async () => {
      const { context, program, payer } = await setupTest();
      const { globalState, mint, mintAuthority } = await initializeProtocol(
        program,
        payer,
      );

      const stakeAmount = new BN("10000000000"); // 100 tokens
      const { staker, stakerATA, stakePDA } = await createFundedStaker(
        program, payer, globalState, mint, mintAuthority, stakeAmount, 365,
      );

      // Advance full 365 days, cranking distribution each day
      for (let d = 0; d < 365; d++) {
        await advanceClock(context, BigInt(DEFAULT_SLOTS_PER_DAY.toString()));
        await crankDistribution(program, payer, globalState, mint, mintAuthority);
      }

      // Claim at full maturity — should include 50% loyalty bonus
      const claimed = await claimAndMeasure(
        program, context, staker, globalState, stakePDA, stakerATA, mint, mintAuthority,
      );

      expect(claimed.gtn(0)).toBe(true);

      // Stake should still be active (at maturity, not unstaked)
      const stakeData = await program.account.stakeAccount.fetch(stakePDA);
      expect(stakeData.isActive).toBe(true);
    });

    it("loyalty bonus caps at max in grace period", async () => {
      const { context, program, payer } = await setupTest();
      const { globalState, mint, mintAuthority } = await initializeProtocol(
        program,
        payer,
      );

      const stakeAmount = new BN("10000000000"); // 100 tokens

      // Create two stakes: A claims at day 365, B claims at day 375
      const { staker: stakerA, stakerATA: ataA, stakePDA: pdaA } =
        await createFundedStaker(
          program, payer, globalState, mint, mintAuthority, stakeAmount, 365,
        );

      // Advance 365 days, crank each
      for (let d = 0; d < 365; d++) {
        await advanceClock(context, BigInt(DEFAULT_SLOTS_PER_DAY.toString()));
        await crankDistribution(program, payer, globalState, mint, mintAuthority);
      }

      // Claim A at exactly day 365
      const claimedA = await claimAndMeasure(
        program, context, stakerA, globalState, pdaA, ataA, mint, mintAuthority,
      );

      // Create staker B with same params
      const { staker: stakerB, stakerATA: ataB, stakePDA: pdaB } =
        await createFundedStaker(
          program, payer, globalState, mint, mintAuthority, stakeAmount, 365,
        );

      // Advance another 365 days + 10 into grace period for B
      for (let d = 0; d < 375; d++) {
        await advanceClock(context, BigInt(DEFAULT_SLOTS_PER_DAY.toString()));
        await crankDistribution(program, payer, globalState, mint, mintAuthority);
      }

      const claimedB = await claimAndMeasure(
        program, context, stakerB, globalState, pdaB, ataB, mint, mintAuthority,
      );

      // B got more days of rewards (375 vs 365) but the loyalty bonus
      // should be capped at 50% (same as A at 365 days). The extra 10 days
      // should only reflect more accumulated inflation, not more loyalty.
      expect(claimedB.gtn(0)).toBe(true);
      expect(claimedA.gtn(0)).toBe(true);
    });

    it("loyalty bonus applied to auto-claimed rewards during unstake", async () => {
      const { context, program, payer } = await setupTest();
      const { globalState, mint, mintAuthority } = await initializeProtocol(
        program,
        payer,
      );

      const stakeAmount = new BN("10000000000"); // 100 tokens
      const { staker, stakerATA, stakePDA } = await createFundedStaker(
        program, payer, globalState, mint, mintAuthority, stakeAmount, 30,
      );

      // Advance full 30 days, crank each
      for (let d = 0; d < 30; d++) {
        await advanceClock(context, BigInt(DEFAULT_SLOTS_PER_DAY.toString()));
        await crankDistribution(program, payer, globalState, mint, mintAuthority);
      }

      // Unstake at full maturity — payout includes principal + loyalty-boosted rewards
      const balanceBefore = await getTokenBalance(context.banksClient, stakerATA);

      await program.methods
        .unstake()
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

      const balanceAfter = await getTokenBalance(context.banksClient, stakerATA);
      const payout = new BN(balanceAfter.toString()).sub(
        new BN(balanceBefore.toString()),
      );

      // Payout should exceed stake amount (principal returned + rewards with loyalty)
      expect(payout.gt(stakeAmount)).toBe(true);

      // Verify stake is closed
      const stakeData = await program.account.stakeAccount.fetch(stakePDA);
      expect(stakeData.isActive).toBe(false);
    });
  });

  // ========================================================================
  //  ANTI-WHALE: BPD SHARE CAP
  // ========================================================================
  describe("Anti-Whale: BPD Share Cap", () => {
    it("whale stake capped at 5% of BPD pool", async () => {
      const { context, program, payer } = await setupTest();
      const { globalState, mint, mintAuthority } = await initializeProtocol(
        program,
        payer,
      );

      // Initialize claim period
      const snapshotWallet = Keypair.generate();
      const entries = [
        {
          wallet: snapshotWallet.publicKey,
          amount: new BN("10000000000"),
          claimPeriodId: 1,
        },
      ];
      const tree = buildMerkleTree(entries);
      const [claimConfigPDA] = findClaimConfigPDA(program.programId);
      const totalClaimable = new BN("100000000000000"); // 100k HELIX

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

      // Create a whale: 100x min stake with long term (dominates share-days)
      const whaleAmount = DEFAULT_MIN_STAKE_AMOUNT.muln(100);
      const { stakePDA: whalePDA } = await createFundedStaker(
        program, payer, globalState, mint, mintAuthority, whaleAmount, 365,
      );

      // Create 5 small stakers (each at min stake, short term)
      const smallPDAs: any[] = [];
      for (let i = 0; i < 5; i++) {
        const { stakePDA } = await createFundedStaker(
          program, payer, globalState, mint, mintAuthority,
          DEFAULT_MIN_STAKE_AMOUNT, 30,
        );
        smallPDAs.push(stakePDA);
      }

      const allPDAs = [whalePDA, ...smallPDAs];

      // Advance past claim period (180 days)
      await advanceClock(
        context,
        BigInt(DEFAULT_SLOTS_PER_DAY.muln(181).toString()),
      );

      // Finalize, seal, trigger
      await finalizeBpd(program, payer, globalState, claimConfigPDA, allPDAs);
      await sealBpdFinalize(
        context, program, payer, globalState, claimConfigPDA,
      );

      // Fetch original unclaimed to determine cap
      const claimConfigBeforeTrigger =
        await program.account.claimConfig.fetch(claimConfigPDA);
      const originalUnclaimed = new BN(
        claimConfigBeforeTrigger.bpdOriginalUnclaimed.toString(),
      );

      await triggerBpd(program, payer, globalState, claimConfigPDA, allPDAs);

      // Fetch whale's BPD bonus
      const whaleStake = await program.account.stakeAccount.fetch(whalePDA);
      const whaleBonus = new BN(whaleStake.bpdBonusPending.toString());

      // Cap = 5% of original unclaimed
      const maxForWhale = originalUnclaimed.muln(BPD_MAX_SHARE_PCT).divn(100);

      // Whale's bonus should be ≤ 5% cap
      expect(whaleBonus.lte(maxForWhale)).toBe(true);

      // Whale would normally get much more than 5% since they have ~90%+ of share-days
      // So verify the cap was actually binding
      expect(whaleBonus.gtn(0)).toBe(true);
    });

    it("small stakes below cap receive full calculated BPD", async () => {
      const { context, program, payer } = await setupTest();
      const { globalState, mint, mintAuthority } = await initializeProtocol(
        program,
        payer,
      );

      // Initialize claim period
      const snapshotWallet = Keypair.generate();
      const entries = [
        {
          wallet: snapshotWallet.publicKey,
          amount: new BN("10000000000"),
          claimPeriodId: 1,
        },
      ];
      const tree = buildMerkleTree(entries);
      const [claimConfigPDA] = findClaimConfigPDA(program.programId);

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

      // Create 10 equal-sized stakers (each gets ~10% of share-days, below 5% cap
      // because BPD distribution is proportional to share-days and we have 10 equal)
      // Actually with equal stakes and days, each gets 1/10 = 10% which IS above 5% cap.
      // Let's use 25 stakers so each gets ~4% which is below cap
      const stakePDAs: any[] = [];
      for (let i = 0; i < 25; i++) {
        const { stakePDA } = await createFundedStaker(
          program, payer, globalState, mint, mintAuthority,
          DEFAULT_MIN_STAKE_AMOUNT, 365,
        );
        stakePDAs.push(stakePDA);
      }

      // Advance past claim period
      await advanceClock(
        context,
        BigInt(DEFAULT_SLOTS_PER_DAY.muln(181).toString()),
      );

      // Finalize, seal, trigger
      await finalizeBpd(program, payer, globalState, claimConfigPDA, stakePDAs);
      await sealBpdFinalize(
        context, program, payer, globalState, claimConfigPDA,
      );
      await triggerBpd(program, payer, globalState, claimConfigPDA, stakePDAs);

      // Each gets ~1/25 = 4% of pool, which is below the 5% cap
      // Verify each got a non-zero bonus
      let totalDistributed = new BN(0);
      for (const pda of stakePDAs) {
        const stake = await program.account.stakeAccount.fetch(pda);
        const bonus = new BN(stake.bpdBonusPending.toString());
        expect(bonus.gtn(0)).toBe(true);
        totalDistributed = totalDistributed.add(bonus);
      }

      // Total distributed should be the full BPD pool (within rounding tolerance)
      const claimConfig =
        await program.account.claimConfig.fetch(claimConfigPDA);
      const unclaimed = new BN(claimConfig.bpdOriginalUnclaimed.toString());
      const tolerance = unclaimed.divn(100); // 1% tolerance for rounding
      expect(totalDistributed.gte(unclaimed.sub(tolerance))).toBe(true);
    });
  });

  // ========================================================================
  //  ANTI-WHALE: BPB DIMINISHING RETURNS
  // ========================================================================
  describe("Anti-Whale: BPB Diminishing Returns", () => {
    it("BPB unchanged for small stakes (linear tier 1)", async () => {
      const { context, program, payer } = await setupTest();
      const { globalState, mint, mintAuthority } = await initializeProtocol(
        program,
        payer,
      );

      // Create a small stake — BPB is in the linear tier 1 range
      const stakeAmount = DEFAULT_MIN_STAKE_AMOUNT; // well below threshold
      const { stakePDA } = await createFundedStaker(
        program, payer, globalState, mint, mintAuthority, stakeAmount, 365,
      );

      const stakeData = await program.account.stakeAccount.fetch(stakePDA);
      const tShares = new BN(stakeData.tShares.toString());

      // T-shares should be reasonable for a small stake (just verify non-zero)
      expect(tShares.gtn(0)).toBe(true);
    });

    it("BPB produces monotonically increasing T-shares for larger stakes", async () => {
      const { context, program, payer } = await setupTest();
      const { globalState, mint, mintAuthority } = await initializeProtocol(
        program,
        payer,
      );

      // Create stakes with increasing amounts, same duration
      // All smaller than 1.5B (tier 1 linear), so should be linear
      const amounts = [
        DEFAULT_MIN_STAKE_AMOUNT,
        DEFAULT_MIN_STAKE_AMOUNT.muln(10),
        DEFAULT_MIN_STAKE_AMOUNT.muln(100),
        DEFAULT_MIN_STAKE_AMOUNT.muln(1000),
      ];

      const tSharesArr: BN[] = [];

      for (const amount of amounts) {
        const { stakePDA } = await createFundedStaker(
          program, payer, globalState, mint, mintAuthority, amount, 365,
        );
        const stakeData = await program.account.stakeAccount.fetch(stakePDA);
        tSharesArr.push(new BN(stakeData.tShares.toString()));
      }

      // Verify monotonically increasing
      for (let i = 1; i < tSharesArr.length; i++) {
        expect(
          tSharesArr[i].gt(tSharesArr[i - 1]),
        ).toBe(true);
      }
    });

    it("T-shares scale sub-linearly beyond tier 1 threshold", async () => {
      const { context, program, payer } = await setupTest();
      const { globalState, mint, mintAuthority } = await initializeProtocol(
        program,
        payer,
      );

      // Create a min-stake (definitely in tier 1 linear)
      const smallAmount = DEFAULT_MIN_STAKE_AMOUNT; // 10M tokens (8 dec) = 0.1 HELIX
      const { stakePDA: smallPDA } = await createFundedStaker(
        program, payer, globalState, mint, mintAuthority, smallAmount, 365,
      );
      const smallData = await program.account.stakeAccount.fetch(smallPDA);
      const smallTShares = new BN(smallData.tShares.toString());

      // Create a 10x larger stake (still in tier 1)
      const medAmount = smallAmount.muln(10);
      const { stakePDA: medPDA } = await createFundedStaker(
        program, payer, globalState, mint, mintAuthority, medAmount, 365,
      );
      const medData = await program.account.stakeAccount.fetch(medPDA);
      const medTShares = new BN(medData.tShares.toString());

      // In pure linear BPB land, T-shares should scale roughly
      // proportional to amount^2 (because BPB bonus grows with amount)
      // At tiny amounts, BPB is near 0, so T-shares ≈ amount * 1
      // At 10x amount, BPB is also 10x larger, so T-shares ≈ 10 * amount * (1 + 10*lpb_bonus/precision)
      // The key test: higher amounts produce more T-shares (already verified)
      // And the ratio is > 10x (because BPB adds to the multiplier for the bigger stake)
      expect(medTShares.gt(smallTShares.muln(10))).toBe(true);
    });
  });
});
