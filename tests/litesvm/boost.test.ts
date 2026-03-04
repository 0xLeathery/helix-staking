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
  advanceClock,
  TOKEN_2022_PROGRAM_ID,
  DEFAULT_MIN_STAKE_AMOUNT,
  DEFAULT_SLOTS_PER_DAY,
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

    it("is no-op when already revoked", async () => {
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

      // Transfer all seeds away (balance drops to 0 — below snapshot)
      const transferTx = new web3.Transaction().add(
        splToken.createTransferInstruction(
          seedAta, tempAta, payer.publicKey, snapshotBalance, [],
          new PublicKey("TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb")
        )
      );
      await program.provider.sendAndConfirm(transferTx, [payer]);

      // First call — should revoke (balance < snapshot)
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

      const stakeAccountAfterFirst = await program.account.stakeAccount.fetch(stakePDA);
      expect(stakeAccountAfterFirst.boostRevoked).toBe(true);

      // Expire blockhash to prevent AlreadyProcessed rejection on the second identical call
      client.expireBlockhash();

      // Second call — should be a no-op (already revoked — idempotent)
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

      const stakeAccountAfterSecond = await program.account.stakeAccount.fetch(stakePDA);
      expect(stakeAccountAfterSecond.boostRevoked).toBe(true);
    });
  });

  // ===== Helper: Setup a full staking scenario with boost enabled =====
  // Returns everything needed to call claimRewards
  async function setupBoostedStake(
    program: any,
    payer: any,
    client: any,
    stakeAmount: BN,
    stakeDays: number,
    seedFundAmount: bigint
  ) {
    const web3 = require("@solana/web3.js");
    const splToken = require("@solana/spl-token");
    const { globalState, mint, mintAuthority } = await initializeProtocol(program, payer);

    // Create user HLX ATA and fund it
    const userATA = getAssociatedTokenAddressSync(mint, payer.publicKey, false, TOKEN_2022_PROGRAM_ID);
    await program.provider.sendAndConfirm(
      new web3.Transaction().add(
        splToken.createAssociatedTokenAccountInstruction(
          payer.publicKey, userATA, payer.publicKey, mint, TOKEN_2022_PROGRAM_ID
        )
      ),
      [payer]
    );
    await mintTokensToUser(program, payer, globalState, mint, mintAuthority, userATA, stakeAmount);

    // Create seed mint and fund user
    const { seedMint, seedAta } = await createSeedMintAndFund(
      program, payer, payer.publicKey, seedFundAmount
    );

    // Configure and enable boost
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

    // Create boosted stake
    const [stakePDA] = findStakePDA(program.programId, payer.publicKey, 0);
    await program.methods
      .createStake(stakeAmount, stakeDays)
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

    return { globalState, mint, mintAuthority, userATA, seedMint, seedAta, stakePDA, boostRecordPDA };
  }

  describe("claim_rewards boost", () => {
    it("claim_rewards boost active - mints extra tokens (BOOST-06)", async () => {
      const web3 = require("@solana/web3.js");
      const splToken = require("@solana/spl-token");

      // User A: boosted staker
      const { client: clientA, program: programA, payer: payerA } = setupTest();
      const { globalState: gsA, mint: mintA, mintAuthority: mintAuthA, userATA: userATA_A, seedMint: seedMintA, seedAta: seedAtaA, stakePDA: stakePDA_A } =
        await setupBoostedStake(programA, payerA, clientA, DEFAULT_MIN_STAKE_AMOUNT, 1, USER_SEED_BALANCE);

      // User B: non-boosted staker (same amount, same duration, same time)
      // Use a fresh env so globalState/slot/rate is identical
      const { client: clientB, program: programB, payer: payerB } = setupTest();
      const { globalState: gsB, mint: mintB, mintAuthority: mintAuthB } = await initializeProtocol(programB, payerB);
      const userATA_B = getAssociatedTokenAddressSync(mintB, payerB.publicKey, false, TOKEN_2022_PROGRAM_ID);
      await programB.provider.sendAndConfirm(
        new web3.Transaction().add(
          splToken.createAssociatedTokenAccountInstruction(
            payerB.publicKey, userATA_B, payerB.publicKey, mintB, TOKEN_2022_PROGRAM_ID
          )
        ),
        [payerB]
      );
      await mintTokensToUser(programB, payerB, gsB, mintB, mintAuthB, userATA_B, DEFAULT_MIN_STAKE_AMOUNT);
      const [stakePDA_B] = findStakePDA(programB.programId, payerB.publicKey, 0);
      await programB.methods
        .createStake(DEFAULT_MIN_STAKE_AMOUNT, 1)
        .accounts({
          user: payerB.publicKey,
          globalState: gsB,
          stakeAccount: stakePDA_B,
          userTokenAccount: userATA_B,
          mint: mintB,
          tokenProgram: TOKEN_2022_PROGRAM_ID,
        })
        .signers([payerB])
        .rpc();

      // Advance 1 day and crank on both
      const slotsPerDay = BigInt(DEFAULT_SLOTS_PER_DAY.toString());
      await advanceClock(clientA, slotsPerDay);
      await programA.methods.crankDistribution()
        .accounts({ cranker: payerA.publicKey, globalState: gsA, mint: mintA, mintAuthority: mintAuthA, tokenProgram: TOKEN_2022_PROGRAM_ID })
        .signers([payerA]).rpc();

      await advanceClock(clientB, slotsPerDay);
      await programB.methods.crankDistribution()
        .accounts({ cranker: payerB.publicKey, globalState: gsB, mint: mintB, mintAuthority: mintAuthB, tokenProgram: TOKEN_2022_PROGRAM_ID })
        .signers([payerB]).rpc();

      // User A claims WITH seed ATA (boosted)
      const balanceBeforeA = await getTokenBalance(clientA, userATA_A);
      await programA.methods.claimRewards()
        .accounts({
          user: payerA.publicKey,
          globalState: gsA,
          stakeAccount: stakePDA_A,
          userTokenAccount: userATA_A,
          mint: mintA,
          mintAuthority: mintAuthA,
          tokenProgram: TOKEN_2022_PROGRAM_ID,
        })
        .remainingAccounts([{ pubkey: seedAtaA, isSigner: false, isWritable: false }])
        .signers([payerA]).rpc();
      const balanceAfterA = await getTokenBalance(clientA, userATA_A);
      const rewardsA = new BN(balanceAfterA.toString()).sub(new BN(balanceBeforeA.toString()));

      // User B claims WITHOUT boost
      const balanceBeforeB = await getTokenBalance(clientB, userATA_B);
      await programB.methods.claimRewards()
        .accounts({
          user: payerB.publicKey,
          globalState: gsB,
          stakeAccount: stakePDA_B,
          userTokenAccount: userATA_B,
          mint: mintB,
          mintAuthority: mintAuthB,
          tokenProgram: TOKEN_2022_PROGRAM_ID,
        })
        .signers([payerB]).rpc();
      const balanceAfterB = await getTokenBalance(clientB, userATA_B);
      const rewardsB = new BN(balanceAfterB.toString()).sub(new BN(balanceBeforeB.toString()));

      // Boosted staker receives strictly more tokens (BOOST-06)
      expect(rewardsA.gt(rewardsB)).toBe(true);

      // Boosted amount should be ~10% more: rewardsA ~= rewardsB * 1.10
      // Allow small rounding: check rewardsA >= rewardsB * 1.09
      const rewardsBTimes110 = rewardsB.muln(11).divn(10);
      expect(rewardsA.gte(rewardsBTimes110)).toBe(true);
    });

    it("boost applies after loyalty, before BPD (formula: loyalty_adjusted * 1.10 + bpd)", async () => {
      const web3 = require("@solana/web3.js");
      const splToken = require("@solana/spl-token");

      // Setup boosted stake
      const { client, program, payer } = setupTest();
      const { globalState, mint, mintAuthority, userATA, seedAta, stakePDA } =
        await setupBoostedStake(program, payer, client, DEFAULT_MIN_STAKE_AMOUNT, 1, USER_SEED_BALANCE);

      // Advance 1 day and crank
      const slotsPerDay = BigInt(DEFAULT_SLOTS_PER_DAY.toString());
      await advanceClock(client, slotsPerDay);
      await program.methods.crankDistribution()
        .accounts({ cranker: payer.publicKey, globalState, mint, mintAuthority, tokenProgram: TOKEN_2022_PROGRAM_ID })
        .signers([payer]).rpc();

      // Non-boosted reference: same setup but no remaining_accounts
      const { client: clientRef, program: programRef, payer: payerRef } = setupTest();
      const { globalState: gsRef, mint: mintRef, mintAuthority: mintAuthRef } = await initializeProtocol(programRef, payerRef);
      const userATA_Ref = getAssociatedTokenAddressSync(mintRef, payerRef.publicKey, false, TOKEN_2022_PROGRAM_ID);
      await programRef.provider.sendAndConfirm(
        new web3.Transaction().add(
          splToken.createAssociatedTokenAccountInstruction(
            payerRef.publicKey, userATA_Ref, payerRef.publicKey, mintRef, TOKEN_2022_PROGRAM_ID
          )
        ),
        [payerRef]
      );
      await mintTokensToUser(programRef, payerRef, gsRef, mintRef, mintAuthRef, userATA_Ref, DEFAULT_MIN_STAKE_AMOUNT);
      const [stakePDARef] = findStakePDA(programRef.programId, payerRef.publicKey, 0);
      await programRef.methods.createStake(DEFAULT_MIN_STAKE_AMOUNT, 1)
        .accounts({ user: payerRef.publicKey, globalState: gsRef, stakeAccount: stakePDARef, userTokenAccount: userATA_Ref, mint: mintRef, tokenProgram: TOKEN_2022_PROGRAM_ID })
        .signers([payerRef]).rpc();
      await advanceClock(clientRef, slotsPerDay);
      await programRef.methods.crankDistribution()
        .accounts({ cranker: payerRef.publicKey, globalState: gsRef, mint: mintRef, mintAuthority: mintAuthRef, tokenProgram: TOKEN_2022_PROGRAM_ID })
        .signers([payerRef]).rpc();
      const balanceBeforeRef = await getTokenBalance(clientRef, userATA_Ref);
      await programRef.methods.claimRewards()
        .accounts({ user: payerRef.publicKey, globalState: gsRef, stakeAccount: stakePDARef, userTokenAccount: userATA_Ref, mint: mintRef, mintAuthority: mintAuthRef, tokenProgram: TOKEN_2022_PROGRAM_ID })
        .signers([payerRef]).rpc();
      const balanceAfterRef = await getTokenBalance(clientRef, userATA_Ref);
      const baseRewards = new BN(balanceAfterRef.toString()).sub(new BN(balanceBeforeRef.toString()));

      // Claim boosted
      const balanceBefore = await getTokenBalance(client, userATA);
      await program.methods.claimRewards()
        .accounts({ user: payer.publicKey, globalState, stakeAccount: stakePDA, userTokenAccount: userATA, mint, mintAuthority, tokenProgram: TOKEN_2022_PROGRAM_ID })
        .remainingAccounts([{ pubkey: seedAta, isSigner: false, isWritable: false }])
        .signers([payer]).rpc();
      const balanceAfter = await getTokenBalance(client, userATA);
      const boostedRewards = new BN(balanceAfter.toString()).sub(new BN(balanceBefore.toString()));

      // boostedRewards should be baseRewards * 1.10 (no BPD in this scenario)
      const expectedBoosted = baseRewards.muln(11).divn(10);
      // Allow 1-token rounding tolerance
      const diff = boostedRewards.sub(expectedBoosted).abs();
      expect(diff.lten(1)).toBe(true);
    });

    it("claim without seed ATA in remaining_accounts returns base rewards only", async () => {
      const { client, program, payer } = setupTest();
      const { globalState, mint, mintAuthority, userATA, stakePDA } =
        await setupBoostedStake(program, payer, client, DEFAULT_MIN_STAKE_AMOUNT, 1, USER_SEED_BALANCE);

      // Advance 1 day and crank
      const slotsPerDay = BigInt(DEFAULT_SLOTS_PER_DAY.toString());
      await advanceClock(client, slotsPerDay);
      await program.methods.crankDistribution()
        .accounts({ cranker: payer.publicKey, globalState, mint, mintAuthority, tokenProgram: TOKEN_2022_PROGRAM_ID })
        .signers([payer]).rpc();

      // Claim WITHOUT seed ATA in remaining_accounts
      const balanceBefore = await getTokenBalance(client, userATA);
      await program.methods.claimRewards()
        .accounts({ user: payer.publicKey, globalState, stakeAccount: stakePDA, userTokenAccount: userATA, mint, mintAuthority, tokenProgram: TOKEN_2022_PROGRAM_ID })
        .signers([payer]).rpc();
      const balanceAfter = await getTokenBalance(client, userATA);
      const rewards = new BN(balanceAfter.toString()).sub(new BN(balanceBefore.toString()));

      // Should receive rewards (not zero)
      expect(rewards.gt(new BN(0))).toBe(true);

      // boost_revoked should still be false (no revocation happened)
      const stakeAccount = await program.account.stakeAccount.fetch(stakePDA);
      expect(stakeAccount.boostRevoked).toBe(false);
    });
  });

  describe("claim_rewards boost revocation", () => {
    it("revokes when balance < snapshot at claim time (BOOST-04)", async () => {
      const web3 = require("@solana/web3.js");
      const splToken = require("@solana/spl-token");
      const { client, program, payer } = setupTest();
      const { globalState, mint, mintAuthority, userATA, seedMint, seedAta, stakePDA } =
        await setupBoostedStake(program, payer, client, DEFAULT_MIN_STAKE_AMOUNT, 1, USER_SEED_BALANCE);

      // Advance 1 day and crank to accumulate rewards
      const slotsPerDay = BigInt(DEFAULT_SLOTS_PER_DAY.toString());
      await advanceClock(client, slotsPerDay);
      await program.methods.crankDistribution()
        .accounts({ cranker: payer.publicKey, globalState, mint, mintAuthority, tokenProgram: TOKEN_2022_PROGRAM_ID })
        .signers([payer]).rpc();

      // Transfer ALL seed tokens away so balance < snapshot
      const tempUser = require("@solana/web3.js").Keypair.generate();
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
      await program.provider.sendAndConfirm(
        new web3.Transaction().add(
          splToken.createTransferInstruction(
            seedAta, tempAta, payer.publicKey, USER_SEED_BALANCE, [],
            new PublicKey("TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb")
          )
        ),
        [payer]
      );

      // Verify seed balance is now 0 (< snapshot = USER_SEED_BALANCE)
      const seedBalance = await getSeedTokenBalance(client, seedAta);
      expect(seedBalance).toBe(0n);

      // Claim with seed ATA in remaining_accounts — should revoke and return base rewards
      const balanceBefore = await getTokenBalance(client, userATA);
      await program.methods.claimRewards()
        .accounts({ user: payer.publicKey, globalState, stakeAccount: stakePDA, userTokenAccount: userATA, mint, mintAuthority, tokenProgram: TOKEN_2022_PROGRAM_ID })
        .remainingAccounts([{ pubkey: seedAta, isSigner: false, isWritable: false }])
        .signers([payer]).rpc();
      const balanceAfter = await getTokenBalance(client, userATA);
      const rewards = new BN(balanceAfter.toString()).sub(new BN(balanceBefore.toString()));

      // Should receive base rewards (not zero, but not boosted)
      expect(rewards.gt(new BN(0))).toBe(true);

      // boost_revoked must be true
      const stakeAccount = await program.account.stakeAccount.fetch(stakePDA);
      expect(stakeAccount.boostRevoked).toBe(true);
    });

    it("transaction succeeds on revocation (mints base rewards)", async () => {
      const web3 = require("@solana/web3.js");
      const splToken = require("@solana/spl-token");
      const { client, program, payer } = setupTest();
      const { globalState, mint, mintAuthority, userATA, seedMint, seedAta, stakePDA } =
        await setupBoostedStake(program, payer, client, DEFAULT_MIN_STAKE_AMOUNT, 1, USER_SEED_BALANCE);

      // Advance and crank
      const slotsPerDay = BigInt(DEFAULT_SLOTS_PER_DAY.toString());
      await advanceClock(client, slotsPerDay);
      await program.methods.crankDistribution()
        .accounts({ cranker: payer.publicKey, globalState, mint, mintAuthority, tokenProgram: TOKEN_2022_PROGRAM_ID })
        .signers([payer]).rpc();

      // Transfer ALL seed tokens away
      const tempUser = require("@solana/web3.js").Keypair.generate();
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
      await program.provider.sendAndConfirm(
        new web3.Transaction().add(
          splToken.createTransferInstruction(
            seedAta, tempAta, payer.publicKey, USER_SEED_BALANCE, [],
            new PublicKey("TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb")
          )
        ),
        [payer]
      );

      // Claim should succeed (not throw) and return base rewards
      let didSucceed = false;
      try {
        await program.methods.claimRewards()
          .accounts({ user: payer.publicKey, globalState, stakeAccount: stakePDA, userTokenAccount: userATA, mint, mintAuthority, tokenProgram: TOKEN_2022_PROGRAM_ID })
          .remainingAccounts([{ pubkey: seedAta, isSigner: false, isWritable: false }])
          .signers([payer]).rpc();
        didSucceed = true;
      } catch (e) {
        // Should not throw
      }
      expect(didSucceed).toBe(true);
    });
  });

  describe("revocation permanent (BOOST-05)", () => {
    it("boost_revoked stays true after seed repurchase and reclaim", async () => {
      const web3 = require("@solana/web3.js");
      const splToken = require("@solana/spl-token");
      const { client, program, payer } = setupTest();
      const { globalState, mint, mintAuthority, userATA, seedMint, seedAta, stakePDA } =
        await setupBoostedStake(program, payer, client, DEFAULT_MIN_STAKE_AMOUNT, 1, USER_SEED_BALANCE);

      const slotsPerDay = BigInt(DEFAULT_SLOTS_PER_DAY.toString());
      await advanceClock(client, slotsPerDay);
      await program.methods.crankDistribution()
        .accounts({ cranker: payer.publicKey, globalState, mint, mintAuthority, tokenProgram: TOKEN_2022_PROGRAM_ID })
        .signers([payer]).rpc();

      // Transfer ALL seed tokens away
      const tempUser = require("@solana/web3.js").Keypair.generate();
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
      await program.provider.sendAndConfirm(
        new web3.Transaction().add(
          splToken.createTransferInstruction(
            seedAta, tempAta, payer.publicKey, USER_SEED_BALANCE, [],
            new PublicKey("TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb")
          )
        ),
        [payer]
      );

      // First claim: revokes boost
      await program.methods.claimRewards()
        .accounts({ user: payer.publicKey, globalState, stakeAccount: stakePDA, userTokenAccount: userATA, mint, mintAuthority, tokenProgram: TOKEN_2022_PROGRAM_ID })
        .remainingAccounts([{ pubkey: seedAta, isSigner: false, isWritable: false }])
        .signers([payer]).rpc();

      const afterRevoke = await program.account.stakeAccount.fetch(stakePDA);
      expect(afterRevoke.boostRevoked).toBe(true);

      // "Repurchase" seed tokens: mint them back to user's seed ATA
      await program.provider.sendAndConfirm(
        new web3.Transaction().add(
          splToken.createMintToInstruction(
            seedMint, seedAta, payer.publicKey, USER_SEED_BALANCE, [],
            new PublicKey("TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb")
          )
        ),
        [payer]
      );

      // Verify seed balance is restored
      const seedBalanceAfter = await getSeedTokenBalance(client, seedAta);
      expect(seedBalanceAfter).toBe(USER_SEED_BALANCE);

      // Advance clock and crank for second claim
      await advanceClock(client, slotsPerDay);
      await program.methods.crankDistribution()
        .accounts({ cranker: payer.publicKey, globalState, mint, mintAuthority, tokenProgram: TOKEN_2022_PROGRAM_ID })
        .signers([payer]).rpc();

      // Second claim with seed ATA: boost_revoked should remain true, base rewards only
      const balanceBefore = await getTokenBalance(client, userATA);
      await program.methods.claimRewards()
        .accounts({ user: payer.publicKey, globalState, stakeAccount: stakePDA, userTokenAccount: userATA, mint, mintAuthority, tokenProgram: TOKEN_2022_PROGRAM_ID })
        .remainingAccounts([{ pubkey: seedAta, isSigner: false, isWritable: false }])
        .signers([payer]).rpc();
      const balanceAfter = await getTokenBalance(client, userATA);
      const secondRewards = new BN(balanceAfter.toString()).sub(new BN(balanceBefore.toString()));

      // boost_revoked must still be true even after repurchase
      const finalStake = await program.account.stakeAccount.fetch(stakePDA);
      expect(finalStake.boostRevoked).toBe(true);

      // Rewards should be > 0 (base rewards still paid out)
      expect(secondRewards.gt(new BN(0))).toBe(true);
    });
  });

  describe("headroom at claim time (BOOST-07)", () => {
    it("selling surplus above snapshot does not revoke at claim time", async () => {
      const web3 = require("@solana/web3.js");
      const splToken = require("@solana/spl-token");
      const { client, program, payer } = setupTest();

      // Setup with exactly USER_SEED_BALANCE (snapshot = USER_SEED_BALANCE)
      const { globalState, mint, mintAuthority, userATA, seedMint, seedAta, stakePDA } =
        await setupBoostedStake(program, payer, client, DEFAULT_MIN_STAKE_AMOUNT, 1, USER_SEED_BALANCE);

      // Verify snapshot = USER_SEED_BALANCE
      const stakeAfterCreate = await program.account.stakeAccount.fetch(stakePDA);
      expect(stakeAfterCreate.seedBalanceAtStake.toString()).toBe(USER_SEED_BALANCE_BN.toString());

      // Mint 5,000,000 more seed tokens (surplus above snapshot)
      const surplus = BigInt(5_000_000);
      await program.provider.sendAndConfirm(
        new web3.Transaction().add(
          splToken.createMintToInstruction(
            seedMint, seedAta, payer.publicKey, surplus, [],
            new PublicKey("TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb")
          )
        ),
        [payer]
      );

      // Now balance = USER_SEED_BALANCE + surplus
      // Transfer surplus away — balance returns to exactly snapshot
      const tempUser = require("@solana/web3.js").Keypair.generate();
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
      await program.provider.sendAndConfirm(
        new web3.Transaction().add(
          splToken.createTransferInstruction(
            seedAta, tempAta, payer.publicKey, surplus, [],
            new PublicKey("TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb")
          )
        ),
        [payer]
      );

      // Verify balance == snapshot
      const seedBalance = await getSeedTokenBalance(client, seedAta);
      expect(seedBalance).toBe(USER_SEED_BALANCE);

      // Advance 1 day and crank
      const slotsPerDay = BigInt(DEFAULT_SLOTS_PER_DAY.toString());
      await advanceClock(client, slotsPerDay);
      await program.methods.crankDistribution()
        .accounts({ cranker: payer.publicKey, globalState, mint, mintAuthority, tokenProgram: TOKEN_2022_PROGRAM_ID })
        .signers([payer]).rpc();

      // Claim with seed ATA — boost should still be active
      const balanceBefore = await getTokenBalance(client, userATA);
      await program.methods.claimRewards()
        .accounts({ user: payer.publicKey, globalState, stakeAccount: stakePDA, userTokenAccount: userATA, mint, mintAuthority, tokenProgram: TOKEN_2022_PROGRAM_ID })
        .remainingAccounts([{ pubkey: seedAta, isSigner: false, isWritable: false }])
        .signers([payer]).rpc();
      const balanceAfter = await getTokenBalance(client, userATA);
      const rewards = new BN(balanceAfter.toString()).sub(new BN(balanceBefore.toString()));

      // Boost NOT revoked — headroom works at claim time
      const finalStake = await program.account.stakeAccount.fetch(stakePDA);
      expect(finalStake.boostRevoked).toBe(false);
      // Rewards should be > 0
      expect(rewards.gt(new BN(0))).toBe(true);
    });
  });

  describe("non-boosted stake claim (regression)", () => {
    it("claim_rewards works exactly as before for non-boosted stakers", async () => {
      const web3 = require("@solana/web3.js");
      const splToken = require("@solana/spl-token");
      const { client, program, payer } = setupTest();
      const { globalState, mint, mintAuthority } = await initializeProtocol(program, payer);

      // Create HLX ATA and fund
      const userATA = getAssociatedTokenAddressSync(mint, payer.publicKey, false, TOKEN_2022_PROGRAM_ID);
      await program.provider.sendAndConfirm(
        new web3.Transaction().add(
          splToken.createAssociatedTokenAccountInstruction(
            payer.publicKey, userATA, payer.publicKey, mint, TOKEN_2022_PROGRAM_ID
          )
        ),
        [payer]
      );
      const stakeAmount = new BN("10000000000"); // 100 tokens
      await mintTokensToUser(program, payer, globalState, mint, mintAuthority, userATA, stakeAmount);

      // Create non-boosted stake
      const [stakePDA] = findStakePDA(program.programId, payer.publicKey, 0);
      await program.methods.createStake(stakeAmount, 1)
        .accounts({ user: payer.publicKey, globalState, stakeAccount: stakePDA, userTokenAccount: userATA, mint, tokenProgram: TOKEN_2022_PROGRAM_ID })
        .signers([payer]).rpc();

      // Advance 1 day and crank
      const slotsPerDay = BigInt(DEFAULT_SLOTS_PER_DAY.toString());
      await advanceClock(client, slotsPerDay);
      await program.methods.crankDistribution()
        .accounts({ cranker: payer.publicKey, globalState, mint, mintAuthority, tokenProgram: TOKEN_2022_PROGRAM_ID })
        .signers([payer]).rpc();

      // Claim without any remaining_accounts
      const balanceBefore = await getTokenBalance(client, userATA);
      await program.methods.claimRewards()
        .accounts({ user: payer.publicKey, globalState, stakeAccount: stakePDA, userTokenAccount: userATA, mint, mintAuthority, tokenProgram: TOKEN_2022_PROGRAM_ID })
        .signers([payer]).rpc();
      const balanceAfter = await getTokenBalance(client, userATA);
      const rewards = new BN(balanceAfter.toString()).sub(new BN(balanceBefore.toString()));

      expect(rewards.gt(new BN(0))).toBe(true);

      // Verify fields
      const stakeAccount = await program.account.stakeAccount.fetch(stakePDA);
      expect(stakeAccount.boostRevoked).toBe(false);
      expect(stakeAccount.seedBalanceAtStake.toString()).toBe("0");
    });
  });
});
