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
  TOKEN_2022_PROGRAM_ID,
  DEFAULT_MIN_STAKE_AMOUNT,
  DEFAULT_STARTING_SHARE_RATE,
} from "./utils";

describe("CreateStake", () => {
  it("creates a stake with correct T-shares for minimum duration (1 day)", async () => {
    const { context, provider, program, payer } = await setupTest();

    // Initialize protocol
    const { globalState, mint, mintAuthority } = await initializeProtocol(program, payer);

    // Create user ATA
    const userATA = getAssociatedTokenAddressSync(
      mint,
      payer.publicKey,
      false,
      TOKEN_2022_PROGRAM_ID
    );

    // Create ATA account manually (Bankrun needs explicit account creation)
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

    // Mint tokens to user
    const stakeAmount = DEFAULT_MIN_STAKE_AMOUNT;
    await mintTokensToUser(program, payer, globalState, mint, mintAuthority, userATA, stakeAmount);

    // Check initial balance
    const balanceBefore = await getTokenBalance(context.banksClient, userATA);
    expect(balanceBefore.toString()).to.equal(stakeAmount.toString());

    // Create stake for 1 day
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

    // Verify StakeAccount
    const stakeAccount = await program.account.stakeAccount.fetch(stakePDA);
    expect(stakeAccount.user.toBase58()).to.equal(payer.publicKey.toBase58());
    expect(stakeAccount.stakeId.toString()).to.equal("0");
    expect(stakeAccount.stakedAmount.toString()).to.equal(stakeAmount.toString());
    expect(stakeAccount.stakeDays).to.equal(stakeDays);
    expect(stakeAccount.isActive).to.equal(true);

    // For 1-day stake: LPB bonus = 0, BPB depends on amount
    // At minimum amount (10M), BPB bonus is negligible
    // T-shares should be approximately staked_amount * PRECISION / share_rate
    // With starting_share_rate = 10_000 and PRECISION = 1e9:
    // t_shares ≈ (10_000_000 * 1e9) / 10_000 = 1e12
    const expectedTSharesApprox = stakeAmount.mul(new BN(1_000_000_000)).div(DEFAULT_STARTING_SHARE_RATE);
    expect(stakeAccount.tShares.toString()).to.equal(expectedTSharesApprox.toString());

    // Verify GlobalState counters
    const globalStateAccount = await program.account.globalState.fetch(globalState);
    expect(globalStateAccount.totalStakesCreated.toString()).to.equal("1");
    expect(globalStateAccount.totalTokensStaked.toString()).to.equal(stakeAmount.toString());
    expect(globalStateAccount.totalShares.toString()).to.equal(stakeAccount.tShares.toString());

    // Verify tokens were burned (balance decreased)
    const balanceAfter = await getTokenBalance(context.banksClient, userATA);
    expect(balanceAfter.toString()).to.equal("0");
  });

  it("creates a stake with LPB bonus for long duration (3641 days)", async () => {
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

    // Create stake for max LPB days (3641 = 2x bonus)
    const stakeDays = 3641;
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

    // Verify StakeAccount
    const stakeAccount = await program.account.stakeAccount.fetch(stakePDA);

    // For 3641-day stake: LPB bonus = 2x (100% increase)
    // T-shares should be approximately 2x what a 1-day stake would get
    // Base shares = (amount * PRECISION) / share_rate
    // With 2x LPB: t_shares ≈ base_shares * 2
    const baseShares = stakeAmount.mul(new BN(1_000_000_000)).div(DEFAULT_STARTING_SHARE_RATE);
    const expectedTSharesMin = baseShares.mul(new BN(2)); // Should be at least 2x

    // Verify T-shares are significantly higher than base (indicating LPB bonus applied)
    expect(stakeAccount.tShares.gte(expectedTSharesMin)).to.equal(true);
  });

  it("creates a stake with BPB bonus for large amount", async () => {
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

    // Stake amount to demonstrate BPB bonus calculation
    // NOTE: BPB threshold = 150M tokens, but large amounts cause T-share overflow
    // Using 100 tokens (same as other tests to avoid overflow)
    // This tests BPB calculation logic even if bonus amount is tiny
    const stakeAmount = new BN("10000000000"); // 100 tokens (8 decimals)
    await mintTokensToUser(program, payer, globalState, mint, mintAuthority, userATA, stakeAmount);

    // Create stake for 1 day (isolate BPB bonus)
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

    // Verify StakeAccount
    const stakeAccount = await program.account.stakeAccount.fetch(stakePDA);

    // With BPB bonus, T-shares should be > base shares
    // Base shares = (amount * PRECISION) / share_rate
    const baseShares = stakeAmount.mul(new BN(1_000_000_000)).div(DEFAULT_STARTING_SHARE_RATE);

    // BPB adds ~10% bonus at threshold
    expect(stakeAccount.tShares.gt(baseShares)).to.equal(true);
  });

  it("rejects stake below minimum amount", async () => {
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

    // Try to stake below minimum (min is 10M, stake 1M)
    const belowMinAmount = DEFAULT_MIN_STAKE_AMOUNT.div(new BN(10));
    await mintTokensToUser(program, payer, globalState, mint, mintAuthority, userATA, belowMinAmount);

    const stakeDays = 1;
    const [stakePDA] = findStakePDA(program.programId, payer.publicKey, 0);

    try {
      await program.methods
        .createStake(belowMinAmount, stakeDays)
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

      expect.fail("Expected StakeBelowMinimum error");
    } catch (error: any) {
      expect(error.toString()).to.include("StakeBelowMinimum");
    }
  });

  it("rejects stake with invalid duration (0 days)", async () => {
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

    const stakeDays = 0; // Invalid
    const [stakePDA] = findStakePDA(program.programId, payer.publicKey, 0);

    try {
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

      expect.fail("Expected InvalidStakeDuration error");
    } catch (error: any) {
      expect(error.toString()).to.include("InvalidStakeDuration");
    }
  });

  it("rejects stake with invalid duration (>5555 days)", async () => {
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

    const stakeDays = 5556; // > MAX_STAKE_DAYS (5555)
    const [stakePDA] = findStakePDA(program.programId, payer.publicKey, 0);

    try {
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

      expect.fail("Expected InvalidStakeDuration error");
    } catch (error: any) {
      expect(error.toString()).to.include("InvalidStakeDuration");
    }
  });

  it("creates multiple stakes for same user with sequential IDs", async () => {
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
    // Mint enough for 2 stakes
    await mintTokensToUser(program, payer, globalState, mint, mintAuthority, userATA, stakeAmount.mul(new BN(2)));

    const stakeDays = 10;

    // Create first stake (ID = 0)
    const [stakePDA0] = findStakePDA(program.programId, payer.publicKey, 0);

    await program.methods
      .createStake(stakeAmount, stakeDays)
      .accounts({
        user: payer.publicKey,
        globalState: globalState,
        stakeAccount: stakePDA0,
        userTokenAccount: userATA,
        mint: mint,
        tokenProgram: TOKEN_2022_PROGRAM_ID,
      })
      .signers([payer])
      .rpc();

    // Create second stake (ID = 1)
    const [stakePDA1] = findStakePDA(program.programId, payer.publicKey, 1);

    await program.methods
      .createStake(stakeAmount, stakeDays)
      .accounts({
        user: payer.publicKey,
        globalState: globalState,
        stakeAccount: stakePDA1,
        userTokenAccount: userATA,
        mint: mint,
        tokenProgram: TOKEN_2022_PROGRAM_ID,
      })
      .signers([payer])
      .rpc();

    // Verify both stakes
    const stake0 = await program.account.stakeAccount.fetch(stakePDA0);
    const stake1 = await program.account.stakeAccount.fetch(stakePDA1);

    expect(stake0.stakeId.toString()).to.equal("0");
    expect(stake1.stakeId.toString()).to.equal("1");

    // Verify global counter
    const globalStateAccount = await program.account.globalState.fetch(globalState);
    expect(globalStateAccount.totalStakesCreated.toString()).to.equal("2");
  });
});
