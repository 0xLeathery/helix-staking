use anchor_lang::prelude::*;

use crate::constants::*;
use crate::error::HelixError;
use crate::events::{BigPayDayDistributed, ClaimPeriodEnded};
use crate::instructions::math::mul_div;
use crate::state::{ClaimConfig, GlobalState, StakeAccount};

/// Maximum stakes to process per trigger_big_pay_day call
/// This prevents compute limit issues with large stake counts
pub const MAX_STAKES_PER_BPD: usize = 20;

#[derive(Accounts)]
pub struct TriggerBigPayDay<'info> {
    /// Anyone can trigger BPD (permissionless)
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
        constraint = !claim_config.big_pay_day_complete @ HelixError::BigPayDayAlreadyTriggered,
        constraint = claim_config.bpd_calculation_complete @ HelixError::BpdCalculationNotComplete,
    )]
    pub claim_config: Account<'info, ClaimConfig>,
    // Remaining accounts: StakeAccounts to distribute BPD bonus to
    // Each must be verified as eligible (created during claim period, active)
}

pub fn trigger_big_pay_day<'info>(
    ctx: Context<'_, '_, 'info, 'info, TriggerBigPayDay<'info>>,
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

    // === Load pre-calculated rate from finalize_bpd_calculation ===
    // bpd_calculation_complete constraint already verified this is set
    let helix_per_share_day = claim_config.bpd_helix_per_share_day;
    let snapshot_slot = claim_config.bpd_snapshot_slot;

    // Phase 8.1: Compute per-stake BPD whale cap
    // max_bonus_per_stake = original_total_unclaimed * BPD_MAX_SHARE_PCT / 100
    // Use bpd_original_unclaimed (set at seal) for consistent cap across all batches
    let max_bonus_per_stake = mul_div(claim_config.bpd_original_unclaimed, BPD_MAX_SHARE_PCT, 100)?;

    // If rate is 0, nothing to distribute - mark complete and return
    if helix_per_share_day == 0 {
        claim_config.big_pay_day_complete = true;
        global_state.set_bpd_window_active(false); // HIGH-2: Clear BPD window
        emit!(ClaimPeriodEnded {
            slot: clock.slot,
            timestamp: clock.unix_timestamp,
            claim_period_id: claim_config.claim_period_id,
            total_claimed: claim_config.total_claimed,
            claims_count: claim_config.claim_count,
            unclaimed_amount: 0,
        });
        return Ok(());
    }

    // === Iterate through remaining_accounts to find eligible stakes ===
    // T-share-days = sum(stake.t_shares * days_staked_during_claim_period)
    // Only stakes created DURING claim period are eligible

    let mut eligible_stakes: Vec<(usize, u128)> = Vec::new(); // (index, share_days)

    for (i, account_info) in ctx.remaining_accounts.iter().enumerate() {
        if i >= MAX_STAKES_PER_BPD {
            break;
        }

        // === SECURITY: Validate account ownership ===
        if account_info.owner != &crate::id() {
            continue;
        }

        // Skip if account data is too small
        let data = account_info.try_borrow_data()?;
        if data.len() < StakeAccount::LEN {
            continue;
        }

        // Use proper Anchor deserialization (NOT hardcoded byte offsets)
        let stake = match StakeAccount::try_deserialize(&mut &data[..]) {
            Ok(s) => s,
            Err(_) => continue, // Skip invalid accounts
        };
        drop(data); // Release borrow before potential mutation

        // === SECURITY: Validate PDA derivation ===
        // Uses validate_stake_pda which ensures:
        // - Account key matches canonical PDA
        // - Bump seed is canonical (prevents seed canonicalization attacks)
        // This validation is Anchor-equivalent for remaining_accounts.
        if crate::security::validate_stake_pda(account_info, &stake).is_err() {
            continue;
        }

        // === SECURITY: Duplicate prevention check FIRST ===
        // If this stake already received BPD for this claim period, skip it
        if stake.bpd_claim_period_id == claim_config.claim_period_id {
            continue; // Already received BPD this period
        }

        // CRIT-NEW-1: Only distribute to stakes counted in finalize
        if stake.bpd_finalize_period_id != claim_config.claim_period_id {
            continue;
        }

        // Check eligibility:
        // 1. Must be active
        // 2. Must have been created DURING the claim period
        // 3. Must have staked for at least 1 day during claim period
        if !stake.is_active {
            continue;
        }

        if stake.start_slot < claim_config.start_slot {
            continue; // Created before claim period
        }

        if stake.start_slot > claim_config.end_slot {
            continue; // Created after claim period ended
        }

        // Calculate days staked during claim period using snapshot slot
        let stake_end = std::cmp::min(snapshot_slot, stake.end_slot);
        // Safe to divide: slots_per_day > 0 validated at function start
        let days_staked = stake_end.saturating_sub(stake.start_slot) / global_state.slots_per_day;

        if days_staked == 0 {
            continue; // Must have at least 1 day
        }

        // Calculate share-days for this stake
        let share_days = (stake.t_shares as u128)
            .checked_mul(days_staked as u128)
            .ok_or(HelixError::Overflow)?;

        eligible_stakes.push((i, share_days));
    }

    // === Handle empty batch ===
    // If no eligible stakes in this batch (all filtered out or already received BPD)
    if eligible_stakes.is_empty() {
        return Ok(());
    }

    // === Distribute BPD bonus to each eligible stake ===
    let mut batch_distributed: u64 = 0;
    let mut batch_stakes_distributed: u32 = 0;

    for (idx, share_days) in eligible_stakes.iter() {
        let account_info = &ctx.remaining_accounts[*idx];

        // Calculate this stake's BPD bonus using pre-calculated rate
        // *share_days is already u128, no cast needed
        let bonus_u128 = (*share_days)
            .checked_mul(helix_per_share_day)
            .ok_or(HelixError::Overflow)?
            .checked_div(PRECISION as u128)
            .ok_or(HelixError::DivisionByZero)?;

        // MED-1: Use try_from instead of 'as u64' for safe casting
        let raw_bonus = u64::try_from(bonus_u128).map_err(|_| error!(HelixError::Overflow))?;

        // Phase 8.1: Anti-whale BPD cap — no single stake gets more than BPD_MAX_SHARE_PCT of pool
        let bonus = raw_bonus.min(max_bonus_per_stake);

        if bonus == 0 {
            claim_config.bpd_stakes_distributed = claim_config
                .bpd_stakes_distributed
                .checked_add(1)
                .ok_or(HelixError::Overflow)?;
            // H-1 FIX: Mark zero-bonus stake as processed to prevent re-submission
            let mut stake: StakeAccount =
                StakeAccount::try_deserialize(&mut &account_info.try_borrow_data()?[..])?;
            stake.bpd_claim_period_id = claim_config.claim_period_id;
            stake.try_serialize(&mut &mut account_info.try_borrow_mut_data()?[..])?;
            continue;
        }

        // Properly deserialize StakeAccount to update bpd_bonus_pending
        let mut stake: StakeAccount =
            StakeAccount::try_deserialize(&mut &account_info.try_borrow_data()?[..])?;
        stake.bpd_bonus_pending = stake
            .bpd_bonus_pending
            .checked_add(bonus)
            .ok_or(HelixError::Overflow)?;

        // === SECURITY: Mark stake as having received BPD for this claim period ===
        // This prevents duplicate distribution if same stake passed multiple times
        stake.bpd_claim_period_id = claim_config.claim_period_id;

        stake.try_serialize(&mut &mut account_info.try_borrow_mut_data()?[..])?;

        batch_distributed = batch_distributed
            .checked_add(bonus)
            .ok_or(HelixError::Overflow)?;

        batch_stakes_distributed = batch_stakes_distributed
            .checked_add(1)
            .ok_or(HelixError::Overflow)?;
    }

    // === Update ClaimConfig pagination state ===
    claim_config.bpd_total_distributed = claim_config
        .bpd_total_distributed
        .checked_add(batch_distributed)
        .ok_or(HelixError::Overflow)?;

    claim_config.bpd_stakes_distributed = claim_config
        .bpd_stakes_distributed
        .checked_add(batch_stakes_distributed)
        .ok_or(HelixError::Overflow)?;

    // MED-3: Use checked_sub instead of saturating_sub for bpd_remaining_unclaimed
    claim_config.bpd_remaining_unclaimed = claim_config
        .bpd_remaining_unclaimed
        .checked_sub(batch_distributed)
        .ok_or(HelixError::BpdOverDistribution)?;

    // === Check if we should mark complete using counter-based logic ===
    // CRIT-NEW-1: Use counter-based completion (bpd_stakes_distributed >= bpd_stakes_finalized)
    if claim_config.bpd_stakes_distributed >= claim_config.bpd_stakes_finalized {
        claim_config.big_pay_day_complete = true;
        claim_config.bpd_remaining_unclaimed = 0;
        global_state.set_bpd_window_active(false); // HIGH-2: Clear BPD window

        emit!(ClaimPeriodEnded {
            slot: clock.slot,
            timestamp: clock.unix_timestamp,
            claim_period_id: claim_config.claim_period_id,
            total_claimed: claim_config.total_claimed,
            claims_count: claim_config.claim_count,
            unclaimed_amount: 0, // All distributed
        });
    }

    // === Emit batch distribution event ===
    emit!(BigPayDayDistributed {
        slot: clock.slot,
        timestamp: clock.unix_timestamp,
        claim_period_id: claim_config.claim_period_id,
        total_unclaimed: claim_config.bpd_remaining_unclaimed,
        total_eligible_share_days: claim_config.bpd_total_share_days.min(u64::MAX as u128) as u64,
        helix_per_share_day: helix_per_share_day.min(u64::MAX as u128) as u64,
        eligible_stakers: eligible_stakes.len() as u32,
    });

    Ok(())
}

#[cfg(test)]
mod tests {
    use crate::constants::*;
    use crate::instructions::math::mul_div;

    #[test]
    fn test_bonus_calculation_per_stake() {
        // bonus = share_days * helix_per_share_day / PRECISION
        let share_days = 1_000u128;
        let rate = PRECISION as u128; // 1 token per share-day (in PRECISION units)
        let bonus_u128 = share_days
            .checked_mul(rate)
            .unwrap()
            .checked_div(PRECISION as u128)
            .unwrap();
        let bonus = u64::try_from(bonus_u128).unwrap();
        assert_eq!(bonus, 1_000);
    }

    #[test]
    fn test_whale_cap_applies() {
        // max_bonus_per_stake = total_unclaimed * BPD_MAX_SHARE_PCT / 100
        let total_unclaimed = 1_000_000u64;
        let cap = mul_div(total_unclaimed, BPD_MAX_SHARE_PCT, 100).unwrap();
        assert_eq!(cap, 50_000); // 5% of pool

        // Bonus capped at max
        let raw_bonus = 100_000u64; // > cap
        let capped = raw_bonus.min(cap);
        assert_eq!(capped, cap, "Large bonus should be capped");
    }

    #[test]
    fn test_whale_cap_small_stake_uncapped() {
        // Small stake bonus is less than cap → not modified
        let total_unclaimed = 1_000_000u64;
        let cap = mul_div(total_unclaimed, BPD_MAX_SHARE_PCT, 100).unwrap();

        let raw_bonus = 10_000u64; // well within cap
        let capped = raw_bonus.min(cap);
        assert_eq!(capped, raw_bonus, "Small bonus should not be capped");
    }

    #[test]
    fn test_bpd_completion_by_counter() {
        // CRIT-NEW-1: Completion when bpd_stakes_distributed >= bpd_stakes_finalized
        let finalized: u32 = 10;
        let distributed: u32 = 10;
        assert!(
            distributed >= finalized,
            "Completion condition met when all stakes distributed"
        );

        // Not complete yet
        let distributed2: u32 = 9;
        assert!(
            !(distributed2 >= finalized),
            "Not complete when stakes remaining"
        );
    }

    #[test]
    fn test_bpd_remaining_decrements_on_distribution() {
        // bpd_remaining_unclaimed decrements by batch_distributed
        let remaining = 1_000_000u64;
        let batch_distributed = 50_000u64;
        let new_remaining = remaining.checked_sub(batch_distributed).unwrap();
        assert_eq!(new_remaining, 950_000);
    }

    #[test]
    fn test_days_staked_calculation() {
        // days_staked = (min(snapshot, stake_end) - start_slot) / slots_per_day
        let spd = DEFAULT_SLOTS_PER_DAY;
        let start_slot = 1000u64;
        let stake_end = start_slot + 30 * spd;
        let snapshot_slot = stake_end + 100; // snapshot after stake ends

        let effective_end = std::cmp::min(snapshot_slot, stake_end);
        let days_staked = effective_end.saturating_sub(start_slot) / spd;
        assert_eq!(days_staked, 30);
    }

    #[test]
    fn test_days_staked_capped_at_snapshot() {
        // If snapshot comes before stake end, days are capped at snapshot
        let spd = DEFAULT_SLOTS_PER_DAY;
        let start_slot = 1000u64;
        let stake_end = start_slot + 365 * spd;
        let snapshot_slot = start_slot + 100 * spd; // snapshot before stake ends

        let effective_end = std::cmp::min(snapshot_slot, stake_end);
        let days_staked = effective_end.saturating_sub(start_slot) / spd;
        assert_eq!(days_staked, 100, "Days should be capped at snapshot");
    }
}
