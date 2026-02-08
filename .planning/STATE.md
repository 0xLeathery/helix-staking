# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-02-07)

**Core value:** Users can stake tokens for a chosen duration, earn T-shares proportional to their commitment, and receive daily inflation rewards -- the complete stake-lock-earn lifecycle must work trustlessly on-chain.
**Current focus:** Phase 7 - Leaderboard and Marketing Site

## Current Position

Phase: 7 of 8 (Leaderboard and Marketing Site)
Plan: 1 of 3 in current phase
Status: In progress
Last activity: 2026-02-08 -- Completed 07-01-PLAN.md (Leaderboard and whale activity API endpoints)

Progress: [███░░░░░░░] 33% (1 of 3 plans complete)

## Performance Metrics

**Velocity:**
- Total plans completed: 31
- Average duration: ~7.6 min
- Total execution time: ~3h 58min

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| 1 | 2 | ~1h | ~30min |
| 2 | 4 | ~41min | ~10.25min |
| 2.1 | 1 | ~6min | ~6min |
| 3 | 6 | ~19min | ~3.2min |
| 3.2 | 2 | ~19min | ~9.5min |
| 3.3 | 4 | ~19min | ~4.75min |
| 4 | 5/5 | ~58min | ~11.6min |
| 5 | 3/3 | ~10min | ~3.3min |
| 6 | 3/3 | ~10min | ~3.3min |
| 7 | 1/3 | ~4min | ~4min |

**Recent Trend:**
- Last 5 plans: 05-01 ✓, 05-02 ✓, 05-03 ✓, 06-01 ✓, 06-02 ✓, 06-03 ✓, 07-01 ✓
- Trend: Phase 7 started - backend API endpoints complete

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
- CRIT-NEW-1 fixed: finalize_bpd_calculation marks each stake with bpd_finalize_period_id to prevent duplicate counting (03.3-02)
- finalize_bpd_calculation captures bpd_snapshot_slot on first batch for consistent days_staked across all batches (03.3-02)
- finalize_bpd_calculation sets BPD window active on first batch to block unstake during distribution (03.3-02)
- finalize_bpd_calculation NEVER sets bpd_calculation_complete (removed -- seal_bpd_finalize does this) (03.3-02)
- trigger_big_pay_day verifies each stake has bpd_finalize_period_id == claim_period_id before distributing (03.3-02)
- trigger_big_pay_day uses counter-based completion (bpd_stakes_distributed >= bpd_stakes_finalized) instead of len < MAX heuristic (03.3-02)
- trigger_big_pay_day clears BPD window on completion (HIGH-2) (03.3-02)
- MED-1 fixed: trigger_big_pay_day uses u64::try_from instead of 'as u64' for bonus cast (03.3-02)
- MED-3 fixed: trigger_big_pay_day uses checked_sub instead of saturating_sub for bpd_remaining_unclaimed (03.3-02)
- HIGH-2 fixed: unstake blocked during BPD window via is_bpd_window_active check (03.3-02)
- LOW-2 fixed: unstake includes bpd_bonus_pending in payout (03.3-02)
- Separate phase3.3/ test directory created for security hardening tests (03.3-04)
- 16 security tests added covering all Phase 3.3 vulnerabilities: CRIT-NEW-1 (7), HIGH-2 (2), MED-5 (2), LOW-2 (1), Integration (1) (03.3-04)
- Test runner environment issue documented: ts-mocha + noble/hashes ESM export incompatibility requires fix (03.3-04)
- legacy-peer-deps required for Next.js dashboard due to wallet-adapter peering on newer @solana/web3.js (04-01)
- ConnectionProvider endpoint uses window.location.origin for browser, https://localhost fallback for SSR (04-01)
- QueryClient singleton with staleTime 15s, gcTime 30s for on-chain data freshness (04-01)
- Dark-mode-only theme with forcedTheme="dark" (04-01)
- autoConnect=false on wallet adapter per security requirement (04-01)
- React Query hooks use WebSocket onAccountChange + polling fallback for cache invalidation (04-02)
- Math module uses BN.js mulDiv/mulDivUp matching on-chain Rust exactly (04-02)
- useStakes uses memcmp filter at offset 8 (after Anchor discriminator) for user pubkey (04-02)
- useTokenBalance uses Token-2022 program ID for ATA derivation (04-02)
- Dashboard layout uses wallet gate pattern with responsive sidebar/hamburger (04-02)
- Ed25519 verify instruction manually constructed for free_claim MEV protection (04-05)
- Merkle proof data loaded from static CDN (NEXT_PUBLIC_MERKLE_DATA_URL env var) (04-05)
- Speed bonus tiers: +20% week 1, +10% weeks 2-4, 0% after (04-05)
- Vesting calculation: 10% immediate + 90% linear over 30 days from claim_slot (04-05)
- BPD phase detection from ClaimConfig: bpdCalculationComplete, bpdStakesFinalized, bpdStakesDistributed (04-05)
- Crank already-distributed check: globalState.currentDay >= calculated current day (04-05)
- useToast wraps sonner with variant: destructive->error, default->success (04-05)
- Button touch targets 44-48px minimum for WCAG 2.1 AA mobile accessibility (04-05)
- Skip-to-content link for keyboard navigation (sr-only, focus:not-sr-only) (04-05)
- Lazy DB initialization via Proxy to avoid import-time env validation failures in tests (05-01)
- Token-value fields (amount, tShares, shareRate) stored as text in Postgres; slot/day/count as bigint mode number (05-01)
- Finality type (confirmed/finalized) instead of Commitment for getParsedTransaction to match Solana API (05-01)
- Logger reads LOG_LEVEL directly from process.env to avoid circular dependency with env.ts (05-01)
- Anchor IDL loaded via fs.readFileSync + JSON.parse for ESM compatibility (05-01)
- FastifyPluginCallback pattern for route registration with synchronous done() callback (05-03)
- Parallel Promise.all for data + count queries to minimize paginated endpoint latency (05-03)
- Chart endpoint returns all distributions without pagination (expected <5000 rows for years) (05-03)
- Zod coerce for query param validation (page/limit string-to-number with bounds checking) (05-03)
- SQL | undefined pattern for optional WHERE clause with Drizzle .where() no-op on undefined (05-03)
- Empty results return data: [] with total: 0, not 404 (05-03)
- Per-signature checkpoint updates (not per-batch) for granular crash recovery (05-02)
- Signatures reversed to oldest-first for chronological processing and consistent checkpoint state (05-02)
- Individual signature failures do not abort the batch -- logged and skipped (05-02)
- Gap detection for InflationDistributed is informational-only (warn log, no corrective action) (05-02)
- BN values converted via toString(), Pubkeys via toBase58(), byte arrays via Buffer.from().toString('hex') (05-02)
- Leaderboard uses RANK() window function with active-stakes-only CTE (LEFT JOIN + WHERE se.id IS NULL) (07-01)
- Leaderboard supports sorting by t_shares (default), total_staked, or stake_count (07-01)
- Leaderboard WHERE clause includes user even if outside top N: WHERE rank <= limit OR user = user (07-01)
- Whale activity uses UNION ALL pattern combining stake_created_events and stake_ended_events (07-01)
- Whale activity default minAmount: 100 HELIX (100000000000 with 9 decimals), configurable via query param (07-01)
- Both leaderboard and whale activity return { data: rows } format matching existing indexer endpoints (07-01)

### Pending Todos

None yet.

### Blockers/Concerns

**Test Infrastructure:**
- Test runner environment issue: ts-mocha cannot resolve `@noble/hashes/sha3` export (ESM/CJS interop)
- Impact: Phase 3 and Phase 3.3 tests cannot run until module resolution fixed
- Workaround options: (1) Fix noble/hashes imports, (2) Switch to jest, (3) Update ts-mocha/Node config
- Status: Documented in 03.3-04-SUMMARY.md - does not block code development, only test execution

### Roadmap Evolution

- Phase 2.1 inserted after Phase 2: Critical Math Fixes (URGENT) - Expert board identified 5 critical issues requiring fixes before Phase 3
- Phase 3.2 inserted after Phase 3: BPD Security Critical Fixes (URGENT) - Security audit identified 2 CRITICAL vulnerabilities in BPD distribution
- Phase 3.3 inserted after Phase 3.2: Post-Audit Security Hardening (URGENT) - 7-agent security audit identified 1 CRITICAL + 2 HIGH + 8 MEDIUM vulnerabilities requiring fixes before Phase 4

## Session Continuity

Last session: 2026-02-08
Stopped at: Completed 07-01-PLAN.md (Leaderboard and whale activity API endpoints)
Resume file: None
Next: Plan 07-02 (Leaderboard and whale tracker dashboard pages)

## Phase 1 Notes

- Token-2022 metadata extension deferred due to Bankrun compatibility issues
- Mitigation: Add via Metaplex or separate transaction before mainnet
- Documented in 01-02-SUMMARY.md and 01-VERIFICATION.md
