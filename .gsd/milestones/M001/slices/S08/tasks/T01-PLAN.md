# T01: 26-frontend-boost-ui 01

**Slice:** S08 — **Milestone:** M001

## Description

Sync the web IDL with Phase 24 boost instructions, add boost utility functions (PDA derivation, math, seed balance hook), create the BoostBadge component, and integrate boost state + boosted APY display into StakeCard.

Purpose: FRONT-01 (boost indicator) and FRONT-02 (boosted APY display) depend on the updated IDL and boost utility layer. Without the IDL sync, no boost instruction or account type is available to the frontend. This plan creates the full stack from IDL through rendered UI.

Output: Updated IDL/types, boost utility functions in constants/pdas/math, useSeedBalance and useBoostRecord hooks, BoostBadge component, StakeCard with boost integration, and tests for BoostBadge and applyBoostMultiplier.

## Must-Haves

- [ ] "Each stake card shows a visually distinct boost indicator for active, revoked, or eligible states"
- [ ] "Boosted stakes display the multiplied APY (base * 1.10) rather than base rate"
- [ ] "Non-boosted stakes show no boost badge and base APY only"
- [ ] "Revoked stakes show revoked badge and base APY"

## Files

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
