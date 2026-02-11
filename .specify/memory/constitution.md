<!-- 
Sync Impact Report:
- Version change: 1.0.0 (Initial Ratification)
- List of modified principles:
  - Added: I. Trustless & On-Chain First
  - Added: II. Immutability & Security
  - Added: III. Simplicity & Efficiency
  - Added: IV. Standard Compliance
  - Added: V. User Sovereignty
- Added sections: Technical Constraints, Development Workflow
- Templates requiring updates:
  - .specify/templates/plan-template.md (✅ Verified generic "Constitution Check" is sufficient)
  - .specify/templates/tasks-template.md (✅ Verified generic structure works)
-->
# SolHEX Constitution

## Core Principles

### I. Trustless & On-Chain First
All critical staking logic, rewards distribution, and claiming mechanisms MUST be implemented on-chain using the Anchor framework. The frontend serves solely as a view layer and transaction builder. There shall be no reliance on centralized backends for core protocol operations.

### II. Immutability & Security
"Code is Law" is the governing philosophy. Once deployed and renounced, the protocol parameters and logic cannot be arbitrarily changed. Security audits are mandatory before mainnet launch. All code MUST be written with the assumption that it will become immutable.

### III. Simplicity & Efficiency
Architecture MUST prioritize simplicity. Use a "Light Indexer" approach (read-only data aggregation) rather than heavy backend infrastructure. Direct client-to-chain interaction is preferred. Complexity should only be introduced if absolutely necessary for security or essential functionality.

### IV. Standard Compliance
The project MUST adhere to established Solana ecosystem standards. This includes using the Anchor framework for smart contracts, Token-2022 for the token standard, and standard Wallet Adapters for client integration. Deviating from standards requires strong justification.

### V. User Sovereignty
The protocol MUST be non-custodial. Users retain full control of their private keys and assets at all times. No administrative capability should exist to freeze, seize, or move user funds without their cryptographic authorization.

## Technical Constraints

### Smart Contract
- **Framework**: Anchor (Rust) version 0.31.0+
- **Token Standard**: Token-2022 (with metadata extensions)
- **Testing**: Bankrun for fast unit/integration tests; `anchor test` for E2E.

### Frontend
- **Framework**: Next.js 15 (App Router) + React 19
- **Styling**: Tailwind CSS
- **Blockchain Interaction**: `@solana/web3.js` v1.x (strict requirement for Anchor compatibility) & `@solana/wallet-adapter-react`.

### Infrastructure
- **Indexer**: Lightweight Node.js/Python poller + PostgreSQL (Read-only analytics).
- **RPC**: Helius or equivalent capable of Geyser/Webhooks.

## Development Workflow

### Testing Strategy
- **Test-Driven Development (TDD)**: Write Bankrun tests before implementing instruction logic.
- **Coverage**: Core staking mechanics (math, distribution) MUST have 100% test coverage.
- **Simulation**: Use Bankrun time manipulation to simulate long-term staking scenarios (5555 days).

### Quality Gates
- **Linting**: `cargo fmt` and `cargo clippy` must pass.
- **Types**: Full TypeScript type generation from Anchor IDL.
- **Audit Preparedness**: Code must be commented and structured to facilitate third-party audits.

## Governance

This Constitution serves as the primary source of truth for architectural and design decisions.

**Amendments**:
1.  Proposed changes must be documented in a PR.
2.  Changes to Core Principles require significant consensus and justification.
3.  Version must be bumped according to Semantic Versioning (Major for principle changes, Minor for section updates).

**Compliance**:
- All Feature Specifications and Plans must explicitly check against these principles.
- Code reviews must verify adherence to "Trustless & On-Chain First".

**Version**: 1.0.0 | **Ratified**: 2026-02-11 | **Last Amended**: 2026-02-11