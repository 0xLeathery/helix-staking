use anchor_lang::prelude::*;

use crate::constants::GLOBAL_STATE_SEED;
use crate::error::HelixError;
use crate::events::ProtocolPaused;
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

    emit!(ProtocolPaused {
        slot: Clock::get()?.slot,
        authority: ctx.accounts.authority.key(),
    });

    Ok(())
}

#[cfg(test)]
mod tests {
    use crate::constants::*;
    use crate::instructions::crank_distribution::make_test_global_state;

    #[test]
    fn test_pause_sets_paused_flag() {
        let spd = DEFAULT_SLOTS_PER_DAY;
        let mut gs = make_test_global_state(
            0,
            spd,
            0,
            0,
            0,
            DEFAULT_STARTING_SHARE_RATE,
            DEFAULT_ANNUAL_INFLATION_BP,
        );
        assert!(!gs.is_paused(), "Initially not paused");
        gs.set_paused(true);
        assert!(gs.is_paused(), "After pause, is_paused = true");
    }
}
