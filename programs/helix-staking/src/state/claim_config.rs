use anchor_lang::prelude::*;

/// Global claim period configuration (singleton PDA)
/// Seeds: [b"claim_config"]
#[account]
pub struct ClaimConfig {
    /// DEPRECATED: Authority checked via GlobalState constraint. Kept for layout compatibility.
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
    /// Slot pinned on first finalize batch for consistent days_staked calculation (Phase 3.3)
    pub bpd_snapshot_slot: u64,
    /// Count of unique stakes processed during finalize_bpd_calculation (Phase 3.3)
    pub bpd_stakes_finalized: u32,
    /// Count of unique stakes distributed to during trigger_big_pay_day (Phase 3.3)
    pub bpd_stakes_distributed: u32,

    // === Phase 8.1 Fields ===
    /// Unix timestamp of the first finalize_bpd_calculation batch.
    /// Used to enforce seal delay (must wait BPD_SEAL_DELAY_SECONDS after this).
    /// Set on first batch, reset by abort_bpd.
    pub bpd_finalize_start_timestamp: i64,
    /// Original unclaimed amount captured at seal time, used for consistent
    /// per-stake whale cap calculation across all trigger_big_pay_day batches.
    pub bpd_original_unclaimed: u64,
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
        + 1    // bpd_calculation_complete (Phase 3.2)
        + 8    // bpd_snapshot_slot (Phase 3.3)
        + 4    // bpd_stakes_finalized (Phase 3.3)
        + 4    // bpd_stakes_distributed (Phase 3.3)
        + 8    // bpd_finalize_start_timestamp (Phase 8.1)
        + 8; // bpd_original_unclaimed (Phase 8.1)
             // Total: 200 bytes
}
