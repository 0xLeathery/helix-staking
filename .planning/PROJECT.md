# HELIX

## What This Is

A HEX-style staking protocol on Solana where users claim free tokens (proportional to their SOL holdings at snapshot), lock them for 1-5555 days to earn T-shares, and receive daily inflation rewards. Longer and bigger stakes earn bonus T-shares with duration loyalty multipliers for mature stakes. Early unstaking is penalized, late unstaking is penalized. Unclaimed tokens from the free claim period are distributed to stakers on Big Pay Day with anti-whale caps. The full product includes a marketing site, staking dashboard with rich analytics, Jupiter swap integration, leaderboard, on-chain referral bonuses, soulbound NFT badges for staking milestones, and browser push notifications.

## Core Value

Users can stake tokens for a chosen duration, earn T-shares proportional to their commitment, and receive daily inflation rewards — the complete stake-lock-earn lifecycle must work trustlessly on-chain.

## Requirements

### Validated

- ✓ Anchor program handles complete staking lifecycle (stake, unstake, claim rewards) — v1.0/Phases 1-3
- ✓ SPL token via Token-2022 with PDA mint authority (8 decimals) — v1.0/Phase 1
- ✓ Free claim period with Merkle proof verification and speed bonuses — v1.0/Phase 3
- ✓ Big Pay Day with 3-phase finalize/seal/distribute and anti-whale cap — v1.0/Phases 3, 3.2, 3.3, 8.1
- ✓ T-share bonus curves: LPB (0-2x), BPB (4-tier diminishing returns) — v1.0/Phases 2, 8.1
- ✓ Early/late unstake penalties with redistribution to stakers — v1.0/Phases 2, 2.1
- ✓ Daily 3.69% inflation via permissionless crank — v1.0/Phase 2
- ✓ Duration loyalty multiplier for mature stakes — v1.0/Phase 8.1
- ✓ Next.js staking dashboard with wallet connection, stake management, penalty calculator — v1.0/Phase 4
- ✓ Rich analytics: charts, supply breakdown, stake distribution histogram — v1.0/Phase 6
- ✓ Jupiter swap widget integration — v1.0/Phase 6
- ✓ Leaderboard and whale tracker — v1.0/Phase 7
- ✓ Marketing site with ISR — v1.0/Phase 7
- ✓ Light indexer: event polling, Postgres, REST API — v1.0/Phase 5
- ✓ Operational hardening: CU budgets, RPC failover, rate limiting, program pause, ops docs — v1.0/Phase 8.2
- ✓ Security hardening: 0 CRITICALs, all audit findings addressed — v1.0/Phases 3.2, 3.3, 8, 8.1
- ✓ Public IDL synchronized with Phase 8.1 ClaimConfig fields — v1.1/Phase 9
- ✓ Loyalty multiplier applied in reward preview (stake-card and penalty-calculator) — v1.1/Phase 9
- ✓ BPD seal delay UI with observation window state — v1.1/Phase 9
- ✓ Protocol paused banner blocking UI interactions when paused — v1.1/Phase 9
- ✓ On-chain referral bonus (+10% referee, +5% referrer) with self-referral prevention — v1.1/Phase 10
- ✓ Referral link generation, stats dashboard, indexer tracking — v1.1/Phase 10
- ✓ Soulbound NFT badges via Bubblegum V2 cNFT (First Stake, 365-Day, BPD, tier) — v1.1/Phase 11
- ✓ Badge eligibility tracked via indexer, badge gallery with claim flow — v1.1/Phase 11
- ✓ Browser push notifications via Web Push API + service worker (maturity, penalty, BPD) — v1.1/Phase 12
- ✓ Notification preferences UI with per-event-type toggles — v1.1/Phase 12
- ✓ PWA installability with manifest and install prompt — v1.1/Phase 12
- ✓ anchor-litesvm test migration (165 tests), math.rs 99% coverage — v1.1/Phase 13
- ✓ 80%+ test coverage across indexer and frontend (Vitest + RTL) — v1.1/Phase 13
- ✓ Playwright E2E suite covering stake/claim/BPD/referral/badge flows — v1.1/Phase 13
- ✓ Runtime env var guards for push + badge routes — v1.1/Phase 14

### Active

- [ ] Mainnet deployment with Squads multisig upgrade authority
- [ ] HELIUS_RPC_URL env guard in badge mint/claimed routes (INT-01 from v1.1 audit)
- [ ] Fix pre-existing TSC errors in badge/E2E files

### Out of Scope

- Custom AMM/liquidity pool — Jupiter handles liquidity and routing
- Mobile native app — responsive web + PWA sufficient
- Governance/DAO mechanics — not needed for staking protocol
- Multi-token staking — single token only
- Backend user accounts/auth — users interact directly via wallet signatures
- Fiat on/off ramps — crypto-native users only
- Email notifications — push-only sufficient; email requires external service
- On-chain referral leaderboard — indexer tracking sufficient for now
- Referral tiers/multipliers — single bonus rate (10%/5%) proven sufficient
- Badge trading / marketplace — badges are soulbound by design

## Context

- **HEX reference**: HEX on Ethereum is the original CD-style staking protocol. HELIX follows the same economic model (free claim, T-shares, BPB/LPB bonuses, penalties, Big Pay Day, inflation) but built natively on Solana.
- **Token economics**: Tokens are created through the free claim (SOL snapshot) and ongoing inflation (3.69%/year to stakers). No pre-mine, no team allocation beyond what's claimable. Trading happens on Jupiter/Raydium after launch.
- **Architecture**: Anchor program is the source of truth for all staking logic. Frontend reads state directly from Solana RPC for user-specific data. Light indexer polls events and stores historical snapshots for analytics, leaderboards, badge eligibility, and push notifications. No heavy backend — staking is fully client-to-chain.
- **Solo build**: Single developer, Claude builds everything. Architecture should prioritize simplicity and maintainability.
- **Current state**: Shipped v1.1 with ~47K LOC (5,985 Rust, ~39K TypeScript). 200 commits across 20 phases. Full stack validated on Docker localnet with Playwright E2E. Devnet deployed and validated. Mainnet deployment deferred pending Squads multisig setup.
- **Test infrastructure**: anchor-litesvm (165 integration tests), cargo-llvm-cov (math.rs 99.08%), Vitest (indexer 80%+, frontend 91%), Playwright (14 E2E specs).

## Constraints

- **Smart contract**: Anchor (Rust) on Solana — locked decision from design phase
- **Token standard**: Token-2022 with metadata extension — enables on-chain token info
- **Frontend**: Next.js + React — best ecosystem for Solana DeFi (wallet adapters, Jupiter SDK)
- **Testing**: anchor-litesvm for fast program tests with time manipulation (migrated from deprecated anchor-bankrun in v1.1)
- **Solana SDK**: @solana/web3.js v1 required (Anchor TS client incompatible with v2)
- **Network**: Devnet for development/testing, mainnet for production launch
- **Indexer**: Lightweight polling service with push notification dispatch — not a full backend
- **NFT standard**: Bubblegum V2 for soulbound badges — PermanentFreezeDelegate with authority:None

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Anchor over native Solana program | PDA management, auto-generated IDL, account validation, ecosystem tooling | ✓ Good — IDL auto-generation critical for frontend sync |
| Token-2022 over legacy SPL Token | Metadata extension, transfer hooks, future-proof | ✓ Good — metadata extension used, no migration needed |
| SOL snapshot for free claim over open claim | Faithful to HEX model, creates initial distribution tied to existing SOL community | ✓ Good — Merkle proof verification working |
| Next.js over SvelteKit | Larger Solana DeFi ecosystem, better wallet adapter support, SSR for marketing pages | ✓ Good — ISR marketing site, wallet adapters work well |
| Light indexer over full backend | Staking is fully on-chain. Only need backend for analytics/historical data. Simpler architecture. | ✓ Good — extended with badge eligibility + push notifications without becoming heavy |
| Jupiter integration over custom swap | Jupiter handles routing, liquidity, aggregation. No need to build swap infrastructure. | ✓ Good — embedded widget works |
| 3.69% annual inflation | Matches original HEX parameters. Proven economic model. | ✓ Good — permissionless crank distributes correctly |
| Big Pay Day in v1 | Core economic incentive for early stakers. Drives urgency during claim period. | ✓ Good — 3-phase finalize/seal/distribute with anti-whale caps |
| Bubblegum V2 over Core/V1 for badges | PermanentFreezeDelegate only available in V2, irrevocable soulbound | ✓ Good — soulbound status enforced permanently |
| anchor-litesvm over anchor-bankrun | anchor-bankrun deprecated March 2025, litesvm actively maintained | ✓ Good — 165 tests migrated successfully |
| VAPID push over Firebase | No vendor lock-in, works with PWA on iOS, simpler infrastructure | ✓ Good — browser-native push working |
| ReferralRecord PDA over StakeAccount expansion | StakeAccount must stay at 117 bytes for backward compat | ✓ Good — clean separation, no migration needed |

---
*Last updated: 2026-03-03 after v1.1 milestone completion*
