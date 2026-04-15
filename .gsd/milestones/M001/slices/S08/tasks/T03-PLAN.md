# T03: 26-frontend-boost-ui 03

**Slice:** S08 — **Milestone:** M001

## Description

Add the BoostRevoked event processing pipeline to the indexer and the notification settings toggle to the web app so users receive push notifications when their boost is revoked.

Purpose: FRONT-04 requires push notifications on boost revocation using the existing notification infrastructure. This is entirely backend (indexer) + settings UI work. The on-chain BoostRevoked event is already emitted by Phase 24; the indexer's IDL already decodes it. This plan adds the processor case, DB migration, notification dispatch function, and the frontend settings toggle.

Output: Complete pipeline from on-chain BoostRevoked event to push notification delivery, with user preference control.

## Must-Haves

- [ ] "When a BoostRevoked event is emitted on-chain, the indexer processes it and dispatches a push notification to the affected wallet"
- [ ] "The push notification explains what happened and includes the stake ID"
- [ ] "Users can toggle boost revocation notifications on/off in notification settings"
- [ ] "The notifyBoostRevoked preference defaults to true (opt-out, not opt-in)"

## Files

- `services/indexer/src/db/migrations/004_boost_notifications.sql`
- `services/indexer/src/db/schema.ts`
- `services/indexer/src/worker/processor.ts`
- `services/indexer/src/worker/notification-scheduler.ts`
- `services/indexer/src/lib/push.ts`
- `app/web/lib/api.ts`
- `app/web/components/dashboard/notification-settings.tsx`
- `app/web/__tests__/components/notification-settings.test.tsx`
