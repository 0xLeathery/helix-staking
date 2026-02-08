use anchor_lang::prelude::*;

/// Global claim period configuration (singleton PDA)
/// Seeds: [b"claim_config"]
#[account]
pub struct ClaimConfig {
    /// Authority that can initialize claim period
    pub authority: Pubkey,
    /// Merkle root of the snapshot
    pub merkle_root: [u8; 32],
    /// Total tokens available for claiming
    pub total_claimable: u64,
    /// Total tokens claimed so far
    pub total_claimed: u64,
    /// Number of successful claims
    pub claim_count: u32,
    /// Slot when claim period started
    pub start_slot: u64,
    /// Slot when claim period ends (start + 180 days)
    pub end_slot: u64,
    /// Claim period identifier (for future multi-period support)
    pub claim_period_id: u32,
    /// True once claim period has started (merkle root immutable after this)
    pub claim_period_started: bool,
    /// True once Big Pay Day has been triggered and fully distributed
    pub big_pay_day_complete: bool,
    /// Total tokens distributed via BPD
    pub bpd_total_distributed: u64,
    /// Total number of eligible addresses in snapshot
    pub total_eligible: u32,
    /// PDA bump seed
    pub bump: u8,

    // === BPD Pagination Fields (Phase 3.1) ===
    /// Remaining unclaimed amount for BPD distribution (tracks across batches)
    /// Set on first trigger_big_pay_day call, decremented with each batch
    pub bpd_remaining_unclaimed: u64,
    /// Total share-days accumulated across all BPD batches (for consistent rate calculation)
    /// Stored as u128 to prevent overflow with large stake counts
    pub bpd_total_share_days: u128,
    /// Pre-calculated BPD rate (Phase 3.2)
    pub bpd_helix_per_share_day: u128,
    /// True once finalize_bpd_calculation has processed all stakes
    pub bpd_calculation_complete: bool,
}

impl ClaimConfig {
    pub const LEN: usize = 8    // discriminator
        + 32   // authority
        + 32   // merkle_root
        + 8    // total_claimable
        + 8    // total_claimed
        + 4    // claim_count
        + 8    // start_slot
        + 8    // end_slot
        + 4    // claim_period_id
        + 1    // claim_period_started
        + 1    // big_pay_day_complete
        + 8    // bpd_total_distributed
        + 4    // total_eligible
        + 1    // bump
        + 8    // bpd_remaining_unclaimed (Phase 3.1)
        + 16   // bpd_total_share_days (Phase 3.1)
        + 16   // bpd_helix_per_share_day (Phase 3.2)
        + 1;   // bpd_calculation_complete (Phase 3.2)
    // Total: 168 bytes
}
