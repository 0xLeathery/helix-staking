---
phase: 02-core-staking-mechanics
plan: 01
subsystem: staking-core
tags: [anchor, solana, rust, bonus-curves, penalties, math, fixed-point]

# Dependency graph
requires:
  - phase: 01-protocol-init
    provides: GlobalState PDA, mint setup, constants, errors, events
provides:
  - StakeAccount PDA struct with all required fields (user, stake_id, staked_amount, t_shares, start_slot, end_slot, stake_days, reward_debt, is_active, bump)
  - Complete math module with bonus curves, penalty calculations, and reward helpers
  - LPB/BPB bonus curves matching HEX tokenomics design
  - Early/late penalty calculations with 50% minimum and grace periods
  - Lazy reward distribution formula
  - Staking constants, errors, and events
affects: [02-02-stake-instructions, 02-03-distribution-crank, 03-reputation-tracking]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Fixed-point arithmetic using PRECISION = 1e9 for all bonus/reward calculations"
    - "Checked arithmetic throughout math module (checked_mul, checked_add, checked_sub, checked_div)"
    - "Slot-based time calculations for deterministic day counting"

key-files:
  created:
    - programs/helix-staking/src/state/stake_account.rs
    - programs/helix-staking/src/instructions/math.rs
    - programs/helix-staking/src/instructions/mod.rs
  modified:
    - programs/helix-staking/src/constants.rs
    - programs/helix-staking/src/error.rs
    - programs/helix-staking/src/events.rs
    - programs/helix-staking/src/state/mod.rs
    - programs/helix-staking/src/lib.rs

key-decisions:
  - "LPB bonus caps at exactly 2x PRECISION for stake_days >= 3641 to avoid integer division rounding"
  - "BPB bonus formula rewritten to avoid overflow: (amount / 10) * PRECISION / BPB_THRESHOLD"
  - "Early penalty minimum of 50% applies when calculated penalty < 50%, not when time served < 50%"
  - "Late penalty uses 29 BPS per day to reach 100% at ~345 days past grace period (total 359 days late)"

patterns-established:
  - "All math functions return Result<u64> and use HelixError::Overflow/Underflow"
  - "Bonus calculations handle threshold/cap cases explicitly before formula"
  - "Unit tests verify boundary conditions (0, threshold, over-threshold)"

# Metrics
duration: 5.6min
completed: 2026-02-07
---

# Phase 2 Plan 1: Core Staking Types and Math Summary

**StakeAccount PDA and complete math module with LPB/BPB bonus curves, early/late penalty calculations, and lazy reward distribution using checked fixed-point arithmetic**

## Performance

- **Duration:** 5.6 min
- **Started:** 2026-02-07T21:34:28Z
- **Completed:** 2026-02-07T21:40:04Z
- **Tasks:** 2
- **Files modified:** 11

## Accomplishments

- StakeAccount PDA struct defined with 92 bytes (all fields: user, stake_id, staked_amount, t_shares, start_slot, end_slot, stake_days, reward_debt, is_active, bump)
- Math module with 7 public functions using checked arithmetic exclusively
- LPB bonus curve: 0 at 1 day → 2x at 3641 days (10 years)
- BPB bonus curve: 0 for small amounts → 10% at 150M tokens
- Early penalty: 50% minimum, scales with time served
- Late penalty: 0% in 14-day grace period → 100% at ~365 days late
- Lazy reward distribution formula (pending_rewards = t_shares * share_rate - reward_debt)
- Staking constants, 8 new error codes, 4 new event structs

## Task Commits

Each task was committed atomically:

1. **Task 1: Add staking constants, errors, events, and StakeAccount PDA** - `511092d` (feat)
   - Added STAKE_SEED, PRECISION, bonus/penalty constants
   - Added 8 staking error variants
   - Added 4 staking event structs (StakeCreated, StakeEnded, RewardsClaimed, InflationDistributed)
   - Created StakeAccount PDA struct (92 bytes)

2. **Task 2: Implement math module** - `9d886c3` (feat)
   - Created instructions/math.rs with 7 functions
   - calculate_lpb_bonus, calculate_bpb_bonus, calculate_t_shares
   - calculate_early_penalty, calculate_late_penalty
   - calculate_pending_rewards, get_current_day
   - All use checked arithmetic, return Result<u64>
   - Added comprehensive unit tests

## Files Created/Modified

**Created:**
- `programs/helix-staking/src/state/stake_account.rs` - StakeAccount PDA definition
- `programs/helix-staking/src/instructions/math.rs` - Bonus curves, penalties, reward calculations
- `programs/helix-staking/src/instructions/mod.rs` - Math module exports

**Modified:**
- `programs/helix-staking/src/constants.rs` - Added staking constants (STAKE_SEED, PRECISION, LPB_MAX_DAYS, BPB_THRESHOLD, penalty params)
- `programs/helix-staking/src/error.rs` - Added 8 staking error variants
- `programs/helix-staking/src/events.rs` - Added 4 staking event structs
- `programs/helix-staking/src/state/mod.rs` - Export StakeAccount
- `programs/helix-staking/src/lib.rs` - Add instructions module

## Decisions Made

**1. LPB bonus exact cap at threshold**
- Rationale: Avoid integer division rounding issues at LPB_MAX_DAYS (3641)
- Implementation: Explicit check `if stake_days >= LPB_MAX_DAYS return 2 * PRECISION`
- Impact: Ensures exact 2x bonus at 3641 days

**2. BPB bonus overflow prevention**
- Rationale: Original formula `amount * PRECISION / (10 * BPB_THRESHOLD)` overflows for large amounts
- Implementation: Rewrite as `(amount / 10) * PRECISION / BPB_THRESHOLD`
- Impact: Handles full u64 range without overflow

**3. Early penalty minimum semantics**
- Rationale: Minimum penalty applies when calculated penalty is LOW (user served most of time), not when time served < 50%
- Implementation: `penalty_bps = BPS_SCALER - served_fraction_bps; final = max(penalty_bps, MIN_PENALTY_BPS)`
- Impact: User who serves 75% of time gets 25% natural penalty raised to 50% minimum

**4. Late penalty rate**
- Rationale: Need to reach 100% penalty at ~350 days past grace period (roadmap spec)
- Implementation: 29 BPS per day → 100% at 10000 / 29 ≈ 345 days past grace
- Impact: Total late period = 14 grace + 345 penalty = 359 days to 100% loss

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed LPB bonus integer division rounding**
- **Found during:** Task 2 (Math module implementation)
- **Issue:** Formula `(3641-1) * 2 * PRECISION / 3641` produces 1,999,450,700 instead of 2,000,000,000 due to integer division
- **Fix:** Added explicit check `if stake_days >= LPB_MAX_DAYS return 2 * PRECISION` before formula
- **Files modified:** programs/helix-staking/src/instructions/math.rs
- **Verification:** Unit test `test_lpb_bonus` passes with exact 2x bonus at LPB_MAX_DAYS
- **Committed in:** 9d886c3 (Task 2 commit)

**2. [Rule 1 - Bug] Fixed BPB bonus overflow**
- **Found during:** Task 2 (Math module unit tests)
- **Issue:** Formula `effective_amount * PRECISION / (10 * BPB_THRESHOLD)` overflows for large amounts because multiplication happens before division
- **Fix:** Rewrite as `(staked_amount / 10) * PRECISION / BPB_THRESHOLD` to divide first
- **Files modified:** programs/helix-staking/src/instructions/math.rs
- **Verification:** Unit test `test_bpb_bonus` passes without overflow error
- **Committed in:** 9d886c3 (Task 2 commit)

**3. [Rule 1 - Bug] Fixed early penalty test expectations**
- **Found during:** Task 2 (Math module unit tests)
- **Issue:** Test expected penalty of 50% when time served = 0%, but actual penalty should be 100% (minimum only applies when penalty < 50%)
- **Fix:** Updated test expectations to match correct penalty semantics
- **Files modified:** programs/helix-staking/src/instructions/math.rs (test code only)
- **Verification:** All 4 unit tests pass
- **Committed in:** 9d886c3 (Task 2 commit)

---

**Total deviations:** 3 auto-fixed (3 bugs found during testing)
**Impact on plan:** All bugs fixed during unit test development. No scope changes. Overflow prevention and rounding fixes are critical for correctness.

## Issues Encountered

None - all tasks completed as specified. Unit tests caught rounding and overflow issues which were fixed during Task 2.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

**Ready for Phase 2 Plan 2 (Stake/Unstake Instructions):**
- StakeAccount PDA struct complete with all required fields
- Math module provides all bonus/penalty calculations needed by instructions
- Constants, errors, and events defined for full staking lifecycle
- Checked arithmetic ensures no overflow/underflow vulnerabilities

**Ready for Phase 2 Plan 3 (Distribution Crank):**
- Lazy reward distribution formula (calculate_pending_rewards) ready
- get_current_day helper for slot-based day tracking
- InflationDistributed event defined

**No blockers.** Foundation complete for instruction implementation.

## Self-Check: PASSED

All created files exist:
- ✓ programs/helix-staking/src/state/stake_account.rs
- ✓ programs/helix-staking/src/instructions/math.rs
- ✓ programs/helix-staking/src/instructions/mod.rs

All commits exist:
- ✓ 511092d (Task 1)
- ✓ 9d886c3 (Task 2)

---
*Phase: 02-core-staking-mechanics*
*Completed: 2026-02-07*
