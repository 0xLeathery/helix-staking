# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-02-07)

**Core value:** Users can stake tokens for a chosen duration, earn T-shares proportional to their commitment, and receive daily inflation rewards -- the complete stake-lock-earn lifecycle must work trustlessly on-chain.
**Current focus:** Phase 3.3 - Post-Audit Security Hardening

## Current Position

Phase: 3.3 of 8 (Post-Audit Security Hardening)
Plan: 3 of 4 in current phase (3 waves)
Status: 🔨 IN PROGRESS
Last activity: 2026-02-08 -- Completed 03.3-03-PLAN.md (Arithmetic Safety and CEI Hardening)

Progress: [████████░░] 75% (3 of 4 plans complete)

## Performance Metrics

**Velocity:**
- Total plans completed: 18
- Average duration: ~8.2 min
- Total execution time: ~2h 34min

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| 1 | 2 | ~1h | ~30min |
| 2 | 4 | ~41min | ~10.25min |
| 2.1 | 1 | ~6min | ~6min |
| 3 | 6 | ~19min | ~3.2min |
| 3.2 | 2 | ~19min | ~9.5min |
| 3.3 | 3 | ~9min | ~3min |

**Recent Trend:**
- Last 5 plans: 03.2-01 ✓, 03.2-02 ✓, 03.3-01 ✓, 03.3-02 ✓, 03.3-03 ✓
- Trend: Consistent 3min execution for security hardening - highly efficient

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
- @noble/hashes and @noble/curves for Merkle tree and Ed25519 in tests (03-06)
- Merkle tree sorts leaves deterministically for reproducible proofs (03-06)
- Ed25519 instruction data manually constructed to match Solana format (03-06)
- Two-phase BPD distribution: finalize_bpd_calculation pre-calculates rate, trigger_big_pay_day distributes (03.2-01)
- StakeAccount expanded from 109 to 113 bytes with bpd_claim_period_id field (03.2-01)
- ClaimConfig expanded from 151 to 168 bytes with bpd_helix_per_share_day and bpd_calculation_complete (03.2-01)
- finalize_bpd_calculation is READ-ONLY: never writes to StakeAccount, only ClaimConfig (03.2-01)
- Global BPD rate locked after calculation to prevent first-batch-drains-pool attack (03.2-01)
- trigger_big_pay_day requires bpd_calculation_complete constraint before distributing (03.2-02)
- Duplicate BPD prevention via bpd_claim_period_id check/set pattern (03.2-02)
- CRIT-1 fixed: pre-calculated rate ensures cross-batch fairness (03.2-02)
- CRIT-2 fixed: bpd_claim_period_id prevents same stake receiving BPD multiple times (03.2-02)
- StakeAccount expanded from 113 to 117 bytes with bpd_finalize_period_id field (03.3-01)
- ClaimConfig expanded from 168 to 184 bytes with bpd_snapshot_slot, bpd_stakes_finalized, bpd_stakes_distributed (03.3-01)
- GlobalState uses reserved[0] for BPD window flag to avoid reallocation (03.3-01)
- seal_bpd_finalize instruction created as authority-gated phase transition (03.3-01)
- MED-5 fixed: claim_period_id=0 rejected to prevent BPD distribution collision (03.3-01)
- Deprecation comments added on unused legacy fields for layout compatibility (03.3-01)
- HIGH-1 fixed: crank_distribution uses mul_div for inflation calculation to prevent overflow (03.3-03)
- MED-2 fixed: withdraw_vested uses mul_div for immediate and vesting calculations (03.3-03)
- ADDL-1/2/3 fixed: free_claim uses mul_div for all proportion calculations (03.3-03)
- MED-6 fixed: admin_mint follows CEI pattern (state update before CPI) (03.3-03)
- MED-8 fixed: migrate_stake instruction added for reallocating old StakeAccounts (03.3-03)
- CEI pattern established: all state updates occur BEFORE external calls (03.3-03)
- mul_div pattern established: all proportion calculations use u128 intermediates (03.3-03)

### Pending Todos

None yet.

### Blockers/Concerns

None yet.

### Roadmap Evolution

- Phase 2.1 inserted after Phase 2: Critical Math Fixes (URGENT) - Expert board identified 5 critical issues requiring fixes before Phase 3
- Phase 3.2 inserted after Phase 3: BPD Security Critical Fixes (URGENT) - Security audit identified 2 CRITICAL vulnerabilities in BPD distribution
- Phase 3.3 inserted after Phase 3.2: Post-Audit Security Hardening (URGENT) - 7-agent security audit identified 1 CRITICAL + 2 HIGH + 8 MEDIUM vulnerabilities requiring fixes before Phase 4

## Session Continuity

Last session: 2026-02-08T03:22:42Z
Stopped at: Completed 03.3-03-PLAN.md (Arithmetic Safety and CEI Hardening)
Resume file: .planning/phases/03.3-post-audit-security-hardening/03.3-04-PLAN.md
Next: Continue Phase 3.3 execution - 1 plan remaining in Wave 3 (final security fixes)

## Phase 1 Notes

- Token-2022 metadata extension deferred due to Bankrun compatibility issues
- Mitigation: Add via Metaplex or separate transaction before mainnet
- Documented in 01-02-SUMMARY.md and 01-VERIFICATION.md
