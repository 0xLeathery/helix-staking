---
id: S05
parent: M001
milestone: M001
provides:
  - "BoostRulesStep component: 4-rule disclosure with checkbox acknowledgment gate"
  - "Extended StakeWizardState: step 4 + boostRulesAcknowledged + setter"
  - "4-step stake wizard: Amount -> Duration -> BoostRules -> Confirm"
requires: []
affects: []
key_files: []
key_decisions:
  - "Local useState for checkbox in BoostRulesStep: prevents pre-checked state; Zustand store updated only when Continue is clicked"
  - "boostRulesAcknowledged: false added to initialState so reset() clears the checkbox on new stakes"
  - "Confirm Back button changed from setStep(2) to setStep(3): ensures disclosure is seen when navigating back-and-forth"
patterns_established:
  - "Wizard step insert pattern: update store type, add step render in page, update connector count, fix adjacent Back buttons"
observability_surfaces: []
drill_down_paths: []
duration: 6min
verification_result: passed
completed_at: 2026-03-04
blocker_discovered: false
---
# S05: Communication Boost Rules

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

# Phase 23 Plan 02: Communication Boost Rules Summary

**4-step stake wizard with mandatory boost rules disclosure: snapshot, headroom, permanent revocation, and 10% multiplier rules behind a checkbox acknowledgment gate (COMM-04)**

## Performance

- **Duration:** ~6 min
- **Started:** 2026-03-04T03:01:00Z
- **Completed:** 2026-03-04T03:07:13Z
- **Tasks:** 2
- **Files modified:** 5

## Accomplishments
- Extended Zustand StakeWizardState with step 4 and boostRulesAcknowledged (reset-safe)
- Created BoostRulesStep component: 4 rules, amber warning callout, checkbox gates Continue
- Wired BoostRulesStep into stake wizard as step 3; ConfirmStep moved to step 4
- Fixed ConfirmStep Back button to return to BoostRulesStep (step 3), not DurationStep
- All 5 TDD unit tests pass

## Task Commits

Each task was committed atomically:

1. **Task 1: Extend Zustand store and create boost rules step component** - `f8340bf` (feat)
2. **Task 2: Wire boost rules step into stake wizard page and fix confirm back navigation** - `af4cbcf` (feat)

**Plan metadata:** *(see final commit below)*

## Files Created/Modified
- `app/web/lib/store/ui-store.ts` - Step type extended to 1|2|3|4|"success", added boostRulesAcknowledged and setter
- `app/web/components/stake/stake-wizard/boost-rules-step.tsx` - New component: 4 boost rules, checkbox gate, Back/Continue navigation
- `app/web/app/dashboard/stake/page.tsx` - 4-step indicator, BoostRulesStep at step 3, ConfirmStep at step 4
- `app/web/components/stake/stake-wizard/confirm-step.tsx` - Back button setStep(2) -> setStep(3)
- `app/web/__tests__/components/boost-rules-step.test.tsx` - 5 TDD tests for BoostRulesStep behavior

## Decisions Made
- Local `useState` for checkbox in BoostRulesStep rather than reading `boostRulesAcknowledged` from Zustand — prevents the checkbox from appearing pre-checked when a user views the step a second time within the same session (the Zustand field is only set to true on Continue)
- `boostRulesAcknowledged: false` added to `initialState` so `reset()` reliably clears the disclosure state when the wizard resets
- Confirm Back changed to `setStep(3)` so navigating back from Confirm always returns the user to the disclosure step, not bypassing it

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
- Test for "renders all 4 rule titles" initially used `getByText(/Snapshot/i)` which matched multiple elements (title "Snapshot" plus "snapshot" in descriptions). Fixed by using `getAllByText` and exact string matching for the headings. Not a deviation — this is normal test refinement within the TDD GREEN phase.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Stake wizard now has 4 steps with COMM-04 disclosure gate in place
- BoostRulesStep is wired but does not yet check whether the wallet actually holds seed tokens (Phase 24 dependency)
- Duration step's `setStep(3)` already points to BoostRulesStep — no change needed there
- Ready for Phase 23 Plan 03 if applicable, or Phase 24 seed token integration

---
*Phase: 23-communication-boost-rules*
*Completed: 2026-03-04*
