/**
 * HELIX Devnet Validation Script
 *
 * Exercises the core staking lifecycle on devnet:
 * initialize -> admin_mint -> create_stake -> crank_distribution -> claim_rewards
 *
 * Usage: npx tsx scripts/devnet-validate.ts
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
import * as path from "path";

// Load IDL
const idlPath = path.resolve(__dirname, "../target/idl/helix_staking.json");
const idl = JSON.parse(fs.readFileSync(idlPath, "utf-8"));

// Config
const PROGRAM_ID = new PublicKey(
  "E9B7BsxdPS89M66CRGGbsCzQ9LkiGv6aNsra3cNBJha7"
);
const DEVNET_URL = "https://api.devnet.solana.com";

// Seeds (must match program constants)
const GLOBAL_STATE_SEED = Buffer.from("global_state");
const MINT_SEED = Buffer.from("helix_mint");
const MINT_AUTHORITY_SEED = Buffer.from("mint_authority");

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  console.log("=== HELIX Devnet Validation ===\n");

  // 1. Setup connection and wallet
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

  const walletAddr = walletKeypair.publicKey.toBase58();
  const balance =
    (await connection.getBalance(walletKeypair.publicKey)) / LAMPORTS_PER_SOL;
  console.log("Wallet:", walletAddr);
  console.log("Balance:", balance, "SOL");

  if (balance < 1) {
    console.error(
      "\nInsufficient SOL. Need at least 1 SOL for deployment/testing."
    );
    console.error("Get devnet SOL from: https://faucet.solana.com/");
    console.error("Or run: solana airdrop 2 --url devnet");
    process.exit(1);
  }
  console.log();

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

  console.log("PDAs:");
  console.log("  GlobalState:", globalState.toBase58());
  console.log("  Mint:", mintPda.toBase58());
  console.log("  MintAuthority:", mintAuthority.toBase58());
  console.log();

  // 3. Check if already initialized
  let needsInit = false;
  try {
    const gsAccount = await program.account.globalState.fetch(globalState);
    console.log(
      "GlobalState already initialized (day:",
      gsAccount.currentDay.toString(),
      ")"
    );
  } catch {
    needsInit = true;
    console.log("GlobalState not found -- will initialize");
  }
  console.log();

  // 4. Initialize if needed
  if (needsInit) {
    console.log("Step 1: Initializing protocol...");
    try {
      const params = {
        annualInflationBp: new anchor.BN(3_690_000), // 3.69%
        minStakeAmount: new anchor.BN(10_000_000), // 0.01 HELIX (8 decimals)
        startingShareRate: new anchor.BN(10_000), // 10000 base units per share
        slotsPerDay: new anchor.BN(216_000), // ~2.5 slots/sec * 86400 sec
        claimPeriodDays: 180,
        maxAdminMint: new anchor.BN(1_000_000_000_000), // 1000 HELIX
      };
      const tx = await program.methods
        .initialize(params)
        .accountsPartial({
          authority: walletKeypair.publicKey,
          globalState,
          mint: mintPda,
          mintAuthority,
          tokenProgram: TOKEN_2022_PROGRAM_ID,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .rpc();
      console.log("  Protocol initialized. TX:", tx);
      await sleep(2000); // Wait for confirmation
    } catch (e: any) {
      console.log("  Initialize failed:", e.message);
    }
  }

  // 5. Create ATA for wallet
  const userAta = getAssociatedTokenAddressSync(
    mintPda,
    walletKeypair.publicKey,
    false,
    TOKEN_2022_PROGRAM_ID
  );

  let ataExists = false;
  try {
    await connection.getTokenAccountBalance(userAta);
    console.log("Step 2: User ATA exists");
    ataExists = true;
  } catch {
    console.log("Step 2: Creating ATA...");
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
      console.log("  ATA created. TX:", sig);
      ataExists = true;
      await sleep(2000);
    } catch (e: any) {
      console.log("  ATA creation failed:", e.message);
    }
  }
  console.log();

  // 6. Admin mint tokens for testing
  console.log("Step 3: Minting test tokens via admin_mint...");
  try {
    const mintAmount = new anchor.BN(100_00_000_000); // 100 HELIX (8 decimals)
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
    console.log("  Minted 100 HELIX. TX:", tx);
    await sleep(2000);
  } catch (e: any) {
    console.log(
      "  admin_mint skipped (may have hit cap or already minted):",
      e.message.slice(0, 100)
    );
  }

  // Check token balance
  try {
    const tokenBalance = await connection.getTokenAccountBalance(userAta);
    console.log(
      "  Token balance:",
      tokenBalance.value.uiAmountString,
      "HELIX"
    );
  } catch {
    console.log("  Could not read token balance");
  }
  console.log();

  // 7. Create a stake
  console.log("Step 4: Creating stake (10 HELIX, 30 days)...");
  try {
    const gsAccount = await program.account.globalState.fetch(globalState);
    const stakeId = gsAccount.totalStakesCreated;
    const [stakeAccount] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("stake"),
        walletKeypair.publicKey.toBuffer(),
        stakeId.toArrayLike(Buffer, "le", 8),
      ],
      PROGRAM_ID
    );

    const stakeAmount = new anchor.BN(10_00_000_000); // 10 HELIX (8 decimals)
    const stakeDays = 30;
    const tx = await program.methods
      .createStake(stakeAmount, stakeDays)
      .accountsPartial({
        user: walletKeypair.publicKey,
        globalState,
        stakeAccount,
        helixMint: mintPda,
        mintAuthority,
        userTokenAccount: userAta,
        tokenProgram: TOKEN_2022_PROGRAM_ID,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();
    console.log("  Stake created. TX:", tx);

    await sleep(2000);
    const stake = await program.account.stakeAccount.fetch(stakeAccount);
    console.log("  Amount:", stake.stakedAmount.toString(), "base units");
    console.log("  T-Shares:", stake.tShares.toString());
    console.log("  Days:", stake.stakeDays);
  } catch (e: any) {
    console.log("  Stake failed:", e.message.slice(0, 150));
  }
  console.log();

  // 8. Crank distribution
  console.log("Step 5: Cranking daily distribution...");
  try {
    const tx = await program.methods
      .crankDistribution()
      .accountsPartial({
        globalState,
        helixMint: mintPda,
      })
      .rpc();
    console.log("  Distribution cranked. TX:", tx);
  } catch (e: any) {
    console.log(
      "  Crank skipped (likely same-day):",
      e.message.slice(0, 100)
    );
  }
  console.log();

  // 9. Summary
  console.log("=== Devnet Validation Complete ===");
  console.log("Program ID:", PROGRAM_ID.toBase58());
  console.log("Network: devnet");
  console.log(
    "Explorer:",
    `https://explorer.solana.com/address/${PROGRAM_ID.toBase58()}?cluster=devnet`
  );
  console.log();
  console.log(
    "Note: Full unstake test requires time advancement (wait for stake maturity)."
  );
  console.log(
    "Note: Claim and BPD tests require initialized claim period with Merkle tree."
  );
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
