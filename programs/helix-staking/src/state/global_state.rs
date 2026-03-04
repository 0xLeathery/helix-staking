use anchor_lang::prelude::*;

#[account]
pub struct GlobalState {
    /// Authority that can update protocol parameters (future governance)
    pub authority: Pubkey,
    /// HELIX token mint address
    pub mint: Pubkey,
    /// Bump seed for mint authority PDA
    pub mint_authority_bump: u8,
    /// Bump seed for GlobalState PDA
    pub bump: u8,

    // === Tokenomics Parameters ===
    /// Annual inflation rate in basis points (3,690,000 = 3.69%)
    pub annual_inflation_bp: u64,
    /// Minimum stake amount in token base units (10,000,000 = 0.1 HELIX)
    pub min_stake_amount: u64,
    /// Share rate: tokens per share (10,000 = 1:1 at launch). Increases over time.
    pub share_rate: u64,
    /// Starting share rate for reference
    pub starting_share_rate: u64,

    // === Time Configuration (slot-based) ===
    /// Slots per logical day (~216,000 at 400ms/slot)
    pub slots_per_day: u64,
    /// Claim period length in days
    pub claim_period_days: u8,
    /// Slot when protocol was initialized
    pub init_slot: u64,

    // === Monotonic Event Counters (indexer-expert requirement) ===
    /// Total number of stakes ever created (monotonically increasing)
    pub total_stakes_created: u64,
    /// Total number of unstakes ever created (monotonically increasing)
    pub total_unstakes_created: u64,
    /// Total number of reward claims ever created (monotonically increasing)
    pub total_claims_created: u64,

    // === Aggregate Metrics ===
    /// Total tokens currently staked
    pub total_tokens_staked: u64,
    /// Total tokens ever unstaked
    pub total_tokens_unstaked: u64,
    /// Total active T-shares
    pub total_shares: u64,
    /// Current distribution day number
    pub current_day: u64,

    // === Admin Mint Tracking ===
    /// Total tokens minted via admin_mint
    pub total_admin_minted: u64,
    /// Maximum allowed admin mints (set at initialize)
    pub max_admin_mint: u64,

    // === Reserved for future expansion ===
    // reserved[0] = BPD window active flag
    // reserved[1] = is_paused flag
    // reserved[2..5] = seed_mint (Pubkey encoded as 4 LE u64s)
    // reserved[6] = min_seed_balance
    // reserved[7] = boost_enabled (0 = false, 1 = true)
    // reserved[8..9] = free for future use
    pub reserved: [u64; 10],
}

impl GlobalState {
    /// Check if BPD calculation window is active (unstaking blocked)
    pub fn is_bpd_window_active(&self) -> bool {
        self.reserved[0] != 0
    }

    /// Set BPD window flag (called by finalize on first batch, cleared by trigger on completion)
    pub fn set_bpd_window_active(&mut self, active: bool) {
        self.reserved[0] = if active { 1 } else { 0 };
    }

    // reserved[1] = is_paused flag (OPS-03)

    /// Check if the program is paused (emergency halt)
    pub fn is_paused(&self) -> bool {
        self.reserved[1] == 1
    }

    /// Set the pause flag (authority-gated)
    pub fn set_paused(&mut self, paused: bool) {
        self.reserved[1] = if paused { 1 } else { 0 };
    }

    // === Phase 24: Boost System helpers ===

    /// Get seed token mint from reserved[2..5] (Pubkey encoded as 4 LE u64s)
    pub fn get_seed_mint(&self) -> Pubkey {
        let mut bytes = [0u8; 32];
        for (i, &val) in self.reserved[2..6].iter().enumerate() {
            bytes[i * 8..(i + 1) * 8].copy_from_slice(&val.to_le_bytes());
        }
        Pubkey::from(bytes)
    }

    /// Set seed token mint into reserved[2..5]
    pub fn set_seed_mint(&mut self, mint: &Pubkey) {
        let bytes = mint.to_bytes();
        for i in 0..4 {
            self.reserved[2 + i] = u64::from_le_bytes(bytes[i * 8..(i + 1) * 8].try_into().unwrap());
        }
    }

    /// Get minimum seed balance threshold from reserved[6]
    pub fn get_min_seed_balance(&self) -> u64 {
        self.reserved[6]
    }

    /// Set minimum seed balance threshold in reserved[6]
    pub fn set_min_seed_balance(&mut self, balance: u64) {
        self.reserved[6] = balance;
    }

    /// Check if boost system is enabled (reserved[7] != 0)
    pub fn get_boost_enabled(&self) -> bool {
        self.reserved[7] != 0
    }

    /// Set boost enabled flag in reserved[7]
    pub fn set_boost_enabled(&mut self, enabled: bool) {
        self.reserved[7] = if enabled { 1 } else { 0 };
    }

    pub const LEN: usize = 8    // discriminator
        + 32   // authority
        + 32   // mint
        + 1    // mint_authority_bump
        + 1    // bump
        + 8    // annual_inflation_bp
        + 8    // min_stake_amount
        + 8    // share_rate
        + 8    // starting_share_rate
        + 8    // slots_per_day
        + 1    // claim_period_days
        + 8    // init_slot
        + 8    // total_stakes_created
        + 8    // total_unstakes_created
        + 8    // total_claims_created
        + 8    // total_tokens_staked
        + 8    // total_tokens_unstaked
        + 8    // total_shares
        + 8    // current_day
        + 8    // total_admin_minted
        + 8    // max_admin_mint
        + 80;  // reserved (10 * u64)
}

#[cfg(test)]
mod tests {
    use super::*;

    fn default_global_state() -> GlobalState {
        GlobalState {
            authority: Pubkey::default(),
            mint: Pubkey::default(),
            mint_authority_bump: 255,
            bump: 254,
            annual_inflation_bp: 3_690_000,
            min_stake_amount: 10_000_000,
            share_rate: 10_000,
            starting_share_rate: 10_000,
            slots_per_day: 216_000,
            claim_period_days: 180,
            init_slot: 0,
            total_stakes_created: 0,
            total_unstakes_created: 0,
            total_claims_created: 0,
            total_tokens_staked: 0,
            total_tokens_unstaked: 0,
            total_shares: 0,
            current_day: 0,
            total_admin_minted: 0,
            max_admin_mint: 0,
            reserved: [0u64; 10],
        }
    }

    #[test]
    fn test_bpd_window_initially_inactive() {
        let gs = default_global_state();
        assert!(!gs.is_bpd_window_active());
    }

    #[test]
    fn test_bpd_window_set_active() {
        let mut gs = default_global_state();
        gs.set_bpd_window_active(true);
        assert!(gs.is_bpd_window_active());
        assert_eq!(gs.reserved[0], 1);
    }

    #[test]
    fn test_bpd_window_clear() {
        let mut gs = default_global_state();
        gs.set_bpd_window_active(true);
        gs.set_bpd_window_active(false);
        assert!(!gs.is_bpd_window_active());
        assert_eq!(gs.reserved[0], 0);
    }

    #[test]
    fn test_pause_initially_false() {
        let gs = default_global_state();
        assert!(!gs.is_paused());
    }

    #[test]
    fn test_pause_set() {
        let mut gs = default_global_state();
        gs.set_paused(true);
        assert!(gs.is_paused());
        assert_eq!(gs.reserved[1], 1);
    }

    #[test]
    fn test_pause_clear() {
        let mut gs = default_global_state();
        gs.set_paused(true);
        gs.set_paused(false);
        assert!(!gs.is_paused());
        assert_eq!(gs.reserved[1], 0);
    }

    #[test]
    fn test_bpd_and_pause_flags_independent() {
        // reserved[0] = BPD window, reserved[1] = pause; they don't interfere
        let mut gs = default_global_state();
        gs.set_bpd_window_active(true);
        gs.set_paused(true);
        assert!(gs.is_bpd_window_active());
        assert!(gs.is_paused());
        gs.set_bpd_window_active(false);
        assert!(!gs.is_bpd_window_active());
        assert!(gs.is_paused(), "Paused state should be unaffected by BPD window clear");
    }

    // === Phase 24: Boost helper tests ===

    #[test]
    fn test_seed_mint_round_trip() {
        let mut gs = default_global_state();
        let mint = Pubkey::new_unique();
        gs.set_seed_mint(&mint);
        assert_eq!(gs.get_seed_mint(), mint, "seed_mint should round-trip through reserved[2..5]");
    }

    #[test]
    fn test_seed_mint_default_is_zero() {
        let gs = default_global_state();
        assert_eq!(gs.get_seed_mint(), Pubkey::default(), "default seed_mint should be Pubkey::default()");
    }

    #[test]
    fn test_min_seed_balance_round_trip() {
        let mut gs = default_global_state();
        gs.set_min_seed_balance(1_000_000_000);
        assert_eq!(gs.get_min_seed_balance(), 1_000_000_000);
    }

    #[test]
    fn test_min_seed_balance_default_is_zero() {
        let gs = default_global_state();
        assert_eq!(gs.get_min_seed_balance(), 0);
    }

    #[test]
    fn test_boost_enabled_round_trip() {
        let mut gs = default_global_state();
        assert!(!gs.get_boost_enabled(), "boost should be disabled by default");
        gs.set_boost_enabled(true);
        assert!(gs.get_boost_enabled());
        gs.set_boost_enabled(false);
        assert!(!gs.get_boost_enabled());
    }

    #[test]
    fn test_boost_fields_do_not_interfere_with_bpd_pause() {
        // Verify reserved slots are independent
        let mut gs = default_global_state();
        gs.set_bpd_window_active(true);
        gs.set_paused(true);

        let mint = Pubkey::new_unique();
        gs.set_seed_mint(&mint);
        gs.set_min_seed_balance(500_000);
        gs.set_boost_enabled(true);

        // BPD and pause flags still intact after setting boost fields
        assert!(gs.is_bpd_window_active(), "BPD window flag should be unaffected");
        assert!(gs.is_paused(), "Pause flag should be unaffected");
        assert_eq!(gs.get_seed_mint(), mint);
        assert_eq!(gs.get_min_seed_balance(), 500_000);
        assert!(gs.get_boost_enabled());
    }

    #[test]
    fn test_global_state_len_includes_extended_reserved() {
        // reserved is now [u64; 10] = 80 bytes (was [u64; 6] = 48 bytes).
        // LEN should be old_len - 48 + 80 = old_len + 32.
        // Actual computed constant: 275
        assert_eq!(GlobalState::LEN, 275);
        // Verify reserved portion is 80 bytes (10 * 8)
        // Total: 8+32+32+1+1+8+8+8+8+8+1+8+8+8+8+8+8+8+8+8+8+80 = 275
    }
}
