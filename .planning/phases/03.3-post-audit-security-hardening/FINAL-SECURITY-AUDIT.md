# Final Security Audit Report -- Post-Phase 3.3 Hardening

**Date:** 2026-02-08
**Scope:** Full helix-staking Anchor program (all instructions, state, math)
**Auditors:** 7-agent security audit team (Opus model)
**Codebase version:** Post-Phase 3.3 (commit 813079d)
**Previous audit:** Pre-Phase 3.3 audit (commit d44b226) -- 1 CRITICAL, 2 HIGH, 8 MEDIUM
**Verdict:** CONDITIONAL PASS -- 1 NEW CRITICAL found; all prior CRITICALs/HIGHs confirmed fixed

---

## Executive Summary

A 7-agent security audit team independently reviewed the helix-staking program after Phase 3.3 security hardening. Each agent examined the full instruction set from their specialized perspective. The audit confirms that **all 11 findings from the previous audit have been addressed** (9 fixed, 2 accepted/deferred). However, a **new CRITICAL vulnerability** was discovered: the zero-bonus stake deadlock in `trigger_big_pay_day` that can permanently freeze the entire protocol.

**Findings summary (deduplicated across agents):**

| Severity | Count | Status |
|----------|-------|--------|
| CRITICAL | 1 | NEW -- zero-bonus deadlock (must fix before mainnet) |
| HIGH | 2 | NEW -- no recovery mechanism, premature seal risk |
| MEDIUM | 5 | NEW -- architectural/operational concerns |
| LOW | 6 | Noted -- no action required |
| INFO | 8 | Informational |
| CONFIRMED FIXED | 11 | All prior findings verified resolved or accepted |

**Clean areas (verified secure by all relevant agents):**
- CPI safety and reentrancy patterns (Agent #5: 0 findings above LOW)
- PDA derivation correctness across all instructions (Agent #1)
- Arithmetic safety of all core calculations via `mul_div` (Agent #6)
- Account LEN calculations match field layouts (Agent #7)
- Signer/authority requirements on gated instructions (Agent #4)
- CEI (Check-Effects-Interactions) compliance across all instructions (Agent #5)
- Division-by-zero protection on all 10+ division sites (Agent #6)
- Rounding directions consistently favor protocol (Agent #6)
- Borsh serialization/deserialization safety (Agent #7)
- `migrate_stake` realloc::zero behavior is safe for all field types (Agent #4, self-corrected)

---

## CRITICAL Findings

### CRIT-1: Zero-Bonus Stake Deadlock Permanently Freezes Protocol

**Severity:** CRITICAL
**Corroborated by:** Agent #3 (LOGIC-3), Agent #7 (STATE-1) -- independently identified
**Files:**
- `trigger_big_pay_day.rs:184` -- `if bonus == 0 { continue; }` skips without counter increment
- `trigger_big_pay_day.rs:227` -- completion check: `bpd_stakes_distributed >= bpd_stakes_finalized`
- `unstake.rs:62` -- BPD window blocks all unstaking

**Description:**
When `trigger_big_pay_day` processes a finalized stake and computes `bonus = share_days * helix_per_share_day / PRECISION`, integer division can produce `bonus == 0` for small stakes with short durations. When this happens, the code executes `continue` at line 184, skipping the counter increment at line 207 (`bpd_stakes_distributed += 1`).

This creates a permanent desync: `bpd_stakes_distributed` can never reach `bpd_stakes_finalized`. The completion condition at line 227 is never satisfied. The BPD window (stored in `global_state.reserved[0]`) remains active indefinitely, blocking ALL unstaking protocol-wide via the check at `unstake.rs:62`.

**Attack scenario (low cost):**
1. Attacker creates many minimum-amount (0.1 HELIX), minimum-duration (1 day) stakes
2. These stakes are finalized into BPD with tiny share-days values
3. During trigger, `bonus = tiny_share_days * helix_per_share_day / 1e9 = 0`
4. Each zero-bonus stake causes a permanent counter gap
5. Completion never triggers; BPD window stays active forever
6. All stakers are permanently unable to unstake

**Natural occurrence:** Even without an attacker, any legitimate small/short stake that produces `bonus == 0` through normal rounding causes the same deadlock. This is not purely adversarial -- it can happen organically.

**Impact:** Complete, permanent protocol freeze. No staker can ever unstake again. No on-chain recovery path exists.

**Recommended fix:** When `bonus == 0`, still increment `bpd_stakes_distributed` (count the stake as processed even though no tokens are distributed):

```rust
if bonus == 0 {
    claim_config.bpd_stakes_distributed += 1;  // Count as processed
    continue;
}
```

---

## HIGH Findings

### HIGH-1: No Emergency Recovery for Stuck BPD Window

**Severity:** HIGH
**Corroborated by:** Agent #1 (ACCT-4), Agent #2 (ECON-3), Agent #3 (LOGIC-2), Agent #7 (STATE-2) -- 4 of 7 agents
**Files:**
- `global_state.rs` -- `reserved[0]` used as BPD window flag
- `unstake.rs:62` -- blocks unstaking when flag is active
- No instruction exists to clear the flag outside of `trigger_big_pay_day` completion

**Description:**
The BPD window flag in `GlobalState.reserved[0]` blocks all unstaking while BPD processing is active. This flag is set in `finalize_bpd_calculation` and only cleared when `trigger_big_pay_day` reaches the completion condition. There is no authority override, timeout mechanism, or emergency abort instruction.

Multiple scenarios can leave this flag permanently active:
1. **CRIT-1 above** (zero-bonus counter desync)
2. Authority fails to call `seal_bpd_finalize` after finalize completes
3. Network issues prevent trigger batches from being submitted
4. Zero-eligible-stakes path activates BPD window but zero-amount exit doesn't clear it

**Impact:** Without CRIT-1, this is operational risk. Combined with CRIT-1, this creates permanent protocol freeze with no recovery.

**Recommended fix:** Add an authority-gated `abort_bpd` or `emergency_clear_bpd_window` instruction that:
1. Clears the BPD window flag
2. Resets BPD counters
3. Emits an event for audit trail
4. Optionally: add a timeout (e.g., BPD window auto-expires after N slots)

---

### HIGH-2: Authority Can Seal BPD Rate Prematurely

**Severity:** HIGH
**Corroborated by:** Agent #2 (ECON-2), Agent #4 (AUTH-2)
**Files:**
- `seal_bpd_finalize.rs:35-36` -- checks `bpd_calculation_complete` but not finalization coverage
- `finalize_bpd_calculation.rs:67` -- sets BPD window active on first batch

**Description:**
The `seal_bpd_finalize` instruction only checks that `bpd_calculation_complete == true` before locking the rate. A compromised or malicious authority could:
1. Call `finalize_bpd_calculation` with a partial set of stakes
2. Ensure the batch is "last" (fewer than 20 accounts)
3. `bpd_calculation_complete` is set to `true`
4. Call `seal_bpd_finalize` to lock the rate based on incomplete denominator
5. The rate is inflated because `bpd_total_share_days` is too small

While Phase 3.3 moved rate-locking behind authority gate (fixing CRIT-NEW-1), it introduced trust that the authority will finalize ALL stakes before sealing.

**Impact:** Authority can inflate BPD rate by selectively finalizing a subset of stakes. This is a centralization risk -- the authority must be trusted to act honestly.

**Recommended fix (options):**
- **Option A:** Track total eligible stakes (from `global_state` counters) and require `bpd_stakes_finalized` to match expected count before seal
- **Option B:** Accept centralization risk and document authority trust assumptions clearly
- **Option C:** Add a "challenge period" between finalize-complete and seal where anyone can submit missed stakes

---

## MEDIUM Findings

### MED-1: Zero-Amount Early Exit Bypasses Authority Seal

**Severity:** MEDIUM
**Corroborated by:** Agent #1 (ACCT-4), Agent #3 (LOGIC-1)
**File:** `finalize_bpd_calculation.rs:75-78`

**Description:**
When all finalize batches are processed but total BPD amount is zero (no eligible stakes or all have zero share-days), the code sets `bpd_calculation_complete = true` directly without requiring `seal_bpd_finalize`. This is architecturally inconsistent with the three-phase flow (finalize -> seal -> trigger) introduced to fix CRIT-NEW-1.

Additionally, this path activates the BPD window (line 67) but doesn't clear it, leaving unstaking blocked until someone calls `trigger_big_pay_day` (which would handle the zero-rate case and complete).

**Impact:** Architectural inconsistency. The authority loses oversight of the zero-amount case. The BPD window remains active unnecessarily (contributes to HIGH-1).

**Recommended fix:** In the zero-amount path, also clear the BPD window flag and set `bpd_helix_per_share_day = 0`. Or require seal even for zero-amount cases.

---

### MED-2: `saturating_sub` in Pending Rewards Masks State Corruption

**Severity:** MEDIUM
**Corroborated by:** Agent #2 (ECON-8), Agent #6 (ARITH-4)
**File:** `math.rs:243`

**Description:**
`calculate_pending_rewards` uses `current_value.saturating_sub(reward_debt as u128)`. If `reward_debt` ever exceeds `current_value` (which the invariant `share_rate only increases` should prevent), the function silently returns 0 instead of flagging a state inconsistency.

**Impact:** Masks potential accounting bugs. Users would silently receive 0 rewards instead of the system detecting a corrupted state.

**Recommended fix:** Replace with `checked_sub` and a descriptive error, or at minimum log/emit when saturation occurs.

---

### MED-3: No Authority Transfer Mechanism

**Severity:** MEDIUM (persists from previous audit MED-7)
**Corroborated by:** Agent #2 (ECON-3), Agent #4 (AUTH-3)
**File:** `global_state.rs:6`

**Description:**
`GlobalState.authority` is immutable after initialization. No instruction exists to transfer or rotate the authority key. With Phase 3.3 making the authority critical-path for BPD (seal_bpd_finalize), losing the authority key now has more severe consequences than before -- BPD can never be sealed.

**Impact:** Operational risk. Key compromise or loss requires program upgrade.

**Recommended fix:** Two-step authority transfer (propose + accept pattern).

---

### MED-4: Singleton ClaimConfig Lifecycle

**Severity:** MEDIUM
**Corroborated by:** Agent #1 (ACCT-5), Agent #4 (AUTH-7), Agent #7 (STATE-6)
**File:** `initialize_claim_period.rs` -- PDA seeds don't include period ID

**Description:**
`ClaimConfig` uses a fixed PDA seed (`b"claim_config"`), meaning only one claim period can exist at a time. There is no `close_claim_period` instruction to reclaim the account and start a new period. The only way to start a new period would be to use the same account (which would require the PDA to be closeable and re-initializable).

**Impact:** Only one claim period ever. Cannot run multiple claim periods over the lifetime of the protocol without program upgrade.

**Recommended fix:** Either add `close_claim_period` instruction, or include `claim_period_id` in the PDA seed to support multiple periods.

---

### MED-5: No Maximum Cap on `total_claimable`

**Severity:** MEDIUM
**Reported by:** Agent #2 (ECON-7)
**File:** `initialize_claim_period.rs`

**Description:**
The `total_claimable` parameter in `initialize_claim_period` has no upper bound validation. A compromised authority could set an arbitrarily large value, enabling unbounded token distribution through BPD.

**Impact:** Authority trust dependency. If authority is compromised, BPD distribution is unbounded.

**Recommended fix:** Add a maximum cap based on token supply or a configurable limit set during initialization.

---

## LOW Findings

| ID | Description | File | Agent(s) |
|----|-------------|------|----------|
| LOW-1 | Event data clamped from u128 to u64 (indexer data quality) | `trigger_big_pay_day.rs:248-250` | #6 (ARITH-1) |
| LOW-2 | `saturating_sub` for `days_staked` is defensive-correct | `trigger_big_pay_day.rs:144`, `finalize_bpd_calculation.rs:145` | #6 (ARITH-5) |
| LOW-3 | Early penalty `elapsed * BPS_SCALER` uses checked_mul not mul_div (safe due to bounds) | `math.rs:154-158` | #6 (ARITH-2) |
| LOW-4 | LPB bonus multiplication chain safe due to early-return cap | `math.rs:55-59` | #6 (ARITH-3) |
| LOW-5 | Empty trigger batches skip completion check | `trigger_big_pay_day.rs` | #3 (LOGIC-5) |
| LOW-6 | `saturating_sub` in BPD `bpd_remaining_unclaimed` final reset masks rounding dust | `trigger_big_pay_day.rs:229` | #3 (LOGIC-8) |

---

## INFO Findings

| ID | Description | File | Agent(s) |
|----|-------------|------|----------|
| INFO-1 | `days_elapsed as u16` in event safe due to 180-day bound | `free_claim.rs:204` | #6 |
| INFO-2 | `bonus_bps as u16` safe due to known values {0, 1000, 2000} | `free_claim.rs:362` | #6 |
| INFO-3 | `migrate_stake` realloc::zero preserves all fields correctly | `migrate_stake.rs` | #4 (self-corrected) |
| INFO-4 | BPD remainder loss bounded by N base units (negligible) | `trigger_big_pay_day.rs` | #2, #6 |
| INFO-5 | Flash loan attacks unprofitable due to minimum stake duration | -- | #2 |
| INFO-6 | Penalty redistribution is proportional and self-penalizing | `unstake.rs` | #2 |
| INFO-7 | Stake creation during BPD window is asymmetric but non-exploitable | `create_stake.rs` | #2 |
| INFO-8 | `eligible_stakes.len() as u32` safe (bounded by MAX_STAKES_PER_BPD=20) | `trigger_big_pay_day.rs:250` | #6 |

---

## Confirmed Fixed -- Previous Audit Findings

All 11 findings from the pre-Phase 3.3 audit have been verified:

| Previous Finding | Status | Verification |
|-----------------|--------|-------------|
| **CRIT-NEW-1:** Permissionless finalize rate manipulation | **FIXED** | Authority-gated `seal_bpd_finalize` prevents permissionless rate locking. `bpd_finalize_period_id` prevents duplicate counting. Verified by Agents #1, #2, #3, #4, #7. |
| **HIGH-1:** crank_distribution u64 overflow at ~50K tokens | **FIXED** | Uses `mul_div` with u128 intermediates at line 88. Safe for all u64 inputs. Verified by Agent #6 with concrete value traces. |
| **HIGH-2:** Unstake between finalize/trigger token loss | **FIXED** | BPD window in `global_state.reserved[0]` blocks unstaking during BPD processing. Checked at `unstake.rs:62`. Verified by Agents #3, #7. |
| **MED-1:** Unchecked `as u64` truncation in BPD bonus | **FIXED** | Uses `u64::try_from()` with proper error at `trigger_big_pay_day.rs:182`. Verified by Agent #6. |
| **MED-2:** withdraw_vested overflow at ~28K HELIX | **FIXED** | Uses `mul_div` for both immediate and linear portions at lines 133, 160. Verified by Agent #6. |
| **MED-3:** saturating_sub masks over-distribution | **FIXED** | Uses `checked_sub` with `BpdOverDistribution` error at line 221-223. Verified by Agent #6. |
| **MED-4:** Zero-eligible infinite finalize loop | **FIXED** | Sets `bpd_calculation_complete = true` on zero-amount path (but creates MED-1 above -- seal bypass). |
| **MED-5:** claim_period_id=0 collision | **FIXED** | `require!(claim_period_id > 0, HelixError::InvalidClaimPeriodId)` at line 45. Verified by Agent #7. |
| **MED-6:** admin_mint CEI violation | **FIXED** | State update before CPI at line 59. Verified by Agent #5. |
| **MED-7:** No authority transfer | **ACCEPTED** | Deferred to future phase. Risk acknowledged and elevated to MED-3 above since authority is now critical-path. |
| **MED-8:** Old-format stakes excluded from BPD | **FIXED** | New `migrate_stake` instruction allows permissionless migration. Verified by Agents #1, #4. |

**Additional fixes verified (discovered during Phase 3.3 implementation):**
| Fix | Status | Verification |
|-----|--------|-------------|
| ADDL-1: free_claim base_amount overflow | **FIXED** | Uses `mul_div` at line 349. Agent #6. |
| ADDL-2: free_claim immediate_amount overflow | **FIXED** | Uses `mul_div` at line 145. Agent #6. |
| ADDL-3: free_claim bonus_amount overflow | **FIXED** | Uses `mul_div` at line 360. Agent #6. |
| NEW: calculate_reward_debt overflow | **FIXED** | Uses u128 intermediate with `try_from` at math.rs:252-258. Agent #6. |

---

## Arithmetic Safety Posture (Agent #6 Deep Dive)

Agent #6 performed the most exhaustive arithmetic audit to date:

- **22 `as` casts audited:** 20 are safe widening casts or bounded narrowing; 2 are clamped in events (LOW-1)
- **10+ division sites:** All protected against division-by-zero
- **Rounding analysis:** All rounding directions favor the protocol (correct security posture)
- **Dust attack analysis:** Minimum stake amount (0.1 HELIX) prevents exploitation; rounding truncation consistently rounds down
- **BPD accumulated rounding:** Max undistributed = N base units (negligible at 0.0001 HELIX per 10K stakes)
- **Maximum safe values documented** for all major parameters (see Agent #6 full report)

**Overall arithmetic verdict:** Strong. All prior arithmetic vulnerabilities are fixed. Remaining findings are informational or low severity.

---

## Cross-Agent Corroboration Matrix

Findings independently identified by multiple agents carry higher confidence:

| Finding | Agent #1 | #2 | #3 | #4 | #5 | #6 | #7 | Confidence |
|---------|---------|----|----|----|----|----|----|-----------|
| CRIT-1: Zero-bonus deadlock | | | X | | | | X | HIGH (2 agents) |
| HIGH-1: No BPD recovery | X | X | X | | | | X | VERY HIGH (4 agents) |
| HIGH-2: Premature seal | | X | | X | | | | HIGH (2 agents) |
| MED-1: Seal bypass | X | | X | | | | | HIGH (2 agents) |
| MED-2: saturating_sub masks bugs | | X | | | | X | | HIGH (2 agents) |
| MED-3: No authority transfer | | X | | X | | | | HIGH (2 agents) |
| MED-4: Singleton ClaimConfig | X | | | X | | | X | VERY HIGH (3 agents) |
| MED-5: No total_claimable cap | | X | | | | | | MODERATE (1 agent) |

---

## Priority Fix Order

| Priority | Finding | Effort | Reason |
|----------|---------|--------|--------|
| **1** | **CRIT-1: Zero-bonus deadlock** | 1 line | Protocol-freezing bug. Trivial fix: increment counter even when bonus==0. |
| **2** | **HIGH-1: No BPD recovery** | ~50 lines | Add abort_bpd instruction. Without this, CRIT-1 has no fallback. |
| **3** | **HIGH-2: Premature seal** | ~5 lines | Add coverage verification in seal (compare finalized count vs expected). |
| **4** | MED-1: Seal bypass | ~3 lines | Clear BPD window in zero-amount path. |
| **5** | MED-2: saturating_sub | ~2 lines | Replace with checked_sub + error. |
| **6-8** | MED-3, MED-4, MED-5 | Various | Operational/architectural. Not exploitable short-term. |

---

## Overall Verdict

### CONDITIONAL PASS

**The Phase 3.3 hardening successfully resolved all 11 previously identified vulnerabilities.** The three-phase BPD flow (finalize -> seal -> trigger) correctly addresses the original CRIT-NEW-1 rate manipulation attack. All arithmetic overflows have been patched with u128 intermediates. CEI compliance is verified clean. PDA derivation is correct throughout.

**However, one new CRITICAL vulnerability (zero-bonus deadlock) must be fixed before mainnet deployment.** This is a 1-line fix with massive impact -- without it, the protocol can be permanently frozen by anyone creating small stakes. The recommended fix is trivial and safe.

**The two HIGH findings (no recovery mechanism, premature seal) should also be addressed**, though they represent operational/centralization risks rather than immediate exploits. Adding an emergency abort instruction is strongly recommended as a safety net.

**Comparison to previous audit:**
- Previous: 1 CRITICAL, 2 HIGH, 8 MEDIUM = **11 actionable findings**
- Current: 1 CRITICAL, 2 HIGH, 5 MEDIUM = **8 actionable findings** (3 net reduction)
- Previous CRITICALs/HIGHs: All 3 **FIXED**
- New findings are lower-impact overall (operational/centralization vs direct exploit)

**Security trajectory:** Improving. Each audit cycle is finding fewer and lower-severity issues. The codebase's arithmetic safety is now robust, CPI patterns are clean, and the core staking mechanics are sound. The remaining work is hardening edge cases in the BPD lifecycle.

---

## Appendix: Agent Coverage Matrix

| Area | Agent #1 (Account/PDA) | #2 (Tokenomics) | #3 (Logic) | #4 (Access) | #5 (CPI) | #6 (Arithmetic) | #7 (State) |
|------|----------------------|-----------------|------------|------------|----------|-----------------|------------|
| finalize_bpd_calculation | X | X | X | X | | X | X |
| seal_bpd_finalize | X | X | X | X | | | X |
| trigger_big_pay_day | X | X | X | | | X | X |
| crank_distribution | | X | | | | X | |
| unstake | X | X | X | | | | X |
| create_stake | X | | | | | X | |
| claim_rewards | | | | | | X | |
| withdraw_vested | | | | | | X | |
| free_claim | | | | | | X | |
| admin_mint | | | | X | X | | |
| migrate_stake | X | | | X | | | X |
| initialize_claim_period | X | | | X | | | X |
| math.rs helpers | | | | | | X | |
| State structs/LEN | X | | | | | | X |
| CPI safety | | | | | X | | |
| PDA derivation | X | | | | | | |
| Access control | | | | X | | | |
| Event emission | | | | | | X | |
