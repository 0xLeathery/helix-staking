---
id: T03
parent: S09
milestone: M001
provides:
  - useLpPoolStats React Query hook with isPoolCreated guard
  - LpPoolStats dashboard widget with 4 states (empty, loading, error, data)
  - Dashboard integration with ErrorBoundary wrapper
key_files:
  - app/web/lib/hooks/useLpPoolStats.ts
  - app/web/components/dashboard/lp-pool-stats.tsx
  - app/web/app/dashboard/page.tsx
  - app/web/__tests__/hooks/useLpPoolStats.test.ts
  - app/web/__tests__/components/lp-pool-stats.test.tsx
key_decisions:
  - Used retryDelay 0 in test QueryClient to work around hook-level retry:3 overriding client-level retry:false
  - formatTokenPrice uses adaptive decimal places (4-6) based on magnitude for sub-penny token prices
  - Widget uses ExplorerLink with label="View pool on Explorer" rather than showing raw pool address
patterns_established:
  - External API hooks return isPoolCreated boolean so widgets can distinguish "feature disabled" from "loading" and "error"
  - Environment-gated features return early with null data + false flag when env var is empty — no fetch attempted
observability_surfaces:
  - Widget renders "Pool Not Yet Created" when NEXT_PUBLIC_RAYDIUM_POOL_ID is empty
  - Widget renders "Unable to load pool stats" on persistent Raydium API failure
  - React Query retry (3 attempts) handles transient Raydium API errors before surfacing error state
  - Browser Network tab shows requests to api-v3.raydium.io when pool ID is set
duration: 20m
verification_result: passed
completed_at: 2026-03-17
blocker_discovered: false
---

# T03: LP pool stats hook and widget with dashboard integration

**Built `useLpPoolStats` React Query hook and `LpPoolStats` dashboard widget with environment-gated pool detection, four render states, and full test coverage.**

## What Happened

Created the `useLpPoolStats` hook that reads `NEXT_PUBLIC_RAYDIUM_POOL_ID` to determine if the HLX/SOL pool exists. When empty (pre-launch default), the hook returns `{ data: null, isPoolCreated: false }` without making any fetch. When set, it fetches from Raydium API v3 (`/pools/info/ids`) with short cache times (staleTime 30s, refetchInterval 60s) and 3 retries.

Built the `LpPoolStats` widget with four states:
1. **Empty** — "Pool Not Yet Created" with dashed border and muted styling
2. **Loading** — shimmer skeletons matching the data layout
3. **Error** — "Unable to load pool stats" with penalty-colored alert
4. **Data** — three-column grid showing TVL, HLX Price, and 24h Volume with compact dollar formatting and an ExplorerLink to the pool address

Integrated the widget into the dashboard page after ProtocolStats, wrapped in ErrorBoundary and framer-motion staggerItem animation.

## Verification

- `cd app/web && npx vitest run __tests__/hooks/useLpPoolStats.test.ts __tests__/components/lp-pool-stats.test.tsx` — **10/10 pass**
- `cd app/web && npx vitest run` — **265/265 pass** (all existing + 10 new)
- `cd app/web && npx tsc --noEmit` — no new type errors (pre-existing test file TS errors deferred per STATE.md)
- `grep -n "LpPoolStats" app/web/app/dashboard/page.tsx` — component imported (line 15) and rendered (line 54)
- Slice-level checks:
  - `grep -rn "cluster=devnet" ... | grep -v explorer.ts | grep -v node_modules` — only test assertion strings (expected)
  - `grep -rn "solscan.io" ...` — zero matches

## Diagnostics

- Check `NEXT_PUBLIC_RAYDIUM_POOL_ID` env var to control widget state (empty = "not created", set = live fetch)
- Browser Network tab → filter `api-v3.raydium.io` to see pool data requests
- Widget shows "Unable to load pool stats" after 3 failed retries — indicates Raydium API issue or CORS
- If CORS blocks browser fetch: consider a Next.js API route proxy at `/api/pool-stats` — not yet needed

## Deviations

None.

## Known Issues

- Raydium API v3 may have CORS restrictions in browser — untested against live API since pool doesn't exist yet. If CORS blocks, a Next.js API route proxy is the standard solution (documented in the hook as a future option).

## Files Created/Modified

- `app/web/lib/hooks/useLpPoolStats.ts` — React Query hook with env-gated Raydium API fetching
- `app/web/components/dashboard/lp-pool-stats.tsx` — LP pool stats widget with 4 render states
- `app/web/app/dashboard/page.tsx` — added LpPoolStats import and rendering with ErrorBoundary
- `app/web/__tests__/hooks/useLpPoolStats.test.ts` — 5 hook behavioral tests
- `app/web/__tests__/components/lp-pool-stats.test.tsx` — 5 component render tests
