# X-Ray Static Analysis Report — Feb 9, 2026

**Tool**: sec3 X-Ray v0.0.6 (`ghcr.io/sec3-product/x-ray:latest`)
**Target**: `programs/helix-staking` (Anchor 0.31, program ID `E9B7BsxdPS89M66CRGGbsCzQ9LkiGv6aNsra3cNBJha7`)
**Attack surfaces scanned**: 18 instructions
**Findings**: 4 (1 actionable, 1 informational, 2 false positives)

---

## Summary

| # | Finding | Type | File | Line | Verdict |
|---|---------|------|------|------|---------|
| XRAY-1 | Malicious simulation detection | MaliciousSimulation | `create_stake.rs` | 121 | False positive |
| XRAY-2 | Integer underflow in `mul_div_up` | IntegerUnderflow | `math.rs` | 27 | False positive |
| XRAY-3 | Unchecked division by `slots_per_day` | IntegerDivOverflow | `free_claim.rs` | 329 | Actionable (LOW) |
| XRAY-4 | Bump seed not validated canonically | BumpSeedNotValidated | `trigger_big_pay_day.rs` | 101 | Informational |

---

## XRAY-1: Malicious Simulation Detection (FALSE POSITIVE)

**File**: `programs/helix-staking/src/instructions/create_stake.rs:121`
**X-Ray class**: MaliciousSimulation

```rust
// Line 109-131
let (bpd_eligible, claim_period_start_slot) = if !ctx.remaining_accounts.is_empty() {
    let claim_config_info = &ctx.remaining_accounts[0];
    let (expected_pda, _) = Pubkey::find_program_address(
        &[CLAIM_CONFIG_SEED],
        ctx.program_id,
    );
    if claim_config_info.key() == expected_pda {
        if let Ok(claim_config) = Account::<ClaimConfig>::try_from(claim_config_info) {
            if claim_config.claim_period_started && clock.slot <= claim_config.end_slot {  // <-- flagged
                (true, claim_config.start_slot)
            } else {
                (false, 0)
            }
        } else { (false, 0) }
    } else { (false, 0) }
} else { (false, 0) };
```

**Analysis**: X-Ray flags any pattern that branches on `clock.slot` as potential simulation detection (where a program behaves differently in preflight vs. real execution to trick wallets). Here, the code is simply checking whether the current slot falls within a valid claim period — standard business logic. The PDA is verified via `find_program_address`, and deserialization uses Anchor's discriminator-checked `Account::try_from`.

**Verdict**: False positive. No action required.

---

## XRAY-2: Integer Underflow in `mul_div_up` (FALSE POSITIVE)

**File**: `programs/helix-staking/src/instructions/math.rs:27`
**X-Ray class**: IntegerUnderflow

```rust
// Lines 22-33
pub fn mul_div_up(a: u64, b: u64, c: u64) -> Result<u64> {
    require!(c > 0, HelixError::DivisionByZero);          // <-- guard
    let numerator = (a as u128)
        .checked_mul(b as u128)
        .ok_or(error!(HelixError::Overflow))?
        .checked_add((c - 1) as u128)                     // <-- flagged
        .ok_or(error!(HelixError::Overflow))?;
    let result = numerator
        .checked_div(c as u128)
        .ok_or(error!(HelixError::Overflow))?;
    u64::try_from(result).map_err(|_| error!(HelixError::Overflow))
}
```

**Analysis**: X-Ray flags `(c - 1)` as a potential underflow. However, the `require!(c > 0, ...)` guard on line 23 ensures `c >= 1`, so `c - 1 >= 0` always holds. X-Ray's data flow analysis does not track the `require!` constraint.

**Verdict**: False positive. No action required.

---

## XRAY-3: Unchecked Division by `slots_per_day` (LOW)

**File**: `programs/helix-staking/src/instructions/free_claim.rs:329`
**X-Ray class**: IntegerDivOverflow

```rust
// Lines 320-330
fn calculate_days_elapsed(
    start_slot: u64,
    current_slot: u64,
    slots_per_day: u64,
) -> Result<u64> {
    let elapsed_slots = current_slot
        .checked_sub(start_slot)
        .ok_or(HelixError::Underflow)?;

    Ok(elapsed_slots / slots_per_day)               // <-- flagged: panics if slots_per_day == 0
}
```

**Analysis**: If `slots_per_day` is zero, this line panics with a division-by-zero. The value originates from `global_state.slots_per_day`, which is:

- Set from `params.slots_per_day` during `initialize` (lib.rs:34) — **no validation** that it is non-zero
- Updatable via `admin_set_slots_per_day` — **validated** with `require!(new_slots_per_day > 0)` (admin_set_slots_per_day.rs:29)

So if the `initialize` call passes `slots_per_day = 0`, this function (and several others using unchecked division by `slots_per_day`) would panic.

**Mitigating factors**:
- `initialize` is admin-only and called once at deployment
- Admin presumably passes a sane value (mainnet default: `216_000`)
- `admin_set_slots_per_day` correctly validates `> 0`
- Other call sites in `math.rs` (lines 201, 272) use `checked_div`

**Recommendation**: Add `require!(params.slots_per_day > 0, HelixError::InvalidParameter)` to `initialize`, and use `checked_div` in `calculate_days_elapsed` for consistency with the rest of the codebase.

**Severity**: LOW — only exploitable by the admin at initialization, but defense-in-depth says validate anyway.

---

## XRAY-4: Bump Seed Not Validated Canonically (INFORMATIONAL)

**File**: `programs/helix-staking/src/instructions/trigger_big_pay_day.rs:101`
**X-Ray class**: BumpSeedNotValidated

```rust
// Lines 100-112
// === SECURITY: Validate PDA derivation ===
let expected_pda = Pubkey::create_program_address(
    &[
        STAKE_SEED,
        stake.user.as_ref(),
        &stake.stake_id.to_le_bytes(),
        &[stake.bump],                          // <-- flagged: uses stored bump
    ],
    &crate::id(),
);
if expected_pda.is_err() || account_info.key() != expected_pda.unwrap() {
    continue;
}
```

**Analysis**: X-Ray flags that the code uses `create_program_address` with a bump from the deserialized `StakeAccount` rather than re-deriving the canonical bump via `find_program_address`. The concern is that a non-canonical bump could produce a different valid PDA, allowing account substitution.

**Mitigating factors**:
- The bump stored in `stake.bump` was originally set by Anchor's `init` constraint, which uses `find_program_address` and stores the canonical bump
- A forged account with a non-canonical bump would need to match the same PDA address — `create_program_address` verifies the key matches regardless of which bump is used
- The PDA key comparison (`account_info.key() != expected_pda.unwrap()`) ensures the account is the correct one
- Re-deriving via `find_program_address` for every remaining account in a batch loop would significantly increase compute cost

**Recommendation**: This is an accepted tradeoff. The stored bump is trusted because it was set during `init` and the PDA key comparison provides integrity. If desired, an additional `require!(stake.bump == canonical_bump)` check could be added, but it would add ~25k CU per stake account in an already compute-heavy batch instruction.

**Severity**: INFORMATIONAL — the pattern is safe given the initialization guarantee.

---

## Attack Surfaces with No Findings (Clean)

The following 18 instruction handlers were scanned with no vulnerabilities detected:

1. `initialize` — clean
2. `create_stake` — only the false positive above
3. `crank_distribution` — clean
4. `unstake` — only the `mul_div_up` false positive in the call chain
5. `claim_rewards` — clean
6. `admin_mint` — clean
7. `initialize_claim_period` — clean
8. `withdraw_vested` — clean
9. `trigger_big_pay_day` — only the informational above
10. `finalize_bpd_calculation` — clean
11. `free_claim` — only the unchecked division above
12. `seal_bpd_finalize` — clean
13. `migrate_stake` — clean
14. `abort_bpd` — clean
15. `admin_set_claim_end_slot` — clean
16. `admin_set_slots_per_day` — clean
17. `transfer_authority` — clean
18. `accept_authority` — clean

---

## How to Re-run

```bash
npm run xray
# or directly:
docker run --rm --volume "$(pwd):/workspace" ghcr.io/sec3-product/x-ray:latest /workspace/programs/helix-staking
```
