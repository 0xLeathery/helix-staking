# T01: 24-anchor-program-boost-system 01

**Slice:** S06 — **Milestone:** M001

## Description

Create the foundation for the on-chain boost system: state account definitions, constants, error codes, events, math helpers, admin instructions, and GlobalState extension.

Purpose: All subsequent boost work (registration, staking, claiming) depends on these types, accounts, and admin configuration being in place. This plan establishes every interface contract that Plans 02 and 03 build against.

Output: Compilable Anchor program with BoostRecord PDA, extended StakeAccount, extended GlobalState (reserved [u64; 10]), admin_set_seed_mint and admin_toggle_boost instructions, apply_boost_multiplier math function, and all boost error/event types.

## Must-Haves

- [ ] "Admin can set seed token mint address in GlobalState via admin_set_seed_mint instruction"
- [ ] "Admin can set minimum seed balance threshold in GlobalState via admin_set_seed_mint instruction"
- [ ] "Admin can enable/disable the boost system via admin_toggle_boost instruction"
- [ ] "BoostRecord PDA struct exists with correct seeds and layout"
- [ ] "StakeAccount has seed_balance_at_stake, boost_revoked, and boosted_stake_id fields"
- [ ] "GlobalState reserved slots extended to [u64; 10] with get/set helpers for seed_mint, min_seed_balance, boost_enabled"
- [ ] "apply_boost_multiplier math function produces exactly 10% boost"

## Files

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
