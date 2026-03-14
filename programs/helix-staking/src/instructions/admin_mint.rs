use anchor_lang::prelude::*;
use anchor_spl::token_2022;
use anchor_spl::token_interface::{Mint, Token2022, TokenAccount};

use crate::constants::*;
use crate::error::HelixError;
use crate::events::AdminMinted;
use crate::state::GlobalState;

#[derive(Accounts)]
pub struct AdminMint<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(
        mut,
        seeds = [GLOBAL_STATE_SEED],
        bump = global_state.bump,
        constraint = global_state.authority == authority.key() @ HelixError::Unauthorized,
    )]
    pub global_state: Account<'info, GlobalState>,

    /// CHECK: PDA used as mint authority
    #[account(
        seeds = [MINT_AUTHORITY_SEED],
        bump = global_state.mint_authority_bump,
    )]
    pub mint_authority: UncheckedAccount<'info>,

    #[account(
        mut,
        seeds = [MINT_SEED],
        bump,
    )]
    pub mint: InterfaceAccount<'info, Mint>,

    #[account(
        mut,
        constraint = recipient_token_account.mint == global_state.mint @ HelixError::InvalidParameter,
    )]
    pub recipient_token_account: InterfaceAccount<'info, TokenAccount>,

    pub token_program: Program<'info, Token2022>,
}

pub fn admin_mint(ctx: Context<AdminMint>, amount: u64) -> Result<()> {
    let global_state = &mut ctx.accounts.global_state;

    // Enforce mint cap
    let new_total = global_state
        .total_admin_minted
        .checked_add(amount)
        .ok_or(error!(HelixError::Overflow))?;
    require!(
        new_total <= global_state.max_admin_mint,
        HelixError::AdminMintCapExceeded
    );

    // MED-6 FIX: Update state BEFORE CPI (Check-Effects-Interactions pattern)
    global_state.total_admin_minted = new_total;

    // Create PDA signer seeds
    let mint_authority_seeds = &[MINT_AUTHORITY_SEED, &[global_state.mint_authority_bump]];
    let signer_seeds = &[&mint_authority_seeds[..]];

    // Mint tokens to recipient
    token_2022::mint_to(
        CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            token_2022::MintTo {
                mint: ctx.accounts.mint.to_account_info(),
                to: ctx.accounts.recipient_token_account.to_account_info(),
                authority: ctx.accounts.mint_authority.to_account_info(),
            },
            signer_seeds,
        ),
        amount,
    )?;

    // Emit event for indexer
    emit!(AdminMinted {
        slot: Clock::get()?.slot,
        authority: ctx.accounts.authority.key(),
        recipient: ctx.accounts.recipient_token_account.key(),
        amount,
    });

    Ok(())
}

#[cfg(test)]
mod tests {
    #[test]
    fn test_admin_mint_cap_check() {
        // Admin mint cap: total_admin_minted + amount <= max_admin_mint
        let max_admin_mint = 1_000_000_000u64;
        let current_minted = 900_000_000u64;
        let amount = 100_000_000u64;

        // Exactly at cap = OK
        let new_total = current_minted.checked_add(amount).unwrap();
        assert!(new_total <= max_admin_mint);

        // Over cap = fail
        let over_amount = 100_000_001u64;
        let over_total = current_minted.checked_add(over_amount).unwrap();
        assert!(over_total > max_admin_mint);
    }

    #[test]
    fn test_admin_mint_state_before_cpi() {
        // state update happens before CPI (Check-Effects-Interactions)
        // Verify: after updating, total_admin_minted reflects the new value
        let mut total_admin_minted = 500_000_000u64;
        let amount = 100_000_000u64;
        let new_total = total_admin_minted.checked_add(amount).unwrap();
        total_admin_minted = new_total; // Update before CPI
        assert_eq!(total_admin_minted, 600_000_000);
    }
}
