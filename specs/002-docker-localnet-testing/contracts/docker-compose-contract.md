# Docker Compose Service Contract

**Feature**: `002-docker-localnet-testing` | **Date**: 2026-02-11

---

## Service Definitions

### validator

```yaml
validator:
  build:
    context: .
    dockerfile: Dockerfile
  platform: linux/amd64
  ports:
    - "${RPC_PORT:-8899}:8899"
    - "${WS_PORT:-8900}:8900"
  volumes:
    - ../target/deploy:/mnt/deploy:ro
    - ../target/idl:/mnt/idl:ro
    - ./logs:/mnt/logs:rw
  environment:
    - PROGRAM_SO_PATH=/mnt/deploy/helix_staking.so
    - IDL_PATH=/mnt/idl/helix_staking.json
    - WALLET_PATH=/app/test-wallet.json
  healthcheck:
    test: ["CMD-SHELL", "test -f /tmp/.bootstrap-complete && curl -sf http://127.0.0.1:8899/health"]
    interval: 2s
    timeout: 5s
    retries: 30
    start_period: 15s
  restart: "no"
```

**Contracts**:
- MUST expose RPC on port 8899 (internal)
- MUST expose WebSocket on port 8900 (internal)
- MUST mount `target/deploy/` as read-only at `/mnt/deploy/`
- MUST mount `target/idl/` as read-only at `/mnt/idl/`
- MUST create `/tmp/.bootstrap-complete` only after successful bootstrap
- MUST exit non-zero if bootstrap fails
- MUST handle SIGTERM gracefully (clean shutdown < 10s)

---

### postgres

```yaml
postgres:
  image: postgres:16-alpine
  ports:
    - "${POSTGRES_PORT:-5432}:5432"
  environment:
    POSTGRES_DB: ${POSTGRES_DB:-helix_indexer}
    POSTGRES_USER: ${POSTGRES_USER:-helix}
    POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:-helix}
  healthcheck:
    test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER:-helix}"]
    interval: 2s
    timeout: 5s
    retries: 10
  restart: "no"
```

**Contracts**:
- MUST be accessible on port 5432 (internal)
- MUST create database `helix_indexer` on first start
- MUST report healthy via `pg_isready`
- No dependency on validator service

---

## Dependency Graph

```
postgres (independent)
    │
    └──> indexer (future, depends_on: postgres + validator)
    
validator (independent)
    │
    └──> indexer (future, depends_on: postgres + validator)
```

Both `postgres` and `validator` start independently. Future indexer service would use:
```yaml
depends_on:
  postgres:
    condition: service_healthy
  validator:
    condition: service_healthy
```

---

## Volume Contracts

| Volume | Type | Persistence |
|--------|------|-------------|
| `target/deploy/` → `/mnt/deploy/` | Bind mount (ro) | Host-managed |
| `target/idl/` → `/mnt/idl/` | Bind mount (ro) | Host-managed |
| `docker/logs/` → `/mnt/logs/` | Bind mount (rw) | Persists across restarts |
| PostgreSQL data | Named volume (optional) | Destroyed with `down -v` |

---

## Network

Default Docker Compose network. Services reference each other by service name:
- Validator RPC from indexer: `http://validator:8899`
- PostgreSQL from indexer: `postgres://helix:helix@postgres:5432/helix_indexer`
