/**
 * Playwright globalSetup — waits for the Docker validator already running at
 * localhost:8899 (started by Plan 09.1-01 scripts), loads the bootstrap
 * admin keypair (docker/test-wallet.json), funds a test wallet, creates
 * pre-existing stakes, and cranks distribution so reward-related tests have
 * data to work with.
 *
 * KEY DIFFERENCES from the old standalone-validator setup:
 *  - Does NOT spawn solana-test-validator (conflicts with Docker validator)
 *  - Does NOT kill any existing process on port 8899
 *  - Does NOT write a PID file (Docker validator is not managed by Playwright)
 *  - Loads docker/test-wallet.json as admin (GlobalState authority)
 *  - Skips initialize() if GlobalState already exists (bootstrap.ts ran it)
 */

import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
} from "@solana/web3.js";
import {
  TOKEN_2022_PROGRAM_ID,
  getAssociatedTokenAddressSync,
  createAssociatedTokenAccountInstruction,
} from "@solana/spl-token";
import * as fs from "fs";
import * as path from "path";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const PROGRAM_ID = new PublicKey(
  "E9B7BsxdPS89M66CRGGbsCzQ9LkiGv6aNsra3cNBJha7"
);
const LOCALNET_URL = "http://localhost:8899";
const IDL_PATH = path.resolve(__dirname, "../../../target/idl/helix_staking.json");
const WALLET_OUT = path.resolve(__dirname, ".test-wallet.json");
// Referrer pubkey for referral-stake E2E test — written each run so the spec
// can read it and know which pubkey to use as ?ref= parameter.
export const REFERRER_PUBKEY_OUT = path.resolve(__dirname, ".referrer-pubkey.txt");

// Docker bootstrap keypair — this IS the GlobalState authority.
// bootstrap.ts initializes the protocol with this keypair on validator start.
const DOCKER_WALLET_PATH = path.resolve(__dirname, "../../../docker/test-wallet.json");

const GLOBAL_STATE_SEED = Buffer.from("global_state");
const MINT_SEED = Buffer.from("helix_mint");
const MINT_AUTHORITY_SEED = Buffer.from("mint_authority");
const STAKE_SEED = Buffer.from("stake");

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function waitForValidator(url: string, timeoutMs = 30_000) {
  const conn = new Connection(url, "confirmed");
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      await conn.getSlot();
      return;
    } catch {
      await sleep(500);
    }
  }
  throw new Error(`Validator at ${url} did not respond within ${timeoutMs}ms`);
}

async function airdrop(conn: Connection, to: PublicKey, sol: number) {
  const sig = await conn.requestAirdrop(to, sol * LAMPORTS_PER_SOL);
  await conn.confirmTransaction(sig, "confirmed");
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

export default async function globalSetup() {
  // 1. Wait for the Docker validator (already running at localhost:8899)
  console.log("[global-setup] Waiting for Docker validator at localhost:8899...");
  await waitForValidator(LOCALNET_URL, 30_000);
  console.log("[global-setup] Docker validator ready.");
  // No PID file written — Docker validator lifecycle is not managed by Playwright.

  // 2. Setup connection + load Docker bootstrap wallet (GlobalState authority)
  const connection = new Connection(LOCALNET_URL, "confirmed");

  const adminKeypair = Keypair.fromSecretKey(
    Uint8Array.from(JSON.parse(fs.readFileSync(DOCKER_WALLET_PATH, "utf-8")))
  );
  const admin = adminKeypair;
  console.log("[global-setup] Loaded Docker admin wallet:", admin.publicKey.toBase58());

  const wallet = new anchor.Wallet(admin);
  const provider = new anchor.AnchorProvider(connection, wallet, {
    commitment: "confirmed",
    preflightCommitment: "confirmed",
  });
  const idl = JSON.parse(fs.readFileSync(IDL_PATH, "utf-8"));
  const program = new Program(idl, provider);

  // 3. Derive PDAs
  const [globalState] = PublicKey.findProgramAddressSync([GLOBAL_STATE_SEED], PROGRAM_ID);
  const [mintPda] = PublicKey.findProgramAddressSync([MINT_SEED], PROGRAM_ID);
  const [mintAuthority] = PublicKey.findProgramAddressSync([MINT_AUTHORITY_SEED], PROGRAM_ID);

  // 4. Skip initialize() — bootstrap.ts already ran it when Docker validator started.
  //    Only initialize if GlobalState is somehow missing (should not happen normally).
  try {
    await program.account.globalState.fetch(globalState);
    console.log("[global-setup] Protocol already initialized (Docker bootstrap). Skipping init.");
  } catch {
    // Fallback: initialize if GlobalState is missing (defensive — should not occur)
    console.log("[global-setup] GlobalState not found — initializing protocol...");
    const params = {
      annualInflationBp: new anchor.BN(3_690_000),
      minStakeAmount: new anchor.BN(10_000_000),    // 0.01 HELIX (8 decimals)
      startingShareRate: new anchor.BN(10_000),
      slotsPerDay: new anchor.BN(10),                // 1 "day" = 10 slots ~4s
      claimPeriodDays: 180,
      maxAdminMint: new anchor.BN(1_000_000_000_000), // 1000 HELIX
    };
    await program.methods
      .initialize(params)
      .accountsPartial({
        authority: admin.publicKey,
        globalState,
        mint: mintPda,
        mintAuthority,
        tokenProgram: TOKEN_2022_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
      })
      .rpc();
    console.log("[global-setup] Protocol initialized.");
  }

  // 5. Load the pre-generated test wallet keypair (written by playwright.config.ts)
  const walletData = JSON.parse(fs.readFileSync(WALLET_OUT, "utf-8"));
  const testWallet = Keypair.fromSecretKey(Uint8Array.from(walletData.secretKey));
  await airdrop(connection, testWallet.publicKey, 10);

  // 5a. Create a dedicated referrer keypair for referral-stake.spec.ts.
  //     Using the admin wallet as referrer would cause SelfReferral (if admin IS the
  //     connected wallet) or a different ATA issue. A dedicated keypair avoids both.
  //     We generate it fresh each run, fund it, create its ATA, and write its pubkey
  //     to .referrer-pubkey.txt so the spec can read it.
  const referrerKeypair = Keypair.generate();
  await airdrop(connection, referrerKeypair.publicKey, 1);
  const referrerAta = getAssociatedTokenAddressSync(
    mintPda,
    referrerKeypair.publicKey,
    false,
    TOKEN_2022_PROGRAM_ID
  );
  const referrerAtaIx = createAssociatedTokenAccountInstruction(
    admin.publicKey,
    referrerAta,
    referrerKeypair.publicKey,
    mintPda,
    TOKEN_2022_PROGRAM_ID
  );
  const referrerAtaTx = new anchor.web3.Transaction().add(referrerAtaIx);
  await provider.sendAndConfirm(referrerAtaTx);
  // Write referrer pubkey to disk so referral-stake.spec.ts can read it
  fs.writeFileSync(REFERRER_PUBKEY_OUT, referrerKeypair.publicKey.toBase58());
  console.log("[global-setup] Referrer wallet created:", referrerKeypair.publicKey.toBase58());

  // 6. Create ATA for test wallet
  const testAta = getAssociatedTokenAddressSync(
    mintPda,
    testWallet.publicKey,
    false,
    TOKEN_2022_PROGRAM_ID
  );
  const createAtaIx = createAssociatedTokenAccountInstruction(
    admin.publicKey,
    testAta,
    testWallet.publicKey,
    mintPda,
    TOKEN_2022_PROGRAM_ID
  );
  const ataTx = new anchor.web3.Transaction().add(createAtaIx);
  await provider.sendAndConfirm(ataTx);

  // 7. admin_mint 500 HELIX to test wallet
  console.log("[global-setup] Minting 500 HELIX to test wallet...");
  const mintAmount = new anchor.BN(500_00_000_000); // 500 HELIX (8 decimals)
  await program.methods
    .adminMint(mintAmount)
    .accountsPartial({
      authority: admin.publicKey,
      globalState,
      mintAuthority,
      mint: mintPda,
      recipientTokenAccount: testAta,
      tokenProgram: TOKEN_2022_PROGRAM_ID,
    })
    .rpc();

  // 8. Create 2 pre-existing stakes for end-stake / claim-rewards tests.
  //    Test wallet signs these, so use a separate provider.
  const testWalletObj = new anchor.Wallet(testWallet);
  const testProvider = new anchor.AnchorProvider(connection, testWalletObj, {
    commitment: "confirmed",
    preflightCommitment: "confirmed",
  });
  const testProgram = new Program(idl, testProvider);

  async function createStake(amount: number, days: number) {
    const gs = await testProgram.account.globalState.fetch(globalState);
    const stakeId = gs.totalStakesCreated;
    const [stakeAccount] = PublicKey.findProgramAddressSync(
      [STAKE_SEED, testWallet.publicKey.toBuffer(), stakeId.toArrayLike(Buffer, "le", 8)],
      PROGRAM_ID
    );
    await testProgram.methods
      .createStake(new anchor.BN(amount), days)
      .accountsPartial({
        user: testWallet.publicKey,
        globalState,
        stakeAccount,
        userTokenAccount: testAta,
        mint: mintPda,
        tokenProgram: TOKEN_2022_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
      })
      .rpc();
    return stakeAccount;
  }

  console.log("[global-setup] Creating pre-existing stakes...");
  await createStake(10_00_000_000, 30);   // Stake #1: 10 HELIX / 30 days (for end-stake test)
  await createStake(5_00_000_000, 60);    // Stake #2: 5 HELIX / 60 days  (for claim-rewards test)
  console.log("[global-setup] 2 stakes created.");

  // 9. Wait for ~50 slots so multiple "days" have elapsed (slotsPerDay=10 per bootstrap)
  console.log("[global-setup] Waiting for slots to advance...");
  const startSlot = await connection.getSlot();
  while ((await connection.getSlot()) - startSlot < 50) {
    await sleep(400);
  }

  // 10. Crank distribution 3+ times to accumulate rewards
  console.log("[global-setup] Cranking distribution...");
  for (let i = 0; i < 5; i++) {
    try {
      await program.methods
        .crankDistribution()
        .accountsPartial({
          cranker: admin.publicKey,
          globalState,
          mint: mintPda,
          mintAuthority,
          tokenProgram: TOKEN_2022_PROGRAM_ID,
        })
        .rpc();
    } catch {
      // Already cranked for this day — skip
    }
    // Wait for next day to elapse
    const s = await connection.getSlot();
    while ((await connection.getSlot()) - s < 12) {
      await sleep(400);
    }
  }
  console.log("[global-setup] Distribution cranked.");

  console.log("[global-setup] Done. Test wallet:", testWallet.publicKey.toBase58());
}
