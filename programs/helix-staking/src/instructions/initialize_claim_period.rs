use anchor_lang::prelude::*;

use crate::constants::*;
use crate::error::HelixError;
use crate::events::ClaimPeriodStarted;
use crate::state::{ClaimConfig, GlobalState};

#[derive(Accounts)]
pub struct InitializeClaimPeriod<'info> {
    /// Protocol authority (must match GlobalState.authority)
    #[account(
        mut,
        constraint = authority.key() == global_state.authority @ HelixError::Unauthorized
    )]
    pub authority: Signer<'info>,

    #[account(
        seeds = [GLOBAL_STATE_SEED],
        bump = global_state.bump,
    )]
    pub global_state: Account<'info, GlobalState>,

    #[account(
        init,
        payer = authority,
        space = ClaimConfig::LEN,
        seeds = [CLAIM_CONFIG_SEED],
        bump,
    )]
    pub claim_config: Account<'info, ClaimConfig>,

    pub system_program: Program<'info, System>,
}

pub fn initialize_claim_period(
    ctx: Context<InitializeClaimPeriod>,
    merkle_root: [u8; 32],
    total_claimable: u64,
    total_eligible: u32,
    claim_period_id: u32,
) -> Result<()> {
    // MED-5 FIX: Prevent claim_period_id=0 which collides with
    // StakeAccount's default bpd_claim_period_id=0, causing all
    // stakes to be skipped in trigger_big_pay_day
    require!(claim_period_id > 0, HelixError::InvalidClaimPeriodId);

    let clock = Clock::get()?;
    let claim_config = &mut ctx.accounts.claim_config;
    let global_state = &ctx.accounts.global_state;

    // Calculate end slot (180 days from now)
    let end_slot = clock.slot
        .checked_add(
            CLAIM_PERIOD_DAYS
                .checked_mul(global_state.slots_per_day)
                .ok_or(HelixError::Overflow)?
        )
        .ok_or(HelixError::Overflow)?;

    // Initialize ClaimConfig
    claim_config.authority = ctx.accounts.authority.key();
    claim_config.merkle_root = merkle_root;
    claim_config.total_claimable = total_claimable;
    claim_config.total_claimed = 0;
    claim_config.claim_count = 0;
    claim_config.start_slot = clock.slot;
    claim_config.end_slot = end_slot;
    claim_config.claim_period_id = claim_period_id;
    claim_config.claim_period_started = true;  // Immutable after this
    claim_config.big_pay_day_complete = false;
    claim_config.bpd_total_distributed = 0;
    claim_config.total_eligible = total_eligible;
    claim_config.bump = ctx.bumps.claim_config;

    // BPD pagination fields (Phase 3.1)
    claim_config.bpd_remaining_unclaimed = 0;
    claim_config.bpd_total_share_days = 0;
    claim_config.bpd_helix_per_share_day = 0;
    claim_config.bpd_calculation_complete = false;

    // BPD Phase 3.3 fields
    claim_config.bpd_snapshot_slot = 0;
    claim_config.bpd_stakes_finalized = 0;
    claim_config.bpd_stakes_distributed = 0;

    // Phase 8.1 fields
    claim_config.bpd_finalize_start_timestamp = 0;
    claim_config.bpd_original_unclaimed = 0;

    // Emit event
    emit!(ClaimPeriodStarted {
        slot: clock.slot,
        timestamp: clock.unix_timestamp,
        claim_period_id,
        merkle_root,
        total_claimable,
        total_eligible,
        claim_deadline_slot: end_slot,
    });

    Ok(())
}
