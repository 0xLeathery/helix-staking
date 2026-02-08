---
phase: 05-light-indexer-service
plan: 02
subsystem: infra
tags: [polling-worker, anchor-events, drizzle-orm, checkpoint, graceful-shutdown, solana, typescript]

# Dependency graph
requires:
  - phase: 05-light-indexer-service
    plan: 01
    provides: "Drizzle schema, RPC client, Anchor decoder, env config, logger"
provides:
  - "Long-running polling worker that indexes all 11 program event types"
  - "Checkpoint-based resumable indexing with per-signature granularity"
  - "Event processor routing decoded events to correct Postgres tables"
  - "Graceful shutdown with 30s timeout on SIGTERM/SIGINT"
affects: [05-03-rest-api]

# Tech tracking
tech-stack:
  added: []
  patterns: [per-signature-checkpointing, idempotent-inserts-via-onConflictDoNothing, oldest-first-signature-processing, isProcessing-guard-for-interval-overlap, graceful-shutdown-with-timeout]

key-files:
  created:
    - services/indexer/src/worker/checkpoint.ts
    - services/indexer/src/worker/poller.ts
    - services/indexer/src/worker/decoder.ts
    - services/indexer/src/worker/processor.ts
    - services/indexer/src/worker/index.ts
  modified: []

key-decisions:
  - "Per-signature checkpoint updates (not per-batch) for granular crash recovery"
  - "Signatures reversed to oldest-first for chronological processing and consistent checkpoint state"
  - "Individual signature failures do not abort the batch -- logged and skipped"
  - "Gap detection for InflationDistributed is informational-only (warn log, no corrective action)"
  - "BN values converted via toString(), Pubkeys via toBase58(), byte arrays via Buffer.from().toString('hex')"

patterns-established:
  - "Per-signature checkpointing: update checkpoint after each signature, not at batch end, for crash recovery"
  - "Idempotent event inserts: onConflictDoNothing on signature unique constraint handles duplicate processing"
  - "isProcessing guard: prevents overlapping poll ticks when processing takes longer than interval"
  - "Graceful shutdown pattern: clear interval, wait for in-flight batch (30s timeout), close pool, exit"

# Metrics
duration: 3min
completed: 2026-02-08
---

# Phase 5 Plan 02: Polling Worker Implementation Summary

**Long-running polling worker with per-signature checkpointing, 11-event-type routing to Postgres, and graceful SIGTERM shutdown**

## Performance

- **Duration:** 3 min
- **Started:** 2026-02-08T07:21:31Z
- **Completed:** 2026-02-08T07:24:12Z
- **Tasks:** 2
- **Files created:** 5

## Accomplishments
- Built checkpoint management module with Drizzle upsert for resumable indexing across restarts
- Implemented signature poller using getSignaturesForAddress with `until` cursor for correct pagination
- Created event decoder that fetches parsed transactions and extracts Anchor events from log messages
- Implemented event processor routing all 11 program event types to their correct Postgres tables with idempotent inserts
- Built worker entrypoint with setInterval polling loop, per-signature checkpointing, and graceful shutdown

## Task Commits

Each task was committed atomically:

1. **Task 1: Implement checkpoint management, signature poller, and event decoder** - `02742ac` (feat)
2. **Task 2: Implement event processor and worker entrypoint with polling loop** - `d9f9cfe` (feat)

**Plan metadata:** pending (docs: complete polling worker implementation)

## Files Created/Modified
- `services/indexer/src/worker/checkpoint.ts` - getCheckpoint/updateCheckpoint with Drizzle onConflictDoUpdate upsert
- `services/indexer/src/worker/poller.ts` - fetchNewSignatures with RPC client, `until` cursor, oldest-first ordering
- `services/indexer/src/worker/decoder.ts` - decodeEventsFromSignature with graceful error handling for pruned/failed txs
- `services/indexer/src/worker/processor.ts` - processEvent with switch/case routing 11 events to 11 tables, gap detection
- `services/indexer/src/worker/index.ts` - Worker entrypoint with polling loop, shutdown handlers, batch processing

## Decisions Made
- **Per-signature checkpointing:** Checkpoint updated after each individual signature (not at batch end) to minimize data loss on crash -- at most 1 transaction's events lost
- **Oldest-first processing:** Signatures reversed from RPC's newest-first to chronological order for consistent checkpoint state
- **Non-blocking failures:** Individual signature decode/process errors are logged and skipped; the batch continues to next signature
- **Gap detection is advisory:** InflationDistributed gap detection logs warnings but takes no corrective action -- the crank may legitimately skip days
- **Value conversion helpers:** Centralized toStr/toNum helpers handle BN objects, PublicKeys, byte arrays, and primitive types uniformly

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed empty .where() call in gap detection query**
- **Found during:** Task 2 (processor.ts gap detection)
- **Issue:** The `.where()` call in `detectInflationGap` had no arguments (just a comment), causing TypeScript error TS2554
- **Fix:** Removed the empty `.where()` clause -- query only needs `.orderBy(desc(day)).limit(2)` to get the 2 most recent distributions
- **Files modified:** `services/indexer/src/worker/processor.ts`
- **Verification:** `npx tsc --noEmit --skipLibCheck` compiles cleanly
- **Committed in:** `d9f9cfe` (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (1 bug)
**Impact on plan:** Type error fix necessary for compilation. No scope creep.

## Issues Encountered
None beyond the auto-fix above.

## User Setup Required
None - worker uses the same DATABASE_URL and RPC_URL configured in .env.example from Plan 01.

## Next Phase Readiness
- Polling worker ready for 24/7 operation once DATABASE_URL and RPC_URL are configured
- Worker can be started via `npm run dev:worker` (uses tsx src/worker/index.ts)
- All event tables populated by worker are ready for Plan 03 (REST API) to query
- Checkpoint table enables crash recovery and monitoring of indexing progress

## Self-Check: PASSED

- All 5 created files verified present
- Commit `02742ac` (Task 1) verified in git log
- Commit `d9f9cfe` (Task 2) verified in git log
- `npx tsc --noEmit --skipLibCheck` compiles cleanly
- 11 case statements confirmed in processor.ts
- 11 onConflictDoNothing calls confirmed in processor.ts
- SIGTERM handler confirmed in index.ts
- setInterval polling loop confirmed in index.ts
- onConflictDoUpdate upsert confirmed in checkpoint.ts
- getSignaturesForAddress call confirmed in poller.ts
- parseEventsFromLogs usage confirmed in decoder.ts

---
*Phase: 05-light-indexer-service*
*Completed: 2026-02-08*
