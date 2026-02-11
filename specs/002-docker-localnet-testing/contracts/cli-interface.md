# CLI Interface Contract: Docker Localnet Commands

**Feature**: `002-docker-localnet-testing` | **Date**: 2026-02-11

---

## Overview

The user-facing interface for this feature is a set of CLI commands (shell scripts / npm scripts / docker commands). There are no HTTP APIs — the validator's existing JSON-RPC API is the programmatic interface.

---

## Primary Commands

### 1. Start Validator (standalone)

```bash
# From repo root
docker compose -f docker/docker-compose.yml up validator
```

**Behavior**:
- Builds image if not cached
- Starts `solana-test-validator` with program pre-loaded at genesis
- Runs bootstrap (initialize protocol, fund test wallet)
- Exposes RPC on `localhost:8899`, WebSocket on `localhost:8900`
- Container reports healthy only after bootstrap completes

**Exit codes**:
| Code | Meaning |
|------|---------|
| 0 | Clean shutdown (docker stop) |
| 1 | Bootstrap failed (program deploy or initialize error) |
| 137 | SIGKILL (docker kill or OOM) |

---

### 2. Start Full Stack (validator + PostgreSQL)

```bash
# From repo root
docker compose -f docker/docker-compose.yml up
```

**Behavior**:
- Starts PostgreSQL first (no dependencies)
- Starts validator, waits for bootstrap
- Indexer service can connect after both are healthy

**Services started**:
| Service | Port | Healthcheck |
|---------|------|-------------|
| `validator` | `8899` (RPC), `8900` (WS) | Sentinel + RPC getHealth |
| `postgres` | `5432` | `pg_isready` |

---

### 3. Stop All Services

```bash
docker compose -f docker/docker-compose.yml down
```

**Behavior**: Graceful shutdown. SIGTERM → validator cleanup → container exit. Ledger and DB data destroyed (ephemeral by default).

---

### 4. Stop with Volume Cleanup

```bash
docker compose -f docker/docker-compose.yml down -v
```

**Behavior**: Same as stop, plus removes named volumes (PostgreSQL data).

---

### 5. View Logs

```bash
# Real-time
docker compose -f docker/docker-compose.yml logs -f validator

# From host file
tail -f docker/logs/validator.log
```

---

### 6. Rebuild Image (after Dockerfile changes)

```bash
docker compose -f docker/docker-compose.yml build --no-cache validator
```

**Note**: Program binary changes do NOT require rebuild (bind-mounted). Only Dockerfile or entrypoint script changes need rebuild.

---

## NPM Script Aliases (convenience)

To be added to root `package.json`:

```json
{
  "scripts": {
    "localnet:up": "docker compose -f docker/docker-compose.yml up validator -d && docker compose -f docker/docker-compose.yml logs -f validator",
    "localnet:up:all": "docker compose -f docker/docker-compose.yml up -d",
    "localnet:down": "docker compose -f docker/docker-compose.yml down",
    "localnet:logs": "docker compose -f docker/docker-compose.yml logs -f validator",
    "localnet:status": "docker compose -f docker/docker-compose.yml ps"
  }
}
```

---

## Environment Variable Overrides

All configurable via `.env` file in `docker/` or via command-line:

```bash
# Override RPC port
RPC_PORT=9899 docker compose -f docker/docker-compose.yml up validator

# Override both ports
RPC_PORT=9899 WS_PORT=9900 docker compose -f docker/docker-compose.yml up validator
```

| Variable | Default | Scope |
|----------|---------|-------|
| `RPC_PORT` | `8899` | Host-side port mapping |
| `WS_PORT` | `8900` | Host-side port mapping |
| `POSTGRES_PORT` | `5432` | Host-side port mapping |
| `POSTGRES_DB` | `helix_indexer` | Database name |
| `POSTGRES_USER` | `helix` | Database user |
| `POSTGRES_PASSWORD` | `helix` | Database password |

---

## RPC Interface (existing, no changes)

The validator exposes the standard Solana JSON-RPC API at `http://localhost:8899`. No custom endpoints are added. Key methods for testing:

| Method | Purpose |
|--------|---------|
| `getHealth` | Health check (returns `{"result":"ok"}`) |
| `getClusterNodes` | Verify single-node cluster |
| `getVersion` | Confirm Solana version (1.18.x) |
| `getAccountInfo` | Query program/PDA accounts |
| `sendTransaction` | Submit transactions |
| `getLatestBlockhash` | Get recent blockhash for tx building |

WebSocket subscriptions available at `ws://localhost:8900`:
- `accountSubscribe` — watch account changes
- `logsSubscribe` — stream transaction logs
- `programSubscribe` — watch program account changes
