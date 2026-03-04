---
phase: 23-communication-boost-rules
plan: "02"
subsystem: ui
tags: [zustand, react, stake-wizard, disclosure, checkbox, tdd]

# Dependency graph
requires:
  - phase: 23-communication-boost-rules
    provides: "Context and research for boost rules UX (RESEARCH.md)"
provides:
  - "BoostRulesStep component: 4-rule disclosure with checkbox acknowledgment gate"
  - "Extended StakeWizardState: step 4 + boostRulesAcknowledged + setter"
  - "4-step stake wizard: Amount -> Duration -> BoostRules -> Confirm"
affects:
  - "stake wizard flow"
  - "any future wizard step changes"
  - "confirm-step navigation"

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Local useState for checkbox (NOT Zustand), Zustand updated only on Continue click to prevent pre-checked state"
    - "TDD: RED (failing tests) -> GREEN (implementation) -> tests pass"

key-files:
  created:
    - app/web/components/stake/stake-wizard/boost-rules-step.tsx
    - app/web/__tests__/components/boost-rules-step.test.tsx
  modified:
    - app/web/lib/store/ui-store.ts
    - app/web/app/dashboard/stake/page.tsx
    - app/web/components/stake/stake-wizard/confirm-step.tsx

key-decisions:
  - "Local useState for checkbox in BoostRulesStep: prevents pre-checked state; Zustand store updated only when Continue is clicked"
  - "boostRulesAcknowledged: false added to initialState so reset() clears the checkbox on new stakes"
  - "Confirm Back button changed from setStep(2) to setStep(3): ensures disclosure is seen when navigating back-and-forth"

patterns-established:
  - "Wizard step insert pattern: update store type, add step render in page, update connector count, fix adjacent Back buttons"

requirements-completed: [COMM-04]

# Metrics
duration: 6min
completed: 2026-03-04
---

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
