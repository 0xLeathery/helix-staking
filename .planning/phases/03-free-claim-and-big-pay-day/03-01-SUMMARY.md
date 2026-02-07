---
phase: 03-free-claim-and-big-pay-day
plan: 01
subsystem: claim-foundations
tags: [pda, events, constants, errors, foundations]
dependency_graph:
  requires: []
  provides:
    - ClaimConfig PDA (singleton claim period configuration)
    - ClaimStatus PDA (per-user claim tracking)
    - Claim constants (vesting, bonuses, merkle tree)
    - 12 claim-related error codes
    - 5 claim-related events
  affects:
    - All claim-related instructions (03-02 through 03-06)
tech_stack:
  added:
    - ClaimConfig PDA (127 bytes)
    - ClaimStatus PDA (76 bytes)
  patterns:
    - Singleton PDA pattern for ClaimConfig [b"claim_config"]
    - Multi-period isolation via merkle root prefix in ClaimStatus seeds
    - Double-withdrawal prevention via withdrawn_amount tracking
key_files:
  created:
    - programs/helix-staking/src/state/claim_config.rs (ClaimConfig PDA)
    - programs/helix-staking/src/state/claim_status.rs (ClaimStatus PDA)
  modified:
    - programs/helix-staking/src/constants.rs (claim constants)
    - programs/helix-staking/src/error.rs (12 new error codes)
    - programs/helix-staking/src/events.rs (5 new events)
    - programs/helix-staking/src/state/mod.rs (export new PDAs)
decisions:
  - Use 8-byte merkle root prefix in ClaimStatus seeds for future multi-period support
  - Track withdrawn_amount in ClaimStatus to prevent double-withdrawal attacks
  - Use speed bonus tiers (+20% week 1, +10% weeks 2-4) to incentivize early claims
  - 30-day linear vesting with 10% immediate release
metrics:
  duration: 154s (~2min)
  completed: 2026-02-07T22:40:34Z
---

# Phase 03 Plan 01: Claim Foundations Summary

**One-liner:** ClaimConfig/ClaimStatus PDAs with vesting parameters, speed bonus tiers, 12 error codes, and 5 events for snapshot-based token claiming.

## Objective

Create the foundational types, constants, errors, and events for Phase 3 claim mechanics to support initialize_claim_period, free_claim, withdraw_vested, and trigger_big_pay_day instructions.

## Tasks Completed

### Task 1: Add claim constants and error codes

**Files:** `constants.rs`, `error.rs`

**What was done:**
- Added claim period PDA seeds (CLAIM_CONFIG_SEED, CLAIM_STATUS_SEED)
- Added vesting parameters: VESTING_DAYS (30), IMMEDIATE_RELEASE_BPS (10%), VESTED_RELEASE_BPS (90%), CLAIM_PERIOD_DAYS (180)
- Added speed bonus tiers: SPEED_BONUS_WEEK1_BPS (+20%), SPEED_BONUS_WEEK2_4_BPS (+10%) with end-day thresholds
- Added claim ratio: HELIX_PER_SOL (10,000), MIN_SOL_BALANCE (0.1 SOL)
- Added merkle tree constants: MAX_MERKLE_PROOF_LEN (20), MERKLE_ROOT_PREFIX_LEN (8)
- Added 12 claim-related error codes covering all failure modes

**Commit:** c851385

### Task 2: Add claim events and ClaimConfig/ClaimStatus PDAs

**Files:** `events.rs`, `state/claim_config.rs`, `state/claim_status.rs`, `state/mod.rs`

**What was done:**
- Created ClaimConfig PDA (127 bytes): authority, merkle_root, total_claimable, total_claimed, claim_count, start_slot, end_slot, claim_period_id, claim_period_started, big_pay_day_complete, bpd_total_distributed, total_eligible, bump
- Created ClaimStatus PDA (76 bytes): is_claimed, claimed_amount, claimed_slot, bonus_bps, withdrawn_amount, vesting_end_slot, snapshot_wallet, bump
- Added 5 claim events: ClaimPeriodStarted, TokensClaimed, VestedTokensWithdrawn, ClaimPeriodEnded, BigPayDayDistributed
- Updated state/mod.rs to export new PDAs

**Security features:**
- ClaimStatus tracks withdrawn_amount for double-withdrawal prevention
- ClaimStatus includes snapshot_wallet for verification
- Merkle root becomes immutable after claim period starts (claim_period_started flag)

**Commit:** 71e3ad0

## Deviations from Plan

None - plan executed exactly as written.

## Verification Results

- [x] `cargo test --package helix-staking --lib` succeeds with exit code 0
- [x] ClaimConfig struct exists in `programs/helix-staking/src/state/claim_config.rs`
- [x] ClaimStatus struct exists in `programs/helix-staking/src/state/claim_status.rs`
- [x] ClaimConfig::LEN = 127 bytes (verified in source)
- [x] ClaimStatus::LEN = 76 bytes (verified in source)
- [x] Constants CLAIM_CONFIG_SEED, CLAIM_STATUS_SEED, VESTING_DAYS, SPEED_BONUS_* defined
- [x] 12 new error codes exist in HelixError enum (grep count: 16 matches including duplicates)
- [x] 5 event structs exist (grep count: 6 matches)

## Success Criteria Met

- [x] Program builds cleanly with `cargo test`
- [x] ClaimConfig PDA has all fields from CONTEXT.md
- [x] ClaimStatus PDA has all fields including security requirement (withdrawn_amount tracking)
- [x] All constants support speed bonus calculation and vesting schedule
- [x] ClaimConfig uses singleton pattern with seeds [b"claim_config"]
- [x] ClaimStatus uses seeds [b"claim_status", merkle_root[0..8], snapshot_wallet] for per-user tracking

## Key Technical Decisions

1. **Merkle root prefix in ClaimStatus seeds:** Using first 8 bytes of merkle_root allows future claim periods with different roots while preventing collisions (MAX_MERKLE_PROOF_LEN supports 1M+ claimants).

2. **Double-withdrawal prevention:** ClaimStatus tracks withdrawn_amount cumulatively, allowing withdraw_vested instruction to verify available balance = vested_amount - withdrawn_amount.

3. **Speed bonus tiers:** +20% for days 1-7, +10% for days 8-28, base (0%) after day 28. Incentivizes early claims to bootstrap protocol adoption.

4. **Vesting schedule:** 10% available immediately (IMMEDIATE_RELEASE_BPS), 90% vests linearly over 30 days (VESTED_RELEASE_BPS). Prevents dump risk while giving instant liquidity.

## Next Phase Readiness

**Phase 3 Plan 02 (initialize_claim_period instruction) can proceed:**
- ClaimConfig PDA defined with all required fields
- ClaimPeriodStarted event defined
- ClaimPeriodAlreadyStarted error defined
- CLAIM_CONFIG_SEED constant available

**Phase 3 Plans 03-06 can proceed:**
- ClaimStatus PDA defined with vesting and withdrawal tracking
- All claim-related events and errors available
- All constants defined for bonus calculation and vesting logic

## Self-Check: PASSED

**Created files exist:**
```
FOUND: programs/helix-staking/src/state/claim_config.rs
FOUND: programs/helix-staking/src/state/claim_status.rs
```

**Commits exist:**
```
FOUND: c851385 (Task 1 - constants and errors)
FOUND: 71e3ad0 (Task 2 - events and PDAs)
```

**Build status:**
```
Finished `test` profile [unoptimized + debuginfo] target(s) in 0.38s
test result: ok. 5 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out
```
