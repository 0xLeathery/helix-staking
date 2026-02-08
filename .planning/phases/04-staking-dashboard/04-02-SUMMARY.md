---
phase: 04-staking-dashboard
plan: 02
subsystem: ui
tags: [react-query, hooks, math, dashboard, stake-viewing, websocket, bn.js]

# Dependency graph
requires:
  - phase: 04-staking-dashboard
    plan: 01
    provides: "Next.js scaffold, wallet connection, Anchor program singleton, PDA helpers, shadcn/ui components, constants"
provides:
  - "React Query hooks for on-chain data (useProgram, useGlobalState, useStakes, useTokenBalance)"
  - "Math module matching on-chain math.rs (T-shares, bonuses, penalties, rewards)"
  - "Token formatting utilities (formatHelix, parseHelix, formatBps, formatDays, formatTShares)"
  - "Dashboard page with wallet gate, protocol stats, portfolio summary, stakes list"
  - "StakeCard component with status badges, progress bar, and action buttons"
affects: [04-03, 04-04, 04-05]

# Tech tracking
tech-stack:
  added: []
  patterns: ["React Query hooks with WebSocket invalidation + polling fallback", "memcmp filter on user pubkey for getProgramAccounts", "BN.js arithmetic matching on-chain Rust math", "Wallet gate pattern in dashboard layout", "Status badge color coding (green/yellow/red)", "Responsive sidebar with mobile hamburger menu"]

key-files:
  created:
    - app/web/lib/hooks/useProgram.ts
    - app/web/lib/hooks/useGlobalState.ts
    - app/web/lib/hooks/useStakes.ts
    - app/web/lib/hooks/useTokenBalance.ts
    - app/web/lib/solana/math.ts
    - app/web/lib/utils/format.ts
    - app/web/app/dashboard/layout.tsx
    - app/web/app/dashboard/page.tsx
    - app/web/components/dashboard/protocol-stats.tsx
    - app/web/components/dashboard/portfolio-summary.tsx
    - app/web/components/stake/stake-card.tsx
    - app/web/components/dashboard/stakes-list.tsx
  modified: []

key-decisions:
  - "useProgram uses 'as any' cast for wallet signTransaction/signAllTransactions to satisfy getProgram's generic type signature"
  - "Token-2022 program ID hardcoded in useTokenBalance (matches on-chain program)"
  - "Math module uses BN.js mulDiv/mulDivUp helpers matching Rust mul_div/mul_div_up exactly"
  - "StakeCard estimates currentSlot from globalState.initSlot + currentDay * SLOTS_PER_DAY"
  - "SVG icons inlined rather than importing lucide-react to avoid potential bundle issues"
  - "StakesList sorts by endSlot ascending (most urgent stakes first)"

patterns-established:
  - "useGlobalState: WebSocket onAccountChange + 60s polling fallback + 30s staleTime"
  - "useStakes: memcmp at offset 8 + per-stake WebSocket subscriptions + 15s staleTime"
  - "useTokenBalance: Token-2022 ATA derivation + graceful 0 on missing account"
  - "Dashboard layout: sidebar (desktop) / hamburger (mobile) with wallet gate"
  - "StakeCard status: matured/grace=green, active-early=yellow, active-late/late=red"

# Metrics
duration: 12min
completed: 2026-02-08
---

# Phase 4 Plan 2: Dashboard and Hooks Summary

**React Query hooks with WebSocket cache invalidation, BN.js math module matching on-chain Rust exactly, and dashboard page with protocol stats, portfolio summary, and stake cards**

## Performance

- **Duration:** 12 min
- **Started:** 2026-02-08T05:46:31Z
- **Completed:** 2026-02-08T05:58:42Z
- **Tasks:** 2
- **Files created:** 12

## Accomplishments
- 4 React Query hooks (useProgram, useGlobalState, useStakes, useTokenBalance) with WebSocket subscriptions and polling fallback
- Math module with 6 functions (calculateLpbBonus, calculateBpbBonus, calculateTShares, calculateEarlyPenalty, calculateLatePenalty, calculatePendingRewards) matching on-chain math.rs formula-for-formula
- Format utilities (formatHelix, formatHelixCompact, parseHelix, formatBps, formatDays, formatTShares, truncateAddress) with BN.js precision
- Dashboard layout with sidebar navigation, wallet gate, and responsive mobile hamburger menu
- ProtocolStats component showing 4 stat cards with tooltips (Total Staked, Total T-Shares, T-Share Price, Current Day)
- PortfolioSummary with aggregated user data (wallet balance, active stakes, total T-shares, pending rewards)
- StakeCard with color-coded status badges, progress bar, pending rewards, BPD bonus display
- StakesList with urgency-sorted active stakes, skeleton loading, error retry, empty state CTAs
- All user-facing terminology matches decisions: Duration Bonus, Size Bonus, T-Share Price

## Task Commits

Each task was committed atomically:

1. **Task 1: React Query hooks, math module, and formatting utilities** - `be00241` (feat)
2. **Task 2: Dashboard layout, protocol stats, portfolio summary, and stakes list** - `eaaaeb3` (feat)

## Files Created/Modified

- `app/web/lib/hooks/useProgram.ts` - Typed Program<HelixStaking> hook with read-only fallback
- `app/web/lib/hooks/useGlobalState.ts` - GlobalState hook with WebSocket invalidation + 60s polling
- `app/web/lib/hooks/useStakes.ts` - User stakes hook with memcmp filter at offset 8
- `app/web/lib/hooks/useTokenBalance.ts` - Token-2022 balance hook with ATA derivation
- `app/web/lib/solana/math.ts` - On-chain math mirror (6 functions, BN.js, mulDiv/mulDivUp)
- `app/web/lib/utils/format.ts` - Token formatting (8 functions, BN.js precision)
- `app/web/app/dashboard/layout.tsx` - Dashboard layout with wallet gate, sidebar nav, responsive mobile menu
- `app/web/app/dashboard/page.tsx` - Dashboard page composing ProtocolStats + PortfolioSummary + StakesList
- `app/web/components/dashboard/protocol-stats.tsx` - 4 protocol stat cards with tooltips
- `app/web/components/dashboard/portfolio-summary.tsx` - Aggregated portfolio with New Stake CTA
- `app/web/components/stake/stake-card.tsx` - Individual stake card with status badge, progress bar, actions
- `app/web/components/dashboard/stakes-list.tsx` - Stakes list with urgency sorting

## Decisions Made

- **Type casting for wallet adapter:** Used `as any` for signTransaction/signAllTransactions to bridge wallet adapter typed functions with getProgram's generic signature. Safe because Anchor Provider handles the actual type validation.
- **Inline SVG icons:** Used inline SVG icon components instead of importing from lucide-react to avoid potential Next.js bundle/SSR issues with the icon library.
- **Current slot estimation:** StakeCard estimates current slot from `initSlot + currentDay * SLOTS_PER_DAY` since we don't have a direct slot subscription. This is accurate enough for UI display purposes.
- **Sorting by endSlot:** StakesList sorts ascending by endSlot to surface the most urgent stakes (closest to maturity or already past) first.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

- TypeScript type mismatch between wallet adapter's typed `signTransaction<T>(tx: T): Promise<T>` and getProgram's generic `(...args: unknown[]) => Promise<unknown>` signature. Resolved with `as any` cast (Rule 1 - auto-fix bug).

## Next Phase Readiness

- All hooks ready for downstream plans (04-03 stake wizard, 04-04 unstake/claim, 04-05 free claim)
- Math module ready for stake wizard bonus preview (calculateLpbBonus, calculateBpbBonus, calculateTShares)
- Format utilities ready for all amount displays across the dashboard
- Dashboard layout provides the shell for all subsequent dashboard pages
- StakeCard pattern established for consistent stake display

## Self-Check: PASSED

All 12 created files verified present. Both commit hashes (be00241, eaaaeb3) verified in git log. TypeScript compilation passes. Next.js build succeeds.

---
*Phase: 04-staking-dashboard*
*Completed: 2026-02-08*
