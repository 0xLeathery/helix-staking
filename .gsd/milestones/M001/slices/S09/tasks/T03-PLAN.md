---
estimated_steps: 7
estimated_files: 5
---

# T03: LP pool stats hook and widget with dashboard integration

**Slice:** S09 — LP Stats, Docs & Transparency
**Milestone:** M001

## Description

Create the `useLpPoolStats` React Query hook that fetches pool data from Raydium API v3, the `LpPoolStats` dashboard widget showing TVL, HLX price, and 24h volume, and wire it into the dashboard page. This closes FRONT-05 (LP pool stats widget showing TVL, price, volume when pool exists).

The critical design constraint: the LP pool **does not exist yet at launch**. The env var `NEXT_PUBLIC_RAYDIUM_POOL_ID` will be empty. The widget must show a meaningful "Pool not yet created" state — not an error. When the team creates the pool post-launch, setting the env var activates the live stats display.

Follow the existing React Query hook pattern from `useGlobalState.ts` (staleTime, refetchInterval, error handling). Use short cache times (staleTime 30s, refetchInterval 60s) because pool stats change frequently.

**Relevant skill:** `frontend-design` — for the LP stats widget design. Match the existing dashboard card aesthetic (zinc-900 backgrounds, zinc-800 borders, zinc-100 text, helix accent colors).

## Steps

1. **Create `app/web/lib/hooks/useLpPoolStats.ts`**:
   - Read `NEXT_PUBLIC_RAYDIUM_POOL_ID` from `process.env`
   - Export interface `LpPoolData { tvl: number; price: number; volume24h: number; poolAddress: string }`
   - If pool ID is empty/undefined, return `{ data: null, isPoolCreated: false, isLoading: false, error: null }`
   - If pool ID is set, use `useQuery` to fetch `https://api-v3.raydium.io/pools/info/ids?ids=${poolId}`
   - Parse response: `response.data[0]` → extract `tvl`, `price`, `day.volume` fields
   - React Query config: `queryKey: ["lpPoolStats", poolId]`, `staleTime: 30_000`, `refetchInterval: 60_000`, `retry: 3`, `enabled: !!poolId`
   - Return `{ data: LpPoolData | null, isPoolCreated: boolean, isLoading, error }`
   - Handle fetch errors gracefully — React Query's retry handles transients

2. **Create `app/web/__tests__/hooks/useLpPoolStats.test.ts`**:
   - Test: returns `isPoolCreated: false` when `NEXT_PUBLIC_RAYDIUM_POOL_ID` is empty
   - Test: does not fetch when pool ID is empty (`enabled: false` check)
   - Test: fetches from correct Raydium API URL when pool ID is set
   - Test: parses API response correctly into `LpPoolData` shape
   - Test: returns error state on API failure
   - Mock `fetch` globally — do not actually call Raydium API
   - Use `vi.stubEnv` for the pool ID env var
   - Follow the existing test patterns (see `__tests__/hooks/` directory for examples)

3. **Create `app/web/components/dashboard/lp-pool-stats.tsx`**:
   - Import `useLpPoolStats` hook
   - Import `ExplorerLink` from `@/components/ui/explorer-link`
   - Import existing `Card`, `CardContent` from `@/components/ui/card`
   - **Empty state** (no pool ID): Card with a "Pool Not Yet Created" message, brief explanation that the HLX/SOL pool will be created after seed launch, muted styling
   - **Loading state**: Card with skeleton placeholders (use Tailwind animate-pulse on grey rectangles)
   - **Error state**: Card with "Unable to load pool stats" message and retry hint
   - **Data state**: Card showing three stats in a row:
     - TVL: formatted as `$X.XXM` or `$X.XXK` with appropriate scaling
     - HLX Price: formatted as `$X.XXXXX` (small token price)
     - 24h Volume: formatted as `$X.XXK` or `$X.XXM`
   - When data is available, include `ExplorerLink type="address" value={poolAddress}` below stats
   - Title: "LP Pool" with a small liquidity/pool icon
   - Match the existing dashboard card aesthetic from ProtocolStats

4. **Create `app/web/__tests__/components/lp-pool-stats.test.tsx`**:
   - Test: renders "Pool Not Yet Created" when `useLpPoolStats` returns `isPoolCreated: false`
   - Test: renders loading skeleton when `isLoading: true`
   - Test: renders formatted TVL, price, volume when data is present
   - Test: renders error message when error is present
   - Test: renders ExplorerLink to pool address when data is present
   - Mock `useLpPoolStats` hook — do not test the actual fetch in component tests

5. **Integrate into `app/web/app/dashboard/page.tsx`**:
   - Import `LpPoolStats` from `@/components/dashboard/lp-pool-stats`
   - Add after the ProtocolStats section, wrapped in `<ErrorBoundary>` and `<m.div variants={staggerItem}>`
   - Follow the exact same pattern as the existing BoostStatusCard integration

## Must-Haves

- [ ] `useLpPoolStats` hook returns `isPoolCreated: false` when env var is empty (no fetch attempted)
- [ ] `useLpPoolStats` fetches from Raydium API v3 when pool ID is set
- [ ] Hook uses short cache times: `staleTime: 30_000`, `refetchInterval: 60_000`
- [ ] Widget shows "Pool Not Yet Created" state when no pool ID
- [ ] Widget shows loading skeleton while fetching
- [ ] Widget shows formatted TVL, price, and volume when data is available
- [ ] Widget shows error state on persistent API failure
- [ ] Widget includes ExplorerLink to pool address when data is available
- [ ] Integrated into dashboard page with ErrorBoundary
- [ ] All new tests pass
- [ ] All existing 237+ tests pass

## Verification

- `cd app/web && npx vitest run __tests__/hooks/useLpPoolStats.test.ts __tests__/components/lp-pool-stats.test.tsx` — all pass
- `cd app/web && npx vitest run` — all 237+ tests still pass
- `cd app/web && npx tsc --noEmit` — no new type errors
- `grep -n "LpPoolStats" app/web/app/dashboard/page.tsx` — component is imported and rendered

## Observability Impact

- Signals added: Console error logged on Raydium API fetch failure (React Query default behavior)
- How a future agent inspects this: Check `NEXT_PUBLIC_RAYDIUM_POOL_ID` env var to see if pool is configured; check browser Network tab for Raydium API requests; check widget state (empty/loading/error/data)
- Failure state exposed: Widget displays "Unable to load pool stats" with muted styling on persistent API error

## Inputs

- `app/web/lib/utils/explorer.ts` — Explorer URL utility (from T01)
- `app/web/components/ui/explorer-link.tsx` — ExplorerLink component (from T01)
- `app/web/app/dashboard/page.tsx` — current dashboard layout (integration target)
- `app/web/lib/hooks/useGlobalState.ts` — reference React Query hook pattern (staleTime, refetchInterval, queryKey)
- `app/web/components/dashboard/protocol-stats.tsx` — reference for dashboard card styling

## Expected Output

- `app/web/lib/hooks/useLpPoolStats.ts` — React Query hook fetching Raydium API v3
- `app/web/components/dashboard/lp-pool-stats.tsx` — LP pool stats widget with 4 states
- `app/web/__tests__/hooks/useLpPoolStats.test.ts` — hook behavioral tests
- `app/web/__tests__/components/lp-pool-stats.test.tsx` — component render tests
- `app/web/app/dashboard/page.tsx` — modified to include LpPoolStats
