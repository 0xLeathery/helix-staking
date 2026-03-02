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

#[cfg(test)]
mod tests {
    use crate::instructions::crank_distribution::make_test_global_state;
    use crate::constants::*;

    #[test]
    fn test_unpause_clears_paused_flag() {
        let spd = DEFAULT_SLOTS_PER_DAY;
        let mut gs = make_test_global_state(0, spd, 0, 0, 0, DEFAULT_STARTING_SHARE_RATE, DEFAULT_ANNUAL_INFLATION_BP);
        gs.set_paused(true);
        assert!(gs.is_paused(), "Is paused before unpause");
        gs.set_paused(false);
        assert!(!gs.is_paused(), "After unpause, is_paused = false");
    }
}
