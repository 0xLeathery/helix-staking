# Plan 07-02: Leaderboard and Whale Tracker Dashboard Pages - SUMMARY

**Phase:** 7 - Leaderboard and Marketing Site
**Plan:** 02 of 03
**Status:** Complete
**Completed:** 2026-02-08

## Objective

Build the leaderboard and whale tracker dashboard pages with their supporting components, and add navigation entries to the dashboard sidebar.

## What Was Built

### Components

#### RankingTable Component
**File:** `app/web/components/leaderboard/ranking-table.tsx`

- **Props**: `data: LeaderboardEntry[]`, `currentUser: string | null`, `isLoading: boolean`
- **Loading state**: Renders single Skeleton with h-[600px]
- **Table columns**:
  - Rank: # with special colors (gold #FFD700, silver #C0C0C0, bronze #CD7F32) for top 3
  - Wallet: Truncated address (8...6 chars) with font-mono
  - T-Shares: Formatted to 2 decimals (divided by 1e9)
  - Stakes: Active stake count
  - Total Staked: Formatted to 2 decimals + " HELIX" suffix
  - Duration: Max duration in days
- **Current user highlighting**: bg-helix-600/10 with border-l-2 border-helix-400, "(You)" badge in text-helix-400
- **Table styling**:
  - Header: border-b border-zinc-800, text-sm text-zinc-500, uppercase tracking-wider
  - Rows: border-b border-zinc-900, text-sm, hover:bg-zinc-900/50 transition-colors
  - Wrapped in Card with bg-surface border-zinc-800 p-0 overflow-hidden

#### WhaleFeed Component
**File:** `app/web/components/leaderboard/whale-feed.tsx`

- **Props**: `data: WhaleActivity[]`, `isLoading: boolean`
- **Loading state**: Renders 5 Skeleton cards stacked vertically
- **Activity items**: Each rendered as Card with:
  - Left: Type badge
    - 'stake': bg-emerald-500/10 text-emerald-400 "STAKED"
    - 'unstake': bg-red-500/10 text-red-400 "UNSTAKED"
  - Middle: Wallet address (truncated, font-mono), amount formatted (parseFloat / 1e9, toFixed(2) + " HELIX")
  - For stake type: Shows duration (days + " days") and T-shares
  - Right: Relative time using formatTimeAgo helper (Xd/Xh/Xm ago or "just now")
- **Layout**: Vertical stack with space-y-2, hover:border-zinc-700 transition

### Dashboard Pages

#### Leaderboard Page
**File:** `app/web/app/dashboard/leaderboard/page.tsx`

- **Title**: "Leaderboard" (text-3xl font-bold text-zinc-100)
- **Subtitle**: "Top stakers ranked by active T-shares" (text-zinc-400) with participant count
- **Data fetching**: useQuery with key `['leaderboard', publicKey?.toBase58()]`, queryFn calling `api.getLeaderboard(publicKey?.toBase58())`, refetchInterval: 60000 (1 min)
- **Component**: RankingTable with data, currentUser=publicKey?.toBase58(), isLoading
- **Features**: Shows total participant count if data available

#### Whale Tracker Page
**File:** `app/web/app/dashboard/whale-tracker/page.tsx`

- **Title**: "Whale Tracker" (text-3xl font-bold text-zinc-100)
- **Subtitle**: "Large stake movements" (text-zinc-400)
- **Data fetching**: useQuery with key `['whale-activity']`, queryFn calling `api.getWhaleActivity(50)`, refetchInterval: 30000 (30 sec)
- **Component**: WhaleFeed with data, isLoading
- **Info text**: "Showing transactions >= 100 HELIX" in text-xs text-zinc-500

### Navigation Updates

**File:** `app/web/app/dashboard/layout.tsx`

- **Added NAV_ITEMS entries**:
  1. `{ label: "Leaderboard", href: "/dashboard/leaderboard", icon: TrophyIcon }`
  2. `{ label: "Whale Tracker", href: "/dashboard/whale-tracker", icon: ActivityIcon }`
- **Position**: After "Swap" entry (grouping analytics-related features)
- **Total NAV_ITEMS**: 8 entries

- **New icon components**:
  - `TrophyIcon`: Trophy/cup shape SVG
  - `ActivityIcon`: Activity chart line SVG
  - Both follow existing pattern (inline SVG, className prop)

## Files Modified

1. `app/web/components/leaderboard/ranking-table.tsx` (created, 95 lines)
2. `app/web/components/leaderboard/whale-feed.tsx` (created, 89 lines)
3. `app/web/app/dashboard/leaderboard/page.tsx` (created, 36 lines)
4. `app/web/app/dashboard/whale-tracker/page.tsx` (created, 27 lines)
5. `app/web/app/dashboard/layout.tsx` (updated, +87 lines)

## Commits

1. `feat(07-02): create leaderboard and whale tracker components and pages` (41ad1f0)
2. `feat(07-02): add leaderboard and whale tracker to dashboard navigation` (ea907fe)

## Verification

- TypeScript compiles without errors: `cd app/web && npx tsc --noEmit` passes
- Leaderboard page exists at `app/web/app/dashboard/leaderboard/page.tsx`
- Whale tracker page exists at `app/web/app/dashboard/whale-tracker/page.tsx`
- RankingTable component highlights current user's row with bg-helix-600/10 and border-l-2 border-helix-400
- WhaleFeed component shows type badges (STAKED/UNSTAKED) with color coding (emerald for stake, red for unstake)
- Dashboard layout NAV_ITEMS includes both new pages with icons
- Both pages use React Query with refetchInterval (60s for leaderboard, 30s for whale tracker)
- All four new files exist and have expected line counts

## Design Decisions

### Leaderboard: Current User Highlighting
- Uses wallet address comparison to highlight the connected user's row
- Visual treatment: helix-tinted background, left border, "(You)" badge
- Matches dashboard's user-centric design pattern from Phase 4

### Leaderboard: Top 3 Special Styling
- Rank 1: Gold (#FFD700), Rank 2: Silver (#C0C0C0), Rank 3: Bronze (#CD7F32)
- Only applied to rank number (not entire row) for subtlety
- Creates visual hierarchy and gamification element

### Whale Feed: Type Badges
- Clear visual distinction between stake (green) and unstake (red) events
- Consistent with financial UI conventions (green=positive action, red=negative action)
- Badge style matches existing Button variant pattern

### Whale Feed: Time Formatting
- Relative time display (Xd/Xh/Xm ago) instead of absolute timestamps
- More intuitive for feed-style UI where recency matters
- Simple calculation from created_at timestamp (no external library)

### Refresh Intervals
- Leaderboard: 60s (slower, rankings change gradually)
- Whale Tracker: 30s (faster, feed benefits from fresher data)
- Both use React Query's refetchInterval for automatic background updates

### Component Reusability
- RankingTable and WhaleFeed are standalone components
- Can be embedded elsewhere (e.g., marketing site, different dashboard views)
- Props interface clearly separates data, state, and user context

## Testing Notes

- No runtime testing performed (requires live indexer with data)
- TypeScript compilation validates all type contracts
- Components will be validated during end-to-end testing in Phase 8
- Both pages will render empty state gracefully (empty arrays) if no data

## Next Steps

Phase 7 is now complete (all 3 plans done). Next phase is Phase 8: Testing, Audit, and Mainnet Launch.

## Notes

- Both pages follow exact dashboard patterns from Phase 4 (same Card, Skeleton, color scheme)
- Leaderboard supports user parameter to highlight current wallet even if outside top N
- Whale activity threshold (100 HELIX) is configurable via API minAmount param
- formatTimeAgo helper could be extracted to utils if reused elsewhere
- Default limit of 50 for whale activity can be adjusted via query param
- Leaderboard data includes user's rank even if outside top 50 (API design from 07-01)
