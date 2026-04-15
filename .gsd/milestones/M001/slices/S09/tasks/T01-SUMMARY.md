---
id: T01
parent: S09
milestone: M001
provides:
  - Shared Explorer URL utility (getCluster, getExplorerUrl, getExplorerTxUrl, getExplorerTokenUrl)
  - Reusable ExplorerLink React component
key_files:
  - app/web/lib/utils/explorer.ts
  - app/web/components/ui/explorer-link.tsx
  - app/web/__tests__/lib/explorer.test.ts
  - app/web/__tests__/components/explorer-link.test.tsx
key_decisions:
  - Reused existing truncateAddress from lib/utils/format.ts instead of duplicating truncation logic
  - Used a URL_BUILDERS record to map ExplorerLink type prop to the correct URL function
patterns_established:
  - All Solana Explorer URLs generated through lib/utils/explorer.ts — never inline
  - ExplorerLink component as the standard UI surface for on-chain links
observability_surfaces:
  - grep for getExplorerUrl/getExplorerTxUrl/getExplorerTokenUrl imports to audit all Explorer link consumers
  - 18 unit/render tests cover utility + component
duration: ~10min
verification_result: passed
completed_at: 2026-03-17
blocker_discovered: false
---

# T01: Extract Explorer utility and create ExplorerLink component with tests

**Extracted cluster-aware Explorer URL logic from footer.tsx into a shared utility and built a reusable ExplorerLink component with full test coverage.**

## What Happened

1. Created `app/web/lib/utils/explorer.ts` with four exports: `getCluster()` (detects devnet from `NEXT_PUBLIC_RPC_URL`), `getExplorerUrl()` (address URLs), `getExplorerTxUrl()` (transaction URLs), `getExplorerTokenUrl()` (token mint URLs). Internal `clusterSuffix()` helper avoids repeated cluster detection.

2. Created `app/web/__tests__/lib/explorer.test.ts` — 10 tests covering devnet detection, mainnet fallback, undefined env, and URL generation for all three URL types.

3. Created `app/web/components/ui/explorer-link.tsx` — a `"use client"` component accepting `type`, `value`, `label`, `truncate`, and `className` props. Uses a record-based dispatch to the correct URL builder. Reuses the existing `truncateAddress` from `lib/utils/format.ts` (first 4 + `...` + last 4). Renders with `ExternalLink` icon from lucide-react, opens in new tab, styled with helix-400/helix-300 accent colors and mono font.

4. Created `app/web/__tests__/components/explorer-link.test.tsx` — 8 render tests covering href correctness for all three types, truncation, full display, custom label, target/rel attributes, and icon presence.

5. Updated `app/web/components/marketing/footer.tsx` — removed local `getCluster()` and `getExplorerUrl()` functions, added import from `@/lib/utils/explorer`. `PROGRAM_ID` constant remains in footer (only used there).

## Verification

- `npx vitest run __tests__/lib/explorer.test.ts __tests__/components/explorer-link.test.tsx` — **18/18 tests pass**
- `npx vitest run` — **255/255 tests pass** (237 existing + 18 new, no regressions)
- `npx tsc --noEmit` — no new type errors (all errors are pre-existing missing module declarations)
- `grep -n "getCluster\|getExplorerUrl" app/web/components/marketing/footer.tsx` — shows import from `@/lib/utils/explorer` (line 2) and usage (line 66), no local function definitions

### Slice-level verification (partial — T01 is first task):
- ✅ All 255 tests pass including new test files
- ✅ No new type errors
- ⏳ `grep -rn "cluster=devnet"` still finds 3 hardcoded instances in success-screen.tsx, badge-card.tsx, badge-celebration.tsx — these are in scope for later S09 tasks
- ⏳ `grep -rn "solscan.io"` still finds 2 Solscan URLs in badge-card.tsx and badge-celebration.tsx — will be normalized by later S09 tasks

## Diagnostics

- Run `grep -rn "getExplorerUrl\|getExplorerTxUrl\|getExplorerTokenUrl" app/web/ --include="*.ts" --include="*.tsx" | grep -v node_modules` to list all Explorer URL consumers
- If Explorer links point to wrong cluster: check `NEXT_PUBLIC_RPC_URL` env var — defaults to mainnet if unset/empty
- Test suite: `cd app/web && npx vitest run __tests__/lib/explorer.test.ts __tests__/components/explorer-link.test.tsx`

## Deviations

- None. Implementation matches plan exactly.

## Known Issues

- Worktree at `.gsd/worktrees/M001` had no `node_modules` — resolved by symlinking to main repo's `node_modules`. This is a worktree setup concern, not a code issue.

## Files Created/Modified

- `app/web/lib/utils/explorer.ts` — new shared utility: getCluster, getExplorerUrl, getExplorerTxUrl, getExplorerTokenUrl
- `app/web/components/ui/explorer-link.tsx` — new reusable ExplorerLink component with truncation, icon, and external link behavior
- `app/web/__tests__/lib/explorer.test.ts` — 10 unit tests for explorer utility
- `app/web/__tests__/components/explorer-link.test.tsx` — 8 render tests for ExplorerLink component
- `app/web/components/marketing/footer.tsx` — removed local getCluster/getExplorerUrl, now imports from shared utility
