---
phase: 03-free-claim-and-big-pay-day
plan: 02
subsystem: staking-core
tags: [big-pay-day, lazy-migration, account-realloc, anchor-lang]

# Dependency graph
requires:
  - phase: 02.1-critical-math-fixes
    provides: Fixed-point math utilities with precision-based calculations
  - phase: 03-01
    provides: ClaimConfig and ClaimStatus state accounts for free claim tracking
provides:
  - StakeAccount extended with BPD bonus tracking (bpd_bonus_pending, bpd_eligible, claim_period_start_slot)
  - Lazy migration from 92-byte to 109-byte StakeAccount via realloc in claim_rewards
  - BPD bonus payout integrated into claim_rewards (atomically cleared after claiming)
affects:
  - 03-03-free-claim-instruction # Will use ClaimConfig to check claim period status
  - 03-04-trigger-big-pay-day # Will set bpd_bonus_pending for eligible stakes
  - 03-05-claim-period-lifecycle # Will set bpd_eligible during claim period

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Lazy migration via Anchor realloc constraint with realloc::zero = true for safe field initialization"
    - "Account size versioning: OLD_LEN constant for migration detection"
    - "Atomic bonus clearing: bpd_bonus_pending zeroed after successful claim (prevents double-claim)"

key-files:
  created: []
  modified:
    - programs/helix-staking/src/state/stake_account.rs
    - programs/helix-staking/src/instructions/claim_rewards.rs
    - programs/helix-staking/src/instructions/create_stake.rs

key-decisions:
  - "StakeAccount expanded from 92 to 109 bytes with lazy migration on claim_rewards"
  - "BPD bonus added to total reward payout (not separate claim instruction)"
  - "realloc::zero = true ensures new fields default to 0/false (safe for migration)"
  - "bpd_eligible defaults to false until claim period integration in plan 03-05"

patterns-established:
  - "Lazy account migration: realloc in frequently-called instruction (claim_rewards) to avoid separate migration step"
  - "Atomic bonus distribution: bonus cleared in same transaction as payout to prevent double-claim exploits"

# Metrics
duration: 3min
completed: 2026-02-07
---

# Phase 03 Plan 02: Extend StakeAccount for Big Pay Day Summary

**StakeAccount extended to 109 bytes with lazy migration via realloc, BPD bonus tracking (bpd_bonus_pending, bpd_eligible, claim_period_start_slot), and atomic bonus payout in claim_rewards**

## Performance

- **Duration:** 3 min
- **Started:** 2026-02-07T22:38:52Z
- **Completed:** 2026-02-07T22:41:53Z
- **Tasks:** 3
- **Files modified:** 3

## Accomplishments
- Extended StakeAccount with three BPD tracking fields (bpd_bonus_pending, bpd_eligible, claim_period_start_slot)
- Implemented lazy migration from 92-byte to 109-byte accounts via Anchor realloc constraint
- Integrated BPD bonus into claim_rewards total payout with atomic clearing (security: prevents double-claim)
- Initialized BPD fields to safe defaults in create_stake (prepares for claim period integration)

## Task Commits

Each task was committed atomically:

1. **Task 1: Extend StakeAccount with BPD tracking fields** - `2bdce1c` (feat)
2. **Task 2: Add lazy migration and BPD payout to claim_rewards** - `d7ded64` (feat)
3. **Task 3: Initialize BPD fields in create_stake** - `1308dd4` (feat)

## Files Created/Modified
- `programs/helix-staking/src/state/stake_account.rs` - Added bpd_bonus_pending (u64), bpd_eligible (bool), claim_period_start_slot (u64); updated LEN from 92 to 109 bytes; added OLD_LEN = 92 for migration detection
- `programs/helix-staking/src/instructions/claim_rewards.rs` - Added realloc constraint for lazy migration; included bpd_bonus_pending in total reward payout; atomically clears bonus after claiming; added system_program for rent adjustment
- `programs/helix-staking/src/instructions/create_stake.rs` - Initialized BPD fields to safe defaults (bpd_bonus_pending = 0, bpd_eligible = false, claim_period_start_slot = 0)

## Decisions Made

**1. Lazy migration via claim_rewards instead of separate migration instruction**
- Rationale: Leverages frequently-called instruction (claim_rewards) to automatically upgrade old accounts without user action. Simpler UX than requiring explicit migration.
- Trade-off: First claim after migration pays slightly higher rent for realloc, but eliminates need for migration announcement/coordination.

**2. BPD bonus included in claim_rewards total payout (not separate claim instruction)**
- Rationale: Reduces transaction count for users, ensures bonus is claimed atomically with regular rewards.
- Security: bpd_bonus_pending zeroed immediately after minting to prevent double-claim exploits.

**3. realloc::zero = true for safe field initialization**
- Rationale: Anchor's `realloc::zero = true` zeroes new bytes after account expansion, ensuring BPD fields default to 0/false without explicit initialization.
- Safety: Prevents undefined memory from old accounts affecting new field values.

**4. bpd_eligible defaults to false until claim period integration**
- Rationale: Plan 03-05 (claim period lifecycle) will add logic to check ClaimConfig.claim_period_started and set bpd_eligible = true for stakes created during claim period.
- Current state: All new stakes get bpd_eligible = false (safe default).

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

**Ready for Plan 03-03 (Free Claim Instruction):**
- ClaimConfig and ClaimStatus state accounts exist (from 03-01)
- StakeAccount has BPD tracking fields (from 03-02)
- Next: Implement process_free_claim instruction to handle merkle proof verification and claim payout

**Ready for Plan 03-04 (Trigger Big Pay Day):**
- bpd_bonus_pending field exists for distribution tracking
- Lazy migration ensures all accounts will have BPD fields after first claim
- Next: Implement trigger_big_pay_day to calculate and distribute unclaimed pool to eligible stakers

**Ready for Plan 03-05 (Claim Period Lifecycle):**
- claim_period_start_slot field exists for T-share-days calculation
- bpd_eligible field exists for eligibility tracking
- Next: Add logic to create_stake to set bpd_eligible = true when ClaimConfig.claim_period_started

**No blockers or concerns.**

## Self-Check: PASSED

**Files verified:**
- ✓ programs/helix-staking/src/state/stake_account.rs
- ✓ programs/helix-staking/src/instructions/claim_rewards.rs
- ✓ programs/helix-staking/src/instructions/create_stake.rs

**Commits verified:**
- ✓ 2bdce1c (Task 1: Extend StakeAccount with BPD tracking fields)
- ✓ d7ded64 (Task 2: Add lazy migration and BPD payout to claim_rewards)
- ✓ 1308dd4 (Task 3: Initialize BPD fields in create_stake)

---
*Phase: 03-free-claim-and-big-pay-day*
*Completed: 2026-02-07*
