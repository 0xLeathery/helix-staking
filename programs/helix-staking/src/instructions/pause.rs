use anchor_lang::prelude::*;

use crate::constants::GLOBAL_STATE_SEED;
use crate::error::HelixError;
use crate::state::GlobalState;

#[derive(Accounts)]
pub struct Pause<'info> {
    #[account(
        mut,
        seeds = [GLOBAL_STATE_SEED],
        bump = global_state.bump,
    )]
    pub global_state: Account<'info, GlobalState>,

    #[account(constraint = authority.key() == global_state.authority @ HelixError::Unauthorized)]
    pub authority: Signer<'info>,
}

pub fn pause(ctx: Context<Pause>) -> Result<()> {
    ctx.accounts.global_state.set_paused(true);
    msg!("Program paused by authority");
    Ok(())
}
