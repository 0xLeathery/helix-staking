---
phase: 07-leaderboard-and-marketing-site
plan: 03
subsystem: ui
tags: [nextjs, react, ssr, isr, marketing, seo]

# Dependency graph
requires:
  - phase: 06-analytics-and-jupiter-integration
    provides: Indexer API with /api/stats endpoint for live protocol data
provides:
  - Public-facing marketing site with landing page, How It Works, and Tokenomics pages
  - Server-rendered pages with ISR for SEO and fast loads
  - Marketing layout with navigation and footer (separate from dashboard)
  - Live protocol stats integration on landing page
affects: [08-leaderboard-page]

# Tech tracking
tech-stack:
  added: []
  patterns: [Server Components, ISR with revalidate, route groups]

key-files:
  created:
    - app/web/app/(public)/layout.tsx
    - app/web/app/(public)/page.tsx
    - app/web/app/(public)/how-it-works/page.tsx
    - app/web/app/(public)/tokenomics/page.tsx
    - app/web/components/marketing/nav.tsx
    - app/web/components/marketing/footer.tsx
    - app/web/components/marketing/hero.tsx
    - app/web/components/marketing/features.tsx
    - app/web/components/marketing/mechanics.tsx
    - app/web/components/marketing/cta.tsx
  modified: []

key-decisions:
  - "Use Next.js route groups (public) to separate marketing from dashboard without affecting URLs"
  - "Landing page and tokenomics fetch stats server-side with ISR (3600s and 86400s respectively)"
  - "Marketing layout excludes wallet UI completely - wallet context available but not displayed"
  - "All marketing components are Server Components for optimal SEO and performance"

patterns-established:
  - "Marketing pages use Server Components with ISR for SEO optimization"
  - "Route group pattern separates public marketing from authenticated dashboard"
  - "Consistent zinc-* color palette across marketing site"

# Metrics
duration: 4 min
completed: 2026-02-08
---

# Phase 7 Plan 3: Marketing Site Summary

**Public-facing marketing site with three SSR-rendered pages (landing, how-it-works, tokenomics) using Next.js route groups, ISR for SEO, and live protocol stats integration**

## Performance

- **Duration:** 4 min
- **Started:** 2026-02-08T09:30:22Z
- **Completed:** 2026-02-08T09:33:57Z
- **Tasks:** 3
- **Files modified:** 10 created, 1 deleted

## Accomplishments

- Three marketing pages explain HELIX protocol to new users before wallet connection
- Landing page displays live protocol stats (total stakes, protocol day, T-shares) via ISR
- How It Works page details staking mechanics, bonuses, penalties, and Big Pay Day
- Tokenomics page explains supply mechanics, inflation, and reward distribution
- Marketing site has separate layout with navigation and footer (no wallet UI)
- All pages are Server Components with proper SEO metadata and ISR

## Task Commits

Each task was committed atomically:

1. **Task 1: Create public route group layout with navigation and footer** - `44bf356` (feat)
2. **Task 2: Create marketing landing page with hero, features, mechanics, and CTA** - `b144f69` (feat)
3. **Task 3: Create How It Works and Tokenomics pages** - `a3f60b6` (feat)

## Files Created/Modified

**Created:**
- `app/web/app/(public)/layout.tsx` - Public route group layout with marketing nav and footer
- `app/web/app/(public)/page.tsx` - Landing page with live stats, hero, features, mechanics, CTA
- `app/web/app/(public)/how-it-works/page.tsx` - Protocol mechanics explanation (5 sections)
- `app/web/app/(public)/tokenomics/page.tsx` - Token economics explanation (6 sections)
- `app/web/components/marketing/nav.tsx` - Marketing navigation with logo and Launch App CTA
- `app/web/components/marketing/footer.tsx` - Marketing footer with protocol info and links
- `app/web/components/marketing/hero.tsx` - Hero section with live protocol stats
- `app/web/components/marketing/features.tsx` - Four feature cards explaining bonuses and rewards
- `app/web/components/marketing/mechanics.tsx` - Three-step staking process overview
- `app/web/components/marketing/cta.tsx` - Call-to-action section with dashboard link

**Deleted:**
- `app/web/app/page.tsx` - Removed to avoid route conflict with (public) route group

## Decisions Made

1. **Route Groups for Separation** - Used Next.js (public) route group to create a separate layout for marketing pages without affecting URLs. This allows the marketing site to have its own navigation/footer while the dashboard uses a different layout.

2. **ISR for SEO** - Landing page revalidates hourly (3600s), How It Works and Tokenomics revalidate daily (86400s). This provides fresh data while maintaining excellent SEO and performance.

3. **Server Components Only** - All marketing pages and components are Server Components (no 'use client'). This maximizes SEO benefits and reduces client-side JavaScript.

4. **Wallet Context Available But Hidden** - The root layout provides wallet context via Providers, so when users navigate to /dashboard the wallet connects. But the marketing layout does not display any wallet UI.

5. **Live Stats Integration** - Landing page and tokenomics page fetch from indexer /api/stats endpoint with graceful fallbacks if indexer is unavailable.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

Marketing site complete and ready for user acquisition. Next plan (07-04) will add the leaderboard page to display top stakers and protocol milestones.

All marketing pages are accessible at:
- `/` - Landing page
- `/how-it-works` - Protocol mechanics
- `/tokenomics` - Token economics
- `/dashboard` - Dashboard (existing, separate layout)

SEO metadata present on all pages for discoverability.

---
*Phase: 07-leaderboard-and-marketing-site*
*Completed: 2026-02-08*
