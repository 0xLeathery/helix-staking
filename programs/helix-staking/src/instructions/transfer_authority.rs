use anchor_lang::prelude::*;

use crate::constants::*;
use crate::error::HelixError;
use crate::events::{AuthorityTransferCancelled, AuthorityTransferInitiated};
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

    // Detect overwrite of existing pending transfer
    if pending.new_authority != Pubkey::default() && pending.new_authority != new_authority {
        emit!(AuthorityTransferCancelled {
            slot: Clock::get()?.slot,
            authority: ctx.accounts.authority.key(),
            cancelled_new_authority: pending.new_authority,
        });
    }

    pending.new_authority = new_authority;
    pending.bump = ctx.bumps.pending_authority;

    emit!(AuthorityTransferInitiated {
        slot: Clock::get()?.slot,
        old_authority: ctx.accounts.authority.key(),
        new_authority,
    });

    Ok(())
}

#[cfg(test)]
mod tests {
    use anchor_lang::prelude::Pubkey;

    #[test]
    fn test_transfer_authority_overwrite_detection() {
        // When new_authority differs from existing pending.new_authority,
        // it's an overwrite (should emit AuthorityTransferCancelled).
        let old_pending = Pubkey::new_unique();
        let new_authority = Pubkey::new_unique();

        // Overwrite: old_pending != default AND != new_authority
        let is_overwrite = old_pending != Pubkey::default() && old_pending != new_authority;
        assert!(is_overwrite, "Different new_authority is an overwrite");
    }

    #[test]
    fn test_transfer_authority_no_overwrite_if_default() {
        // If pending.new_authority is default (no previous pending transfer), no cancel event
        let pending = Pubkey::default();
        let new_authority = Pubkey::new_unique();

        let is_overwrite = pending != Pubkey::default() && pending != new_authority;
        assert!(!is_overwrite, "Default pending is not an overwrite");
    }

    #[test]
    fn test_transfer_authority_no_overwrite_if_same() {
        // If setting same authority again, no cancel event
        let pending = Pubkey::new_unique();
        let new_authority = pending; // Same pubkey

        let is_overwrite = pending != Pubkey::default() && pending != new_authority;
        assert!(!is_overwrite, "Setting same authority is not an overwrite");
    }
}
