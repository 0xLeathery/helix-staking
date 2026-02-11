# HELIX Staking Protocol — Fresh Review Brief

**Date**: 2026-02-11
**Scope**: Full from-scratch audit of on-chain program, math parity, indexer, and cross-component consistency.
**Codebase snapshot**: 17 instructions, 5 state accounts, 14 events, 157 bankrun tests (14,315 LOC), TS math mirror, 13 indexer event tables.

---

## SECTION A: OPEN FINDINGS (Action Required)

### A-1 [HIGH] Authority transfer events missing from indexer

The program emits three authority-transfer events (`AuthorityTransferInitiated`, `AuthorityTransferCancelled`, `AuthorityTransferCompleted`) defined in [events.rs](programs/helix-staking/src/events.rs). None of these are handled:

- **Indexer types**: [events.ts](services/indexer/src/types/events.ts) — `EVENT_NAMES` array lists 12 events; all three authority events are absent.
- **Processor switch**: [processor.ts](services/indexer/src/worker/processor.ts) — no case for any authority event; they hit the `default` "Unknown event" warn path.
- **DB schema**: [schema.ts](services/indexer/src/db/schema.ts) — no table for authority events.

**Impact**: Authority transfers are invisible to the indexer. If a governance handoff happens in production, there is no off-chain record. The `AuthorityTransferCancelled` event (emitted when an existing pending transfer is overwritten) is especially useful for transparency monitoring.

**Fix**: Add `authorityTransferEvents` table, TS interface, `EVENT_NAMES` entry, and processor case.

---

### A-2 [MEDIUM] `BpdBatchFinalized` event `batch_stakes_processed` reports cumulative total, not per-batch delta

In [finalize_bpd_calculation.rs](programs/helix-staking/src/instructions/finalize_bpd_calculation.rs#L193), the emitted `BpdBatchFinalized.batch_stakes_processed` is set to `claim_config.bpd_stakes_finalized` — which is the **cumulative** count including this batch, not the batch delta. The event struct field is named `batch_stakes_processed` suggesting per-batch semantics, and the companion `total_stakes_finalized` field holds the exact same value:

```rust
let batch_stakes_processed = claim_config.bpd_stakes_finalized; // cumulative!
emit!(BpdBatchFinalized {
    batch_stakes_processed,       // == cumulative
    total_stakes_finalized: claim_config.bpd_stakes_finalized, // also cumulative
    ...
});
```

Both fields will always be identical. Off-chain monitoring tools will get misleading per-batch granularity.

**Fix**: Track a local `batch_count` counter inside the for-loop and use that for `batch_stakes_processed`. Or, snapshot `bpd_stakes_finalized` before the loop and subtract.

---

### A-3 [MEDIUM] `admin_set_claim_end_slot` only allows increases — prevents correcting an erroneously-too-far-future deadline

[admin_set_claim_end_slot.rs](programs/helix-staking/src/instructions/admin_set_claim_end_slot.rs#L42-L45) enforces `new_end_slot > claim_config.end_slot`. This was added as a Phase 8.1 safety measure, but means if an admin accidentally sets `end_slot` to a value years in the future, it cannot be corrected downward. The only path is to let the claim period expire naturally — which could be catastrophically long.

**Risk**: Operational recovery. Consider adding a bounded decrease allowance (e.g., cannot set below `current_slot + 1_day`) or an emergency-only decrease path gated by a different check.

---

### A-4 [MEDIUM] `admin_set_slots_per_day` bounds check prevents devnet usage

[admin_set_slots_per_day.rs](programs/helix-staking/src/instructions/admin_set_slots_per_day.rs#L33-L38) enforces the new value must be within ±10% of `DEFAULT_SLOTS_PER_DAY` (194,400–237,600). This is a mainnet safety net but it **breaks the stated purpose** of the instruction: "Used for devnet/testing to make 'days' pass faster." Setting `slots_per_day = 10` for test acceleration will fail with `AdminBoundsExceeded`.

The Docker localnet tests and devnet validation scripts rely on fast time passage. This bounds check makes the instruction useless in those environments.

**Fix**: Either feature-gate the bounds check (e.g., check only if init_slot is above some mainnet threshold), or accept that devnet always initializes with a low `slots_per_day` value and remove this admin instruction from devnet usage.

---

### A-5 [LOW] `migrate_stake` is a no-op — permissionless rent extraction

[migrate_stake.rs](programs/helix-staking/src/instructions/migrate_stake.rs): The body is `Ok(())`. The `realloc` constraint grows any `StakeAccount` to `LEN = 117` bytes (from possibly `OLD_LEN = 92` or `PHASE3_LEN = 113`). The `realloc::payer = payer` means any signer pays rent for someone else's stake account. However **the instruction does nothing else**.

- There's no state initialization for the new fields — zeroing is handled by `realloc::zero = false`, meaning the new bytes keep whatever was in the old allocation (typically zero, but not guaranteed if the account got reallocated before).
- Any anonymous wallet can call `migrate_stake` on any stake and pay SOL rent that they cannot reclaim.

This is not exploitable but is confusing and wastes SOL if called accidentally. Consider gating it (authority-only) or removing it if all stake accounts have been migrated.

---

### A-6 [LOW] `StakeEnded` event `rewards_claimed` silently drops BPD overflow

In [unstake.rs](programs/helix-staking/src/instructions/unstake.rs#L169-L170):

```rust
rewards_claimed: loyalty_adjusted_rewards.checked_add(bpd_bonus).unwrap_or(loyalty_adjusted_rewards),
```

If `loyalty_adjusted_rewards + bpd_bonus` overflows u64 (extremely unlikely but theoretically possible with huge BPD), the event silently drops the `bpd_bonus` from the reported `rewards_claimed`. The actual minted `total_mint_amount` (calculated 10 lines earlier) uses `checked_add` and would have already errored. So this path is unreachable in practice — but the `unwrap_or` hides a logic inconsistency. Use `.ok_or(HelixError::Overflow)?` for consistency.

---

### A-7 [LOW] `create_stake` burns from user token account without requiring ATA constraint

In [create_stake.rs](programs/helix-staking/src/instructions/create_stake.rs#L39-L43), the `user_token_account` is validated via manual constraints (`mint == global_state.mint`, `owner == user.key()`), not via the Anchor `associated_token::*` derive helper. This is functionally correct but diverges from the pattern used in `unstake`, `claim_rewards`, and `withdraw_vested` which all use the ATA constraint.

**Risk**: A user could pass a non-ATA token account (e.g., a secondary token account). This isn't exploitable (tokens are burned from whatever account they pass) but differs from the protocol's implicit assumption that users interact through ATAs.

---

## SECTION B: CROSS-COMPONENT PARITY VERIFICATION

### B-1 Math Parity (Rust ↔ TypeScript) — PASS

| Function | Rust | TypeScript | Match |
|---|---|---|---|
| `mul_div` | u128 intermediates | BN.mul().div() | ✅ |
| `mul_div_up` | (a*b + c-1)/c | BN .add(c.sub(1)) .div(c) | ✅ |
| `calculate_lpb_bonus` | cap at 2*PRECISION for >=3641d | identical logic | ✅ |
| `calculate_bpb_bonus` | 4-tier with thresholds | identical logic | ✅ |
| `calculate_t_shares` | (amount * multiplier) / share_rate | identical | ✅ |
| `calculate_early_penalty` | min 50% floor, round up | identical | ✅ |
| `calculate_late_penalty` | 14d grace, 351d window, round up | identical | ✅ |
| `calculate_pending_rewards` | saturating sub | BN.max / if-else | ✅ |
| `calculate_loyalty_bonus` | cap at committed_days | identical | ✅ |

### B-2 Constants Parity (Rust ↔ TypeScript) — PASS

All 25 constants verified identical between [constants.rs](programs/helix-staking/src/constants.rs) and [constants.ts](app/web/lib/solana/constants.ts). Program ID matches `declare_id!`.

### B-3 Events ↔ Indexer Schema — PARTIAL (1 gap)

| Event | Indexer Table | Processor Case | Status |
|---|---|---|---|
| ProtocolInitialized | ✅ | ✅ | ✅ |
| StakeCreated | ✅ | ✅ | ✅ |
| StakeEnded | ✅ | ✅ | ✅ |
| RewardsClaimed | ✅ | ✅ | ✅ |
| InflationDistributed | ✅ | ✅ | ✅ |
| AdminMinted | ✅ | ✅ | ✅ |
| ClaimPeriodStarted | ✅ | ✅ | ✅ |
| TokensClaimed | ✅ | ✅ | ✅ |
| VestedTokensWithdrawn | ✅ | ✅ | ✅ |
| ClaimPeriodEnded | ✅ | ✅ | ✅ |
| BigPayDayDistributed | ✅ | ✅ | ✅ |
| BpdAborted | ✅ | ✅ | ✅ |
| BpdBatchFinalized | ✅ | ✅ | ✅ |
| AuthorityTransferInitiated | ❌ | ❌ | **MISSING** |
| AuthorityTransferCancelled | ❌ | ❌ | **MISSING** |
| AuthorityTransferCompleted | ❌ | ❌ | **MISSING** |

---

## SECTION C: ARCHITECTURE NOTES (No Action Required, For Reviewer Context)

### C-1 BPD Lifecycle Correctness

The 5-step BPD lifecycle is internally consistent:

1. **`initialize_claim_period`** → creates `ClaimConfig`, sets `claim_period_id > 0` (MED-5 fix).
2. **`finalize_bpd_calculation`** → authority-gated, batched. First batch snapshots slot/timestamp, activates BPD window. Per-stake `bpd_finalize_period_id` prevents duplicates. Accumulates `bpd_total_share_days`.
3. **`seal_bpd_finalize`** → authority-gated, 24h delay enforced via `bpd_finalize_start_timestamp`. Requires exact `expected_finalized_count` match. Calculates rate. Stores `bpd_original_unclaimed` for whale cap.
4. **`trigger_big_pay_day`** → permissionless, batched. Per-stake `bpd_claim_period_id` prevents double distribution. Counter-based completion (`distributed >= finalized`). Anti-whale cap at 5%.
5. **`abort_bpd`** → authority-gated, idempotent, only before distribution starts. Does NOT clear per-stake flags (documented design decision — cannot restart same period).

**Verified**: BPD window blocks unstake during phases 2–4. Authority transfer blocked during BPD window.

### C-2 Check-Effects-Interactions Pattern

All instructions follow CEI. Verified state mutations before CPI in:
- `create_stake`: counters updated → burn CPI
- `unstake`: `is_active = false`, `bpd_bonus_pending = 0` → mint CPI
- `claim_rewards`: `reward_debt` updated, `bpd_bonus_pending = 0` → mint CPI
- `admin_mint`: `total_admin_minted` updated → mint CPI
- `free_claim`: claim_status + claim_config updated → mint CPI
- `withdraw_vested`: `withdrawn_amount` updated → mint CPI

### C-3 Burn-and-Mint Model Integrity

No token vault or escrow anywhere. `create_stake` burns. `unstake`/`claim_rewards`/`admin_mint`/`free_claim`/`withdraw_vested` all mint. `crank_distribution` does NOT mint — it only updates `share_rate`. Inflation is virtual until claimed/unstaked.

### C-4 PDA Seed Consistency

7 PDA seed types used correctly:
- `global_state` → singleton
- `mint_authority` → singleton signer PDA
- `helix_mint` → singleton token mint
- `stake` + `user` + `stake_id_le_bytes` → per-stake, validated in finalize/trigger via `create_program_address`
- `claim_config` → singleton (init, not init_if_needed — so only one period at a time)
- `claim_status` + `merkle_root[0..8]` + `snapshot_wallet` → per-user-per-period
- `pending_authority` → singleton (`init_if_needed`)

### C-5 Reserved Fields Usage

`GlobalState.reserved[0]` is used as the BPD window flag via `is_bpd_window_active()` / `set_bpd_window_active()`. `reserved[1..5]` remain available for future use.

---

## SECTION D: TEST COVERAGE ASSESSMENT

**157 test cases** across 15 test files in 4 directories:

| Directory | Focus | Tests |
|---|---|---|
| `tests/bankrun/` | Core staking, unstake, crank, claim, init, authority | ~40 |
| `tests/bankrun/phase3/` | Free claim, BPD trigger, migration, vesting, init claim | ~30 |
| `tests/bankrun/phase3.3/` | Security fixes, security hardening | ~20 |
| `tests/bankrun/phase8.1/` | Admin bounds, audit fixes, BPD saturation, abort, claim guard, game theory, multisig | ~60 |
| `tests/bankrun/tests/` | Admin constraints, BPD math | ~7 |

**Coverage gaps to probe**:
1. No dedicated test for `admin_set_claim_end_slot` with the monotonic-increase constraint.
2. No test for authority transfer during BPD window (blocked by constraint, but path should be tested).
3. No test for `migrate_stake` on already-at-LEN accounts (should be a no-op).
4. No negative test for `admin_set_slots_per_day` at boundary values (194,400 and 237,600 exactly).

---

## SECTION E: REVIEW TEAM ASSIGNMENT MATRIX

| Area | What to verify | Priority |
|---|---|---|
| **On-chain: BPD math** | Re-derive BPD rate calculation from scratch. Verify whale cap with saturated pool (all stakes at 5% cap). What happens to the excess? | Critical |
| **On-chain: Penalty rounding** | Verify `mul_div_up` behavior at edge cases (1 token staked, 1 slot before end). Confirm round-up never exceeds 100%. | High |
| **On-chain: `crank_distribution` inflation** | Verify multi-day catch-up math (`days_elapsed > 1`). Confirm same result as daily crank. | High |
| **On-chain: Free claim Ed25519** | Attempt to replay an Ed25519 instruction from a different transaction. Verify the `current_ix_index - 1` check is sufficient. | High |
| **Indexer: Event completeness** | Fix A-1. Run full event round-trip test with all 16 event types. | High |
| **Frontend: Reward estimation** | Feed identical inputs to Rust unit tests and TS functions. Compare outputs for claim, unstake, and penalty at 20+ edge-case scenarios. | Medium |
| **Cross-component: Slot assumptions** | Verify `slots_per_day = 216,000` assumption against current Solana mainnet metrics. Slot times have drifted historically. | Medium |
| **Governance: Admin functions** | Enumerate all authority-gated instructions. Verify multisig is enforced in deployment config. | Medium |

---

## SECTION F: AUTHORITY-GATED INSTRUCTION INVENTORY

For governance review — every instruction that requires `global_state.authority`:

| Instruction | Gating mechanism |
|---|---|
| `initialize` | Initial deployer (no authority check, creates GlobalState) |
| `admin_mint` | `global_state.authority == authority.key()` |
| `initialize_claim_period` | `authority.key() == global_state.authority` |
| `finalize_bpd_calculation` | `caller.key() == global_state.authority` |
| `seal_bpd_finalize` | `authority.key() == global_state.authority` |
| `abort_bpd` | `has_one = authority` on GlobalState |
| `admin_set_claim_end_slot` | `authority.key() == global_state.authority` |
| `admin_set_slots_per_day` | `authority.key() == global_state.authority` |
| `transfer_authority` | `global_state.authority == authority.key()` |
| `accept_authority` | New authority signer + pending PDA match |

Permissionless: `create_stake`, `unstake`, `claim_rewards`, `crank_distribution`, `free_claim`, `trigger_big_pay_day`, `withdraw_vested`, `migrate_stake`.

---

*End of review brief. Teams should treat Section A as the action-item backlog and Section E as the review assignment guide.*
