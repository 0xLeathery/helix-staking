/**
 * Helix Localnet Bootstrap Script
 *
 * Initializes the protocol state on a fresh solana-test-validator:
 * 1. Initialize GlobalState + Mint (Token-2022) + MintAuthority
 * 2. Airdrop SOL to the deterministic test wallet
 * 3. Create Associated Token Account (Token-2022)
 * 4. Mint HELIX tokens to the test wallet via admin_mint
 *
 * Adapted from scripts/devnet-validate.ts for localnet container usage.
 *
 * Environment variables:
 *   IDL_PATH     — path to helix_staking.json   (default: /mnt/idl/helix_staking.json)
 *   WALLET_PATH  — path to test-wallet.json     (default: /app/test-wallet.json)
 */

import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import {
  Connection,
  Keypair,
  PublicKey,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import {
  TOKEN_2022_PROGRAM_ID,
  getAssociatedTokenAddressSync,
  createAssociatedTokenAccountInstruction,
} from "@solana/spl-token";
import * as fs from "fs";

// ── Configuration ───────────────────────────────────────────────────────────

const RPC_URL = "http://127.0.0.1:8899";
const PROGRAM_ID = new PublicKey(
  "E9B7BsxdPS89M66CRGGbsCzQ9LkiGv6aNsra3cNBJha7"
);

const IDL_PATH = process.env.IDL_PATH || "/mnt/idl/helix_staking.json";
const WALLET_PATH = process.env.WALLET_PATH || "/app/test-wallet.json";

// PDA seeds (must match program constants in constants.rs)
const GLOBAL_STATE_SEED = Buffer.from("global_state");
const MINT_SEED = Buffer.from("helix_mint");
const MINT_AUTHORITY_SEED = Buffer.from("mint_authority");

// Protocol initialization parameters (from constants.rs defaults)
const INIT_PARAMS = {
  annualInflationBp: new anchor.BN(3_690_000),        // 3.69%
  minStakeAmount: new anchor.BN(10_000_000),           // 0.1 HELIX (8 decimals)
  startingShareRate: new anchor.BN(10_000),            // 1:1 ratio
  slotsPerDay: new anchor.BN(216_000),                 // ~400ms/slot
  claimPeriodDays: 180,                                // 6-month claim window
  maxAdminMint: new anchor.BN("1000000000000000000"),  // 10B tokens (8 decimals)
};

const AIRDROP_SOL = 100;                               // SOL to fund test wallet
const MINT_HELIX = 10_000;                             // HELIX to mint to test wallet
const TOKEN_DECIMALS = 8;

// ── Helpers ─────────────────────────────────────────────────────────────────

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function confirmTransaction(
  connection: Connection,
  signature: string
): Promise<void> {
  const { blockhash, lastValidBlockHeight } =
    await connection.getLatestBlockhash();
  await connection.confirmTransaction(
    { signature, blockhash, lastValidBlockHeight },
    "confirmed"
  );
}

// ── Main ────────────────────────────────────────────────────────────────────

async function main() {
  console.log("=== Helix Protocol Bootstrap ===\n");

  // 1. Setup connection and wallet
  const connection = new Connection(RPC_URL, "confirmed");
  const walletKeypair = Keypair.fromSecretKey(
    Uint8Array.from(JSON.parse(fs.readFileSync(WALLET_PATH, "utf-8")))
  );
  const wallet = new anchor.Wallet(walletKeypair);
  const provider = new anchor.AnchorProvider(connection, wallet, {
    commitment: "confirmed",
    preflightCommitment: "confirmed",
  });

  // Load IDL
  const idl = JSON.parse(fs.readFileSync(IDL_PATH, "utf-8"));
  const program = new Program(idl, provider);

  const pubkey = walletKeypair.publicKey.toBase58();
  console.log("  Wallet:     ", pubkey);
  console.log("  RPC:        ", RPC_URL);
  console.log("  Program ID: ", PROGRAM_ID.toBase58());
  console.log("");

  // 2. Derive PDAs
  const [globalState] = PublicKey.findProgramAddressSync(
    [GLOBAL_STATE_SEED],
    PROGRAM_ID
  );
  const [mintPda] = PublicKey.findProgramAddressSync(
    [MINT_SEED],
    PROGRAM_ID
  );
  const [mintAuthority] = PublicKey.findProgramAddressSync(
    [MINT_AUTHORITY_SEED],
    PROGRAM_ID
  );

  console.log("  PDAs:");
  console.log("    GlobalState:   ", globalState.toBase58());
  console.log("    Mint:          ", mintPda.toBase58());
  console.log("    MintAuthority: ", mintAuthority.toBase58());
  console.log("");

  // 3. Airdrop SOL to test wallet
  console.log(`Step 1: Airdrop ${AIRDROP_SOL} SOL to test wallet...`);
  try {
    // Airdrop in chunks (localnet faucet may have per-request limits)
    const chunkSize = 10; // SOL per airdrop request
    const chunks = Math.ceil(AIRDROP_SOL / chunkSize);
    for (let i = 0; i < chunks; i++) {
      const amount = Math.min(chunkSize, AIRDROP_SOL - i * chunkSize);
      const sig = await connection.requestAirdrop(
        walletKeypair.publicKey,
        amount * LAMPORTS_PER_SOL
      );
      await confirmTransaction(connection, sig);
    }
    const balance =
      (await connection.getBalance(walletKeypair.publicKey)) / LAMPORTS_PER_SOL;
    console.log(`  ✓ Balance: ${balance} SOL`);
  } catch (e: any) {
    console.error("  ✗ Airdrop failed:", e.message);
    process.exit(1);
  }
  console.log("");

  // 4. Initialize protocol (idempotent)
  console.log("Step 2: Initialize protocol...");
  let needsInit = false;
  try {
    const gsAccount = await program.account.globalState.fetch(globalState);
    console.log(
      `  Protocol already initialized (day: ${gsAccount.currentDay.toString()})`
    );
  } catch {
    needsInit = true;
  }

  if (needsInit) {
    try {
      const tx = await program.methods
        .initialize(INIT_PARAMS)
        .accountsPartial({
          authority: walletKeypair.publicKey,
          globalState,
          mint: mintPda,
          mintAuthority,
          tokenProgram: TOKEN_2022_PROGRAM_ID,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .rpc();
      await confirmTransaction(connection, tx);
      console.log("  ✓ Protocol initialized. TX:", tx);
    } catch (e: any) {
      console.error("  ✗ Initialize failed:", e.message);
      process.exit(1);
    }
  }
  console.log("");

  // 5. Create ATA for test wallet (Token-2022)
  console.log("Step 3: Create token account...");
  const userAta = getAssociatedTokenAddressSync(
    mintPda,
    walletKeypair.publicKey,
    false,
    TOKEN_2022_PROGRAM_ID
  );

  try {
    await connection.getTokenAccountBalance(userAta);
    console.log("  ATA already exists:", userAta.toBase58());
  } catch {
    try {
      const ix = createAssociatedTokenAccountInstruction(
        walletKeypair.publicKey,
        userAta,
        walletKeypair.publicKey,
        mintPda,
        TOKEN_2022_PROGRAM_ID
      );
      const tx = new anchor.web3.Transaction().add(ix);
      const sig = await provider.sendAndConfirm(tx);
      console.log("  ✓ ATA created. TX:", sig);
    } catch (e: any) {
      console.error("  ✗ ATA creation failed:", e.message);
      process.exit(1);
    }
  }
  console.log("");

  // 6. Mint HELIX to test wallet via admin_mint
  const mintAmount = new anchor.BN(MINT_HELIX).mul(
    new anchor.BN(10).pow(new anchor.BN(TOKEN_DECIMALS))
  );
  console.log(`Step 4: Mint ${MINT_HELIX.toLocaleString()} HELIX to test wallet...`);
  try {
    const tx = await program.methods
      .adminMint(mintAmount)
      .accountsPartial({
        authority: walletKeypair.publicKey,
        globalState,
        helixMint: mintPda,
        mintAuthority,
        recipientTokenAccount: userAta,
        tokenProgram: TOKEN_2022_PROGRAM_ID,
      })
      .rpc();
    await confirmTransaction(connection, tx);
    console.log("  ✓ Minted. TX:", tx);
  } catch (e: any) {
    console.log(
      "  ⚠ admin_mint skipped (may have hit cap):",
      e.message.slice(0, 120)
    );
  }

  // Print final balances
  const solBalance =
    (await connection.getBalance(walletKeypair.publicKey)) / LAMPORTS_PER_SOL;
  let helixBalance = "0";
  try {
    const tokenBal = await connection.getTokenAccountBalance(userAta);
    helixBalance = tokenBal.value.uiAmountString || "0";
  } catch {
    // ATA may not exist if admin_mint was skipped
  }

  console.log("");
  console.log("=== Bootstrap Complete ===");
  console.log(`  Wallet:  ${pubkey}`);
  console.log(`  SOL:     ${solBalance}`);
  console.log(`  HELIX:   ${helixBalance}`);
  console.log("");
}

main().catch((err) => {
  console.error("Fatal bootstrap error:", err);
  process.exit(1);
});
