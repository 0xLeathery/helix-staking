import BN from "bn.js";
import {
  PRECISION,
  LPB_MAX_DAYS,
  BPB_THRESHOLD,
  BPS_SCALER,
  MIN_PENALTY_BPS,
  GRACE_PERIOD_DAYS,
  LATE_PENALTY_WINDOW_DAYS,
} from "./constants";

// BN constants used in calculations
const ZERO = new BN(0);
const ONE = new BN(1);
const TWO = new BN(2);

/**
 * Multiply then divide using BN to avoid overflow.
 * Formula: (a * b) / c
 */
function mulDiv(a: BN, b: BN, c: BN): BN {
  return a.mul(b).div(c);
}

/**
 * Multiply then divide with round-up for protocol-favorable calculations.
 * Formula: ((a * b) + (c - 1)) / c
 */
function mulDivUp(a: BN, b: BN, c: BN): BN {
  return a.mul(b).add(c.sub(ONE)).div(c);
}

/**
 * Calculate Duration Bonus (LPB) multiplier.
 * Returns bonus scaled by PRECISION (e.g., 2 * PRECISION = 2x bonus at max).
 *
 * - 0 days -> 0
 * - 1 day -> 0 (formula: (1-1) * 2 * PRECISION / LPB_MAX_DAYS = 0)
 * - >= LPB_MAX_DAYS (3641) -> 2 * PRECISION
 * - Formula: (days - 1) * 2 * PRECISION / LPB_MAX_DAYS
 */
export function calculateLpbBonus(stakeDays: BN): BN {
  if (stakeDays.isZero()) {
    return ZERO;
  }

  const lpbMaxDays = new BN(LPB_MAX_DAYS);

  if (stakeDays.gte(lpbMaxDays)) {
    return TWO.mul(PRECISION);
  }

  // (days - 1) * 2 * PRECISION / LPB_MAX_DAYS
  const daysMinusOne = stakeDays.sub(ONE);
  const numerator = daysMinusOne.mul(TWO).mul(PRECISION);
  return numerator.div(lpbMaxDays);
}

/**
 * Calculate Size Bonus (BPB) multiplier.
 * Returns bonus scaled by PRECISION (max = PRECISION = 100% bonus).
 *
 * - 0 amount -> 0
 * - >= BPB_THRESHOLD * 10 -> PRECISION (100%)
 * - Formula: (amount / 10) * PRECISION / BPB_THRESHOLD
 */
export function calculateBpbBonus(stakedAmount: BN): BN {
  if (stakedAmount.isZero()) {
    return ZERO;
  }

  const TEN = new BN(10);
  const amountDiv10 = stakedAmount.div(TEN);

  if (amountDiv10.gte(BPB_THRESHOLD)) {
    return PRECISION.clone();
  }

  // (amount / 10) * PRECISION / BPB_THRESHOLD
  return mulDiv(amountDiv10, PRECISION, BPB_THRESHOLD);
}

/**
 * Calculate T-shares from staked amount, applying LPB + BPB bonuses and share rate.
 * Formula: amount * (PRECISION + lpb + bpb) / shareRate
 *
 * Uses BN arithmetic to match on-chain u128 intermediate calculation.
 */
export function calculateTShares(
  stakedAmount: BN,
  stakeDays: BN,
  shareRate: BN
): BN {
  if (shareRate.isZero()) {
    throw new Error("Share rate cannot be zero");
  }

  const lpbBonus = calculateLpbBonus(stakeDays);
  const bpbBonus = calculateBpbBonus(stakedAmount);

  // total_multiplier = PRECISION + lpb + bpb
  const totalMultiplier = PRECISION.add(lpbBonus).add(bpbBonus);

  // t_shares = staked_amount * total_multiplier / share_rate
  return stakedAmount.mul(totalMultiplier).div(shareRate);
}

/**
 * Calculate early unstake penalty.
 * Returns penalty amount in base token units.
 *
 * - Returns 0 if currentSlot >= endSlot (stake matured)
 * - Minimum 50% penalty enforced
 * - Rounds UP to favor protocol (mul_div_up)
 */
export function calculateEarlyPenalty(
  stakedAmount: BN,
  startSlot: BN,
  currentSlot: BN,
  endSlot: BN
): BN {
  // Not early if current >= end
  if (currentSlot.gte(endSlot)) {
    return ZERO;
  }

  const bpsScaler = new BN(BPS_SCALER);
  const minPenaltyBps = new BN(MIN_PENALTY_BPS);

  const totalDuration = endSlot.sub(startSlot);
  const elapsed = currentSlot.sub(startSlot);

  // served_fraction_bps = (elapsed * BPS_SCALER) / total_duration
  const servedFractionBps = elapsed.mul(bpsScaler).div(totalDuration);

  // penalty_bps = BPS_SCALER - served_fraction_bps
  let penaltyBps = bpsScaler.sub(servedFractionBps);

  // Enforce minimum 50% penalty
  if (penaltyBps.lt(minPenaltyBps)) {
    penaltyBps = minPenaltyBps;
  }

  // Return penalty amount (ROUNDED UP to favor protocol)
  return mulDivUp(stakedAmount, penaltyBps, bpsScaler);
}

/**
 * Calculate late unstake penalty.
 * Returns penalty amount in base token units.
 *
 * - Returns 0 if currentSlot <= endSlot (not late)
 * - Returns 0 within grace period (14 days)
 * - Linear to 100% over 351 days after grace
 * - Caps at 100%
 * - Rounds UP to favor protocol
 */
export function calculateLatePenalty(
  stakedAmount: BN,
  endSlot: BN,
  currentSlot: BN,
  slotsPerDay: BN
): BN {
  // Not late if current <= end
  if (currentSlot.lte(endSlot)) {
    return ZERO;
  }

  const bpsScaler = new BN(BPS_SCALER);
  const gracePeriodDays = new BN(GRACE_PERIOD_DAYS);
  const latePenaltyWindowDays = new BN(LATE_PENALTY_WINDOW_DAYS);

  const slotsLate = currentSlot.sub(endSlot);
  const lateDays = slotsLate.div(slotsPerDay);

  // No penalty within grace period
  if (lateDays.lte(gracePeriodDays)) {
    return ZERO;
  }

  const penaltyDays = lateDays.sub(gracePeriodDays);

  // penalty_bps = penalty_days * BPS_SCALER / LATE_PENALTY_WINDOW_DAYS
  let penaltyBps = mulDiv(penaltyDays, bpsScaler, latePenaltyWindowDays);

  // Cap at 100% (BPS_SCALER)
  if (penaltyBps.gt(bpsScaler)) {
    penaltyBps = bpsScaler;
  }

  // Return penalty amount (ROUNDED UP to favor protocol)
  return mulDivUp(stakedAmount, penaltyBps, bpsScaler);
}

/**
 * Calculate pending rewards for a stake.
 * Formula: (t_shares * current_share_rate) - reward_debt
 *
 * No PRECISION division needed - reward_debt is stored at the same scale.
 * Uses saturating subtraction (returns 0 if debt > current value).
 */
export function calculatePendingRewards(
  tShares: BN,
  currentShareRate: BN,
  rewardDebt: BN
): BN {
  const currentValue = tShares.mul(currentShareRate);

  // Saturating sub: if rewardDebt > currentValue, return 0
  if (currentValue.lte(rewardDebt)) {
    return ZERO;
  }

  return currentValue.sub(rewardDebt);
}
