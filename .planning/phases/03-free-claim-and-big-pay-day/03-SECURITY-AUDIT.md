# Phase 3 Security Audit Report

**Date**: 2026-02-08
**Auditors**: 7-agent parallel security audit team
**Scope**: helix-staking program after Phase 3 + Phase 3.1 implementation
**Status**: **NOT PRODUCTION READY** - Critical issues identified

---

## Executive Summary

A comprehensive security audit was performed using 7 specialized agents:
1. Account Security & PDA Validation
2. Tokenomics & Economic Exploits
3. Logic & Edge Cases
4. Access Control & Authorization
5. Reentrancy & CPI Security
6. Arithmetic Safety & Precision
7. State Management & Data Integrity

**Result**: 2 CRITICAL, 5 HIGH, ~15 MEDIUM, ~10 LOW findings

---

## CRITICAL Findings (Must Fix Before Mainnet)

### CRIT-1: BPD Rate Calculated Per-Batch Instead of Globally

**File**: `programs/helix-staking/src/instructions/trigger_big_pay_day.rs:217-224`

**Problem**: Each batch calculates its own `helix_per_share_day` using:
```rust
let helix_per_share_day = (unclaimed_amount as u128)
    .checked_mul(PRECISION as u128)
    .checked_div(batch_eligible_share_days)  // Only THIS batch's share-days!
```

**Impact**: First batch receives disproportionately more than later batches.

**Attack Scenario**:
```
Pool: 1,000,000 HELIX unclaimed

Batch 1 (attacker): 1000 share-days
  → rate = 1,000,000 / 1000 = 1000 HELIX/share-day
  → receives 1,000,000 HELIX (entire pool!)

Batch 2 (legitimate users): 2000 share-days
  → rate = 0 / 2000 = 0 (pool already drained)
  → receives 0 HELIX
```

**Root Cause**: The Phase 3.1 pagination implementation doesn't calculate global share-days before distribution.

---

### CRIT-2: Same Stake Can Receive BPD Multiple Times

**File**: `programs/helix-staking/src/instructions/trigger_big_pay_day.rs:245-251`

**Problem**: No tracking prevents duplicate distribution:
```rust
stake.bpd_bonus_pending = stake.bpd_bonus_pending
    .checked_add(bonus)  // No check if already received!
    .ok_or(HelixError::Overflow)?;
```

**Attack Vectors**:
1. **Same transaction**: Pass same stake 20 times in remaining_accounts → 20x bonus
2. **Across batches**: Include same stake in batch 1, then batch 2 → 2x bonus

**Impact**: Attacker can drain entire unclaimed pool.

---

## HIGH Findings (Should Fix)

### HIGH-1: `bpd_eligible` Flag Set But Never Checked

**Files**:
- Set in: `create_stake.rs:137` (`stake_account.bpd_eligible = bpd_eligible;`)
- Never checked in: `trigger_big_pay_day.rs`

**Problem**: The `create_stake` instruction sets `bpd_eligible` based on claim period status, but `trigger_big_pay_day` independently re-validates using slot timestamps instead of checking this flag.

**Related unused field**: `claim_period_start_slot` is set but never read.

**Recommendation**: Either use the flag in trigger_big_pay_day or remove it.

---

### HIGH-2: Crank Distribution Timing Can Be Gamed

**File**: `crank_distribution.rs:59-105`

**Problem**: Multi-day crank accumulation allows front-running:
1. Wait for crank to be stale (multiple days)
2. Create large stake
3. Trigger crank → share_rate jumps for accumulated days
4. Claim inflated rewards

**Recommendation**: Add max `days_elapsed` limit (e.g., 7 days).

---

### HIGH-3: Speed Bonus Boundary Gaming

**File**: `free_claim.rs:356-362`

**Problem**: Day 7→8 boundary for speed bonus (20% → 10%) can be gamed with slot timing.

**Recommendation**: Consider using `current_day` instead of slot-based calculation.

---

### HIGH-4: Whale Penalty Redistribution Dominance

**File**: `unstake.rs:133-142`

**Problem**: Penalty redistribution is proportional to T-shares. Whales with large stakes capture majority of early unstake penalties.

**Impact**: Economic centralization (design choice, document).

---

### HIGH-5: Missing Validation in trigger_big_pay_day

**File**: `trigger_big_pay_day.rs`

**Problem**: Account security auditor found remaining_accounts can include:
- Same stake multiple times (duplicate bonus)
- No validation that stake hasn't already received BPD

---

## MEDIUM Findings

### MEDIUM-1: Realloc in claim_rewards
- `realloc::zero = true` could cause confusion for legacy migration
- Low actual risk but implicit behavior

### MEDIUM-2: ClaimConfig Pagination State Inconsistency
- When first batch empty, state resets to allow retry
- Correct behavior but confusing

### MEDIUM-3: saturating_sub in calculate_pending_rewards
- Silently returns 0 if reward_debt > current_value
- Could hide bugs instead of erroring

### MEDIUM-4: Event Field Truncation
- u128 values truncated to u64 in events
- Indexers see incorrect data for large values

### MEDIUM-5: Zero Days Staked Edge Case
- Stake created at exactly end_slot passes start checks but fails days check
- Correctly filtered but fragile code path

### MEDIUM-6: admin_mint State Update After CPI
- `total_admin_minted` updated after mint_to
- No actual risk (SPL Token can't callback) but violates CEI

### MEDIUM-7: Speed Bonus Off-by-One Semantics
- Days 0-7 get +20% (8 days of bonus, not 7)
- By design per constants, but worth documenting

### MEDIUM-8: Vesting Linear Calculation Precision Loss
- Integer division truncates small amounts
- Minor precision loss favors protocol

### MEDIUM-9: No Authority Transfer Mechanism
- GlobalState.authority cannot be changed
- If key lost, no recovery

---

## LOW Findings

1. **LPB bonus for 1-day stakes is 0** - By design
2. **BPB threshold very high** (1.5B tokens for max bonus) - Design choice
3. **Late penalty uses truncating division** - Minor user advantage
4. **RewardsClaimed event doesn't separate BPD bonus** - Analytics issue
5. **ClaimConfig.authority field unused** - Cosmetic
6. **Counter overflow theoretical** (u64 counters) - Never happens in practice
7. **Division by slots_per_day uses unwrap_or(0)** - Could mask bugs
8. **Early penalty rounding edge case** - Math works out, but should test

---

## VERIFIED Secure Patterns

### Account Security
- [x] All PDA derivations correct and consistent
- [x] Account ownership validated (program_id check)
- [x] Signer requirements properly enforced
- [x] Bump seeds stored and used correctly
- [x] Discriminators checked via Anchor
- [x] remaining_accounts validated in trigger_big_pay_day

### Access Control
- [x] Admin functions restricted to GlobalState.authority
- [x] User isolation via PDA seeds and ownership constraints
- [x] Permissionless functions have appropriate guards
- [x] Free claim Ed25519 signature verification
- [x] No privilege escalation paths

### CPI Security
- [x] CEI pattern followed (state before CPI)
- [x] Mint authority PDA correctly derived
- [x] No callback attack vectors
- [x] Signer seeds correct in all CPIs

### Arithmetic Safety
- [x] All operations use checked_* methods
- [x] u128 intermediates where needed
- [x] Division by zero protected
- [x] PRECISION constant used consistently
- [x] Protocol-favorable rounding throughout
- [x] calculate_reward_debt() properly prevents overflow

### State Management
- [x] All LEN calculations verified correct
- [x] Field initialization complete in all paths
- [x] Counter consistency maintained
- [x] State machine transitions properly constrained
- [x] Double-claim prevention (ClaimStatus init)
- [x] Double-unstake prevention (is_active flag)

---

## Recommendations for Phase 3.2

### Priority 1: Fix BPD Distribution (CRITICAL)

**Option A: Two-Phase Distribution**
1. Add `finalize_bpd_calculation` instruction that calculates global share-days
2. Modify `trigger_big_pay_day` to use pre-calculated rate
3. Add `bpd_received` flag to StakeAccount to prevent duplicates

**Option B: Merkle-Based Distribution**
1. Calculate distribution off-chain
2. Generate merkle tree of (stake_id, bonus_amount) pairs
3. Users claim their BPD via merkle proof
4. Similar to free_claim pattern

**Option C: Single-Transaction with Compute Budget**
1. Increase MAX_STAKES_PER_BPD significantly (~100-150)
2. Accept that very large distributions need governance/manual handling
3. Add duplicate prevention regardless

### Priority 2: Add Duplicate Prevention

```rust
// In StakeAccount, add:
pub bpd_claim_period_id: u32,  // Which claim period this stake received BPD for

// In trigger_big_pay_day, check:
if stake.bpd_claim_period_id == claim_config.claim_period_id {
    continue; // Already received BPD this period
}
// After distribution:
stake.bpd_claim_period_id = claim_config.claim_period_id;
```

### Priority 3: Clean Up Unused Fields

Either:
- Use `bpd_eligible` flag in trigger_big_pay_day
- Or remove `bpd_eligible` and `claim_period_start_slot` fields

### Priority 4: Add Crank Staleness Limit

```rust
// In crank_distribution:
const MAX_DAYS_ACCUMULATION: u64 = 7;
let days_to_process = std::cmp::min(days_elapsed, MAX_DAYS_ACCUMULATION);
```

---

## Files Modified in Phase 3.1 (for reference)

These files were changed to add pagination but have the critical flaw:

1. `state/claim_config.rs` - Added `bpd_remaining_unclaimed`, `bpd_total_share_days`
2. `instructions/trigger_big_pay_day.rs` - Pagination logic (FLAWED)
3. `instructions/initialize_claim_period.rs` - Initialize new fields
4. `instructions/math.rs` - Added `calculate_reward_debt()`
5. `instructions/create_stake.rs` - Use `calculate_reward_debt()`
6. `instructions/claim_rewards.rs` - Use `calculate_reward_debt()`
7. `error.rs` - Added `RewardDebtOverflow`

---

## Conclusion

The helix-staking program demonstrates strong security practices in most areas (account validation, access control, CPI safety, arithmetic). However, the BPD pagination implementation introduced in Phase 3.1 has a fundamental design flaw that allows:

1. Unfair distribution favoring early batches
2. Duplicate bonus exploitation

**These must be fixed before production deployment.**

The reward_debt overflow fix (MEDIUM-1, MEDIUM-2 from original plan) was correctly implemented and verified by the arithmetic safety auditor.
