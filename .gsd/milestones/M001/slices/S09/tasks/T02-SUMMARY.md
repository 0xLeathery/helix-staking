---
id: T02
parent: S09
milestone: M001
provides:
  - All on-chain action components use ExplorerLink instead of hardcoded URLs
  - Zero hardcoded cluster=devnet strings outside explorer.ts
  - Zero solscan.io URLs remaining in codebase
  - StakeCard shows Explorer link to stake account PDA
  - BoostStatusCard shows Explorer link to BoostRecord PDA
key_files:
  - app/web/components/stake/stake-wizard/success-screen.tsx
  - app/web/components/badges/badge-card.tsx
  - app/web/components/badges/badge-celebration.tsx
  - app/web/components/stake/stake-card.tsx
  - app/web/components/dashboard/boost-status-card.tsx
  - app/web/__tests__/components/badge-card.test.tsx
  - app/web/__tests__/components/boost-status-card.test.tsx
key_decisions:
  - Used ExplorerLink className override for badge components to match their existing text-xs styling rather than the component's default text-sm
  - Placed stake account Explorer link below CardHeader in a dedicated row rather than inline with the Stake # title, keeping the header clean
  - Used deriveBoostRecord(publicKey) in BoostStatusCard to derive PDA address client-side — avoids adding the address to the hook data model since it's deterministic from the wallet key
patterns_established:
  - All on-chain links use ExplorerLink component — no raw anchor tags with Explorer/Solscan URLs
observability_surfaces:
  - grep -rn "ExplorerLink" app/web/components/ --include="*.tsx" lists all Explorer link consumers
  - If Explorer links point to wrong cluster, inspect NEXT_PUBLIC_RPC_URL env var
  - deriveBoostRecord failure in BoostStatusCard surfaces as React error boundary (intentional — config defect)
duration: 15m
verification_result: passed
completed_at: 2026-03-17
blocker_discovered: false
---

# T02: Wire ExplorerLink into all on-chain action components

**Replaced all hardcoded Explorer/Solscan URLs with the shared ExplorerLink component across 5 components, and added new Explorer links to StakeCard and BoostStatusCard for on-chain verification.**

## What Happened

Wired the `ExplorerLink` component from T01 into all 5 target files:

1. **success-screen.tsx** — Replaced hardcoded `explorer.solana.com/tx/${signature}?cluster=devnet` anchor with `<ExplorerLink type="tx" value={signature} />`. Removed the manual SVG external-link icon and `truncateAddress` import (ExplorerLink handles both).

2. **badge-card.tsx** — Replaced Solscan link (`solscan.io/tx/${claimSignature}?cluster=devnet`) with `<ExplorerLink type="tx" value={claimSignature} label="View on Explorer" />` using the existing `text-xs` styling via className override.

3. **badge-celebration.tsx** — Removed the `solscanUrl` variable and replaced the Solscan anchor with `<ExplorerLink type="tx" value={signature} label="View Transaction on Explorer" />`.

4. **stake-card.tsx** — Added a new "Account:" row below the card header with `<ExplorerLink type="address" value={stakePublicKey.toBase58()} />`. The `stakePublicKey` prop was already available.

5. **boost-status-card.tsx** — Added `deriveBoostRecord(publicKey)` PDA derivation and an `<ExplorerLink type="address" />` shown below the status description when a BoostRecord exists (registered, active, or revoked states).

Updated two test files to match the new component behavior:
- `badge-card.test.tsx`: Changed assertion from "View on Solscan" to "View on Explorer"
- `boost-status-card.test.tsx`: Added `toBuffer()` to mock publicKey and mocked `deriveBoostRecord` to prevent real PDA derivation in tests

## Verification

- `grep -rn "cluster=devnet" app/web/ --include="*.tsx" --include="*.ts" | grep -v explorer.ts | grep -v node_modules | grep -v __tests__` → **0 matches** ✅
- `grep -rn "solscan.io" app/web/ --include="*.tsx" --include="*.ts" | grep -v node_modules` → **0 matches** ✅
- `cd app/web && npx vitest run` → **255 tests passed, 22 test files, 0 failures** ✅
- `cd app/web && npx tsc --noEmit` → **no new type errors** (only pre-existing test file TS errors per STATE.md) ✅

### Slice-level verification (intermediate — T02 of 4):
- ✅ Zero hardcoded `cluster=devnet` outside explorer.ts and test files
- ✅ Zero `solscan.io` URLs remaining
- ✅ All 255 tests pass
- ✅ No new type errors
- ⬜ LP pool stats tests (T03)
- ⬜ useLpPoolStats hook tests (T03)

## Diagnostics

- Run `grep -rn "ExplorerLink" app/web/components/ --include="*.tsx"` to list all components using Explorer links
- If Explorer links point to wrong cluster: check `NEXT_PUBLIC_RPC_URL` env var — defaults to mainnet if unset/empty
- If BoostStatusCard throws: likely `deriveBoostRecord` failing due to invalid publicKey — check wallet connection state

## Deviations

- Updated `badge-card.test.tsx` and `boost-status-card.test.tsx` to fix test assertions and mocks broken by the changes — not in the original plan but necessary for all tests to pass.
- `boost-status-card.test.tsx` required mocking `@/lib/solana/pdas` since test mock publicKey doesn't support real `PublicKey.findProgramAddressSync`.

## Known Issues

None.

## Files Created/Modified

- `app/web/components/stake/stake-wizard/success-screen.tsx` — replaced hardcoded Explorer URL with ExplorerLink component
- `app/web/components/badges/badge-card.tsx` — replaced Solscan link with ExplorerLink
- `app/web/components/badges/badge-celebration.tsx` — replaced Solscan URL variable and link with ExplorerLink
- `app/web/components/stake/stake-card.tsx` — added Explorer link for stake account PDA
- `app/web/components/dashboard/boost-status-card.tsx` — added Explorer link for BoostRecord PDA via deriveBoostRecord
- `app/web/__tests__/components/badge-card.test.tsx` — updated assertion text from "Solscan" to "Explorer"
- `app/web/__tests__/components/boost-status-card.test.tsx` — enhanced mock publicKey with toBuffer(), added deriveBoostRecord mock
- `.gsd/milestones/M001/slices/S09/tasks/T02-PLAN.md` — added Observability Impact section
