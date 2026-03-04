# Roadmap: HELIX

## Milestones

- ✅ **v1.1 Protocol + Dashboard** — Phases 1-14 (shipped 2026-02-xx)
- ✅ **v1.2 Animation Polish** — Phases 15-18 (shipped 2026-03-03)
- ✅ **v2.0 Production Readiness** — Phases 19-22 (shipped 2026-03-04)
- 🚧 **v3.0 Seed Launch & LP Funding** — Phases 23-27 (in progress)

## Phases

<details>
<summary>✅ v1.1 Protocol + Dashboard (Phases 1-14) — SHIPPED</summary>

Anchor program, Token-2022 integration, Next.js dashboard, Fastify indexer, NFT badges, push notifications, 622+ passing tests.

</details>

<details>
<summary>✅ v1.2 Animation Polish (Phases 15-18) — SHIPPED 2026-03-03</summary>

Framer Motion with LazyMotion, visual depth overhaul, page transitions, loading/empty/error states, animated stat counters.

</details>

<details>
<summary>✅ v2.0 Production Readiness (Phases 19-22) — SHIPPED 2026-03-04</summary>

- [x] Phase 19: Vercel Build Fix (2/2 plans) — webpack alias, env var docs, Fluid Compute verified
- [x] Phase 20: Automated Crank Service (3/3 plans) — standalone service, Docker integration, RPC failover
- [x] Phase 21: Tokenomics Documentation (3/3 plans) — TOKENOMICS.md, sensitivity analysis, interactive calculator
- [x] Phase 22: Production Runbook (2/2 plans) — 1,030-line private ops doc with key mgmt, deployment, incident response

</details>

### 🚧 v3.0 Seed Launch & LP Funding (In Progress)

**Milestone Goal:** Fund the HLX/SOL liquidity pool through a seed token launch, rewarding early backers with boosted staking APY and building trust through full transparency.

#### Phase Summary

- [x] **Phase 23: Communication & Boost Rules** — Seed launch page messaging and plain-language boost rules live before any staking action (completed 2026-03-04)
- [ ] **Phase 24: Anchor Program Boost System** — On-chain boost registration, snapshot enforcement, reward multiplier, and proactive crank revocation
- [ ] **Phase 25: Crank Boost Monitoring** — Automated 6-hour crank job that proactively revokes boosts when seed balance drops below snapshot
- [ ] **Phase 26: Frontend Boost UI** — Dashboard boost indicator, boosted APY display, wallet registration flow, and revocation push notification
- [ ] **Phase 27: LP Stats, Docs & Transparency** — LP pool stats widget, published end-to-end documentation, SOL flow dashboard, and on-chain Explorer links

## Phase Details

### Phase 23: Communication & Boost Rules
**Goal**: Users understand the seed token's purpose, the LP funding model, and all boost mechanics in plain language before any stake action is taken
**Depends on**: Phase 22 (v2.0 complete — existing deployed site)
**Requirements**: COMM-01, COMM-02, COMM-03, COMM-04
**Success Criteria** (what must be TRUE):
  1. The seed launch page states clearly that creator rewards from the seed token fund the HLX/SOL liquidity pool — the connection between buying seed and funding LP is unmissable
  2. The seed launch page explains what the seed token is and how it relates to HELIX staking — a first-time visitor can answer "why does this token exist?"
  3. The seed launch page explains boost eligibility — a user can read the page and know that holding seed tokens earns a higher APY when staking HLX
  4. Before a user can initiate any stake action, they see a prominent boost rules display covering: snapshot concept, headroom mechanic, permanent revocation on sell, and that buying more seed creates headroom — no stake is submitted without this disclosure
**Plans:** 2/2 plans complete

Plans:
- [x] 23-01-PLAN.md — Seed launch page (/seed) with 6 content sections, nav and landing page links
- [x] 23-02-PLAN.md — Stake wizard boost rules disclosure step with checkbox acknowledgment

### Phase 24: Anchor Program Boost System
**Goal**: The Anchor program enforces boost eligibility, snapshot logic, and reward multiplier entirely on-chain — boost is real (extra tokens minted) and cannot be gamed
**Depends on**: Phase 23
**Requirements**: BOOST-01, BOOST-02, BOOST-03, BOOST-04, BOOST-05, BOOST-06, BOOST-07
**Success Criteria** (what must be TRUE):
  1. An admin can set the seed token mint address in GlobalState via `admin_set_seed_mint` — the program knows which mint to validate against
  2. A user who holds seed tokens can call `register_seed_boost` and receive a BoostRecord PDA that records their seed balance at registration — the ATA address derivation is enforced (non-ATA accounts are rejected)
  3. When a user stakes HLX, the seed token balance is snapshotted in the StakeAccount — `seed_balance_at_stake` is stored and immutable after that point
  4. `claim_rewards` reads the user's current seed ATA balance at call time and only applies the boost multiplier if current balance >= snapshot — a user who sold their seed tokens receives zero boost on that claim, even if they repurchase before calling claim
  5. The boost multiplier actually mints extra HLX tokens — a LiteSVM test confirms `RewardsClaimed.amount` is strictly higher for a seed holder vs an identical non-seed stake
  6. Revocation is permanent per stake — a stake whose boost was revoked (due to sell) cannot have the boost restored by any on-chain action, even after repurchasing seed
**Plans:** 3 plans

Plans:
- [ ] 24-01-PLAN.md — Foundation: state accounts, constants, errors, events, math, admin instructions
- [ ] 24-02-PLAN.md — Registration: register_seed_boost, update_boost_status, create_stake boost auto-link
- [ ] 24-03-PLAN.md — Enforcement: claim_rewards boost check, revocation, complete LiteSVM test suite

### Phase 25: Crank Boost Monitoring
**Goal**: The crank proactively detects and records on-chain boost revocations every 6 hours so the frontend reflects true boost status without waiting for the user to claim
**Depends on**: Phase 24
**Requirements**: BOOST-08
**Success Criteria** (what must be TRUE):
  1. The crank service runs a boost-check job every 6 hours, fetches all active BoostRecord PDAs, reads each user's seed ATA balance, and calls `update_boost_status(false)` for any user whose balance dropped below their snapshot — the on-chain BoostRecord is updated, not just a DB flag
  2. A user who sold their seed tokens sees their boost status updated to "revoked" in the dashboard within 6 hours, without needing to trigger a claim transaction
**Plans**: TBD

### Phase 26: Frontend Boost UI
**Goal**: Users can see their boost status, register for boost via wallet interaction, view their boosted APY, and receive a push notification if their boost is revoked
**Depends on**: Phase 24, Phase 25
**Requirements**: FRONT-01, FRONT-02, FRONT-03, FRONT-04
**Success Criteria** (what must be TRUE):
  1. The staking dashboard shows a boost indicator with three distinct states: eligible (holds seed, not registered), active (registered and boost on-chain), revoked (boost lost due to sell) — each state has a visually distinct label and explanation
  2. When boost is active, the APY display on the dashboard shows the actual multiplied rate (e.g., base × 1.25) — not the base rate
  3. A user with seed tokens can click a button on the dashboard to call `register_seed_boost` on-chain via their connected wallet — the transaction completes and the UI updates to "active" state
  4. A user whose boost is revoked receives a push notification via the existing notification infrastructure — the notification explains what happened and links to the boost rules
**Plans**: TBD

### Phase 27: LP Stats, Docs & Transparency
**Goal**: The LP pool stats are visible on the dashboard, all mechanics are documented end-to-end, every on-chain action links to Solana Explorer, and the SOL flow from seed to LP is publicly verifiable
**Depends on**: Phase 26
**Requirements**: FRONT-05, TRUST-01, TRUST-02, TRUST-03, TRUST-04
**Success Criteria** (what must be TRUE):
  1. A stats widget on the dashboard displays HLX/SOL LP pool TVL, price, and 24h volume — the data is live (not stale cache) and the widget shows a clear "no pool yet" state before the pool is created
  2. Published documentation explains the full seed → boost → LP funding mechanics end-to-end — a skeptical reader can follow the money from "I bought seed tokens" to "HLX/SOL LP is funded" without gaps
  3. Every on-chain action in the UI (boost registration, stake, claim, revocation) has a link to the transaction on Solana Explorer — users can independently verify all state without trusting the dashboard
  4. A SOL flow transparency dashboard shows how seed launch proceeds fund the HLX LP — each on-chain account (creator fee wallet, LP pool) links to Solana Explorer, and the total SOL raised vs LP target is visible
  5. All boost state is readable directly from on-chain BoostRecord PDAs — there is no critical boost state stored only in the indexer DB that users cannot independently verify
**Plans**: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 23 → 24 → 25 → 26 → 27

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|----------------|--------|-----------|
| 1-14. Protocol + Dashboard | v1.1 | All | Complete | 2026-02-xx |
| 15. Animation Infrastructure | v1.2 | 3/3 | Complete | 2026-03-03 |
| 16. Visual Depth | v1.2 | 3/3 | Complete | 2026-03-03 |
| 17. Page Transitions + States | v1.2 | 2/2 | Complete | 2026-03-03 |
| 18. Stat Counters | v1.2 | 2/2 | Complete | 2026-03-03 |
| 19. Vercel Build Fix | v2.0 | 2/2 | Complete | 2026-03-03 |
| 20. Automated Crank Service | v2.0 | 3/3 | Complete | 2026-03-03 |
| 21. Tokenomics Documentation | v2.0 | 3/3 | Complete | 2026-03-03 |
| 22. Production Runbook | v2.0 | 2/2 | Complete | 2026-03-04 |
| 23. Communication & Boost Rules | v3.0 | 2/2 | Complete | 2026-03-04 |
| 24. Anchor Program Boost System | v3.0 | 0/3 | Not started | - |
| 25. Crank Boost Monitoring | v3.0 | 0/TBD | Not started | - |
| 26. Frontend Boost UI | v3.0 | 0/TBD | Not started | - |
| 27. LP Stats, Docs & Transparency | v3.0 | 0/TBD | Not started | - |
