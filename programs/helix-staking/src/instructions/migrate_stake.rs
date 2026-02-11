use anchor_lang::prelude::*;

use crate::constants::*;
use crate::error::HelixError;
use crate::state::StakeAccount;

#[derive(Accounts)]
pub struct MigrateStake<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,

    #[account(
        mut,
        seeds = [
            STAKE_SEED,
            stake_account.user.as_ref(),
            &stake_account.stake_id.to_le_bytes()
        ],
        bump = stake_account.bump,
        // A-5 FIX: Only the stake owner can trigger migration (prevents
        // anonymous wallets from paying rent for someone else's account)
        constraint = stake_account.user == payer.key() @ HelixError::UnauthorizedStakeAccess,
        realloc = StakeAccount::LEN,
        realloc::payer = payer,
        realloc::zero = false,
    )]
    pub stake_account: Account<'info, StakeAccount>,

    pub system_program: Program<'info, System>,
}

pub fn migrate_stake(_ctx: Context<MigrateStake>) -> Result<()> {
    Ok(())
}
