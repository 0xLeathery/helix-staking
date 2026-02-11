# HELIX Staking Protocol

Time-locked staking protocol on Solana using Token-2022 with a burn-and-mint model.

## Architecture

| Component | Path | Tech |
|-----------|------|------|
| On-chain program | `programs/helix-staking/` | Anchor 0.31.1, Rust, Token-2022 |
| Frontend | `app/web/` | Next.js 14, wallet-adapter, React Query |
| Indexer | `services/indexer/` | Fastify 5, Drizzle ORM, PostgreSQL (Neon) |

**Program ID**: `E9B7BsxdPS89M66CRGGbsCzQ9LkiGv6aNsra3cNBJha7`

## Getting Started

### Prerequisites

- Rust / Cargo (stable)
- Anchor CLI v0.31.1 (`cargo install --git https://github.com/coral-xyz/anchor --tag v0.31.1 anchor-cli --locked`)
- Node.js 20+
- Docker (for verifiable builds)
- Solana CLI

### Install Dependencies

```bash
npm install
cd app/web && npm install
cd ../services/indexer && npm install
```

## Build

```bash
# Standard build
anchor build

# Verifiable build (produces deterministic .so via Docker)
anchor build --verifiable
```

The verifiable build output is in `target/verifiable/`.

## Test

```bash
# Run all bankrun tests (134 tests)
npx vitest run tests/bankrun

# Run a specific test by name
npx vitest run tests/bankrun -t "admin bounds check"

# Run Phase 8.1 audit fix tests
npx vitest run tests/bankrun/phase8.1
```

### Frontend

```bash
cd app/web
npm run dev        # Development server
npx playwright test # E2E tests
```

### Indexer

```bash
cd services/indexer
npm run dev:worker  # Start indexer worker
npm run dev:api     # Start API server
npm run db:generate # Generate Drizzle migrations
```

## Deploy

1. Build verifiable: `anchor build --verifiable`
2. Deploy: `anchor deploy --provider.cluster <mainnet|devnet>`
3. Verify: `anchor verify <PROGRAM_ID>`

## Docker Localnet

Run a Solana localnet validator with the Helix Staking program pre-deployed in Docker. No local Solana CLI required.

```bash
anchor build              # Build program first
npm run localnet:up       # Start validator with program + bootstrap
npm run localnet:down     # Stop
```

The container automatically initializes the protocol (GlobalState, Mint), funds a test wallet with 100 SOL + 10,000 HELIX, and exposes RPC on `localhost:8899`.

For full-stack testing (validator + PostgreSQL for indexer):
```bash
npm run localnet:up:all
```

See [docker/README.md](docker/README.md) for configuration, troubleshooting, and Apple Silicon setup.

## Security

- All admin instructions require multisig authority (Squads v4)
- BPD finalization uses `saturating_sub` to prevent underflow from speed bonuses
- RPC proxy implements method whitelist and per-IP rate limiting
- Frontend simulates all transactions before signing
- Indexer uses atomic checkpoint+event writes

See `specs/001-fix-audit-findings/` for the full audit remediation plan.
