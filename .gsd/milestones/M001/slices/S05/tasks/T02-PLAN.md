# T02: 23-communication-boost-rules 02

**Slice:** S05 — **Milestone:** M001

## Description

Insert a boost rules disclosure step into the existing stake wizard as a required step before confirmation. Users must acknowledge the snapshot, headroom, permanent revocation, and 10% multiplier rules via a checkbox before proceeding to stake.

Purpose: No stake is submitted without the user seeing and acknowledging the boost rules disclosure (COMM-04). This protects users from unknowingly losing their boost by selling seed tokens.

Output: 1 new component, 3 modified files

## Must-Haves

- [ ] "A user entering the stake wizard must pass through a boost rules disclosure step before the confirmation step"
- [ ] "The boost rules step displays all 4 rules: snapshot, headroom, permanent revocation, and 10% multiplier"
- [ ] "The Continue button on the boost rules step is disabled until the user checks the acknowledgment checkbox"
- [ ] "After checking the checkbox and clicking Continue, the user proceeds to the Confirm step"
- [ ] "The Back button from Confirm goes to the boost rules step (not Duration)"
- [ ] "The step indicator shows 4 steps instead of 3"
- [ ] "The boost rules acknowledgment resets when the wizard resets (opening a new stake shows unchecked checkbox)"

## Files

- `app/web/lib/store/ui-store.ts`
- `app/web/components/stake/stake-wizard/boost-rules-step.tsx`
- `app/web/app/dashboard/stake/page.tsx`
- `app/web/components/stake/stake-wizard/confirm-step.tsx`
