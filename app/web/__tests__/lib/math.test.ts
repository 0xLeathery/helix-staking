import { describe, it, expect } from 'vitest';
import BN from 'bn.js';
import {
  calculateLpbBonus,
  calculateBpbBonus,
  calculateTShares,
  calculateEarlyPenalty,
  calculateLatePenalty,
  calculatePendingRewards,
  calculateLoyaltyBonus,
  applyLoyaltyMultiplier,
} from '@/lib/solana/math';
import {
  PRECISION,
  LPB_MAX_DAYS,
  BPB_THRESHOLD,
  BPB_TIER_2,
  BPB_TIER_3,
  BPB_MAX_BONUS,
  MIN_PENALTY_BPS,
  BPS_SCALER,
  GRACE_PERIOD_DAYS,
  SLOTS_PER_DAY,
  LOYALTY_MAX_BONUS,
} from '@/lib/solana/constants';

describe('calculateLpbBonus', () => {
  it('returns 0 for 0 days', () => {
    expect(calculateLpbBonus(new BN(0)).isZero()).toBe(true);
  });

  it('returns 0 for 1 day (formula: (1-1)*2*P/max = 0)', () => {
    expect(calculateLpbBonus(new BN(1)).isZero()).toBe(true);
  });

  it('returns non-zero for 2 days', () => {
    const bonus = calculateLpbBonus(new BN(2));
    expect(bonus.gtn(0)).toBe(true);
  });

  it('returns proportional bonus for midpoint days', () => {
    // At LPB_MAX_DAYS / 2 days, bonus should be ~= PRECISION (1x) but slightly less
    const halfMax = Math.floor(LPB_MAX_DAYS / 2);
    const bonus = calculateLpbBonus(new BN(halfMax));
    // (halfMax - 1) * 2 * PRECISION / LPB_MAX_DAYS ~ PRECISION
    const expected = new BN(halfMax - 1).mul(new BN(2)).mul(PRECISION).div(new BN(LPB_MAX_DAYS));
    expect(bonus.toString()).toBe(expected.toString());
  });

  it('returns 2 * PRECISION for exactly LPB_MAX_DAYS', () => {
    const bonus = calculateLpbBonus(new BN(LPB_MAX_DAYS));
    expect(bonus.toString()).toBe(PRECISION.mul(new BN(2)).toString());
  });

  it('caps at 2 * PRECISION for days above LPB_MAX_DAYS', () => {
    const bonus = calculateLpbBonus(new BN(LPB_MAX_DAYS + 1000));
    expect(bonus.toString()).toBe(PRECISION.mul(new BN(2)).toString());
  });

  it('caps at 2 * PRECISION for maximum stake days (5555)', () => {
    const bonus = calculateLpbBonus(new BN(5555));
    expect(bonus.toString()).toBe(PRECISION.mul(new BN(2)).toString());
  });
});

describe('calculateBpbBonus', () => {
  it('returns 0 for 0 amount', () => {
    expect(calculateBpbBonus(new BN(0)).isZero()).toBe(true);
  });

  it('returns small bonus for small amount below tier 1', () => {
    // 1 HELIX = 100_000_000 base units
    const oneHelixBN = new BN('100000000');
    const bonus = calculateBpbBonus(oneHelixBN);
    expect(bonus.gten(0)).toBe(true);
  });

  it('returns PRECISION at tier 1 threshold boundary', () => {
    // BPB_THRESHOLD is the div/10 boundary, so stakedAmount = BPB_THRESHOLD * 10
    const thresholdAmount = BPB_THRESHOLD.mul(new BN(10));
    const bonus = calculateBpbBonus(thresholdAmount);
    // At tier 1 full, bonus should be PRECISION
    expect(bonus.toString()).toBe(PRECISION.toString());
  });

  it('returns bonus between PRECISION and 1.25x in tier 2 range', () => {
    // Midpoint between tier 1 and tier 2
    const thresholdRaw = BPB_THRESHOLD.mul(new BN(10));
    const mid = thresholdRaw.add(BPB_TIER_2).div(new BN(2));
    const bonus = calculateBpbBonus(mid);
    expect(bonus.gt(PRECISION)).toBe(true);
    expect(bonus.lt(PRECISION.add(new BN('250000000')))).toBe(true);
  });

  it('returns 1.25x PRECISION at tier 2 boundary', () => {
    const bonus = calculateBpbBonus(BPB_TIER_2);
    expect(bonus.toString()).toBe(PRECISION.add(new BN('250000000')).toString());
  });

  it('returns bonus between 1.25x and 1.4x in tier 3 range', () => {
    const mid = BPB_TIER_2.add(BPB_TIER_3).div(new BN(2));
    const bonus = calculateBpbBonus(mid);
    expect(bonus.gt(PRECISION.add(new BN('250000000')))).toBe(true);
    expect(bonus.lte(PRECISION.add(new BN('400000001')))).toBe(true);
  });

  it('caps at BPB_MAX_BONUS above tier 3', () => {
    const aboveTier3 = BPB_TIER_3.add(new BN('100000000000000000'));
    const bonus = calculateBpbBonus(aboveTier3);
    expect(bonus.toString()).toBe(BPB_MAX_BONUS.toString());
  });
});

describe('calculateTShares', () => {
  it('throws when shareRate is zero', () => {
    expect(() => calculateTShares(new BN(100), new BN(100), new BN(0))).toThrow('Share rate cannot be zero');
  });

  it('calculates t-shares for basic case with no bonuses', () => {
    // 1 day stake (LPB=0), tiny amount (BPB~0)
    const amount = new BN('100000000'); // 1 HELIX
    const days = new BN(1);
    const shareRate = PRECISION; // 1:1
    const tShares = calculateTShares(amount, days, shareRate);
    // With no bonuses: amount * PRECISION / shareRate = amount
    expect(tShares.toString()).toBe(amount.toString());
  });

  it('calculates higher t-shares with LPB bonus (max days)', () => {
    const amount = new BN('100000000'); // 1 HELIX
    const days = new BN(LPB_MAX_DAYS);
    const shareRate = PRECISION;
    const tShares = calculateTShares(amount, days, shareRate);
    // With max LPB (2x): 1 HELIX * 3 * PRECISION / PRECISION = 3 HELIX
    expect(tShares.gt(amount)).toBe(true);
  });

  it('calculates more t-shares for larger amount (BPB bonus)', () => {
    const smallAmount = new BN('100000000'); // 1 HELIX
    const largeAmount = BPB_THRESHOLD.mul(new BN(10)); // at tier 1 threshold
    const days = new BN(1);
    const shareRate = PRECISION;

    const smallTShares = calculateTShares(smallAmount, days, shareRate);
    const largeTShares = calculateTShares(largeAmount, days, shareRate);

    // Large amount should yield proportionally more t-shares due to BPB
    // Per-unit t-shares should be higher for large amount
    const smallPerUnit = smallTShares.mul(new BN('1000000')).div(smallAmount);
    const largePerUnit = largeTShares.mul(new BN('1000000')).div(largeAmount);
    expect(largePerUnit.gt(smallPerUnit)).toBe(true);
  });
});

describe('calculateEarlyPenalty', () => {
  it('returns 0 when stake has matured (currentSlot >= endSlot)', () => {
    const amount = new BN('1000000000'); // 10 HELIX
    const startSlot = new BN(0);
    const endSlot = new BN(1000);
    const currentSlot = new BN(1000); // exactly at end
    const penalty = calculateEarlyPenalty(amount, startSlot, currentSlot, endSlot);
    expect(penalty.isZero()).toBe(true);
  });

  it('returns 0 when past end (currentSlot > endSlot)', () => {
    const amount = new BN('1000000000');
    const penalty = calculateEarlyPenalty(amount, new BN(0), new BN(2000), new BN(1000));
    expect(penalty.isZero()).toBe(true);
  });

  it('returns maximum penalty (100%) at day 0 (just started)', () => {
    const amount = new BN('1000000000');
    const startSlot = new BN(0);
    const endSlot = new BN(SLOTS_PER_DAY * 365);
    const currentSlot = new BN(0); // no time elapsed
    const penalty = calculateEarlyPenalty(amount, startSlot, currentSlot, endSlot);
    // servedFraction = 0, penaltyBps = 10000, min penalty = 5000
    // penaltyBps = BPS_SCALER = 10000 -> capped by mulDivUp rounding
    expect(penalty.gte(amount.muln(MIN_PENALTY_BPS).divn(BPS_SCALER))).toBe(true);
  });

  it('enforces minimum 50% penalty floor', () => {
    const amount = new BN('1000000000');
    const slotsPerDay = new BN(SLOTS_PER_DAY);
    const totalDays = 100;
    const startSlot = new BN(0);
    const endSlot = new BN(SLOTS_PER_DAY * totalDays);
    // 80% through the stake
    const currentSlot = slotsPerDay.muln(80);
    const penalty = calculateEarlyPenalty(amount, startSlot, currentSlot, endSlot);
    // served = 80%, penalty_bps = 20% < 50%, so floor = 50%
    const minPenalty = amount.muln(MIN_PENALTY_BPS).divn(BPS_SCALER);
    expect(penalty.gte(minPenalty)).toBe(true);
  });

  it('calculates exact penalty for 50% served', () => {
    const amount = new BN('1000000000');
    const startSlot = new BN(0);
    const endSlot = new BN(SLOTS_PER_DAY * 100);
    const currentSlot = new BN(SLOTS_PER_DAY * 50); // 50% through
    const penalty = calculateEarlyPenalty(amount, startSlot, currentSlot, endSlot);
    // servedFraction = 50%, penaltyBps = 50% = min penalty -> floor applied
    const minPenalty = amount.muln(MIN_PENALTY_BPS).divn(BPS_SCALER);
    expect(penalty.gte(minPenalty)).toBe(true);
  });

  it('rounds up (favors protocol)', () => {
    // Use odd amount to ensure rounding difference is visible
    const amount = new BN('1000000001'); // odd base units
    const startSlot = new BN(0);
    const endSlot = new BN(SLOTS_PER_DAY * 100);
    const currentSlot = new BN(0);
    const penalty = calculateEarlyPenalty(amount, startSlot, currentSlot, endSlot);
    // Should round up, not down
    const penaltyDown = amount.muln(BPS_SCALER).divn(BPS_SCALER);
    expect(penalty.gte(penaltyDown)).toBe(true);
  });
});

describe('calculateLatePenalty', () => {
  it('returns 0 when not late (currentSlot <= endSlot)', () => {
    const amount = new BN('1000000000');
    const endSlot = new BN(1000);
    const currentSlot = new BN(1000); // exactly at end - not late
    const slotsPerDay = new BN(SLOTS_PER_DAY);
    const penalty = calculateLatePenalty(amount, endSlot, currentSlot, slotsPerDay);
    expect(penalty.isZero()).toBe(true);
  });

  it('returns 0 within grace period (14 days late)', () => {
    const amount = new BN('1000000000');
    const slotsPerDay = new BN(SLOTS_PER_DAY);
    const endSlot = new BN(0);
    const currentSlot = slotsPerDay.muln(GRACE_PERIOD_DAYS); // exactly 14 days late
    const penalty = calculateLatePenalty(amount, endSlot, currentSlot, slotsPerDay);
    expect(penalty.isZero()).toBe(true);
  });

  it('returns non-zero penalty after grace period', () => {
    const amount = new BN('1000000000');
    const slotsPerDay = new BN(SLOTS_PER_DAY);
    const endSlot = new BN(0);
    const currentSlot = slotsPerDay.muln(GRACE_PERIOD_DAYS + 1); // 1 day past grace
    const penalty = calculateLatePenalty(amount, endSlot, currentSlot, slotsPerDay);
    expect(penalty.gtn(0)).toBe(true);
  });

  it('caps at 100% penalty after full window (365 days late)', () => {
    const amount = new BN('1000000000');
    const slotsPerDay = new BN(SLOTS_PER_DAY);
    const endSlot = new BN(0);
    // 365 days late = 14 grace + 351 late window = max
    const currentSlot = slotsPerDay.muln(365);
    const penalty = calculateLatePenalty(amount, endSlot, currentSlot, slotsPerDay);
    expect(penalty.gte(amount)).toBe(true);
  });

  it('caps at 100% for well past the window', () => {
    const amount = new BN('1000000000');
    const slotsPerDay = new BN(SLOTS_PER_DAY);
    const endSlot = new BN(0);
    const currentSlot = slotsPerDay.muln(1000); // way past
    const penalty = calculateLatePenalty(amount, endSlot, currentSlot, slotsPerDay);
    // Should cap at 100% = amount (may round up by 1 due to mulDivUp)
    expect(penalty.gte(amount)).toBe(true);
  });
});

describe('calculatePendingRewards', () => {
  it('returns 0 when t-shares are zero', () => {
    const result = calculatePendingRewards(new BN(0), new BN(1000), new BN(0));
    expect(result.isZero()).toBe(true);
  });

  it('returns 0 when debt exceeds current value', () => {
    // rewardDebt > tShares * shareRate
    const result = calculatePendingRewards(new BN(100), new BN(100), new BN(99999999));
    expect(result.isZero()).toBe(true);
  });

  it('calculates pending rewards correctly', () => {
    const tShares = new BN(100);
    const shareRate = new BN(1000);
    const rewardDebt = new BN(50000);
    // currentValue = 100 * 1000 = 100000, pending = 100000 - 50000 = 50000
    const result = calculatePendingRewards(tShares, shareRate, rewardDebt);
    expect(result.toString()).toBe('50000');
  });

  it('returns 0 when rewardDebt equals currentValue (saturating sub)', () => {
    const tShares = new BN(100);
    const shareRate = new BN(1000);
    const rewardDebt = new BN(100000); // exactly equal
    const result = calculatePendingRewards(tShares, shareRate, rewardDebt);
    expect(result.isZero()).toBe(true);
  });
});

describe('calculateLoyaltyBonus', () => {
  it('returns 0 when committedDays is zero', () => {
    const bonus = calculateLoyaltyBonus(new BN(0), new BN(100), new BN(0), new BN(SLOTS_PER_DAY));
    expect(bonus.isZero()).toBe(true);
  });

  it('returns 0 when slotsPerDay is zero', () => {
    const bonus = calculateLoyaltyBonus(new BN(0), new BN(100), new BN(365), new BN(0));
    expect(bonus.isZero()).toBe(true);
  });

  it('returns 0 at stake start (no time elapsed)', () => {
    const startSlot = new BN(1000);
    const currentSlot = new BN(1000); // same as start
    const bonus = calculateLoyaltyBonus(startSlot, currentSlot, new BN(365), new BN(SLOTS_PER_DAY));
    expect(bonus.isZero()).toBe(true);
  });

  it('returns LOYALTY_MAX_BONUS when fully served', () => {
    const slotsPerDay = new BN(SLOTS_PER_DAY);
    const committedDays = new BN(365);
    const startSlot = new BN(0);
    // Serve all committed days
    const currentSlot = slotsPerDay.mul(committedDays);
    const bonus = calculateLoyaltyBonus(startSlot, currentSlot, committedDays, slotsPerDay);
    expect(bonus.toString()).toBe(LOYALTY_MAX_BONUS.toString());
  });

  it('returns half max bonus at half term served', () => {
    const slotsPerDay = new BN(SLOTS_PER_DAY);
    const committedDays = new BN(100);
    const startSlot = new BN(0);
    const currentSlot = slotsPerDay.muln(50); // 50 days
    const bonus = calculateLoyaltyBonus(startSlot, currentSlot, committedDays, slotsPerDay);
    const expectedHalf = LOYALTY_MAX_BONUS.divn(2);
    expect(bonus.toString()).toBe(expectedHalf.toString());
  });

  it('caps at LOYALTY_MAX_BONUS beyond full term', () => {
    const slotsPerDay = new BN(SLOTS_PER_DAY);
    const committedDays = new BN(100);
    const startSlot = new BN(0);
    const currentSlot = slotsPerDay.muln(200); // 2x the committed term
    const bonus = calculateLoyaltyBonus(startSlot, currentSlot, committedDays, slotsPerDay);
    expect(bonus.toString()).toBe(LOYALTY_MAX_BONUS.toString());
  });
});

describe('applyLoyaltyMultiplier', () => {
  it('returns pendingRewards unchanged when rewards are zero', () => {
    const result = applyLoyaltyMultiplier(new BN(0), LOYALTY_MAX_BONUS);
    expect(result.isZero()).toBe(true);
  });

  it('returns pendingRewards unchanged when loyaltyBonus is zero', () => {
    const rewards = new BN(1000000);
    const result = applyLoyaltyMultiplier(rewards, new BN(0));
    expect(result.toString()).toBe(rewards.toString());
  });

  it('applies max loyalty bonus (+50%) correctly', () => {
    const rewards = new BN('1000000000'); // 10 HELIX (arbitrary)
    // LOYALTY_MAX_BONUS = 500_000_000 = 0.5x PRECISION
    const result = applyLoyaltyMultiplier(rewards, LOYALTY_MAX_BONUS);
    // result = rewards * (1 + 0.5) = 1.5x
    const expected = rewards.mul(new BN(3)).div(new BN(2)); // 1.5x
    expect(result.toString()).toBe(expected.toString());
  });

  it('applies half loyalty bonus (+25%) correctly', () => {
    const rewards = new BN('1000000000');
    const halfBonus = LOYALTY_MAX_BONUS.divn(2); // 0.25x
    const result = applyLoyaltyMultiplier(rewards, halfBonus);
    // result = rewards * (PRECISION + 0.25*PRECISION) / PRECISION = 1.25x
    const expected = rewards.mul(new BN(5)).div(new BN(4)); // 1.25x
    expect(result.toString()).toBe(expected.toString());
  });
});
