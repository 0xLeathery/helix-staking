use anchor_lang::prelude::*;

use crate::constants::*;
use crate::error::HelixError;
use crate::events::{ClaimPeriodEnded, BigPayDayDistributed};
use crate::state::{ClaimConfig, GlobalState, StakeAccount};

/// Maximum stakes to process per trigger_big_pay_day call
/// This prevents compute limit issues with large stake counts
pub const MAX_STAKES_PER_BPD: usize = 20;

#[derive(Accounts)]
pub struct TriggerBigPayDay<'info> {
    /// Anyone can trigger BPD (permissionless)
    pub caller: Signer<'info>,

    #[account(
        seeds = [GLOBAL_STATE_SEED],
        bump = global_state.bump,
    )]
    pub global_state: Account<'info, GlobalState>,

    #[account(
        mut,
        seeds = [CLAIM_CONFIG_SEED],
        bump = claim_config.bump,
        constraint = claim_config.claim_period_started @ HelixError::ClaimPeriodNotStarted,
        constraint = !claim_config.big_pay_day_complete @ HelixError::BigPayDayAlreadyTriggered,
    )]
    pub claim_config: Account<'info, ClaimConfig>,

    // Remaining accounts: StakeAccounts to distribute BPD bonus to
    // Each must be verified as eligible (created during claim period, active)
}

pub fn trigger_big_pay_day<'info>(
    ctx: Context<'_, '_, 'info, 'info, TriggerBigPayDay<'info>>,
) -> Result<()> {
    let clock = Clock::get()?;
    let claim_config = &mut ctx.accounts.claim_config;
    let global_state = &ctx.accounts.global_state;

    // === Verify claim period has ended ===
    require!(
        clock.slot > claim_config.end_slot,
        HelixError::BigPayDayNotAvailable
    );

    // === Calculate unclaimed amount ===
    let unclaimed_amount = claim_config.total_claimable
        .checked_sub(claim_config.total_claimed)
        .ok_or(HelixError::Underflow)?;

    // If nothing to distribute, just mark complete
    if unclaimed_amount == 0 {
        claim_config.big_pay_day_complete = true;
        emit!(ClaimPeriodEnded {
            slot: clock.slot,
            timestamp: clock.unix_timestamp,
            claim_period_id: claim_config.claim_period_id,
            total_claimed: claim_config.total_claimed,
            claims_count: claim_config.claim_count,
            unclaimed_amount: 0,
        });
        return Ok(());
    }

    // === Calculate total eligible T-share-days ===
    // T-share-days = sum(stake.t_shares * days_staked_during_claim_period)
    // Only stakes created DURING claim period are eligible

    let mut total_eligible_share_days: u128 = 0;
    let mut eligible_stakes: Vec<(usize, u128)> = Vec::new(); // (index, share_days)

    for (i, account_info) in ctx.remaining_accounts.iter().enumerate() {
        if i >= MAX_STAKES_PER_BPD {
            break;
        }

        // === SECURITY: Validate account ownership ===
        if account_info.owner != &crate::id() {
            continue;
        }

        // Skip if account data is too small
        let data = account_info.try_borrow_data()?;
        if data.len() < StakeAccount::LEN {
            continue;
        }

        // Use proper Anchor deserialization (NOT hardcoded byte offsets)
        let stake = match StakeAccount::try_deserialize(&mut &data[..]) {
            Ok(s) => s,
            Err(_) => continue, // Skip invalid accounts
        };
        drop(data); // Release borrow before potential mutation

        // === SECURITY: Validate PDA derivation ===
        let expected_pda = Pubkey::create_program_address(
            &[
                STAKE_SEED,
                stake.user.as_ref(),
                &stake.stake_id.to_le_bytes(),
                &[stake.bump],
            ],
            &crate::id(),
        );
        if expected_pda.is_err() || account_info.key() != expected_pda.unwrap() {
            continue;
        }

        // Check eligibility:
        // 1. Must be active
        // 2. Must have been created DURING the claim period
        // 3. Must have staked for at least 1 day during claim period
        if !stake.is_active {
            continue;
        }

        if stake.start_slot < claim_config.start_slot {
            continue; // Created before claim period
        }

        if stake.start_slot > claim_config.end_slot {
            continue; // Created after claim period ended
        }

        // Calculate days staked during claim period
        let stake_end = std::cmp::min(clock.slot, stake.end_slot);
        let days_staked = stake_end
            .saturating_sub(stake.start_slot)
            .checked_div(global_state.slots_per_day)
            .unwrap_or(0);

        if days_staked == 0 {
            continue; // Must have at least 1 day
        }

        // Calculate share-days for this stake
        let share_days = (stake.t_shares as u128)
            .checked_mul(days_staked as u128)
            .ok_or(HelixError::Overflow)?;

        total_eligible_share_days = total_eligible_share_days
            .checked_add(share_days)
            .ok_or(HelixError::Overflow)?;

        eligible_stakes.push((i, share_days));
    }

    // If no eligible stakers, keep tokens in pool for future distribution
    // per CONTEXT.md: "If no stakers: keep pool pending until stakers appear"
    if total_eligible_share_days == 0 {
        // Don't mark complete - allow future trigger when stakers exist
        emit!(ClaimPeriodEnded {
            slot: clock.slot,
            timestamp: clock.unix_timestamp,
            claim_period_id: claim_config.claim_period_id,
            total_claimed: claim_config.total_claimed,
            claims_count: claim_config.claim_count,
            unclaimed_amount,
        });
        return Ok(());
    }

    // === Calculate helix per share-day ===
    // Use u128 to prevent overflow
    let helix_per_share_day = (unclaimed_amount as u128)
        .checked_mul(PRECISION as u128)
        .ok_or(HelixError::Overflow)?
        .checked_div(total_eligible_share_days)
        .ok_or(HelixError::DivisionByZero)?;

    // === Distribute BPD bonus to each eligible stake ===
    let mut total_distributed: u64 = 0;

    for (idx, share_days) in eligible_stakes.iter() {
        let account_info = &ctx.remaining_accounts[*idx];

        // Calculate this stake's BPD bonus
        // *share_days is already u128, no cast needed
        let bonus = ((*share_days)
            .checked_mul(helix_per_share_day)
            .ok_or(HelixError::Overflow)?
            .checked_div(PRECISION as u128)
            .ok_or(HelixError::DivisionByZero)?) as u64;

        if bonus == 0 {
            continue;
        }

        // Properly deserialize StakeAccount to update bpd_bonus_pending
        let mut stake: StakeAccount = StakeAccount::try_deserialize(
            &mut &account_info.try_borrow_data()?[..]
        )?;
        stake.bpd_bonus_pending = stake.bpd_bonus_pending
            .checked_add(bonus)
            .ok_or(HelixError::Overflow)?;
        stake.try_serialize(&mut &mut account_info.try_borrow_mut_data()?[..])?;

        total_distributed = total_distributed
            .checked_add(bonus)
            .ok_or(HelixError::Overflow)?;
    }

    // === Update ClaimConfig ===
    claim_config.big_pay_day_complete = true;
    claim_config.bpd_total_distributed = total_distributed;

    // === Emit events ===
    emit!(ClaimPeriodEnded {
        slot: clock.slot,
        timestamp: clock.unix_timestamp,
        claim_period_id: claim_config.claim_period_id,
        total_claimed: claim_config.total_claimed,
        claims_count: claim_config.claim_count,
        unclaimed_amount,
    });

    emit!(BigPayDayDistributed {
        slot: clock.slot,
        timestamp: clock.unix_timestamp,
        claim_period_id: claim_config.claim_period_id,
        total_unclaimed: unclaimed_amount,
        total_eligible_share_days: total_eligible_share_days.min(u64::MAX as u128) as u64,
        helix_per_share_day: helix_per_share_day.min(u64::MAX as u128) as u64,
        eligible_stakers: eligible_stakes.len() as u32,
    });

    Ok(())
}
