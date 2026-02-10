# Implementation Plan: Audit Fixes (Phase 8.1)

**Branch**: `001-fix-audit-findings` | **Date**: 2026-02-11 | **Spec**: [specs/001-fix-audit-findings/spec.md](specs/001-fix-audit-findings/spec.md)
**Input**: Feature specification from `/specs/001-fix-audit-findings/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

This plan addresses P0/P1 audit blockers to prepare SolHEX for mainnet. Key deliverables:
1. **Program Hardening**: Secure BPD math (saturating sub), strict admin bounds, and multisig authority support.
2. **Frontend Security**: Remove secrets from bundles, validate simulations, and add error boundaries.
3. **Indexer Reliability**: Implement backward pagination for large gaps and atomic checkpoints.
4. **DevOps**: Establish CI/CD pipeline and verifiable builds.

## Technical Context

**Language/Version**: Rust 1.75+ (Anchor), TypeScript 5.0+ (Frontend/Indexer)
**Primary Dependencies**: Anchor 0.31.0, Next.js 15, PostgreSQL 15, @solana/web3.js v1
**Storage**: PostgreSQL (Indexer), On-chain State (Program)
**Testing**: Bankrun (Program), Vitest (Frontend/Indexer unit), Playwright (E2E)
**Target Platform**: Solana Mainnet (SVM), Vercel (Frontend), Node.js (Indexer)
**Project Type**: Full Stack (Smart Contract + Web + Indexer)
**Performance Goals**: Indexer syncs 1000+ blocks/sec in catchup mode; API handles 100 req/s.
**Constraints**: Mainnet launch blockers; strictly non-custodial; on-chain truth.
**Scale/Scope**: Critical fixes across all 3 stack layers (Program, Frontend, Indexer).

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Trustless & On-Chain First**: ✅ Program fixes reinforce on-chain logic integrity (math, bounds).
- **Immutability & Security**: ✅ Addressing audit findings directly improves security; verifying multisig support.
- **Simplicity & Efficiency**: ✅ Indexer fixes (pagination) maintain "Light Indexer" pattern without adding complex queuing.
- **Standard Compliance**: ✅ Uses Anchor 0.31, Token-2022, standard Wallet Adapters.
- **User Sovereignty**: ✅ Multisig and simulation checks protect user assets.

## Project Structure

### Documentation (this feature)

```text
specs/001-fix-audit-findings/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
programs/helix-staking/    # Anchor Program
├── src/
│   ├── lib.rs             # Instructions & Entrypoint
│   ├── state/             # Account structs
│   └── utils.rs           # Math helpers (saturating_sub)

app/web/                   # Frontend
├── src/
│   ├── components/        # Error Boundary, UI fixes
│   └── hooks/             # Simulation validation

services/indexer/          # Indexer
├── src/
│   ├── poller.ts          # Backward pagination logic
│   └── db/                # Migrations & Atomic ops

.github/workflows/         # CI/CD
└── build.yml              # Verifiable build pipeline
```

**Structure Decision**: Standard monorepo structure with distinct services for Program, Frontend, and Indexer.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | N/A | N/A |