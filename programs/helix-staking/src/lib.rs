use anchor_lang::prelude::*;
use anchor_spl::token_2022_extensions::{
    token_metadata_initialize, TokenMetadataInitialize,
};
use anchor_spl::token_interface::{Mint, Token2022};

pub mod constants;
pub mod error;
pub mod events;
pub mod state;

use constants::*;
use events::*;
use state::GlobalState;

declare_id!("E9B7BsxdPS89M66CRGGbsCzQ9LkiGv6aNsra3cNBJha7");

#[program]
pub mod helix_staking {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, params: InitializeParams) -> Result<()> {
        let clock = Clock::get()?;
        let global_state = &mut ctx.accounts.global_state;

        // Initialize GlobalState fields
        global_state.authority = ctx.accounts.authority.key();
        global_state.mint = ctx.accounts.mint.key();
        global_state.mint_authority_bump = ctx.bumps.mint_authority;
        global_state.bump = ctx.bumps.global_state;
        global_state.annual_inflation_bp = params.annual_inflation_bp;
        global_state.min_stake_amount = params.min_stake_amount;
        global_state.share_rate = params.starting_share_rate;
        global_state.starting_share_rate = params.starting_share_rate;
        global_state.slots_per_day = params.slots_per_day;
        global_state.claim_period_days = params.claim_period_days;
        global_state.init_slot = clock.slot;

        // Counters start at 0 (default)
        global_state.total_stakes_created = 0;
        global_state.total_unstakes_created = 0;
        global_state.total_claims_created = 0;
        global_state.total_tokens_staked = 0;
        global_state.total_tokens_unstaked = 0;
        global_state.total_shares = 0;
        global_state.current_day = 0;
        global_state.reserved = [0; 8];

        // Initialize metadata on the mint
        // Use CPI to token_metadata_initialize with PDA signer
        let mint_authority_seeds: &[&[u8]] = &[
            MINT_AUTHORITY_SEED,
            &[ctx.bumps.mint_authority],
        ];
        let signer_seeds = &[mint_authority_seeds];

        token_metadata_initialize(
            CpiContext::new_with_signer(
                ctx.accounts.token_program.to_account_info(),
                TokenMetadataInitialize {
                    program_id: ctx.accounts.token_program.to_account_info(),
                    mint: ctx.accounts.mint.to_account_info(),
                    metadata: ctx.accounts.mint.to_account_info(),
                    mint_authority: ctx.accounts.mint_authority.to_account_info(),
                    update_authority: ctx.accounts.mint_authority.to_account_info(),
                },
                signer_seeds,
            ),
            TOKEN_NAME.to_string(),
            TOKEN_SYMBOL.to_string(),
            TOKEN_URI.to_string(),
        )?;

        // Emit initialization event with slot (indexer-expert requirement)
        emit!(ProtocolInitialized {
            slot: clock.slot,
            global_state: global_state.key(),
            mint: global_state.mint,
            mint_authority: ctx.accounts.mint_authority.key(),
            authority: global_state.authority,
            annual_inflation_bp: global_state.annual_inflation_bp,
            min_stake_amount: global_state.min_stake_amount,
            starting_share_rate: global_state.starting_share_rate,
            slots_per_day: global_state.slots_per_day,
        });

        Ok(())
    }
}

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct InitializeParams {
    pub annual_inflation_bp: u64,
    pub min_stake_amount: u64,
    pub starting_share_rate: u64,
    pub slots_per_day: u64,
    pub claim_period_days: u8,
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(
        init,
        payer = authority,
        space = GlobalState::LEN,
        seeds = [GLOBAL_STATE_SEED],
        bump,
    )]
    pub global_state: Account<'info, GlobalState>,

    /// CHECK: PDA used as mint authority (separate from mint per anchor-expert requirement)
    #[account(
        seeds = [MINT_AUTHORITY_SEED],
        bump,
    )]
    pub mint_authority: UncheckedAccount<'info>,

    #[account(
        init,
        payer = authority,
        seeds = [MINT_SEED],
        bump,
        mint::decimals = TOKEN_DECIMALS,
        mint::authority = mint_authority,
        mint::token_program = token_program,
        extensions::metadata_pointer::authority = mint_authority,
        extensions::metadata_pointer::metadata_address = mint,
    )]
    pub mint: InterfaceAccount<'info, Mint>,

    pub token_program: Program<'info, Token2022>,
    pub system_program: Program<'info, System>,
}
