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
