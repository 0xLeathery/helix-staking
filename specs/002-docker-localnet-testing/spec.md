# Feature Specification: Docker Localnet Testing Environment

**Feature Branch**: `002-docker-localnet-testing`  
**Created**: 2025-02-11  
**Status**: Draft  
**Input**: User description: "I want to create a local docker container that will run localnet for testing"

## Clarifications

### Session 2026-02-11

- Q: How should the program binary get into the container — COPY at build time, bind-mount at runtime, or both? → A: Bind-mount at runtime. Host's `target/deploy/` is mounted into the container so the image stays static and picks up fresh binaries on each start.
- Q: Which Solana validator version should the container use? → A: Pin to Solana 1.18.x to match the Anchor 0.31.1 toolchain and ensure Token-2022 compatibility.
- Q: Should the container bootstrap protocol accounts (mint, GlobalState) or leave that to host-side test scripts? → A: Include a startup bootstrap script that initializes the mint and GlobalState accounts after the validator is ready, so the container is immediately usable.
- Q: How should validator transaction logs be accessible to developers? → A: Both. Logs stream to container stdout (visible via `docker logs`) and are also written to a file in a bind-mounted host directory for persistent access.
- Q: Should the test wallet use a deterministic committed keypair or be generated fresh? → A: Deterministic committed keypair. A known test keypair JSON is committed to the repo so all developers and CI use the same funded address.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Run Localnet Validator in Docker (Priority: P1)

A developer wants to spin up a fully self-contained Solana localnet validator inside a Docker container so they can run integration tests, deploy programs, and interact with the chain without installing Solana CLI tools or Anchor locally on their host machine.

**Why this priority**: This is the core capability — without a running validator container, no other testing scenarios are possible. It provides the foundational local blockchain environment that all other workflows depend on.

**Independent Test**: Can be fully tested by running a single Docker command and confirming the validator is accepting RPC requests on the expected port.

**Acceptance Scenarios**:

1. **Given** Docker is installed on the host, **When** the developer runs the container start command, **Then** a Solana localnet validator starts and is reachable at the configured RPC endpoint within 30 seconds.
2. **Given** the validator container is running, **When** the developer queries the cluster version via the RPC endpoint, **Then** a valid Solana version response is returned.
3. **Given** the validator container is running, **When** the developer stops the container, **Then** all validator processes shut down cleanly within 10 seconds.

---

### User Story 2 - Deploy Helix Staking Program to Dockerized Localnet (Priority: P1)

A developer wants the Helix Staking program (pre-built BPF artifact) to be automatically deployed to the localnet validator when the container starts, so they can immediately begin testing against the deployed program without manual deployment steps.

**Why this priority**: Equally critical to having the validator — the whole point of localnet is testing the Helix Staking program. Auto-deploying the program on startup removes friction and ensures a consistent test environment.

**Independent Test**: Can be tested by starting the container, then querying the program account at the known program ID to confirm it exists and is executable.

**Acceptance Scenarios**:

1. **Given** the container is starting, **When** the validator becomes ready, **Then** the Helix Staking program is deployed at program ID `E9B7BsxdPS89M66CRGGbsCzQ9LkiGv6aNsra3cNBJha7` and is marked as executable, and the protocol mint and GlobalState accounts are initialized.
2. **Given** the container is running with the deployed program, **When** the developer sends a transaction that invokes the program, **Then** the transaction is processed successfully.
3. **Given** the program binary has been updated on the host, **When** the container is rebuilt/restarted, **Then** the updated program binary is deployed to the fresh validator.

---

### User Story 3 - Run Integration Tests Against Dockerized Localnet (Priority: P2)

A developer wants to run the existing Anchor integration test suite (or ad-hoc RPC calls) from the host machine against the validator running inside Docker, using the exposed RPC and WebSocket endpoints.

**Why this priority**: Bridges the gap between the containerized validator and the existing test workflow. Enables the team to use the Docker environment as a drop-in replacement for a locally installed validator.

**Independent Test**: Can be tested by starting the container and running tests pointed at the container RPC endpoint.

**Acceptance Scenarios**:

1. **Given** the container is running with the program deployed, **When** the developer runs tests from the host pointing at the container RPC URL, **Then** the tests execute and pass as they would against a native localnet.
2. **Given** the container is running, **When** the developer connects a wallet or script to the container WebSocket endpoint, **Then** subscription events (e.g., account changes, log subscriptions) are received correctly.

---

### User Story 4 - Compose Localnet with Indexer Dependencies (Priority: P3)

A developer wants to start the full local testing stack (Solana validator + PostgreSQL database) using a single orchestration command, so the indexer service can also run against the local environment.

**Why this priority**: Enables full end-to-end local testing including the indexer pipeline, but is lower priority because the validator alone already enables the most common testing workflows (program tests, frontend dev).

**Independent Test**: Can be tested by running the orchestration command and confirming both the validator RPC endpoint and the database connection are reachable.

**Acceptance Scenarios**:

1. **Given** the orchestration file is present, **When** the developer runs the stack start command, **Then** both the Solana validator and PostgreSQL database start and are reachable within 60 seconds.
2. **Given** the full stack is running, **When** the developer stops the stack, **Then** all services shut down cleanly and no orphan processes remain.

---

### Edge Cases

- What happens when the configured RPC port is already in use on the host?
- How does the container behave if the program binary (`.so` file) is missing or corrupt at build time?
- What happens when the container runs out of disk space due to ledger growth during long test sessions?
- How does the system handle abrupt container termination — is the state recoverable on restart?
- What happens if the developer tries to start multiple instances of the container simultaneously?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide a Docker image that runs a Solana test validator on localnet cluster.
- **FR-002**: System MUST expose the validator JSON-RPC endpoint to the host machine on a configurable port (default: 8899).
- **FR-003**: System MUST expose the validator WebSocket endpoint to the host machine on a configurable port (default: 8900).
- **FR-004**: System MUST automatically deploy the Helix Staking program binary to the validator on startup at the configured program ID, using a bind-mounted host directory (`target/deploy/`) as the source.
- **FR-005**: System MUST provide a health check mechanism that reports whether the validator is ready to accept transactions.
- **FR-006**: System MUST NOT require an image rebuild when the program binary changes — the runtime bind-mount picks up the latest binary on each container start.
- **FR-007**: System MUST provide an orchestration configuration that can start the validator alongside a PostgreSQL database for indexer testing.
- **FR-008**: System MUST fund a deterministic test wallet (keypair committed to the repo) with SOL on validator startup so developers can immediately send transactions using a known, shared address.
- **FR-009**: System MUST allow the developer to reset the validator state (clean ledger) by restarting the container.
- **FR-010**: System MUST work on macOS (Apple Silicon and Intel) and Linux host environments.
- **FR-011**: System MUST run a bootstrap script on container startup (after the validator is ready) that initializes the protocol's mint account and GlobalState so the program is immediately invocable without manual setup.
- **FR-012**: System MUST stream validator logs to container stdout AND write them to a file inside a bind-mounted host directory, so developers can use `docker logs` for real-time viewing and grep/tail the host file for persistent access.

### Key Entities

- **Validator Container**: The Docker container running the Solana test validator, responsible for processing transactions and maintaining ledger state.
- **Program Binary**: The compiled Helix Staking program artifact, mounted or copied into the container for deployment.
- **Test Wallet**: A pre-funded keypair available to developers for signing transactions against the localnet.
- **Service Stack**: The composed set of services (validator + database) needed for full local testing.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A developer with only Docker installed can have a running localnet with the Helix Staking program deployed in under 60 seconds from a cold start (no cached images), and under 15 seconds on subsequent starts.
- **SC-002**: Existing integration tests pass against the containerized validator without modification to the test code (only RPC URL configuration changes).
- **SC-003**: The container consumes less than 2 GB of memory during normal test operation.
- **SC-004**: The full service stack (validator + database) starts successfully with a single command 100% of the time on supported platforms.
- **SC-005**: Rebuilding the image after a program change takes under 30 seconds due to layer caching.

## Assumptions

- Developers already have Docker (or a compatible container runtime) installed on their machines.
- The Helix Staking program binary is pre-built via `anchor build` on the host — the container bind-mounts `target/deploy/` at runtime and does not compile the program itself.
- The Solana test validator version in the container MUST be pinned to the 1.18.x line to match the Anchor 0.31.1 toolchain and ensure Token-2022 compatibility.
- Ledger state is ephemeral — it is not persisted across container restarts by default. Developers who need persistence can configure volume mounts separately.
- The primary use case is local developer testing, not CI/CD pipelines (though the container should be usable in CI as well).
