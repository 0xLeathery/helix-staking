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

    // OPS-03: Reject user operations while program is paused
    require!(!global_state.is_paused(), HelixError::ProgramPaused);

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
    let new_withdrawn = claim_status.withdrawn_amount
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

#[cfg(test)]
mod tests {
    use super::*;
    use crate::constants::*;

    #[test]
    fn test_vested_amount_at_claim_time() {
        // At exactly claim slot: only immediate (10%) is vested
        let claimed = 1_000_000_000u64; // 10 tokens
        let claimed_slot = 1000u64;
        let vesting_end = claimed_slot + VESTING_DAYS * DEFAULT_SLOTS_PER_DAY;

        let vested = calculate_vested_amount(claimed, claimed_slot, vesting_end, claimed_slot).unwrap();
        // immediate = 10% = 100_000_000
        assert_eq!(vested, claimed / 10);
    }

    #[test]
    fn test_vested_amount_after_vesting_end() {
        // Past vesting end: entire claimed amount is available
        let claimed = 1_000_000_000u64;
        let claimed_slot = 0u64;
        let vesting_end = 1_000u64;
        let current_after = vesting_end + 1000;

        let vested = calculate_vested_amount(claimed, claimed_slot, vesting_end, current_after).unwrap();
        assert_eq!(vested, claimed);
    }

    #[test]
    fn test_vested_amount_at_vesting_end() {
        // Exactly at vesting_end_slot: full amount vested
        let claimed = 1_000_000_000u64;
        let claimed_slot = 0u64;
        let vesting_end = DEFAULT_SLOTS_PER_DAY * VESTING_DAYS;

        let vested = calculate_vested_amount(claimed, claimed_slot, vesting_end, vesting_end).unwrap();
        assert_eq!(vested, claimed);
    }

    #[test]
    fn test_vested_amount_halfway() {
        // Halfway through vesting: 10% immediate + 45% of 90% = 10% + 45% = 55% total
        // Actually: immediate (10%) + (90% * 0.5) = 10% + 45% = 55%
        let claimed = 1_000_000_000u64;
        let claimed_slot = 0u64;
        let vesting_end = 1_000_000u64;
        let half = claimed_slot + (vesting_end - claimed_slot) / 2;

        let vested = calculate_vested_amount(claimed, claimed_slot, vesting_end, half).unwrap();
        // immediate = 100_000_000 (10%)
        // vesting_portion = 900_000_000 (90%)
        // unlocked = 900_000_000 * half / vesting_end = 450_000_000
        // total = 100_000_000 + 450_000_000 = 550_000_000
        assert_eq!(vested, 550_000_000);
    }

    #[test]
    fn test_vested_amount_before_claim() {
        // current_slot <= claimed_slot: only immediate
        let claimed = 1_000_000_000u64;
        let claimed_slot = 1000u64;
        let vesting_end = 2000u64;

        // current = claimed_slot exactly (edge of <= condition)
        let vested = calculate_vested_amount(claimed, claimed_slot, vesting_end, claimed_slot).unwrap();
        assert_eq!(vested, claimed / 10); // immediate only

        // current < claimed_slot (shouldn't happen but handled)
        // This triggers the `current_slot <= claimed_slot` branch
        // Note: In practice this can't happen without underflow elsewhere, but the function handles it
    }

    #[test]
    fn test_vested_amount_large_claim() {
        // Large claim to exercise mul_div overflow protection
        let claimed = u64::MAX / 100; // Large but not overflowing
        let claimed_slot = 0u64;
        let vesting_end = 1_000_000u64;
        let half = 500_000u64;

        // Should not panic or overflow
        let result = calculate_vested_amount(claimed, claimed_slot, vesting_end, half);
        assert!(result.is_ok());
        let vested = result.unwrap();
        assert!(vested > claimed / 10); // More than immediate
        assert!(vested < claimed);       // Less than full amount
    }

    #[test]
    fn test_vested_amount_one_quarter() {
        // 25% through vesting period
        let claimed = 10_000_000_000u64; // 100 tokens
        let claimed_slot = 0u64;
        let vesting_end = 1_000_000u64;
        let quarter = 250_000u64; // 25% of vesting period

        let vested = calculate_vested_amount(claimed, claimed_slot, vesting_end, quarter).unwrap();
        // immediate = 10% = 1_000_000_000
        // vesting_portion = 9_000_000_000
        // unlocked = 9_000_000_000 * 250_000 / 1_000_000 = 2_250_000_000
        // total = 1_000_000_000 + 2_250_000_000 = 3_250_000_000
        assert_eq!(vested, 3_250_000_000);
    }
}
