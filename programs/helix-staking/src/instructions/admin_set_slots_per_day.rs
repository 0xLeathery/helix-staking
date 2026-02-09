use anchor_lang::prelude::*;

use crate::constants::*;
use crate::error::HelixError;
use crate::state::GlobalState;

/// Admin-only instruction to override slots_per_day.
/// Used for devnet/testing to make "days" pass faster
/// so BPD eligibility (requires >= 1 day staked) can be tested.
#[derive(Accounts)]
pub struct AdminSetSlotsPerDay<'info> {
    #[account(
        constraint = authority.key() == global_state.authority @ HelixError::Unauthorized
    )]
    pub authority: Signer<'info>,

    #[account(
        mut,
        seeds = [GLOBAL_STATE_SEED],
        bump = global_state.bump,
    )]
    pub global_state: Account<'info, GlobalState>,
}

pub fn admin_set_slots_per_day(
    ctx: Context<AdminSetSlotsPerDay>,
    new_slots_per_day: u64,
) -> Result<()> {
    require!(new_slots_per_day > 0, HelixError::InvalidParameter);
    ctx.accounts.global_state.slots_per_day = new_slots_per_day;
    Ok(())
}
