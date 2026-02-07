use anchor_lang::prelude::*;

#[event]
pub struct ProtocolInitialized {
    pub slot: u64,                    // REQUIRED: reorg correlation (indexer-expert)
    pub global_state: Pubkey,
    pub mint: Pubkey,
    pub mint_authority: Pubkey,
    pub authority: Pubkey,
    pub annual_inflation_bp: u64,
    pub min_stake_amount: u64,
    pub starting_share_rate: u64,
    pub slots_per_day: u64,
}
