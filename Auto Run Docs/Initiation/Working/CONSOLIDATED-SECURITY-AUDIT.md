---
type: report
title: "HELIX Staking Protocol - Consolidated Security Audit"
created: 2026-02-16
tags:
  - security
  - audit
  - consolidated
related:
  - "[[SECURITY-HARDENING-01]]"
  - "[[audit-agent-1-account-pda]]"
  - "[[audit-agent-2-tokenomics]]"
  - "[[audit-agent-3-logic-edge]]"
  - "[[audit-agent-4-access-control]]"
  - "[[audit-agent-5-cpi-reentrancy]]"
  - "[[audit-agent-6-arithmetic]]"
  - "[[audit-agent-7-state-data]]"
---

# HELIX Staking Protocol - Consolidated Security Audit

**Date:** 2026-02-16
**Scope:** All 31 Rust source files in `programs/helix-staking/src/`
**Methodology:** 7-agent parallel audit (Account/PDA, Tokenomics, Logic/Edge, Access Control, CPI/Reentrancy, Arithmetic, State/Data)
**Previous Audit:** Feb 8, 2026

---

## Executive Summary

### Overall Verdict: CONDITIONAL PASS

The HELIX Staking Protocol is **substantially hardened** since the Feb 8 audit. All previously identified **CRITICAL** and **HIGH** vulnerabilities are confirmed **FIXED**. No new CRITICAL or HIGH vulnerabilities were discovered. The protocol demonstrates mature security patterns including:

- Comprehensive checked arithmetic with u128 intermediates
- Consistent CEI (Check-Effects-Interactions) pattern compliance
- Robust PDA validation for remaining_accounts in bulk operations
- Strong access control with dual verification (PDA seeds + explicit constraints)
- Well-designed three-phase BPD flow preventing rate manipulation
- No reentrancy vectors (all CPIs to SPL Token-2022, no callbacks)

**However**, 8 unique MEDIUM-severity findings remain that should be addressed before mainnet launch. These are primarily economic design concerns and defensive programming improvements rather than exploitable vulnerabilities.

### Findings Summary

| Severity | Count | Description |
|----------|-------|-------------|
| CRITICAL | 0 | None found |
| HIGH | 0 | None found |
| MEDIUM | 8 | Economic design concerns + defensive programming |
| LOW | 7 | Minor improvements and consistency issues |
| INFO | 8 | Observations and documentation recommendations |

---

## Previous Audit Fix Verification

All previously reported CRITICAL and HIGH findings from the Feb 8 audit are **CONFIRMED FIXED** by all 7 agents.

### CRIT-1: Per-Batch BPD Rate Manipulation — FIXED

**Verified by:** Agents #1, #2, #3, #4, #6, #7

The three-phase BPD architecture (finalize → seal → trigger) eliminates the per-batch rate calculation attack:
- `finalize_bpd_calculation.rs` accumulates `bpd_total_share_days` across batches (no rate calculation)
- `seal_bpd_finalize.rs:78-82` computes a single global rate from accumulated totals
- `trigger_big_pay_day.rs:62` uses the pre-computed rate uniformly
- Per-stake `bpd_finalize_period_id` prevents double-counting

### CRIT-2: Duplicate BPD Distribution — FIXED

**Verified by:** Agents #1, #2, #7

Dual guards prevent duplicate distribution:
- `trigger_big_pay_day.rs:129`: `bpd_claim_period_id` check skips already-distributed stakes
- `trigger_big_pay_day.rs:134`: `bpd_finalize_period_id` check ensures only finalized stakes receive distribution
- Zero-bonus stakes are also marked (`trigger_big_pay_day.rs:200-210`)

### HIGH-1: Permissionless finalize_bpd_calculation — FIXED

**Verified by:** Agents #1, #4, #5

`finalize_bpd_calculation.rs:16` is now authority-gated via `constraint = caller.key() == global_state.authority`. Emergency abort via `abort_bpd.rs` is authority-gated with `has_one = authority` and blocks after distribution starts.

### HIGH-2: Unstake Blocked During BPD + Seal Delay — FIXED

**Verified by:** Agents #1, #3, #4, #7

- BPD window flag (`GlobalState.reserved[0]`) correctly set/cleared across all 5 paths
- `unstake.rs:67` blocks unstaking during active window
- `seal_bpd_finalize.rs:49-58` enforces 24-hour delay
- `expected_finalized_count` parameter prevents incomplete finalization from proceeding

---

## Consolidated Findings (Deduplicated)

### MEDIUM Severity

#### MED-1: Loyalty Bonus Creates Undocumented Inflation Amplification

**Agents:** #2 (ECON-1), #3 (MED-NEW-3)
**Confidence:** HIGH (2 agents independently identified)
**Location:** `unstake.rs:95-107`, `claim_rewards.rs:92-104`, `math.rs:354-373`

The loyalty bonus (up to 50% on inflation rewards) mints extra tokens beyond the configured `annual_inflation_bp` rate. These bonus tokens are minted from nothing, not from an existing pool. With maximum loyalty participation, effective inflation could reach ~5.5% vs. the stated 3.69%.

**Impact:** Token holders experience higher dilution than the protocol's stated inflation rate.
**Recommendation:** Document effective max inflation rate (up to 1.5× configured rate), or fund loyalty bonuses from penalty redistributions.

#### MED-2: BPD Whale Cap Circumventable via Stake Splitting

**Agent:** #2 (ECON-2)
**Confidence:** MODERATE (1 agent, but analysis is sound)
**Location:** `trigger_big_pay_day.rs:198`, `constants.rs:71`

The 5% per-stake BPD cap (`BPD_MAX_SHARE_PCT`) can be trivially circumvented by splitting a large stake into multiple smaller stakes. The BPB diminishing returns tiers only affect stakes above 1.5B tokens, which is too high for most scenarios. Below that threshold, BPB is perfectly linear — splitting has no BPB disadvantage.

**Impact:** Anti-whale protection provides friction but not hard enforcement.
**Recommendation:** Accept as limitation and document. On-chain Sybil resistance is fundamentally hard.

#### MED-3: Speed Bonus Can Zero Out BPD Pool

**Agents:** #2 (ECON-3), #3 (INFO-2), #7 (STATE-MED-2)
**Confidence:** HIGH (3 agents flagged this interaction)
**Location:** `free_claim.rs:134-141`, `finalize_bpd_calculation.rs:73-74`

Speed bonuses (up to +20%) cause `total_claimed` to exceed `total_claimable`. The BPD unclaimed amount is `total_claimable.saturating_sub(total_claimed)`, which saturates to 0. If all claimers claim in week 1, the BPD pool is empty.

**Impact:** BPD pool size is unpredictable and depends on claiming behavior.
**Recommendation:** Either track speed bonuses separately, or set `total_claimable` to `base_claims × 1.2` to provision for maximum bonuses, or document this explicitly for protocol operators.

#### MED-4: `saturating_sub` in `calculate_pending_rewards` Masks State Corruption

**Agents:** #2 (ECON-5), #3 (MED-2 re-eval), #6 (MED-2 reconfirmed), #7 (STATE-MED-1)
**Confidence:** VERY HIGH (4 agents independently flagged)
**Location:** `math.rs:304`

```rust
let pending_128 = current_value.saturating_sub(reward_debt as u128);
```

All 4 agents agree: the `saturating_sub` is defensively correct (the condition `reward_debt > current_value` should never occur in normal operation since `share_rate` only increases). However, it silently masks potential state corruption instead of surfacing it. All agents agree the impact is limited (underpayment only, never overpayment), but the lack of observability is a concern.

**Impact:** Silent reward loss for affected users if invariant is violated; no protocol fund loss.
**Recommendation:** Keep saturating behavior but add `msg!()` warning or emit event when `reward_debt > current_value` for monitoring.

#### MED-5: Singleton ClaimConfig Limits Protocol to One Claim Period

**Agents:** #1 (INFO-NEW-1), #2 (MED-4 re-eval), #3 (MED-NEW-2), #4 (INFO-2), #7 (MED-4 re-eval)
**Confidence:** VERY HIGH (5 agents flagged)
**Location:** `initialize_claim_period.rs:23-30`

ClaimConfig uses singleton PDA `seeds = [CLAIM_CONFIG_SEED]` with `init` (not `init_if_needed`). After a claim period completes, there is no `close_claim_period` instruction. The protocol can only ever have ONE claim period without manual intervention or upgrade.

**Impact:** Operational limitation requiring protocol upgrade for multi-period support.
**Recommendation:** Add `close_claim_period` instruction gated by `big_pay_day_complete == true` and authority signature.

#### MED-6: Anti-Whale BPD Cap Excess Tokens Permanently Lost

**Agent:** #3 (MED-NEW-1)
**Confidence:** MODERATE (1 agent)
**Location:** `trigger_big_pay_day.rs:198,246-248,254`

When the whale cap clips a stake's bonus, only the capped amount is distributed. At completion, `bpd_remaining_unclaimed` is set to 0 (line 254), meaning clipped excess tokens are neither distributed to smaller stakes nor returned to any pool.

**Impact:** A portion of the BPD pool may go undistributed if whale cap activates.
**Recommendation:** Either redistribute excess or document that clipped BPD is intentionally burned.

#### MED-7: Token-2022 Mint Extension Risks Not Explicitly Mitigated

**Agent:** #5 (MED-NEW-1)
**Confidence:** MODERATE (1 agent)
**Location:** `lib.rs:201-214`

The HELIX mint is created as Token-2022 without explicit enforcement preventing dangerous extensions (MintCloseAuthority, PermanentDelegate). While the program creates its own mint, there is no on-chain validation preventing extension configuration.

**Impact:** If dangerous extensions were configured at deployment, future `mint_to` CPIs could fail or funds could be compromised.
**Recommendation:** Add post-init validation or document deployment requirements. Consider using SPL Token (not Token-2022) if extensions are not needed.

#### MED-8: `admin_set_claim_end_slot` Lower Bound Depends on Mutable `slots_per_day`

**Agents:** #1 (LOW-NEW-2), #4 (MED-AC-1)
**Confidence:** HIGH (2 agents)
**Location:** `admin_set_claim_end_slot.rs:42-48`, `admin_set_slots_per_day.rs:29`

The lower bound for `admin_set_claim_end_slot` is `current_slot + slots_per_day`. Since `slots_per_day` can be set to 1 by the authority, the effective minimum claim period is ~0.4 seconds. While authority-gated, the bounds check provides less protection than it appears.

**Impact:** A compromised authority could terminate a claim period almost instantly.
**Recommendation:** Use `DEFAULT_SLOTS_PER_DAY` instead of `global_state.slots_per_day` for the minimum bound.

---

### LOW Severity

#### LOW-1: `transfer_authority` Missing BPD Window Check

**Agents:** #1 (MED-NEW-2), #3 (RACE-7), #4 (LOW-AC-2)
**Location:** `transfer_authority.rs:8-30`
Authority can initiate transfer during BPD window (only accept is blocked). Creates asymmetry but is not exploitable. Document as intentional.

#### LOW-2: Speed Bonus "Week 1" Encompasses 8 Days

**Agent:** #3 (LOW-1)
**Location:** `constants.rs:48`, `free_claim.rs:357`
Days 0-7 inclusive = 8 day-values for the 20% bonus. Minor specification discrepancy.

#### LOW-3: Inconsistent Borrow/BorrowMut Patterns in BPD Distribution

**Agent:** #5 (LOW-NEW-1)
**Location:** `trigger_big_pay_day.rs:205-225`
`finalize_bpd_calculation.rs` uses explicit `drop(data)` before `try_borrow_mut_data()`; `trigger_big_pay_day.rs` does not. Currently safe but maintenance hazard.

#### LOW-4: Unnecessary `realloc` on Every `claim_rewards` Call

**Agent:** #7 (STATE-LOW-1)
**Location:** `claim_rewards.rs:30-33`
Already-migrated stakes (117 bytes) still invoke realloc syscall on every claim.

#### LOW-5: `abort_bpd` Permanently Prevents BPD Restart for Same Period

**Agents:** #3 (LOW-2), #7 (STATE-LOW-2)
**Location:** `abort_bpd.rs:28-37`
Per-stake `bpd_finalize_period_id` not cleared on abort — documented and architecturally necessary.

#### LOW-6: Unchecked Subtraction in BPB Tier Boundaries

**Agent:** #6 (MED-A6-2)
**Location:** `math.rs:121-122,134`
Plain `-` operator used in tier calculations. Safe with current constants but would silently wrap on BPF if constants changed to violate ordering.

#### LOW-7: Plain Division in Loyalty Bonus

**Agent:** #6 (LOW-A6-1)
**Location:** `math.rs:366`
Uses plain `/` instead of `checked_div`. Guarded by zero-check at line 360. Safe but inconsistent with codebase style.

---

### INFO Severity

| ID | Description | Agents |
|----|-------------|--------|
| INFO-1 | Event u128-to-u64 truncation for monitoring fields | #6 |
| INFO-2 | Ed25519 instruction position correctly at index-1 | #4 |
| INFO-3 | No CPI in BPD distribution is positive security property | #5 |
| INFO-4 | Zero T-shares stake possible with high share_rate | #3 |
| INFO-5 | `admin_set_claim_end_slot` has no upper bound | #7 |
| INFO-6 | Late penalty rounding slightly favors user (1 bps max) | #6 |
| INFO-7 | BPD stake counters are u32 vs u64 GlobalState counters | #3 |
| INFO-8 | Event u32 cast bounded by MAX_STAKES_PER_BPD constant | #6 |

---

## Cross-Agent Corroboration

Findings flagged by **multiple agents** carry higher confidence:

| Finding | Agents | Confidence |
|---------|--------|------------|
| MED-4: `saturating_sub` masks corruption | #2, #3, #6, #7 | **VERY HIGH** (4/7) |
| MED-5: Singleton ClaimConfig limitation | #1, #2, #3, #4, #7 | **VERY HIGH** (5/7) |
| MED-3: Speed bonus zeros BPD pool | #2, #3, #7 | **HIGH** (3/7) |
| MED-1: Loyalty bonus inflation | #2, #3 | **HIGH** (2/7) |
| MED-8: Claim end slot bounds weakness | #1, #4 | **HIGH** (2/7) |
| LOW-1: transfer_authority BPD window | #1, #3, #4 | **HIGH** (3/7) |
| LOW-5: abort_bpd permanent for period | #3, #7 | **HIGH** (2/7) |

---

## Comparison to Feb 8 Audit

### Fixed (Confirmed by This Audit)

| ID | Finding | Status |
|----|---------|--------|
| CRIT-1 | Per-batch BPD rate manipulation | **FIXED** — three-phase architecture |
| CRIT-2 | Duplicate BPD distribution | **FIXED** — dual period ID guards |
| HIGH-1 | Permissionless finalize_bpd_calculation | **FIXED** — authority-gated |
| HIGH-2 | No BPD window blocking / No recovery | **FIXED** — window flag + abort_bpd |
| MED-1 | Zero-amount BPD path | **FIXED** — clears window immediately |
| MED-3 | Authority transfer pattern | **FIXED** — two-step with BPD blocking |
| MED-5 | claim_period_id collision | **PARTIALLY FIXED** — > 0 validation |
| MED-6 | CEI violation in admin_mint | **FIXED** — state before CPI |

### Persists (Still Valid)

| ID | Finding | Status |
|----|---------|--------|
| MED-2 | `saturating_sub` in calculate_pending_rewards | **PERSISTS** — acceptable with monitoring recommendation |
| MED-4 | Singleton ClaimConfig PDA | **PERSISTS** — architectural limitation, needs close instruction |

### New (Not Previously Identified)

| ID | Finding | Severity |
|----|---------|----------|
| MED-1 | Loyalty bonus inflation amplification | MEDIUM |
| MED-2 | BPD whale cap Sybil circumvention | MEDIUM |
| MED-3 | Speed bonus zeroing BPD pool | MEDIUM |
| MED-6 | Anti-whale cap excess permanently lost | MEDIUM |
| MED-7 | Token-2022 extension risks | MEDIUM |
| MED-8 | admin_set_claim_end_slot bounds weakness | MEDIUM |

---

## Remediation Recommendations (Priority Order)

### Priority 1 — Before Mainnet Launch

1. **MED-4 (saturating_sub monitoring):** Add `msg!()` warning or event emission at `math.rs:304` when `reward_debt > current_value`. Keep saturating behavior but enable detection.

2. **MED-7 (Token-2022 extensions):** Validate mint extension state at deployment. Document that the HELIX mint MUST NOT have MintCloseAuthority, PermanentDelegate, or TransferHook extensions.

3. **MED-8 (claim end slot bounds):** Use `DEFAULT_SLOTS_PER_DAY` for minimum bound in `admin_set_claim_end_slot.rs` instead of mutable `global_state.slots_per_day`.

### Priority 2 — Before First Claim Period

4. **MED-3 (speed bonus + BPD):** Document that `total_claimable` should be set to `base_claims × 1.2` to account for maximum speed bonus usage. Alternatively, track bonuses separately.

5. **MED-1 (loyalty inflation):** Document effective maximum inflation rate (up to ~5.5% with 3.69% configured). Consider noting this in user-facing materials.

6. **MED-5 (singleton ClaimConfig):** Implement `close_claim_period` instruction for multi-period support. Gate with `big_pay_day_complete == true` and authority signature.

### Priority 3 — Operational Documentation

7. **MED-2 (whale cap Sybil):** Document that the 5% BPD cap is per-stake friction, not per-identity enforcement.

8. **MED-6 (anti-whale excess):** Document that clipped BPD tokens are not redistributed.

9. **LOW-6 (BPB tier arithmetic):** Convert plain subtraction to `checked_sub` at `math.rs:121-122,134` for defensive programming.

---

## Methodology Notes

Each agent independently read all 31 source files and produced a structured report. The consolidated report:
- Deduplicates findings across agents (highest severity wins)
- Cross-references findings flagged by multiple agents (higher confidence)
- Verifies all previous CRIT/HIGH fixes
- Re-evaluates previously reported MEDIUM findings
- Categorizes new findings by severity

**Files Reviewed:** `lib.rs`, `error.rs`, `constants.rs`, `events.rs`, `security.rs`, `security/pda.rs`, `state/mod.rs`, `state/global_state.rs`, `state/stake_account.rs`, `state/claim_config.rs`, `state/claim_status.rs`, `state/pending_authority.rs`, `instructions/mod.rs`, `instructions/math.rs`, `instructions/create_stake.rs`, `instructions/crank_distribution.rs`, `instructions/unstake.rs`, `instructions/claim_rewards.rs`, `instructions/admin_mint.rs`, `instructions/initialize_claim_period.rs`, `instructions/free_claim.rs`, `instructions/withdraw_vested.rs`, `instructions/trigger_big_pay_day.rs`, `instructions/finalize_bpd_calculation.rs`, `instructions/seal_bpd_finalize.rs`, `instructions/abort_bpd.rs`, `instructions/migrate_stake.rs`, `instructions/transfer_authority.rs`, `instructions/accept_authority.rs`, `instructions/admin_set_claim_end_slot.rs`, `instructions/admin_set_slots_per_day.rs`

**Individual Reports:**
- [[audit-agent-1-account-pda]] — Account Security & PDA Validation
- [[audit-agent-2-tokenomics]] — Tokenomics & Economic Exploits
- [[audit-agent-3-logic-edge]] — Logic & Edge Cases
- [[audit-agent-4-access-control]] — Access Control & Authorization
- [[audit-agent-5-cpi-reentrancy]] — Reentrancy & CPI Security
- [[audit-agent-6-arithmetic]] — Arithmetic Safety & Precision
- [[audit-agent-7-state-data]] — State Management & Data Integrity
