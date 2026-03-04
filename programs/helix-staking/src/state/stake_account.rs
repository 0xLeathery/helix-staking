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
    /// DEPRECATED: Set by create_stake but never checked by finalize/trigger. Kept for layout compatibility.
    pub bpd_eligible: bool,
    /// DEPRECATED: Set by create_stake but never read. BPD uses slot range checks. Kept for layout compatibility.
    pub claim_period_start_slot: u64,
    /// Last claim period that received BPD (0 = never, periods start at 1)
    pub bpd_claim_period_id: u32,
    /// Last claim period where stake was counted in BPD finalize (0 = never)
    pub bpd_finalize_period_id: u32,

    // === Phase 24: Boost System ===
    /// Seed token balance snapshotted at stake creation (0 = not boosted)
    pub seed_balance_at_stake: u64,
    /// True if boost was permanently revoked (repurchasing seed does NOT restore)
    pub boost_revoked: bool,
    /// Mirrors BoostRecord.boosted_stake_id for this stake (u64::MAX = not boosted)
    pub boosted_stake_id: u64,
}

impl StakeAccount {
    /// Old account size (for migration detection)
    pub const OLD_LEN: usize = 92;
    /// Phase 3 account size (before Phase 3.3)
    pub const PHASE3_LEN: usize = 113;
    /// Phase 3.3 account size (before Phase 24 boost fields)
    pub const PHASE3_3_LEN: usize = 117;

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
        + 8    // claim_period_start_slot (NEW)
        + 4    // bpd_claim_period_id (NEW)
        + 4    // bpd_finalize_period_id (Phase 3.3)
        + 8    // seed_balance_at_stake (Phase 24)
        + 1    // boost_revoked (Phase 24)
        + 8;   // boosted_stake_id (Phase 24)
    // Total: 134 bytes
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_stake_account_len() {
        assert_eq!(StakeAccount::LEN, 134);
    }

    #[test]
    fn test_stake_account_phase3_3_len() {
        assert_eq!(StakeAccount::PHASE3_3_LEN, 117);
    }
}
