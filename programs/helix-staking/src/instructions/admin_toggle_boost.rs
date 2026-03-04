use anchor_lang::prelude::*;
use crate::constants::*;
use crate::error::HelixError;
use crate::state::GlobalState;

/// Admin-only instruction to enable or disable the boost system.
///
/// Requires seed_mint to be configured (non-default) before enabling.
/// Disabling does not affect existing boosted stakes.
#[derive(Accounts)]
pub struct AdminToggleBoost<'info> {
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

pub fn admin_toggle_boost(
    ctx: Context<AdminToggleBoost>,
    enabled: bool,
) -> Result<()> {
    // Require seed_mint to be configured before enabling boost
    if enabled {
        require!(
            ctx.accounts.global_state.get_seed_mint() != Pubkey::default(),
            HelixError::SeedMintNotConfigured
        );
    }
    ctx.accounts.global_state.set_boost_enabled(enabled);
    Ok(())
}
