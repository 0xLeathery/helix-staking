---
description: "Task list for Audit Fixes (Phase 8.1)"
---

# Tasks: Audit Fixes (Phase 8.1)

**Input**: Design documents from `/specs/001-fix-audit-findings/`
**Prerequisites**: plan.md (required), spec.md (required)

**Tests**: Tests are included where specifically requested by the audit (e.g., verifying math fixes) or for critical security logic.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Verify environment and tools for security fixes

- [ ] T001 Verify Anchor 0.31.0 installation and build environment
- [ ] T002 [P] Verify Docker installation for verifiable build generation
- [ ] T003 [P] Verify local PostgreSQL 15 setup for indexer testing

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure needed before specific fixes can be verified

- [ ] T004 Setup DB migrations folder structure in services/indexer/src/db/migrations/
- [ ] T005 Create initial migration file for existing schema in services/indexer/src/db/migrations/000_init.sql
- [x] T006 [P] Configure GitHub Actions workflow file in .github/workflows/build.yml

## Phase 3: User Story 1 - Critical Program & Security Fixes (Priority: P1)

**Goal**: Secure on-chain program against exploits and fix critical frontend security leaks.

**Independent Test**: Bankrun tests pass for BPD math; Frontend bundle check shows no secrets.

### Tests for User Story 1 (Critical Security Verification)

- [x] T007 [US1] Create Bankrun test for BPD speed bonus saturation in tests/bankrun/tests/bpd_math.test.ts
- [x] T008 [US1] Create Bankrun test for admin instruction bounds in tests/bankrun/tests/admin_constraints.test.ts

### Implementation for User Story 1

- [ ] T009 [US1] Implement `saturating_sub` logic for BPD speed bonus in programs/helix-staking/src/utils.rs
- [ ] T010 [US1] Add strict bounds checks (e.g., +/- 10% of initial) for `slots_per_day` and `claim_end_slot` in programs/helix-staking/src/lib.rs
- [ ] T010a [US1] Implement strict `total_claimable > 0` validation in claim instruction in programs/helix-staking/src/instructions/claim.rs
- [ ] T011 [P] [US1] Remove `NEXT_PUBLIC_TEST_WALLET_SECRET` and secure env vars in app/web/.env.local and app/web/next.config.mjs
- [ ] T012 [P] [US1] Implement transaction simulation validation hook in app/web/src/hooks/useTransactionSimulation.ts
- [ ] T013 [P] [US1] Integrate simulation check into Unstake/Claim buttons in app/web/src/components/StakeCard.tsx

## Phase 4: User Story 2 - Indexer Reliability & Production Readiness (Priority: P2)

**Goal**: Ensure indexer reliability with backward pagination, atomic checkpoints, and CI/CD.

**Independent Test**: Indexer catches up 2000 block gap; CI pipeline passes with verifiable build.

### Tests for User Story 2

- [ ] T014 [US2] Create mock chain gap simulation script in services/indexer/scripts/mock-gap.ts

### Implementation for User Story 2

- [ ] T015 [US2] Implement recursive backward pagination loop in services/indexer/src/poller.ts
- [ ] T016 [US2] Wrap event insertion and checkpoint update in atomic transaction in services/indexer/src/db/index.ts
- [ ] T017 [P] [US2] Implement rate limiting middleware for API in services/indexer/src/api/middleware.ts
- [ ] T018 [P] [US2] Apply rate limits to `/api/stats/history` endpoint in services/indexer/src/api/routes.ts
- [ ] T019 [US2] Configure verifiable build step in .github/workflows/build.yml

## Phase 5: User Story 3 - System Hardening & UX Improvements (Priority: P3)

**Goal**: Improve UX with error boundaries, correct links, and logic gaps.

**Independent Test**: Trigger React error and verify fallback UI; Click marketing links to verify cluster.

### Implementation for User Story 3

- [ ] T020 [P] [US3] Create Global Error Boundary component in app/web/src/components/ErrorBoundary.tsx
- [ ] T021 [P] [US3] Wrap main app layout with Error Boundary in app/web/src/app/layout.tsx
- [ ] T022 [P] [US3] Update marketing links to respect current cluster env in app/web/src/components/MarketingFooter.tsx
- [ ] T023 [P] [US3] Implement RPC proxy whitelist (getAccountInfo, sendTransaction) and rate limit in app/web/src/app/api/rpc/route.ts
- [ ] T024 [US3] Fix BPD abort retry logic in programs/helix-staking/src/instructions/abort_bpd.rs

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Documentation and final cleanup

- [ ] T025 Update README.md with new build and test instructions
- [ ] T025a Verify multisig authority (Squads) compatibility by performing a dummy admin action on devnet
- [ ] T026 Verify all audit findings are marked fixed in .audit/phase-8.1-complete-audit-feb-11-2026.md

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Independent.
- **Foundational (Phase 2)**: DB setup required before Indexer tasks (US2).
- **User Story 1 (Phase 3)**: Independent of Indexer/DevOps. Can run parallel to Phase 4/5.
- **User Story 2 (Phase 4)**: Depends on Foundational DB setup.
- **User Story 3 (Phase 5)**: Mostly independent frontend work.

### User Story Dependencies

- **US1**: Critical security fixes. Should be prioritized but technically independent of US2/US3.
- **US2**: Indexer reliability. Depends on DB migrations (T004/T005).
- **US3**: UX improvements. Independent.

### Parallel Opportunities

- **Program vs Frontend vs Indexer**: Tasks across these three domains are highly parallelizable.
- **Within US1**: Frontend secret removal (T011) and Program math fixes (T009) can run in parallel.
- **Within US2**: API Rate limiting (T017) and Poller logic (T015) can run in parallel.
- **Within US3**: Error boundary (T020) and RPC proxy (T023) can run in parallel.

## Implementation Strategy

### MVP (Critical Fixes)
1. Complete Phase 1 & 2 (Setup).
2. Execute **User Story 1** (Program Security) immediately to unblock mainnet confidence.
3. Validate Program fixes with Bankrun tests.

### Production Readiness
4. Execute **User Story 2** (Indexer) to ensure data reliability for launch.
5. Setup CI/CD pipeline (T006, T019).

### Polish
6. Execute **User Story 3** (UX) for better user experience.
7. Final audit verification.