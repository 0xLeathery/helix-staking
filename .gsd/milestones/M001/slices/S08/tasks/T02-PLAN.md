# T02: 26-frontend-boost-ui 02

**Slice:** S08 — **Milestone:** M001

## Description

Create the useRegisterBoost mutation hook and BoostStatusCard dashboard component so users can register for the APY boost directly from the dashboard.

Purpose: FRONT-03 requires a wallet interaction to call `register_seed_boost` on-chain. The BoostStatusCard provides the dashboard-level UI for boost status and the register button. This plan depends on Plan 01 (IDL sync, types, hooks) being complete.

Output: useRegisterBoost mutation hook with behavioral tests, BoostStatusCard component with render-state tests, dashboard page integration.

## Must-Haves

- [ ] "A user with seed tokens sees a 'Register Boost' button on the dashboard"
- [ ] "Clicking 'Register Boost' calls register_seed_boost on-chain via connected wallet"
- [ ] "After successful registration the UI updates to show 'Boost registered' state"
- [ ] "A user who already has a BoostRecord sees appropriate status (registered, active, or revoked) not the register button"
- [ ] "A user without seed tokens sees no boost registration prompt"

## Files

- `app/web/lib/hooks/useRegisterBoost.ts`
- `app/web/lib/solana/compute-budget.ts`
- `app/web/__tests__/hooks/useRegisterBoost.test.ts`
- `app/web/components/dashboard/boost-status-card.tsx`
- `app/web/app/dashboard/page.tsx`
- `app/web/__tests__/components/boost-status-card.test.tsx`
