# S09: LP Stats, Docs & Transparency — UAT

**Milestone:** M001
**Written:** 2026-03-17

## UAT Type

- UAT mode: artifact-driven
- Why this mode is sufficient: All deliverables are frontend components, a React Query hook, and a shared utility — verified through 28 new tests, type checking, and grep-based codebase audits. No live runtime or external API access required (pool doesn't exist yet).

## Preconditions

- Working directory: project root or `.gsd/worktrees/M001`
- `node_modules` present in `app/web/` (or symlinked)
- No env vars required for tests (tests mock environment)

## Smoke Test

```bash
cd app/web && npx vitest run && npx tsc --noEmit
```
All 265 tests pass. No new type errors.

## Test Cases

### 1. Explorer utility generates correct URLs

1. Run `cd app/web && npx vitest run __tests__/lib/explorer.test.ts`
2. **Expected:** 10/10 pass — covers devnet detection from `NEXT_PUBLIC_RPC_URL`, mainnet fallback, undefined env, and URL generation for address/tx/token types

### 2. ExplorerLink component renders correctly

1. Run `cd app/web && npx vitest run __tests__/components/explorer-link.test.tsx`
2. **Expected:** 8/8 pass — covers correct href for all 3 types, truncated display, full display, custom label, target="_blank" + rel="noopener noreferrer", and ExternalLink icon presence

### 3. Zero hardcoded cluster strings outside explorer utility

1. Run `grep -rn "cluster=devnet" app/web/ --include="*.tsx" --include="*.ts" | grep -v "explorer.ts" | grep -v "node_modules" | grep -v "__tests__"`
2. **Expected:** Zero matches — all `?cluster=devnet` strings eliminated from production code

### 4. Zero Solscan URLs remaining

1. Run `grep -rn "solscan.io" app/web/ --include="*.tsx" --include="*.ts" | grep -v "node_modules"`
2. **Expected:** Zero matches — all Solscan links replaced with Explorer links

### 5. ExplorerLink wired into all on-chain action components

1. Run `grep -rn "ExplorerLink" app/web/components/ --include="*.tsx" | grep -v "explorer-link.tsx"`
2. **Expected:** Matches in at least these 7 files: `success-screen.tsx`, `badge-card.tsx`, `badge-celebration.tsx`, `stake-card.tsx`, `boost-status-card.tsx`, `lp-pool-stats.tsx`, `seed-docs.tsx`, `seed-sol-flow.tsx`

### 6. LP pool stats hook behavior

1. Run `cd app/web && npx vitest run __tests__/hooks/useLpPoolStats.test.ts`
2. **Expected:** 5/5 pass — covers: empty pool ID returns `isPoolCreated: false` without fetching, successful fetch returns parsed TVL/price/volume, API error returns error state, pool data matches expected shape, no network requests when pool ID is empty

### 7. LP pool stats widget render states

1. Run `cd app/web && npx vitest run __tests__/components/lp-pool-stats.test.tsx`
2. **Expected:** 5/5 pass — covers: "Pool Not Yet Created" empty state, loading skeleton, data display with formatted values, error state "Unable to load pool stats", ExplorerLink to pool address when data present

### 8. LP pool stats integrated into dashboard

1. Run `grep -n "LpPoolStats" app/web/app/dashboard/page.tsx`
2. **Expected:** Import on line ~15 and render on line ~54

### 9. SeedDocs integrated into /seed page

1. Run `grep -n "SeedDocs" app/web/app/\(public\)/seed/page.tsx`
2. **Expected:** Import and render present — component rendered between Headroom and CTA sections

### 10. SeedDocs contains Explorer links for on-chain verification

1. Run `grep -n "ExplorerLink" app/web/components/marketing/seed-docs.tsx`
2. **Expected:** At least 2 ExplorerLink renders (program ID in SOL flow section and program ID in verification section)

### 11. SeedSolFlow has "Verify On-Chain" subsection

1. Run `grep -n "Verify" app/web/components/marketing/seed-sol-flow.tsx`
2. **Expected:** "Verify On-Chain" heading present with ExplorerLink to program address

### 12. Full test suite passes with no regressions

1. Run `cd app/web && npx vitest run`
2. **Expected:** 265/265 tests pass, 24 test files, 0 failures

## Edge Cases

### Explorer utility with undefined RPC URL

1. `getCluster()` is called when `NEXT_PUBLIC_RPC_URL` is undefined
2. **Expected:** Returns `"mainnet-beta"` (safe default — covered by explorer.test.ts)

### LP pool stats with empty pool ID

1. `NEXT_PUBLIC_RAYDIUM_POOL_ID` is empty or undefined
2. **Expected:** `useLpPoolStats` returns `{ data: null, isPoolCreated: false }` without making any network request. Widget shows "Pool Not Yet Created" placeholder with dashed border.

### LP pool stats with API failure

1. `NEXT_PUBLIC_RAYDIUM_POOL_ID` is set but Raydium API returns error
2. **Expected:** Hook retries 3 times, then returns error state. Widget shows "Unable to load pool stats" in penalty-colored alert.

### BoostStatusCard without connected wallet

1. No wallet connected — `publicKey` is null
2. **Expected:** No Explorer link rendered for BoostRecord PDA (component guards against null publicKey)

## Failure Signals

- Any test failure in the 4 new test files indicates a regression in explorer utility, ExplorerLink component, LP pool stats hook, or LP pool stats widget
- `grep -rn "cluster=devnet"` returning matches outside `explorer.ts` and `__tests__/` indicates a missed hardcoded URL
- `grep -rn "solscan.io"` returning any matches indicates incomplete migration
- Missing `ExplorerLink` imports in any on-chain component indicates incomplete wiring
- `LpPoolStats` or `SeedDocs` not found in their parent pages indicates broken integration

## Requirements Proved By This UAT

- **FRONT-05** — LP pool stats widget with TVL/price/volume and 4 render states (test cases 6, 7, 8)
- **TRUST-01** — End-to-end documentation on /seed page (test cases 9, 10)
- **TRUST-02** — Every on-chain action links to Explorer (test cases 3, 4, 5)
- **TRUST-03** — SOL flow transparency with on-chain verification (test case 11)
- **TRUST-04** — Boost state verifiable on-chain via Explorer links (test cases 5, 10)

## Not Proven By This UAT

- Live Raydium API integration (pool doesn't exist yet — CORS behavior untested)
- Visual rendering of components (no browser verification — artifact-driven UAT)
- Real wallet interactions with Explorer links opening in new tabs
- Production cluster detection behavior (would require live deployment)

## Notes for Tester

- All tests are automated — run the commands in order for a complete verification
- The LP pool stats widget is dormant by default (no `NEXT_PUBLIC_RAYDIUM_POOL_ID` set) — it shows a "Pool Not Yet Created" placeholder, which is the correct pre-launch behavior
- Pre-existing TypeScript errors in `stake-card.test.tsx`, `referral-stats-panel.test.tsx`, `portfolio-summary.test.tsx`, and `protocol-paused-banner.test.tsx` are deferred per STATE.md — these are missing `@testing-library/jest-dom` type declarations, not code defects
- S09 is the final slice in M001 — this UAT covers the last deliverables of the milestone
