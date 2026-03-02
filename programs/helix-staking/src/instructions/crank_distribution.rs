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

/// Create a minimal GlobalState for unit testing — only fills fields needed by
/// `distribute_pending_inflation`. Not valid for on-chain use (no PDA, no authority).
#[cfg(test)]
pub fn make_test_global_state(
    init_slot: u64,
    slots_per_day: u64,
    current_day: u64,
    total_shares: u64,
    total_tokens_staked: u64,
    share_rate: u64,
    annual_inflation_bp: u64,
) -> crate::state::GlobalState {
    use anchor_lang::prelude::Pubkey;
    crate::state::GlobalState {
        authority: Pubkey::default(),
        mint: Pubkey::default(),
        mint_authority_bump: 0,
        bump: 0,
        annual_inflation_bp,
        min_stake_amount: 10_000_000,
        share_rate,
        starting_share_rate: share_rate,
        slots_per_day,
        claim_period_days: 180,
        init_slot,
        total_stakes_created: 0,
        total_unstakes_created: 0,
        total_claims_created: 0,
        total_tokens_staked,
        total_tokens_unstaked: 0,
        total_shares,
        current_day,
        total_admin_minted: 0,
        max_admin_mint: 0,
        reserved: [0u64; 6],
    }
}

pub fn crank_distribution(ctx: Context<CrankDistribution>) -> Result<()> {
    let global_state = &mut ctx.accounts.global_state;
    let clock = Clock::get()?;

    // OPS-03: Reject user operations while program is paused
    require!(!global_state.is_paused(), HelixError::ProgramPaused);

    // Explicit check for manual crank to preserve error behavior
    let current_day = get_current_day(
        global_state.init_slot,
        clock.slot,
        global_state.slots_per_day,
    )?;

    require!(
        current_day > global_state.current_day,
        HelixError::AlreadyDistributedToday
    );

    distribute_pending_inflation(global_state, &clock)
}

/// Helper function to distribute pending inflation if a new day has started.
/// This can be called safely from other instructions to ensure share_rate is up-to-date.
/// It is idempotent (does nothing if already distributed for the day).
pub fn distribute_pending_inflation(global_state: &mut GlobalState, clock: &Clock) -> Result<()> {
    // Calculate current day
    let current_day = get_current_day(
        global_state.init_slot,
        clock.slot,
        global_state.slots_per_day,
    )?;

    // If already distributed for this day (or later?), do nothing
    if current_day <= global_state.current_day {
        return Ok(());
    }

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

    // HIGH-1 FIX: Use mul_div to avoid u64 overflow via u128 intermediates
    // (overflows at ~50K HELIX staked without this)
    // annual_inflation = staked * annual_inflation_bp / 100_000_000
    // (basis points with 2 extra decimals of precision: 3.69% = 3_690_000 bp)
    let annual_inflation = mul_div(total_staked, global_state.annual_inflation_bp, 100_000_000)?;

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

#[cfg(test)]
mod tests {
    use super::*;
    use crate::constants::*;

    fn make_clock(slot: u64) -> Clock {
        Clock {
            slot,
            epoch_start_timestamp: 0,
            epoch: 0,
            leader_schedule_epoch: 0,
            unix_timestamp: 0,
        }
    }

    #[test]
    fn test_distribute_same_day_noop() {
        // current_day == global_state.current_day → no distribution
        let spd = DEFAULT_SLOTS_PER_DAY;
        let mut gs = make_test_global_state(
            0, spd, 0,               // init_slot, spd, current_day
            1_000_000_000,           // total_shares
            10_000_000_000,          // total_tokens_staked
            DEFAULT_STARTING_SHARE_RATE,
            DEFAULT_ANNUAL_INFLATION_BP,
        );
        let initial_rate = gs.share_rate;
        // slot = day 0 exactly → current_day calculation = 0 = gs.current_day
        let clock = make_clock(0);
        distribute_pending_inflation(&mut gs, &clock).unwrap();
        assert_eq!(gs.share_rate, initial_rate, "no-op on same day");
        assert_eq!(gs.current_day, 0);
    }

    #[test]
    fn test_distribute_one_day_no_shares() {
        // Day advances but no shares → current_day updates, share_rate unchanged
        let spd = DEFAULT_SLOTS_PER_DAY;
        let mut gs = make_test_global_state(
            0, spd, 0, 0, 0,
            DEFAULT_STARTING_SHARE_RATE,
            DEFAULT_ANNUAL_INFLATION_BP,
        );
        let initial_rate = gs.share_rate;
        let clock = make_clock(spd); // exactly day 1
        distribute_pending_inflation(&mut gs, &clock).unwrap();
        assert_eq!(gs.current_day, 1);
        assert_eq!(gs.share_rate, initial_rate, "no shares → rate unchanged");
    }

    #[test]
    fn test_distribute_one_day_with_shares() {
        // Day advances with active shares → share_rate increases
        let spd = DEFAULT_SLOTS_PER_DAY;
        let staked = 10_000_000_000_000u64; // 100,000 HELIX (8 decimals)
        let shares = 1_000_000_000_000u64;  // 1e12 shares
        let rate = DEFAULT_STARTING_SHARE_RATE;
        let mut gs = make_test_global_state(0, spd, 0, shares, staked, rate, DEFAULT_ANNUAL_INFLATION_BP);
        let initial_rate = gs.share_rate;
        let clock = make_clock(spd); // day 1
        distribute_pending_inflation(&mut gs, &clock).unwrap();
        assert_eq!(gs.current_day, 1);
        assert!(gs.share_rate > initial_rate, "share_rate should increase after distribution");
    }

    #[test]
    fn test_distribute_multiple_days_catchup() {
        // 5 days skipped → all caught up in single call
        let spd = DEFAULT_SLOTS_PER_DAY;
        let staked = 10_000_000_000_000u64;
        let shares = 1_000_000_000_000u64;
        let rate = DEFAULT_STARTING_SHARE_RATE;
        let mut gs = make_test_global_state(0, spd, 0, shares, staked, rate, DEFAULT_ANNUAL_INFLATION_BP);

        // Single-day distribution reference
        let mut gs_1day = make_test_global_state(0, spd, 0, shares, staked, rate, DEFAULT_ANNUAL_INFLATION_BP);
        distribute_pending_inflation(&mut gs_1day, &make_clock(spd)).unwrap();
        let rate_after_1day = gs_1day.share_rate;

        // 5-day catchup
        let clock5 = make_clock(5 * spd);
        distribute_pending_inflation(&mut gs, &clock5).unwrap();
        assert_eq!(gs.current_day, 5);
        // share_rate increase for 5 days should be > 1 day
        assert!(gs.share_rate > rate_after_1day, "5-day catchup > 1-day");
    }

    #[test]
    fn test_distribute_idempotent_same_slot() {
        // Calling twice with the same clock is idempotent (second call is noop)
        let spd = DEFAULT_SLOTS_PER_DAY;
        let staked = 10_000_000_000_000u64;
        let shares = 1_000_000_000_000u64;
        let rate = DEFAULT_STARTING_SHARE_RATE;
        let mut gs = make_test_global_state(0, spd, 0, shares, staked, rate, DEFAULT_ANNUAL_INFLATION_BP);
        let clock = make_clock(spd);

        distribute_pending_inflation(&mut gs, &clock).unwrap();
        let rate_after_first = gs.share_rate;

        // Second call with same clock → noop
        distribute_pending_inflation(&mut gs, &clock).unwrap();
        assert_eq!(gs.share_rate, rate_after_first, "second call is idempotent");
    }

    #[test]
    fn test_global_state_bpd_window_flag() {
        let spd = DEFAULT_SLOTS_PER_DAY;
        let mut gs = make_test_global_state(0, spd, 0, 0, 0, DEFAULT_STARTING_SHARE_RATE, DEFAULT_ANNUAL_INFLATION_BP);

        // Initially not active
        assert!(!gs.is_bpd_window_active());

        gs.set_bpd_window_active(true);
        assert!(gs.is_bpd_window_active());

        gs.set_bpd_window_active(false);
        assert!(!gs.is_bpd_window_active());
    }

    #[test]
    fn test_global_state_pause_flag() {
        let spd = DEFAULT_SLOTS_PER_DAY;
        let mut gs = make_test_global_state(0, spd, 0, 0, 0, DEFAULT_STARTING_SHARE_RATE, DEFAULT_ANNUAL_INFLATION_BP);

        assert!(!gs.is_paused());
        gs.set_paused(true);
        assert!(gs.is_paused());
        gs.set_paused(false);
        assert!(!gs.is_paused());
    }
}
