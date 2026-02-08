---
phase: 04-staking-dashboard
plan: 04
subsystem: ui
tags: [react, nextjs, anchor, solana, penalty-calculator, unstake]

# Dependency graph
requires:
  - phase: 04-02
    provides: Math module, React Query hooks, dashboard layout
provides:
  - Stake detail page with penalty calculator
  - Unstake flow with mandatory confirmation
  - Claim rewards action
  - Current slot polling hook
  - Visual penalty comparison bar
  - BPD window blocking UI
affects: [04-05]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Visual penalty calculator with comparison bar"
    - "Mandatory checkbox confirmation pattern"
    - "BPD window blocking with user-friendly message"
    - "Color-coded stake states (early/grace/late)"

key-files:
  created:
    - app/web/lib/hooks/useCurrentSlot.ts
    - app/web/lib/hooks/useUnstake.ts
    - app/web/lib/hooks/useClaimRewards.ts
    - app/web/app/dashboard/stakes/[stakeId]/page.tsx
    - app/web/components/stake/penalty-calculator.tsx
    - app/web/components/stake/unstake-confirmation.tsx
  modified: []

key-decisions:
  - "Penalty calculator always visible (mandatory preview before unstake)"
  - "Checkbox text includes exact HELIX amount and percentage"
  - "BPD window check via globalState.reserved[0] !== 0"
  - "Toast notifications via sonner (not shadcn useToast)"
  - "Anchor accountsPartial for PDA auto-resolution"

patterns-established:
  - "Transaction simulation before wallet prompt (security)"
  - "Query invalidation on mutation success"
  - "Color-coded status badges: green (grace), yellow (moderate), red (heavy/late)"
  - "Visual comparison bar pattern for before/after token amounts"

# Metrics
duration: 18min
completed: 2026-02-08
---

# Phase 04 Plan 04: Penalty Calculator and Unstake Summary

**Stake detail page with visual penalty calculator, mandatory confirmation, and reward claiming — users see exact consequences before any unstake action.**

## Performance

- **Duration:** 18 min
- **Started:** 2026-02-08T06:15:00Z
- **Completed:** 2026-02-08T06:33:00Z
- **Tasks:** 2
- **Files modified:** 6 created

## Accomplishments

- Visual penalty calculator with comparison bar shows exact HELIX loss before unstake
- Mandatory checkbox confirmation prevents accidental unstake (no way to skip)
- BPD window blocking with clear user-friendly explanation
- Claim rewards as standalone action (separate from unstake)
- Color-coded states match user terminology (Early Unstake, End Stake, End Stake (Late))
- Transactions simulated before wallet prompt for security

## Task Commits

Each task was committed atomically:

1. **Task 1: Unstake and claim rewards mutation hooks + current slot hook** - `a439307` (feat)
2. **Task 2: Stake detail page with penalty calculator and unstake confirmation** - `8560d5c` (feat)

**Plan metadata:** (pending - will be added in metadata commit)

## Files Created/Modified

**Created:**
- `app/web/lib/hooks/useCurrentSlot.ts` - React Query hook for current slot (10s polling)
- `app/web/lib/hooks/useUnstake.ts` - Mutation hook with BPD window blocking and simulation
- `app/web/lib/hooks/useClaimRewards.ts` - Mutation hook with NoRewardsToClaim handling
- `app/web/app/dashboard/stakes/[stakeId]/page.tsx` - Stake detail page with full info and actions
- `app/web/components/stake/penalty-calculator.tsx` - Visual penalty preview with comparison bar
- `app/web/components/stake/unstake-confirmation.tsx` - Confirmation dialog with mandatory checkbox

## Decisions Made

1. **Penalty calculator always visible** - Users must see penalty preview before unstake (no way to skip)
2. **Checkbox text includes exact amounts** - "I understand I will lose X HELIX (Y%)" for informed consent
3. **BPD window check via reserved[0]** - globalState.reserved[0] !== 0 indicates active BPD window
4. **Toast via sonner** - Using sonner's toast.success/error API (not shadcn's useToast hook)
5. **Anchor accountsPartial** - Let Anchor auto-resolve PDA accounts instead of explicit .accounts()

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Fixed toast hook import**
- **Found during:** Task 1 (useUnstake hook implementation)
- **Issue:** Plan referenced `@/hooks/use-toast` which doesn't exist in this project
- **Fix:** Used sonner's `toast.success()` and `toast.error()` API directly (already integrated)
- **Files modified:** `lib/hooks/useUnstake.ts`, `lib/hooks/useClaimRewards.ts`
- **Verification:** TypeScript compilation passes
- **Committed in:** `a439307` (part of task commit)

**2. [Rule 3 - Blocking] Fixed Anchor accounts interface**
- **Found during:** Task 1 (Transaction building)
- **Issue:** TypeScript error: `.accounts()` doesn't accept explicit PDA accounts (Anchor auto-resolves)
- **Fix:** Changed to `.accountsPartial()` with only user-provided accounts (stakeAccount, userTokenAccount)
- **Files modified:** `lib/hooks/useUnstake.ts`, `lib/hooks/useClaimRewards.ts`
- **Verification:** TypeScript compilation passes
- **Committed in:** `a439307` (part of task commit)

**3. [Rule 1 - Bug] Fixed BPD window type checking**
- **Found during:** Task 2 (Stake detail page BPD check)
- **Issue:** TypeScript error: comparing BN with number (reserved[0] !== 0)
- **Fix:** Cast reserved to BN[] and use `.isZero()` method for BN comparison
- **Files modified:** `app/dashboard/stakes/[stakeId]/page.tsx`
- **Verification:** TypeScript compilation passes
- **Committed in:** `8560d5c` (part of task commit)

**4. [Rule 3 - Blocking] Fixed action button label type**
- **Found during:** Task 2 (Action button label assignment)
- **Issue:** TypeScript error: string literal types not assignable to const string union
- **Fix:** Explicitly type `actionButtonLabel` as `string` instead of const literal
- **Files modified:** `app/dashboard/stakes/[stakeId]/page.tsx`
- **Verification:** TypeScript compilation passes
- **Committed in:** `8560d5c` (part of task commit)

---

**Total deviations:** 4 auto-fixed (1 missing critical, 3 blocking)
**Impact on plan:** All auto-fixes necessary for TypeScript compilation. No scope creep.

## Issues Encountered

None - plan executed smoothly with minor TypeScript type fixes.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Penalty calculator and unstake flow complete
- Ready for Plan 05: Create stake wizard (3-step: Amount -> Duration -> Confirm)
- All verification criteria met:
  - ✅ Penalty calculator shows correct state (early/on-time/late) with visual comparison bar
  - ✅ Visual comparison bar shows "What you staked" vs "What you'd receive"
  - ✅ Color coding: green (grace), yellow (moderate), red (heavy/late)
  - ✅ Mandatory checkbox prevents accidental unstake
  - ✅ Checkbox text includes exact penalty amount and percentage
  - ✅ BPD window blocking with yellow explanation
  - ✅ "Claim Rewards" works independently from unstake
  - ✅ Transactions simulated before wallet signing
  - ✅ TypeScript compilation passes

---
*Phase: 04-staking-dashboard*
*Completed: 2026-02-08*
