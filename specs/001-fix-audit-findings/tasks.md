---
description: "Task list for Audit Fixes (Phase 8.1)"
---

# Tasks: Audit Fixes (Phase 8.1)

**Input**: Design documents from `/specs/001-fix-audit-findings/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/
**Tests**: Included for critical security logic (BPD math, admin bounds, claim validation) as required by the audit.
**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Verify environment and tools for security fixes

- [x] T001 Verify Anchor 0.31.1 installation and `anchor build` succeeds from repo root
- [x] T002 [P] Verify Docker installation for `anchor build --verifiable` execution
- [x] T003 [P] Verify local PostgreSQL 15 connectivity for indexer testing via services/indexer/.env.example

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before user story work

- [x] T004 Validate existing migration file matches current Drizzle schema in services/indexer/src/db/migrations/000_init.sql against services/indexer/src/db/schema.ts
- [x] T005 [P] Verify GitHub Actions workflow structure in .github/workflows/build.yml runs tests on push

**Checkpoint**: Foundation ready — user story implementation can now begin in parallel

---

## Phase 3: User Story 1 — Critical Program & Security Fixes (Priority: P1) 🎯 MVP

**Goal**: Secure on-chain program against economic exploits (BPD math overflow, admin abuse) and eliminate frontend secret leakage.

**Independent Test**: Bankrun tests pass for BPD saturation math and admin bounds; `grep -r NEXT_PUBLIC_TEST_WALLET_SECRET .next/` returns empty.

### Tests for User Story 1 (Critical Security Verification)

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [x] T006 [P] [US1] Write bankrun test: BPD speed bonus saturates to 0 instead of underflowing in tests/bankrun/phase8.1/bpdSaturation.test.ts
- [x] T007 [P] [US1] Write bankrun test: admin_set_slots_per_day rejects values outside ±10% of initial in tests/bankrun/phase8.1/adminBounds.test.ts
- [x] T008 [P] [US1] Write bankrun test: admin_set_claim_end_slot rejects non-monotonic decrease in tests/bankrun/phase8.1/adminBounds.test.ts
- [x] T009 [P] [US1] Write bankrun test: claim_rewards and free_claim reject when total_claimable == 0 in tests/bankrun/phase8.1/claimGuard.test.ts

### Implementation for User Story 1

**Program math & bounds (on-chain):**

- [x] T010 [US1] Replace checked subtraction with `saturating_sub` for speed bonus in programs/helix-staking/src/instructions/math.rs (per research decision §1)
- [x] T011 [US1] Update `finalize_bpd_calculation` to use saturating speed bonus from math.rs in programs/helix-staking/src/instructions/finalize_bpd_calculation.rs
- [x] T012 [US1] Add strict bounds check (±10% of `GlobalState.slots_per_day` initial value) to programs/helix-staking/src/instructions/admin_set_slots_per_day.rs
- [x] T013 [US1] Add monotonic-increase-only constraint to programs/helix-staking/src/instructions/admin_set_claim_end_slot.rs
- [x] T014 [US1] Add `total_claimable > 0` guard to claim instruction in programs/helix-staking/src/instructions/claim_rewards.rs
- [x] T015 [US1] Add `total_claimable > 0` guard to free claim instruction in programs/helix-staking/src/instructions/free_claim.rs
- [x] T016 [US1] Add new error variants (`AdminBoundsExceeded`, `ClaimAmountZero`) to programs/helix-staking/src/error.rs

**Frontend secret removal & simulation:**

- [x] T017 [P] [US1] Remove `NEXT_PUBLIC_TEST_WALLET_SECRET` from app/web/.env.local and strip from app/web/next.config.mjs env block
- [x] T018 [P] [US1] Create `useTransactionSimulation` hook that simulates before signing in app/web/lib/hooks/useTransactionSimulation.ts
- [x] T019 [US1] Integrate simulation guard into unstake confirmation flow in app/web/components/stake/unstake-confirmation.tsx
- [x] T020 [US1] Integrate simulation guard into claim form submit flow in app/web/components/claim/claim-form.tsx

**Checkpoint**: BPD math cannot overflow; admin cannot manipulate slots; no secrets in bundle; UI blocks failed simulations.

---

## Phase 4: User Story 2 — Indexer Reliability & Production Readiness (Priority: P2)

**Goal**: Ensure indexer catches all historical events across large gaps, checkpoints atomically, API is rate-limited, and CI/CD produces verifiable builds.

**Independent Test**: Indexer syncs a simulated 5000-signature gap (per SC-002) without dropping events; CI pipeline generates verifiable .so.

### Tests for User Story 2

- [x] T021 [US2] Create mock chain gap simulation script (>5000 sigs per SC-002) in services/indexer/scripts/mock-gap.ts

### Implementation for User Story 2

**Backward pagination (indexer worker):**

- [x] T022 [US2] Implement recursive backward pagination loop (fetch → check oldest sig > checkpoint → fetch next batch → repeat) in services/indexer/src/worker/poller.ts (per research decision §2)
- [x] T023 [US2] Wrap event insertion + checkpoint update in single `db.transaction()` call in services/indexer/src/worker/processor.ts (per research decision §3)

**API hardening:**

- [x] T024 [P] [US2] Create rate-limiting middleware (100 req/s per SC-004) in services/indexer/src/api/middleware/rate-limit.ts
- [x] T025 [P] [US2] Apply rate-limit middleware to /api/stats/history and enforce limit param bounds (1-100) in services/indexer/src/api/routes/stats.ts (per contracts/indexer-api.yaml)
- [x] T026 [P] [US2] Ensure /api/health is lightweight (no RPC client creation) in services/indexer/src/api/routes/health.ts (per contracts/indexer-api.yaml)

**CI/CD & verifiable build:**

- [x] T027 [US2] Add `anchor build --verifiable` step and artifact upload to .github/workflows/build.yml (per research decision §4)

**Checkpoint**: Indexer never misses events across gaps; checkpoint can't desync from inserts; API returns 429 under load; CI produces verifiable binary.

---

## Phase 5: User Story 3 — System Hardening & UX Improvements (Priority: P3)

**Goal**: Graceful error recovery in UI, correct cluster-specific links, RPC proxy hardening, and BPD abort logic fix.

**Independent Test**: Trigger a React component error → fallback UI renders; click marketing links → correct cluster URL; RPC proxy rejects disallowed methods.

### Implementation for User Story 3

**Frontend UX:**

- [x] T028 [P] [US3] Create global ErrorBoundary component with fallback UI (retry/reload) in app/web/components/error-boundary.tsx
- [x] T029 [US3] Wrap root layout with ErrorBoundary in app/web/app/layout.tsx
- [x] T030 [P] [US3] Update marketing footer links to use cluster-aware URLs (mainnet vs devnet) in app/web/components/marketing/footer.tsx

**RPC proxy hardening:**

- [x] T031 [P] [US3] Implement method whitelist (getAccountInfo, getBalance, sendTransaction, simulateTransaction) and per-IP rate limit in app/web/app/api/rpc/route.ts

**Program logic fix:**

- [x] T032 [US3] Fix BPD abort retry logic to handle already-aborted state gracefully in programs/helix-staking/src/instructions/abort_bpd.rs

**Checkpoint**: No white-screen crashes; links always match cluster; RPC proxy rejects unauthorized methods; BPD abort is idempotent.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Documentation, validation, and final verification

- [x] T033 [P] Update README.md with new build (`anchor build --verifiable`), test (`npx vitest run tests/bankrun`), and deploy instructions
- [x] T034 [P] Write bankrun test: multisig authority can execute admin instructions and non-authority is rejected in tests/bankrun/phase8.1/multisigAuthority.test.ts (FR-003)
- [ ] T035 Verify multisig authority (Squads) compatibility by performing a dummy admin instruction on devnet
- [x] T036 [P] Write bankrun test: BPD abort is idempotent (calling abort on already-aborted period succeeds) in tests/bankrun/phase8.1/bpdAbort.test.ts (FR-015)
- [x] T037 [P] Create load test script targeting indexer API at 100+ req/s and verify <1% error rate in services/indexer/scripts/load-test.ts (SC-004)
- [x] T038 [P] Verify TypeScript math parity: confirm `app/web/lib/solana/math.ts` saturating behavior matches updated `instructions/math.rs` after T010
- [ ] T039 Run all quickstart.md validation steps end-to-end (program tests, frontend check, indexer gap test, verifiable build)
- [ ] T040 Verify all Critical (7) and High (11) audit findings are addressed in .audit/phase-8.1-complete-audit-feb-11-2026.md per SC-001

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Independent — can start immediately.
- **Foundational (Phase 2)**: Depends on Setup. **BLOCKS** all user stories.
- **User Story 1 (Phase 3)**: Depends on Phase 2. Independent of US2/US3. **Highest priority.**
- **User Story 2 (Phase 4)**: Depends on Phase 2 (migration validation). Independent of US1/US3.
- **User Story 3 (Phase 5)**: Depends on Phase 2. Independent of US1/US2.
- **Polish (Phase 6)**: Depends on all user stories being complete.

### User Story Dependencies

- **US1 (P1)**: Program fixes (T010–T016) are sequential (math → finalize → admin → claim). Frontend fixes (T017–T020) can run in parallel with program fixes.
- **US2 (P2)**: Poller (T022) and processor (T023) are sequential. API tasks (T024–T026) can run in parallel with poller work.
- **US3 (P3)**: All tasks are independent except T029 depends on T028 (ErrorBoundary must exist before wrapping layout).

### Parallel Opportunities

**Cross-domain parallelism** (3 independent workstreams once Phase 2 is done):
- **Program** (T010–T016, T032): Rust/Anchor changes
- **Frontend** (T017–T020, T028–T031): Next.js/React changes
- **Indexer + CI** (T022–T027): TypeScript worker + GitHub Actions changes

**Within US1:**
- Program math (T010–T016) ∥ Frontend secrets (T017) ∥ Frontend simulation hook (T018)
- T019 and T020 depend on T018 (hook must exist first)

**Within US2:**
- Poller + processor (T022–T023) ∥ API rate-limit (T024–T026) ∥ CI/CD (T027)

**Within US3:**
- ErrorBoundary (T028) ∥ Marketing links (T030) ∥ RPC proxy (T031) ∥ Abort fix (T032)

---

## Parallel Example: User Story 1

```text
# Parallel batch 1 — Tests (write first, must fail):
T006: BPD saturation test          (tests/bankrun/phase8.1/bpdSaturation.test.ts)
T007: Admin bounds test - slots    (tests/bankrun/phase8.1/adminBounds.test.ts)
T008: Admin bounds test - claim    (tests/bankrun/phase8.1/adminBounds.test.ts)
T009: Claim guard test             (tests/bankrun/phase8.1/claimGuard.test.ts)

# Parallel batch 2 — Program + Frontend (independent domains):
T010: saturating_sub in math.rs      ∥  T017: Remove secret from .env
T011: Update finalize_bpd            ∥  T018: Create useTransactionSimulation hook
T012: Bounds check slots_per_day     ∥
T013: Bounds check claim_end_slot    ∥
T014: Claim guard (claim_rewards)    ∥
T015: Claim guard (free_claim)       ∥
T016: Error variants                 ∥

# Sequential — depends on T018:
T019: Integrate simulation into unstake
T020: Integrate simulation into claim
```

---

## Parallel Example: User Story 2

```text
# Parallel batch — three independent workstreams:
T022: Backward pagination (poller.ts)  ∥  T024: Rate-limit middleware   ∥  T027: Verifiable build in CI
T023: Atomic checkpoint (processor.ts) ∥  T025: Apply rate-limit stats  ∥
                                       ∥  T026: Lightweight health      ∥
```

---

## Implementation Strategy

### MVP (Critical Security — User Story 1)

1. Complete Phase 1 & 2 (Setup + Foundational)
2. Execute **User Story 1** (T006–T020) immediately to unblock mainnet confidence
3. Validate: Bankrun tests pass for BPD math + admin bounds + claim guard
4. Validate: Frontend bundle contains no secrets; simulation blocks failed txs
5. **STOP and VALIDATE**: US1 is independently deployable

### Production Readiness

6. Execute **User Story 2** (T021–T027) to ensure indexer reliability
7. Validate: Mock gap test passes; CI produces verifiable build

### Full Hardening

8. Execute **User Story 3** (T028–T032) for UX polish
9. Complete **Polish** (T033–T040) for documentation, tests, and final audit verification
10. SC-001 gate: All 7 Critical + 11 High findings verified fixed

---

## Notes

- [P] tasks = different files, no blocking dependencies
- [US*] label maps task to spec.md user story for traceability
- Test tasks (T006–T009, T021) follow TDD: write test → verify it fails → implement fix → verify it passes
- Program tasks maintain Check-Effects-Interactions ordering per copilot-instructions
- Math changes in Rust (math.rs) require corresponding TypeScript parity check (lib/solana/math.ts) — not in scope for this audit but flagged for awareness
- Commit after each task or logical group; run `anchor build` after program changes
