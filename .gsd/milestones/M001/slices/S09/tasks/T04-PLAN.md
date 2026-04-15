---
estimated_steps: 5
estimated_files: 3
---

# T04: End-to-end documentation section and SOL flow transparency

**Slice:** S09 — LP Stats, Docs & Transparency
**Milestone:** M001

## Description

Create a comprehensive documentation section for the `/seed` page that explains the full seed → boost → LP lifecycle, and enhance the SOL flow section with on-chain verification links. This closes TRUST-01 (published documentation explaining full mechanics), TRUST-03 (SOL flow transparency showing how seed proceeds fund LP), and TRUST-04 (all boost state verifiable on-chain).

The `/seed` page currently has 5 sections: Hero, WhatIs, BoostExplain, SolFlow, Headroom, CTA. The new `SeedDocs` section goes between Headroom and CTA as the deep-dive reference. The SolFlow section gets a "Verify On-Chain" addition.

**Relevant skill:** `frontend-design` — for the documentation section styling. The seed page uses a dark theme with zinc backgrounds, helix accent colors, `ScrollReveal` for entrance animations, and a clean editorial layout. Match this aesthetic exactly.

## Steps

1. **Read existing marketing components for style reference**:
   - `app/web/components/marketing/seed-headroom.tsx` — the section immediately before where SeedDocs will be placed, use as styling reference
   - `app/web/components/marketing/scroll-reveal.tsx` — the animation wrapper used by all sections
   - Note the consistent patterns: section padding (`py-24 px-4`), max-width (`max-w-6xl mx-auto`), heading style (`text-3xl font-bold text-zinc-100 mb-4`), body text (`text-zinc-400`), border-top (`border-t border-zinc-800/50`)

2. **Create `app/web/components/marketing/seed-docs.tsx`**:
   - `"use client"` component (needed for ExplorerLink which uses env vars)
   - Import `ExplorerLink` from `@/components/ui/explorer-link`
   - Import `ScrollReveal` from `./scroll-reveal`
   - Title: "How It All Works — The Complete Guide"
   - **Part 1: "What the Seed Token Is"** — One paragraph explaining: launched on pump.fun, a separate token from HLX, sole purpose is to fund the HLX/SOL liquidity pool, not a governance token, not a share of the protocol
   - **Part 2: "How SOL Flows to the Liquidity Pool"** — Numbered steps: (1) Buy seed token on pump.fun, (2) pump.fun routes creator rewards to project wallet, (3) Team deploys SOL into HLX/SOL LP, (4) LP is permanent — cannot be withdrawn. Include ExplorerLink to program address `E9B7BsxdPS89M66CRGGbsCzQ9LkiGv6aNsra3cNBJha7` type="address"
   - **Part 3: "How the Boost Works"** — Steps: (1) Hold seed tokens in your wallet, (2) Register for boost on the dashboard, (3) Stake HLX — your seed balance is snapshotted, (4) Every claim gets 10% more HLX, (5) If your seed balance drops below snapshot → boost permanently revoked for that stake, (6) Buying more seed after staking adds headroom above the threshold
   - **Part 4: "Verify Everything On-Chain"** — This is transparency, not marketing. Explain that all state is on-chain: GlobalState holds protocol config (seed mint, boost toggle), BoostRecord tracks each user's boost registration, StakeAccount stores the seed balance snapshot. Include ExplorerLinks to:
     - Program ID: `E9B7BsxdPS89M66CRGGbsCzQ9LkiGv6aNsra3cNBJha7` (type="address")
     - Note that specific account addresses (GlobalState PDA, BoostRecord PDAs) can be derived from the program ID
   - Layout: Use a 2-column grid on desktop for Parts 1-3, full-width for Part 4
   - Each part should be in a card-like container (`rounded-xl border border-zinc-800 bg-zinc-900/50 p-6`)
   - Wrap each section in `ScrollReveal` with staggered delays

3. **Enhance `app/web/components/marketing/seed-sol-flow.tsx`**:
   - Import `ExplorerLink` from `@/components/ui/explorer-link`
   - Add a "Verify On-Chain" subsection after the existing PumpSwap note (the `<ScrollReveal delay={0.2}>` block at the bottom)
   - Content: "All liquidity operations are verifiable on-chain." followed by ExplorerLink to program address
   - Add a note: "LP pool address will be published here once the pool is created."
   - Styling: Match the existing PumpSwap note card style (`p-5 rounded-xl border border-zinc-800 bg-zinc-900/30 max-w-2xl mx-auto text-center`)
   - Wrap in `ScrollReveal delay={0.3}`

4. **Update `app/web/app/(public)/seed/page.tsx`**:
   - Import `SeedDocs` from `@/components/marketing/seed-docs`
   - Add `<SeedDocs />` between `<SeedHeadroom />` and `<SeedCta />`
   - The component order becomes: Hero → WhatIs → BoostExplain → SolFlow → Headroom → **Docs** → CTA

5. **Final verification**:
   - `cd app/web && npx tsc --noEmit` — no new type errors
   - `cd app/web && npx vitest run` — all existing tests still pass (no test regressions)
   - `grep -n "SeedDocs" app/web/app/\(public\)/seed/page.tsx` — shows import and render
   - `grep -n "ExplorerLink" app/web/components/marketing/seed-docs.tsx` — Explorer links present
   - `grep -n "ExplorerLink" app/web/components/marketing/seed-sol-flow.tsx` — verify link added

## Must-Haves

- [ ] `seed-docs.tsx` covers all 4 parts: What Seed Is, SOL Flow, How Boost Works, Verify On-Chain
- [ ] ExplorerLinks to program address `E9B7BsxdPS89M66CRGGbsCzQ9LkiGv6aNsra3cNBJha7` in documentation
- [ ] Documentation explains the full lifecycle: seed purchase → creator rewards → LP funding → boost registration → staking → claiming → revocation
- [ ] `seed-sol-flow.tsx` has "Verify On-Chain" subsection with Explorer link
- [ ] `seed/page.tsx` renders SeedDocs between Headroom and CTA
- [ ] Styling matches existing marketing section patterns (ScrollReveal, zinc palette, section spacing)
- [ ] All existing tests still pass

## Verification

- `cd app/web && npx tsc --noEmit` — no new type errors
- `cd app/web && npx vitest run` — all 237+ tests pass
- `grep -n "SeedDocs" app/web/app/\(public\)/seed/page.tsx` — import and render present
- `grep -n "ExplorerLink" app/web/components/marketing/seed-docs.tsx` — at least 2 ExplorerLink usages
- `grep -n "ExplorerLink" app/web/components/marketing/seed-sol-flow.tsx` — at least 1 ExplorerLink usage
- `grep -c "Verify" app/web/components/marketing/seed-docs.tsx` — Part 4 heading present

## Observability Impact

- **Inspection surface**: `SeedDocs` and `SeedSolFlow` render ExplorerLink components that produce live Solana Explorer URLs — check the `href` attribute on any `<a>` tag with `explorer.solana.com` in the rendered page
- **Failure visibility**: If ExplorerLink renders wrong cluster (devnet vs mainnet), the URLs will contain `?cluster=devnet` — inspect via browser DevTools or `grep -rn "cluster=devnet"` on built output
- **Runtime signal**: No fetches or async work — these are static content sections. If the component fails to render, React error boundaries surface the error in the console
- **Agent inspection**: `grep -n "ExplorerLink" app/web/components/marketing/seed-docs.tsx app/web/components/marketing/seed-sol-flow.tsx` confirms all on-chain links are present

## Inputs

- `app/web/lib/utils/explorer.ts` — Explorer URL utility (from T01)
- `app/web/components/ui/explorer-link.tsx` — ExplorerLink component (from T01)
- `app/web/components/marketing/seed-sol-flow.tsx` — existing SOL flow section to enhance
- `app/web/app/(public)/seed/page.tsx` — seed page layout to update
- `app/web/components/marketing/seed-headroom.tsx` — styling reference for adjacent section
- `app/web/components/marketing/scroll-reveal.tsx` — animation wrapper used by all sections
- Program ID constant: `E9B7BsxdPS89M66CRGGbsCzQ9LkiGv6aNsra3cNBJha7` (from footer.tsx)

## Expected Output

- `app/web/components/marketing/seed-docs.tsx` — new end-to-end documentation section
- `app/web/components/marketing/seed-sol-flow.tsx` — enhanced with "Verify On-Chain" subsection
- `app/web/app/(public)/seed/page.tsx` — updated to render SeedDocs
