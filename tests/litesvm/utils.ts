import { PublicKey } from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";
import { fromWorkspace, LiteSVMProvider } from "anchor-litesvm";
import { LiteSVM, Clock } from "litesvm";
import BN from "bn.js";

const { Program } = anchor;

// Mirror PDA seeds from constants.rs
export const GLOBAL_STATE_SEED = Buffer.from("global_state");
export const MINT_AUTHORITY_SEED = Buffer.from("mint_authority");
export const MINT_SEED = Buffer.from("helix_mint");
export const STAKE_SEED = Buffer.from("stake");
export const REFERRAL_RECORD_SEED = Buffer.from("referral");

// Protocol defaults (mirror constants.rs)
export const DEFAULT_ANNUAL_INFLATION_BP = new BN(3_690_000);
export const DEFAULT_MIN_STAKE_AMOUNT = new BN(10_000_000);
export const DEFAULT_STARTING_SHARE_RATE = new BN(10_000);
export const DEFAULT_SLOTS_PER_DAY = new BN(216_000);
export const DEFAULT_CLAIM_PERIOD_DAYS = 180;

// Token-2022 Program ID
export const TOKEN_2022_PROGRAM_ID = new PublicKey(
  "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"
);

/**
 * Derives the GlobalState PDA address
 */
export function findGlobalStatePDA(programId: PublicKey): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [GLOBAL_STATE_SEED],
    programId
  );
}

/**
 * Derives the mint authority PDA address
 */
export function findMintAuthorityPDA(programId: PublicKey): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [MINT_AUTHORITY_SEED],
    programId
  );
}

/**
 * Derives the mint PDA address
 */
export function findMintPDA(programId: PublicKey): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [MINT_SEED],
    programId
  );
}

/**
 * Returns default initialization parameters matching protocol constants
 */
export function getDefaultInitializeParams() {
  return {
    annualInflationBp: DEFAULT_ANNUAL_INFLATION_BP,
    minStakeAmount: DEFAULT_MIN_STAKE_AMOUNT,
    startingShareRate: DEFAULT_STARTING_SHARE_RATE,
    slotsPerDay: DEFAULT_SLOTS_PER_DAY,
    claimPeriodDays: DEFAULT_CLAIM_PERIOD_DAYS,
    maxAdminMint: new BN("1000000000000000000"), // 10B tokens max for tests
  };
}

/**
 * Advances the LiteSVM clock by N slots and adjusts timestamp proportionally.
 * Assumes 400ms per slot for timestamp calculation.
 * Also expires the blockhash so sequential transactions don't get rejected as duplicates.
 */
export async function advanceClock(
  client: LiteSVM,
  slots: bigint
): Promise<Clock> {
  const currentClock = client.getClock();
  const newSlot = currentClock.slot + slots;
  const slotDurationMs = BigInt(400);
  const newTimestamp = currentClock.unixTimestamp + (slots * slotDurationMs) / BigInt(1000);

  const newClock = new Clock(
    newSlot,
    currentClock.epochStartTimestamp,
    currentClock.epoch,
    currentClock.leaderScheduleEpoch,
    newTimestamp
  );
  client.setClock(newClock);
  // Expire blockhash to prevent "AlreadyProcessed" errors when re-sending similar transactions
  client.expireBlockhash();
  return newClock;
}

/**
 * Derives the StakeAccount PDA address
 */
export function findStakePDA(
  programId: PublicKey,
  user: PublicKey,
  stakeId: BN | number
): [PublicKey, number] {
  const idBuffer = Buffer.alloc(8);
  const bn = BN.isBN(stakeId) ? stakeId : new BN(stakeId);
  bn.toArrayLike(Buffer, "le", 8).copy(idBuffer);
  return PublicKey.findProgramAddressSync(
    [STAKE_SEED, user.toBuffer(), idBuffer],
    programId
  );
}

/**
 * Sets up LiteSVM test environment with program loaded from workspace.
 * Returns client, provider, program, and payer.
 * Note: fromWorkspace is synchronous (no await needed).
 */
export function setupTest() {
  const client = fromWorkspace("./");
  // Enable Ed25519 and Secp256k1 precompiles (required for free_claim Ed25519 verify)
  client.withPrecompiles();
  const provider = new LiteSVMProvider(client);
  // Load IDL - use require for JSON import
  const IDL = require("../../target/idl/helix_staking.json");
  const program = new Program(IDL, provider);
  // Give the payer 100 SOL so tests can fund many keypairs without draining
  client.airdrop(provider.wallet.publicKey, BigInt(100_000_000_000));
  // Advance past slot 0 so init_slot is non-zero (matches bankrun behavior)
  const currentClock = client.getClock();
  const initClock = new Clock(
    currentClock.slot + BigInt(1),
    currentClock.epochStartTimestamp,
    currentClock.epoch,
    currentClock.leaderScheduleEpoch,
    currentClock.unixTimestamp + BigInt(1),
  );
  client.setClock(initClock);
  return { client, provider, program, payer: provider.wallet.payer };
}

/**
 * Initialize protocol and return useful accounts
 */
export async function initializeProtocol(program: any, payer: any) {
  const [globalStatePDA] = findGlobalStatePDA(program.programId);
  const [mintAuthorityPDA] = findMintAuthorityPDA(program.programId);
  const [mintPDA] = findMintPDA(program.programId);

  const params = getDefaultInitializeParams();

  await program.methods
    .initialize(params)
    .accounts({
      authority: payer.publicKey,
      globalState: globalStatePDA,
      mintAuthority: mintAuthorityPDA,
      mint: mintPDA,
      tokenProgram: TOKEN_2022_PROGRAM_ID,
    })
    .signers([payer])
    .rpc();

  return {
    globalState: globalStatePDA,
    mintAuthority: mintAuthorityPDA,
    mint: mintPDA,
  };
}

/**
 * Mint tokens to user using admin_mint instruction
 */
export async function mintTokensToUser(
  program: any,
  payer: any,
  globalState: PublicKey,
  mint: PublicKey,
  mintAuthority: PublicKey,
  userTokenAccount: PublicKey,
  amount: BN | number
) {
  const amountBn = BN.isBN(amount) ? amount : new BN(amount);

  await program.methods
    .adminMint(amountBn)
    .accounts({
      authority: payer.publicKey,
      globalState: globalState,
      mintAuthority: mintAuthority,
      mint: mint,
      recipientTokenAccount: userTokenAccount,
      tokenProgram: TOKEN_2022_PROGRAM_ID,
    })
    .signers([payer])
    .rpc();
}

/**
 * Derives the ReferralRecord PDA address.
 * Seeds: [b"referral", referrer, referee]
 */
export function findReferralRecordPDA(
  programId: PublicKey,
  referrer: PublicKey,
  referee: PublicKey,
): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [REFERRAL_RECORD_SEED, referrer.toBuffer(), referee.toBuffer()],
    programId,
  );
}

/**
 * Get token balance from Token-2022 account
 */
export async function getTokenBalance(
  client: LiteSVM,
  tokenAccount: PublicKey
): Promise<bigint> {
  const accountInfo = client.getAccount(tokenAccount);
  if (!accountInfo) {
    throw new Error("Token account not found");
  }

  // Parse Token-2022 account (amount is at offset 64, 8 bytes LE)
  const data = Buffer.from(accountInfo.data);
  return data.readBigUInt64LE(64);
}

// === Phase 24: Boost helpers ===

/** PDA seed for BoostRecord (mirrors BOOST_RECORD_SEED in constants.rs) */
export const BOOST_RECORD_SEED = Buffer.from("boost_record");

/**
 * Derives the BoostRecord PDA address.
 * Seeds: [b"boost_record", user]
 */
export function findBoostRecordPDA(
  programId: PublicKey,
  user: PublicKey
): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [BOOST_RECORD_SEED, user.toBuffer()],
    programId
  );
}

/**
 * Creates a new SPL Token (Token-2022) seed mint, creates an ATA for the user,
 * and mints the given amount to that ATA.
 *
 * Returns the seed mint PublicKey and the user's seed ATA PublicKey.
 */
export async function createSeedMintAndFund(
  program: any,
  payer: any,
  user: PublicKey,
  amount: bigint
): Promise<{ seedMint: PublicKey; seedAta: PublicKey }> {
  const {
    createMint,
    createAssociatedTokenAccount,
    mintTo,
    getAssociatedTokenAddressSync,
    TOKEN_2022_PROGRAM_ID: SPL_TOKEN_2022_PROGRAM_ID,
  } = require("@solana/spl-token");

  const client = (program.provider as any).client as LiteSVM;
  const connection = (program.provider as any).connection;

  // Create a new mint (decimals=6 for the seed token, separate from HLX)
  const seedMintKeypair = require("@solana/web3.js").Keypair.generate();
  const seedMint = seedMintKeypair.publicKey;

  // Use the program's provider to send transactions
  const provider = program.provider;

  // Build create-mint + create-ATA + mint-to in a batch
  const web3 = require("@solana/web3.js");
  const splToken = require("@solana/spl-token");

  // Create mint instruction (Token-2022)
  const mintSpace = splToken.getMintLen([]);
  const mintLamports = await splToken.getMinimumBalanceForRentExemptMint(connection);

  const createMintTx = new web3.Transaction().add(
    web3.SystemProgram.createAccount({
      fromPubkey: payer.publicKey,
      newAccountPubkey: seedMint,
      space: mintSpace,
      lamports: mintLamports,
      programId: new PublicKey("TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"),
    }),
    splToken.createInitializeMintInstruction(
      seedMint,
      6, // decimals
      payer.publicKey, // mint authority
      null, // freeze authority
      new PublicKey("TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb")
    )
  );
  await provider.sendAndConfirm(createMintTx, [payer, seedMintKeypair]);

  // Derive seed ATA address for user
  const seedAta = splToken.getAssociatedTokenAddressSync(
    seedMint,
    user,
    false,
    new PublicKey("TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb")
  );

  // Create ATA for user
  const createAtaTx = new web3.Transaction().add(
    splToken.createAssociatedTokenAccountInstruction(
      payer.publicKey,
      seedAta,
      user,
      seedMint,
      new PublicKey("TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb")
    )
  );
  await provider.sendAndConfirm(createAtaTx, [payer]);

  // Mint tokens to user's ATA
  if (amount > 0n) {
    const mintToTx = new web3.Transaction().add(
      splToken.createMintToInstruction(
        seedMint,
        seedAta,
        payer.publicKey,
        amount,
        [],
        new PublicKey("TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb")
      )
    );
    await provider.sendAndConfirm(mintToTx, [payer]);
  }

  return { seedMint, seedAta };
}

/**
 * Transfers seed tokens from one ATA to another using Token-2022.
 * Used in tests to adjust balances and test headroom / revocation scenarios.
 */
export async function transferSeedTokens(
  program: any,
  payer: any,
  fromAta: PublicKey,
  toAta: PublicKey,
  seedMint: PublicKey,
  authority: any, // Keypair that owns fromAta
  amount: bigint
): Promise<void> {
  const web3 = require("@solana/web3.js");
  const splToken = require("@solana/spl-token");

  const provider = program.provider;
  const tx = new web3.Transaction().add(
    splToken.createTransferInstruction(
      fromAta,
      toAta,
      authority.publicKey,
      amount,
      [],
      new PublicKey("TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb")
    )
  );
  await provider.sendAndConfirm(tx, [payer, authority]);
}

/**
 * Get seed token balance from a Token-2022 account (reuses getTokenBalance pattern).
 */
export async function getSeedTokenBalance(
  client: LiteSVM,
  seedAta: PublicKey
): Promise<bigint> {
  return getTokenBalance(client, seedAta);
}
