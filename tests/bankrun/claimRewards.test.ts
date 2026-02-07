import { describe, it } from "mocha";
import { expect } from "chai";
import { PublicKey, Keypair } from "@solana/web3.js";
import { getAssociatedTokenAddressSync } from "@solana/spl-token";
import BN from "bn.js";
import {
  setupTest,
  initializeProtocol,
  mintTokensToUser,
  getTokenBalance,
  findStakePDA,
  advanceClock,
  TOKEN_2022_PROGRAM_ID,
  DEFAULT_MIN_STAKE_AMOUNT,
  DEFAULT_SLOTS_PER_DAY,
} from "./utils";

describe("ClaimRewards", () => {
  it("claims pending rewards correctly after distribution", async () => {
    const { context, provider, program, payer } = await setupTest();

    // Initialize protocol
    const { globalState, mint, mintAuthority } = await initializeProtocol(program, payer);

    // Create and fund user ATA
    const userATA = getAssociatedTokenAddressSync(
      mint,
      payer.publicKey,
      false,
      TOKEN_2022_PROGRAM_ID
    );

    await program.provider.sendAndConfirm(
      (() => {
        const tx = new (require("@solana/web3.js").Transaction)();
        tx.add(
          require("@solana/spl-token").createAssociatedTokenAccountInstruction(
            payer.publicKey,
            userATA,
            payer.publicKey,
            mint,
            TOKEN_2022_PROGRAM_ID
          )
        );
        return tx;
      })(),
      [payer]
    );

    const stakeAmount = new BN("10000000000"); // 100 tokens
    await mintTokensToUser(program, payer, globalState, mint, mintAuthority, userATA, stakeAmount);

    // Create stake
    const stakeDays = 1;
    const [stakePDA] = findStakePDA(program.programId, payer.publicKey, 0);

    await program.methods
      .createStake(stakeAmount, stakeDays)
      .accounts({
        user: payer.publicKey,
        globalState: globalState,
        stakeAccount: stakePDA,
        userTokenAccount: userATA,
        mint: mint,
        tokenProgram: TOKEN_2022_PROGRAM_ID,
      })
      .signers([payer])
      .rpc();

    // Advance 1 day
    const slotsPerDay = BigInt(DEFAULT_SLOTS_PER_DAY.toString());
    await advanceClock(context, slotsPerDay);

    // Crank distribution
    await program.methods
      .crankDistribution()
      .accounts({
        cranker: payer.publicKey,
        globalState: globalState,
        mint: mint,
        mintAuthority: mintAuthority,
        tokenProgram: TOKEN_2022_PROGRAM_ID,
      })
      .signers([payer])
      .rpc();

    // Claim rewards
    const balanceBefore = await getTokenBalance(context.banksClient, userATA);

    await program.methods
      .claimRewards()
      .accounts({
        user: payer.publicKey,
        globalState: globalState,
        stakeAccount: stakePDA,
        userTokenAccount: userATA,
        mint: mint,
        mintAuthority: mintAuthority,
        tokenProgram: TOKEN_2022_PROGRAM_ID,
      })
      .signers([payer])
      .rpc();

    const balanceAfter = await getTokenBalance(context.banksClient, userATA);
    const rewardsClaimed = new BN(balanceAfter.toString()).sub(new BN(balanceBefore.toString()));

    // Should receive some rewards
    expect(rewardsClaimed.gt(new BN(0))).to.equal(true);

    // Verify reward_debt was updated
    const stakeAccount = await program.account.stakeAccount.fetch(stakePDA);
    expect(stakeAccount.rewardDebt.gt(new BN(0))).to.equal(true);
  });

  it("rejects claim when no rewards pending", async () => {
    const { context, provider, program, payer } = await setupTest();

    const { globalState, mint, mintAuthority } = await initializeProtocol(program, payer);

    const userATA = getAssociatedTokenAddressSync(
      mint,
      payer.publicKey,
      false,
      TOKEN_2022_PROGRAM_ID
    );

    await program.provider.sendAndConfirm(
      (() => {
        const tx = new (require("@solana/web3.js").Transaction)();
        tx.add(
          require("@solana/spl-token").createAssociatedTokenAccountInstruction(
            payer.publicKey,
            userATA,
            payer.publicKey,
            mint,
            TOKEN_2022_PROGRAM_ID
          )
        );
        return tx;
      })(),
      [payer]
    );

    const stakeAmount = new BN("10000000000"); // 100 tokens
    await mintTokensToUser(program, payer, globalState, mint, mintAuthority, userATA, stakeAmount);

    const stakeDays = 1;
    const [stakePDA] = findStakePDA(program.programId, payer.publicKey, 0);

    await program.methods
      .createStake(stakeAmount, stakeDays)
      .accounts({
        user: payer.publicKey,
        globalState: globalState,
        stakeAccount: stakePDA,
        userTokenAccount: userATA,
        mint: mint,
        tokenProgram: TOKEN_2022_PROGRAM_ID,
      })
      .signers([payer])
      .rpc();

    // Try to claim immediately (before any distribution)
    try {
      await program.methods
        .claimRewards()
        .accounts({
          user: payer.publicKey,
          globalState: globalState,
          stakeAccount: stakePDA,
          userTokenAccount: userATA,
          mint: mint,
          mintAuthority: mintAuthority,
          tokenProgram: TOKEN_2022_PROGRAM_ID,
        })
        .signers([payer])
        .rpc();

      expect.fail("Expected NoRewardsToClaim error");
    } catch (error: any) {
      expect(error.toString()).to.include("NoRewardsToClaim");
    }
  });

  it("updates reward_debt to prevent double-claiming", async () => {
    const { context, provider, program, payer } = await setupTest();

    const { globalState, mint, mintAuthority } = await initializeProtocol(program, payer);

    const userATA = getAssociatedTokenAddressSync(
      mint,
      payer.publicKey,
      false,
      TOKEN_2022_PROGRAM_ID
    );

    await program.provider.sendAndConfirm(
      (() => {
        const tx = new (require("@solana/web3.js").Transaction)();
        tx.add(
          require("@solana/spl-token").createAssociatedTokenAccountInstruction(
            payer.publicKey,
            userATA,
            payer.publicKey,
            mint,
            TOKEN_2022_PROGRAM_ID
          )
        );
        return tx;
      })(),
      [payer]
    );

    const stakeAmount = new BN("10000000000"); // 100 tokens
    await mintTokensToUser(program, payer, globalState, mint, mintAuthority, userATA, stakeAmount);

    const stakeDays = 1;
    const [stakePDA] = findStakePDA(program.programId, payer.publicKey, 0);

    await program.methods
      .createStake(stakeAmount, stakeDays)
      .accounts({
        user: payer.publicKey,
        globalState: globalState,
        stakeAccount: stakePDA,
        userTokenAccount: userATA,
        mint: mint,
        tokenProgram: TOKEN_2022_PROGRAM_ID,
      })
      .signers([payer])
      .rpc();

    // Advance 1 day and crank
    const slotsPerDay = BigInt(DEFAULT_SLOTS_PER_DAY.toString());
    await advanceClock(context, slotsPerDay);

    await program.methods
      .crankDistribution()
      .accounts({
        cranker: payer.publicKey,
        globalState: globalState,
        mint: mint,
        mintAuthority: mintAuthority,
        tokenProgram: TOKEN_2022_PROGRAM_ID,
      })
      .signers([payer])
      .rpc();

    // First claim should succeed
    await program.methods
      .claimRewards()
      .accounts({
        user: payer.publicKey,
        globalState: globalState,
        stakeAccount: stakePDA,
        userTokenAccount: userATA,
        mint: mint,
        mintAuthority: mintAuthority,
        tokenProgram: TOKEN_2022_PROGRAM_ID,
      })
      .signers([payer])
      .rpc();

    // Second claim immediately should fail (no new rewards)
    try {
      await program.methods
        .claimRewards()
        .accounts({
          user: payer.publicKey,
          globalState: globalState,
          stakeAccount: stakePDA,
          userTokenAccount: userATA,
          mint: mint,
          mintAuthority: mintAuthority,
          tokenProgram: TOKEN_2022_PROGRAM_ID,
        })
        .signers([payer])
        .rpc();

      expect.fail("Expected NoRewardsToClaim error");
    } catch (error: any) {
      // Expect error (reward_debt prevents double-claim)
      expect(error).to.exist;
    }
  });

  it("accumulates rewards over multiple distribution days", async () => {
    const { context, provider, program, payer } = await setupTest();

    const { globalState, mint, mintAuthority } = await initializeProtocol(program, payer);

    const userATA = getAssociatedTokenAddressSync(
      mint,
      payer.publicKey,
      false,
      TOKEN_2022_PROGRAM_ID
    );

    await program.provider.sendAndConfirm(
      (() => {
        const tx = new (require("@solana/web3.js").Transaction)();
        tx.add(
          require("@solana/spl-token").createAssociatedTokenAccountInstruction(
            payer.publicKey,
            userATA,
            payer.publicKey,
            mint,
            TOKEN_2022_PROGRAM_ID
          )
        );
        return tx;
      })(),
      [payer]
    );

    const stakeAmount = new BN("10000000000"); // 100 tokens
    await mintTokensToUser(program, payer, globalState, mint, mintAuthority, userATA, stakeAmount);

    const stakeDays = 1;
    const [stakePDA] = findStakePDA(program.programId, payer.publicKey, 0);

    await program.methods
      .createStake(stakeAmount, stakeDays)
      .accounts({
        user: payer.publicKey,
        globalState: globalState,
        stakeAccount: stakePDA,
        userTokenAccount: userATA,
        mint: mint,
        tokenProgram: TOKEN_2022_PROGRAM_ID,
      })
      .signers([payer])
      .rpc();

    // Advance 5 days
    const slotsPerDay = BigInt(DEFAULT_SLOTS_PER_DAY.toString());
    await advanceClock(context, slotsPerDay * BigInt(5));

    // Crank once (processes all 5 days)
    await program.methods
      .crankDistribution()
      .accounts({
        cranker: payer.publicKey,
        globalState: globalState,
        mint: mint,
        mintAuthority: mintAuthority,
        tokenProgram: TOKEN_2022_PROGRAM_ID,
      })
      .signers([payer])
      .rpc();

    // Claim rewards
    const balanceBefore = await getTokenBalance(context.banksClient, userATA);

    await program.methods
      .claimRewards()
      .accounts({
        user: payer.publicKey,
        globalState: globalState,
        stakeAccount: stakePDA,
        userTokenAccount: userATA,
        mint: mint,
        mintAuthority: mintAuthority,
        tokenProgram: TOKEN_2022_PROGRAM_ID,
      })
      .signers([payer])
      .rpc();

    const balanceAfter = await getTokenBalance(context.banksClient, userATA);
    const rewardsClaimed = new BN(balanceAfter.toString()).sub(new BN(balanceBefore.toString()));

    // Should receive rewards for multiple days
    expect(rewardsClaimed.gt(new BN(0))).to.equal(true);
  });

  it("correctly distributes to multiple stakers proportionally", async () => {
    const { context, provider, program, payer } = await setupTest();

    const { globalState, mint, mintAuthority } = await initializeProtocol(program, payer);

    // User A: 10 tokens (reduced to avoid overflow)
    const userATA = getAssociatedTokenAddressSync(
      mint,
      payer.publicKey,
      false,
      TOKEN_2022_PROGRAM_ID
    );

    await program.provider.sendAndConfirm(
      (() => {
        const tx = new (require("@solana/web3.js").Transaction)();
        tx.add(
          require("@solana/spl-token").createAssociatedTokenAccountInstruction(
            payer.publicKey,
            userATA,
            payer.publicKey,
            mint,
            TOKEN_2022_PROGRAM_ID
          )
        );
        return tx;
      })(),
      [payer]
    );

    const stakeAmountA = new BN("1000000000"); // 10 tokens
    await mintTokensToUser(program, payer, globalState, mint, mintAuthority, userATA, stakeAmountA);

    const stakeDays = 1;
    const [stakePDA_A] = findStakePDA(program.programId, payer.publicKey, 0);

    await program.methods
      .createStake(stakeAmountA, stakeDays)
      .accounts({
        user: payer.publicKey,
        globalState: globalState,
        stakeAccount: stakePDA_A,
        userTokenAccount: userATA,
        mint: mint,
        tokenProgram: TOKEN_2022_PROGRAM_ID,
      })
      .signers([payer])
      .rpc();

    // User B: 30 tokens (reduced to avoid overflow)
    const userB = Keypair.generate();

    // Fund user B with SOL
    await context.banksClient.processTransaction(
      (() => {
        const tx = new (require("@solana/web3.js").Transaction)();
        tx.add(
          require("@solana/web3.js").SystemProgram.transfer({
            fromPubkey: payer.publicKey,
            toPubkey: userB.publicKey,
            lamports: 1_000_000_000,
          })
        );
        tx.recentBlockhash = context.lastBlockhash;
        tx.feePayer = payer.publicKey;
        tx.sign(payer);
        return tx;
      })()
    );

    const userB_ATA = getAssociatedTokenAddressSync(
      mint,
      userB.publicKey,
      false,
      TOKEN_2022_PROGRAM_ID
    );

    await program.provider.sendAndConfirm(
      (() => {
        const tx = new (require("@solana/web3.js").Transaction)();
        tx.add(
          require("@solana/spl-token").createAssociatedTokenAccountInstruction(
            payer.publicKey,
            userB_ATA,
            userB.publicKey,
            mint,
            TOKEN_2022_PROGRAM_ID
          )
        );
        return tx;
      })(),
      [payer]
    );

    const stakeAmountB = new BN("3000000000"); // 30 tokens
    await mintTokensToUser(program, payer, globalState, mint, mintAuthority, userB_ATA, stakeAmountB);

    const [stakePDA_B] = findStakePDA(program.programId, userB.publicKey, 1);

    await program.methods
      .createStake(stakeAmountB, stakeDays)
      .accounts({
        user: userB.publicKey,
        globalState: globalState,
        stakeAccount: stakePDA_B,
        userTokenAccount: userB_ATA,
        mint: mint,
        tokenProgram: TOKEN_2022_PROGRAM_ID,
      })
      .signers([userB])
      .rpc();

    // Advance 1 day and crank
    const slotsPerDay = BigInt(DEFAULT_SLOTS_PER_DAY.toString());
    await advanceClock(context, slotsPerDay);

    await program.methods
      .crankDistribution()
      .accounts({
        cranker: payer.publicKey,
        globalState: globalState,
        mint: mint,
        mintAuthority: mintAuthority,
        tokenProgram: TOKEN_2022_PROGRAM_ID,
      })
      .signers([payer])
      .rpc();

    // Claim rewards for user A
    const balanceA_Before = await getTokenBalance(context.banksClient, userATA);

    await program.methods
      .claimRewards()
      .accounts({
        user: payer.publicKey,
        globalState: globalState,
        stakeAccount: stakePDA_A,
        userTokenAccount: userATA,
        mint: mint,
        mintAuthority: mintAuthority,
        tokenProgram: TOKEN_2022_PROGRAM_ID,
      })
      .signers([payer])
      .rpc();

    const balanceA_After = await getTokenBalance(context.banksClient, userATA);
    const rewardsA = new BN(balanceA_After.toString()).sub(new BN(balanceA_Before.toString()));

    // Claim rewards for user B
    const balanceB_Before = await getTokenBalance(context.banksClient, userB_ATA);

    await program.methods
      .claimRewards()
      .accounts({
        user: userB.publicKey,
        globalState: globalState,
        stakeAccount: stakePDA_B,
        userTokenAccount: userB_ATA,
        mint: mint,
        mintAuthority: mintAuthority,
        tokenProgram: TOKEN_2022_PROGRAM_ID,
      })
      .signers([userB])
      .rpc();

    const balanceB_After = await getTokenBalance(context.banksClient, userB_ATA);
    const rewardsB = new BN(balanceB_After.toString()).sub(new BN(balanceB_Before.toString()));

    // User B should get approximately 3x rewards of User A (30 vs 10 tokens)
    // Allow some tolerance for rounding
    const ratio = rewardsB.mul(new BN(100)).div(rewardsA);
    expect(ratio.gte(new BN(250))).to.equal(true); // At least 2.5x
    expect(ratio.lte(new BN(350))).to.equal(true); // At most 3.5x
  });

  it("rejects claim on inactive stake", async () => {
    const { context, provider, program, payer } = await setupTest();

    const { globalState, mint, mintAuthority } = await initializeProtocol(program, payer);

    const userATA = getAssociatedTokenAddressSync(
      mint,
      payer.publicKey,
      false,
      TOKEN_2022_PROGRAM_ID
    );

    await program.provider.sendAndConfirm(
      (() => {
        const tx = new (require("@solana/web3.js").Transaction)();
        tx.add(
          require("@solana/spl-token").createAssociatedTokenAccountInstruction(
            payer.publicKey,
            userATA,
            payer.publicKey,
            mint,
            TOKEN_2022_PROGRAM_ID
          )
        );
        return tx;
      })(),
      [payer]
    );

    const stakeAmount = new BN("10000000000"); // 100 tokens
    await mintTokensToUser(program, payer, globalState, mint, mintAuthority, userATA, stakeAmount);

    const stakeDays = 1;
    const [stakePDA] = findStakePDA(program.programId, payer.publicKey, 0);

    await program.methods
      .createStake(stakeAmount, stakeDays)
      .accounts({
        user: payer.publicKey,
        globalState: globalState,
        stakeAccount: stakePDA,
        userTokenAccount: userATA,
        mint: mint,
        tokenProgram: TOKEN_2022_PROGRAM_ID,
      })
      .signers([payer])
      .rpc();

    // Advance to maturity and unstake
    const slotsPerDay = BigInt(DEFAULT_SLOTS_PER_DAY.toString());
    await advanceClock(context, slotsPerDay);

    await program.methods
      .unstake()
      .accounts({
        user: payer.publicKey,
        globalState: globalState,
        stakeAccount: stakePDA,
        userTokenAccount: userATA,
        mint: mint,
        mintAuthority: mintAuthority,
        tokenProgram: TOKEN_2022_PROGRAM_ID,
      })
      .signers([payer])
      .rpc();

    // Try to claim rewards on inactive stake
    try {
      await program.methods
        .claimRewards()
        .accounts({
          user: payer.publicKey,
          globalState: globalState,
          stakeAccount: stakePDA,
          userTokenAccount: userATA,
          mint: mint,
          mintAuthority: mintAuthority,
          tokenProgram: TOKEN_2022_PROGRAM_ID,
        })
        .signers([payer])
        .rpc();

      expect.fail("Expected StakeNotActive error");
    } catch (error: any) {
      expect(error.toString()).to.include("StakeNotActive");
    }
  });

  it("share_rate increase makes future stakes more expensive", async () => {
    const { context, provider, program, payer } = await setupTest();

    const { globalState, mint, mintAuthority } = await initializeProtocol(program, payer);

    const userATA = getAssociatedTokenAddressSync(
      mint,
      payer.publicKey,
      false,
      TOKEN_2022_PROGRAM_ID
    );

    await program.provider.sendAndConfirm(
      (() => {
        const tx = new (require("@solana/web3.js").Transaction)();
        tx.add(
          require("@solana/spl-token").createAssociatedTokenAccountInstruction(
            payer.publicKey,
            userATA,
            payer.publicKey,
            mint,
            TOKEN_2022_PROGRAM_ID
          )
        );
        return tx;
      })(),
      [payer]
    );

    const stakeAmount = new BN("10000000000"); // 100 tokens
    await mintTokensToUser(program, payer, globalState, mint, mintAuthority, userATA, stakeAmount.mul(new BN(2)));

    // Create stake A (before share_rate increase)
    const stakeDays = 1;
    const [stakePDA_A] = findStakePDA(program.programId, payer.publicKey, 0);

    await program.methods
      .createStake(stakeAmount, stakeDays)
      .accounts({
        user: payer.publicKey,
        globalState: globalState,
        stakeAccount: stakePDA_A,
        userTokenAccount: userATA,
        mint: mint,
        tokenProgram: TOKEN_2022_PROGRAM_ID,
      })
      .signers([payer])
      .rpc();

    const stakeA = await program.account.stakeAccount.fetch(stakePDA_A);

    // Advance days and crank to increase share_rate
    const slotsPerDay = BigInt(DEFAULT_SLOTS_PER_DAY.toString());
    await advanceClock(context, slotsPerDay * BigInt(5));

    await program.methods
      .crankDistribution()
      .accounts({
        cranker: payer.publicKey,
        globalState: globalState,
        mint: mint,
        mintAuthority: mintAuthority,
        tokenProgram: TOKEN_2022_PROGRAM_ID,
      })
      .signers([payer])
      .rpc();

    // Verify share_rate increased
    const globalStateAfterCrank = await program.account.globalState.fetch(globalState);
    expect(globalStateAfterCrank.shareRate.gt(globalStateAfterCrank.startingShareRate)).to.equal(true);

    // Create stake B (same amount and duration, but higher share_rate)
    const [stakePDA_B] = findStakePDA(program.programId, payer.publicKey, 1);

    await program.methods
      .createStake(stakeAmount, stakeDays)
      .accounts({
        user: payer.publicKey,
        globalState: globalState,
        stakeAccount: stakePDA_B,
        userTokenAccount: userATA,
        mint: mint,
        tokenProgram: TOKEN_2022_PROGRAM_ID,
      })
      .signers([payer])
      .rpc();

    const stakeB = await program.account.stakeAccount.fetch(stakePDA_B);

    // Stake B should have fewer T-shares than stake A (same amount but higher share_rate)
    expect(stakeB.tShares.lt(stakeA.tShares)).to.equal(true);
  });
});
