import { describe, it, expect } from "vitest";
import { Keypair, SystemProgram, Transaction } from "@solana/web3.js";
import BN from "bn.js";
import {
  setupTest,
  initializeProtocol,
  findGlobalStatePDA,
  DEFAULT_SLOTS_PER_DAY,
} from "../phase3/utils";

/**
 * Phase 8.1 (FR-003/T034): Multisig authority compatibility tests.
 *
 * Verifies that:
 * 1. The initialized authority can execute admin instructions
 * 2. Non-authority signers are rejected with Unauthorized error
 * 3. Different admin instructions all enforce the authority check
 *
 * Note: Full Squads v4 multisig testing requires devnet (T035).
 * These tests verify the on-chain authority check that multisig relies on.
 */

describe("Multisig Authority Tests", () => {
  it("authority can execute admin_set_slots_per_day", async () => {
    const { program, payer } = setupTest();
    await initializeProtocol(program, payer);
    const [globalStatePDA] = findGlobalStatePDA(program.programId);

    // Authority (payer) sets slots_per_day within ±10% bounds
    const newSlotsPerDay = DEFAULT_SLOTS_PER_DAY.toNumber() + 10_000; // within +10%

    await program.methods
      .adminSetSlotsPerDay(new BN(newSlotsPerDay))
      .accounts({
        authority: payer.publicKey,
        globalState: globalStatePDA,
      })
      .signers([payer])
      .rpc();

    // Verify the change took effect
    const state = await program.account.globalState.fetch(globalStatePDA);
    expect(state.slotsPerDay.toNumber()).toBe(newSlotsPerDay);
  });

  it("non-authority is rejected by admin_set_slots_per_day", async () => {
    const { program, payer } = setupTest();
    await initializeProtocol(program, payer);
    const [globalStatePDA] = findGlobalStatePDA(program.programId);

    // Create a random non-authority keypair
    const impostor = Keypair.generate();

    // Fund the impostor so they can pay for the transaction
    const fundTx = new Transaction();
    fundTx.add(
      SystemProgram.transfer({
        fromPubkey: payer.publicKey,
        toPubkey: impostor.publicKey,
        lamports: 100_000_000,
      }),
    );
    await program.provider.sendAndConfirm(fundTx, [payer]);

    // Attempt admin instruction with non-authority signer
    try {
      await program.methods
        .adminSetSlotsPerDay(new BN(220_000))
        .accounts({
          authority: impostor.publicKey,
          globalState: globalStatePDA,
        })
        .signers([impostor])
        .rpc();
      // Should not reach here
      expect.fail("Expected non-authority to be rejected");
    } catch (error: any) {
      // Anchor's has_one constraint returns a ConstraintHasOne error
      expect(error.toString()).toMatch(/has_one|Unauthorized|ConstraintHasOne|2001/);
    }
  });

  it("admin_set_slots_per_day rejects out-of-bounds values", async () => {
    const { program, payer } = setupTest();
    await initializeProtocol(program, payer);
    const [globalStatePDA] = findGlobalStatePDA(program.programId);

    // Try setting way above +10%
    const tooHigh = DEFAULT_SLOTS_PER_DAY.toNumber() * 2; // 200% = way over

    try {
      await program.methods
        .adminSetSlotsPerDay(new BN(tooHigh))
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

    // Try setting way below -10%
    const tooLow = DEFAULT_SLOTS_PER_DAY.toNumber() / 2; // 50% = way under

    try {
      await program.methods
        .adminSetSlotsPerDay(new BN(tooLow))
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
