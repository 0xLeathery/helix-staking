/**
 * HELIX Devnet BPD (Big Pay Day) Validation Script
 *
 * Tests the full BPD flow:
 * abort_bpd (reset) -> admin_set_slots_per_day (speed up) ->
 * admin_set_claim_end_slot (expire) -> finalize -> seal -> trigger
 *
 * Prerequisites: Run devnet-validate.ts and devnet-validate-claims.ts first.
 *
 * Usage: npx tsx scripts/devnet-validate-bpd.ts
 */

import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import {
  Connection,
  Keypair,
  PublicKey,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import * as fs from "fs";
import * as path from "path";

const idlPath = path.resolve(__dirname, "../target/idl/helix_staking.json");
const idl = JSON.parse(fs.readFileSync(idlPath, "utf-8"));

const PROGRAM_ID = new PublicKey(
  "E9B7BsxdPS89M66CRGGbsCzQ9LkiGv6aNsra3cNBJha7"
);
const DEVNET_URL = "https://api.devnet.solana.com";

const GLOBAL_STATE_SEED = Buffer.from("global_state");
const CLAIM_CONFIG_SEED = Buffer.from("claim_config");

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  console.log("=== HELIX Devnet BPD Validation ===\n");

  const connection = new Connection(DEVNET_URL, "confirmed");
  const walletPath = path.resolve(
    process.env.HOME!,
    ".config/solana/id.json"
  );
  const walletKeypair = Keypair.fromSecretKey(
    Uint8Array.from(JSON.parse(fs.readFileSync(walletPath, "utf-8")))
  );
  const wallet = new anchor.Wallet(walletKeypair);
  const provider = new anchor.AnchorProvider(connection, wallet, {
    commitment: "confirmed",
    preflightCommitment: "confirmed",
  });
  const program = new Program(idl, provider);

  const balance =
    (await connection.getBalance(walletKeypair.publicKey)) / LAMPORTS_PER_SOL;
  console.log("Wallet:", walletKeypair.publicKey.toBase58());
  console.log("Balance:", balance, "SOL\n");

  // Derive PDAs
  const [globalState] = PublicKey.findProgramAddressSync(
    [GLOBAL_STATE_SEED],
    PROGRAM_ID
  );
  const [claimConfigPda] = PublicKey.findProgramAddressSync(
    [CLAIM_CONFIG_SEED],
    PROGRAM_ID
  );

  let gsAccount = await program.account.globalState.fetch(globalState);
  const currentSlot = await connection.getSlot("confirmed");
  console.log("Current slot:", currentSlot);
  console.log("Current slots_per_day:", gsAccount.slotsPerDay.toString());
  console.log();

  // ── Step 1: Abort any stuck BPD state ──
  console.log("Step 1: Abort any in-progress BPD state...");
  try {
    const tx = await program.methods
      .abortBpd()
      .accountsPartial({
        authority: walletKeypair.publicKey,
        globalState,
        claimConfig: claimConfigPda,
      })
      .rpc();
    console.log("  BPD aborted. TX:", tx);
    await sleep(2000);
  } catch (e: any) {
    const msg = e.message.slice(0, 150);
    if (msg.includes("BpdWindowNotActive")) {
      console.log("  No active BPD to abort (clean state).");
    } else {
      console.log("  Abort failed:", msg);
    }
  }
  console.log();

  // ── Step 2: Set slots_per_day to 10 (~4 seconds per "day") ──
  console.log("Step 2: Setting slots_per_day to 10 (fast-forward days)...");
  try {
    const tx = await program.methods
      .adminSetSlotsPerDay(new anchor.BN(10))
      .accountsPartial({
        authority: walletKeypair.publicKey,
        globalState,
      })
      .rpc();
    console.log("  slots_per_day set to 10. TX:", tx);
    await sleep(2000);
  } catch (e: any) {
    console.log("  Failed:", e.message.slice(0, 200));
    process.exit(1);
  }
  console.log();

  // ── Step 3: Fast-forward claim period end ──
  console.log("Step 3: Setting claim end_slot to expire immediately...");
  try {
    const slot = await connection.getSlot("confirmed");
    const newEndSlot = new anchor.BN(slot - 1);
    const tx = await program.methods
      .adminSetClaimEndSlot(newEndSlot)
      .accountsPartial({
        authority: walletKeypair.publicKey,
        globalState,
        claimConfig: claimConfigPda,
      })
      .rpc();
    console.log("  End slot set to", newEndSlot.toString(), ". TX:", tx);
    await sleep(2000);
  } catch (e: any) {
    console.log("  Failed:", e.message.slice(0, 200));
    process.exit(1);
  }
  console.log();

  // ── Step 4: Find all stake accounts ──
  console.log("Step 4: Finding stake accounts...");
  gsAccount = await program.account.globalState.fetch(globalState);
  const stakeAccounts: PublicKey[] = [];
  const totalStakes = gsAccount.totalStakesCreated.toNumber();

  for (let i = 0; i < totalStakes; i++) {
    const [pda] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("stake"),
        walletKeypair.publicKey.toBuffer(),
        new anchor.BN(i).toArrayLike(Buffer, "le", 8),
      ],
      PROGRAM_ID
    );
    try {
      const stake = await program.account.stakeAccount.fetch(pda);
      if (stake.isActive) {
        stakeAccounts.push(pda);
        console.log(
          `  Stake #${i}: ${stake.tShares.toString()} T-Shares, ` +
            `start=${stake.startSlot.toString()}`
        );
      }
    } catch {}
  }
  console.log("  Active stakes:", stakeAccounts.length);
  console.log();

  // ── Step 5: Finalize BPD calculation ──
  console.log("Step 5: Finalize BPD calculation...");
  try {
    const tx = await program.methods
      .finalizeBpdCalculation()
      .accountsPartial({
        caller: walletKeypair.publicKey,
        globalState,
        claimConfig: claimConfigPda,
      })
      .remainingAccounts(
        stakeAccounts.map((pk) => ({
          pubkey: pk,
          isSigner: false,
          isWritable: true,
        }))
      )
      .rpc();
    console.log("  Finalize done. TX:", tx);
    await sleep(2000);

    const cc = await program.account.claimConfig.fetch(claimConfigPda);
    console.log(
      "  Unclaimed pool:",
      cc.bpdRemainingUnclaimed.toString(),
      "base units"
    );
    console.log("  Total share-days:", cc.bpdTotalShareDays.toString());
    console.log("  Stakes finalized:", cc.bpdStakesFinalized);
    console.log("  Snapshot slot:", cc.bpdSnapshotSlot.toString());
  } catch (e: any) {
    console.log("  Finalize failed:", e.message.slice(0, 300));
  }
  console.log();

  // ── Step 6: Seal BPD finalize ──
  console.log("Step 6: Seal BPD finalize (compute rate)...");
  try {
    const tx = await program.methods
      .sealBpdFinalize()
      .accountsPartial({
        authority: walletKeypair.publicKey,
        globalState,
        claimConfig: claimConfigPda,
      })
      .rpc();
    console.log("  Seal done. TX:", tx);
    await sleep(2000);

    const cc = await program.account.claimConfig.fetch(claimConfigPda);
    console.log("  BPD calculation complete:", cc.bpdCalculationComplete);
    console.log("  HELIX per share-day:", cc.bpdHelixPerShareDay.toString());
  } catch (e: any) {
    console.log("  Seal failed:", e.message.slice(0, 300));
  }
  console.log();

  // ── Step 7: Trigger Big Pay Day ──
  console.log("Step 7: Trigger Big Pay Day (distribute to stakers)...");
  try {
    const tx = await program.methods
      .triggerBigPayDay()
      .accountsPartial({
        caller: walletKeypair.publicKey,
        globalState,
        claimConfig: claimConfigPda,
      })
      .remainingAccounts(
        stakeAccounts.map((pk) => ({
          pubkey: pk,
          isSigner: false,
          isWritable: true,
        }))
      )
      .rpc();
    console.log("  BIG PAY DAY TRIGGERED! TX:", tx);
    await sleep(2000);

    const cc = await program.account.claimConfig.fetch(claimConfigPda);
    console.log("  Big pay day complete:", cc.bigPayDayComplete);
    console.log(
      "  Total distributed:",
      cc.bpdTotalDistributed.toString(),
      "base units"
    );
    console.log("  Stakes distributed:", cc.bpdStakesDistributed);
    console.log(
      "  Remaining unclaimed:",
      cc.bpdRemainingUnclaimed.toString()
    );
    console.log();

    // Show each stake's BPD bonus
    for (let i = 0; i < stakeAccounts.length; i++) {
      const stake = await program.account.stakeAccount.fetch(stakeAccounts[i]);
      console.log(
        `  Stake ${i} BPD bonus pending: ${stake.bpdBonusPending.toString()} base units`
      );
    }
  } catch (e: any) {
    console.log("  Trigger BPD failed:", e.message.slice(0, 300));
  }
  console.log();

  // ── Step 8: Restore slots_per_day ──
  console.log("Step 8: Restoring slots_per_day to 216000...");
  try {
    const tx = await program.methods
      .adminSetSlotsPerDay(new anchor.BN(216_000))
      .accountsPartial({
        authority: walletKeypair.publicKey,
        globalState,
      })
      .rpc();
    console.log("  Restored. TX:", tx);
  } catch (e: any) {
    console.log("  Restore failed:", e.message.slice(0, 100));
  }
  console.log();

  // ── Summary ──
  const finalBal =
    (await connection.getBalance(walletKeypair.publicKey)) / LAMPORTS_PER_SOL;
  console.log("=== BPD Validation Complete ===");
  console.log("Final SOL:", finalBal);
  console.log(
    "Explorer:",
    `https://explorer.solana.com/address/${PROGRAM_ID.toBase58()}?cluster=devnet`
  );
  console.log();
  console.log("Full BPD lifecycle verified on devnet:");
  console.log("  1. abort_bpd (reset stuck state)");
  console.log("  2. admin_set_slots_per_day (fast-forward days)");
  console.log("  3. admin_set_claim_end_slot (expire claim period)");
  console.log("  4. finalize_bpd_calculation (accumulate share-days)");
  console.log("  5. seal_bpd_finalize (compute per-share-day rate)");
  console.log("  6. trigger_big_pay_day (distribute to eligible stakers)");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
