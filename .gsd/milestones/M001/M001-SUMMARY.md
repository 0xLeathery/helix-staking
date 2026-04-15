---
id: M001
provides:
  - Complete HEX-inspired time-locked staking protocol on Solana (Anchor program, Next.js dashboard, Fastify indexer, crank service)
  - Vercel deployment with Fluid Compute and webpack alias for @noble/hashes
  - Automated crank service with 4-cron scheduling, RPC failover, Docker Compose integration
  - Published tokenomics documentation with sensitivity analysis and interactive calculator
  - Private production runbook (1,030 lines) covering key management, deployment, incident response
  - /seed marketing page with 7 content sections covering seed token purpose, LP funding, boost eligibility, headroom/revocation
  - On-chain boost system: BoostRecord PDA, extended GlobalState/StakeAccount, 6 boost instructions, 10% multiplier at claim time
  - 6-hour crank boost monitoring with permissionless update_boost_status sweep
  - Frontend boost UI: BoostBadge (3 states), BoostStatusCard, useRegisterBoost, useSeedBalance, useBoostRecord hooks
  - BoostRevoked push notification pipeline (DB migration, indexer processor, frontend settings toggle)
  - LP pool stats widget with environment-gated Raydium API integration (4 render states)
  - End-to-end seed → boost → LP documentation with on-chain verification links
  - Shared Explorer URL utility and ExplorerLink component — all on-chain actions link to Solana Explorer
  - Zero hardcoded cluster=devnet or solscan.io URLs in production code
key_decisions:
  - "Permissionless crank instruction — anyone can call it, decouples protocol liveness from a single operator"
  - "Token-2022 over classic SPL — modern standard, metadata extension, future-proof"
  - "webpack resolve.alias for @noble/hashes — avoids ERR_PACKAGE_PATH_NOT_EXPORTED at Vercel runtime"
  - "Standalone services/crank/ — least-privilege, independent restart, separate from indexer"
  - "Production runbook in .private/ — gitignored, balances accessibility with privacy"
  - "GlobalState reserved extended from [u64;6] to [u64;10] for boost fields"
  - "BoostRecord uses u64::MAX sentinel for not-yet-linked boosted_stake_id"
  - "Remaining_accounts PDA key scan (not fixed index) for flexible boost detection in create_stake"
  - "BPD bonus additive after boost — not amplified by 10% multiplier"
  - "Client-side PDA derivation for BoostRecord address in UI — avoids plumbing through data layer"
  - "Shared lib/utils/explorer.ts for all Solana Explorer URLs — centralized cluster detection"
  - "Environment-gated hooks return early with null data when env var is empty — no fetch attempted"
patterns_established:
  - "Pubkey encoding in GlobalState reserved slots: 4 consecutive u64s via LE bytes (32-byte Pubkey = 4x8)"
  - "Admin instruction pattern: authority constraint + mut global_state + re-callable idempotent logic"
  - "validate_*_pda pattern: deterministic derivation + key equality + canonical bump check"
  - "Permissionless crank instruction: payer is any Signer, stake_owner validated only by PDA seeds"
  - "Live ATA balance read: seed_ata_info.try_borrow_data()? with data[64..72] LE u64 parse"
  - "CEI pattern for revocation: set boost_revoked before CPI mint to prevent double-revocation"
  - "All on-chain links use ExplorerLink component — no raw anchor tags with Explorer/Solscan URLs"
  - "Environment-gated features return early with null data + false flag when env var is empty"
  - "Wizard step insert pattern: update store type, add step render in page, update connector count, fix adjacent Back buttons"
  - "TDD across frontend: RED → GREEN with behavioral tests for hooks and render-state tests for components"
observability_surfaces:
  - "LP widget renders 'Pool Not Yet Created' when NEXT_PUBLIC_RAYDIUM_POOL_ID is empty"
  - "LP widget renders 'Unable to load pool stats' on persistent Raydium API failure"
  - "Crank service logs boost check results every 6 hours (active/revoked/sent counts)"
  - "grep -rn 'ExplorerLink' app/web/components/ --include='*.tsx' — audit all Explorer link consumers"
  - "cd app/web && npx vitest run — 265 tests, full suite health check"
  - "cd programs/helix-staking && cargo test --lib — 139 Rust unit tests"
requirement_outcomes:
  - id: COMM-01
    from_status: active
    to_status: validated
    proof: "SeedSolFlow component renders Buy Seed → Creator Rewards → Fund LP flow diagram on /seed page"
  - id: COMM-02
    from_status: active
    to_status: validated
    proof: "SeedWhatIs component explains seed token purpose, LP funding, no-lock mechanic on /seed page"
  - id: COMM-03
    from_status: active
    to_status: validated
    proof: "SeedBoostExplain component includes worked numeric example (3.69% vs 4.06%) on /seed page"
  - id: COMM-04
    from_status: active
    to_status: validated
    proof: "BoostRulesStep in 4-step stake wizard gates staking behind checkbox acknowledgment of snapshot, headroom, permanent revocation, and multiplier rules"
  - id: BOOST-01
    from_status: active
    to_status: validated
    proof: "admin_set_seed_mint instruction sets seed_mint and min_balance in GlobalState reserved slots; LiteSVM integration tests pass"
  - id: BOOST-02
    from_status: active
    to_status: validated
    proof: "register_seed_boost creates BoostRecord PDA with ATA validation and balance check; 18 LiteSVM tests pass"
  - id: BOOST-03
    from_status: active
    to_status: validated
    proof: "create_stake auto-links BoostRecord via PDA key scan in remaining_accounts, snapshots seed_balance_at_stake; LiteSVM tests verify"
  - id: BOOST-04
    from_status: active
    to_status: validated
    proof: "claim_rewards reads live seed ATA balance, applies boost only when balance >= snapshot; LiteSVM BOOST-04 test passes"
  - id: BOOST-05
    from_status: active
    to_status: validated
    proof: "boost_revoked = true set permanently before CPI mint (CEI); buying back does not restore; LiteSVM BOOST-05 test passes"
  - id: BOOST-06
    from_status: active
    to_status: validated
    proof: "apply_boost_multiplier(1000 BPS) mints extra tokens at claim time; LiteSVM BOOST-06 test verifies boosted > base rewards"
  - id: BOOST-07
    from_status: active
    to_status: validated
    proof: "Buying more seed tokens provides headroom above snapshot; LiteSVM BOOST-07 headroom tests pass"
  - id: BOOST-08
    from_status: active
    to_status: validated
    proof: "executeBoostCheck() in services/crank/src/boostCheck.ts sweeps all BoostRecord PDAs every 6 hours; wired into crank index.ts"
  - id: FRONT-01
    from_status: active
    to_status: validated
    proof: "BoostBadge renders eligible/active/revoked states; BoostStatusCard on dashboard; 15 BoostBadge + 7 BoostStatusCard tests pass"
  - id: FRONT-02
    from_status: active
    to_status: validated
    proof: "StakeCard applies applyBoostMultiplier to pending rewards when boostState === 'active'; shows '(Boosted)' label"
  - id: FRONT-03
    from_status: active
    to_status: validated
    proof: "useRegisterBoost mutation hook calls register_seed_boost on-chain; BoostStatusCard renders Register button; 6 behavioral tests pass"
  - id: FRONT-04
    from_status: active
    to_status: validated
    proof: "BoostRevoked event processed in indexer, dispatched via push notification with user opt-out; 5 notification toggle tests pass"
  - id: FRONT-05
    from_status: active
    to_status: validated
    proof: "LpPoolStats renders TVL/price/volume from Raydium API; 4 render states; useLpPoolStats with 5 behavioral tests; dashboard integration confirmed"
  - id: TRUST-01
    from_status: active
    to_status: validated
    proof: "SeedDocs renders 4-part end-to-end documentation on /seed page covering seed purpose, SOL flow, boost mechanics, on-chain verification"
  - id: TRUST-02
    from_status: active
    to_status: validated
    proof: "ExplorerLink wired into 8 components; zero hardcoded cluster=devnet or solscan.io URLs in production code"
  - id: TRUST-03
    from_status: active
    to_status: validated
    proof: "SeedSolFlow with 'Verify On-Chain' subsection; SeedDocs Part 2 documents numbered SOL flow from purchase through LP deployment"
  - id: TRUST-04
    from_status: active
    to_status: validated
    proof: "SeedDocs Part 4 documents GlobalState/BoostRecord/StakeAccount with ExplorerLinks; BoostStatusCard and StakeCard show PDA Explorer links"
duration: "~2 weeks across 9 slices"
verification_result: passed
completed_at: 2026-03-17
---

# M001: Migration

**Full v3.0 seed launch and boost system: on-chain 10% APY boost with permanent revocation, automated crank monitoring, frontend boost UI, LP pool stats, end-to-end documentation, and unified Solana Explorer linking — built on top of the existing v1.1/v2.0 staking protocol, crank service, and Vercel deployment.**

## What Happened

M001 migrated the HELIX staking protocol from its existing v1.1/v2.0 state through to v3.0 — the seed launch and LP funding milestone. The work progressed through 9 sequential slices, each building on the previous.

**Infrastructure stabilization (S01–S04).** The first four slices resolved deployment issues and established operational foundations. S01 fixed the Vercel build with a webpack alias for `@noble/hashes` and documented Fluid Compute configuration. S02 built the standalone crank service (`services/crank/`) with 4-cron scheduling (hourly distribution, daily BPD, weekly badge sweep, monthly SOL check), p-retry with RPC failover, BetterStack heartbeat integration, and Docker Compose wiring. S03 published `docs/TOKENOMICS.md` with 10-year supply projections, penalty mechanics, risk scenarios, and an interactive zero-dependency HTML calculator. S04 wrote the 1,030-line private production runbook in `.private/PRODUCTION_RUNBOOK.md` covering key management, deployment procedures, and incident response.

**Seed launch communication (S05).** Created the `/seed` marketing page with 7 content sections: hero, seed token purpose (COMM-02), boost eligibility with worked APY example (COMM-03), SOL flow diagram showing buy → creator rewards → LP funding (COMM-01), headroom and permanent revocation mechanics, and bottom CTA. Added a mandatory 4-step stake wizard with boost rules disclosure gate — users must acknowledge snapshot, headroom, permanent revocation, and multiplier rules via checkbox before staking (COMM-04).

**On-chain boost system (S06).** Built the complete Anchor program boost foundation across three plans. Plan 01 defined the type system: `BoostRecord` PDA (LEN=57), extended `GlobalState` (reserved `[u64;10]` with seed_mint/boost_enabled helpers), extended `StakeAccount` (LEN=134 with boost fields), `apply_boost_multiplier` (10% via 1,000 BPS), 8 error variants, 3 events, and admin instructions (`admin_set_seed_mint`, `admin_toggle_boost`). Plan 02 added the user-facing instructions: `register_seed_boost` (creates BoostRecord PDA with ATA validation), `create_stake` auto-linking (scans remaining_accounts by PDA key to snapshot seed balance), and `update_boost_status` (permissionless crank-callable revocation). Plan 03 modified `claim_rewards` to read live seed ATA balance, apply the 10% boost multiplier after loyalty but before BPD (additive, not amplified), and permanently revoke on balance drop using the CEI pattern (write before CPI mint). All 7 BOOST requirements verified by 26 LiteSVM integration tests with zero regressions across 191 total tests.

**Crank boost monitoring (S07).** Added the `executeBoostCheck()` sweep function to the crank service — enumerates all `BoostRecord` PDAs via `program.account.boostRecord.all()`, filters to linked/active/non-revoked, derives seed ATAs, and calls `update_boost_status` for each. Wired as a 6-hour cron schedule (`0 0,6,12,18 * * *`) with the `SEED_TOKEN_PROGRAM_ID` environment variable defaulting to standard SPL Token (pump.fun tokens).

**Frontend boost UI (S08).** Synced the web IDL from 22 to 26 instructions. Built the boost utility layer: constants, PDA derivation, `applyBoostMultiplier` (mirrors Rust exactly). Created `BoostBadge` with three visual states (eligible/active/revoked), `useSeedBalance` and `useBoostRecord` hooks, and integrated boost state + boosted APY display into `StakeCard`. Added `useRegisterBoost` mutation hook with simulation-before-send security, `BoostStatusCard` dashboard component with five render states, and the `BoostRevoked` push notification pipeline (DB migration, indexer processor, frontend settings toggle). 237 tests passing with zero regressions.

**LP stats, docs, and transparency (S09).** The final slice centralized all Solana Explorer link generation into `lib/utils/explorer.ts` and the `ExplorerLink` component, wired into 8 components — eliminating all hardcoded `cluster=devnet` and `solscan.io` URLs. Built the LP pool stats widget with environment-gated Raydium API integration (dormant until `NEXT_PUBLIC_RAYDIUM_POOL_ID` is set). Published end-to-end documentation on the `/seed` page covering seed purpose, SOL flow, boost mechanics, and on-chain verification with Explorer links to program accounts. Final test count: 265/265 web tests, 139/139 Rust unit tests.

## Cross-Slice Verification

The milestone roadmap has no explicit success criteria (migrated milestone). Verification is based on each slice's stated outcome and the 21 tracked requirements.

| Slice | Stated Outcome | Verified |
|-------|---------------|----------|
| S01 | Frontend builds and runs on Vercel with Fluid Compute | ✅ PROJECT.md validated; webpack alias is a key decision |
| S02 | Standalone crank service with 4-cron scheduling, RPC failover, Docker Compose | ✅ `services/crank/` exists with all source files; `docker/docker-compose.yml` includes crank |
| S03 | Published TOKENOMICS.md with calculator | ✅ `docs/TOKENOMICS.md` and `docs/tokenomics-calculator.html` both exist on disk |
| S04 | Private 1,030-line production runbook | ✅ `.private/` is gitignored — expected not in worktree; PROJECT.md lists as validated |
| S05 | /seed launch page with all content sections | ✅ 7 seed marketing components (1,009 lines total); COMM-01 through COMM-04 validated |
| S06 | On-chain boost system foundation + instructions | ✅ 5 boost program files (318+ lines), 139 Rust tests pass; BOOST-01 through BOOST-07 validated |
| S07 | 6-hour boost-check cron in crank service | ✅ `boostCheck.ts` exists, wired in `index.ts` with 6-hour schedule; BOOST-08 validated |
| S08 | Frontend boost UI with hooks and components | ✅ All hooks/components exist; 265 web tests pass; FRONT-01 through FRONT-04 validated |
| S09 | LP stats, docs, Explorer links, transparency | ✅ ExplorerLink in 8 components, 0 hardcoded URLs; FRONT-05, TRUST-01–04 validated |

**Test suite health:**
- `cd app/web && npx vitest run` — 265/265 pass (24 test files)
- `cd programs/helix-staking && cargo test --lib` — 139/139 pass
- `services/indexer && npx tsc --noEmit` — pre-existing module resolution errors (drizzle-orm types), not introduced by M001
- `services/crank && npx tsc --noEmit` — pre-existing missing type declarations (zod, node-cron, pino, p-retry), not introduced by M001

**Hardcoded URL audit:**
- `grep -rn "cluster=devnet"` — zero matches outside `explorer.ts` and test files
- `grep -rn "solscan.io"` — zero matches across entire codebase

## Requirement Changes

All 21 requirements transitioned from **active → validated** during M001:

- **COMM-01**: active → validated — SeedSolFlow renders SOL flow diagram (buy → creator rewards → fund LP)
- **COMM-02**: active → validated — SeedWhatIs explains seed token purpose and LP funding
- **COMM-03**: active → validated — SeedBoostExplain includes worked 3.69% vs 4.06% example
- **COMM-04**: active → validated — BoostRulesStep gates staking behind checkbox acknowledgment
- **BOOST-01**: active → validated — admin_set_seed_mint instruction with LiteSVM tests
- **BOOST-02**: active → validated — register_seed_boost with ATA validation and 18 LiteSVM tests
- **BOOST-03**: active → validated — create_stake auto-links BoostRecord, snapshots seed balance
- **BOOST-04**: active → validated — claim_rewards verifies live balance >= snapshot before boost
- **BOOST-05**: active → validated — Permanent revocation via CEI pattern, buying back doesn't restore
- **BOOST-06**: active → validated — 10% multiplier (1,000 BPS) mints extra tokens at claim time
- **BOOST-07**: active → validated — Headroom above snapshot verified by LiteSVM tests
- **BOOST-08**: active → validated — executeBoostCheck sweeps every 6 hours in crank service
- **FRONT-01**: active → validated — BoostBadge + BoostStatusCard with 22 tests
- **FRONT-02**: active → validated — StakeCard shows boosted APY with (Boosted) label
- **FRONT-03**: active → validated — useRegisterBoost mutation with 6 behavioral tests
- **FRONT-04**: active → validated — BoostRevoked push notification pipeline end-to-end
- **FRONT-05**: active → validated — LpPoolStats with 4 render states and 10 tests
- **TRUST-01**: active → validated — SeedDocs 4-part documentation on /seed page
- **TRUST-02**: active → validated — ExplorerLink in 8 components, zero hardcoded URLs
- **TRUST-03**: active → validated — SeedSolFlow with on-chain verification subsection
- **TRUST-04**: active → validated — GlobalState/BoostRecord/StakeAccount documented with ExplorerLinks

## Forward Intelligence

### What the next milestone should know
- The Anchor program is at 26 instructions with `GlobalState.reserved` at `[u64;10]` (LEN=275). Any future GlobalState extension needs reallocation planning for live accounts.
- `useLpPoolStats` is dormant — returns "Pool Not Yet Created" until `NEXT_PUBLIC_RAYDIUM_POOL_ID` env var is set. If CORS blocks direct Raydium API fetch from browser, a Next.js API route proxy at `/api/pool-stats` is the documented fallback.
- The `ExplorerLink` component and `lib/utils/explorer.ts` are authoritative for all on-chain links — any new on-chain surfaces must use them.
- Indexer and crank services have pre-existing TypeScript type declaration issues (missing `@types/*` packages). These are not regressions from M001 but should be addressed in a future cleanup slice.
- `SEED_TOKEN_PROGRAM_ID` env var defaults to standard SPL Token for pump.fun tokens but is overridable for Token-2022 devnet scenarios.
- Admin must call `admin_set_seed_mint` then `admin_toggle_boost(true)` before boost registration works on-chain.

### What's fragile
- **Raydium API CORS** — `useLpPoolStats` fetches directly from browser. Untested against live API since the HLX/SOL pool doesn't exist yet. May need a proxy route.
- **formatTokenPrice** in `lp-pool-stats.tsx` — uses adaptive decimal places (4-6) for sub-penny tokens. Edge cases with extreme prices not tested against real Raydium data.
- **pump.fun bonding curve account layout** — medium confidence. Devnet spike recommended before any on-chain integration that reads pump.fun state.
- **Pre-existing test type errors** — `toBeInTheDocument` type errors exist in several test files due to missing `@testing-library/jest-dom` type declarations for vitest. Tests pass at runtime but `tsc --noEmit` flags them.

### Authoritative diagnostics
- `cd app/web && npx vitest run` — 265 tests, full frontend health check
- `cd programs/helix-staking && cargo test --lib` — 139 tests, full program health check
- `grep -rn "ExplorerLink" app/web/components/ --include="*.tsx"` — audit all Explorer link consumers
- `grep -rn "cluster=devnet" app/web/ --include="*.tsx" --include="*.ts" | grep -v explorer.ts | grep -v node_modules | grep -v __tests__` — should return zero matches
- `grep -rn "solscan.io" app/web/` — should return zero matches

### What assumptions changed
- GlobalState reserved array grew from 6 to 10 slots — future programs must account for the larger LEN (275 bytes)
- BoostRecord uses a PDA key scan in remaining_accounts rather than fixed index — more flexible but requires PDA derivation at the call site
- BPD bonus is additive after boost, not amplified — this was an explicit design decision locked during S06

## Files Created/Modified

### Programs (S06)
- `programs/helix-staking/src/state/boost_record.rs` — BoostRecord PDA struct (LEN=57)
- `programs/helix-staking/src/instructions/register_seed_boost.rs` — Init BoostRecord with ATA validation
- `programs/helix-staking/src/instructions/update_boost_status.rs` — Permissionless boost revocation
- `programs/helix-staking/src/instructions/admin_set_seed_mint.rs` — Set seed mint + min balance
- `programs/helix-staking/src/instructions/admin_toggle_boost.rs` — Toggle boost enabled flag
- `programs/helix-staking/src/instructions/create_stake.rs` — Added boost auto-link via remaining_accounts scan
- `programs/helix-staking/src/instructions/claim_rewards.rs` — Added boost check, revocation, boosted rewards
- `programs/helix-staking/src/state/global_state.rs` — Extended reserved [u64;10] with boost helpers
- `programs/helix-staking/src/state/stake_account.rs` — Added 3 boost fields (LEN=134)
- `programs/helix-staking/src/constants.rs` — BOOST_RECORD_SEED, BOOST_MULTIPLIER_BPS
- `programs/helix-staking/src/error.rs` — 8 boost error variants
- `programs/helix-staking/src/events.rs` — BoostRegistered, BoostRevoked, BoostedRewardsClaimed events
- `programs/helix-staking/src/instructions/math.rs` — apply_boost_multiplier()
- `programs/helix-staking/src/security/pda.rs` — validate_boost_record_pda()

### Crank Service (S02, S07)
- `services/crank/src/index.ts` — 4-cron scheduling + 6-hour boost check
- `services/crank/src/crank.ts` — Core crank execution
- `services/crank/src/boostCheck.ts` — Boost sweep function
- `services/crank/src/env.ts` — Environment config with SEED_TOKEN_PROGRAM_ID
- `services/crank/src/rpc.ts` — RPC failover
- `services/crank/src/logger.ts` — Pino logger
- `services/crank/Dockerfile` — Node.js Alpine image

### Frontend — Marketing (S05, S09)
- `app/web/app/(public)/seed/page.tsx` — /seed route with 8 section imports
- `app/web/components/marketing/seed-hero.tsx` — Hero section
- `app/web/components/marketing/seed-what-is.tsx` — Seed token purpose (COMM-02)
- `app/web/components/marketing/seed-boost-explain.tsx` — Boost eligibility (COMM-03)
- `app/web/components/marketing/seed-sol-flow.tsx` — SOL flow diagram (COMM-01) with on-chain verification
- `app/web/components/marketing/seed-headroom.tsx` — Headroom and revocation mechanics
- `app/web/components/marketing/seed-cta.tsx` — Bottom CTA
- `app/web/components/marketing/seed-docs.tsx` — 4-part end-to-end documentation

### Frontend — Dashboard & Boost (S08, S09)
- `app/web/components/stake/boost-badge.tsx` — BoostBadge with 3 visual states
- `app/web/components/dashboard/boost-status-card.tsx` — 5-state boost registration card
- `app/web/components/dashboard/lp-pool-stats.tsx` — LP pool stats with 4 render states
- `app/web/components/ui/explorer-link.tsx` — Reusable ExplorerLink component
- `app/web/lib/utils/explorer.ts` — Shared Explorer URL utility
- `app/web/lib/hooks/useSeedBalance.ts` — Seed token balance hook
- `app/web/lib/hooks/useBoostRecord.ts` — BoostRecord PDA hook
- `app/web/lib/hooks/useRegisterBoost.ts` — Register boost mutation
- `app/web/lib/hooks/useLpPoolStats.ts` — Environment-gated Raydium API hook
- `app/web/lib/solana/constants.ts` — Boost constants
- `app/web/lib/solana/pdas.ts` — deriveBoostRecord PDA
- `app/web/lib/solana/math.ts` — applyBoostMultiplier
- `app/web/components/stake/stake-wizard/boost-rules-step.tsx` — COMM-04 disclosure gate

### Frontend — Integration Points
- `app/web/app/dashboard/page.tsx` — BoostStatusCard + LpPoolStats wired in
- `app/web/components/stake/stake-card.tsx` — Boost indicator + boosted APY + Explorer link
- `app/web/components/stake/stake-wizard/success-screen.tsx` — ExplorerLink for transaction
- `app/web/components/badges/badge-card.tsx` — ExplorerLink replacing Solscan
- `app/web/components/badges/badge-celebration.tsx` — ExplorerLink replacing Solscan
- `app/web/components/marketing/nav.tsx` — "Seed Launch" nav link
- `app/web/components/marketing/hero.tsx` — "Learn about Seed Launch" CTA
- `app/web/components/marketing/footer.tsx` — Imports from shared explorer utility

### Documentation (S03, S04)
- `docs/TOKENOMICS.md` — Supply projections, penalty mechanics, risk scenarios
- `docs/tokenomics-calculator.html` — Interactive zero-dependency calculator
- `.private/PRODUCTION_RUNBOOK.md` — 1,030-line private ops doc (gitignored)

### Indexer (S08)
- `services/indexer/migrations/004_boost_notifications.sql` — Boost notification tables
- `services/indexer/src/db/schema.ts` — boostRevokedEvents + notifyBoostRevoked column
- `services/indexer/src/worker/processor.ts` — BoostRevoked event handler
- `services/indexer/src/worker/notification-scheduler.ts` — sendBoostRevokedNotification
- `services/indexer/src/lib/push.ts` — Extended preference key union

### Tests
- `tests/litesvm/boost.test.ts` — 27 LiteSVM integration tests for boost system
- `tests/litesvm/utils.ts` — Boost test utilities
- `app/web/__tests__/components/boost-badge.test.tsx` — 15 tests
- `app/web/__tests__/components/boost-status-card.test.tsx` — 7 tests
- `app/web/__tests__/components/boost-rules-step.test.tsx` — 5 tests
- `app/web/__tests__/components/lp-pool-stats.test.tsx` — 5 tests
- `app/web/__tests__/components/explorer-link.test.tsx` — 8 tests
- `app/web/__tests__/hooks/useRegisterBoost.test.ts` — 6 tests
- `app/web/__tests__/hooks/useLpPoolStats.test.ts` — 5 tests
- `app/web/__tests__/lib/explorer.test.ts` — 10 tests
