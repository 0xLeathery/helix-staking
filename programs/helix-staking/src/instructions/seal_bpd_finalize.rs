use anchor_lang::prelude::*;

use crate::constants::*;
use crate::error::HelixError;
use crate::events::BpdFinalizationSealed;
use crate::state::{ClaimConfig, GlobalState};

#[derive(Accounts)]
pub struct SealBpdFinalize<'info> {
    /// Authority that can seal the finalize phase
    #[account(
        constraint = authority.key() == global_state.authority @ HelixError::Unauthorized
    )]
    pub authority: Signer<'info>,

    #[account(
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
}

pub fn seal_bpd_finalize(
    ctx: Context<SealBpdFinalize>,
    expected_finalized_count: u32,
) -> Result<()> {
    let clock = Clock::get()?;
    let claim_config = &mut ctx.accounts.claim_config;

    // Verify claim period has ended
    require!(
        clock.slot > claim_config.end_slot,
        HelixError::BigPayDayNotAvailable
    );

    // HIGH-2: Verify finalization actually processed stakes
    require!(
        claim_config.bpd_stakes_finalized > 0,
        HelixError::BpdFinalizationIncomplete
    );

    // Phase 8.1: Governance delay — require observation window before sealing
    require!(
        claim_config.bpd_finalize_start_timestamp > 0,
        HelixError::BpdFinalizationIncomplete
    );
    require!(
        clock.unix_timestamp
            >= claim_config
                .bpd_finalize_start_timestamp
                .checked_add(BPD_SEAL_DELAY_SECONDS)
                .ok_or(error!(HelixError::Overflow))?,
        HelixError::BpdSealTooEarly
    );

    // Completeness guard: authority must acknowledge exact count of finalized stakes.
    // Catches crank crashes / partial finalization where authority's off-chain
    // getProgramAccounts count diverges from what was actually processed on-chain.
    require!(
        claim_config.bpd_stakes_finalized == expected_finalized_count,
        HelixError::BpdFinalizeCountMismatch
    );

    // H-2 FIX: If no stakes were finalized, set rate to 0 so trigger can clear the window
    if claim_config.bpd_total_share_days == 0 {
        claim_config.bpd_helix_per_share_day = 0;
        claim_config.bpd_calculation_complete = true;

        emit!(BpdFinalizationSealed {
            slot: clock.slot,
            claim_period_id: claim_config.claim_period_id,
            total_share_days: 0,
            helix_per_share_day: 0,
        });

        return Ok(());
    }

    // Calculate global BPD rate from accumulated share-days
    let unclaimed_amount = claim_config.bpd_remaining_unclaimed;

    let helix_per_share_day = (unclaimed_amount as u128)
        .checked_mul(PRECISION as u128)
        .ok_or(HelixError::Overflow)?
        .checked_div(claim_config.bpd_total_share_days)
        .ok_or(HelixError::DivisionByZero)?;

    claim_config.bpd_helix_per_share_day = helix_per_share_day;
    claim_config.bpd_calculation_complete = true;

    // Phase 8.1: Store original unclaimed for consistent whale cap in trigger_big_pay_day
    claim_config.bpd_original_unclaimed = unclaimed_amount;

    emit!(BpdFinalizationSealed {
        slot: clock.slot,
        claim_period_id: claim_config.claim_period_id,
        total_share_days: claim_config.bpd_total_share_days,
        helix_per_share_day,
    });

    Ok(())
}

/// Calculate BPD helix-per-share-day rate given unclaimed amount and total share-days.
/// Used in seal_bpd_finalize to produce the rate for trigger_big_pay_day.
fn calculate_helix_per_share_day(unclaimed_amount: u64, total_share_days: u128) -> Result<u128> {
    if total_share_days == 0 {
        return Ok(0);
    }
    (unclaimed_amount as u128)
        .checked_mul(PRECISION as u128)
        .ok_or(error!(HelixError::Overflow))?
        .checked_div(total_share_days)
        .ok_or(error!(HelixError::DivisionByZero))
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::constants::*;

    #[test]
    fn test_helix_per_share_day_basic() {
        // 1000 tokens unclaimed, 1000 share-days → 1 helix per share-day (before PRECISION scaling)
        // rate = 1000 * PRECISION / 1000 = PRECISION
        let rate = calculate_helix_per_share_day(1_000, 1_000).unwrap();
        assert_eq!(rate, PRECISION as u128);
    }

    #[test]
    fn test_helix_per_share_day_zero_share_days() {
        // No share-days → rate = 0 (nothing to distribute)
        let rate = calculate_helix_per_share_day(1_000_000, 0).unwrap();
        assert_eq!(rate, 0);
    }

    #[test]
    fn test_helix_per_share_day_large_values() {
        // Large unclaimed amount — should not overflow via u128 intermediate
        let unclaimed = 1_000_000_000_000_000u64; // 1e15
        let share_days = 1_000_000_000u128; // 1e9 share-days
        let rate = calculate_helix_per_share_day(unclaimed, share_days).unwrap();
        assert!(rate > 0, "Large values should produce valid rate");
    }

    #[test]
    fn test_whale_cap_calculation() {
        use crate::instructions::math::mul_div;
        // max_bonus_per_stake = total_unclaimed * BPD_MAX_SHARE_PCT / 100
        // 5% of 1_000_000 = 50_000
        let total = 1_000_000u64;
        let cap = mul_div(total, BPD_MAX_SHARE_PCT, 100).unwrap();
        assert_eq!(cap, 50_000);
    }

    #[test]
    fn test_bonus_calculation_from_rate() {
        // bonus = share_days * helix_per_share_day / PRECISION
        let share_days = 1_000u128;
        let rate = PRECISION as u128; // 1 helix per share-day before PRECISION scaling
        let bonus_u128 = share_days
            .checked_mul(rate)
            .unwrap()
            .checked_div(PRECISION as u128)
            .unwrap();
        let bonus = u64::try_from(bonus_u128).unwrap();
        assert_eq!(bonus, 1_000); // 1000 share-days * 1 token = 1000 tokens
    }
}
