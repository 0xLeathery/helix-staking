# Implementation Plan: Docker Localnet Testing Environment

**Branch**: `002-docker-localnet-testing` | **Date**: 2026-02-11 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/002-docker-localnet-testing/spec.md`

## Summary

Provide a Docker-based Solana localnet environment that auto-deploys the Helix Staking program and bootstraps protocol state on startup. The solution uses a single Dockerfile (Solana 1.18.x base), a shell bootstrap script, a Docker Compose orchestration file (validator + PostgreSQL), and a deterministic test keypair — all driven by bind-mounted host artifacts so the image never needs rebuilding when code changes.

## Technical Context

**Language/Version**: Shell (bash) for entrypoint/bootstrap, Docker (multi-stage build)  
**Primary Dependencies**: Docker Engine 24+, Docker Compose v2, `solana-test-validator` (Solana CLI 1.18.x), `solana` CLI tools  
**Storage**: PostgreSQL 16 (for indexer companion service via Docker Compose)  
**Testing**: Manual smoke tests + host-side integration tests (existing Bankrun suite remains unchanged; new E2E tests point RPC URL at container)  
**Target Platform**: macOS (Apple Silicon M-series + Intel) and Linux (x86_64)  
**Project Type**: Infrastructure / DevOps tooling (single repo addition)  
**Performance Goals**: Cold start < 60s, warm start < 15s, memory < 2 GB  
**Constraints**: Image must be multi-arch (linux/amd64 + linux/arm64) to support Apple Silicon; no program compilation inside container  
**Scale/Scope**: Single-developer local testing; CI-compatible but not primary target

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| # | Principle | Verdict | Notes |
|---|-----------|---------|-------|
| I | Trustless & On-Chain First | **N/A** | This is dev infrastructure, not protocol logic. No on-chain changes. |
| II | Immutability & Security | **PASS** | Test keypair is clearly scoped to localnet. No production keys involved. Container runs ephemeral validator — no risk to deployed program immutability. |
| III | Simplicity & Efficiency | **PASS** | Docker + single bootstrap script is the simplest viable approach. No custom tooling or complex orchestration frameworks. |
| IV | Standard Compliance | **PASS** | Uses standard `solana-test-validator`, standard Dockerfile patterns, standard Docker Compose v2. Solana 1.18.x matches Anchor 0.31.1 toolchain. |
| V | User Sovereignty | **N/A** | Dev tooling only — no user funds or keys involved. |

**Gate result: PASS** — No violations. Proceed to Phase 0.

## Project Structure

### Documentation (this feature)

```text
specs/002-docker-localnet-testing/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (CLI interface contracts)
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
docker/
├── Dockerfile              # Multi-stage: Solana CLI 1.18.x base image
├── docker-compose.yml      # Validator + PostgreSQL orchestration
├── bootstrap.sh            # Post-validator-ready: deploy program, init protocol, fund wallet
├── entrypoint.sh           # Container entrypoint: start validator, wait ready, run bootstrap
└── test-wallet.json        # Deterministic test keypair (localnet only)
```

**Structure Decision**: All Docker-related files live in a top-level `docker/` directory to keep infra concerns separated from program, frontend, and indexer code. The compose file references bind-mounts to `target/deploy/` (program binary) and `target/idl/` (IDL for bootstrap) at runtime.

## Complexity Tracking

> No constitution violations — table intentionally left empty.

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
