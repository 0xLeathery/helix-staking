import { PublicKey } from "@solana/web3.js";
import BN from "bn.js";

// ============================================================================
// Program ID
// ============================================================================

export const PROGRAM_ID = new PublicKey(
  "E9B7BsxdPS89M66CRGGbsCzQ9LkiGv6aNsra3cNBJha7"
);

// ============================================================================
// Token Constants
// ============================================================================

export const TOKEN_DECIMALS = 8;

// ============================================================================
// Protocol Constants (from programs/helix-staking/src/constants.rs)
// ============================================================================

/** Fixed-point scaling factor (1e9) for bonus/reward calculations */
export const PRECISION = new BN(1_000_000_000);

/** Maximum stake duration in days */
export const MAX_STAKE_DAYS = 5555;

/** Minimum stake duration in days */
export const MIN_STAKE_DAYS = 1;

/** Days for full 2x Duration Bonus (LPB) */
export const LPB_MAX_DAYS = 3641;

/** Size Bonus (BPB) threshold: 150M tokens in base units (8 decimals) */
export const BPB_THRESHOLD = new BN("15000000000000000");

/** Grace period after maturity (days) */
export const GRACE_PERIOD_DAYS = 14;

/** Late penalty window (365 - 14 grace = 351 days to reach 100%) */
export const LATE_PENALTY_WINDOW_DAYS = 351;

/** Minimum early unstake penalty in basis points (50%) */
export const MIN_PENALTY_BPS = 5000;

/** Basis points scaler */
export const BPS_SCALER = 10_000;

/** Solana slots per logical day (~400ms per slot) */
export const SLOTS_PER_DAY = 216_000;

// ============================================================================
// PDA Seeds
// ============================================================================

export const GLOBAL_STATE_SEED = Buffer.from("global_state");
export const MINT_SEED = Buffer.from("helix_mint");
export const MINT_AUTHORITY_SEED = Buffer.from("mint_authority");
export const STAKE_SEED = Buffer.from("stake");
export const CLAIM_CONFIG_SEED = Buffer.from("claim_config");
export const CLAIM_STATUS_SEED = Buffer.from("claim_status");

// ============================================================================
// Display Labels (user-facing terminology from CONTEXT.md)
// ============================================================================

export const LABELS = {
  LPB: "Duration Bonus",
  BPB: "Size Bonus",
  SHARE_RATE: "T-Share Price",
  T_SHARES: "T-Shares",
  BIG_PAY_DAY: "Big Pay Day",
  FREE_CLAIM: "Free Claim",
  EARLY_UNSTAKE: "Early Unstake",
  ON_TIME_UNSTAKE: "End Stake",
  LATE_UNSTAKE: "End Stake (Late)",
} as const;
