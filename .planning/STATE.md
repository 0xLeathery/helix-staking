---
gsd_state_version: 1.0
milestone: v3.0
milestone_name: Seed Launch & LP Funding
status: planning
stopped_at: Completed 26-frontend-boost-ui 26-02-PLAN.md
last_updated: "2026-03-04T09:09:55.744Z"
last_activity: 2026-03-04 — Roadmap created for v3.0 (Phases 23-27)
progress:
  total_phases: 5
  completed_phases: 4
  total_plans: 9
  completed_plans: 9
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
| Phase 23 P01 | 449s | 2 tasks | 9 files |
| Phase 24-anchor-program-boost-system P01 | 458 | 2 tasks | 13 files |
| Phase 24-anchor-program-boost-system P02 | 357 | 2 tasks | 7 files |
| Phase 24-anchor-program-boost-system P03 | 1349 | 2 tasks | 2 files |
| Phase 25-crank-boost-monitoring P01 | 420 | 3 tasks | 5 files |
| Phase 26-frontend-boost-ui P03 | 4066 | 2 tasks | 8 files |
| Phase 26-frontend-boost-ui P01 | 4107 | 2 tasks | 11 files |
| Phase 26-frontend-boost-ui P02 | 256 | 2 tasks | 6 files |

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
- [Phase 23]: Used CSS/Tailwind flexbox flow diagram for SOL flow nodes — matches existing component patterns, no SVG dependency
- [Phase 23]: Pre-existing test TypeScript errors (missing vitest-dom types) are out of scope and deferred
- [Phase 24-anchor-program-boost-system]: GlobalState reserved extended [u64;6]->[u64;10]; Pubkey encoded as 4 LE u64s in reserved[2..5]
- [Phase 24-anchor-program-boost-system]: admin_toggle_boost guards enable path with Pubkey::default check; re-callable admin_set_seed_mint
- [Phase 24-anchor-program-boost-system]: BoostRecord.boosted_stake_id uses u64::MAX sentinel for not-yet-linked state
- [Phase 24-anchor-program-boost-system]: Remaining_accounts key-scan approach for boost detection in create_stake (not fixed index) — index-independent and robust to ClaimConfig presence/absence
- [Phase 24-anchor-program-boost-system]: TokenInterface (not Token2022) for seed token program — supports both SPL Token and Token-2022
- [Phase 24-anchor-program-boost-system]: BoostRecord boosted_stake_id write-back via direct byte manipulation at offset 49 in remaining_accounts
- [Phase 24-anchor-program-boost-system]: BPD bonus not amplified by boost: formula is (loyalty_adjusted * 1.10) + bpd_bonus, not (loyalty_adjusted + bpd_bonus) * 1.10
- [Phase 24-anchor-program-boost-system]: claim_rewards boost client opt-in via remaining_accounts[0]: omitting seed ATA gives base rewards gracefully, no error
- [Phase 25-crank-boost-monitoring]: SEED_TOKEN_PROGRAM_ID defaults to standard SPL Token for pump.fun tokens, configurable via env for Token-2022
- [Phase 25-crank-boost-monitoring]: result.sent counts transactions sent (not revocations confirmed) — on-chain no-ops indistinguishable without log parsing, acceptable for v3.0
- [Phase 25-crank-boost-monitoring]: LiteSVM AlreadyProcessed rejection requires client.expireBlockhash() between identical transactions in same test
- [Phase 26-frontend-boost-ui]: BoostRevoked uses event-driven dispatch (not scheduler): on-chain event is the trigger, no periodic check needed
- [Phase 26-frontend-boost-ui]: notifyBoostRevoked defaults to true (opt-out): boost revocation is high-urgency financial event
- [Phase 26-frontend-boost-ui]: BoostBadge eligible state is wallet-level only, not per-stake; per-stake only has none/active/revoked
- [Phase 26-frontend-boost-ui]: applyBoostMultiplier mirrors on-chain math.rs: amount + floor(amount * 1000 / 10000)
- [Phase 26-frontend-boost-ui]: buildRegisterBoostTx exported as testable pure function — mirrors simulateTransactionOrThrow pattern, tests verify behavior without React hook machinery
- [Phase 26-frontend-boost-ui]: BoostStatusCard returns null when boost is not enabled (reserved[7] is zero) — graceful degradation if GlobalState not yet configured

### Pending Todos

None.

### Blockers/Concerns
- [Phase 25] pump.fun bonding curve account layout is MEDIUM confidence (reverse-engineered) — devnet spike recommended before Phase 25 poller implementation; Bitquery API is documented fallback

## Session Continuity

Last session: 2026-03-04T09:09:55.742Z
Stopped at: Completed 26-frontend-boost-ui 26-02-PLAN.md
Resume file: None
