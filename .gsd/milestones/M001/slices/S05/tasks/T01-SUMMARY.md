---
id: T01
parent: S05
milestone: M001
provides: []
requires: []
affects: []
key_files: []
key_decisions: []
patterns_established: []
observability_surfaces: []
drill_down_paths: []
duration: 
verification_result: passed
completed_at: 
blocker_discovered: false
---
# T01: 23-communication-boost-rules 01

**# Phase 23 Plan 01: Seed Launch Page Summary**

## What Happened

# Phase 23 Plan 01: Seed Launch Page Summary

**One-liner:** Full /seed marketing page with 6 content sections covering SOL flow to LP (COMM-01), seed token purpose (COMM-02), and boost eligibility with worked APY example (COMM-03), plus nav and hero CTA updates.

## What Was Built

A new public `/seed` route composed of six section components, all following the established marketing page patterns (Server Components, ScrollReveal animations, zinc-950 dark theme, helix-600 accent). Two existing components updated for discoverability.

### Files Created

**app/web/app/(public)/seed/page.tsx**
Server Component page. Exports metadata with OG/Twitter tags (reuses `/brand/og-image.jpg` as fallback). Sets `revalidate = 86400` (daily). Imports and renders all six sections in order: SeedHero → SeedWhatIs → SeedBoostExplain → SeedSolFlow → SeedHeadroom → SeedCta.

**app/web/components/marketing/seed-hero.tsx**
Hero section with `/brand/hero-banner.jpg` background, gradient overlay, helix badge, narrative headline "Every seed token funds the HELIX liquidity pool", pump.fun mention, and two CTA buttons (Start Staking → /dashboard, How It Works → #how-boost-works anchor).

**app/web/components/marketing/seed-what-is.tsx** (COMM-02)
"What is the Seed Token?" section. Four feature cards (icon+text grid): launch vehicle for liquidity, 10% APY boost, stays liquid no locking, one boosted stake per wallet. Closing explanatory panel on how seed relates to HELIX staking snapshot.

**app/web/components/marketing/seed-boost-explain.tsx** (COMM-03)
"How the Boost Works" section. Four numbered steps explaining snapshot → claim check → earn extra. Numeric worked example table: base 3.69% vs boosted 4.06% (3.69% × 1.10). Disclaimer note about illustrative APY figures.

**app/web/components/marketing/seed-sol-flow.tsx** (COMM-01)
"Where Your SOL Goes" section. CSS/Tailwind flexbox flow diagram with three nodes: Buy Seed Token (on pump.fun) → Creator Rewards (team wallet) → Fund HLX/SOL LP (permanent liquidity). Responsive: horizontal on lg+, vertical on mobile. PumpSwap graduation note.

**app/web/components/marketing/seed-headroom.tsx**
"Headroom & Revocation" section. Four mechanics cards (Snapshot, Headroom, Permanent Revocation, Buying Back Does Not Restore). Worked example table showing snapshot 1,000 seed + 500 extra = 500 headroom. Amber warning box for permanent revocation rule.

**app/web/components/marketing/seed-cta.tsx**
Bottom CTA section. Reuses `/brand/helix-strands.jpg` background. Two buttons: "Start Staking" (primary helix-600 → /dashboard) and "Learn How HELIX Works" (outline → /how-it-works).

### Files Modified

**app/web/components/marketing/nav.tsx**
Added "Seed Launch" as third nav link with `href="/seed"`. Final order: How It Works | Tokenomics | Seed Launch | [Launch App].

**app/web/components/marketing/hero.tsx**
Added "Learn about Seed Launch" as third CTA button with `href="/seed"`, outline style matching "Learn How". Added `flex-wrap` to CTA container for mobile.

## Verification

- TypeScript: zero errors in production files (`npx tsc --noEmit` — all errors are pre-existing test infrastructure issues unrelated to this plan)
- Next.js build: succeeded, `/seed` appears as static route (`○`) at 791 B / 133 kB
- COMM-01: SeedSolFlow visually shows Buy seed → Creator rewards → Fund LP
- COMM-02: SeedWhatIs explains seed token purpose, LP funding, no-lock mechanic
- COMM-03: SeedBoostExplain includes numeric 3.69% vs 4.06% worked example
- MarketingNav: "Seed Launch" link in correct position
- Landing hero: "Learn about Seed Launch" button links to /seed

## Commits

| Task | Commit | Description |
|------|--------|-------------|
| 1 | 1f6720f | feat(23-01): create /seed launch page with all content sections |
| 2 | ddb4caa | feat(23-01): update MarketingNav and landing hero with seed launch links |

## Deviations from Plan

### Auto-fixed Issues

None — plan executed exactly as written.

### Out-of-Scope Items Noted

Pre-existing TypeScript errors in `__tests__/` test files (missing `@testing-library/jest-dom` type declarations for vitest). These errors exist in the repository before this plan and are not caused by any changes made here. Logged for visibility but not fixed per deviation scope boundary rules.

## Self-Check: PASSED

All 7 created files confirmed present on disk. Both task commits (1f6720f, ddb4caa) confirmed in git log.
