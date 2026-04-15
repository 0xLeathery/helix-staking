# S05: Communication Boost Rules

**Goal:** Create the `/seed` launch page with all content sections explaining the seed token purpose, LP funding model, boost eligibility, headroom/revocation mechanics, and SOL flow diagram.
**Demo:** Create the `/seed` launch page with all content sections explaining the seed token purpose, LP funding model, boost eligibility, headroom/revocation mechanics, and SOL flow diagram.

## Must-Haves


## Tasks

- [x] **T01: 23-communication-boost-rules 01**
  - Create the `/seed` launch page with all content sections explaining the seed token purpose, LP funding model, boost eligibility, headroom/revocation mechanics, and SOL flow diagram. Update the marketing nav and landing page with links to the new page.

Purpose: Users must understand the seed token's purpose, how it funds the HLX/SOL LP, and how holding seed tokens earns a 10% APY boost -- all before any staking action (COMM-01, COMM-02, COMM-03).

Output: 6 new section components, 1 new page route, 2 updated existing components
- [x] **T02: 23-communication-boost-rules 02** `est:6min`
  - Insert a boost rules disclosure step into the existing stake wizard as a required step before confirmation. Users must acknowledge the snapshot, headroom, permanent revocation, and 10% multiplier rules via a checkbox before proceeding to stake.

Purpose: No stake is submitted without the user seeing and acknowledging the boost rules disclosure (COMM-04). This protects users from unknowingly losing their boost by selling seed tokens.

Output: 1 new component, 3 modified files

## Files Likely Touched

- `app/web/components/marketing/seed-hero.tsx`
- `app/web/components/marketing/seed-what-is.tsx`
- `app/web/components/marketing/seed-boost-explain.tsx`
- `app/web/components/marketing/seed-sol-flow.tsx`
- `app/web/components/marketing/seed-headroom.tsx`
- `app/web/components/marketing/seed-cta.tsx`
- `app/web/app/(public)/seed/page.tsx`
- `app/web/components/marketing/nav.tsx`
- `app/web/components/marketing/hero.tsx`
- `app/web/lib/store/ui-store.ts`
- `app/web/components/stake/stake-wizard/boost-rules-step.tsx`
- `app/web/app/dashboard/stake/page.tsx`
- `app/web/components/stake/stake-wizard/confirm-step.tsx`
