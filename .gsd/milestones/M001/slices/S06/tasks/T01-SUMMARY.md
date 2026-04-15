---
id: T01
parent: S06
milestone: M001
provides:
  - BoostRecord PDA struct (LEN=57) with user, slot, bump, boosted_stake_id fields
  - Extended StakeAccount with seed_balance_at_stake, boost_revoked, boosted_stake_id (LEN=134)
  - Extended GlobalState reserved [u64;10] with seed_mint, min_seed_balance, boost_enabled helpers
  - apply_boost_multiplier() math function (exactly 10% boost via BPS)
  - admin_set_seed_mint instruction (sets seed mint + min balance threshold)
  - admin_toggle_boost instruction (enables/disables boost with seed_mint guard)
  - validate_boost_record_pda() security helper
  - 8 boost-specific error variants, 3 boost events
requires: []
affects: []
key_files: []
key_decisions: []
patterns_established: []
observability_surfaces: []
drill_down_paths: []
duration: 8min
verification_result: passed
completed_at: 2026-03-04
blocker_discovered: false
---
# T01: 24-anchor-program-boost-system 01

**# Phase 24 Plan 01: Boost System Foundation Summary**

## What Happened

# Phase 24 Plan 01: Boost System Foundation Summary

**Anchor program boost foundation: BoostRecord PDA (LEN=57), extended GlobalState (reserved [u64;10] with seed_mint/boost_enabled helpers), extended StakeAccount (LEN=134), apply_boost_multiplier (10% BPS), admin_set_seed_mint and admin_toggle_boost instructions**

## Performance

- **Duration:** 8 min
- **Started:** 2026-03-04T17:36:20Z
- **Completed:** 2026-03-04T17:43:58Z
- **Tasks:** 2
- **Files modified:** 13 (11 modified, 3 created)

## Accomplishments

- All 139 Rust unit tests pass with 0 regressions; pre-existing doctest pseudocode issue is out of scope
- cargo build-sbf succeeds cleanly; IDL updated with admin_set_seed_mint and admin_toggle_boost
- Full boost type foundation in place: BoostRecord, extended StakeAccount, extended GlobalState, apply_boost_multiplier, validate_boost_record_pda, 8 error variants, 3 events, 2 admin instructions

## Task Commits

Each task was committed atomically:

1. **Task 1: State accounts, constants, errors, events, and math** - `7f75639` (feat)
2. **Task 2: Admin instructions and lib.rs wiring** - `11d6310` (feat)

## Files Created/Modified

- `programs/helix-staking/src/state/boost_record.rs` - New BoostRecord account struct (LEN=57)
- `programs/helix-staking/src/instructions/admin_set_seed_mint.rs` - Admin instruction: set seed mint + min balance
- `programs/helix-staking/src/instructions/admin_toggle_boost.rs` - Admin instruction: toggle boost enabled flag
- `programs/helix-staking/src/constants.rs` - Added BOOST_RECORD_SEED and BOOST_MULTIPLIER_BPS (1_000)
- `programs/helix-staking/src/error.rs` - Added 8 boost-specific error variants
- `programs/helix-staking/src/events.rs` - Added BoostRegistered, BoostRevoked, BoostedRewardsClaimed events
- `programs/helix-staking/src/instructions/math.rs` - Added apply_boost_multiplier() + 5 unit tests
- `programs/helix-staking/src/state/global_state.rs` - Extended reserved [u64;6]->[u64;10], LEN 243->275, added seed_mint/min_seed_balance/boost_enabled helpers + 6 unit tests
- `programs/helix-staking/src/state/stake_account.rs` - Added 3 boost fields (LEN 117->134), added PHASE3_3_LEN=117
- `programs/helix-staking/src/state/mod.rs` - Exported boost_record module
- `programs/helix-staking/src/security/pda.rs` - Added validate_boost_record_pda() + 4 unit tests
- `programs/helix-staking/src/lib.rs` - Updated reserved init to [0;10], added 2 instruction dispatchers
- `programs/helix-staking/src/instructions/crank_distribution.rs` - Fixed reserved init to [0u64;10] (auto-fix)
- `programs/helix-staking/src/instructions/mod.rs` - Exported admin_set_seed_mint and admin_toggle_boost

## Decisions Made

- Extended GlobalState reserved from [u64;6] to [u64;10]; LEN increases by 32 bytes. On-chain accounts will need reallocation if upgrading live program.
- BoostRecord.boosted_stake_id uses u64::MAX as sentinel for "not yet linked" (matches plan spec).
- admin_set_seed_mint is re-callable (can update seed_mint and min_balance at any time).
- admin_toggle_boost guards enable path with Pubkey::default() check to prevent misconfiguration.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Fixed crank_distribution.rs reserved initialization**
- **Found during:** Task 1 (verifying cargo test)
- **Issue:** `crank_distribution.rs` had a test helper `default_global_state()` initializing `reserved: [0u64; 6]`, which failed to compile after the struct changed to `[u64; 10]`
- **Fix:** Updated initialization to `reserved: [0u64; 10]`
- **Files modified:** `programs/helix-staking/src/instructions/crank_distribution.rs`
- **Verification:** `cargo test -p helix-staking --lib` passes (139/139)
- **Committed in:** `7f75639` (Task 1 commit)

---

**Total deviations:** 1 auto-fixed (1 blocking)
**Impact on plan:** Auto-fix was required for compilation. No scope creep.

## Issues Encountered

- Pre-existing doctest failure in `validate_stake_pda` doc comment (pseudocode example). Confirmed pre-existing by git stash test. Out of scope per deviation rules.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Plan 02 (register_seed_boost, create_stake modification) can proceed immediately
- All type contracts Plan 02 builds against are defined: BoostRecord PDA, extended StakeAccount fields, GlobalState helpers, validate_boost_record_pda, apply_boost_multiplier, all error variants
- Admin must call admin_set_seed_mint then admin_toggle_boost(true) before boost registration works on-chain

---
*Phase: 24-anchor-program-boost-system*
*Completed: 2026-03-04*
