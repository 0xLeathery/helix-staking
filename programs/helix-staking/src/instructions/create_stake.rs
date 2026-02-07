use anchor_lang::prelude::*;
use anchor_spl::token_interface::{Mint, TokenAccount, Token2022};
use anchor_spl::token_2022;

use crate::constants::*;
use crate::error::HelixError;
use crate::events::StakeCreated;
use crate::state::{GlobalState, StakeAccount};
use crate::instructions::math::calculate_t_shares;

#[derive(Accounts)]
pub struct CreateStake<'info> {
    #[account(mut)]
    pub user: Signer<'info>,

    #[account(
        mut,
        seeds = [GLOBAL_STATE_SEED],
        bump = global_state.bump,
    )]
    pub global_state: Account<'info, GlobalState>,

    #[account(
        init,
        payer = user,
        space = StakeAccount::LEN,
        seeds = [
            STAKE_SEED,
            user.key().as_ref(),
            &global_state.total_stakes_created.to_le_bytes()
        ],
        bump,
    )]
    pub stake_account: Account<'info, StakeAccount>,

    #[account(
        mut,
        constraint = user_token_account.mint == global_state.mint @ HelixError::InvalidParameter,
        constraint = user_token_account.owner == user.key() @ HelixError::InvalidParameter,
    )]
    pub user_token_account: InterfaceAccount<'info, TokenAccount>,

    #[account(
        mut,
        seeds = [MINT_SEED],
        bump,
    )]
    pub mint: InterfaceAccount<'info, Mint>,

    pub token_program: Program<'info, Token2022>,
    pub system_program: Program<'info, System>,
}

pub fn create_stake(ctx: Context<CreateStake>, amount: u64, days: u16) -> Result<()> {
    let global_state = &mut ctx.accounts.global_state;
    let stake_account = &mut ctx.accounts.stake_account;

    // Validate amount
    require!(
        amount >= global_state.min_stake_amount,
        HelixError::StakeBelowMinimum
    );

    // Validate duration
    require!(
        days >= 1 && days <= MAX_STAKE_DAYS as u16,
        HelixError::InvalidStakeDuration
    );

    // Get current time
    let clock = Clock::get()?;

    // Calculate T-shares with LPB + BPB bonuses
    let t_shares = calculate_t_shares(amount, days as u64, global_state.share_rate)?;

    // Calculate end slot
    let end_slot = clock.slot
        .checked_add(
            (days as u64)
                .checked_mul(global_state.slots_per_day)
                .ok_or(HelixError::Overflow)?
        )
        .ok_or(HelixError::Overflow)?;

    // Calculate reward debt (for lazy distribution)
    let reward_debt = t_shares
        .checked_mul(global_state.share_rate)
        .ok_or(HelixError::Overflow)?;

    // Initialize StakeAccount
    stake_account.user = ctx.accounts.user.key();
    stake_account.stake_id = global_state.total_stakes_created;
    stake_account.staked_amount = amount;
    stake_account.t_shares = t_shares;
    stake_account.start_slot = clock.slot;
    stake_account.end_slot = end_slot;
    stake_account.stake_days = days;
    stake_account.reward_debt = reward_debt;
    stake_account.is_active = true;
    stake_account.bump = ctx.bumps.stake_account;

    // Update GlobalState counters
    global_state.total_stakes_created = global_state.total_stakes_created
        .checked_add(1)
        .ok_or(HelixError::Overflow)?;

    global_state.total_tokens_staked = global_state.total_tokens_staked
        .checked_add(amount)
        .ok_or(HelixError::Overflow)?;

    global_state.total_shares = global_state.total_shares
        .checked_add(t_shares)
        .ok_or(HelixError::Overflow)?;

    // Burn tokens from user (tokens locked in protocol via burn-and-mint model)
    token_2022::burn(
        CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            token_2022::Burn {
                mint: ctx.accounts.mint.to_account_info(),
                from: ctx.accounts.user_token_account.to_account_info(),
                authority: ctx.accounts.user.to_account_info(),
            },
        ),
        amount,
    )?;

    // Emit event
    emit!(StakeCreated {
        slot: clock.slot,
        user: ctx.accounts.user.key(),
        stake_id: stake_account.stake_id,
        amount,
        t_shares,
        days,
        share_rate: global_state.share_rate,
    });

    Ok(())
}
