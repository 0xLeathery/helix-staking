---
phase: 03-free-claim-and-big-pay-day
plan: 03
subsystem: claiming
tags: [free-claim, merkle-proof, ed25519, mev-prevention, vesting]

dependency_graph:
  requires:
    - 03-01  # ClaimConfig and ClaimStatus state accounts
  provides:
    - free_claim instruction with Merkle + Ed25519 verification
    - Speed bonus calculation (+20%/+10%/0%)
    - 10%/90% vesting split
  affects:
    - ClaimConfig (updates total_claimed, claim_count)
    - ClaimStatus (initialized on claim)
    - Token supply (mints immediate portion)

tech_stack:
  added:
    - solana-nostd-keccak v0.1 (keccak256 for Merkle proofs)
  patterns:
    - Ed25519 instruction introspection for MEV prevention
    - Merkle proof verification with sorted pair hashing
    - Slot-based days elapsed calculation
    - Fixed-point bonus calculation using BPS_SCALER

key_files:
  created:
    - programs/helix-staking/src/instructions/free_claim.rs
  modified:
    - programs/helix-staking/Cargo.toml
    - programs/helix-staking/src/instructions/mod.rs
    - programs/helix-staking/src/lib.rs

decisions:
  - id: D03-03-01
    title: Keccak version fix
    choice: Use solana-nostd-keccak v0.1.x (not v0.2)
    rationale: v0.2 does not exist on crates.io; v0.1.3 is the latest available

metrics:
  duration: ~3 minutes
  completed: 2026-02-07T22:49:00Z
---

# Phase 3 Plan 03: Implement free_claim Instruction Summary

Free claim instruction with Merkle proof verification, Ed25519 signature introspection for MEV prevention, and graduated vesting release.

## Completed Tasks

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Add solana-nostd-keccak dependency | 1ae484d | Cargo.toml |
| 2 | Implement free_claim instruction | 9289ed4 | instructions/free_claim.rs |
| 3 | Register in mod.rs and lib.rs | 605e376 | instructions/mod.rs, lib.rs |

## Implementation Details

### Security Features

1. **Merkle Proof Verification** (~2-3k CU)
   - Leaf format: `keccak256(snapshot_address || amount || claim_period_id)`
   - Maximum proof depth: 20 levels (supports 1M+ claimants)
   - Sorted pair hashing for consistent tree traversal

2. **Ed25519 Signature Introspection** (~19k CU)
   - Message format: `HELIX:claim:{pubkey}:{amount}`
   - Verifies Ed25519 program instruction immediately precedes free_claim
   - Validates pubkey and message match expected values
   - Prevents MEV front-running attacks

3. **Claim Period Validation**
   - Checks claim period has started (constraint on ClaimConfig)
   - Checks claim period has not ended (slot comparison)
   - Minimum balance check (0.1 SOL = 100,000,000 lamports)

### Speed Bonus Calculation

| Days Elapsed | Bonus | Example (1 SOL snapshot) |
|--------------|-------|--------------------------|
| 0-7 (Week 1) | +20% | 12,000 HELIX |
| 8-28 (Weeks 2-4) | +10% | 11,000 HELIX |
| 29+ | 0% | 10,000 HELIX |

Calculation: `base_amount = snapshot_balance * HELIX_PER_SOL / 10` (adjusts for decimal difference)

### Vesting Split

- **Immediate release:** 10% minted directly to claimer's token account
- **Vesting:** 90% tracked in ClaimStatus for 30-day linear release
- `withdrawn_amount` initialized to immediate amount (counts as already withdrawn)
- `vesting_end_slot` calculated as claim_slot + (30 * slots_per_day)

### ClaimStatus PDA

Seeds: `[b"claim_status", merkle_root[0..8], snapshot_wallet]`

Fields initialized:
- `is_claimed`: true
- `claimed_amount`: base + bonus
- `claimed_slot`: current slot
- `bonus_bps`: 0, 1000, or 2000
- `withdrawn_amount`: immediate portion
- `vesting_end_slot`: 30 days after claim
- `snapshot_wallet`: original snapshot address
- `bump`: PDA bump

### Events

`TokensClaimed` event emitted with:
- Slot and timestamp for indexer correlation
- Claimer and snapshot wallet addresses
- Full claim breakdown (base, bonus, total, immediate, vesting)
- Vesting end slot for frontend display

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Corrected keccak dependency version**
- **Found during:** Task 1
- **Issue:** Plan specified v0.2 but only v0.1.x exists on crates.io
- **Fix:** Changed to v0.1 (resolves to v0.1.3)
- **Commit:** 1ae484d

## Verification Results

- [x] `cargo check -p helix-staking` passes
- [x] `cargo test` passes (5 tests)
- [x] solana-nostd-keccak dependency in Cargo.toml
- [x] `pub fn free_claim` in free_claim.rs
- [x] `pub fn free_claim` in lib.rs
- [x] verify_ed25519_signature and verify_merkle_proof functions exist
- [x] ClaimStatus PDA seeds use merkle_root[0..8] prefix

## Self-Check: PASSED

All created files verified to exist:
- [x] programs/helix-staking/src/instructions/free_claim.rs

All commits verified:
- [x] 1ae484d (chore: add keccak dependency)
- [x] 9289ed4 (feat: implement free_claim)
- [x] 605e376 (feat: register in mod.rs and lib.rs)
