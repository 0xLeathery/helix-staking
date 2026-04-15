---
id: S09
parent: M001
milestone: M001
provides:
  - Shared cluster-aware Explorer URL utility (getCluster, getExplorerUrl, getExplorerTxUrl, getExplorerTokenUrl)
  - Reusable ExplorerLink component wired into 8 on-chain action surfaces
  - Zero hardcoded cluster=devnet strings or solscan.io URLs in production code
  - LP pool stats widget with 4 render states (empty/loading/error/data) on dashboard
  - useLpPoolStats React Query hook with environment-gated Raydium API fetching
  - 4-part end-to-end documentation section on /seed page (seed purpose, SOL flow, boost mechanics, on-chain verification)
  - Enhanced SeedSolFlow with "Verify On-Chain" subsection and ExplorerLinks
requires:
  - slice: S08
    provides: Boost UI components (BoostStatusCard, BoostBadge, StakeCard boost integration, seed balance hook, PDA derivation)
affects: []
key_files:
  - app/web/lib/utils/explorer.ts
  - app/web/components/ui/explorer-link.tsx
  - app/web/lib/hooks/useLpPoolStats.ts
  - app/web/components/dashboard/lp-pool-stats.tsx
  - app/web/components/marketing/seed-docs.tsx
  - app/web/components/marketing/seed-sol-flow.tsx
  - app/web/app/dashboard/page.tsx
  - app/web/app/(public)/seed/page.tsx
key_decisions:
  - All Solana Explorer URLs generated through shared lib/utils/explorer.ts — never inline
  - ExplorerLink component as the single UI surface for on-chain links across all components
  - Environment-gated hooks return early with { data: null, isPoolCreated: false } when env var is empty — no fetch attempted
  - Client-side PDA derivation in BoostStatusCard via deriveBoostRecord(publicKey) — avoids plumbing address through data layer
  - retryDelay: 0 in test QueryClient to work around hook-level retry:3 overriding client-level retry:false
patterns_established:
  - All on-chain links use ExplorerLink — no raw anchor tags with Explorer/Solscan URLs
  - Environment-gated features return early with null data + false flag when env var is empty
  - Marketing documentation sections use ScrollReveal + zinc card patterns
  - On-chain verification content always includes ExplorerLink to program ID
observability_surfaces:
  - LP widget renders "Pool Not Yet Created" when NEXT_PUBLIC_RAYDIUM_POOL_ID is empty
  - LP widget renders "Unable to load pool stats" on persistent Raydium API failure (after 3 retries)
  - Browser Network tab → filter api-v3.raydium.io to see pool data requests
  - grep -rn "ExplorerLink" app/web/components/ --include="*.tsx" to audit all Explorer link consumers
  - If Explorer links point to wrong cluster: check NEXT_PUBLIC_RPC_URL env var
drill_down_paths:
  - .gsd/milestones/M001/slices/S09/tasks/T01-SUMMARY.md
  - .gsd/milestones/M001/slices/S09/tasks/T02-SUMMARY.md
  - .gsd/milestones/M001/slices/S09/tasks/T03-SUMMARY.md
  - .gsd/milestones/M001/slices/S09/tasks/T04-SUMMARY.md
duration: ~60m across 4 tasks
verification_result: passed
completed_at: 2026-03-17
---

# S09: LP Stats, Docs & Transparency

**Centralized all Solana Explorer link generation into a shared utility and reusable component, built an LP pool stats widget with environment-gated Raydium API integration, and published end-to-end seed → boost → LP documentation with on-chain verification links.**

## What Happened

**T01 — Explorer utility extraction.** Extracted `getCluster()` and `getExplorerUrl()` from `footer.tsx` into a shared `lib/utils/explorer.ts`. Added `getExplorerTxUrl()` and `getExplorerTokenUrl()` variants. Built `ExplorerLink` component with type-based dispatch, address truncation (reusing existing `truncateAddress`), external link icon, and helix-colored styling. Updated footer to import from the shared utility. 18 unit/render tests.

**T02 — Explorer link wiring.** Replaced all hardcoded Explorer/Solscan URLs across 5 components: `success-screen.tsx` (transaction link), `badge-card.tsx` and `badge-celebration.tsx` (Solscan → Explorer), `stake-card.tsx` (new stake PDA link), and `boost-status-card.tsx` (new BoostRecord PDA link via client-side `deriveBoostRecord`). Updated 2 test files with new assertion text and mocks. Result: zero `cluster=devnet` strings outside explorer.ts, zero `solscan.io` URLs.

**T03 — LP pool stats.** Built `useLpPoolStats` hook that reads `NEXT_PUBLIC_RAYDIUM_POOL_ID` — returns immediately with `isPoolCreated: false` when empty (pre-launch), otherwise fetches Raydium API v3 with 30s stale time and 60s refetch. Built `LpPoolStats` widget with 4 states: empty placeholder, loading skeleton, error alert, and data grid (TVL, HLX price, 24h volume). Integrated into dashboard after ProtocolStats with ErrorBoundary. 10 tests.

**T04 — End-to-end documentation.** Created `SeedDocs` component with 4 documentation parts: What the Seed Token Is, How SOL Flows to LP, How Boost Works (6-step lifecycle), and Verify Everything On-Chain (GlobalState/BoostRecord/StakeAccount descriptions with ExplorerLinks). Enhanced `SeedSolFlow` with "Verify On-Chain" subsection. Wired into `/seed` page between Headroom and CTA sections.

## Verification

- **Tests:** 265/265 pass across 24 test files (237 existing + 28 new) — zero failures
- **Type check:** `npx tsc --noEmit` — no new type errors (only pre-existing test file TS errors deferred per STATE.md)
- **Hardcoded URLs:** `grep -rn "cluster=devnet"` returns zero matches outside explorer.ts and test files
- **Solscan URLs:** `grep -rn "solscan.io"` returns zero matches across entire codebase
- **Integration:** LpPoolStats imported and rendered in `dashboard/page.tsx` (lines 15, 54)
- **Integration:** SeedDocs imported and rendered in `seed/page.tsx` (lines 7, 47)
- **ExplorerLink coverage:** 8 components use ExplorerLink (success-screen, badge-card, badge-celebration, stake-card, boost-status-card, lp-pool-stats, seed-docs, seed-sol-flow)

## Requirements Advanced

None — all S09 requirements moved directly to validated.

## Requirements Validated

- **FRONT-05** — LP pool stats widget renders TVL, price, volume with 4 states. useLpPoolStats hook tested with 5 behavioral tests. Dashboard integration confirmed.
- **TRUST-01** — SeedDocs component renders 4-part documentation on /seed page covering full seed → boost → LP lifecycle with ExplorerLinks.
- **TRUST-02** — ExplorerLink wired into all 8 on-chain action surfaces. Zero hardcoded cluster=devnet or solscan.io URLs remain.
- **TRUST-03** — SeedSolFlow enhanced with "Verify On-Chain" subsection. SeedDocs Part 2 documents numbered SOL flow steps from purchase through LP deployment.
- **TRUST-04** — SeedDocs Part 4 documents GlobalState, BoostRecord, and StakeAccount on-chain accounts with ExplorerLinks. BoostStatusCard and StakeCard show Explorer links to their PDAs.

## New Requirements Surfaced

None.

## Requirements Invalidated or Re-scoped

None.

## Deviations

- T02 updated `badge-card.test.tsx` and `boost-status-card.test.tsx` to fix assertions and mocks broken by ExplorerLink changes — not in the original plan but necessary for test suite to pass.
- T04 had edit collisions on `seed-sol-flow.tsx` and `seed/page.tsx` from overlapping edits — detected by TSC, fixed with clean rewrites.

## Known Limitations

- **Raydium API CORS:** `useLpPoolStats` fetches Raydium API v3 directly from the browser. This is untested against the live API since the pool doesn't exist yet. If CORS blocks browser fetch, a Next.js API route proxy at `/api/pool-stats` is the documented fallback.
- **Program ID duplication:** `PROGRAM_ID` constant is defined locally in both `seed-docs.tsx` and `seed-sol-flow.tsx` rather than a shared config. Acceptable for two static marketing components but should be centralized if more components need it.
- **Pre-existing test TS errors:** `toBeInTheDocument` type errors in `stake-card.test.tsx`, `referral-stats-panel.test.tsx`, `portfolio-summary.test.tsx`, and `protocol-paused-banner.test.tsx` remain deferred per STATE.md. Tests pass at runtime.

## Follow-ups

- When the HLX/SOL pool is created on Raydium: set `NEXT_PUBLIC_RAYDIUM_POOL_ID` env var to activate the LP stats widget. If CORS blocks, create `/api/pool-stats` proxy route.
- When deploying to mainnet: verify `NEXT_PUBLIC_RPC_URL` is set to a mainnet URL so Explorer links default to mainnet-beta cluster (no `?cluster=devnet` suffix).
- Consider adding the LP pool address ExplorerLink to `seed-sol-flow.tsx` once the pool is created (currently has a placeholder note).

## Files Created/Modified

- `app/web/lib/utils/explorer.ts` — new shared utility: getCluster, getExplorerUrl, getExplorerTxUrl, getExplorerTokenUrl
- `app/web/components/ui/explorer-link.tsx` — new reusable ExplorerLink component
- `app/web/lib/hooks/useLpPoolStats.ts` — new React Query hook with env-gated Raydium API fetching
- `app/web/components/dashboard/lp-pool-stats.tsx` — new LP pool stats widget with 4 render states
- `app/web/components/marketing/seed-docs.tsx` — new 4-part end-to-end documentation section
- `app/web/__tests__/lib/explorer.test.ts` — 10 unit tests for explorer utility
- `app/web/__tests__/components/explorer-link.test.tsx` — 8 render tests for ExplorerLink
- `app/web/__tests__/hooks/useLpPoolStats.test.ts` — 5 hook behavioral tests
- `app/web/__tests__/components/lp-pool-stats.test.tsx` — 5 component render tests
- `app/web/components/marketing/footer.tsx` — removed local getCluster/getExplorerUrl, imports from shared utility
- `app/web/components/stake/stake-wizard/success-screen.tsx` — replaced hardcoded Explorer URL with ExplorerLink
- `app/web/components/badges/badge-card.tsx` — replaced Solscan link with ExplorerLink
- `app/web/components/badges/badge-celebration.tsx` — replaced Solscan URL with ExplorerLink
- `app/web/components/stake/stake-card.tsx` — added Explorer link for stake account PDA
- `app/web/components/dashboard/boost-status-card.tsx` — added Explorer link for BoostRecord PDA
- `app/web/components/marketing/seed-sol-flow.tsx` — enhanced with "Verify On-Chain" subsection and ExplorerLink
- `app/web/app/(public)/seed/page.tsx` — added SeedDocs import and render
- `app/web/app/dashboard/page.tsx` — added LpPoolStats import and rendering with ErrorBoundary
- `app/web/__tests__/components/badge-card.test.tsx` — updated assertion text from "Solscan" to "Explorer"
- `app/web/__tests__/components/boost-status-card.test.tsx` — enhanced mock publicKey, added deriveBoostRecord mock

## Forward Intelligence

### What the next slice should know
- S09 is the final slice in M001. All 5 active TRUST/FRONT requirements are now validated. The milestone is complete.
- The `ExplorerLink` component and `explorer.ts` utility are the authoritative way to link to on-chain data — any new on-chain surfaces should use them.
- `useLpPoolStats` is dormant until `NEXT_PUBLIC_RAYDIUM_POOL_ID` is set. The widget shows "Pool not yet created" by default.

### What's fragile
- Raydium API v3 direct fetch may hit CORS in production browsers — untested since pool doesn't exist. The proxy fallback is documented but not built.
- `formatTokenPrice` in `lp-pool-stats.tsx` uses adaptive decimal places (4-6) for sub-penny tokens — edge cases with very large or very small prices not yet tested against real data.

### Authoritative diagnostics
- `cd app/web && npx vitest run` — 265 tests, full suite health check
- `grep -rn "ExplorerLink" app/web/components/ --include="*.tsx"` — exhaustive list of all Explorer link consumers
- `grep -rn "cluster=devnet" app/web/ --include="*.tsx" --include="*.ts" | grep -v explorer.ts | grep -v node_modules | grep -v __tests__` — should always return zero matches

### What assumptions changed
- None. All 4 tasks executed within plan scope. The 28 new tests all passed on first run.
