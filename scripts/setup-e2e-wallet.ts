/**
 * E2E Test Wallet Setup Script
 *
 * Idempotent script that prepares a test wallet for Playwright transaction tests.
 * - Generates (or loads) a dedicated E2E keypair
 * - Airdrops SOL for transaction fees
 * - Creates Token-2022 ATA
 * - Mints HELIX via admin_mint
 * - Outputs base58 secret key for NEXT_PUBLIC_TEST_WALLET_SECRET
 *
 * Usage: npx tsx scripts/setup-e2e-wallet.ts
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
  ASSOCIATED_TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import * as fs from "fs";
import * as path from "path";
import bs58 from "bs58";

const PROGRAM_ID = new PublicKey(
  "E9B7BsxdPS89M66CRGGbsCzQ9LkiGv6aNsra3cNBJha7"
);
const DEVNET_URL = "https://api.devnet.solana.com";
const GLOBAL_STATE_SEED = Buffer.from("global_state");
const MINT_SEED = Buffer.from("helix_mint");
const MINT_AUTHORITY_SEED = Buffer.from("mint_authority");

const TEST_WALLET_PATH = path.resolve(
  __dirname,
  "../app/web/e2e/.test-wallet.json"
);

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  console.log("=== E2E Test Wallet Setup ===\n");

  const connection = new Connection(DEVNET_URL, "confirmed");

  // 1. Load admin keypair (protocol authority)
  const adminPath = path.resolve(process.env.HOME!, ".config/solana/id.json");
  if (!fs.existsSync(adminPath)) {
    console.error("Admin keypair not found at", adminPath);
    process.exit(1);
  }
  const adminKeypair = Keypair.fromSecretKey(
    Uint8Array.from(JSON.parse(fs.readFileSync(adminPath, "utf-8")))
  );
  console.log("Admin:", adminKeypair.publicKey.toBase58());

  // 2. Generate or load E2E test keypair
  let testKeypair: Keypair;
  if (fs.existsSync(TEST_WALLET_PATH)) {
    const saved = JSON.parse(fs.readFileSync(TEST_WALLET_PATH, "utf-8"));
    testKeypair = Keypair.fromSecretKey(Uint8Array.from(saved.secretKey));
    console.log("Loaded existing test wallet:", testKeypair.publicKey.toBase58());
  } else {
    testKeypair = Keypair.generate();
    fs.mkdirSync(path.dirname(TEST_WALLET_PATH), { recursive: true });
    fs.writeFileSync(
      TEST_WALLET_PATH,
      JSON.stringify({
        publicKey: testKeypair.publicKey.toBase58(),
        secretKey: Array.from(testKeypair.secretKey),
        secretKeyBase58: bs58.encode(testKeypair.secretKey),
      })
    );
    console.log("Generated new test wallet:", testKeypair.publicKey.toBase58());
  }
  console.log();

  // 3. Airdrop SOL if needed
  const solBalance =
    (await connection.getBalance(testKeypair.publicKey)) / LAMPORTS_PER_SOL;
  console.log("SOL balance:", solBalance);

  if (solBalance < 1) {
    console.log("Airdropping 2 SOL...");
    try {
      const sig = await connection.requestAirdrop(
        testKeypair.publicKey,
        2 * LAMPORTS_PER_SOL
      );
      await connection.confirmTransaction(sig, "confirmed");
      console.log("Airdrop confirmed:", sig);
      await sleep(2000);
    } catch (e: any) {
      console.error("Airdrop failed (may need manual funding):", e.message);
      console.error(
        "Run: solana transfer",
        testKeypair.publicKey.toBase58(),
        "2 --url devnet --allow-unfunded-recipient"
      );
    }
  } else {
    console.log("SOL balance sufficient, skipping airdrop");
  }
  console.log();

  // 4. Derive PDAs
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

  // 5. Create ATA if needed
  const testAta = getAssociatedTokenAddressSync(
    mintPda,
    testKeypair.publicKey,
    false,
    TOKEN_2022_PROGRAM_ID
  );

  let ataExists = false;
  try {
    await connection.getTokenAccountBalance(testAta);
    console.log("ATA exists:", testAta.toBase58());
    ataExists = true;
  } catch {
    console.log("Creating ATA...");
    try {
      const ix = createAssociatedTokenAccountInstruction(
        adminKeypair.publicKey, // payer
        testAta,
        testKeypair.publicKey,
        mintPda,
        TOKEN_2022_PROGRAM_ID,
        ASSOCIATED_TOKEN_PROGRAM_ID
      );
      const tx = new anchor.web3.Transaction().add(ix);
      tx.feePayer = adminKeypair.publicKey;
      tx.recentBlockhash = (
        await connection.getLatestBlockhash()
      ).blockhash;
      tx.sign(adminKeypair);
      const sig = await connection.sendRawTransaction(tx.serialize());
      await connection.confirmTransaction(sig, "confirmed");
      console.log("ATA created:", sig);
      ataExists = true;
      await sleep(2000);
    } catch (e: any) {
      console.error("ATA creation failed:", e.message);
    }
  }
  console.log();

  // 6. Mint HELIX tokens via admin_mint
  if (ataExists) {
    let tokenBalance = 0;
    try {
      const bal = await connection.getTokenAccountBalance(testAta);
      tokenBalance = Number(bal.value.uiAmount || 0);
    } catch {}

    console.log("HELIX balance:", tokenBalance);

    if (tokenBalance < 100) {
      console.log("Minting 500 HELIX to test wallet...");
      const idlPath = path.resolve(
        __dirname,
        "../target/idl/helix_staking.json"
      );
      const idl = JSON.parse(fs.readFileSync(idlPath, "utf-8"));

      const adminWallet = new anchor.Wallet(adminKeypair);
      const provider = new anchor.AnchorProvider(connection, adminWallet, {
        commitment: "confirmed",
      });
      const program = new Program(idl, provider);

      try {
        const mintAmount = new anchor.BN(500_0000_0000); // 500 HELIX (8 decimals)
        const tx = await program.methods
          .adminMint(mintAmount)
          .accountsPartial({
            authority: adminKeypair.publicKey,
            globalState,
            mint: mintPda,
            mintAuthority,
            recipientTokenAccount: testAta,
            tokenProgram: TOKEN_2022_PROGRAM_ID,
          })
          .rpc();
        console.log("Minted 500 HELIX. TX:", tx);
        await sleep(2000);
      } catch (e: any) {
        console.error(
          "admin_mint failed (may have hit cap):",
          e.message.slice(0, 150)
        );
      }
    } else {
      console.log("HELIX balance sufficient, skipping mint");
    }
  }
  console.log();

  // 7. Output summary
  const saved = JSON.parse(fs.readFileSync(TEST_WALLET_PATH, "utf-8"));
  console.log("=== Setup Complete ===");
  console.log("Test wallet:", testKeypair.publicKey.toBase58());
  console.log("Secret key (base58):", saved.secretKeyBase58);
  console.log("Wallet file:", TEST_WALLET_PATH);
  console.log();
  console.log(
    "To run transaction tests:\n  cd app/web && npx playwright test e2e/transactions/"
  );
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
