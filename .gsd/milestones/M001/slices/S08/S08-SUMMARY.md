---
id: S08
parent: M001
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
# S08: Frontend Boost Ui

**# Phase 26 Plan 01: IDL Sync, Boost Utilities, BoostBadge, and StakeCard Integration Summary**

## What Happened

# Phase 26 Plan 01: IDL Sync, Boost Utilities, BoostBadge, and StakeCard Integration Summary

IDL synced with Phase 24 boost instructions, boost utility layer added (constants/PDA/math), BoostBadge component with three visual states, and StakeCard with boost indicator and boosted APY display.

## What Was Built

### Task 1: IDL Sync, Boost Constants, PDA Derivation, applyBoostMultiplier

**TDD: RED → GREEN**

Synced the stale web IDL (22 instructions) with the current built IDL (26 instructions) including all Phase 24 additions. Updated `types/program.ts` manually to add boost instructions, `BoostRecord` account type, boost events, boost errors, and three new fields on `StakeAccount`.

Key additions:
- `app/web/public/idl/helix_staking.json` — copied from `target/idl/helix_staking.json` (now 26 instructions)
- `BOOST_RECORD_SEED = Buffer.from("boost_record")` and `BOOST_MULTIPLIER_BPS = 1_000` in `constants.ts`
- `deriveBoostRecord(user: PublicKey): [PublicKey, number]` in `pdas.ts`
- `applyBoostMultiplier(amount: BN): BN` in `math.ts` — mirrors `apply_boost_multiplier()` in Rust exactly
- `StakeAccount` type updated with `seedBalanceAtStake`, `boostRevoked`, `boostedStakeId` fields
- `BoostRecord` account type added to `types/program.ts`
- 5 new `applyBoostMultiplier` test cases — all pass

### Task 2: BoostBadge Component, useSeedBalance Hook, useBoostRecord Hook, StakeCard Integration

**TDD: RED → GREEN**

Created the complete boost UI layer: component, hooks, and StakeCard integration.

`BoostBadge` component:
- `state="eligible"` → amber badge `bg-amber-600/20 text-amber-400` with Zap icon
- `state="active"` → green badge `bg-green-600/20 text-green-400` with ShieldCheck icon
- `state="revoked"` → red badge `bg-red-600/20 text-red-400` with ShieldX icon
- `state="none"` → returns null
- Each wrapped in Tooltip with descriptive text

`getBoostState(account)` helper:
- `boostRevoked === true` → `'revoked'` (takes priority)
- `seedBalanceAtStake > 0` → `'active'`
- Default → `'none'`

`useSeedBalance` hook:
- Extracts seed mint from `GlobalState.reserved[2..5]` (4 LE u64s = 32-byte pubkey)
- Derives ATA using standard SPL Token (`TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA`) — NOT Token-2022
- Returns `BN(0)` if ATA missing
- `queryKey: ["seedBalance", publicKey, seedMint]`, `staleTime: 15_000`

`useBoostRecord` hook:
- Derives BoostRecord PDA via `deriveBoostRecord(publicKey)`
- Uses `program.account.boostRecord.fetchNullable()` — returns null if not registered
- `queryKey: ["boostRecord", publicKey]`, `staleTime: 30_000`

`StakeCard` updates:
- `StakeAccountData` interface extended with optional `seedBalanceAtStake?`, `boostRevoked?`, `boostedStakeId?`
- `BoostBadge` rendered in header alongside `StatusBadge`
- Pending rewards: `applyBoostMultiplier(loyaltyAdjustedRewards)` when `boostState === 'active'`
- `"(Boosted)"` label shown next to reward amount when boost is active
- BPD bonus remains additive after boost (not amplified)

## Deviations from Plan

None — plan executed exactly as written.

## Test Results

- `applyBoostMultiplier` tests: 5 new tests added, all pass
- `boost-badge` tests: 15 new tests added, all pass
- Full suite: 224 tests pass (18 test files), zero regressions
- Pre-existing TS errors in test files (`toBeInTheDocument`) are unchanged — deferred per STATE.md decisions

## Commits

| Task | Commit | Description |
|------|--------|-------------|
| 1    | d1b4e06 | feat(26-01): IDL sync, boost constants, PDA derivation, applyBoostMultiplier |
| 2    | 27d58e7 | feat(26-01): BoostBadge component, hooks, and StakeCard boost integration |

## Self-Check: PASSED

All files verified present:
- app/web/public/idl/helix_staking.json — FOUND
- app/web/types/program.ts — FOUND
- app/web/lib/solana/constants.ts — FOUND
- app/web/lib/solana/pdas.ts — FOUND
- app/web/lib/solana/math.ts — FOUND
- app/web/components/stake/boost-badge.tsx — FOUND
- app/web/components/stake/stake-card.tsx — FOUND
- app/web/lib/hooks/useSeedBalance.ts — FOUND
- app/web/lib/hooks/useBoostRecord.ts — FOUND
- app/web/__tests__/components/boost-badge.test.tsx — FOUND

All commits verified:
- d1b4e06 — FOUND
- 27d58e7 — FOUND

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
