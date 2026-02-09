use anchor_lang::prelude::*;

use crate::constants::*;
use crate::error::HelixError;
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

pub fn seal_bpd_finalize(ctx: Context<SealBpdFinalize>, expected_finalized_count: u32) -> Result<()> {
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
        clock.unix_timestamp >= claim_config.bpd_finalize_start_timestamp
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

    Ok(())
}
