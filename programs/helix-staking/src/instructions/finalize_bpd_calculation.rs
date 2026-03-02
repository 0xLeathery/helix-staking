use anchor_lang::prelude::*;

use crate::constants::*;
use crate::error::HelixError;
use crate::events::BpdBatchFinalized;
use crate::state::{ClaimConfig, GlobalState, StakeAccount};

/// Maximum stakes to process per finalize_bpd_calculation call
/// This prevents compute limit issues with large stake counts
pub const MAX_STAKES_PER_FINALIZE: usize = 20;

#[derive(Accounts)]
pub struct FinalizeBpdCalculation<'info> {
    /// M-1 FIX: Only authority can initiate BPD finalization (prevents griefing)
    #[account(
        constraint = caller.key() == global_state.authority @ HelixError::Unauthorized
    )]
    pub caller: Signer<'info>,

    #[account(
        mut,
        seeds = [GLOBAL_STATE_SEED],
        bump = global_state.bump,
    )]
    pub global_state: Account<'info, GlobalState>,

    #[account(
        mut,
        seeds = [CLAIM_CONFIG_SEED],
        bump = claim_config.bump,
        constraint = claim_config.claim_period_started @ HelixError::ClaimPeriodNotStarted,
        constraint = !claim_config.bpd_calculation_complete @ HelixError::BpdCalculationAlreadyComplete,
        constraint = !claim_config.big_pay_day_complete @ HelixError::BigPayDayAlreadyTriggered,
    )]
    pub claim_config: Account<'info, ClaimConfig>,

    // Remaining accounts: StakeAccounts to scan (read-only)
}

pub fn finalize_bpd_calculation<'info>(
    ctx: Context<'_, '_, 'info, 'info, FinalizeBpdCalculation<'info>>,
) -> Result<()> {
    let clock = Clock::get()?;
    let claim_config = &mut ctx.accounts.claim_config;
    let global_state = &mut ctx.accounts.global_state;

    // === Validate preconditions ===
    // slots_per_day is set during initialize and should never be 0,
    // but validate to make arithmetic safe
    require!(
        global_state.slots_per_day > 0,
        HelixError::InvalidSlotsPerDay
    );

    // === Verify claim period has ended ===
    require!(
        clock.slot > claim_config.end_slot,
        HelixError::BigPayDayNotAvailable
    );

    // === Determine if this is first batch ===
    let is_first_batch = claim_config.bpd_remaining_unclaimed == 0
        && claim_config.bpd_total_share_days == 0
        && claim_config.bpd_snapshot_slot == 0;

    // Snapshot pre-loop finalized count for per-batch delta in event
    let finalized_before = claim_config.bpd_stakes_finalized;

    // === Calculate unclaimed amount on first batch ===
    let unclaimed_amount = if is_first_batch {
        // Phase 8.1 (C1/FR-001): Use saturating_sub — speed bonuses can cause
        // total_claimed to exceed total_claimable, which is by design. Clamp to 0.
        let amount = claim_config.total_claimable
            .saturating_sub(claim_config.total_claimed);

        // Store for pagination
        claim_config.bpd_remaining_unclaimed = amount;

        // Capture snapshot slot for consistent days_staked calculation across all batches
        claim_config.bpd_snapshot_slot = clock.slot;

        // Phase 8.1: Record timestamp for seal delay enforcement
        claim_config.bpd_finalize_start_timestamp = clock.unix_timestamp;

        // HIGH-2: Set BPD window active (blocks unstake during distribution)
        global_state.set_bpd_window_active(true);

        amount
    } else {
        claim_config.bpd_remaining_unclaimed
    };

    // === If nothing to distribute, mark complete and exit ===
    if unclaimed_amount == 0 {
        claim_config.bpd_calculation_complete = true;
        claim_config.bpd_helix_per_share_day = 0;
        global_state.set_bpd_window_active(false); // H-2 FIX: Clear window when nothing to distribute
        return Ok(());
    }

    // === Store snapshot slot for consistent days_staked calculation ===
    let snapshot_slot = claim_config.bpd_snapshot_slot;

    // === Accumulate share-days from this batch ===
    let mut batch_share_days: u128 = 0;

    for (i, account_info) in ctx.remaining_accounts.iter().enumerate() {
        if i >= MAX_STAKES_PER_FINALIZE {
            break;
        }

        // === SECURITY: Validate account ownership ===
        if account_info.owner != &crate::id() {
            continue;
        }

        // Skip un-migrated stakes (< 117 bytes)
        let data = account_info.try_borrow_data()?;
        if data.len() < StakeAccount::LEN {
            continue;
        }

        // Use proper Anchor deserialization
        let mut stake = match StakeAccount::try_deserialize(&mut &data[..]) {
            Ok(s) => s,
            Err(_) => continue,
        };
        drop(data);

        // CRIT-NEW-1: Skip stakes already counted this period (duplicate prevention).
        // Note: After abort_bpd, these flags remain set, so re-finalization for the same
        // claim_period_id will skip all previously-finalized stakes. This is by design —
        // abort_bpd is a permanent cancel, not a restart. See abort_bpd doc comment.
        if stake.bpd_finalize_period_id == claim_config.claim_period_id {
            continue;
        }

        // === SECURITY: Validate PDA derivation ===
        // Uses validate_stake_pda which ensures:
        // - Account key matches canonical PDA
        // - Bump seed is canonical (prevents seed canonicalization attacks)
        // This validation is Anchor-equivalent for remaining_accounts.
        if crate::security::validate_stake_pda(account_info, &stake).is_err() {
            continue;
        }

        // === Check eligibility (same as trigger_big_pay_day) ===
        if !stake.is_active {
            continue;
        }

        if stake.start_slot < claim_config.start_slot {
            continue;
        }

        if stake.start_slot > claim_config.end_slot {
            continue;
        }

        // Calculate days staked during claim period using snapshot slot
        let stake_end = std::cmp::min(snapshot_slot, stake.end_slot);
        // Safe to divide: slots_per_day > 0 validated at function start
        let days_staked = stake_end
            .saturating_sub(stake.start_slot)
            / global_state.slots_per_day;

        if days_staked == 0 {
            continue;
        }

        // Calculate share-days for this stake
        let share_days = (stake.t_shares as u128)
            .checked_mul(days_staked as u128)
            .ok_or(HelixError::Overflow)?;

        batch_share_days = batch_share_days
            .checked_add(share_days)
            .ok_or(HelixError::Overflow)?;

        // CRIT-NEW-1: Mark stake as finalized for this period
        stake.bpd_finalize_period_id = claim_config.claim_period_id;

        // Write updated stake back to account
        stake.try_serialize(&mut &mut account_info.try_borrow_mut_data()?[..])?;

        // Increment finalized counter
        claim_config.bpd_stakes_finalized = claim_config.bpd_stakes_finalized
            .checked_add(1)
            .ok_or(HelixError::Overflow)?;
    }

    // === Accumulate to global total ===
    claim_config.bpd_total_share_days = claim_config.bpd_total_share_days
        .checked_add(batch_share_days)
        .ok_or(HelixError::Overflow)?;

    // Phase 8.1: Emit transparency event for off-chain monitoring
    // A-2 FIX: Report per-batch delta (not cumulative) for batch_stakes_processed
    // Safe: bpd_stakes_finalized >= finalized_before (only incremented above)
    let batch_stakes_processed = claim_config.bpd_stakes_finalized
        .checked_sub(finalized_before)
        .ok_or(HelixError::Underflow)?;
    emit!(BpdBatchFinalized {
        claim_period_id: claim_config.claim_period_id,
        batch_stakes_processed,
        total_stakes_finalized: claim_config.bpd_stakes_finalized,
        cumulative_share_days: claim_config.bpd_total_share_days
            .min(u64::MAX as u128) as u64,
        timestamp: clock.unix_timestamp,
    });

    // Note: Rate calculation and completion is now done by seal_bpd_finalize (authority-gated)
    // This prevents first-batch-drains-pool attack (CRIT-NEW-1)

    Ok(())
}

#[cfg(test)]
mod tests {
    use crate::constants::*;
    use crate::instructions::crank_distribution::make_test_global_state;

    #[test]
    fn test_share_days_calculation() {
        // share_days = t_shares * days_staked
        // For a 100 day stake with 1e6 t_shares: share_days = 1e8
        let t_shares = 1_000_000u64;
        let days_staked = 100u64;
        let share_days = (t_shares as u128).checked_mul(days_staked as u128).unwrap();
        assert_eq!(share_days, 100_000_000u128);
    }

    #[test]
    fn test_share_days_overflow_safety() {
        // u128 can hold t_shares * days without overflow
        // Max t_shares: ~u64::MAX, max days: 5555
        // Result fits in u128 since u64::MAX * 5555 < u128::MAX
        let t_shares = u64::MAX;
        let days_staked = MAX_STAKE_DAYS;
        let share_days = (t_shares as u128).checked_mul(days_staked as u128);
        assert!(share_days.is_some(), "u128 should hold max share_days without overflow");
    }

    #[test]
    fn test_batch_share_days_accumulate() {
        // Multiple stakes' share_days should add together correctly
        let stake1_share_days: u128 = 1_000_000 * 100;  // 1e8
        let stake2_share_days: u128 = 500_000 * 200;    // 1e8
        let total = stake1_share_days.checked_add(stake2_share_days).unwrap();
        assert_eq!(total, 200_000_000u128);
    }

    #[test]
    fn test_unclaimed_amount_saturating() {
        // Phase 8.1 (C1/FR-001): total_claimed can exceed total_claimable due to speed bonuses
        // saturating_sub prevents underflow
        let total_claimable = 1_000_000u64;
        let total_claimed = 1_100_000u64; // Speed bonuses caused over-claiming
        let unclaimed = total_claimable.saturating_sub(total_claimed);
        assert_eq!(unclaimed, 0, "saturating_sub should clamp to 0");
    }

    #[test]
    fn test_slots_per_day_division_in_days_staked() {
        // days_staked = (stake_end - stake_start) / slots_per_day
        let spd = DEFAULT_SLOTS_PER_DAY;
        let start_slot = 1000u64;
        let end_slot = start_slot + 30 * spd; // 30-day stake
        let snapshot_slot = end_slot; // snapshot at end

        let stake_end = std::cmp::min(snapshot_slot, end_slot);
        let days_staked = stake_end.saturating_sub(start_slot) / spd;
        assert_eq!(days_staked, 30);
    }

    #[test]
    fn test_bpd_first_batch_detection() {
        // First batch: remaining_unclaimed == 0 AND total_share_days == 0 AND snapshot_slot == 0
        let remaining_unclaimed: u64 = 0;
        let total_share_days: u128 = 0;
        let snapshot_slot: u64 = 0;

        let is_first = remaining_unclaimed == 0
            && total_share_days == 0
            && snapshot_slot == 0;
        assert!(is_first, "all zeroes indicates first batch");

        // Second batch: remaining_unclaimed has a value
        let remaining2: u64 = 500_000;
        let is_second = !(remaining2 == 0 && total_share_days == 0 && snapshot_slot == 0);
        assert!(is_second, "non-zero remaining indicates subsequent batch");
    }
}
