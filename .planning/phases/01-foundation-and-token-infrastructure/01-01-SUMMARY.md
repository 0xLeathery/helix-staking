# Plan 01-01: Anchor Program Scaffold with Token-2022 Mint and GlobalState

**Status:** Complete
**Completed:** 2026-02-07

## Tasks Completed

| # | Task | Status | Commit |
|---|------|--------|--------|
| 1 | Initialize Anchor project scaffold with correct dependencies | Done | e73a2e9 |
| 2 | Implement constants, errors, events, and GlobalState account | Done | 81a3445 |
| 3 | Implement Initialize instruction with Token-2022 mint and GlobalState creation | Done | 8b4c833, 3d8a0f2 |

## Build Verification

- `anchor build` succeeds (exit code 0)
- `target/idl/helix_staking.json` contains `initialize` instruction
- `target/deploy/helix_staking.so` exists (278KB)
- Program ID: `E9B7BsxdPS89M66CRGGbsCzQ9LkiGv6aNsra3cNBJha7`

## Must-Haves Verified

| Requirement | Status |
|-------------|--------|
| Anchor program builds without errors | ✅ |
| Token-2022 mint with PDA mint authority (seeds: [b'mint_authority']) | ✅ |
| Token-2022 mint with metadata extension and 8 decimals | ✅ |
| GlobalState PDA with protocol parameters (inflation, min stake, share rate, slots_per_day) | ✅ |
| GlobalState with monotonic event counters | ✅ |
| overflow-checks = true in workspace Cargo.toml | ✅ |
| ProtocolInitialized event with slot field | ✅ |

## Artifacts Created

| File | Lines | Purpose |
|------|-------|---------|
| programs/helix-staking/src/lib.rs | 137 | Program entrypoint, Initialize instruction, Accounts struct |
| programs/helix-staking/src/constants.rs | 18 | Protocol constants (decimals, min stake, inflation, share rate, PDA seeds) |
| programs/helix-staking/src/error.rs | 28 | Custom error codes |
| programs/helix-staking/src/events.rs | 15 | ProtocolInitialized event with slot field |
| programs/helix-staking/src/state/global_state.rs | 76 | GlobalState PDA account struct |
| Cargo.toml | 14 | Workspace config with blake3 patch and overflow-checks |
| Anchor.toml | 23 | Anchor config with program ID |
| package.json | 22 | Test dependencies |

## Expert Board Advisory Notes Applied

1. ✅ overflow-checks = true in workspace Cargo.toml (security-expert)
2. ✅ InterfaceAccount for Token-2022 mint (anchor-expert)
3. ✅ Separate mint authority PDA (anchor-expert)
4. ✅ Monotonic event counters in GlobalState (indexer-expert)
5. ✅ ProtocolInitialized event with slot field (indexer-expert)

## Issues Encountered and Resolved

1. **blake3 edition2024 incompatibility** - blake3 1.8.3 requires Rust edition2024 but Solana platform-tools v1.51 uses Rust 1.84.1. Resolved by patching blake3 to 1.8.2 via git.

2. **Anchor 0.31 client code generation** - Anchor 0.31 requires `#[derive(Accounts)]` structs at crate root level for client code generation. Resolved by moving Initialize struct from instructions/initialize.rs to lib.rs.

3. **token_metadata_initialize imports** - Function is in `anchor_spl::token_2022_extensions`, not `token_interface`. Field name is `program_id`, not `token_program_id`.

## Deviation Log

| Type | What | Why | Impact |
|------|------|-----|--------|
| Structure | Moved Accounts struct to lib.rs | Anchor 0.31 requirement | None - functionally equivalent |
| Dependency | Patched blake3 to 1.8.2 | Platform-tools Rust version | None - identical API |
