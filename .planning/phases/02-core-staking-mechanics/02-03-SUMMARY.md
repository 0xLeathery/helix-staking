---
phase: 02-core-staking-mechanics
plan: 03
subsystem: staking
tags: [anchor, solana, token-2022, staking, rewards, penalties]

# Dependency graph
requires:
  - phase: 02-02
    provides: create_stake and crank_distribution instructions establishing stake creation and lazy reward distribution
provides:
  - unstake instruction with early/late penalty enforcement
  - claim_rewards instruction with reward_debt double-claim prevention
  - Complete staking lifecycle (create → crank → claim → unstake)
affects: [02-04, testing, client-integration]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Reentrancy protection via state mutation before CPI"
    - "Reward debt pattern for lazy distribution claims"
    - "Burn-and-mint token flow (penalties burned, rewards minted)"

key-files:
  created:
    - programs/helix-staking/src/instructions/unstake.rs
    - programs/helix-staking/src/instructions/claim_rewards.rs
  modified:
    - programs/helix-staking/src/instructions/mod.rs
    - programs/helix-staking/src/lib.rs

key-decisions:
  - "Unstake automatically claims pending rewards in same transaction (simplifies UX)"
  - "Zero-reward claims rejected with NoRewardsToClaim error (prevents spam)"
  - "Penalties implemented via not minting tokens (burn-and-mint model)"

patterns-established:
  - "State mutation before CPI: is_active=false before mint_to (reentrancy safe)"
  - "Reward debt update before CPI: prevents double-claim attack vector"
  - "Copy values before mutation: avoid borrow checker conflicts"

# Metrics
duration: 4.65min
completed: 2026-02-07
---

# Phase 2 Plan 3: Unstake & Claim Rewards Summary

**Complete staking lifecycle with penalty enforcement (50% early minimum, 14-day grace + linear late decay) and reward_debt-based lazy claim pattern**

## Performance

- **Duration:** 4.65 min
- **Started:** 2026-02-07T11:09:52Z
- **Completed:** 2026-02-07T11:14:28Z
- **Tasks:** 2
- **Files modified:** 4

## Accomplishments
- Unstake instruction enforces early penalty (minimum 50%) and late penalty (14-day grace, linear decay to 100% over 350 days)
- Claim_rewards instruction uses reward_debt pattern to prevent double-claims
- Both instructions use PDA signer for secure mint_to CPI calls
- Reentrancy protection via state mutation before CPI in both instructions
- Complete staking lifecycle now functional (create_stake → crank_distribution → claim_rewards → unstake)

## Task Commits

Each task was committed atomically:

1. **Task 1: Implement unstake instruction with penalty enforcement** - `aae7279` (feat)
2. **Task 2: Implement claim_rewards instruction** - `ae54980` (feat)

## Files Created/Modified
- `programs/helix-staking/src/instructions/unstake.rs` - Unstake with early/late penalties, auto-claims rewards, reentrancy-safe
- `programs/helix-staking/src/instructions/claim_rewards.rs` - Claim rewards without unstaking, reward_debt update before CPI
- `programs/helix-staking/src/instructions/mod.rs` - Export unstake and claim_rewards modules
- `programs/helix-staking/src/lib.rs` - Register unstake and claim_rewards instruction endpoints

## Decisions Made

**1. Unstake auto-claims pending rewards**
- Simplifies UX: users don't need separate claim before unstaking
- Single transaction completes full exit
- Rewards added to return amount in same mint_to CPI

**2. Zero-reward claims rejected**
- Prevents spam/griefing via empty claim transactions
- Error: NoRewardsToClaim when pending_rewards == 0
- Users can check rewards off-chain before attempting claim

**3. Penalties burned via not minting**
- Burn-and-mint model: tokens burned on stake, minted on unstake
- Penalty = amount NOT minted (implicit burn)
- No separate burn instruction needed

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

**1. Borrow checker conflict in unstake.rs**
- **Issue:** Borrowed `stake` immutably, then tried to borrow mutably for `is_active = false`
- **Solution:** Copy needed values from stake before mutation (stake_user, stake_id, staked_amount, etc.)
- **Resolution:** Compiled successfully after refactor
- **Root cause:** Rust borrow checker prevents simultaneous immutable + mutable borrows

## Next Phase Readiness

**Ready for:**
- Phase 02-04: Integration testing of complete staking lifecycle
- Client library development (TypeScript SDK)
- Frontend integration

**Blockers:** None

**Technical foundation complete:**
- All 5 core instructions implemented (initialize, create_stake, crank_distribution, unstake, claim_rewards)
- Penalty math verified via existing unit tests
- Reward_debt pattern prevents double-claims
- Reentrancy protection in place for both CPI instructions

---
*Phase: 02-core-staking-mechanics*
*Completed: 2026-02-07*

## Self-Check: PASSED

All created files exist:
- programs/helix-staking/src/instructions/unstake.rs ✓
- programs/helix-staking/src/instructions/claim_rewards.rs ✓

All commits exist:
- aae7279 ✓
- ae54980 ✓
