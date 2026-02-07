use anchor_lang::prelude::*;

#[account]
pub struct StakeAccount {
    /// Stake owner
    pub user: Pubkey,
    /// Unique stake ID (from GlobalState counter)
    pub stake_id: u64,
    /// Tokens staked (base units, 8 decimals)
    pub staked_amount: u64,
    /// T-shares earned (includes LPB + BPB bonuses, scaled by PRECISION)
    pub t_shares: u64,
    /// Slot when stake was created
    pub start_slot: u64,
    /// Slot when stake matures (start + duration_days * slots_per_day)
    pub end_slot: u64,
    /// Committed duration in days (1-5555)
    pub stake_days: u16,
    /// Reward debt for lazy distribution (t_shares * share_rate at creation/last claim)
    pub reward_debt: u64,
    /// True if stake is active (false after unstake)
    pub is_active: bool,
    /// PDA bump seed
    pub bump: u8,
}

impl StakeAccount {
    pub const LEN: usize = 8    // discriminator
        + 32   // user (Pubkey)
        + 8    // stake_id
        + 8    // staked_amount
        + 8    // t_shares
        + 8    // start_slot
        + 8    // end_slot
        + 2    // stake_days
        + 8    // reward_debt
        + 1    // is_active
        + 1;   // bump
}
