# SolHEX Technology Stack Research

**Research Date:** February 7, 2026
**Researcher:** GSD Project Researcher
**Purpose:** Define the standard 2026 stack for building a HEX-style staking protocol on Solana

---

## Executive Summary

This document prescribes the technology stack for SolHEX, a HEX-style staking protocol on Solana. The recommendations prioritize production-readiness, ecosystem maturity, and proven battle-testing over bleeding-edge features. All version numbers and capabilities have been verified against current documentation as of Q1 2026.

**Key Constraint:** `@solana/web3.js` v1 is required due to Anchor framework dependency. This is NOT a blocker—v1 is production-stable and widely used.

---

## 1. Smart Contract Layer (Anchor Programs)

### Core Framework

**Anchor Framework v0.31.0+**
- **Recommendation:** Use latest stable (0.31.0 confirmed, 0.32.1 mentioned in docs)
- **Rationale:**
  - Industry-standard framework for Solana programs
  - Built-in security features (discriminators, constraint checks, type safety)
  - Simplifies CPIs, PDA derivation, account validation
  - Modular project structure (`lib.rs`, `instructions/`, `state/`, `constants.rs`, `error.rs`)
  - IDL generation for TypeScript client integration
- **Why NOT alternatives:**
  - Native Rust: More verbose, lacks safety features, harder to audit
  - Seahorse: Python-based, immature ecosystem, limited adoption
- **Confidence:** HIGHEST (battle-tested, Anchor is the de facto standard)

### Token Program

**SPL Token-2022 (Token Extensions Program)**
- **Program ID:** `TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb`
- **Rationale:**
  - Required for staking token with potential extensions (future-proofing)
  - Backward-compatible with SPL Token
  - Extensions available: Transfer hooks, permanent delegate, non-transferable, metadata pointer
  - 6+ audits (Zellic, Trail of Bits, NCC Group, OtterSec, Certora)
  - RPC indexing fully supports Token-2022
- **Integration:**
  - Use `anchor-spl` crate's `token_2022_extensions` module
  - Note: Not all extension helpers are implemented—manual CPIs may be needed
  - Account size calculation must include extension space
- **Why NOT SPL Token (original):**
  - Locked feature set, no protocol-level extensibility
  - Token-2022 is official Solana recommendation since 2024
- **Confidence:** HIGH (officially recommended, widely adopted by major protocols)

### Testing Framework

**Bankrun (Recommended Primary)**
- **Package:** `solana-bankrun` (npm)
- **Rationale:**
  - Fast in-process SVM testing (no validator startup)
  - Transaction simulation with real Solana VM
  - Supports CPI, account manipulation, clock/rent mocking
  - Ideal for unit/integration tests
- **Supplementary:** Mollusk (lightweight SVM testing)
- **Why NOT alternatives:**
  - `solana-test-validator`: Slow startup, heavyweight for CI
  - `litesvm`: Less mature than Bankrun
- **Usage Pattern:**
  - Bankrun for fast unit tests
  - `anchor test` with local validator for E2E smoke tests
- **Confidence:** MEDIUM-HIGH (recommended in Anchor docs, gaining adoption)

---

## 2. Frontend Stack (Dashboard + Marketing Site)

### Core Framework

**Next.js 15 (App Router)**
- **Version:** Latest stable (15.x as of 2026)
- **Rationale:**
  - Server components reduce bundle size
  - Built-in TypeScript support
  - API routes for backend integration
  - Static export option for marketing site
  - Industry standard for Web3 frontends
- **Deployment:** Vercel (optimized for Next.js) or self-hosted
- **Why NOT alternatives:**
  - Vite + React: Lacks built-in SSR, more manual configuration
  - Remix: Smaller ecosystem, less Solana wallet adapter support
- **Confidence:** HIGHEST (Next.js is dominant in Solana ecosystem)

### Wallet Integration

**@solana/wallet-adapter-react v0.15.36+**
- **Critical:** Use version >=0.15.36 to avoid Mobile Wallet Adapter (MWA) bugs
- **Rationale:**
  - Standard wallet integration for Solana
  - Supports Phantom, Solflare, Backpack, etc.
  - Auto-detects installed wallets
  - Context provider for wallet state
- **Supplementary Packages:**
  - `@solana/wallet-adapter-react-ui`: Pre-built wallet selector UI
  - `@solana/wallet-adapter-wallets`: Wallet adapters
  - `@solana-mobile/wallet-adapter-mobile`: Mobile wallet support
- **Migration Note:** MWA now requires explicit inclusion (not default in v1.0.0+)
- **Next.js 13+ Gotcha:** Wallet provider must be a Client Component (`'use client'`)
- **Confidence:** HIGHEST (ecosystem standard)

### Blockchain Client

**@solana/web3.js v1.x (REQUIRED)**
- **Version:** Latest v1 stable (v2 exists but NOT compatible with Anchor)
- **Rationale:**
  - Anchor CLI generates TypeScript clients using v1 APIs
  - Program class, Connection, Transaction classes required by Anchor
  - Mature, stable, well-documented
- **Why NOT v2:**
  - Anchor does not support v2 (breaking changes in transaction construction)
  - Migration path unclear as of Q1 2026
- **Confidence:** HIGHEST (mandated by Anchor constraint)

### Anchor Client

**@coral-xyz/anchor (formerly @project-serum/anchor)**
- **Version:** Match Anchor CLI version (0.31.0+)
- **Rationale:**
  - TypeScript client generated from IDL
  - `Program` class for instruction building
  - `AnchorProvider` for wallet + connection setup
  - `MethodsBuilder` for composing transactions
- **Usage Pattern:**
  ```typescript
  import { Program, AnchorProvider } from "@coral-xyz/anchor";
  import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";

  const { connection } = useConnection();
  const wallet = useAnchorWallet();
  const provider = new AnchorProvider(connection, wallet, {});
  const program = new Program(idl, { connection });
  ```
- **Confidence:** HIGHEST (official Anchor client)

### UI Framework

**React 18+ with Tailwind CSS**
- **Rationale:**
  - React required by wallet adapters
  - Tailwind for rapid UI development
  - shadcn/ui components (optional, built on Radix UI + Tailwind)
- **Why NOT alternatives:**
  - Material UI: Heavy bundle, opinionated design
  - Chakra UI: Less flexible than Tailwind
- **Confidence:** HIGH (standard in Solana dApps)

---

## 3. Data Indexing & Analytics

### RPC Provider

**Helius RPC (Recommended Primary)**
- **Endpoints:**
  - Mainnet: `https://mainnet.helius-rpc.com/?api-key=YOUR_KEY`
  - Devnet: `https://devnet.helius-rpc.com/?api-key=YOUR_KEY`
- **Rationale:**
  - Enhanced RPC methods (parsed transactions, DAS API, webhook support)
  - Priority fee API for dynamic fee optimization
  - Geyser gRPC streaming (ultra-low latency)
  - Generous free tier, then pay-per-credit
- **Alternatives:** QuickNode (dedicated nodes), Triton (geographically distributed)
- **Confidence:** HIGH (widely used, Solana Foundation partner)

### Light Indexer (Analytics)

**Custom Postgres + Geyser Plugin (Self-Hosted)**
- **Architecture:**
  - Subscribe to program-specific account updates via Yellowstone gRPC
  - Parse staking transactions, rewards, penalties
  - Store in Postgres for dashboard queries
- **Technology:**
  - Yellowstone gRPC client (TypeScript/Rust)
  - PostgreSQL 15+ for time-series data
  - Optional: TimescaleDB extension for hypertables
- **Rationale:**
  - Full control over schema (optimized for leaderboard, analytics)
  - Cost-effective for read-heavy dashboards
  - No vendor lock-in
- **Why NOT third-party indexers:**
  - The Graph: Overkill for single program, slow subgraph deployment
  - Bitquery/Covalent: Expensive for custom queries
  - Helius Webhooks: Good for events, not for historical aggregation
- **Confidence:** MEDIUM (requires DevOps, but proven pattern)

**Implementation Options:**
1. **Yellowstone gRPC Subscription (Recommended)**
   - Stream account updates from Helius/QuickNode Geyser endpoint
   - Filter by program ID, parse in TypeScript/Node.js
   - Write to Postgres with Prisma ORM
2. **Alternative: RPC Polling (Not Recommended)**
   - Use `getProgramAccounts` periodically (rate-limited, expensive)
   - Only for prototyping

### Dashboard Data Layer

**Prisma ORM + PostgreSQL**
- **Rationale:**
  - Type-safe database queries
  - Auto-generated TypeScript types
  - Migration management
  - Works seamlessly with Next.js API routes
- **Schema Example:**
  ```prisma
  model Stake {
    id          String   @id @default(cuid())
    user        String
    amount      BigInt
    tshares     BigInt
    startDay    Int
    endDay      Int
    penalty     BigInt?
    createdAt   DateTime @default(now())
  }
  ```
- **Confidence:** HIGH (ecosystem standard for Web3 dashboards)

---

## 4. DEX Integration (Jupiter Swap)

### Jupiter Aggregator

**Jupiter Swap API v6**
- **Endpoint:** `https://quote-api.jup.ag/v6`
- **Rationale:**
  - Best price routing across Solana DEXs (Orca, Raydium, Meteora, etc.)
  - Price impact protection
  - Slippage customization
  - Versioned transactions (lookup tables for lower fees)
- **Integration Pattern:**
  1. Fetch quote: `GET /quote?inputMint=SOL&outputMint=SOLHEX&amount=1000000000`
  2. Get swap transaction: `POST /swap` with user's public key
  3. Sign transaction with wallet adapter
  4. Send via `connection.sendTransaction()`
- **SDKs:**
  - `@jup-ag/api` (official TypeScript SDK)
  - `@jup-ag/react-hook` (React hooks for Jupiter)
- **Why NOT direct DEX integration:**
  - Single DEX = worse pricing
  - Jupiter handles routing complexity
- **Confidence:** HIGHEST (Jupiter dominates Solana swap volume)

---

## 5. DevOps & Deployment

### Program Deployment

**Anchor CLI + Solana CLI**
- **Workflow:**
  ```bash
  anchor build                          # Compile program
  solana program deploy target/deploy/solhex.so --program-id <KEYPAIR>
  anchor idl init <PROGRAM_ID> --filepath target/idl/solhex.json
  ```
- **Upgrade Authority:** Multisig (Squads Protocol recommended)
- **Confidence:** HIGHEST (standard tooling)

### Frontend Deployment

**Vercel (Recommended) or Cloudflare Pages**
- **Rationale:**
  - Zero-config Next.js deployment
  - Edge CDN for global low-latency
  - Preview deployments for PRs
  - Generous free tier
- **Alternatives:** Netlify, AWS Amplify
- **Confidence:** HIGHEST (Vercel built Next.js)

### Monitoring & Observability

**Sentry (Error Tracking) + Datadog (Metrics)**
- **Sentry:** Frontend/backend error logging
- **Datadog:** Geyser indexer health, RPC latency monitoring
- **Alternatives:** Self-hosted ELK stack (Elasticsearch, Logstash, Kibana)
- **Confidence:** MEDIUM-HIGH (industry standards)

---

## 6. Additional Tooling

### Local Development

**Solana Test Validator (Bundled with Solana CLI)**
- **Command:** `solana-test-validator --bpf-program <PROGRAM_ID> target/deploy/solhex.so`
- **Purpose:** E2E testing with real validator
- **Supplement:** Bankrun for fast unit tests
- **Confidence:** HIGHEST

### Transaction Construction

**@solana/spl-token (for Token-2022 helpers)**
- **Version:** Latest (>=0.3.0 for Token-2022 support)
- **Functions:**
  - `createTransferCheckedInstruction()` (required for Token-2022)
  - `getAssociatedTokenAddress()` (works with both Token and Token-2022)
  - `createAssociatedTokenAccountInstruction()`
- **Note:** Must pass `TOKEN_2022_PROGRAM_ID` explicitly
- **Confidence:** HIGHEST

---

## 7. What NOT to Use (Anti-Recommendations)

| Technology | Why to Avoid |
|------------|-------------|
| **@solana/web3.js v2** | Not compatible with Anchor as of Q1 2026 |
| **Solidity/EVM tooling** | Wrong blockchain, not applicable |
| **Native Rust programs (no framework)** | Verbose, error-prone, harder to audit |
| **The Graph Protocol** | Overkill for single program, slow subgraph sync |
| **RPC polling for indexing** | Rate-limited, expensive, use Geyser instead |
| **Phantom Connect SDK** | Deprecated, use wallet-adapter-react |
| **Deprecated wallet adapters** | Use `@solana/wallet-adapter-react` v0.15.36+ |
| **Solang (Solidity→Solana)** | Immature, limited adoption, avoid |

---

## 8. Dependency Version Matrix

### Smart Contract Dependencies (Cargo.toml)

```toml
[dependencies]
anchor-lang = "0.31.0"
anchor-spl = "0.31.0"
spl-token-2022 = { version = "1.0.0", features = ["no-entrypoint"] }

[dev-dependencies]
solana-bankrun = "0.3.0"
```

### Frontend Dependencies (package.json)

```json
{
  "dependencies": {
    "next": "^15.0.0",
    "react": "^18.2.0",
    "@solana/web3.js": "^1.91.0",
    "@solana/wallet-adapter-react": "^0.15.36",
    "@solana/wallet-adapter-react-ui": "^0.9.35",
    "@solana/wallet-adapter-wallets": "^0.19.32",
    "@coral-xyz/anchor": "^0.31.0",
    "@jup-ag/api": "^6.0.0",
    "@prisma/client": "^5.0.0",
    "tailwindcss": "^3.4.0"
  },
  "devDependencies": {
    "typescript": "^5.3.0",
    "prisma": "^5.0.0"
  }
}
```

### Tooling Versions

- **Solana CLI:** 1.18+ (includes Token-2022 by default)
- **Rust:** 1.75+ (stable channel)
- **Anchor CLI:** 0.31.0+
- **Node.js:** 20 LTS

---

## 9. Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     USER BROWSERS                            │
│  (Phantom, Solflare, Backpack wallets via wallet-adapter)   │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│              NEXT.JS FRONTEND (Vercel)                       │
│  • App Router (SSR/SSG)                                      │
│  • @solana/wallet-adapter-react                              │
│  • @coral-xyz/anchor (TypeScript client)                     │
│  • Tailwind CSS + shadcn/ui                                  │
└────────┬──────────────────────┬─────────────────────────────┘
         │                      │
         ▼                      ▼
┌────────────────────┐  ┌────────────────────────────────────┐
│   JUPITER API      │  │   HELIUS RPC + GEYSER              │
│   (Swap routing)   │  │   • Transaction submission         │
│                    │  │   • Account fetching               │
│                    │  │   • Priority fee API               │
└────────────────────┘  └──────────┬─────────────────────────┘
                                   │
                                   ▼
                        ┌──────────────────────────┐
                        │   SOLANA MAINNET         │
                        │   • SolHEX Program       │
                        │     (Anchor + Token-2022)│
                        └──────────┬───────────────┘
                                   │
                                   │ (Geyser Plugin)
                                   ▼
                        ┌──────────────────────────┐
                        │  CUSTOM INDEXER          │
                        │  • Yellowstone gRPC      │
                        │  • Node.js processor     │
                        │  • Postgres + Prisma     │
                        └──────────┬───────────────┘
                                   │
                                   ▼
                        ┌──────────────────────────┐
                        │  ANALYTICS DASHBOARD     │
                        │  (Next.js API routes)    │
                        │  • Leaderboard           │
                        │  • Stake history         │
                        │  • APY charts            │
                        └──────────────────────────┘
```

---

## 10. Risk Assessment & Mitigation

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| **Token-2022 ecosystem gaps** | Medium | Medium | Use standard SPL Token if extensions not needed in v1 |
| **Anchor v1.0 breaking changes** | Low | High | Pin to 0.31.x, test beta releases early |
| **RPC provider downtime** | Low | High | Multi-provider fallback (Helius → QuickNode → public RPC) |
| **Geyser indexer lag** | Medium | Low | Implement catch-up logic, monitor lag metrics |
| **Jupiter API rate limits** | Low | Medium | Cache quotes for 30s, implement retry logic |
| **Wallet adapter Mobile bugs** | Low | Medium | Use wallet-adapter-react >=0.15.36 |

---

## 11. Decision Confidence Levels

| Component | Confidence | Verification Source |
|-----------|-----------|---------------------|
| Anchor 0.31.0+ | ⭐⭐⭐⭐⭐ | Official docs, Anchor CLI version |
| Token-2022 | ⭐⭐⭐⭐ | Solana docs, 6+ audits, mainnet adoption |
| Bankrun testing | ⭐⭐⭐⭐ | Anchor docs mention, growing adoption |
| Next.js 15 | ⭐⭐⭐⭐⭐ | Dominant Solana frontend framework |
| wallet-adapter-react 0.15.36+ | ⭐⭐⭐⭐⭐ | Official Solana wallet standard |
| @solana/web3.js v1 | ⭐⭐⭐⭐⭐ | Anchor requirement, stable |
| Helius RPC | ⭐⭐⭐⭐ | Widely used, Solana Foundation partner |
| Yellowstone Geyser | ⭐⭐⭐⭐ | Production-ready, multiple providers |
| Jupiter v6 | ⭐⭐⭐⭐⭐ | Market leader, $25B+ daily volume |
| Prisma ORM | ⭐⭐⭐⭐ | Standard for Web3 backends |

---

## 12. Open Questions for Roadmap Planning

1. **Token-2022 Extensions Needed?**
   - If YES: Transfer hooks for penalty enforcement, metadata pointer
   - If NO: Can use standard SPL Token initially, migrate later

2. **Indexer Self-Hosted vs. Managed?**
   - Self-hosted: More control, lower ongoing cost, requires DevOps
   - Managed (Helius webhooks): Easier, higher cost at scale

3. **Multisig for Upgrade Authority?**
   - Recommend Squads Protocol (Solana-native multisig)
   - Alternative: Governance token voting (future)

4. **Analytics Dashboard Real-Time Requirements?**
   - If <5s latency needed: Use Yellowstone gRPC
   - If 30s acceptable: RPC polling cheaper

---

## 13. Migration Path (Devnet → Mainnet)

1. **Devnet Phase:**
   - Deploy program with `--program-id` keypair (throwaway)
   - Use public Helius devnet RPC
   - Test with `@solana/wallet-adapter-react` devnet mode

2. **Mainnet-Beta Launch:**
   - Generate vanity program address (optional, via `solana-keygen grind`)
   - Deploy with upgrade authority = multisig
   - Configure Helius mainnet endpoint + API key
   - Enable monitoring (Sentry, Datadog)

3. **Post-Launch:**
   - Renounce upgrade authority OR transfer to DAO governance
   - Archive devnet deployment (optional)

---

## 14. Cost Estimates (Monthly)

| Service | Usage | Estimated Cost |
|---------|-------|----------------|
| **Helius RPC** | 10M requests/mo | $50-200 (Free tier → Growth plan) |
| **Vercel Hosting** | Next.js frontend | $0 (Hobby) to $20 (Pro) |
| **PostgreSQL** | AWS RDS t3.small | $30-50/mo |
| **Indexer Compute** | AWS EC2 t3.medium | $30-40/mo |
| **Monitoring** | Sentry + Datadog | $50-100/mo |
| **Total (MVP)** | | **$160-410/mo** |

*Note: Solana transaction fees negligible (<$0.01 per tx)*

---

## 15. References

### Official Documentation
- Anchor Framework: https://www.anchor-lang.com/docs
- Token-2022: https://www.solana-program.com/docs/token-2022
- Solana Web3.js: https://solana-labs.github.io/solana-web3.js/
- Wallet Adapter: https://github.com/anza-xyz/wallet-adapter
- Jupiter API: https://station.jup.ag/docs/apis/swap-api

### RPC Providers
- Helius: https://docs.helius.dev
- QuickNode: https://www.quicknode.com/docs/solana
- Triton: https://docs.triton.one

### Indexing Solutions
- Yellowstone gRPC: https://github.com/rpcpool/yellowstone-grpc
- Solana Geyser: https://docs.solanalabs.com/validator/geyser

### Community Resources
- Solana Cookbook: https://solanacookbook.com
- Solana Stack Exchange: https://solana.stackexchange.com
- Anchor Discord: https://discord.gg/anchor

---

## 16. Changelog

| Date | Change | Author |
|------|--------|--------|
| 2026-02-07 | Initial stack research | GSD Researcher |

---

**Next Steps for Roadmap Planning:**
1. Confirm Token-2022 extension requirements
2. Size development team (affects DevOps vs. managed services)
3. Define analytics dashboard MVP scope
4. Prototype Geyser indexer pipeline (Week 1 sprint)
