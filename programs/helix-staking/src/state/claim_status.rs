use anchor_lang::prelude::*;

/// Per-user claim status tracking
/// Seeds: [b"claim_status", merkle_root[0..8], snapshot_wallet]
/// Note: Uses 8-byte merkle prefix to allow future claim periods while preventing collisions
#[account]
pub struct ClaimStatus {
    /// True if user has claimed
    pub is_claimed: bool,
    /// Amount claimed (base + bonus, before vesting split)
    pub claimed_amount: u64,
    /// Slot when claim was made
    pub claimed_slot: u64,
    /// Speed bonus applied (in bps: 0, 1000, or 2000)
    pub bonus_bps: u16,
    /// Cumulative amount withdrawn from vesting (security: prevents double-withdrawal)
    pub withdrawn_amount: u64,
    /// Slot when vesting completes (claimed_slot + 30 days)
    pub vesting_end_slot: u64,
    /// Original snapshot wallet (for verification)
    pub snapshot_wallet: Pubkey,
    /// PDA bump seed
    pub bump: u8,
}

impl ClaimStatus {
    pub const LEN: usize = 8    // discriminator
        + 1    // is_claimed
        + 8    // claimed_amount
        + 8    // claimed_slot
        + 2    // bonus_bps
        + 8    // withdrawn_amount
        + 8    // vesting_end_slot
        + 32   // snapshot_wallet
        + 1;   // bump
    // Total: 76 bytes (slightly more than anchor-expert estimate due to snapshot_wallet)
}
