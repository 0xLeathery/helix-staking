# Phase 3: Free Claim and Big Pay Day - Context

**Gathered:** 2026-02-08
**Status:** Ready for planning
**Expert Board:** anchor-expert, tokenomics-expert, security-expert, indexer-expert, frontend-expert

<domain>
## Phase Boundary

SOL holders can claim free HELIX tokens proportional to their snapshot balance. Each address can claim exactly once. After the claim period ends, Big Pay Day distributes all unclaimed tokens proportionally to active T-share holders weighted by stake duration during the claim period.

</domain>

<decisions>
## Implementation Decisions

### Merkle Proof Verification
- Use **keccak256** via `solana-nostd-keccak` crate (~100 CU per hash)
- Maximum tree depth: ~20 levels (supports 1M+ claimants)
- Total compute: ~2,000-3,000 CU for proof verification
- Leaf format: `keccak256(snapshot_address || amount || claim_period_id)`

### Claim Account Structure
- **Separate ClaimStatus PDA per user** (not bitmap)
- Seeds: `[b"claim_status", merkle_root[0..8], snapshot_wallet.as_ref()]`
- Account fields: `is_claimed`, `claimed_amount`, `claimed_slot`, `withdrawn_amount`, `vesting_end_slot`, `bump`
- Rent: ~0.0003 SOL per claim (claimer pays)

### MEV Prevention (MANDATORY)
- Snapshot address MUST sign the claim (prevents front-running)
- Use Ed25519 precompile + instruction introspection (~19k CU)
- Message format: `HELIX:claim:{pubkey}:{amount}` (no newlines, includes amount)
- Transaction structure: Ed25519Program.verify first, then free_claim instruction
- **Two wallet popups required:** signMessage + signTransaction

### Merkle Root Storage
- Separate **ClaimConfig PDA** (not in GlobalState)
- Seeds: `[b"claim_config"]`
- Fields: `authority`, `merkle_root`, `total_claimable`, `total_claimed`, `start_slot`, `end_slot`, `claim_period_started`, `big_pay_day_complete`, `bpd_bonus_per_share`, `bump`
- Root is **immutable after claim_period_started = true**

### Anti-Dump Mechanism: Graduated 30-Day Release
- 10% available immediately at claim
- 90% vests linearly over 30 days (3.33%/day)
- Users call `withdraw_vested()` anytime to claim unlocked tokens
- **Stake bonus:** +10% extra if user stakes 50%+ for 1+ year voluntarily

### Claim Eligibility
- Snapshot of SOL balances (native + staked SOL)
- DeFi positions excluded (too complex to verify)
- Minimum balance: 0.1 SOL (prevents dust/Sybil)
- **Claim ratio: 10,000 HELIX per SOL**

### Claim Window
- **Duration: 180 days**
- Immutable after initialization

### Speed Bonus (Early Bonus Only, No Late Penalty)
- Week 1 (days 1-7): **+20% bonus**
- Weeks 2-4 (days 8-28): **+10% bonus**
- Days 29-180: **Base amount** (no bonus, no penalty)
- Rationale: BPD redistribution is the implicit penalty; explicit late penalty feels punitive

### Big Pay Day
- **Permissionless trigger** (anyone can call after claim period ends)
- Condition: `current_day >= claim_period_end_day` AND `!big_pay_day_complete`
- Distribution: **T-share-days weighted** (not snapshot at trigger time)
  - Weight = T-shares × days_staked_during_claim_period
  - Stakes must be created DURING claim period to be eligible
  - Prevents last-minute staking attacks
- Mechanism: Per-stake `bpd_bonus_pending` field (+8 bytes per StakeAccount)
- Lazy calculation in `claim_rewards`: calculates BPD share on first claim after trigger
- If no stakers: keep pool pending until stakers appear

### Events
```rust
// Claim events
pub struct TokensClaimed {
    pub claimer: Pubkey,
    pub claim_index: u32,
    pub claim_period_id: u32,
    pub snapshot_balance: u64,
    pub base_amount: u64,
    pub bonus_bps: u16,           // 2000 = +20%, 1000 = +10%, 0 = base
    pub days_elapsed: u16,
    pub immediate_amount: u64,    // 10% available now
    pub vesting_amount: u64,      // 90% vesting
    pub vesting_end_slot: u64,
    pub slot: u64,
    pub timestamp: i64,
}

pub struct VestedTokensWithdrawn {
    pub claimer: Pubkey,
    pub amount: u64,
    pub total_vested: u64,
    pub total_withdrawn: u64,
    pub remaining: u64,
    pub slot: u64,
    pub timestamp: i64,
}

pub struct ClaimPeriodStarted {
    pub claim_period_id: u32,
    pub merkle_root: [u8; 32],
    pub total_claimable: u64,
    pub total_eligible: u32,
    pub claim_deadline: i64,
    pub slot: u64,
    pub timestamp: i64,
}

pub struct ClaimPeriodEnded {
    pub claim_period_id: u32,
    pub total_claimed: u64,
    pub claims_count: u32,
    pub unclaimed_amount: u64,
    pub slot: u64,
    pub timestamp: i64,
}

pub struct BigPayDayDistributed {
    pub total_unclaimed: u64,
    pub total_staked_shares: u64,
    pub helix_per_share: u64,
    pub eligible_stakers: u32,
    pub claim_period_id: u32,
    pub slot: u64,
    pub timestamp: i64,
}
```

### Security Requirements (MANDATORY)
1. **Snapshot address signature required** - prevents MEV/front-running
2. **Time-weighted T-shares for BPD** - prevents last-minute staking attacks
3. **Claim records never closed** - prevents re-initialization attacks
4. **Merkle root immutable after claim starts** - prevents authority manipulation
5. **ClaimStatus tracks withdrawn_amount** - prevents double-withdrawal

### Claude's Discretion
- Exact vesting curve (linear is fine, could be step-function)
- Snapshot announcement timing (2-4 weeks advance notice recommended)
- IPFS vs CDN for proof storage
- Error message wording

</decisions>

<specifics>
## Specific Ideas

- Message format `HELIX:claim:{pubkey}:{amount}` prevents cross-protocol signature reuse
- Graduated release inspired by standard token vesting patterns
- BPD T-share-days weighting similar to time-weighted average balance (TWAB) pattern
- Two-popup claim flow is standard for signed-message verification

</specifics>

<deferred>
## Deferred Ideas

- **Referral bonuses** (HEX gave 10% for referrals) - adds complexity, consider for v2
- **Whale penalty** (HEX penalized claims over 1,000 BTC) - not needed for fairness, skip
- **Multiple claim periods** - keep as single period for simplicity
- **Auto-stake requirement** (HEX's 90% auto-stake) - rejected, use incentives instead

</deferred>

---

*Phase: 03-free-claim-and-big-pay-day*
*Context gathered: 2026-02-08*
*Expert consensus: 5/5 aligned*
