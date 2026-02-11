use anchor_lang::prelude::*;
use anchor_spl::token_2022::{self, MintTo, Token2022};
use anchor_spl::token_interface::{Mint, TokenAccount};

use crate::constants::*;
use crate::error::HelixError;
use crate::events::VestedTokensWithdrawn;
use crate::instructions::math::mul_div;
use crate::state::{ClaimConfig, ClaimStatus, GlobalState};

#[derive(Accounts)]
pub struct WithdrawVested<'info> {
    #[account(mut)]
    pub claimer: Signer<'info>,

    #[account(
        seeds = [GLOBAL_STATE_SEED],
        bump = global_state.bump,
    )]
    pub global_state: Account<'info, GlobalState>,

    #[account(
        seeds = [CLAIM_CONFIG_SEED],
        bump = claim_config.bump,
    )]
    pub claim_config: Account<'info, ClaimConfig>,

    #[account(
        mut,
        seeds = [
            CLAIM_STATUS_SEED,
            &claim_config.merkle_root[..MERKLE_ROOT_PREFIX_LEN],
            claim_status.snapshot_wallet.as_ref()
        ],
        bump = claim_status.bump,
        constraint = claim_status.is_claimed @ HelixError::ClaimPeriodNotStarted,
        constraint = claim_status.snapshot_wallet == claimer.key() @ HelixError::Unauthorized,
    )]
    pub claim_status: Account<'info, ClaimStatus>,

    #[account(
        mut,
        associated_token::mint = mint,
        associated_token::authority = claimer,
        associated_token::token_program = token_program,
    )]
    pub claimer_token_account: InterfaceAccount<'info, TokenAccount>,

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

pub fn withdraw_vested(ctx: Context<WithdrawVested>) -> Result<()> {
    let clock = Clock::get()?;
    let claim_status = &mut ctx.accounts.claim_status;
    let global_state = &ctx.accounts.global_state;

    // Calculate total vested amount based on time elapsed
    let total_vested = calculate_vested_amount(
        claim_status.claimed_amount,
        claim_status.claimed_slot,
        claim_status.vesting_end_slot,
        clock.slot,
    )?;

    // Calculate available to withdraw (total vested - already withdrawn)
    let available = total_vested
        .checked_sub(claim_status.withdrawn_amount)
        .ok_or(HelixError::Underflow)?;

    require!(available > 0, HelixError::NoVestedTokens);

    // Update withdrawn amount BEFORE minting (security: prevents reentrancy)
    let new_withdrawn = claim_status
        .withdrawn_amount
        .checked_add(available)
        .ok_or(HelixError::Overflow)?;
    claim_status.withdrawn_amount = new_withdrawn;

    // Mint tokens to claimer
    let authority_seeds = &[MINT_AUTHORITY_SEED, &[global_state.mint_authority_bump]];
    let signer_seeds = &[&authority_seeds[..]];

    token_2022::mint_to(
        CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            MintTo {
                mint: ctx.accounts.mint.to_account_info(),
                to: ctx.accounts.claimer_token_account.to_account_info(),
                authority: ctx.accounts.mint_authority.to_account_info(),
            },
            signer_seeds,
        ),
        available,
    )?;

    // Emit event
    emit!(VestedTokensWithdrawn {
        slot: clock.slot,
        timestamp: clock.unix_timestamp,
        claimer: ctx.accounts.claimer.key(),
        amount: available,
        total_vested,
        total_withdrawn: new_withdrawn,
        remaining: claim_status.claimed_amount.saturating_sub(new_withdrawn),
    });

    Ok(())
}

/// Calculate total vested amount based on linear 30-day schedule
/// 10% available immediately at claim
/// 90% vests linearly over 30 days
fn calculate_vested_amount(
    claimed_amount: u64,
    claimed_slot: u64,
    vesting_end_slot: u64,
    current_slot: u64,
) -> Result<u64> {
    // MED-2 FIX: Use mul_div to avoid overflow for large claims
    let immediate = mul_div(claimed_amount, IMMEDIATE_RELEASE_BPS, BPS_SCALER)?;

    // If past vesting end, everything is vested
    if current_slot >= vesting_end_slot {
        return Ok(claimed_amount);
    }

    // If before claim (shouldn't happen), only immediate
    if current_slot <= claimed_slot {
        return Ok(immediate);
    }

    // Calculate linear vesting progress
    let vesting_duration = vesting_end_slot
        .checked_sub(claimed_slot)
        .ok_or(HelixError::Underflow)?;

    let elapsed = current_slot
        .checked_sub(claimed_slot)
        .ok_or(HelixError::Underflow)?;

    // Vesting portion (90% of total)
    let vesting_portion = claimed_amount
        .checked_sub(immediate)
        .ok_or(HelixError::Underflow)?;

    // MED-2 FIX: Use mul_div to avoid u64 overflow via u128 intermediates
    let unlocked_vesting = mul_div(vesting_portion, elapsed, vesting_duration)?;

    // Total vested = immediate + unlocked vesting portion
    immediate
        .checked_add(unlocked_vesting)
        .ok_or(HelixError::Overflow.into())
}
