---
gsd_state_version: 1.0
milestone: v1.1
milestone_name: Growth, Polish & Quality
status: unknown
last_updated: "2026-03-02T23:12:34.440Z"
progress:
  total_phases: 20
  completed_phases: 18
  total_plans: 77
  completed_plans: 69
---

# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-03-02)

**Core value:** Users can stake tokens for a chosen duration, earn T-shares proportional to their commitment, and receive daily inflation rewards -- the complete stake-lock-earn lifecycle must work trustlessly on-chain.
**Current focus:** Phase 13 - Testing, Audit & Mainnet Launch

## Current Position

Phase: 13 of 13 (Testing, Audit & Mainnet Launch) — IN PROGRESS
Plan: 6 of 6 complete
Status: Phase 13 P06/13-01 COMPLETE — anchor-litesvm migration, 165/165 tests passing
Last activity: 2026-03-02 — Phase 13 13-01 COMPLETE: migrated 165 tests from anchor-bankrun to anchor-litesvm; fixed 7 root-cause issues (Ed25519 format, blockhash expiry, payer airdrop, init_slot, unstake assertions)

Progress (v1.1): [██████████] 100%

## Performance Metrics

**Velocity (v1.0 history):**
- Total plans completed: 40
- Average duration: ~8.5 min
- Total execution time: ~5h 40min

**By Phase (v1.0):**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| 1-3.3 | 16 | ~2h 25min | ~9min |
| 4-7 | 14 | ~94min | ~6.7min |
| 8-8.2 | 10 | ~65min | ~6.5min |

**Recent Trend:**
- Phase 8.2 complete (5/5 plans), Phase 08-04 devnet checkpoint awaiting human-verify
- v1.1 roadmap defined — ready for Phase 9 planning
| Phase 09 P02 | 8 | 2 tasks | 2 files |
| Phase 09-frontend-polish P01 | 12 | 2 tasks | 3 files |
| Phase 09.1 P01 | 10 | 3 tasks | 7 files |
| Phase 09.1 P02 | 8 | 2 tasks | 5 files |
| Phase 09.1 P03 | 7 | 2 tasks | 6 files |
| Phase 09.1 P04 | ~20 | 2 tasks | 2 files |
| Phase 10 P01 | 35 | 2 tasks | 10 files |
| Phase 10 P03 | 2 | 2 tasks | 5 files |
| Phase 10 P04 | 4 | 2 tasks | 10 files |
| Phase 11-nft-badges P01 | 2 | 2 tasks | 5 files |
| Phase 11-nft-badges P02 | 4 | 2 tasks | 6 files |
| Phase 12-push-notifications P01 | 7 | 2 tasks | 7 files |
| Phase 12-push-notifications P02 | 2 | 2 tasks | 7 files |
| Phase 12-push-notifications P04 | 2 | 2 tasks | 4 files |
| Phase 12 P03 | 8 | 2 tasks | 3 files |
| Phase 13-test-coverage P03 | 9 | 2 tasks | 19 files |
| Phase 13-test-coverage P04 | 14 | 2 tasks | 21 files |
| Phase 13-test-coverage P02 | 45 | 2 tasks | 21 files |
| Phase 13-test-coverage P06 | 2 | 2 tasks | 2 files |
| Phase 14-deployment-docs-and-env-guards P01 | 2 | 2 tasks | 3 files |

## Accumulated Context

### Decisions

Decisions are logged in PROJECT.md Key Decisions table.
Recent decisions affecting v1.1 work:

- [Phase 8.1]: ClaimConfig expanded to 200 bytes — bpdFinalizeStartTimestamp (i64) and bpdOriginalUnclaimed (u64) added — IDL must be regenerated as Phase 9 first task
- [Phase 8.1]: Duration loyalty multiplier applied at claim/unstake time (not at stake creation) — frontend must call applyLoyaltyMultiplier in reward preview
- [Phase 8.2]: reserved[1] used for is_paused flag in GlobalState — frontend reads this field for paused banner
- [v1.1 research]: Bubblegum V2 mandatory for soulbound badges (not V1, not Metaplex Core)
- [v1.1 research]: ReferralRecord must be a separate PDA (seeds: [b"referral", stake_id]) — StakeAccount must stay at 117 bytes to not break existing accounts
- [v1.1 research]: anchor-bankrun deprecated March 2025 — migrate to anchor-litesvm in Phase 13
- [v1.1 research]: VAPID keys must be stored in secrets manager from day one — loss invalidates all push subscriptions permanently
- [Phase 09]: PenaltyCalculator derives committedDays from (endSlot-startSlot)/slotsPerDay since stakeDays is not a prop; loyaltyBonus placed before penalty state branch for reuse
- [Phase 09]: BPD bonus unmodified in loyalty multiplier wiring — only pendingRewards receives applyLoyaltyMultiplier per Phase 8.1 design
- [Phase 09-03]: ProtocolPausedBanner is a standalone presentational component accepting isPaused prop — keeps reusable and testable separately from data fetching
- [Phase 09-frontend-polish]: JSON IDL fields use snake_case (bpd_finalize_start_timestamp) while program.ts uses camelCase — consistent with existing file conventions
- [Phase 09-frontend-polish]: observation_window phase gated on bpdFinalizeStartTimestamp.isZero() — zero means seal not yet executed, non-zero means seal_bpd_finalize has been called
- [Phase 09.1]: adminSetBpdFinalizeTimestamp is authority-gated and safe to ship in devnet IDL — bypasses 86400s wall-clock seal guard for local testing
- [Phase 09.1]: skipPreflight=true required for admin Clock-reading instructions on local test validator (Anchor 0.31/0.32.1 mismatch + local preflight quirk)
- [Phase 09.1]: adminSetClaimEndSlot floor guard requires new_end_slot >= current_slot + slots_per_day; set to current+spd+5 then wait for slots to advance
- [Phase 09.1]: adminSetBpdFinalizeTimestamp is authority-gated and safe to ship in devnet IDL
- [Phase 09.1]: skipPreflight=true required for admin Clock-reading instructions on local test validator
- [Phase 09.1]: adminSetClaimEndSlot floor guard: set new_end_slot to current+slots_per_day+5 then wait for expiry
- [Phase 09.1]: TEST_WALLET_SECRET (server-only) replaces NEXT_PUBLIC_TEST_WALLET_SECRET — secret key no longer in client JS bundle (F-01 complete)
- [Phase 09.1]: global-setup.ts loads docker/test-wallet.json as admin (GlobalState authority); skips initialize() when GlobalState already exists from bootstrap.ts
- [Phase 09.1]: No PID file written in global-setup — Docker validator lifecycle not managed by Playwright
- [Phase 09.1]: @neondatabase/serverless Pool uses WebSocket proxy incompatible with local Docker Postgres — switched db/client.ts to pg + drizzle-orm/node-postgres
- [Phase 09.1]: claim-rewards spec failure expected: freshly-created stake (0 days elapsed) has no claimable rewards; on-chain rewardDebt matches post-BPD share rate
- [Phase 09.1]: bpd-status.tsx must use useCurrentSlot() not globalState.currentDay for claim period end check — currentDay only updates when crank_distribution runs
- [Phase 10]: IDL uses snake_case naming (create_stake_with_referral) per Anchor 0.32.x — consistent with all existing instructions
- [Phase 10]: referrer_token_account.owner == referrer constraint added for security in create_stake_with_referral
- [Phase 10.02]: Tests use SystemProgram.transfer to fund generated keypairs — Bankrun test keypairs start with 0 lamports; must explicitly transfer SOL from payer before keypair can pay for account creation
- [Phase 10.02]: findReferralRecordPDA added to main utils.ts (not phase-specific) — keeps PDA derivation consistent with how findStakePDA is organized
- [Phase 10]: referrer_token_bonus stored as TEXT for arbitrary precision, consistent with all other amount columns
- [Phase 10]: sum() null result coalesced to '0' string in /api/referrals response
- [Phase 10]: useCreateStakeWithReferral pre-checks referrer ATA existence before transaction to give clear error if referral link is invalid
- [Phase 10]: Invalid ?ref= pubkeys silently ignored (setReferrer(null)) — falls back to normal stake flow without UX disruption
- [Phase 10]: Both mutation hooks always instantiated in ConfirmStep; conditional call in handleConfirm to comply with React hooks rules
- [Phase 11-nft-badges]: 365_day eligibility joins stakeEndedEvents+stakeCreatedEvents on stakeId+user — stakeId is per-user scoped not globally unique
- [Phase 11-nft-badges]: BPD eligibility: check if user had stake with slot < any BPD event slot — simplified approach sufficient for devnet
- [Phase 11-nft-badges]: Tier badge thresholds stored as base-unit strings; BigInt comparison used to avoid floating point precision loss
- [Phase 11-nft-badges]: Server acts as fee payer + collectionAuthority, mints directly to leafOwner wallet — simpler than partial co-signing since server validates eligibility first
- [Phase 11-nft-badges]: PermanentFreezeDelegate authority:None at collection creation — irrevocable soulbound status satisfying BADGE-07 permanently
- [Phase 11-nft-badges]: DAS retry loop (5 attempts, 2s delay) between mintV2 and setNonTransferableV2 handles variable DAS indexing lag
- [Phase 11-nft-badges P03]: BadgeMiniStrip returns null (not empty card) when no earned badges — avoids visual noise on fresh wallets
- [Phase 11-nft-badges P03]: useBadges hook treats non-OK /api/badges/claimed response as safe fallback (all unclaimed) — Plan 04 creates the endpoint
- [Phase 11-nft-badges P04]: GET /api/badges/claimed returns graceful empty-array fallback on DAS error — mint API is the authoritative duplicate-check gate
- [Phase 11-nft-badges P04]: useClaimBadge requires no user signature — server is fee payer + collection authority (consistent with P02 design)
- [Phase 11-nft-badges P04]: BadgeGallery manages dialog+celebration state at gallery level — keeps claim flow encapsulated
- [Phase 12-push-notifications]: VAPID keys optional in env — indexer starts without push configured, logs warning
- [Phase 12-push-notifications]: dispatchToSubscribers auto-deletes expired (410/404) subscriptions inline — no separate cleanup job
- [Phase 12-push-notifications]: notificationState unique index (wallet, stakeId, eventType) prevents duplicate notifications across restarts
- [Phase 12-push-notifications]: urlBase64ToUint8Array returns ArrayBuffer not Uint8Array to satisfy TypeScript strict PushSubscriptionOptionsInit.applicationServerKey type
- [Phase 12-push-notifications]: PNG icons generated programmatically via Node.js zlib — no external deps, solid purple #7c3aed placeholder squares, user can replace with branded assets
- [Phase 12-push-notifications]: Custom inline toggle switch (bg-helix-600 on / bg-zinc-700 off) used since no shadcn Switch component available in project
- [Phase 12-push-notifications]: Preference toggles use optimistic update pattern — local state updated immediately, API call made async, reverting on error with toast
- [Phase 12]: Raw SQL via db.execute() used for LEFT JOIN deduplication queries — Drizzle ORM LEFT JOIN does not easily express IS NULL anti-join pattern
- [Phase 12]: slotsPerDay cached at module level after first DB fetch to avoid repeated queries on every 15-min scheduler tick
- [Phase 12]: __global__ sentinel wallet used in notificationState for BPD seal_complete global deduplication across finalization cycles
- [Phase 13-test-coverage]: Infrastructure files (lib/env.ts, lib/logger.ts, lib/rpc.ts, lib/anchor.ts, db/client.ts, types/, api/middleware/rate-limit.ts) excluded from indexer coverage thresholds — config/infra with no testable business logic
- [Phase 13-test-coverage P05]: playwright.config.ts reuseExistingServer changed to !process.env.CI — allows local dev server reuse in non-CI environments
- [Phase 13-test-coverage P05]: Dedicated referrer keypair created in global-setup each run (pubkey written to e2e/.referrer-pubkey.txt) — admin wallet IS the connected browser wallet in reused-server mode, causing SelfReferral if used as referrer
- [Phase 13-test-coverage P05]: Referral transaction test gated on REFERRAL_PROGRAM_READY — deployed Docker program is pre-Phase 10, returns InstructionFallbackNotFound (Custom: 101) for create_stake_with_referral
- [Phase 13-test-coverage P05]: getByText() is case-insensitive partial match — "Daily Distribution" matched paragraph containing "daily distributions"; fixed with getByRole("heading", { exact: true })
- [Phase 13-test-coverage P05]: BPD E2E flow split into 3 separately-gated phases (BPD_FLOW_READY / BPD_SEAL_READY / BPD_DISTRIBUTE_READY) for granular enablement
- [Phase 13-test-coverage]: @vitest/coverage-v8 pinned to 3.0.5 to match vitest@3.0.5 peer dep — v4.x conflicts; poller tests use system program address (11111111111111111111111111111111) as valid Solana PublicKey
- [Phase 13-test-coverage]: [Phase 13-04]: pdas.test.ts uses @vitest-environment node — PublicKey.findProgramAddressSync requires Node.js crypto which jsdom does not provide
- [Phase 13-test-coverage]: [Phase 13-04]: Coverage scoped to specific testable files — async Server Components and tx mutation hooks excluded; covered by Playwright E2E
- [Phase 13-test-coverage]: [Phase 13-04]: vi.hoisted() required for mock functions needing mockReturnValueOnce — vi.mock factories hoisted before const declarations
- [Phase 13-test-coverage 13-01]: anchor-bankrun/solana-bankrun replaced with litesvm@0.6.0 + anchor-litesvm@0.2.1 (deprecated March 2025)
- [Phase 13-test-coverage 13-01]: setupTest() is synchronous — fromWorkspace() is sync unlike startAnchor(); remove await from all setupTest() calls
- [Phase 13-test-coverage 13-01]: client.expireBlockhash() must be called between sequential identical transactions — litesvm does NOT auto-rotate blockhash like bankrun does
- [Phase 13-test-coverage 13-01]: Ed25519 instruction_index fields must be 0xFFFF (this-instruction sentinel), NOT sigLen=64 or pkLen=32
- [Phase 13-test-coverage 13-01]: client.withPrecompiles() required for Ed25519/Secp256k1 support in litesvm
- [Phase 13-test-coverage 13-01]: unstake returns stakeAmount + inflation rewards — assertions must use gte() not exact equality
- [Phase 13-test-coverage]: apply_loyalty_multiplier extracted as testable function in unstake.rs and claim_rewards.rs — reduces duplication and enables unit testing
- [Phase 13-test-coverage]: Overall 80% line coverage not achievable from unit tests — Anchor macro expansion generates uncoverable boilerplate; 165 litesvm integration tests cover handler paths; math.rs (pure logic) at 99.08%
- [Phase 13-test-coverage]: Badge transaction tests gated on BADGE_MINT_READY — Bubblegum V2 collection + DAS indexer not available in default Docker localnet
- [Phase 13-test-coverage]: ROADMAP SC-2 architectural ceiling (53% cargo-llvm-cov + 165 integration tests) already reflected from prior partial run
- [Phase 14-deployment-docs-and-env-guards]: Runtime env guards placed inside POST handler (not module level) prevents badge mint crash at module load when env vars unset — ENV-02 fix
- [Phase 14-deployment-docs-and-env-guards]: NEXT_PUBLIC_INDEXER_URL falls back to localhost:3001 via nullish coalescing — feature degrades gracefully in dev, closes ENV-03
- [Phase 14-deployment-docs-and-env-guards]: Badge collection misconfiguration returns 503 (Service Unavailable) not 500 — semantically correct: server running but feature not configured

### Roadmap Evolution

- Phase 09.1 inserted after Phase 9: full devnet deployment and end to end testing (URGENT)

### Pending Todos

- Phase 8.2 COMPLETE (operational hardening -- 5/5 plans done)
- Phase 08-04 COMPLETE: devnet deployed and validated (all 5 lifecycle steps confirmed)
- Phase 08-05 DEFERRED: mainnet deployment deferred by user decision — all prerequisites met, awaiting Squads multisig setup and go/no-go decision
- v1.1 Phase 9 COMPLETE (3/3 plans done)
- Phase 09.1 P01 COMPLETE: localnet validator running, all 3 lifecycle scripts pass, BPD end-to-end verified
- Phase 09.1 P02 COMPLETE: server-side test wallet API route, providers.tsx TestWalletAdapter wiring, Docker-aware Playwright global-setup
- Phase 09.1 P03 COMPLETE: indexer configured for localhost:8899 (pg driver), DB schema applied, 28/29 Playwright E2E pass
- Phase 09.1 P04 COMPLETE: visual verification 5/6 PASS (1 SKIP — loyalty multiplier at Day 0), 2 bugs found and fixed
- Phase 09.1 COMPLETE — full localnet stack validated end-to-end
- Phase 10 P01 COMPLETE: create_stake_with_referral instruction, ReferralRecord PDA, updated IDL (2026-03-02)
- Phase 10 P02 COMPLETE: referral bankrun test suite (6 tests covering +10% T-share bonus, +5% referrer mint, self-referral rejection, duplicate prevention, multi-referrer, ReferralRecord validation) (2026-03-02)
- Phase 10 P03 COMPLETE: referral_staked_events table+migration, ReferralStaked processor case, GET /api/referrals endpoint (2026-03-02)
- Phase 10 P04 COMPLETE: frontend referral integration — referral link copy, ?ref= URL param handling, conditional createStakeWithReferral instruction routing, ReferralStatsPanel with indexer stats (2026-03-02)
- Phase 10 COMPLETE — all 4 plans done (2026-03-02)
- Phase 11 P01 COMPLETE: badge_eligibility table, computeBadgeEligibility, GET /api/badges endpoint (2026-03-02)
- Phase 11 P02 COMPLETE: Metaplex packages installed, badge-types.ts, badge-svg-server.ts, POST /api/badges/mint co-signer route, setup-badge-collection.ts one-time script (2026-03-02)
- Phase 11 P03 COMPLETE: badge gallery UI — useBadges hook, BadgeCard, BadgeGallery, BadgeMiniStrip, /dashboard/badges page, Badges sidebar nav entry, dashboard mini strip (2026-03-02)
- Phase 11 P04 COMPLETE: badge claim flow — GET /api/badges/claimed DAS endpoint, useClaimBadge mutation hook, BadgeClaimDialog preview dialog, BadgeCelebration overlay with confetti + Share on X + auto-dismiss (2026-03-02)
- Phase 11 COMPLETE — all 4 plans done (2026-03-02)
- Phase 12 P01 COMPLETE: pushSubscriptions + notificationState Drizzle tables, 003_push_notifications.sql migration, push.ts dispatch library (VAPID + sendPushNotification + dispatchToSubscribers), 4 push API routes (subscribe/unsubscribe/preferences) registered in Fastify (2026-03-02)
- Phase 12 P03 COMPLETE: notification-scheduler.ts (15-min cron for maturity/late-penalty/seal-complete), sendBpdTransitionNotification + sendRewardsNotification wired into processor.ts as fire-and-forget hooks (2026-03-02)
- Phase 12 P04 COMPLETE: NotificationSettings component (enable/disable push, 4 preference toggles with optimistic updates), PwaInstallPrompt (iOS Add-to-Home-Screen banner), /dashboard/notifications page, Notifications sidebar nav entry with BellIcon (2026-03-02)
- Phase 12 COMPLETE — all 4 plans done (2026-03-02)
- Phase 13 P01 COMPLETE: test infrastructure research and planning (2026-03-02)
- Phase 13 P02 COMPLETE: indexer unit test coverage expansion (2026-03-02)
- Phase 13 P03 COMPLETE: frontend component/hook test coverage (2026-03-02)
- Phase 13 P04 COMPLETE: integration test coverage (2026-03-02)
- Phase 13 P05 COMPLETE: E2E spec expansion — free-claim, on-time-unstake, BPD flow, referral stake (14 pass, 6 skipped with documented preconditions) (2026-03-02)
- Phase 13 P01 (13-01) COMPLETE: anchor-litesvm migration — 165/165 tests pass, no bankrun deps remain (2026-03-02)
- Phase 13 P02 (13-02) COMPLETE: cargo-llvm-cov installed, 120 unit tests added, math.rs 99.08% line coverage, overall 53.12% (Anchor boilerplate limits higher) (2026-03-02)
- Phase 13 COMPLETE — all plans done (2026-03-02)
- Phase 14 P01 COMPLETE: runtime env var guards (ENV-01 VAPID null guard, ENV-02 badge mint module-load safety + 503, ENV-03 indexer localhost fallback), .env.local.example documenting 5 missing deployment vars (2026-03-02)

### Blockers/Concerns

- Phase 8-05 DEFERRED: Mainnet deployment on hold — user must set up Squads v4 multisig, fund deployer wallet (~5 SOL), and obtain Helius mainnet RPC key before re-running 08-05
- Phase 11 (NFT Badges): Research flag from SUMMARY.md — Bubblegum V2 DAS integration and canopyDepth validation should be confirmed during Phase 11 planning (run /gsd:research-phase before plan-phase)

## Session Continuity

Last session: 2026-03-02
Stopped at: Completed 14-01-PLAN.md (env var guards for push notifications + badge mint, .env.local.example docs for 5 missing env vars)
Resume file: None
Next: Phase 14 Plan 01 complete — ENV-01, ENV-02, ENV-03 gaps closed; ready for Phase 14 Plan 02 if it exists
