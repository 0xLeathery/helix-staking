use anchor_lang::prelude::*;
use crate::constants::*;
use crate::error::HelixError;

/// Multiply then divide using u128 intermediates to avoid overflow.
/// Formula: (a * b) / c with u128 precision.
/// Used for: penalty calculations, inflation calculations, share rate updates, reward calculations.
/// Frontend TypeScript equivalent: (BigInt(a) * BigInt(b)) / BigInt(c)
pub fn mul_div(a: u64, b: u64, c: u64) -> Result<u64> {
    require!(c > 0, HelixError::DivisionByZero);
    let result = (a as u128)
        .checked_mul(b as u128)
        .ok_or(error!(HelixError::Overflow))?
        .checked_div(c as u128)
        .ok_or(error!(HelixError::Overflow))?;
    u64::try_from(result).map_err(|_| error!(HelixError::Overflow))
}

/// Multiply then divide with round-up for protocol-favorable calculations.
/// Formula: ((a * b) + (c - 1)) / c
/// Used for: penalty amounts (should round UP to favor protocol).
pub fn mul_div_up(a: u64, b: u64, c: u64) -> Result<u64> {
    require!(c > 0, HelixError::DivisionByZero);
    let numerator = (a as u128)
        .checked_mul(b as u128)
        .ok_or(error!(HelixError::Overflow))?
        .checked_add((c - 1) as u128)
        .ok_or(error!(HelixError::Overflow))?;
    let result = numerator
        .checked_div(c as u128)
        .ok_or(error!(HelixError::Overflow))?;
    u64::try_from(result).map_err(|_| error!(HelixError::Overflow))
}

/// Calculate Longer Pays Better (LPB) bonus multiplier
/// Returns bonus scaled by PRECISION (e.g., PRECISION = 1x bonus = 2x final)
/// 1 day = 0 bonus, LPB_MAX_DAYS (3641) = 2x bonus
pub fn calculate_lpb_bonus(stake_days: u64) -> Result<u64> {
    if stake_days == 0 {
        return Ok(0);
    }

    // Cap at LPB_MAX_DAYS for bonus calculation - return exact 2x at max
    if stake_days >= LPB_MAX_DAYS {
        return Ok(2 * PRECISION);
    }

    // Formula: (days - 1) * 2 * PRECISION / LPB_MAX_DAYS
    // For 1 day: (1-1) * 2 * PRECISION / LPB_MAX_DAYS = 0
    // For 3641 days: exactly 2 * PRECISION (handled above)
    let days_minus_one = stake_days
        .checked_sub(1)
        .ok_or(HelixError::Underflow)?;

    let numerator = days_minus_one
        .checked_mul(2)
        .ok_or(HelixError::Overflow)?
        .checked_mul(PRECISION)
        .ok_or(HelixError::Overflow)?;

    let bonus = numerator
        .checked_div(LPB_MAX_DAYS)
        .ok_or(HelixError::Overflow)?;

    Ok(bonus)
}

/// Calculate Bigger Pays Better (BPB) bonus multiplier with diminishing returns.
/// Returns bonus scaled by PRECISION.
///
/// Note: BPB divides staked_amount by 10 before comparing to BPB_THRESHOLD,
/// so the effective "full bonus" point is at BPB_THRESHOLD * 10 raw tokens (1.5B display tokens).
///
/// Tier 1: 0 → BPB_THRESHOLD×10 (1.5B tokens): Linear 0 → 1.0x (PRECISION) — backward compatible
/// Tier 2: 1.5B → BPB_TIER_2 (5B tokens):       Linear 1.0x → 1.25x (25% slope)
/// Tier 3: BPB_TIER_2 → BPB_TIER_3 (10B tokens): Linear 1.25x → 1.4x (15% slope)
/// Tier 4: Above BPB_TIER_3:                      Hard cap at BPB_MAX_BONUS (1.5x)
pub fn calculate_bpb_bonus(staked_amount: u64) -> Result<u64> {
    if staked_amount == 0 {
        return Ok(0);
    }

    // Tier 1: Linear 0 → PRECISION (unchanged from original for amounts ≤ threshold)
    let amount_div_10 = staked_amount / 10;

    if amount_div_10 < BPB_THRESHOLD {
        // Original formula preserved exactly for backward compatibility
        return mul_div(amount_div_10, PRECISION, BPB_THRESHOLD);
    }

    // Base bonus at threshold = 1.0x = PRECISION
    let mut bonus: u128 = PRECISION as u128;

    // Tier 2: 25% additional from threshold to tier 2
    // BPB uses amount_div_10, but tier thresholds are in raw token amounts (8 decimals)
    // We compare raw staked_amount against tier thresholds
    if staked_amount <= BPB_TIER_2 {
        let excess = (staked_amount - BPB_THRESHOLD * 10) as u128;
        let tier_range = (BPB_TIER_2 - BPB_THRESHOLD * 10) as u128;
        let tier_bonus = 250_000_000u128; // 0.25x in PRECISION
        bonus = bonus.checked_add(
            excess.checked_mul(tier_bonus).ok_or(error!(HelixError::Overflow))?
                .checked_div(tier_range).ok_or(error!(HelixError::Overflow))?
        ).ok_or(error!(HelixError::Overflow))?;
    } else {
        // Full tier 2 bonus
        bonus = bonus.checked_add(250_000_000u128).ok_or(error!(HelixError::Overflow))?;

        // Tier 3: 15% additional from tier 2 to tier 3
        if staked_amount <= BPB_TIER_3 {
            let excess = (staked_amount - BPB_TIER_2) as u128;
            let tier_range = (BPB_TIER_3 - BPB_TIER_2) as u128;
            let tier_bonus = 150_000_000u128; // 0.15x in PRECISION
            bonus = bonus.checked_add(
                excess.checked_mul(tier_bonus).ok_or(error!(HelixError::Overflow))?
                    .checked_div(tier_range).ok_or(error!(HelixError::Overflow))?
            ).ok_or(error!(HelixError::Overflow))?;
        } else {
            // Above tier 3: hard cap
            bonus = BPB_MAX_BONUS as u128;
        }
    }

    // Safety cap
    let final_bonus = bonus.min(BPB_MAX_BONUS as u128);
    Ok(u64::try_from(final_bonus).map_err(|_| error!(HelixError::Overflow))?)
}

/// Calculate T-shares from staked amount, applying LPB + BPB bonuses and share rate
/// Returns t_shares scaled by PRECISION
pub fn calculate_t_shares(
    staked_amount: u64,
    stake_days: u64,
    share_rate: u64,
) -> Result<u64> {
    require!(share_rate > 0, HelixError::InvalidParameter);

    let lpb_bonus = calculate_lpb_bonus(stake_days)?;
    let bpb_bonus = calculate_bpb_bonus(staked_amount)?;

    // total_multiplier = PRECISION (base 1x) + lpb + bpb
    let total_multiplier = PRECISION
        .checked_add(lpb_bonus)
        .ok_or(HelixError::Overflow)?
        .checked_add(bpb_bonus)
        .ok_or(HelixError::Overflow)?;

    // t_shares = staked_amount * total_multiplier / share_rate
    // Use u128 to avoid overflow with large amounts
    let amount_u128 = staked_amount as u128;
    let multiplier_u128 = total_multiplier as u128;
    let share_rate_u128 = share_rate as u128;

    let t_shares_u128 = amount_u128
        .checked_mul(multiplier_u128)
        .ok_or(HelixError::Overflow)?
        .checked_div(share_rate_u128)
        .ok_or(HelixError::Overflow)?;

    // Convert back to u64, checking for overflow
    let t_shares = u64::try_from(t_shares_u128)
        .map_err(|_| HelixError::Overflow)?;

    Ok(t_shares)
}

/// Calculate early unstake penalty
/// Returns penalty amount in base token units
/// Minimum 50% penalty, scales linearly with time not served
/// Formula: penalty = staked_amount * penalty_bps / BPS_SCALER (rounded up)
/// Frontend TypeScript: (BigInt(staked) * BigInt(penaltyBps) + BigInt(BPS_SCALER - 1)) / BigInt(BPS_SCALER)
pub fn calculate_early_penalty(
    staked_amount: u64,
    start_slot: u64,
    current_slot: u64,
    end_slot: u64,
) -> Result<u64> {
    // Not early if current >= end
    if current_slot >= end_slot {
        return Ok(0);
    }

    let total_duration = end_slot
        .checked_sub(start_slot)
        .ok_or(HelixError::Underflow)?;

    let elapsed = current_slot
        .checked_sub(start_slot)
        .ok_or(HelixError::Underflow)?;

    // served_fraction_bps = (elapsed / total) * BPS_SCALER
    let served_fraction_bps = elapsed
        .checked_mul(BPS_SCALER)
        .ok_or(HelixError::Overflow)?
        .checked_div(total_duration)
        .ok_or(HelixError::Overflow)?;

    // penalty_bps = BPS_SCALER - served_fraction_bps
    let penalty_bps = BPS_SCALER
        .checked_sub(served_fraction_bps)
        .ok_or(HelixError::Underflow)?;

    // Enforce minimum 50% penalty
    let final_penalty_bps = if penalty_bps < MIN_PENALTY_BPS {
        MIN_PENALTY_BPS
    } else {
        penalty_bps
    };

    // Return penalty amount (ROUNDED UP to favor protocol)
    let penalty_amount = mul_div_up(staked_amount, final_penalty_bps, BPS_SCALER)?;

    Ok(penalty_amount)
}

/// Calculate late unstake penalty
/// Returns penalty amount in base token units
/// 0% within grace period, linear to 100% at exactly day 365 (351 penalty days)
/// Formula: penalty_bps = penalty_days * BPS_SCALER / LATE_PENALTY_WINDOW_DAYS
/// This gives exactly 10,000 bps (100%) when penalty_days = 351
/// Formula: penalty = staked_amount * penalty_bps / BPS_SCALER (rounded up)
/// Frontend TypeScript: penaltyBps = (BigInt(penaltyDays) * 10000n) / 351n
pub fn calculate_late_penalty(
    staked_amount: u64,
    end_slot: u64,
    current_slot: u64,
    slots_per_day: u64,
) -> Result<u64> {
    // Not late if current <= end
    if current_slot <= end_slot {
        return Ok(0);
    }

    let slots_late = current_slot
        .checked_sub(end_slot)
        .ok_or(HelixError::Underflow)?;

    let late_days = slots_late
        .checked_div(slots_per_day)
        .ok_or(HelixError::Overflow)?;

    // No penalty within grace period
    if late_days <= GRACE_PERIOD_DAYS {
        return Ok(0);
    }

    let penalty_days = late_days
        .checked_sub(GRACE_PERIOD_DAYS)
        .ok_or(HelixError::Underflow)?;

    // penalty_bps = penalty_days * BPS_SCALER / LATE_PENALTY_WINDOW_DAYS
    let penalty_bps = mul_div(penalty_days, BPS_SCALER, LATE_PENALTY_WINDOW_DAYS)?;

    // Cap at 100% (BPS_SCALER)
    let capped_bps = if penalty_bps > BPS_SCALER {
        BPS_SCALER
    } else {
        penalty_bps
    };

    // Return penalty amount (ROUNDED UP to favor protocol)
    let penalty_amount = mul_div_up(staked_amount, capped_bps, BPS_SCALER)?;

    Ok(penalty_amount)
}

/// Calculate pending rewards for a stake.
/// Formula: pending = (t_shares * current_share_rate) - reward_debt
/// No PRECISION division needed - reward_debt is stored at the same scale.
/// Frontend TypeScript: BigInt(tShares) * BigInt(currentShareRate) - BigInt(rewardDebt)
pub fn calculate_pending_rewards(
    t_shares: u64,
    current_share_rate: u64,
    reward_debt: u64,
) -> Result<u64> {
    let current_value = (t_shares as u128)
        .checked_mul(current_share_rate as u128)
        .ok_or(error!(HelixError::Overflow))?;

    // Saturating sub handles case where reward_debt > current_value (shouldn't happen but defensive)
    let pending_128 = current_value.saturating_sub(reward_debt as u128);

    // FIXED: Divide by PRECISION to get unscaled token amount
    let pending_rewards = pending_128
        .checked_div(PRECISION as u128)
        .ok_or(error!(HelixError::Overflow))?;

    u64::try_from(pending_rewards).map_err(|_| error!(HelixError::Overflow))
}

/// Calculate reward_debt = t_shares × share_rate with overflow protection.
/// Uses u128 intermediate to prevent overflow during multiplication.
/// Returns RewardDebtOverflow error if result exceeds u64::MAX.
/// Frontend TypeScript: BigInt(tShares) * BigInt(shareRate)
pub fn calculate_reward_debt(t_shares: u64, share_rate: u64) -> Result<u64> {
    let result = (t_shares as u128)
        .checked_mul(share_rate as u128)
        .ok_or(error!(HelixError::Overflow))?;

    u64::try_from(result).map_err(|_| error!(HelixError::RewardDebtOverflow))
}

/// Get current day from init_slot
/// Returns day number (0-indexed)
pub fn get_current_day(
    init_slot: u64,
    current_slot: u64,
    slots_per_day: u64,
) -> Result<u64> {
    let elapsed = current_slot
        .checked_sub(init_slot)
        .ok_or(HelixError::Underflow)?;

    let day = elapsed
        .checked_div(slots_per_day)
        .ok_or(HelixError::Overflow)?;

    Ok(day)
}

/// Calculate loyalty bonus based on proportion of committed term already served.
/// Returns bonus in PRECISION units (0 to LOYALTY_MAX_BONUS).
///
/// Formula: loyalty_bonus = min(days_served / committed_days, 1) × LOYALTY_MAX_BONUS
///
/// Examples (with LOYALTY_MAX_BONUS = 0.5x):
/// - Day 0 of 365-day stake: 0% bonus
/// - Day 182 of 365-day stake: ~25% bonus
/// - Day 365 of 365-day stake: 50% bonus (max)
/// - Day 400 of 365-day stake (in grace period): 50% bonus (capped)
pub fn calculate_loyalty_bonus(
    start_slot: u64,
    current_slot: u64,
    committed_days: u64,
    slots_per_day: u64,
) -> Result<u64> {
    if committed_days == 0 || slots_per_day == 0 {
        return Ok(0);
    }

    let elapsed_slots = current_slot.saturating_sub(start_slot);
    let days_served = elapsed_slots.checked_div(slots_per_day).unwrap_or(0);

    // Cap at committed_days (don't exceed max bonus even in grace/late period)
    let capped_days = days_served.min(committed_days);

    // loyalty_bonus = capped_days * LOYALTY_MAX_BONUS / committed_days
    mul_div(capped_days, LOYALTY_MAX_BONUS, committed_days)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_lpb_bonus() {
        // 1 day = 0 bonus
        assert_eq!(calculate_lpb_bonus(1).unwrap(), 0);

        // LPB_MAX_DAYS (3641) = 2x bonus = 2 * PRECISION
        let max_bonus = calculate_lpb_bonus(LPB_MAX_DAYS).unwrap();
        assert_eq!(max_bonus, 2 * PRECISION);

        // Over max should cap
        let over_max = calculate_lpb_bonus(5000).unwrap();
        assert_eq!(over_max, 2 * PRECISION);
    }

    #[test]
    fn test_bpb_bonus() {
        // 0 amount = 0 bonus
        assert_eq!(calculate_bpb_bonus(0).unwrap(), 0);

        // At BPB_THRESHOLD (amount = threshold * 10): 100% bonus = PRECISION
        let at_threshold = calculate_bpb_bonus(BPB_THRESHOLD * 10).unwrap();
        assert_eq!(at_threshold, PRECISION);

        // Below threshold: still linear
        let half = calculate_bpb_bonus(BPB_THRESHOLD * 5).unwrap();
        assert!(half > 0 && half < PRECISION);
    }

    #[test]
    fn test_bpb_diminishing_returns() {
        // At threshold: PRECISION (1.0x)
        let at_threshold = calculate_bpb_bonus(BPB_THRESHOLD * 10).unwrap();
        assert_eq!(at_threshold, PRECISION);

        // Mid tier 2 (3B tokens = 300_000_000_000_000_000): between 1.0x and 1.25x
        let mid_tier2 = calculate_bpb_bonus(300_000_000_000_000_000).unwrap();
        assert!(mid_tier2 > PRECISION);
        assert!(mid_tier2 < PRECISION + 250_000_000); // less than 1.25x

        // At BPB_TIER_2 (5B): ~1.25x
        let at_tier2 = calculate_bpb_bonus(BPB_TIER_2).unwrap();
        assert_eq!(at_tier2, PRECISION + 250_000_000);

        // At BPB_TIER_3 (10B): ~1.4x
        let at_tier3 = calculate_bpb_bonus(BPB_TIER_3).unwrap();
        assert_eq!(at_tier3, PRECISION + 250_000_000 + 150_000_000);

        // Above tier 3 (20B): hard cap at BPB_MAX_BONUS (1.5x)
        let above_tier3 = calculate_bpb_bonus(2_000_000_000_000_000_000).unwrap();
        assert_eq!(above_tier3, BPB_MAX_BONUS);

        // Monotonically increasing
        let vals = [
            BPB_THRESHOLD * 10,                 // 1.5B (threshold)
            300_000_000_000_000_000,             // 3B (mid tier 2)
            BPB_TIER_2,                          // 5B (tier 2/3 boundary)
            750_000_000_000_000_000,             // 7.5B (mid tier 3)
            BPB_TIER_3,                          // 10B (tier 3/4 boundary)
            2_000_000_000_000_000_000,           // 20B (above tier 3, capped)
        ];
        for i in 1..vals.len() {
            let prev = calculate_bpb_bonus(vals[i - 1]).unwrap();
            let curr = calculate_bpb_bonus(vals[i]).unwrap();
            assert!(curr >= prev, "BPB not monotonically increasing at index {}", i);
        }
    }

    #[test]
    fn test_loyalty_bonus() {
        let spd = DEFAULT_SLOTS_PER_DAY;

        // Day 0: no bonus
        assert_eq!(calculate_loyalty_bonus(0, 0, 365, spd).unwrap(), 0);

        // Half-term: half of max bonus (~250_000_000 = ~25%)
        let half = calculate_loyalty_bonus(0, 182 * spd, 365, spd).unwrap();
        assert!(half > 240_000_000 && half < 260_000_000, "half-term loyalty = {}", half);

        // Full term: max bonus (500_000_000 = 50%)
        let full = calculate_loyalty_bonus(0, 365 * spd, 365, spd).unwrap();
        assert_eq!(full, LOYALTY_MAX_BONUS);

        // Past term (grace period): still capped at max
        let over = calculate_loyalty_bonus(0, 400 * spd, 365, spd).unwrap();
        assert_eq!(over, LOYALTY_MAX_BONUS);

        // 1-day stake at day 1: max bonus
        let min_stake = calculate_loyalty_bonus(0, spd, 1, spd).unwrap();
        assert_eq!(min_stake, LOYALTY_MAX_BONUS);

        // Edge: committed_days=0 returns 0
        assert_eq!(calculate_loyalty_bonus(0, spd, 0, spd).unwrap(), 0);

        // Edge: slots_per_day=0 returns 0
        assert_eq!(calculate_loyalty_bonus(0, spd, 365, 0).unwrap(), 0);
    }

    #[test]
    fn test_early_penalty() {
        let staked = 1000_00_000_000; // 1000 tokens
        let start = 0;
        let end = 100;

        // 0% served = 100% penalty (well above minimum)
        let penalty = calculate_early_penalty(staked, start, start, end).unwrap();
        assert_eq!(penalty, staked); // 100% penalty

        // 25% served = 75% penalty (still above minimum)
        let penalty_25 = calculate_early_penalty(staked, start, 25, end).unwrap();
        assert_eq!(penalty_25, (staked * 75) / 100); // 75% penalty

        // 75% served = 25% natural penalty, but minimum raises to 50%
        let penalty_75 = calculate_early_penalty(staked, start, 75, end).unwrap();
        assert_eq!(penalty_75, staked / 2); // 50% minimum enforced

        // 100% served (at or past end) = 0% penalty
        let no_penalty = calculate_early_penalty(staked, start, end, end).unwrap();
        assert_eq!(no_penalty, 0);
    }

    #[test]
    fn test_late_penalty() {
        let staked = 1000_00_000_000; // 1000 tokens
        let end = 1000;
        let slots_per_day = DEFAULT_SLOTS_PER_DAY;

        // Not late = 0 penalty
        let not_late = calculate_late_penalty(staked, end, end, slots_per_day).unwrap();
        assert_eq!(not_late, 0);

        // Within grace period = 0 penalty
        let grace = end + (GRACE_PERIOD_DAYS * slots_per_day);
        let in_grace = calculate_late_penalty(staked, end, grace, slots_per_day).unwrap();
        assert_eq!(in_grace, 0);

        // Way past grace = 100% penalty
        let way_late = end + (500 * slots_per_day);
        let max_penalty = calculate_late_penalty(staked, end, way_late, slots_per_day).unwrap();
        assert_eq!(max_penalty, staked); // 100% penalty
    }

    #[test]
    fn test_calculate_reward_debt() {
        // Normal case: small values that fit in u64
        let result = calculate_reward_debt(1000, 10000).unwrap();
        assert_eq!(result, 10_000_000);

        // Moderate case: larger but still fits
        let result = calculate_reward_debt(1_000_000_000, 1_000_000).unwrap();
        assert_eq!(result, 1_000_000_000_000_000);

        // Edge case: zero values
        let zero_shares = calculate_reward_debt(0, 10000).unwrap();
        assert_eq!(zero_shares, 0);

        let zero_rate = calculate_reward_debt(1000, 0).unwrap();
        assert_eq!(zero_rate, 0);

        // Maximum safe case: sqrt(u64::MAX) × sqrt(u64::MAX) fits
        let sqrt_max = 4_294_967_295u64; // ~sqrt(u64::MAX)
        let result = calculate_reward_debt(sqrt_max, sqrt_max).unwrap();
        assert!(result > 0);

        // Overflow case: u64::MAX × 2 should fail with RewardDebtOverflow
        let overflow_result = calculate_reward_debt(u64::MAX, 2);
        assert!(overflow_result.is_err());
    }
}

    #[test]
    fn test_calculate_pending_rewards() {
        // PRECISION is 1_000_000_000
        let prec = PRECISION;

        // Case 1: 1 share, rate increases by 1*PRECISION
        // t_shares = 1, rate_start = 0, rate_end = 1*PRECISION
        // This corresponds to 1 token distributed to 1 share
        // pending should be 1 token (unscaled)
        let pending = calculate_pending_rewards(1, prec, 0).unwrap();
        assert_eq!(pending, 1, "Should return unscaled token amount (1)");

        // Case 2: 1 share, rate increases by 0.5 * PRECISION
        // pending should be 0 (0.5 rounds down)
        let pending_small = calculate_pending_rewards(1, prec / 2, 0).unwrap();
        assert_eq!(pending_small, 0, "Should round down small amounts");

        // Case 3: Realistic scenario
        // t_shares = 1e12, rate increases by 100_000
        // rate_start = 10_000, rate_end = 110_000.
        // debt = 1e12 * 10_000 = 1e16.
        // current = 1e12 * 110_000 = 1.1e17.
        // diff = 1e17.
        // pending = 1e17 / 1e9 = 1e8 (100,000,000).
        let t_shares = 1_000_000_000_000u64;
        let rate_start = 10_000u64;
        let rate_end = 110_000u64;
        let debt = calculate_reward_debt(t_shares, rate_start).unwrap();
        let pending_large = calculate_pending_rewards(t_shares, rate_end, debt).unwrap();
        assert_eq!(pending_large, 100_000_000, "Should handle large numbers correctly");
    }
