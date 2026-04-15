# S09: LP Stats, Docs & Transparency

**Goal:** LP pool stats visible on dashboard, all mechanics documented end-to-end, every on-chain action links to Solana Explorer, and SOL flow from seed to LP is publicly verifiable.
**Demo:** Dashboard shows LP pool stats widget (or "pool not yet created" placeholder). Clicking any stake, boost, or badge action shows an Explorer link. The `/seed` page has a full lifecycle documentation section with on-chain account links.

## Must-Haves

- Shared cluster-aware Explorer URL utility extracted from footer.tsx (address, tx, token variants)
- Reusable `ExplorerLink` component used across all on-chain action surfaces
- All hardcoded `?cluster=devnet` and Solscan links replaced with shared utility
- LP pool stats widget on dashboard with TVL, HLX price, 24h volume (or "not yet created" when pool ID env var is empty)
- `useLpPoolStats` React Query hook fetching pool data with loading/error/empty states
- End-to-end documentation section on `/seed` page covering seed → boost → LP lifecycle
- SOL flow section enhanced with on-chain account addresses and Explorer links
- Explorer links on StakeCard, BoostStatusCard, success-screen, badge-card, badge-celebration

## Proof Level

- This slice proves: integration
- Real runtime required: no (all frontend, API mocked in tests, visual verification optional)
- Human/UAT required: no

## Verification

- `cd app/web && npx vitest run` — all existing 237 tests pass + new tests pass
- `cd app/web && npx tsc --noEmit` — no new type errors (pre-existing test file TS errors deferred per STATE.md)
- `grep -rn "cluster=devnet" app/web/ --include="*.tsx" --include="*.ts" | grep -v "explorer.ts" | grep -v "node_modules"` — returns zero matches (all hardcoded cluster strings removed)
- `grep -rn "solscan.io" app/web/ --include="*.tsx" --include="*.ts" | grep -v "node_modules"` — returns zero matches (all Solscan links normalized to Explorer)
- New test files pass:
  - `app/web/__tests__/lib/explorer.test.ts` — URL generation for address/tx/token, devnet/mainnet detection
  - `app/web/__tests__/components/explorer-link.test.tsx` — render tests for ExplorerLink variants
  - `app/web/__tests__/components/lp-pool-stats.test.tsx` — loading, data, and empty states
  - `app/web/__tests__/hooks/useLpPoolStats.test.ts` — hook behavioral tests

## Observability / Diagnostics

- Runtime signals: LP pool stats hook logs fetch errors to console; React Query retry handles transient Raydium API failures
- Inspection surfaces: Browser Network tab shows Raydium API requests; `NEXT_PUBLIC_RAYDIUM_POOL_ID` env var controls widget state
- Failure visibility: LP widget shows "Unable to load pool stats" on persistent API failure; empty pool ID shows "Pool not yet created"
- Redaction constraints: none (all data is public on-chain)

## Integration Closure

- Upstream surfaces consumed: `footer.tsx` getCluster/getExplorerUrl (extracted to shared utility), `stake-card.tsx`, `boost-status-card.tsx`, `success-screen.tsx`, `badge-card.tsx`, `badge-celebration.tsx`, `seed-sol-flow.tsx`, `seed/page.tsx`, `dashboard/page.tsx`
- New wiring introduced: ExplorerLink component wired into 5 existing components; LpPoolStats widget added to dashboard; SeedDocs section added to /seed page
- What remains before the milestone is truly usable end-to-end: nothing — S09 is the final slice

## Tasks

- [x] **T01: Extract Explorer utility and create ExplorerLink component with tests** `est:45m`
  - Why: Every downstream task needs cluster-aware Explorer URLs. Extracting from footer.tsx into a shared utility and creating a reusable component unblocks all Explorer link work.
  - Files: `app/web/lib/utils/explorer.ts`, `app/web/components/ui/explorer-link.tsx`, `app/web/components/marketing/footer.tsx`, `app/web/__tests__/lib/explorer.test.ts`, `app/web/__tests__/components/explorer-link.test.tsx`
  - Do: Extract `getCluster()` and `getExplorerUrl()` from `footer.tsx` into `lib/utils/explorer.ts`. Add `getExplorerTxUrl(signature)` and `getExplorerTokenUrl(mint)` variants. Create `ExplorerLink` component with `type` prop (address | tx | token), external link icon, and truncated display. Update `footer.tsx` to import from the shared utility. Write unit tests for all URL variants (devnet detection from `NEXT_PUBLIC_RPC_URL`, mainnet default). Write render tests for ExplorerLink.
  - Verify: `cd app/web && npx vitest run __tests__/lib/explorer.test.ts __tests__/components/explorer-link.test.tsx` — all pass; `npx tsc --noEmit` — no new errors
  - Done when: `explorer.ts` exports `getCluster`, `getExplorerUrl`, `getExplorerTxUrl`, `getExplorerTokenUrl`; `ExplorerLink` renders with correct hrefs; footer.tsx uses the shared utility; all tests pass

- [x] **T02: Wire ExplorerLink into all on-chain action components** `est:45m`
  - Why: Closes TRUST-02 (every on-chain action links to Explorer) and eliminates all hardcoded cluster=devnet strings and Solscan URLs.
  - Files: `app/web/components/stake/stake-wizard/success-screen.tsx`, `app/web/components/badges/badge-card.tsx`, `app/web/components/badges/badge-celebration.tsx`, `app/web/components/stake/stake-card.tsx`, `app/web/components/dashboard/boost-status-card.tsx`
  - Do: (1) `success-screen.tsx` — replace hardcoded `https://explorer.solana.com/tx/${signature}?cluster=devnet` with `ExplorerLink` using type="tx". (2) `badge-card.tsx` — replace `https://solscan.io/tx/${claimSignature}?cluster=devnet` with `ExplorerLink` type="tx". (3) `badge-celebration.tsx` — replace Solscan URL with `ExplorerLink` type="tx". (4) `stake-card.tsx` — add `ExplorerLink` type="address" showing the stake PDA public key. (5) `boost-status-card.tsx` — add `ExplorerLink` type="address" showing the BoostRecord PDA when registered/active/revoked.
  - Verify: `grep -rn "cluster=devnet" app/web/ --include="*.tsx" --include="*.ts" | grep -v explorer.ts | grep -v node_modules` returns 0 matches; `grep -rn "solscan.io" app/web/ --include="*.tsx" --include="*.ts" | grep -v node_modules` returns 0 matches; `cd app/web && npx vitest run` — all 237+ tests pass; `npx tsc --noEmit` — no new errors
  - Done when: Zero hardcoded cluster=devnet strings outside explorer.ts; zero Solscan links; StakeCard and BoostStatusCard show Explorer links to their on-chain PDAs

- [x] **T03: LP pool stats hook and widget with dashboard integration** `est:1h`
  - Why: Closes FRONT-05 (LP pool stats widget). The most complex new component — an API-fetching hook, multi-state widget, and dashboard wiring.
  - Files: `app/web/lib/hooks/useLpPoolStats.ts`, `app/web/components/dashboard/lp-pool-stats.tsx`, `app/web/app/dashboard/page.tsx`, `app/web/__tests__/hooks/useLpPoolStats.test.ts`, `app/web/__tests__/components/lp-pool-stats.test.tsx`
  - Do: (1) Create `useLpPoolStats` hook: reads `NEXT_PUBLIC_RAYDIUM_POOL_ID` env var; when empty, returns `{ data: null, isPoolCreated: false }` without fetching; when set, fetches `https://api-v3.raydium.io/pools/info/ids?ids={poolId}` via React Query with `staleTime: 30_000`, `refetchInterval: 60_000`, `retry: 3`; returns `{ tvl, price, volume24h, isPoolCreated }`. (2) Create `LpPoolStats` widget with three states: "Pool not yet created" (no pool ID), loading skeleton, and data display showing TVL, HLX price, 24h volume in a card. Use existing Card/CardContent UI components. Include ExplorerLink to pool address when pool exists. (3) Integrate into dashboard/page.tsx after ProtocolStats, wrapped in ErrorBoundary. (4) Write hook tests covering: no pool ID → no fetch, successful fetch → parsed data, API error → error state. (5) Write component tests covering: empty state, loading state, data state with formatted values. Note: if Raydium API has CORS issues in browser, the hook should work via a Next.js API route proxy — but build the direct fetch first and document the proxy fallback.
  - Verify: `cd app/web && npx vitest run __tests__/hooks/useLpPoolStats.test.ts __tests__/components/lp-pool-stats.test.tsx` — all pass; `npx tsc --noEmit` — no new errors; `grep -n "LpPoolStats" app/web/app/dashboard/page.tsx` — component is imported and rendered
  - Done when: LP widget renders "Pool not yet created" when `NEXT_PUBLIC_RAYDIUM_POOL_ID` is empty; renders loading skeleton then data when pool ID is set; integrated into dashboard; all tests pass

- [x] **T04: End-to-end documentation section and SOL flow transparency** `est:45m`
  - Why: Closes TRUST-01 (published end-to-end docs), TRUST-03 (SOL flow transparency), and TRUST-04 (on-chain verifiability). The final content piece tying the full seed → boost → LP lifecycle together.
  - Files: `app/web/components/marketing/seed-docs.tsx`, `app/web/components/marketing/seed-sol-flow.tsx`, `app/web/app/(public)/seed/page.tsx`
  - Do: (1) Create `seed-docs.tsx` — a documentation section covering the full lifecycle in 4 parts: What the Seed Token Is (purpose, pump.fun launch), How SOL Flows to LP (creator rewards → team wallet → HLX/SOL pool), How Boost Works (register → snapshot → 10% multiplier → revocation rules), How to Verify On-Chain (ExplorerLinks to program ID `E9B7BsxdPS89M66CRGGbsCzQ9LkiGv6aNsra3cNBJha7`, GlobalState PDA, example BoostRecord). Use ExplorerLink component for all on-chain references. Match existing marketing section styling (ScrollReveal, zinc color palette, section spacing). (2) Enhance `seed-sol-flow.tsx` — add a "Verify On-Chain" subsection below the existing flow diagram with ExplorerLinks to the program address and a note that LP pool address will be added post-launch. (3) Update `seed/page.tsx` — import and render `SeedDocs` section between `SeedHeadroom` and `SeedCta`.
  - Verify: `cd app/web && npx tsc --noEmit` — no new errors; `cd app/web && npx vitest run` — all tests pass; `grep -n "SeedDocs" app/web/app/\(public\)/seed/page.tsx` — component is imported and rendered; `grep -n "ExplorerLink" app/web/components/marketing/seed-docs.tsx` — Explorer links present in documentation section
  - Done when: `/seed` page renders the end-to-end documentation section with on-chain Explorer links; SeedSolFlow has a "Verify On-Chain" subsection; all existing tests still pass

## Files Likely Touched

- `app/web/lib/utils/explorer.ts` (new)
- `app/web/components/ui/explorer-link.tsx` (new)
- `app/web/lib/hooks/useLpPoolStats.ts` (new)
- `app/web/components/dashboard/lp-pool-stats.tsx` (new)
- `app/web/components/marketing/seed-docs.tsx` (new)
- `app/web/__tests__/lib/explorer.test.ts` (new)
- `app/web/__tests__/components/explorer-link.test.tsx` (new)
- `app/web/__tests__/hooks/useLpPoolStats.test.ts` (new)
- `app/web/__tests__/components/lp-pool-stats.test.tsx` (new)
- `app/web/components/marketing/footer.tsx` (modify — import from shared utility)
- `app/web/components/stake/stake-wizard/success-screen.tsx` (modify — use ExplorerLink)
- `app/web/components/badges/badge-card.tsx` (modify — replace Solscan with Explorer)
- `app/web/components/badges/badge-celebration.tsx` (modify — replace Solscan with Explorer)
- `app/web/components/stake/stake-card.tsx` (modify — add Explorer link)
- `app/web/components/dashboard/boost-status-card.tsx` (modify — add Explorer link)
- `app/web/components/marketing/seed-sol-flow.tsx` (modify — add verify section)
- `app/web/app/(public)/seed/page.tsx` (modify — add SeedDocs)
- `app/web/app/dashboard/page.tsx` (modify — add LpPoolStats)
