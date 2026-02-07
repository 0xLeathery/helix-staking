# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-02-07)

**Core value:** Users can stake tokens for a chosen duration, earn T-shares proportional to their commitment, and receive daily inflation rewards -- the complete stake-lock-earn lifecycle must work trustlessly on-chain.
**Current focus:** Phase 2 - Core Staking Mechanics

## Current Position

Phase: 2 of 8 (Core Staking Mechanics)
Plan: 1 of TBD in current phase
Status: In progress
Last activity: 2026-02-07 -- Completed 02-01-PLAN.md (Types and Math)

Progress: [█░░░░░░░░░] 12.5%

## Performance Metrics

**Velocity:**
- Total plans completed: 3
- Average duration: ~22 min
- Total execution time: ~1h 6min

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| 1 | 2 | ~1h | ~30min |
| 2 | 1 | ~6min | ~6min |

**Recent Trend:**
- Last 5 plans: 01-01 ✓, 01-02 ✓, 02-01 ✓
- Trend: Accelerating (last plan 5.6min)

*Updated after each plan completion*

## Accumulated Context

### Decisions

Decisions are logged in PROJECT.md Key Decisions table.
Recent decisions affecting current work:

- Lazy reward distribution for MVP (not batched crank) -- simpler, pushes compute to user claims
- Separate PDA per stake (not Vec in UserProfile) -- avoids account size limits
- Slot-based day counting over unix_timestamp -- deterministic time logic
- Merkle proofs stored as static JSON on CDN, root stored on-chain
- Fixed-point arithmetic with PRECISION = 1e9 for all bonus/reward calculations (02-01)
- LPB bonus caps at exactly 2x at threshold to avoid integer division rounding (02-01)
- BPB bonus formula rewritten to prevent overflow: (amount / 10) * PRECISION / threshold (02-01)
- Early penalty minimum of 50% applies when calculated penalty < 50% (02-01)

### Pending Todos

None yet.

### Blockers/Concerns

None yet.

## Session Continuity

Last session: 2026-02-07 21:40:04Z
Stopped at: Completed 02-01-PLAN.md (Types and Math foundation)
Resume file: None

## Phase 1 Notes

- Token-2022 metadata extension deferred due to Bankrun compatibility issues
- Mitigation: Add via Metaplex or separate transaction before mainnet
- Documented in 01-02-SUMMARY.md and 01-VERIFICATION.md
