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
    /// Big Pay Day bonus pending (set by trigger_big_pay_day, claimed via claim_rewards)
    pub bpd_bonus_pending: u64,
    /// True if stake was created during a claim period (eligible for BPD)
    pub bpd_eligible: bool,
    /// Slot when claim period started (for T-share-days calculation)
    /// Set when stake is created during an active claim period, 0 otherwise
    pub claim_period_start_slot: u64,
}

impl StakeAccount {
    /// Old account size (for migration detection)
    pub const OLD_LEN: usize = 92;

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
        + 1    // bump
        + 8    // bpd_bonus_pending (NEW)
        + 1    // bpd_eligible (NEW)
        + 8;   // claim_period_start_slot (NEW)
    // Total: 109 bytes
}
