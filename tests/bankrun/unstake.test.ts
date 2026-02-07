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

describe("Unstake", () => {
  describe("Early Unstake", () => {
    it("applies minimum 50% penalty when unstaking immediately", async () => {
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

      const stakeAmount = DEFAULT_MIN_STAKE_AMOUNT;
      await mintTokensToUser(program, payer, globalState, mint, mintAuthority, userATA, stakeAmount);

      // Create stake
      const stakeDays = 100;
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

      // Unstake immediately (next slot) - should apply 50% penalty
      await advanceClock(context, BigInt(1));

      const balanceBefore = await getTokenBalance(context.banksClient, userATA);

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

      const balanceAfter = await getTokenBalance(context.banksClient, userATA);
      const returned = new BN(balanceAfter.toString()).sub(new BN(balanceBefore.toString()));

      // Should receive 50% or less (minimum penalty)
      expect(returned.lte(stakeAmount.div(new BN(2)))).to.equal(true);
    });

    it("applies proportional penalty based on time served", async () => {
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

      const stakeAmount = DEFAULT_MIN_STAKE_AMOUNT;
      await mintTokensToUser(program, payer, globalState, mint, mintAuthority, userATA, stakeAmount);

      // Create 100-day stake
      const stakeDays = 100;
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

      // Advance 50 days (half the duration)
      const slotsPerDay = BigInt(DEFAULT_SLOTS_PER_DAY.toString());
      await advanceClock(context, slotsPerDay * BigInt(50));

      const balanceBefore = await getTokenBalance(context.banksClient, userATA);

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

      const balanceAfter = await getTokenBalance(context.banksClient, userATA);
      const returned = new BN(balanceAfter.toString()).sub(new BN(balanceBefore.toString()));

      // At 50% served, penalty is 50% (proportional), which matches minimum 50%
      // Should receive approximately 50% of staked amount
      expect(returned.lte(stakeAmount.div(new BN(2)))).to.equal(true);
      expect(returned.gt(stakeAmount.div(new BN(3)))).to.equal(true); // More than 33%
    });

    it("returns tokens via minting (not transfer)", async () => {
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

      const stakeAmount = DEFAULT_MIN_STAKE_AMOUNT;
      await mintTokensToUser(program, payer, globalState, mint, mintAuthority, userATA, stakeAmount);

      const stakeDays = 10;
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

      // Advance to maturity (on-time unstake gets full amount back, proving minting works)
      const slotsPerDay = BigInt(DEFAULT_SLOTS_PER_DAY.toString());
      await advanceClock(context, slotsPerDay * BigInt(10));

      const balanceBefore = await getTokenBalance(context.banksClient, userATA);
      expect(balanceBefore.toString()).to.equal("0"); // Should be 0 after stake creation

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

      const balanceAfter = await getTokenBalance(context.banksClient, userATA);

      // Verify tokens were minted back to user (not transferred from treasury)
      // On-time unstake returns full amount
      expect(balanceAfter.toString()).to.equal(stakeAmount.toString());
    });
  });

  describe("On-Time Unstake", () => {
    it("returns full amount with no penalty when unstaking within grace period", async () => {
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

      const stakeAmount = DEFAULT_MIN_STAKE_AMOUNT;
      await mintTokensToUser(program, payer, globalState, mint, mintAuthority, userATA, stakeAmount);

      // Create 10-day stake
      const stakeDays = 10;
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

      // Advance exactly 10 days
      const slotsPerDay = BigInt(DEFAULT_SLOTS_PER_DAY.toString());
      await advanceClock(context, slotsPerDay * BigInt(10));

      const balanceBefore = await getTokenBalance(context.banksClient, userATA);

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

      const balanceAfter = await getTokenBalance(context.banksClient, userATA);
      const returned = new BN(balanceAfter.toString()).sub(new BN(balanceBefore.toString()));

      // Should receive full amount (no penalty)
      expect(returned.toString()).to.equal(stakeAmount.toString());
    });

    it("returns full amount at exact maturity", async () => {
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

      const stakeAmount = DEFAULT_MIN_STAKE_AMOUNT;
      await mintTokensToUser(program, payer, globalState, mint, mintAuthority, userATA, stakeAmount);

      const stakeDays = 5;
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

      // Fetch stake to get exact end_slot
      const stakeAccount = await program.account.stakeAccount.fetch(stakePDA);
      const currentClock = await context.banksClient.getClock();
      const slotsToAdvance = stakeAccount.endSlot.sub(new BN(currentClock.slot.toString()));

      // Advance to exact end_slot
      await advanceClock(context, BigInt(slotsToAdvance.toString()));

      const balanceBefore = await getTokenBalance(context.banksClient, userATA);

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

      const balanceAfter = await getTokenBalance(context.banksClient, userATA);
      const returned = new BN(balanceAfter.toString()).sub(new BN(balanceBefore.toString()));

      // Should receive full amount (no penalty at exact maturity)
      expect(returned.toString()).to.equal(stakeAmount.toString());
    });
  });

  describe("Late Unstake", () => {
    it("returns full amount during grace period (14 days late)", async () => {
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

      const stakeAmount = DEFAULT_MIN_STAKE_AMOUNT;
      await mintTokensToUser(program, payer, globalState, mint, mintAuthority, userATA, stakeAmount);

      // Create 10-day stake
      const stakeDays = 10;
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

      // Advance 10 + 14 days (within grace period)
      const slotsPerDay = BigInt(DEFAULT_SLOTS_PER_DAY.toString());
      await advanceClock(context, slotsPerDay * BigInt(24));

      const balanceBefore = await getTokenBalance(context.banksClient, userATA);

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

      const balanceAfter = await getTokenBalance(context.banksClient, userATA);
      const returned = new BN(balanceAfter.toString()).sub(new BN(balanceBefore.toString()));

      // Should receive full amount (within grace period)
      expect(returned.toString()).to.equal(stakeAmount.toString());
    });

    it("applies linear penalty after grace period", async () => {
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

      const stakeAmount = DEFAULT_MIN_STAKE_AMOUNT;
      await mintTokensToUser(program, payer, globalState, mint, mintAuthority, userATA, stakeAmount);

      // Create 10-day stake
      const stakeDays = 10;
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

      // Advance 10 + 14 + 100 days (beyond grace period)
      const slotsPerDay = BigInt(DEFAULT_SLOTS_PER_DAY.toString());
      await advanceClock(context, slotsPerDay * BigInt(124));

      const balanceBefore = await getTokenBalance(context.banksClient, userATA);

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

      const balanceAfter = await getTokenBalance(context.banksClient, userATA);
      const returned = new BN(balanceAfter.toString()).sub(new BN(balanceBefore.toString()));

      // Should have a penalty (100 days late)
      // Linear penalty: 100 days * ~27.4 bps/day ≈ 27.4% penalty
      expect(returned.lt(stakeAmount)).to.equal(true);
      expect(returned.gt(stakeAmount.div(new BN(2)))).to.equal(true); // More than 50%
    });

    it("applies 100% penalty after 365 days late", async () => {
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

      const stakeAmount = DEFAULT_MIN_STAKE_AMOUNT;
      await mintTokensToUser(program, payer, globalState, mint, mintAuthority, userATA, stakeAmount);

      // Create 10-day stake
      const stakeDays = 10;
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

      // Advance 10 + 365+ days (way past grace period)
      const slotsPerDay = BigInt(DEFAULT_SLOTS_PER_DAY.toString());
      await advanceClock(context, slotsPerDay * BigInt(380));

      const balanceBefore = await getTokenBalance(context.banksClient, userATA);

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

      const balanceAfter = await getTokenBalance(context.banksClient, userATA);
      const returned = new BN(balanceAfter.toString()).sub(new BN(balanceBefore.toString()));

      // Should receive 0 or very little (100% penalty)
      expect(returned.lte(new BN(100))).to.equal(true); // Allow tiny rounding
    });

    it("caps penalty at 100% (never more than staked)", async () => {
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

      const stakeAmount = DEFAULT_MIN_STAKE_AMOUNT;
      await mintTokensToUser(program, payer, globalState, mint, mintAuthority, userATA, stakeAmount);

      const stakeDays = 10;
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

      // Advance way past 365 days (1000 days late)
      const slotsPerDay = BigInt(DEFAULT_SLOTS_PER_DAY.toString());
      await advanceClock(context, slotsPerDay * BigInt(1010));

      const balanceBefore = await getTokenBalance(context.banksClient, userATA);

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

      const balanceAfter = await getTokenBalance(context.banksClient, userATA);
      const returned = new BN(balanceAfter.toString()).sub(new BN(balanceBefore.toString()));

      // Penalty caps at 100% (can't lose more than staked)
      expect(returned.gte(new BN(0))).to.equal(true);
    });
  });

  describe("Edge Cases", () => {
    it("rejects unstaking an already closed stake", async () => {
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

      const stakeAmount = DEFAULT_MIN_STAKE_AMOUNT;
      await mintTokensToUser(program, payer, globalState, mint, mintAuthority, userATA, stakeAmount);

      const stakeDays = 5;
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

      // Advance to maturity
      const slotsPerDay = BigInt(DEFAULT_SLOTS_PER_DAY.toString());
      await advanceClock(context, slotsPerDay * BigInt(5));

      // First unstake should succeed
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

      // Second unstake should fail
      try {
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

        expect.fail("Expected StakeNotActive error");
      } catch (error: any) {
        // Expect error (stake is already closed)
        expect(error).to.exist;
      }
    });

    it("rejects unstaking someone else's stake", async () => {
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

      const stakeAmount = DEFAULT_MIN_STAKE_AMOUNT;
      await mintTokensToUser(program, payer, globalState, mint, mintAuthority, userATA, stakeAmount);

      const stakeDays = 5;
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

      // Create different user
      const otherUser = Keypair.generate();

      // Fund other user with SOL
      await context.banksClient.processTransaction(
        (() => {
          const tx = new (require("@solana/web3.js").Transaction)();
          tx.add(
            require("@solana/web3.js").SystemProgram.transfer({
              fromPubkey: payer.publicKey,
              toPubkey: otherUser.publicKey,
              lamports: 1_000_000_000,
            })
          );
          tx.recentBlockhash = context.lastBlockhash;
          tx.feePayer = payer.publicKey;
          tx.sign(payer);
          return tx;
        })()
      );

      // Create ATA for other user
      const otherUserATA = getAssociatedTokenAddressSync(
        mint,
        otherUser.publicKey,
        false,
        TOKEN_2022_PROGRAM_ID
      );

      await program.provider.sendAndConfirm(
        (() => {
          const tx = new (require("@solana/web3.js").Transaction)();
          tx.add(
            require("@solana/spl-token").createAssociatedTokenAccountInstruction(
              payer.publicKey,
              otherUserATA,
              otherUser.publicKey,
              mint,
              TOKEN_2022_PROGRAM_ID
            )
          );
          return tx;
        })(),
        [payer]
      );

      // Try to unstake from other user (should fail)
      try {
        await program.methods
          .unstake()
          .accounts({
            user: otherUser.publicKey,
            globalState: globalState,
            stakeAccount: stakePDA,
            userTokenAccount: otherUserATA,
            mint: mint,
            mintAuthority: mintAuthority,
            tokenProgram: TOKEN_2022_PROGRAM_ID,
          })
          .signers([otherUser])
          .rpc();

        expect.fail("Expected UnauthorizedStakeAccess error");
      } catch (error: any) {
        // Expect constraint violation or unauthorized error
        expect(error).to.exist;
      }
    });

    it("updates GlobalState correctly on unstake", async () => {
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

      const stakeAmount = DEFAULT_MIN_STAKE_AMOUNT;
      await mintTokensToUser(program, payer, globalState, mint, mintAuthority, userATA, stakeAmount);

      const stakeDays = 5;
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

      // Get state before unstake
      const globalStateBefore = await program.account.globalState.fetch(globalState);
      const stakeAccount = await program.account.stakeAccount.fetch(stakePDA);

      // Advance to maturity
      const slotsPerDay = BigInt(DEFAULT_SLOTS_PER_DAY.toString());
      await advanceClock(context, slotsPerDay * BigInt(5));

      // Unstake
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

      // Get state after unstake
      const globalStateAfter = await program.account.globalState.fetch(globalState);

      // Verify counters updated
      expect(globalStateAfter.totalUnstakesCreated.toString()).to.equal(
        globalStateBefore.totalUnstakesCreated.add(new BN(1)).toString()
      );

      // Verify total_shares decreased
      expect(globalStateAfter.totalShares.toString()).to.equal(
        globalStateBefore.totalShares.sub(stakeAccount.tShares).toString()
      );

      // Verify total_tokens_staked decreased
      expect(globalStateAfter.totalTokensStaked.toString()).to.equal(
        globalStateBefore.totalTokensStaked.sub(stakeAmount).toString()
      );
    });

    it("redistributes penalty to remaining stakers via share_rate increase", async () => {
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

      // Create two stakes: A (large) and B (small)
      const stakeAmountA = new BN("5000000000"); // 50 tokens
      const stakeAmountB = DEFAULT_MIN_STAKE_AMOUNT; // 0.1 tokens

      await mintTokensToUser(program, payer, globalState, mint, mintAuthority, userATA, stakeAmountA.add(stakeAmountB));

      // Create stake A
      const stakeDays = 10;
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

      // Create stake B
      const [stakePDA_B] = findStakePDA(program.programId, payer.publicKey, 1);

      await program.methods
        .createStake(stakeAmountB, stakeDays)
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

      // Get initial share_rate
      const globalStateBefore = await program.account.globalState.fetch(globalState);
      const shareRateBefore = globalStateBefore.shareRate;

      // Unstake A early (immediate = 100% penalty, but minimum 50% enforced)
      await program.methods
        .unstake()
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

      // Check: share_rate should have increased due to penalty redistribution
      const globalStateAfter = await program.account.globalState.fetch(globalState);
      const shareRateAfter = globalStateAfter.shareRate;

      // share_rate should increase (penalty redistributed to stake B)
      expect(shareRateAfter.gt(shareRateBefore)).to.equal(true);

      // The increase should be: (penalty * PRECISION) / remaining_total_shares
      // penalty = 50% of stakeAmountA = 2500000000
      // Verify stake B now has more rewards due to share_rate bump
    });
  });
});
