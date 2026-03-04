use anchor_lang::prelude::*;
use anchor_spl::associated_token::AssociatedToken;
use anchor_spl::token_interface::{Mint, TokenAccount, TokenInterface};

use crate::constants::*;
use crate::error::HelixError;
use crate::events::BoostRegistered;
use crate::state::{BoostRecord, GlobalState};

/// Register a boost record for the caller's wallet.
///
/// Creates a BoostRecord PDA seeded by ["boost_record", user].
/// One BoostRecord per wallet — enforced by PDA uniqueness.
///
/// Requirements:
/// - boost_enabled must be true
/// - seed_mint must be configured (non-default)
/// - seed_token_account must be the canonical ATA for the user
/// - seed ATA balance must be >= global_state.get_min_seed_balance()
#[derive(Accounts)]
pub struct RegisterSeedBoost<'info> {
    /// User registering for boost; pays for BoostRecord init
    #[account(mut)]
    pub user: Signer<'info>,

    /// GlobalState holds boost config (seed_mint, min_seed_balance, boost_enabled)
    #[account(
        seeds = [GLOBAL_STATE_SEED],
        bump = global_state.bump,
    )]
    pub global_state: Account<'info, GlobalState>,

    /// BoostRecord PDA — init means one per wallet (PDA uniqueness enforces this)
    #[account(
        init,
        payer = user,
        space = BoostRecord::LEN,
        seeds = [BOOST_RECORD_SEED, user.key().as_ref()],
        bump,
    )]
    pub boost_record: Account<'info, BoostRecord>,

    /// Canonical ATA for seed token; Anchor validates the ATA derivation automatically
    #[account(
        associated_token::mint = seed_mint,
        associated_token::authority = user,
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

pub fn register_seed_boost(ctx: Context<RegisterSeedBoost>) -> Result<()> {
    let global_state = &ctx.accounts.global_state;

    // 1. Check boost is enabled
    require!(global_state.get_boost_enabled(), HelixError::BoostNotEnabled);

    // 2. Check seed mint is configured
    require!(
        global_state.get_seed_mint() != Pubkey::default(),
        HelixError::SeedMintNotConfigured
    );

    // 3. seed_mint constraint already validated canonical ATA derivation via Anchor

    // 4. Read balance
    let balance = ctx.accounts.seed_token_account.amount;

    // 5. Check balance >= minimum
    require!(
        balance >= global_state.get_min_seed_balance(),
        HelixError::SeedBalanceBelowMinimum
    );

    let clock = Clock::get()?;

    // 6. Write BoostRecord
    let boost_record = &mut ctx.accounts.boost_record;
    boost_record.user = ctx.accounts.user.key();
    boost_record.slot = clock.slot;
    boost_record.bump = ctx.bumps.boost_record;
    boost_record.boosted_stake_id = u64::MAX; // Not yet linked to a stake

    // 7. Emit event
    emit!(BoostRegistered {
        slot: clock.slot,
        user: ctx.accounts.user.key(),
        seed_balance: balance,
    });

    Ok(())
}
