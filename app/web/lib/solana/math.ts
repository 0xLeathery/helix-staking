import BN from "bn.js";
import {
  PRECISION,
  LPB_MAX_DAYS,
  BPB_THRESHOLD,
  BPS_SCALER,
  MIN_PENALTY_BPS,
  GRACE_PERIOD_DAYS,
  LATE_PENALTY_WINDOW_DAYS,
  LOYALTY_MAX_BONUS,
  BPB_TIER_2,
  BPB_TIER_3,
  BPB_MAX_BONUS,
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
 * Calculate Size Bonus (BPB) multiplier with diminishing returns.
 * Returns bonus scaled by PRECISION.
 *
 * Tier 1: 0 → BPB_THRESHOLD×10 (1.5B tokens): Linear 0 → PRECISION (100%)
 * Tier 2: 1.5B → BPB_TIER_2 (5B tokens): Linear 1.0x → 1.25x
 * Tier 3: BPB_TIER_2 → BPB_TIER_3 (10B tokens): Linear 1.25x → 1.4x
 * Tier 4: Above BPB_TIER_3: Hard cap at BPB_MAX_BONUS (1.5x)
 */
export function calculateBpbBonus(stakedAmount: BN): BN {
  if (stakedAmount.isZero()) {
    return ZERO;
  }

  const TEN = new BN(10);
  const amountDiv10 = stakedAmount.div(TEN);

  // Tier 1: Linear 0 → PRECISION (backward compatible)
  if (amountDiv10.lt(BPB_THRESHOLD)) {
    return mulDiv(amountDiv10, PRECISION, BPB_THRESHOLD);
  }

  // Base bonus at threshold = 1.0x = PRECISION
  let bonus = PRECISION.clone();

  const thresholdRaw = BPB_THRESHOLD.mul(TEN);

  // Tier 2: 1.0x → 1.25x
  const TIER_2_BONUS = new BN("250000000"); // 0.25x
  if (stakedAmount.lte(BPB_TIER_2)) {
    const excess = stakedAmount.sub(thresholdRaw);
    const tierRange = BPB_TIER_2.sub(thresholdRaw);
    bonus = bonus.add(mulDiv(excess, TIER_2_BONUS, tierRange));
  } else {
    bonus = bonus.add(TIER_2_BONUS);

    // Tier 3: 1.25x → 1.4x
    const TIER_3_BONUS = new BN("150000000"); // 0.15x
    if (stakedAmount.lte(BPB_TIER_3)) {
      const excess = stakedAmount.sub(BPB_TIER_2);
      const tierRange = BPB_TIER_3.sub(BPB_TIER_2);
      bonus = bonus.add(mulDiv(excess, TIER_3_BONUS, tierRange));
    } else {
      // Above tier 3: hard cap
      bonus = BPB_MAX_BONUS.clone();
    }
  }

  // Safety cap
  return BN.min(bonus, BPB_MAX_BONUS);
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

/**
 * Calculate loyalty bonus based on proportion of committed term served.
 * Returns bonus in PRECISION units (0 to LOYALTY_MAX_BONUS).
 *
 * Formula: loyalty_bonus = min(days_served / committed_days, 1) × LOYALTY_MAX_BONUS
 */
export function calculateLoyaltyBonus(
  startSlot: BN,
  currentSlot: BN,
  committedDays: BN,
  slotsPerDay: BN,
): BN {
  if (committedDays.isZero() || slotsPerDay.isZero()) return ZERO;

  const elapsedSlots = BN.max(currentSlot.sub(startSlot), ZERO);
  const daysServed = elapsedSlots.div(slotsPerDay);
  const cappedDays = BN.min(daysServed, committedDays);

  return mulDiv(cappedDays, LOYALTY_MAX_BONUS, committedDays);
}

/**
 * Apply loyalty multiplier to pending rewards.
 * Returns: rewards × (1 + loyaltyBonus / PRECISION)
 */
export function applyLoyaltyMultiplier(pendingRewards: BN, loyaltyBonus: BN): BN {
  if (pendingRewards.isZero() || loyaltyBonus.isZero()) return pendingRewards;
  const totalMultiplier = PRECISION.add(loyaltyBonus);
  return mulDiv(pendingRewards, totalMultiplier, PRECISION);
}
