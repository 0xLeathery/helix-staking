/**
 * Helix Localnet Smoke Test (SC-002 Validation)
 *
 * Validates the containerized validator is fully functional:
 * 1. getVersion — confirm Solana 1.18.x
 * 2. getAccountInfo — program is deployed and executable
 * 3. Instruction submission — send a transaction via web3.js
 * 4. WebSocket — subscribe to logs and receive an event
 *
 * Usage: npx tsx docker/smoke-test.ts
 * Requires: Docker container running (npm run localnet:up)
 */

import {
  Connection,
  Keypair,
  PublicKey,
  LAMPORTS_PER_SOL,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import * as fs from "fs";
import WebSocket from "ws";

const RPC_URL = process.env.RPC_URL || "http://localhost:8899";
const WS_URL = process.env.WS_URL || "ws://localhost:8900";
const PROGRAM_ID = new PublicKey(
  "E9B7BsxdPS89M66CRGGbsCzQ9LkiGv6aNsra3cNBJha7"
);
const WALLET_PATH = process.env.WALLET_PATH || "docker/test-wallet.json";

let passed = 0;
let failed = 0;

function ok(test: string) {
  passed++;
  console.log(`  ✓ ${test}`);
}

function fail(test: string, reason: string) {
  failed++;
  console.error(`  ✗ ${test}: ${reason}`);
}

async function main() {
  console.log("=== Helix Localnet Smoke Test ===\n");
  console.log(`  RPC: ${RPC_URL}`);
  console.log(`  WS:  ${WS_URL}\n`);

  const connection = new Connection(RPC_URL, "confirmed");

  // ── Test 1: getVersion ──────────────────────────────────────────────────
  console.log("Test 1: getVersion (Solana 1.18.x)");
  try {
    const version = await connection.getVersion();
    const solanaVersion = version["solana-core"];
    if (solanaVersion && solanaVersion.startsWith("1.18.")) {
      ok(`Solana version: ${solanaVersion}`);
    } else {
      fail("Version check", `Expected 1.18.x, got: ${solanaVersion}`);
    }
  } catch (e: any) {
    fail("Version check", e.message);
  }

  // ── Test 2: Program account is executable ───────────────────────────────
  console.log("\nTest 2: Program account is executable");
  try {
    const info = await connection.getAccountInfo(PROGRAM_ID);
    if (!info) {
      fail("Program check", "Account not found");
    } else if (!info.executable) {
      fail("Program check", "Account exists but is not executable");
    } else {
      ok(`Program ${PROGRAM_ID.toBase58()} is executable (${info.data.length} bytes)`);
    }
  } catch (e: any) {
    fail("Program check", e.message);
  }

  // ── Test 3: Submit a transaction (SOL transfer) ─────────────────────────
  console.log("\nTest 3: Submit transaction (SOL self-transfer)");
  try {
    const walletKeypair = Keypair.fromSecretKey(
      Uint8Array.from(JSON.parse(fs.readFileSync(WALLET_PATH, "utf-8")))
    );
    const tx = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: walletKeypair.publicKey,
        toPubkey: walletKeypair.publicKey,
        lamports: 1000,
      })
    );
    const { blockhash } = await connection.getLatestBlockhash();
    tx.recentBlockhash = blockhash;
    tx.feePayer = walletKeypair.publicKey;
    tx.sign(walletKeypair);

    const sig = await connection.sendRawTransaction(tx.serialize());
    await connection.confirmTransaction(sig, "confirmed");
    ok(`Transaction confirmed: ${sig.slice(0, 20)}...`);
  } catch (e: any) {
    fail("Transaction", e.message);
  }

  // ── Test 4: WebSocket subscription ──────────────────────────────────────
  console.log("\nTest 4: WebSocket log subscription");
  try {
    await new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(() => {
        ws.close();
        reject(new Error("WebSocket timeout (10s) — no log event received"));
      }, 10_000);

      const ws = new WebSocket(WS_URL);

      ws.on("open", () => {
        // Subscribe to all logs
        ws.send(
          JSON.stringify({
            jsonrpc: "2.0",
            id: 1,
            method: "logsSubscribe",
            params: ["all", { commitment: "confirmed" }],
          })
        );
      });

      ws.on("message", (data: Buffer) => {
        const msg = JSON.parse(data.toString());
        // First message is the subscription confirmation
        if (msg.result !== undefined) {
          // Now send a transaction to trigger a log event
          (async () => {
            const walletKeypair = Keypair.fromSecretKey(
              Uint8Array.from(
                JSON.parse(fs.readFileSync(WALLET_PATH, "utf-8"))
              )
            );
            const conn = new Connection(RPC_URL, "confirmed");
            const tx = new Transaction().add(
              SystemProgram.transfer({
                fromPubkey: walletKeypair.publicKey,
                toPubkey: walletKeypair.publicKey,
                lamports: 1,
              })
            );
            const { blockhash } = await conn.getLatestBlockhash();
            tx.recentBlockhash = blockhash;
            tx.feePayer = walletKeypair.publicKey;
            tx.sign(walletKeypair);
            await conn.sendRawTransaction(tx.serialize());
          })().catch(() => {});
          return;
        }
        // Any notification means WebSocket is working
        if (msg.method === "logsNotification") {
          clearTimeout(timeout);
          ws.close();
          ok("Received logsNotification via WebSocket");
          resolve();
        }
      });

      ws.on("error", (err: Error) => {
        clearTimeout(timeout);
        reject(err);
      });
    });
  } catch (e: any) {
    fail("WebSocket", e.message);
  }

  // ── Summary ─────────────────────────────────────────────────────────────
  console.log(`\n=== Results: ${passed} passed, ${failed} failed ===`);
  process.exit(failed > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
