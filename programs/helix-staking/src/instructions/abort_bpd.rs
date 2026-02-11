use anchor_lang::prelude::*;

use crate::constants::*;
use crate::error::HelixError;
use crate::events::BpdAborted;
use crate::state::{ClaimConfig, GlobalState};

#[derive(Accounts)]
pub struct AbortBpd<'info> {
    #[account(
        mut,
        seeds = [GLOBAL_STATE_SEED],
        bump = global_state.bump,
        has_one = authority,
    )]
    pub global_state: Account<'info, GlobalState>,

    #[account(
        mut,
        seeds = [CLAIM_CONFIG_SEED],
        bump = claim_config.bump,
    )]
    pub claim_config: Account<'info, ClaimConfig>,

    pub authority: Signer<'info>,
}

/// Permanently cancels BPD distribution for the current claim period.
///
/// **Important constraint**: Per-stake `bpd_finalize_period_id` flags are NOT cleared by this
/// instruction. Re-running `finalize_bpd_calculation` for the same `claim_period_id` will skip
/// all previously-finalized stakes (due to the duplicate check in `finalize_bpd_calculation`).
/// This means BPD cannot be restarted for the same claim period after abort.
///
/// To run BPD again, a new claim period (with a new `claim_period_id`) must be initialized.
/// Clearing per-stake flags would require iterating all StakeAccounts, which is architecturally
/// infeasible on Solana without an off-chain crank.
pub fn abort_bpd(ctx: Context<AbortBpd>) -> Result<()> {
    let global_state = &mut ctx.accounts.global_state;
    let claim_config = &mut ctx.accounts.claim_config;

    // Can only abort if BPD window is active
    require!(
        global_state.is_bpd_window_active(),
        HelixError::BpdWindowNotActive
    );

    // Only allow abort before trigger distribution has started
    // After distribution begins, per-stake state cannot be cleanly reverted
    require!(
        claim_config.bpd_stakes_distributed == 0,
        HelixError::BpdDistributionAlreadyStarted
    );

    // Capture state for event
    let stakes_finalized = claim_config.bpd_stakes_finalized;
    let stakes_distributed = claim_config.bpd_stakes_distributed;

    // Reset BPD state
    claim_config.bpd_calculation_complete = false;
    claim_config.bpd_helix_per_share_day = 0;
    claim_config.bpd_total_share_days = 0;
    claim_config.bpd_snapshot_slot = 0;
    claim_config.bpd_stakes_finalized = 0;
    claim_config.bpd_stakes_distributed = 0;
    claim_config.bpd_remaining_unclaimed = 0;
    claim_config.bpd_finalize_start_timestamp = 0; // Phase 8.1
    claim_config.bpd_original_unclaimed = 0; // Phase 8.1

    // Clear BPD window flag (uses same method as MED-1 zero-amount finalize path)
    global_state.set_bpd_window_active(false);

    emit!(BpdAborted {
        claim_period_id: claim_config.claim_period_id,
        stakes_finalized,
        stakes_distributed,
    });

    Ok(())
}
