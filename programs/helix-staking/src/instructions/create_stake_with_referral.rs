use anchor_lang::prelude::*;
use anchor_spl::token_interface::{Mint, TokenAccount, Token2022};
use anchor_spl::token_2022;

use crate::constants::*;
use crate::error::HelixError;
use crate::events::{StakeCreated, ReferralStaked};
use crate::state::{GlobalState, StakeAccount, ClaimConfig, ReferralRecord};
use crate::instructions::math::{calculate_t_shares, calculate_reward_debt, mul_div};
use crate::instructions::crank_distribution::distribute_pending_inflation;

#[derive(Accounts)]
#[instruction(amount: u64, days: u16, referrer: Pubkey)]
pub struct CreateStakeWithReferral<'info> {
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

    /// Referrer's token account — must hold the correct mint and belong to the referrer
    #[account(
        mut,
        token::mint = mint,
        token::token_program = token_program,
        constraint = referrer_token_account.owner == referrer @ HelixError::InvalidParameter,
    )]
    pub referrer_token_account: InterfaceAccount<'info, TokenAccount>,

    #[account(
        init,
        payer = user,
        space = ReferralRecord::LEN,
        seeds = [REFERRAL_RECORD_SEED, referrer.as_ref(), user.key().as_ref()],
        bump,
    )]
    pub referral_record: Account<'info, ReferralRecord>,

    #[account(
        mut,
        seeds = [MINT_SEED],
        bump,
    )]
    pub mint: InterfaceAccount<'info, Mint>,

    /// CHECK: Mint authority PDA for minting referrer bonus
    #[account(
        seeds = [MINT_AUTHORITY_SEED],
        bump = global_state.mint_authority_bump,
    )]
    pub mint_authority: UncheckedAccount<'info>,

    pub token_program: Program<'info, Token2022>,
    pub system_program: Program<'info, System>,
}

pub fn create_stake_with_referral<'info>(
    ctx: Context<'_, '_, 'info, 'info, CreateStakeWithReferral<'info>>,
    amount: u64,
    days: u16,
    referrer: Pubkey,
) -> Result<()> {
    // Self-referral check MUST be first — before any state mutations
    require!(referrer != *ctx.accounts.user.key, HelixError::SelfReferral);

    let clock = Clock::get()?;

    // Ensure share_rate is up-to-date (sandwich attack prevention)
    distribute_pending_inflation(&mut ctx.accounts.global_state, &clock)?;

    let global_state = &mut ctx.accounts.global_state;
    let stake_account = &mut ctx.accounts.stake_account;

    // Reject user operations while program is paused
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

    // Calculate base T-shares with LPB + BPB bonuses
    let base_t_shares = calculate_t_shares(amount, days as u64, global_state.share_rate)?;

    // Apply +10% T-share bonus for referee
    let referee_bonus = mul_div(base_t_shares, REFEREE_BONUS_BPS, BPS_SCALER)?;
    let t_shares = base_t_shares
        .checked_add(referee_bonus)
        .ok_or(HelixError::Overflow)?;

    // Calculate end slot
    let end_slot = clock.slot
        .checked_add(
            (days as u64)
                .checked_mul(global_state.slots_per_day)
                .ok_or(HelixError::Overflow)?
        )
        .ok_or(HelixError::Overflow)?;

    // Calculate reward debt (for lazy distribution)
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

    // Calculate +5% token bonus for referrer
    let referrer_bonus = mul_div(amount, REFERRER_BONUS_BPS, BPS_SCALER)?;

    // Mint referrer bonus tokens using mint_authority PDA signer
    let mint_authority_bump = global_state.mint_authority_bump;
    let mint_authority_seeds = &[
        MINT_AUTHORITY_SEED,
        &[mint_authority_bump],
    ];
    let signer_seeds = &[&mint_authority_seeds[..]];

    token_2022::mint_to(
        CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            token_2022::MintTo {
                mint: ctx.accounts.mint.to_account_info(),
                to: ctx.accounts.referrer_token_account.to_account_info(),
                authority: ctx.accounts.mint_authority.to_account_info(),
            },
            signer_seeds,
        ),
        referrer_bonus,
    )?;

    // Populate ReferralRecord
    let referral_record = &mut ctx.accounts.referral_record;
    referral_record.referrer = referrer;
    referral_record.referee = ctx.accounts.user.key();
    referral_record.slot = clock.slot;
    referral_record.bump = ctx.bumps.referral_record;

    // Emit StakeCreated event (backward compatibility with existing indexer)
    emit!(StakeCreated {
        slot: clock.slot,
        user: ctx.accounts.user.key(),
        stake_id: stake_account.stake_id,
        amount,
        t_shares,
        days,
        share_rate: global_state.share_rate,
    });

    // Emit ReferralStaked event
    emit!(ReferralStaked {
        slot: clock.slot,
        referrer,
        referee: ctx.accounts.user.key(),
        stake_id: stake_account.stake_id,
        referee_t_share_bonus: referee_bonus,
        referrer_token_bonus: referrer_bonus,
    });

    Ok(())
}
