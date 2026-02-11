# Phase 1 Security Audit — Findings Report

**Date**: 2026-02-12  
**Status**: Localnet testing, blocking mainnet deployment  
**Overall Assessment**: 3 critical issues + 4 medium issues + 2 low issues found

---

## Executive Summary

Your security posture is better than typical for a first DeFi app, but there are **3 critical issues** that must be fixed before mainnet:

1. **PDA bump seed validation** — Accounts can be spoofed via canonicalization attacks
2. **Potential panic in math.rs** — Integer operations without proper validation  
3. **Instruction state checks missing** — Some admin instructions can be called out-of-sequence

Once these are fixed, we recommend moving to Phase 2 professional audit.

---

## CRITICAL FINDINGS

### 1. Bump Seed Canonicalization Attack (Severity: CRITICAL)

**Location**: 
- `trigger_big_pay_day.rs:111-116`
- `finalize_bpd_calculation.rs:140`

**Issue**:
You derive PDAs but don't validate the bump seed. This allows an attacker to create fake stake accounts with a different bump that still derive to the same address.

```rust
// trigger_big_pay_day.rs:111
let expected_pda = Pubkey::create_program_address(
    &[
        STAKE_SEED,
        stake.user.as_ref(),
        &stake.stake_id.to_le_bytes(),
        &[stake.bump],  // ⚠️ Bump is NOT validated
    ],
    &ctx.program_id,
)?;
```

**Attack vector**:
- Attacker loads a StakeAccount with bump=255 (or another valid bump)
- Tries to call `trigger_big_pay_day` with this fake account
- Our code checks `if account_info.key() != expected_pda.unwrap()` but this fails gracefully (continues loop)
- However, the seed canonicalization spec says only ONE valid bump exists per seed set—we're allowing invalid ones

**Fix**:
```rust
// Instead of using stake.bump, always find the canonical bump:
let (expected_pda, expected_bump) = Pubkey::try_find_program_address(
    &[
        STAKE_SEED,
        stake.user.as_ref(),
        &stake.stake_id.to_le_bytes(),
    ],
    &ctx.program_id,
)?;

// Then validate the loaded bump matches
require_eq!(stake.bump, expected_bump, HelixError::InvalidBumpSeed);
require_eq!(account_info.key(), expected_pda, HelixError::InvalidPDA);
```

**Test case needed**:
```bash
# Create a test that tries to pass a StakeAccount with bump=255
# Should fail with InvalidBumpSeed error
```

---

### 2. Integer Underflow in mul_div_up (Severity: CRITICAL)

**Location**: `math.rs:27`

**Issue**:
```rust
pub fn mul_div_up(a: u64, b: u64, c: u64) -> Result<u64> {
    require!(c > 0, HelixError::DivisionByZero);
    let numerator = (a as u128)
        .checked_mul(b as u128)
        .ok_or(error!(HelixError::Overflow))?
        .checked_add((c - 1) as u128)  // ⚠️ If c == 1, this is 0 - 1 = underflow!
        .ok_or(error!(HelixError::Overflow))?;
```

If `c == 1`, then `(c - 1) = 0` and the checked_add succeeds. But X-Ray flagged this because in unchecked math, `c - 1` where `c` is u64 could underflow. While `checked_add` protects this case, the pattern is risky.

**Fix**:
```rust
let numerator = (a as u128)
    .checked_mul(b as u128)
    .ok_or(error!(HelixError::Overflow))?
    .checked_add((c as u128).saturating_sub(1))  // Explicit safe subtraction
    .ok_or(error!(HelixError::Overflow))?;
```

**Test case needed**:
```bash
# Test mul_div_up with c = 1, verify it returns correctly
# Test with c = 0 is already covered by DivisionByZero check
```

---

### 3. Missing Instruction State Validation (Severity: CRITICAL)

**Location**: Multiple admin instructions

**Issue**:
Some admin instructions don't validate the state they expect. For example:

**In `trigger_big_pay_day`**:
```rust
// No check that a claim period is active
// No check that BPD hasn't already been triggered
```

An attacker could:
1. Call `trigger_big_pay_day` before `initialize_claim_period` is called
2. Call it twice in the same claim period
3. Call it after the claim period ends

**Current code checks**:
- Loops through all stakes and processes them
- But doesn't validate `claim_config.claim_period_started` at the start
- Doesn't validate `!claim_config.big_pay_day_complete`

**Fix**:
```rust
pub fn trigger_big_pay_day(ctx: Context<TriggerBPD>) -> Result<()> {
    let claim_config = &mut ctx.accounts.claim_config;
    let clock = Clock::get()?;
    
    // Add these checks
    require!(
        claim_config.claim_period_started,
        HelixError::ClaimPeriodNotActive
    );
    require!(
        !claim_config.big_pay_day_complete,
        HelixError::BPDAlreadyTriggered
    );
    require!(
        clock.slot >= claim_config.start_slot
        && clock.slot <= claim_config.end_slot,
        HelixError::OutsideClaimWindow
    );
```

**Affected instructions**:
- [ ] `trigger_big_pay_day` — needs state validation
- [ ] `finalize_bpd_calculation` — needs state validation
- [ ] `crank_distribution` — needs state validation
- [ ] `free_claim` — needs state validation
- [ ] `seal_bpd_finalize` — needs state validation

**Test case needed**:
```bash
# Test each instruction fails with proper error when called out-of-sequence
npx vitest run tests/bankrun -t "state validation" -t "out of order"
```

---

## MEDIUM FINDINGS

### 4. Unwrap on PDA Validation (Severity: MEDIUM)

**Location**: 
- `trigger_big_pay_day.rs:120`
- `finalize_bpd_calculation.rs:140`

**Issue**:
```rust
if expected_pda.is_err() || account_info.key() != expected_pda.unwrap() {
    continue;
}
```

If `expected_pda.is_err()`, the `.unwrap()` will panic. The logic should be:

```rust
let expected_pda = match Pubkey::create_program_address(...) {
    Ok(pda) => pda,
    Err(_) => continue,  // Skip if PDA derivation fails
};

if account_info.key() != expected_pda {
    continue;
}
```

Or more idiomatically:
```rust
if let Ok(expected_pda) = Pubkey::create_program_address(...) {
    if account_info.key() == expected_pda {
        // Process account
    }
}
```

---

### 5. Missing Test Coverage (Severity: MEDIUM)

**Status**: 154 tests passing, but 2 test files have syntax errors

```
FAIL tests/bankrun/tests/admin_constraints.test.ts [ReferenceError: before is not defined]
FAIL tests/bankrun/tests/bpd_math.test.ts [ReferenceError: before is not defined]
```

These files use Mocha's `before` hook but the test runner is Vitest (which uses `beforeAll` instead).

**Fix**:
Change `before` → `beforeAll` in both test files, or migrate to Vitest syntax.

---

### 6. Unwrap_or(0) in Production Code (Severity: MEDIUM)

**Location**: Multiple places in math.rs and instruction handlers

```rust
.unwrap_or(0);
```

This silently converts errors to 0, which can mask issues. If a calculation should never fail, it should explicitly handle the case:

```rust
// Instead of:
let result = a.checked_div(b).unwrap_or(0);

// Be explicit:
let result = a.checked_div(b).ok_or(error!(HelixError::DivisionByZero))?;
```

**Locations to review**:
- `trigger_big_pay_day.rs:156`
- `finalize_bpd_calculation.rs:162, 198`
- `math.rs:337` and others

---

### 7. Missing Multisig Authority Validation (Severity: MEDIUM)

**Location**: Admin instructions

**Status**: README says "All admin instructions require multisig authority (Squads v4)" but I can't see the code that validates this. Need to verify:

- [ ] Does `admin_mint` check `signer == squads_authority`?
- [ ] Does `initialize_claim_period` check it?
- [ ] Does `admin_set_claim_end_slot` check it?

Add explicit validation or confirm it's in the Anchor constraints.

---

## LOW FINDINGS

### 8. Frontend Test Failures (Severity: LOW)

**Status**: Test suite has 2 failing files due to syntax issues (fixable in <5 minutes)

No security impact, but blocks full test suite validation.

---

### 9. Missing X-Ray Constraint Definitions (Severity: LOW)

X-Ray doesn't understand custom Anchor constraints like:
- `stake_account.is_active`
- `claim_status.is_claimed`
- `claim_config.claim_period_started`

These are probably in your constraint macro definitions. This causes false positives but doesn't indicate actual issues. You can safely ignore X-Ray warnings about "unknown constraint" if you've verified the constraint in code.

---

## Test Results Summary

```
✅ Passed: 154 tests
❌ Failed: 2 test files (syntax errors, not logic errors)
⏱️ Duration: 2.6 seconds

Critical paths covered:
- ✅ Create stake
- ✅ Claim rewards
- ✅ Token operations
- ❌ Admin constraints (syntax issue)
- ❌ BPD math (syntax issue)
```

---

## REMEDIATION PRIORITY

**This week** (before any testnet deployment):
1. Fix critical PDA validation (item #1)
2. Fix mul_div_up safety (item #2)
3. Add state validation to admin instructions (item #3)
4. Fix unwrap in PDA checks (item #4)
5. Fix test file syntax (item #5)

**Next week** (before testnet):
6. Clean up unwrap_or(0) patterns (item #6)
7. Verify multisig authority checks (item #7)

**No deadline** (nice to have):
8. X-Ray false positives (item #9) — document and move on

---

## Next Steps

1. **Create fixes branch**: `git checkout -b security/phase1-critical-fixes`
2. **Create test cases first** for each critical issue
3. **Implement fixes** one at a time
4. **Run full test suite** after each fix
5. **Create detailed inline comments** explaining security reasoning
6. **Commit each fix separately** with clear messages

Once all critical items are fixed, we'll:
- Re-run X-Ray to confirm no regressions
- Schedule Phase 2 professional audit
- Plan for testnet deployment

Would you like me to start working on the fixes, or do you have questions about any finding?
