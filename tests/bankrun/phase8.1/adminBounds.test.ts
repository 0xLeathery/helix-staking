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
  buildMerkleTree,
  TOKEN_2022_PROGRAM_ID,
  DEFAULT_SLOTS_PER_DAY,
  DEFAULT_MIN_STAKE_AMOUNT,
} from "../phase3/utils";

/**
 * Phase 8.1 (C2/T007+T008): Admin bounds enforcement tests.
 *
 * T007: admin_set_slots_per_day rejects values outside ±10% of DEFAULT_SLOTS_PER_DAY.
 *   - Lower bound: 216,000 * 90 / 100 = 194,400
 *   - Upper bound: 216,000 * 110 / 100 = 237,600
 *
 * T008: admin_set_claim_end_slot rejects non-monotonic decreases.
 *   - New end_slot must be strictly greater than current end_slot.
 */

const LOWER_BOUND = Math.floor(DEFAULT_SLOTS_PER_DAY.toNumber() * 90 / 100); // 194,400
const UPPER_BOUND = Math.floor(DEFAULT_SLOTS_PER_DAY.toNumber() * 110 / 100); // 237,600

describe("Admin Bounds Tests", () => {
  // =======================================================================
  //  T007: admin_set_slots_per_day bounds
  // =======================================================================
  describe("admin_set_slots_per_day bounds (T007)", () => {
    it("accepts value at lower boundary (194,400)", async () => {
      const { program, payer } = await setupTest();
      await initializeProtocol(program, payer);
      const [globalStatePDA] = findGlobalStatePDA(program.programId);

      await program.methods
        .adminSetSlotsPerDay(new BN(LOWER_BOUND))
        .accounts({
          authority: payer.publicKey,
          globalState: globalStatePDA,
        })
        .signers([payer])
        .rpc();

      const state = await program.account.globalState.fetch(globalStatePDA);
      expect(state.slotsPerDay.toNumber()).toBe(LOWER_BOUND);
    });

    it("accepts value at upper boundary (237,600)", async () => {
      const { program, payer } = await setupTest();
      await initializeProtocol(program, payer);
      const [globalStatePDA] = findGlobalStatePDA(program.programId);

      await program.methods
        .adminSetSlotsPerDay(new BN(UPPER_BOUND))
        .accounts({
          authority: payer.publicKey,
          globalState: globalStatePDA,
        })
        .signers([payer])
        .rpc();

      const state = await program.account.globalState.fetch(globalStatePDA);
      expect(state.slotsPerDay.toNumber()).toBe(UPPER_BOUND);
    });

    it("rejects value below lower boundary (194,399)", async () => {
      const { program, payer } = await setupTest();
      await initializeProtocol(program, payer);
      const [globalStatePDA] = findGlobalStatePDA(program.programId);

      try {
        await program.methods
          .adminSetSlotsPerDay(new BN(LOWER_BOUND - 1))
          .accounts({
            authority: payer.publicKey,
            globalState: globalStatePDA,
          })
          .signers([payer])
          .rpc();
        expect.fail("Expected AdminBoundsExceeded error");
      } catch (error: any) {
        expect(error.toString()).toMatch(/AdminBoundsExceeded/);
      }
    });

    it("rejects value above upper boundary (237,601)", async () => {
      const { program, payer } = await setupTest();
      await initializeProtocol(program, payer);
      const [globalStatePDA] = findGlobalStatePDA(program.programId);

      try {
        await program.methods
          .adminSetSlotsPerDay(new BN(UPPER_BOUND + 1))
          .accounts({
            authority: payer.publicKey,
            globalState: globalStatePDA,
          })
          .signers([payer])
          .rpc();
        expect.fail("Expected AdminBoundsExceeded error");
      } catch (error: any) {
        expect(error.toString()).toMatch(/AdminBoundsExceeded/);
      }
    });

    it("rejects value of 0", async () => {
      const { program, payer } = await setupTest();
      await initializeProtocol(program, payer);
      const [globalStatePDA] = findGlobalStatePDA(program.programId);

      try {
        await program.methods
          .adminSetSlotsPerDay(new BN(0))
          .accounts({
            authority: payer.publicKey,
            globalState: globalStatePDA,
          })
          .signers([payer])
          .rpc();
        expect.fail("Expected AdminBoundsExceeded error");
      } catch (error: any) {
        expect(error.toString()).toMatch(/AdminBoundsExceeded/);
      }
    });

    it("rejects extreme value (u64 max)", async () => {
      const { program, payer } = await setupTest();
      await initializeProtocol(program, payer);
      const [globalStatePDA] = findGlobalStatePDA(program.programId);

      try {
        await program.methods
          .adminSetSlotsPerDay(new BN("18446744073709551615")) // u64::MAX
          .accounts({
            authority: payer.publicKey,
            globalState: globalStatePDA,
          })
          .signers([payer])
          .rpc();
        expect.fail("Expected AdminBoundsExceeded error");
      } catch (error: any) {
        expect(error.toString()).toMatch(/AdminBoundsExceeded/);
      }
    });
  });

  // =======================================================================
  //  T008: admin_set_claim_end_slot monotonic constraint
  // =======================================================================
  describe("admin_set_claim_end_slot monotonic constraint (T008)", () => {
    it("accepts increasing end_slot", async () => {
      const { context, program, payer } = await setupTest();
      const { globalState } = await initializeProtocol(program, payer);
      const [globalStatePDA] = findGlobalStatePDA(program.programId);
      const [claimConfigPDA] = findClaimConfigPDA(program.programId);

      // Initialize claim period first
      const snapshotWallet = Keypair.generate();
      const entries = [
        {
          wallet: snapshotWallet.publicKey,
          amount: new BN("100000000"),
          claimPeriodId: 1,
        },
      ];
      const tree = buildMerkleTree(entries);

      await program.methods
        .initializeClaimPeriod(
          Array.from(tree.root),
          new BN("100000000000000"),
          1,
          1,
        )
        .accounts({
          authority: payer.publicKey,
          globalState,
          claimConfig: claimConfigPDA,
          systemProgram: SystemProgram.programId,
        })
        .signers([payer])
        .rpc();

      // Read current end_slot
      const claimConfig = await program.account.claimConfig.fetch(claimConfigPDA);
      const currentEndSlot = new BN(claimConfig.endSlot.toString());

      // Set new end_slot that is HIGHER — should succeed
      const higherEndSlot = currentEndSlot.add(new BN(1_000_000));
      await program.methods
        .adminSetClaimEndSlot(higherEndSlot)
        .accounts({
          authority: payer.publicKey,
          globalState,
          claimConfig: claimConfigPDA,
        })
        .signers([payer])
        .rpc();

      // Verify the change
      const updated = await program.account.claimConfig.fetch(claimConfigPDA);
      expect(new BN(updated.endSlot.toString()).eq(higherEndSlot)).toBe(true);
    });

    it("rejects decreasing end_slot", async () => {
      const { context, program, payer } = await setupTest();
      const { globalState } = await initializeProtocol(program, payer);
      const [claimConfigPDA] = findClaimConfigPDA(program.programId);

      // Initialize claim period
      const snapshotWallet = Keypair.generate();
      const entries = [
        {
          wallet: snapshotWallet.publicKey,
          amount: new BN("100000000"),
          claimPeriodId: 1,
        },
      ];
      const tree = buildMerkleTree(entries);

      await program.methods
        .initializeClaimPeriod(
          Array.from(tree.root),
          new BN("100000000000000"),
          1,
          1,
        )
        .accounts({
          authority: payer.publicKey,
          globalState,
          claimConfig: claimConfigPDA,
          systemProgram: SystemProgram.programId,
        })
        .signers([payer])
        .rpc();

      // Read current end_slot
      const claimConfig = await program.account.claimConfig.fetch(claimConfigPDA);
      const currentEndSlot = new BN(claimConfig.endSlot.toString());

      // Try to set LOWER end_slot — should fail
      const lowerEndSlot = currentEndSlot.sub(new BN(1));
      try {
        await program.methods
          .adminSetClaimEndSlot(lowerEndSlot)
          .accounts({
            authority: payer.publicKey,
            globalState,
            claimConfig: claimConfigPDA,
          })
          .signers([payer])
          .rpc();
        expect.fail("Expected AdminBoundsExceeded error");
      } catch (error: any) {
        expect(error.toString()).toMatch(/AdminBoundsExceeded/);
      }
    });

    it("rejects same end_slot (not strictly greater)", async () => {
      const { context, program, payer } = await setupTest();
      const { globalState } = await initializeProtocol(program, payer);
      const [claimConfigPDA] = findClaimConfigPDA(program.programId);

      // Initialize claim period
      const snapshotWallet = Keypair.generate();
      const entries = [
        {
          wallet: snapshotWallet.publicKey,
          amount: new BN("100000000"),
          claimPeriodId: 1,
        },
      ];
      const tree = buildMerkleTree(entries);

      await program.methods
        .initializeClaimPeriod(
          Array.from(tree.root),
          new BN("100000000000000"),
          1,
          1,
        )
        .accounts({
          authority: payer.publicKey,
          globalState,
          claimConfig: claimConfigPDA,
          systemProgram: SystemProgram.programId,
        })
        .signers([payer])
        .rpc();

      // Read current end_slot
      const claimConfig = await program.account.claimConfig.fetch(claimConfigPDA);
      const sameEndSlot = new BN(claimConfig.endSlot.toString());

      // Try to set SAME end_slot — should fail (requires strictly greater)
      try {
        await program.methods
          .adminSetClaimEndSlot(sameEndSlot)
          .accounts({
            authority: payer.publicKey,
            globalState,
            claimConfig: claimConfigPDA,
          })
          .signers([payer])
          .rpc();
        expect.fail("Expected AdminBoundsExceeded error");
      } catch (error: any) {
        expect(error.toString()).toMatch(/AdminBoundsExceeded/);
      }
    });

    it("accepts multiple successive increases", async () => {
      const { context, program, payer } = await setupTest();
      const { globalState } = await initializeProtocol(program, payer);
      const [claimConfigPDA] = findClaimConfigPDA(program.programId);

      // Initialize claim period
      const snapshotWallet = Keypair.generate();
      const entries = [
        {
          wallet: snapshotWallet.publicKey,
          amount: new BN("100000000"),
          claimPeriodId: 1,
        },
      ];
      const tree = buildMerkleTree(entries);

      await program.methods
        .initializeClaimPeriod(
          Array.from(tree.root),
          new BN("100000000000000"),
          1,
          1,
        )
        .accounts({
          authority: payer.publicKey,
          globalState,
          claimConfig: claimConfigPDA,
          systemProgram: SystemProgram.programId,
        })
        .signers([payer])
        .rpc();

      let claimConfig = await program.account.claimConfig.fetch(claimConfigPDA);
      let currentEnd = new BN(claimConfig.endSlot.toString());

      // Increase 3 times
      for (let i = 1; i <= 3; i++) {
        const newEnd = currentEnd.add(new BN(100_000 * i));
        await program.methods
          .adminSetClaimEndSlot(newEnd)
          .accounts({
            authority: payer.publicKey,
            globalState,
            claimConfig: claimConfigPDA,
          })
          .signers([payer])
          .rpc();

        claimConfig = await program.account.claimConfig.fetch(claimConfigPDA);
        expect(new BN(claimConfig.endSlot.toString()).eq(newEnd)).toBe(true);
        currentEnd = newEnd;
      }
    });
  });
});
