use anchor_lang::prelude::*;

use crate::constants::GLOBAL_STATE_SEED;
use crate::error::HelixError;
use crate::state::GlobalState;

#[derive(Accounts)]
pub struct Unpause<'info> {
    #[account(
        mut,
        seeds = [GLOBAL_STATE_SEED],
        bump = global_state.bump,
    )]
    pub global_state: Account<'info, GlobalState>,

    #[account(constraint = authority.key() == global_state.authority @ HelixError::Unauthorized)]
    pub authority: Signer<'info>,
}

pub fn unpause(ctx: Context<Unpause>) -> Result<()> {
    ctx.accounts.global_state.set_paused(false);
    msg!("Program unpaused by authority");
    Ok(())
}
