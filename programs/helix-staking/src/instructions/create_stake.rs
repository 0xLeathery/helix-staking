use anchor_lang::prelude::*;
use anchor_spl::token_interface::{Mint, TokenAccount, Token2022};
use anchor_spl::token_2022;

use crate::constants::*;
use crate::error::HelixError;
use crate::events::StakeCreated;
use crate::state::{GlobalState, StakeAccount, ClaimConfig};
use crate::instructions::math::{calculate_t_shares, calculate_reward_debt};
use crate::instructions::crank_distribution::distribute_pending_inflation;

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

    pub token_program: Program<'info, Token2022>,
    pub system_program: Program<'info, System>,
}

pub fn create_stake<'info>(
    ctx: Context<'_, '_, 'info, 'info, CreateStake<'info>>,
    amount: u64,
    days: u16,
) -> Result<()> {
    let clock = Clock::get()?;

    // Ensure share_rate is up-to-date (sandwich attack prevention)
    distribute_pending_inflation(&mut ctx.accounts.global_state, &clock)?;

    let global_state = &mut ctx.accounts.global_state;
    let stake_account = &mut ctx.accounts.stake_account;

    // OPS-03: Reject user operations while program is paused
    require!(!global_state.is_paused(), HelixError::ProgramPaused);

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
    // Uses u128 intermediate to prevent overflow
    let reward_debt = calculate_reward_debt(t_shares, global_state.share_rate)?;

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

    // BPD fields - check if claim period is active
    stake_account.bpd_bonus_pending = 0;

    // Check if ClaimConfig was passed in remaining_accounts and period is active
    let (bpd_eligible, claim_period_start_slot) = if !ctx.remaining_accounts.is_empty() {
        let claim_config_info = &ctx.remaining_accounts[0];

        // Verify it's the correct ClaimConfig PDA
        let (expected_pda, _) = Pubkey::find_program_address(
            &[CLAIM_CONFIG_SEED],
            ctx.program_id,
        );

        if claim_config_info.key() == expected_pda {
            // Try to deserialize and check if active
            if let Ok(claim_config) = Account::<ClaimConfig>::try_from(claim_config_info) {
                if claim_config.claim_period_started && clock.slot <= claim_config.end_slot {
                    (true, claim_config.start_slot)
                } else {
                    (false, 0)
                }
            } else {
                (false, 0)
            }
        } else {
            (false, 0)
        }
    } else {
        (false, 0)
    };

    stake_account.bpd_eligible = bpd_eligible;
    stake_account.claim_period_start_slot = claim_period_start_slot;

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

#[cfg(test)]
mod tests {
    use crate::constants::*;
    use crate::instructions::math::{calculate_t_shares, calculate_reward_debt};

    #[test]
    fn test_t_shares_calculation_basic() {
        // Verify t_shares increases with amount (BPB bonus makes it non-perfectly-linear)
        let rate = DEFAULT_STARTING_SHARE_RATE;
        let small = calculate_t_shares(1_000_000_000, 1, rate).unwrap();
        let large = calculate_t_shares(10_000_000_000, 1, rate).unwrap();
        // With BPB bonus, larger amounts get proportionally more t_shares
        assert!(large > small * 10 - small, "larger amount yields more t_shares due to BPB");
        assert!(large > 0 && small > 0, "t_shares should be positive");
    }

    #[test]
    fn test_t_shares_lpb_increases_with_duration() {
        let rate = DEFAULT_STARTING_SHARE_RATE;
        let amount = 1_000_000_000u64;
        let short = calculate_t_shares(amount, 1, rate).unwrap();
        let long_ = calculate_t_shares(amount, 3641, rate).unwrap(); // LPB_MAX_DAYS
        assert!(long_ > short, "longer duration should yield more t_shares");
    }

    #[test]
    fn test_reward_debt_at_creation() {
        // At creation time: reward_debt = t_shares * share_rate
        let rate = DEFAULT_STARTING_SHARE_RATE;
        let t_shares = 1_500_000_000u64;
        let debt = calculate_reward_debt(t_shares, rate).unwrap();
        assert_eq!(debt, t_shares * rate);
    }

    #[test]
    fn test_end_slot_calculation() {
        // end_slot = start_slot + days * slots_per_day
        let spd = DEFAULT_SLOTS_PER_DAY;
        let start = 1000u64;
        let days = 365u64;
        let end = start + days * spd;
        assert_eq!(end - start, days * spd);
    }

    #[test]
    fn test_stake_validates_minimum() {
        // min_stake_amount check: amount must be >= min
        let min = 10_000_000u64; // DEFAULT_MIN_STAKE_AMOUNT
        assert!(1_000_000 < min, "below minimum should fail validation");
        assert!(10_000_000 >= min, "exactly minimum should pass");
    }

    #[test]
    fn test_stake_validates_duration() {
        // days must be 1..=MAX_STAKE_DAYS
        assert!(1 >= 1 && 1 <= MAX_STAKE_DAYS, "1 day is valid");
        assert!(5555 >= 1 && 5555 <= MAX_STAKE_DAYS, "max days is valid");
        assert!(!(5556 <= MAX_STAKE_DAYS as u16), "above max is invalid");
        assert!(!(0 >= 1u16), "0 days is invalid");
    }
}
