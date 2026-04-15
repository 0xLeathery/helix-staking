# S06: Anchor Program Boost System

**Goal:** Create the foundation for the on-chain boost system: state account definitions, constants, error codes, events, math helpers, admin instructions, and GlobalState extension.
**Demo:** Create the foundation for the on-chain boost system: state account definitions, constants, error codes, events, math helpers, admin instructions, and GlobalState extension.

## Must-Haves


## Tasks

- [x] **T01: 24-anchor-program-boost-system 01** `est:8min`
  - Create the foundation for the on-chain boost system: state account definitions, constants, error codes, events, math helpers, admin instructions, and GlobalState extension.

Purpose: All subsequent boost work (registration, staking, claiming) depends on these types, accounts, and admin configuration being in place. This plan establishes every interface contract that Plans 02 and 03 build against.

Output: Compilable Anchor program with BoostRecord PDA, extended StakeAccount, extended GlobalState (reserved [u64; 10]), admin_set_seed_mint and admin_toggle_boost instructions, apply_boost_multiplier math function, and all boost error/event types.
- [x] **T02: 24-anchor-program-boost-system 02** `est:6min`
  - Implement boost registration (register_seed_boost), boost status update (update_boost_status), and modify create_stake to auto-link boosted stakes with seed balance snapshot.

Purpose: This plan makes boost "real" on-chain -- a user can register, stake with boost, and the seed balance is snapshotted. The update_boost_status instruction enables the Phase 25 crank to revoke boosts.

Output: Two new instructions (register_seed_boost, update_boost_status), modified create_stake with remaining_accounts boost detection, and LiteSVM integration tests covering BOOST-02, BOOST-03, and BOOST-07.
- [x] **T03: 24-anchor-program-boost-system 03** `est:22min`
  - Modify claim_rewards to apply the 10% boost multiplier with live seed balance verification, implement permanent revocation on balance drop, and complete all LiteSVM integration tests for BOOST-04 through BOOST-07.

Purpose: This plan makes the boost economically real -- boosted stakers actually receive 10% more tokens when claiming. The live balance check ensures boost cannot be gamed (sell seed tokens -> lose boost permanently). This is the core enforcement mechanism.

Output: Modified claim_rewards instruction with boost check, complete integration test suite proving all 7 BOOST requirements, and the phase is fully testable.

## Files Likely Touched

- `programs/helix-staking/src/constants.rs`
- `programs/helix-staking/src/error.rs`
- `programs/helix-staking/src/events.rs`
- `programs/helix-staking/src/instructions/math.rs`
- `programs/helix-staking/src/state/global_state.rs`
- `programs/helix-staking/src/state/boost_record.rs`
- `programs/helix-staking/src/state/stake_account.rs`
- `programs/helix-staking/src/state/mod.rs`
- `programs/helix-staking/src/security/pda.rs`
- `programs/helix-staking/src/instructions/admin_set_seed_mint.rs`
- `programs/helix-staking/src/instructions/admin_toggle_boost.rs`
- `programs/helix-staking/src/instructions/mod.rs`
- `programs/helix-staking/src/lib.rs`
- `programs/helix-staking/src/instructions/register_seed_boost.rs`
- `programs/helix-staking/src/instructions/update_boost_status.rs`
- `programs/helix-staking/src/instructions/create_stake.rs`
- `programs/helix-staking/src/instructions/mod.rs`
- `programs/helix-staking/src/lib.rs`
- `tests/litesvm/utils.ts`
- `tests/litesvm/boost.test.ts`
- `programs/helix-staking/src/instructions/claim_rewards.rs`
- `tests/litesvm/boost.test.ts`
