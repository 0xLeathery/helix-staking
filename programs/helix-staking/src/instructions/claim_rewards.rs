use anchor_lang::prelude::*;
use anchor_lang::system_program::{self, Transfer};
use anchor_spl::token_2022::{self, MintTo, Token2022};
use anchor_spl::token_interface::{Mint, TokenAccount};
use crate::constants::*;
use crate::error::HelixError;
use crate::events::RewardsClaimed;
use crate::state::{GlobalState, StakeAccount};
use crate::instructions::math::{calculate_pending_rewards, calculate_reward_debt, calculate_loyalty_bonus, mul_div};
use crate::instructions::crank_distribution::distribute_pending_inflation;

/// Apply loyalty multiplier to a reward amount.
/// reward × (1 + loyalty_bonus / PRECISION)
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
        realloc = StakeAccount::LEN,
        realloc::payer = user,
        realloc::zero = false,
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
    pub system_program: Program<'info, System>,
}

pub fn claim_rewards(ctx: Context<ClaimRewards>) -> Result<()> {
    let clock = Clock::get()?;

    // Ensure share_rate is up-to-date
    distribute_pending_inflation(&mut ctx.accounts.global_state, &clock)?;

    let global_state = &mut ctx.accounts.global_state;
    let stake = &ctx.accounts.stake_account;

    // OPS-03: Reject user operations while program is paused
    require!(!global_state.is_paused(), HelixError::ProgramPaused);

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

    // Phase 8.1: Calculate loyalty bonus based on time served
    let loyalty_bonus = calculate_loyalty_bonus(
        stake.start_slot,
        clock.slot,
        stake.stake_days as u64,
        global_state.slots_per_day,
    )?;

    // Apply loyalty multiplier: reward × (1 + loyalty_bonus / PRECISION)
    let loyalty_adjusted_rewards = apply_loyalty_multiplier(pending_rewards, loyalty_bonus)?;

    // Include BPD bonus if pending (loyalty does NOT apply to BPD bonus)
    let bpd_bonus = stake.bpd_bonus_pending;
    let total_rewards = loyalty_adjusted_rewards
        .checked_add(bpd_bonus)
        .ok_or(HelixError::Overflow)?;

    // Phase 8.1 (C3/FR-006): Prevent zero-amount mint CPI
    require!(total_rewards > 0, HelixError::ClaimAmountZero);

    // CRITICAL: Update reward_debt BEFORE CPI (prevents double-claim)
    // Uses u128 intermediate to prevent overflow
    let stake_mut = &mut ctx.accounts.stake_account;
    stake_mut.reward_debt = calculate_reward_debt(t_shares, global_state.share_rate)?;

    // Clear BPD bonus after claiming
    if bpd_bonus > 0 {
        stake_mut.bpd_bonus_pending = 0;
    }

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

    token_2022::mint_to(cpi_ctx, total_rewards)?;

    // Emit event
    emit!(RewardsClaimed {
        slot: clock.slot,
        user,
        stake_id,
        amount: total_rewards,  // Includes BPD bonus
    });

    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::constants::*;
    use crate::instructions::math::{calculate_pending_rewards, calculate_reward_debt, calculate_loyalty_bonus};

    // ====== apply_loyalty_multiplier ======

    #[test]
    fn test_loyalty_mult_no_bonus() {
        assert_eq!(apply_loyalty_multiplier(500_000, 0).unwrap(), 500_000);
    }

    #[test]
    fn test_loyalty_mult_zero_rewards() {
        assert_eq!(apply_loyalty_multiplier(0, LOYALTY_MAX_BONUS).unwrap(), 0);
    }

    #[test]
    fn test_loyalty_mult_max_bonus() {
        // LOYALTY_MAX_BONUS = 500_000_000 = 50% bonus
        // 2_000_000 * 1.5 = 3_000_000
        let result = apply_loyalty_multiplier(2_000_000, LOYALTY_MAX_BONUS).unwrap();
        assert_eq!(result, 3_000_000);
    }

    // ====== claim reward math integration ======

    #[test]
    fn test_claim_rewards_with_loyalty() {
        // Full simulation: rate increases → pending rewards → loyalty applied
        // Use enough t_shares so pending > 0 after PRECISION division
        // pending = t_shares * rate_delta / PRECISION
        // With t_shares = 1e12, rate_delta = 100: pending = 1e12 * 100 / 1e9 = 100
        let t_shares = 1_000_000_000_000u64; // 1e12
        let rate_start = 10_000u64;
        let debt = calculate_reward_debt(t_shares, rate_start).unwrap();

        // Rate increases by 100 after some distributions
        let rate_now = rate_start + 100;
        let pending = calculate_pending_rewards(t_shares, rate_now, debt).unwrap();
        assert!(pending > 0, "Should have pending rewards; pending = {}", pending);

        // Full loyalty (50% term served at max)
        let adjusted = apply_loyalty_multiplier(pending, LOYALTY_MAX_BONUS).unwrap();
        assert_eq!(adjusted, pending * 3 / 2); // 1.5x

        // No loyalty (fresh stake)
        let no_loyalty = apply_loyalty_multiplier(pending, 0).unwrap();
        assert_eq!(no_loyalty, pending);
    }

    #[test]
    fn test_bpd_bonus_included_in_total() {
        // total_rewards = loyalty_adjusted + bpd_bonus
        let base_rewards = 100_000u64;
        let bpd_bonus = 50_000u64;
        let total = base_rewards.checked_add(bpd_bonus).unwrap();
        assert_eq!(total, 150_000);
    }

    #[test]
    fn test_reward_debt_updated_after_claim() {
        // After claiming, new debt = t_shares * current_rate
        let t_shares = 1_000_000u64;
        let current_rate = 15_000u64;
        let new_debt = calculate_reward_debt(t_shares, current_rate).unwrap();
        assert_eq!(new_debt, t_shares * current_rate);
    }

    #[test]
    fn test_loyalty_at_various_stages() {
        let spd = DEFAULT_SLOTS_PER_DAY;

        // 0 days served → 0 bonus
        let bonus_day0 = calculate_loyalty_bonus(0, 0, 365, spd).unwrap();
        assert_eq!(bonus_day0, 0);

        // 365 days served = full term → max bonus
        let bonus_full = calculate_loyalty_bonus(0, 365 * spd, 365, spd).unwrap();
        assert_eq!(bonus_full, LOYALTY_MAX_BONUS);

        // 50% served → ~25% bonus
        let bonus_half = calculate_loyalty_bonus(0, 182 * spd, 365, spd).unwrap();
        assert!(bonus_half > 0 && bonus_half < LOYALTY_MAX_BONUS);
    }
}
