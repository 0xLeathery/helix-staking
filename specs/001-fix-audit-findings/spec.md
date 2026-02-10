# Feature Specification: Audit Fixes (Phase 8.1)

**Feature Branch**: `001-fix-audit-findings`
**Created**: 2026-02-11
**Status**: Draft
**Input**: User description: "I have a list of blockers @.audit/phase-8.1-complete-audit-feb-11-2026.md in this file. I need to plan these all to be fixed ahead of mainnet launch"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Critical Program & Security Fixes (Priority: P1)

As a protocol administrator and user, I need the on-chain program to be secure against economic exploits and admin abuse so that funds are safe and Big Pay Day (BPD) executes correctly.

**Why this priority**: These are "Mainnet Blockers" (P0). Failure to fix these could lead to loss of funds, bricked protocol, or secret leakage.

**Independent Test**: Run bankrun tests for BPD scenarios and verify admin instruction constraints.

**Acceptance Scenarios**:

1. **Given** a BPD finalization attempt, **When** speed bonuses are applied, **Then** the calculation MUST NOT overflow/underflow and brick the process (Fix C1).
2. **Given** an admin user, **When** attempting to change `slots_per_day` or `claim_end_slot` beyond safe bounds, **Then** the transaction MUST fail or be impossible (Fix C2, C3).
3. **Given** a frontend build, **When** inspecting the bundle, **Then** `NEXT_PUBLIC_TEST_WALLET_SECRET` MUST NOT be present (Fix C4).
4. **Given** a failed transaction simulation, **When** a user attempts to unstake or claim, **Then** the UI MUST block the action and show an error (Fix C5).

### User Story 2 - Indexer Reliability & Production Readiness (Priority: P2)

As a data consumer, I need the indexer to reliably ingest all historical events and the system to be deployable via CI/CD so that analytics are accurate and deployments are reproducible.

**Why this priority**: These are "Production Indexer" blockers (P1). Without them, the leaderboard and analytics will desync or fail under load.

**Independent Test**: Run indexer against a mock chain with >1000 events gap; verify backward pagination.

**Acceptance Scenarios**:

1. **Given** the indexer is 2000 blocks behind, **When** it polls for updates, **Then** it MUST fetch ALL missed events using backward pagination, not just the recent 1000 (Fix C6).
2. **Given** a database schema change, **When** deploying, **Then** migration files MUST exist and apply cleanly (Fix C7).
3. **Given** an invalid event insert, **When** the indexer processes it, **Then** the checkpoint MUST NOT advance past the failed event (Fix H7).
4. **Given** high API traffic, **When** requests exceed the limit, **Then** the indexer API MUST return 429 Too Many Requests (Fix H8).
5. **Given** a commit to main, **When** pushed, **Then** a verifiable build MUST be produced via CI/CD (Fix H10, H11).

### User Story 3 - System Hardening & UX Improvements (Priority: P3)

As a user, I want a robust interface that handles errors gracefully and a program that closes remaining logic gaps so that the experience is smooth and predictable.

**Why this priority**: These are "Should fix" (P2) and Medium severity issues. They improve stability and UX but aren't immediate fund risks.

**Independent Test**: Use the frontend with network errors; verify error boundaries catch crashes.

**Acceptance Scenarios**:

1. **Given** a React component crash, **When** it occurs, **Then** an Error Boundary MUST display a fallback UI instead of white-screening (Fix H4).
2. **Given** a BPD abort, **When** the period ends, **Then** the system MUST allow retrying or correctly handle the state (Fix M2).
3. **Given** a marketing link, **When** clicked, **Then** it MUST point to the correct cluster (Mainnet vs Devnet) (Fix H5).
4. **Given** an RPC request, **When** sent via proxy, **Then** it MUST be rate-limited and whitelisted (Fix H6).

## Requirements *(mandatory)*

### Functional Requirements

**Program & Security (P0)**
- **FR-001**: The Program MUST use saturating subtraction or valid bounds when calculating BPD claimable amounts to prevent overflows (C1).
- **FR-002**: The Program MUST remove or strictly bound admin authority over `slots_per_day` and `claim_end_slot` to prevent economic manipulation (C2, C3).
- **FR-003**: The Program MUST allow the authority to be a multisig address (P0-Item2).
- **FR-004**: The Program MUST strictly validate `total_claimable > 0` before processing claims (M3).

**Frontend (P0/P2)**
- **FR-005**: The Frontend build MUST exclude private keys (`NEXT_PUBLIC_TEST_WALLET_SECRET`) from client bundles (C4).
- **FR-006**: The Frontend MUST validate transaction simulation results before prompting user signatures for Unstake/Claim (C5).
- **FR-007**: The Frontend MUST implement React Error Boundaries to catch and handle component crashes (H4).
- **FR-008**: The Frontend MUST verify the user's wallet matches the expected environment (Mainnet/Devnet) for all links and actions (H5).

**Indexer (P1)**
- **FR-009**: The Indexer MUST implement backward pagination (or recursive fetch) to retrieve all events when the gap exceeds the RPC limit (1000 signatures) (C6).
- **FR-010**: The Indexer MUST use atomic transactions for event insertion and checkpoint updates to prevent data gaps (H7).
- **FR-011**: The Indexer API MUST enforce rate limits on public endpoints (H8).
- **FR-012**: The Indexer MUST have committed SQL migration files for the current schema (C7).

**DevOps (P0/P1)**
- **FR-013**: The repository MUST include a CI/CD pipeline configuration (e.g., GitHub Actions) that runs tests and builds artifacts (H11).
- **FR-014**: The build process MUST produce a verifiable Anchor build (Dockerized/verified) (H10).

### Key Entities

- **GlobalState**: Tracks protocol configuration (needs field removals/locks).
- **BPDState**: Tracks Big Pay Day calculations (needs overflow protection).
- **IndexerCheckpoint**: Tracks the last processed slot/signature (needs atomic updates).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: **Security**: 100% of Critical (7) and High (11) audit findings are verified fixed via regression tests or code review.
- **SC-002**: **Reliability**: Indexer successfully syncs a gap of 5,000 blocks without dropping events in a test environment.
- **SC-003**: **Build**: CI pipeline passes successfully and generates a verifiable program binary (matching on-chain hash).
- **SC-004**: **Performance**: Indexer API handles 100 requests/second with <1% error rate (rate limited) or serves valid responses.