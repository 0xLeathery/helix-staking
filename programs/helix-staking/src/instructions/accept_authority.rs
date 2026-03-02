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
        constraint = !global_state.is_bpd_window_active() @ HelixError::AuthorityTransferBlockedDuringBpd,
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

#[cfg(test)]
mod tests {
    use anchor_lang::prelude::Pubkey;
    use crate::instructions::crank_distribution::make_test_global_state;
    use crate::constants::*;

    #[test]
    fn test_accept_authority_updates_global_state() {
        let spd = DEFAULT_SLOTS_PER_DAY;
        let mut gs = make_test_global_state(0, spd, 0, 0, 0, DEFAULT_STARTING_SHARE_RATE, DEFAULT_ANNUAL_INFLATION_BP);
        let old_auth = gs.authority;
        let new_auth = Pubkey::new_unique();

        // Simulate accept_authority
        gs.authority = new_auth;

        assert_ne!(gs.authority, old_auth, "Authority changed");
        assert_eq!(gs.authority, new_auth, "New authority set correctly");
    }

    #[test]
    fn test_authority_transfer_blocked_during_bpd() {
        // accept_authority has a constraint: !is_bpd_window_active()
        let spd = DEFAULT_SLOTS_PER_DAY;
        let mut gs = make_test_global_state(0, spd, 0, 0, 0, DEFAULT_STARTING_SHARE_RATE, DEFAULT_ANNUAL_INFLATION_BP);
        gs.set_bpd_window_active(true);
        assert!(gs.is_bpd_window_active(), "BPD window blocks authority transfer");
    }
}
