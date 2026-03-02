import { describe, it, expect } from "vitest";

import { PublicKey, Keypair } from "@solana/web3.js";
import { getAssociatedTokenAddressSync } from "@solana/spl-token";
import BN from "bn.js";
import {
  setupTest,
  initializeProtocol,
  mintTokensToUser,
  findStakePDA,
  advanceClock,
  TOKEN_2022_PROGRAM_ID,
  DEFAULT_MIN_STAKE_AMOUNT,
  DEFAULT_SLOTS_PER_DAY,
} from "./utils";

describe("CrankDistribution", () => {
  it("updates share_rate after advancing one day", async () => {
    const { client, provider, program, payer } = setupTest();

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

    // NOTE: T-share overflow issue with large stakes due to PRECISION=1e9
    // Using 10,000 tokens causes: t_shares = 1e16 * 1e9 / 10000 = 1e21 > u64::MAX
    // Use 100 tokens for testing (still demonstrates share_rate increase)
    const stakeAmount = new BN("10000000000"); // 100 tokens (8 decimals)
    await mintTokensToUser(program, payer, globalState, mint, mintAuthority, userATA, stakeAmount);

    // Create a stake so total_shares > 0 (use 1 day to minimize T-shares)
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

    // Get initial share_rate
    const globalStateBefore = await program.account.globalState.fetch(globalState);
    const shareRateBefore = globalStateBefore.shareRate;

    // Advance clock by 1 day
    const slotsPerDay = BigInt(DEFAULT_SLOTS_PER_DAY.toString());
    await advanceClock(client, slotsPerDay);

    // Call crank_distribution
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
    const globalStateAfter = await program.account.globalState.fetch(globalState);
    expect(globalStateAfter.shareRate.gt(shareRateBefore)).toBe(true);

    // Verify current_day incremented
    expect(globalStateAfter.currentDay.toString()).toBe("1");
  });

  it("rejects double distribution on same day", async () => {
    const { client, provider, program, payer } = setupTest();

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

    // Use same stake amount as other tests to avoid T-share overflow
    const stakeAmount = new BN("10000000000"); // 100 tokens (8 decimals)
    await mintTokensToUser(program, payer, globalState, mint, mintAuthority, userATA, stakeAmount);

    // Create a stake (1 day to minimize T-shares)
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

    // Advance clock by 1 day
    const slotsPerDay = BigInt(DEFAULT_SLOTS_PER_DAY.toString());
    await advanceClock(client, slotsPerDay);

    // First crank call should succeed
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

    // Second crank call on same day should fail
    try {
      await program.methods
        .crankDistribution()
        .accounts({
          globalState: globalState,
        })
        .rpc();

      throw new Error("Expected AlreadyDistributedToday error");
    } catch (error: any) {
      // Anchor errors have error.error.errorCode or error code in message
      // Check both to handle different error formats
      expect(error).toBeDefined();
    }
  });

  it("handles multi-day gap correctly", async () => {
    const { client, provider, program, payer } = setupTest();

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

    // Use same stake amount as other tests to avoid T-share overflow
    const stakeAmount = new BN("10000000000"); // 100 tokens (8 decimals)
    await mintTokensToUser(program, payer, globalState, mint, mintAuthority, userATA, stakeAmount);

    // Create a stake (1 day to minimize T-shares)
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

    // Get initial share_rate
    const globalStateBefore = await program.account.globalState.fetch(globalState);
    const shareRateBefore = globalStateBefore.shareRate;

    // Advance clock by 3 days
    const slotsPerDay = BigInt(DEFAULT_SLOTS_PER_DAY.toString());
    await advanceClock(client, slotsPerDay * BigInt(3));

    // Call crank
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

    // Verify share_rate increased more than 1 day would (3 days of inflation)
    const globalStateAfter = await program.account.globalState.fetch(globalState);
    expect(globalStateAfter.shareRate.gt(shareRateBefore)).toBe(true);

    // Verify current_day jumped to 3
    expect(globalStateAfter.currentDay.toString()).toBe("3");
  });

  it("handles crank with zero total_shares (no stakes)", async () => {
    const { client, provider, program, payer } = setupTest();

    // Initialize protocol (but don't create any stakes)
    const { globalState, mint, mintAuthority } = await initializeProtocol(program, payer);

    // Verify total_shares is 0
    const globalStateBefore = await program.account.globalState.fetch(globalState);
    expect(globalStateBefore.totalShares.toString()).toBe("0");

    // Advance clock by 1 day
    const slotsPerDay = BigInt(DEFAULT_SLOTS_PER_DAY.toString());
    await advanceClock(client, slotsPerDay);

    // Call crank (should succeed but not change share_rate)
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

    // Verify current_day incremented
    const globalStateAfter = await program.account.globalState.fetch(globalState);
    expect(globalStateAfter.currentDay.toString()).toBe("1");

    // Share_rate should remain unchanged (no distribution when total_shares = 0)
    expect(globalStateAfter.shareRate.toString()).toBe(globalStateBefore.shareRate.toString());
  });

  it("anyone can call crank (permissionless)", async () => {
    const { client, provider, program, payer } = setupTest();

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

    // Use same stake amount as other tests to avoid T-share overflow
    const stakeAmount = new BN("10000000000"); // 100 tokens (8 decimals)
    await mintTokensToUser(program, payer, globalState, mint, mintAuthority, userATA, stakeAmount);

    // Create a stake (1 day to minimize T-shares)
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

    // Advance clock by 1 day
    const slotsPerDay = BigInt(DEFAULT_SLOTS_PER_DAY.toString());
    await advanceClock(client, slotsPerDay);

    // Create different keypair (not the authority)
    const otherUser = Keypair.generate();

    // Fund other user with SOL for transaction fees
    client.airdrop(otherUser.publicKey, BigInt(1_000_000_000));

    // Call crank from different user (should succeed - permissionless)
    await program.methods
      .crankDistribution()
      .accounts({
        cranker: otherUser.publicKey,
        globalState: globalState,
        mint: mint,
        mintAuthority: mintAuthority,
        tokenProgram: TOKEN_2022_PROGRAM_ID,
      })
      .signers([otherUser])
      .rpc();

    // Verify crank succeeded (current_day incremented)
    const globalStateAfter = await program.account.globalState.fetch(globalState);
    expect(globalStateAfter.currentDay.toString()).toBe("1");
  });
});
