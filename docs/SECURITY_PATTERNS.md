# Security Patterns in Helix Staking

This document explains the security validation patterns used throughout the Helix Staking program.

## Overview

The protocol uses a tiered validation approach:
1. **Declarative Anchor Constraints** — For standard instructions
2. **Runtime Validation Functions** — For bulk/cranked operations
3. **Explicit Error Handling** — All arithmetic operations

---

## Pattern 1: Declarative PDA Validation (Standard Instructions)

### Pattern

```rust
#[derive(Accounts)]
pub struct MyInstruction<'info> {
    #[account(
        seeds = [STAKE_SEED, user.key().as_ref(), &stake_id.to_le_bytes()],
        bump = stake_account.bump,
    )]
    pub stake_account: Account<'info, StakeAccount>,
}
```

### Why

Anchor's declarative constraints provide:
- ✅ Automatic PDA derivation and validation
- ✅ Bump seed canonicity checking
- ✅ Atomicity guarantee (checked before instruction runs)
- ✅ Clear audit trail (constraint visible in struct)

### Security Guarantees

- Account key matches derived PDA
- Bump is canonical (prevents seed canonicalization attacks)
- Validation happens before instruction executes

### Usage

Use this pattern for **all standard instructions** that have declared accounts.

---

## Pattern 2: Runtime Validation (Bulk Operations)

### Context

Some instructions accept arbitrary accounts via `remaining_accounts`:
- `trigger_big_pay_day` — Distributes BPD to stakes
- `finalize_bpd_calculation` — Calculates BPD distribution

Anchor constraints cannot be applied to `remaining_accounts`, so we use runtime validation.

### Pattern

```rust
use crate::security::validate_stake_pda;

pub fn trigger_big_pay_day<'info>(...) -> Result<()> {
    for (i, account_info) in ctx.remaining_accounts.iter().enumerate() {
        // Ownership check
        if account_info.owner != &crate::id() {
            continue;
        }
        
        // Deserialize
        let stake = match StakeAccount::try_deserialize(&mut &data[..]) {
            Ok(s) => s,
            Err(_) => continue,
        };
        
        // PDA validation (Anchor-equivalent)
        if validate_stake_pda(account_info, &stake).is_err() {
            continue;
        }
        
        // Process account...
    }
}
```

### validate_stake_pda Function

```rust
pub fn validate_stake_pda(
    account_info: &AccountInfo,
    stake: &StakeAccount,
) -> Result<()> {
    // Derive canonical PDA (returns ONLY valid bump)
    let (expected_pda, expected_bump) = Pubkey::try_find_program_address(
        &[STAKE_SEED, stake.user.as_ref(), &stake.stake_id.to_le_bytes()],
        &crate::id(),
    ).ok_or(error!(HelixError::InvalidPDA))?;
    
    // Verify account is correct PDA
    require_keys_eq!(account_info.key(), expected_pda, HelixError::InvalidPDA);
    
    // Verify bump is canonical
    require_eq!(stake.bump, expected_bump, HelixError::InvalidBumpSeed);
    
    Ok(())
}
```

### Why This Approach

- ✅ Achieves Anchor-equivalent security
- ✅ Works with `remaining_accounts`
- ✅ Reusable across all bulk operations
- ✅ Single source of truth (DRY)

### Why Not Manual Derivation?

❌ Manual PDA derivation with user-provided bump:
```rust
// WRONG: Doesn't validate bump canonicity
let pda = Pubkey::create_program_address(
    &[STAKE_SEED, user.as_ref(), &stake_id.to_le_bytes(), &[stake.bump]],
    &crate::id(),
)?;
```

This allows **seed canonicalization attacks** where multiple bumps might derive to the same address.

✅ Always use `try_find_program_address` which returns the canonical bump.

---

## Pattern 3: Explicit Error Handling

### Rule

**Never** use `unwrap_or()` in production code. Always use explicit `ok_or()` or validation.

### Pattern A: Checked Arithmetic with Explicit Error

```rust
let result = a
    .checked_add(b)
    .ok_or(error!(HelixError::Overflow))?;
```

**Use when:** Result of operation should never overflow in normal conditions.

### Pattern B: Precondition Validation

```rust
// Validate precondition at function start
require!(divisor > 0, HelixError::InvalidDivisor);

// Now safe to use without checks
let result = numerator / divisor;
```

**Use when:** Operation is safe IFF a precondition holds (e.g., `slots_per_day > 0`).

### Pattern C: Graceful Fallback (Rare)

```rust
let value = if input == 0 {
    DEFAULT_VALUE  // Explicit documented fallback
} else {
    input
};
```

**Use when:** Zero/invalid input is expected and has a documented default.

### Examples from Code

#### ✅ Correct: Explicit error in multiply

```rust
let product = a_u128
    .checked_mul(b_u128)
    .ok_or(error!(HelixError::Overflow))?;
```

#### ✅ Correct: Precondition validation for division

```rust
require!(global_state.slots_per_day > 0, HelixError::InvalidSlotsPerDay);
let days = elapsed_slots / global_state.slots_per_day;
```

#### ❌ Wrong: Silent fallback with unwrap_or

```rust
let days = elapsed_slots.checked_div(slots_per_day).unwrap_or(0);
// Problem: If division fails, we silently use 0 (wrong!)
```

---

## Summary

| Scenario | Pattern | Why |
|----------|---------|-----|
| Standard instruction with declared account | Anchor constraint | Declarative, auditable, atomic |
| Bulk operation with remaining_accounts | `validate_stake_pda()` function | Anchor-equivalent, reusable, DRY |
| Arithmetic that might overflow | `checked_op().ok_or(error!(...))` | Explicit failure, no silent bugs |
| Arithmetic safe after precondition | Validate at start, then divide | Efficient, safe, documented |

---

## Audit Notes

### Seed Canonicalization Prevention

This program prevents seed canonicalization attacks by:
1. Using `Pubkey::try_find_program_address` (not `create_program_address`)
2. Validating stored bumps against canonical bumps
3. Failing on mismatch rather than silently skipping

### Error Handling Assurance

All arithmetic operations:
- Use `checked_*` methods (not unchecked)
- Return explicit errors (not silent defaults)
- Validate preconditions before unsafe operations

### Future Instructions

When adding new instructions:
- Use Anchor constraints where possible (standard)
- Use `validate_stake_pda()` for remaining_accounts (bulk)
- Use explicit `ok_or()` for all arithmetic
- Document WHY each pattern is chosen
