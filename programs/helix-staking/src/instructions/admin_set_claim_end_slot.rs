use anchor_lang::prelude::*;

use crate::constants::*;
use crate::error::HelixError;
use crate::state::{ClaimConfig, GlobalState};

/// Admin-only instruction to override the claim period end_slot.
/// Used for devnet/testing to fast-forward claim period expiry
/// so BPD flow can be tested without waiting 180 days.
#[derive(Accounts)]
pub struct AdminSetClaimEndSlot<'info> {
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
    )]
    pub claim_config: Account<'info, ClaimConfig>,
}

pub fn admin_set_claim_end_slot(
    ctx: Context<AdminSetClaimEndSlot>,
    new_end_slot: u64,
) -> Result<()> {
    let claim_config = &mut ctx.accounts.claim_config;

    // Phase 8.1 (C2/FR-002b): Only allow monotonic increases — new value must be > current
    require!(
        new_end_slot > claim_config.end_slot,
        HelixError::AdminBoundsExceeded
    );

    claim_config.end_slot = new_end_slot;
    Ok(())
}
