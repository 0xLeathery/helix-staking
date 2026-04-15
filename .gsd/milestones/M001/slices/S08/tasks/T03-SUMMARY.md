---
id: T03
parent: S08
milestone: M001
provides: []
requires: []
affects: []
key_files: []
key_decisions: []
patterns_established: []
observability_surfaces: []
drill_down_paths: []
duration: 
verification_result: passed
completed_at: 
blocker_discovered: false
---
# T03: 26-frontend-boost-ui 03

**# Phase 26 Plan 03: BoostRevoked Notification Pipeline Summary**

## What Happened

# Phase 26 Plan 03: BoostRevoked Notification Pipeline Summary

BoostRevoked event-driven push notification pipeline with user opt-out preference, from DB migration through indexer processor to frontend settings toggle.

## What Was Built

### Task 1: Indexer pipeline (add5b0d)

**Migration `004_boost_notifications.sql`:**
- Adds `notify_boost_revoked BOOLEAN NOT NULL DEFAULT TRUE` column to `push_subscriptions`
- Creates `boost_revoked_events` deduplication table with `signature UNIQUE` constraint
- Adds `boost_revoked_events_user_idx` index on `user_wallet`

**Schema `schema.ts`:**
- Added `notifyBoostRevoked` column to `pushSubscriptions` Drizzle table
- Added `boostRevokedEvents` table definition matching the SQL migration

**`push.ts`:**
- Extended `dispatchToSubscribers` `preferenceKey` union to include `'notifyBoostRevoked'`

**`notification-scheduler.ts`:**
- Added `sendBoostRevokedNotification(wallet: string, stakeId: number): Promise<void>`
- Checks `isPushEnabled()`, builds payload with stake ID in body/tag/data, dispatches via `dispatchToSubscribers([wallet], payload, 'notifyBoostRevoked')`

**`processor.ts`:**
- Added `BoostRevoked` case to event switch
- Imports `boostRevokedEvents` from schema and `sendBoostRevokedNotification` from scheduler
- Pattern: idempotent `INSERT ... ON CONFLICT DO NOTHING` then `await sendBoostRevokedNotification(...)`

### Task 2: Frontend UI (17ddf18)

**`app/web/lib/api.ts`:**
- Added `notifyBoostRevoked: boolean` to `PushPreferences` interface

**`app/web/components/dashboard/notification-settings.tsx`:**
- Added `notifyBoostRevoked: true` to `DEFAULT_PREFERENCES`
- Added `ToggleRow` with label "Boost Revoked" and description "Get notified if your seed boost is revoked for any stake"

**`app/web/__tests__/components/notification-settings.test.tsx`:**
- Updated `getPushPreferences` mock to include `notifyBoostRevoked: true`
- Updated "4 toggle rows" test to "5 toggle rows" with Boost Revoked assertion
- Updated switch count assertion from 4 to 5

## Verification Results

- Indexer `tsc --noEmit`: PASS (0 errors)
- Web `tsc --noEmit`: Pre-existing vitest-dom type errors in unrelated test files (deferred per Phase 23 decision)
- Web vitest: 18 test files, 224 tests — ALL PASS

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed pre-existing TypeScript error in notification-scheduler.test.ts**
- **Found during:** Task 1 verification (`tsc --noEmit`)
- **Issue:** `vi.mocked(dispatchToSubscribers).mockResolvedValue(undefined)` used `undefined` as return value, but `dispatchToSubscribers` returns `{ sent: number; expired: number; errors: number }` — TypeScript error TS2345
- **Fix:** Changed both `mockResolvedValue(undefined)` calls to `mockResolvedValue({ sent: 0, expired: 0, errors: 0 })`
- **Files modified:** `services/indexer/src/__tests__/notification-scheduler.test.ts`
- **Commit:** add5b0d (included in Task 1 commit)

## Self-Check: PASSED

All files exist. All commits verified.

| Item | Status |
|------|--------|
| 004_boost_notifications.sql | FOUND |
| schema.ts | FOUND |
| push.ts | FOUND |
| notification-scheduler.ts | FOUND |
| processor.ts | FOUND |
| api.ts | FOUND |
| notification-settings.tsx | FOUND |
| Commit add5b0d | FOUND |
| Commit 17ddf18 | FOUND |
