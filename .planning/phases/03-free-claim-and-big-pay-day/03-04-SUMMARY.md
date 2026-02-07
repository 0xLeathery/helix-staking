---
phase: 03-free-claim-and-big-pay-day
plan: 04
subsystem: staking-vesting
tags: [vesting, big-pay-day, withdraw, distribution]
dependency_graph:
  requires: ["03-01 ClaimConfig/ClaimStatus PDAs", "03-02 StakeAccount BPD fields"]
  provides: ["withdraw_vested instruction", "trigger_big_pay_day instruction"]
  affects: ["claim workflow", "BPD distribution", "token minting"]
tech_stack:
  added: []
  patterns: ["linear vesting calculation", "T-share-days weighting", "remaining_accounts pattern", "proper Anchor deserialization"]
key_files:
  created:
    - programs/helix-staking/src/instructions/withdraw_vested.rs
    - programs/helix-staking/src/instructions/trigger_big_pay_day.rs
  modified:
    - programs/helix-staking/src/instructions/mod.rs
    - programs/helix-staking/src/lib.rs
decisions: []
metrics:
  duration: "~2 min"
  completed: "2026-02-07"
---

# Phase 03 Plan 04: Withdraw Vested and Big Pay Day Summary

Linear vesting withdrawal and permissionless Big Pay Day distribution with T-share-days weighting.

## What Was Built

### withdraw_vested Instruction
- Linear 30-day vesting calculation (10% immediate + 90% linear over 30 days)
- Cumulative `withdrawn_amount` tracking in ClaimStatus (security: prevents double-withdrawal)
- Mint tokens to claimer via PDA authority
- Emits `VestedTokensWithdrawn` event with full state

### trigger_big_pay_day Instruction
- Permissionless trigger after claim period ends (`clock.slot > claim_config.end_slot`)
- T-share-days weighting: `t_shares * days_staked_during_claim_period`
- Only stakes created DURING claim period are eligible (prevents last-minute staking attacks)
- Uses `StakeAccount::try_deserialize` (proper Anchor deserialization, NOT hardcoded byte offsets)
- Sets `bpd_bonus_pending` on each eligible StakeAccount
- MAX_STAKES_PER_BPD = 20 for compute limit safety (pagination)
- If no eligible stakers: keeps pool pending (doesn't mark complete)
- `big_pay_day_complete` flag prevents double-trigger

## Commit Log

| Hash | Description |
|------|-------------|
| 7507fd9 | feat(03-04): implement withdraw_vested instruction |
| 0494e1d | feat(03-04): implement trigger_big_pay_day instruction |
| 7d681a6 | feat(03-04): register withdraw_vested and trigger_big_pay_day |

## Verification Results

1. `cargo check -p helix-staking` - PASSED (warnings only)
2. `cargo test` - PASSED (5/5 tests)
3. `grep "pub fn withdraw_vested"` - FOUND
4. `grep "pub fn trigger_big_pay_day"` - FOUND
5. withdraw_vested tracks withdrawn_amount cumulatively - VERIFIED
6. trigger_big_pay_day only processes stakes where `start_slot >= claim_config.start_slot` - VERIFIED
7. trigger_big_pay_day uses T-share-days formula: `t_shares * days_staked` - VERIFIED
8. `big_pay_day_complete` flag prevents double-trigger - VERIFIED

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed improper deserialization approach**
- **Found during:** Task 2
- **Issue:** Plan suggested using `parse_stake_account` with hardcoded byte offsets, but Critical Fix note specified using proper `StakeAccount::try_deserialize`
- **Fix:** Implemented proper Anchor deserialization pattern instead of manual byte parsing
- **Files modified:** trigger_big_pay_day.rs
- **Commit:** 0494e1d

**2. [Rule 2 - Missing functionality] Added proper authorization check**
- **Found during:** Task 1
- **Issue:** Plan's constraint `true` comment was placeholder for ownership check
- **Fix:** Added proper `constraint = claim_status.snapshot_wallet == claimer.key() @ HelixError::Unauthorized`
- **Files modified:** withdraw_vested.rs
- **Commit:** 7507fd9

## Technical Notes

### Vesting Formula
```
immediate = claimed_amount * 10% (IMMEDIATE_RELEASE_BPS / BPS_SCALER)
vesting_portion = claimed_amount - immediate (90%)
unlocked = vesting_portion * elapsed / vesting_duration
total_vested = immediate + unlocked
available = total_vested - withdrawn_amount
```

### T-share-days Weighting
```
share_days = stake.t_shares * days_staked_during_claim_period
helix_per_share_day = (unclaimed_amount * PRECISION) / total_share_days
bonus = (share_days * helix_per_share_day) / PRECISION
```

### Pagination Note
MAX_STAKES_PER_BPD = 20 limits processing per call. For >20 eligible stakes:
- Multiple calls needed with different remaining_accounts
- Frontend must track which stakes have been processed
- Consider adding `bpd_stakes_processed` counter in v2

## Self-Check: PASSED

- [x] programs/helix-staking/src/instructions/withdraw_vested.rs exists
- [x] programs/helix-staking/src/instructions/trigger_big_pay_day.rs exists
- [x] Commit 7507fd9 exists
- [x] Commit 0494e1d exists
- [x] Commit 7d681a6 exists
