#![allow(unexpected_cfgs)]
#![allow(deprecated)]

use anchor_lang::prelude::*;
use anchor_spl::token_interface::{Mint, Token2022};

pub mod constants;
pub mod error;
pub mod events;
pub mod instructions;
pub mod state;
pub mod security;

use constants::*;
use error::HelixError;
use events::*;
use state::GlobalState;
use instructions::*;

declare_id!("E9B7BsxdPS89M66CRGGbsCzQ9LkiGv6aNsra3cNBJha7");

#[program]
pub mod helix_staking {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, params: InitializeParams) -> Result<()> {
        let clock = Clock::get()?;
        let global_state = &mut ctx.accounts.global_state;

        // XRAY-3: Validate slots_per_day > 0 to prevent division-by-zero in downstream calculations
        require!(params.slots_per_day > 0, HelixError::InvalidParameter);

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
        global_state.total_admin_minted = 0;
        global_state.max_admin_mint = params.max_admin_mint;
        global_state.reserved = [0; 6];

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

    pub fn create_stake<'info>(
        ctx: Context<'_, '_, 'info, 'info, CreateStake<'info>>,
        amount: u64,
        days: u16,
    ) -> Result<()> {
        instructions::create_stake::create_stake(ctx, amount, days)
    }

    pub fn crank_distribution(ctx: Context<CrankDistribution>) -> Result<()> {
        instructions::crank_distribution::crank_distribution(ctx)
    }

    pub fn unstake(ctx: Context<Unstake>) -> Result<()> {
        instructions::unstake::unstake(ctx)
    }

    pub fn claim_rewards(ctx: Context<ClaimRewards>) -> Result<()> {
        instructions::claim_rewards::claim_rewards(ctx)
    }

    pub fn admin_mint(ctx: Context<AdminMint>, amount: u64) -> Result<()> {
        instructions::admin_mint::admin_mint(ctx, amount)
    }

    pub fn initialize_claim_period(
        ctx: Context<InitializeClaimPeriod>,
        merkle_root: [u8; 32],
        total_claimable: u64,
        total_eligible: u32,
        claim_period_id: u32,
    ) -> Result<()> {
        instructions::initialize_claim_period::initialize_claim_period(
            ctx,
            merkle_root,
            total_claimable,
            total_eligible,
            claim_period_id,
        )
    }

    pub fn withdraw_vested(ctx: Context<WithdrawVested>) -> Result<()> {
        instructions::withdraw_vested::withdraw_vested(ctx)
    }

    pub fn trigger_big_pay_day<'info>(
        ctx: Context<'_, '_, 'info, 'info, TriggerBigPayDay<'info>>,
    ) -> Result<()> {
        instructions::trigger_big_pay_day::trigger_big_pay_day(ctx)
    }

    pub fn finalize_bpd_calculation<'info>(
        ctx: Context<'_, '_, 'info, 'info, FinalizeBpdCalculation<'info>>,
    ) -> Result<()> {
        instructions::finalize_bpd_calculation::finalize_bpd_calculation(ctx)
    }

    pub fn free_claim(
        ctx: Context<FreeClaim>,
        snapshot_balance: u64,
        proof: Vec<[u8; 32]>,
    ) -> Result<()> {
        instructions::free_claim::free_claim(ctx, snapshot_balance, proof)
    }

    pub fn seal_bpd_finalize(ctx: Context<SealBpdFinalize>, expected_finalized_count: u32) -> Result<()> {
        instructions::seal_bpd_finalize::seal_bpd_finalize(ctx, expected_finalized_count)
    }

    pub fn migrate_stake(ctx: Context<MigrateStake>) -> Result<()> {
        instructions::migrate_stake::migrate_stake(ctx)
    }

    pub fn abort_bpd(ctx: Context<AbortBpd>) -> Result<()> {
        instructions::abort_bpd::abort_bpd(ctx)
    }

    pub fn admin_set_claim_end_slot(
        ctx: Context<AdminSetClaimEndSlot>,
        new_end_slot: u64,
    ) -> Result<()> {
        instructions::admin_set_claim_end_slot::admin_set_claim_end_slot(ctx, new_end_slot)
    }

    pub fn admin_set_slots_per_day(
        ctx: Context<AdminSetSlotsPerDay>,
        new_slots_per_day: u64,
    ) -> Result<()> {
        instructions::admin_set_slots_per_day::admin_set_slots_per_day(ctx, new_slots_per_day)
    }

    pub fn transfer_authority(ctx: Context<TransferAuthority>, new_authority: Pubkey) -> Result<()> {
        instructions::transfer_authority::transfer_authority(ctx, new_authority)
    }

    pub fn accept_authority(ctx: Context<AcceptAuthority>) -> Result<()> {
        instructions::accept_authority::accept_authority(ctx)
    }
}

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct InitializeParams {
    pub annual_inflation_bp: u64,
    pub min_stake_amount: u64,
    pub starting_share_rate: u64,
    pub slots_per_day: u64,
    pub claim_period_days: u8,
    pub max_admin_mint: u64,
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
    )]
    pub mint: InterfaceAccount<'info, Mint>,

    pub token_program: Program<'info, Token2022>,
    pub system_program: Program<'info, System>,
}
