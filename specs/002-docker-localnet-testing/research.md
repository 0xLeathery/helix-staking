# Phase 0 Research: Docker Localnet Testing Environment

**Feature**: `002-docker-localnet-testing` | **Date**: 2025-02-11  
**Input**: [plan.md](plan.md) research questions  
**Sources**: Docker Hub, GitHub releases, Solana documentation, Stack Exchange, community Dockerfiles

---

## Q1 — Best base image for multi-arch Docker (amd64 + arm64/Apple Silicon)

### Decision

Use `--platform=linux/amd64` with **`ubuntu:22.04`** as the base image, and install Solana CLI binaries manually from `release.solana.com`. Do **not** target native `linux/arm64`.

### Rationale

- **No native ARM64 Linux binaries exist** for any Solana CLI version. The official install script at `release.solana.com` only publishes `x86_64-unknown-linux-gnu` and `x86_64-apple-darwin` tarballs. Attempting to install inside an `arm64` container yields a 404 (the `aarch64-unknown-linux-gnu` artifact does not exist).
- **All official Docker images are amd64-only**. Both `solanalabs/solana` (Docker Hub) and `anzaxyz/agave` (Docker Hub) publish only `linux/amd64` manifests — no multi-arch manifests, no ARM64 variants.
- **Apple Silicon runs amd64 containers via Rosetta/QEMU**. Docker Desktop for macOS transparently emulates `linux/amd64` containers on M-series chips. Performance is slower than native but entirely workable for a test validator (confirmed by the `foxreymann/SolanaAnchorDocker` community project and multiple Stack Exchange answers).
- **`ubuntu:22.04` is the standard base** used by the official `solanalabs/solana` Docker images and by community Dockerfiles for Anchor development. It provides the required `libudev`, `libssl`, and other system libraries without extra setup.

### Alternatives Considered

| Alternative | Why rejected |
|---|---|
| `solanalabs/solana:v1.18.x` as base | Possible (see Q2), but the image is a black box — harder to customize entrypoint, add bootstrap scripts, control layer caching. Better to own the build. |
| `anzaxyz/agave` as base | No 1.18.x tags available (only v3.x+). The 1.18.x line was released before the Agave fork. |
| True multi-arch (native arm64) | Blocked — Solana does not publish ARM64 Linux binaries. Building from source is a 20+ minute compile and adds Rust toolchain to the image. Not justified for dev tooling. |
| `debian:bookworm-slim` | Would work equally well but `ubuntu:22.04` has more community precedent in the Solana ecosystem and matches the official images. |
| Alpine Linux | Missing `glibc`; Solana binaries are dynamically linked against glibc. Would require `musl` compatibility hacks. |

---

## Q2 — Latest stable Solana CLI 1.18.x version and official Docker image availability

### Decision

Pin to **`v1.18.26`** (latest 1.18.x tag on Docker Hub). Use the direct tarball install method rather than the `solana-install` script for deterministic, cacheable Docker layers.

### Rationale

- **Docker Hub `solanalabs/solana` tags**: v1.18.15 through v1.18.26 all exist. Each is ~363 MB, `linux/amd64` only. `v1.18.26` is the highest-numbered 1.18.x tag.
- **GitHub releases**: `v1.18.23` is the last release explicitly marked "suitable for use on Mainnet Beta" (released Aug 31, 2024) on the `solana-labs/solana` repository. The `solana-labs/solana` repo was **archived January 22, 2025**. Tags v1.18.24–v1.18.26 appear to be post-archive community/Docker-only builds, but their binaries are functionally identical for localnet testing.
- **Install method**: Rather than `sh -c "$(curl -sSfL https://release.solana.com/v1.18.26/install)"` (which downloads to `~/.local/share/solana/install/` and is not cache-friendly), download the tarball directly:
  ```dockerfile
  RUN curl -fsSL https://release.solana.com/v1.18.26/solana-release-x86_64-unknown-linux-gnu.tar.bz2 \
      | tar -xjC /opt \
      && ln -s /opt/solana-release/bin/* /usr/local/bin/
  ```
  This gives a single cacheable layer and a deterministic binary location.
- **`solana-install` no longer supports channel names** (`edge`, `beta`, `stable`). Explicit version pinning is mandatory.

### Alternatives Considered

| Alternative | Why rejected |
|---|---|
| `v1.18.23` (last mainnet-tagged) | Acceptable fallback. We prefer v1.18.26 for bug fixes, but either works for localnet. If any issue arises, downgrade to v1.18.23. |
| `v2.x` / `v3.x` (Agave) | Incompatible with Anchor 0.31.1. The Anchor 0.31.1 toolchain targets the 1.18.x runtime. Upgrading Anchor is out of scope. |
| `solana-install` script | Adds an extra indirection layer, requires `HOME` and `PATH` setup, and the cache directory structure is less Docker-friendly than a direct tarball extract. |
| Using the `solanalabs/solana:v1.18.26` image directly | Viable as a `FROM` base, but the entrypoint and included files differ from what we need. We'd still override the entrypoint and add our own bootstrap scripts. Owning the Dockerfile from `ubuntu:22.04` is simpler. |

---

## Q3 — Key `solana-test-validator` flags for this project

### Decision

Use the following flag set in the entrypoint script:

```bash
solana-test-validator \
  --reset \
  --bpf-program E9B7BsxdPS89M66CRGGbsCzQ9LkiGv6aNsra3cNBJha7 /mnt/deploy/helix_staking.so \
  --ledger /tmp/test-ledger \
  --rpc-port 8899 \
  --faucet-port 9900 \
  --log \
  --limit-ledger-size 50000000 \
  --slots-per-epoch 150 \
  --ticks-per-slot 8 \
  &
```

Run as a background process, then wait for readiness before executing the bootstrap script.

### Rationale

| Flag | Purpose |
|---|---|
| `--reset` | Clears previous ledger on every start. Ensures clean state per the spec requirement (FR-009). |
| `--bpf-program <ADDR> <PATH>` | Deploys the Helix Staking program at genesis. The .so file is bind-mounted from the host's `target/deploy/`. This satisfies FR-004 (auto-deploy on startup) and FR-006 (no rebuild needed). |
| `--ledger /tmp/test-ledger` | Explicit ledger directory inside the container. Ephemeral by default (spec assumption). |
| `--rpc-port 8899` | Default Solana RPC port. Exposed to host via Docker port mapping. Satisfies FR-002. |
| `--faucet-port 9900` | Required for `solana airdrop` to work inside the container during bootstrap. |
| `--log` | Streams validator logs to stdout. Combined with `tee` in the entrypoint, satisfies FR-012 (both stdout and file logging). |
| `--limit-ledger-size 50000000` | ~50M shreds. Prevents unbounded ledger growth during long test sessions (edge case from spec). |
| `--slots-per-epoch 150` | Short epochs speed up any epoch-dependent logic in tests. |
| `--ticks-per-slot 8` | Faster slot times for quicker test execution. Default is 64; 8 gives ~8x speedup. |

**Token-2022**: No special flag is needed. Token-2022 (SPL Token Extensions program) is **built-in** to `solana-test-validator` as of Solana 1.17.x. It is deployed at genesis automatically at the well-known address `TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb`.

**Additional flags available but not needed at start**:
- `--account <ADDRESS> <FILE.json>` — Preload account state from a JSON file. Useful if we later want to snapshot protocol state.
- `--clone <ADDRESS>` — Clone an account from mainnet/devnet (requires network access). Not needed for localnet isolation.
- `--url <CLUSTER_URL>` — Sets the cluster to clone from. Only relevant with `--clone`.
- `--mint <KEYPAIR>` — Override the faucet mint keypair. Default is fine for our use case.
- `--deactivate-feature <FEATURE_PUBKEY>` — Disable specific validator features. Useful for testing feature-gate scenarios.
- `--warp-slot <SLOT>` — Start the validator at a specific slot. Useful for time-dependent tests.
- `--dynamic-port-range <LOW>-<HIGH>` — Constrain dynamic port allocation for TPU/gossip. May be useful in Docker to avoid port conflicts.

### Alternatives Considered

| Alternative | Why rejected |
|---|---|
| Deploy program via `solana program deploy` after startup | Adds latency and requires the validator to be fully ready first. `--bpf-program` at genesis is instant and atomic. |
| `--no-bpf-jit` | Disables BPF JIT compilation. May be needed if QEMU causes issues with JIT on ARM64 emulation. Keep as fallback flag — add if "Illegal instruction" errors surface. |
| `--gossip-port`, `--tpu-port` | Only needed for multi-validator clusters. Single-node localnet doesn't need explicit gossip/TPU config. |

---

## Q4 — Known ARM64 / Apple Silicon issues with `solana-test-validator` in Docker

### Decision

Force `--platform=linux/amd64` in the Dockerfile and document the QEMU emulation trade-off. Keep `--no-bpf-jit` as a fallback flag to add if JIT-related crashes appear.

### Rationale

**Confirmed issues from the ecosystem:**

1. **No ARM64 Linux binaries** — The Solana install script attempts to download an `aarch64-unknown-linux-gnu` tarball that does not exist, causing a 404 error. This is the root cause reported in [Stack Exchange #17903](https://solana.stackexchange.com/questions/17903/) (Nov 2024) and [#14605](https://solana.stackexchange.com/questions/14605/) (Jun 2024). The fix is `FROM --platform=linux/amd64`.

2. **"Illegal instruction (core dumped)"** — GitHub issue [solana-labs/solana#26715](https://github.com/solana-labs/solana/issues/26715) (Jul 2022, closed). Occurs when attempting to run x86_64 Solana binaries without proper emulation. Docker Desktop's Rosetta 2 / QEMU emulation resolves this for most users. If it reoccurs, `--no-bpf-jit` disables the BPF JIT compiler which is the most common source of "Illegal instruction" under emulation.

3. **M1/M2 deployment failures** — GitHub issue [solana-labs/solana#18033](https://github.com/solana-labs/solana/issues/18033) (Jul 2022, closed, 37 comments). Broad discussion of M1 compatibility issues. Most were resolved by the community settling on `--platform=linux/amd64` Docker images with QEMU emulation.

4. **Community reference implementation** — The [foxreymann/SolanaAnchorDocker](https://github.com/foxreymann/SolanaAnchorDocker) project (Dec 2024) uses exactly this pattern:
   ```dockerfile
   FROM --platform=linux/amd64 ubuntu:22.04
   ```
   and confirms it works on "standard updated M1 Macbook" after forcing amd64 platform.

**Performance under QEMU emulation:**
- Validator startup: ~2-3x slower than native amd64 (~10-20s vs ~5-8s)
- Transaction processing: Usable for testing, noticeably slower for high-throughput benchmarks
- Memory overhead: ~10-20% additional due to QEMU translation
- All within the spec's performance goals (cold start < 60s, memory < 2GB)

### Alternatives Considered

| Alternative | Why rejected |
|---|---|
| Build Solana from source for ARM64 | 20-30 minute compile, adds ~2 GB Rust toolchain to image, not officially supported, may hit platform-specific bugs in the BPF VM. Complexity far exceeds benefit for dev tooling. |
| Require Intel Mac / Linux only | Excludes Apple Silicon users which are the majority of the dev team (per plan.md target platforms). |
| Use Docker Desktop Rosetta emulation | This is what `--platform=linux/amd64` enables automatically on Apple Silicon. Not an alternative — it's the mechanism. Just needs to be documented. |
| Wait for official ARM64 support | No indication Anza/Solana Labs will publish ARM64 Linux builds. The archive of `solana-labs/solana` and focus on Agave (which also has no ARM64 images) suggests this won't happen for 1.18.x. |

---

## Q5 — Recommended health check approach

### Decision

Use **RPC JSON-RPC `getHealth` polling** as the primary health check, with a shell-script wrapper for Docker `HEALTHCHECK` and bootstrap wait-loop.

### Rationale

```bash
# Health check function (used in entrypoint.sh and HEALTHCHECK)
check_health() {
  curl -sf http://localhost:8899 \
    -X POST \
    -H "Content-Type: application/json" \
    -d '{"jsonrpc":"2.0","id":1,"method":"getHealth"}' \
    | grep -q '"result":"ok"'
}
```

**Why `getHealth`:**
- It's the **official RPC health endpoint** — returns `{"result":"ok"}` when the validator is ready to process transactions, or an error when it's still starting up.
- It tests the **full RPC stack**, not just process liveness. A validator can be running but not yet ready to accept transactions (e.g., still loading the ledger).
- It requires only `curl` — no Solana CLI tools needed in the health check path.
- It's the same endpoint used by Solana's own infrastructure for validator monitoring.

**Docker HEALTHCHECK directive:**
```dockerfile
HEALTHCHECK --interval=3s --timeout=2s --start-period=15s --retries=10 \
  CMD curl -sf http://localhost:8899 -X POST \
    -H "Content-Type: application/json" \
    -d '{"jsonrpc":"2.0","id":1,"method":"getHealth"}' \
    | grep -q '"result":"ok"'
```

- `--start-period=15s`: Gives the validator time to initialize before counting failures.
- `--interval=3s`: Check every 3 seconds.
- `--retries=10`: Mark unhealthy after 10 consecutive failures (~30s after start period).

**Bootstrap wait-loop** (in `entrypoint.sh`):
```bash
echo "Waiting for validator to be ready..."
until check_health; do
  sleep 1
done
echo "Validator is ready."
# Run bootstrap.sh here
```

### Alternatives Considered

| Alternative | Why rejected |
|---|---|
| `solana cluster-version -u localhost` | Requires Solana CLI in the health check path. Works, but `curl` is lighter and already available. Also, `cluster-version` succeeds before the validator is fully ready to process transactions. |
| TCP port check (`nc -z localhost 8899`) | Only confirms the port is open, not that the RPC server is functional. The validator opens the port before it's ready. |
| File-based check (e.g., sentinel file) | Requires modifying the validator startup to create a file when ready. The validator doesn't natively create such a file. Adding a wrapper adds unnecessary complexity vs. the built-in `getHealth` endpoint. |
| `solana ping -u localhost` | Sends a real transaction and waits for confirmation. Too heavy for a health check — introduces unnecessary validator load and has a longer timeout. |
| Process-based (`pidof solana-test-validator`) | Only confirms the process is running, not that it's healthy or ready. |

---

## Summary Matrix

| Question | Decision | Confidence |
|---|---|---|
| Q1 Base image | `FROM --platform=linux/amd64 ubuntu:22.04` + manual install | **High** — ecosystem consensus, confirmed by community projects |
| Q2 Version | `v1.18.26` via direct tarball, fallback to `v1.18.23` | **High** — verified on Docker Hub with working images |
| Q3 Validator flags | `--bpf-program` + `--reset` + `--log` + `--limit-ledger-size` + short epochs | **High** — standard patterns, Token-2022 built-in confirmed |
| Q4 ARM64 issues | Force amd64 platform, QEMU emulation, `--no-bpf-jit` fallback | **High** — multiple confirmed reports and working solutions |
| Q5 Health check | JSON-RPC `getHealth` via `curl` | **High** — official RPC endpoint, minimal dependencies |

---

## Open Questions / Risks

1. **v1.18.26 provenance**: This tag exists on Docker Hub but wasn't found in GitHub releases (which stop at v1.18.23 for stable). Risk is low (it's the same binary format, and we're only using it for localnet), but if it causes issues, pin to `v1.18.23` instead.

2. **QEMU JIT crashes**: If Apple Silicon users hit "Illegal instruction" errors, the first mitigation is adding `--no-bpf-jit` to the validator flags. This disables BPF JIT compilation (slightly slower program execution) but avoids QEMU-incompatible x86 instructions in the JIT output.

3. **Docker Desktop Rosetta vs. QEMU**: Docker Desktop 4.25+ offers Rosetta 2 emulation as an alternative to QEMU for amd64 containers on Apple Silicon. Rosetta is significantly faster. We should document recommending users enable "Use Rosetta for x86_64/amd64 emulation on Apple Silicon" in Docker Desktop settings.

4. **Validator startup time under emulation**: The spec requires cold start < 60s. Under QEMU this is achievable but tight on slower machines. The `--start-period=15s` health check gives buffer, but CI runners with weak ARM64 emulation may need longer timeouts.

5. **Bootstrap script atomicity**: The bootstrap script (deploy program, init mint, init GlobalState) runs after validator readiness. If it fails mid-way, the container will be in a partial state. The entrypoint should exit non-zero on bootstrap failure so Docker reports the container as unhealthy/stopped.

---

## Q6 — Bootstrap Script: Protocol Initialization Approach

### Decision

Use a **TypeScript bootstrap script** (`bootstrap.ts`) executed via `npx tsx` inside the container. Adapt the existing `scripts/devnet-validate.ts` pattern for localnet.

### Rationale

The `initialize` instruction requires:
- **Accounts**: `authority` (signer), `global_state` (PDA init), `mint_authority` (PDA), `mint` (PDA init, Token-2022), `token_program`, `system_program`
- **Params**: `InitializeParams { annual_inflation_bp, min_stake_amount, starting_share_rate, slots_per_day, claim_period_days, max_admin_mint }`

This cannot be called via `solana program deploy` alone — the `initialize` instruction creates two `init` accounts (GlobalState + Mint) in a single transaction with complex Anchor IDL serialization. A script is required.

The existing `scripts/devnet-validate.ts` already:
1. Loads the IDL from `target/idl/helix_staking.json`
2. Derives all 3 PDAs
3. Checks if `GlobalState` already exists (idempotent)
4. Calls `program.methods.initialize(params).accountsPartial({...}).rpc()`
5. Airdrops SOL and mints test tokens

**Default params** (from tests/bankrun/utils.ts):
| Field | Value | Meaning |
|-------|-------|---------|
| `annualInflationBp` | `3_690_000` | 3.69% inflation |
| `minStakeAmount` | `10_000_000` | 0.1 HELIX |
| `startingShareRate` | `10_000` | 1:1 ratio |
| `slotsPerDay` | `216_000` | ~400ms/slot |
| `claimPeriodDays` | `180` | 6-month window |
| `maxAdminMint` | `1_000_000_000_000_000_000` | 10B tokens |

**Container requires**: Node.js runtime + `@coral-xyz/anchor` + `@solana/web3.js`. These add ~100MB to the image but provide the only viable way to call Anchor instructions.

### Alternatives Considered

| Alternative | Why rejected |
|---|---|
| Shell + `solana` CLI only | Cannot serialize Anchor instruction data. No CLI support for custom instruction invocation. |
| Python + `anchorpy` | Adds Python runtime dependency. Team has no Python in the stack. |
| Precomputed raw transaction bytes | Fragile — any param or account change breaks the precomputed tx. Not maintainable. |
| Rust CLI binary | Would work but requires building a second binary, adding compile time and complexity. |

---

## Q7 — Entrypoint & Signal Handling Pattern

### Decision

Use **`tini`** as PID 1 with a bash entrypoint script. Add `trap` as defense-in-depth for clean validator shutdown.

### Rationale

- `tini` (~20KB static binary) handles signal forwarding and zombie reaping correctly as PID 1
- Bash alone does NOT forward SIGTERM to children by default
- Pattern: `tini` receives SIGTERM from `docker stop` → forwards to bash → bash `trap` kills validator → clean exit

**Entrypoint flow**:
1. Start `solana-test-validator` in background
2. Wait for RPC health (`curl` loop, 1s interval, 30 retries)
3. Run TypeScript bootstrap (deploy program, init protocol, fund wallet)
4. Touch sentinel file (`/tmp/.bootstrap-complete`)
5. `wait $VALIDATOR_PID` — block until validator exits

**Docker Compose healthcheck**: Sentinel file + RPC health check combined:
```
test -f /tmp/.bootstrap-complete && curl -sf http://127.0.0.1:8899/health
```
This ensures dependent services (indexer) only start after full bootstrap.

### Alternatives Considered

| Alternative | Why rejected |
|---|---|
| s6-overlay / supervisord | Overkill for single-process dev container |
| `exec` validator as PID 1 | Can't exec validator as PID 1 because it must run during bootstrap |
| `dumb-init` | Equivalent to `tini`, slightly less common; either works |
