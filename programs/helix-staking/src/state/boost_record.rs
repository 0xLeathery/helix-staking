use anchor_lang::prelude::*;

/// Per-wallet boost registration record.
///
/// Seeds: ["boost_record", user]
///
/// One BoostRecord per wallet — enforced by PDA uniqueness.
/// boosted_stake_id == u64::MAX means registered but not yet linked to a stake.
#[account]
pub struct BoostRecord {
    /// Wallet that registered the boost
    pub user: Pubkey,
    /// Slot when boost was registered
    pub slot: u64,
    /// PDA bump seed (canonical)
    pub bump: u8,
    /// Stake ID this boost is linked to (u64::MAX = not yet linked)
    pub boosted_stake_id: u64,
}

impl BoostRecord {
    /// Account byte size: 8 (discriminator) + 32 (user) + 8 (slot) + 1 (bump) + 8 (boosted_stake_id)
    pub const LEN: usize = 8 + 32 + 8 + 1 + 8; // = 57
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_boost_record_len() {
        assert_eq!(BoostRecord::LEN, 57);
    }
}
