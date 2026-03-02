use anchor_lang::prelude::*;
use anchor_spl::token_2022::{self, MintTo, Token2022};
use anchor_spl::token_interface::{Mint, TokenAccount};
use crate::constants::*;
use crate::error::HelixError;
use crate::events::StakeEnded;
use crate::state::{GlobalState, StakeAccount};
use crate::instructions::math::{calculate_early_penalty, calculate_late_penalty, calculate_pending_rewards, calculate_loyalty_bonus, mul_div};
use crate::instructions::crank_distribution::distribute_pending_inflation;

/// Apply loyalty multiplier to a reward amount.
/// reward × (1 + loyalty_bonus / PRECISION)
/// Returns the adjusted reward amount.
fn apply_loyalty_multiplier(pending_rewards: u64, loyalty_bonus: u64) -> Result<u64> {
    if loyalty_bonus == 0 || pending_rewards == 0 {
        return Ok(pending_rewards);
    }
    let total_multiplier = (PRECISION as u128)
        .checked_add(loyalty_bonus as u128)
        .ok_or(error!(HelixError::Overflow))?;
    let adjusted = (pending_rewards as u128)
        .checked_mul(total_multiplier)
        .ok_or(error!(HelixError::Overflow))?
        .checked_div(PRECISION as u128)
        .ok_or(error!(HelixError::DivisionByZero))?;
    u64::try_from(adjusted).map_err(|_| error!(HelixError::Overflow))
}

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

    // Ensure share_rate is up-to-date
    distribute_pending_inflation(&mut ctx.accounts.global_state, &clock)?;

    let global_state = &mut ctx.accounts.global_state;
    let stake = &ctx.accounts.stake_account;

    // OPS-03: Reject user operations while program is paused
    require!(!global_state.is_paused(), HelixError::ProgramPaused);

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

    // Phase 8.1: Calculate loyalty bonus based on time served
    let loyalty_bonus = calculate_loyalty_bonus(
        start_slot,
        clock.slot,
        stake.stake_days as u64,
        global_state.slots_per_day,
    )?;

    // Apply loyalty multiplier to inflation rewards only (NOT principal or BPD bonus)
    let loyalty_adjusted_rewards = apply_loyalty_multiplier(pending_rewards, loyalty_bonus)?;

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

    // LOW-2: Total amount to mint to user (return + loyalty-adjusted rewards + bpd_bonus)
    let total_mint_amount = return_amount
        .checked_add(loyalty_adjusted_rewards)
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
        rewards_claimed: loyalty_adjusted_rewards.checked_add(bpd_bonus)
            .ok_or(HelixError::Overflow)?,
    });

    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::constants::*;
    use crate::instructions::math::{calculate_pending_rewards, calculate_early_penalty, calculate_late_penalty, calculate_loyalty_bonus};

    // ====== apply_loyalty_multiplier ======

    #[test]
    fn test_loyalty_multiplier_no_bonus() {
        // Zero loyalty → unchanged
        assert_eq!(apply_loyalty_multiplier(1_000_000, 0).unwrap(), 1_000_000);
    }

    #[test]
    fn test_loyalty_multiplier_zero_rewards() {
        // Zero rewards → stays 0 regardless of bonus
        assert_eq!(apply_loyalty_multiplier(0, 500_000_000).unwrap(), 0);
    }

    #[test]
    fn test_loyalty_multiplier_half_bonus() {
        // LOYALTY_MAX_BONUS = 500_000_000 = 0.5x
        // 1_000_000 * 1.5 = 1_500_000
        let result = apply_loyalty_multiplier(1_000_000, LOYALTY_MAX_BONUS).unwrap();
        assert_eq!(result, 1_500_000);
    }

    #[test]
    fn test_loyalty_multiplier_quarter_bonus() {
        // 25% bonus: 1_000_000 * 1.25 = 1_250_000
        let bonus = LOYALTY_MAX_BONUS / 2; // 250_000_000 = 0.25x
        let result = apply_loyalty_multiplier(1_000_000, bonus).unwrap();
        assert_eq!(result, 1_250_000);
    }

    // ====== unstake math integration ======

    #[test]
    fn test_unstake_early_return_amount() {
        // Early unstake: return = staked - penalty
        let staked = 1_000_000_000u64;
        let start = 0u64;
        let end = 100u64;
        let current = 50u64; // 50% served

        let penalty = calculate_early_penalty(staked, start, current, end).unwrap();
        // 50% served → natural penalty = 50% = min penalty exactly
        assert_eq!(penalty, staked / 2);
        let return_amount = staked - penalty;
        assert_eq!(return_amount, staked / 2);
    }

    #[test]
    fn test_unstake_late_penalty_at_grace_boundary() {
        // At grace period end → still 0 penalty
        let staked = 1_000_000_000u64;
        let spd = DEFAULT_SLOTS_PER_DAY;
        let end = 0u64;
        let at_grace_end = GRACE_PERIOD_DAYS * spd;
        let penalty = calculate_late_penalty(staked, end, at_grace_end, spd).unwrap();
        assert_eq!(penalty, 0);
    }

    #[test]
    fn test_unstake_on_time_no_penalty() {
        // On-time unstake: end_slot, still in grace → penalty = 0
        let staked = 1_000_000_000u64;
        let spd = DEFAULT_SLOTS_PER_DAY;
        let end = 1000u64;

        let penalty = calculate_late_penalty(staked, end, end, spd).unwrap();
        assert_eq!(penalty, 0);
    }

    #[test]
    fn test_pending_rewards_integration() {
        // After share_rate increases, pending rewards should be positive
        use crate::instructions::math::calculate_reward_debt;
        let t_shares = 1_000_000u64;
        let rate_at_stake = 10_000u64;
        let debt = calculate_reward_debt(t_shares, rate_at_stake).unwrap();

        // After some time, rate increases by 1000
        let new_rate = rate_at_stake + 1_000;
        let pending = calculate_pending_rewards(t_shares, new_rate, debt).unwrap();
        assert!(pending > 0, "Should have pending rewards after rate increase");
    }

    #[test]
    fn test_penalty_redistributed_to_share_rate() {
        // Simulate penalty redistribution: share_rate_increase = penalty * PRECISION / total_shares
        use crate::instructions::math::mul_div;
        let penalty = 1_000_000u64;
        let total_shares = 10_000_000u64;

        let increase = mul_div(penalty, PRECISION, total_shares).unwrap();
        assert!(increase > 0, "Penalty should increase share_rate for remaining stakers");
    }
}
