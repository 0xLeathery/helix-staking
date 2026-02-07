use anchor_lang::prelude::*;
use anchor_spl::token_2022::{self, MintTo, Token2022};
use anchor_spl::token_interface::{Mint, TokenAccount};
use crate::constants::*;
use crate::error::HelixError;
use crate::events::RewardsClaimed;
use crate::state::{GlobalState, StakeAccount};
use crate::instructions::math::calculate_pending_rewards;

#[derive(Accounts)]
pub struct ClaimRewards<'info> {
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
        constraint = stake_account.is_active @ HelixError::StakeNotActive,
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

pub fn claim_rewards(ctx: Context<ClaimRewards>) -> Result<()> {
    let clock = Clock::get()?;
    let global_state = &mut ctx.accounts.global_state;
    let stake = &ctx.accounts.stake_account;

    // Save values before mutating
    let stake_id = stake.stake_id;
    let t_shares = stake.t_shares;
    let user = stake.user;

    // Calculate pending rewards
    let pending_rewards = calculate_pending_rewards(
        t_shares,
        global_state.share_rate,
        stake.reward_debt,
    )?;

    // Require non-zero rewards
    require!(pending_rewards > 0, HelixError::NoRewardsToClaim);

    // CRITICAL: Update reward_debt BEFORE CPI (prevents double-claim)
    let stake_mut = &mut ctx.accounts.stake_account;
    stake_mut.reward_debt = t_shares
        .checked_mul(global_state.share_rate)
        .ok_or(HelixError::Overflow)?;

    // Update GlobalState
    global_state.total_claims_created = global_state.total_claims_created
        .checked_add(1)
        .ok_or(HelixError::Overflow)?;

    // Mint rewards to user
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

    token_2022::mint_to(cpi_ctx, pending_rewards)?;

    // Emit event
    emit!(RewardsClaimed {
        slot: clock.slot,
        user,
        stake_id,
        amount: pending_rewards,
    });

    Ok(())
}
