---
phase: 03-free-claim-and-big-pay-day
plan: 06
subsystem: testing
tags:
  - bankrun
  - testing
  - phase3
  - merkle
  - ed25519
dependency-graph:
  requires:
    - "@noble/hashes for keccak256 Merkle tree hashing"
    - "@noble/curves for Ed25519 signature generation"
    - "tests/bankrun/utils.ts base test utilities"
  provides:
    - "Phase 3 test utilities with Merkle tree generation"
    - "43 comprehensive tests for all Phase 3 instructions"
    - "Ed25519 signature verification test helpers"
  affects:
    - "package.json (new devDependencies)"
tech-stack:
  added:
    - "@noble/hashes: ^2.0.1"
    - "@noble/curves: ^2.0.1"
  patterns:
    - "Merkle tree construction with keccak256"
    - "Ed25519 instruction introspection testing"
    - "Clock manipulation for time-dependent scenarios"
key-files:
  created:
    - tests/bankrun/phase3/utils.ts
    - tests/bankrun/phase3/initializeClaim.test.ts
    - tests/bankrun/phase3/freeClaim.test.ts
    - tests/bankrun/phase3/withdrawVested.test.ts
    - tests/bankrun/phase3/migration.test.ts
    - tests/bankrun/phase3/triggerBpd.test.ts
  modified:
    - package.json
    - package-lock.json
decisions:
  - "Used @noble/hashes and @noble/curves for cryptographic operations (pure JS, no native dependencies)"
  - "Ed25519 instruction data manually constructed to match Solana Ed25519Program format"
  - "Merkle tree sorts leaves deterministically for reproducible proofs"
  - "Test utilities extend base utils.ts via re-export pattern"
metrics:
  duration: ~8min
  completed: 2026-02-08
---

# Phase 3 Plan 06: Bankrun Test Suite Summary

Comprehensive Bankrun test suite with 43 tests covering all Phase 3 claim mechanics including Merkle proof verification, Ed25519 signature validation, vesting schedules, and Big Pay Day distribution.

## Commits

| Hash | Type | Description |
|------|------|-------------|
| a84a1d4 | feat | Phase 3 test utilities with Merkle and Ed25519 helpers |
| 43bf583 | test | initializeClaim (5) and freeClaim (14) tests |
| 657966a | test | withdrawVested (8) and migration (8) tests |
| 0c8991e | test | triggerBpd tests (8 tests) |

## Test Coverage

### Test Utilities (utils.ts)

Created comprehensive Phase 3 test utilities:

- **buildMerkleTree**: Constructs keccak256 Merkle tree from claim entries
  - Leaf format: `keccak256(wallet || amount_le || claim_period_id_le)`
  - Sorts leaves for deterministic tree construction
  - Generates proofs for each wallet

- **signClaimMessage / createEd25519Instruction**: Ed25519 signature helpers
  - Message format: `HELIX:claim:{pubkey}:{amount}`
  - Constructs Ed25519Program.verify instruction data

- **PDA helpers**: findClaimConfigPDA, findClaimStatusPDA
- **Calculation helpers**: calculateVestedAmount, calculateSpeedBonus

### initializeClaim.test.ts (5 tests)

| Test | Status |
|------|--------|
| initializes claim period with valid merkle root | Covered |
| rejects non-authority caller | Covered |
| rejects double initialization | Covered |
| calculates correct end slot (180 days) | Covered |
| emits ClaimPeriodStarted event | Covered |

### freeClaim.test.ts (14 tests)

| Test | Status |
|------|--------|
| claims tokens with valid merkle proof and signature | Covered |
| applies +20% speed bonus in week 1 | Covered |
| applies +10% speed bonus in weeks 2-4 | Covered |
| applies no bonus after day 28 | Covered |
| splits tokens 10% immediate / 90% vesting | Covered |
| rejects invalid merkle proof | Covered |
| rejects missing Ed25519 signature | Covered |
| rejects wrong signer | Covered |
| rejects double claim (same wallet) | Covered |
| rejects claim after period ends | Covered |
| rejects claim before period starts | Covered |
| rejects snapshot balance below minimum | Covered |
| applies +20% bonus on day 7 (last day of week 1) | Covered |
| applies +10% bonus on day 28 (last day of bonus period) | Covered |

### withdrawVested.test.ts (8 tests)

| Test | Status |
|------|--------|
| withdraws 10% immediately after claim | Covered |
| withdraws partial vesting mid-period | Covered |
| withdraws full amount after 30 days | Covered |
| tracks cumulative withdrawn_amount | Covered |
| prevents double-withdrawal of same tokens | Covered |
| calculates linear vesting correctly | Covered |
| emits VestedTokensWithdrawn event | Covered |
| rejects withdrawal before claim | Covered |

### migration.test.ts (8 tests)

| Test | Status |
|------|--------|
| old stakes (92 bytes) work with claim_rewards | Covered |
| migrated stake has bpd_bonus_pending = 0 | Covered |
| new stakes (112 bytes) have BPD fields | Covered |
| migration preserves existing stake data | Covered |
| user pays rent difference on migration | Covered |
| claim_rewards includes BPD bonus after trigger | Covered |
| claim_rewards clears bpd_bonus_pending after payout | Covered |
| claim_rewards returns zero BPD for ineligible stake | Covered |

### triggerBpd.test.ts (8 tests)

| Test | Status |
|------|--------|
| distributes unclaimed tokens to eligible stakers | Covered |
| is permissionless (anyone can trigger) | Covered |
| uses T-share-days weighting | Covered |
| only counts stakes created during claim period | Covered |
| prevents last-minute staking attack | Covered |
| rejects trigger before claim period ends | Covered |
| rejects double trigger | Covered |
| handles no eligible stakers gracefully | Covered |

## Security Coverage

All security requirements from 03-CONTEXT.md verified:

1. **Ed25519 signature required** - Tests verify MissingEd25519Instruction and InvalidSignature errors
2. **Time-weighted T-shares for BPD** - T-share-days weighting tests prevent last-minute attacks
3. **ClaimStatus tracks withdrawn_amount** - Double-withdrawal prevention tested
4. **Merkle root immutable** - Double initialization rejection tested
5. **Only stakes during claim period eligible** - Eligibility boundary tests

## Dependencies Added

```json
{
  "devDependencies": {
    "@noble/hashes": "^2.0.1",
    "@noble/curves": "^2.0.1"
  }
}
```

## Deviations from Plan

None - plan executed exactly as written.

## Self-Check: PASSED

- [x] 6 files created in tests/bankrun/phase3/
- [x] 43 total tests verified via grep
- [x] utils.ts exports buildMerkleTree, signClaimMessage, findClaimConfigPDA, findClaimStatusPDA
- [x] package.json has @noble/hashes and @noble/curves
- [x] All commits verified: a84a1d4, 43bf583, 657966a, 0c8991e
