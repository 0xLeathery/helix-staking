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
    pub days_elapsed: u64,  // Number of days covered in this distribution
    pub amount: u64,
    pub new_share_rate: u64,
    pub total_shares: u64,
}

/// Emitted when authority mints tokens via admin_mint instruction.
/// Frontend note: Monitor for transparency. Production should use multisig authority.
#[event]
pub struct AdminMinted {
    pub slot: u64,
    pub authority: Pubkey,
    pub recipient: Pubkey,  // Token account address
    pub amount: u64,
}

#[event]
pub struct ClaimPeriodStarted {
    pub slot: u64,
    pub timestamp: i64,
    pub claim_period_id: u32,
    pub merkle_root: [u8; 32],
    pub total_claimable: u64,
    pub total_eligible: u32,
    pub claim_deadline_slot: u64,
}

#[event]
pub struct TokensClaimed {
    pub slot: u64,
    pub timestamp: i64,
    pub claimer: Pubkey,
    pub snapshot_wallet: Pubkey,
    pub claim_period_id: u32,
    pub snapshot_balance: u64,
    pub base_amount: u64,
    pub bonus_bps: u16,           // 2000 = +20%, 1000 = +10%, 0 = base
    pub days_elapsed: u16,
    pub total_amount: u64,        // base + bonus
    pub immediate_amount: u64,    // 10% available now
    pub vesting_amount: u64,      // 90% vesting
    pub vesting_end_slot: u64,
}

#[event]
pub struct VestedTokensWithdrawn {
    pub slot: u64,
    pub timestamp: i64,
    pub claimer: Pubkey,
    pub amount: u64,
    pub total_vested: u64,
    pub total_withdrawn: u64,
    pub remaining: u64,
}

#[event]
pub struct ClaimPeriodEnded {
    pub slot: u64,
    pub timestamp: i64,
    pub claim_period_id: u32,
    pub total_claimed: u64,
    pub claims_count: u32,
    pub unclaimed_amount: u64,
}

#[event]
pub struct BigPayDayDistributed {
    pub slot: u64,
    pub timestamp: i64,
    pub claim_period_id: u32,
    pub total_unclaimed: u64,
    pub total_eligible_share_days: u64,
    pub helix_per_share_day: u64,
    pub eligible_stakers: u32,
}

#[event]
pub struct BpdAborted {
    pub claim_period_id: u32,
    pub stakes_finalized: u32,
    pub stakes_distributed: u32,
}

/// Phase 8.1: Emitted after each finalize_bpd_calculation batch for off-chain transparency
#[event]
pub struct BpdBatchFinalized {
    pub claim_period_id: u32,
    pub batch_stakes_processed: u32,
    pub total_stakes_finalized: u32,
    pub cumulative_share_days: u64,
    pub timestamp: i64,
}

#[event]
pub struct AuthorityTransferInitiated {
    pub old_authority: Pubkey,
    pub new_authority: Pubkey,
}

#[event]
pub struct AuthorityTransferCancelled {
    pub authority: Pubkey,
    pub cancelled_new_authority: Pubkey,
}

#[event]
pub struct AuthorityTransferCompleted {
    pub old_authority: Pubkey,
    pub new_authority: Pubkey,
}

#[event]
pub struct ReferralStaked {
    pub slot: u64,
    pub referrer: Pubkey,
    pub referee: Pubkey,
    pub stake_id: u64,
    pub referee_t_share_bonus: u64,
    pub referrer_token_bonus: u64,
}
