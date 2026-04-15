---
id: S07
parent: M001
milestone: M001
provides:
  - executeBoostCheck() sweep function in services/crank/src/boostCheck.ts
  - 6-hour cron schedule for boost revocation in services/crank/src/index.ts
  - SEED_TOKEN_PROGRAM_ID env var for seed token program configuration
  - Already-revoked idempotency LiteSVM test for update_boost_status
requires: []
affects: []
key_files: []
key_decisions:
  - "SEED_TOKEN_PROGRAM_ID defaults to standard SPL Token (pump.fun tokens) but is overridable to Token-2022 for tests/devnet"
  - "result.sent counts all update_boost_status transactions sent — cannot distinguish no-ops from revocations without log parsing (acceptable for v3.0 monitoring)"
  - "LiteSVM AlreadyProcessed rejection requires client.expireBlockhash() between identical transactions — documented in test with comment"
patterns_established:
  - "Boost check sweep: enumerate all BoostRecord PDAs via program.account.boostRecord.all(), filter unlinked via u64::MAX sentinel"
  - "getSeedMintFromGlobalState: reconstruct PublicKey from 4 LE u64s in reserved[2..5]"
observability_surfaces: []
drill_down_paths: []
duration: 7min
verification_result: passed
completed_at: 2026-03-04
blocker_discovered: false
---
# S07: Crank Boost Monitoring

**# Phase 25 Plan 01: Crank Boost Monitoring Summary**

## What Happened

# Phase 25 Plan 01: Crank Boost Monitoring Summary

**6-hour boost-check cron job added to crank service: sweeps all BoostRecord PDAs and calls update_boost_status for active boosted stakes, with SPL-token ATA derivation and per-transaction fresh blockhash**

## Performance

- **Duration:** 7 min
- **Started:** 2026-03-04T05:23:13Z
- **Completed:** 2026-03-04T05:30:11Z
- **Tasks:** 3 (Task 0, Task 1, Task 2)
- **Files modified:** 5

## Accomplishments

- Added `executeBoostCheck()` sweep function (242 lines) that enumerates all BoostRecord PDAs, filters to linked/active/non-revoked, and calls `update_boost_status` for each
- Wired 6-hour cron schedule (`'0 0,6,12,18 * * *'`) into the crank service startup IIFE via `boostCheckTick()`
- Added LiteSVM idempotency test confirming `update_boost_status` is a true no-op when `boost_revoked == true` (second call must not error)
- Added `@solana/spl-token` dependency and `SEED_TOKEN_PROGRAM_ID` env var (defaults to standard SPL Token, configurable for Token-2022)

## Task Commits

Each task was committed atomically:

1. **Task 0: Add already-revoked idempotency test** - `6dcde82` (test)
2. **Task 1: Create boostCheck.ts and add spl-token dependency** - `458490e` (feat)
3. **Task 2: Wire boost check into crank index.ts** - `41b2c7b` (feat)

## Files Created/Modified

- `services/crank/src/boostCheck.ts` - Created: `executeBoostCheck()` sweep function with `BoostCheckResult` interface
- `services/crank/src/index.ts` - Modified: added `executeBoostCheck` import, `BOOST_CHECK_TIMES` constant, `boostCheckTick()` function, cron registration
- `services/crank/src/env.ts` - Modified: added `SEED_TOKEN_PROGRAM_ID` with SPL Token default
- `services/crank/package.json` - Modified: added `@solana/spl-token@^0.4.14` dependency
- `tests/litesvm/boost.test.ts` - Modified: added "is no-op when already revoked" test case

## Decisions Made

- **SEED_TOKEN_PROGRAM_ID default:** SPL Token (`TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA`) — pump.fun tokens are standard SPL Token. Token-2022 override available via env var for devnet/test scenarios.
- **result.sent semantics:** Counts transactions sent (not revocations confirmed). The on-chain instruction is a no-op when balance >= snapshot or already revoked, but we cannot distinguish without parsing logs. Acceptable for v3.0 monitoring purposes.
- **LiteSVM duplicate rejection:** Added `client.expireBlockhash()` between the two `updateBoostStatus` calls in the idempotency test. LiteSVM maintains a transaction history and rejects identical transactions with error code 6 (AlreadyProcessed). This is LiteSVM-specific and does not affect mainnet behavior.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Added client.expireBlockhash() to prevent AlreadyProcessed in LiteSVM**
- **Found during:** Task 0 (already-revoked idempotency test)
- **Issue:** LiteSVM rejects second identical transaction with error 6 (AlreadyProcessed) when transaction history is enabled and blockhash hasn't changed between calls. The two `updateBoostStatus` calls with identical accounts produce identical serialized transactions.
- **Fix:** Added `client.expireBlockhash()` between the two calls — expires the current blockhash so the second call gets a new one, avoiding the duplicate transaction rejection.
- **Files modified:** tests/litesvm/boost.test.ts
- **Verification:** All 4 update_boost_status tests pass (3 existing + 1 new)
- **Committed in:** 6dcde82 (Task 0 commit)

---

**Total deviations:** 1 auto-fixed (Rule 1 - bug in LiteSVM test environment)
**Impact on plan:** Auto-fix necessary for test to work in LiteSVM's transaction-history environment. The on-chain behavior (idempotency on second call) is correctly verified. No scope creep.

## Issues Encountered

- LiteSVM's `sendWithErr` reports error code "6" with empty logs when a transaction is rejected as AlreadyProcessed. The error format from anchor-litesvm wraps this as `{ transactionMessage: "6", logs: [] }`. Investigated by checking LiteSVM source code and the `withTransactionHistory`/`expireBlockhash` APIs.

## User Setup Required

New optional env var for the crank service:

```bash
# Optional: defaults to SPL Token (for pump.fun seed tokens)
# Override to Token-2022 if your seed token uses Token-2022
SEED_TOKEN_PROGRAM_ID=TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA
```

No other external service configuration required.

## Next Phase Readiness

- Boost check crank is ready to deploy — will sweep every 6 hours at UTC 00:00, 06:00, 12:00, 18:00
- Phase 26 (frontend boost UI) can rely on `boost_revoked` field being proactively set within 6 hours of seed balance drop
- Phase 27 mainnet launch: `SEED_TOKEN_PROGRAM_ID` must be set to the production seed token's program (SPL Token for pump.fun graduates)
- Blocker noted in STATE.md: pump.fun bonding curve account layout is medium confidence — devnet spike recommended before Phase 25 poller implementation

---
*Phase: 25-crank-boost-monitoring*
*Completed: 2026-03-04*
