# Roadmap: HELIX

## Overview

HELIX is a HEX-style staking protocol on Solana delivering the complete stake-lock-earn lifecycle: free token claim from a SOL snapshot, time-locked staking with T-share rewards, bonus curves, penalty enforcement, Big Pay Day, and a full analytics dashboard with Jupiter swap integration. The build follows the critical path through the Anchor program (Phases 1-3), then layers on frontend (Phase 4), indexer infrastructure (Phase 5), rich analytics (Phase 6), public-facing content (Phase 7), and a testing/audit gate before mainnet launch (Phase 8).

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Foundation and Token Infrastructure** - Anchor scaffold, Token-2022 mint, GlobalState, dev environment
- [x] **Phase 2: Core Staking Mechanics** - Stake/unstake lifecycle, T-share math, penalties, inflation, share rate
- [x] **Phase 2.1: Critical Math Fixes** - Expert board fixes: precision bugs, BPB bonus, admin_mint security (INSERTED)
- [ ] **Phase 3: Free Claim and Big Pay Day** - Merkle-based token claim, unclaimed token distribution to stakers
- [ ] **Phase 4: Staking Dashboard** - Next.js app with wallet connection, stake management, penalty calculator
- [ ] **Phase 5: Light Indexer Service** - Event polling, Postgres storage, read-only REST API for historical data
- [ ] **Phase 6: Analytics and Jupiter Integration** - Rich charts, supply breakdown, APY estimator, swap widget
- [ ] **Phase 7: Leaderboard and Marketing Site** - Whale tracker, leaderboard pages, marketing/landing site, economics explainer
- [ ] **Phase 8: Testing, Audit, and Mainnet Launch** - Comprehensive tests, devnet validation, security audit, mainnet deployment

## Phase Details

### Phase 1: Foundation and Token Infrastructure
**Goal**: The project skeleton exists with a deployable Anchor program, a Token-2022 mint under PDA authority, and a working local test environment
**Depends on**: Nothing (first phase)
**Requirements**: TOKEN-01
**Success Criteria** (what must be TRUE):
  1. Anchor program builds, deploys to localnet, and passes a smoke test
  2. Token-2022 mint exists with PDA mint authority, metadata extension, and 8 decimals
  3. GlobalState PDA is initialized with protocol parameters (inflation rate, claim period config, share rate)
  4. Bankrun test suite runs with time manipulation (clock mocking) and confirms account creation
**Plans**: 2 plans in 2 waves

Plans:
- [x] 01-01-PLAN.md -- Anchor scaffold, constants/errors/events, GlobalState PDA, Token-2022 mint with metadata extension
- [x] 01-02-PLAN.md -- Bankrun test suite: initialization tests, clock mocking, double-init rejection

### Phase 2: Core Staking Mechanics
**Goal**: Users can stake tokens for a chosen duration, earn T-shares with bonus curves, receive inflation rewards, and unstake with correct penalty enforcement -- the complete on-chain staking lifecycle
**Depends on**: Phase 1
**Requirements**: STAKE-01, STAKE-02, STAKE-03, STAKE-04, STAKE-05, STAKE-06, STAKE-07
**Success Criteria** (what must be TRUE):
  1. User can create a stake for 1-5555 days and receive T-shares reflecting both Longer Pays Better and Bigger Pays Better bonuses
  2. User who unstakes early loses tokens proportional to time not served (minimum 50% penalty)
  3. User who unstakes after the 14-day grace period loses tokens on a linear decay (100% loss after 365 days late)
  4. Permissionless crank distributes daily inflation (3.69% annual) proportionally to all active T-share holders
  5. Share rate increases after each distribution day, making future stakes cost more per T-share
**Plans**: 4 plans in 4 waves

Plans:
- [x] 02-01-PLAN.md -- StakeAccount PDA, math module (bonus curves, penalties, reward helpers), expanded constants/errors/events
- [x] 02-02-PLAN.md -- create_stake + crank_distribution instructions
- [x] 02-03-PLAN.md -- unstake + claim_rewards instructions
- [x] 02-04-PLAN.md -- Bankrun test suite for all staking operations (35 tests)

### Phase 2.1: Critical Math Fixes (INSERTED)
**Goal**: Fix all critical precision, overflow, and security issues identified by the expert board before proceeding to Phase 3
**Depends on**: Phase 2
**Requirements**: STAKE-02, STAKE-05 (corrections to existing implementation)
**Success Criteria** (what must be TRUE):
  1. BPB bonus returns correct 0-100% range (not capped at 10%)
  2. All reward/inflation calculations use u128 intermediates to prevent overflow
  3. Division happens AFTER multiplication in all financial math (precision preservation)
  4. `admin_mint` emits `AdminMinted` event with cap enforcement
  5. `calculate_pending_rewards` uses single-division pattern (subtract raw, divide once)
  6. Penalties round UP (protocol-favorable) and redistribute to stakers
  7. Late penalty hits exactly 100% at day 365
  8. All 35+ tests pass after fixes
**Plans**: 1 plan in 1 wave

Plans:
- [x] 02.1-01-PLAN.md -- Math fixes: mul_div helper, BPB cap, penalty rounding, late timing, reward precision, penalty redistribution, admin_mint event/cap

### Phase 3: Free Claim and Big Pay Day
**Goal**: SOL holders can claim free HELIX tokens proportional to their snapshot balance, and unclaimed tokens are distributed to active stakers on Big Pay Day
**Depends on**: Phase 2
**Requirements**: CLAIM-01, CLAIM-02
**Success Criteria** (what must be TRUE):
  1. User with SOL in the snapshot can submit a Merkle proof and receive HELIX tokens proportional to their balance
  2. Each address can claim exactly once (double-claim attempts are rejected)
  3. After the claim period ends, Big Pay Day distributes all unclaimed tokens proportionally to active T-share holders
**Plans**: TBD

Plans:
- [ ] 03-01: TBD
- [ ] 03-02: TBD

### Phase 4: Staking Dashboard
**Goal**: Users can connect a Solana wallet and perform all staking operations through a web interface, reading state directly from the chain
**Depends on**: Phase 3
**Requirements**: DASH-01
**Success Criteria** (what must be TRUE):
  1. User can connect a Solana wallet (Phantom, Solflare, Backpack) and see their token balance
  2. User can create a new stake by choosing amount and duration, and the transaction succeeds on-chain
  3. User can view all their active stakes with remaining days, T-share count, and accrued rewards
  4. User can end a stake (early, on-time, or late) and the penalty calculator shows the exact penalty before confirming
**Plans**: TBD

Plans:
- [ ] 04-01: TBD
- [ ] 04-02: TBD

### Phase 5: Light Indexer Service
**Goal**: A background service continuously indexes on-chain program events into Postgres and serves historical data through a read-only REST API
**Depends on**: Phase 3 (needs deployed program with events to index)
**Requirements**: INDX-01
**Success Criteria** (what must be TRUE):
  1. Indexer polls program events and stores stake/unstake/claim/distribution records in Postgres
  2. REST API serves historical data: daily distribution amounts, T-share price over time, aggregate stats
  3. Indexer recovers from downtime by resuming from its last checkpoint without missing or duplicating events
**Plans**: TBD

Plans:
- [ ] 05-01: TBD
- [ ] 05-02: TBD

### Phase 6: Analytics and Jupiter Integration
**Goal**: The dashboard displays rich historical analytics powered by the indexer and users can trade HELIX tokens via an embedded Jupiter swap widget
**Depends on**: Phase 4, Phase 5
**Requirements**: DASH-02, DASH-04
**Success Criteria** (what must be TRUE):
  1. User can view T-share price history chart with selectable timeframes (1d, 7d, 30d, all)
  2. User can view daily payout history, supply breakdown (staked vs. liquid vs. unclaimed), and stake distribution histogram
  3. User can swap SOL/HELIX tokens through an embedded Jupiter widget without leaving the dashboard
**Plans**: TBD

Plans:
- [ ] 06-01: TBD
- [ ] 06-02: TBD

### Phase 7: Leaderboard and Marketing Site
**Goal**: A public-facing marketing site explains the protocol and attracts participants, while the leaderboard and whale tracker showcase top stakers
**Depends on**: Phase 5 (leaderboard needs indexed data)
**Requirements**: DASH-03, SITE-01
**Success Criteria** (what must be TRUE):
  1. Leaderboard page shows top stakers ranked by T-shares, stake size, and stake duration
  2. Whale tracker displays large stake movements (new large stakes, large unstakes)
  3. Marketing site explains HELIX mechanics (staking, T-shares, bonuses, penalties, Big Pay Day) with clear visuals
  4. Marketing site is SSR-rendered and loads fast for SEO and first-time visitors
**Plans**: TBD

Plans:
- [ ] 07-01: TBD
- [ ] 07-02: TBD

### Phase 8: Testing, Audit, and Mainnet Launch
**Goal**: The protocol is comprehensively tested, security-audited, validated on devnet with real usage patterns, and deployed to mainnet with proper upgrade authority management
**Depends on**: All previous phases
**Requirements**: DEPL-01
**Success Criteria** (what must be TRUE):
  1. Full Bankrun test suite covers all staking paths: create, early unstake, on-time unstake, late unstake, claim, Big Pay Day, crank distribution
  2. Devnet deployment runs for a multi-day test period with simulated stakes, claims, and distributions producing correct results
  3. Security audit (self-review or third-party) has been completed with all critical findings addressed
  4. Mainnet program is deployed with upgrade authority under a multisig (Squads Protocol)
  5. Indexer, frontend, and program are all running on mainnet and the full user flow works end-to-end
**Plans**: TBD

Plans:
- [ ] 08-01: TBD
- [ ] 08-02: TBD
- [ ] 08-03: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 1 -> 2 -> 3 -> 4 -> 5 -> 6 -> 7 -> 8

Note: Phase 5 (Indexer) can overlap with Phase 4 (Dashboard) development since it depends on Phase 3, not Phase 4. Phase 7 (Leaderboard/Marketing) can overlap with Phase 6 (Analytics) since both depend on Phase 5.

| Phase | Plans Complete | Status | Completed |
|-------|---------------|--------|-----------|
| 1. Foundation and Token Infrastructure | 2/2 | Complete | 2026-02-07 |
| 2. Core Staking Mechanics | 4/4 | Complete | 2026-02-07 |
| 2.1. Critical Math Fixes | 1/1 | Complete | 2026-02-07 |
| 3. Free Claim and Big Pay Day | 0/TBD | Not started | - |
| 4. Staking Dashboard | 0/TBD | Not started | - |
| 5. Light Indexer Service | 0/TBD | Not started | - |
| 6. Analytics and Jupiter Integration | 0/TBD | Not started | - |
| 7. Leaderboard and Marketing Site | 0/TBD | Not started | - |
| 8. Testing, Audit, and Mainnet Launch | 0/TBD | Not started | - |
