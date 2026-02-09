use anchor_lang::prelude::*;

use crate::constants::*;
use crate::error::HelixError;
use crate::state::{ClaimConfig, GlobalState, StakeAccount};

/// Maximum stakes to process per finalize_bpd_calculation call
/// This prevents compute limit issues with large stake counts
pub const MAX_STAKES_PER_FINALIZE: usize = 20;

#[derive(Accounts)]
pub struct FinalizeBpdCalculation<'info> {
    /// M-1 FIX: Only authority can initiate BPD finalization (prevents griefing)
    #[account(
        constraint = caller.key() == global_state.authority @ HelixError::Unauthorized
    )]
    pub caller: Signer<'info>,

    #[account(
        mut,
        seeds = [GLOBAL_STATE_SEED],
        bump = global_state.bump,
    )]
    pub global_state: Account<'info, GlobalState>,

    #[account(
        mut,
        seeds = [CLAIM_CONFIG_SEED],
        bump = claim_config.bump,
        constraint = claim_config.claim_period_started @ HelixError::ClaimPeriodNotStarted,
        constraint = !claim_config.bpd_calculation_complete @ HelixError::BpdCalculationAlreadyComplete,
        constraint = !claim_config.big_pay_day_complete @ HelixError::BigPayDayAlreadyTriggered,
    )]
    pub claim_config: Account<'info, ClaimConfig>,

    // Remaining accounts: StakeAccounts to scan (read-only)
}

pub fn finalize_bpd_calculation<'info>(
    ctx: Context<'_, '_, 'info, 'info, FinalizeBpdCalculation<'info>>,
) -> Result<()> {
    let clock = Clock::get()?;
    let claim_config = &mut ctx.accounts.claim_config;
    let global_state = &mut ctx.accounts.global_state;

    // === Verify claim period has ended ===
    require!(
        clock.slot > claim_config.end_slot,
        HelixError::BigPayDayNotAvailable
    );

    // === Determine if this is first batch ===
    let is_first_batch = claim_config.bpd_remaining_unclaimed == 0
        && claim_config.bpd_total_share_days == 0
        && claim_config.bpd_snapshot_slot == 0;

    // === Calculate unclaimed amount on first batch ===
    let unclaimed_amount = if is_first_batch {
        let amount = claim_config.total_claimable
            .checked_sub(claim_config.total_claimed)
            .ok_or(HelixError::Underflow)?;

        // Store for pagination
        claim_config.bpd_remaining_unclaimed = amount;

        // Capture snapshot slot for consistent days_staked calculation across all batches
        claim_config.bpd_snapshot_slot = clock.slot;

        // HIGH-2: Set BPD window active (blocks unstake during distribution)
        global_state.set_bpd_window_active(true);

        amount
    } else {
        claim_config.bpd_remaining_unclaimed
    };

    // === If nothing to distribute, mark complete and exit ===
    if unclaimed_amount == 0 {
        claim_config.bpd_calculation_complete = true;
        claim_config.bpd_helix_per_share_day = 0;
        global_state.set_bpd_window_active(false); // H-2 FIX: Clear window when nothing to distribute
        return Ok(());
    }

    // === Store snapshot slot for consistent days_staked calculation ===
    let snapshot_slot = claim_config.bpd_snapshot_slot;

    // === Accumulate share-days from this batch ===
    let mut batch_share_days: u128 = 0;

    for (i, account_info) in ctx.remaining_accounts.iter().enumerate() {
        if i >= MAX_STAKES_PER_FINALIZE {
            break;
        }

        // === SECURITY: Validate account ownership ===
        if account_info.owner != &crate::id() {
            continue;
        }

        // Skip un-migrated stakes (< 117 bytes)
        let data = account_info.try_borrow_data()?;
        if data.len() < StakeAccount::LEN {
            continue;
        }

        // Use proper Anchor deserialization
        let mut stake = match StakeAccount::try_deserialize(&mut &data[..]) {
            Ok(s) => s,
            Err(_) => continue,
        };
        drop(data);

        // CRIT-NEW-1: Skip stakes already counted this period (duplicate prevention).
        // Note: After abort_bpd, these flags remain set, so re-finalization for the same
        // claim_period_id will skip all previously-finalized stakes. This is by design —
        // abort_bpd is a permanent cancel, not a restart. See abort_bpd doc comment.
        if stake.bpd_finalize_period_id == claim_config.claim_period_id {
            continue;
        }

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

        // === Check eligibility (same as trigger_big_pay_day) ===
        if !stake.is_active {
            continue;
        }

        if stake.start_slot < claim_config.start_slot {
            continue;
        }

        if stake.start_slot > claim_config.end_slot {
            continue;
        }

        // Calculate days staked during claim period using snapshot slot
        let stake_end = std::cmp::min(snapshot_slot, stake.end_slot);
        let days_staked = stake_end
            .saturating_sub(stake.start_slot)
            .checked_div(global_state.slots_per_day)
            .unwrap_or(0);

        if days_staked == 0 {
            continue;
        }

        // Calculate share-days for this stake
        let share_days = (stake.t_shares as u128)
            .checked_mul(days_staked as u128)
            .ok_or(HelixError::Overflow)?;

        batch_share_days = batch_share_days
            .checked_add(share_days)
            .ok_or(HelixError::Overflow)?;

        // CRIT-NEW-1: Mark stake as finalized for this period
        stake.bpd_finalize_period_id = claim_config.claim_period_id;

        // Write updated stake back to account
        stake.try_serialize(&mut &mut account_info.try_borrow_mut_data()?[..])?;

        // Increment finalized counter
        claim_config.bpd_stakes_finalized = claim_config.bpd_stakes_finalized
            .checked_add(1)
            .ok_or(HelixError::Overflow)?;
    }

    // === Accumulate to global total ===
    claim_config.bpd_total_share_days = claim_config.bpd_total_share_days
        .checked_add(batch_share_days)
        .ok_or(HelixError::Overflow)?;

    // Note: Rate calculation and completion is now done by seal_bpd_finalize (authority-gated)
    // This prevents first-batch-drains-pool attack (CRIT-NEW-1)

    Ok(())
}
