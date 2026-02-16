---
type: reference
title: Shared Security Audit Context Block
created: 2026-02-16
tags:
  - security
  - audit
  - context
related:
  - "[[SECURITY-HARDENING-01]]"
  - "[[CONSOLIDATED-SECURITY-AUDIT]]"
---

# Shared Security Audit Context Block

## Changes Since Feb 8 Audit

The following security fixes and features have been implemented since the last audit (Feb 8, 2026):

### CRITICAL Fixes

- **CRIT-1 FIXED (Zero-Bonus Deadlock)**: `trigger_big_pay_day.rs:200-211` now increments `bpd_stakes_distributed` counter and marks zero-bonus stakes as processed via `bpd_claim_period_id` assignment, preventing permanent desync between distributed/finalized counters that would block unstaking indefinitely.

### HIGH Fixes

- **HIGH-1 FIXED (Emergency Recovery)**: `abort_bpd.rs` — authority-gated emergency abort with idempotent behavior (early return if BPD window already inactive). Resets all BPD state, clears `set_bpd_window_active(false)`, blocks abort after distribution starts (`bpd_stakes_distributed > 0`). Note: per-stake `bpd_finalize_period_id` NOT cleared (architecturally infeasible on Solana).

- **HIGH-2 FIXED (Rate Manipulation Prevention)**: `seal_bpd_finalize.rs` — three-phase BPD flow (finalize → seal → trigger) prevents permissionless rate manipulation. Authority-only seal with `BPD_SEAL_DELAY_SECONDS` (24h observation window), `expected_finalized_count` parameter for completeness verification, and `bpd_original_unclaimed` tracking for consistent whale cap across batches.

### Phase 8.1 Security Enhancements

- **Anti-Whale BPD Cap**: `trigger_big_pay_day.rs` — `BPD_MAX_SHARE_PCT = 5%` caps any single stake's BPD bonus to 5% of the pool, using `bpd_original_unclaimed` (set at seal) for consistent cap across batches.

- **BPB Diminishing Returns**: `math.rs` — Three-tier diminishing returns for Bigger Pays Better bonus: Tier 1 (0→1.5B tokens): Linear 0→1.0x; Tier 2 (1.5B→5B): Linear 1.0x→1.25x; Tier 3 (5B→10B): Linear 1.25x→1.4x; Above 10B: Hard cap at `BPB_MAX_BONUS` (1.5x).

- **Loyalty Bonus**: `math.rs` — `LOYALTY_MAX_BONUS = 0.5x` (50%) bonus on inflation rewards only (NOT principal or BPD), proportional to term served (`days_served / committed_days`). Applied in `unstake.rs` and `claim_rewards.rs`.

- **Admin Bounds Checking**: `admin_set_claim_end_slot.rs` — Floor at `current_slot + 1 day`; `admin_set_slots_per_day.rs` — Floor at 1, ceiling at `10 × DEFAULT_SLOTS_PER_DAY`.

- **Two-Step Authority Transfer**: `transfer_authority.rs` + `accept_authority.rs` + `PendingAuthority` PDA — Current authority proposes, new authority must accept. BPD window blocks acceptance. `init_if_needed` allows overwrite of pending transfer with cancellation event.

- **PDA Validation Module**: `security/pda.rs` — `validate_stake_pda()` provides Anchor-equivalent validation for `remaining_accounts`: ownership check, deserialization, PDA derivation with canonical bump verification. Used in both `trigger_big_pay_day.rs` and `finalize_bpd_calculation.rs`.

- **BPD Transparency Events**: `BpdBatchFinalized` event emitted after each finalize batch with per-batch delta, cumulative totals, and timestamp.

### MEDIUM Fixes

- **MED-1 FIXED (Zero-Amount BPD Path)**: `finalize_bpd_calculation.rs:94-99` — When `unclaimed_amount == 0` on first batch, sets `bpd_calculation_complete = true`, rate to 0, and clears BPD window immediately.

- **MED-5 PARTIAL**: `initialize_claim_period.rs:45` — `claim_period_id > 0` validation prevents collision with `StakeAccount` default `bpd_claim_period_id = 0`. Called "partial" because `total_claimable` parameter still unbounded.

### Other Security Improvements

- **Reward Debt Overflow Protection**: `math.rs:calculate_reward_debt()` — Uses u128 intermediate to prevent overflow during `t_shares × share_rate` multiplication. Returns `RewardDebtOverflow` error if result exceeds u64::MAX.

- **Zero-Amount Mint Prevention**: `claim_rewards.rs:113` and `free_claim.rs:144` — `require!(total_rewards > 0, ClaimAmountZero)` prevents zero-amount CPI to token program.

- **Checked Arithmetic Throughout**: All arithmetic operations use `checked_add/sub/mul/div` with explicit error handling.

### Previous Findings to Re-evaluate

- **MED-2 (saturating_sub in math.rs:304)**: `calculate_pending_rewards` uses `saturating_sub` instead of `checked_sub` when computing `current_value - reward_debt`. Comment says "shouldn't happen but defensive." Could mask state corruption where `reward_debt > current_value`.

- **MED-4 (Singleton ClaimConfig PDA)**: ClaimConfig uses fixed seed `b"claim_config"` creating a singleton. Only one claim period can exist at a time. Previous claim period must be closed before new one. Architectural limitation, not a bug per se.

## Source File Inventory (30 files)

### Core
- `lib.rs` — Program entry point, instruction dispatch, Initialize accounts struct
- `error.rs` — 38 error variants covering all security checks
- `constants.rs` — All protocol constants including Phase 8.1 additions
- `events.rs` — 13 event structs for indexer consumption
- `security.rs` — Module declaration for security utilities
- `security/pda.rs` — `validate_stake_pda()` with canonical bump verification

### State (5 files)
- `state/mod.rs` — Module re-exports
- `state/global_state.rs` — GlobalState (237 bytes), BPD window via `reserved[0]`
- `state/stake_account.rs` — StakeAccount (117 bytes), with OLD_LEN/PHASE3_LEN for migration
- `state/claim_config.rs` — ClaimConfig (200 bytes), BPD lifecycle management
- `state/claim_status.rs` — ClaimStatus (76 bytes), per-user claim tracking
- `state/pending_authority.rs` — PendingAuthority (41 bytes), two-step transfer

### Instructions (19 files)
- `instructions/mod.rs` — Module re-exports
- `instructions/math.rs` — Arithmetic helpers (mul_div, bonuses, penalties, rewards)
- `instructions/create_stake.rs` — Stake creation with burn-and-mint
- `instructions/crank_distribution.rs` — Daily inflation distribution
- `instructions/unstake.rs` — Unstake with penalties + loyalty bonus
- `instructions/claim_rewards.rs` — Reward claiming with loyalty bonus
- `instructions/admin_mint.rs` — Authority-gated minting with cap
- `instructions/initialize_claim_period.rs` — Claim period initialization
- `instructions/free_claim.rs` — Free claim with Ed25519 + Merkle + speed bonus
- `instructions/withdraw_vested.rs` — Vested token withdrawal
- `instructions/trigger_big_pay_day.rs` — BPD distribution (paginated)
- `instructions/finalize_bpd_calculation.rs` — BPD share-days accumulation (paginated)
- `instructions/seal_bpd_finalize.rs` — BPD rate calculation lock (authority-only)
- `instructions/abort_bpd.rs` — Emergency BPD abort (authority-only)
- `instructions/migrate_stake.rs` — Account size migration (realloc)
- `instructions/transfer_authority.rs` — Authority transfer proposal
- `instructions/accept_authority.rs` — Authority transfer acceptance
- `instructions/admin_set_claim_end_slot.rs` — Admin claim period override
- `instructions/admin_set_slots_per_day.rs` — Admin slots-per-day override

## Account Sizes

| Account | Size (bytes) | Notes |
|---------|-------------|-------|
| GlobalState | 237 | 8 disc + 229 fields (incl. reserved[6]) |
| StakeAccount | 117 | Migration from 92 → 113 → 117 |
| ClaimConfig | 200 | Expanded through Phases 3.1, 3.2, 3.3, 8.1 |
| ClaimStatus | 76 | Includes snapshot_wallet (32) |
| PendingAuthority | 41 | New in Phase 8.1 |

## Instruction Access Control Summary

| Instruction | Signer | Access | Notes |
|------------|--------|--------|-------|
| initialize | authority | Permissioned | One-time init |
| create_stake | user | Permissionless | Burns user tokens |
| crank_distribution | cranker | Permissionless | Idempotent per day |
| unstake | user (stake owner) | Permissioned | Blocked during BPD |
| claim_rewards | user (stake owner) | Permissioned | Includes BPD bonus |
| admin_mint | authority | Permissioned | Capped |
| initialize_claim_period | authority | Permissioned | claim_period_id > 0 |
| free_claim | claimer (= snapshot_wallet) | Permissioned | Ed25519 + Merkle |
| withdraw_vested | claimer (= snapshot_wallet) | Permissioned | Linear vesting |
| finalize_bpd_calculation | authority | Permissioned | Paginated, sets BPD window |
| seal_bpd_finalize | authority | Permissioned | 24h delay, count check |
| trigger_big_pay_day | anyone | Permissionless | Rate pre-calculated |
| abort_bpd | authority | Permissioned | Before distribution only |
| migrate_stake | user (stake owner) | Permissioned | Realloc only |
| admin_set_claim_end_slot | authority | Permissioned | Bounded |
| admin_set_slots_per_day | authority | Permissioned | Bounded |
| transfer_authority | authority | Permissioned | Proposes new authority |
| accept_authority | new_authority | Permissioned | Blocked during BPD |
