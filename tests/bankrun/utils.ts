import { PublicKey } from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";
import { startAnchor, BanksClient, ProgramTestContext, Clock } from "solana-bankrun";
import { BankrunProvider } from "anchor-bankrun";
import BN from "bn.js";

const { Program } = anchor;

// Mirror PDA seeds from constants.rs
export const GLOBAL_STATE_SEED = Buffer.from("global_state");
export const MINT_AUTHORITY_SEED = Buffer.from("mint_authority");
export const MINT_SEED = Buffer.from("helix_mint");

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
  };
}

/**
 * Advances the Bankrun clock by N slots and adjusts timestamp proportionally.
 * Assumes 400ms per slot for timestamp calculation.
 */
export async function advanceClock(
  context: ProgramTestContext,
  slots: bigint
): Promise<Clock> {
  const currentClock = await context.banksClient.getClock();
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
  context.setClock(newClock);
  return newClock;
}

/**
 * Sets up Bankrun test environment with program loaded from IDL.
 * Returns context, provider, program, and payer.
 */
export async function setupTest() {
  const context = await startAnchor("./", [], []);
  const provider = new BankrunProvider(context);
  // Load IDL - use require for JSON import
  const IDL = require("../../target/idl/helix_staking.json");
  const program = new Program(IDL, provider);
  return { context, provider, program, payer: context.payer };
}
