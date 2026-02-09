---
color: red
agent_name: Aki
---

# Claim Period Lifecycle

## Authority-gated initialization of a 180-day Merkle claim window with snapshot root and budget

The `initialize_claim_period` instruction creates a singleton `ClaimConfig` PDA that anchors the entire free-claim and BPD pipeline. It is called once by the protocol authority to open a new claim period.

### Instruction: `initialize_claim_period`

**Source:** `programs/helix-staking/src/instructions/initialize_claim_period.rs`

**Parameters:**
| Param | Type | Purpose |
|-------|------|---------|
| `merkle_root` | `[u8; 32]` | Root of the snapshot Merkle tree (immutable after init) |
| `total_claimable` | `u64` | Total HELIX tokens allocated for this period |
| `total_eligible` | `u32` | Number of eligible addresses in the snapshot |
| `claim_period_id` | `u32` | Unique identifier for this period (must be > 0) |

### Account Constraints

- **authority**: Must be `Signer` and match `global_state.authority` (HelixError::Unauthorized)
- **global_state**: PDA derived from `[GLOBAL_STATE_SEED]`, verified by bump
- **claim_config**: `init` with PDA seeds `[CLAIM_CONFIG_SEED]` -- singleton, so only one period can exist at a time

### Key Logic

1. **claim_period_id > 0 enforced** (MED-5 fix): `StakeAccount.bpd_claim_period_id` defaults to 0, so if `claim_period_id == 0`, every stake would appear "already processed" in `trigger_big_pay_day`, silently skipping the entire BPD distribution.

2. **End slot calculation**: `end_slot = current_slot + (180 * global_state.slots_per_day)` with checked arithmetic throughout.

3. **All BPD pagination fields zeroed**: `bpd_remaining_unclaimed`, `bpd_total_share_days`, `bpd_helix_per_share_day`, `bpd_calculation_complete`, `bpd_snapshot_slot`, `bpd_stakes_finalized`, `bpd_stakes_distributed` -- clean slate for the finalize/trigger pipeline.

4. **Immutability**: `claim_period_started = true` is set and never toggled back. The merkle root is baked in at this point.

### ClaimConfig State (184 bytes)

The singleton PDA stores both claim-period metadata and all BPD pagination/distribution state:

```
authority (32) | merkle_root (32) | total_claimable (8) | total_claimed (8)
claim_count (4) | start_slot (8) | end_slot (8) | claim_period_id (4)
claim_period_started (1) | big_pay_day_complete (1) | bpd_total_distributed (8)
total_eligible (4) | bump (1)
--- BPD Phase 3.1-3.3 ---
bpd_remaining_unclaimed (8) | bpd_total_share_days (16) | bpd_helix_per_share_day (16)
bpd_calculation_complete (1) | bpd_snapshot_slot (8) | bpd_stakes_finalized (4)
bpd_stakes_distributed (4)
```

### Notable Gotchas

- **Singleton PDA**: Only one claim period can exist at a time. The `init` constraint means calling this twice will fail because the PDA already exists. A new period requires closing the old ClaimConfig first (not shown in current code).
- **claim_period_id=0 collision**: The MED-5 fix is critical -- without it, the entire BPD phase silently does nothing because every stake's default `bpd_claim_period_id` of 0 matches.
- **slots_per_day is admin-configurable**: The `global_state.slots_per_day` can be changed by `admin_set_slots_per_day`, which affects the calculated `end_slot`. If changed after initialization, the actual wall-clock duration of the claim period shifts.
- **No event replay protection**: The `ClaimPeriodStarted` event is emitted but there is no on-chain guard against re-reading stale events. Indexers must track by `claim_period_id`.

[[free-claim-and-bpd.md]]
