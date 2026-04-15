# Project Research Summary

**Project:** HELIX v3.0 — Seed Token Launch, LP Pool Funding, APY Boost System
**Domain:** Solana DeFi — bonding curve seed launch, Raydium CPMM LP creation, on-chain loyalty boost
**Researched:** 2026-03-04
**Confidence:** MEDIUM-HIGH

## Executive Summary

HELIX v3.0 adds three tightly coupled features on top of an existing Anchor staking protocol: a seed token launched on pump.fun to raise SOL, a manually-created HLX/SOL Raydium CPMM pool funded by that SOL, and an on-chain APY boost for stakers who hold the seed token continuously. These features are sequential in their dependencies — the seed token must graduate the bonding curve before the LP pool can be seeded, and the LP pool address must be known before the boost dashboard tracker is meaningful — which means Phase 1 (Anchor program + seed launch infrastructure) is the critical gate for everything downstream. pump.fun is the correct launchpad: it has dominant market share (50–91%), the highest creator revenue at small-to-mid cap via Project Ascend (0.95% per trade at $88K–$300K market cap), and a 0.5 SOL one-time graduation bonus. Critically, pump.fun now graduates to PumpSwap, NOT Raydium — the HLX/SOL Raydium CPMM pool must be created manually from SOL proceeds (creator fees + graduation bonus), not via automatic graduation routing.

The boost system has a non-obvious design that users must understand before staking: the boost is tied to a snapshot of seed token balance taken at stake time, and the real-time check in `claim_rewards` requires current balance to be at or above that snapshot. Revocation is permanent per stake — selling below the snapshot balance revokes the boost for that stake even if tokens are repurchased later. Buying more seed tokens provides headroom above the snapshot (stake with 1,000, buy 1,000 more, can sell up to 1,000 without triggering revocation). The seed token must stay liquid — no escrow or locking — meaning the APY boost incentive is the only soft-lock mechanism. Enforcement is two-layer: an on-chain check in `claim_rewards` (current balance >= snapshot at stake time) plus a crank running every 6 hours for proactive UI revocation. Clear, upfront communication about boost rules is non-negotiable — users must fully understand how the boost works and how they can lose it before they stake.

The principal technical risks are: (1) HLX Token-2022 extension incompatibility with Raydium CPMM — requires a pre-flight extension and freeze authority audit on devnet before mainnet LP creation; (2) flash loan gaming of the boost if implemented as a write-once flag rather than a real-time balance check at claim time; (3) the crank service breaking after the program upgrade if any new required accounts are added to `CrankDistribution<'info>` — that struct must remain frozen. All three risks have clear mitigations documented in PITFALLS.md. Secondary risk: the pump.fun bonding curve may not graduate (only 1.3% of tokens do) — pre-launch community commitment and transparent messaging about the goal reduce this risk.

---

## Key Findings

### Recommended Stack

The v2.0 stack is unchanged. v3.0 adds two new packages and reuses all existing infrastructure. `@raydium-io/raydium-sdk-v2` (0.2.32-alpha) is the only correct SDK for CPMM pool creation — Raydium SDK v1 does not support CPMM or Token-2022, and Raydium AMM V4 does not support Token-2022 at all. `recharts` (2.15.x) is already bundled with shadcn/ui's chart component and requires no separate install. All pump.fun interaction uses the PumpPortal REST/WebSocket API directly (no npm package) — community pump.fun SDKs are unmaintained and unsafe to use.

**Core technologies:**
- `@raydium-io/raydium-sdk-v2` 0.2.32-alpha — CPMM pool creation for HLX/SOL; the only SDK supporting both CPMM and Token-2022 natively; pool creation costs 0.15 SOL protocol fee
- `pumpportal.fun` REST + WebSocket — pump.fun token creation and bonding curve progress tracking; no npm package, direct HTTP/WS calls only
- `@solana/spl-token` 0.4.9 — read seed token balance from wallet's Token-2022 ATA; likely already installed transitively

**What NOT to add:**
- `@raydium-io/raydium-sdk` (v1, no `-v2`) — deprecated, no CPMM, no Token-2022
- Raydium AMM V4 — does not support Token-2022; HLX pool creation will fail
- Community pump.fun SDKs (`pumpdotfun-sdk`, etc.) — unmaintained, written against stale IDLs
- `@solana/web3.js` v2 / `@solana/kit` — incompatible with Anchor 0.32 TS client; causes crypto primitive conflicts
- `helius-sdk` 2.x — uses `@solana/kit` internally, same conflict

### Expected Features

**Must have (table stakes — v3.0 launch):**
- Seed token launched on pump.fun — the trigger for everything; zero HELIX code required, but creator wallet choice is irreversible
- Seed launch page with live bonding curve progress tracker — users expect real-time progress; missing = product looks unfinished
- HLX/SOL pool created on Raydium CPMM — manual team operation post-graduation; LP tokens burned for trust
- LP pool stats on dashboard (TVL, price, volume via Raydium API v3)
- On-chain boost registration (`register_seed_boost` instruction) — trustless verification that user holds seed tokens at registration
- Boost check in `claim_rewards` — real-time balance check at every claim vs snapshot at stake time; boost multiplier actually mints extra tokens (not just display)
- Boost indicator on dashboard — clear status display with "eligible / active / revoked" states
- "How boost works" documentation — clear rules BEFORE staking: snapshot concept, headroom, permanent revocation, buy-more-for-headroom; must be bulletproof

**Should have (competitive differentiators):**
- "Proceeds fund HLX/SOL LP" narrative prominently on seed launch page — differentiates from pure memecoin
- Boost-lost push notification — uses existing push notification infrastructure; add when balance monitoring is reliable
- "X SOL to LP" transparency dashboard — shows SOL flow from seed launch to LP; links to Solana Explorer for each on-chain account

**Defer (v3.x / v4+):**
- On-chain tiered boost levels — design from real distribution data, not speculation
- Boost leaderboard — add once more than 50 boosted stakers exist
- LP farming incentives — only if TVL stagnates; adds HLX emission complexity
- "Days boosted" streak gamification

**Anti-features (do not build):**
- Token vesting or escrow for seed buyers — kills permissionless ethos; boost is the soft-lock
- Snapshot-based boost (point-in-time only) — gameable; flash loan trivially defeats it
- Boost as write-once flag — same flash loan vulnerability; boost becomes permanent if gamed
- Permanent boost (no loss if sold) — removes the economic incentive to hold; destroys the mechanism

### Architecture Approach

The v3.0 architecture is strictly additive. The Anchor program gains three new instructions (`register_seed_boost`, `update_boost_status`, `admin_set_seed_mint`) and one modification to `claim_rewards` (optional `BoostRecord` PDA account for the boost multiplier). The crank gains a 4th cron job running every 6 hours to check seed ATA balances and revoke boosts on-chain. The indexer gains three new DB tables (`seed_boosts`, `lp_pool_state`, `seed_launch_state`) and three new API routes. The frontend gains a `/seed` page and a `BoostBadge` component on the dashboard. The LP pool is created once manually via a Raydium SDK V2 TypeScript script — it is NOT automated in the Anchor program (CPI into Raydium for a one-time operation is an anti-pattern). On-chain is the source of truth: `BoostRecord.is_active` on the PDA is authoritative; the indexer DB mirrors state for frontend display only.

**Major components:**
1. **Anchor program** — add `BoostRecord` PDA (seeds: `["boost", user]`), `register_seed_boost` instruction, `update_boost_status` instruction, modified `claim_rewards` (optional boost account with snapshot comparison); add `seed_mint` field to `GlobalState` via reserved bytes; keep `CrankDistribution<'info>` account list FROZEN
2. **Crank service** — add `boost-check.ts`: every 6 hours, fetch all active `BoostRecord` PDAs, check each user's seed ATA balance against snapshot, send `update_boost_status(false)` for any that dropped below threshold; this is the proactive revocation layer
3. **Indexer** — add `seed_boosts`, `lp_pool_state`, `seed_launch_state` tables; handle `SeedBoostRegistered` and `SeedBoostLost` events; add pump.fun bonding curve poller (60s interval); add `/boost/:wallet`, `/lp-pool`, `/seed-launch` API routes
4. **Frontend (Next.js)** — add `/seed` page (bonding curve tracker, boost eligibility checker, LP goal progress, boost rules explainer); add `BoostBadge` on dashboard; LP pool stats widget reading from indexer `/lp-pool`; LP pool balance for live display should use direct client-side RPC, not the cached indexer value
5. **Raydium CPMM pool** — one-time manual script using `@raydium-io/raydium-sdk-v2`; requires freeze authority revoked on HLX mint, Token-2022 extension pre-flight, and a delayed `startTime` of 15–30 minutes post-creation to prevent sandwich bots

### Critical Pitfalls

1. **Non-ATA seed token account accepted for boost check** — use `associated_token::mint = seed_mint, associated_token::authority = user` Anchor constraint; this must enforce ATA address derivation, not just mint/owner match; test with a non-ATA account to confirm rejection

2. **Flash loan gaming via write-once boost flag** — never store a `seed_boost_active: bool` flag; check `user_seed_token_account.amount >= snapshot_at_stake_time` inline in `claim_rewards` at every call; the crank asynchronously updates `BoostRecord.is_active` but the live balance check at claim time is the definitive gate

3. **Raydium CPMM rejects HLX due to Token-2022 extension incompatibility** — run `spl-token display <HLX_MINT>` pre-flight; confirm only Transfer Fees, Metadata Pointer, and Metadata extensions are present; confirm `Freeze authority: None`; test full pool creation on devnet with the exact same token config before mainnet

4. **Crank service breaks after program upgrade** — keep `CrankDistribution<'info>` account list strictly unchanged in v3.0; all new v3.0 instructions are separate handlers; test crank against upgraded devnet program before mainnet deploy

5. **Boost display without on-chain implementation** — the frontend boost badge must NOT ship before `claim_rewards.rs` actually mints more tokens; LiteSVM test must verify `RewardsClaimed.amount` is higher for seed holders with identical stakes before any frontend boost display is released

6. **Creator wallet locked to wrong address** — the on-chain token creator address (signer of pump.fun creation tx) is immutable; use team multisig or operational wallet before launch; dev keypair is unacceptable

7. **Wrong initial LP price ratio / no delayed start** — calculate HLX/SOL ratio from real SOL proceeds before submitting; set `startTime` to 15–30 min after creation; simulate on devnet first; sandwich bots watch for new CPMM pool creation transactions on mainnet

---

## Implications for Roadmap

Based on research, the natural dependency chain suggests four phases. Phase 1 is the hard gate: nothing downstream works until the Anchor program is upgraded, the seed token is deployed, and the creator wallet is locked in.

### Phase 1: Anchor Program + Seed Launch Infrastructure

**Rationale:** Everything downstream depends on: (a) the Anchor program being upgraded with `BoostRecord` PDA logic so boost enforcement is real and on-chain; (b) the seed token deployed with the correct creator wallet so SOL revenue flows to the right place; (c) `admin_set_seed_mint` called so the program knows which mint to validate against; (d) boost messaging live so users understand the rules before staking. These are not parallelizable with anything else — they are the root of the dependency tree.

**Delivers:**
- Upgraded Anchor program with `register_seed_boost`, `update_boost_status`, `admin_set_seed_mint` instructions
- Modified `claim_rewards` that actually applies on-chain boost multiplier, comparing current balance to snapshot stored at stake time (real tokens minted, not just display)
- Seed token live on pump.fun with correct creator wallet
- `GlobalState.seed_mint` set on-chain
- LiteSVM tests covering: non-ATA rejection, flash loan resistance (claim with zero balance = no boost), boost amount verification vs non-boosted identical stake, snapshot/headroom mechanics

**Addresses:** All P1 features; eliminates Pitfalls 1, 2, 4, 6 entirely at source

**Avoids:**
- Shipping boost display before on-chain implementation (Pitfall 6 — permanent trust damage)
- Flash loan gaming (Pitfall 2)
- Creator wallet error (irreversible after this point)
- Boost confusion post-launch (messaging must go live simultaneously with the feature)

**Research flag:** No additional research needed — Anchor patterns well-documented, IDL extension pattern verified against HELIX codebase. The snapshot-at-stake-time design requires the `StakeRecord` account to store `seed_balance_at_stake: u64`; confirm this field is added as part of Phase 1 program work.

---

### Phase 2: LP Pool Creation + Crank Boost Checker

**Rationale:** Once the seed token is live on pump.fun and generating SOL proceeds (creator fees + eventual 0.5 SOL graduation bonus), those SOL fund the HLX/SOL CPMM pool. The crank boost checker is logically tied to Phase 2 because it can only do meaningful work once `BoostRecord` PDAs exist (Phase 1) and once users are registering boosts. LP pool creation is a manual one-time operation gated on pump.fun graduation — it cannot be rushed.

**Delivers:**
- HLX/SOL Raydium CPMM pool on mainnet (after graduation event)
- LP tokens burned (permanent liquidity, no rug risk)
- Crank `boost-check.ts` deployed and running every 6 hours
- `lp_pool_state` table populated in indexer DB
- Pool address published and verifiable on Solana Explorer

**Uses:** `@raydium-io/raydium-sdk-v2` for `createPool`; Raydium API v3 for TVL polling

**Avoids:**
- Token-2022 extension incompatibility (devnet pre-flight test is mandatory, Pitfall 3)
- Wrong initial LP price ratio and sandwich bots (delayed start, ratio pre-calculation, Pitfall 4)
- CPI anti-pattern (LP creation is a one-time script, not an Anchor instruction)

**Research flag:** Pool creation mechanics are well-documented via Raydium SDK V2 demos. The devnet pre-flight test IS the research — no additional spike needed. CPMM program address (`CPMMoo8L3F4NbTegBCKVNunggL7H1ZpdTHKxQB5qKP1C`) should be verified against `@raydium-io/raydium-sdk-v2` source constants before mainnet use.

---

### Phase 3: Indexer + Backend Integration

**Rationale:** Indexer changes (new event handlers, new DB tables, new API routes, bonding curve poller) can be built in parallel with Phase 2 crank work, but require Phase 1's IDL to be exported first so event schemas are known. Grouped here as Phase 3 because the frontend (Phase 4) depends on these API routes being live.

**Delivers:**
- `seed_boosts`, `lp_pool_state`, `seed_launch_state` DB tables with Drizzle migrations
- `SeedBoostRegistered` / `SeedBoostLost` event handlers in indexer processor
- pump.fun bonding curve poller (60s interval, parses raw account bytes)
- API routes: `GET /boost/:wallet`, `GET /lp-pool`, `GET /seed-launch`
- Push notification trigger for boost-lost events (uses existing notification infrastructure)

**Implements:** Indexer component from ARCHITECTURE.md

**Avoids:**
- Silent data gaps from unhandled v3.0 events — every new event name must appear in `processor.ts` handlers
- Stale live LP balance served from PostgreSQL — indexer cache is for historical data; live balance via direct client-side RPC

**Research flag:** pump.fun bonding curve account layout is MEDIUM confidence (reverse-engineered, not officially documented). Recommend a 1–2 hour devnet spike verifying the layout before committing to the direct account parsing implementation. Bitquery API is a documented fallback if direct parsing proves unstable — adds external API dependency but eliminates layout risk.

---

### Phase 4: Frontend

**Rationale:** Frontend is the last phase because it consumes all outputs from Phases 1–3: the Anchor IDL (for `register_seed_boost` wallet interaction), the indexer API routes, and the LP pool address. Building frontend before the APIs are live leads to mocked data that diverges from real behavior — especially dangerous for a trust-sensitive product where boost mechanics must be accurate.

**Delivers:**
- `/seed` page: bonding curve progress tracker (PumpPortal WebSocket), SOL raised counter, LP funding goal bar, boost eligibility checker, complete "how boost works" explainer with snapshot/headroom/revocation rules
- `BoostBadge` component on dashboard: distinct states for eligible-not-registered, active, and revoked
- Boosted APY display: shows `baseAPY * boostMultiplier` when `BoostRecord.is_active == true`; shows clear revoked state with explanation when false
- LP pool stats widget: TVL, price, 24h volume from `/lp-pool` endpoint; live balance via direct RPC with 5s React Query cache (not indexer DB)
- Seed token "register for boost" wallet interaction (calls `register_seed_boost` on-chain)
- Pre-staking boost rules messaging: shown prominently before the stake action, not buried in docs

**Avoids:**
- Boost indicator showing "active" before crank has run — show "eligible" (based on current balance) vs "active on next claim" distinction
- LP tracker using only indexer DB for live balance (stale state, Pitfall 8)
- Transparency claims without Solana Explorer links — every "on-chain" claim links to a live account

**Research flag:** No additional research needed for Next.js / React Query / shadcn patterns — all established within the existing codebase. PumpPortal WebSocket integration is straightforward (native browser WebSocket API, no library).

---

### Phase Ordering Rationale

- **Program first** because boost is worthless without on-chain enforcement; shipping the display before the implementation would be the most trust-destroying outcome possible for a transparency-first protocol
- **Seed launch in Phase 1** because the creator wallet decision is irreversible; this must happen at the same time as the program upgrade, not after
- **Boost messaging in Phase 1** because users staking immediately after launch need to understand the rules; messaging cannot be a Phase 4 afterthought
- **LP pool in Phase 2** because it is blocked on real-world graduation (cannot be rushed); crank boost checker naturally co-deploys here since it first becomes useful once boost registrations begin
- **Indexer in Phase 3** (can start in parallel with Phase 2 once IDL is exported) — grouped separately because it is a distinct technical concern from the manual LP operation
- **Frontend last** because it has the most external dependencies and the least tolerance for mocked data

### Research Flags

Phases likely needing deeper research during planning:
- **Phase 3 (pump.fun bonding curve poller):** pump.fun bonding curve account layout is reverse-engineered (MEDIUM confidence). Devnet spike recommended before committing to direct account parsing — Bitquery provides a documented API fallback that eliminates layout uncertainty at the cost of an external API dependency.

Phases with well-established patterns (skip research-phase):
- **Phase 1 (Anchor program):** Optional PDA accounts in Anchor 0.32.1, ATA address derivation constraints, and GlobalState reserved-field expansion are all verified patterns with official docs and HELIX codebase precedents.
- **Phase 2 (CPMM pool creation):** Raydium SDK V2 demo repo provides working TypeScript examples for `createPool`; the devnet pre-flight test is the only validation needed.
- **Phase 4 (Frontend):** All patterns exist in the current codebase; PumpPortal WebSocket is native browser API.

---

## User Decisions (Post-Research)

These decisions were made after research was spawned and override any conflicting research recommendations:

| Decision | Detail |
|----------|--------|
| Seed token stays liquid | No escrow, no locking; APY boost is the only soft-lock mechanism |
| Boost enforcement is two-layer | (1) on-chain check in `claim_rewards`: current seed balance >= snapshot_at_stake_time; (2) crank every 6h for proactive UI revocation |
| Revocation is permanent per stake | Buying back seed tokens does NOT restore a revoked boost for an existing stake |
| Headroom concept | Stake with 1,000 seed tokens (snapshot = 1,000); buy 1,000 more; can now sell up to 1,000 without losing boost (balance stays at or above snapshot) |
| Messaging is P1, not P4 | Users must understand boost mechanics completely BEFORE staking; this is a launch requirement, not a post-launch polish item |
| pump.fun graduates to PumpSwap | NOT Raydium; HLX/SOL LP must be created manually on Raydium CPMM from SOL proceeds; do not rely on automatic graduation routing |

---

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Raydium SDK v2 version confirmed via npm; Token-2022 CPMM support confirmed via official Raydium docs; pump.fun graduation to PumpSwap (not Raydium) confirmed via multiple sources; web3.js v1 compatibility constraint confirmed via Anchor docs |
| Features | HIGH | pump.fun mechanics verified via official sources; bags.fm mechanics MEDIUM (sparse official docs, consistent across community sources); APY boost pattern verified against existing HELIX `claim_rewards.rs` extension point and Curve veCRV reference |
| Architecture | HIGH | Full HELIX codebase was read during research; all patterns verified against existing `claim_rewards.rs`, `crank_distribution.rs`, `global_state.rs`, and indexer processor; Anchor 0.32.1 optional account pattern confirmed; `BoostRecord` PDA design is clean and consistent with existing PDA patterns |
| Pitfalls | HIGH | Flash loan risk verified via Nirvana exploit ($3.5M real-world Solana case); ATA validation gap verified via Sec3 audit blog; Raydium Token-2022 extension blocklist confirmed via official Raydium Medium post; crank IDL break pattern confirmed via Formfunction backwards-compatibility guide and HELIX runbook review |
| Launchpad comparison | MEDIUM-HIGH | pump.fun fees confirmed via official sources; bags.fm effective creator share percentage is configurable and less certain; LetsBONK mechanics MEDIUM (no official docs, multiple corroborating sources); Moonshot excluded — negligible graduation rate |

**Overall confidence:** HIGH for all implementation decisions; MEDIUM for pump.fun bonding curve account layout (requires devnet spike in Phase 3)

### Gaps to Address

- **pump.fun bonding curve account byte layout:** Not officially documented. MEDIUM confidence based on Bitquery and community reverse-engineering. Before Phase 3 implementation: run a devnet spike parsing the bonding curve PDA for a test token. If layout is unstable or the parse is brittle, fall back to Bitquery API for progress tracking (adds external API dependency but eliminates parsing risk).

- **Boost BPS constant value:** The specific boost multiplier (e.g., 10%, 20%, 25%) is a product decision not yet made. This must be locked before Phase 1 Anchor program implementation — it becomes a program constant and changing it later requires a program upgrade.

- **Seed token minimum balance threshold:** The minimum number of seed tokens to qualify for boost is a product decision. It affects `SEED_BOOST_THRESHOLD` and the snapshot comparison logic — must be defined before Phase 1.

- **Snapshot storage in StakeRecord:** The "current balance >= snapshot at stake time" design requires adding `seed_balance_at_stake: u64` to the `StakeRecord` account. This is a program account size change — confirm it fits in remaining reserved space or that a `realloc` is acceptable on devnet before committing to this approach.

- **pump.fun graduation SOL flow:** Clarify the exact split between creator fees accumulated during the bonding curve vs the 0.5 SOL graduation bonus, and confirm which wallet(s) receive which amounts. Document before Phase 1 seed launch planning.

- **Creator fee SOL accumulation timeline:** The HLX/SOL LP pool is funded from creator fees + graduation bonus. The graduation bonus (0.5 SOL) arrives at graduation; ongoing creator fees (0.3% during bonding curve, 0.95% post-graduation on PumpSwap) accumulate over time. The LP funding model should clarify whether the initial pool is seeded only from the graduation bonus + pre-graduation fees, or whether the team waits for additional fee accumulation before creating the pool.

---

## Sources

### Primary (HIGH confidence)

- [pump.fun Official Fee Documentation](https://pump.fun/docs/fees) — creator fee tiers, graduation reward, migration fee
- [pump.fun 0.5 SOL Creator Bonus — Official X post](https://x.com/pumpdotfun/status/1821699366630879383) — graduation reward confirmed
- [PumpSwap Revenue Sharing — The Block](https://www.theblock.co/post/354038/pumpswap-revenue-tokens) — creator fee post-graduation mechanics
- [Project Ascend Dynamic Fees — Blockworks](https://blockworks.co/news/pumpdotfun-fee-model) — 0.95% creator fee at $88K–$300K market cap
- [Raydium Token-2022 Support — Official Raydium Medium](https://raydium.medium.com/raydium-support-for-token-2022-932f9fae966b) — allowed extensions list; freeze authority requirement
- [Raydium Pool Creation FAQ](https://docs.raydium.io/raydium/pool-creation/pool-creation-faq) — freeze authority must be revoked before pool creation
- [Raydium Pool Types Overview](https://docs.raydium.io/raydium/pool-creation/pool-types-overview) — CPMM is Token-2022 compatible; AMM V4 is not
- [Raydium LaunchLab Official Docs](https://docs.raydium.io/raydium/launchlab/for-creators/creating-a-token) — LaunchLab creator fee mechanics (alt launchpad reference)
- [@raydium-io/raydium-sdk-v2 npm](https://www.npmjs.com/package/@raydium-io/raydium-sdk-v2) — version 0.2.32-alpha confirmed
- [Anchor 0.32 Optional Accounts Pattern](https://www.anchor-lang.com/docs/references/account-constraints) — optional PDA in ClaimRewards accounts struct
- [Solana flash loan — marginfi vulnerability analysis](https://blog.asymmetric.re/threat-contained-marginfi-flash-loan-vulnerability/) — flash loans execute within a single transaction; any one-time balance check can be gamed
- [Nirvana $3.5M flash loan — The Block](https://www.theblock.co/post/159975/solana-stablecoin-nirvana-sinks-90-amid-3-5-million-flash-loan-exploit) — real-world Solana flash loan exploit precedent
- [bags.fm Official API Docs](https://docs.bags.fm/) — creator fee mechanics, official SDK
- [Meteora DBC Documentation](https://docs.meteora.ag/overview/products/dbc/what-is-dbc) — bags.fm graduation mechanics
- HELIX codebase: `programs/helix-staking/src/instructions/claim_rewards.rs` — `apply_loyalty_multiplier` extension point for seed boost
- HELIX codebase: `programs/helix-staking/src/instructions/crank_distribution.rs` — `CrankDistribution<'info>` account struct confirmed unchanged requirement
- HELIX codebase: `programs/helix-staking/src/state/global_state.rs` — `reserved: [u64; 6]` available slots for seed_mint storage
- HELIX codebase: `programs/helix-staking/src/state/stake_account.rs` — no `seed_boost_active` flag exists (correct); confirms boost must be computed dynamically

### Secondary (MEDIUM confidence)

- [Bitquery pump.fun bonding curve layout](https://docs.bitquery.io/docs/blockchain/Solana/Pumpfun/pump-fun-to-pump-swap/) — bonding curve account structure (reverse-engineered, not official)
- [Sec3: Two Caveats of the SPL ATA](https://www.sec3.dev/blog/two-caveats-spl) — ATA validation must enforce address derivation, not just owner+mint match
- [PumpSwap Creator Fee Implementation — DeepWiki](https://deepwiki.com/pump-fun/pump-public-docs/4.2-pumpswap-creator-fee-implementation) — creator fee PDA derivation; third-party pools do not receive creator fees
- [bags.fm Creator Monetization — DEV Community](https://dev.to/sivarampg/bagsfm-the-solana-launchpad-thats-changing-creator-monetization-4g7n) — fee share percentages, configurable creator split
- [LetsBONK graduation mechanics — Smithii](https://smithii.io/en/graduate-token-on-letsbonk/) — Raydium graduation destination (alt launchpad reference)
- [pump.fun reputation — Coindesk (98% fraud report)](https://www.coindesk.com/business/2025/05/07/98-of-tokens-on-pump-fun-have-been-rug-pulls-or-an-act-of-fraud-new-report-says) — platform reputation risk
- [Formfunction: Backwards Compatible Solana Program Changes](https://formfunction.medium.com/how-to-make-backwards-compatible-changes-to-a-solana-program-45015dd8ff82) — instruction backwards compatibility and crank break risk

### Tertiary (LOW confidence — verify before use)

- [Raydium CPMM pool creation fee 0.15 SOL — DeepWiki](https://deepwiki.com/raydium-io/raydium-sdk-V2/1-overview) — verify against SDK source constants before mainnet
- [CPMM program address CPMMoo8L3F4NbTegBCKVNunggL7H1ZpdTHKxQB5qKP1C — DeepWiki](https://deepwiki.com/raydium-io/raydium-sdk-V2/1-overview) — verify against `@raydium-io/raydium-sdk-v2` exported constants before mainnet use

---

*Research completed: 2026-03-04*
*Ready for roadmap: yes*

# Architecture Research

**Domain:** Solana staking protocol — seed token launch tracking, LP pool creation, APY boost via on-chain seed token verification
**Researched:** 2026-03-04
**Confidence:** HIGH (existing codebase fully read, official Anchor/Raydium docs verified, pump.fun mechanics confirmed from multiple sources)

---

## Standard Architecture

### System Overview (v3.0 additions in ALL CAPS)

```
┌─────────────────────────────────────────────────────────────────────┐
│                        SOLANA BLOCKCHAIN                             │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  helix_staking program (Anchor 0.32.1, Token-2022)           │   │
│  │  existing: stake/unstake/claim/crank/BPD/referral            │   │
│  │  NEW: register_seed_boost(user, seed_token_account)          │   │
│  │       -- reads seed ATA balance, writes BoostRecord PDA --   │   │
│  └──────────────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  RAYDIUM CPMM (external program)                             │   │
│  │  - HLX/SOL pool created once post-graduation                 │   │
│  │  - LP tokens held by team wallet or locked                   │   │
│  └──────────────────────────────────────────────────────────────┘   │
└───────────────────────────────┬─────────────────────────────────────┘
                                │ RPC
              ┌─────────────────┼──────────────────┐
              │                 │                  │
┌─────────────▼──────┐  ┌──────▼───────────┐  ┌───▼────────────────┐
│   INDEXER WORKER   │  │  CRANK SERVICE   │  │  NEXT.JS FRONTEND  │
│  services/indexer/ │  │  services/crank/ │  │  app/web/          │
│  src/worker/       │  │                  │  │  Vercel-deployed   │
│                    │  │  MODIFIED:       │  │                    │
│  MODIFIED:         │  │  - per-stake     │  │  NEW PAGES:        │
│  - NEW events:     │  │    boost check   │  │  - /seed (launch   │
│    SeedBoostReg'd  │  │    via RPC       │  │    progress)       │
│    SeedBoostLost   │  │    before reward │  │  - boost indicator │
│  - NEW DB tables:  │  │    math          │  │    on /dashboard   │
│    seed_boosts     │  │                  │  │  - LP pool tracker │
│    lp_pool_state   │  │                  │  │                    │
└────────┬───────────┘  └──────────────────┘  └────────────────────┘
         │
┌────────▼───────────┐
│  FASTIFY API       │
│  services/indexer/ │
│  src/api/          │
│  MODIFIED:         │
│  GET /boost/:wallet│
│  GET /lp-pool      │
│  GET /seed-launch  │
└────────┬───────────┘
         │
┌────────▼───────────┐
│  POSTGRESQL        │
│  (Drizzle ORM)     │
│  existing tables   │
│  NEW TABLES:       │
│  - seed_boosts     │
│  - lp_pool_state   │
└────────────────────┘
```

---

## Component Responsibilities

| Component | Responsibility | v3.0 Change |
|-----------|----------------|-------------|
| Anchor program | On-chain state, instructions | Add `register_seed_boost` instruction + `BoostRecord` PDA. No change to crank_distribution |
| Crank service | Daily `crank_distribution` txn | Add per-stake seed token balance check via RPC before each stake's reward share |
| Indexer worker | Event polling + DB writes | Add handlers for `SeedBoostRegistered` and `SeedBoostLost` events |
| Fastify API | REST for frontend | Add `/boost/:wallet`, `/lp-pool`, `/seed-launch` endpoints |
| Next.js frontend | User dashboard | Add `/seed` page, boost badge on dashboard, LP tracker |
| PostgreSQL | Event store + state | Add `seed_boosts` and `lp_pool_state` tables |
| Raydium CPMM | HLX/SOL LP pool | External — created once by team after graduation, not controlled by program |

---

## New On-Chain Accounts

### BoostRecord PDA

Seeds: `["boost", user_pubkey]`

This is the only new on-chain account required. It records that a staker registered for the APY boost and stores the seed token mint so the crank can verify it per-staker.

```rust
#[account]
pub struct BoostRecord {
    /// Staker wallet address
    pub user: Pubkey,
    /// Seed token mint address (set at registration, immutable)
    pub seed_mint: Pubkey,
    /// Slot when boost was first registered
    pub registered_at_slot: u64,
    /// Whether the user currently holds seed tokens (updated by crank check)
    /// True = currently qualified, False = sold (boost revoked)
    pub is_active: bool,
    /// PDA bump
    pub bump: u8,
}

impl BoostRecord {
    pub const LEN: usize = 8   // discriminator
        + 32  // user
        + 32  // seed_mint
        + 8   // registered_at_slot
        + 1   // is_active
        + 1;  // bump
    // Total: 82 bytes
}
```

PDA determinism means one BoostRecord per user wallet, derived the same way regardless of which stake account is active. The user can have multiple stakes — the boost applies to all of them during `claim_rewards`.

---

## New Instructions

### 1. `register_seed_boost` (NEW — user-signed)

**What it does:** Verifies the user holds at least 1 seed token at call time, creates a `BoostRecord` PDA.

**Trigger:** User clicks "Register for APY Boost" on the frontend. Called once per wallet, not per stake.

**Accounts required:**

```
register_seed_boost:
  user: Signer (pays for BoostRecord rent)
  boost_record: BoostRecord PDA [seeds: "boost", user] (init)
  user_seed_token_account: InterfaceAccount<TokenAccount> (read-only)
    constraint: token::mint = seed_token_mint
    constraint: user_seed_token_account.amount >= 1  <- on-chain check
  seed_token_mint: InterfaceAccount<Mint> (read-only, validated against GlobalState.seed_mint)
  global_state: Account<GlobalState> (read-only, provides seed_mint for validation)
  token_program: Program<Token2022> or Token (depends on seed token's program)
  system_program: Program<System>
```

**GlobalState change required:** Add `seed_mint: Pubkey` field to `GlobalState` (stored via new admin instruction `admin_set_seed_mint`). This is the authoritative seed token mint address used to validate user ATAs at registration.

**Why on-chain balance check at registration only:** The instruction verifies `user_seed_token_account.amount >= 1` via Anchor constraint at registration. This is the strongest possible check (happens inside the Solana runtime, not off-chain). Subsequent checks (for ongoing boost validity) happen in the crank via off-chain RPC reads — see crank section below.

**Instruction logic:**

```rust
pub fn register_seed_boost(ctx: Context<RegisterSeedBoost>) -> Result<()> {
    let boost_record = &mut ctx.accounts.boost_record;
    let clock = Clock::get()?;

    // Anchor constraint already enforces amount >= 1 on user_seed_token_account
    // GlobalState.seed_mint enforces correct mint (not just any Token-2022 token)

    boost_record.user = ctx.accounts.user.key();
    boost_record.seed_mint = ctx.accounts.seed_token_mint.key();
    boost_record.registered_at_slot = clock.slot;
    boost_record.is_active = true;
    boost_record.bump = ctx.bumps.boost_record;

    emit!(SeedBoostRegistered {
        slot: clock.slot,
        user: ctx.accounts.user.key(),
        seed_mint: ctx.accounts.seed_token_mint.key(),
    });

    Ok(())
}
```

### 2. `admin_set_seed_mint` (NEW — authority-gated)

**What it does:** Sets `global_state.seed_mint` to the deployed seed token mint address. Called once after the seed token is deployed on pump.fun/LaunchLab.

**Why needed:** The `register_seed_boost` instruction must validate that the user's token account holds the *correct* seed token (not some random SPL token). It reads `global_state.seed_mint` to enforce this.

**Accounts:** `authority: Signer`, `global_state: Account<GlobalState> [mut]`

**GlobalState field addition:**
```rust
// Add to GlobalState struct (uses reserved[2]):
pub fn seed_mint(&self) -> Pubkey {
    // Decode from reserved bytes — or add as a named field using
    // the remaining reserved slots (reserved[2..4] = 32 bytes = Pubkey)
    Pubkey::from(unsafe { *(self.reserved[2..6].as_ptr() as *const [u8; 32]) })
}
```

Alternatively (cleaner): Add `seed_mint: Pubkey` as a proper field. GlobalState currently has `reserved: [u64; 6]` = 48 bytes of space. A Pubkey is 32 bytes. This fits in `reserved[0..4]` (4 * 8 = 32 bytes), leaving `reserved[4..6]` for future use. However, `reserved[0]` and `reserved[1]` are already used for BPD window and pause flag. Use `reserved[2..6]` (32 bytes) as the seed_mint storage.

**Recommendation:** Add `seed_mint` as a proper Pubkey field and expand `GlobalState::LEN` by 32 bytes. Since devnet only, no migration needed. Document the space increase.

### 3. `update_boost_status` (NEW — permissionless crank-callable)

**What it does:** Updates `boost_record.is_active` based on a passed-in token balance. Called by the crank service when it detects a staker has sold their seed tokens.

**Why this approach vs. purely off-chain:** Having an on-chain record (`is_active`) means `claim_rewards` can read the `BoostRecord` PDA directly without an off-chain RPC call. This keeps the boost logic self-contained in the Anchor program and auditable.

**Accounts:** `boost_record: BoostRecord PDA [mut]`, `caller: Signer` (permissionless)

```rust
pub fn update_boost_status(ctx: Context<UpdateBoostStatus>, has_tokens: bool) -> Result<()> {
    let boost_record = &mut ctx.accounts.boost_record;
    let previously_active = boost_record.is_active;

    boost_record.is_active = has_tokens;

    if previously_active && !has_tokens {
        emit!(SeedBoostLost {
            slot: Clock::get()?.slot,
            user: boost_record.user,
        });
    }

    Ok(())
}
```

**Alternative (simpler — recommended):** Skip the `update_boost_status` instruction entirely. Instead, the `claim_rewards` instruction receives the user's seed token account as an optional remaining_account and reads its balance in-instruction. The crank can pass this account when calling `claim_rewards` for a boosted staker. This eliminates a separate transaction, but adds account resolution complexity to claim_rewards. See trade-off discussion in Anti-Patterns.

### 4. `claim_rewards` modification (MODIFIED — existing instruction)

The existing `claim_rewards` instruction calculates `reward = (stake.t_shares * global_state.share_rate - stake.reward_debt) / PRECISION`. The boost adds a multiplier.

**Two integration options:**

**Option A — PDA-gated (recommended):** Add `boost_record` as an optional account in `claim_rewards`. If present and `boost_record.is_active == true`, apply the boost multiplier (e.g., 10–25% extra, defined as a constant `SEED_BOOST_BPS`). The boost_record PDA address is deterministic (`["boost", user]`), so the frontend/crank can always derive it.

```rust
// In ClaimRewards accounts struct:
#[account(
    seeds = [b"boost", ctx.accounts.stake_account.user.as_ref()],
    bump,
    // Optional: if account does not exist, boost defaults to 0
)]
pub boost_record: Option<Account<'info, BoostRecord>>,
```

```rust
// In claim_rewards logic:
let boost_multiplier = if let Some(boost) = &ctx.accounts.boost_record {
    if boost.is_active { SEED_BOOST_BPS } else { 0 }
} else {
    0
};
let boosted_reward = reward + mul_div(reward, boost_multiplier, 10_000)?;
```

**Option B — RPC-only (off-chain):** Do not modify `claim_rewards`. Instead, the crank updates `boost_record.is_active` before calling `claim_rewards`. This is two transactions per staker (update + claim), which is impractical at scale.

**Verdict: Option A.** One transaction per claim, boost logic is on-chain and auditable, no extra crank complexity.

---

## Crank Service Changes

### Current Flow

```
tick() → executeCrank(program, crankerKeypair) → crank_distribution txn
```

### New Flow (v3.0)

The `crank_distribution` instruction itself does NOT change. It only updates `share_rate` in `GlobalState`. The boost is applied at `claim_rewards` time (user-initiated), not at distribution time.

The crank's new responsibility: **periodically refresh `boost_record.is_active` for all registered boosters.**

```
DAILY TICK (existing):
  tick() → executeCrank(program, crankerKeypair) → crank_distribution txn [unchanged]

NEW PERIODIC TICK (new job — e.g., every 6 hours):
  checkBoostStatuses(connection, program, crankerKeypair)
    1. Fetch all BoostRecord PDAs from chain (getProgramAccounts filter by discriminator)
    2. For each BoostRecord where is_active == true:
       a. Derive user's seed ATA: getAssociatedTokenAddress(user, seed_mint, allowOwnerOffCurve=false, tokenProgram)
       b. Fetch ATA balance via getTokenAccountBalance(ataAddress)
       c. If balance < 1 AND boost_record.is_active == true:
          → Send update_boost_status(has_tokens: false) txn
          → Log SeedBoostLost event (also emitted on-chain)
    3. Emit summary log: {checked: N, revoked: M, active: K}
```

### Crank Implementation: Boost Check

```typescript
// services/crank/src/boost-check.ts (NEW FILE)
import { Connection, PublicKey } from '@solana/web3.js';
import { Program } from '@coral-xyz/anchor';
import { getAssociatedTokenAddressSync, TOKEN_2022_PROGRAM_ID } from '@solana/spl-token';

export async function checkBoostStatuses(
  program: Program,
  crankerKeypair: Keypair,
  seedMint: PublicKey,
): Promise<void> {
  const connection = program.provider.connection;

  // 1. Fetch all BoostRecord PDAs (filter by account discriminator)
  const boostAccounts = await program.account.boostRecord.all([
    { memcmp: { offset: 72, bytes: bs58.encode([1]) } } // is_active == true
  ]);

  logger.info({ count: boostAccounts.length }, 'Boost status check: active records');

  for (const { account, publicKey: boostPda } of boostAccounts) {
    const user = account.user as PublicKey;

    try {
      // 2. Derive seed ATA for user
      const seedAta = getAssociatedTokenAddressSync(
        seedMint,
        user,
        false,
        TOKEN_2022_PROGRAM_ID, // or TOKEN_PROGRAM_ID depending on seed token
      );

      // 3. Read balance
      const tokenBalance = await connection.getTokenAccountBalance(seedAta);
      const amount = BigInt(tokenBalance.value.amount);

      if (amount < 1n) {
        // 4. Revoke boost on-chain
        await program.methods
          .updateBoostStatus(false)
          .accounts({ boostRecord: boostPda })
          .signers([crankerKeypair])
          .rpc({ commitment: 'confirmed' });

        logger.info({ user: user.toBase58() }, 'Seed boost revoked — tokens sold');
      }
    } catch (err) {
      // ATA may not exist (user never had tokens) — skip
      logger.debug({ user: user.toBase58(), err: String(err) }, 'Boost check: ATA not found or error');
    }
  }
}
```

**Schedule:** Add a 4th cron schedule to `services/crank/src/index.ts`:
```typescript
// Run every 6 hours — not time-critical, just needs to catch sells reasonably fast
const BOOST_CHECK_TIMES = ['0 0 * * *', '0 6 * * *', '0 12 * * *', '0 18 * * *'];
for (const expr of BOOST_CHECK_TIMES) {
  cron.schedule(expr, () => void checkBoostStatuses(program, crankerKeypair, seedMint), {
    timezone: 'UTC',
    noOverlap: true,
  });
}
```

**Scale note:** If 1,000 wallets register boosts, the check is 1,000 RPC calls per run. At 6-hour intervals this is well within any RPC provider's rate limits. At 10,000+ wallets, batch with `getMultipleAccounts`.

---

## LP Pool Creation Flow

LP pool creation is a **one-time manual operation** by the team after seed token graduation. It is NOT automated by the Anchor program or crank service.

### Flow

```
1. Seed token launched on pump.fun (or Raydium LaunchLab)
   └─ Creator wallet receives SOL proceeds:
      - pump.fun: 0.5 SOL creator bonus at graduation + ongoing 0.95% trading fees
      - Raydium LaunchLab: 10% of trading fees to creator

2. SOL accumulated in creator wallet (tracked by frontend off-chain)

3. Team executes pool creation (one-time manual script):
   └─ raydium.cpmm.createPool({
        mint1: HLX_MINT,        // Token-2022
        mint2: WSOL_MINT,
        mintAAmount: [HLX amount from treasury],
        mintBAmount: [SOL proceeds converted to wSOL],
        startTime: 0,           // immediately tradeable
      })
   └─ Returns: poolId (on-chain CPMM pool account address)

4. Pool address stored in indexer DB (lp_pool_state table)
   └─ Manually inserted via admin API or migration script

5. Frontend reads LP pool state from indexer API (/lp-pool)
   └─ Displays: pool address, HLX/SOL ratio, TVL, 24h volume
   └─ Data sourced from Raydium SDK V2 or Raydium API v3
```

### Why CPMM over Whirlpool (Orca)

| Criterion | Raydium CPMM | Orca Whirlpool |
|-----------|--------------|----------------|
| Token-2022 support | YES (confirmed) | YES |
| Pool type | Constant product (x*y=k) | Concentrated liquidity |
| Complexity for first LP | Low — familiar x*y=k | High — requires price range management |
| pump.fun/LaunchLab migration target | Raydium (historical default) | No |
| SDK maturity | Raydium SDK V2 (TypeScript) | Whirlpools SDK (TypeScript, Web3.js v2 only) |
| Creation fee | Configurable (low) | Whirlpool fee structure |

**Recommendation:** Raydium CPMM. It's the standard graduation target for pump.fun tokens, Token-2022-compatible, and simpler than concentrated liquidity for an initial pool. Whirlpool is overkill and uses Web3.js v2 which is incompatible with the existing `@solana/web3.js` v1 codebase.

### LP Pool State Tracking (Indexer)

The LP pool does not emit Anchor events (it's an external program). The indexer tracks it via a simple PostgreSQL table:

```typescript
// New table in services/indexer/src/db/schema.ts
export const lpPoolState = pgTable('lp_pool_state', {
  id: serial('id').primaryKey(),
  poolId: text('pool_id').notNull().unique(),        // Raydium CPMM pool account
  hlxMint: text('hlx_mint').notNull(),
  wsolMint: text('wsol_mint').notNull(),
  hlxAmount: text('hlx_amount').notNull(),           // initial deposit amount
  solAmount: text('sol_amount').notNull(),           // initial SOL deposit
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  lastTvlUsdc: text('last_tvl_usdc'),                // cached from Raydium API
  lastVolumeUsdc: text('last_volume_usdc'),          // cached from Raydium API
  lastSyncAt: timestamp('last_sync_at'),
});
```

The indexer worker adds a new polling job that calls the Raydium API v3 (`https://api-v3.raydium.io/pools/info/ids?ids={poolId}`) every 5 minutes to refresh TVL and volume. This is read-only from an external API — no new Solana RPC calls needed.

---

## Seed Token Launch Tracking

The seed token is launched on pump.fun (or Raydium LaunchLab). The HELIX program has no awareness of the seed launch. Tracking is entirely off-chain via indexer + frontend.

### What Gets Tracked

| Data Point | Source | Where Stored |
|------------|--------|--------------|
| Seed token mint address | Manual input by team after launch | `global_state.seed_mint` (on-chain) + indexer DB |
| Bonding curve completion % | pump.fun on-chain account or Bitquery API | Indexer polls, stores in DB |
| SOL raised so far | Derived from bonding curve account balance | Indexer polls, stores in DB |
| Graduation status | Raydium/PumpSwap migration transaction | Indexer detects, updates DB |
| LP pool funding | Raydium CPMM pool TVL | Raydium API v3 polling |

### Seed Launch DB Table

```typescript
export const seedLaunchState = pgTable('seed_launch_state', {
  id: serial('id').primaryKey(),
  seedMint: text('seed_mint').notNull().unique(),    // seed token mint (pump.fun token)
  launchpad: text('launchpad').notNull(),            // 'pump_fun' | 'launchlab'
  bondingCurveAccount: text('bonding_curve_account'), // pump.fun bonding curve PDA
  bondingCurveSolBalance: text('bonding_curve_sol_balance'),
  bondingCurveProgress: integer('bonding_curve_progress'), // 0-100 percentage
  graduated: boolean('graduated').notNull().default(false),
  graduatedAt: timestamp('graduated_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
```

### Bonding Curve Polling

The indexer adds a lightweight poller for the pump.fun bonding curve account:

```typescript
// services/indexer/src/worker/seed-poller.ts (NEW FILE)
// Polls pump.fun bonding curve account every 60 seconds
// pump.fun bonding curve PDA: derived from seed token mint
// Layout: https://docs.bitquery.io/docs/blockchain/Solana/Pumpfun/
async function pollBondingCurve(connection: Connection, seedMint: PublicKey): Promise<void> {
  // Virtual SOL reserves in bonding curve track progress to graduation
  // At ~85 SOL virtual reserves => graduation
  const [bondingCurvePda] = PublicKey.findProgramAddressSync(
    [Buffer.from('bonding-curve'), seedMint.toBuffer()],
    PUMP_FUN_PROGRAM_ID,
  );
  const accountInfo = await connection.getAccountInfo(bondingCurvePda);
  // Parse virtualSolReserves from raw account data (layout from pump.fun IDL)
  // virtualSolReserves / 85_000_000_000 * 100 = progress %
}
```

**Confidence on pump.fun bonding curve layout:** MEDIUM. The layout is not officially documented but is widely reverse-engineered and stable. Reference: Bitquery pump.fun API documentation.

---

## Data Flow: APY Boost Verification During Reward Claims

```
USER calls claim_rewards(stake_account, boost_record?) on-chain:
  1. Anchor resolves boost_record PDA from seeds ["boost", user]
  2. If boost_record exists AND boost_record.is_active == true:
     → reward = base_reward + (base_reward * SEED_BOOST_BPS / 10_000)
  3. If boost_record absent or is_active == false:
     → reward = base_reward (unchanged)
  4. Mint reward tokens to user (existing logic)
  5. Emit RewardsClaimed event (existing — no change to event schema)

CRANK (every 6 hours) in background:
  1. Fetch all BoostRecord PDAs with is_active == true
  2. For each: check seed ATA balance via RPC
  3. If balance == 0: send update_boost_status(false) txn
  4. Emits SeedBoostLost event → indexer picks up → updates seed_boosts table

INDEXER (event-driven):
  1. Picks up SeedBoostRegistered → inserts into seed_boosts table
  2. Picks up SeedBoostLost → updates seed_boosts.is_active = false
  3. Frontend polls /boost/:wallet → returns current boost status

FRONTEND:
  1. On dashboard load, calls GET /boost/:wallet
  2. Displays boost badge if is_active == true
  3. If is_active == false, shows "Boost revoked — buy seed tokens to re-register"
```

### Key Design Decision: On-Chain is the Source of Truth

The `BoostRecord.is_active` field on-chain is authoritative. The indexer's `seed_boosts` table is a cache derived from events. The frontend should ultimately verify by reading the PDA directly (via `program.account.boostRecord.fetch(pda)`) rather than trusting the indexer alone. This pattern is consistent with how the existing frontend reads `stake_accounts` directly from the chain.

---

## Recommended Project Structure Changes

```
programs/helix-staking/src/
├── state/
│   ├── boost_record.rs          # NEW: BoostRecord account struct
│   └── global_state.rs          # MODIFIED: add seed_mint field
├── instructions/
│   ├── register_seed_boost.rs   # NEW
│   ├── update_boost_status.rs   # NEW
│   ├── admin_set_seed_mint.rs   # NEW
│   └── claim_rewards.rs         # MODIFIED: add boost_record optional account

services/crank/src/
├── boost-check.ts               # NEW: periodic seed token balance check
└── index.ts                     # MODIFIED: add BOOST_CHECK_TIMES cron schedule

services/indexer/src/
├── db/schema.ts                 # MODIFIED: add seed_boosts, lp_pool_state, seed_launch_state
├── worker/
│   ├── processor.ts             # MODIFIED: handle SeedBoostRegistered, SeedBoostLost
│   └── seed-poller.ts           # NEW: pump.fun bonding curve polling
└── api/routes/
    ├── boost.ts                 # NEW: GET /boost/:wallet
    ├── lp-pool.ts               # NEW: GET /lp-pool
    └── seed-launch.ts           # NEW: GET /seed-launch

app/web/app/
├── seed/                        # NEW: seed launch page + LP tracker
│   └── page.tsx
└── dashboard/
    └── components/
        └── BoostBadge.tsx       # NEW: boost indicator component
```

---

## Architectural Patterns

### Pattern 1: Optional PDA Account for Feature Gating

**What:** Pass `boost_record` as an optional account in `claim_rewards`. If the PDA doesn't exist (user never registered), the instruction proceeds normally with zero boost.

**When to use:** When a feature applies to a subset of users and you don't want to force all callers to pass extra accounts.

**Trade-offs:** Optional accounts in Anchor require careful handling — the account is passed as `Option<Account<'info, BoostRecord>>` and the program must handle `None` gracefully. This is well-supported in Anchor 0.32.1.

```rust
// Accounts struct
#[account(
    seeds = [b"boost", stake_account.user.as_ref()],
    bump,
    // No init constraint — this is optional existing account
)]
pub boost_record: Option<Account<'info, BoostRecord>>,
```

### Pattern 2: Crank as Boost Status Keeper

**What:** The crank service — already running, already holding a keypair, already trusted — takes on the additional role of invalidating boosts when users sell seed tokens.

**When to use:** Any background state update that requires reading on-chain token balances and writing on-chain status. This is exactly the crank's existing job (read chain → act on chain).

**Trade-offs:** Boost revocation latency is bounded by the crank's check interval (6 hours). A user who sells seed tokens retains boost for up to 6 hours. This is acceptable for a staking protocol where rewards accumulate over days. If real-time revocation is needed, add a user-callable `deregister_boost` instruction or a more frequent check.

### Pattern 3: Reserved-Field Expansion for GlobalState

**What:** Use the existing `reserved: [u64; 6]` in `GlobalState` to store the seed_mint Pubkey (32 bytes = 4 u64 slots). Uses `reserved[2..6]` (since `reserved[0]` = BPD window flag and `reserved[1]` = pause flag).

**When to use:** When you need to add a new field without a migration but the struct has reserved space.

**Trade-offs:** The reserved field approach avoids account migration complexity (no `migrate_stake`-style instruction needed for GlobalState). The downside is that encoding a Pubkey across 4 u64 slots requires careful endianness handling. Alternatively, add `seed_mint` as a proper Pubkey field — since this is devnet-only, a `realloc` is acceptable. For mainnet, `reserved` usage would be critical.

---

## Anti-Patterns

### Anti-Pattern 1: Storing Boost State Only Off-Chain (Indexer DB)

**What people do:** Skip the `BoostRecord` PDA entirely. Track boost status only in PostgreSQL. The crank reads the DB to decide whether to apply boost, and the frontend shows boost status from the DB.

**Why it's wrong:** Reward distribution (`claim_rewards`) happens on-chain. The Anchor program cannot read PostgreSQL. Either the boost must be enforced on-chain (via PDA) or it's not enforced at all — just a display thing. If the boost has real financial value (extra tokens minted), it must be enforced on-chain. Off-chain-only tracking would mean the crank must apply boost outside the program, creating an attack vector where anyone can call `claim_rewards` without the crank's boost logic.

**Do this instead:** `BoostRecord` PDA stores `is_active`. `claim_rewards` reads it. Off-chain DB mirrors the state for frontend display only.

### Anti-Pattern 2: Boost Check in `crank_distribution`

**What people do:** Modify `crank_distribution` to also iterate all registered boosters and verify their seed token balances.

**Why it's wrong:** `crank_distribution` is called once per day and is already on a tight CU budget (100K CU). Adding N account reads for N registered boosters blows the CU limit and makes the instruction fail at scale. The instruction would need to become batched, adding significant complexity.

**Do this instead:** Keep `crank_distribution` unchanged. Run boost checking as a separate cron job in the crank service.

### Anti-Pattern 3: CPI into Raydium CPMM to Create LP Pool from the Anchor Program

**What people do:** Add an `initialize_lp_pool` instruction to the Anchor program that does a CPI call to Raydium CPMM's `createPool` instruction.

**Why it's wrong:** Raydium CPMM's `createPool` instruction requires a complex set of accounts (pool accounts, LP mint, fee accounts, config account). These are not stable across Raydium upgrades. Adding a CPI dependency on Raydium introduces an external program dependency that could break the HELIX program if Raydium changes their interface. LP pool creation is a one-time manual operation — it does not need to be automated or trustless.

**Do this instead:** Manual team operation using the Raydium SDK V2 TypeScript script. The HELIX Anchor program stores only `global_state.seed_mint` to power boost verification — it has no LP pool concern.

### Anti-Pattern 4: Requiring `update_boost_status` Before Every `claim_rewards`

**What people do:** Force the crank to call `update_boost_status` immediately before calling `claim_rewards` for each stake, ensuring perfectly up-to-date boost status.

**Why it's wrong:** `claim_rewards` is user-initiated (not crank-initiated). Users call it from the frontend at any time. The crank cannot be a required precondition for a user action. This creates a sequencing dependency that blocks users.

**Do this instead:** The `BoostRecord.is_active` flag is the source of truth. Users call `claim_rewards` at any time. The crank updates `is_active` asynchronously every 6 hours. The maximum "stale boost" window is 6 hours, which is acceptable.

---

## Integration Points

### External Services

| Service | Integration Pattern | Notes |
|---------|---------------------|-------|
| pump.fun | Off-chain account polling (bonding curve PDA) | No official API — parse account data. HIGH risk of layout changes. |
| Raydium LaunchLab | Alternative to pump.fun — same bonding curve approach | Prefer LaunchLab if it offers better creator SOL proceeds |
| Raydium CPMM | SDK V2 TypeScript for pool creation (one-time) | `raydium.cpmm.createPool` returns all required transactions |
| Raydium API v3 | REST polling for TVL/volume data | `https://api-v3.raydium.io/pools/info/ids?ids={poolId}` |
| Solana RPC | getTokenAccountBalance for seed ATA checks in crank | Standard RPC call, no special API needed |

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| Anchor program `claim_rewards` ↔ `BoostRecord` | On-chain PDA read (existing account constraint pattern) | Same as how ClaimStatus is read in free_claim |
| Crank service ↔ Anchor program `update_boost_status` | On-chain txn (new instruction) | Same pattern as `crank_distribution` |
| Crank service → Solana RPC (seed ATA balance) | `getTokenAccountBalance` | Read-only, cheap |
| Indexer ↔ Raydium API v3 | HTTP polling every 5 min | External API — add error handling + caching |
| Indexer ↔ pump.fun on-chain | Account polling (bonding curve PDA) | Parse raw account bytes — medium confidence on layout stability |
| Frontend ↔ Indexer API | New REST endpoints `/boost/:wallet`, `/lp-pool`, `/seed-launch` | Same pattern as existing badge eligibility endpoints |

---

## Build Order (Considering Dependencies)

```
Step 1: Anchor program changes (no external deps)
  1a. Add seed_mint to GlobalState (admin_set_seed_mint instruction)
  1b. Add BoostRecord state account
  1c. Add register_seed_boost instruction
  1d. Add update_boost_status instruction
  1e. Modify claim_rewards to read optional BoostRecord
  1f. Write LiteSVM tests for all new instructions

Step 2: Deploy seed token on pump.fun or LaunchLab (external action)
  - Requires Step 1a deployed so admin_set_seed_mint can be called after
  - This is the real-world action that unblocks Step 3

Step 3: Crank service changes (depends on Step 1 IDL)
  2a. Add boost-check.ts (seed ATA polling + update_boost_status calls)
  2b. Add BOOST_CHECK_TIMES cron schedule to index.ts
  2c. Add SEED_MINT env var to env.ts + .env.example

Step 4: Indexer changes (depends on Step 1 events being defined)
  3a. Add seed_boosts, lp_pool_state, seed_launch_state tables to schema.ts
  3b. Add Drizzle migrations
  3c. Handle SeedBoostRegistered and SeedBoostLost in processor.ts
  3d. Add seed-poller.ts for pump.fun bonding curve polling
  3e. Add /boost/:wallet, /lp-pool, /seed-launch API routes

Step 5: LP pool creation (one-time manual — after seed token graduates)
  - Run Raydium SDK V2 createPool script
  - Manually insert poolId into lp_pool_state table

Step 6: Frontend (depends on Steps 3-4 APIs being available)
  4a. /seed page with bonding curve progress tracker
  4b. BoostBadge component on dashboard (calls /boost/:wallet)
  4c. LP pool tracker (calls /lp-pool)
  4d. register_seed_boost UI flow (wallet interaction)
```

**Critical path:** Step 1 (program) → Step 2 (deploy seed token) → Steps 3+4 (crank + indexer) → Step 5 (LP pool) → Step 6 (frontend).

Steps 3 and 4 can be built in parallel once Step 1's IDL is exported. Step 5 is blocked on real-world seed token graduation.

---

## Scaling Considerations

| Scale | Architecture Adjustments |
|-------|--------------------------|
| 0-1k boost registrations | Single crank instance, sequential ATA checks, 6-hour interval fine |
| 1k-10k boost registrations | `getMultipleAccounts` batch calls instead of sequential. Still one crank instance. |
| 10k+ boost registrations | Partition boost check across multiple crank runs (process 1k per 6-hour window, cycle through all). Or move to on-chain automated crank (Helium Tuk Tuk pattern). |

---

## New Events (to add to events.rs)

```rust
#[event]
pub struct SeedBoostRegistered {
    pub slot: u64,
    pub user: Pubkey,
    pub seed_mint: Pubkey,
}

#[event]
pub struct SeedBoostLost {
    pub slot: u64,
    pub user: Pubkey,
}
```

Both events feed the indexer's `seed_boosts` table (insert on Registered, update on Lost).

---

## Sources

- Anchor 0.32.1 optional accounts pattern: https://www.anchor-lang.com/docs/references/account-constraints
- Raydium CPMM pool creation (TypeScript SDK V2): https://github.com/raydium-io/raydium-sdk-V2-demo
- Raydium pool types (CPMM = default, Token-2022 supported): https://docs.raydium.io/raydium/pool-creation/pool-types-overview
- Raydium API v3 docs: https://docs.raydium.io/raydium/protocol/developers/api
- pump.fun creator rewards (0.5 SOL + 0.95% trading fees at graduation): https://pump.fun/docs/fees
- pump.fun bonding curve graduation threshold (~85 SOL, ~$63K-$90K market cap): https://smithii.io/en/graduate-token-pump-fun/
- Raydium LaunchLab (alternative to pump.fun, 10% creator fee share): https://docs.raydium.io/raydium/pool-creation/launchlab/launchlab-typescript-sdk
- pump.fun bonding curve account layout (reverse-engineered): https://docs.bitquery.io/docs/blockchain/Solana/Pumpfun/pump-fun-to-pump-swap/
- SPL Token getAssociatedTokenAddressSync with Token-2022: https://spl.solana.com/token-2022/onchain
- Token-2022 Anchor constraints (0.30.0+): https://www.quicknode.com/guides/solana-development/anchor/token-2022
- Existing codebase: `programs/helix-staking/src/state/global_state.rs` (reserved fields pattern)
- Existing codebase: `services/crank/src/crank.ts` (executeCrank pattern to extend for boost-check)
- Existing codebase: `services/indexer/src/worker/processor.ts` (event routing pattern)
- Existing codebase: `services/indexer/src/db/schema.ts` (table definition pattern)

---

*Architecture research for: HELIX v3.0 Seed Launch, LP Pool Funding, APY Boost System*
*Researched: 2026-03-04*

# Stack Research

**Domain:** Solana staking protocol — seed token launch, LP pool funding, APY boost system
**Researched:** 2026-03-04
**Confidence:** MEDIUM-HIGH (launchpad fee mechanics verified via multiple sources; Raydium SDK version confirmed via npm; on-chain balance patterns verified via Solana docs)

---

## Context: This Is an Additive Milestone

The v2.0 stack remains in place. This file documents ONLY what is new for v3.0.

**Do not re-add:** `@solana/web3.js`, `@coral-xyz/anchor`, `node-cron`, `p-retry`, `pino`, `zod`, `drizzle-orm`, React Query, shadcn/ui, Framer Motion, wallet-adapter — all already installed.

**Do not upgrade:** Next.js (14.2.x stays — React 19 peer dep risk with wallet-adapter documented in PROJECT.md), `@solana/web3.js` v2 / `@solana/kit` (incompatible with Anchor 0.32 TS client).

---

## Decision: pump.fun vs bags.fm

**Verdict: pump.fun is the better choice for HELIX's seed launch.**

### Fee Structure Comparison

| Platform | Trading Fee Creator Share | Graduation Reward | SOL to LP at Graduation | LP Fate |
|----------|--------------------------|-------------------|------------------------|---------|
| **pump.fun** | 0.3% base → up to **0.95%** (dynamic by market cap, Project Ascend) | **0.5 SOL** direct to creator wallet | ~$12K migrates automatically to PumpSwap (not Raydium as of March 2025+) | LP tokens burned — creator cannot rug |
| **bags.fm** | **1% forever** on all volume | No direct graduation payment; creator earns LP fee shares post-graduation | Configurable via DBC config key; split into claimable/locked/vesting LP | Creator claims fees from locked LP (Meteora DAMM v1/v2) |

### Why pump.fun Wins for HELIX

1. **Creator receives 0.5 SOL cash at graduation** — immediately usable to fund the HLX/SOL Raydium CPMM pool without waiting for LP fee accrual.

2. **pump.fun Project Ascend pays 0.3–0.95% on ALL volume during the bonding curve**, not just post-graduation. For a seed launch where most volume is concentrated on the bonding curve ramp, this yields more SOL than bags.fm's 1% forever on lower post-graduation volume.

3. **ProgramPortal API (pumpportal.fun)** provides a maintained TypeScript/REST API for programmatic token creation. No unofficial SDKs needed — creators can launch via a single POST request.

4. **Raydium CPMM is where HELIX LP must go** — HELIX's HLX token is Token-2022. Raydium CPMM explicitly supports Token-2022. PumpSwap (new default graduation target since March 2025) does NOT need to be used — the graduation bonding curve can direct to Raydium CPMM directly, or the 0.5 SOL + trading fee proceeds can be manually deposited into a CPMM pool.

5. **bags.fm risk:** The BAGS ecosystem suffered a 90% crash in January 2026 following the Steve Yegge incident, indicating platform-level volatility risk. pump.fun processes billions in daily volume with $338M+ total PumpSwap liquidity.

### When bags.fm Would Win

Use bags.fm only if perpetual 1% volume share is the priority AND you expect sustained post-graduation volume exceeding the one-time pump.fun bonding curve volume by a large margin AND you are comfortable with Meteora DAMM LP mechanics. For HELIX's use case (raise SOL to fund a specific LP event), pump.fun is simpler and more predictable.

---

## Recommended Stack — New for v3.0

### Core Technologies

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| `@raydium-io/raydium-sdk-v2` | 0.2.32-alpha (current, npm) | CPMM pool creation and LP management for HLX/SOL pool | Only official Raydium TypeScript SDK. Provides `raydium.cpmm.createPool()` for programmatic pool creation. Supports Token-2022 natively (CPMM is the Token-2022-compatible pool type — AMM V4 does NOT support Token-2022). Pool creation costs 0.15 SOL protocol fee. |
| `pumpportal.fun` API | REST/WebSocket (no npm package — direct HTTP calls) | Token creation on pump.fun and tracking bonding curve progress | Official third-party API for pump.fun. Token creation = POST to `/api/trade-local`. Real-time bonding curve data via WebSocket at `wss://pumpportal.fun/api/data`. No unofficial SDK needed — avoids dependency rot from community SDKs. |

### Supporting Libraries — New for v3.0

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `recharts` | 2.15.x (current npm) | LP pool funding progress chart and APY boost tracker on dashboard | Already the standard for Next.js 14 + shadcn/ui stack. shadcn/ui's chart components are built on recharts. Use `AreaChart` for bonding curve progress and pool TVL over time. Do NOT use `lightweight-charts` (TradingView) — adds ~200KB, no shadcn/ui integration. |
| `@solana/spl-token` | 0.4.9 (current npm; already may be installed transitively) | Read seed token balance from wallet's Token-2022 account for APY boost verification | Use `getAccount()` with the Token-2022 program ID (`TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb`) to fetch balance. Wrap in existing React Query hooks for caching and refetch-on-focus. Do NOT poll — use account subscription websocket or Helius webhook. |

### On-Chain APY Boost Verification Pattern

The APY boost must be verified at stake time (on-chain, in the Anchor program) to be trustless. Here is the pattern:

**Option A: Pass-through account verification (recommended)**
Add a `seed_token_account: Account<TokenAccount>` account to the existing `stake` instruction. The Anchor program reads `seed_token_account.amount` at CPI time. No new on-chain program needed — extend the existing staking instruction.

```rust
// In stake instruction accounts:
#[account(
    associated_token::mint = seed_token_mint,
    associated_token::authority = user,
    associated_token::token_program = token_2022_program,
)]
pub seed_token_account: InterfaceAccount<'info, TokenAccount>,
```

**Option B: Off-chain verification via indexer (simpler, less trustless)**
Indexer polls `getTokenAccountsByOwner` with `TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb` program ID at stake creation time. Store `seed_token_balance_at_stake` in the stake record. Check balance on crank runs; remove boost if below threshold. Loses the "trustless" property.

**Recommendation: Option A** for the Anchor program, Option B as the indexer's real-time display check. The indexer check handles the dashboard indicator without requiring an on-chain read; the Anchor check handles the actual boost application.

**WebSocket subscription for real-time dashboard:**
Use `connection.onAccountChange(seedTokenAccount, callback, 'confirmed')` via existing `@solana/web3.js` 1.x. Subscribe to the user's seed token ATA when they connect wallet. Unsubscribe on disconnect. Do NOT use polling — Helius's websocket reliability is production-grade on their RPC endpoint (already used for the crank).

### New Environment Variables Required

| Variable | Service | Purpose |
|----------|---------|---------|
| `PUMPPORTAL_API_KEY` | crank service or one-off script | pump.fun token creation API authentication |
| `RAYDIUM_CPMM_POOL_ID` | indexer + frontend | Published pool address for HLX/SOL — set after pool creation |
| `SEED_TOKEN_MINT` | Anchor program + indexer + frontend | Mint address of the pump.fun seed token |
| `SEED_TOKEN_BOOST_THRESHOLD` | Anchor program + indexer | Minimum seed tokens to qualify for APY boost |
| `SEED_TOKEN_BOOST_BPS` | Anchor program | Basis points of APY boost (e.g., 500 = 5%) |

---

## Installation

```bash
# In app/web/ (frontend)
npm install @raydium-io/raydium-sdk-v2 recharts

# @solana/spl-token is likely already installed transitively
# Verify:
npm list @solana/spl-token

# If missing:
npm install @solana/spl-token@0.4.9

# In services/indexer/ or services/crank/
npm install @raydium-io/raydium-sdk-v2 @solana/spl-token@0.4.9
```

**No new packages needed for:**
- pump.fun token creation (direct REST API calls with `fetch`)
- Bonding curve progress tracking (pumpportal.fun WebSocket via native `WebSocket`)
- On-chain balance verification (uses existing `@coral-xyz/anchor` InterfaceAccount)
- Dashboard charts (recharts is included with shadcn/ui chart component installation)

---

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| pump.fun (0.5 SOL graduation reward + 0.3–0.95% volume fee) | bags.fm (1% perpetual volume fee) | If HELIX expects sustained post-graduation volume 5x+ above bonding curve volume, bags.fm's perpetual 1% could yield more total SOL over time. Use bags.fm if long-term LP fee revenue matters more than immediate SOL at launch. |
| Raydium CPMM (`@raydium-io/raydium-sdk-v2`) | Orca Whirlpools (CLMM) | If HLX already has price discovery on another exchange and you want concentrated liquidity. CPMM is correct for a new token with no established price. Orca CLMM requires an initial price range — guessing wrong means lopsided liquidity. |
| Raydium CPMM | Meteora DAMM v2 | If using bags.fm as the launch platform (DBC naturally graduates to Meteora DAMM). Since we chose pump.fun, Raydium CPMM is the straightforward path. |
| Pass-through account verification (Option A) | Off-chain indexer check (Option B) | If the team wants to ship quickly without Rust changes. Option B is a valid MVP approach — indexer verifies balance, writes boost flag to DB, program reads a flag from a config account. Less trustless but ships faster. |
| `recharts` 2.15.x | `lightweight-charts` (TradingView) | lightweight-charts is excellent for OHLCV candlestick charts. If the LP tracker needs price candles, use it. For simple area/line progress charts, recharts integrates with shadcn/ui natively. |
| pumpportal.fun REST API | Community SDKs (`@bilix-software/pump-fun-token-launcher`, `rckprtr/pumpdotfun-sdk`) | Community SDKs are unmaintained and lag behind pump.fun's rapid updates. The official PumpPortal API is the correct approach. |

---

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| `@raydium-io/raydium-sdk` (v1, no `-v2`) | Deprecated SDK — does not support CPMM or Token-2022. Pool creation returns undefined for CPMM on v1. | `@raydium-io/raydium-sdk-v2` |
| Raydium AMM V4 for HLX/SOL pool | AMM V4 does NOT support Token-2022 standard tokens. HLX is Token-2022 — attempting to create an AMM V4 pool with HLX will fail. | Raydium CPMM (CPMMoo8L3F4NbTegBCKVNunggL7H1ZpdTHKxQB5qKP1C) |
| Community pump.fun SDKs (`pumpdotfun-sdk`, `pump-fun-sdk`) | These are unofficial, unmaintained, and written against old pump.fun program IDLs. pump.fun updates frequently. | PumpPortal REST API (pumpportal.fun) |
| `@solana/web3.js` v2 / `@solana/kit` for new code | Anchor 0.32's TS client (`@coral-xyz/anchor`) uses web3.js v1. Mixing v1 and v2 in the same service causes duplicate crypto primitive conflicts. | Stay on `@solana/web3.js` 1.95.x throughout |
| WebSocket polling as a reliability fallback | WebSockets miss events under reconnects — do not use them for data that must not be missed (e.g., seed token balance at stake time). | Use `getTokenAccountsByOwner` RPC call at critical moments (stake instruction submission); use WebSocket only for dashboard display refresh |
| Polling `getTokenAccountsByOwner` on every page load | Two calls required per wallet (Token Program + Token-2022 Program separately) — expensive at scale. | Cache with React Query (staleTime: 30s, refetchOnFocus: true); revalidate on WebSocket event |
| PumpSwap for the graduated LP | pump.fun now defaults graduation migration to PumpSwap (not Raydium). HELIX needs a Raydium CPMM pool for HLX (Token-2022). | Manually create the Raydium CPMM pool using SOL proceeds from the bonding curve trading fees + 0.5 SOL graduation reward. Do NOT rely on automatic graduation migration routing. |

---

## Stack Patterns by Variant

**Creating the Raydium CPMM pool (one-time operation, via script):**
```typescript
import { Raydium, TxVersion } from '@raydium-io/raydium-sdk-v2';
import { TOKEN_2022_PROGRAM_ID } from '@solana/spl-token';

const raydium = await Raydium.load({ connection, owner: creatorWallet });

// CPMM config IDs at https://api-v3.raydium.io/main/cpmm-config
// Use 0.25% fee tier config for new tokens with low initial liquidity
const { execute } = await raydium.cpmm.createPool({
  programId: new PublicKey('CPMMoo8L3F4NbTegBCKVNunggL7H1ZpdTHKxQB5qKP1C'),
  poolFeeAccount: new PublicKey('G11FKBRaAkHAKuLCgLM6K7NUPCdFGAVMtWMDYEnLCMJx'),
  mintA: { address: HLX_MINT, programId: TOKEN_2022_PROGRAM_ID },
  mintB: { address: WSOL_MINT, programId: TOKEN_PROGRAM_ID },
  mintAAmount: hlxAmount,
  mintBAmount: solAmount,
  startTime: new BN(0), // starts immediately
  feeConfig: cpmmConfig, // fetched from API
  txVersion: TxVersion.V0,
});
// Protocol fee: 0.15 SOL deducted from transaction
await execute({ sendAndConfirm: true });
```

**Seed token balance check in existing Anchor stake instruction:**
```rust
// accounts struct addition:
pub seed_token_mint: Option<InterfaceAccount<'info, Mint>>,
pub seed_token_account: Option<InterfaceAccount<'info, TokenAccount>>,

// In stake handler:
let boost_bps = if let (Some(mint), Some(account)) =
    (ctx.accounts.seed_token_mint.as_ref(), ctx.accounts.seed_token_account.as_ref()) {
    if account.mint == mint.key()
        && account.owner == ctx.accounts.user.key()
        && account.amount >= SEED_TOKEN_BOOST_THRESHOLD {
        SEED_TOKEN_BOOST_BPS
    } else { 0u16 }
} else { 0u16 };
```

**React Query hook for seed token balance (frontend):**
```typescript
// Reuses existing wallet-adapter and React Query setup — no new libraries
export function useSeedTokenBalance(wallet: PublicKey | null) {
  return useQuery({
    queryKey: ['seedTokenBalance', wallet?.toString()],
    queryFn: async () => {
      if (!wallet) return null;
      const ata = getAssociatedTokenAddressSync(
        SEED_TOKEN_MINT,
        wallet,
        false,
        TOKEN_2022_PROGRAM_ID,
      );
      return getAccount(connection, ata, 'confirmed', TOKEN_2022_PROGRAM_ID);
    },
    enabled: !!wallet,
    staleTime: 30_000,
    refetchOnWindowFocus: true,
  });
}
```

**Bonding curve progress tracking (frontend WebSocket):**
```typescript
// Direct WebSocket — no library needed
const ws = new WebSocket('wss://pumpportal.fun/api/data');
ws.onopen = () => ws.send(JSON.stringify({
  method: 'subscribeTokenTrade',
  keys: [SEED_TOKEN_MINT.toString()],
}));
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  updateBondingCurveProgress(data.vSolInBondingCurve, data.marketCapSol);
};
```

---

## Version Compatibility

| Package | Compatible With | Notes |
|---------|-----------------|-------|
| `@raydium-io/raydium-sdk-v2` 0.2.32-alpha | `@solana/web3.js` 1.x | SDK V2 uses web3.js v1 internally — compatible with existing Anchor 0.32 TS client |
| `@solana/spl-token` 0.4.9 | `@solana/web3.js` 1.95.x, Token-2022 | Supports both TOKEN_PROGRAM_ID and TOKEN_2022_PROGRAM_ID. Use `TOKEN_2022_PROGRAM_ID` import for HLX accounts. |
| `recharts` 2.15.x | React 18 (Next.js 14) | shadcn/ui `chart` component wraps recharts 2.x. Do NOT install recharts if shadcn/ui chart is already installed — it bundles recharts. Check `node_modules/recharts` first. |
| Raydium CPMM program | Token-2022 (HLX) | CPMM explicitly supports Token-2022. Only unsupported Token-2022 extensions for CLMM: permanent delegate, non-transferable, default account state, confidential transfers, transfer hooks. HELIX uses metadata extension + mint authority PDA — both are supported. |

---

## Integration Points with Existing Services

### Anchor Program (Rust)
- Add optional `seed_token_account` and `seed_token_mint` accounts to `stake` instruction
- `InterfaceAccount<TokenAccount>` handles both SPL and Token-2022 transparently
- Store `seed_boost_bps: u16` on `StakeRecord` account; apply multiplicatively to T-shares at stake time
- Crank: check if `seed_token_account.amount < threshold` on each distribution run; zero out boost if holder has sold

### Fastify Indexer
- Add `seedTokenBalance` and `hasSeedBoost` fields to the staker's DB record (Drizzle schema change)
- On `stake` event: call `getAccount(seedTokenAta, 'confirmed', TOKEN_2022_PROGRAM_ID)` and store balance
- Schedule a daily check: `getTokenAccountsByOwner(user, TOKEN_2022_PROGRAM_ID)` → update `hasSeedBoost`
- Expose `GET /api/pool` endpoint returning Raydium CPMM pool data (TVL, volume, APY) fetched from `api-v3.raydium.io/pools/info/ids?ids={POOL_ID}`

### Next.js Frontend
- New `/seed` page: bonding curve progress, SOL raised, boost qualification checker
- Dashboard: boost indicator badge on stake card (read from `hasSeedBoost` in indexer API)
- LP tracker widget: fetch from indexer's `/api/pool` endpoint, display with recharts AreaChart
- No new layout changes needed — add to existing App Router structure

### Crank Service
- No changes required for the seed launch event itself (one-time pool creation is a script, not a crank task)
- Optional enhancement: add a weekly boost eligibility re-check cron job that calls the indexer

---

## Sources

- [Pump.fun Project Ascend — dynamic fee structure](https://blockworks.co/news/pumpdotfun-fee-model) — creator fee tiers 0.3%–0.95%, MEDIUM confidence (Blockworks, verified against multiple reports)
- [Pump.fun graduation reward announcement](https://x.com/Pumpfun/status/1821699366630879383) — 0.5 SOL at bonding curve completion, HIGH confidence (official pump.fun Twitter)
- [PumpSwap as new default graduation destination](https://cryptobriefing.com/launch-pumpswap-dex-pump-fun/) — pump.fun no longer migrates to Raydium automatically, HIGH confidence (multiple sources)
- [bags.fm — 1% creator trading fee forever](https://dev.to/sivarampg/bagsfm-the-solana-launchpad-thats-changing-creator-monetization-4g7n) — MEDIUM confidence (DEV.to article, consistent with bags.fm support docs)
- [bags.fm ecosystem crash January 2026](https://medium.com/@bennydoda83/bags-fm-on-solana-the-49k-no-strings-attached-trap-and-why-gas-town-made-it-inevitable-ca12279ed59f) — platform volatility risk, MEDIUM confidence
- [Meteora DBC graduation — LP split mechanics](https://docs.meteora.ag/overview/products/dbc/what-is-dbc) — bags.fm uses DBC → DAMM migration, HIGH confidence (official Meteora docs)
- [@raydium-io/raydium-sdk-v2 npm](https://www.npmjs.com/package/@raydium-io/raydium-sdk-v2) — version 0.2.32-alpha, published ~1 month ago, HIGH confidence
- [Raydium Token-2022 support](https://docs.raydium.io/raydium/for-developers/token-2022-support) — CPMM + CLMM support Token-2022, AMM V4 does not, HIGH confidence (official docs)
- [Raydium CPMM pool creation fee — 0.15 SOL](https://deepwiki.com/raydium-io/raydium-sdk-V2/1-overview) — protocol fee for CPMM pool creation, MEDIUM confidence (DeepWiki, consistent with Raydium docs)
- [CPMM program address — CPMMoo8L3F4NbTegBCKVNunggL7H1ZpdTHKxQB5qKP1C](https://deepwiki.com/raydium-io/raydium-sdk-V2/1-overview) — MEDIUM confidence (verify against raydium-sdk-V2 source before use)
- [helius-sdk 2.0.5 — uses @solana/kit](https://www.npmjs.com/package/helius-sdk) — conflicts with web3.js v1, HIGH confidence (npm)
- [Anchor + web3.js v2 incompatibility](https://www.anchor-lang.com/docs/clients/typescript) — Anchor TS client requires web3.js v1, HIGH confidence (official Anchor docs)
- [getTokenAccountsByOwner — two-call requirement for Token-2022](https://solana.com/docs/rpc/http/gettokenaccountsbyowner) — must call separately for each program ID, HIGH confidence (official Solana docs)
- [WebSocket account subscription — use with caution](https://www.helius.dev/blog/solana-data-streaming) — brittle for mission-critical; use RPC for balance at critical moments, HIGH confidence (Helius docs)

---

*Stack research for: HELIX v3.0 — seed token launch, LP pool funding, APY boost system*
*Researched: 2026-03-04*

# Feature Research

**Domain:** Seed token launch (pump.fun/bags), LP pool funding, loyalty-based APY boost — Solana DeFi
**Researched:** 2026-03-04
**Confidence:** HIGH (pump.fun/bags mechanics), MEDIUM (APY boost implementation patterns), MEDIUM (Raydium LP programmatic creation)

---

## Context: v3.0 Scope

This research covers three new feature areas added on top of the existing HELIX staking protocol:

1. **Seed token launch** — launch a seed token on pump.fun or bags.fm, maximizing creator rewards
2. **LP pool funding** — use SOL proceeds from the seed bonding curve to fund HLX/SOL liquidity
3. **APY boost system** — reward seed token holders with boosted staking APY, revoked if tokens are sold

Existing protocol (do NOT re-research): Anchor staking program, T-shares, crank service, Next.js dashboard, NFT badges, referral system, push notifications.

---

## Platform Mechanics Reference

### pump.fun Mechanics (HIGH confidence)

**Bonding curve:** 1 billion token fixed supply. ~800M tokens available for bonding curve sale.
Graduation threshold: ~$69,000 market cap (~86 SOL at current prices).

**Graduation outcome:**
- SOL raised on bonding curve migrates automatically to PumpSwap (pump.fun's native DEX, launched March 2025)
- LP tokens are burned — liquidity is permanent (cannot be rug-pulled)
- Creator receives **0.5 SOL** one-time reward upon bonding curve completion
- pump.fun takes **2.3 SOL** as a service fee from the bonding curve proceeds

**Creator trading fees (Project Ascend, September 2025 → current):**
Dynamic fee model tied to market cap:
- $88K–$300K market cap: **0.95%** per trade goes to creator
- Scales down to **0.05%** at $20M+ market cap
- Fee distribution: up to 10 wallets; transferable coin ownership; revocable update authority

**PumpSwap post-graduation revenue:**
- 0.05% of every PumpSwap transaction → token creator (50% of protocol's 0.1% cut)
- Creators earned $2M in first 24 hours after fee model launched (September 2025)

**Token creation cost:** Free (first buyers pay the ~$2 creation cost via slightly higher bonding curve entry price)

**Creator reward summary:** 0.5 SOL on graduation + 0.05%–0.95% trading fees (dynamic, ongoing)

### bags.fm Mechanics (MEDIUM confidence)

**Underlying tech:** Meteora Dynamic Bonding Curve (DBC) — fully on-chain, configurable bonding curve

**Graduation:** Configurable `migrationQuoteThreshold` (minimum 750 USD equivalent for keeper auto-migration)
After graduation: token migrates to Meteora DAMM V1 or V2; LP tokens may be locked for partner and creator

**Creator rewards:**
- **1% of all trading volume, forever** — permanent royalty on the creator's token
- No graduation cliff — fees accrue from first trade
- Optional: creator can share a portion with top 100 token holders as dividends (auto-distributed every 24h when ≥10 SOL accumulated)

**Social verification:** Creator links social account (Twitter, TikTok, GitHub) to claim fees.
"Get Bagged" feature: community can launch a coin using a creator's username, creator verifies ownership to claim earnings.

**Creator reward summary:** 1% of all trading volume (no market-cap scaling, flat forever)

### Head-to-Head: pump.fun vs bags.fm

| Criterion | pump.fun | bags.fm | Notes |
|-----------|----------|---------|-------|
| Creator trading fee | 0.05%–0.95% (dynamic) | 1% flat (forever) | bags.fm is higher at sustained volume |
| One-time graduation bonus | 0.5 SOL | None documented | pump.fun advantage at launch |
| Graduation threshold | ~$69K market cap (~86 SOL) | Configurable (Meteora DBC) | pump.fun is fixed; bags is flexible |
| Post-graduation DEX | PumpSwap (pump.fun owned) | Meteora DAMM | Both are established |
| Holder dividend system | Not built-in | Yes — top 100 holders, 24h auto-distribution | bags.fm advantage for loyalty features |
| LP lock behavior | LP tokens burned (permanent) | LP locked for partner + creator; LP fees claimable | bags.fm gives creator ongoing LP revenue |
| Volume/liquidity | Dominant (~80% of Solana meme launches historically) | 33.5% Jupiter market share (Jan 2026), $1B+ volume | pump.fun still leads, bags growing fast |
| Creator identity | On-chain wallet only | Social account linked | bags.fm has creator identity layer |
| Fee claim mechanism | Any time, multiple wallet splits | Social verification required first | pump.fun simpler for anonymous teams |

**Recommendation for HELIX:** pump.fun is the better fit. Reasons:
1. Higher volume → more SOL raised from bonding curve faster
2. 0.5 SOL graduation bonus
3. No social verification requirement (permissioned seed sale fits better without social identity requirement)
4. LP tokens burned = no LP management overhead
5. Dynamic fee scaling is better for a token that will achieve scale

bags.fm is better IF the team wants its holder dividend system to auto-distribute to seed token holders as a loyalty reward — but this can be built manually in HELIX.

---

## Feature Landscape

### Category 1: Seed Token Launch

#### Table Stakes (Users Expect These)

| Feature | Why Expected | Complexity | Dependencies on Existing HELIX |
|---------|--------------|------------|--------------------------------|
| Token launch page (pre-launch) | Users need a way to learn about the seed token before it goes live and understand what they're buying | LOW | None — new page in Next.js dashboard |
| Live bonding curve progress tracker | Users on every launchpad expect real-time buy progress toward graduation; missing = product looks amateur | MEDIUM | Reads pump.fun/bags on-chain program state via RPC; no HELIX Anchor changes needed |
| "How this works" explanation | Seed token buyers expect to understand: what the token is for, what happens to their SOL, what the APY boost means | LOW | None — static content |
| Wallet-gated buy button | Users expect to connect wallet and buy directly from the launchpad (or be linked to it) | LOW | Existing wallet-adapter infrastructure; buy may be external link to pump.fun |
| Transaction history / your holdings display | Buyers want to see how many seed tokens they hold and their purchase history | MEDIUM | Reads SPL token account balance; no indexer changes if using RPC directly |
| Social sharing / referral link | Every successful memecoin launch relies on organic social sharing; missing hurts growth | LOW | Existing referral system can generate links; no deep integration needed |

#### Differentiators (Competitive Advantage)

| Feature | Value Proposition | Complexity | Dependencies on Existing HELIX |
|---------|-------------------|------------|--------------------------------|
| "Proceeds fund HLX/SOL LP" narrative on launch page | Transparent funding story differentiates HELIX seed from pure memecoins; builds trust | LOW | None — copy and messaging |
| Live SOL raised counter linked to LP pool funding goal | Shows users exactly how much SOL has been raised and how close the LP funding goal is | MEDIUM | Reads bonding curve reserve account; reactive UI with polling or WebSocket |
| Creator fee tracker (transparency) | Show the community how much the creator has earned — proves skin-in-game or honesty | MEDIUM | Reads pump.fun fee vault via RPC; UI-only |
| Countdown timer to bonding curve graduation | Creates urgency; encourages early participation | LOW | Estimate based on current SOL raised + average buy rate; no Anchor changes |

#### Anti-Features

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| Custom bonding curve (build your own) | "Avoid pump.fun fees" | Building a compliant bonding curve from scratch is 4–8 weeks of Anchor development, audit risk, and liquidity fragmentation. Pump.fun's existing liquidity and volume is a massive network effect advantage. | Use pump.fun or bags.fm. Platform fees are cheap relative to build cost. |
| ICO / whitelisted presale with KYC | "Serious investors want gated access" | Adds legal complexity (potential securities concerns depending on jurisdiction), kills permissionless ethos, creates user friction, and requires infra HELIX doesn't have. | Open bonding curve is permissionless and fair. |
| Token vesting / lock for seed buyers | "Prevent dumps" | Bonding curve tokens are standard SPL tokens. Locking them requires a separate escrow contract, adds complexity, and seed buyers will avoid locked tokens. | APY boost incentive is the soft-lock mechanism — users keep tokens to maintain the boost. |

---

### Category 2: LP Pool Funding

#### Table Stakes (Users Expect These)

| Feature | Why Expected | Complexity | Dependencies on Existing HELIX |
|---------|--------------|------------|--------------------------------|
| HLX/SOL pool created on major DEX (Raydium/Meteora) | Users expect the token they hold to be tradeable; no LP = no price discovery, no exit | HIGH | New: programmatic pool creation using Raydium CPMM or Meteora DAMM SDK; requires HLX token mint authority (already a PDA in Anchor program) |
| Published pool address | Users need the pool address to verify liquidity is real | LOW | Document in frontend + on-chain announcement |
| LP tokens locked / burned | Users expect liquidity to be permanent (pump.fun sets this standard) | MEDIUM | If creating via Raydium CPMM: burn LP tokens after adding liquidity. If via Meteora DBC: use locked LP config. |
| Live LP pool stats tracker on dashboard | TVL, current price, 24h volume — users expect this on any DeFi dashboard | MEDIUM | Query DEX APIs (Raydium API, GeckoTerminal, or Birdeye) for pool stats; display in Next.js dashboard |

#### Differentiators (Competitive Advantage)

| Feature | Value Proposition | Complexity | Dependencies on Existing HELIX |
|---------|-------------------|------------|--------------------------------|
| "X SOL → LP" transparency dashboard | Show exactly how much SOL from the seed sale was used to seed the LP; verifiable on-chain | MEDIUM | Track bonding curve graduation event on-chain; display in dashboard |
| LP funding progress bar (pre-graduation) | Before graduation, show users how far the bonding curve is from generating the SOL needed for meaningful LP depth | MEDIUM | Reads pump.fun bonding curve reserve; displayed on seed launch page |
| HLX minted specifically for LP funding (allocation transparency) | Show what % of HLX supply was allocated to LP vs stakers vs team | LOW | Tokenomics documentation already exists (TOKENOMICS.md); add LP section |
| Price impact calculator | Show users expected slippage for various trade sizes against the seeded LP | MEDIUM | Use CPMM formula: price_impact = amount / (reserve + amount); frontend calculation, no Anchor changes |

#### Anti-Features

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| Protocol-owned liquidity (POL) manager | "Optimize LP positions automatically" | Concentrated liquidity management requires continuous rebalancing bots, is complex, and is out of scope for launch. | Seed with a wide initial range (CPMM constant product = infinite range). Revisit CLMM strategy post-launch. |
| Multiple DEX pools simultaneously | "More liquidity venues = more accessibility" | Splits liquidity, reduces depth at each venue, complicates monitoring. Pool creation fees apply at each venue. | One primary Raydium CPMM pool. Add more venues only when TVL justifies splitting. |
| LP incentive farming rewards | "Attract LPs with extra rewards" | Requires farming contract integration (Raydium Farm, Meteora farms), adds complexity, requires HLX token emissions above the staking program's existing inflation model. | The existing staking inflation is the incentive. Keep LP simple: just SOL/HLX CPMM, no farming. |

---

### Category 3: APY Boost System

#### Table Stakes (Users Expect These)

| Feature | Why Expected | Complexity | Dependencies on Existing HELIX |
|---------|--------------|------------|--------------------------------|
| Boost visible on dashboard | Holders of the seed token must be able to see their boost status; invisible incentives don't drive behavior | LOW | New UI component in existing Next.js dashboard; reads on-chain token balance |
| Real-time boost status (hold = active, sold = inactive) | Users expect immediate feedback; delayed status = confusion and complaints | MEDIUM | Poll SPL token account balance on-chain; no Anchor program changes needed IF boost is applied in off-chain reward calculation |
| Boost applied to HLX staking APY display | The APY shown on the dashboard must reflect the boosted rate when eligible | LOW | Modify existing APY calculation in dashboard; hook into existing T-shares display |
| Clear qualification criteria | Users must know: minimum seed token balance required, which wallet must hold it, what APY multiplier they get | LOW | Static documentation + on-chain readable config |
| Loss-of-boost notification | When a user sells their seed tokens below the threshold, they should be notified | MEDIUM | Existing push notification system can deliver this; requires monitoring seed token balance in indexer |

#### Differentiators (Competitive Advantage)

| Feature | Value Proposition | Complexity | Dependencies on Existing HELIX |
|---------|-------------------|------------|--------------------------------|
| On-chain boost verification (Anchor instruction) | Users can trustlessly verify their boost eligibility; builds trust vs off-chain-only checks | HIGH | New Anchor instruction: reads seed token ATA, checks balance ≥ minimum, sets a boost flag in a PDA account. Requires program upgrade. |
| Tiered boost levels (e.g., hold more = higher multiplier) | More nuanced loyalty rewards; encourages accumulation | MEDIUM | Additional tiers in the Anchor program or off-chain; complexity scales with tier count |
| Boost leaderboard | Social proof; shows top boosted stakers; encourages competition | LOW | Query from indexer/PostgreSQL; add to existing dashboard |
| "Days boosted" streak tracker | Gamification; rewards sustained holding | MEDIUM | Indexer tracks consecutive days boost was active; new schema column |

#### Anti-Features

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| Boost enforced on-chain in staking instruction | "Maximum trustlessness" | Requires passing seed token ATA as an extra account in every `stake`/`claimReward` instruction, adding CPI complexity, increasing compute usage, and requiring a program upgrade + re-audit. The boost is on the reward display, not the base T-shares formula — applying it off-chain in the dashboard is simpler and equivalent. | Check balance off-chain (indexer + RPC), display boosted APY in UI. For high-trust version: verify via signed message from wallet off-chain. Anchor on-chain version is a differentiator if resources allow. |
| Snapshot-based boost (point-in-time) | "Simpler to implement" | Point-in-time snapshots are gameable: users buy seed tokens just before snapshot and sell immediately after. Real-time continuous checking is required. | Continuous on-chain balance check (poll SPL token balance in indexer or verify at claim time). |
| Permanent boost (no loss if sold) | "Better UX, less anxiety" | Removes the economic incentive to hold. If boost is permanent after initial purchase, the seed token has no reason to be held, LP depth drops, and price collapses, making the boost meaningless. | Dynamic boost: hold = active, sell below threshold = inactive. This is the entire mechanism. |
| Boost tied to staking duration (not seed tokens) | "Simpler to implement, already have T-shares" | T-shares already implement "Longer Pays Better." Adding boost as a second duration multiplier creates confusion and dilutes the T-shares narrative. | Boost is exclusively for seed token holders. Keep it orthogonal to T-shares. |

---

## Feature Dependencies

```
Seed Token Launch (pump.fun)
    └──produces──> SOL proceeds (bonding curve graduation)
    └──produces──> Seed token (SPL token held by buyers)

SOL proceeds
    └──requires──> LP Pool Creation (Raydium CPMM)
                       └──requires──> HLX token mint (EXISTS: Token-2022 PDA in Anchor program)
                       └──requires──> SOL from bonding curve graduation (external trigger)
                       └──produces──> HLX/SOL pool address
                       └──produces──> LP tokens → must be burned

Seed token (held by buyers)
    └──enables──> APY Boost eligibility check
                       └──requires──> Seed token mint address (known after launch)
                       └──requires──> User's ATA for seed token (standard SPL)
                       └──reads from──> Existing wallet-adapter (CONNECTED wallet address)
                       └──modifies──> APY display in existing dashboard
                       └──optionally──> New Anchor instruction (boost PDA) — HIGH complexity differentiator

Seed Launch Page
    └──requires──> pump.fun/bags token launched (external)
    └──displays──> Bonding curve progress (reads pump.fun program state)
    └──displays──> "Your seed token balance" (reads SPL ATA)
    └──links to──> APY Boost status page

APY Boost display
    └──requires──> Seed token mint address (config constant after launch)
    └──reads from──> SPL token balance RPC call
    └──modifies──> Existing T-shares APY display component
    └──depends on──> Existing push notification system (for boost-lost alert)

LP Pool Tracker
    └──requires──> Pool created (LP Pool Creation complete)
    └──reads from──> Raydium API or GeckoTerminal API
    └──displays on──> Existing Next.js dashboard (new section)

Crank service (EXISTS in v2.0)
    └──no changes required for v3.0 features──> APY boost is display-layer only
```

### Dependency Notes

- **LP pool creation blocks everything downstream:** Until the seed token launches and graduates the bonding curve, there are no SOL proceeds and no LP. This is the critical path.
- **Seed token mint address is a config constant:** After launch, the seed token's mint address is known and immutable. All subsequent features (boost check, LP tracker) read from this address.
- **No Anchor program changes are strictly required** for the off-chain boost implementation. If the team chooses the on-chain Anchor boost instruction, that requires a program upgrade and is a differentiator, not table stakes.
- **Existing crank service is unaffected** — APY boost does not change the daily inflation distribution calculation. It is purely a display multiplier on the frontend.
- **Existing push notification system can deliver boost-lost alerts** with minimal new work — add a new notification type and an indexer polling job.

---

## MVP Definition

### Launch With (v3.0)

- [ ] **Seed token launched on pump.fun** — External action (pump.fun UI); launch the seed token, configure creator wallet address for fee claiming. This is the trigger for all other features.
- [ ] **Seed launch page** — Pre-launch explainer + live bonding curve progress tracker + "why this matters for HLX" narrative. Essential for organic growth.
- [ ] **LP pool created on Raydium CPMM** — After graduation: create HLX/SOL pool, add seed SOL proceeds + corresponding HLX tokens, burn LP tokens. Must be done before announcing token is live.
- [ ] **LP pool stats on dashboard** — TVL, price, volume via Raydium API. Users expect this on any DeFi dashboard.
- [ ] **Seed token balance check (off-chain)** — Read user's seed token ATA balance via RPC. Binary boost: holds ≥ minimum → boost active.
- [ ] **Boost indicator on dashboard** — Green/grey badge showing boost status. Visible on the staking dashboard next to APY display.
- [ ] **Boosted APY display** — Show `baseAPY × boostMultiplier` when seed token balance is confirmed.
- [ ] **"How boost works" documentation** — Published mechanics doc explaining seed token, LP funding, and boost system end to end. Trust requires transparency.

### Add After Launch Validation (v3.x)

- [ ] **Boost-lost push notification** — Add when indexer has been monitoring seed token balances for long enough to detect sells reliably.
- [ ] **On-chain Anchor boost instruction** — Implement if community demands trustless verification or if off-chain boost checking becomes a point of controversy.
- [ ] **Tiered boost levels** — Add after observing distribution of seed token holdings; design tiers based on real data, not speculation.
- [ ] **Boost leaderboard** — Add once there are enough boosted stakers to make a leaderboard interesting (>50 users).
- [ ] **Creator fee tracker (transparency UI)** — Add after seed token has been live for a few weeks and fee data is meaningful.

### Future Consideration (v4+)

- [ ] **LP farming incentives** — Only if TVL stagnates and the team has HLX budget to allocate to LP rewards without affecting staking inflation.
- [ ] **Additional DEX pools** — Only when TVL justifies splitting liquidity across venues.
- [ ] **"Days boosted" streak gamification** — Fun feature but not launch-critical.

---

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| Seed token launch on pump.fun | HIGH (enables everything) | LOW (external platform action) | P1 |
| Seed launch page with bonding curve tracker | HIGH (growth + trust) | MEDIUM (new page, RPC polling) | P1 |
| LP pool creation on Raydium CPMM | HIGH (makes HLX tradeable) | HIGH (SDK integration, mint authority CPI, burn) | P1 |
| LP pool stats on dashboard | HIGH (user expectation) | MEDIUM (Raydium API integration) | P1 |
| Seed token balance check (off-chain) | HIGH (enables boost) | LOW (RPC call, existing wallet-adapter) | P1 |
| Boost indicator UI | HIGH (core feature visibility) | LOW (new UI component) | P1 |
| Boosted APY display | HIGH (core feature) | LOW (modify existing APY display) | P1 |
| Transparency documentation | HIGH (trust) | LOW (writing) | P1 |
| Boost-lost push notification | MEDIUM (retention) | MEDIUM (indexer job + notification type) | P2 |
| Creator fee tracker | MEDIUM (trust/transparency) | MEDIUM (RPC polling, UI) | P2 |
| "Proceeds → LP" transparency dashboard | MEDIUM (trust) | LOW (static + one-time display) | P2 |
| On-chain Anchor boost instruction | MEDIUM (trustlessness) | HIGH (program upgrade, new instruction, tests) | P2 |
| Tiered boost levels | LOW (complexity vs value) | MEDIUM | P3 |
| Boost leaderboard | LOW (pre-scale) | LOW | P3 |
| LP farming incentives | LOW (pre-scale) | HIGH | P3 |

---

## Competitor Feature Analysis

| Feature | pump.fun | bags.fm | HELIX v3.0 Approach |
|---------|----------|---------|---------------------|
| Creator rewards | 0.5 SOL on graduation + 0.05%–0.95% trading fees | 1% of all trading volume, forever | Use pump.fun; redirect creator fees to LP funding or treasury |
| Holder dividends | None | Top 100 holders, 24h auto-distribution (from creator fee share) | Build custom: APY boost for HLX stakers who hold seed token (more aligned with staking protocol than auto-dividends) |
| LP creation | PumpSwap (auto, LP burned) | Meteora DAMM (configurable, LP locked for creator/partner) | Manual Raydium CPMM creation post-graduation; LP tokens burned for trust |
| Graduation threshold | Fixed ~$69K market cap (~86 SOL) | Configurable (Meteora DBC) | Accept pump.fun's fixed graduation threshold |
| Boost for holding | None | None | HELIX differentiator — APY boost for seed token holders in HLX staking |
| Transparency | On-chain (bonding curve is public) | On-chain (Meteora DBC is public) | Enhance: dedicated dashboard showing SOL flow from seed → LP; published mechanics doc |
| Loyalty mechanism | None | Dividend split to top 100 holders | HELIX APY boost tied to CONTINUED holding (dynamic, not snapshot) |

---

## Implementation Complexity Notes

### HIGH Complexity Items

**LP pool creation (Raydium CPMM):**
- Requires Raydium SDK v2 integration
- Must mint HLX tokens using the existing Token-2022 PDA mint authority (CPI from a new authority script, not from user wallet)
- Pool creation costs: 0.15 SOL protocol fee + ~0.002 SOL network fees for CPMM
- LP token burning: `burnChecked` SPL instruction after receiving LP tokens
- Timing: LP creation happens AFTER pump.fun graduation event — must monitor graduation on-chain
- Risk: SOL amount from graduation is known only after the bonding curve completes; HLX amount to pair must be pre-planned in tokenomics

**On-chain Anchor boost instruction (differentiator):**
- New Anchor instruction: `verify_seed_holder(ctx, wallet) -> boost_pda`
- Accounts: user wallet, seed token ATA (user's), boost state PDA (new), seed token mint (config)
- Constraint: `token_account.mint == SEED_TOKEN_MINT && token_account.amount >= MINIMUM_BALANCE`
- Boost PDA: stores `{ wallet, is_boosted, verified_at, seed_balance_snapshot }`
- Requires program upgrade (devnet first, then mainnet via Squads multisig per v2.0 runbook)
- Requires new tests in LiteSVM test suite

### MEDIUM Complexity Items

**Bonding curve progress tracker:**
- pump.fun bonding curve is a program-owned account with an AMM reserve
- Must poll the reserve account to show real-time SOL raised
- Account structure is documented via Bitquery and Chainstack; not an official pump.fun API
- Fallback: use a pump.fun unofficial API endpoint (rate limits apply)

**Boost-lost push notification:**
- New indexer cron job: poll seed token ATA balances for all known stakers
- Detect when balance drops below minimum threshold
- Trigger existing push notification infrastructure with new notification type
- Must handle: partial sells (threshold-based, not zero balance), wallet address resolution

**Boost indicator (off-chain):**
- Real-time balance check using `getTokenAccountBalance` RPC method
- ATA derivation: `PublicKey.findProgramAddressSync([wallet.toBuffer(), TOKEN_PROGRAM.toBuffer(), SEED_MINT.toBuffer()], ASSOCIATED_TOKEN_PROGRAM)`
- Polling interval: 30s is sufficient (balance changes are user-initiated)
- Edge case: wallet has no ATA at all (never bought seed token) — treat as `balance = 0`, boost inactive

### LOW Complexity Items (build quickly)

- Seed launch page (static + one RPC call for progress)
- Boost indicator UI component (binary green/grey badge)
- Boosted APY display (multiply existing APY by boost factor)
- LP pool stats (one API call to Raydium API or GeckoTerminal)
- Transparency documentation (writing)
- Social sharing links (reuse existing referral system)

---

## Sources

- pump.fun creator fee announcement (September 2025 — Project Ascend): https://blockworks.co/news/pumpdotfun-fee-model
- pump.fun creator fee sharing update (January 2026): https://bravenewcoin.com/insights/pump-fun-introduces-creator-fee-sharing-system-to-rebalance-platform-incentives
- pump.fun graduation mechanics: https://smithii.io/en/graduate-token-pump-fun/
- pump.fun PumpSwap creator revenue: https://www.blocmates.com/news-posts/pump-fun-s-dex-pumpswap-launches-0-05-creator-fee-on-transactions
- pump.fun bonding curve SOL amounts: https://x.com/pumpdotfun/status/1821699366630879383
- bags.fm creator monetization: https://dev.to/sivarampg/bagsfm-the-solana-launchpad-thats-changing-creator-monetization-4g7n
- bags.fm volume stats: https://www.dlnews.com/articles/defi/pump-fun-rival-bags-secures-1bn-user-trading-volume/
- Meteora DBC bonding curve configs: https://docs.meteora.ag/developer-guide/guides/dbc/bonding-curve-configs
- Raydium CPMM pool creation: https://docs.raydium.io/raydium/pool-creation/pool-types-overview
- Raydium pool creation fees: https://docs.raydium.io/raydium/pool-creation/pool-creation-fees (CPMM: 0.15 SOL; CLMM: ~0.1 SOL)
- pump.fun token lifecycle (Bitquery): https://docs.bitquery.io/docs/blockchain/Solana/Pumpfun/pump-fun-to-pump-swap/
- Curve Finance veCRV boost mechanics (APY boost pattern reference): https://resources.curve.finance/vecrv/overview/

---

*Feature research for: HELIX v3.0 — seed token launch, LP pool funding, APY boost system*
*Researched: 2026-03-04*

# Pitfalls Research

**Domain:** Solana staking protocol — seed token launch, LP pool funding, loyalty-based APY boost system
**Researched:** 2026-03-04
**Confidence:** HIGH (program structure verified against HELIX codebase; launchpad mechanics verified via official Raydium docs and pump.fun/PumpSwap announcements; security patterns from Solana audit literature)

---

## Critical Pitfalls

### Pitfall 1: Seed Token Balance Verification Accepts Non-ATA Token Accounts

**What goes wrong:**

The boost eligibility check passes a user-provided token account address to verify seed token ownership, but does not enforce that the account is the user's Associated Token Account (ATA). An attacker creates a second token account holding the required seed balance, uses it for verification, then transfers the seed tokens to a third wallet — keeping the boost while no longer holding the tokens.

**Why it happens:**

SPL Token allows any wallet to have multiple token accounts per mint. Programs that check "does this account have balance > X?" without also verifying `account.owner == user.key()` and `account == get_associated_token_address(user, seed_mint)` can be tricked. A user-supplied `token_account` that passes the `InterfaceAccount<TokenAccount>` deserialization is still valid — it just may not be the user's actual account. By design, ATAs enforce a one-to-one relationship between wallet and mint. Checking the ATA specifically, not an arbitrary account, closes this vector.

Anchor's `associated_token::authority = user` constraint DOES enforce ATA derivation when used on an account with `init` or `init_if_needed`, but on a read-only account it only checks that the existing account's authority field matches — not that the address is the canonical ATA.

**How to avoid:**

In the Anchor account struct, constrain the seed token account to the canonical ATA using an address constraint:

```rust
#[account(
    associated_token::mint = seed_mint,
    associated_token::authority = user,
    associated_token::token_program = token_program,
)]
pub user_seed_token_account: InterfaceAccount<'info, TokenAccount>,
```

This enforces that the account address equals `get_associated_token_address(user, seed_mint)`. Do NOT use a bare `token_account` without this derivation constraint.

**Warning signs:**

- Boost check instruction accepts a user-provided token account pubkey with no address constraint
- Tests only verify the happy path (user has seed tokens in their ATA), not the attack path (different token account)
- LiteSVM test suite has no test case: "user provides non-ATA account with seed balance"

**Phase to address:** Phase 1 (Anchor program — boost eligibility instruction). The constraint must be in the first program instruction that reads seed token balance for eligibility.

---

### Pitfall 2: Boost Gaming via Flash Loan or Same-Transaction Transfer

**What goes wrong:**

A user borrows seed tokens (or receives them from a friend), calls the boost activation instruction, then returns the tokens in the same or subsequent transaction. The on-chain check sees the balance at the moment of verification and grants the boost — but the user never actually held the tokens.

On Solana, flash loans execute borrow + action + repay within a single transaction. If the boost check is a one-time activation that stores a flag (`is_seed_holder: true`) in the stake account, a user can borrow seed tokens, activate the boost, repay them, and retain the boost indefinitely.

**Why it happens:**

Developers implement "boost activation" as a write-once flag rather than as a real-time balance requirement per claim. Once the flag is set, nothing re-checks the balance. Flash loans are native on Solana — the Solend/marginfi flash loan programs are permissionless and widely accessible. A user with enough seed tokens borrowed for one slot can permanently activate a boost.

**How to avoid:**

Do NOT implement boost as a write-once flag. Instead, verify the balance **at claim time, every claim**:

```rust
// In claim_rewards instruction — check seed balance DURING the claim, not at activation
let seed_balance = ctx.accounts.user_seed_token_account.amount;
let boost_eligible = seed_balance >= SEED_BOOST_THRESHOLD;

let loyalty_bonus = if boost_eligible {
    calculate_loyalty_bonus_with_seed_multiplier(...)
} else {
    calculate_loyalty_bonus(...)
};
```

This makes the boost dynamic: users who sell their seed tokens automatically lose the boost on their next claim, without any separate "deactivation" step. No flash loan can help because the seed account balance must be > 0 at the moment `claim_rewards` executes.

**Warning signs:**

- `StakeAccount` has a `seed_boost_active: bool` field that is set at activation and never re-checked
- No LiteSVM test case: "user claims rewards with seed balance = 0 after having had it"
- Boost activation is a separate instruction from claim — this pattern invites one-time checks

**Phase to address:** Phase 1 (Anchor program). The claim_rewards instruction must pass `user_seed_token_account` as an additional read-only account and check balance inline. The existing `claim_rewards.rs` can be extended — no new instruction needed.

---

### Pitfall 3: Raydium CPMM Rejects HLX Token Due to Unsupported Token-2022 Extensions

**What goes wrong:**

HLX uses Token-2022 (confirmed in `PROJECT.md` and the Anchor program). When creating the HLX/SOL liquidity pool on Raydium CPMM, the pool creation transaction fails silently or with a cryptic error because HLX has extensions that Raydium's CPMM does not support.

Raydium CPMM only supports three Token-2022 extensions: Transfer Fees, Metadata Pointer, and Metadata. All other extensions — Permanent Delegate, Non-Transferable, Default Account State, Confidential Transfers — block pool creation. If HLX uses any unsupported extension, the LP pool cannot be created without modifying the token.

Additionally, Raydium requires the freeze authority to be **revoked** before pool creation (for SPL tokens and Token-2022 alike). If the HLX mint PDA still has an active freeze authority, pool creation will fail.

**Why it happens:**

HELIX uses a PDA mint authority (`MINT_AUTHORITY_SEED`), which is a Token-2022 feature. Developers assume any Token-2022 feature is supported by DEXes, but CPMM support for Token-2022 extensions is selective and extensions like Non-Transferable are explicitly blocked.

The freeze authority issue is easy to miss: Anchor programs don't always explicitly set `freeze_authority = None` during initialization, so it may default to the PDA or the deployer keypair.

**How to avoid:**

Before attempting LP pool creation:

1. Run `spl-token display <HLX_MINT>` on mainnet to see all extensions and current authorities.
2. Verify `freeze_authority: None` — if not None, call `spl-token authorize <MINT> freeze --disable` from the mint authority PDA (requires a Squads multisig transaction if authority has been transferred).
3. Confirm the only extensions on HLX are from the allowed set: Transfer Fees, Metadata Pointer, Metadata. Reject or remove any other extensions before pool creation.
4. Test pool creation on devnet first with the exact same HLX mint configuration that will be used on mainnet.

**Warning signs:**

- Pool creation transaction fails with `0x1` or a token extension error
- `spl-token display` shows freeze authority is not None
- Raydium UI shows the token as unsupported or grays out the pool creation button

**Phase to address:** Phase 2 (LP pool creation). Add a pre-flight checklist: mint authority audit, extension audit, and devnet pool creation test before mainnet.

---

### Pitfall 4: Wrong Initial Seed Ratio Sets a Manipulable Launch Price

**What goes wrong:**

When creating the HLX/SOL Raydium CPMM pool, the initial price ratio (HLX tokens deposited ÷ SOL deposited) sets the launch price. If too many HLX tokens are deposited relative to SOL, the initial price is artificially low and early buyers can drain SOL from the pool immediately (sandwich attack at pool creation). If too little HLX is deposited relative to available supply, the initial price is too high and the pool is vulnerable to immediate sell pressure crashing the price.

The critical moment is the pool creation transaction: sandwiching bots watch the mempool for CPMM pool creation transactions and submit buy orders at the exact same slot.

**Why it happens:**

Developers calculate the SOL amount raised during the seed launch (e.g., from pump.fun bonding curve graduation: ~86 SOL), but fail to also account for:
- The initial token/SOL ratio determines the market cap at launch — not just price
- Raydium CPMM pools are created with the exact ratio as deposited, which immediately becomes the spot price
- Bots have been running on Solana mainnet since 2023 that specifically snipe new pool creations

**How to avoid:**

1. Calculate the pool ratio before pool creation: `initial_price = SOL_deposited / HLX_deposited`. Document this calculation publicly as part of the transparency requirement.
2. Use Raydium's delayed start feature: set `start_time` to 10–30 minutes after pool creation. This prevents bots from trading before you can announce the launch.
3. Do NOT use `skipPreflight: false` for the pool creation transaction — simulate it first to confirm the exact amounts.
4. Consider using Raydium LaunchLab (the protocol's own token launch product) if it supports HLX's parameters — it handles timing and initial ratio in a single atomic transaction.

**Warning signs:**

- No simulation step before pool creation transaction
- Pool start time set to "immediately" (no delay)
- Initial ratio calculated from seed launch proceeds only, without checking it against the planned token price

**Phase to address:** Phase 2 (LP pool creation). The ratio must be calculated and documented before the mainnet transaction is submitted. Devnet simulation is mandatory.

---

### Pitfall 5: Creator Reward SOL Cannot Be Extracted If the Receiver Wallet Is Wrong

**What goes wrong:**

pump.fun and PumpSwap associate creator reward payments with the wallet address that created the token on-chain. If the creator used a throwaway wallet (e.g., a fresh dev wallet used only to deploy) rather than the team's operational wallet, the 0.5 SOL graduation reward and the ongoing 0.05% trading fee revenue are locked to that throwaway address — and the creator cannot redirect them later.

Similarly, if the pool creation transaction on PumpSwap is handled by a migration bot (automatic on graduation), the `Pool::creator` PDA is derived from the base mint and the creating program, not the human's wallet. Claiming these fees requires knowing the canonical PDA derivation.

**Why it happens:**

Developers test token creation on a dev keypair, then launch mainnet using the same keypair for speed. The reward logic is tied to the on-chain creator field, which is the signer of the token creation transaction. The address cannot be changed post-creation. On PumpSwap, creator fees flow to "canonical" pools only — pools created by the pump.fun migrate instruction. Third-party pool creation (creating a Raydium pool independently) does NOT receive PumpSwap creator fees.

**How to avoid:**

1. Before launching the seed token, decide the receiving wallet. This must be the team's multisig or a funded operational wallet — not a dev keypair.
2. Test the claim flow on devnet: verify that the creator wallet address actually receives fee payments when simulating a token graduation.
3. If using pump.fun's automatic PumpSwap migration for the seed token, understand that the 0.05% creator fee is paid to the `Pool::creator` derived from the pump.fun migrate instruction — verify the claim mechanism in pump.fun's docs before launch.
4. If creating a separate Raydium pool with SOL proceeds (the HELIX v3.0 design), understand that this pool does NOT receive PumpSwap creator revenue. The two revenue streams are separate.

**Warning signs:**

- Seed token created with a keypair that has no established operational security (fresh wallet, no multisig)
- No creator fee claim test before mainnet launch
- Assumption that "Raydium pool = same revenue as PumpSwap pool" — they are different

**Phase to address:** Phase 1 (seed launch planning). The creator wallet decision is irreversible once the token is deployed.

---

### Pitfall 6: APY Boost Percentage Not Minted — Only Announced

**What goes wrong:**

The boost is displayed prominently in the dashboard ("Seed holders get +20% APY") but the underlying `claim_rewards` instruction does not actually mint more tokens for seed holders. The boost exists only in the frontend display or in off-chain calculations, not in on-chain token minting.

This is the most trust-destroying possible outcome for a project with transparency as an explicit goal — users discover their rewards were not boosted on-chain by auditing their actual received amounts vs the displayed APY.

**Why it happens:**

Adding the boost to the frontend is fast (just multiply the displayed number). Adding it to the on-chain program requires: (1) passing the seed token account as an additional account in `ClaimRewards`, (2) modifying the `claim_rewards` instruction logic to check balance and apply a multiplier, (3) the multiplier must cause an actual increase in `total_rewards` before the `mint_to` CPI call. Developers ship the frontend display first and defer the on-chain implementation, then forget to implement it before launch.

**How to avoid:**

The on-chain boost must be implemented before the frontend claims it exists. The test suite must include:

```rust
// Test: claim with seed tokens → more rewards minted than without
#[tokio::test]
async fn test_seed_boost_increases_mint_amount() {
    // Setup: two identical stakes, one with seed tokens, one without
    // Assert: seed holder receives > non-seed holder
}
```

The `RewardsClaimed` event already emits `amount`. Verify in the test that the emitted amount differs between seed and non-seed holders.

**Warning signs:**

- Frontend shows boosted APY before the Anchor program has been upgraded to implement the boost
- No LiteSVM test comparing mint amounts between seed holder and non-holder for identical stakes
- `claim_rewards.rs` has no reference to a seed token account or boost multiplier

**Phase to address:** Phase 1 (Anchor program). The on-chain boost implementation must be complete and tested before any frontend boost display is shipped.

---

### Pitfall 7: Crank Service Breaks After Program Upgrade (Instruction Discriminator Change)

**What goes wrong:**

The v3.0 Anchor program upgrade adds new instructions (boost eligibility check, potentially new accounts on existing instructions). After deploying the upgraded program, the existing crank service continues using the old IDL. If the upgrade modified account ordering on `crank_distribution` (even adding an optional account), the discriminator or account validation fails and every crank attempt is rejected on-chain.

**Why it happens:**

Adding parameters to an existing Solana instruction is NOT backwards compatible. If the new program version adds a required account to `CrankDistribution<'info>` (e.g., a seed mint account for tracking), the crank service's built-from-old-IDL transaction will fail with `AccountNotFound` or an `InvalidAccountData` error because it passes the wrong number of accounts.

Anchor instruction discriminators are stable if the instruction name doesn't change, but the account list is validated positionally. Any new required account in the struct changes what the crank service must pass.

**How to avoid:**

1. Do NOT add required accounts to `CrankDistribution<'info>`. The crank instruction must remain independent of seed token logic.
2. If new accounts are needed for any reason, add them as optional (use `Option<>` and check `remaining_accounts` in the handler, not via Anchor account validation).
3. After any program upgrade, update the IDL in `services/crank/` BEFORE restarting the crank service.
4. Add a devnet smoke test that runs the crank service against the upgraded program before mainnet deployment.
5. The IDL is bind-mounted at runtime (per `PROJECT.md` key decisions) — this means updating the IDL file is sufficient without rebuilding the Docker image. Document this in the runbook.

**Warning signs:**

- Program upgrade adds new accounts to `CrankDistribution<'info>`
- Crank service Docker image has the old IDL baked in (violates the bind-mount design)
- No devnet test of crank + upgraded program before mainnet push
- Crank service logs `AccountNotProvided` or `InvalidAccountData` after program upgrade

**Phase to address:** Phase 1 (Anchor program design). Lock down the constraint: `CrankDistribution<'info>` accounts must not change between v3.0 and current. New v3.0 instructions (boost check, etc.) go in separate instruction handlers.

---

### Pitfall 8: LP Pool Tracker Shows Stale State — Transparency Promise Broken

**What goes wrong:**

The frontend LP pool funding tracker shows the amount of SOL in the HLX/SOL pool. The data comes from the indexer's cached state (PostgreSQL). When the indexer lags behind by 10–30 seconds (normal RPC polling delay), the tracker shows a stale balance. During the first hours of the LP launch when every SOL movement is newsworthy, users will screenshot the "wrong" number and post it as evidence of fund misuse.

This is a transparency pitfall, not a technical one — the data is accurate, but the display lag creates trust damage.

**Why it happens:**

The existing indexer polls at ~5-second intervals. Raydium LP pools are high-frequency accounts — hundreds of swaps per minute. Balance changes between polls are not reflected in the dashboard. Users compare the dashboard number to the Raydium UI number and see discrepancies.

**How to avoid:**

1. For the LP pool balance, fetch directly from the Raydium pool account via the frontend (client-side RPC call) rather than from the indexer. This gives real-time data.
2. Label the tracker with "Live on-chain data" and show the block height / slot of the last fetch. This sets expectations correctly.
3. Link directly to the Raydium pool page for users who want to verify — do not make the dashboard the single source of truth for LP state.
4. On the transparency docs page, explain that the dashboard reads directly from the chain and show the exact Solana account addresses being read.

**Warning signs:**

- LP pool balance served from indexer PostgreSQL (polling-based, inherently delayed)
- No direct RPC call option for real-time pool state
- No slot/timestamp displayed alongside the balance

**Phase to address:** Phase 3 (frontend LP tracker). Design the tracker as a direct RPC read from day one, not as a cached indexer query.

---

## Technical Debt Patterns

Shortcuts that seem reasonable but create long-term problems.

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Implement boost as a write-once flag (`seed_boost_active: bool`) | Simpler on-chain logic, no seed account needed at claim time | Users who sell seed tokens retain boost permanently; flash loan gaming; impossible to enforce "lose boost if sold" | Never. Use real-time balance check at claim time. |
| Check seed balance in the frontend only | Zero program changes | Boost is fake — no actual extra tokens minted; discovered during audit; trust destroyed | Never for mainnet. |
| Set LP pool start time to immediate | Simpler launch sequence | Sandwich bot drains SOL at pool creation; slippage hurts actual seed holders buying in | Never on mainnet. Always set a delayed start. |
| Use the dev keypair to create the seed token | Fast to test | Creator reward SOL locked to a keypair without operational security; no multisig | Never. Use the operational multisig for mainnet. |
| Skip devnet LP creation test | Saves 2–3 hours | Token extension incompatibility discovered at mainnet launch; no recovery path | Never. Always test on devnet with the exact same token config. |
| Read LP pool state from indexer DB | Reuses existing infrastructure | Pool balance is stale by up to 5 seconds; looks wrong to users comparing to Raydium UI | Acceptable only for historical charting. Not for the live "current pool balance" display. |
| Add a new required account to `CrankDistribution<'info>` for any v3 feature | Co-locates logic | Breaks the crank service after program upgrade; missed distributions | Never. Keep crank instruction interface frozen. |

---

## Integration Gotchas

Common mistakes when connecting to external services.

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| pump.fun seed launch | Creating token with dev keypair, assuming creator fees go to a different wallet later | Creator fees are locked to the on-chain token creator address; use the operational wallet before launch |
| pump.fun graduation | Assuming graduation triggers an automatic Raydium pool with SOL proceeds | pump.fun now migrates to PumpSwap, not Raydium, by default; HELIX v3.0 requires a separate manual Raydium pool from the SOL proceeds |
| Raydium CPMM pool creation | Depositing initial liquidity without checking HLX extension compatibility first | Run `spl-token display <MINT>` on devnet and mainnet; create a test pool on devnet first |
| Raydium CPMM pool creation | Not revoking freeze authority before pool creation | Raydium requires freeze authority = None; call `spl-token authorize <MINT> freeze --disable` via PDA signer |
| Raydium LP pool start time | Setting start time to current timestamp (immediate) | Set start time to 15–30 minutes in the future; use Raydium's delayed-start feature |
| Helius DAS for seed token verification | Calling `getAssetsByOwner` to check seed token balance | Use `getTokenAccountsByOwner` with the specific mint filter — DAS queries are slower and less deterministic for balance checks; use `connection.getTokenAccountBalance` on the ATA directly |
| Existing crank service | Updating program without updating IDL in crank service first | Update IDL before program upgrade on mainnet; IDL is bind-mounted (no image rebuild needed) |
| Fastify indexer + new program events | New v3.0 instructions emit new events (`SeedBoostActivated`, etc.) but the indexer doesn't handle them | Add event handlers to the indexer for all new v3.0 events; unhandled events cause silent data gaps |

---

## Performance Traps

Patterns that work at small scale but fail as usage grows.

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| Checking seed balance via `getTokenAccountsByOwner` at claim time (server-side) | Works with 10 users; slow at 1,000 | Pass the user's ATA as an on-chain account in the instruction; check balance in the program, not via RPC | At ~100 concurrent claims per day |
| Fetching LP pool state from indexer for every page load | Works when pool is quiet; lags during high-volume periods | Client-side direct RPC call to Raydium pool account; cache for 5 seconds client-side | At sustained high pool volume (>50 swaps/minute) |
| Storing seed boost status in the stake account (write amplification) | Works with few stakes | Every `claim_rewards` call that passes the seed account account adds an account to the transaction; compute units increase | At >10 active stake accounts per user |
| No RPC rate limiting on the LP pool tracker | Dashboard loads fine; high traffic causes 429s from RPC provider | Use a cache layer (React Query with 5s staleTime) to avoid parallel RPC calls from multiple browser tabs | At ~50 concurrent dashboard visitors |

---

## Security Mistakes

Domain-specific security issues beyond general web security.

| Mistake | Risk | Prevention |
|---------|------|------------|
| Seed token ATA not constrained to canonical address in Anchor accounts | Attacker passes any token account holding seed tokens to pass the check; enables balance-sharing between multiple users | Use `associated_token::authority = user` constraint to enforce ATA derivation |
| Boost implemented as a one-time activation flag | Flash loan attack activates boost permanently with borrowed tokens | Check seed balance at every `claim_rewards` call, not at activation |
| Creator operational wallet (holder of creator fee SOL) has no multisig | Single keypair compromise = loss of all ongoing PumpSwap trading fee revenue | Use Squads multisig for any wallet that accumulates protocol revenue |
| LP pool creation transaction not simulated before mainnet | Token extension incompatibility causes failed transaction; SOL fee spent; pool not created | Simulate on devnet; simulate on mainnet before signing |
| Boost % not enforced on-chain — only in frontend display | Audit reveals boost was never real; permanent reputational damage | On-chain test suite must verify `RewardsClaimed.amount` is higher for seed holders than non-holders with identical stakes |
| Seed token amount threshold stored as a mutable config | Admin can change threshold after users have already sold below it, retroactively disqualifying them | Store threshold as a constant in the program (or as an immutable field set at initialization) |
| LP funding tracker shows direct SOL wallet balance (not pool TVL) | Users monitor the wrong account; see "funds leaving" when SOL is deposited into the pool | Track Raydium pool's SOL reserve account, not the team wallet; link to the Raydium pool page directly |

---

## UX Pitfalls

Common user experience mistakes in this domain.

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| Boost indicator shows "active" before the crank has run after seed purchase | User thinks they have the boost; first claim shows no boost (boost calculation happens at claim time based on current slot balance) | Show "boost eligible" (based on current seed balance) and "boost active on next claim" (informational); explain that claims always check current balance |
| LP tracker shows the team wallet balance (not pool TVL) | Users confuse "SOL raised" with "SOL in pool" — they're different after pool fees are collected | Display "HLX/SOL Pool TVL" (from Raydium pool reserves) and separately "SOL deposited at launch" (a fixed historical fact) |
| Seed launch page with no closing time | Users don't know when to act; no urgency; some users wait and miss the window | Display pump.fun bonding curve progress (% filled) and estimated time to graduation based on current buy rate |
| Boost displayed as "APY" when it's a reward multiplier | Users interpret "20% more APY" as absolute numbers when it's relative | Display as "1.2x reward multiplier on each claim" or "20% more tokens per claim"; show example calculation |
| Transparency docs explain mechanics but don't show on-chain proof | "Trust me, it's on-chain" is not transparency | Link to specific Solana Explorer / Solscan account addresses; embed live on-chain data directly in the docs page |

---

## "Looks Done But Isn't" Checklist

Things that appear complete but are missing critical pieces.

- [ ] **Seed boost implemented:** Frontend shows boost indicator — verify `claim_rewards.rs` actually mints more tokens for seed holders by running `cargo test -- --test-output immediate` and confirming the seed holder test emits a higher `RewardsClaimed.amount`
- [ ] **Token account validation:** Boost eligibility check passes — verify with a test that passes a non-ATA token account and confirms the instruction rejects it
- [ ] **LP pool creation:** Pool appears on Raydium UI — verify freeze authority was revoked first (`spl-token display <MINT>` shows `Freeze authority: None`)
- [ ] **LP pool start time:** Pool is created — verify it has a delayed start (not immediate); check Raydium UI for the scheduled start time
- [ ] **Creator wallet:** Seed token deployed — verify the creator address on-chain matches the team's operational multisig, not a dev keypair
- [ ] **Crank service compatibility:** Program upgraded — verify crank service still distributes successfully by checking `global_state.current_day` advances on devnet after the upgrade
- [ ] **Transparency page:** Mechanics documented — verify each claim points to a live on-chain account (Solana Explorer URL), not just a description
- [ ] **Indexer events:** v3.0 events defined — verify the indexer has handlers for all new Anchor events emitted by v3.0 instructions (grep the indexer for each new event name)
- [ ] **Boost percentage on-chain vs dashboard:** Dashboard shows "X% boost" — verify the on-chain multiplier constant matches the marketing number (not accidentally higher or lower)

---

## Recovery Strategies

When pitfalls occur despite prevention, how to recover.

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| Seed token created with wrong wallet (dev keypair) | HIGH | The creator field is immutable on-chain; no recovery path. If caught before graduation: abandon the token (it has no value yet) and relaunch with the correct wallet. After graduation: the creator fee revenue is permanently on the wrong keypair. Mitigate by immediately transferring the dev keypair's SOL to the multisig wallet. |
| LP pool created with wrong initial ratio | HIGH | Cannot change the ratio of an existing Raydium CPMM pool without removing all liquidity. Remove liquidity immediately (if LP tokens are held), close the pool, recalculate the ratio, and create a new pool. If LP tokens were burned at creation, there is no recovery — the pool's spot price is set by the market from that point. |
| Raydium rejects HLX due to extension incompatibility | MEDIUM | If the incompatible extension is Freeze Authority: revoke it (authority still held by team multisig), retry pool creation. If the incompatible extension is permanent (e.g., Non-Transferable): the current HLX token cannot be listed on Raydium CPMM; consider Orca as an alternative. |
| Boost flag implemented instead of real-time check — flash loan gaming detected | HIGH | Requires program upgrade to replace the flag with real-time balance check. Existing boosted positions that gamed the system cannot be clawed back (tokens already minted). Disclose the issue transparently; upgrade the program; communicate timeline to the community. |
| Crank service fails after program upgrade (IDL mismatch) | LOW | Update the IDL file in `services/crank/` (bind-mounted, no image rebuild needed); restart the crank service. The on-chain catch-up logic (`distribute_pending_inflation` with `days_elapsed > 1`) handles any missed distributions automatically. |
| LP pool tracker shows wrong balance (indexer lag during high-volume period) | LOW | Switch the LP balance display to a direct client-side RPC call (React Query + `connection.getAccountInfo`); redeploy frontend. No on-chain changes needed. |
| Boost % in on-chain constant does not match marketing (e.g., 20% marketed, 15% implemented) | MEDIUM | Program upgrade required to change the constant. If the error favors users (20% implemented, 15% marketed): document the user-favorable discrepancy, do not downgrade. If the error disfavors users (15% implemented, 20% marketed): upgrade the program immediately, communicate the fix and retroactively calculate the shortfall for any users who already claimed. |

---

## Pitfall-to-Phase Mapping

How roadmap phases should address these pitfalls.

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| Non-ATA seed token account accepted for boost check | Phase 1: Anchor program | LiteSVM test: pass non-ATA account → instruction returns `InvalidTokenAccount` or equivalent error |
| Flash loan / one-time activation gaming | Phase 1: Anchor program | LiteSVM test: stake account has no `seed_boost_active` flag; `claim_rewards` with zero seed balance returns unbosted amount |
| Raydium CPMM Token-2022 extension incompatibility | Phase 2: LP pool creation | `spl-token display <MINT>` on devnet shows only allowed extensions; devnet CPMM pool created successfully |
| Wrong initial LP price ratio / no delayed start | Phase 2: LP pool creation | Ratio documented in spreadsheet before submission; Raydium UI shows delayed start time ≥ 15 min |
| Creator reward SOL locked to wrong wallet | Phase 1: Seed launch planning | On-chain token creator address verified to match team multisig before mainnet launch |
| Boost display without on-chain implementation | Phase 1: Anchor program | `cargo test` suite includes a test verifying higher `RewardsClaimed.amount` for seed holders; test must pass before frontend boost display ships |
| Crank service breaks after program upgrade | Phase 1: Anchor program design | `CrankDistribution<'info>` account list unchanged in v3.0; devnet crank smoke test passes after program upgrade |
| LP tracker shows stale/wrong data | Phase 3: Frontend | LP pool balance uses direct client-side RPC call; slot number displayed alongside balance; Solana Explorer link present |
| Transparency claims not verifiable | Phase 3: Documentation | Each "on-chain" claim in the transparency docs has a linked Solana Explorer URL pointing to the specific account; live data embedded, not screenshots |

---

## Sources

- [Sec3: Two Caveats of the SPL Associated Token Account](https://www.sec3.dev/blog/two-caveats-spl) — ATA validation must enforce address derivation, not just owner/mint match — MEDIUM confidence
- [Solana Security Checklist — Zealynx](https://www.zealynx.io/blogs/solana-security-checklist) — missing owner check is the most common Solana vulnerability across 50+ audits — MEDIUM confidence
- [Raydium Token-2022 Support announcement (Raydium Medium)](https://raydium.medium.com/raydium-support-for-token-2022-932f9fae966b) — supported extensions: Transfer Fees, Metadata Pointer, Metadata only; blocked: Permanent Delegate, Non-Transferable, Default Account State, Confidential Transfers — HIGH confidence
- [Raydium pool creation FAQ](https://docs.raydium.io/raydium/pool-creation/pool-creation-faq) — freeze authority must be revoked for pool creation — HIGH confidence (official docs)
- [PumpSwap Creator Fee Implementation — DeepWiki](https://deepwiki.com/pump-fun/pump-public-docs/4.2-pumpswap-creator-fee-implementation) — creator fees tied to `Pool::creator` PDA from the pump.fun migrate instruction; third-party pools do not receive creator fees — MEDIUM confidence
- [pump.fun X post: 0.5 SOL creator reward on bonding curve completion](https://x.com/pumpdotfun/status/1821699366630879383) — graduation reward tied to token creator address — HIGH confidence
- [PumpSwap revenue-sharing for creators — The Block](https://www.theblock.co/post/354038/pumpswap-revenue-tokens) — 0.05% of trading volume paid to creators of "canonical" pools — HIGH confidence
- [Serial Rug Deployers on Pump.fun — Medium](https://medium.com/@abubakarabdulfattah120/serial-rug-deployers-on-pump-fun-a-deep-dive-into-solanas-meme-coin-laundromat-a57ddda190cc) — 98.6% of pump.fun tokens collapse; rug patterns documented — MEDIUM confidence (community analysis)
- [Formfunction: Backwards Compatible Solana Program Changes](https://formfunction.medium.com/how-to-make-backwards-compatible-changes-to-a-solana-program-45015dd8ff82) — adding args to existing instruction breaks backwards compatibility; create `ix_v2` instead — MEDIUM confidence (403 on fetch, content described in Solana developer forums)
- [Solana flash loan — marginfi vulnerability analysis](https://blog.asymmetric.re/threat-contained-marginfi-flash-loan-vulnerability/) — flash loans execute within a single transaction; any one-time balance check can be gamed — HIGH confidence
- [Nirvana $3.5M flash loan exploit — The Block](https://www.theblock.co/post/159975/solana-stablecoin-nirvana-sinks-90-amid-3-5-million-flash-loan-exploit) — real-world example of flash loan draining a Solana protocol — HIGH confidence
- HELIX codebase: `programs/helix-staking/src/instructions/claim_rewards.rs` — existing loyalty bonus implementation; `apply_loyalty_multiplier` is the extension point for seed boost — HIGH confidence
- HELIX codebase: `programs/helix-staking/src/instructions/crank_distribution.rs` — `CrankDistribution<'info>` account struct; confirmed permissionless; no seed-related accounts — HIGH confidence
- HELIX codebase: `programs/helix-staking/src/state/stake_account.rs` — no `seed_boost_active` flag exists (correct); confirms boost must be computed dynamically — HIGH confidence
- HELIX codebase: `PROJECT.MD` — Token-2022 with PDA mint authority confirmed; freeze authority implications follow — HIGH confidence

---

*Pitfalls research for: HELIX v3.0 — seed token launch, LP pool funding, APY boost system*
*Researched: 2026-03-04*

<claude-mem-context>
# Recent Activity

<!-- This section is auto-generated by claude-mem. Edit content outside the tags. -->

*No recent activity*
</claude-mem-context>

# Solana Token Launchpad Comparison

**Project:** HELIX v3.0 Seed Launch
**Purpose:** Select optimal launchpad for seed token launch to fund HLX/SOL LP pool
**Researched:** 2026-03-04
**Overall confidence:** MEDIUM-HIGH (official docs + multiple corroborating sources; some Bags.fm specifics LOW due to sparse official documentation)

---

## Context for This Research

HELIX is launching a **seed token** — not a meme coin. The goals are:
1. Raise SOL via bonding curve (funds HLX/SOL LP)
2. Maximize SOL returned to creator (not lost to platform fees)
3. Maintain credibility with potential stakers who will evaluate this project seriously
4. Programmatic tracking capability (APY boost verification requires on-chain data access)
5. Token holders earn an APY boost — so the token has ongoing utility, not just speculation

This is an unusual use case for these platforms. Meme launchpads are optimized for speculation, but the creator rewards and LP graduation mechanics are directly relevant to HELIX's goal.

---

## Platform Overview

| Platform | Launched | Bonding Curve Infra | LP Destination | Market Share (early 2026) |
|----------|----------|---------------------|----------------|---------------------------|
| **pump.fun** | Jan 2024 | Custom (pump program) | PumpSwap (own DEX) | ~50-91% (fluctuates) |
| **LetsBONK / bonk.fun** | Apr 2025 | Raydium LaunchLab | Raydium CPMM | ~3-42% (fluctuates) |
| **bags.fm** | 2024 | Meteora DBC | Meteora DAMM v1/v2 | ~6-33% |
| **Raydium LaunchLab** | Apr 2025 | Own (CPMM-backed) | Raydium CPMM/AMMv4 | Underlying infra for many |
| **Moonshot (DEX Screener)** | Late 2024 | Custom | Raydium | Very low (~0.1% graduation) |

---

## 1. pump.fun

**Confidence:** HIGH (official docs + Pump.Fun Web Help Center verified)

### Fee Structure

**Token creation:** Free (first buyer pays ~0.025 SOL network fee)

**Before graduation (bonding curve phase):**

| Recipient | Fee |
|-----------|-----|
| Protocol | 0.95% |
| Creator | 0.30% |
| **Total** | **1.25%** |

**After graduation (PumpSwap — dynamic tiers by market cap):**

| Market Cap (SOL) | Total Fee | Protocol | Creator | LP |
|-----------------|-----------|----------|---------|-----|
| 0–420 SOL (~$88K) | 1.25% | 0.93% | 0.30% | 0.02% |
| 420–1,470 SOL (~$300K) | 1.20% | 0.05% | **0.95%** | 0.20% |
| 1,470–2,460 SOL | 1.15% | 0.05% | **0.90%** | 0.20% |
| 2,460–3,440 SOL | 1.10% | 0.05% | **0.85%** | 0.20% |
| 98,000+ SOL (~$20M+) | 0.30% | 0.05% | 0.05% | 0.20% |
| (Intermediate tiers scale down proportionally) | | | | |

**On bonding curve completion:**
- Creator receives **0.5 SOL** one-time reward when curve fills
- Migration fee: **1.5 SOL** (down from 6 SOL pre-PumpSwap; the original 6 SOL was eliminated when PumpSwap launched in March 2025)

**Key insight:** The "Project Ascend" dynamic fee model (launched Sep 2025) is highly favorable for small-cap tokens. A token at $88K–$300K market cap earns **0.95% creator fee per trade** — far more than the old flat 0.05%.

### Bonding Curve Mechanics

- **Supply:** 1 billion tokens total; ~800 million sold on bonding curve
- **Curve shape:** Step function (effectively linear segments)
- **Graduation threshold:** ~85–86 SOL raised (~$69K–$100K market cap at current SOL prices)
- **Graduation rate:** ~1.3% of all launched tokens
- **On graduation:** Automatic migration to PumpSwap; LP seeded immediately
- **Token authorities:** Mint authority null (no inflation), freeze authority revoked, update authority revoked at mint — trustless by design

### LP Destination

**PumpSwap** — pump.fun's own DEX, launched March 2025. Tokens no longer go to Raydium.

PumpSwap fee structure post-graduation:
- 0.20% to LPs
- 0.05% to protocol
- 0.05% to creator (base; scaled by "Project Ascend" dynamic tiers above)

### Creator Revenue Share System (Jan 2026 Update)

- Fee distribution to **up to 10 wallets** (split percentages)
- Ownership transfer capability
- Update authority revocation after launch
- Community Takeover (CTO) admins can also assign fee percentages

### API / SDK Availability

**Official:** pump.fun has a public GitHub (`pump-fun/pump-public-docs`) with IDL and program documentation. No official REST API.

**Third-party (MEDIUM confidence):**
- **PumpPortal** (`wss://pumpportal.fun/api/data`) — WebSocket for real-time new token events, graduations, whale alerts
- **Moralis** — token metadata, real-time prices, pairs data
- **Bitquery** — full lifecycle tracking from bonding curve through PumpSwap
- **pumpdev.io** — REST API + WebSocket, buy/sell, token creation, Jito bundles (0.25% commission)

**Community SDKs:** Multiple unofficial TypeScript SDKs on GitHub (e.g., `nirholas/pump-fun-sdk`, `bilix-software/pump-fun-token-launcher`)

**Assessment for HELIX:** Sufficient ecosystem for programmatic tracking. Can monitor bonding curve progress, graduation events, and post-graduation volume via third-party APIs. No official SDK but community tools are mature.

### Reputation / Community Trust

**Mixed.** pump.fun is the most established and highest-volume platform (~$800M+ lifetime revenue as of Sep 2025), but carries significant reputation risk:

- **98.6% of tokens** on the platform are classified as rug pulls or fraud (Solidus Labs report, May 2025)
- Active lawsuit: accused of operating an "illegal meme coin casino" responsible for $4B–$5.5B in retail losses
- MEV scandal (Dec 2025): lawsuit involving Jito Labs, Solana Foundation expanded
- Livestream content controversies led to boycott threats
- X account hacked to promote fake PUMP token

**Bottom line for HELIX:** High liquidity and distribution, but associating HELIX with pump.fun may undermine the "serious protocol" narrative. HELIX stakers evaluating the project may view a pump.fun launch negatively.

---

## 2. LetsBONK.fun / bonk.fun

**Confidence:** MEDIUM (multiple sources agree on core mechanics; some specifics unverified from official docs)

### Fee Structure

**Token creation:** Free

**Bonding curve trading:**

| Recipient | Fee |
|-----------|-----|
| Platform + BONK ecosystem | ~0.70% |
| Creator (revenue share) | **0.30%** (approx) |
| **Total swap fee** | **1.00%** |

Fee allocation from the 1%:
- ~40% → Platform development
- ~30% → BONKsol validator (network support)
- Remainder → BONK buybacks and burns

**Post-graduation (Raydium):**
- Creator earns **10% of LP volume** after migration (new tickers only)
- Creator earns **10% of curve fees** as revenue share for tokens that reached bonding — distributed every 2 weeks
- Mechanism: Fee Key NFT minted to creator wallet at graduation; grants claim rights on Raydium CPMM pool

### Bonding Curve Mechanics

- **Graduation threshold:** ~411 SOL raised (~$70K market cap at Nov 2025 SOL price)
- **Graduation rate:** ~1.06% of launched tokens
- **Curve shape:** Linear; price increases as supply is purchased
- **Supply allocation:** 75% locks into on-chain contract for price discovery; 25% reserved pool for airdrops/grants/rewards
- **On graduation:** Automatic migration to Raydium CPMM pool

### LP Destination

**Raydium** — one of Solana's largest and most liquid DEXes. This is a meaningful differentiator vs PumpSwap, as Raydium has far deeper existing liquidity and integrations (Jupiter routing, major wallets, DEX aggregators).

### API / SDK Availability

- **Bitquery** provides LetsBonk.fun API for token tracking, trades, live prices
- **Raydium SDK V2** (`@raydium-io/raydium-sdk-v2`, npm) supports LaunchLab bonding curves programmatically
- Raydium LaunchLab TypeScript SDK: `createLaunchpad`, bonding curve progress tracking via `BondingCurveProgress = 100 - ((leftTokens * 100) / initialRealTokenReserves)`

**Assessment for HELIX:** Good programmatic access via Raydium SDK V2. Standard tracking available through Bitquery, Moralis.

### Reputation / Community Trust

**Positive but ecosystem-specific.** LetsBONK was built by the BONK community with Raydium partnership. Community perception is generally more positive than pump.fun — aligned with BONK ecosystem values rather than pure speculation culture. However, it's still fundamentally a meme coin launchpad.

Market share peaked at 55.8% in July–August 2025 before collapsing; pump.fun reclaimed dominance. As of early 2026, competition between the two is ongoing.

---

## 3. bags.fm

**Confidence:** MEDIUM (multiple sources; official docs sparse on exact numbers; core model well-documented)

### Fee Structure

**Token creation:** Free

**Trading fee (bonding curve + post-graduation):**

Total trading fee: **1%** on all volume throughout the token lifecycle

Meteora DBC fee distribution breakdown (underlying infrastructure):
- **80%** → Partner (bags.fm) and/or creator split
- **20%** → Meteora protocol fee
- Of that 20%: referral hosts (Jupiter, bots, etc.) can take a cut

Bags.fm creator split from the 80% partner share:
- Creator default minimum: **10% of fees** (configurable up to 90%)
- A designated social account (Twitter, TikTok, GitHub, Kick) can receive the fee, claimable after verification
- Creator can set any collaborator's share up to 90% of the 80% partner cut

**Post-graduation:**
- LP tokens locked for partner AND creator on Meteora DAMM v1/v2
- Both can claim fees from locked LP proportionally (ratio set by partner config)
- Meteora added "Creator Trading Fee Sharing" — creators earn fees immediately post-launch, no waiting for graduation

**Effective creator take:** The 1% total × (creator % of 80% partner share). If creator keeps 10% (minimum default), that's 0.08% of volume. At maximum (90%), that's 0.72% of volume. The actual default for project-launched tokens appears to be flexible and configurable at launch.

**Key differentiator:** Bags pays throughout the ENTIRE token lifecycle — bonding curve AND post-graduation — which most platforms don't do.

### Bonding Curve Mechanics

- **Infrastructure:** Meteora Dynamic Bonding Curve (DBC) — fully on-chain, customizable
- **Graduation threshold:** Configurable per-launch (partner-set); not a fixed platform-wide number
- **Curve shape:** Configurable (linear, exponential, etc.) via Meteora DBC config key
- **On graduation:** Auto-migrated by Meteora keeper service to DAMM v1 or DAMM v2 pool
- **Migration fee options:** 0.25%, 0.3%, 1%, or 2% (configurable)

### LP Destination

**Meteora DAMM v1 or DAMM v2** — Meteora is a legitimate and growing Solana DEX/AMM known for concentrated liquidity and DLMM pools. Less volume than Raydium but a credible destination.

**DAMM v2 migration** (announced mid-2025): Upgrades token from bonding curve stage into "deeper, more flexible liquidity environment."

### API / SDK Availability

**Excellent — best API story of all launchpads reviewed:**

- **Official REST API** at `docs.bags.fm` with authentication via API key (`dev.bags.fm`)
- **Official TypeScript SDK**: `github.com/bagsfm/bags-sdk` (Node.js >= 18, requires API key + Solana RPC)
- SDK includes: token launch management, state management, fee management, configuration service
- API endpoints include: Create Token Launch Transaction, Create Token Info and Metadata, Get Token Launch Creators, Claim Fees from Token Positions
- **Bitquery** provides bags.fm API for blockchain-level token and trade tracking

**Assessment for HELIX:** Best official API/SDK support. The official TypeScript SDK aligns well with HELIX's Node.js/TypeScript codebase.

### Reputation / Community Trust

**Mixed.** bags.fm gained significant traction in early 2026 (second in market share at 33.5% in some snapshots) but has documented trust concerns:

- The "GAS Town" incident (Jan 2026): creator claimed $49K in fees and disappeared; community dumped immediately — illustrates the model's risk from holder perspective
- The platform is designed for anyone to launch a token FOR another person (e.g., for a creator's Twitter account) without their involvement — this permissionless tokenization can feel exploitative
- Perception from Steve Yegge's essay (Jan 2026): "once creator claims fees, holders dump" — acknowledged systemic issue
- However: for a project that has genuine utility (like HELIX's boost system), this concern is less relevant — HELIX would hold the token legitimately and use the boost mechanic

---

## 4. Raydium LaunchLab (Direct)

**Confidence:** HIGH (official Raydium docs verified)

*Note: LetsBONK.fun is built on LaunchLab. This section covers launching directly through Raydium's LaunchLab interface.*

### Fee Structure

**Platform fee:** 0.25% on all bonding curve swaps (paid to Raydium)

**Creator fees during bonding curve:** Set by platform (configurable per-integration); creators can earn a portion of trading fees in a vault, claimable anytime from Portfolio page

**Post-graduation creator rewards:**
- **10% of all LP trading fees** after graduation (opt-in)
- Mechanism: Fee Key NFT minted at graduation to creator wallet
- LP pool: 90% of LP tokens burned; 10% locked in Burn & Earn

**Graduation thresholds:**
- JustSendit mode: 85 SOL
- LaunchLab mode: Custom (minimum 30 SOL)

### Bonding Curve Mechanics

- **Graduation:** When bonding curve goal reached, liquidity migrates to Raydium CPMM pool (if fee share enabled) or AMMv4
- **Customizable:** Total fund raising target, token supply, amount sold on curve
- **Vesting:** Token vesting options available
- **Migration fee sharing:** Platforms built on LaunchLab can set their own creator fee rates

### LP Destination

**Raydium CPMM** (or AMMv4 without fee share). Full Raydium ecosystem integration including Jupiter routing.

### API / SDK Availability

**Excellent:**
- Official TypeScript SDK: `@raydium-io/raydium-sdk-v2` (npm)
- Demo repo: `raydium-io/raydium-sdk-V2-demo`
- Functions: `createLaunchpad`, bonding curve progress, buy/sell on bonding curve
- Bitquery: Raydium Launchpad API for token and trade data

### Reputation

**Strong.** Raydium is one of the most established Solana DEXes. LaunchLab was launched to compete with pump.fun after the pump.fun/Raydium split. Building on Raydium's infrastructure carries the weight of Raydium's reputation — more credible for DeFi-oriented audiences than pump.fun's meme culture.

---

## 5. Moonshot (DEX Screener)

**Confidence:** MEDIUM (multiple third-party sources; no direct official doc fetch)

### Fee Structure

**Creator fee:** **80% of platform trading fees** — highest raw creator percentage of any reviewed platform

**Graduation threshold:** ~500 SOL raised (~$63K–$73K market cap)

### Bonding Curve Mechanics

- 1 billion token supply
- Linear bonding curve
- Graduates to Raydium liquidity pool

### LP Destination

**Raydium**

### Reputation

**Poor track record.** Despite being one of the oldest launchpads (predating most competitors), Moonshot has had very low performance:
- Only 44 tokens ever graduated (0.14% graduation rate — vs 1.3% on pump.fun)
- Very low volume and community activity
- Built by DEX Screener team — good tech pedigree, but the launchpad itself has not gained traction

**Do not use for HELIX.** The low graduation rate and community activity make this a poor choice.

---

## Comparison Matrix

| Criterion | pump.fun | LetsBONK / bonk.fun | bags.fm | Raydium LaunchLab (direct) | Moonshot |
|-----------|----------|---------------------|---------|---------------------------|----------|
| **Token creation cost** | Free | Free | Free | Free | Free |
| **Bonding curve trading fee** | 1.25% total | 1.00% total | 1.00% total | 0.25% (platform) + creator | Varies |
| **Creator fee (during curve)** | 0.30% | ~0.10%–0.30% | Up to 0.72% of volume (configurable) | Platform-set | ~80% of fees |
| **Creator fee (after graduation)** | 0.05%–0.95% dynamic (Project Ascend) | 10% of LP volume | LP fee share from locked LP on DAMM | 10% of LP trading fees | 80% of fees |
| **One-time graduation bonus** | 0.5 SOL | None found | None found | None found | None found |
| **Graduation threshold** | ~85 SOL (~$69K–$100K) | ~411 SOL (~$70K) | Configurable | 30–85 SOL | ~500 SOL |
| **Migration fee at graduation** | 1.5 SOL | None (built into Raydium) | Configurable (0.25%–2%) | 0.25% platform fee | None found |
| **LP destination** | PumpSwap (own DEX) | Raydium CPMM | Meteora DAMM v1/v2 | Raydium CPMM | Raydium |
| **LP depth / ecosystem** | Moderate (PumpSwap new, growing) | High (Raydium = deep liquidity) | Moderate (Meteora growing) | High (Raydium) | Low |
| **Official API** | No (unofficial only) | No (Bitquery + Raydium SDK) | YES (docs.bags.fm + TypeScript SDK) | YES (Raydium SDK V2) | No |
| **Official TypeScript SDK** | No | Via Raydium SDK V2 | YES (github.com/bagsfm/bags-sdk) | YES (@raydium-io/raydium-sdk-v2) | No |
| **Token metadata control** | Authorities revoked at mint (trustless) | Configurable | Configurable | Configurable | Configurable |
| **Token-2022 support** | YES (create_v2 instruction) | Via Raydium LaunchLab | Via Meteora DBC | YES | Unknown |
| **Market share (2026)** | ~50–91% (dominant) | ~3–42% | ~6–33% | Underlying for bonk.fun | Negligible |
| **Credibility / trust** | Low (lawsuits, fraud rate) | Medium (BONK ecosystem) | Medium (newer, mixed) | High (Raydium brand) | Low (poor performance) |
| **Graduation rate** | ~1.3% | ~1.06% | Unknown | Unknown | ~0.14% |
| **Creator reward lifecycle** | Bonding curve + PumpSwap | Bonding curve + post-grad LP | Full lifecycle (immediate post-launch) | Bonding curve vault + post-grad LP | Unclear |

---

## Creator Reward Analysis (Which Platform Pays Most?)

For a seed token targeting ~85 SOL graduation (~$17K at $200/SOL; ~$85K at $1,000/SOL), the relevant comparison is **pre-graduation trading volume** since that's where the bonding curve action is.

### Scenario: Token reaches graduation (85 SOL raised)

Assume ~200% turnover of the curve (buyers buying and selling) = ~170 SOL in trading volume before graduation.

| Platform | Creator Fee Rate (during curve) | Creator take on 170 SOL volume |
|----------|--------------------------------|-------------------------------|
| pump.fun | 0.30% | ~0.51 SOL + 0.5 SOL bonus = **~1.01 SOL** |
| LetsBONK | ~0.10%–0.30% | ~0.17–0.51 SOL |
| bags.fm | Up to 0.72% (if 90% creator share) | **~1.22 SOL** |
| bags.fm | 0.08% (10% default) | ~0.14 SOL |
| Raydium LaunchLab | ~0.25% base (variable) | ~0.43 SOL |

**Critical caveat for bags.fm:** The creator percentage of the 1% fee is configurable between 10% and 90%. If HELIX launches via bags.fm and sets the creator share to 90%, bags.fm yields the most during the curve. But if left at the default ~10%, it yields the least. The creator must actively configure this at launch.

### Post-graduation ongoing revenue

For a seed token with moderate post-graduation volume (~1,000 SOL/month):

| Platform | Creator Fee Rate (post-grad) | Monthly creator take |
|----------|------------------------------|---------------------|
| pump.fun (Project Ascend) | 0.95% (at $88K–$300K mcap) | **~9.5 SOL/month** |
| LetsBONK | 10% of LP fees (Raydium default ~0.25%) = 0.025% | ~0.25 SOL/month |
| bags.fm | LP share from locked DAMM LP | Variable |
| Raydium LaunchLab | 10% of LP fees | ~0.25 SOL/month |

**pump.fun's Project Ascend dominates post-graduation** at the small-to-mid cap range where a seed token would sit. 0.95% creator fee per trade at $88K–$300K market cap is 10x–38x more than the 10% LP share model.

---

## Recommendation

### Recommended: pump.fun with Project Ascend

**Rationale:**

1. **Highest creator revenue at the size HELIX will be.** A seed token graduating at ~85 SOL and trading at $88K–$300K market cap earns **0.95% per trade** via Project Ascend. On $1,000 SOL monthly volume that's ~9.5 SOL/month to the creator. bags.fm at 90% creator config matches on the bonding curve but cannot match the ongoing PumpSwap rate for small-cap tokens.

2. **0.5 SOL one-time completion bonus** upon bonding curve graduation — a meaningful direct SOL payment to the creator wallet.

3. **Largest audience and distribution.** 50–91% market share means more eyeballs, higher chance of reaching graduation, more secondary market volume. Graduation rate (~1.3%) is 10x higher than Moonshot.

4. **Sufficient programmatic tracking.** PumpPortal WebSocket + Bitquery + Moralis provide the real-time data HELIX needs for the APY boost verification system. Third-party tools are mature and battle-tested.

5. **Token authorities are revoked at mint** — trustless design that HELIX's transparency narrative benefits from.

6. **Creator Fee Sharing (Jan 2026):** Fees can be split across up to 10 wallets — useful if HELIX wants to route some proceeds to a treasury.

**Mitigations for reputation risk:**

pump.fun carries reputational baggage (lawsuits, rug pull statistics). HELIX can mitigate this by:
- Publishing transparent documentation about why pump.fun was chosen (maximum liquidity, no other choice for raw creator rewards)
- Immediately documenting the seed token as a funding mechanism for HLX/SOL LP, not speculation
- Linking the token to real utility (APY boost) so it differentiates from typical meme coins on the platform
- Making all mechanics verifiable on-chain

---

### Alternative: bags.fm (if official SDK is a priority)

Choose bags.fm if:
- Official TypeScript SDK (`bags-sdk`) is important for the APY boost tracking integration
- HELIX wants the most seamless programmatic launch experience
- The team can configure creator fee share to 90% at launch (maximizing pre-graduation take)
- Meteora's DAMM destination is acceptable (less liquid than Raydium but credible)

**Weakness:** bags.fm's reputation for "creator claims fees then holders dump" dynamic may be amplified if the community doesn't understand HELIX's utility model. Needs clear pre-launch communication.

---

### Do Not Use: Moonshot, Solanium, StarLaunch

- **Moonshot:** 0.14% graduation rate (vs 1.3% on pump.fun). Dead for HELIX's purposes.
- **Solanium / StarLaunch / BullPerks:** IDO platforms requiring whitelisting, vetting, and KYC. Not self-serve. Process takes weeks to months. Designed for projects with established VCs/audits. Wrong tool for a seed token raise.
- **Raydium LaunchLab (direct):** Valid option, but LetsBONK.fun is the consumer-facing layer and has more community traffic. Going directly to LaunchLab is more technical and has less built-in discovery.

---

## Phase-Specific Implementation Notes

### For HELIX v3.0 Seed Launch

**Launch vehicle decision:** pump.fun (recommended) or bags.fm (alternative)

**Pre-launch requirements:**
- Token metadata: Name, symbol, image, description — set at launch (authorities revoked after)
- HELIX project should own the creator wallet to receive ongoing fee revenue
- Set up WebSocket listener on PumpPortal/Bitquery for real-time graduation event (triggers LP creation)

**On graduation:**
- pump.fun: 0.5 SOL sent directly to creator wallet; LP seeded on PumpSwap automatically
- The SOL raised (~85 SOL minus 1.5 SOL migration fee = ~83.5 SOL) goes to PumpSwap LP
- **Important:** HELIX's goal is to fund HLX/SOL LP, but pump.fun creates a seed-token/SOL LP, not HLX/SOL LP. The creator must separately use the SOL received (from creator fees + the 0.5 SOL bonus) to seed the HLX/SOL LP. The bonding curve SOL goes into PumpSwap for the seed token, not for HLX directly.

**Tracking for APY boost:**
- Monitor holder wallets via Helius, Moralis, or Bitquery APIs
- Check if wallet holds > 0 of the seed token (PumpSwap or bonding curve)
- Flag wallets that sold (lose APY boost) via transfer monitoring

**Creator fee collection:**
- pump.fun: Fees accumulate in creator_vault on-chain; claim from pump.fun Portfolio page or programmatically
- bags.fm: Claim via `docs.bags.fm` Claim Fees API or directly on platform

---

## Pitfalls Specific to This Use Case

### Pitfall 1: Bonding Curve May Not Graduate

**Risk:** Only 1.3% of pump.fun tokens graduate. If the seed token doesn't reach ~85 SOL, no LP is created and no HLX/SOL LP gets funded.

**Mitigation:**
- Set a low graduation threshold if using bags.fm (Meteora DBC allows custom thresholds — could set 30 SOL)
- Pre-communicate with HELIX community to drive early buys
- Consider team purchasing initial allocation to bootstrap curve (but disclose this)

### Pitfall 2: Creator SOL vs LP SOL Confusion

**Risk:** The SOL raised on the bonding curve funds the **seed token/SOL LP** (on PumpSwap or Meteora), NOT the HLX/SOL LP directly.

**Mitigation:**
- Creator receives ongoing trading fees in SOL — these accumulate and can fund HLX/SOL LP
- Document this clearly in the seed launch page: "SOL fees from seed token trading → HLX/SOL LP funding"
- The 0.5 SOL graduation bonus can seed an initial small HLX/SOL LP position immediately

### Pitfall 3: Token Authorities Already Revoked

**Risk:** pump.fun revokes mint/freeze/update authority at mint. HELIX's boost system needs to read holder balances, not modify the token. This is fine — no authority needed for read-only verification.

**No action required.** This is actually a feature for HELIX's transparency narrative.

### Pitfall 4: PumpSwap vs Raydium Liquidity Depth

**Risk:** PumpSwap (pump.fun's own DEX) is newer and has less depth than Raydium. Holders may have worse exit liquidity.

**Mitigation:**
- For a seed token that's mainly held for the APY boost, reduced secondary market depth is acceptable
- If LP depth is critical, use LetsBONK (Raydium destination)

### Pitfall 5: Creator Fee Claiming Complexity

**Risk:** Ongoing creator fees require active claiming (not auto-sent). If the HELIX team doesn't monitor and claim, fees accumulate unclaimed.

**Mitigation:**
- Set up automated fee claiming via PumpPortal/Bitquery webhook monitoring
- Claim fees weekly/monthly and publish receipts for transparency

---

## Sources

- [pump.fun Official Fee Documentation](https://pump.fun/docs/fees) — HIGH confidence
- [pump.fun Transaction Fees Help Center](https://intercom.help/pumpfun-web/en/articles/11002413-transaction-fees-on-pump-fun) — HIGH confidence
- [PumpSwap Revenue Sharing for Creators — The Block](https://www.theblock.co/post/354038/pumpswap-revenue-tokens) — HIGH confidence
- [PumpSwap 50% Fee Share — CryptoNews](https://cryptonews.com/news/pump-funs-pumpswap-to-share-50-of-fees-with-token-creators/) — MEDIUM confidence
- [Project Ascend Dynamic Fees — Blockworks](https://blockworks.co/news/pumpdotfun-fee-model) — HIGH confidence
- [pump.fun Creator Fee System — Brave New Coin](https://bravenewcoin.com/insights/pump-fun-introduces-creator-fee-sharing-system-to-rebalance-platform-incentives) — MEDIUM confidence
- [pump.fun 0.5 SOL Creator Bonus — Official X post](https://x.com/pumpdotfun/status/1821699366630879383) — HIGH confidence
- [Raydium LaunchLab Creator Fees — Official Raydium Docs](https://docs.raydium.io/raydium/launchlab/how-creator-fees-work) — HIGH confidence
- [Raydium LaunchLab For Creators — Official Docs](https://docs.raydium.io/raydium/launchlab/for-creators/creating-a-token) — HIGH confidence
- [Raydium LaunchLab TypeScript SDK — Official Docs](https://docs.raydium.io/raydium/pool-creation/launchlab/launchlab-typescript-sdk) — HIGH confidence
- [bags.fm Official API Docs](https://docs.bags.fm/) — HIGH confidence
- [bags.fm TypeScript SDK — GitHub](https://github.com/bagsfm/bags-sdk) — HIGH confidence
- [bags.fm Creator Monetization — DEV Community](https://dev.to/sivarampg/bagsfm-the-solana-launchpad-thats-changing-creator-monetization-4g7n) — MEDIUM confidence
- [BAGS Launchpad Analysis — Alea Research](https://alearesearch.substack.com/p/bags-launchpad) — MEDIUM confidence
- [BAGS Creator Economy — Steve Yegge Medium](https://steve-yegge.medium.com/bags-and-the-creator-economy-249b924a621a) — MEDIUM confidence
- [Meteora DBC Documentation](https://docs.meteora.ag/overview/products/dbc/what-is-dbc) — HIGH confidence
- [Meteora Dynamic Bonding Curve GitHub](https://github.com/MeteoraAg/dynamic-bonding-curve) — HIGH confidence
- [LetsBONK.fun Overview — Webopedia](https://www.webopedia.com/crypto/learn/lets-bonk-fun-memecoin-launchpad/) — MEDIUM confidence
- [LetsBONK graduation mechanics — Smithii](https://smithii.io/en/graduate-token-on-letsbonk/) — MEDIUM confidence
- [pump.fun vs LetsBONK market share — Dropstab](https://dropstab.com/research/crypto/pump-fun-vs-lets-bonk-tracking-market-dominance) — MEDIUM confidence
- [pump.fun reputation — Coindesk (98% fraud report)](https://www.coindesk.com/business/2025/05/07/98-of-tokens-on-pump-fun-have-been-rug-pulls-or-an-act-of-fraud-new-report-says) — HIGH confidence
- [Moonshot overview — Decrypt](https://decrypt.co/237866/pump-fun-vs-moonshot-solana-meme-coin) — MEDIUM confidence
- [Solana Launchpad Wars — Launchpad Wars article — blocmates](https://www.blocmates.com/articles/all-you-need-to-know-about-the-solana-launchpad-wars) — MEDIUM confidence
- [LetsBONK.fun API — Bitquery](https://docs.bitquery.io/docs/blockchain/Solana/letsbonk-api/) — MEDIUM confidence
- [bags.fm API — Bitquery](https://docs.bitquery.io/docs/blockchain/Solana/bags-fm-api/) — MEDIUM confidence