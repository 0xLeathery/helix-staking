---
phase: 05-light-indexer-service
plan: 03
subsystem: api
tags: [fastify, cors, drizzle-orm, zod, pagination, rest-api, pino]

# Dependency graph
requires:
  - phase: 05-01-indexer-infrastructure-scaffold
    provides: "Drizzle schema, DB client, RPC client, env config, logger"
provides:
  - "Fastify REST API server with CORS and graceful shutdown"
  - "Health check endpoint with DB connectivity and indexer lag monitoring"
  - "Aggregate statistics endpoint (total stakes, distributions, claims)"
  - "Paginated distribution history with chart-optimized variant"
  - "Paginated stake/unstake events filterable by user address"
  - "Paginated claim/reward/BPD events filterable by claimer/user address"
affects: [06-analytics, app-web-dashboard]

# Tech tracking
tech-stack:
  added: []
  patterns: [fastify-plugin-routes, zod-query-validation, parallel-count-queries, pagination-response-shape]

key-files:
  created:
    - services/indexer/src/api/index.ts
    - services/indexer/src/api/routes/health.ts
    - services/indexer/src/api/routes/stats.ts
    - services/indexer/src/api/routes/distributions.ts
    - services/indexer/src/api/routes/stakes.ts
    - services/indexer/src/api/routes/claims.ts
  modified: []

key-decisions:
  - "FastifyPluginCallback pattern for route registration (synchronous done() callback)"
  - "Zod coerce for query param validation (page/limit parsed from string to number)"
  - "Parallel Promise.all for data + count queries to minimize endpoint latency"
  - "Chart endpoint returns all distributions without pagination (expected <5000 rows for years of data)"
  - "Empty results return data: [] with total: 0, not 404"
  - "SQL type union for optional WHERE clause (SQL | undefined passed to .where())"

patterns-established:
  - "Pagination response shape: { data: [...], pagination: { page, limit, total, totalPages } }"
  - "Query param validation with Zod coerce for type-safe integer parsing from URL strings"
  - "Optional user/claimer filter pattern using eq() with conditional WHERE"

# Metrics
duration: 3min
completed: 2026-02-08
---

# Phase 5 Plan 03: REST API Implementation Summary

**Fastify REST API with 9 endpoints: health check with lag detection, aggregate stats, paginated distribution/stake/claim history with user filters, and chart-optimized distribution data**

## Performance

- **Duration:** 3 min
- **Started:** 2026-02-08T07:22:04Z
- **Completed:** 2026-02-08T07:24:51Z
- **Tasks:** 2
- **Files created:** 6

## Accomplishments
- Built Fastify server entrypoint with CORS, global error handler, and SIGTERM/SIGINT graceful shutdown
- Implemented health check that verifies DB connectivity and calculates indexer lag (503 if >1000 slots behind)
- Created aggregate stats endpoint pulling counts from all event tables plus latest distribution data
- Built 7 paginated data endpoints covering distributions, stakes, unstakes, token claims, reward claims, and BPD events
- Added chart-optimized distribution endpoint returning all records in ascending order for time-series visualization

## Task Commits

Each task was committed atomically:

1. **Task 1: Create Fastify server with health check and aggregate stats endpoints** - `52a98be` (feat)
2. **Task 2: Create distribution, stake, and claim history endpoints** - `1a7f76f` (feat)

## Files Created/Modified
- `services/indexer/src/api/index.ts` - Fastify server entrypoint with CORS, error handler, route registration, graceful shutdown
- `services/indexer/src/api/routes/health.ts` - GET /health with DB check, checkpoint query, RPC slot, lag calculation
- `services/indexer/src/api/routes/stats.ts` - GET /api/stats with parallel count queries and latest distribution
- `services/indexer/src/api/routes/distributions.ts` - GET /api/distributions (paginated) and GET /api/distributions/chart (all, ASC)
- `services/indexer/src/api/routes/stakes.ts` - GET /api/stakes and GET /api/unstakes with optional user filter
- `services/indexer/src/api/routes/claims.ts` - GET /api/claims/tokens, GET /api/claims/rewards, GET /api/claims/bpd

## Decisions Made
- **FastifyPluginCallback pattern:** Used synchronous callback-based plugins (done()) for simpler route registration without async complications
- **Parallel count queries:** All paginated endpoints run data query and count query in parallel via Promise.all to minimize latency
- **Chart endpoint without pagination:** /api/distributions/chart returns all rows because daily distribution data grows at most 365 rows/year
- **SQL | undefined for optional filters:** Drizzle .where(undefined) is a no-op, allowing clean conditional filtering without branching query builders
- **Zod coerce for query params:** URL query parameters arrive as strings; z.coerce.number() handles the conversion with validation

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed FastifyError typing in global error handler**
- **Found during:** Task 1 (Fastify server entrypoint)
- **Issue:** TypeScript strict mode rejects `error` as `unknown` in setErrorHandler callback; accessing error.message/statusCode/name requires proper typing
- **Fix:** Imported `FastifyError` type from fastify and annotated the error parameter; used nullish coalescing (??) instead of || for statusCode
- **Files modified:** `services/indexer/src/api/index.ts`
- **Verification:** `npx tsc --noEmit --skipLibCheck` compiles cleanly (only pre-existing worker/processor.ts error)
- **Committed in:** `52a98be` (Task 1 commit)

---

**Total deviations:** 1 auto-fixed (1 bug)
**Impact on plan:** Type annotation fix necessary for TypeScript strict mode compilation. No scope creep.

## Issues Encountered
- Pre-existing TypeScript error in `worker/processor.ts` (from plan 05-02) -- not related to API implementation, excluded from verification

## User Setup Required
None - no external service configuration required. API uses same DATABASE_URL and RPC_URL as the indexer worker.

## Next Phase Readiness
- All 3 plans in Phase 5 complete (infrastructure, worker, API)
- REST API ready to serve indexed data to the Phase 4 dashboard and future Phase 6 analytics
- 9 endpoints available: /health, /api/stats, /api/distributions, /api/distributions/chart, /api/stakes, /api/unstakes, /api/claims/tokens, /api/claims/rewards, /api/claims/bpd

## Self-Check: PASSED

- All 6 created files verified present
- Commit `52a98be` (Task 1) verified in git log
- Commit `1a7f76f` (Task 2) verified in git log
- `npx tsc --noEmit --skipLibCheck` compiles cleanly (excluding pre-existing worker error)
- 9 route endpoints confirmed across 5 route files
- Pagination pattern confirmed in distributions, stakes, and claims routes

---
*Phase: 05-light-indexer-service*
*Completed: 2026-02-08*
