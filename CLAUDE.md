# HELIX Staking Protocol

## Architecture

Three-component system: **Solana program** (Anchor/Rust) → **Indexer** (TypeScript) → **Frontend** (Next.js).

- **On-chain program** (`programs/helix-staking/`): Anchor 0.31.1 on Token-2022 with a burn-and-mint model — tokens are burned on stake, minted back on unstake/claim. No token vault or escrow. PDAs use 7 seed types in `src/constants.rs`.
- **Indexer** (`services/indexer/`): Polls `getSignaturesForAddress`, decodes Anchor events, stores in PostgreSQL via Drizzle ORM. Worker and Fastify API run as separate processes.
- **Frontend** (`app/web/`): Next.js 14 + wallet-adapter + React Query + Zustand. RPC calls proxy through `/api/rpc` in production.

## Math Parity (Critical)

Rust math (`programs/helix-staking/src/instructions/math.rs`) and TypeScript math (`app/web/lib/solana/math.ts`) must produce **identical results** for all inputs. When changing any calculation:
1. Update both files simultaneously
2. Constants: `src/constants.rs` (Rust) ↔ `lib/solana/constants.ts` (TS) — keep in sync
3. Both use `mul_div(a, b, c) = (a * b) / c` with u128/BN intermediates
4. `PRECISION = 1_000_000_000` (1e9) fixed-point scaling factor everywhere
5. Token decimals: 8 (`TOKEN_DECIMALS = 8`)

## Commands

```bash
# Program
anchor build                           # Build program
npx vitest run tests/bankrun           # Run all bankrun tests
npx vitest run tests/bankrun -t "name" # Run specific test

# Frontend
cd app/web && npm run dev              # Dev server
cd app/web && npx playwright test      # E2E tests

# Indexer
cd services/indexer && npm run dev:worker  # Start worker
cd services/indexer && npm run dev:api     # Start API
cd services/indexer && npm run db:generate # Drizzle migrations
```

## Key Patterns

- **PDA seeds**: `[b"stake", user_pubkey, stake_id_le_bytes]` — stake_id is monotonic from `GlobalState.total_stakes_created`
- **Check-Effects-Interactions**: State mutations before CPI calls. Do not break this ordering.
- **Events**: Every instruction emits an event with `slot: u64` (required by indexer)
- **Error codes**: Use specific `HelixError` variants from `src/error.rs`, never generic errors
- **BPD lifecycle**: `initialize_claim_period` → `create_stake` → `finalize_bpd_calculation` → `seal_bpd_finalize` (24h delay) → `trigger_big_pay_day`

## Do NOT

- Add token vaults or escrow — protocol uses burn-and-mint intentionally
- Change `StakeAccount::LEN` without migration support
- Use `unwrap()` in program code — use `ok_or(HelixError::...)` or `?`
- Skip the `slot` field in new events
- Use `@solana/web3.js` v2 — project is on v1 (1.95.x)
- Use Next.js 15 APIs — project is on Next.js 14
