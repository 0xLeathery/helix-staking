# Checklist: Security Audit Fix Requirements

**Purpose**: Validation of requirements for Audit Fixes (Phase 8.1)
**Created**: 2026-02-11
**Feature**: Audit Fixes (Phase 8.1)
**Focus**: Verification Rigor, Security Completeness, Holistic Hardening

## Vulnerability Fix Completeness

- [x] CHK001 Are the specific bounds for `slots_per_day` and `claim_end_slot` explicitly defined in the requirements? [Clarity, Spec §FR-002] — FR-002a: ±10% of 216,000; FR-002b: monotonic increase only
- [x] CHK002 Does the spec require `saturating_sub` specifically, or just "prevention of overflow"? (Specific is better for audit verification) [Clarity, Spec §FR-001] — FR-001 explicitly requires "saturating subtraction"
- [x] CHK003 Is the `total_claimable > 0` validation requirement defined for all claim paths, not just the happy path? [Coverage, Spec §FR-004] — FR-004 covers claims; T014 (claim_rewards) and T015 (free_claim) implement both paths
- [x] CHK004 Are the specific RPC methods allowed in the proxy whitelist enumerated in the requirements? [Completeness, Spec §User Story 3] — FR-016 enumerates: getAccountInfo, getBalance, sendTransaction, simulateTransaction
- [x] CHK005 Is the "safe bounds" definition for admin instructions quantified (e.g., +/- 10%)? [Clarity, Spec §User Story 1] — FR-002a: ±10% of DEFAULT_SLOTS_PER_DAY (216,000)

## Regression Prevention

- [x] CHK006 Are Bankrun test requirements specified for *every* logic fix (BPD math, admin bounds)? [Completeness, Spec §User Story 1] — T006 (BPD saturation), T007-T008 (admin bounds), T009 (claim guard)
- [x] CHK007 Does the spec require a simulation test for the indexer gap (e.g., mock chain script)? [Completeness, Spec §User Story 2] — T021 creates mock chain gap simulation script
- [x] CHK008 Are negative test cases (verifying failure) required for the admin bounds checks? [Coverage, Spec §User Story 1] — T007, T008 write tests that verify rejection of out-of-bounds values
- [x] CHK009 Is there a requirement to verify the verifiable build hash against the deployed program? [Traceability, Spec §SC-003] — SC-003 requires matching on-chain hash; KG-012 documents first-deploy baseline

## Side Effect Analysis & Holistic Hardening

- [x] CHK010 Does the spec address potential "bricking" if `saturating_sub` returns 0 unexpectedly? (Is the 0-reward case handled?) [Edge Case, Spec §FR-001] — Spec §Edge Case Behavior: 0-reward is acceptable; stake is not blocked
- [x] CHK011 Are fallback behaviors defined if the multisig authority cannot sign in time for BPD finalization? [Edge Case, Gap] — KG-004: 24h seal delay provides window; abort_bpd (now idempotent) is escape path
- [x] CHK012 Does the spec define behavior for the indexer if the database transaction fails (rollback requirements)? [Clarity, Spec §FR-010] — FR-010 requires atomic transactions; KG-007 documents rollback via Drizzle transactions
- [x] CHK013 Are rate limit thresholds for the Indexer API quantified (e.g., req/sec)? [Clarity, Spec §FR-011] — FR-011: 100 requests/second per IP

## Deployment & Secret Safety

- [x] CHK014 Is the verification method for "no secrets in bundle" explicitly defined (e.g., grep/string search)? [Measurability, Spec §User Story 1] — US1-AS3: `grep -r NEXT_PUBLIC_TEST_WALLET_SECRET .next/` returns empty
- [x] CHK015 Are the specific "Mainnet vs Devnet" detection rules defined for the frontend? [Clarity, Spec §FR-008] — FR-008: comparing connection endpoint URL against known cluster patterns
- [x] CHK016 Is the exact version of Anchor (0.31.0) required for the verifiable build specified to avoid mismatch? [Consistency, Plan] — All docs now specify 0.31.1 (quickstart.md fixed)
- [x] CHK017 Are rollback or "fix-forward" requirements defined for failed DB migrations? [Gap, Spec §FR-012] — KG-007: Drizzle migrations run in transactions; partial failure rolls back

## Notes
- [x] Check off items as you verify the spec addresses them.
- [x] If an item is unchecked, update the `spec.md` or `tasks.md` to include the missing detail.
