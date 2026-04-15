# S09: LP Stats, Docs & Transparency — Research

**Date:** 2026-03-17

## Summary

S09 covers four frontend deliverables — an LP pool stats widget, end-to-end documentation, Solana Explorer links on every on-chain action, and a SOL flow transparency dashboard. The codebase is well-prepared: the `/seed` page already explains boost mechanics across 5 sections, recharts is installed and used in 3 analytics components, a cluster-aware `getCluster()`/`getExplorerUrl()` utility exists in `footer.tsx`, and the indexer `api.ts` fetcher pattern is established. No new libraries or Anchor program changes are needed.

The main work is: (1) extract the Explorer URL utility into a shared module and add a reusable `ExplorerLink` component, (2) create an LP pool stats widget that reads from Raydium API v3 or direct RPC, (3) wire Explorer links into StakeCard, BoostStatusCard, and success screens, (4) enhance the `/seed` page SOL flow section with real account addresses and Explorer links, and (5) add a dedicated documentation section tying the full seed → boost → LP lifecycle together.

Pre-launch vs post-launch is the primary design constraint. The LP pool won't exist at launch time, so the widget must gracefully show a "not yet created" state. The SOL flow section must work with placeholder addresses that become real links post-launch.

## Recommendation

Build in this order: Explorer utility + component first (unblocks everything), then LP stats widget (most complex), then wire Explorer links into existing components, then documentation/transparency enhancements. All work is purely frontend — no indexer, crank, or Anchor changes.

Use Raydium API v3 (`https://api-v3.raydium.io/pools/info/ids?ids={poolId}`) for LP pool stats. This is the documented public API that returns TVL, volume, and price. Fall back to direct RPC `getAccountInfo` on the pool's token vaults for live balance if the API is slow or unreliable. Store the pool ID as a `NEXT_PUBLIC_RAYDIUM_POOL_ID` env var — when empty, the widget shows "Pool not yet created."

## Implementation Landscape

### Key Files

**Existing — to modify:**
- `app/web/components/marketing/footer.tsx` — contains `getCluster()` and `getExplorerUrl()` that must be extracted into a shared utility
- `app/web/components/stake/stake-card.tsx` — needs Explorer link on stake public key
- `app/web/components/dashboard/boost-status-card.tsx` — needs Explorer link to BoostRecord PDA
- `app/web/components/stake/stake-wizard/success-screen.tsx` — already has Explorer link but hardcodes `?cluster=devnet`; needs cluster-aware utility
- `app/web/components/badges/badge-card.tsx` — uses Solscan link; normalize to shared Explorer utility
- `app/web/app/(public)/seed/page.tsx` — add documentation section import
- `app/web/components/marketing/seed-sol-flow.tsx` — enhance with real account addresses + Explorer links
- `app/web/components/marketing/nav.tsx` — may need "Docs" link if adding a separate docs page
- `app/web/app/dashboard/page.tsx` — add LP stats widget
- `app/web/.env.example` — add `NEXT_PUBLIC_RAYDIUM_POOL_ID`
- `app/web/lib/api.ts` — no change needed; LP stats come from Raydium API, not the indexer

**New — to create:**
- `app/web/lib/utils/explorer.ts` — cluster-aware Explorer URL utility (extracted from footer.tsx)
- `app/web/components/ui/explorer-link.tsx` — reusable `ExplorerLink` component (address, tx, token variants)
- `app/web/components/dashboard/lp-pool-stats.tsx` — LP pool stats widget (TVL, price, volume)
- `app/web/lib/hooks/useLpPoolStats.ts` — React Query hook fetching Raydium API v3
- `app/web/components/marketing/seed-docs.tsx` — end-to-end documentation section (seed → boost → LP lifecycle)
- `app/web/__tests__/lib/explorer.test.ts` — tests for URL generation utility
- `app/web/__tests__/components/explorer-link.test.tsx` — render tests for ExplorerLink component
- `app/web/__tests__/components/lp-pool-stats.test.tsx` — render tests for LP stats (loading, data, empty states)
- `app/web/__tests__/hooks/useLpPoolStats.test.ts` — hook behavioral tests

### Build Order

**Task 1: Explorer utility + component** — Extract `getCluster()` / `getExplorerUrl()` from `footer.tsx` into `lib/utils/explorer.ts`. Add variants for tx, address, and token links. Create `ExplorerLink` component with external link icon. This unblocks all downstream Explorer link work.

**Task 2: LP pool stats hook + widget** — Create `useLpPoolStats` hook that fetches from Raydium API v3. Build `LpPoolStats` widget with TVL, HLX price, 24h volume stats. Handle "pool not created" state when env var is empty. Integrate into dashboard page.

**Task 3: Wire Explorer links into existing components** — Add `ExplorerLink` to StakeCard (stake PDA), BoostStatusCard (BoostRecord PDA), success-screen (use shared utility instead of hardcoded URL), badge-card (normalize from Solscan to Explorer). Enhance SeedSolFlow with on-chain account addresses.

**Task 4: End-to-end documentation section** — Create `seed-docs.tsx` component covering the full lifecycle: what the seed token is → how SOL flows to LP → how boost works → how to verify on-chain. Add to `/seed` page. Wire Explorer links to program address, GlobalState PDA, and example account types.

### Verification Approach

1. `npx vitest run` — all existing 237 tests pass + new tests pass
2. `npx tsc --noEmit` — no new type errors (pre-existing test file TS errors are deferred per STATE.md)
3. Visual: `ExplorerLink` renders with correct `href` for devnet/mainnet based on `NEXT_PUBLIC_RPC_URL`
4. Visual: LP stats widget shows loading skeleton → data (when pool ID is set) or "not yet created" (when empty)
5. Visual: StakeCard, BoostStatusCard, success-screen all show clickable Explorer links
6. `grep -rn "cluster=devnet" app/web/` confirms no remaining hardcoded cluster strings outside the shared utility

## Constraints

- **No indexer changes.** LP pool data comes from Raydium API v3, not the HELIX indexer. The indexer has no `lp_pool_state` table yet and building that is out of scope for this slice.
- **No Anchor program changes.** All work is frontend-only.
- **Pre-launch state must be handled.** The LP pool doesn't exist yet. `NEXT_PUBLIC_RAYDIUM_POOL_ID` will be empty at launch. Every component must render a meaningful empty state.
- **Cluster awareness.** Explorer URLs must detect devnet vs mainnet from `NEXT_PUBLIC_RPC_URL`. The pattern already exists in `footer.tsx` — extract, don't reinvent.
- **recharts is already installed** (`^2.15.0` in package.json). The `ChartWrapper` in `ui/chart.tsx` handles SSR via `next/dynamic`. Use it for any LP stats chart.
- **No `@raydium-io/raydium-sdk-v2` install needed.** LP stats are read from Raydium's public REST API, not the SDK. The SDK is only needed for pool creation (a one-time manual operation, not in scope here).
- **Standard SPL Token for seed ATA derivation** (not Token-2022) — established in S08, consistent across `useSeedBalance.ts` and `useRegisterBoost.ts`.

## Common Pitfalls

- **Hardcoded `?cluster=devnet` in Explorer URLs** — `success-screen.tsx` already does this. The shared utility must derive cluster from `NEXT_PUBLIC_RPC_URL` exactly like `footer.tsx` does. Grep and replace all hardcoded instances.
- **Raydium API v3 CORS** — The Raydium API may not support browser-origin CORS. If so, fetch server-side via a Next.js API route (`/api/lp-pool`) that proxies the Raydium request. Test in browser first before building a proxy.
- **LP stats widget showing stale data during high-volume periods** — Per pitfall #8 in research, use short React Query `staleTime` (15–30s) and `refetchInterval` (60s) for the pool stats hook. Do NOT cache for 5 minutes.
- **Mixed Solscan and Explorer links** — `badge-card.tsx` uses Solscan while everything else uses Explorer. Normalize to Solana Explorer for consistency, but keep both URL generators available in the utility if Solscan is preferred for certain views.

## Open Risks

- **Raydium API v3 availability** — The public endpoint `https://api-v3.raydium.io/pools/info/ids` may have rate limits or downtime. The LP stats widget should show a graceful error state and retry. React Query's `retry: 3` default handles transient failures.
- **Pool ID not known until LP is created** — The `NEXT_PUBLIC_RAYDIUM_POOL_ID` env var is empty until the team manually creates the pool (Phase 2 of the roadmap). The widget must render a meaningful placeholder, not an error.

## Sources

- Raydium API v3 pool info endpoint: `GET https://api-v3.raydium.io/pools/info/ids?ids={poolId}` — returns `{ data: [{ tvl, day: { volume }, price }] }` (documented in Raydium docs)
- Existing `getCluster()` / `getExplorerUrl()` pattern: `app/web/components/marketing/footer.tsx` lines 6–20
- Existing recharts integration: `app/web/components/ui/chart.tsx` + `app/web/components/analytics/SupplyChart.tsx`
- Existing React Query hook pattern: `app/web/lib/hooks/useGlobalState.ts` (staleTime, refetchInterval, WebSocket invalidation)
- Existing Explorer link in success-screen: `app/web/components/stake/stake-wizard/success-screen.tsx` line 86
- Existing Solscan link in badge-card: `app/web/components/badges/badge-card.tsx`
