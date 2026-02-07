# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-02-07)

**Core value:** Users can stake tokens for a chosen duration, earn T-shares proportional to their commitment, and receive daily inflation rewards -- the complete stake-lock-earn lifecycle must work trustlessly on-chain.
**Current focus:** Phase 2.1 - Critical Math Fixes

## Current Position

Phase: 2.1 of 8 (Critical Math Fixes - INSERTED)
Plan: 1 of 1 in current phase
Status: Phase complete
Last activity: 2026-02-07 -- Completed 02.1-01-PLAN.md (Critical Math Fixes)

Progress: [███░░░░░░░] 28.6%

## Performance Metrics

**Velocity:**
- Total plans completed: 7
- Average duration: ~15 min
- Total execution time: ~1h 47min

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| 1 | 2 | ~1h | ~30min |
| 2 | 4 | ~41min | ~10.25min |
| 2.1 | 1 | ~6min | ~6min |

**Recent Trend:**
- Last 5 plans: 02-02 ✓, 02-03 ✓, 02-04 ✓, 02.1-01 ✓
- Trend: Phase 2.1 complete (6min for critical fixes)

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
- Burn-and-mint token model: tokens burned on stake creation, minted on unstake/claim (02-02)
- Lazy distribution via share_rate: crank updates share_rate but does NOT mint tokens (02-02)
- Permissionless crank: anyone can trigger daily distribution (02-02)
- StakeAccount PDA seeds include total_stakes_created for multiple stakes per user (02-02)
- Unstake automatically claims pending rewards in same transaction (02-03)
- Zero-reward claims rejected with NoRewardsToClaim error (02-03)
- Penalties implemented via not minting tokens in burn-and-mint model (02-03)
- Bankrun chosen over solana-test-validator for faster deterministic tests (02-04)
- Test token amounts reduced to 10-100 tokens to avoid T-share overflow (02-04)
- admin_mint instruction added for test token distribution (authority-gated) (02-04)
- mul_div helpers use inline u128 casts instead of separate SafeMath module (02.1-01)
- Penalties round UP to favor protocol using mul_div_up helper (02.1-01)
- Late penalty formula uses LATE_PENALTY_WINDOW_DAYS for exact 100% at day 365 (02.1-01)
- Penalties redistributed to remaining stakers via share_rate increase (02.1-01)
- Admin mint cap stored in reserved fields to avoid reallocation (02.1-01)
- days_elapsed added to InflationDistributed for indexer gap detection (02.1-01)

### Pending Todos

None yet.

### Blockers/Concerns

None yet.

### Roadmap Evolution

- Phase 2.1 inserted after Phase 2: Critical Math Fixes (URGENT) - Expert board identified 5 critical issues requiring fixes before Phase 3

## Session Continuity

Last session: 2026-02-07 12:10:00Z
Stopped at: Completed 02.1-01-PLAN.md (Critical Math Fixes) - Phase 2.1 complete
Resume file: None

## Phase 1 Notes

- Token-2022 metadata extension deferred due to Bankrun compatibility issues
- Mitigation: Add via Metaplex or separate transaction before mainnet
- Documented in 01-02-SUMMARY.md and 01-VERIFICATION.md
