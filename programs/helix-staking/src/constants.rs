// Token constants
pub const TOKEN_DECIMALS: u8 = 8;
pub const TOKEN_NAME: &str = "HLX";
pub const TOKEN_SYMBOL: &str = "HLX";
pub const TOKEN_URI: &str = "";

// Protocol constants (from tokenomics-expert)
pub const DEFAULT_ANNUAL_INFLATION_BP: u64 = 3_690_000; // 3.69% in basis points
pub const DEFAULT_MIN_STAKE_AMOUNT: u64 = 10_000_000;   // 0.1 HELIX (8 decimals)
pub const DEFAULT_STARTING_SHARE_RATE: u64 = 10_000;    // 1:1 ratio at launch
pub const DEFAULT_SLOTS_PER_DAY: u64 = 216_000;         // ~400ms per slot
pub const DEFAULT_CLAIM_PERIOD_DAYS: u8 = 180;          // 6-month claim period

// PDA seeds
pub const GLOBAL_STATE_SEED: &[u8] = b"global_state";
pub const MINT_AUTHORITY_SEED: &[u8] = b"mint_authority";
pub const MINT_SEED: &[u8] = b"helix_mint";

// Staking constants
pub const STAKE_SEED: &[u8] = b"stake";
pub const PRECISION: u64 = 1_000_000_000; // 1e9 fixed-point scaling

// Bonus curve parameters (from HEX deep dive)
pub const MAX_STAKE_DAYS: u64 = 5555;     // Maximum stake duration
pub const LPB_MAX_DAYS: u64 = 3641;       // 10 years for full 2x LPB bonus
pub const BPB_THRESHOLD: u64 = 150_000_000_00_000_000; // 150M tokens (8 decimals)

// Penalty parameters
pub const MIN_PENALTY_BPS: u64 = 5000;     // 50% minimum early unstake penalty
pub const BPS_SCALER: u64 = 10_000;
pub const GRACE_PERIOD_DAYS: u64 = 14;
/// Late penalty window in days (365 - 14 grace = 351 days to reach 100%)
pub const LATE_PENALTY_WINDOW_DAYS: u64 = 351;
