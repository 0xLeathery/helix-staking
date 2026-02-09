---
color: cyan
position:
  x: 925
  y: -851
isContextNode: false
agent_name: Aki
---

# Anchor & Rust Workspace

## Build system for the Solana on-chain program: Anchor.toml, workspace Cargo.toml, and program Cargo.toml

### Anchor.toml (`/Anchor.toml`)

Anchor CLI version is locked to **0.31.1** via the `[toolchain]` block. Seeds derivation is enabled; linting is not skipped.

```toml
[toolchain]
anchor_version = "0.31.1"

[features]
seeds = true
skip-lint = false
```

**Program ID** is the same across all network targets:

- Localnet: `E9B7BsxdPS89M66CRGGbsCzQ9LkiGv6aNsra3cNBJha7`
- Devnet: `E9B7BsxdPS89M66CRGGbsCzQ9LkiGv6aNsra3cNBJha7`

Provider defaults to `Localnet` with `~/.config/solana/id.json` wallet. Test runner is configured with a 5s startup wait.

The test script invokes `ts-mocha` (legacy), but the project has migrated to vitest -- see root `vitest.config.ts`.

### Workspace Cargo.toml (`/Cargo.toml`)

```toml
[workspace]
members = ["programs/*"]
resolver = "2"
```

**Critical patch**: `blake3` is pinned to tag `1.8.2` because version `1.8.3+` requires Rust `edition2024`, which is incompatible with Solana's platform-tools (Rust 1.84).

**Release profile** is tuned for on-chain deployment safety:
- `overflow-checks = true` -- arithmetic panics on overflow (security requirement)
- `lto = "fat"` -- full link-time optimization for smaller binary
- `codegen-units = 1` -- single codegen unit for maximum optimization
- Build override: `opt-level = 3` with no incremental compilation

### Program Cargo.toml (`/programs/helix-staking/Cargo.toml`)

```toml
[package]
name = "helix-staking"
edition = "2021"

[dependencies]
anchor-lang = "0.31"
anchor-spl = { version = "0.31", features = ["metadata", "token_2022"] }
spl-token-2022 = { version = "6", features = ["no-entrypoint"] }
solana-nostd-keccak = "0.1"  # Merkle proof verification
```

Features include `idl-build` for Anchor IDL generation and `cpi` for cross-program invocations.

### Root package.json (`/package.json`)

Two test entry points:
- `npm test` -- `anchor test` (full validator lifecycle)
- `npm run test:bankrun` -- `vitest run tests/bankrun` (fast, deterministic, no validator)

Key dependencies: `@coral-xyz/anchor ^0.31.0`, `@solana/web3.js ^1.95.0`.

### vitest.config.ts (`/vitest.config.ts`)

```ts
pool: 'forks',       // Required -- bankrun native bindings crash with threads
singleFork: true,    // All tests share one process (avoids forking overhead)
testTimeout: 1000000, // ~16 minutes -- bankrun tests are slow
hookTimeout: 1000000,
```

The `forks` pool is mandatory because `solana-bankrun` uses native Node addons that are not thread-safe.

### Build Pipeline

```
anchor build
  -> target/deploy/helix_staking.so      (on-chain program binary)
  -> target/idl/helix_staking.json       (IDL for client generation)
  -> target/types/helix_staking.ts       (TypeScript types)

Manual step: copy IDL to app/web/public/idl/helix_staking.json
```

### Notable Gotchas

- **Same program ID everywhere**: localnet and devnet share `E9B7Bs...`. Mainnet will also reuse this unless redeployed to a fresh keypair.
- **blake3 patch is fragile**: If upstream releases a new compatible version or Solana upgrades platform-tools past Rust 1.84, the patch must be updated or removed.
- **IDL copy is manual**: No script or CI step copies the generated IDL to the frontend public directory. Forgetting this breaks client-side deserialization.
- **Anchor 0.31 lock**: Upgrading to Anchor 0.32+ introduces breaking changes in account validation. Stay on 0.31.x.
- **vitest forks mode**: Using `pool: 'threads'` will segfault due to bankrun's native bindings. This is a hard requirement.
- **`overflow-checks = true`** in release profile is a security decision -- it prevents silent integer wrapping in the deployed program binary.

[[config-and-deployment.md]]
