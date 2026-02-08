# Plan 07-01: Leaderboard and Whale Activity API Endpoints - SUMMARY

**Phase:** 7 - Leaderboard and Marketing Site
**Plan:** 01 of 03
**Status:** Complete
**Completed:** 2026-02-08

## Objective

Create two new indexer REST API endpoints (leaderboard rankings and whale activity feed) and update the frontend API client with typed functions to consume them.

## What Was Built

### Indexer Endpoints

#### GET /api/leaderboard
- **Purpose**: Returns top stakers ranked by active T-shares (default) or total staked or stake count
- **Query params**: `user` (optional string), `limit` (coerce number, max 100, default 50), `sort` (enum: t_shares | total_staked | stake_count)
- **Implementation**:
  - Uses two CTE approach with raw SQL via `db.execute(sql\`...\`)`
  - `active_stakes` CTE: LEFT JOIN `stake_created_events` with `stake_ended_events` ON (user AND stake_id), WHERE stake_ended_events.id IS NULL
  - Aggregates: SUM(t_shares::numeric), COUNT(*), SUM(amount::numeric), MAX(days)
  - `ranked` CTE: Applies RANK() OVER (ORDER BY [sort_column] DESC)
  - Final SELECT: WHERE rank <= limit OR user = user (includes specified user even if outside top N)
- **Response**: `{ data: rows }` where each row has: user, rank, total_t_shares (text), active_stake_count, total_staked (text), max_duration

#### GET /api/whale-activity
- **Purpose**: Returns large stake/unstake events sorted by slot descending
- **Query params**: `limit` (coerce number, max 100, default 50), `minAmount` (string, default '100000000000' = 100 HELIX)
- **Implementation**:
  - Uses UNION ALL with two SELECT statements:
    1. SELECT 'stake' as type, user, stake_id, amount, t_shares, days, slot, signature, created_at FROM stake_created_events WHERE amount::numeric >= minAmount
    2. UNION ALL SELECT 'unstake' as type, user, stake_id, original_amount as amount, NULL as t_shares, NULL as days, slot, signature, created_at FROM stake_ended_events WHERE original_amount::numeric >= minAmount
  - ORDER BY slot DESC, LIMIT limit
- **Response**: `{ data: rows }`

### Frontend API Client

**File**: `app/web/lib/api.ts`

#### New Interfaces
```typescript
export interface LeaderboardEntry {
  user: string;
  rank: number;
  total_t_shares: string;
  active_stake_count: number;
  total_staked: string;
  max_duration: number;
}

export interface WhaleActivity {
  type: 'stake' | 'unstake';
  user: string;
  stake_id: number;
  amount: string;
  t_shares: string | null;
  days: number | null;
  slot: number;
  signature: string;
  created_at: string;
}
```

#### New API Functions
```typescript
api.getLeaderboard(user?: string, limit?: number)
api.getWhaleActivity(limit?: number, minAmount?: string)
```

Both functions use URLSearchParams query builder pattern matching existing API client style.

## Files Modified

1. `services/indexer/src/api/routes/leaderboard.ts` (created)
2. `services/indexer/src/api/routes/whale-activity.ts` (created)
3. `services/indexer/src/api/index.ts` (updated to register new routes)
4. `app/web/lib/api.ts` (updated with new interfaces and functions)

## Commits

1. `feat(07-01): create leaderboard and whale activity indexer endpoints` (6132f9c)
2. `feat(07-01): add leaderboard and whale activity API client types and functions` (45226f3)

## Verification

- TypeScript compiles without errors in both indexer and frontend
- Leaderboard endpoint uses RANK() window function (not application-level sorting)
- Leaderboard endpoint filters to active stakes only (excludes ended stakes via LEFT JOIN + WHERE se.id IS NULL)
- Whale activity endpoint combines stake + unstake events via UNION ALL
- Both routes registered in `services/indexer/src/api/index.ts`
- `app/web/lib/api.ts` exports LeaderboardEntry and WhaleActivity types

## Design Decisions

### Leaderboard: Active Stakes Only
- Uses LEFT JOIN with WHERE se.id IS NULL pattern to exclude ended stakes
- Ensures leaderboard reflects current on-chain state (active T-shares)
- Matches dashboard's "active stakes" filter pattern from Phase 4

### Leaderboard: RANK() Window Function
- Database-level ranking with RANK() OVER clause
- More efficient than application-level sorting
- Supports "include user if outside top N" pattern via WHERE rank <= limit OR user = user clause

### Whale Activity: UNION ALL Pattern
- Combines stake_created_events and stake_ended_events in single query
- Uses 'stake' | 'unstake' type discriminator for frontend rendering
- NULL values for type-specific fields (t_shares/days only on stakes)
- Sorted by slot DESC for chronological feed (newest first)

### Query Validation: Zod
- Follows existing pattern from `stakes.ts` and `stats.ts`
- `z.coerce.number()` handles string-to-number conversion for query params
- Max limits (100) prevent runaway queries

### Response Format: { data: rows }
- Follows existing pattern from `stakes.ts` (paginated endpoints)
- Consistent API contract across all indexer routes
- Allows future expansion (e.g., adding pagination to leaderboard)

## Next Steps

Plan 07-02 will create the dashboard pages and components for leaderboard and whale tracker, consuming these endpoints.

## Notes

- No runtime testing performed (endpoints require live database with indexed events)
- Endpoints will be validated during Plan 07-02 UI development
- Default minAmount (100 HELIX) is configurable via query param for whale activity
- Leaderboard supports sorting by t_shares (default), total_staked, or stake_count
- Both endpoints return raw numeric values as text (preserving precision, matching existing schema pattern)
