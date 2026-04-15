---
id: T04
parent: S09
milestone: M001
provides:
  - SeedDocs component with 4-part end-to-end documentation (What Seed Is, SOL Flow, Boost Mechanics, On-Chain Verification)
  - Enhanced SeedSolFlow with "Verify On-Chain" subsection and ExplorerLink
  - Seed page updated to render documentation section between Headroom and CTA
key_files:
  - app/web/components/marketing/seed-docs.tsx
  - app/web/components/marketing/seed-sol-flow.tsx
  - app/web/app/(public)/seed/page.tsx
key_decisions:
  - Used 2-column grid for Parts 1-3 and full-width for Part 4 (Verify On-Chain) to give transparency content maximum visual weight
  - Program ID extracted to a local constant in each file rather than a shared config — acceptable for two static marketing components
patterns_established:
  - Documentation sections use same ScrollReveal + zinc card patterns as other marketing sections
  - On-chain verification content always includes ExplorerLink to program ID + note about PDA derivation
observability_surfaces:
  - grep -n "ExplorerLink" app/web/components/marketing/seed-docs.tsx app/web/components/marketing/seed-sol-flow.tsx — confirms all on-chain links present
  - Static content sections — no async fetches or runtime failures to monitor
  - If Explorer links point to wrong cluster: check NEXT_PUBLIC_RPC_URL env var
duration: 15m
verification_result: passed
completed_at: 2026-03-17
blocker_discovered: false
---

# T04: End-to-end documentation section and SOL flow transparency

**Created SeedDocs component covering the full seed → boost → LP lifecycle in 4 parts with ExplorerLinks, enhanced SeedSolFlow with an on-chain verification subsection, and wired both into the /seed page.**

## What Happened

Built `seed-docs.tsx` as a `"use client"` component with four clearly delineated parts:
1. **What the Seed Token Is** — explains purpose, pump.fun origin, and what it is not (not governance, not revenue share)
2. **How SOL Flows to the Liquidity Pool** — numbered steps from purchase through permanent LP deployment, with ExplorerLink to program address
3. **How the Boost Works** — 6-step lifecycle from holding through revocation and headroom
4. **Verify Everything On-Chain** — transparency section with GlobalState/BoostRecord/StakeAccount account descriptions and full program ID ExplorerLink

Enhanced `seed-sol-flow.tsx` with ExplorerLink import and a new "Verify On-Chain" card after the existing PumpSwap note, including a placeholder for the LP pool address post-launch.

Updated `seed/page.tsx` to import and render `<SeedDocs />` between `<SeedHeadroom />` and `<SeedCta />`.

## Verification

- `cd app/web && npx tsc --noEmit` — no new type errors (only pre-existing test file TS errors in stake-card.test.tsx and referral-stats-panel.test.tsx, deferred per STATE.md)
- `cd app/web && npx vitest run` — 265 tests pass across 24 test files, zero failures
- `grep -n "SeedDocs" app/web/app/(public)/seed/page.tsx` — import at line 7, render at line 47 ✓
- `grep -cn "ExplorerLink" app/web/components/marketing/seed-docs.tsx` — 3 usages (import + 2 renders) ✓
- `grep -cn "ExplorerLink" app/web/components/marketing/seed-sol-flow.tsx` — 1 usage ✓
- `grep -c "Verify" app/web/components/marketing/seed-docs.tsx` — 3 matches (Part 4 heading + references) ✓

### Slice-level verification (all pass — this is the final task):
- `grep -rn "cluster=devnet"` — only in test files (expected, testing devnet URL generation) ✓
- `grep -rn "solscan.io"` — zero matches ✓
- All 265 tests pass ✓
- No new type errors ✓

## Diagnostics

- Static content sections — no async fetches, no runtime failures to monitor
- `grep -n "ExplorerLink" app/web/components/marketing/seed-docs.tsx app/web/components/marketing/seed-sol-flow.tsx` confirms all on-chain links present
- If Explorer links point to wrong cluster: check `NEXT_PUBLIC_RPC_URL` env var — defaults to mainnet if unset/empty
- React error boundaries surface render errors in browser console if components fail

## Deviations

- Initial edit to `seed-sol-flow.tsx` lost the import/constant lines when two edits to the same file were batched — detected by TSC, fixed immediately with a follow-up edit.
- Fixed trailing content corruption in `seed/page.tsx` from overlapping edits — rewrote file cleanly.

## Known Issues

None.

## Files Created/Modified

- `app/web/components/marketing/seed-docs.tsx` — new 4-part end-to-end documentation section with ExplorerLinks
- `app/web/components/marketing/seed-sol-flow.tsx` — enhanced with ExplorerLink import, PROGRAM_ID constant, and "Verify On-Chain" subsection
- `app/web/app/(public)/seed/page.tsx` — added SeedDocs import and render between Headroom and CTA
- `.gsd/milestones/M001/slices/S09/tasks/T04-PLAN.md` — added Observability Impact section (pre-flight fix)
