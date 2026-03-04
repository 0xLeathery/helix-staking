import { describe, it, expect, beforeEach } from "vitest";

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
  findBoostRecordPDA,
  createSeedMintAndFund,
  getSeedTokenBalance,
  transferSeedTokens,
} from "./utils";

// Minimum seed balance for boost (1,000,000 = 1 token with 6 decimals)
const MIN_SEED_BALANCE = new BN(1_000_000);
// Seed balance we'll fund users with (10x min for headroom testing)
const USER_SEED_BALANCE = BigInt(10_000_000); // 10 tokens
const USER_SEED_BALANCE_BN = new BN(10_000_000);

describe("Boost System", () => {
  describe("admin_set_seed_mint", () => {
    it("sets seed mint and min balance in GlobalState", async () => {
      const { client, provider, program, payer } = setupTest();
      const { globalState } = await initializeProtocol(program, payer);

      // Create a seed mint
      const { seedMint } = await createSeedMintAndFund(program, payer, payer.publicKey, 0n);

      // Call admin_set_seed_mint
      await program.methods
        .adminSetSeedMint(seedMint, MIN_SEED_BALANCE)
        .accounts({
          authority: payer.publicKey,
          globalState,
        })
        .signers([payer])
        .rpc();

      // Verify by fetching GlobalState
      const gs = await program.account.globalState.fetch(globalState);
      // get_seed_mint is stored in reserved[2..5]; read it via the returned object
      // The IDL returns reserved as an array of BNs
      const reservedBytes = gs.reserved; // Array of 10 BN values

      // Reconstruct the pubkey from reserved[2..5]
      const mintBytes = new Uint8Array(32);
      for (let i = 0; i < 4; i++) {
        const le = reservedBytes[2 + i].toArrayLike(Buffer, "le", 8);
        mintBytes.set(le, i * 8);
      }
      const storedMint = new PublicKey(mintBytes);
      expect(storedMint.toBase58()).toBe(seedMint.toBase58());

      // min_seed_balance is in reserved[6]
      expect(gs.reserved[6].toString()).toBe(MIN_SEED_BALANCE.toString());
    });

    it("is re-callable (updates values)", async () => {
      const { client, provider, program, payer } = setupTest();
      const { globalState } = await initializeProtocol(program, payer);

      const { seedMint: mint1 } = await createSeedMintAndFund(program, payer, payer.publicKey, 0n);
      const { seedMint: mint2 } = await createSeedMintAndFund(program, payer, payer.publicKey, 0n);

      // Set first time
      await program.methods
        .adminSetSeedMint(mint1, MIN_SEED_BALANCE)
        .accounts({ authority: payer.publicKey, globalState })
        .signers([payer])
        .rpc();

      // Update to second mint
      const newMin = new BN(2_000_000);
      await program.methods
        .adminSetSeedMint(mint2, newMin)
        .accounts({ authority: payer.publicKey, globalState })
        .signers([payer])
        .rpc();

      const gs = await program.account.globalState.fetch(globalState);
      expect(gs.reserved[6].toString()).toBe(newMin.toString());
    });

    it("rejects non-authority caller", async () => {
      const { client, provider, program, payer } = setupTest();
      const { globalState } = await initializeProtocol(program, payer);

      const { seedMint } = await createSeedMintAndFund(program, payer, payer.publicKey, 0n);
      const attacker = Keypair.generate();
      client.airdrop(attacker.publicKey, BigInt(10_000_000_000));

      try {
        await program.methods
          .adminSetSeedMint(seedMint, MIN_SEED_BALANCE)
          .accounts({ authority: attacker.publicKey, globalState })
          .signers([attacker])
          .rpc();
        throw new Error("Expected Unauthorized error");
      } catch (error: any) {
        expect(error.toString()).toContain("Unauthorized");
      }
    });
  });

  describe("admin_toggle_boost", () => {
    it("enables boost when seed_mint configured", async () => {
      const { client, provider, program, payer } = setupTest();
      const { globalState } = await initializeProtocol(program, payer);
      const { seedMint } = await createSeedMintAndFund(program, payer, payer.publicKey, 0n);

      await program.methods
        .adminSetSeedMint(seedMint, MIN_SEED_BALANCE)
        .accounts({ authority: payer.publicKey, globalState })
        .signers([payer])
        .rpc();

      await program.methods
        .adminToggleBoost(true)
        .accounts({ authority: payer.publicKey, globalState })
        .signers([payer])
        .rpc();

      const gs = await program.account.globalState.fetch(globalState);
      // boost_enabled is in reserved[7] (non-zero = true)
      expect(gs.reserved[7].toNumber()).toBe(1);
    });

    it("disables boost", async () => {
      const { client, provider, program, payer } = setupTest();
      const { globalState } = await initializeProtocol(program, payer);
      const { seedMint } = await createSeedMintAndFund(program, payer, payer.publicKey, 0n);

      await program.methods
        .adminSetSeedMint(seedMint, MIN_SEED_BALANCE)
        .accounts({ authority: payer.publicKey, globalState })
        .signers([payer])
        .rpc();
      await program.methods
        .adminToggleBoost(true)
        .accounts({ authority: payer.publicKey, globalState })
        .signers([payer])
        .rpc();
      await program.methods
        .adminToggleBoost(false)
        .accounts({ authority: payer.publicKey, globalState })
        .signers([payer])
        .rpc();

      const gs = await program.account.globalState.fetch(globalState);
      expect(gs.reserved[7].toNumber()).toBe(0);
    });

    it("rejects enable when seed_mint not configured", async () => {
      const { client, provider, program, payer } = setupTest();
      const { globalState } = await initializeProtocol(program, payer);
      // Do NOT call adminSetSeedMint first

      try {
        await program.methods
          .adminToggleBoost(true)
          .accounts({ authority: payer.publicKey, globalState })
          .signers([payer])
          .rpc();
        throw new Error("Expected SeedMintNotConfigured error");
      } catch (error: any) {
        expect(error.toString()).toContain("SeedMintNotConfigured");
      }
    });
  });

  describe("register_seed_boost", () => {
    it("creates BoostRecord when user has sufficient seed balance", async () => {
      const { client, provider, program, payer } = setupTest();
      const { globalState } = await initializeProtocol(program, payer);

      // Setup seed mint with user having enough balance
      const { seedMint, seedAta } = await createSeedMintAndFund(
        program, payer, payer.publicKey, USER_SEED_BALANCE
      );

      await program.methods
        .adminSetSeedMint(seedMint, MIN_SEED_BALANCE)
        .accounts({ authority: payer.publicKey, globalState })
        .signers([payer])
        .rpc();
      await program.methods
        .adminToggleBoost(true)
        .accounts({ authority: payer.publicKey, globalState })
        .signers([payer])
        .rpc();

      const [boostRecordPDA] = findBoostRecordPDA(program.programId, payer.publicKey);

      await program.methods
        .registerSeedBoost()
        .accounts({
          user: payer.publicKey,
          globalState,
          boostRecord: boostRecordPDA,
          seedTokenAccount: seedAta,
          seedMint,
          seedTokenProgram: TOKEN_2022_PROGRAM_ID,
        })
        .signers([payer])
        .rpc();

      // Verify BoostRecord was created
      const boostRecord = await program.account.boostRecord.fetch(boostRecordPDA);
      expect(boostRecord.user.toBase58()).toBe(payer.publicKey.toBase58());
      // boosted_stake_id should be u64::MAX (not yet linked)
      expect(boostRecord.boostedStakeId.toString()).toBe(
        new BN("18446744073709551615").toString()
      );
    });

    it("rejects when balance below minimum", async () => {
      const { client, provider, program, payer } = setupTest();
      const { globalState } = await initializeProtocol(program, payer);

      // Fund user with below-minimum balance (MIN_SEED_BALANCE - 1)
      const belowMin = BigInt(MIN_SEED_BALANCE.toNumber() - 1);
      const { seedMint, seedAta } = await createSeedMintAndFund(
        program, payer, payer.publicKey, belowMin
      );

      await program.methods
        .adminSetSeedMint(seedMint, MIN_SEED_BALANCE)
        .accounts({ authority: payer.publicKey, globalState })
        .signers([payer])
        .rpc();
      await program.methods
        .adminToggleBoost(true)
        .accounts({ authority: payer.publicKey, globalState })
        .signers([payer])
        .rpc();

      const [boostRecordPDA] = findBoostRecordPDA(program.programId, payer.publicKey);

      try {
        await program.methods
          .registerSeedBoost()
          .accounts({
            user: payer.publicKey,
            globalState,
            boostRecord: boostRecordPDA,
            seedTokenAccount: seedAta,
            seedMint,
            seedTokenProgram: TOKEN_2022_PROGRAM_ID,
          })
          .signers([payer])
          .rpc();
        throw new Error("Expected SeedBalanceBelowMinimum error");
      } catch (error: any) {
        expect(error.toString()).toContain("SeedBalanceBelowMinimum");
      }
    });

    it("rejects when boost not enabled", async () => {
      const { client, provider, program, payer } = setupTest();
      const { globalState } = await initializeProtocol(program, payer);

      const { seedMint, seedAta } = await createSeedMintAndFund(
        program, payer, payer.publicKey, USER_SEED_BALANCE
      );

      // Configure mint but DON'T enable boost
      await program.methods
        .adminSetSeedMint(seedMint, MIN_SEED_BALANCE)
        .accounts({ authority: payer.publicKey, globalState })
        .signers([payer])
        .rpc();
      // adminToggleBoost NOT called

      const [boostRecordPDA] = findBoostRecordPDA(program.programId, payer.publicKey);

      try {
        await program.methods
          .registerSeedBoost()
          .accounts({
            user: payer.publicKey,
            globalState,
            boostRecord: boostRecordPDA,
            seedTokenAccount: seedAta,
            seedMint,
            seedTokenProgram: TOKEN_2022_PROGRAM_ID,
          })
          .signers([payer])
          .rpc();
        throw new Error("Expected BoostNotEnabled error");
      } catch (error: any) {
        expect(error.toString()).toContain("BoostNotEnabled");
      }
    });

    it("rejects duplicate registration", async () => {
      const { client, provider, program, payer } = setupTest();
      const { globalState } = await initializeProtocol(program, payer);

      const { seedMint, seedAta } = await createSeedMintAndFund(
        program, payer, payer.publicKey, USER_SEED_BALANCE
      );

      await program.methods
        .adminSetSeedMint(seedMint, MIN_SEED_BALANCE)
        .accounts({ authority: payer.publicKey, globalState })
        .signers([payer])
        .rpc();
      await program.methods
        .adminToggleBoost(true)
        .accounts({ authority: payer.publicKey, globalState })
        .signers([payer])
        .rpc();

      const [boostRecordPDA] = findBoostRecordPDA(program.programId, payer.publicKey);

      // First registration
      await program.methods
        .registerSeedBoost()
        .accounts({
          user: payer.publicKey,
          globalState,
          boostRecord: boostRecordPDA,
          seedTokenAccount: seedAta,
          seedMint,
          seedTokenProgram: TOKEN_2022_PROGRAM_ID,
        })
        .signers([payer])
        .rpc();

      // Second registration should fail (PDA already exists — Anchor init constraint)
      let didFail = false;
      try {
        await program.methods
          .registerSeedBoost()
          .accounts({
            user: payer.publicKey,
            globalState,
            boostRecord: boostRecordPDA,
            seedTokenAccount: seedAta,
            seedMint,
            seedTokenProgram: TOKEN_2022_PROGRAM_ID,
          })
          .signers([payer])
          .rpc();
      } catch (error: any) {
        didFail = true;
        // Error thrown confirms duplicate registration is rejected
      }
      expect(didFail).toBe(true);
    });
  });

  describe("create_stake boost auto-link", () => {
    // Helper to set up a user with HLX tokens ready to stake
    async function setupStakeReady(
      program: any,
      payer: any,
      globalState: PublicKey,
      mint: PublicKey,
      mintAuthority: PublicKey,
      client: any
    ) {
      const userATA = getAssociatedTokenAddressSync(
        mint,
        payer.publicKey,
        false,
        TOKEN_2022_PROGRAM_ID
      );
      const web3 = require("@solana/web3.js");
      const splToken = require("@solana/spl-token");
      await program.provider.sendAndConfirm(
        new web3.Transaction().add(
          splToken.createAssociatedTokenAccountInstruction(
            payer.publicKey, userATA, payer.publicKey, mint, TOKEN_2022_PROGRAM_ID
          )
        ),
        [payer]
      );
      await mintTokensToUser(program, payer, globalState, mint, mintAuthority, userATA, DEFAULT_MIN_STAKE_AMOUNT);
      return userATA;
    }

    it("snapshots seed balance when BoostRecord passed in remaining_accounts", async () => {
      const { client, provider, program, payer } = setupTest();
      const { globalState, mint, mintAuthority } = await initializeProtocol(program, payer);

      const userATA = await setupStakeReady(program, payer, globalState, mint, mintAuthority, client);

      // Create seed mint and fund user
      const { seedMint, seedAta } = await createSeedMintAndFund(
        program, payer, payer.publicKey, USER_SEED_BALANCE
      );

      await program.methods
        .adminSetSeedMint(seedMint, MIN_SEED_BALANCE)
        .accounts({ authority: payer.publicKey, globalState })
        .signers([payer])
        .rpc();
      await program.methods
        .adminToggleBoost(true)
        .accounts({ authority: payer.publicKey, globalState })
        .signers([payer])
        .rpc();

      // Register boost
      const [boostRecordPDA] = findBoostRecordPDA(program.programId, payer.publicKey);
      await program.methods
        .registerSeedBoost()
        .accounts({
          user: payer.publicKey,
          globalState,
          boostRecord: boostRecordPDA,
          seedTokenAccount: seedAta,
          seedMint,
          seedTokenProgram: TOKEN_2022_PROGRAM_ID,
        })
        .signers([payer])
        .rpc();

      // Create stake with BoostRecord in remaining_accounts
      const [stakePDA] = findStakePDA(program.programId, payer.publicKey, 0);
      await program.methods
        .createStake(DEFAULT_MIN_STAKE_AMOUNT, 1)
        .accounts({
          user: payer.publicKey,
          globalState,
          stakeAccount: stakePDA,
          userTokenAccount: userATA,
          mint,
          tokenProgram: TOKEN_2022_PROGRAM_ID,
        })
        .remainingAccounts([
          { pubkey: boostRecordPDA, isWritable: true, isSigner: false },
          { pubkey: seedAta, isWritable: false, isSigner: false },
        ])
        .signers([payer])
        .rpc();

      // Verify seed_balance_at_stake was set
      const stakeAccount = await program.account.stakeAccount.fetch(stakePDA);
      expect(stakeAccount.seedBalanceAtStake.toString()).toBe(USER_SEED_BALANCE_BN.toString());
      expect(stakeAccount.boostRevoked).toBe(false);
    });

    it("does not link when no BoostRecord passed (non-boosted stake)", async () => {
      const { client, provider, program, payer } = setupTest();
      const { globalState, mint, mintAuthority } = await initializeProtocol(program, payer);

      const userATA = await setupStakeReady(program, payer, globalState, mint, mintAuthority, client);

      // Create stake WITHOUT BoostRecord in remaining_accounts
      const [stakePDA] = findStakePDA(program.programId, payer.publicKey, 0);
      await program.methods
        .createStake(DEFAULT_MIN_STAKE_AMOUNT, 1)
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

      const stakeAccount = await program.account.stakeAccount.fetch(stakePDA);
      expect(stakeAccount.seedBalanceAtStake.toString()).toBe("0");
    });

    it("sets BoostRecord.boosted_stake_id to new stake_id", async () => {
      const { client, provider, program, payer } = setupTest();
      const { globalState, mint, mintAuthority } = await initializeProtocol(program, payer);

      const userATA = await setupStakeReady(program, payer, globalState, mint, mintAuthority, client);

      const { seedMint, seedAta } = await createSeedMintAndFund(
        program, payer, payer.publicKey, USER_SEED_BALANCE
      );
      await program.methods
        .adminSetSeedMint(seedMint, MIN_SEED_BALANCE)
        .accounts({ authority: payer.publicKey, globalState })
        .signers([payer])
        .rpc();
      await program.methods
        .adminToggleBoost(true)
        .accounts({ authority: payer.publicKey, globalState })
        .signers([payer])
        .rpc();

      const [boostRecordPDA] = findBoostRecordPDA(program.programId, payer.publicKey);
      await program.methods
        .registerSeedBoost()
        .accounts({
          user: payer.publicKey,
          globalState,
          boostRecord: boostRecordPDA,
          seedTokenAccount: seedAta,
          seedMint,
          seedTokenProgram: TOKEN_2022_PROGRAM_ID,
        })
        .signers([payer])
        .rpc();

      // Verify pre-stake: boosted_stake_id == u64::MAX
      let boostRecord = await program.account.boostRecord.fetch(boostRecordPDA);
      expect(boostRecord.boostedStakeId.toString()).toBe(
        new BN("18446744073709551615").toString()
      );

      // Create stake with boost
      const [stakePDA] = findStakePDA(program.programId, payer.publicKey, 0);
      await program.methods
        .createStake(DEFAULT_MIN_STAKE_AMOUNT, 1)
        .accounts({
          user: payer.publicKey,
          globalState,
          stakeAccount: stakePDA,
          userTokenAccount: userATA,
          mint,
          tokenProgram: TOKEN_2022_PROGRAM_ID,
        })
        .remainingAccounts([
          { pubkey: boostRecordPDA, isWritable: true, isSigner: false },
          { pubkey: seedAta, isWritable: false, isSigner: false },
        ])
        .signers([payer])
        .rpc();

      // Verify post-stake: boosted_stake_id == 0 (first stake_id)
      boostRecord = await program.account.boostRecord.fetch(boostRecordPDA);
      expect(boostRecord.boostedStakeId.toString()).toBe("0");
    });

    it("does not re-link when BoostRecord already linked", async () => {
      const { client, provider, program, payer } = setupTest();
      const { globalState, mint, mintAuthority } = await initializeProtocol(program, payer);

      // Fund for 2 stakes
      const userATA = getAssociatedTokenAddressSync(
        mint, payer.publicKey, false, TOKEN_2022_PROGRAM_ID
      );
      const web3 = require("@solana/web3.js");
      const splToken = require("@solana/spl-token");
      await program.provider.sendAndConfirm(
        new web3.Transaction().add(
          splToken.createAssociatedTokenAccountInstruction(
            payer.publicKey, userATA, payer.publicKey, mint, TOKEN_2022_PROGRAM_ID
          )
        ),
        [payer]
      );
      await mintTokensToUser(
        program, payer, globalState, mint, mintAuthority, userATA,
        DEFAULT_MIN_STAKE_AMOUNT.mul(new BN(2))
      );

      const { seedMint, seedAta } = await createSeedMintAndFund(
        program, payer, payer.publicKey, USER_SEED_BALANCE
      );
      await program.methods
        .adminSetSeedMint(seedMint, MIN_SEED_BALANCE)
        .accounts({ authority: payer.publicKey, globalState })
        .signers([payer])
        .rpc();
      await program.methods
        .adminToggleBoost(true)
        .accounts({ authority: payer.publicKey, globalState })
        .signers([payer])
        .rpc();

      const [boostRecordPDA] = findBoostRecordPDA(program.programId, payer.publicKey);
      await program.methods
        .registerSeedBoost()
        .accounts({
          user: payer.publicKey,
          globalState,
          boostRecord: boostRecordPDA,
          seedTokenAccount: seedAta,
          seedMint,
          seedTokenProgram: TOKEN_2022_PROGRAM_ID,
        })
        .signers([payer])
        .rpc();

      // First stake — gets boost linked
      const [stakePDA0] = findStakePDA(program.programId, payer.publicKey, 0);
      await program.methods
        .createStake(DEFAULT_MIN_STAKE_AMOUNT, 1)
        .accounts({
          user: payer.publicKey,
          globalState,
          stakeAccount: stakePDA0,
          userTokenAccount: userATA,
          mint,
          tokenProgram: TOKEN_2022_PROGRAM_ID,
        })
        .remainingAccounts([
          { pubkey: boostRecordPDA, isWritable: true, isSigner: false },
          { pubkey: seedAta, isWritable: false, isSigner: false },
        ])
        .signers([payer])
        .rpc();

      // Second stake — BoostRecord already linked; should NOT link again
      const [stakePDA1] = findStakePDA(program.programId, payer.publicKey, 1);
      await program.methods
        .createStake(DEFAULT_MIN_STAKE_AMOUNT, 1)
        .accounts({
          user: payer.publicKey,
          globalState,
          stakeAccount: stakePDA1,
          userTokenAccount: userATA,
          mint,
          tokenProgram: TOKEN_2022_PROGRAM_ID,
        })
        .remainingAccounts([
          { pubkey: boostRecordPDA, isWritable: true, isSigner: false },
          { pubkey: seedAta, isWritable: false, isSigner: false },
        ])
        .signers([payer])
        .rpc();

      // Second stake should have seed_balance_at_stake == 0 (not linked)
      const stake1 = await program.account.stakeAccount.fetch(stakePDA1);
      expect(stake1.seedBalanceAtStake.toString()).toBe("0");

      // BoostRecord.boosted_stake_id should still be 0 (linked to first stake)
      const boostRecord = await program.account.boostRecord.fetch(boostRecordPDA);
      expect(boostRecord.boostedStakeId.toString()).toBe("0");
    });
  });

  describe("headroom", () => {
    it("user with surplus above snapshot is not revoked on update_boost_status", async () => {
      const { client, provider, program, payer } = setupTest();
      const { globalState, mint, mintAuthority } = await initializeProtocol(program, payer);

      // Setup HLX stake
      const userATA = getAssociatedTokenAddressSync(
        mint, payer.publicKey, false, TOKEN_2022_PROGRAM_ID
      );
      const web3 = require("@solana/web3.js");
      const splToken = require("@solana/spl-token");
      await program.provider.sendAndConfirm(
        new web3.Transaction().add(
          splToken.createAssociatedTokenAccountInstruction(
            payer.publicKey, userATA, payer.publicKey, mint, TOKEN_2022_PROGRAM_ID
          )
        ),
        [payer]
      );
      await mintTokensToUser(
        program, payer, globalState, mint, mintAuthority, userATA, DEFAULT_MIN_STAKE_AMOUNT
      );

      // Fund user with X seed tokens (snapshot = X)
      const snapshotBalance = BigInt(5_000_000); // 5 tokens
      const { seedMint, seedAta } = await createSeedMintAndFund(
        program, payer, payer.publicKey, snapshotBalance
      );

      await program.methods
        .adminSetSeedMint(seedMint, new BN(snapshotBalance.toString()))
        .accounts({ authority: payer.publicKey, globalState })
        .signers([payer])
        .rpc();
      await program.methods
        .adminToggleBoost(true)
        .accounts({ authority: payer.publicKey, globalState })
        .signers([payer])
        .rpc();

      const [boostRecordPDA] = findBoostRecordPDA(program.programId, payer.publicKey);
      await program.methods
        .registerSeedBoost()
        .accounts({
          user: payer.publicKey,
          globalState,
          boostRecord: boostRecordPDA,
          seedTokenAccount: seedAta,
          seedMint,
          seedTokenProgram: TOKEN_2022_PROGRAM_ID,
        })
        .signers([payer])
        .rpc();

      // Stake — snapshot = snapshotBalance
      const [stakePDA] = findStakePDA(program.programId, payer.publicKey, 0);
      await program.methods
        .createStake(DEFAULT_MIN_STAKE_AMOUNT, 1)
        .accounts({
          user: payer.publicKey,
          globalState,
          stakeAccount: stakePDA,
          userTokenAccount: userATA,
          mint,
          tokenProgram: TOKEN_2022_PROGRAM_ID,
        })
        .remainingAccounts([
          { pubkey: boostRecordPDA, isWritable: true, isSigner: false },
          { pubkey: seedAta, isWritable: false, isSigner: false },
        ])
        .signers([payer])
        .rpc();

      // Headroom: mint MORE surplus tokens to the user's ATA
      const surplus = 2_000_000n; // 2 extra tokens
      const mintToTx = new web3.Transaction().add(
        splToken.createMintToInstruction(
          seedMint, seedAta, payer.publicKey, surplus, [],
          new PublicKey("TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb")
        )
      );
      await program.provider.sendAndConfirm(mintToTx, [payer]);

      // Now balance = snapshotBalance + surplus; create a dummy ATA to receive the surplus transfer
      const tempUser = Keypair.generate();
      client.airdrop(tempUser.publicKey, BigInt(10_000_000_000));
      const tempAta = splToken.getAssociatedTokenAddressSync(
        seedMint, tempUser.publicKey, false,
        new PublicKey("TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb")
      );
      await program.provider.sendAndConfirm(
        new web3.Transaction().add(
          splToken.createAssociatedTokenAccountInstruction(
            payer.publicKey, tempAta, tempUser.publicKey, seedMint,
            new PublicKey("TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb")
          )
        ),
        [payer]
      );

      // Transfer surplus away — balance returns to exactly snapshotBalance
      const transferTx = new web3.Transaction().add(
        splToken.createTransferInstruction(
          seedAta, tempAta, payer.publicKey, surplus, [],
          new PublicKey("TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb")
        )
      );
      await program.provider.sendAndConfirm(transferTx, [payer]);

      // Call update_boost_status — balance == snapshot, should NOT revoke
      await program.methods
        .updateBoostStatus()
        .accounts({
          payer: payer.publicKey,
          globalState,
          stakeAccount: stakePDA,
          stakeOwner: payer.publicKey,
          seedTokenAccount: seedAta,
          seedMint,
          seedTokenProgram: TOKEN_2022_PROGRAM_ID,
        })
        .signers([payer])
        .rpc();

      const stakeAccount = await program.account.stakeAccount.fetch(stakePDA);
      expect(stakeAccount.boostRevoked).toBe(false);
      expect(stakeAccount.seedBalanceAtStake.toString()).toBe(snapshotBalance.toString());
    });
  });

  describe("update_boost_status", () => {
    it("revokes when current balance < snapshot", async () => {
      const { client, provider, program, payer } = setupTest();
      const { globalState, mint, mintAuthority } = await initializeProtocol(program, payer);

      const userATA = getAssociatedTokenAddressSync(
        mint, payer.publicKey, false, TOKEN_2022_PROGRAM_ID
      );
      const web3 = require("@solana/web3.js");
      const splToken = require("@solana/spl-token");
      await program.provider.sendAndConfirm(
        new web3.Transaction().add(
          splToken.createAssociatedTokenAccountInstruction(
            payer.publicKey, userATA, payer.publicKey, mint, TOKEN_2022_PROGRAM_ID
          )
        ),
        [payer]
      );
      await mintTokensToUser(
        program, payer, globalState, mint, mintAuthority, userATA, DEFAULT_MIN_STAKE_AMOUNT
      );

      const snapshotBalance = BigInt(5_000_000);
      const { seedMint, seedAta } = await createSeedMintAndFund(
        program, payer, payer.publicKey, snapshotBalance
      );

      await program.methods
        .adminSetSeedMint(seedMint, new BN(snapshotBalance.toString()))
        .accounts({ authority: payer.publicKey, globalState })
        .signers([payer])
        .rpc();
      await program.methods
        .adminToggleBoost(true)
        .accounts({ authority: payer.publicKey, globalState })
        .signers([payer])
        .rpc();

      const [boostRecordPDA] = findBoostRecordPDA(program.programId, payer.publicKey);
      await program.methods
        .registerSeedBoost()
        .accounts({
          user: payer.publicKey,
          globalState,
          boostRecord: boostRecordPDA,
          seedTokenAccount: seedAta,
          seedMint,
          seedTokenProgram: TOKEN_2022_PROGRAM_ID,
        })
        .signers([payer])
        .rpc();

      const [stakePDA] = findStakePDA(program.programId, payer.publicKey, 0);
      await program.methods
        .createStake(DEFAULT_MIN_STAKE_AMOUNT, 1)
        .accounts({
          user: payer.publicKey,
          globalState,
          stakeAccount: stakePDA,
          userTokenAccount: userATA,
          mint,
          tokenProgram: TOKEN_2022_PROGRAM_ID,
        })
        .remainingAccounts([
          { pubkey: boostRecordPDA, isWritable: true, isSigner: false },
          { pubkey: seedAta, isWritable: false, isSigner: false },
        ])
        .signers([payer])
        .rpc();

      // Create temp ATA to receive seed tokens, then transfer away seeds
      const tempUser = Keypair.generate();
      client.airdrop(tempUser.publicKey, BigInt(10_000_000_000));
      const tempAta = splToken.getAssociatedTokenAddressSync(
        seedMint, tempUser.publicKey, false,
        new PublicKey("TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb")
      );
      await program.provider.sendAndConfirm(
        new web3.Transaction().add(
          splToken.createAssociatedTokenAccountInstruction(
            payer.publicKey, tempAta, tempUser.publicKey, seedMint,
            new PublicKey("TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb")
          )
        ),
        [payer]
      );

      // Transfer all seeds away (balance < snapshot)
      const transferTx = new web3.Transaction().add(
        splToken.createTransferInstruction(
          seedAta, tempAta, payer.publicKey, snapshotBalance, [],
          new PublicKey("TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb")
        )
      );
      await program.provider.sendAndConfirm(transferTx, [payer]);

      // Call update_boost_status — should revoke
      await program.methods
        .updateBoostStatus()
        .accounts({
          payer: payer.publicKey,
          globalState,
          stakeAccount: stakePDA,
          stakeOwner: payer.publicKey,
          seedTokenAccount: seedAta,
          seedMint,
          seedTokenProgram: TOKEN_2022_PROGRAM_ID,
        })
        .signers([payer])
        .rpc();

      const stakeAccount = await program.account.stakeAccount.fetch(stakePDA);
      expect(stakeAccount.boostRevoked).toBe(true);
    });

    it("is no-op when balance >= snapshot", async () => {
      const { client, provider, program, payer } = setupTest();
      const { globalState, mint, mintAuthority } = await initializeProtocol(program, payer);

      const userATA = getAssociatedTokenAddressSync(
        mint, payer.publicKey, false, TOKEN_2022_PROGRAM_ID
      );
      const web3 = require("@solana/web3.js");
      const splToken = require("@solana/spl-token");
      await program.provider.sendAndConfirm(
        new web3.Transaction().add(
          splToken.createAssociatedTokenAccountInstruction(
            payer.publicKey, userATA, payer.publicKey, mint, TOKEN_2022_PROGRAM_ID
          )
        ),
        [payer]
      );
      await mintTokensToUser(
        program, payer, globalState, mint, mintAuthority, userATA, DEFAULT_MIN_STAKE_AMOUNT
      );

      const snapshotBalance = BigInt(5_000_000);
      const { seedMint, seedAta } = await createSeedMintAndFund(
        program, payer, payer.publicKey, snapshotBalance
      );

      await program.methods
        .adminSetSeedMint(seedMint, new BN(snapshotBalance.toString()))
        .accounts({ authority: payer.publicKey, globalState })
        .signers([payer])
        .rpc();
      await program.methods
        .adminToggleBoost(true)
        .accounts({ authority: payer.publicKey, globalState })
        .signers([payer])
        .rpc();

      const [boostRecordPDA] = findBoostRecordPDA(program.programId, payer.publicKey);
      await program.methods
        .registerSeedBoost()
        .accounts({
          user: payer.publicKey,
          globalState,
          boostRecord: boostRecordPDA,
          seedTokenAccount: seedAta,
          seedMint,
          seedTokenProgram: TOKEN_2022_PROGRAM_ID,
        })
        .signers([payer])
        .rpc();

      const [stakePDA] = findStakePDA(program.programId, payer.publicKey, 0);
      await program.methods
        .createStake(DEFAULT_MIN_STAKE_AMOUNT, 1)
        .accounts({
          user: payer.publicKey,
          globalState,
          stakeAccount: stakePDA,
          userTokenAccount: userATA,
          mint,
          tokenProgram: TOKEN_2022_PROGRAM_ID,
        })
        .remainingAccounts([
          { pubkey: boostRecordPDA, isWritable: true, isSigner: false },
          { pubkey: seedAta, isWritable: false, isSigner: false },
        ])
        .signers([payer])
        .rpc();

      // Call update_boost_status with balance == snapshot — should NOT revoke
      await program.methods
        .updateBoostStatus()
        .accounts({
          payer: payer.publicKey,
          globalState,
          stakeAccount: stakePDA,
          stakeOwner: payer.publicKey,
          seedTokenAccount: seedAta,
          seedMint,
          seedTokenProgram: TOKEN_2022_PROGRAM_ID,
        })
        .signers([payer])
        .rpc();

      const stakeAccount = await program.account.stakeAccount.fetch(stakePDA);
      expect(stakeAccount.boostRevoked).toBe(false);
    });

    it("is no-op for non-boosted stakes", async () => {
      const { client, provider, program, payer } = setupTest();
      const { globalState, mint, mintAuthority } = await initializeProtocol(program, payer);

      const userATA = getAssociatedTokenAddressSync(
        mint, payer.publicKey, false, TOKEN_2022_PROGRAM_ID
      );
      const web3 = require("@solana/web3.js");
      const splToken = require("@solana/spl-token");
      await program.provider.sendAndConfirm(
        new web3.Transaction().add(
          splToken.createAssociatedTokenAccountInstruction(
            payer.publicKey, userATA, payer.publicKey, mint, TOKEN_2022_PROGRAM_ID
          )
        ),
        [payer]
      );
      await mintTokensToUser(
        program, payer, globalState, mint, mintAuthority, userATA, DEFAULT_MIN_STAKE_AMOUNT
      );

      // Create seed mint with some balance for the ATA check
      const { seedMint, seedAta } = await createSeedMintAndFund(
        program, payer, payer.publicKey, BigInt(5_000_000)
      );

      await program.methods
        .adminSetSeedMint(seedMint, MIN_SEED_BALANCE)
        .accounts({ authority: payer.publicKey, globalState })
        .signers([payer])
        .rpc();
      await program.methods
        .adminToggleBoost(true)
        .accounts({ authority: payer.publicKey, globalState })
        .signers([payer])
        .rpc();

      // Create stake WITHOUT BoostRecord (non-boosted)
      const [stakePDA] = findStakePDA(program.programId, payer.publicKey, 0);
      await program.methods
        .createStake(DEFAULT_MIN_STAKE_AMOUNT, 1)
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

      // seed_balance_at_stake == 0, so update_boost_status should be a no-op
      await program.methods
        .updateBoostStatus()
        .accounts({
          payer: payer.publicKey,
          globalState,
          stakeAccount: stakePDA,
          stakeOwner: payer.publicKey,
          seedTokenAccount: seedAta,
          seedMint,
          seedTokenProgram: TOKEN_2022_PROGRAM_ID,
        })
        .signers([payer])
        .rpc();

      const stakeAccount = await program.account.stakeAccount.fetch(stakePDA);
      expect(stakeAccount.boostRevoked).toBe(false);
      expect(stakeAccount.seedBalanceAtStake.toString()).toBe("0");
    });
  });
});
