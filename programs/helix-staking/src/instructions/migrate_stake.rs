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

pub fn migrate_stake(ctx: Context<MigrateStake>) -> Result<()> {
    // OPS-07: Reject calls when stake is already at the current layout version.
    // This prevents unnecessary invocations and reduces the attack surface of
    // the realloc path. Migration is only meaningful when the on-chain data_len
    // is smaller than the current LEN.
    require!(
        ctx.accounts.stake_account.to_account_info().data_len() < StakeAccount::LEN,
        HelixError::AlreadyMigrated
    );
    Ok(())
}
