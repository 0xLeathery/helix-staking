# Helix On-Chain Program

Anchor 0.31.1 program on Solana using Token-2022 extensions.

## Structure

- `src/lib.rs` — Program entrypoint, instruction dispatch
- `src/instructions/` — One file per instruction handler
- `src/instructions/math.rs` — All protocol math (must match `app/web/lib/solana/math.ts` exactly)
- `src/state/` — Account structs (`GlobalState`, `StakeAccount`, `ClaimConfig`, `ClaimStatus`, `ReferralRecord`)
- `src/constants.rs` — PDA seeds, numeric constants, limits
- `src/error.rs` — `HelixError` enum
- `src/events.rs` — Event structs (all must include `slot: u64`)
- `src/security/pda.rs` — PDA derivation helpers

## Rules

- Follow Check-Effects-Interactions: mutate state before CPIs
- Use `ok_or(HelixError::...)` instead of `unwrap()`
- Integer overflow checks are enabled in release profile
- All new instructions must emit an event with `slot: u64`
- Account validation goes in `#[derive(Accounts)]` constraints, not instruction body

## Build & Test

```bash
anchor build                           # from repo root
npx vitest run tests/bankrun           # all tests
npx vitest run tests/bankrun -t "name" # specific test
```
