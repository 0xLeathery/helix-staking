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

pub fn seal_bpd_finalize(ctx: Context<SealBpdFinalize>) -> Result<()> {
    let clock = Clock::get()?;
    let claim_config = &mut ctx.accounts.claim_config;

    // Verify claim period has ended
    require!(
        clock.slot > claim_config.end_slot,
        HelixError::BigPayDayNotAvailable
    );

    // Verify at least some stakes were finalized
    require!(
        claim_config.bpd_stakes_finalized > 0 && claim_config.bpd_total_share_days > 0,
        HelixError::NoEligibleStakers
    );

    // Calculate global BPD rate from accumulated share-days
    let unclaimed_amount = claim_config.bpd_remaining_unclaimed;

    let helix_per_share_day = (unclaimed_amount as u128)
        .checked_mul(PRECISION as u128)
        .ok_or(HelixError::Overflow)?
        .checked_div(claim_config.bpd_total_share_days)
        .ok_or(HelixError::DivisionByZero)?;

    claim_config.bpd_helix_per_share_day = helix_per_share_day;
    claim_config.bpd_calculation_complete = true;

    Ok(())
}
