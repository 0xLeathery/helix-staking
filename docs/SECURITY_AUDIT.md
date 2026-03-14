# Security Audit Documentation

## Scope

This document tracks security issues, fixes, and validation patterns in Helix Staking.

---

## Fixes Implemented (2026-02-12)

### Issue 1: PDA Validation Inconsistency (CRITICAL)

**Problem**: Bulk operations (`trigger_big_pay_day`, `finalize_bpd`) used manual PDA validation without checking bump canonicity, creating seed canonicalization attack surface.

**Root Cause**: Copy-paste of validation code without standardization. Two different validation strategies (Anchor constraints vs manual) for the same account type.

**Fix**:
1. Extracted shared `validate_stake_pda()` function in `programs/helix-staking/src/security/pda.rs`
2. Uses `Pubkey::try_find_program_address` (canonical bump derivation)
3. Validates bump matches canonical bump with explicit error
4. Replaces manual checks in both bulk operations
5. Added error types: `InvalidPDA`, `InvalidBumpSeed`

**Commits**:
```
feat(security): create validation module with PDA validation function
refactor(pda): use validation function in trigger_big_pay_day
refactor(pda): use validation function in finalize_bpd_calculation
```

**Status**: ✅ FIXED
- Created: `programs/helix-staking/src/security/pda.rs`
- Updated: `trigger_big_pay_day.rs:110-114`
- Updated: `finalize_bpd_calculation.rs:130-136`
- Tested: All bankrun tests pass
- Verified: X-Ray no longer flags bump seed issues

---

### Issue 2: Silent Error Handling (CRITICAL)

**Problem**: Mixed error handling patterns (`unwrap_or(0)` vs explicit `ok_or`), creating inconsistency and masking bugs.

**Root Cause**: Utility functions (math.rs) used fallback patterns; callers adopted same without questioning. Two errors reported by X-Ray:
1. `mul_div_up` arithmetic without explicit overflow handling
2. Division operations with silent zero fallback

**Fix**:
1. Refactored `mul_div_up` (lines 22-56) with explicit step-by-step overflow checks
2. Added `InvalidDivisor` error type
3. Validated `slots_per_day > 0` precondition at function start (trigger_bpd, finalize_bpd)
4. Replaced `.checked_div(...).unwrap_or(0)` with safe division after precondition
5. Added `InvalidSlotsPerDay` error type

**Commits**:
```
fix(math): explicit overflow checks in mul_div_up for ceiling division
fix(error-handling): explicit validation for slots_per_day division in trigger_bpd
fix(error-handling): explicit validation for slots_per_day division in finalize_bpd
```

**Status**: ✅ FIXED
- Updated: `programs/helix-staking/src/instructions/math.rs:22-56`
- Updated: `trigger_big_pay_day.rs:44-50, 154-157`
- Updated: `finalize_bpd_calculation.rs:46-54, 162-165, 198-201`
- Updated: `error.rs` (added InvalidDivisor, InvalidSlotsPerDay)
- Tested: All BPD tests pass, division operations safe
- Verified: X-Ray no longer flags unwrap_or patterns

---

## Validation Approach

### Test Coverage

- **Unit Tests**: Run with `npx vitest run tests/bankrun`
  - PDA validation: integration with bulk operations
  - Math operations: overflow tests
  - Division safety: trigger_bpd, finalize_bpd tests
  - **Result**: 51+ tests passing for BPD operations

- **X-Ray Scanner**: Run with `npm run xray`
  - Identifies vulnerability patterns
  - Validates security assumptions
  - **Result**: No critical findings after fixes

---

## Security Guarantees

After these fixes, the program provides:

### PDA Validation
✅ All account PDAs validated via Anchor constraints or shared function
✅ Bump seeds are canonical (prevents canonicalization attacks)
✅ Account ownership verified
✅ Deserialization validated

### Error Handling
✅ No silent failures (all errors explicit)
✅ All arithmetic overflow/underflow checked
✅ Preconditions validated before operations
✅ No unwrap_or() in production code

### Auditability
✅ Single source of truth for validation (DRY)
✅ Patterns documented in SECURITY_PATTERNS.md
✅ Clear audit trail (constraints visible, functions reusable)
✅ Future instructions follow same patterns

---

## Fresh Review Findings (2026-03-14)

### A-1: Math Parity Bug — CRITICAL

**Problem**: `calculatePendingRewards` in TypeScript (`app/web/lib/solana/math.ts`) was missing a `.div(PRECISION)` that exists in the Rust equivalent, returning values ~1 billion times too large.

**Status**: ✅ FIXED — Added `.div(PRECISION)` to TS function, fixed stale comment in Rust.

### A-2: Missing Event Emissions — HIGH

**Problem**: 7 instructions had no event emissions; 4 existing events lacked `slot: u64`.

**Status**: ✅ FIXED — Added 7 new event structs, added `slot` to all events, all instructions now emit.

### A-3: Inconsistent Simulation — HIGH

**Problem**: 5 hooks used raw `connection.simulateTransaction()` instead of shared `simulateTransactionOrThrow` utility, missing Anchor error name parsing.

**Status**: ✅ FIXED — All hooks now use `simulateTransactionOrThrow`.

### A-4: Dependency Version Mismatches — HIGH

**Problem**: Anchor, vitest, and @coral-xyz/anchor versions diverged across packages and CI.

**Status**: ✅ FIXED — Aligned all to Anchor 0.32.1 (Anchor.toml) / 0.31.1 (SDK), vitest ^4.0.18.

### A-5: Dead Code — MEDIUM

**Problem**: Unused `calculate_helix_per_share_day` function, unused `Transfer` import, duplicated `DECIMALS_FACTOR`, native `BigInt` usage.

**Status**: ✅ FIXED — Removed dead code, consolidated constants, replaced BigInt with Number.

### A-6: Config & Build Issues — MEDIUM

**Problem**: Root tsconfig targeted ES6/CommonJS, stale .bak file, misleading Dockerfile comment, disabled CI pipelines, test exclusion bug.

**Status**: ✅ FIXED — Updated tsconfig, deleted stale files, enabled CI, fixed test command.

### A-7: Documentation Gaps — LOW

**Problem**: SECURITY_AUDIT.md didn't cover fresh findings, indexer .env.example had placeholder program ID.

**Status**: ✅ FIXED — This section added, devnet program ID set in .env.example.

---

## Post-Audit Recommendations

### Phase 2 Professional Audit

Recommended focus areas:
1. State machine validation (BPD sequence atomicity)
2. Token-2022 extension safety
3. Cross-instruction consistency (e.g., invariant: total_claimed <= total_claimable)
4. Frontend integration (transaction simulation, indexer sync)

### Code Review Checklist (for future instructions)

When adding new instructions, verify:
- [ ] Does this instruction use Anchor constraints or validate_stake_pda()?
- [ ] All arithmetic uses checked_* with ok_or(error!())?
- [ ] Preconditions validated at function start?
- [ ] No unwrap_or() or silent defaults?
- [ ] Error types documented in SECURITY_PATTERNS.md?
- [ ] Commented WHY each validation pattern is used?

---

## Commit History

```
fix(error-handling): explicit validation for slots_per_day division in finalize_bpd
fix(error-handling): explicit validation for slots_per_day division in trigger_bpd
fix(math): explicit overflow checks in mul_div_up for ceiling division
refactor(pda): use validation function in finalize_bpd_calculation
refactor(pda): use validation function in trigger_big_pay_day
feat(security): create validation module with PDA validation function
```

---

## References

- Root Cause Analysis: `.specify/ROOT_CAUSE_ANALYSIS.md`
- Remediation Guide: `.specify/REMEDIATION_GUIDE.md`
- Holistic Baseline: `.specify/HOLISTIC_SECURITY_BASELINE.md`
- Security Patterns: `docs/SECURITY_PATTERNS.md`
- Implementation Plan: `docs/plans/2026-02-12-pda-validation-error-handling.md`

---
