---
phase: 26-frontend-boost-ui
plan: "02"
subsystem: frontend-boost-ui
tags: [frontend, boost, mutation-hook, react, solana, vitest, tdd, dashboard]
dependency_graph:
  requires: [26-01]
  provides: [FRONT-03]
  affects: [app/web/app/dashboard/page.tsx, app/web/lib/solana/compute-budget.ts]
tech_stack:
  added: []
  patterns: [TDD-RED-GREEN, react-query-mutation, anchor-instruction, component-composition, pure-function-testing]
key_files:
  created:
    - app/web/lib/hooks/useRegisterBoost.ts
    - app/web/__tests__/hooks/useRegisterBoost.test.ts
    - app/web/components/dashboard/boost-status-card.tsx
    - app/web/__tests__/components/boost-status-card.test.tsx
  modified:
    - app/web/lib/solana/compute-budget.ts
    - app/web/app/dashboard/page.tsx
decisions:
  - "buildRegisterBoostTx exported as testable pure function — mirrors simulateTransactionOrThrow pattern from useTransactionSimulation.ts, tests verify behavior directly without React hook machinery"
  - "Standard SPL Token program for seed ATA (TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA) — pump.fun tokens use SPL, not Token-2022"
  - "registerSeedBoost CU limit set to 150_000 — PDA init requires more CU than simple instructions"
  - "BoostStatusCard returns null when boost is not enabled (reserved[7] is zero) — graceful degradation if GlobalState not yet configured"
  - "Test queries use getAllByText for states where text appears in multiple elements (badge + description)"
metrics:
  duration: "256 seconds"
  completed: "2026-03-04"
  tasks: 2
  files_modified: 6
  tests_added: 13
  tests_total: 237
---

# Phase 26 Plan 02: useRegisterBoost Hook, BoostStatusCard Component, and Dashboard Integration Summary

useRegisterBoost mutation hook with behavioral tests and BoostStatusCard dashboard component enabling users to register for the APY boost directly from the dashboard.

## What Was Built

### Task 1: useRegisterBoost mutation hook with behavioral tests

**TDD: RED → GREEN**

Created `useRegisterBoost.ts` following the `useCreateStake.ts` mutation pattern exactly. The core transaction logic was extracted into `buildRegisterBoostTx` — a testable pure function (mirrors the `simulateTransactionOrThrow` pattern from `useTransactionSimulation.ts`).

Key implementation details:
- `buildRegisterBoostTx` accepts `{ publicKey, program, connection, sendTransaction }` and returns `{ signature }`
- Throws `"Wallet not connected"` when `publicKey` is null
- Fetches `globalState` to extract `seedMint` via `getSeedMintFromGlobalState()`
- Throws `"Seed mint not configured"` when seed mint equals `PublicKey.default`
- Derives `boostRecordPda` via `deriveBoostRecord(publicKey)`
- Derives `seedTokenAccount` via `getAssociatedTokenAddressSync` with standard SPL Token program (NOT Token-2022)
- Calls `program.methods.registerSeedBoost().accountsPartial({...}).transaction()` with all required accounts
- Prepends compute budget instructions: `getComputeBudgetInstructions(150_000)` — PDA init requires ~150K CU
- Simulates transaction BEFORE sending (security requirement — verified by test checking invocationCallOrder)
- Sends and confirms transaction
- `onSuccess` invalidates: `["boostRecord", pubkey]`, `["stakes", pubkey]`, `["seedBalance", pubkey]`

Added `registerSeedBoost: 150_000` to `CU_LIMITS` in `compute-budget.ts`.

6 behavioral tests — all pass:
- `throws "Wallet not connected" when publicKey is null`
- `throws "Seed mint not configured" when getSeedMintFromGlobalState returns PublicKey.default`
- `calls registerSeedBoost with correct accounts` — verifies all account keys
- `simulates transaction before sending` — checks invocationCallOrder
- `uses standard SPL Token program ID for seed ATA derivation` — verifies getAssociatedTokenAddressSync arg[3]
- `returns signature on success`

### Task 2: BoostStatusCard component with render-state tests and dashboard integration

**TDD: RED → GREEN**

Created `BoostStatusCard` dashboard component with four render states:

- **Null renders**: no wallet, no seed balance + no BoostRecord, boost not enabled in GlobalState (`reserved[7] === 0`)
- **Eligible**: user has seed tokens, no BoostRecord — shows "Boost Eligible" status and "Register Boost" button
- **Registered**: BoostRecord exists with `boostedStakeId === u64::MAX` — shows "Boost Registered, create a stake to activate"
- **Active**: BoostRecord with real `boostedStakeId` and not revoked — shows "Boost Active" status
- **Revoked**: BoostRecord with `boostRevoked === true` — shows "Boost Revoked" status

Register button:
- Calls `registerBoost()` mutation on click
- Disabled while `isPending === true`
- Shows `Loader2` spinner with "Registering..." text while pending
- Displays error message below button if mutation fails

Dashboard page updated to integrate `BoostStatusCard` with `ErrorBoundary` after `ProtocolPausedBanner` and before `ProtocolStats`.

7 render-state tests — all pass:
- `renders nothing when wallet is not connected`
- `renders nothing when no seed balance and no boost record`
- `renders eligible state with Register button when has seed balance, no boost record`
- `renders registered state when boost record has u64::MAX stakeId`
- `renders active state when boost record has real stakeId`
- `renders revoked state when boost is revoked`
- `Register button disabled while mutation pending`

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed mock public key format in useRegisterBoost.test.ts**
- **Found during:** Task 1 RED phase
- **Issue:** Used repeated-digit strings like `'11111111111111111111111111111111'` which are not valid base58 public keys
- **Fix:** Replaced with valid base58 public keys (`PublicKey.default`, `GovER5Lthms3bLBqWub97yVrMmEogzX7xNjdXpPPCVZw`, etc.)
- **Files modified:** `app/web/__tests__/hooks/useRegisterBoost.test.ts`

**2. [Rule 1 - Bug] Fixed getAssociatedTokenAddressSync argument index in test**
- **Found during:** Task 1 GREEN phase
- **Issue:** Test checked argument index 2 for token program ID, but correct index is 3 (`getAssociatedTokenAddressSync(mint, owner, allowOwnerOffCurve, programId)`)
- **Fix:** Updated test to use `getAtaCall[3]` for the token program ID assertion
- **Files modified:** `app/web/__tests__/hooks/useRegisterBoost.test.ts`

**3. [Rule 2 - Missing functionality] Added TooltipProvider wrapper in BoostStatusCard tests**
- **Found during:** Task 2 GREEN phase
- **Issue:** `BoostBadge` uses Radix UI `Tooltip` which requires `TooltipProvider` in tree — tests threw `` `Tooltip` must be used within `TooltipProvider` ``
- **Fix:** Wrapped render helper with `TooltipProvider` (same pattern as `boost-badge.test.tsx`)
- **Files modified:** `app/web/__tests__/components/boost-status-card.test.tsx`

**4. [Rule 1 - Bug] Fixed multiple-element text matches in component tests**
- **Found during:** Task 2 GREEN phase
- **Issue:** `getByText(/registered/i)` threw "Found multiple elements" because "registered" appears in both the status heading and description paragraph
- **Fix:** Changed to `getAllByText(/registered/i).length > 0` for registered/active/revoked state assertions
- **Files modified:** `app/web/__tests__/components/boost-status-card.test.tsx`

## Test Results

- `useRegisterBoost` behavioral tests: 6 new tests added, all pass
- `boost-status-card` render tests: 7 new tests added, all pass
- Full suite: 237 tests pass (20 test files), zero regressions (+13 vs Plan 01's 224)
- Pre-existing TS errors in test files (`toBeInTheDocument`) unchanged — deferred per STATE.md decisions

## Commits

| Task | Commit | Description |
|------|--------|-------------|
| 1    | 23f5e4c | feat(26-02): useRegisterBoost mutation hook with behavioral tests |
| 2    | 53fa544 | feat(26-02): BoostStatusCard component, render tests, and dashboard integration |

## Self-Check: PASSED

All files verified present:
- app/web/lib/hooks/useRegisterBoost.ts — FOUND
- app/web/__tests__/hooks/useRegisterBoost.test.ts — FOUND
- app/web/components/dashboard/boost-status-card.tsx — FOUND
- app/web/__tests__/components/boost-status-card.test.tsx — FOUND
- app/web/app/dashboard/page.tsx — FOUND
- app/web/lib/solana/compute-budget.ts — FOUND

All commits verified:
- 23f5e4c — FOUND
- 53fa544 — FOUND
