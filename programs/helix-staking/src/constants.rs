// Token constants
pub const TOKEN_DECIMALS: u8 = 8;
pub const TOKEN_NAME: &str = "HLX";
pub const TOKEN_SYMBOL: &str = "HLX";
pub const TOKEN_URI: &str = "";

// Protocol constants (from tokenomics-expert)
pub const DEFAULT_ANNUAL_INFLATION_BP: u64 = 3_690_000; // 3.69% in basis points
pub const DEFAULT_MIN_STAKE_AMOUNT: u64 = 10_000_000; // 0.1 HELIX (8 decimals)
pub const DEFAULT_STARTING_SHARE_RATE: u64 = 10_000; // 1:1 ratio at launch
pub const DEFAULT_SLOTS_PER_DAY: u64 = 216_000; // ~400ms per slot
pub const DEFAULT_CLAIM_PERIOD_DAYS: u8 = 180; // 6-month claim period

// PDA seeds
pub const GLOBAL_STATE_SEED: &[u8] = b"global_state";
pub const MINT_AUTHORITY_SEED: &[u8] = b"mint_authority";
pub const MINT_SEED: &[u8] = b"helix_mint";

// Staking constants
pub const STAKE_SEED: &[u8] = b"stake";
pub const PRECISION: u64 = 1_000_000_000; // 1e9 fixed-point scaling

// Bonus curve parameters (from HEX deep dive)
pub const MAX_STAKE_DAYS: u64 = 5555; // Maximum stake duration
pub const LPB_MAX_DAYS: u64 = 3641; // 10 years for full 2x LPB bonus
pub const BPB_THRESHOLD: u64 = 15_000_000_000_000_000; // 150M tokens (8 decimals)

// Penalty parameters
pub const MIN_PENALTY_BPS: u64 = 5000; // 50% minimum early unstake penalty
pub const BPS_SCALER: u64 = 10_000;
pub const GRACE_PERIOD_DAYS: u64 = 14;
/// Late penalty window in days (365 - 14 grace = 351 days to reach 100%)
pub const LATE_PENALTY_WINDOW_DAYS: u64 = 351;

// Claim period constants
pub const CLAIM_CONFIG_SEED: &[u8] = b"claim_config";
pub const CLAIM_STATUS_SEED: &[u8] = b"claim_status";

// Vesting parameters (from CONTEXT.md)
pub const VESTING_DAYS: u64 = 30; // 30-day graduated release
pub const IMMEDIATE_RELEASE_BPS: u64 = 1000; // 10% available immediately
pub const VESTED_RELEASE_BPS: u64 = 9000; // 90% vests over 30 days
pub const CLAIM_PERIOD_DAYS: u64 = 180; // 6-month claim window

// Speed bonus tiers (from CONTEXT.md)
pub const SPEED_BONUS_WEEK1_BPS: u64 = 2000; // +20% for days 1-7
pub const SPEED_BONUS_WEEK2_4_BPS: u64 = 1000; // +10% for days 8-28
pub const SPEED_BONUS_WEEK1_END: u64 = 7; // Day 7 is last day of week 1
pub const SPEED_BONUS_WEEK4_END: u64 = 28; // Day 28 is last day of bonus period

// Claim ratio
pub const HELIX_PER_SOL: u64 = 10_000; // 10,000 HELIX per SOL in snapshot
pub const MIN_SOL_BALANCE: u64 = 100_000_000; // 0.1 SOL minimum (9 decimals)

// Authority transfer
pub const PENDING_AUTHORITY_SEED: &[u8] = b"pending_authority";

// Merkle tree
pub const MAX_MERKLE_PROOF_LEN: usize = 20; // Supports 1M+ claimants
pub const MERKLE_ROOT_PREFIX_LEN: usize = 8; // First 8 bytes of root for PDA seed

// === Phase 8.1: Duration Loyalty Multiplier ===
/// Maximum loyalty bonus for stakes that have served their full committed term.
/// 500_000_000 = 0.5x = 50% bonus in PRECISION units.
/// A stake at 50% of its term gets 25% bonus; at 100% gets 50% bonus.
pub const LOYALTY_MAX_BONUS: u64 = 500_000_000;

// === Phase 8.1: Anti-Whale BPD Share Cap ===
/// Maximum percentage of the BPD pool any single stake can receive.
/// 5 = 5%. Excess remains in pool for redistribution to other stakes.
pub const BPD_MAX_SHARE_PCT: u64 = 5;

// === Phase 8.1: Anti-Whale BPB Diminishing Returns ===
/// Tier 2 threshold: above effective BPB cap (1.5B tokens), bonus slope decreases
/// Linear 1.0x → 1.25x from effective_threshold → BPB_TIER_2
pub const BPB_TIER_2: u64 = 500_000_000_000_000_000; // 5B tokens with 8 decimals
/// Tier 3 threshold: above 5B tokens, bonus slope decreases further
/// Linear 1.25x → 1.4x from BPB_TIER_2 → BPB_TIER_3
pub const BPB_TIER_3: u64 = 1_000_000_000_000_000_000; // 10B tokens with 8 decimals
/// Maximum BPB bonus regardless of stake size (1.5x in PRECISION units)
pub const BPB_MAX_BONUS: u64 = 1_500_000_000;

// === Phase 8.1: BPD Transparency ===
/// Minimum seconds between first finalize batch and seal.
/// 86400 = 24 hours observation window for community verification.
pub const BPD_SEAL_DELAY_SECONDS: i64 = 86400;
