# Tasks: Docker Localnet Testing Environment

**Input**: Design documents from `/specs/002-docker-localnet-testing/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: Not explicitly requested in the feature specification. Omitted.

**Organization**: Tasks grouped by user story for independent implementation and testing.

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story (e.g., US1, US2, US3, US4)
- File paths are relative to repository root

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create project structure and shared configuration files

- [ ] T001 Create `docker/` directory structure per plan.md (`docker/`, `docker/logs/.gitkeep`)
- [ ] T002 [P] Generate deterministic test wallet keypair and save to `docker/test-wallet.json`
- [ ] T003 [P] Create `docker/.env` with default environment variables (RPC_PORT, WS_PORT, POSTGRES_PORT, POSTGRES_DB, POSTGRES_USER, POSTGRES_PASSWORD) per data-model.md
- [ ] T004 [P] Create `docker/.gitignore` to exclude `logs/*.log` but keep `logs/.gitkeep`
- [ ] T005 [P] Add `docker/.dockerignore` to exclude `logs/`, `node_modules/`, `.env.local`

**Checkpoint**: Directory structure exists, test wallet committed, env defaults in place

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Dockerfile that builds a working Solana validator image — MUST complete before any user story

**⚠️ CRITICAL**: All user stories depend on a buildable Docker image

- [ ] T006 Create `docker/Dockerfile` with `FROM --platform=linux/amd64 ubuntu:22.04`, install Solana v1.18.26 via direct tarball extract to `/opt/solana-release/`, install `tini`, `curl`, Node.js 20.x LTS, and npm dependencies (`@coral-xyz/anchor`, `@solana/web3.js`, `@solana/spl-token`, `tsx`) per research.md Q1, Q2, Q6
- [ ] T007 Create `docker/package.json` with bootstrap script dependencies (`@coral-xyz/anchor`, `@solana/web3.js`, `@solana/spl-token`, `bn.js`) — installed during Docker build

**Checkpoint**: `docker build -f docker/Dockerfile docker/` succeeds. Image contains Solana CLI, Node.js, tini, curl.

---

## Phase 3: User Story 1 — Run Localnet Validator in Docker (Priority: P1) 🎯 MVP

**Goal**: Developer runs one Docker command → Solana localnet validator starts and accepts RPC requests on `localhost:8899`

**Independent Test**: `docker compose -f docker/docker-compose.yml up validator` → `curl -sf http://localhost:8899 -X POST -H "Content-Type: application/json" -d '{"jsonrpc":"2.0","id":1,"method":"getHealth"}'` returns `{"result":"ok"}`

### Implementation for User Story 1

- [ ] T008 [US1] Create `docker/entrypoint.sh` — start `solana-test-validator` in background with flags from research.md Q3 (`--reset`, `--bpf-program`, `--ledger`, `--rpc-port 8899`, `--faucet-port 9900`, `--log`, `--limit-ledger-size 50000000`, `--slots-per-epoch 150`, `--ticks-per-slot 8`), implement `wait_for_ready()` health check loop (curl getHealth, 1s interval, 30 retries, process liveness check per research.md Q5), signal trap for SIGTERM/SIGINT cleanup, and `wait $VALIDATOR_PID` at end
- [ ] T009 [US1] Update `docker/Dockerfile` to COPY `entrypoint.sh` and `test-wallet.json` into image, set `ENTRYPOINT ["tini", "--"]` and `CMD ["/app/entrypoint.sh"]`, add `HEALTHCHECK` directive per research.md Q5, expose ports 8899 and 8900
- [ ] T010 [US1] Create minimal `docker/docker-compose.yml` with only the `validator` service — build context, platform `linux/amd64`, port mappings (`${RPC_PORT:-8899}:8899`, `${WS_PORT:-8900}:8900`), bind-mount volumes (`../target/deploy:/mnt/deploy:ro`, `../target/idl:/mnt/idl:ro`, `./logs:/mnt/logs:rw`), environment variables, and healthcheck per contracts/docker-compose-contract.md
- [ ] T011 [US1] Add validator log streaming to `docker/entrypoint.sh` — tee validator output to `/mnt/logs/validator.log` AND container stdout per FR-012

**Checkpoint**: `docker compose -f docker/docker-compose.yml up validator` starts validator, RPC responds on port 8899, `docker stop` shuts down cleanly within 10s, logs appear both in `docker logs` and `docker/logs/validator.log`

---

## Phase 4: User Story 2 — Deploy Helix Program & Bootstrap Protocol (Priority: P1)

**Goal**: Container automatically deploys Helix Staking program at genesis and bootstraps protocol state (GlobalState, Mint, test wallet) so the program is immediately invocable

**Independent Test**: Start container → `curl` the program account at `E9B7BsxdPS89M66CRGGbsCzQ9LkiGv6aNsra3cNBJha7` → confirm it exists and is executable. Query GlobalState PDA → confirm it is initialized.

**Depends on**: Phase 3 (US1) — validator must be running and healthy before bootstrap

### Implementation for User Story 2

- [ ] T012 [US2] Create `docker/bootstrap.ts` — TypeScript script adapted from `scripts/devnet-validate.ts` that: (1) connects to `http://127.0.0.1:8899`, (2) loads IDL from `$IDL_PATH`, (3) derives GlobalState/Mint/MintAuthority PDAs, (4) checks if already initialized (idempotent), (5) calls `program.methods.initialize(params)` with default params from data-model.md, (6) airdrops 100 SOL to test wallet from `$WALLET_PATH`, (7) creates Token-2022 ATA for test wallet, (8) mints 10,000 HELIX via `admin_mint`
- [ ] T013 [US2] Update `docker/entrypoint.sh` to invoke `npx tsx /app/bootstrap.ts` after `wait_for_ready()` succeeds, exit non-zero on bootstrap failure, touch `/tmp/.bootstrap-complete` sentinel only after successful bootstrap, print summary (RPC URL, WS URL, test wallet public key, balances)
- [ ] T014 [US2] Update `docker/Dockerfile` to COPY `bootstrap.ts` and `package.json` into image, run `npm install --production` during build to pre-install Anchor/web3 dependencies
- [ ] T015 [US2] Add pre-flight validation to `docker/entrypoint.sh` — check that `$PROGRAM_SO_PATH` exists and is non-empty before starting validator, print helpful error message if missing ("Run 'anchor build' first")

**Checkpoint**: Container starts → program is deployed at `E9B7BsxdPS89M66CRGGbsCzQ9LkiGv6aNsra3cNBJha7` → GlobalState is initialized → test wallet has 100 SOL + 10,000 HELIX → bootstrap complete message printed → healthcheck reports healthy

---

## Phase 5: User Story 3 — Run Integration Tests Against Dockerized Localnet (Priority: P2)

**Goal**: Developers can run existing test suites and ad-hoc scripts from the host against the containerized validator using exposed RPC/WebSocket endpoints

**Independent Test**: Start container → run `curl` against RPC endpoint from host → send a `getVersion` request → receive valid response. Connect WebSocket client → subscribe to logs → receive events.

### Implementation for User Story 3

- [ ] T016 [P] [US3] Add npm convenience scripts to root `package.json` — `localnet:up`, `localnet:up:all`, `localnet:down`, `localnet:logs`, `localnet:status` per contracts/cli-interface.md
- [ ] T017 [US3] Create `docker/README.md` with developer documentation — prerequisites (Docker Desktop, `anchor build`), quick start commands, RPC URL (`http://localhost:8899`), WebSocket URL (`ws://localhost:8900`), test wallet info, troubleshooting guide (port conflicts, missing binary, Apple Silicon Rosetta, `--no-bpf-jit` fallback) per quickstart.md

**Checkpoint**: Developer runs `npm run localnet:up` from repo root → validator starts with program deployed → developer sends RPC requests from host successfully → `npm run localnet:down` stops cleanly

---

## Phase 6: User Story 4 — Compose Localnet with Indexer Dependencies (Priority: P3)

**Goal**: Single command starts full local stack (Solana validator + PostgreSQL) for end-to-end testing including the indexer pipeline

**Independent Test**: `docker compose -f docker/docker-compose.yml up` → both validator RPC (`localhost:8899`) and PostgreSQL (`localhost:5432`) are reachable → `docker compose down` stops cleanly with no orphans

### Implementation for User Story 4

- [ ] T018 [US4] Add `postgres` service to `docker/docker-compose.yml` — `postgres:16-alpine` image, port mapping (`${POSTGRES_PORT:-5432}:5432`), environment variables (`POSTGRES_DB`, `POSTGRES_USER`, `POSTGRES_PASSWORD`), healthcheck (`pg_isready`) per contracts/docker-compose-contract.md
- [ ] T019 [US4] Add `localnet:up:all` npm script behavior (if not already in T016) and add `.env` loading to `docker/docker-compose.yml` via `env_file: .env` directive
- [ ] T020 [US4] Update `docker/README.md` with full-stack section — how to start both services, indexer connection instructions (`DATABASE_URL`, `RPC_URL`), how to run `npm run db:migrate` against local PostgreSQL

**Checkpoint**: `npm run localnet:up:all` starts both validator and PostgreSQL → both healthchecks pass → indexer can connect to both services → `npm run localnet:down` stops all cleanly

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Documentation, edge cases, and cross-cutting improvements

- [ ] T021 [P] Add `docker/` section to root `README.md` — brief overview of localnet Docker tooling with link to `docker/README.md`
- [ ] T022 [P] Verify edge case: container behavior when `helix_staking.so` is missing — confirm entrypoint prints error and exits non-zero (covered by T015 pre-flight check)
- [ ] T023 Run quickstart.md validation — follow quickstart.md steps exactly on a clean checkout, verify all commands succeed, fix any discrepancies

---

## Dependencies & Execution Order

### Phase Dependencies

```
Phase 1: Setup ──────────────────────> No dependencies
Phase 2: Foundational ───────────────> Depends on Phase 1
Phase 3: US1 (Validator) ───────────-> Depends on Phase 2
Phase 4: US2 (Program + Bootstrap) ──> Depends on Phase 3
Phase 5: US3 (Host Integration) ─────> Depends on Phase 4
Phase 6: US4 (Compose + PostgreSQL) ─> Depends on Phase 4
Phase 7: Polish ─────────────────────> Depends on all desired phases
```

### User Story Dependencies

- **US1 (P1)**: Depends on Foundational only — delivers a running validator
- **US2 (P1)**: Depends on US1 — adds program deployment + protocol bootstrap
- **US3 (P2)**: Depends on US2 — adds host-side convenience scripts + docs
- **US4 (P3)**: Depends on US2 — adds PostgreSQL service (independent of US3)
- **US3 and US4 can run in parallel** after US2 completes

### Within Each User Story

- Entrypoint/core logic before Dockerfile updates
- Dockerfile updates before Compose updates
- Core implementation before convenience/docs

### Parallel Opportunities

Within Phase 1:
```
T002 (test wallet) ──┐
T003 (.env)         ──┼── All parallel (different files)
T004 (.gitignore)   ──┤
T005 (.dockerignore) ─┘
```

After Phase 4 completes (US2):
```
Phase 5: US3 (scripts + docs) ──┐
                                 ├── Parallel (no file conflicts)
Phase 6: US4 (compose + PG)   ──┘
```

---

## Implementation Strategy

### MVP First (User Stories 1 + 2)

1. Complete Phase 1: Setup (T001–T005)
2. Complete Phase 2: Foundational (T006–T007)
3. Complete Phase 3: US1 — Validator runs in Docker (T008–T011)
4. Complete Phase 4: US2 — Program deployed + protocol bootstrapped (T012–T015)
5. **STOP and VALIDATE**: Container starts, program is deployed, protocol initialized, test wallet funded
6. This is the MVP — developer can now test against dockerized localnet

### Incremental Delivery

1. Setup + Foundational → Image builds ✓
2. Add US1 → Validator runs in Docker ✓ (MVP-core)
3. Add US2 → Full bootstrap pipeline ✓ (MVP-complete)
4. Add US3 → Convenience scripts + docs ✓ (DX improvement)
5. Add US4 → Full stack with PostgreSQL ✓ (Indexer-ready)
6. Each story adds value without breaking previous stories

---

## Notes

- All Docker files are new (no existing Docker setup in the repo)
- `target/deploy/helix_staking.so` and `target/idl/helix_staking.json` must exist before starting container — enforce via pre-flight check in entrypoint
- The bootstrap script (`bootstrap.ts`) is adapted from the existing `scripts/devnet-validate.ts` — reuse PDA derivation and initialize logic
- `--bpf-program` flag deploys program at genesis (faster than post-startup `solana program deploy`)
- Apple Silicon users need Rosetta enabled in Docker Desktop — document prominently
- Total new files: ~8 (Dockerfile, docker-compose.yml, entrypoint.sh, bootstrap.ts, package.json, test-wallet.json, .env, README.md)
