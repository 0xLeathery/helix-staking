# HELIX

## What This Is

A HEX-style staking protocol on Solana where users claim free tokens (proportional to their SOL holdings at snapshot), lock them for 1-5555 days to earn T-shares, and receive daily inflation rewards. Longer and bigger stakes earn bonus T-shares. Early unstaking is penalized, late unstaking is penalized. Unclaimed tokens from the free claim period are distributed to stakers on Big Pay Day. The full product includes a marketing site, staking dashboard with rich analytics, Jupiter swap integration, and a leaderboard.

## Core Value

Users can stake tokens for a chosen duration, earn T-shares proportional to their commitment, and receive daily inflation rewards — the complete stake-lock-earn lifecycle must work trustlessly on-chain.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Anchor program handles complete staking lifecycle (stake, unstake, claim rewards)
- [ ] SPL token via Token-2022 with PDA mint authority (8 decimals)
- [ ] Free claim period where SOL holders claim tokens proportional to a balance snapshot
- [ ] Big Pay Day distributes unclaimed tokens to active T-share holders after claim period ends
- [ ] T-share bonus curves: Longer Pays Better (0-2x over 3641 days) and Bigger Pays Better (0-1x up to 150M threshold)
- [ ] Early unstake penalty proportional to time not served (minimum 50%)
- [ ] Late unstake penalty: 14-day grace, linear to 100% over 350 days, total loss after 365
- [ ] Daily inflation (3.69% annual) minted and distributed proportionally to T-share holders
- [ ] Permissionless daily distribution crank anyone can call
- [ ] Share rate increases over time (future stakes cost more per T-share)
- [ ] Next.js marketing site explaining the protocol mechanics
- [ ] Staking dashboard: stake/unstake, view active stakes, penalty calculator
- [ ] Rich analytics: T-share price history, daily payout history, supply breakdown, stake distribution histogram
- [ ] Leaderboard and whale tracker
- [ ] Jupiter swap widget integration for token trading
- [ ] Light indexer service for analytics, leaderboard, and historical data
- [ ] Devnet deployment for testing, mainnet deployment for launch

### Out of Scope

- Referral bonus system — adds complexity without core value, defer to v2
- Custom AMM/liquidity pool — Jupiter handles liquidity and routing
- Mobile app — responsive web sufficient
- Governance/DAO mechanics — not needed for staking protocol
- Multi-token staking — single token only
- Backend user accounts/auth — users interact directly via wallet signatures
- Fiat on/off ramps — crypto-native users only

## Context

- **HEX reference**: HEX on Ethereum is the original CD-style staking protocol. HELIX follows the same economic model (free claim, T-shares, BPB/LPB bonuses, penalties, Big Pay Day, inflation) but built natively on Solana.
- **Token economics**: Tokens are created through the free claim (SOL snapshot) and ongoing inflation (3.69%/year to stakers). No pre-mine, no team allocation beyond what's claimable. Trading happens on Jupiter/Raydium after launch.
- **Architecture**: Anchor program is the source of truth for all staking logic. Frontend reads state directly from Solana RPC for user-specific data. Light indexer polls events and stores historical snapshots for analytics and leaderboards. No heavy backend — staking is fully client-to-chain.
- **Solo build**: Single developer, Claude builds everything. Architecture should prioritize simplicity and maintainability.

## Constraints

- **Smart contract**: Anchor (Rust) on Solana — locked decision from design phase
- **Token standard**: Token-2022 with metadata extension — enables on-chain token info
- **Frontend**: Next.js + React — best ecosystem for Solana DeFi (wallet adapters, Jupiter SDK)
- **Testing**: Bankrun + anchor-bankrun for fast program tests with time manipulation
- **Solana SDK**: @solana/web3.js v1 required (Anchor TS client incompatible with v2)
- **Network**: Devnet for development/testing, mainnet for production launch
- **Indexer**: Lightweight polling service — not a full backend. Read-only analytics API.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Anchor over native Solana program | PDA management, auto-generated IDL, account validation, ecosystem tooling | — Pending |
| Token-2022 over legacy SPL Token | Metadata extension, transfer hooks, future-proof | — Pending |
| SOL snapshot for free claim over open claim | Faithful to HEX model, creates initial distribution tied to existing SOL community | — Pending |
| Next.js over SvelteKit | Larger Solana DeFi ecosystem, better wallet adapter support, SSR for marketing pages | — Pending |
| Light indexer over full backend | Staking is fully on-chain. Only need backend for analytics/historical data. Simpler architecture. | — Pending |
| Jupiter integration over custom swap | Jupiter handles routing, liquidity, aggregation. No need to build swap infrastructure. | — Pending |
| 3.69% annual inflation | Matches original HEX parameters. Proven economic model. | — Pending |
| Big Pay Day in v1 | Core economic incentive for early stakers. Drives urgency during claim period. | — Pending |

---
*Last updated: 2026-02-07 after initialization*
