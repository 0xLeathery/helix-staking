# Feature Specification: Audit Fixes (Phase 8.1)

**Feature Branch**: `001-fix-audit-findings`
**Created**: 2026-02-11
**Status**: Draft
**Input**: User description: "I have a list of blockers @.audit/phase-8.1-complete-audit-feb-11-2026.md in this file. I need to plan these all to be fixed ahead of mainnet launch"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Critical Program & Security Fixes (Priority: P0)

As a protocol administrator and user, I need the on-chain program to be secure against economic exploits and admin abuse so that funds are safe and Big Pay Day (BPD) executes correctly.

**Why this priority**: These are "Mainnet Blockers" (P0). Failure to fix these could lead to loss of funds, bricked protocol, or secret leakage.

**Independent Test**: Run bankrun tests for BPD scenarios and verify admin instruction constraints.

**Acceptance Scenarios**:

1. **Given** a BPD finalization attempt, **When** speed bonuses are applied, **Then** the calculation MUST NOT overflow/underflow and brick the process (Fix C1). If `saturating_sub` returns 0, the stake receives zero bonus — this is acceptable protocol behavior.
2. **Given** an admin user, **When** attempting to change `slots_per_day` or `claim_end_slot` beyond safe bounds, **Then** the transaction MUST fail with an `AdminBoundsExceeded` error code (Fix C2, C3).
3. **Given** a frontend build, **When** inspecting the bundle, **Then** `NEXT_PUBLIC_TEST_WALLET_SECRET` MUST NOT be present (Fix C4). Verification: `grep -r NEXT_PUBLIC_TEST_WALLET_SECRET .next/` returns empty.
4. **Given** a failed transaction simulation, **When** a user attempts to unstake or claim, **Then** the UI MUST block the action and show an error (Fix C5).
5. **Given** a multisig authority (e.g. Squads), **When** it signs an admin instruction, **Then** the instruction MUST execute successfully. A non-authority signer MUST be rejected with an appropriate error (FR-003).

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
- **FR-002a**: The Program MUST reject any `admin_set_slots_per_day` instruction that would set the value outside ±10% of `DEFAULT_SLOTS_PER_DAY` (216,000) as defined in `constants.rs` (C2).
- **FR-002b**: The Program MUST reject any `admin_set_claim_end_slot` instruction that would decrease the current value; only monotonic increases are permitted (C3).
- **FR-003**: The Program MUST allow the authority to be a multisig address (P0-Item2).
- **FR-004**: The Program MUST strictly validate `total_claimable > 0` before processing claims (M3).
- **FR-015**: The Program MUST handle BPD abort idempotently — calling abort on an already-aborted period MUST succeed or return a clear already-aborted status, not fail unpredictably (M2).

**Frontend (P0/P2)**
- **FR-005**: The Frontend build MUST exclude private keys (`NEXT_PUBLIC_TEST_WALLET_SECRET`) from client bundles (C4).
- **FR-006**: The Frontend MUST validate transaction simulation results before prompting user signatures for Unstake/Claim; a simulation is considered failed when `simulationResult.err` is non-null (C5).
- **FR-007**: The Frontend MUST implement React Error Boundaries to catch and handle component crashes (H4).
- **FR-008**: The Frontend MUST verify the user's wallet cluster matches the expected environment by comparing the connection endpoint URL against known cluster patterns (Mainnet/Devnet) for all links and actions (H5).
- **FR-016**: The Frontend RPC proxy MUST only forward whitelisted methods (`getAccountInfo`, `getBalance`, `sendTransaction`, `simulateTransaction`) and reject all others with HTTP 403; the proxy MUST also enforce per-IP rate limiting (H6).

**Indexer (P1)**
- **FR-009**: The Indexer MUST implement backward pagination (or recursive fetch) to retrieve all events when the gap exceeds the RPC limit (1000 signatures) (C6).
- **FR-010**: The Indexer MUST use atomic transactions for event insertion and checkpoint updates to prevent data gaps (H7).
- **FR-011**: The Indexer API MUST enforce rate limits of 100 requests/second per IP on public endpoints, returning HTTP 429 when exceeded (H8).
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
- **SC-002**: **Reliability**: Indexer successfully syncs a gap of 5,000 signatures without dropping events in a test environment.
- **SC-003**: **Build**: CI pipeline passes successfully and generates a verifiable program binary (matching on-chain hash).
- **SC-004**: **Performance**: Indexer API handles 100 requests/second with <1% error rate (rate limited) or serves valid responses. Verified via load test script (T037).

---

## Error Handling Requirements

All modified program instructions MUST return specific error variants (defined in `error.rs`):

| Instruction | Error Condition | Error Variant |
|---|---|---|
| `finalize_bpd_calculation` | Speed bonus saturates to 0 | No error — 0 bonus is valid |
| `admin_set_slots_per_day` | Value outside ±10% of DEFAULT_SLOTS_PER_DAY (216,000) | `AdminBoundsExceeded` |
| `admin_set_claim_end_slot` | New value < current value | `AdminBoundsExceeded` |
| `claim_rewards` | `total_claimable == 0` | `ClaimAmountZero` |
| `free_claim` | `total_claimable == 0` | `ClaimAmountZero` |
| `abort_bpd` | Period already aborted | Idempotent success (no error) |

---

## Edge Case Behavior

- **Zero-reward from saturating_sub**: When `saturating_sub` returns 0 for a stake's speed bonus, the stake receives no bonus. This is acceptable protocol behavior — the stake is not blocked, it simply gets a zero-value distribution. No user warning is required.
- **Concurrent BPD finalization**: Solana serializes transactions that access the same accounts. Two concurrent `finalize_bpd_calculation` calls targeting the same BPDState PDA will be serialized by the runtime — no race condition is possible.
- **Transaction simulation success / on-chain failure**: If a simulation succeeds but the actual transaction fails on-chain (due to state change between simulation and execution), this is standard Solana behavior. The wallet adapter handles retry/error display. No additional application-level handling is required.
- **On-chain account size preservation**: These changes do NOT modify any on-chain account struct sizes (`GlobalState::LEN`, `StakeAccount::LEN`, `ClaimConfig::LEN`, `ClaimStatus::LEN`). No data migration is needed for existing accounts after program upgrade.
- **Token-2022 compatibility**: These changes do not alter CPI calls to Token-2022 (burn/mint). Token-2022 compatibility is preserved.

---

## Verification Mapping (SC-001)

Finding-by-finding mapping of audit findings to verification method:

| Finding | Category | Verification Method |
|---|---|---|
| C1 | BPD math overflow | Bankrun test (T006): speed bonus saturation |
| C2 | admin_set_claim_end_slot unbounded | Bankrun test (T008): non-monotonic rejection |
| C3 | admin_set_slots_per_day retroactive | Bankrun test (T007): ±10% bounds rejection |
| C4 | Test wallet secret in bundle | Build grep (T017): `grep -r NEXT_PUBLIC_TEST_WALLET_SECRET .next/` empty |
| C5 | Simulation err ignored | Code review (T018-T020): `useTransactionSimulation` hook |
| C6 | Indexer 1000-sig gap | Mock gap test (T021-T022): backward pagination |
| C7 | No DB migration files | Code review (T004): migration files committed |
| H1 | Singleton ClaimConfig | Acknowledged: design constraint, not a bug |
| H2 | BPD window authority unavailable | Known gap: see below |
| H3 | Loyalty bonus inflation | Acknowledged: documented in tokenomics |
| H4 | No React error boundaries | Code review (T028-T029): ErrorBoundary component |
| H5 | Hardcoded devnet links | Code review (T030): cluster-aware URLs |
| H6 | RPC proxy no limits | Code review (T031): whitelist + rate limit |
| H7 | Checkpoint past failed events | Code review (T023): atomic db.transaction() |
| H8 | No indexer API rate limit | Code review (T024-T025): 100 req/s middleware |
| H9 | Anchor version mismatch | Config fix: bump indexer to 0.31.1 |
| H10 | No verifiable build | CI pipeline (T027): `anchor build --verifiable` |
| H11 | No CI/CD pipeline | GitHub Actions (T005, T027): build.yml |

---

## Assumptions & Known Gaps

The following items are explicitly out-of-scope for this phase but are documented for future work:

| ID | Gap | Rationale |
|---|---|---|
| KG-001 | Monitoring & alerting across all three layers | Deferred to operational readiness phase. No user-facing impact for launch. |
| KG-002 | Rollback/fix-forward procedures for failed program deploy | Solana programs are upgradeable; rollback is a re-deploy of the previous verified binary. Formal runbook deferred. |
| KG-003 | IDL versioning for program upgrade | IDL changes in this phase are additive (new error variants only). Frontend/indexer consume the IDL at build time — no runtime compatibility issue. |
| KG-004 | Multisig timeout during BPD time-sensitive operations | BPD has a 24-hour seal delay providing adequate signing window. If multisig cannot sign within 24h, `abort_bpd` (now idempotent) provides an escape path. Formal timeout escalation deferred. |
| KG-005 | Indexer behavior during RPC node failures mid-pagination | Indexer retries on RPC error (existing behavior). If pagination fails mid-way, checkpoint is NOT advanced (atomic transaction). Next poll cycle retries from same checkpoint. |
| KG-006 | Indexer checkpoint behavior during chain reorgs | Solana finalized commitment used by the indexer prevents reorg exposure. The poller fetches only finalized signatures. Explicit reorg detection deferred. |
| KG-007 | Partial DB migration failure recovery | Drizzle migrations run in transactions. A partial failure rolls back the entire migration. Manual recovery: re-run `drizzle-kit push` or restore from backup. |
| KG-008 | CU budget constraints for modified instructions | Changes are minimal (bounds checks, saturating_sub). CU impact is negligible (<100 CU per check). No budget adjustment needed. |
| KG-009 | Structured logging/audit trail requirements | Existing program events + indexer pino logging are sufficient for launch. Formal structured logging standard deferred. |
| KG-010 | Data retention/pruning for indexer database | Not needed at launch scale. Indexer tables will be evaluated for partitioning/archival post-launch. |
| KG-011 | RPC provider requirements for backward pagination | Standard RPC methods (`getSignaturesForAddress`) with no archive-specific requirements. Any Solana RPC provider (Helius, Triton, etc.) supports this. |
| KG-012 | SC-003 verifiable build hash baseline | First mainnet deploy establishes the baseline hash. Subsequent upgrades verify against it. The CI pipeline produces the hash for governance approval before deploy. |
| KG-013 | Load testing in CI | T037 creates a load test script for manual execution. Automated load testing in CI deferred to operational readiness. |

---

## External Dependencies

| Dependency | Required Version | Purpose |
|---|---|---|
| Rust | 1.75+ | Anchor program compilation |
| Node.js | 20+ | Frontend, indexer, test tooling |
| Anchor CLI | 0.31.1 | Program build, test, verifiable build |
| Docker | Latest | Verifiable build container |
| PostgreSQL | 15+ | Indexer data store |
| Solana CLI | 1.18+ | Devnet deployment, key management |