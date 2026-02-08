---
phase: 04-staking-dashboard
plan: 03
subsystem: ui
tags: [stake-wizard, zustand, react-query, bonus-preview, multi-step-form]

# Dependency graph
requires:
  - phase: 04-staking-dashboard
    plan: 02
    provides: "React Query hooks (useProgram, useGlobalState, useTokenBalance), math module, format utilities, dashboard layout"
provides:
  - "3-step stake creation wizard (Amount -> Duration -> Confirm -> Success)"
  - "Live T-share preview with Duration Bonus and Size Bonus visualization"
  - "useCreateStake mutation with transaction simulation and retry logic"
  - "Zustand v5 store for wizard UI state"
  - "BonusPreview component with bonus curve progress bars"
affects: [04-04, 04-05]

# Tech tracking
tech-stack:
  added: [zustand@5]
  patterns: ["Multi-step wizard with Zustand state management", "Live preview with BN.js calculations", "Transaction simulation before wallet signing", "Retry logic for race condition handling", "accountsPartial pattern for Anchor account resolution", "Step indicator UI pattern"]

key-files:
  created:
    - app/web/lib/store/ui-store.ts
    - app/web/components/stake/bonus-preview.tsx
    - app/web/lib/hooks/useCreateStake.ts
    - app/web/app/dashboard/stake/page.tsx
    - app/web/components/stake/stake-wizard/amount-step.tsx
    - app/web/components/stake/stake-wizard/duration-step.tsx
    - app/web/components/stake/stake-wizard/confirm-step.tsx
    - app/web/components/stake/stake-wizard/success-screen.tsx
  modified: []

key-decisions:
  - "Zustand v5 with create() function for wizard state (UI-only, no on-chain data duplication)"
  - "accountsPartial() used instead of accounts() to let Anchor resolve PDAs automatically"
  - "Simulation before sendTransaction per security requirement"
  - "MAX_RETRIES=3 with 500ms delay for stake ID race condition"
  - "Validation via CTA state (disable Next button) per user decision"
  - "Step indicator shows 1-2-3 progress with visual state"
  - "Slider range 1-5555 with preset buttons (1Y/3Y/5Y/Max)"

patterns-established:
  - "useStakeWizard: Zustand store with step/amount/days/reset"
  - "BonusPreview: Live calculations with progress bars showing bonus curve position"
  - "AmountStep: MAX button fills wallet balance, inline validation"
  - "DurationStep: Slider + presets + exact input (all synced)"
  - "ConfirmStep: Summary + penalty warning + transaction simulation"
  - "SuccessScreen: Explorer link + View Stakes + Create Another CTAs"

# Metrics
duration: 5min
completed: 2026-02-08
---

# Phase 4 Plan 3: Stake Creation Wizard Summary

**3-step wizard with live T-share preview, bonus visualizations, and on-chain transaction submission with simulation and retry logic**

## Performance

- **Duration:** 5 min
- **Started:** 2026-02-08T06:09:12Z
- **Completed:** 2026-02-08T06:14:23Z
- **Tasks:** 2
- **Files created:** 8

## Accomplishments
- Zustand v5 store managing wizard state (step, amount, days) with reset on unmount
- BonusPreview component showing Duration Bonus and Size Bonus with progress bars indicating position on bonus curve
- useCreateStake mutation hook with transaction simulation, stake ID race condition retry logic (max 3 attempts, 500ms delay)
- AmountStep with HELIX input, MAX button, wallet balance display, and real-time validation
- DurationStep with slider (1-5555), preset buttons (1Y/3Y/5Y/Max), exact days input, and live T-share preview
- ConfirmStep with full summary, penalty warning (amber box), estimated transaction fee, and loading spinner during submission
- SuccessScreen with success icon, stake summary, Solana explorer link, "View My Stakes" and "Create Another Stake" CTAs
- StakePage with step indicator (1-2-3 progress dots) and wizard orchestration

## Task Commits

Each task was committed atomically:

1. **Task 1: Zustand wizard store, bonus preview, and create stake mutation** - `3cf1e4c` (feat)
2. **Task 2: 3-step stake wizard with success screen** - `fb2c7cf` (feat)

## Files Created/Modified

- `app/web/lib/store/ui-store.ts` - Zustand v5 store for wizard state (step, amount, days, reset)
- `app/web/components/stake/bonus-preview.tsx` - Live T-share preview with bonus progress bars
- `app/web/lib/hooks/useCreateStake.ts` - Create stake mutation with simulation and retry logic
- `app/web/app/dashboard/stake/page.tsx` - Wizard page with step indicator and content router
- `app/web/components/stake/stake-wizard/amount-step.tsx` - Step 1: Amount input with MAX and validation
- `app/web/components/stake/stake-wizard/duration-step.tsx` - Step 2: Slider, presets, and live preview
- `app/web/components/stake/stake-wizard/confirm-step.tsx` - Step 3: Review summary with penalty warning
- `app/web/components/stake/stake-wizard/success-screen.tsx` - Success screen with explorer link and CTAs

## Decisions Made

- **accountsPartial pattern:** Used `.accountsPartial()` instead of `.accounts()` to let Anchor automatically resolve PDA accounts (globalState, mint, mintAuthority, systemProgram). This matches the pattern established in useUnstake and keeps the code cleaner.
- **Retry logic for race condition:** Stake ID is derived from globalState.totalStakesCreated. If multiple users create stakes simultaneously, the PDA may be "already in use". The hook retries up to 3 times with 500ms delay, re-fetching globalState each time to get the updated counter.
- **Step validation:** AmountStep disables the Next button when amount is invalid (zero, exceeds balance, or malformed). This implements "validation via CTA state" per user decision, avoiding separate validation UI.
- **Slider range:** Set to 1-5555 days (MIN_STAKE_DAYS to MAX_STAKE_DAYS) with visual markers. Preset buttons set common durations (365, 1095, 1825, 5555) for UX convenience.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] accountsPartial() instead of accounts()**
- **Found during:** Task 1 (useCreateStake implementation)
- **Issue:** TypeScript error: "globalState does not exist in type ResolvedAccounts" when using `.accounts({ globalState: ... })`. This is because Anchor's TypeScript codegen expects PDAs to be auto-resolved.
- **Fix:** Changed to `.accountsPartial()` and only specified non-PDA accounts (user, stakeAccount, userTokenAccount). Anchor resolves globalState, mint, mintAuthority, systemProgram automatically from PDA seeds in IDL.
- **Files modified:** lib/hooks/useCreateStake.ts
- **Verification:** TypeScript compilation passes, pattern matches useUnstake hook
- **Committed in:** 3cf1e4c (part of Task 1 commit)

---

**Total deviations:** 1 auto-fixed (1 blocking)
**Impact on plan:** Essential fix for TypeScript compatibility with Anchor's account resolution. No scope creep.

## Issues Encountered

None - plan executed smoothly after accountsPartial fix.

## Next Phase Readiness

- Stake creation wizard complete and ready for user testing
- useCreateStake hook can be reused by other components needing create_stake functionality
- BonusPreview component can be reused in stake details pages
- Wizard pattern established for future multi-step forms (e.g., free claim with Ed25519 signature)
- Ready for Plan 04-04 (unstake/claim actions from stake cards)

## Self-Check: PASSED

All 8 created files verified present. Both commit hashes (3cf1e4c, fb2c7cf) verified in git log. TypeScript compilation passes for all new files (pre-existing errors in other files unrelated to this plan).

---
*Phase: 04-staking-dashboard*
*Completed: 2026-02-08*
