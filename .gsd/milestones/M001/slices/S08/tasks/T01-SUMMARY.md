---
id: T01
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
# T01: 26-frontend-boost-ui 01

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
