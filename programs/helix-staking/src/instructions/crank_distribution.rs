use anchor_lang::prelude::*;
use anchor_spl::token_interface::{Mint, Token2022};

use crate::constants::*;
use crate::error::HelixError;
use crate::events::InflationDistributed;
use crate::state::GlobalState;
use crate::instructions::math::{get_current_day, mul_div};

#[derive(Accounts)]
pub struct CrankDistribution<'info> {
    /// Cranker - anyone can call this (permissionless)
    pub cranker: Signer<'info>,

    #[account(
        mut,
        seeds = [GLOBAL_STATE_SEED],
        bump = global_state.bump,
    )]
    pub global_state: Account<'info, GlobalState>,

    #[account(
        mut,
        seeds = [MINT_SEED],
        bump,
    )]
    pub mint: InterfaceAccount<'info, Mint>,

    /// CHECK: PDA mint authority used for minting (only needed for signature, no minting on crank)
    #[account(
        seeds = [MINT_AUTHORITY_SEED],
        bump = global_state.mint_authority_bump,
    )]
    pub mint_authority: UncheckedAccount<'info>,

    pub token_program: Program<'info, Token2022>,
}

pub fn crank_distribution(ctx: Context<CrankDistribution>) -> Result<()> {
    let global_state = &mut ctx.accounts.global_state;

    // Get current time
    let clock = Clock::get()?;

    // Calculate current day
    let current_day = get_current_day(
        global_state.init_slot,
        clock.slot,
        global_state.slots_per_day,
    )?;

    // Require that we haven't already distributed for this day
    require!(
        current_day > global_state.current_day,
        HelixError::AlreadyDistributedToday
    );

    // Calculate days elapsed since last distribution
    let days_elapsed = current_day
        .checked_sub(global_state.current_day)
        .ok_or(HelixError::Underflow)?;

    // If no active shares, just update current_day and return
    if global_state.total_shares == 0 {
        global_state.current_day = current_day;

        emit!(InflationDistributed {
            slot: clock.slot,
            day: current_day,
            days_elapsed,
            amount: 0,
            new_share_rate: global_state.share_rate,
            total_shares: 0,
        });

        return Ok(());
    }

    // Calculate daily inflation amount
    // Use total_tokens_staked instead of mint.supply because we burn tokens on stake
    // In burn-and-mint model, supply doesn't reflect locked value
    let total_staked = global_state.total_tokens_staked;

    // annual_inflation = staked * annual_inflation_bp / 100_000_000
    // (basis points with 2 extra decimals of precision: 3.69% = 3_690_000 bp)
    let annual_inflation = total_staked
        .checked_mul(global_state.annual_inflation_bp)
        .ok_or(HelixError::Overflow)?
        .checked_div(100_000_000)
        .ok_or(HelixError::Overflow)?;

    // daily_inflation = annual_inflation * days_elapsed / 365
    // CRITICAL: Multiply before divide to preserve precision
    // Formula: daily_inflation = annual_inflation * days_elapsed / 365
    // Frontend TypeScript: (BigInt(annualInflation) * BigInt(daysElapsed)) / 365n
    let daily_inflation_total = mul_div(annual_inflation, days_elapsed, 365)?;

    // Update share_rate: share_rate += daily_inflation * PRECISION / total_shares
    // Formula: share_rate_increase = (daily_inflation * PRECISION) / total_shares
    let share_rate_increase = mul_div(daily_inflation_total, PRECISION, global_state.total_shares)?;

    global_state.share_rate = global_state.share_rate
        .checked_add(share_rate_increase)
        .ok_or(HelixError::Overflow)?;

    // Update current_day
    global_state.current_day = current_day;

    // Emit event
    emit!(InflationDistributed {
        slot: clock.slot,
        day: current_day,
        days_elapsed,
        amount: daily_inflation_total,
        new_share_rate: global_state.share_rate,
        total_shares: global_state.total_shares,
    });

    Ok(())
}
