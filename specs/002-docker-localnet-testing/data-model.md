# Data Model: Docker Localnet Testing Environment

**Feature**: `002-docker-localnet-testing` | **Date**: 2026-02-11

---

## Overview

This feature is infrastructure tooling — no database schema changes are introduced. The "entities" are Docker resources, configuration objects, and filesystem artifacts.

---

## Entities

### 1. Validator Container

The core Docker container running `solana-test-validator`.

| Property | Type | Value / Source | Notes |
|----------|------|----------------|-------|
| Image base | `FROM` | `--platform=linux/amd64 ubuntu:22.04` | Forced amd64 for Apple Silicon compat |
| Solana version | Static | `v1.18.26` | Pinned, matches Anchor 0.31.1 |
| RPC port | Env / Default | `8899` | Configurable via `$RPC_PORT` |
| WebSocket port | Env / Default | `8900` | Configurable via `$WS_PORT` |
| Faucet port | Internal | `9900` | Used by bootstrap for airdrops |
| Ledger path | Internal | `/tmp/test-ledger` | Ephemeral, cleared on `--reset` |
| Program path | Bind mount | `/mnt/deploy/helix_staking.so` | Host: `target/deploy/` |
| IDL path | Bind mount | `/mnt/idl/helix_staking.json` | Host: `target/idl/` |
| Log path | Bind mount | `/mnt/logs/validator.log` | Host: `docker/logs/` |
| PID 1 | Process | `tini` | Signal forwarding + zombie reaping |
| Bootstrap marker | File | `/tmp/.bootstrap-complete` | Sentinel for healthcheck |

### 2. Program Binary

The precompiled Helix Staking BPF artifact.

| Property | Type | Value |
|----------|------|-------|
| Program ID | PublicKey | `E9B7BsxdPS89M66CRGGbsCzQ9LkiGv6aNsra3cNBJha7` |
| Binary path (host) | File | `target/deploy/helix_staking.so` |
| Binary path (container) | Bind mount | `/mnt/deploy/helix_staking.so` |
| Deploy method | `--bpf-program` | At genesis via validator flag |
| IDL path (host) | File | `target/idl/helix_staking.json` |
| IDL path (container) | Bind mount | `/mnt/idl/helix_staking.json` |

### 3. Test Wallet

Deterministic keypair committed to the repo for local testing.

| Property | Type | Value |
|----------|------|-------|
| Keypair file | JSON | `docker/test-wallet.json` |
| Container path | Copied | `/app/test-wallet.json` |
| Funded amount | SOL | 100 SOL (via `solana airdrop`) |
| Token account | ATA | Created during bootstrap (Token-2022) |
| Token mint amount | HELIX | 10,000 HELIX (via `admin_mint`) |

### 4. Protocol State (bootstrapped)

Accounts initialized during container startup.

| Account | PDA Seeds | Created By |
|---------|-----------|------------|
| GlobalState | `["global_state"]` | `initialize` instruction |
| Mint (Token-2022) | `["helix_mint"]` | `initialize` instruction |
| MintAuthority | `["mint_authority"]` | `initialize` instruction |
| Test wallet ATA | Token-2022 ATA derivation | Bootstrap script |

### 5. PostgreSQL Service (Compose)

Companion database for indexer testing.

| Property | Type | Value |
|----------|------|-------|
| Image | Docker | `postgres:16-alpine` |
| Database | Env | `helix_indexer` |
| User | Env | `helix` |
| Password | Env | `helix` |
| Port | Exposed | `5432` |
| Healthcheck | CMD | `pg_isready -U helix` |

---

## Configuration Environment Variables

| Variable | Default | Used By | Description |
|----------|---------|---------|-------------|
| `RPC_PORT` | `8899` | Validator | JSON-RPC port exposed to host |
| `WS_PORT` | `8900` | Validator | WebSocket port exposed to host |
| `PROGRAM_SO_PATH` | `/mnt/deploy/helix_staking.so` | Entrypoint | Path to program binary inside container |
| `IDL_PATH` | `/mnt/idl/helix_staking.json` | Bootstrap | Path to Anchor IDL inside container |
| `WALLET_PATH` | `/app/test-wallet.json` | Bootstrap | Path to test keypair |
| `POSTGRES_DB` | `helix_indexer` | PostgreSQL | Database name |
| `POSTGRES_USER` | `helix` | PostgreSQL | Database user |
| `POSTGRES_PASSWORD` | `helix` | PostgreSQL | Database password |

---

## Bind Mount Mapping

| Host Path | Container Path | Mode | Purpose |
|-----------|----------------|------|---------|
| `./target/deploy/` | `/mnt/deploy/` | `ro` | Program binary (FR-004, FR-006) |
| `./target/idl/` | `/mnt/idl/` | `ro` | Anchor IDL for bootstrap |
| `./docker/logs/` | `/mnt/logs/` | `rw` | Persistent validator logs (FR-012) |

---

## State Transitions

```
Container Start
    │
    ▼
[Validator Starting] ──(--bpf-program)──> Program loaded at genesis
    │
    ▼
[Validator Ready] ──(health check passes)──> RPC accepting requests
    │
    ▼
[Bootstrap Running]
    ├── Initialize protocol (GlobalState + Mint + MintAuthority)
    ├── Airdrop SOL to test wallet
    ├── Create test wallet ATA
    └── Mint HELIX to test wallet
    │
    ▼
[Bootstrap Complete] ──(touch sentinel)──> Healthcheck reports healthy
    │
    ▼
[Ready for Testing] ──(docker stop)──> SIGTERM → clean shutdown
```
