# HELIX Staking Protocol

Time-locked staking protocol on Solana. Burn-and-mint model — no token vaults.

## Development Workflow

**Always verify your work. This is the most important thing.**

```sh
# 1. Make changes

# 2. Build the program
anchor build

# 3. Run tests
npx vitest run tests/bankrun              # All tests
npx vitest run tests/bankrun -t "name"    # Specific test

# 4. Check for warnings
cargo clippy --package helix-staking -- -D warnings

# 5. Format before committing
cargo fmt --package helix-staking         # Rust
cd app/web && npx prettier --write .      # TypeScript

# 6. Before creating PR: run full suite
anchor build && npx vitest run tests/bankrun
```

## Math Parity (Critical)

**When you touch math, you must update both files simultaneously.**

- Rust: `programs/helix-staking/src/instructions/math.rs`
- TypeScript: `app/web/lib/solana/math.ts`
- Constants: `src/constants.rs` ↔ `lib/solana/constants.ts`

Both use `mul_div(a, b, c) = (a * b) / c` with u128/BN intermediates. `PRECISION = 1e9`. Token decimals: 8.

## Architecture

Three components: **Program** (Anchor/Rust) → **Indexer** (TypeScript/Fastify) → **Frontend** (Next.js 14).

- Program: `programs/helix-staking/` — Anchor 0.31.1, Token-2022, burn-and-mint
- Indexer: `services/indexer/` — Polls events, stores in PostgreSQL via Drizzle ORM
- Frontend: `app/web/` — wallet-adapter + React Query + Zustand

## Key Patterns

- **Check-Effects-Interactions**: State mutations before CPI calls. Never break this.
- **PDA seeds**: `[b"stake", user_pubkey, stake_id_le_bytes]` — see `src/constants.rs`
- **Events**: Every instruction emits an event with `slot: u64` (indexer depends on it)
- **Errors**: Use specific `HelixError` variants from `src/error.rs`
- **BPD lifecycle**: `initialize_claim_period` → `create_stake` → `finalize_bpd_calculation` → `seal_bpd_finalize` (24h) → `trigger_big_pay_day`

## Do NOT

- Add token vaults or escrow — burn-and-mint is intentional
- Change `StakeAccount::LEN` without migration support
- Use `unwrap()` — use `ok_or(HelixError::...)` or `?`
- Skip `slot: u64` in new events
- Use `@solana/web3.js` v2 — project is on v1 (1.95.x)
- Use Next.js 15 APIs — project is on 14
- Change `calculatePendingRewards` without verifying PRECISION division matches between Rust and TS
- Add a new instruction without emitting an event with `slot: u64`
- Use raw `connection.simulateTransaction()` — use `simulateTransactionOrThrow` from `useTransactionSimulation.ts`
- Use native `BigInt` for on-chain amounts — use BN.js
- Hardcode `new BN(10).pow(new BN(TOKEN_DECIMALS))` — use `DECIMALS_FACTOR` from `constants.ts`

## Self-Improvement

When Claude makes a mistake, add a rule to this file so it doesn't happen again. End corrections with: "Now update CLAUDE.md so you don't make that mistake again."
