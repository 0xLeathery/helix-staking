# Checklist: Security Audit Fix Requirements

**Purpose**: Validation of requirements for Audit Fixes (Phase 8.1)
**Created**: 2026-02-11
**Feature**: Audit Fixes (Phase 8.1)
**Focus**: Verification Rigor, Security Completeness, Holistic Hardening

## Vulnerability Fix Completeness

- [ ] CHK001 Are the specific bounds for `slots_per_day` and `claim_end_slot` explicitly defined in the requirements? [Clarity, Spec §FR-002]
- [ ] CHK002 Does the spec require `saturating_sub` specifically, or just "prevention of overflow"? (Specific is better for audit verification) [Clarity, Spec §FR-001]
- [ ] CHK003 Is the `total_claimable > 0` validation requirement defined for all claim paths, not just the happy path? [Coverage, Spec §FR-004]
- [ ] CHK004 Are the specific RPC methods allowed in the proxy whitelist enumerated in the requirements? [Completeness, Spec §User Story 3]
- [ ] CHK005 Is the "safe bounds" definition for admin instructions quantified (e.g., +/- 10%)? [Clarity, Spec §User Story 1]

## Regression Prevention

- [ ] CHK006 Are Bankrun test requirements specified for *every* logic fix (BPD math, admin bounds)? [Completeness, Spec §User Story 1]
- [ ] CHK007 Does the spec require a simulation test for the indexer gap (e.g., mock chain script)? [Completeness, Spec §User Story 2]
- [ ] CHK008 Are negative test cases (verifying failure) required for the admin bounds checks? [Coverage, Spec §User Story 1]
- [ ] CHK009 Is there a requirement to verify the verifiable build hash against the deployed program? [Traceability, Spec §SC-003]

## Side Effect Analysis & Holistic Hardening

- [ ] CHK010 Does the spec address potential "bricking" if `saturating_sub` returns 0 unexpectedly? (Is the 0-reward case handled?) [Edge Case, Spec §FR-001]
- [ ] CHK011 Are fallback behaviors defined if the multisig authority cannot sign in time for BPD finalization? [Edge Case, Gap]
- [ ] CHK012 Does the spec define behavior for the indexer if the database transaction fails (rollback requirements)? [Clarity, Spec §FR-010]
- [ ] CHK013 Are rate limit thresholds for the Indexer API quantified (e.g., req/sec)? [Clarity, Spec §FR-011]

## Deployment & Secret Safety

- [ ] CHK014 Is the verification method for "no secrets in bundle" explicitly defined (e.g., grep/string search)? [Measurability, Spec §User Story 1]
- [ ] CHK015 Are the specific "Mainnet vs Devnet" detection rules defined for the frontend? [Clarity, Spec §FR-008]
- [ ] CHK016 Is the exact version of Anchor (0.31.0) required for the verifiable build specified to avoid mismatch? [Consistency, Plan]
- [ ] CHK017 Are rollback or "fix-forward" requirements defined for failed DB migrations? [Gap, Spec §FR-012]

## Notes
- [ ] Check off items as you verify the spec addresses them.
- [ ] If an item is unchecked, update the `spec.md` or `tasks.md` to include the missing detail.
