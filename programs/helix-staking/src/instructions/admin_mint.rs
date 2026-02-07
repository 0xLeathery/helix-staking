use anchor_lang::prelude::*;
use anchor_spl::token_interface::{Mint, TokenAccount, Token2022};
use anchor_spl::token_2022;

use crate::constants::*;
use crate::error::HelixError;
use crate::state::GlobalState;

#[derive(Accounts)]
pub struct AdminMint<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(
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
    let global_state = &ctx.accounts.global_state;

    // Create PDA signer seeds
    let mint_authority_seeds = &[
        MINT_AUTHORITY_SEED,
        &[global_state.mint_authority_bump],
    ];
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

    Ok(())
}
