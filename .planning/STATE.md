---
gsd_state_version: 1.0
milestone: v3.0
milestone_name: Seed Launch & LP Funding
status: planning
stopped_at: Completed 23-02-PLAN.md
last_updated: "2026-03-04T03:08:14.223Z"
last_activity: 2026-03-04 — Roadmap created for v3.0 (Phases 23-27)
progress:
  total_phases: 5
  completed_phases: 0
  total_plans: 2
  completed_plans: 1
  percent: 0
---

# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-03-04)

**Core value:** Committed stakers earn outsized rewards — conviction is rewarded, not just capital
**Current focus:** v3.0 — Phase 23: Communication & Boost Rules

## Current Position

Phase: 23 of 27 (Communication & Boost Rules)
Plan: — (not yet planned)
Status: Ready to plan
Last activity: 2026-03-04 — Roadmap created for v3.0 (Phases 23-27)

Progress: [░░░░░░░░░░] 0%

## Performance Metrics

**Velocity:**
- Total plans completed: 0 (v3.0)
- Average duration: —
- Total execution time: —

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| — | — | — | — |

*Updated after each plan completion*
| Phase 23-communication-boost-rules P02 | 6 | 2 tasks | 5 files |

## Accumulated Context

### Decisions

- Boost is two-layer: (1) on-chain `claim_rewards` checks current seed balance >= snapshot_at_stake_time; (2) crank every 6h for proactive UI revocation
- Revocation is permanent per stake — repurchasing seed does NOT restore a revoked boost
- Seed token stays liquid — no escrow or locking; APY boost is the only soft-lock
- Headroom: stake with N seed, buy M more; can sell M before losing boost (balance stays >= snapshot)
- Messaging is Phase 23, not Phase 26 — boost rules must be live before any staking action
- pump.fun graduates to PumpSwap (not Raydium) — HLX/SOL LP must be created manually from SOL proceeds
- Actual seed token launch on pump.fun is manual team action, NOT in code scope
- HLX/SOL LP pool creation deferred to future milestone (LP-01 through LP-03)
- Boost multiplier: 10% (1,000 BPS) — locked
- Minimum seed balance: admin-adjustable in GlobalState (not hardcoded) — locked
- One boosted stake per wallet — locked
- Time-held bonus deferred to v3.x (ADV-04)
- [Phase 23-communication-boost-rules]: Local useState for checkbox in BoostRulesStep: prevents pre-checked state; Zustand updated only on Continue click
- [Phase 23-communication-boost-rules]: Confirm Back changed to setStep(3): ensures boost rules disclosure is seen when navigating back from Confirm step

### Pending Todos

None.

### Blockers/Concerns
- [Phase 25] pump.fun bonding curve account layout is MEDIUM confidence (reverse-engineered) — devnet spike recommended before Phase 25 poller implementation; Bitquery API is documented fallback

## Session Continuity

Last session: 2026-03-04T03:08:14.222Z
Stopped at: Completed 23-02-PLAN.md
Resume file: None
