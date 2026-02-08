---
phase: 05-light-indexer-service
plan: 01
subsystem: infra
tags: [drizzle-orm, neon-postgres, fastify, pino, anchor, p-retry, zod, solana, typescript]

# Dependency graph
requires:
  - phase: 03.3-post-audit-security-hardening
    provides: "Final program IDL with all 11 events and security fixes"
provides:
  - "@helix/indexer package with installable dependencies"
  - "Drizzle ORM schema for 12 tables (11 events + checkpoints)"
  - "Typed TypeScript interfaces for all 11 program events"
  - "Retryable RPC client with exponential backoff"
  - "Anchor event decoder parsing program logs"
  - "Zod-validated environment configuration"
  - "Structured Pino logger with dev pretty-print"
affects: [05-02-polling-worker, 05-03-rest-api]

# Tech tracking
tech-stack:
  added: [fastify, "@fastify/cors", drizzle-orm, "@neondatabase/serverless", pino, pino-pretty, p-retry, zod, vitest, tsx, drizzle-kit]
  patterns: [lazy-db-initialization, proxy-pattern-for-db-client, retryable-rpc-wrapper, zod-env-validation]

key-files:
  created:
    - services/indexer/package.json
    - services/indexer/tsconfig.json
    - services/indexer/drizzle.config.ts
    - services/indexer/vitest.config.ts
    - services/indexer/.env.example
    - services/indexer/src/lib/env.ts
    - services/indexer/src/lib/logger.ts
    - services/indexer/src/db/schema.ts
    - services/indexer/src/db/client.ts
    - services/indexer/src/lib/rpc.ts
    - services/indexer/src/lib/anchor.ts
    - services/indexer/src/types/events.ts
  modified: []

key-decisions:
  - "Lazy DB initialization via Proxy to avoid import-time env validation failures in tests"
  - "Token-value fields (amount, tShares, shareRate) stored as text to avoid JS precision loss; slot/day/count fields as bigint mode number"
  - "Finality type (confirmed/finalized) instead of Commitment for getParsedTransaction to match Solana API constraints"
  - "Logger reads LOG_LEVEL directly from process.env (not env.ts) to avoid circular dependency"
  - "Anchor IDL loaded via fs.readFileSync + JSON.parse for ESM compatibility (no import assertions)"

patterns-established:
  - "Shared columns pattern: id/signature/slot/createdAt reused across all event tables"
  - "Lazy singleton via Proxy for database client allowing test-time overrides"
  - "Retryable wrapper pattern using p-retry with exponential backoff for RPC calls"

# Metrics
duration: 4min
completed: 2026-02-08
---

# Phase 5 Plan 01: Indexer Infrastructure Scaffold Summary

**Drizzle ORM schema for 12 tables (11 events + checkpoints), retryable RPC client with p-retry, Anchor event decoder, and Zod-validated env config**

## Performance

- **Duration:** 4 min
- **Started:** 2026-02-08T07:14:21Z
- **Completed:** 2026-02-08T07:18:12Z
- **Tasks:** 2
- **Files created:** 12

## Accomplishments
- Scaffolded @helix/indexer package with all dependencies (fastify, drizzle-orm, pino, anchor, p-retry)
- Created Drizzle pgTable schemas for all 11 program events plus a checkpoints table with proper indexes
- Built retryable RPC client wrapper with 5-retry exponential backoff and structured error logging
- Created Anchor event decoder that loads IDL and parses program logs into typed events
- Defined typed TypeScript interfaces for all 11 events with discriminated union type

## Task Commits

Each task was committed atomically:

1. **Task 1: Scaffold indexer project with dependencies and configuration** - `03cb622` (chore)
2. **Task 2: Create Drizzle schema, database client, RPC wrapper, Anchor decoder, and event types** - `7c99ff6` (feat)

**Plan metadata:** pending (docs: complete indexer infrastructure scaffold)

## Files Created/Modified
- `services/indexer/package.json` - @helix/indexer package manifest with all deps
- `services/indexer/tsconfig.json` - ES2022/ESNext/bundler TypeScript config
- `services/indexer/drizzle.config.ts` - Drizzle Kit config pointing to schema and Neon DB
- `services/indexer/vitest.config.ts` - Vitest config with path aliases matching tsconfig
- `services/indexer/.env.example` - Environment variable template
- `services/indexer/src/lib/env.ts` - Zod-validated env config (DATABASE_URL, RPC_URL, PROGRAM_ID, PORT, etc.)
- `services/indexer/src/lib/logger.ts` - Pino structured logger with pino-pretty in dev mode
- `services/indexer/src/db/schema.ts` - 12 Drizzle pgTable schemas with indexes
- `services/indexer/src/db/client.ts` - Neon serverless pool + Drizzle ORM instance (lazy init)
- `services/indexer/src/lib/rpc.ts` - Retryable Solana RPC client with p-retry
- `services/indexer/src/lib/anchor.ts` - Anchor event decoder loading IDL via fs.readFileSync
- `services/indexer/src/types/events.ts` - TypeScript interfaces for all 11 program events

## Decisions Made
- **Lazy DB initialization:** Database client uses Proxy pattern for lazy initialization to avoid import-time env validation failures during tests
- **Text for token values:** Fields like amount, tShares, shareRate stored as `text` type in Postgres (not bigint) since they can exceed JavaScript's Number.MAX_SAFE_INTEGER
- **Finality over Commitment:** getParsedTransaction uses `Finality` type (confirmed/finalized) instead of broader `Commitment` type to match Solana API constraints
- **Direct process.env for logger:** Logger reads LOG_LEVEL from process.env directly rather than importing env.ts to avoid circular dependency
- **fs.readFileSync for IDL:** Anchor IDL loaded via readFileSync + JSON.parse instead of ESM JSON import assertions for broad Node.js version compatibility

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed TypeScript type errors in RPC client**
- **Found during:** Task 2 (RPC wrapper creation)
- **Issue:** `pRetry.FailedAttemptError` namespace access doesn't work with ESM default import; `Commitment` type includes 'max' which is invalid for `getParsedTransaction` (expects `Finality`)
- **Fix:** Changed to named import `{ type FailedAttemptError }` from p-retry; switched from `Commitment` to `Finality` type for getParsedTransaction commitment parameter
- **Files modified:** `services/indexer/src/lib/rpc.ts`
- **Verification:** `npx tsc --noEmit --skipLibCheck` compiles cleanly
- **Committed in:** `7c99ff6` (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (1 bug)
**Impact on plan:** Type fix necessary for compilation. No scope creep.

## Issues Encountered
None beyond the type error auto-fix above.

## User Setup Required
None - no external service configuration required. Database connection will be needed when running the service (documented in .env.example).

## Next Phase Readiness
- All shared infrastructure modules ready for Plan 02 (polling worker) and Plan 03 (REST API)
- Schema ready for `drizzle-kit generate` once DATABASE_URL is configured
- Event types, RPC client, and Anchor decoder can be imported by worker and API modules

## Self-Check: PASSED

- All 12 created files verified present
- Commit `03cb622` (Task 1) verified in git log
- Commit `7c99ff6` (Task 2) verified in git log
- `npx tsc --noEmit --skipLibCheck` compiles cleanly
- 12 pgTable definitions confirmed in schema.ts
- 15 exports confirmed in events.ts

---
*Phase: 05-light-indexer-service*
*Completed: 2026-02-08*
