use anchor_lang::prelude::*;
use anchor_spl::associated_token::AssociatedToken;
use anchor_spl::token_interface::{Mint, TokenAccount, TokenInterface};

use crate::constants::*;
use crate::error::HelixError;
use crate::events::BoostRevoked;
use crate::state::{GlobalState, StakeAccount};

/// Permissionless instruction to check and update boost status for a given stake.
///
/// Anyone can call this (Phase 25 crank, the stake owner, or any third party).
/// If the stake owner's current seed balance < seed_balance_at_stake, the boost
/// is permanently revoked by setting stake_account.boost_revoked = true.
///
/// No-ops:
/// - If stake is not boosted (seed_balance_at_stake == 0)
/// - If boost is already revoked (boost_revoked == true)
/// - If current balance >= seed_balance_at_stake
#[derive(Accounts)]
pub struct UpdateBoostStatus<'info> {
    /// Anyone can call this — permissionless (crank or user)
    #[account(mut)]
    pub payer: Signer<'info>,

    /// GlobalState for seed_mint config
    #[account(
        seeds = [GLOBAL_STATE_SEED],
        bump = global_state.bump,
    )]
    pub global_state: Account<'info, GlobalState>,

    /// The stake account to check; must be owned by stake_owner
    #[account(
        mut,
        seeds = [
            STAKE_SEED,
            stake_owner.key().as_ref(),
            &stake_account.stake_id.to_le_bytes(),
        ],
        bump = stake_account.bump,
        realloc = StakeAccount::LEN,
        realloc::payer = payer,
        realloc::zero = false,
    )]
    pub stake_account: Account<'info, StakeAccount>,

    /// CHECK: Only used as PDA seed; validated by stake_account seeds constraint
    pub stake_owner: UncheckedAccount<'info>,

    /// Canonical ATA for stake_owner's seed tokens
    #[account(
        associated_token::mint = seed_mint,
        associated_token::authority = stake_owner,
        associated_token::token_program = seed_token_program,
    )]
    pub seed_token_account: InterfaceAccount<'info, TokenAccount>,

    /// The seed token mint; constrained to match global_state.get_seed_mint()
    #[account(
        constraint = seed_mint.key() == global_state.get_seed_mint() @ HelixError::InvalidSeedTokenAccount
    )]
    pub seed_mint: InterfaceAccount<'info, Mint>,

    /// Seed token program — supports both SPL Token and Token-2022
    pub seed_token_program: Interface<'info, TokenInterface>,

    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}

pub fn update_boost_status(ctx: Context<UpdateBoostStatus>) -> Result<()> {
    let stake_account = &mut ctx.accounts.stake_account;

    // 1. If not a boosted stake, silently return
    if stake_account.seed_balance_at_stake == 0 {
        return Ok(());
    }

    // 2. If already revoked, silently return (BOOST-05: revocation is permanent)
    if stake_account.boost_revoked {
        return Ok(());
    }

    // 3. Read current seed balance
    let current_balance = ctx.accounts.seed_token_account.amount;
    let required_balance = stake_account.seed_balance_at_stake;

    // 4. If balance dropped below snapshot, permanently revoke
    if current_balance < required_balance {
        stake_account.boost_revoked = true;

        let clock = Clock::get()?;
        emit!(BoostRevoked {
            slot: clock.slot,
            user: stake_account.user,
            stake_id: stake_account.stake_id,
            current_balance,
            required_balance,
        });
    }

    // 5. Return Ok regardless (no error for healthy state)
    Ok(())
}
