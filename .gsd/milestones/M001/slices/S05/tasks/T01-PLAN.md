# T01: 23-communication-boost-rules 01

**Slice:** S05 — **Milestone:** M001

## Description

Create the `/seed` launch page with all content sections explaining the seed token purpose, LP funding model, boost eligibility, headroom/revocation mechanics, and SOL flow diagram. Update the marketing nav and landing page with links to the new page.

Purpose: Users must understand the seed token's purpose, how it funds the HLX/SOL LP, and how holding seed tokens earns a 10% APY boost -- all before any staking action (COMM-01, COMM-02, COMM-03).

Output: 6 new section components, 1 new page route, 2 updated existing components

## Must-Haves

- [ ] "A visitor to /seed sees the full seed launch page with hero, explanation sections, SOL flow diagram, boost explanation, headroom/revocation mechanics, and CTA"
- [ ] "The seed launch page states clearly that creator rewards from the seed token fund the HLX/SOL liquidity pool (COMM-01)"
- [ ] "The seed launch page explains what the seed token is and how it relates to HELIX staking (COMM-02)"
- [ ] "The seed launch page explains boost eligibility with a numeric worked example showing base vs boosted APY (COMM-03)"
- [ ] "MarketingNav shows 'Seed Launch' as a navigation link pointing to /seed"
- [ ] "The landing page hero has a secondary CTA linking to /seed"

## Files

- `app/web/components/marketing/seed-hero.tsx`
- `app/web/components/marketing/seed-what-is.tsx`
- `app/web/components/marketing/seed-boost-explain.tsx`
- `app/web/components/marketing/seed-sol-flow.tsx`
- `app/web/components/marketing/seed-headroom.tsx`
- `app/web/components/marketing/seed-cta.tsx`
- `app/web/app/(public)/seed/page.tsx`
- `app/web/components/marketing/nav.tsx`
- `app/web/components/marketing/hero.tsx`
