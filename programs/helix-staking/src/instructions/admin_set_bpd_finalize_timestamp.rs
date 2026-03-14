use anchor_lang::prelude::*;

use crate::constants::*;
use crate::error::HelixError;
use crate::events::AdminBpdFinalizeTimestampUpdated;
use crate::state::{ClaimConfig, GlobalState};

/// Admin-only instruction to override bpd_finalize_start_timestamp.
/// Used in local/devnet testing to bypass the 86400s BPD seal delay
/// without waiting 24 real hours. Sets the timestamp to any value —
/// typically (now - 90_000) so the seal guard passes immediately.
///
/// SAFETY: Authority-gated. Safe to include in devnet IDL.
#[derive(Accounts)]
pub struct AdminSetBpdFinalizeTimestamp<'info> {
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

pub fn admin_set_bpd_finalize_timestamp(
    ctx: Context<AdminSetBpdFinalizeTimestamp>,
    new_timestamp: i64,
) -> Result<()> {
    ctx.accounts.claim_config.bpd_finalize_start_timestamp = new_timestamp;

    emit!(AdminBpdFinalizeTimestampUpdated {
        slot: Clock::get()?.slot,
        new_timestamp,
    });

    Ok(())
}
