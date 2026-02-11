# HELIX Staking Protocol — Copilot Instructions

## Architecture

Three-component system: **Solana program** (Anchor/Rust) → **Indexer** (TypeScript) → **Frontend** (Next.js).

- **On-chain program** (`programs/helix-staking/`): Anchor 0.31.1 on Token-2022 with a **burn-and-mint model** — tokens are burned on stake and minted back on unstake/claim. There is no token vault or escrow. PDAs use 7 seed types defined in `src/constants.rs`.
- **Indexer** (`services/indexer/`): Polls `getSignaturesForAddress`, decodes Anchor events, stores in PostgreSQL via Drizzle ORM. Worker (`src/worker/`) and Fastify API (`src/api/`) run as separate processes.
- **Frontend** (`app/web/`): Next.js 14 + wallet-adapter + React Query + Zustand. RPC calls proxy through `/api/rpc` in production. All on-chain math is mirrored in `lib/solana/math.ts` using `BN.js` (must stay in exact parity with Rust `instructions/math.rs`).

## Math Parity (Critical)

Rust math (`programs/helix-staking/src/instructions/math.rs`) and TypeScript math (`app/web/lib/solana/math.ts`) must produce **identical results** for all inputs. When changing any calculation:
1. Update both files simultaneously
2. Constants live in `src/constants.rs` (Rust) and `lib/solana/constants.ts` (TS) — keep in sync
3. Both use `mul_div(a, b, c) = (a * b) / c` with u128/BN intermediates to avoid overflow
4. Protocol-favorable rounding uses `mul_div_up` (round up)
5. `PRECISION = 1_000_000_000` (1e9) is the fixed-point scaling factor everywhere

## Key On-Chain Patterns

- **PDA derivation**: Seeds in `constants.rs` (`GLOBAL_STATE_SEED`, `STAKE_SEED`, `MINT_SEED`, etc.). Stake PDAs use `[b"stake", user_pubkey, stake_id_le_bytes]` where `stake_id` is a monotonic counter from `GlobalState.total_stakes_created`.
- **Check-Effects-Interactions**: All instructions follow this pattern. State mutations happen before CPI calls (burns/mints). Do not break this ordering.
- **Events**: Every instruction emits an event with a `slot: u64` field (required by indexer for reorg handling). Event structs in `src/events.rs`.
- **Error codes**: `HelixError` enum in `src/error.rs`. Use specific error variants, not generic ones.
- **Account validation**: Use Anchor constraints in `#[derive(Accounts)]` structs. `remaining_accounts` is used for optional ClaimConfig in `create_stake`.

## BPD (Big Pay Day) Lifecycle

Multi-step process: `initialize_claim_period` → `create_stake` (w/ BPD eligibility) → `finalize_bpd_calculation` (batched) → `seal_bpd_finalize` (24h delay) → `trigger_big_pay_day` (per-stake). Anti-whale cap at 5% per stake (`BPD_MAX_SHARE_PCT`).

## Commands

```bash
# Program build + test
anchor build                           # Build program (from repo root)
npx vitest run tests/bankrun           # Run all 134 bankrun tests (from repo root)
npx vitest run tests/bankrun -t "name" # Run specific test by name

# Frontend
cd app/web && npm run dev              # Dev server
cd app/web && npx playwright test      # E2E tests

# Indexer
cd services/indexer && npm run dev:worker  # Start indexer worker
cd services/indexer && npm run dev:api     # Start API server
cd services/indexer && npm run db:generate # Generate Drizzle migrations
```

## Conventions

- **Bankrun tests** (`tests/bankrun/`): Use `solana-bankrun` + `anchor-bankrun` with Vitest. Setup helper `setupTest()` in `utils.ts` bootstraps a full program context. Tests import shared PDA helpers and constants that mirror on-chain values.
- **Frontend hooks** (`app/web/lib/hooks/`): One hook per instruction (`useCreateStake`, `useUnstake`, etc.) wrapping React Query mutations. Hooks must simulate transactions before sending.
- **Indexer schema** (`services/indexer/src/db/schema.ts`): One table per event type. All tables share `id`, `signature` (unique), `slot`, `createdAt` columns.
- **Token amounts**: Always 8 decimals (`TOKEN_DECIMALS = 8`). Display formatting converts from base units.
- **State accounts**: `GlobalState` is the singleton protocol config. `StakeAccount` is per-user-per-stake. `ClaimConfig` is singleton for the active claim period. `ClaimStatus` tracks per-user claim state.

## What NOT to Do

- Do not add token vaults or escrow patterns — the protocol intentionally uses burn-and-mint
- Do not change `StakeAccount::LEN` without migration support (existing accounts have fixed sizes)
- Do not use `unwrap()` in program code — use `ok_or(HelixError::...)` or `?`
- Do not skip the `slot` field in new events — the indexer depends on it
- Do not use `@solana/web3.js` v2 — the project is on v1 (`1.95.x`)
