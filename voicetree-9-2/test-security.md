---
color: yellow
position:
  x: 1976
  y: -1216
isContextNode: false
agent_name: Aki
---

# Security Tests

**Parent:** [[test-and-audit-infra.md]]

Targeted regression tests for specific vulnerabilities discovered during security audits. Located in `tests/bankrun/phase3.3/`, these tests validate fixes for critical, high, and medium severity findings. Each test is tagged with its audit finding ID for traceability.

## Key Test Files

### `tests/bankrun/phase3.3/securityFixes.test.ts` -- Audit Finding Fixes

Tests for the original security audit findings (CRIT-1, HIGH-1, HIGH-2, MED-1):

**CRIT-1: Zero-Bonus Stake Counter Desync** (3 tests)
- Validates that `bpd_stakes_distributed` counter matches `bpd_stakes_finalized` even when stakes have zero BPD bonus.
- Stakes with 0 share-days (e.g., created at period boundary) must still increment the distributed counter during `trigger_big_pay_day`.
- Prevents the BPD lifecycle from getting stuck in an incomplete state because non-bonus stakes were silently skipped.

**HIGH-1: Emergency BPD Abort Mechanism** (4 tests)
- Authority can abort an active BPD calculation via `abort_bpd` instruction.
- Non-authority users are rejected from calling abort.
- Abort when no BPD is active returns appropriate error.
- After abort, unstaking is re-enabled (BPD window guard is cleared).

**HIGH-2: Seal Requires Finalized Stakes** (2 tests)
- `seal_bpd_finalize` rejects if no stakes have been finalized (prevents sealing with zero share-days leading to division-by-zero).
- Seal correctly proceeds when at least one batch of stakes has been finalized.

**MED-1: Zero-Amount Finalize Clears BPD Window** (1 test)
- When finalize processes zero eligible stakes, the BPD window is properly cleared without requiring a seal operation.
- Prevents the protocol from getting stuck in BPD-active state with no way to complete the lifecycle.

### `tests/bankrun/phase3.3/securityHardening.test.ts` -- Hardening & Integration

Comprehensive hardening tests for post-audit improvements:

**CRIT-NEW-1: Seal Security** (4 tests)
- Non-authority rejection: only the protocol authority can seal finalization.
- No-stakes-finalized rejection: sealing with zero processed stakes is blocked.
- Double seal rejection: cannot seal an already-sealed BPD calculation.
- Post-seal finalize rejection: new finalize batches rejected after seal is applied.

**CRIT-NEW-1: Per-Stake Finalize Tracking** (2 tests)
- Duplicate stake in same batch is silently skipped (no error, no double-counting).
- `trigger_big_pay_day` skips non-finalized stakes (stakes not included in any finalize batch receive zero BPD).

**CRIT-NEW-1: Counter-Based Completion** (1 test)
- Partial trigger (processing subset of stakes) does not mark BPD as complete.
- BPD completes only when `bpd_stakes_distributed == bpd_stakes_finalized`.

**HIGH-2: BPD Window Guard** (2 tests)
- Unstaking is blocked while BPD window is active (prevents share count manipulation during calculation).
- Unstaking is allowed immediately after BPD window closes (via seal or abort).

**MED-5: Claim Period ID Validation** (2 tests)
- `claim_period_id = 0` is rejected as invalid (prevents uninitialized state confusion).
- `claim_period_id = 1` is accepted as the first valid period.

**LOW-2: BPD Bonus in Unstake** (1 test)
- When a stake with pending `bpd_bonus_pending > 0` is unstaked, the payout includes the BPD bonus amount.
- Ensures BPD rewards are not lost on early unstake.

**Integration: Full Hardened Lifecycle** (1 test)
- End-to-end BPD lifecycle with 3 stakes processed across 2 finalize batches and 2 trigger batches.
- Validates the complete flow: create stakes -> advance through claim period -> finalize batch 1 -> finalize batch 2 -> seal -> trigger batch 1 -> trigger batch 2 -> verify all counters match -> verify BPD bonuses credited correctly.

## Test Patterns & Utilities

- **Audit ID tagging:** Each `describe` block is tagged with the finding ID (e.g., `"CRIT-1: ..."`, `"HIGH-2: ..."`) for direct traceability to audit reports.
- **Reuses phase3 utilities:** Imports from both `tests/bankrun/utils.ts` and `tests/bankrun/phase3/utils.ts` for Merkle tree, claim setup, and BPD helper functions.
- **Counter assertion pattern:** Tests frequently check `bpd_stakes_finalized` and `bpd_stakes_distributed` counters on `ClaimConfig` to verify lifecycle state machine correctness.
- **Error code verification:** Tests assert specific Anchor error codes (e.g., `BpdWindowActive`, `NoEligibleStakers`, `Unauthorized`) rather than generic failure.
- **Negative testing emphasis:** The majority of tests verify rejection paths--unauthorized access, invalid state transitions, duplicate operations--reflecting the security-focused nature of the suite.

## Notable Gotchas

- **CRIT-NEW-1 was discovered post-fix:** The original audit found CRIT-1 (per-batch BPD rate calculation). The fix introduced a two-phase BPD design, but a follow-up audit found CRIT-NEW-1: `finalize_bpd_calculation` was permissionless, allowing attackers to control which stakes are included and game the `last_batch` detection by sending fewer than 20 accounts.
- **Counter desync is subtle:** Zero-bonus stakes (0 share-days) must still be counted in `bpd_stakes_distributed` during trigger. If skipped, the `distributed == finalized` completion check never passes, permanently blocking the BPD lifecycle.
- **BPD window is a global lock:** While the BPD window is active (between first finalize and seal/abort), ALL unstaking across the entire protocol is blocked. This is a deliberate security trade-off to prevent share manipulation but has UX implications.
- **Abort is the escape hatch:** If BPD finalization gets stuck (e.g., due to bug or insufficient compute), `abort_bpd` is the only way to clear the BPD window and re-enable unstaking. It requires authority access.
- **Test ordering matters:** The integration lifecycle test must run operations in exact sequence (finalize all -> seal -> trigger all) because the state machine enforces strict phase transitions.
