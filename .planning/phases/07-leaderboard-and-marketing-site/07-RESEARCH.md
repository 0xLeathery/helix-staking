# Phase 7: Leaderboard and Marketing Site - Research

**Researched:** 2026-02-08
**Domain:** Next.js server-side rendering, leaderboard systems, marketing site design
**Confidence:** HIGH

## Summary

Phase 7 requires building two distinct but related features: (1) a leaderboard/whale tracker within the existing dashboard that displays competitive rankings and notable activity, and (2) a public-facing marketing site that explains the HELIX protocol to potential participants with fast load times and strong SEO.

Both features leverage the existing Next.js 14 app router foundation from Phase 4 and the indexer REST API from Phase 5. The leaderboard will be a client-authenticated dashboard page using React Query for data fetching, while the marketing site will use server-side rendering with static generation for optimal performance and SEO.

**Primary recommendation:** Use Next.js 14 App Router with ISR (Incremental Static Regeneration) for marketing pages (revalidate every 3600s), PostgreSQL window functions (RANK()) for leaderboard queries with new indexer endpoints, and the existing Recharts library for any data visualization. Keep the leaderboard as a dashboard-only feature (authenticated) and the marketing site as a separate public route tree.

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Next.js App Router | 14.2.0 | SSR, SSG, ISR for marketing site | Already in project, excellent SEO support, built-in image optimization |
| Recharts | 2.15.0 | Charts for leaderboard visualization | Already in project (Phase 6), React-native, declarative API |
| PostgreSQL Window Functions | N/A (native) | Leaderboard ranking queries | Standard SQL approach, no additional dependencies |
| React Query | 5.0.0 | Client-side data fetching for leaderboard | Already in project, perfect for authenticated dashboard data |
| shadcn/ui | Latest | UI components for both features | Already in project, consistent with existing dashboard |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Drizzle ORM | Latest | Database queries for new endpoints | Already in project, used for all indexer queries |
| Fastify | Latest | REST API endpoints | Already in project, used for all indexer routes |
| Zod | Latest | Query parameter validation | Already in project, used in Phase 5 endpoints |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| PostgreSQL RANK() | Redis sorted sets | Redis offers O(log n) leaderboard operations but adds infrastructure complexity; PostgreSQL sufficient for MVP scale |
| Next.js SSR | Client-only SPA | Pure SPA worse for SEO and initial load; SSR essential for marketing site discoverability |
| ISR | Full SSG | Full static generation faster but can't update between builds; ISR balances freshness with performance |

**Installation:**
```bash
# No new dependencies required - all libraries already in project
# Potential optimization: add specific Next.js image domains to next.config.js
```

## Architecture Patterns

### Recommended Project Structure
```
app/web/
├── app/
│   ├── (public)/           # Public marketing site route group
│   │   ├── page.tsx        # Landing page (SSR/ISR)
│   │   ├── how-it-works/   # Mechanics explanation
│   │   ├── tokenomics/     # Economics page
│   │   └── layout.tsx      # Public layout (no wallet gate)
│   └── dashboard/
│       ├── leaderboard/    # Authenticated leaderboard page
│       └── whale-tracker/  # Authenticated whale activity feed
└── components/
    ├── marketing/          # Marketing site components
    │   ├── hero.tsx
    │   ├── features.tsx
    │   ├── mechanics.tsx
    │   └── cta.tsx
    └── leaderboard/        # Leaderboard components
        ├── ranking-table.tsx
        ├── whale-feed.tsx
        └── user-position.tsx

services/indexer/
└── src/api/routes/
    ├── leaderboard.ts      # New endpoint for rankings
    └── whale-activity.ts   # New endpoint for large movements
```

### Pattern 1: Server Component with ISR for Marketing Pages
**What:** Marketing pages use Server Components with revalidation intervals for static generation with periodic updates
**When to use:** Any public-facing content page that needs SEO and doesn't require authentication
**Example:**
```typescript
// app/(public)/page.tsx
export const revalidate = 3600; // Revalidate every hour

export default async function MarketingPage() {
  // Server-side data fetching at build time
  const stats = await fetch('http://localhost:3001/api/stats')
    .then(res => res.json());

  return (
    <main>
      <Hero totalStakes={stats.totalStakes} />
      <Features />
      <Mechanics />
      <CTA />
    </main>
  );
}
```

### Pattern 2: PostgreSQL Window Function for Leaderboard Rankings
**What:** Use RANK() window function to efficiently compute global rankings without N+1 queries
**When to use:** Any feature that displays competitive rankings or top-N lists
**Example:**
```sql
-- Leaderboard query pattern
SELECT
    user,
    RANK() OVER (ORDER BY total_t_shares DESC) AS rank,
    total_t_shares,
    stake_count,
    total_staked
FROM (
    SELECT
        user,
        SUM(t_shares::numeric) as total_t_shares,
        COUNT(*) as stake_count,
        SUM(amount::numeric) as total_staked
    FROM stake_created_events
    GROUP BY user
) as aggregated
ORDER BY rank
LIMIT 100;
```

### Pattern 3: User Position Highlight in Leaderboard
**What:** Show current user's rank and immediate neighbors without computing all ranks
**When to use:** When user is authenticated and viewing leaderboard
**Example:**
```sql
WITH ranked_users AS (
  SELECT
      user,
      RANK() OVER (ORDER BY total_t_shares DESC) AS rank,
      total_t_shares
  FROM (
      SELECT user, SUM(t_shares::numeric) as total_t_shares
      FROM stake_created_events
      GROUP BY user
  ) as agg
)
SELECT * FROM ranked_users
WHERE rank <= 100 OR user = $1  -- Top 100 + current user
ORDER BY rank;
```

### Pattern 4: Whale Activity Feed with Time-Based Filtering
**What:** Query large stake creation/ending events with threshold filtering
**When to use:** Whale tracker showing notable protocol activity
**Example:**
```typescript
// services/indexer/src/api/routes/whale-activity.ts
fastify.get('/api/whale-activity', async (request, reply) => {
  const { limit = 50, minAmount = '100000000000' } = request.query as any;

  const [stakes, unstakes] = await Promise.all([
    db.select()
      .from(stakeCreatedEvents)
      .where(gte(stakeCreatedEvents.amount, minAmount))
      .orderBy(desc(stakeCreatedEvents.slot))
      .limit(limit),
    db.select()
      .from(stakeEndedEvents)
      .where(gte(stakeEndedEvents.originalAmount, minAmount))
      .orderBy(desc(stakeEndedEvents.slot))
      .limit(limit)
  ]);

  // Merge and sort by slot
  const combined = [...stakes, ...unstakes]
    .sort((a, b) => b.slot - a.slot)
    .slice(0, limit);

  return reply.send({ data: combined });
});
```

### Pattern 5: Marketing Site Metadata for SEO
**What:** Export static metadata from each page for search engine optimization
**When to use:** All public marketing pages
**Example:**
```typescript
// app/(public)/page.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'HELIX Protocol - Time-Locked Staking on Solana',
  description: 'Stake HELIX tokens with time commitment for T-share bonuses. Earn daily inflation rewards and participate in Big Pay Days.',
  openGraph: {
    title: 'HELIX Protocol',
    description: 'Time-locked staking with T-share bonuses',
    url: 'https://helix.protocol',
    siteName: 'HELIX',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HELIX Protocol',
    description: 'Time-locked staking with T-share bonuses',
    images: ['/twitter-card.png'],
  },
};
```

### Anti-Patterns to Avoid
- **Client-side ranking calculation:** Never compute RANK() or position in the frontend - always delegate to database window functions
- **Loading all leaderboard data:** Don't fetch full rankings if only top-N or user position needed - use LIMIT and WHERE clauses
- **Marketing pages as client components:** Avoid 'use client' on marketing pages unless interactive features required - server components better for SEO
- **Stale leaderboard data:** Don't rely on build-time static generation for leaderboards - use ISR with short revalidation (30-60s) or client-side fetching
- **OFFSET pagination for deep pages:** PostgreSQL OFFSET slows down for large offsets - use cursor-based pagination for activity feeds if needed

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Leaderboard ranking | Custom ranking algorithm in app | PostgreSQL RANK() window function | Window functions are optimized, handle ties correctly, and scale to millions of rows |
| Image optimization | Custom image resizer | Next.js Image component | Automatic WebP/AVIF conversion, responsive srcsets, lazy loading, CDN caching |
| Metadata management | Manual <head> tags | Next.js Metadata API | Type-safe, supports async data, automatic deduplication, better for app router |
| Form validation | Custom validation logic | Zod schemas (already in project) | Type inference, composable, runtime validation matches TypeScript types |
| Activity feed real-time updates | Custom WebSocket server | React Query with refetchInterval | Already in project, automatic cache management, handles errors/retries |

**Key insight:** Database window functions are THE standard approach for leaderboards - they're battle-tested for this exact use case and outperform application-level sorting/ranking by orders of magnitude at scale.

## Common Pitfalls

### Pitfall 1: N+1 Queries for User Position
**What goes wrong:** Fetching leaderboard, then making separate query to find user's rank
**Why it happens:** Intuitive to think "get top 100, then find my position" as two operations
**How to avoid:** Use single query with UNION or WHERE clause that includes both top-N and current user
**Warning signs:** Two separate database calls in leaderboard component, "position" prop loaded separately

### Pitfall 2: ISR Revalidation Too Aggressive
**What goes wrong:** Setting revalidate to 1-10 seconds on marketing pages, causing excessive rebuilds
**Why it happens:** Confusing ISR with client-side polling; wanting "real-time" data on static pages
**How to avoid:** Marketing pages rarely change - use 3600s (1 hour) or 86400s (1 day) for most content
**Warning signs:** High server load for static pages, cache misses in Next.js logs, slow initial page loads

### Pitfall 3: Leaderboard Data Mismatch with Current Stakes
**What goes wrong:** Leaderboard shows T-shares from stake creation, but stakes can be closed
**Why it happens:** Using stakeCreatedEvents without checking stakeEndedEvents
**How to avoid:** Calculate active T-shares by subtracting ended stakes, or track active state per stake
**Warning signs:** User sees themselves ranked with T-shares they no longer have, total doesn't match global state

### Pitfall 4: Whale Tracker Threshold Too Low
**What goes wrong:** Feed fills with "small whale" transactions that aren't notable
**Why it happens:** Setting minAmount without considering token economics and typical stake sizes
**How to avoid:** Calculate threshold as percentile (e.g., top 5% of stakes) or multiple of minimum stake
**Warning signs:** Whale feed is cluttered, users complain about noise, no clear "whale" definition

### Pitfall 5: Marketing Site Wallet Connection Confusion
**What goes wrong:** Users try to connect wallet on marketing site, get confused when it's not needed
**Why it happens:** Including wallet adapter UI in public layout when only dashboard needs it
**How to avoid:** Separate route groups - (public) layout has NO wallet UI, dashboard layout has wallet gate
**Warning signs:** "Connect Wallet" button visible on landing page, unnecessary wallet prompts

### Pitfall 6: Text-Heavy Tokenomics Explanations
**What goes wrong:** Wall of text about bonuses, penalties, formulas - users bounce
**Why it happens:** Trying to be comprehensive without considering visual communication
**How to avoid:** Use visual diagrams, interactive calculators, progressive disclosure (simple → detailed)
**Warning signs:** High bounce rate on tokenomics page, users asking "how does staking work?" in Discord

## Code Examples

Verified patterns from official sources and project context:

### Leaderboard Endpoint with User Position
```typescript
// services/indexer/src/api/routes/leaderboard.ts
import type { FastifyInstance, FastifyPluginCallback } from 'fastify';
import { desc, sql } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '../../db/client.js';
import { stakeCreatedEvents, stakeEndedEvents } from '../../db/schema.js';

const querySchema = z.object({
  user: z.string().optional(),
  limit: z.coerce.number().int().positive().max(100).default(50),
});

export const leaderboardRoutes: FastifyPluginCallback = (
  fastify: FastifyInstance,
  _opts,
  done,
) => {
  fastify.get('/api/leaderboard', async (request, reply) => {
    const { user, limit } = querySchema.parse(request.query);

    // Calculate active T-shares per user (created minus ended)
    const leaderboard = await db.execute(sql`
      WITH active_stakes AS (
        SELECT
          user,
          SUM(t_shares::numeric) as total_t_shares,
          COUNT(*) as active_stake_count,
          SUM(amount::numeric) as total_staked
        FROM stake_created_events
        WHERE user NOT IN (
          SELECT DISTINCT user FROM stake_ended_events
          WHERE stake_id = stake_created_events.stake_id
        )
        GROUP BY user
      ),
      ranked AS (
        SELECT
          user,
          RANK() OVER (ORDER BY total_t_shares DESC) as rank,
          total_t_shares::text,
          active_stake_count,
          total_staked::text
        FROM active_stakes
      )
      SELECT * FROM ranked
      WHERE rank <= ${limit} OR user = ${user || ''}
      ORDER BY rank
    `);

    return reply.send({ data: leaderboard.rows });
  });

  done();
};
```

### Whale Activity Feed Endpoint
```typescript
// services/indexer/src/api/routes/whale-activity.ts
import type { FastifyInstance, FastifyPluginCallback } from 'fastify';
import { desc, gte, sql, or } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '../../db/client.js';
import { stakeCreatedEvents, stakeEndedEvents } from '../../db/schema.js';

const querySchema = z.object({
  limit: z.coerce.number().int().positive().max(100).default(50),
  minAmount: z.coerce.bigint().default(BigInt('100000000000')), // 100 HELIX (9 decimals)
});

export const whaleActivityRoutes: FastifyPluginCallback = (
  fastify: FastifyInstance,
  _opts,
  done,
) => {
  fastify.get('/api/whale-activity', async (request, reply) => {
    const { limit, minAmount } = querySchema.parse(request.query);

    // Query large stakes and unstakes
    const activity = await db.execute(sql`
      (
        SELECT
          'stake' as type,
          user,
          stake_id,
          amount,
          t_shares,
          days,
          slot,
          signature,
          created_at
        FROM stake_created_events
        WHERE amount::numeric >= ${minAmount.toString()}
      )
      UNION ALL
      (
        SELECT
          'unstake' as type,
          user,
          stake_id,
          original_amount as amount,
          NULL as t_shares,
          NULL as days,
          slot,
          signature,
          created_at
        FROM stake_ended_events
        WHERE original_amount::numeric >= ${minAmount.toString()}
      )
      ORDER BY slot DESC
      LIMIT ${limit}
    `);

    return reply.send({ data: activity.rows });
  });

  done();
};
```

### Marketing Landing Page with ISR
```typescript
// app/(public)/page.tsx
import type { Metadata } from 'next';
import { Hero } from '@/components/marketing/hero';
import { Features } from '@/components/marketing/features';
import { Mechanics } from '@/components/marketing/mechanics';
import { CTA } from '@/components/marketing/cta';

export const metadata: Metadata = {
  title: 'HELIX Protocol - Time-Locked Staking on Solana',
  description: 'Stake HELIX tokens with time commitment for T-share bonuses. Earn daily inflation rewards and participate in Big Pay Days.',
};

// Revalidate every hour - marketing content rarely changes
export const revalidate = 3600;

export default async function HomePage() {
  // Fetch live stats for hero section - happens at build time or revalidation
  const stats = await fetch('http://localhost:3001/api/stats', {
    next: { revalidate: 3600 }
  }).then(res => res.json());

  return (
    <main className="flex flex-col">
      <Hero
        totalStakes={stats.totalStakes}
        currentDay={stats.currentDay}
        totalShares={stats.totalShares}
      />
      <Features />
      <Mechanics />
      <CTA />
    </main>
  );
}
```

### Leaderboard Table Component with User Highlight
```typescript
// app/dashboard/leaderboard/page.tsx
'use client';

import { useQuery } from '@tanstack/react-query';
import { useWallet } from '@solana/wallet-adapter-react';
import { api } from '@/lib/api';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/cn';

export default function LeaderboardPage() {
  const { publicKey } = useWallet();

  const { data, isLoading } = useQuery({
    queryKey: ['leaderboard', publicKey?.toBase58()],
    queryFn: () => api.getLeaderboard(publicKey?.toBase58()),
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  if (isLoading) {
    return <Skeleton className="h-[600px] w-full" />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-zinc-100">Leaderboard</h1>
        <p className="text-zinc-400">Top stakers ranked by active T-shares</p>
      </div>

      <Card className="p-6 bg-surface border-zinc-800">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-800 text-left text-sm text-zinc-500">
              <th className="pb-3 pr-4">Rank</th>
              <th className="pb-3 pr-4">Wallet</th>
              <th className="pb-3 pr-4">T-Shares</th>
              <th className="pb-3 pr-4">Stakes</th>
              <th className="pb-3">Total Staked</th>
            </tr>
          </thead>
          <tbody>
            {data?.data.map((entry: any) => {
              const isCurrentUser = publicKey && entry.user === publicKey.toBase58();
              return (
                <tr
                  key={entry.user}
                  className={cn(
                    'border-b border-zinc-900 text-sm',
                    isCurrentUser && 'bg-helix-600/10 font-semibold'
                  )}
                >
                  <td className="py-3 pr-4 text-zinc-400">#{entry.rank}</td>
                  <td className="py-3 pr-4 text-zinc-300 font-mono">
                    {entry.user.slice(0, 8)}...{entry.user.slice(-6)}
                    {isCurrentUser && (
                      <span className="ml-2 text-xs text-helix-400">(You)</span>
                    )}
                  </td>
                  <td className="py-3 pr-4 text-zinc-100">
                    {(parseFloat(entry.total_t_shares) / 1e9).toFixed(2)}
                  </td>
                  <td className="py-3 pr-4 text-zinc-300">
                    {entry.active_stake_count}
                  </td>
                  <td className="py-3 text-zinc-300">
                    {(parseFloat(entry.total_staked) / 1e9).toFixed(2)} HELIX
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Pages Router with getStaticProps | App Router with async Server Components | Next.js 13+ | Simpler data fetching, better streaming, improved performance |
| Client-side leaderboard calculation | PostgreSQL window functions | Standard since Postgres 8.4 (2009) | Orders of magnitude faster, handles millions of rows efficiently |
| Full static generation for all pages | ISR with per-page revalidation | Next.js 9.3+ | Dynamic content without sacrificing performance |
| Manual SEO meta tags | Metadata API with TypeScript types | Next.js 13+ | Type-safe, less duplication, supports async data |
| Custom pagination with OFFSET | Cursor-based pagination | Best practice shift ~2018 | Better performance for deep pagination, consistent results |

**Deprecated/outdated:**
- Pages Router (`pages/` directory): Still supported but App Router is recommended for new projects
- `getStaticProps`/`getServerSideProps`: Replaced by async Server Components in App Router
- `next/image` legacy: Version 13+ uses automatic optimization without manual configuration
- Manual `<Head>` component: Replaced by Metadata API in App Router

## Open Questions

1. **Whale Threshold Definition**
   - What we know: Need to define "whale" as minimum stake amount for activity feed
   - What's unclear: What threshold is meaningful for HELIX tokenomics? Top 1%? Top 5%? Fixed amount?
   - Recommendation: Start with configurable threshold (env var), default to 100 HELIX, allow adjustment based on user feedback

2. **Active vs Historical T-shares for Leaderboard**
   - What we know: Database has both stake creation and stake ending events
   - What's unclear: Should leaderboard show only ACTIVE T-shares (current stakes) or ALL-TIME T-shares (including closed)?
   - Recommendation: Default to active T-shares (what user currently has), add toggle for "All-Time" view

3. **Marketing Site Domain and Deployment**
   - What we know: Marketing site will be separate route group in existing Next.js app
   - What's unclear: Will it deploy to same domain (helix.app) or separate subdomain (www.helix.app)?
   - Recommendation: Same domain for simplicity, use route groups to separate concerns, add redirect from root to /dashboard if logged in

4. **Leaderboard Pagination Strategy**
   - What we know: Top 100 rankings fit comfortably on one page
   - What's unclear: Do we need pagination beyond top 100? Infinite scroll? Jump to user's position?
   - Recommendation: Show top 50 by default, "Load More" for next 50, always include current user's position card at top

5. **Real-time vs Polling for Whale Feed**
   - What we know: Whale activity feed will show large stake movements
   - What's unclear: Is 30-60 second polling acceptable or do we need WebSocket real-time updates?
   - Recommendation: Start with 30s polling (matches React Query pattern), upgrade to WebSocket only if users request real-time

## Sources

### Primary (HIGH confidence)
- **Next.js Documentation** - /vercel/next.js/v14.3.0-canary.87 via Context7
  - Static generation patterns
  - generateStaticParams for dynamic routes
  - Metadata API for SEO
  - App Router Server Components
- **PostgreSQL Leaderboard Query Example** - https://blog.programster.org/postgresql-leaderboard-query-example
  - RANK() window function patterns
  - Handling ties in rankings
  - Finding user position within large datasets
- **ISR Implementation Patterns** - https://oneuptime.com/blog/post/2026-01-24-nextjs-incremental-static-regeneration/view
  - Revalidation configuration (time-based and on-demand)
  - Per-fetch cache control
  - Content type revalidation strategies
  - Error handling best practices
- **Existing Project Code** (app/web/, services/indexer/)
  - Current Next.js 14 setup with App Router
  - Existing Recharts integration
  - Drizzle ORM patterns for indexer
  - shadcn/ui component library usage

### Secondary (MEDIUM confidence)
- **Leaderboard UI Design Patterns** - https://ui-patterns.com/patterns/leaderboard
  - Layout structure recommendations
  - User highlighting best practices
  - Pagination and temporal views
- **DeFi Marketing Strategies 2026** - Multiple sources:
  - https://www.310creative.com/blog/crypto-marketing-strategy
  - https://ninjapromo.io/crypto-marketing-complete-guide
  - https://www.digitalsilk.com/digital-trends/crypto-web-design-tips-best-practices/
  - Marketing site content sections
  - Trust signals and transparency requirements
  - Real-time data integration patterns
- **Whale Tracker Tools** - Multiple sources:
  - https://www.cryptometer.io/whale-trades
  - https://cryptonews.com/cryptocurrency/best-crypto-whale-trackers/
  - Transaction threshold patterns
  - Activity feed UI patterns
  - Pattern recognition strategies

### Tertiary (LOW confidence)
- None flagged - all key findings verified through primary sources

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - All libraries already in project, official Next.js docs verified via Context7
- Architecture: HIGH - PostgreSQL window functions standard since 2009, Next.js ISR well-documented
- Pitfalls: MEDIUM-HIGH - Common patterns from web searches verified against PostgreSQL/Next.js docs
- Marketing best practices: MEDIUM - Based on industry trends and multiple sources, but subjective design elements

**Research date:** 2026-02-08
**Valid until:** ~30 days (stable technologies, but marketing trends evolve)
