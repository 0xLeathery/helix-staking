# Phase 03.3: Arithmetic Safety Fix Plan

> **Status**: PLANNING (do not modify source code)
> **Date**: 2026-02-08
> **Scope**: All arithmetic/overflow vulnerabilities from security audit + additional findings

---

## Table of Contents

1. [Prerequisite: Verify math.rs Helpers](#1-prerequisite-verify-mathrs-helpers)
2. [HIGH-1: crank_distribution u64 overflow at ~50K staked tokens](#2-high-1-crank_distribution-u64-overflow)
3. [MED-1: Unchecked `as u64` truncation in BPD bonus](#3-med-1-unchecked-as-u64-truncation-in-bpd-bonus)
4. [MED-2: withdraw_vested u64 overflow at ~28K HELIX](#4-med-2-withdraw_vested-u64-overflow)
5. [MED-3: saturating_sub masks over-distribution](#5-med-3-saturating_sub-masks-over-distribution)
6. [Additional Findings from Full Codebase Scan](#6-additional-findings-from-full-codebase-scan)
7. [New Error Codes Needed](#7-new-error-codes-needed)
8. [Implementation Order](#8-implementation-order)

---

## 1. Prerequisite: Verify math.rs Helpers

### File: `programs/helix-staking/src/instructions/math.rs`

#### `mul_div` (lines 9-17) -- CORRECT

```rust
pub fn mul_div(a: u64, b: u64, c: u64) -> Result<u64> {
    require!(c > 0, HelixError::DivisionByZero);
    let result = (a as u128)
        .checked_mul(b as u128)
        .ok_or(error!(HelixError::Overflow))?
        .checked_div(c as u128)
        .ok_or(error!(HelixError::Overflow))?;
    u64::try_from(result).map_err(|_| error!(HelixError::Overflow))
}
```

**Verification**:
- Inputs: two u64 values and a u64 divisor
- Intermediate: `(a as u128) * (b as u128)` -- max is `u64::MAX * u64::MAX = (2^64-1)^2 ~= 3.4e38`, well within u128 range (`2^128 ~= 3.4e38`). Actually `(2^64-1)^2 = 2^128 - 2^65 + 1 < 2^128 - 1 = u128::MAX`. So checked_mul in u128 **can never fail** for u64 inputs, but the check is still good defensive practice.
- Division by u128 cannot overflow.
- Final `u64::try_from` correctly rejects results > u64::MAX.
- **Verdict: CORRECT and sufficient for the HIGH-1 and MED-2 fixes.**

#### `mul_div_up` (lines 22-33) -- CORRECT

Same analysis as `mul_div` but with round-up. The `checked_add((c-1) as u128)` could in theory overflow u128 if the multiplication is already at u128::MAX, but `(2^64-1)^2 + (2^64-2) = 2^128 - 2^65 + 1 + 2^64 - 2 = 2^128 - 1`, which is exactly u128::MAX. This is the theoretical worst case and it still fits. **CORRECT.**

#### `calculate_lpb_bonus` (lines 38-66) -- REVIEW

```rust
let numerator = days_minus_one
    .checked_mul(2)                    // max: 3640 * 2 = 7280
    .ok_or(HelixError::Overflow)?
    .checked_mul(PRECISION)            // max: 7280 * 1_000_000_000 = 7.28e12
    .ok_or(HelixError::Overflow)?;
```

- `days_minus_one` max = 3640 (capped by `LPB_MAX_DAYS - 1`)
- `3640 * 2 = 7280`
- `7280 * 1_000_000_000 = 7_280_000_000_000` (7.28e12)
- u64::MAX = 1.84e19
- **SAFE. No overflow possible.**

#### `calculate_bpb_bonus` (lines 71-89) -- REVIEW

```rust
let amount_div_10 = staked_amount / 10;
// ...
let bonus = mul_div(amount_div_10, PRECISION, BPB_THRESHOLD)?;
```

- `amount_div_10` max = u64::MAX / 10 ~= 1.84e18
- `mul_div` promotes to u128: `1.84e18 * 1e9 = 1.84e27` -- fits in u128.
- **SAFE via mul_div.**

#### `calculate_t_shares` (lines 93-127) -- REVIEW

```rust
let total_multiplier = PRECISION        // 1e9
    .checked_add(lpb_bonus)              // max += 2 * 1e9 = 2e9
    .checked_add(bpb_bonus)?;            // max += 1e9
// max total_multiplier = 4e9

let t_shares_u128 = amount_u128
    .checked_mul(multiplier_u128)        // u64::MAX * 4e9 ~= 7.37e28 -- fits u128
    .checked_div(share_rate_u128)?;
```

- **SAFE. Already uses u128.**

#### `calculate_early_penalty` (lines 134-176) -- POTENTIAL ISSUE (see Additional Findings ADDL-1)

```rust
let served_fraction_bps = elapsed
    .checked_mul(BPS_SCALER)   // u64 * 10_000
    .ok_or(HelixError::Overflow)?
    .checked_div(total_duration)?;
```

- `elapsed` is bounded by `total_duration` which is `end_slot - start_slot`.
- `end_slot = start_slot + days * slots_per_day` where max days = 5555, slots_per_day = 216_000.
- Max `total_duration` = `5555 * 216_000 = 1_199_880_000` (~1.2e9).
- Max `elapsed` <= `total_duration` = ~1.2e9.
- `elapsed * BPS_SCALER` = `1.2e9 * 10_000 = 1.2e13`.
- u64::MAX = 1.84e19.
- **SAFE. No overflow possible in practice.** But for belt-and-suspenders, could use `mul_div` here too. Not required.

---

## 2. HIGH-1: crank_distribution u64 overflow

### Severity: HIGH (bricks reward distribution permanently)

### File: `programs/helix-staking/src/instructions/crank_distribution.rs`

### Current Code (lines 82-90):

```rust
let total_staked = global_state.total_tokens_staked;

// annual_inflation = staked * annual_inflation_bp / 100_000_000
// (basis points with 2 extra decimals of precision: 3.69% = 3_690_000 bp)
let annual_inflation = total_staked
    .checked_mul(global_state.annual_inflation_bp)
    .ok_or(HelixError::Overflow)?
    .checked_div(100_000_000)
    .ok_or(HelixError::Overflow)?;
```

### Overflow Analysis:

- `total_staked` is u64 (base units, 8 decimals).
- `annual_inflation_bp` = 3,690,000 (default).
- `total_staked.checked_mul(3_690_000)` overflows u64 when:
  - `total_staked > u64::MAX / 3_690_000`
  - `= 18_446_744_073_709_551_615 / 3_690_000`
  - `= 4_998_576_986_913` base units
  - `= 49,985.77 HELIX` (at 8 decimals, divide by 1e8)
- **This overflows at just ~50K HELIX staked.** For any non-trivial protocol, this is guaranteed to trigger.

### Replacement Code:

```rust
let total_staked = global_state.total_tokens_staked;

// annual_inflation = staked * annual_inflation_bp / 100_000_000
// Use mul_div to avoid u64 overflow via u128 intermediates
// (basis points with 2 extra decimals of precision: 3.69% = 3_690_000 bp)
let annual_inflation = mul_div(total_staked, global_state.annual_inflation_bp, 100_000_000)?;
```

### Why This Works:

- `mul_div` computes `(total_staked as u128) * (annual_inflation_bp as u128) / 100_000_000`.
- Worst-case intermediate: `u64::MAX * u64::MAX ~= 3.4e38`, fits in u128 (`3.4e38`).
- Realistic worst-case: `1e18 * 3_690_000 = 3.69e24`, trivially fits in u128.
- Result: `3.69e24 / 1e8 = 3.69e16`, fits in u64 (`1.84e19`).
- **Overflow threshold moves from ~50K HELIX to effectively unlimited** (would need `result > u64::MAX`, which means `staked > u64::MAX * 100_000_000 / 3_690_000 ~= 5e23` base units -- impossible since total token supply is bounded by u64).

### No Import Changes Needed:

`mul_div` is already imported at line 8:
```rust
use crate::instructions::math::{get_current_day, mul_div};
```

### Test Scenario:

```rust
#[test]
fn test_crank_distribution_large_stake() {
    // 100K HELIX staked = 10_000_000_000_000 base units
    // This would overflow the old code (>50K), should work now
    let total_staked: u64 = 10_000_000_000_000;
    let annual_inflation_bp: u64 = 3_690_000;

    let result = mul_div(total_staked, annual_inflation_bp, 100_000_000);
    assert!(result.is_ok());
    // Expected: 10_000_000_000_000 * 3_690_000 / 100_000_000 = 369_000_000_000
    assert_eq!(result.unwrap(), 369_000_000_000);
}

#[test]
fn test_crank_distribution_extreme_stake() {
    // 1 billion HELIX staked = 100_000_000_000_000_000 base units
    let total_staked: u64 = 100_000_000_000_000_000; // 1B HELIX
    let annual_inflation_bp: u64 = 3_690_000;

    let result = mul_div(total_staked, annual_inflation_bp, 100_000_000);
    assert!(result.is_ok());
    // Expected: 1e17 * 3.69e6 / 1e8 = 3.69e15
    assert_eq!(result.unwrap(), 3_690_000_000_000_000);
}
```

---

## 3. MED-1: Unchecked `as u64` Truncation in BPD Bonus

### Severity: MEDIUM (silent truncation causes loss of funds for large BPD bonuses)

### File: `programs/helix-staking/src/instructions/trigger_big_pay_day.rs`

### Current Code (lines 194-198):

```rust
let bonus = ((*share_days)
    .checked_mul(helix_per_share_day)
    .ok_or(HelixError::Overflow)?
    .checked_div(PRECISION as u128)
    .ok_or(HelixError::DivisionByZero)?) as u64;
```

### Problem:

The expression is `(u128_value) as u64` which **silently truncates** the upper 64 bits. If the result exceeds `u64::MAX` (~18.4e18, or ~184 billion HELIX at 8 decimals), the value wraps to a much smaller number. While 184B HELIX is extremely large, the correct pattern is to use `try_from` and propagate an error.

### Truncation Analysis:

- `share_days`: u128, realistically `t_shares (u64) * days (u64)`.
- `helix_per_share_day`: u128, calculated as `unclaimed * PRECISION / total_share_days`.
- After dividing by PRECISION, the result represents actual HELIX tokens per stake.
- Realistic max: total unclaimed pool is bounded by `total_claimable` (u64). So the sum of all bonuses is at most `total_claimable`, and individual bonuses are a fraction. In practice this won't exceed u64.
- **But the `as u64` is still a code smell and violates defense-in-depth.** If any upstream calculation bug inflates the value, silent truncation is the worst possible outcome.

### Replacement Code:

```rust
let bonus_u128 = (*share_days)
    .checked_mul(helix_per_share_day)
    .ok_or(HelixError::Overflow)?
    .checked_div(PRECISION as u128)
    .ok_or(HelixError::DivisionByZero)?;

let bonus = u64::try_from(bonus_u128)
    .map_err(|_| error!(HelixError::Overflow))?;
```

### Why This Works:

- Replaces silent truncation with an explicit error if the u128 result exceeds u64::MAX.
- If the computation produces a value > 18.4e18 base units, the instruction fails with `Overflow` instead of silently distributing a truncated (smaller) amount.
- In the normal case where bonus fits in u64, behavior is identical.

### Additional `as u64` Casts in the Same File:

**Lines 177-178** (event emission):
```rust
total_eligible_share_days: claim_config.bpd_total_share_days.min(u64::MAX as u128) as u64,
helix_per_share_day: helix_per_share_day.min(u64::MAX as u128) as u64,
```

These use `.min(u64::MAX as u128)` before casting, which clamps rather than truncates. For **event fields** this is acceptable -- the event is informational and clamping is explicit. No fix needed for these.

**Line 261** (also event emission): Same pattern, acceptable.

### Test Scenario:

```rust
#[test]
fn test_bpd_bonus_safe_truncation() {
    // Simulate a bonus that would exceed u64::MAX
    let share_days: u128 = u64::MAX as u128;
    let helix_per_share_day: u128 = 2 * (PRECISION as u128); // 2x PRECISION

    let bonus_u128 = share_days
        .checked_mul(helix_per_share_day).unwrap()
        .checked_div(PRECISION as u128).unwrap();

    // This is 2 * u64::MAX, which exceeds u64
    assert!(u64::try_from(bonus_u128).is_err());
    // Old code: (bonus_u128) as u64 would silently give 2^64 - 2 = wrong
}
```

---

## 4. MED-2: withdraw_vested u64 overflow at ~28K HELIX

### Severity: MEDIUM (bricks partial withdrawals for large claims)

### File: `programs/helix-staking/src/instructions/withdraw_vested.rs`

### Current Code (lines 157-167):

```rust
// Vesting portion (90% of total)
let vesting_portion = claimed_amount
    .checked_sub(immediate)
    .ok_or(HelixError::Underflow)?;

// Linear unlock: vesting_portion * elapsed / vesting_duration
let unlocked_vesting = vesting_portion
    .checked_mul(elapsed)
    .ok_or(HelixError::Overflow)?
    .checked_div(vesting_duration)
    .ok_or(HelixError::DivisionByZero)?;
```

### Overflow Analysis:

- `vesting_portion` = 90% of `claimed_amount` (u64 base units).
- `elapsed` = `current_slot - claimed_slot` (u64 slot count).
- `vesting_duration` = `vesting_end_slot - claimed_slot` = `30 * 216_000 = 6_480_000` slots.
- `vesting_portion.checked_mul(elapsed)` overflows u64 when:
  - `vesting_portion * elapsed > u64::MAX`
  - `elapsed <= vesting_duration = 6_480_000`
  - Overflow when `vesting_portion > u64::MAX / 6_480_000 = 2_846_409_276_196`
  - In HELIX terms: `2_846_409_276_196 / 1e8 = 28,464 HELIX` (the vesting portion)
  - Since vesting_portion = 90% of claimed_amount: `claimed_amount > 28_464 / 0.9 = 31,627 HELIX`
- **Overflows at ~31.6K HELIX claimed.** This is a very realistic amount.

### Replacement Code:

The `calculate_vested_amount` function needs `mul_div` imported. Currently this file does NOT import from math.rs.

**Add import** at the top of `withdraw_vested.rs`:
```rust
use crate::instructions::math::mul_div;
```

**Replace lines 162-167:**

```rust
// Linear unlock: vesting_portion * elapsed / vesting_duration
// Use mul_div to avoid u64 overflow via u128 intermediates
// (overflows at ~31.6K HELIX claimed without this)
let unlocked_vesting = mul_div(vesting_portion, elapsed, vesting_duration)?;
```

### Why This Works:

- `mul_div` computes `(vesting_portion as u128) * (elapsed as u128) / (vesting_duration as u128)`.
- Worst-case intermediate: `u64::MAX * u64::MAX ~= 3.4e38`, fits in u128.
- Realistic worst-case: `1e17 (1B HELIX vesting) * 6_480_000 = 6.48e23`, trivially fits in u128.
- Result is always <= `vesting_portion` (since `elapsed <= vesting_duration`), so fits in u64.
- **Overflow threshold moves from ~31.6K HELIX to effectively unlimited.**

### ALSO: Check the immediate portion calculation (lines 132-136):

```rust
let immediate = claimed_amount
    .checked_mul(IMMEDIATE_RELEASE_BPS)     // claimed_amount * 1000
    .ok_or(HelixError::Overflow)?
    .checked_div(BPS_SCALER)                // / 10000
    .ok_or(HelixError::DivisionByZero)?;
```

- `IMMEDIATE_RELEASE_BPS` = 1000
- Overflow when `claimed_amount * 1000 > u64::MAX`
- `claimed_amount > 1.84e16` = 184,000,000 HELIX (184M HELIX)
- This is very large but **could be hit in a high-value protocol**. For defense-in-depth, convert this to `mul_div` as well.

**Replace lines 132-136:**

```rust
let immediate = mul_div(claimed_amount, IMMEDIATE_RELEASE_BPS, BPS_SCALER)?;
```

### Test Scenario:

```rust
#[test]
fn test_vested_amount_large_claim() {
    // 100K HELIX claimed = 10_000_000_000_000 base units
    // This would overflow old code (>31.6K), should work now
    let claimed_amount: u64 = 10_000_000_000_000;
    let claimed_slot: u64 = 1_000_000;
    let vesting_end_slot: u64 = claimed_slot + 6_480_000; // 30 days
    let current_slot: u64 = claimed_slot + 3_240_000; // 15 days in (50%)

    let result = calculate_vested_amount(
        claimed_amount, claimed_slot, vesting_end_slot, current_slot
    );
    assert!(result.is_ok());

    let immediate = mul_div(claimed_amount, 1000, 10000).unwrap(); // 10%
    let vesting_portion = claimed_amount - immediate; // 90%
    let expected_unlocked = mul_div(vesting_portion, 3_240_000, 6_480_000).unwrap(); // 50% of 90%
    let expected_total = immediate + expected_unlocked;
    assert_eq!(result.unwrap(), expected_total);
}
```

---

## 5. MED-3: saturating_sub Masks Over-Distribution

### Severity: MEDIUM (silent accounting error; distributed tokens > pool)

### File: `programs/helix-staking/src/instructions/trigger_big_pay_day.rs`

### Current Code (lines 228-230):

```rust
// Deduct distributed amount from remaining
claim_config.bpd_remaining_unclaimed = claim_config.bpd_remaining_unclaimed
    .saturating_sub(batch_distributed);
```

### Problem:

If `batch_distributed > bpd_remaining_unclaimed`, `saturating_sub` silently clamps to 0 instead of erroring. This means the protocol distributed MORE tokens than the unclaimed pool, which is a critical accounting invariant violation. The cause could be:
- Floating-point-style rounding accumulation across many batches
- A bug in `finalize_bpd_calculation` that underestimates share-days
- Duplicate stakes being processed (defended against separately, but defense-in-depth)

### Two Options:

**Option A: Strict -- checked_sub with error (RECOMMENDED)**

Replace lines 228-230:
```rust
// Deduct distributed amount from remaining
// SECURITY: Guard against over-distribution (accounting invariant)
claim_config.bpd_remaining_unclaimed = claim_config.bpd_remaining_unclaimed
    .checked_sub(batch_distributed)
    .ok_or(HelixError::BpdOverDistribution)?;
```

This requires a new error code (see Section 7).

**Option B: Guard + saturating (FALLBACK)**

If we want to tolerate small rounding dust but still catch major violations:

```rust
// Deduct distributed amount from remaining
// SECURITY: Guard against significant over-distribution
if batch_distributed > claim_config.bpd_remaining_unclaimed {
    // Allow tiny dust (< 1 token) from rounding, but error on anything significant
    let overage = batch_distributed - claim_config.bpd_remaining_unclaimed;
    require!(
        overage <= 100, // 100 base units = 0.000001 HELIX dust tolerance
        HelixError::BpdOverDistribution
    );
    claim_config.bpd_remaining_unclaimed = 0;
} else {
    claim_config.bpd_remaining_unclaimed = claim_config.bpd_remaining_unclaimed
        .checked_sub(batch_distributed)
        .ok_or(HelixError::BpdOverDistribution)?;
}
```

### Recommendation: **Option A (strict checked_sub)**

Reasoning:
- The BPD rate is pre-calculated in `finalize_bpd_calculation` with u128 precision.
- Each bonus is calculated as `share_days * helix_per_share_day / PRECISION`.
- Since `helix_per_share_day = unclaimed * PRECISION / total_share_days`, and we divide by the same PRECISION later, rounding can only truncate (floor division), never inflate.
- Therefore `sum(bonuses) <= unclaimed_amount` is a mathematical invariant.
- If this invariant is violated, something is seriously wrong and we SHOULD error, not silently clamp.

### Analysis Proving Floor Division Safety:

For each stake `i`:
```
bonus_i = floor(share_days_i * floor(unclaimed * PRECISION / total_share_days) / PRECISION)
```

Let `R = floor(unclaimed * PRECISION / total_share_days)`.

```
sum(bonus_i) = sum(floor(share_days_i * R / PRECISION))
             <= sum(share_days_i * R / PRECISION)
             = R * total_share_days / PRECISION
             = floor(unclaimed * PRECISION / total_share_days) * total_share_days / PRECISION
             <= (unclaimed * PRECISION / total_share_days) * total_share_days / PRECISION
             = unclaimed
```

**QED: over-distribution is mathematically impossible with correct code.** Using checked_sub provides a safety net that catches bugs rather than hiding them.

### Test Scenario:

```rust
#[test]
fn test_bpd_over_distribution_guard() {
    // Simulate batch_distributed > bpd_remaining_unclaimed
    let remaining: u64 = 1000;
    let distributed: u64 = 1001; // Over by 1

    let result = remaining.checked_sub(distributed);
    assert!(result.is_none()); // Would be caught by checked_sub
}
```

---

## 6. Additional Findings from Full Codebase Scan

### ADDL-1: free_claim.rs -- `checked_mul` overflow in calculate_speed_bonus (MEDIUM-LOW)

**File**: `programs/helix-staking/src/instructions/free_claim.rs`, lines 350-354

```rust
let base_amount = snapshot_balance
    .checked_mul(HELIX_PER_SOL)    // snapshot_balance * 10_000
    .ok_or(HelixError::Overflow)?
    .checked_div(10)
    .ok_or(HelixError::DivisionByZero)?;
```

**Analysis**:
- `snapshot_balance` is in lamports (SOL with 9 decimals).
- `HELIX_PER_SOL` = 10,000.
- Overflow when `snapshot_balance * 10_000 > u64::MAX`.
- `snapshot_balance > 1.84e15 lamports = 1,844,674 SOL` (~$350M at $190/SOL).
- **Unlikely but not impossible for a whale snapshot.**

**Fix**: Use `mul_div`:
```rust
// base_amount = snapshot_balance * HELIX_PER_SOL / 10
let base_amount = mul_div(snapshot_balance, HELIX_PER_SOL, 10)?;
```

**Requires import**: Add `use crate::instructions::math::mul_div;` to `free_claim.rs`.

### ADDL-2: free_claim.rs -- `checked_mul` in immediate_amount (lines 143-147)

```rust
let immediate_amount = total_amount
    .checked_mul(IMMEDIATE_RELEASE_BPS)   // total_amount * 1000
    .ok_or(HelixError::Overflow)?
    .checked_div(BPS_SCALER)
    .ok_or(HelixError::DivisionByZero)?;
```

**Analysis**:
- `total_amount` = `base_amount + bonus_amount`.
- If a very large snapshot balance flows through, `total_amount * 1000` could overflow.
- Overflow when `total_amount > u64::MAX / 1000 = 1.84e16 base units = 184,000,000 HELIX`.
- For the airdrop context where `total_amount` is derived from SOL balance, maximum would be `~1.84e15 * 10000 / 10 * 1.2 = ~2.2e15`, so still safe.
- **Low risk but worth fixing for consistency.**

**Fix**: Use `mul_div`:
```rust
let immediate_amount = mul_div(total_amount, IMMEDIATE_RELEASE_BPS, BPS_SCALER)?;
```

### ADDL-3: free_claim.rs -- `checked_mul` in bonus_amount (lines 364-368)

```rust
let bonus_amount = base_amount
    .checked_mul(bonus_bps)   // base_amount * 2000 (max)
    .ok_or(HelixError::Overflow)?
    .checked_div(BPS_SCALER)
    .ok_or(HelixError::DivisionByZero)?;
```

**Analysis**:
- `bonus_bps` max = 2000 (20% bonus).
- Overflow when `base_amount * 2000 > u64::MAX`.
- `base_amount > 9.22e15`, which is 92.2 million HELIX.
- Same low risk category.

**Fix**: Use `mul_div`:
```rust
let bonus_amount = mul_div(base_amount, bonus_bps, BPS_SCALER)?;
```

### ADDL-4: calculate_pending_rewards -- saturating_sub masks negative rewards (LOW)

**File**: `programs/helix-staking/src/instructions/math.rs`, lines 238-245

```rust
pub fn calculate_pending_rewards(
    t_shares: u64,
    current_share_rate: u64,
    reward_debt: u64,
) -> Result<u64> {
    let current_value = (t_shares as u128)
        .checked_mul(current_share_rate as u128)
        .ok_or(error!(HelixError::Overflow))?;

    // Saturating sub handles case where reward_debt > current_value (shouldn't happen but defensive)
    let pending_128 = current_value.saturating_sub(reward_debt as u128);

    u64::try_from(pending_128).map_err(|_| error!(HelixError::Overflow))
}
```

**Problem**: Comment says "shouldn't happen but defensive". If `reward_debt > current_value`, this silently returns 0 instead of signaling an accounting error. However, this is a **valid defensive pattern** in the rewards context -- share_rate can only increase, so `reward_debt > current_value` should truly never happen. Changing to checked_sub would brick the unstake/claim if there's any rounding issue, which is worse.

**Verdict**: ACCEPTABLE. The saturating_sub is the correct defensive choice here. **No fix needed.**

### ADDL-5: finalize_bpd_calculation -- helix_per_share_day u128 safety (INFO)

**File**: `programs/helix-staking/src/instructions/finalize_bpd_calculation.rs`, lines 157-161

```rust
let helix_per_share_day = (unclaimed_amount as u128)
    .checked_mul(PRECISION as u128)
    .ok_or(HelixError::Overflow)?
    .checked_div(claim_config.bpd_total_share_days)
    .ok_or(HelixError::DivisionByZero)?;
```

**Analysis**:
- `unclaimed_amount` is u64, `PRECISION` is u64.
- `u64::MAX * u64::MAX` fits in u128 (see math.rs verification above).
- `bpd_total_share_days` is u128 (already stored as u128).
- Result stored in u128 field. **SAFE.**

### ADDL-6: No `as u64` casts outside of event emissions (CLEAN)

Scanning all instruction files for bare `as u64` casts on computed values:

| File | Line | Cast | Status |
|------|------|------|--------|
| `trigger_big_pay_day.rs` | 198 | `...) as u64` | **MED-1 (FIX)** |
| `trigger_big_pay_day.rs` | 177 | `.min(u64::MAX as u128) as u64` | Event field, clamped, OK |
| `trigger_big_pay_day.rs` | 178 | `.min(u64::MAX as u128) as u64` | Event field, clamped, OK |
| `trigger_big_pay_day.rs` | 259 | `.min(u64::MAX as u128) as u64` | Event field, clamped, OK |
| `trigger_big_pay_day.rs` | 260 | `.min(u64::MAX as u128) as u64` | Event field, clamped, OK |
| `trigger_big_pay_day.rs` | 145 | `stake.t_shares as u128` | Widening cast, safe |
| `trigger_big_pay_day.rs` | 146 | `days_staked as u128` | Widening cast, safe |
| `math.rs` | 11-14 | `a as u128`, `b as u128` | Widening casts, safe |
| `free_claim.rs` | 206 | `days_elapsed as u16` | **ADDL-7 (see below)** |

### ADDL-7: free_claim.rs -- `days_elapsed as u16` truncation (INFO)

**File**: `programs/helix-staking/src/instructions/free_claim.rs`, line 206

```rust
days_elapsed: days_elapsed as u16,
```

**Analysis**:
- `days_elapsed` is u64 but represents days since claim period start.
- Claim period is 180 days maximum.
- `180 < u16::MAX (65535)`, so this is safe.
- **No fix needed, but a comment would be helpful.**

---

## 7. New Error Codes Needed

### File: `programs/helix-staking/src/error.rs`

Add one new error variant:

```rust
#[msg("BPD distribution exceeded remaining pool")]
BpdOverDistribution,
```

This is used by the MED-3 fix (checked_sub replacement for saturating_sub).

No other new error codes are needed -- all other fixes use existing `HelixError::Overflow`.

---

## 8. Implementation Order

### Priority Order (by severity and blast radius):

| Order | ID | Severity | File | Risk of Regression |
|-------|-----|----------|------|-------------------|
| 1 | HIGH-1 | HIGH | `crank_distribution.rs` | LOW (drop-in `mul_div` replacement) |
| 2 | MED-2 | MEDIUM | `withdraw_vested.rs` | LOW (drop-in `mul_div` replacement + new import) |
| 3 | MED-1 | MEDIUM | `trigger_big_pay_day.rs` | LOW (replace `as u64` with `try_from`) |
| 4 | MED-3 | MEDIUM | `trigger_big_pay_day.rs` | LOW (replace `saturating_sub` with `checked_sub`) |
| 5 | ADDL-1 | MED-LOW | `free_claim.rs` | LOW (new import + drop-in `mul_div`) |
| 6 | ADDL-2 | LOW | `free_claim.rs` | LOW (same pattern) |
| 7 | ADDL-3 | LOW | `free_claim.rs` | LOW (same pattern) |
| 8 | MED-2b | LOW | `withdraw_vested.rs` (immediate calc) | LOW (same pattern) |

### Files Modified:

1. **`programs/helix-staking/src/error.rs`** -- Add `BpdOverDistribution` error
2. **`programs/helix-staking/src/instructions/crank_distribution.rs`** -- HIGH-1 fix
3. **`programs/helix-staking/src/instructions/trigger_big_pay_day.rs`** -- MED-1, MED-3 fixes
4. **`programs/helix-staking/src/instructions/withdraw_vested.rs`** -- MED-2 fix (+ import)
5. **`programs/helix-staking/src/instructions/free_claim.rs`** -- ADDL-1/2/3 fixes (+ import)

### Files NOT Modified:

- `math.rs` -- Helpers are correct and sufficient
- `constants.rs` -- No changes needed
- `create_stake.rs` -- Already uses u128 in `calculate_t_shares`
- `unstake.rs` -- Uses `mul_div` for penalty redistribution, safe
- `claim_rewards.rs` -- Uses `calculate_pending_rewards` (u128 internally), safe
- `finalize_bpd_calculation.rs` -- Already uses u128 for BPD rate, safe
- `admin_mint.rs` -- Only `checked_add`, no multiplication overflow risk
- `initialize_claim_period.rs` -- Only `checked_mul/checked_add` on small constants, safe

### Estimated LOC Changed:

- Removals: ~15 lines
- Additions: ~20 lines (including imports, comments)
- Net: +5 lines
- Risk: LOW (all changes are mechanical replacements of known-safe patterns)

---

## Summary of All Changes

| Vuln ID | Fix | Lines Changed | Overflow Threshold Before | After |
|---------|-----|---------------|--------------------------|-------|
| HIGH-1 | `checked_mul/div` -> `mul_div` | 4 -> 1 | ~50K HELIX | Unlimited |
| MED-1 | `as u64` -> `u64::try_from` | 1 -> 3 | Silent truncation | Explicit error |
| MED-2 | `checked_mul/div` -> `mul_div` | 3 -> 1 | ~31.6K HELIX | Unlimited |
| MED-2b | immediate `checked_mul/div` -> `mul_div` | 3 -> 1 | ~184M HELIX | Unlimited |
| MED-3 | `saturating_sub` -> `checked_sub` | 1 -> 2 | Silent clamp | Explicit error |
| ADDL-1 | `checked_mul/div` -> `mul_div` | 3 -> 1 | ~1.8M SOL | Unlimited |
| ADDL-2 | `checked_mul/div` -> `mul_div` | 3 -> 1 | ~184M HELIX | Unlimited |
| ADDL-3 | `checked_mul/div` -> `mul_div` | 3 -> 1 | ~92M HELIX | Unlimited |
