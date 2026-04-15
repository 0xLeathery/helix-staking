# S08: Frontend Boost Ui

**Goal:** Sync the web IDL with Phase 24 boost instructions, add boost utility functions (PDA derivation, math, seed balance hook), create the BoostBadge component, and integrate boost state + boosted APY display into StakeCard.
**Demo:** Sync the web IDL with Phase 24 boost instructions, add boost utility functions (PDA derivation, math, seed balance hook), create the BoostBadge component, and integrate boost state + boosted APY display into StakeCard.

## Must-Haves


## Tasks

- [x] **T01: 26-frontend-boost-ui 01**
  - Sync the web IDL with Phase 24 boost instructions, add boost utility functions (PDA derivation, math, seed balance hook), create the BoostBadge component, and integrate boost state + boosted APY display into StakeCard.

Purpose: FRONT-01 (boost indicator) and FRONT-02 (boosted APY display) depend on the updated IDL and boost utility layer. Without the IDL sync, no boost instruction or account type is available to the frontend. This plan creates the full stack from IDL through rendered UI.

Output: Updated IDL/types, boost utility functions in constants/pdas/math, useSeedBalance and useBoostRecord hooks, BoostBadge component, StakeCard with boost integration, and tests for BoostBadge and applyBoostMultiplier.
- [x] **T02: 26-frontend-boost-ui 02**
  - Create the useRegisterBoost mutation hook and BoostStatusCard dashboard component so users can register for the APY boost directly from the dashboard.

Purpose: FRONT-03 requires a wallet interaction to call `register_seed_boost` on-chain. The BoostStatusCard provides the dashboard-level UI for boost status and the register button. This plan depends on Plan 01 (IDL sync, types, hooks) being complete.

Output: useRegisterBoost mutation hook with behavioral tests, BoostStatusCard component with render-state tests, dashboard page integration.
- [x] **T03: 26-frontend-boost-ui 03**
  - Add the BoostRevoked event processing pipeline to the indexer and the notification settings toggle to the web app so users receive push notifications when their boost is revoked.

Purpose: FRONT-04 requires push notifications on boost revocation using the existing notification infrastructure. This is entirely backend (indexer) + settings UI work. The on-chain BoostRevoked event is already emitted by Phase 24; the indexer's IDL already decodes it. This plan adds the processor case, DB migration, notification dispatch function, and the frontend settings toggle.

Output: Complete pipeline from on-chain BoostRevoked event to push notification delivery, with user preference control.

## Files Likely Touched

- `app/web/public/idl/helix_staking.json`
- `app/web/types/program.ts`
- `app/web/lib/solana/constants.ts`
- `app/web/lib/solana/pdas.ts`
- `app/web/lib/solana/math.ts`
- `app/web/lib/hooks/useSeedBalance.ts`
- `app/web/lib/hooks/useBoostRecord.ts`
- `app/web/components/stake/boost-badge.tsx`
- `app/web/components/stake/stake-card.tsx`
- `app/web/__tests__/components/boost-badge.test.tsx`
- `app/web/__tests__/lib/math.test.ts`
- `app/web/lib/hooks/useRegisterBoost.ts`
- `app/web/lib/solana/compute-budget.ts`
- `app/web/__tests__/hooks/useRegisterBoost.test.ts`
- `app/web/components/dashboard/boost-status-card.tsx`
- `app/web/app/dashboard/page.tsx`
- `app/web/__tests__/components/boost-status-card.test.tsx`
- `services/indexer/src/db/migrations/004_boost_notifications.sql`
- `services/indexer/src/db/schema.ts`
- `services/indexer/src/worker/processor.ts`
- `services/indexer/src/worker/notification-scheduler.ts`
- `services/indexer/src/lib/push.ts`
- `app/web/lib/api.ts`
- `app/web/components/dashboard/notification-settings.tsx`
- `app/web/__tests__/components/notification-settings.test.tsx`
