---
phase: 14-deployment-docs-and-env-guards
plan: 01
subsystem: infra
tags: [env-guards, push-notifications, nft-badges, vapid, bubblegum]

# Dependency graph
requires:
  - phase: 12-push-notifications
    provides: use-push-notifications hook with VAPID subscribe path
  - phase: 11-nft-badges
    provides: badges/mint route with module-level env reads
provides:
  - VAPID key null guard in use-push-notifications.ts (throws descriptive error vs crash)
  - Badge mint route module-load safety (no umiPubkey at module level)
  - 503 response with setup instructions when badge collection unconfigured
  - localhost:3001 fallback for NEXT_PUBLIC_INDEXER_URL
  - BADGE_AUTHORITY_SECRET JSON parse error with descriptive 500
  - .env.local.example documenting all 5 missing deployment env vars
affects:
  - deployment
  - push-notifications
  - nft-badges

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Runtime env var guard pattern: read inside handler, check + return 503, then use
    - Nullish coalescing fallback for optional env vars with sensible defaults
    - Try/catch with descriptive error return for JSON parse of secret credentials

key-files:
  created: []
  modified:
    - app/web/hooks/use-push-notifications.ts
    - app/web/app/api/badges/mint/route.ts
    - app/web/.env.local.example

key-decisions:
  - "Runtime env guards inside POST handler (not module level) prevents crash at module load when env vars unset"
  - "NEXT_PUBLIC_INDEXER_URL falls back to localhost:3001 (not 500) — feature degrades gracefully in dev without env set"
  - "Badge collection misconfiguration returns 503 (service unavailable) not 500 — signals setup needed vs server error"

patterns-established:
  - "Env var guard pattern: read var inside handler, guard with descriptive return, then compute derived values"

requirements-completed: [NOTIF-01, BADGE-03, BADGE-04, BADGE-05, BADGE-06, BADGE-07, REF-06]

# Metrics
duration: 2min
completed: 2026-03-02
---

# Phase 14 Plan 01: Env Var Guards and Deployment Docs Summary

**Runtime null guards replacing crash-on-missing-env in push notifications and badge minting, plus complete .env.local.example documenting 5 deployment variables with generation instructions**

## Performance

- **Duration:** 2 min
- **Started:** 2026-03-02T23:09:34Z
- **Completed:** 2026-03-02T23:11:29Z
- **Tasks:** 2
- **Files modified:** 3

## Accomplishments
- ENV-01 closed: VAPID key crash replaced with descriptive throw that surfaces in notification-settings toast via existing try/catch
- ENV-02 closed: Badge mint route no longer calls umiPubkey() at module load; returns 503 with setup script instructions when collection unconfigured
- ENV-03 closed: NEXT_PUBLIC_INDEXER_URL falls back to localhost:3001 instead of returning 500
- BADGE_AUTHORITY_SECRET JSON parse failure now returns descriptive 500 error instead of opaque JS exception
- All 5 missing env vars documented in .env.local.example with generation commands and security notes

## Task Commits

Each task was committed atomically:

1. **Task 1: Add runtime env var guards to push hook and badge mint route** - `59cdf5b` (feat)
2. **Task 2: Document all missing env vars in .env.local.example** - `91f4e79` (docs)

## Files Created/Modified
- `app/web/hooks/use-push-notifications.ts` - Added VAPID key null guard; removed `!` non-null assertion; throws descriptive error propagated to UI toast
- `app/web/app/api/badges/mint/route.ts` - Removed module-level umiPubkey() calls; added 503 guard for badge env vars inside POST handler; localhost:3001 fallback; try/catch on BADGE_AUTHORITY_SECRET parse
- `app/web/.env.local.example` - Added 5 new env var entries: NEXT_PUBLIC_VAPID_PUBLIC_KEY, BADGE_COLLECTION_ADDRESS, BADGE_MERKLE_TREE_ADDRESS, BADGE_AUTHORITY_SECRET, NEXT_PUBLIC_INDEXER_URL

## Decisions Made
- Runtime env guards placed inside POST handler (not module level) to prevent crash at module load when env vars unset — this is the critical fix for ENV-02
- NEXT_PUBLIC_INDEXER_URL uses nullish coalescing (`?? 'http://localhost:3001'`) for zero-config local dev experience
- Badge collection misconfiguration returns 503 (Service Unavailable) not 500 (Internal Server Error) — semantically correct: server is running but feature not configured
- Pre-existing TypeScript errors in unchanged portions of mint/route.ts are out of scope (getAssetsByOwner, implicit any from DAS types — pre-existed in Phase 11)

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
- Pre-existing TypeScript errors in badge mint route (getAssetsByOwner, implicit any for DAS asset types) are not related to this task's changes. Logged as deferred items — they were present in the original Phase 11 code.

## User Setup Required
None - no external service configuration required beyond what is already documented in the new .env.local.example entries.

## Next Phase Readiness
- All ENV-01, ENV-02, ENV-03 gaps from v1.1 milestone audit are now closed
- Phase 14 Plan 02 (deployment docs) can proceed
- Deployments missing badge collection setup will now receive clear 503 + setup instructions instead of opaque crashes

## Self-Check: PASSED

- FOUND: app/web/hooks/use-push-notifications.ts
- FOUND: app/web/app/api/badges/mint/route.ts
- FOUND: app/web/.env.local.example
- FOUND: .planning/phases/14-deployment-docs-and-env-guards/14-01-SUMMARY.md
- Commit 59cdf5b: feat(14-01) - verified in git log
- Commit 91f4e79: docs(14-01) - verified in git log

---
*Phase: 14-deployment-docs-and-env-guards*
*Completed: 2026-03-02*
