# SolHEX - Context Handoff

## What We're Building

A HEX-style staking/CD (Certificate of Deposit) contract on Solana using Anchor. HEX on Ethereum is a time-locked staking system where users lock tokens for 1-5555 days and earn rewards proportional to their stake size and duration.

## Core Mechanics Designed

### Token
- SPL Token via Token-2022 (8 decimals, PDA mint authority)
- Metadata extension for on-chain token info

### Staking Program (Anchor)
- **Instructions**: initialize, mint_tokens, stake_start, stake_end
- **Accounts**:
  - `GlobalState` PDA (seeds: `[b"global_state"]`) - total supply, total staked, total T-shares, share rate, current day, launch time, stake count, daily payout pool
  - `StakeAccount` PDA (seeds: `[b"stake", user_pubkey, stake_count_le_bytes]`) - per-user-per-stake
  - `DailyData` PDA - snapshots for reward distribution
  - Token vault PDA (seeds: `[b"vault"]`)
  - Mint PDA (seeds: `[b"hex_mint"]`)

### T-Share Bonus Curves
- **Longer Pays Better (LPB)**: Linear 0-2x bonus over 3641 days
- **Bigger Pays Better (BPB)**: Linear 0-1x bonus up to 150M token threshold
- Combined max theoretical: 3x multiplier

### Penalty System
- **Early unstake**: Proportional to time NOT served, minimum 50% penalty
- **Late unstake**: 14-day grace period, then linear 0-100% penalty over 350 days, total loss after day 365

### Constants
- MIN_STAKE_DAYS: 1
- MAX_STAKE_DAYS: 5555
- HEARTS_PER_HEX: 100_000_000 (8 decimals)
- BIGGER_THRESHOLD: 150M tokens
- LATE_PENALTY_GRACE_DAYS: 14

## Full Code Written

Complete Anchor program code was provided including:
1. `constants.rs` - All protocol constants
2. `state.rs` - GlobalState, StakeAccount, DailyData account structs
3. `errors.rs` - Custom error types
4. `lib.rs` - Full program with initialize, mint_tokens, stake_start, stake_end instructions
5. TypeScript client usage examples
6. Bonus calculation math (LPB + BPB)
7. Penalty calculation (early + late curves)

## NOT Yet Implemented (Discussed as Next Steps)
1. Daily distribution crank (permissionless daily snapshot + reward distribution)
2. Claim rewards without ending stake
3. Share rate increase over time
4. Referral bonuses
5. Big Pay Day (BPD) event
6. Inflation schedule (3.69% annual)

## Tech Stack
- Anchor (Rust) for Solana program
- Token-2022 for SPL token
- Bankrun for testing
- @solana/web3.js v1 (required for Anchor compatibility)
- TypeScript client with @coral-xyz/anchor

## User Intent
User wants to initialize this as a proper project with /gsd:new-project workflow.

---
*Saved: 2026-02-07*
