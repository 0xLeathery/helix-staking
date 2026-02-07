---
phase: 03-free-claim-and-big-pay-day
plan: 05
subsystem: claim-period
tags: [admin, claim-period, merkle-root, initialization]
dependency_graph:
  requires: [claim_config_state, claim_period_started_event]
  provides: [initialize_claim_period_instruction]
  affects: [claim_tokens, big_pay_day]
tech_stack:
  added: []
  patterns: [admin_constraint, pda_singleton, checked_arithmetic]
key_files:
  created:
    - programs/helix-staking/src/instructions/initialize_claim_period.rs
  modified:
    - programs/helix-staking/src/instructions/mod.rs
    - programs/helix-staking/src/lib.rs
decisions:
  - ClaimConfig uses init constraint ensuring singleton PDA (can only be created once)
  - claim_period_started = true immediately after init (merkle_root immutable)
  - Authority stored in ClaimConfig matches caller for future reference
metrics:
  duration: ~1 min
  completed: 2026-02-07T22:47:17Z
---

# Phase 3 Plan 5: Initialize Claim Period Admin Instruction Summary

Admin-only instruction to start the 180-day claim period with immutable merkle root and ClaimPeriodStarted event emission.

## Task Completion

| Task | Name | Commit | Status |
|------|------|--------|--------|
| 1 | Implement initialize_claim_period instruction | 6ee2dcb | Complete |
| 2 | Register instruction in mod.rs and lib.rs | 6ee2dcb | Complete |

## Implementation Details

### Initialize Claim Period Instruction

Created `/programs/helix-staking/src/instructions/initialize_claim_period.rs`:

```rust
#[derive(Accounts)]
pub struct InitializeClaimPeriod<'info> {
    #[account(
        mut,
        constraint = authority.key() == global_state.authority @ HelixError::Unauthorized
    )]
    pub authority: Signer<'info>,

    #[account(
        seeds = [GLOBAL_STATE_SEED],
        bump = global_state.bump,
    )]
    pub global_state: Account<'info, GlobalState>,

    #[account(
        init,
        payer = authority,
        space = ClaimConfig::LEN,
        seeds = [CLAIM_CONFIG_SEED],
        bump,
    )]
    pub claim_config: Account<'info, ClaimConfig>,

    pub system_program: Program<'info, System>,
}
```

**Key features:**
- Authority constraint verifies signer matches GlobalState.authority
- ClaimConfig PDA uses `init` constraint (singleton - can only be created once)
- End slot calculated with checked arithmetic: `start_slot + CLAIM_PERIOD_DAYS * slots_per_day`
- `claim_period_started = true` immediately (merkle_root becomes immutable)
- ClaimPeriodStarted event emitted with all claim details

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| merkle_root | [u8; 32] | Root of the SOL snapshot merkle tree |
| total_claimable | u64 | Total tokens available for claiming |
| total_eligible | u32 | Number of eligible addresses in snapshot |
| claim_period_id | u32 | Period identifier for multi-period support |

### Security Model

1. **Admin-only**: Instruction requires authority to match GlobalState.authority
2. **Singleton PDA**: ClaimConfig can only be created once (init constraint)
3. **Immutable merkle_root**: Once created, merkle_root cannot be changed
4. **Overflow protection**: All arithmetic uses checked_add/checked_mul

## Verification Results

- [x] `cargo check -p helix-staking` passes
- [x] `cargo test -p helix-staking` passes (5 tests)
- [x] `grep "pub fn initialize_claim_period"` confirms function exists
- [x] Authority constraint checks `authority.key() == global_state.authority`
- [x] ClaimConfig uses `init` constraint (PDA singleton)
- [x] `claim_period_started = true` set immediately
- [x] End slot calculated as `start_slot + 180 * slots_per_day`
- [x] ClaimPeriodStarted event emitted with claim_deadline_slot

## Deviations from Plan

None - plan executed exactly as written.

## Files Changed

```
programs/helix-staking/src/instructions/initialize_claim_period.rs (created)
programs/helix-staking/src/instructions/mod.rs (modified)
programs/helix-staking/src/lib.rs (modified)
```

## Self-Check: PASSED

- [x] initialize_claim_period.rs exists
- [x] Commit 6ee2dcb exists
- [x] All verification criteria met
