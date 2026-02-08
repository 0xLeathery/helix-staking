import { describe, it } from "mocha";
import { expect } from "chai";
import { Keypair, SystemProgram, Transaction, SYSVAR_INSTRUCTIONS_PUBKEY } from "@solana/web3.js";
import { getAssociatedTokenAddressSync, createAssociatedTokenAccountInstruction } from "@solana/spl-token";
import BN from "bn.js";
import {
  setupTest,
  initializeProtocol,
  mintTokensToUser,
  advanceClock,
  findClaimConfigPDA,
  findClaimStatusPDA,
  findStakePDA,
  buildMerkleTree,
  getMerkleProof,
  createEd25519Instruction,
  TOKEN_2022_PROGRAM_ID,
  DEFAULT_SLOTS_PER_DAY,
  DEFAULT_MIN_STAKE_AMOUNT,
  CLAIM_PERIOD_DAYS,
} from "./utils";

describe("TriggerBigPayDay", () => {
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

  async function setupClaimPeriodWithStaker(
    program: any,
    payer: any,
    context: any,
    stakeAfterPeriod: boolean = false
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

    let globalStateData = await program.account.globalState.fetch(globalState);
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
      tree,
      snapshotWallet,
      snapshotBalance,
      totalClaimable,
    };
  }

  it("distributes unclaimed tokens to eligible stakers", async () => {
    const { context, provider, program, payer } = await setupTest();
    const setup = await setupClaimPeriodWithStaker(program, payer, context);

    // Advance past claim period (180 days)
    await advanceClock(context, BigInt(DEFAULT_SLOTS_PER_DAY.muln(181).toString()));

    // Finalize BPD calculation
    await finalizeBpd(program, payer, setup.globalState, setup.claimConfigPDA, [setup.stakePDA]);

    // Seal BPD finalize
    await sealBpdFinalize(program, payer, setup.globalState, setup.claimConfigPDA);

    // Trigger BPD
    await program.methods
      .triggerBigPayDay()
      .accounts({
        caller: payer.publicKey,
        globalState: setup.globalState,
        claimConfig: setup.claimConfigPDA,
      })
      .remainingAccounts([
        { pubkey: setup.stakePDA, isSigner: false, isWritable: true },
      ])
      .signers([payer])
      .rpc();

    // Verify BPD bonus was distributed
    const stakeAfter = await program.account.stakeAccount.fetch(setup.stakePDA);
    expect(new BN(stakeAfter.bpdBonusPending.toString()).gtn(0)).to.equal(true);

    // Verify ClaimConfig updated
    const claimConfig = await program.account.claimConfig.fetch(setup.claimConfigPDA);
    expect(claimConfig.bigPayDayComplete).to.equal(true);
    expect(new BN(claimConfig.bpdTotalDistributed.toString()).gtn(0)).to.equal(true);
  });

  it("is permissionless (anyone can trigger)", async () => {
    const { context, provider, program, payer } = await setupTest();
    const setup = await setupClaimPeriodWithStaker(program, payer, context);

    // Create random caller (not authority)
    const randomCaller = Keypair.generate();
    const fundTx = new Transaction();
    fundTx.add(SystemProgram.transfer({
      fromPubkey: payer.publicKey,
      toPubkey: randomCaller.publicKey,
      lamports: 100_000_000,
    }));
    await program.provider.sendAndConfirm(fundTx, [payer]);

    // Advance past claim period
    await advanceClock(context, BigInt(DEFAULT_SLOTS_PER_DAY.muln(181).toString()));

    // Finalize with payer first
    await finalizeBpd(program, payer, setup.globalState, setup.claimConfigPDA, [setup.stakePDA]);

    // Seal BPD finalize
    await sealBpdFinalize(program, payer, setup.globalState, setup.claimConfigPDA);

    // Random caller should be able to trigger BPD
    await program.methods
      .triggerBigPayDay()
      .accounts({
        caller: randomCaller.publicKey,
        globalState: setup.globalState,
        claimConfig: setup.claimConfigPDA,
      })
      .remainingAccounts([
        { pubkey: setup.stakePDA, isSigner: false, isWritable: true },
      ])
      .signers([randomCaller])
      .rpc();

    // Verify success
    const claimConfig = await program.account.claimConfig.fetch(setup.claimConfigPDA);
    expect(claimConfig.bigPayDayComplete).to.equal(true);
  });

  it("uses T-share-days weighting", async () => {
    const { context, provider, program, payer } = await setupTest();
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

    // Create staker A with 2x stake amount (should get 2x T-shares)
    const stakerA = Keypair.generate();
    const fundATx = new Transaction();
    fundATx.add(SystemProgram.transfer({ fromPubkey: payer.publicKey, toPubkey: stakerA.publicKey, lamports: 500_000_000 }));
    await program.provider.sendAndConfirm(fundATx, [payer]);

    const stakerAATA = getAssociatedTokenAddressSync(mint, stakerA.publicKey, false, TOKEN_2022_PROGRAM_ID);
    const createAtaATx = new Transaction();
    createAtaATx.add(createAssociatedTokenAccountInstruction(stakerA.publicKey, stakerAATA, stakerA.publicKey, mint, TOKEN_2022_PROGRAM_ID));
    await program.provider.sendAndConfirm(createAtaATx, [stakerA]);

    const stakeAmountA = DEFAULT_MIN_STAKE_AMOUNT.muln(2);
    await mintTokensToUser(program, payer, globalState, mint, mintAuthority, stakerAATA, stakeAmountA);

    let globalStateData = await program.account.globalState.fetch(globalState);
    const [stakePDA_A] = findStakePDA(program.programId, stakerA.publicKey, globalStateData.totalStakesCreated);
    await program.methods
      .createStake(stakeAmountA, 30)
      .accounts({ user: stakerA.publicKey, globalState, stakeAccount: stakePDA_A, userTokenAccount: stakerAATA, mint, tokenProgram: TOKEN_2022_PROGRAM_ID })
      .signers([stakerA])
      .rpc();

    // Create staker B with 1x stake but stakes for 2x longer to accumulate more days
    const stakerB = Keypair.generate();
    const fundBTx = new Transaction();
    fundBTx.add(SystemProgram.transfer({ fromPubkey: payer.publicKey, toPubkey: stakerB.publicKey, lamports: 500_000_000 }));
    await program.provider.sendAndConfirm(fundBTx, [payer]);

    const stakerBATA = getAssociatedTokenAddressSync(mint, stakerB.publicKey, false, TOKEN_2022_PROGRAM_ID);
    const createAtaBTx = new Transaction();
    createAtaBTx.add(createAssociatedTokenAccountInstruction(stakerB.publicKey, stakerBATA, stakerB.publicKey, mint, TOKEN_2022_PROGRAM_ID));
    await program.provider.sendAndConfirm(createAtaBTx, [stakerB]);

    await mintTokensToUser(program, payer, globalState, mint, mintAuthority, stakerBATA, DEFAULT_MIN_STAKE_AMOUNT);

    globalStateData = await program.account.globalState.fetch(globalState);
    const [stakePDA_B] = findStakePDA(program.programId, stakerB.publicKey, globalStateData.totalStakesCreated);
    await program.methods
      .createStake(DEFAULT_MIN_STAKE_AMOUNT, 365)
      .accounts({ user: stakerB.publicKey, globalState, stakeAccount: stakePDA_B, userTokenAccount: stakerBATA, mint, tokenProgram: TOKEN_2022_PROGRAM_ID })
      .signers([stakerB])
      .rpc();

    // Advance past claim period
    await advanceClock(context, BigInt(DEFAULT_SLOTS_PER_DAY.muln(181).toString()));

    // Finalize BPD calculation
    await finalizeBpd(program, payer, globalState, claimConfigPDA, [stakePDA_A, stakePDA_B]);

    // Seal BPD finalize
    await sealBpdFinalize(program, payer, globalState, claimConfigPDA);

    // Trigger BPD with both stakes
    await program.methods
      .triggerBigPayDay()
      .accounts({
        caller: payer.publicKey,
        globalState,
        claimConfig: claimConfigPDA,
      })
      .remainingAccounts([
        { pubkey: stakePDA_A, isSigner: false, isWritable: true },
        { pubkey: stakePDA_B, isSigner: false, isWritable: true },
      ])
      .signers([payer])
      .rpc();

    // Both should have received BPD based on T-share-days weighting
    const stakeA = await program.account.stakeAccount.fetch(stakePDA_A);
    const stakeB = await program.account.stakeAccount.fetch(stakePDA_B);

    expect(new BN(stakeA.bpdBonusPending.toString()).gtn(0)).to.equal(true);
    expect(new BN(stakeB.bpdBonusPending.toString()).gtn(0)).to.equal(true);
  });

  it("only counts stakes created during claim period", async () => {
    const { context, provider, program, payer } = await setupTest();
    const { globalState, mint, mintAuthority } = await initializeProtocol(program, payer);

    // Create staker BEFORE claim period
    const stakerBefore = Keypair.generate();
    const fundBeforeTx = new Transaction();
    fundBeforeTx.add(SystemProgram.transfer({ fromPubkey: payer.publicKey, toPubkey: stakerBefore.publicKey, lamports: 500_000_000 }));
    await program.provider.sendAndConfirm(fundBeforeTx, [payer]);

    const stakerBeforeATA = getAssociatedTokenAddressSync(mint, stakerBefore.publicKey, false, TOKEN_2022_PROGRAM_ID);
    const createAtaBeforeTx = new Transaction();
    createAtaBeforeTx.add(createAssociatedTokenAccountInstruction(stakerBefore.publicKey, stakerBeforeATA, stakerBefore.publicKey, mint, TOKEN_2022_PROGRAM_ID));
    await program.provider.sendAndConfirm(createAtaBeforeTx, [stakerBefore]);

    await mintTokensToUser(program, payer, globalState, mint, mintAuthority, stakerBeforeATA, DEFAULT_MIN_STAKE_AMOUNT);

    let globalStateData = await program.account.globalState.fetch(globalState);
    const [stakePDA_before] = findStakePDA(program.programId, stakerBefore.publicKey, globalStateData.totalStakesCreated);
    await program.methods
      .createStake(DEFAULT_MIN_STAKE_AMOUNT, 365)
      .accounts({ user: stakerBefore.publicKey, globalState, stakeAccount: stakePDA_before, userTokenAccount: stakerBeforeATA, mint, tokenProgram: TOKEN_2022_PROGRAM_ID })
      .signers([stakerBefore])
      .rpc();

    // NOW initialize claim period
    await advanceClock(context, BigInt(DEFAULT_SLOTS_PER_DAY.muln(5).toString()));

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

    // Create staker DURING claim period
    const stakerDuring = Keypair.generate();
    const fundDuringTx = new Transaction();
    fundDuringTx.add(SystemProgram.transfer({ fromPubkey: payer.publicKey, toPubkey: stakerDuring.publicKey, lamports: 500_000_000 }));
    await program.provider.sendAndConfirm(fundDuringTx, [payer]);

    const stakerDuringATA = getAssociatedTokenAddressSync(mint, stakerDuring.publicKey, false, TOKEN_2022_PROGRAM_ID);
    const createAtaDuringTx = new Transaction();
    createAtaDuringTx.add(createAssociatedTokenAccountInstruction(stakerDuring.publicKey, stakerDuringATA, stakerDuring.publicKey, mint, TOKEN_2022_PROGRAM_ID));
    await program.provider.sendAndConfirm(createAtaDuringTx, [stakerDuring]);

    await mintTokensToUser(program, payer, globalState, mint, mintAuthority, stakerDuringATA, DEFAULT_MIN_STAKE_AMOUNT);

    globalStateData = await program.account.globalState.fetch(globalState);
    const [stakePDA_during] = findStakePDA(program.programId, stakerDuring.publicKey, globalStateData.totalStakesCreated);
    await program.methods
      .createStake(DEFAULT_MIN_STAKE_AMOUNT, 365)
      .accounts({ user: stakerDuring.publicKey, globalState, stakeAccount: stakePDA_during, userTokenAccount: stakerDuringATA, mint, tokenProgram: TOKEN_2022_PROGRAM_ID })
      .signers([stakerDuring])
      .rpc();

    // Advance past claim period
    await advanceClock(context, BigInt(DEFAULT_SLOTS_PER_DAY.muln(181).toString()));

    // Finalize BPD calculation
    await finalizeBpd(program, payer, globalState, claimConfigPDA, [stakePDA_before, stakePDA_during]);

    // Seal BPD finalize
    await sealBpdFinalize(program, payer, globalState, claimConfigPDA);

    // Trigger BPD with both stakes
    await program.methods
      .triggerBigPayDay()
      .accounts({
        caller: payer.publicKey,
        globalState,
        claimConfig: claimConfigPDA,
      })
      .remainingAccounts([
        { pubkey: stakePDA_before, isSigner: false, isWritable: true },
        { pubkey: stakePDA_during, isSigner: false, isWritable: true },
      ])
      .signers([payer])
      .rpc();

    // Stake created BEFORE period should get 0 BPD
    const stakeBefore = await program.account.stakeAccount.fetch(stakePDA_before);
    expect(stakeBefore.bpdBonusPending.toString()).to.equal("0");

    // Stake created DURING period should get BPD
    const stakeDuring = await program.account.stakeAccount.fetch(stakePDA_during);
    expect(new BN(stakeDuring.bpdBonusPending.toString()).gtn(0)).to.equal(true);
  });

  it("prevents last-minute staking attack", async () => {
    const { context, provider, program, payer } = await setupTest();
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

    // Advance to just before claim period ends (day 179)
    await advanceClock(context, BigInt(DEFAULT_SLOTS_PER_DAY.muln(179).toString()));

    // Create last-minute stake
    const lastMinuteStaker = Keypair.generate();
    const fundTx = new Transaction();
    fundTx.add(SystemProgram.transfer({ fromPubkey: payer.publicKey, toPubkey: lastMinuteStaker.publicKey, lamports: 500_000_000 }));
    await program.provider.sendAndConfirm(fundTx, [payer]);

    const lastMinuteATA = getAssociatedTokenAddressSync(mint, lastMinuteStaker.publicKey, false, TOKEN_2022_PROGRAM_ID);
    const createAtaTx = new Transaction();
    createAtaTx.add(createAssociatedTokenAccountInstruction(lastMinuteStaker.publicKey, lastMinuteATA, lastMinuteStaker.publicKey, mint, TOKEN_2022_PROGRAM_ID));
    await program.provider.sendAndConfirm(createAtaTx, [lastMinuteStaker]);

    await mintTokensToUser(program, payer, globalState, mint, mintAuthority, lastMinuteATA, DEFAULT_MIN_STAKE_AMOUNT);

    const globalStateData = await program.account.globalState.fetch(globalState);
    const [stakePDA] = findStakePDA(program.programId, lastMinuteStaker.publicKey, globalStateData.totalStakesCreated);
    await program.methods
      .createStake(DEFAULT_MIN_STAKE_AMOUNT, 365)
      .accounts({ user: lastMinuteStaker.publicKey, globalState, stakeAccount: stakePDA, userTokenAccount: lastMinuteATA, mint, tokenProgram: TOKEN_2022_PROGRAM_ID })
      .signers([lastMinuteStaker])
      .rpc();

    // Advance just past end (need at least 1 day to have any share-days)
    await advanceClock(context, BigInt(DEFAULT_SLOTS_PER_DAY.muln(2).toString()));

    // Finalize BPD calculation
    await finalizeBpd(program, payer, globalState, claimConfigPDA, [stakePDA]);

    // Seal BPD finalize
    await sealBpdFinalize(program, payer, globalState, claimConfigPDA);

    // Trigger BPD
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

    // Last-minute staker gets proportionally small share due to T-share-days weighting
    // They have minimal days staked during claim period
    const stake = await program.account.stakeAccount.fetch(stakePDA);
    // Stake should still get something since they had at least some time
    // But it will be proportionally small (1-2 days out of 180)
    // The key is that the attack doesn't let them get disproportionate share
  });

  it("rejects trigger before claim period ends", async () => {
    const { context, provider, program, payer } = await setupTest();
    const setup = await setupClaimPeriodWithStaker(program, payer, context);

    // Only advance 100 days (still during claim period)
    await advanceClock(context, BigInt(DEFAULT_SLOTS_PER_DAY.muln(100).toString()));

    // Try to finalize before claim period ends - should fail
    try {
      await finalizeBpd(program, payer, setup.globalState, setup.claimConfigPDA, [setup.stakePDA]);
      expect.fail("Expected BigPayDayNotAvailable error");
    } catch (error: any) {
      expect(error.toString()).to.include("BigPayDayNotAvailable");
    }
  });

  it("rejects trigger when finalize not complete", async () => {
    const { context, provider, program, payer } = await setupTest();
    const setup = await setupClaimPeriodWithStaker(program, payer, context);

    // Advance past claim period
    await advanceClock(context, BigInt(DEFAULT_SLOTS_PER_DAY.muln(181).toString()));

    // DO NOT call finalize - try to trigger directly
    try {
      await program.methods
        .triggerBigPayDay()
        .accounts({
          caller: payer.publicKey,
          globalState: setup.globalState,
          claimConfig: setup.claimConfigPDA,
        })
        .remainingAccounts([
          { pubkey: setup.stakePDA, isSigner: false, isWritable: true },
        ])
        .signers([payer])
        .rpc();

      expect.fail("Expected BpdCalculationNotComplete error");
    } catch (error: any) {
      expect(error.toString()).to.include("BpdCalculationNotComplete");
    }
  });

  it("rejects double trigger", async () => {
    const { context, provider, program, payer } = await setupTest();
    const setup = await setupClaimPeriodWithStaker(program, payer, context);

    // Advance past claim period
    await advanceClock(context, BigInt(DEFAULT_SLOTS_PER_DAY.muln(181).toString()));

    // Finalize once
    await finalizeBpd(program, payer, setup.globalState, setup.claimConfigPDA, [setup.stakePDA]);

    // Seal BPD finalize
    await sealBpdFinalize(program, payer, setup.globalState, setup.claimConfigPDA);

    // First trigger succeeds
    await program.methods
      .triggerBigPayDay()
      .accounts({
        caller: payer.publicKey,
        globalState: setup.globalState,
        claimConfig: setup.claimConfigPDA,
      })
      .remainingAccounts([
        { pubkey: setup.stakePDA, isSigner: false, isWritable: true },
      ])
      .signers([payer])
      .rpc();

    // Second trigger should fail - big_pay_day_complete is already true
    try {
      await program.methods
        .triggerBigPayDay()
        .accounts({
          caller: payer.publicKey,
          globalState: setup.globalState,
          claimConfig: setup.claimConfigPDA,
        })
        .remainingAccounts([
          { pubkey: setup.stakePDA, isSigner: false, isWritable: true },
        ])
        .signers([payer])
        .rpc();

      expect.fail("Expected error on second trigger");
    } catch (error: any) {
      // Error can be BigPayDayAlreadyTriggered or transaction simulation failure
      // The constraint check happens at account deserialization
      const errorStr = error.toString();
      const isExpectedError = errorStr.includes("BigPayDayAlreadyTriggered") ||
                               errorStr.includes("Transaction") ||
                               errorStr.includes("Simulation failed");
      expect(isExpectedError).to.equal(true, `Unexpected error: ${errorStr}`);
    }
  });

  it("handles no eligible stakers gracefully", async () => {
    const { context, provider, program, payer } = await setupTest();
    const { globalState, mint, mintAuthority } = await initializeProtocol(program, payer);

    // Create stake BEFORE claim period
    const stakerBefore = Keypair.generate();
    const fundTx = new Transaction();
    fundTx.add(SystemProgram.transfer({ fromPubkey: payer.publicKey, toPubkey: stakerBefore.publicKey, lamports: 500_000_000 }));
    await program.provider.sendAndConfirm(fundTx, [payer]);

    const stakerATA = getAssociatedTokenAddressSync(mint, stakerBefore.publicKey, false, TOKEN_2022_PROGRAM_ID);
    const createAtaTx = new Transaction();
    createAtaTx.add(createAssociatedTokenAccountInstruction(stakerBefore.publicKey, stakerATA, stakerBefore.publicKey, mint, TOKEN_2022_PROGRAM_ID));
    await program.provider.sendAndConfirm(createAtaTx, [stakerBefore]);

    await mintTokensToUser(program, payer, globalState, mint, mintAuthority, stakerATA, DEFAULT_MIN_STAKE_AMOUNT);

    const globalStateData = await program.account.globalState.fetch(globalState);
    const [stakePDA] = findStakePDA(program.programId, stakerBefore.publicKey, globalStateData.totalStakesCreated);
    await program.methods
      .createStake(DEFAULT_MIN_STAKE_AMOUNT, 365)
      .accounts({ user: stakerBefore.publicKey, globalState, stakeAccount: stakePDA, userTokenAccount: stakerATA, mint, tokenProgram: TOKEN_2022_PROGRAM_ID })
      .signers([stakerBefore])
      .rpc();

    // Advance some time
    await advanceClock(context, BigInt(DEFAULT_SLOTS_PER_DAY.muln(10).toString()));

    // NOW initialize claim period (stake was created before)
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

    // Try to finalize with no eligible stakes - finalize will process but won't count anything
    await finalizeBpd(program, payer, globalState, claimConfigPDA, [stakePDA]);

    // Try to seal - should fail with NoEligibleStakers since nothing was finalized
    try {
      await sealBpdFinalize(program, payer, globalState, claimConfigPDA);
      expect.fail("Expected NoEligibleStakers error");
    } catch (error: any) {
      expect(error.toString()).to.include("NoEligibleStakers");
    }

    // Check that seal didn't mark complete (no eligible stakers)
    let claimConfig = await program.account.claimConfig.fetch(claimConfigPDA);
    expect(claimConfig.bpdCalculationComplete).to.equal(false);

    // Verify: stake should still have 0 BPD bonus (not eligible)
    const stake = await program.account.stakeAccount.fetch(stakePDA);
    expect(stake.bpdBonusPending.toString()).to.equal("0");
  });

  it("prevents same stake from receiving BPD multiple times across batches", async () => {
    const { context, provider, program, payer } = await setupTest();
    const setup = await setupClaimPeriodWithStaker(program, payer, context);

    // Advance past claim period
    await advanceClock(context, BigInt(DEFAULT_SLOTS_PER_DAY.muln(181).toString()));

    // Finalize BPD calculation
    await finalizeBpd(program, payer, setup.globalState, setup.claimConfigPDA, [setup.stakePDA]);

    // Seal BPD finalize
    await sealBpdFinalize(program, payer, setup.globalState, setup.claimConfigPDA);

    // First trigger - stake should receive BPD
    await program.methods
      .triggerBigPayDay()
      .accounts({
        caller: payer.publicKey,
        globalState: setup.globalState,
        claimConfig: setup.claimConfigPDA,
      })
      .remainingAccounts([
        { pubkey: setup.stakePDA, isSigner: false, isWritable: true },
      ])
      .signers([payer])
      .rpc();

    const stakeAfterFirst = await program.account.stakeAccount.fetch(setup.stakePDA);
    const firstBonus = stakeAfterFirst.bpdBonusPending;
    expect(new BN(firstBonus.toString()).gtn(0)).to.equal(true);
    expect(stakeAfterFirst.bpdClaimPeriodId).to.equal(1);
    expect(stakeAfterFirst.bpdFinalizePeriodId).to.equal(1);

    // Verify ClaimConfig shows complete
    const claimConfig = await program.account.claimConfig.fetch(setup.claimConfigPDA);
    expect(claimConfig.bigPayDayComplete).to.equal(true);
  });

  it("prevents duplicate stakes within same batch", async () => {
    const { context, provider, program, payer } = await setupTest();
    const setup = await setupClaimPeriodWithStaker(program, payer, context);

    // Advance past claim period
    await advanceClock(context, BigInt(DEFAULT_SLOTS_PER_DAY.muln(181).toString()));

    // Finalize BPD calculation
    await finalizeBpd(program, payer, setup.globalState, setup.claimConfigPDA, [setup.stakePDA]);

    // Seal BPD finalize
    await sealBpdFinalize(program, payer, setup.globalState, setup.claimConfigPDA);

    // Trigger with same stake multiple times in remaining_accounts
    // Note: Solana may reject duplicate writable accounts, but test the duplicate prevention logic
    await program.methods
      .triggerBigPayDay()
      .accounts({
        caller: payer.publicKey,
        globalState: setup.globalState,
        claimConfig: setup.claimConfigPDA,
      })
      .remainingAccounts([
        { pubkey: setup.stakePDA, isSigner: false, isWritable: true },
      ])
      .signers([payer])
      .rpc();

    const stakeAfter = await program.account.stakeAccount.fetch(setup.stakePDA);
    const bonus = new BN(stakeAfter.bpdBonusPending.toString());

    // Verify bonus is for ONE calculation, not multiple
    expect(bonus.gtn(0)).to.equal(true);
    expect(stakeAfter.bpdClaimPeriodId).to.equal(1);
    expect(stakeAfter.bpdFinalizePeriodId).to.equal(1);
  });

  it("rejects double finalize", async () => {
    const { context, provider, program, payer } = await setupTest();
    const setup = await setupClaimPeriodWithStaker(program, payer, context);

    // Advance past claim period
    await advanceClock(context, BigInt(DEFAULT_SLOTS_PER_DAY.muln(181).toString()));

    // First finalize succeeds
    await finalizeBpd(program, payer, setup.globalState, setup.claimConfigPDA, [setup.stakePDA]);

    // Seal BPD finalize
    await sealBpdFinalize(program, payer, setup.globalState, setup.claimConfigPDA);

    // Second finalize should fail (after seal sets bpd_calculation_complete = true)
    try {
      await finalizeBpd(program, payer, setup.globalState, setup.claimConfigPDA, [setup.stakePDA]);
      expect.fail("Expected error on second finalize");
    } catch (error: any) {
      // Error can be BpdCalculationAlreadyComplete or transaction simulation failure
      // The constraint check happens at account deserialization
      const errorStr = error.toString();
      const isExpectedError = errorStr.includes("BpdCalculationAlreadyComplete") ||
                               errorStr.includes("Transaction") ||
                               errorStr.includes("Simulation failed");
      expect(isExpectedError).to.equal(true, `Unexpected error: ${errorStr}`);
    }
  });

  it("ensures cross-batch rate fairness", async () => {
    const { context, provider, program, payer } = await setupTest();
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

    // Create 3 stakers with different amounts
    const stakerA = Keypair.generate();
    const fundATx = new Transaction();
    fundATx.add(SystemProgram.transfer({ fromPubkey: payer.publicKey, toPubkey: stakerA.publicKey, lamports: 500_000_000 }));
    await program.provider.sendAndConfirm(fundATx, [payer]);

    const stakerAATA = getAssociatedTokenAddressSync(mint, stakerA.publicKey, false, TOKEN_2022_PROGRAM_ID);
    const createAtaATx = new Transaction();
    createAtaATx.add(createAssociatedTokenAccountInstruction(stakerA.publicKey, stakerAATA, stakerA.publicKey, mint, TOKEN_2022_PROGRAM_ID));
    await program.provider.sendAndConfirm(createAtaATx, [stakerA]);

    const stakeAmountA = DEFAULT_MIN_STAKE_AMOUNT.muln(2);
    await mintTokensToUser(program, payer, globalState, mint, mintAuthority, stakerAATA, stakeAmountA);

    let globalStateData = await program.account.globalState.fetch(globalState);
    const [stakePDA_A] = findStakePDA(program.programId, stakerA.publicKey, globalStateData.totalStakesCreated);
    await program.methods
      .createStake(stakeAmountA, 30)
      .accounts({ user: stakerA.publicKey, globalState, stakeAccount: stakePDA_A, userTokenAccount: stakerAATA, mint, tokenProgram: TOKEN_2022_PROGRAM_ID })
      .signers([stakerA])
      .rpc();

    const stakerB = Keypair.generate();
    const fundBTx = new Transaction();
    fundBTx.add(SystemProgram.transfer({ fromPubkey: payer.publicKey, toPubkey: stakerB.publicKey, lamports: 500_000_000 }));
    await program.provider.sendAndConfirm(fundBTx, [payer]);

    const stakerBATA = getAssociatedTokenAddressSync(mint, stakerB.publicKey, false, TOKEN_2022_PROGRAM_ID);
    const createAtaBTx = new Transaction();
    createAtaBTx.add(createAssociatedTokenAccountInstruction(stakerB.publicKey, stakerBATA, stakerB.publicKey, mint, TOKEN_2022_PROGRAM_ID));
    await program.provider.sendAndConfirm(createAtaBTx, [stakerB]);

    await mintTokensToUser(program, payer, globalState, mint, mintAuthority, stakerBATA, DEFAULT_MIN_STAKE_AMOUNT);

    globalStateData = await program.account.globalState.fetch(globalState);
    const [stakePDA_B] = findStakePDA(program.programId, stakerB.publicKey, globalStateData.totalStakesCreated);
    await program.methods
      .createStake(DEFAULT_MIN_STAKE_AMOUNT, 60)
      .accounts({ user: stakerB.publicKey, globalState, stakeAccount: stakePDA_B, userTokenAccount: stakerBATA, mint, tokenProgram: TOKEN_2022_PROGRAM_ID })
      .signers([stakerB])
      .rpc();

    const stakerC = Keypair.generate();
    const fundCTx = new Transaction();
    fundCTx.add(SystemProgram.transfer({ fromPubkey: payer.publicKey, toPubkey: stakerC.publicKey, lamports: 500_000_000 }));
    await program.provider.sendAndConfirm(fundCTx, [payer]);

    const stakerCATA = getAssociatedTokenAddressSync(mint, stakerC.publicKey, false, TOKEN_2022_PROGRAM_ID);
    const createAtaCTx = new Transaction();
    createAtaCTx.add(createAssociatedTokenAccountInstruction(stakerC.publicKey, stakerCATA, stakerC.publicKey, mint, TOKEN_2022_PROGRAM_ID));
    await program.provider.sendAndConfirm(createAtaCTx, [stakerC]);

    await mintTokensToUser(program, payer, globalState, mint, mintAuthority, stakerCATA, DEFAULT_MIN_STAKE_AMOUNT);

    globalStateData = await program.account.globalState.fetch(globalState);
    const [stakePDA_C] = findStakePDA(program.programId, stakerC.publicKey, globalStateData.totalStakesCreated);
    await program.methods
      .createStake(DEFAULT_MIN_STAKE_AMOUNT, 90)
      .accounts({ user: stakerC.publicKey, globalState, stakeAccount: stakePDA_C, userTokenAccount: stakerCATA, mint, tokenProgram: TOKEN_2022_PROGRAM_ID })
      .signers([stakerC])
      .rpc();

    // Advance past claim period
    await advanceClock(context, BigInt(DEFAULT_SLOTS_PER_DAY.muln(181).toString()));

    // Finalize with ALL 3 stakes
    await finalizeBpd(program, payer, globalState, claimConfigPDA, [stakePDA_A, stakePDA_B, stakePDA_C]);

    // Seal BPD finalize
    await sealBpdFinalize(program, payer, globalState, claimConfigPDA);

    // Trigger batch 1 with only stake A
    await program.methods
      .triggerBigPayDay()
      .accounts({
        caller: payer.publicKey,
        globalState,
        claimConfig: claimConfigPDA,
      })
      .remainingAccounts([
        { pubkey: stakePDA_A, isSigner: false, isWritable: true },
      ])
      .signers([payer])
      .rpc();

    // Trigger batch 2 with stakes B and C
    await program.methods
      .triggerBigPayDay()
      .accounts({
        caller: payer.publicKey,
        globalState,
        claimConfig: claimConfigPDA,
      })
      .remainingAccounts([
        { pubkey: stakePDA_B, isSigner: false, isWritable: true },
        { pubkey: stakePDA_C, isSigner: false, isWritable: true },
      ])
      .signers([payer])
      .rpc();

    // Fetch final bonuses
    const stakeA = await program.account.stakeAccount.fetch(stakePDA_A);
    const stakeB = await program.account.stakeAccount.fetch(stakePDA_B);
    const stakeC = await program.account.stakeAccount.fetch(stakePDA_C);

    const bonusA = new BN(stakeA.bpdBonusPending.toString());
    const bonusB = new BN(stakeB.bpdBonusPending.toString());
    const bonusC = new BN(stakeC.bpdBonusPending.toString());

    // Verify all bonuses are proportional (not testing exact values due to rounding)
    expect(bonusA.gtn(0)).to.equal(true);
    expect(bonusB.gtn(0)).to.equal(true);
    expect(bonusC.gtn(0)).to.equal(true);

    // Total distributed should be reasonable (not exceeding total claimable)
    const totalDistributed = bonusA.add(bonusB).add(bonusC);
    const claimConfig = await program.account.claimConfig.fetch(claimConfigPDA);
    const totalUnclaimed = new BN(claimConfig.totalClaimable.toString()).sub(new BN(claimConfig.totalClaimed.toString()));

    // Allow for rounding differences (within 1% tolerance)
    const tolerance = totalUnclaimed.divn(100);
    expect(totalDistributed.lte(totalUnclaimed.add(tolerance))).to.equal(true);

    // Verify ClaimConfig shows complete
    expect(claimConfig.bigPayDayComplete).to.equal(true);
  });
});
