# Phase 8.1 Complete Audit — 11 Feb 2026

**Baseline:** 134/134 bankrun tests passing | 6 review teams | Full codebase scope

## Verdict

| Area | Result |
|------|--------|
| On-Chain Program | CONDITIONAL PASS |
| Security | PASS (with conditions) |
| Math Parity | **FULL MATCH** (28 constants, 10 functions) |
| Frontend | 7.4/10 |
| Indexer | CONDITIONAL PASS |
| Config & Deploy | NOT MAINNET READY |

**Totals: 7 CRIT · 11 HIGH · 18 MED · 16 LOW**

---

## Confirmed Strengths

- Rust ↔ TypeScript math: zero divergence across all calculations and constants
- Check-Effects-Interactions: flawless across all 6 CPI sites
- Burn-and-mint model eliminates vault drainage / flash loan surfaces
- Authority cannot steal user principal (tokens burned on stake, no escrow)
- PDA derivations: no collision vectors across 7 PDA types
- All 11 prior audit findings verified fixed or documented
- BPD lifecycle: anti-whale cap, 24h seal delay, double-distribution prevention

---

## CRITICAL (7)

| # | Finding | Area | Fix |
|---|---------|------|-----|
| C1 | `total_claimed` exceeds `total_claimable` from speed bonuses → BPD bricked | Program | `saturating_sub` in finalize or validate `total_claimable` includes 1.2× |
| C2 | `admin_set_claim_end_slot` — unbounded, no event | Program | Remove for mainnet or add bounds + event |
| C3 | `admin_set_slots_per_day` — retroactively alters all economics | Program | Remove for mainnet or feature-gate |
| C4 | `NEXT_PUBLIC_TEST_WALLET_SECRET` in client bundle | Frontend | Drop `NEXT_PUBLIC_` prefix; gate behind `NODE_ENV` |
| C5 | `useUnstake`/`useClaimRewards` ignore `simulation.value.err` | Frontend | Add `if (simulation.value.err) throw` |
| C6 | Indexer poller drops events beyond 1,000-sig gap | Indexer | Backward pagination loop |
| C7 | No DB migration files exist | Indexer | `drizzle-kit generate` + commit |

## HIGH (11)

| # | Finding | Area |
|---|---------|------|
| H1 | Singleton ClaimConfig — one lifetime claim period | Program |
| H2 | BPD window locks funds if authority unavailable | Program |
| H3 | Loyalty bonus inflates supply +50% above declared rate | Program |
| H4 | No React error boundaries anywhere | Frontend |
| H5 | Hardcoded `cluster=devnet` in explorer links | Frontend |
| H6 | RPC proxy: no rate limit, no method allowlist | Frontend |
| H7 | Checkpoint advances past failed event inserts | Indexer |
| H8 | No indexer API rate limiting | Indexer |
| H9 | Indexer uses Anchor 0.30.x vs program 0.31.x | Config |
| H10 | No verifiable build (`target/verifiable/` empty) | Config |
| H11 | No CI/CD pipeline | Config |

## MEDIUM (18)

| # | Finding | Area |
|---|---------|------|
| M1 | Event u128→u64 truncation | Program |
| M2 | `abort_bpd` permanently prevents BPD retry for same period | Program |
| M3 | No `total_claimable > 0` validation | Program |
| M4 | Authority transfer proposal allowed during BPD | Program |
| M5 | `admin_mint` no recipient owner check | Security |
| M6 | Singleton ClaimConfig (dup of H1) | Security |
| M7 | `create_stake` manual constraints vs `associated_token` | Security |
| M8 | Orphaned `bpd_finalize_period_id` after abort | Security |
| M9 | Duplicate `cn()` utility | Frontend |
| M10 | `useStakes` WebSocket subscription churn | Frontend |
| M11 | PDA derived every render (no `useMemo`) | Frontend |
| M12 | No input sanitization on stake amount | Frontend |
| M13 | `signTransaction!` non-null assertion | Frontend |
| M14 | Missing HSTS + Permissions-Policy | Frontend |
| M15 | `/api/stats/history` unvalidated `limit` | Indexer |
| M16 | `/api/distributions/chart` unbounded scan | Indexer |
| M17 | Missing `slot` indexes on event tables | Indexer |
| M18 | Connection pool hardcoded to 10 | Indexer |

## LOW (16)

L1 deprecated fields waste space · L2 zero-amount admin_mint · L3 permissionless migrate_stake payer · L4 dead BPD eligibility code · L5 unstake event unwrap_or · L6 seal delay uses wall-clock vs slots · L7 SKIP_WALLET_CHECK flag · L8 no success toast on createStake · L9 Jupiter public RPC fallback · L10 unused token accounts in crank · L11 health endpoint creates RPC client · L12 no indexer tests · L13 pino-pretty in prod deps · L14 legacy mocha/chai deps · L15 root tsconfig es6 target · L16 16-min vitest timeout

---

## Priority Actions

**P0 — Mainnet blockers:**
1. Remove/gate `admin_set_slots_per_day` + `admin_set_claim_end_slot`
2. Multisig authority
3. Fix `total_claimable` vs speed bonus
4. Remove `NEXT_PUBLIC_TEST_WALLET_SECRET`
5. Fix simulation checking in unstake/claim hooks
6. CI/CD pipeline
7. Verifiable build

**P1 — Production indexer:**
8. Backward pagination in poller
9. Atomic event+checkpoint
10. Rate limiting
11. Bump Anchor to 0.31.x
12. Commit DB migrations

**P2 — Should fix:**
13. BPD window escape hatch
14. Error boundaries
15. Vitest exclude Playwright
16. Cluster-aware explorer links
17. RPC proxy allowlist
18. Document loyalty inflation
19. Slot indexes

**P3 — Nice to have:**
20–25. Remove legacy deps, useMemo PDAs, HSTS headers, standardize toasts, indexer tests, remove dead code
