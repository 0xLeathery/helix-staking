use anchor_lang::prelude::*;
use anchor_spl::token_2022::{self, MintTo, Token2022};
use anchor_spl::token_interface::{Mint, TokenAccount};
use crate::constants::*;
use crate::error::HelixError;
use crate::events::StakeEnded;
use crate::state::{GlobalState, StakeAccount};
use crate::instructions::math::{calculate_early_penalty, calculate_late_penalty, calculate_pending_rewards, mul_div};

#[derive(Accounts)]
pub struct Unstake<'info> {
    #[account(mut)]
    pub user: Signer<'info>,

    #[account(
        mut,
        seeds = [GLOBAL_STATE_SEED],
        bump = global_state.bump,
    )]
    pub global_state: Account<'info, GlobalState>,

    #[account(
        mut,
        seeds = [STAKE_SEED, user.key().as_ref(), &stake_account.stake_id.to_le_bytes()],
        bump = stake_account.bump,
        constraint = stake_account.user == user.key() @ HelixError::UnauthorizedStakeAccess,
        constraint = stake_account.is_active @ HelixError::StakeAlreadyClosed,
    )]
    pub stake_account: Account<'info, StakeAccount>,

    #[account(
        mut,
        associated_token::mint = mint,
        associated_token::authority = user,
        associated_token::token_program = token_program,
    )]
    pub user_token_account: InterfaceAccount<'info, TokenAccount>,

    #[account(
        mut,
        seeds = [MINT_SEED],
        bump,
    )]
    pub mint: InterfaceAccount<'info, Mint>,

    /// CHECK: PDA mint authority
    #[account(
        seeds = [MINT_AUTHORITY_SEED],
        bump = global_state.mint_authority_bump,
    )]
    pub mint_authority: UncheckedAccount<'info>,

    pub token_program: Program<'info, Token2022>,
}

pub fn unstake(ctx: Context<Unstake>) -> Result<()> {
    let clock = Clock::get()?;
    let global_state = &mut ctx.accounts.global_state;
    let stake = &ctx.accounts.stake_account;

    // HIGH-2: Block unstake during BPD window
    require!(!global_state.is_bpd_window_active(), HelixError::UnstakeBlockedDuringBpd);

    // Save values we'll need later (before mutating stake)
    let stake_user = stake.user;
    let stake_id = stake.stake_id;
    let staked_amount = stake.staked_amount;
    let t_shares = stake.t_shares;
    let start_slot = stake.start_slot;
    let end_slot = stake.end_slot;
    let reward_debt = stake.reward_debt;
    let bpd_bonus = stake.bpd_bonus_pending;

    // Calculate pending rewards
    let pending_rewards = calculate_pending_rewards(
        t_shares,
        global_state.share_rate,
        reward_debt,
    )?;

    // Determine penalty based on timing
    let (penalty, penalty_type) = if clock.slot < end_slot {
        // EARLY unstake
        let penalty_amount = calculate_early_penalty(
            staked_amount,
            start_slot,
            clock.slot,
            end_slot,
        )?;
        (penalty_amount, 1u8) // penalty_type = 1 (Early)
    } else {
        // ON-TIME or LATE unstake
        let penalty_amount = calculate_late_penalty(
            staked_amount,
            end_slot,
            clock.slot,
            global_state.slots_per_day,
        )?;
        if penalty_amount == 0 {
            (0u64, 0u8) // penalty_type = 0 (None)
        } else {
            (penalty_amount, 2u8) // penalty_type = 2 (Late)
        }
    };

    // Calculate return amount (staked_amount - penalty)
    let return_amount = staked_amount
        .checked_sub(penalty)
        .ok_or(HelixError::Underflow)?;

    // LOW-2: Total amount to mint to user (return + rewards + bpd_bonus)
    let total_mint_amount = return_amount
        .checked_add(pending_rewards)
        .ok_or(HelixError::Overflow)?
        .checked_add(bpd_bonus)
        .ok_or(HelixError::Overflow)?;

    // CRITICAL: Mark inactive BEFORE CPI (reentrancy prevention)
    let stake_mut = &mut ctx.accounts.stake_account;
    stake_mut.is_active = false;

    // LOW-2: Clear BPD bonus after including in payout
    stake_mut.bpd_bonus_pending = 0;

    // Update GlobalState
    global_state.total_unstakes_created = global_state.total_unstakes_created
        .checked_add(1)
        .ok_or(HelixError::Overflow)?;

    global_state.total_tokens_unstaked = global_state.total_tokens_unstaked
        .checked_add(staked_amount)
        .ok_or(HelixError::Overflow)?;

    global_state.total_shares = global_state.total_shares
        .checked_sub(t_shares)
        .ok_or(HelixError::Underflow)?;

    global_state.total_tokens_staked = global_state.total_tokens_staked
        .checked_sub(staked_amount)
        .ok_or(HelixError::Underflow)?;

    // Redistribute penalty to remaining stakers via share_rate increase
    // This happens AFTER removing unstaker's shares so they don't benefit from their own penalty
    // Formula: share_rate_increase = (penalty_amount * PRECISION) / remaining_total_shares
    // Frontend note: This increases rewards for all remaining stakers proportionally
    if penalty > 0 && global_state.total_shares > 0 {
        let penalty_share_increase = mul_div(penalty, PRECISION, global_state.total_shares)?;
        global_state.share_rate = global_state.share_rate
            .checked_add(penalty_share_increase)
            .ok_or(HelixError::Overflow)?;
    }

    // Mint tokens to user if amount > 0
    if total_mint_amount > 0 {
        let authority_seeds = &[MINT_AUTHORITY_SEED, &[global_state.mint_authority_bump]];
        let signer_seeds = &[&authority_seeds[..]];

        let cpi_accounts = MintTo {
            mint: ctx.accounts.mint.to_account_info(),
            to: ctx.accounts.user_token_account.to_account_info(),
            authority: ctx.accounts.mint_authority.to_account_info(),
        };

        let cpi_ctx = CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            cpi_accounts,
            signer_seeds,
        );

        token_2022::mint_to(cpi_ctx, total_mint_amount)?;
    }

    // Emit event
    emit!(StakeEnded {
        slot: clock.slot,
        user: stake_user,
        stake_id,
        original_amount: staked_amount,
        return_amount,
        penalty_amount: penalty,
        penalty_type,
        rewards_claimed: pending_rewards.checked_add(bpd_bonus).unwrap_or(pending_rewards),
    });

    Ok(())
}
