use anchor_lang::prelude::*;
use crate::constants::*;
use crate::error::HelixError;

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

/// Calculate Bigger Pays Better (BPB) bonus multiplier
/// Returns bonus scaled by PRECISION (e.g., PRECISION/10 = 0.1x = 10% bonus)
/// Small amounts = 0 bonus, 150M+ tokens = 10% bonus
pub fn calculate_bpb_bonus(staked_amount: u64) -> Result<u64> {
    if staked_amount == 0 {
        return Ok(0);
    }

    // Cap at BPB_THRESHOLD for bonus calculation - return exact 10% at threshold
    if staked_amount >= BPB_THRESHOLD {
        return Ok(PRECISION / 10);
    }

    // Formula: amount * PRECISION / (10 * BPB_THRESHOLD)
    // Rewrite to avoid overflow: (amount / 10) * PRECISION / BPB_THRESHOLD
    let amount_div_10 = staked_amount / 10;

    let numerator = amount_div_10
        .checked_mul(PRECISION)
        .ok_or(HelixError::Overflow)?;

    let bonus = numerator
        .checked_div(BPB_THRESHOLD)
        .ok_or(HelixError::Overflow)?;

    Ok(bonus)
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

    // effective_amount = staked_amount * total_multiplier / PRECISION
    let effective_amount = staked_amount
        .checked_mul(total_multiplier)
        .ok_or(HelixError::Overflow)?
        .checked_div(PRECISION)
        .ok_or(HelixError::Overflow)?;

    // t_shares = effective_amount * PRECISION / share_rate
    let t_shares = effective_amount
        .checked_mul(PRECISION)
        .ok_or(HelixError::Overflow)?
        .checked_div(share_rate)
        .ok_or(HelixError::Overflow)?;

    Ok(t_shares)
}

/// Calculate early unstake penalty
/// Returns penalty amount in base token units
/// Minimum 50% penalty, scales linearly with time not served
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

    // Return penalty amount
    let penalty_amount = staked_amount
        .checked_mul(final_penalty_bps)
        .ok_or(HelixError::Overflow)?
        .checked_div(BPS_SCALER)
        .ok_or(HelixError::Overflow)?;

    Ok(penalty_amount)
}

/// Calculate late unstake penalty
/// Returns penalty amount in base token units
/// 0% within grace period, linear to 100% over 350 days
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

    // penalty_bps = penalty_days * LATE_PENALTY_BPS_PER_DAY
    let penalty_bps = penalty_days
        .checked_mul(LATE_PENALTY_BPS_PER_DAY)
        .ok_or(HelixError::Overflow)?;

    // Cap at 100% (BPS_SCALER)
    let capped_penalty_bps = if penalty_bps > BPS_SCALER {
        BPS_SCALER
    } else {
        penalty_bps
    };

    // Return penalty amount
    let penalty_amount = staked_amount
        .checked_mul(capped_penalty_bps)
        .ok_or(HelixError::Overflow)?
        .checked_div(BPS_SCALER)
        .ok_or(HelixError::Overflow)?;

    Ok(penalty_amount)
}

/// Calculate pending rewards using lazy distribution formula
/// Returns reward amount in base token units
pub fn calculate_pending_rewards(
    t_shares: u64,
    current_share_rate: u64,
    reward_debt: u64,
) -> Result<u64> {
    // current_value = t_shares * current_share_rate / PRECISION
    let current_value = t_shares
        .checked_mul(current_share_rate)
        .ok_or(HelixError::Overflow)?
        .checked_div(PRECISION)
        .ok_or(HelixError::Overflow)?;

    // debt_value = reward_debt / PRECISION
    let debt_value = reward_debt
        .checked_div(PRECISION)
        .ok_or(HelixError::Overflow)?;

    // Return current_value - debt_value (saturating to 0 if negative)
    let pending = current_value.saturating_sub(debt_value);

    Ok(pending)
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

        // BPB_THRESHOLD = 10% bonus = PRECISION / 10
        let max_bonus = calculate_bpb_bonus(BPB_THRESHOLD).unwrap();
        assert_eq!(max_bonus, PRECISION / 10);

        // Over threshold should cap
        let over_threshold = calculate_bpb_bonus(BPB_THRESHOLD * 2).unwrap();
        assert_eq!(over_threshold, PRECISION / 10);
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
}
