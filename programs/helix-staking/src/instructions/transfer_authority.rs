use anchor_lang::prelude::*;

use crate::constants::*;
use crate::error::HelixError;
use crate::events::AuthorityTransferInitiated;
use crate::state::{GlobalState, PendingAuthority};

#[derive(Accounts)]
pub struct TransferAuthority<'info> {
    #[account(
        seeds = [GLOBAL_STATE_SEED],
        bump = global_state.bump,
        constraint = global_state.authority == authority.key() @ HelixError::Unauthorized,
    )]
    pub global_state: Account<'info, GlobalState>,

    #[account(
        init_if_needed,
        payer = authority,
        space = PendingAuthority::LEN,
        seeds = [PENDING_AUTHORITY_SEED],
        bump,
    )]
    pub pending_authority: Account<'info, PendingAuthority>,

    #[account(mut)]
    pub authority: Signer<'info>,

    pub system_program: Program<'info, System>,
}

pub fn transfer_authority(ctx: Context<TransferAuthority>, new_authority: Pubkey) -> Result<()> {
    let pending = &mut ctx.accounts.pending_authority;
    pending.new_authority = new_authority;
    pending.bump = ctx.bumps.pending_authority;

    emit!(AuthorityTransferInitiated {
        old_authority: ctx.accounts.authority.key(),
        new_authority,
    });

    Ok(())
}
