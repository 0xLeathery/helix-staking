# Helix Localnet — Docker Testing Environment

Run a Solana localnet validator with the Helix Staking program pre-deployed in a single Docker command. No local Solana CLI or Anchor installation required.

## Prerequisites

- **Docker Desktop** 4.25+ (macOS) or Docker Engine 24+ (Linux)
- **`anchor build`** must have been run at least once (produces `target/deploy/helix_staking.so` and `target/idl/helix_staking.json`)

### Apple Silicon (M1/M2/M3/M4)

Enable Rosetta emulation in Docker Desktop:

> **Settings → General → "Use Rosetta for x86_64/amd64 emulation on Apple Silicon"** ✓

This is required because Solana does not publish ARM64 Linux binaries. The container runs as `linux/amd64` under Rosetta/QEMU emulation.

## Quick Start

### Validator Only

```bash
# From repo root
npm run localnet:up
```

The validator is ready when you see:
```
Helix Localnet Ready!
RPC:       http://localhost:8899
WebSocket: ws://localhost:8900
```

### Full Stack (Validator + PostgreSQL)

```bash
npm run localnet:up:all
npm run localnet:status    # Check health
npm run localnet:logs      # View validator logs
```

### Stop

```bash
npm run localnet:down
```

## Endpoints

| Service    | URL                        | Purpose                    |
|------------|----------------------------|----------------------------|
| RPC        | `http://localhost:8899`    | JSON-RPC (Solana standard) |
| WebSocket  | `ws://localhost:8900`      | Subscriptions              |
| PostgreSQL | `localhost:5432`           | Indexer database           |

## What Gets Bootstrapped

On every container start, the entrypoint automatically:

1. Starts `solana-test-validator` with the Helix Staking program at `E9B7BsxdPS89M66CRGGbsCzQ9LkiGv6aNsra3cNBJha7`
2. Initializes the protocol (GlobalState, Mint, MintAuthority)
3. Airdrops **100 SOL** to the test wallet
4. Creates a Token-2022 ATA and mints **10,000 HELIX** to the test wallet

The test wallet keypair is committed at `docker/test-wallet.json` so all developers use the same address.

## Testing Against the Container

Send ad-hoc RPC requests:

```bash
# Check cluster version
curl -s http://localhost:8899 -X POST \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"getVersion"}' | jq

# Check program is deployed
curl -s http://localhost:8899 -X POST \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"getAccountInfo","params":["E9B7BsxdPS89M66CRGGbsCzQ9LkiGv6aNsra3cNBJha7",{"encoding":"jsonParsed"}]}' | jq '.result.value.executable'
```

> **Note:** The existing bankrun test suite (`npx vitest run tests/bankrun`) uses an in-process BanksServer and does **not** connect to the Docker RPC. Those tests continue to work unchanged without Docker.

## Running the Indexer Locally

With the full stack running (`npm run localnet:up:all`):

```bash
cd services/indexer

export DATABASE_URL=postgres://helix:helix@localhost:5432/helix_indexer
export RPC_URL=http://localhost:8899
export PROGRAM_ID=E9B7BsxdPS89M66CRGGbsCzQ9LkiGv6aNsra3cNBJha7

npm run db:migrate
npm run dev:worker
```

## Configuration

Override defaults via environment variables or `docker/.env`:

| Variable           | Default          | Description              |
|--------------------|------------------|--------------------------|
| `RPC_PORT`         | `8899`           | Host-side RPC port       |
| `WS_PORT`          | `8900`           | Host-side WebSocket port |
| `POSTGRES_PORT`    | `5432`           | Host-side PostgreSQL port|
| `POSTGRES_DB`      | `helix_indexer`  | Database name            |
| `POSTGRES_USER`    | `helix`          | Database user            |
| `POSTGRES_PASSWORD`| `helix`          | Database password        |

Example:
```bash
RPC_PORT=9899 npm run localnet:up
```

## Troubleshooting

### "Program binary not found"

```
ERROR: Program binary not found or empty at: /mnt/deploy/helix_staking.so
```

Run `anchor build` from the repo root before starting the container.

### Port already in use

```
Error: listen EADDRINUSE: address already in use :::8899
```

Either stop the conflicting process or override the port:
```bash
RPC_PORT=9899 npm run localnet:up
```

### "Illegal instruction (core dumped)" on Apple Silicon

Add the `--no-bpf-jit` flag to the validator. Edit `docker/entrypoint.sh` and add it to the `solana-test-validator` flags:
```bash
solana-test-validator \
    --no-bpf-jit \
    ...
```

This disables BPF JIT compilation which can conflict with QEMU emulation. Slightly slower but stable.

### Slow startup on Apple Silicon

Expected — QEMU emulation is ~2-3x slower than native x86_64. Cold start may take 30-45s. Subsequent starts (cached image) are much faster.

### Rebuild after Dockerfile changes

Program binary changes do **not** require rebuild (bind-mounted at runtime). Only rebuild when you change the Dockerfile or entrypoint:

```bash
docker compose -f docker/docker-compose.yml build --no-cache validator
```

## Architecture

```
docker/
├── Dockerfile           # Ubuntu 22.04 + Solana 1.18.26 + Node.js 20
├── docker-compose.yml   # Validator + PostgreSQL orchestration
├── entrypoint.sh        # Start validator → wait → bootstrap → serve
├── bootstrap.ts         # Initialize protocol, fund wallet, mint tokens
├── package.json         # Bootstrap dependencies (Anchor, web3.js)
├── test-wallet.json     # Deterministic test keypair
├── .env                 # Default environment variables
└── logs/                # Bind-mounted validator logs
```

The program binary (`helix_staking.so`) and IDL (`helix_staking.json`) are bind-mounted from `target/` at runtime — the Docker image never needs rebuilding when protocol code changes.
