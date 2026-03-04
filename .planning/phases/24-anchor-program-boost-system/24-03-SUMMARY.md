---
phase: 24-anchor-program-boost-system
plan: "03"
subsystem: blockchain
tags: [anchor, solana, rust, token-2022, litesvm, boost, claim_rewards, tdd]

requires:
  - phase: 24-anchor-program-boost-system-01
    provides: apply_boost_multiplier in math.rs, BoostRevoked/BoostedRewardsClaimed events, seed_balance_at_stake/boost_revoked fields in StakeAccount
  - phase: 24-anchor-program-boost-system-02
    provides: register_seed_boost, update_boost_status, create_stake boost auto-link, findBoostRecordPDA/createSeedMintAndFund utils

provides:
  - Modified claim_rewards: applies 10% boost multiplier with live seed ATA balance check
  - Permanent revocation on balance drop: boost_revoked = true set before CPI mint (CEI pattern)
  - BoostedRewardsClaimed event emitted on successful boost application
  - BoostRevoked event emitted on revocation during claim
  - Complete LiteSVM integration tests for BOOST-04, BOOST-05, BOOST-06, BOOST-07

affects: [25-boost-crank, frontend-claim-rewards, analytics]

tech-stack:
  added: []
  patterns:
    - "Boost check inserts between loyalty multiplier and BPD bonus: (loyalty_adjusted * 1.10) + bpd"
    - "Live seed balance read via remaining_accounts[0] data bytes at offset 64"
    - "Check-Effects-Interactions: boost_revoked = true before CPI mint"
    - "Local variable copies (seed_balance_at_stake, boost_revoked, bpd_bonus) before mutable borrow to satisfy Rust borrow checker"
    - "Client opt-in boost: omit seed ATA from remaining_accounts = base rewards, include = boost attempt"

key-files:
  created: []
  modified:
    - programs/helix-staking/src/instructions/claim_rewards.rs
    - tests/litesvm/boost.test.ts

key-decisions:
  - "drop(stake) -> let _ = stake: reference drops are no-ops in Rust; local copies are the correct borrow checker solution"
  - "BPD bonus not amplified by boost: boost_adjusted + bpd (not (loyalty_adjusted + bpd) * 1.10)"
  - "Client omitting seed ATA gives base rewards with no error and no revocation -- graceful degradation"
  - "Revocation writes boost_revoked before CPI mint (CEI) -- prevents any double-revocation edge cases"

patterns-established:
  - "Live ATA balance read: seed_ata_info.try_borrow_data()? with data[64..72] LE u64 parse"
  - "Boost event pair: RewardsClaimed always emitted; BoostedRewardsClaimed only if boost_applied == true"
  - "TDD: program modified in Task 1 -> tests written in Task 2 -> straight to GREEN (no RED needed since implementation precedes tests)"

requirements-completed: [BOOST-04, BOOST-05, BOOST-06, BOOST-07]

duration: 22min
completed: 2026-03-04
---

# Phase 24 Plan 03: claim_rewards Boost Check and Integration Tests Summary

**claim_rewards with live seed ATA balance check: 10% boost applied after loyalty before BPD, permanent revocation on balance drop (CEI-safe), 8 new LiteSVM tests verifying BOOST-04 through BOOST-07**

## Performance

- **Duration:** 22 min
- **Started:** 2026-03-04T04:18:20Z
- **Completed:** 2026-03-04T04:40:00Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments

- Modified claim_rewards to apply 10% boost multiplier via live seed ATA balance read when remaining_accounts[0] is provided
- Boost revocation is permanent: sets boost_revoked = true before CPI mint (Check-Effects-Interactions), emits BoostRevoked event
- BPD bonus is additive after boost (not amplified): formula is `(loyalty_adjusted * 1.10) + bpd_bonus`
- 8 new LiteSVM integration tests; 26 total boost tests; 191 full suite tests -- zero regressions
- BOOST-04, BOOST-05, BOOST-06, BOOST-07 all verified by passing tests

## Task Commits

Each task was committed atomically:

1. **Task 1: Modify claim_rewards with boost check and permanent revocation** - `d444079` (feat)
2. **Task 2: LiteSVM integration tests for BOOST-04 through BOOST-07** - `1f498c2` (feat)

**Plan metadata:** (docs commit to follow)

## Files Created/Modified

- `programs/helix-staking/src/instructions/claim_rewards.rs` - Added boost check block between loyalty multiplier and BPD bonus; reads remaining_accounts[0] seed ATA balance; applies apply_boost_multiplier or sets boost_revoked; emits BoostRevoked and BoostedRewardsClaimed events
- `tests/litesvm/boost.test.ts` - Added 8 new integration tests in 5 describe blocks: claim_rewards boost (BOOST-06 mints more, ordering, no-ATA fallback), claim_rewards boost revocation (BOOST-04), revocation permanent (BOOST-05), headroom at claim time (BOOST-07), non-boosted stake regression

## Decisions Made

- **Local copies before mutable borrow:** `seed_balance_at_stake`, `boost_revoked`, and `bpd_bonus_pending` are copied to local `let` bindings before the boost check block so Rust's borrow checker doesn't complain when we take `&mut ctx.accounts.stake_account` inside the revocation branch. `drop(stake)` generates a warning (reference drop is a no-op); `let _ = stake` suppresses it correctly.
- **BPD not amplified by boost:** Formula is `(loyalty_adjusted * 1.10) + bpd_bonus`, not `(loyalty_adjusted + bpd_bonus) * 1.10`. BPD is an additive bonus, separate from APY boost, per user decision locked in STATE.md.
- **Client opt-in via remaining_accounts:** If no seed ATA is passed in remaining_accounts, the user gets base (non-boosted) rewards with no error and no revocation. This allows existing clients to continue working without modification.

## Deviations from Plan

None - plan executed exactly as written. The borrow checker considerations noted in the plan were handled as specified (local variable copies).

## Issues Encountered

None. The program compiled cleanly on first attempt after the borrow checker pattern was applied correctly.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- All 7 BOOST requirements (BOOST-01 through BOOST-07) now have passing LiteSVM integration tests
- Phase 24 is functionally complete: boost registration, create_stake auto-link, update_boost_status, and claim_rewards boost check are all live
- Phase 25 (boost crank) can now call update_boost_status permissionlessly, and users claiming will get live boost enforcement
- No blockers for Phase 25

---
*Phase: 24-anchor-program-boost-system*
*Completed: 2026-03-04*
