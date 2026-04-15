# T02: 24-anchor-program-boost-system 02

**Slice:** S06 — **Milestone:** M001

## Description

Implement boost registration (register_seed_boost), boost status update (update_boost_status), and modify create_stake to auto-link boosted stakes with seed balance snapshot.

Purpose: This plan makes boost "real" on-chain -- a user can register, stake with boost, and the seed balance is snapshotted. The update_boost_status instruction enables the Phase 25 crank to revoke boosts.

Output: Two new instructions (register_seed_boost, update_boost_status), modified create_stake with remaining_accounts boost detection, and LiteSVM integration tests covering BOOST-02, BOOST-03, and BOOST-07.

## Must-Haves

- [ ] "A user with seed tokens can call register_seed_boost and a BoostRecord PDA is created with seeds ['boost_record', user]"
- [ ] "register_seed_boost rejects users with no seed ATA or balance below GlobalState.min_seed_balance"
- [ ] "register_seed_boost rejects non-canonical ATA accounts (ATA derivation enforced on-chain)"
- [ ] "register_seed_boost rejects if boost_enabled is false or seed_mint not configured"
- [ ] "create_stake detects an active BoostRecord in remaining_accounts and writes seed_balance_at_stake to StakeAccount"
- [ ] "create_stake links BoostRecord.boosted_stake_id to the new stake_id"
- [ ] "One boosted stake per wallet is enforced by BoostRecord.boosted_stake_id check"
- [ ] "Headroom works: user buys more seed after staking, sells surplus without losing boost"
- [ ] "update_boost_status is permissionless and sets boost_revoked when current balance < snapshot"

## Files

- `programs/helix-staking/src/instructions/register_seed_boost.rs`
- `programs/helix-staking/src/instructions/update_boost_status.rs`
- `programs/helix-staking/src/instructions/create_stake.rs`
- `programs/helix-staking/src/instructions/mod.rs`
- `programs/helix-staking/src/lib.rs`
- `tests/litesvm/utils.ts`
- `tests/litesvm/boost.test.ts`
