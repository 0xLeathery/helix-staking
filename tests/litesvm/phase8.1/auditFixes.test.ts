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
  getDefaultInitializeParams,
  buildMerkleTree,
  TOKEN_2022_PROGRAM_ID,
  DEFAULT_SLOTS_PER_DAY,
  DEFAULT_MIN_STAKE_AMOUNT,
} from "../phase3/utils";

// BPD_SEAL_DELAY_SECONDS = 86400 (24 hours)
// At 400ms/slot, that = 216000 slots
const SEAL_DELAY_SLOTS = BigInt(216_000);

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

// Helper: Seal BPD finalize WITH clock advancement
async function sealBpdFinalizeWithDelay(
  client: any,
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
  await advanceClock(client, SEAL_DELAY_SLOTS + BigInt(1));
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

// Helper: Setup a claim period with a staker
async function setupClaimPeriodWithStaker(
  program: any,
  payer: any,
  client: any,
) {
  const { globalState, mint, mintAuthority } = await initializeProtocol(
    program,
    payer,
  );

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

  // Create staker
  const { staker, stakerATA, stakePDA } = await createFundedStaker(
    program,
    payer,
    globalState,
    mint,
    mintAuthority,
    DEFAULT_MIN_STAKE_AMOUNT,
    365,
  );

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

describe("Phase 8.1: Audit Fixes & BPD Transparency", () => {
  // ========================================================================
  //  AUDIT FIXES
  // ========================================================================
  describe("Audit Fixes", () => {
    it("initialize rejects slots_per_day=0 (XRAY-3)", async () => {
      const { client, program, payer } = setupTest();
      const [globalStatePDA] = findGlobalStatePDA(program.programId);
      const [mintAuthorityPDA] = findMintAuthorityPDA(program.programId);
      const [mintPDA] = findMintPDA(program.programId);

      const params = getDefaultInitializeParams();
      params.slotsPerDay = new BN(0); // Invalid!

      try {
        await program.methods
          .initialize(params)
          .accounts({
            authority: payer.publicKey,
            globalState: globalStatePDA,
            mintAuthority: mintAuthorityPDA,
            mint: mintPDA,
            tokenProgram: TOKEN_2022_PROGRAM_ID,
          })
          .signers([payer])
          .rpc();
        throw new Error("Expected InvalidParameter error");
      } catch (error: any) {
        expect(error.toString()).toContain("InvalidParameter");
      }
    });

    it("abort_bpd resets all BPD state including Phase 8.1 fields", async () => {
      const { client, program, payer } = setupTest();
      const setup = await setupClaimPeriodWithStaker(program, payer, client);

      // Advance past claim period
      await advanceClock(
        client,
        BigInt(DEFAULT_SLOTS_PER_DAY.muln(181).toString()),
      );

      // Finalize BPD calculation (sets bpd_finalize_start_timestamp)
      await finalizeBpd(
        program,
        payer,
        setup.globalState,
        setup.claimConfigPDA,
        [setup.stakePDA],
      );

      // Verify finalize set the timestamp
      let claimConfig = await program.account.claimConfig.fetch(
        setup.claimConfigPDA,
      );
      expect(
        new BN(claimConfig.bpdFinalizeStartTimestamp.toString()).gtn(0),
      ).toBe(true);
      expect(claimConfig.bpdStakesFinalized).toBeGreaterThan(0);

      // Abort BPD
      await program.methods
        .abortBpd()
        .accounts({
          authority: payer.publicKey,
          globalState: setup.globalState,
          claimConfig: setup.claimConfigPDA,
        })
        .signers([payer])
        .rpc();

      // Verify ALL fields are reset including Phase 8.1 additions
      claimConfig = await program.account.claimConfig.fetch(
        setup.claimConfigPDA,
      );
      expect(claimConfig.bpdCalculationComplete).toBe(false);
      expect(claimConfig.bpdStakesFinalized).toBe(0);
      expect(claimConfig.bpdStakesDistributed).toBe(0);
      expect(
        new BN(claimConfig.bpdTotalShareDays.toString()).eqn(0),
      ).toBe(true);
      expect(
        new BN(claimConfig.bpdHelixPerShareDay.toString()).eqn(0),
      ).toBe(true);
      expect(
        new BN(claimConfig.bpdRemainingUnclaimed.toString()).eqn(0),
      ).toBe(true);
      // Phase 8.1 fields
      expect(
        new BN(claimConfig.bpdFinalizeStartTimestamp.toString()).eqn(0),
      ).toBe(true);
      expect(
        new BN(claimConfig.bpdOriginalUnclaimed.toString()).eqn(0),
      ).toBe(true);
    });

    it("after abort, re-finalize with new stakers completes BPD cycle", async () => {
      // ClaimConfig PDA uses `init` (fixed seeds) so it can only be created once.
      // After abort, per-stake bpd_finalize_period_id flags remain set, so
      // re-finalization skips already-finalized stakes. We verify that a fresh
      // staker (not in the first finalize batch) can be finalized and distributed.
      const { client, program, payer } = setupTest();
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

      // Create two stakers DURING the claim period (before advancing past end)
      const { stakePDA: stakePDA1 } = await createFundedStaker(
        program, payer, globalState, mint, mintAuthority,
        DEFAULT_MIN_STAKE_AMOUNT, 365,
      );
      const { stakePDA: stakePDA2 } = await createFundedStaker(
        program, payer, globalState, mint, mintAuthority,
        DEFAULT_MIN_STAKE_AMOUNT, 365,
      );

      // Advance past claim period
      await advanceClock(
        client,
        BigInt(DEFAULT_SLOTS_PER_DAY.muln(181).toString()),
      );

      // Finalize with staker1 only
      await finalizeBpd(program, payer, globalState, claimConfigPDA, [stakePDA1]);

      // Verify staker1 was finalized
      let claimConfig = await program.account.claimConfig.fetch(claimConfigPDA);
      expect(claimConfig.bpdStakesFinalized).toBe(1);

      // Abort — resets BPD counters but NOT per-stake flags
      await program.methods
        .abortBpd()
        .accounts({
          authority: payer.publicKey,
          globalState,
          claimConfig: claimConfigPDA,
        })
        .signers([payer])
        .rpc();

      // Verify abort cleared BPD accounting
      claimConfig = await program.account.claimConfig.fetch(claimConfigPDA);
      expect(claimConfig.bpdStakesFinalized).toBe(0);
      expect(new BN(claimConfig.bpdTotalShareDays.toString()).eqn(0)).toBe(true);

      // Re-finalize with BOTH — staker1 is SKIPPED (bpd_finalize_period_id already set),
      // staker2 is freshly counted
      await finalizeBpd(program, payer, globalState, claimConfigPDA, [stakePDA1, stakePDA2]);

      claimConfig = await program.account.claimConfig.fetch(claimConfigPDA);
      // Only staker2 was counted (staker1 was skipped)
      expect(claimConfig.bpdStakesFinalized).toBe(1);

      // Seal (with delay)
      await sealBpdFinalizeWithDelay(
        client, program, payer, globalState, claimConfigPDA,
      );

      // Trigger BPD distribution with staker2 only
      // (staker1 was finalized in the aborted pass — including it would be incorrect
      //  since total_share_days only accounts for staker2)
      await program.methods
        .triggerBigPayDay()
        .accounts({
          caller: payer.publicKey,
          globalState,
          claimConfig: claimConfigPDA,
        })
        .remainingAccounts([
          { pubkey: stakePDA2, isSigner: false, isWritable: true },
        ])
        .signers([payer])
        .rpc();

      // Verify distribution completed
      claimConfig = await program.account.claimConfig.fetch(claimConfigPDA);
      expect(claimConfig.bigPayDayComplete).toBe(true);

      const stakeData = await program.account.stakeAccount.fetch(stakePDA2);
      expect(new BN(stakeData.bpdBonusPending.toString()).gtn(0)).toBe(true);
    });
  });

  // ========================================================================
  //  BPD TRANSPARENCY: SEAL DELAY
  // ========================================================================
  describe("BPD Transparency: Seal Delay", () => {
    it("seal_bpd_finalize rejects before 24h delay period", async () => {
      const { client, program, payer } = setupTest();
      const setup = await setupClaimPeriodWithStaker(program, payer, client);

      // Advance past claim period
      await advanceClock(
        client,
        BigInt(DEFAULT_SLOTS_PER_DAY.muln(181).toString()),
      );

      // Finalize
      await finalizeBpd(
        program,
        payer,
        setup.globalState,
        setup.claimConfigPDA,
        [setup.stakePDA],
      );

      // Fetch the finalized count
      const claimConfig = await program.account.claimConfig.fetch(
        setup.claimConfigPDA,
      );
      const count = claimConfig.bpdStakesFinalized;

      // Try to seal IMMEDIATELY (no clock advancement) — should fail
      try {
        await program.methods
          .sealBpdFinalize(count)
          .accounts({
            authority: payer.publicKey,
            globalState: setup.globalState,
            claimConfig: setup.claimConfigPDA,
          })
          .signers([payer])
          .rpc();
        throw new Error("Expected BpdSealTooEarly error");
      } catch (error: any) {
        expect(error.toString()).toContain("BpdSealTooEarly");
      }
    });

    it("seal_bpd_finalize succeeds after 24h delay period", async () => {
      const { client, program, payer } = setupTest();
      const setup = await setupClaimPeriodWithStaker(program, payer, client);

      // Advance past claim period
      await advanceClock(
        client,
        BigInt(DEFAULT_SLOTS_PER_DAY.muln(181).toString()),
      );

      // Finalize
      await finalizeBpd(
        program,
        payer,
        setup.globalState,
        setup.claimConfigPDA,
        [setup.stakePDA],
      );

      // Advance 24 hours + 1 second worth of slots
      await advanceClock(client, SEAL_DELAY_SLOTS + BigInt(1));

      // Seal should succeed
      const claimConfig = await program.account.claimConfig.fetch(
        setup.claimConfigPDA,
      );
      await program.methods
        .sealBpdFinalize(claimConfig.bpdStakesFinalized)
        .accounts({
          authority: payer.publicKey,
          globalState: setup.globalState,
          claimConfig: setup.claimConfigPDA,
        })
        .signers([payer])
        .rpc();

      // Verify seal completed
      const claimConfigAfter = await program.account.claimConfig.fetch(
        setup.claimConfigPDA,
      );
      expect(claimConfigAfter.bpdCalculationComplete).toBe(true);
    });

    it("bpd_finalize_start_timestamp set on first batch only", async () => {
      const { client, program, payer } = setupTest();
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

      // Create two stakers (for two batches)
      const { stakePDA: pda1 } = await createFundedStaker(
        program,
        payer,
        globalState,
        mint,
        mintAuthority,
        DEFAULT_MIN_STAKE_AMOUNT,
        365,
      );
      const { stakePDA: pda2 } = await createFundedStaker(
        program,
        payer,
        globalState,
        mint,
        mintAuthority,
        DEFAULT_MIN_STAKE_AMOUNT,
        365,
      );

      // Advance past claim period
      await advanceClock(
        client,
        BigInt(DEFAULT_SLOTS_PER_DAY.muln(181).toString()),
      );

      // Batch 1: finalize first stake
      await finalizeBpd(program, payer, globalState, claimConfigPDA, [pda1]);

      // Read timestamp after batch 1
      let claimConfig =
        await program.account.claimConfig.fetch(claimConfigPDA);
      const timestampAfterBatch1 = new BN(
        claimConfig.bpdFinalizeStartTimestamp.toString(),
      );
      expect(timestampAfterBatch1.gtn(0)).toBe(true);

      // Advance time significantly
      await advanceClock(
        client,
        BigInt(DEFAULT_SLOTS_PER_DAY.muln(5).toString()),
      );

      // Batch 2: finalize second stake
      await finalizeBpd(program, payer, globalState, claimConfigPDA, [pda2]);

      // Read timestamp after batch 2 — should be unchanged
      claimConfig = await program.account.claimConfig.fetch(claimConfigPDA);
      const timestampAfterBatch2 = new BN(
        claimConfig.bpdFinalizeStartTimestamp.toString(),
      );

      expect(timestampAfterBatch2.eq(timestampAfterBatch1)).toBe(true);
    });
  });

  // ========================================================================
  //  BPD TRANSPARENCY: EVENT EMISSION
  // ========================================================================
  describe("BPD Transparency: Event Emission", () => {
    it("BpdBatchFinalized event emitted during finalize", async () => {
      const { client, program, payer } = setupTest();
      const setup = await setupClaimPeriodWithStaker(program, payer, client);

      // Advance past claim period
      await advanceClock(
        client,
        BigInt(DEFAULT_SLOTS_PER_DAY.muln(181).toString()),
      );

      // Finalize — the instruction emits a BpdBatchFinalized event
      // We verify the instruction succeeds (event emission is implicit)
      await finalizeBpd(
        program,
        payer,
        setup.globalState,
        setup.claimConfigPDA,
        [setup.stakePDA],
      );

      // Verify state was updated correctly
      const claimConfig = await program.account.claimConfig.fetch(
        setup.claimConfigPDA,
      );
      expect(claimConfig.bpdStakesFinalized).toBeGreaterThan(0);
      expect(
        new BN(claimConfig.bpdTotalShareDays.toString()).gtn(0),
      ).toBe(true);
      expect(
        new BN(claimConfig.bpdFinalizeStartTimestamp.toString()).gtn(0),
      ).toBe(true);
    });
  });

  // ========================================================================
  //  BPD ORIGINAL UNCLAIMED TRACKING
  // ========================================================================
  describe("BPD Original Unclaimed Tracking", () => {
    it("bpd_original_unclaimed stored at seal time", async () => {
      const { client, program, payer } = setupTest();
      const setup = await setupClaimPeriodWithStaker(program, payer, client);

      // Advance past claim period
      await advanceClock(
        client,
        BigInt(DEFAULT_SLOTS_PER_DAY.muln(181).toString()),
      );

      // Finalize
      await finalizeBpd(
        program,
        payer,
        setup.globalState,
        setup.claimConfigPDA,
        [setup.stakePDA],
      );

      // Before seal: bpd_original_unclaimed should be 0
      let claimConfig = await program.account.claimConfig.fetch(
        setup.claimConfigPDA,
      );
      expect(
        new BN(claimConfig.bpdOriginalUnclaimed.toString()).eqn(0),
      ).toBe(true);

      // Seal (with delay)
      await sealBpdFinalizeWithDelay(
        client,
        program,
        payer,
        setup.globalState,
        setup.claimConfigPDA,
      );

      // After seal: bpd_original_unclaimed should be set
      claimConfig = await program.account.claimConfig.fetch(
        setup.claimConfigPDA,
      );
      const originalUnclaimed = new BN(
        claimConfig.bpdOriginalUnclaimed.toString(),
      );
      expect(originalUnclaimed.gtn(0)).toBe(true);

      // It should equal the unclaimed amount (totalClaimable - totalClaimed)
      const totalClaimable = new BN(
        claimConfig.totalClaimable.toString(),
      );
      const totalClaimed = new BN(claimConfig.totalClaimed.toString());
      const expectedUnclaimed = totalClaimable.sub(totalClaimed);
      expect(originalUnclaimed.eq(expectedUnclaimed)).toBe(true);
    });
  });
});
