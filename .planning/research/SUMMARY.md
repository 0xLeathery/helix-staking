# Project Research Summary

**Project:** SolHEX
**Domain:** DeFi Staking Protocol (HEX-style time-locked staking on Solana)
**Researched:** 2026-02-07
**Confidence:** HIGH

## Executive Summary

SolHEX is a HEX-style staking protocol on Solana where users claim free tokens based on a SOL balance snapshot, lock them for 1-5555 days to earn T-shares, and receive daily inflation rewards (3.69% annual). The protocol includes bonus curves (Longer Pays Better, Bigger Pays Better), early/late unstake penalties, a Big Pay Day distribution of unclaimed tokens, a staking dashboard with analytics, and Jupiter swap integration. This is a solo-developer build targeting crypto-native users.

The recommended approach is battle-tested and well-documented: Anchor 0.31+ for the on-chain program with Token-2022, Next.js 15 for the frontend with standard Solana wallet adapters, and a lightweight Postgres-backed indexer for analytics. The architecture follows a client-to-chain pattern -- no heavy backend, just frontend, on-chain program, and a read-only indexer. The critical path runs through the Anchor program: staking mechanics, penalty logic, and T-share calculations must be correct before anything else can be built. Lazy reward distribution is recommended for MVP simplicity, deferring batched crank distribution if gas costs become problematic.

The primary risks cluster around on-chain financial math: integer overflow in u64/u128 arithmetic, precision loss in fixed-point calculations, and rounding attacks from dust stakes. These are solvable with checked math, u128 intermediates, and minimum stake enforcement, but they must be addressed from day one -- not bolted on later. The secondary risk area is the free claim mechanism (Merkle proof verification, double-claim prevention, bot sniping), which is a one-time high-stakes feature that needs careful implementation and testing. Economic risks (inflation death spiral, whale T-share manipulation) are real but primarily mitigated by faithful adherence to HEX's proven economic design.

## Key Findings

### Recommended Stack

The stack is mature, battle-tested, and has high ecosystem support. There are no bleeding-edge choices -- every component has significant production adoption in the Solana DeFi ecosystem. The one hard constraint is `@solana/web3.js` v1 (Anchor is incompatible with v2 as of Q1 2026), which is stable and not a concern.

**Core technologies:**
- **Anchor 0.31+**: On-chain program framework -- industry standard, built-in account validation, IDL generation, PDA derivation
- **Token-2022**: Token standard with metadata extension -- officially recommended, backward-compatible, 6+ security audits
- **Next.js 15 (App Router)**: Frontend framework -- dominant in Solana ecosystem, SSR for marketing, client-side for wallet interaction
- **@solana/wallet-adapter-react 0.15.36+**: Wallet connection -- ecosystem standard, multi-wallet support (use >=0.15.36 to avoid MWA bugs)
- **@solana/web3.js v1**: Blockchain client -- required by Anchor, stable, well-documented
- **Jupiter API v6**: DEX aggregation -- deepest Solana liquidity, simple REST integration
- **Helius RPC + Yellowstone gRPC**: RPC provider and streaming -- enhanced methods, priority fee API, Geyser support
- **PostgreSQL + Prisma**: Indexer data layer -- type-safe queries, migration management, works with Next.js API routes
- **Bankrun**: Smart contract testing -- fast in-process SVM testing, CPI support, clock mocking

**Version matrix highlights:**
- Anchor CLI: 0.31.0+, Rust: 1.75+ stable, Node.js: 20 LTS, Solana CLI: 1.18+
- Wallet adapter must be Client Component in Next.js 13+ (`'use client'`)
- Token-2022 requires explicit `TOKEN_2022_PROGRAM_ID` in spl-token helpers

### Expected Features

24 table stakes features across 8 categories, 21 differentiators, and 12 anti-features identified.

**Must have (table stakes):**
- Core staking lifecycle: stake, unstake, T-share calculation, penalty enforcement
- Inflation distribution: 3.69% annual, permissionless crank or lazy distribution
- Bonus curves: Longer Pays Better (0-2x over 3641 days), Bigger Pays Better (0-1x up to 150M)
- Free claim: SOL snapshot verification via Merkle proof, one-time claim per address
- Big Pay Day: unclaimed token distribution to T-share holders after claim period
- Dashboard: wallet connection, view stakes, create/end stakes, penalty calculator, core analytics (T-share price, total staked, pending rewards)
- Token infrastructure: Token-2022 mint with PDA authority
- Jupiter swap integration: embedded trading widget

**Should have (differentiators):**
- Advanced analytics: T-share price history chart, daily payout history, supply breakdown, stake distribution histogram
- Leaderboards: largest stakes, most T-shares, longest stakes, whale tracker
- APY estimator and projected earnings calculator
- Interactive staking simulator (demo mode, no wallet required)
- Economics explainer page with visuals
- Live on-chain verification links for all metrics

**Defer (v2+):**
- Referral system, governance/DAO, mobile native app, notification system, multi-stake wizard, NFT badges, cross-chain bridging, fiat on/off ramps, social features, custom AMM

### Architecture Approach

Three-component architecture: Anchor program (on-chain truth), Next.js frontend (client-to-chain interaction), and a lightweight indexer (read-only analytics). Data flows directionally: user -> frontend -> RPC -> Anchor program -> blockchain -> indexer -> frontend (for analytics). Staking operations go directly to chain. Analytics queries go through the indexer API. No heavy backend, no user accounts, no session management.

**Major components:**
1. **Anchor Program** -- All staking logic, state management, token operations. GlobalState PDA for protocol aggregates, per-user StakeAccount PDAs for individual stakes. Lazy reward distribution for MVP.
2. **Next.js Frontend** -- Staking UI, marketing site, analytics dashboard, wallet adapter integration, Jupiter swap. Server components for marketing, client components for wallet interaction.
3. **Light Indexer** -- Polls program events via Yellowstone gRPC or RPC signatures, parses Anchor events, stores in Postgres. Serves read-only REST API for historical charts, leaderboards, aggregated stats. Deployed on minimal infrastructure (Fly.io or DigitalOcean, $5-10/month).

**Key architecture decisions:**
- Lazy distribution over batched crank for MVP (simpler, pushes compute to user claims)
- Separate PDA per stake (not Vec in UserProfile) to avoid account size limits
- Merkle proofs stored as static JSON on CDN, root stored on-chain
- Slot-based day counting over unix_timestamp for deterministic time logic

### Critical Pitfalls

The research identified 21 pitfalls across 10 categories. The top 5 that could cause catastrophic failure:

1. **Integer overflow in financial calculations (CRITICAL)** -- Rust wraps on overflow in release mode. All T-share math, inflation calculations, and penalty logic must use `checked_mul`/`checked_div` with `overflow-checks = true` in Cargo.toml. Test with boundary values (u64::MAX, amount=1, days=5555).

2. **Fixed-point precision loss (CRITICAL)** -- No floating-point on Solana. Integer division truncates. Use u128 intermediates for all calculations, scale up before dividing, round in protocol's favor (down for withdrawals, up for penalties). Enforce minimum stake amount to prevent dust exploits.

3. **Double-claim on free tokens (CRITICAL)** -- Merkle proof replay attacks can drain the claim pool. Use `init` constraint on claim record PDAs seeded by snapshot address. Require signature from the original SOL snapshot address to prevent front-running theft.

4. **Indexer missed events / gaps (HIGH)** -- Slot skips, reorgs, and RPC issues cause indexer drift. Implement monotonic event counters on-chain, checkpoint/recovery in indexer, and periodic reconciliation against on-chain state.

5. **Inflation death spiral (CRITICAL)** -- If claim costs exceed rewards, users stop staking, causing a feedback loop. Model worst-case economics pre-launch. Solana's sub-cent transaction fees make this unlikely but monitor token price vs. gas cost ratios.

## Implications for Roadmap

Based on combined research, the build order is strongly dependency-driven. The Anchor program is the critical path -- nothing else functions without it. The free claim mechanism is the highest-risk feature. The indexer is required for analytics but not for core staking.

### Phase 1: Foundation and Token Infrastructure
**Rationale:** Everything depends on the program skeleton and token mint existing. This is pure infrastructure with no business logic risk.
**Delivers:** Anchor project scaffold, Token-2022 mint with PDA authority, GlobalState account structure, basic PDA patterns, local dev environment (Bankrun + test validator)
**Addresses:** Token infrastructure (table stakes)
**Avoids:** Rent exemption issues (calculate space upfront), Token-2022 extension initialization order

### Phase 2: Core Staking Mechanics
**Rationale:** The entire protocol's value depends on correct staking logic. This is where most CRITICAL pitfalls live. Must be built and thoroughly tested before any frontend work.
**Delivers:** Stake/unstake instructions, T-share calculation with LPB/BPB curves, lazy reward distribution, early/late penalty system, share rate tracking
**Addresses:** Core staking mechanics, penalty system, bonus curves, inflation distribution (all table stakes)
**Avoids:** Integer overflow (checked math from day one), precision loss (u128 intermediates), rounding attacks (minimum stakes), account closing attacks (flag-based withdrawal)

### Phase 3: Free Claim and Big Pay Day
**Rationale:** These are one-time mechanisms with the highest security risk. Free claim involves Merkle proof verification and bot protection. Big Pay Day requires time-weighted T-share accounting. Both must be correct before launch.
**Delivers:** SOL snapshot tooling, Merkle tree generation, on-chain proof verification, claim record PDAs, Big Pay Day pool accumulation and distribution
**Addresses:** Free claim, Big Pay Day (table stakes)
**Avoids:** Double-claim attacks (PDA-based claim records), bot sniping (snapshot address signature requirement), BPD gaming (time-weighted allocation), transaction size limits (versioned transactions for deep proofs)

### Phase 4: Frontend MVP -- Staking Dashboard
**Rationale:** With on-chain mechanics complete, users need a way to interact. The dashboard is the primary interface and depends on the program being fully functional.
**Delivers:** Next.js app with wallet adapter, stake creation/ending UI, active stakes display, penalty calculator preview, basic protocol stats (from RPC reads, not indexer)
**Addresses:** Dashboard user management, core analytics (table stakes)
**Avoids:** Blockhash expiration (retry with fresh blockhash), wallet adapter mobile bugs (version >=0.15.36)

### Phase 5: Light Indexer Service
**Rationale:** Analytics, leaderboards, and historical charts all depend on the indexer. This is a parallel concern that doesn't block staking but is required for the full product.
**Delivers:** Event polling pipeline (Yellowstone gRPC or RPC signatures), Postgres schema, checkpoint/recovery system, read-only REST API for stats, user portfolios, and chart data
**Addresses:** Indexer infrastructure (prerequisite for differentiators)
**Avoids:** Missed events (monotonic counters + backfill), reorg handling (slot-based checkpoints), clock drift (epoch-based timing)

### Phase 6: Analytics Dashboard and Jupiter Integration
**Rationale:** With the indexer running, the frontend can now display rich analytics. Jupiter swap integration is low-complexity and high-value.
**Delivers:** T-share price history chart, daily payout history, supply breakdown, APY estimator, Jupiter swap widget, timeframe selection (1d/7d/30d/all)
**Addresses:** Advanced analytics, trading infrastructure (differentiators + table stakes)
**Avoids:** Jupiter API rate limits (cache quotes for 30s, retry logic)

### Phase 7: Leaderboards, Marketing Site, and Polish
**Rationale:** These are high-visibility features that depend on indexer data and can be built in parallel with audit prep. Marketing site is the public face of the protocol.
**Delivers:** Leaderboard pages (largest stakes, most T-shares, longest stakes), whale tracker, marketing/landing page, economics explainer, FAQ, interactive simulator
**Addresses:** Leaderboard features, marketing (differentiators)
**Avoids:** No major pitfalls -- standard web development patterns

### Phase 8: Testing, Audit, and Mainnet Launch
**Rationale:** Final phase. All features must be complete, devnet-tested, and audited before mainnet deployment.
**Delivers:** Comprehensive test suite (Bankrun + E2E), devnet deployment, security audit (self or third-party), economic model validation, mainnet deployment with multisig upgrade authority, monitoring (Sentry + Datadog)
**Addresses:** Audit preparation checklist (from PITFALLS.md)
**Avoids:** All launch risks (bot sniping tested, indexer recovery tested, economics validated)

### Phase Ordering Rationale

- **Phases 1-3 are strictly sequential**: Token mint must exist before staking logic, staking logic must exist before free claim (which depends on T-share accounting).
- **Phase 4 depends on 1-3**: Frontend cannot be built without a functional program to interact with.
- **Phase 5 is partially parallel**: Indexer development can overlap with Phase 4 frontend work, but needs deployed program events to test against.
- **Phases 6-7 depend on Phase 5**: Analytics and leaderboards require indexed data.
- **Phase 8 is a gate**: No shortcuts on testing and audit for a financial protocol.

### Research Flags

Phases likely needing deeper research during planning:
- **Phase 2 (Core Staking):** Needs research on exact HEX penalty formulas, share rate increment logic, and lazy vs. crank distribution tradeoffs. Most complex phase with most pitfalls.
- **Phase 3 (Free Claim/BPD):** Needs research on Merkle tree size for 50M+ SOL addresses, proof storage strategy (CDN vs. IPFS), and transaction size limits for deep proofs.
- **Phase 5 (Indexer):** Needs research on Yellowstone gRPC setup, Helius webhook vs. self-hosted Geyser, and indexer hosting options.

Phases with standard patterns (skip deep research):
- **Phase 1 (Foundation):** Well-documented Anchor scaffold, Token-2022 mint creation is standard.
- **Phase 4 (Frontend MVP):** Standard Next.js + wallet adapter patterns, extensively documented.
- **Phase 6 (Analytics/Jupiter):** Jupiter SDK well-documented, charting libraries are commodity.
- **Phase 7 (Marketing/Leaderboards):** Pure frontend, no novel patterns.

## Cross-Cutting Concerns

These themes appear across multiple research documents and require attention throughout development:

1. **Financial math correctness** (STACK + PITFALLS + ARCHITECTURE): Every layer -- program, indexer, frontend -- must agree on calculations. Build a shared reference implementation and test all three layers against it. Checked arithmetic is non-negotiable from Phase 1 onward.

2. **Time representation** (ARCHITECTURE + PITFALLS): Slot-based day counting is recommended over unix_timestamp for determinism. This decision affects the program, indexer (must convert slots to days), and frontend (must display days correctly). Decide once in Phase 1, enforce everywhere.

3. **Account design tradeoff** (ARCHITECTURE + PITFALLS + FEATURES): The ARCHITECTURE.md proposes a UserProfile with `Vec<Stake>`, but PITFALLS.md warns about account size limits. Use separate PDA per stake for scalability. This increases rent costs but eliminates size limits.

4. **Indexer as single point of fragility** (ARCHITECTURE + PITFALLS + FEATURES): Analytics, leaderboards, and historical charts all depend on the indexer. But staking must work without it. Design the frontend to degrade gracefully -- core staking reads from RPC, only analytics features depend on the indexer.

5. **Token-2022 extension decisions** (STACK + ARCHITECTURE): Research suggests Token-2022 is required for metadata but transfer hooks are unlikely needed. Lock this decision early (Phase 1) because extensions must be initialized before mint creation and cannot be added later.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | All technologies are ecosystem standards with official documentation. Anchor, Next.js, wallet-adapter, Jupiter are de facto choices. Version constraints verified. |
| Features | HIGH | Feature set derived from HEX protocol (established model) and Solana DeFi UX patterns (Marinade, Jito, Birdeye). Clear table stakes vs. differentiators. |
| Architecture | HIGH | Three-component architecture (program + frontend + indexer) is standard for Solana DeFi. Data flows are well-understood. Lazy distribution for MVP is a sound simplification. |
| Pitfalls | HIGH | 21 pitfalls identified with concrete prevention strategies and code examples. Phase assignments are clear. The critical pitfalls (overflow, precision, double-claim) have well-known solutions. |

**Overall confidence:** HIGH

The research is comprehensive and based on verified sources (official Anchor docs, Token-2022 specifications, Solana developer documentation). The HEX economic model is well-documented from its Ethereum implementation. The main uncertainty is around performance at scale (how many concurrent stakers before lazy distribution becomes expensive) and free claim Merkle tree sizing for the full SOL address space.

### Gaps to Address

- **Exact HEX penalty formulas**: The early/late penalty curves need precise specification. Research provides the structure (50% minimum early, 14-day grace + 350-day decay for late) but exact parameters should be validated against HEX source code during Phase 2 planning.
- **Lazy distribution scaling limits**: At what point does lazy distribution (compute on each claim) become more expensive than a batched crank? Need to benchmark with realistic T-share counts during Phase 2 implementation.
- **Merkle tree for 50M+ addresses**: The free claim needs a Merkle tree covering all SOL holders. Tree depth ~26. Proof storage as static JSON files on CDN is proposed but needs sizing (50M files * ~1KB each = ~50GB). Alternative: compressed proof format or IPFS.
- **Indexer hosting and cost at scale**: MVP indexer on a $5/month VPS is fine for devnet. Mainnet with real traffic needs cost projections and failover strategy.
- **Multisig for upgrade authority**: Squads Protocol recommended but not researched in depth. Needs evaluation during Phase 8 planning.
- **Account design: Vec vs. separate PDAs**: ARCHITECTURE.md proposes UserProfile with `Vec<Stake>` (max 10-20). PITFALLS.md recommends separate PDAs per stake. This needs a firm decision in Phase 1 -- the choice affects every downstream phase.

## Sources

### Primary (HIGH confidence)
- Anchor Framework Documentation: https://www.anchor-lang.com/docs
- SPL Token-2022: https://www.solana-program.com/docs/token-2022
- Solana Wallet Adapter: https://github.com/anza-xyz/wallet-adapter
- Jupiter Swap API: https://station.jup.ag/docs/apis/swap-api
- Helius RPC Documentation: https://docs.helius.dev
- Solana Web3.js: https://solana-labs.github.io/solana-web3.js/
- Yellowstone gRPC: https://github.com/rpcpool/yellowstone-grpc

### Secondary (MEDIUM confidence)
- Solana Cookbook: https://solanacookbook.com
- Solana Stack Exchange: https://solana.stackexchange.com
- Neodyme Common Pitfalls: https://blog.neodyme.io/posts/solana_common_pitfalls
- Helius Inflation Blog: https://www.helius.dev/blog/solana-issuance-inflation-schedule

### Tertiary (LOW confidence)
- HEX tokenomics (hex.com) -- economic model reference, not technical implementation
- Failed staking protocols (OHM, TITAN) -- negative examples for economic modeling

---
*Research completed: 2026-02-07*
*Ready for roadmap: yes*
