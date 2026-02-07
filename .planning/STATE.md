# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-02-07)

**Core value:** Users can stake tokens for a chosen duration, earn T-shares proportional to their commitment, and receive daily inflation rewards -- the complete stake-lock-earn lifecycle must work trustlessly on-chain.
**Current focus:** Phase 3 - Free Claim and Big Pay Day

## Current Position

Phase: 3 of 8 (Free Claim and Big Pay Day)
Plan: 5 of 6 in current phase
Status: In progress
Last activity: 2026-02-07 -- Completed 03-03-PLAN.md (Free Claim Instruction)

Progress: [█████░░░░░] 50%

## Performance Metrics

**Velocity:**
- Total plans completed: 12
- Average duration: ~10 min
- Total execution time: ~1h 58min

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| 1 | 2 | ~1h | ~30min |
| 2 | 4 | ~41min | ~10.25min |
| 2.1 | 1 | ~6min | ~6min |
| 3 | 5 | ~11min | ~2.2min |

**Recent Trend:**
- Last 5 plans: 03-02 ✓, 03-05 ✓, 03-04 ✓, 03-03 ✓
- Trend: Phase 3 accelerating (avg 2.2min/plan)

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
- 8-byte merkle root prefix in ClaimStatus seeds for multi-period isolation (03-01)
- ClaimStatus tracks withdrawn_amount for double-withdrawal prevention (03-01)
- Speed bonus tiers incentivize early claims: +20% week 1, +10% weeks 2-4 (03-01)
- 30-day linear vesting with 10% immediate release (03-01)
- StakeAccount expanded from 92 to 109 bytes with lazy migration on claim_rewards (03-02)
- BPD bonus added to total reward payout (not separate claim instruction) (03-02)
- realloc::zero = true ensures new fields default to 0/false (safe for migration) (03-02)
- bpd_eligible defaults to false until claim period integration in plan 03-05 (03-02)
- ClaimConfig uses init constraint ensuring singleton PDA (can only be created once) (03-05)
- claim_period_started = true immediately after init (merkle_root immutable) (03-05)
- Authority stored in ClaimConfig matches caller for future reference (03-05)
- Linear 30-day vesting: 10% immediate + 90% over 30 days (03-04)
- T-share-days weighting for BPD: t_shares * days_staked_during_claim_period (03-04)
- Only stakes created DURING claim period eligible for BPD (03-04)
- MAX_STAKES_PER_BPD = 20 for compute limit safety (03-04)
- solana-nostd-keccak v0.1 for Merkle proof verification (03-03)
- Ed25519 introspection for MEV prevention on free_claim (03-03)
- Speed bonus: +20% week 1, +10% weeks 2-4, 0% after (03-03)

### Pending Todos

None yet.

### Blockers/Concerns

None yet.

### Roadmap Evolution

- Phase 2.1 inserted after Phase 2: Critical Math Fixes (URGENT) - Expert board identified 5 critical issues requiring fixes before Phase 3

## Session Continuity

Last session: 2026-02-07T22:49:00Z
Stopped at: Completed 03-03-PLAN.md (Free Claim Instruction) - Phase 3 in progress
Resume file: None

## Phase 1 Notes

- Token-2022 metadata extension deferred due to Bankrun compatibility issues
- Mitigation: Add via Metaplex or separate transaction before mainnet
- Documented in 01-02-SUMMARY.md and 01-VERIFICATION.md
