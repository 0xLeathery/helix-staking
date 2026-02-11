# Quickstart: Docker Localnet Testing

**Feature**: `002-docker-localnet-testing` | **Date**: 2026-02-11

---

## Prerequisites

- **Docker Desktop** 4.25+ (macOS) or Docker Engine 24+ (Linux)
  - Apple Silicon: Enable "Use Rosetta for x86_64/amd64 emulation" in Docker Desktop → Settings → General
- **anchor build** must have been run at least once (produces `target/deploy/helix_staking.so` and `target/idl/helix_staking.json`)

---

## Quick Start (Validator Only)

```bash
# 1. Build the program (if not already built)
anchor build

# 2. Start the localnet validator
npm run localnet:up
```

The validator is ready when you see:
```
Bootstrap complete — validator healthy
RPC: http://localhost:8899
WebSocket: ws://localhost:8900
Test wallet: <PUBLIC_KEY> (100 SOL, 10000 HELIX)
```

## Quick Start (Full Stack: Validator + PostgreSQL)

```bash
# Start both services
npm run localnet:up:all

# Check status
npm run localnet:status

# View logs
npm run localnet:logs
```

---

## Running Tests Against Localnet

The existing bankrun test suite uses an in-process BanksServer and does **not** connect to an external RPC endpoint. Those tests continue to work unchanged via `npx vitest run tests/bankrun` (no Docker needed).

To verify the Docker container is working, use the smoke test or ad-hoc RPC calls:

```bash
# Run the RPC smoke test against the containerized validator
npx tsx docker/smoke-test.ts
```

Or send ad-hoc transactions:

```bash
# Check cluster version
curl -s http://localhost:8899 -X POST \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"getVersion"}' | jq

# Check program is deployed
solana program show E9B7BsxdPS89M66CRGGbsCzQ9LkiGv6aNsra3cNBJha7 \
  --url http://localhost:8899
```

---

## Running the Indexer Locally

With the full stack running:

```bash
cd services/indexer

# Point at local services
export DATABASE_URL=postgres://helix:helix@localhost:5432/helix_indexer
export RPC_URL=http://localhost:8899
export PROGRAM_ID=E9B7BsxdPS89M66CRGGbsCzQ9LkiGv6aNsra3cNBJha7

# Run migrations
npm run db:migrate

# Start worker
npm run dev:worker
```

---

## Stopping

```bash
# Stop and remove containers
npm run localnet:down

# Stop and remove containers + volumes (clean PostgreSQL data)
docker compose -f docker/docker-compose.yml down -v
```

---

## Troubleshooting

### Port already in use
```bash
# Use custom ports
RPC_PORT=9899 WS_PORT=9900 npm run localnet:up
```

### Program binary not found
```bash
# Ensure anchor build has been run
anchor build
ls target/deploy/helix_staking.so  # Should exist
```

### Slow startup on Apple Silicon
- Enable Rosetta emulation: Docker Desktop → Settings → General → "Use Rosetta for x86_64/amd64 emulation"
- Rosetta is significantly faster than QEMU for amd64 emulation

### "Illegal instruction" error
Add `--no-bpf-jit` to validator flags in `docker/entrypoint.sh` (uncomment the fallback line). This disables BPF JIT which can conflict with QEMU emulation.

### Container starts but tests fail
- Verify bootstrap completed: `docker compose -f docker/docker-compose.yml ps` should show `healthy`
- Check logs: `npm run localnet:logs`
- Verify program: `solana program show E9B7BsxdPS89M66CRGGbsCzQ9LkiGv6aNsra3cNBJha7 --url http://localhost:8899`

---

## File Inventory

| File | Purpose |
|------|---------|
| `docker/Dockerfile` | Validator container image (Ubuntu 22.04 + Solana 1.18.26 + Node.js) |
| `docker/docker-compose.yml` | Service orchestration (validator + PostgreSQL) |
| `docker/entrypoint.sh` | Container entrypoint: start validator, wait ready, run bootstrap |
| `docker/bootstrap.ts` | TypeScript: initialize protocol, fund wallet, mint test tokens |
| `docker/test-wallet.json` | Deterministic test keypair (localnet only) |
| `docker/.env` | Default environment variable overrides |
| `docker/logs/` | Validator log output directory (bind-mounted) |
