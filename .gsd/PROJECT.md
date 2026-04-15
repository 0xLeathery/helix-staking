# HELIX — Time-Locked Staking on Solana

## What This Is

A HEX-inspired time-locked staking protocol on Solana. Users lock HLX tokens for 1–5,555 days, earn T-shares via bonus curves (Longer Pays Better, Bigger Pays Better), and collect daily inflation rewards plus periodic Big Pay Day distributions. Includes a free claim airdrop for SOL holders, referral system, and NFT badges — all enforced trustlessly on-chain via an Anchor program with a Next.js dashboard, Fastify indexer, and automated crank service for daily inflation distribution.

## Core Value

Committed stakers earn outsized rewards — conviction is rewarded, not just capital. Every token a quitter loses, a committed staker earns.

## Requirements

### Validated

<!-- Shipped and confirmed valuable. -->

- ✓ Anchor program: staking, unstaking, rewards, penalties, referrals, BPD, free claim — v1.1
- ✓ Token-2022 integration with PDA mint authority — v1.1
- ✓ Next.js 14 dashboard with wallet-adapter, React Query, shadcn/ui — v1.1
- ✓ Fastify indexer with Drizzle ORM + PostgreSQL — v1.1
- ✓ NFT badge system — v1.1
- ✓ Push notifications — v1.1
- ✓ 622+ passing tests (165 LiteSVM + 337 Vitest + Playwright E2E) — v1.1
- ✓ Framer Motion animation infrastructure with LazyMotion + reduced-motion — v1.2
- ✓ Visual depth, page transitions, loading/empty/error states — v1.2
- ✓ Animated stat counters with first-mount guard — v1.2
- ✓ Automated crank service with 4-cron scheduling, error classification, SOL monitoring, RPC failover — v2.0
- ✓ Frontend deploys and runs on Vercel with Fluid Compute — v2.0
- ✓ Production runbook (1,030 lines) covering key management, deployment, incident response — v2.0
- ✓ Tokenomics documentation with supply projections, penalty mechanics, risk scenarios — v2.0
- ✓ Interactive tokenomics calculator (zero-dependency HTML) — v2.0

### Active

<!-- Current scope. Building toward these. -->

- [ ] Seed token launch on optimal launchpad (max creator rewards)
- [ ] LP pool creation — SOL proceeds from seed launch fund HLX/SOL liquidity pool
- [ ] APY boost for seed token holders — real-time verification, lose boost if sold
- [ ] Frontend: seed launch page, boost indicator on dashboard, live LP pool tracker
- [ ] Transparency: on-chain verification, public dashboard, published mechanics docs

## Current Milestone: v3.0 Seed Launch & LP Funding

**Goal:** Fund the HLX/SOL liquidity pool through a seed token launch, rewarding early backers with boosted staking APY and building trust through full transparency.

**Target features:**
- Seed token launch on pump.fun/bags (whichever maximizes creator rewards)
- SOL proceeds from seed bonding curve fund HLX/SOL LP on DEX
- APY boost system for seed token holders with real-time on-chain verification
- Seed launch page with progress tracking
- Dashboard boost indicator showing qualification status
- Live LP pool funding tracker
- Published documentation explaining all mechanics end-to-end

### Out of Scope

<!-- Explicit boundaries. Includes reasoning to prevent re-adding. -->

- Mobile app — web-first, mobile later
- v1.2 tech debt cleanup (button.tsx motion import, animate-pulse remnants, PortfolioSummary stagger) — deferred, non-blocking
- Next.js 14 → 15 upgrade — risk of React 19 peer dep conflicts with wallet-adapter; defer to separate milestone
- On-chain tokenomics changes — supply model is sound for 10+ years; no code changes needed
- Dynamic priority fee estimation — nice-to-have, deferred to v3+
- Slack/webhook alerting on crank failures — deferred to v3+
- Multi-region crank deployment — deferred to v3+
- Monitoring dashboard — deferred to v3+

## Context

- **Architecture**: Anchor 0.32.1 (Rust) + Next.js 14 + Fastify 5 indexer + PostgreSQL + standalone crank service
- **Codebase**: 220,463 LOC TypeScript/Rust
- **Crank service**: Standalone `services/crank/` with node-cron, p-retry, RPC failover, BetterStack heartbeat, Docker Compose integration
- **Frontend**: Deployed to Vercel with Fluid Compute, webpack alias for @noble/hashes, maxDuration on badge mint route
- **Tokenomics**: Published `docs/TOKENOMICS.md` with sensitivity analysis and interactive calculator at `docs/tokenomics-calculator.html`
- **Operations**: Private runbook at `.private/PRODUCTION_RUNBOOK.md` (gitignored) covering full deployment lifecycle and incident response
- **Program ID (devnet)**: `E9B7BsxdPS89M66CRGGbsCzQ9LkiGv6aNsra3cNBJha7`

## Constraints

- **Privacy**: Production runbook in `.private/` — never committed to public repo
- **Tech stack**: Node.js/TypeScript across all services
- **Security**: Crank service holds keypair — operational security documented in private runbook
- **Vercel**: Frontend deployed to Vercel with Fluid Compute

## Key Decisions

<!-- Decisions that constrain future work. Add throughout project lifecycle. -->

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Permissionless crank instruction | Anyone can call it — decouples protocol liveness from a single operator | ✓ Good |
| Token-2022 over classic SPL | Modern standard, metadata extension, future-proof | ✓ Good |
| LazyMotion over full Framer Motion | ~15KB savings, tree-shakeable | ✓ Good |
| template.tsx for page transitions | Leverages Next.js App Router remount behavior | ✓ Good |
| Crank as standalone services/crank/ | Least-privilege, independent restart, separate from indexer | ✓ Good |
| Production runbook in .private/ | Balances accessibility with privacy — gitignored, never committed | ✓ Good |
| webpack resolve.alias for @noble/hashes | Avoids ERR_PACKAGE_PATH_NOT_EXPORTED at runtime (vs serverExternalPackages) | ✓ Good |
| node:20-alpine for crank Docker image | No native deps, Alpine ~5x smaller than ubuntu | ✓ Good |
| IDL bind-mounted at runtime (not baked into image) | Any IDL update doesn't require image rebuild | ✓ Good |
| withRpcFallback takes Program (not RpcClient) | Crank needs full Anchor Program for executeCrank | ✓ Good |
| Integer BPS arithmetic matching on-chain | Math.floor/Math.ceil in JS matches Rust mul_div/mul_div_up exactly | ✓ Good |

---
*Last updated: 2026-03-04 after v3.0 milestone started*
