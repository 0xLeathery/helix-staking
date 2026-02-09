use anchor_lang::prelude::*;

use crate::constants::*;
use crate::error::HelixError;
use crate::events::AuthorityTransferCompleted;
use crate::state::{GlobalState, PendingAuthority};

#[derive(Accounts)]
pub struct AcceptAuthority<'info> {
    #[account(
        mut,
        seeds = [GLOBAL_STATE_SEED],
        bump = global_state.bump,
    )]
    pub global_state: Account<'info, GlobalState>,

    #[account(
        mut,
        seeds = [PENDING_AUTHORITY_SEED],
        bump = pending_authority.bump,
        close = new_authority,
    )]
    pub pending_authority: Account<'info, PendingAuthority>,

    #[account(
        mut,
        constraint = new_authority.key() == pending_authority.new_authority @ HelixError::UnauthorizedNewAuthority,
    )]
    pub new_authority: Signer<'info>,
}

pub fn accept_authority(ctx: Context<AcceptAuthority>) -> Result<()> {
    let old_authority = ctx.accounts.global_state.authority;
    let new_authority = ctx.accounts.new_authority.key();

    ctx.accounts.global_state.authority = new_authority;

    emit!(AuthorityTransferCompleted {
        old_authority,
        new_authority,
    });

    Ok(())
}
