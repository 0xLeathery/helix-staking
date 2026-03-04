use anchor_lang::prelude::*;
use crate::constants::*;
use crate::error::HelixError;
use crate::state::GlobalState;

/// Admin-only instruction to configure the seed token mint and minimum balance threshold.
///
/// Sets the seed token mint address and minimum seed balance in GlobalState reserved slots.
/// This instruction is re-callable — admin can update both values at any time.
///
/// Must be called before admin_toggle_boost can enable the boost system.
#[derive(Accounts)]
pub struct AdminSetSeedMint<'info> {
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

pub fn admin_set_seed_mint(
    ctx: Context<AdminSetSeedMint>,
    new_seed_mint: Pubkey,
    min_seed_balance: u64,
) -> Result<()> {
    require!(min_seed_balance > 0, HelixError::InvalidParameter);
    let gs = &mut ctx.accounts.global_state;
    gs.set_seed_mint(&new_seed_mint);
    gs.set_min_seed_balance(min_seed_balance);
    Ok(())
}
