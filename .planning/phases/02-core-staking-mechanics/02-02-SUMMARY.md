---
phase: 02-core-staking-mechanics
plan: 02
subsystem: staking-core
tags: [anchor, solana, rust, instructions, token-burn, lazy-distribution, crank]

# Dependency graph
requires:
  - phase: 02-core-staking-mechanics
    plan: 01
    provides: StakeAccount PDA, math module, constants, errors, events
provides:
  - create_stake instruction with T-share calculation and token burning
  - crank_distribution permissionless instruction for daily inflation distribution
  - Complete stake creation flow with LPB/BPB bonuses
  - Lazy reward distribution via share_rate updates
affects: [02-03-unstake-claims, 02-04-integration-tests]

# Tech tracking
tech-stack:
  added:
    - anchor_spl::token_2022::burn for token burning CPI
  patterns:
    - "Burn-and-mint token model: tokens burned on stake creation, minted on unstake/claim"
    - "Lazy reward distribution: crank updates share_rate, no actual minting until claim"
    - "Permissionless crank: any signer can trigger daily distribution"
    - "Zero-shares edge case: crank updates current_day but skips distribution if no active stakes"

key-files:
  created:
    - programs/helix-staking/src/instructions/create_stake.rs
    - programs/helix-staking/src/instructions/crank_distribution.rs
  modified:
    - programs/helix-staking/src/instructions/mod.rs
    - programs/helix-staking/src/lib.rs

key-decisions:
  - "Lazy distribution: crank does NOT mint tokens, only updates share_rate. Actual minting happens on claim/unstake."
  - "No treasury account needed: inflation is accounted for via share_rate increase, tokens minted lazily"
  - "Burn-and-mint model: tokens burned from user on stake creation, minted back on unstake plus rewards"
  - "Permissionless crank: anyone can call distribution, no authority check required"

patterns-established:
  - "StakeAccount PDA seeds: [STAKE_SEED, user.key(), total_stakes_created] for unique per-stake accounts"
  - "Double-distribution guard: require current_day > global_state.current_day"
  - "Checked arithmetic throughout both instructions (no unwrap() calls)"

# Metrics
duration: 3.3min
completed: 2026-02-07
---

# Phase 2 Plan 2: Core Staking Instructions Summary

**create_stake and crank_distribution instructions implementing the complete stake creation flow and daily inflation distribution via lazy share_rate updates**

## Performance

- **Duration:** 3.3 min
- **Started:** 2026-02-07T11:03:23Z
- **Completed:** 2026-02-07T11:06:42Z
- **Tasks:** 2
- **Files modified:** 4

## Accomplishments

- create_stake instruction: burns tokens from user, creates StakeAccount PDA with T-shares calculated from LPB+BPB bonuses
- Validates amount >= min_stake_amount and days in 1-5555 range
- Calculates end_slot with checked arithmetic (start + days * slots_per_day)
- Initializes StakeAccount with all fields: user, stake_id, staked_amount, t_shares, start_slot, end_slot, stake_days, reward_debt, is_active=true, bump
- Updates GlobalState counters: total_stakes_created, total_tokens_staked, total_shares
- Burns tokens using token_2022::burn CPI (burn-and-mint model)
- Emits StakeCreated event with slot, user, stake_id, amount, t_shares, days, share_rate
- crank_distribution instruction: permissionless daily inflation distribution
- Calculates current_day from init_slot and validates no double-distribution
- Handles zero-shares edge case (updates current_day, skips distribution)
- Calculates daily inflation: (supply * annual_inflation_bp / 100_000_000) / 365 * days_elapsed
- Updates share_rate: share_rate += daily_inflation * PRECISION / total_shares
- Emits InflationDistributed event
- No token minting on crank (lazy distribution pattern)

## Task Commits

Each task was committed atomically:

1. **Task 1: Implement create_stake instruction** - `b90f69a` (feat)
   - Created create_stake.rs with complete CreateStake account struct
   - Validates amount and days parameters
   - Calculates T-shares using calculate_t_shares helper
   - Initializes StakeAccount PDA with all required fields
   - Updates GlobalState counters with checked arithmetic
   - Burns tokens from user via token_2022::burn CPI
   - Emits StakeCreated event
   - Added create_stake endpoint to lib.rs

2. **Task 2: Implement crank_distribution instruction** - `7f0217f` (feat)
   - Created crank_distribution.rs with permissionless CrankDistribution account struct
   - Calculates current_day and prevents double-distribution
   - Handles zero-shares edge case
   - Calculates daily inflation from total supply
   - Updates share_rate (lazy distribution, no minting)
   - Emits InflationDistributed event
   - Added crank_distribution endpoint to lib.rs

## Files Created/Modified

**Created:**
- `programs/helix-staking/src/instructions/create_stake.rs` - Stake creation instruction with token burn
- `programs/helix-staking/src/instructions/crank_distribution.rs` - Permissionless daily inflation distribution

**Modified:**
- `programs/helix-staking/src/instructions/mod.rs` - Export create_stake and crank_distribution
- `programs/helix-staking/src/lib.rs` - Add create_stake and crank_distribution endpoints

## Decisions Made

**1. Lazy reward distribution (no treasury account)**
- Rationale: More gas-efficient, simpler account structure, follows Uniswap V2 reward pattern
- Implementation: crank_distribution updates share_rate, does NOT mint tokens
- Impact: Tokens only minted when users claim rewards or unstake. No treasury account needed.

**2. Burn-and-mint token model**
- Rationale: Clearer accounting, tokens truly locked in protocol (destroyed), prevents circulating supply confusion
- Implementation: create_stake burns tokens via token_2022::burn CPI, unstake will mint them back
- Impact: Total supply decreases on stake, increases on unstake. Matches HEX behavior.

**3. Permissionless crank**
- Rationale: Decentralization, anyone can trigger distribution (incentive via potential future crank rewards)
- Implementation: cranker is any Signer, no authority check
- Impact: Protocol continues even if team stops cranking. Community can keep it running.

**4. StakeAccount PDA seeds include total_stakes_created**
- Rationale: Allows users to have multiple concurrent stakes, each with unique PDA
- Implementation: seeds = [STAKE_SEED, user.key(), total_stakes_created]
- Impact: Users can create multiple stakes with different durations/amounts for portfolio strategies.

## Deviations from Plan

None - plan executed exactly as written. Both instructions implemented with all required functionality, validation, and events.

## Issues Encountered

None - all tasks completed as specified. Build succeeded, IDL generated correctly, all verifications passed.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

**Ready for Phase 2 Plan 3 (Unstake and Claim Instructions):**
- create_stake creates StakeAccount PDAs with all required fields
- crank_distribution updates share_rate for reward calculations
- StakeAccount tracks reward_debt for lazy distribution
- GlobalState counters track total_stakes_created for PDA derivation
- Token burn CPI pattern established (unstake will use mint CPI)

**Ready for Phase 2 Plan 4 (Integration Tests):**
- Both instructions compile and appear in IDL
- create_stake accepts amount + days params
- crank_distribution accepts no params (permissionless)
- Events emitted for indexing (StakeCreated, InflationDistributed)

**No blockers.** Core staking instructions complete and ready for testing.

## Self-Check: PASSED

All created files exist:
- ✓ programs/helix-staking/src/instructions/create_stake.rs
- ✓ programs/helix-staking/src/instructions/crank_distribution.rs

All commits exist:
- ✓ b90f69a (Task 1)
- ✓ 7f0217f (Task 2)

---
*Phase: 02-core-staking-mechanics*
*Completed: 2026-02-07*
