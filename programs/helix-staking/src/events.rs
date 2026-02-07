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

#[event]
pub struct StakeCreated {
    pub slot: u64,
    pub user: Pubkey,
    pub stake_id: u64,
    pub amount: u64,
    pub t_shares: u64,
    pub days: u16,
    pub share_rate: u64,
}

#[event]
pub struct StakeEnded {
    pub slot: u64,
    pub user: Pubkey,
    pub stake_id: u64,
    pub original_amount: u64,
    pub return_amount: u64,
    pub penalty_amount: u64,
    pub penalty_type: u8, // 0=None, 1=Early, 2=Late
    pub rewards_claimed: u64,
}

#[event]
pub struct RewardsClaimed {
    pub slot: u64,
    pub user: Pubkey,
    pub stake_id: u64,
    pub amount: u64,
}

#[event]
pub struct InflationDistributed {
    pub slot: u64,
    pub day: u64,
    pub amount: u64,
    pub new_share_rate: u64,
    pub total_shares: u64,
}
