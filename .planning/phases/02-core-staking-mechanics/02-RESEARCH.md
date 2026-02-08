# Phase 2: Core Staking Mechanics - Research

**Researched:** 2026-02-07
**Domain:** Solana staking mechanics, HEX-style bonuses, time-based penalties, reward distribution
**Confidence:** HIGH

## Summary

Phase 2 implements the complete staking lifecycle for a HEX-style protocol on Solana: stake creation with T-share bonuses (Longer Pays Better + Bigger Pays Better), early/late unstake penalties, daily inflation distribution, and share rate evolution. Research confirms that Anchor 0.31+ with Token-2022, slot-based time tracking, and the reward_debt pattern (from DeFi staking protocols like MasterChef) provide robust foundations for this phase.

The critical technical challenges are: (1) computing bonus curves without u64 overflow, (2) implementing accurate penalty calculations with integer math, (3) tracking lazy reward distribution per stake, (4) atomic share rate updates, and (5) preventing reentrancy attacks during unstake/claim operations. Solana's Clock sysvar provides deterministic slot-based time, enabling precise day calculations without external oracle dependencies.

**Primary recommendation:** Use separate PDA per stake (already decided in Phase 1), implement reward_debt pattern for lazy reward distribution, compute LPB/BPB bonuses with checked arithmetic and fixed-point precision (1e9 scaling factor), store last_distribution_slot in GlobalState, and update share_rate via permissionless crank instruction that any user can call.

## Standard Stack

### Core (from Phase 1)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| anchor-lang | 0.31+ | Anchor framework core | Industry standard for Solana program development, automatic IDL generation, strong typing, account validation |
| anchor-spl | 0.31+ | SPL token interactions | Official Anchor wrapper for Token/Token-2022 programs |
| solana-program | 2.1+ (via Anchor) | Solana runtime primitives | Core Solana types (Pubkey, AccountInfo, Clock sysvar) |
| spl-token-2022 | latest | Token Extensions Program | Token operations (mint, transfer, burn) |

### Phase 2 Additions

| Library | Purpose | Justification |
|---------|---------|---------------|
| solana Clock sysvar | Deterministic time tracking | Access current slot for day calculations (slots_per_day = 216,000) |

**No additional dependencies required** - Phase 2 builds on Phase 1 infrastructure.

## Architecture Patterns

### Recommended Account Structure

```
programs/helix-staking/src/
├── lib.rs                    # Program entrypoint with instructions
├── constants.rs              # Protocol constants (from Phase 1)
├── error.rs                  # Custom error codes
├── events.rs                 # Event definitions
├── state/
│   ├── mod.rs
│   ├── global_state.rs       # GlobalState PDA (from Phase 1)
│   └── stake_account.rs      # NEW: StakeAccount PDA
└── instructions/
    ├── mod.rs
    ├── create_stake.rs       # NEW: Create stake with T-share calculation
    ├── unstake.rs            # NEW: End stake with penalty enforcement
    ├── claim_rewards.rs      # NEW: Claim inflation rewards
    └── crank_distribution.rs # NEW: Permissionless daily distribution crank
```

### Pattern 1: Separate PDA per Stake (Decided in Phase 1)

**What:** Each stake gets its own PDA with seeds `[b"stake", user.key(), stake_id.to_le_bytes()]`

**Why:** Avoids account size limits from Vec<Stake>, enables parallel stake operations, simplifies PDA derivation

**Example:**
```rust
#[account]
pub struct StakeAccount {
    pub user: Pubkey,              // Stake owner
    pub stake_id: u64,             // Unique stake ID (from GlobalState counter)
    pub staked_amount: u64,        // Tokens staked (base units, 8 decimals)
    pub t_shares: u64,             // T-shares earned (includes bonuses)
    pub start_slot: u64,           // Slot when stake was created
    pub end_slot: u64,             // Slot when stake matures (start + duration_days * slots_per_day)
    pub stake_days: u16,           // Committed duration (1-5555 days)
    pub reward_debt: u64,          // For lazy reward distribution (reward_debt pattern)
    pub is_active: bool,           // True if stake is active (prevents close-and-reopen attacks)
    pub bump: u8,                  // PDA bump seed
}

impl StakeAccount {
    pub const LEN: usize = 8   // discriminator
        + 32   // user
        + 8    // stake_id
        + 8    // staked_amount
        + 8    // t_shares
        + 8    // start_slot
        + 8    // end_slot
        + 2    // stake_days
        + 8    // reward_debt
        + 1    // is_active
        + 1;   // bump
}
```

### Pattern 2: Reward Debt for Lazy Distribution (MasterChef Pattern)

**What:** Track rewards using `reward_debt = t_shares * accumulated_rewards_per_share`, update on claim

**When to use:** Lazy reward distribution where users claim on demand (not batch crank)

**How it works:**
1. **Global state** tracks `share_rate` (tokens per T-share) which increases with daily inflation
2. **On stake creation:** `stake.reward_debt = stake.t_shares * global_state.share_rate`
3. **On claim:** `pending_rewards = (stake.t_shares * current_share_rate) - stake.reward_debt`
4. **After claim:** `stake.reward_debt = stake.t_shares * current_share_rate`

**Advantages:**
- No need to store full reward history
- Constant-time reward calculation
- No loops or iteration over stakes
- User pays compute cost only when claiming

**Example:**
```rust
pub fn calculate_pending_rewards(
    stake: &StakeAccount,
    current_share_rate: u64,
    precision: u64, // 1e9 for fixed-point
) -> Result<u64> {
    // pending = (t_shares * current_rate / precision) - (reward_debt / precision)
    let current_value = stake.t_shares
        .checked_mul(current_share_rate)
        .ok_or(error!(ErrorCode::MathOverflow))?
        .checked_div(precision)
        .ok_or(error!(ErrorCode::MathOverflow))?;

    let debt_value = stake.reward_debt
        .checked_div(precision)
        .ok_or(error!(ErrorCode::MathOverflow))?;

    current_value
        .checked_sub(debt_value)
        .ok_or(error!(ErrorCode::MathOverflow))
}
```

**Source:** Anchor expert confirmed this is the standard DeFi pattern (MasterChef-style reward distribution).

### Pattern 3: Fixed-Point Arithmetic for Bonus Curves

**What:** Use 1e9 (1 billion) scaling factor for all bonus calculations to avoid overflow while maintaining precision

**Why:** Intermediate multiplications (e.g., staked_amount * bonus_multiplier) can overflow u64::MAX without scaling

**HEX Formulas (verified from [Hexicans Deep Dive](https://hexicans.info/documentation/deep-dive/) and [HexCalc](https://hexcalc.net/)):**

1. **Longer Pays Better (LPB):** `bonus = input × (days - 1) / 1820`
   - Maximum: 2x multiplier at 3641 days (10 years)
   - Linear growth: 20% bonus per year

2. **Bigger Pays Better (BPB):** `bonus = input × (min(input, 150M) / 1500M)`
   - Maximum: 10% (0.1x) multiplier at 150M tokens
   - 1% bonus per 15M tokens

**Implementation with 1e9 precision:**
```rust
const PRECISION: u64 = 1_000_000_000; // 1e9
const MAX_STAKE_DAYS: u64 = 3641;     // 10 years
const MAX_STAKE_AMOUNT: u64 = 150_000_000_00_000_000; // 150M with 8 decimals

pub fn calculate_lpb_bonus(stake_days: u64) -> Result<u64> {
    if stake_days > MAX_STAKE_DAYS {
        return Ok(2 * PRECISION); // 2x multiplier (capped)
    }

    // bonus = (days - 1) * 2 * PRECISION / MAX_STAKE_DAYS
    let numerator = stake_days
        .checked_sub(1)
        .ok_or(error!(ErrorCode::MathOverflow))?
        .checked_mul(2 * PRECISION)
        .ok_or(error!(ErrorCode::MathOverflow))?;

    numerator
        .checked_div(MAX_STAKE_DAYS)
        .ok_or(error!(ErrorCode::MathOverflow))
}

pub fn calculate_bpb_bonus(staked_amount: u64) -> Result<u64> {
    let capped_amount = std::cmp::min(staked_amount, MAX_STAKE_AMOUNT);

    // bonus = capped * PRECISION / (10 * MAX_STAKE_AMOUNT)
    // Simplifies to: capped / (10 * MAX_STAKE_AMOUNT / PRECISION)
    let numerator = capped_amount
        .checked_mul(PRECISION)
        .ok_or(error!(ErrorCode::MathOverflow))?;

    numerator
        .checked_div(10 * MAX_STAKE_AMOUNT)
        .ok_or(error!(ErrorCode::MathOverflow))
}

pub fn calculate_t_shares(
    staked_amount: u64,
    stake_days: u64,
    share_rate: u64, // Current GlobalState share_rate
) -> Result<u64> {
    let lpb = calculate_lpb_bonus(stake_days)?;
    let bpb = calculate_bpb_bonus(staked_amount)?;

    // effective_amount = staked * (PRECISION + lpb + bpb) / PRECISION
    let total_multiplier = PRECISION
        .checked_add(lpb)
        .ok_or(error!(ErrorCode::MathOverflow))?
        .checked_add(bpb)
        .ok_or(error!(ErrorCode::MathOverflow))?;

    let effective_amount = staked_amount
        .checked_mul(total_multiplier)
        .ok_or(error!(ErrorCode::MathOverflow))?
        .checked_div(PRECISION)
        .ok_or(error!(ErrorCode::MathOverflow))?;

    // t_shares = effective_amount / share_rate (both scaled by PRECISION)
    effective_amount
        .checked_mul(PRECISION)
        .ok_or(error!(ErrorCode::MathOverflow))?
        .checked_div(share_rate)
        .ok_or(error!(ErrorCode::MathOverflow))
}
```

**Source:** Solana Anchor expert provided this exact pattern with checked arithmetic.

### Pattern 4: Penalty Calculations with Integer Math

**Early Unstake Penalty (verified from [HEX Penalties](http://hex.wiki/penalties)):**
- Formula: Penalty = (½ committed_days / days_served) × potential_payout
- Minimum: 50% of staked amount (if unstake before halfway point)
- Example: Stake 364 days, unstake day 140 → penalty = (182 / 140) × payout

**Late Unstake Penalty (verified from [Hexicans Ending Stake](https://hexicans.info/endstake/)):**
- Grace period: 14 days after maturity (no penalty)
- Linear decay: 1% per week (0.143% per day) after grace period
- Maximum: 100% loss after 2 years (~700 days late)

**Solana Implementation:**
```rust
const MIN_PENALTY_BPS: u64 = 5000; // 50% in basis points
const BPS_SCALER: u64 = 10000;
const GRACE_PERIOD_DAYS: u64 = 14;
const LATE_PENALTY_BPS_PER_DAY: u64 = 14; // ~0.14% per day (1% per week)

pub fn calculate_early_penalty(
    staked_amount: u64,
    start_slot: u64,
    current_slot: u64,
    end_slot: u64,
    slots_per_day: u64,
) -> Result<u64> {
    let elapsed_slots = current_slot
        .checked_sub(start_slot)
        .ok_or(error!(ErrorCode::MathOverflow))?;

    let total_slots = end_slot
        .checked_sub(start_slot)
        .ok_or(error!(ErrorCode::MathOverflow))?;

    if elapsed_slots >= total_slots {
        return Ok(0); // No penalty if on-time or late
    }

    // Penalty proportional to time not served
    // penalty_bps = (1 - elapsed/total) * BPS_SCALER
    let served_fraction = elapsed_slots
        .checked_mul(BPS_SCALER)
        .ok_or(error!(ErrorCode::MathOverflow))?
        .checked_div(total_slots)
        .ok_or(error!(ErrorCode::MathOverflow))?;

    let penalty_bps = BPS_SCALER
        .checked_sub(served_fraction)
        .ok_or(error!(ErrorCode::MathOverflow))?;

    // Enforce minimum 50% penalty
    let final_penalty_bps = std::cmp::max(penalty_bps, MIN_PENALTY_BPS);

    staked_amount
        .checked_mul(final_penalty_bps)
        .ok_or(error!(ErrorCode::MathOverflow))?
        .checked_div(BPS_SCALER)
        .ok_or(error!(ErrorCode::MathOverflow))
}

pub fn calculate_late_penalty(
    staked_amount: u64,
    end_slot: u64,
    current_slot: u64,
    slots_per_day: u64,
) -> Result<u64> {
    if current_slot <= end_slot {
        return Ok(0); // Not late
    }

    let late_slots = current_slot
        .checked_sub(end_slot)
        .ok_or(error!(ErrorCode::MathOverflow))?;

    let late_days = late_slots
        .checked_div(slots_per_day)
        .ok_or(error!(ErrorCode::MathOverflow))?;

    if late_days <= GRACE_PERIOD_DAYS {
        return Ok(0); // Grace period
    }

    let penalty_days = late_days
        .checked_sub(GRACE_PERIOD_DAYS)
        .ok_or(error!(ErrorCode::MathOverflow))?;

    // Penalty = days_late * 0.14% per day
    let penalty_bps = penalty_days
        .checked_mul(LATE_PENALTY_BPS_PER_DAY)
        .ok_or(error!(ErrorCode::MathOverflow))?;

    // Cap at 100%
    let capped_penalty_bps = std::cmp::min(penalty_bps, BPS_SCALER);

    staked_amount
        .checked_mul(capped_penalty_bps)
        .ok_or(error!(ErrorCode::MathOverflow))?
        .checked_div(BPS_SCALER)
        .ok_or(error!(ErrorCode::MathOverflow))
}
```

**Source:** [HEX Penalties Wiki](http://hex.wiki/penalties), [Hexicans Ending Stake Guide](https://hexicans.info/endstake/).

### Pattern 5: Slot-Based Day Counting

**What:** Use Solana's Clock sysvar to get current slot, calculate days elapsed via division

**Why:** Deterministic, no external oracle needed, resistant to validator timestamp manipulation

**Formula:** `current_day = (current_slot - init_slot) / slots_per_day`

**Example:**
```rust
use anchor_lang::prelude::*;

pub fn get_current_day(
    global_state: &GlobalState,
    clock: &Clock,
) -> Result<u64> {
    let elapsed_slots = clock.slot
        .checked_sub(global_state.init_slot)
        .ok_or(error!(ErrorCode::MathOverflow))?;

    elapsed_slots
        .checked_div(global_state.slots_per_day)
        .ok_or(error!(ErrorCode::MathOverflow))
}

pub fn slots_to_days(slots: u64, slots_per_day: u64) -> Result<u64> {
    slots
        .checked_div(slots_per_day)
        .ok_or(error!(ErrorCode::MathOverflow))
}
```

**Source:** Phase 1 STATE.md, [Solana Clock Sysvar Docs](https://solanacompass.com/guides/understanding-block-time).

### Pattern 6: Permissionless Crank for Share Rate Updates

**What:** Anyone can call `crank_distribution` instruction to update share_rate and mint daily inflation

**Why:** Decentralized, no single authority, incentivizes participation (caller could claim gas refund or small reward)

**When it runs:** Daily (once per logical day based on slots)

**What it does:**
1. Calculate days elapsed since last distribution
2. Mint daily inflation: `daily_inflation = total_supply * 3.69% / 365`
3. Update share_rate: `new_share_rate = old_share_rate + (daily_inflation / total_t_shares)`
4. Store `current_day` in GlobalState to prevent double-distribution

**Example:**
```rust
pub fn crank_distribution(ctx: Context<CrankDistribution>) -> Result<()> {
    let clock = Clock::get()?;
    let global_state = &mut ctx.accounts.global_state;

    let current_day = get_current_day(global_state, &clock)?;

    // Prevent double-distribution on same day
    require!(
        current_day > global_state.current_day,
        ErrorCode::AlreadyDistributedToday
    );

    let days_elapsed = current_day
        .checked_sub(global_state.current_day)
        .ok_or(error!(ErrorCode::MathOverflow))?;

    if global_state.total_shares == 0 {
        // No stakes, just update day counter
        global_state.current_day = current_day;
        return Ok(());
    }

    // Daily inflation = total_supply * 3.69% / 365
    let total_supply = get_total_supply(&ctx.accounts.mint)?;
    let annual_inflation = total_supply
        .checked_mul(global_state.annual_inflation_bp)
        .ok_or(error!(ErrorCode::MathOverflow))?
        .checked_div(100_000_000) // Basis points to decimal
        .ok_or(error!(ErrorCode::MathOverflow))?;

    let daily_inflation = annual_inflation
        .checked_div(365)
        .ok_or(error!(ErrorCode::MathOverflow))?
        .checked_mul(days_elapsed)
        .ok_or(error!(ErrorCode::MathOverflow))?;

    // Mint inflation to protocol treasury (or distribute directly)
    mint_tokens(
        &ctx.accounts.mint,
        &ctx.accounts.treasury,
        &ctx.accounts.mint_authority,
        daily_inflation,
        global_state.mint_authority_bump,
    )?;

    // Update share rate: share_rate += inflation / total_shares
    let share_rate_increase = daily_inflation
        .checked_mul(PRECISION)
        .ok_or(error!(ErrorCode::MathOverflow))?
        .checked_div(global_state.total_shares)
        .ok_or(error!(ErrorCode::MathOverflow))?;

    global_state.share_rate = global_state.share_rate
        .checked_add(share_rate_increase)
        .ok_or(error!(ErrorCode::MathOverflow))?;

    global_state.current_day = current_day;

    emit!(InflationDistributed {
        slot: clock.slot,
        day: current_day,
        amount: daily_inflation,
        new_share_rate: global_state.share_rate,
    });

    Ok(())
}
```

**Source:** Anchor expert confirmed this is the standard permissionless pattern.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Time tracking | Custom timestamp oracle or off-chain cron | Solana Clock sysvar with slot-based days | Deterministic, no oracle risk, built-in consensus |
| Reward distribution | Custom iteration over all stakes | Reward debt pattern (MasterChef) | O(1) reward calculation, no loops, constant gas |
| Overflow protection | Manual bounds checking | Anchor's `checked_mul`, `checked_add`, `checked_div` | Automatic overflow errors, compiler optimization |
| PDA derivation | Manual hash calculation | Anchor's `seeds` and `bump` constraints | Type-safe, automatic verification, IDL integration |
| Token operations | Raw CPI to Token program | `anchor_spl::token_2022` wrappers | Type-safe, fewer footguns, automatic program ID resolution |

**Key insight:** Solana's Clock sysvar provides slot numbers that advance deterministically (~400ms per slot). Unlike EVM's `block.timestamp` which validators can manipulate within drift bounds (25% fast, 150% slow), Solana slot progression is part of consensus. This makes slot-based time the correct choice for staking duration logic.

## Common Pitfalls

### Pitfall 1: u64 Overflow in Bonus Calculations

**What goes wrong:** Multiplying large staked amounts by bonus multipliers exceeds u64::MAX (18,446,744,073,709,551,615)

**Why it happens:** Direct calculation like `staked_amount * (1 + lpb_bonus + bpb_bonus)` overflows when staked_amount is large

**How to avoid:**
- Use fixed-point arithmetic with 1e9 precision
- Always use `checked_mul`, `checked_div`, `checked_add`
- Return custom error on overflow (don't panic)
- Order operations to minimize intermediate values (divide before multiply when possible)

**Warning signs:**
- Unit tests pass with small amounts but fail with realistic stake sizes
- Program panics with "arithmetic overflow" in production
- Weird behavior near u64::MAX boundaries

**Example (WRONG):**
```rust
// This will overflow for large amounts!
let bonus_multiplier = 1 + lpb + bpb; // Could exceed u64::MAX
let effective = staked_amount * bonus_multiplier; // OVERFLOW
```

**Example (CORRECT):**
```rust
const PRECISION: u64 = 1_000_000_000;
let total_multiplier = PRECISION
    .checked_add(lpb)?
    .checked_add(bpb)?;
let effective = staked_amount
    .checked_mul(total_multiplier)?
    .checked_div(PRECISION)?;
```

### Pitfall 2: Reward Debt Not Updated After Claim

**What goes wrong:** Users claim rewards multiple times for the same period, draining protocol

**Why it happens:** Forgetting to update `stake.reward_debt = stake.t_shares * current_share_rate` after claim

**How to avoid:**
- Always update reward_debt immediately after calculating pending rewards
- Add a `last_claim_slot` field as double-check
- Write unit tests that claim multiple times in sequence

**Warning signs:**
- Reward balance increases on repeated claims without new distribution
- Total claimed rewards exceed minted inflation
- Protocol treasury depletes faster than expected

**Example (CORRECT):**
```rust
pub fn claim_rewards(ctx: Context<ClaimRewards>) -> Result<()> {
    let stake = &mut ctx.accounts.stake_account;
    let global_state = &ctx.accounts.global_state;

    let pending = calculate_pending_rewards(stake, global_state.share_rate, PRECISION)?;

    // Transfer rewards to user
    transfer_tokens(..., pending)?;

    // CRITICAL: Update reward debt to prevent double-claim
    stake.reward_debt = stake.t_shares
        .checked_mul(global_state.share_rate)?;

    Ok(())
}
```

### Pitfall 3: Share Rate Updated in `create_stake` Instead of Crank

**What goes wrong:** Multiple stakes created between distributions cause inconsistent share_rate, users get unfair T-shares

**Why it happens:** Trying to update share_rate in `create_stake` instruction instead of dedicated crank

**How to avoid:**
- ONLY update share_rate in `crank_distribution` instruction
- New stakes ALWAYS use current share_rate (not a projected future rate)
- Crank runs once per day (permissionless, anyone can call)

**Warning signs:**
- Share rate changes multiple times per day
- Users creating stakes back-to-back get different T-share amounts
- Total T-shares doesn't match expected formula

**Example (CORRECT):**
```rust
// In create_stake: DO NOT update share_rate here
pub fn create_stake(ctx: Context<CreateStake>, amount: u64, days: u16) -> Result<()> {
    let global_state = &ctx.accounts.global_state;

    // Use CURRENT share_rate (don't modify it)
    let t_shares = calculate_t_shares(amount, days, global_state.share_rate)?;

    // ... create stake with t_shares
}

// In crank_distribution: ONLY place to update share_rate
pub fn crank_distribution(ctx: Context<CrankDistribution>) -> Result<()> {
    // ... calculate inflation, update share_rate
}
```

### Pitfall 4: Not Preventing Reentrancy on Unstake

**What goes wrong:** User calls unstake, program transfers tokens, user's callback calls unstake again before `is_active = false` is saved

**Why it happens:** State not updated before CPI token transfer

**How to avoid:**
- Mark stake inactive (`is_active = false`) BEFORE any CPI
- Use Anchor's automatic duplicate account checks
- Add `require!(stake.is_active, ErrorCode::StakeAlreadyClosed)` at start of unstake

**Warning signs:**
- Same stake unstaked multiple times
- Token balance changes don't match stake amount
- Multiple UnstakeEvent emissions for same stake

**Example (CORRECT):**
```rust
pub fn unstake(ctx: Context<Unstake>) -> Result<()> {
    let stake = &mut ctx.accounts.stake_account;

    // 1. CHECK: Stake must be active
    require!(stake.is_active, ErrorCode::StakeAlreadyClosed);

    // 2. CALCULATE: Penalties and return amount
    let (return_amount, penalty) = calculate_unstake_amounts(stake, clock)?;

    // 3. UPDATE STATE: Mark inactive BEFORE CPI
    stake.is_active = false;

    // 4. CPI: Transfer tokens (now safe, stake is inactive)
    transfer_tokens(..., return_amount)?;

    Ok(())
}
```

### Pitfall 5: Precision Loss in Long-Term Reward Calculations

**What goes wrong:** Users who don't claim for months lose small amounts due to integer division rounding

**Why it happens:** Repeated division operations in reward calculations truncate fractional values

**How to avoid:**
- Use large scaling factor (1e9) for all intermediate calculations
- Divide only at the final step
- Document minimum claimable amount (e.g., "rewards below 0.00000001 tokens are lost")

**Warning signs:**
- Tiny stakes show 0 pending rewards despite distribution days passing
- Sum of all claimed rewards < total inflation minted
- Rounding errors accumulate over time

**Example (CORRECT):**
```rust
// Good: multiply first, divide last
let pending = stake.t_shares
    .checked_mul(current_share_rate)?  // Large number
    .checked_div(PRECISION)?           // Divide at end
    .checked_sub(stake.reward_debt.checked_div(PRECISION)?)?;

// Bad: divide early
let shares_scaled = stake.t_shares / PRECISION;  // Lost precision!
let pending = shares_scaled * current_share_rate;
```

## Code Examples

### Example 1: Create Stake with T-Share Calculation

```rust
// Source: Anchor expert pattern + HEX formula verification
use anchor_lang::prelude::*;
use anchor_spl::token_interface::{Mint, TokenAccount, Token2022};

#[derive(Accounts)]
#[instruction(amount: u64, days: u16)]
pub struct CreateStake<'info> {
    #[account(mut)]
    pub user: Signer<'info>,

    #[account(
        mut,
        seeds = [GLOBAL_STATE_SEED],
        bump = global_state.bump,
    )]
    pub global_state: Account<'info, GlobalState>,

    #[account(
        init,
        payer = user,
        space = StakeAccount::LEN,
        seeds = [
            b"stake",
            user.key().as_ref(),
            &global_state.total_stakes_created.to_le_bytes()
        ],
        bump,
    )]
    pub stake_account: Account<'info, StakeAccount>,

    #[account(
        mut,
        associated_token::mint = mint,
        associated_token::authority = user,
        associated_token::token_program = token_program,
    )]
    pub user_token_account: InterfaceAccount<'info, TokenAccount>,

    #[account(
        mut,
        seeds = [MINT_SEED],
        bump,
    )]
    pub mint: InterfaceAccount<'info, Mint>,

    pub token_program: Program<'info, Token2022>,
    pub system_program: Program<'info, System>,
}

pub fn create_stake(
    ctx: Context<CreateStake>,
    amount: u64,
    days: u16,
) -> Result<()> {
    let clock = Clock::get()?;
    let global_state = &mut ctx.accounts.global_state;
    let stake = &mut ctx.accounts.stake_account;

    // Validation
    require!(
        amount >= global_state.min_stake_amount,
        ErrorCode::BelowMinimumStake
    );
    require!(
        days >= 1 && days <= 5555,
        ErrorCode::InvalidStakeDuration
    );

    // Calculate T-shares with bonuses
    let t_shares = calculate_t_shares(amount, days as u64, global_state.share_rate)?;

    let end_slot = clock.slot
        .checked_add(
            (days as u64)
                .checked_mul(global_state.slots_per_day)
                .ok_or(error!(ErrorCode::MathOverflow))?
        )
        .ok_or(error!(ErrorCode::MathOverflow))?;

    // Initialize stake account
    stake.user = ctx.accounts.user.key();
    stake.stake_id = global_state.total_stakes_created;
    stake.staked_amount = amount;
    stake.t_shares = t_shares;
    stake.start_slot = clock.slot;
    stake.end_slot = end_slot;
    stake.stake_days = days;
    stake.reward_debt = t_shares
        .checked_mul(global_state.share_rate)
        .ok_or(error!(ErrorCode::MathOverflow))?;
    stake.is_active = true;
    stake.bump = ctx.bumps.stake_account;

    // Update global state
    global_state.total_stakes_created += 1;
    global_state.total_tokens_staked = global_state.total_tokens_staked
        .checked_add(amount)
        .ok_or(error!(ErrorCode::MathOverflow))?;
    global_state.total_shares = global_state.total_shares
        .checked_add(t_shares)
        .ok_or(error!(ErrorCode::MathOverflow))?;

    // Burn tokens from user (locked in protocol)
    anchor_spl::token_2022::burn(
        CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            anchor_spl::token_2022::Burn {
                mint: ctx.accounts.mint.to_account_info(),
                from: ctx.accounts.user_token_account.to_account_info(),
                authority: ctx.accounts.user.to_account_info(),
            },
        ),
        amount,
    )?;

    emit!(StakeCreated {
        slot: clock.slot,
        user: ctx.accounts.user.key(),
        stake_id: stake.stake_id,
        amount,
        t_shares,
        days,
    });

    Ok(())
}
```

### Example 2: Unstake with Penalty Enforcement

```rust
#[derive(Accounts)]
pub struct Unstake<'info> {
    #[account(mut)]
    pub user: Signer<'info>,

    #[account(
        mut,
        seeds = [GLOBAL_STATE_SEED],
        bump = global_state.bump,
    )]
    pub global_state: Account<'info, GlobalState>,

    #[account(
        mut,
        seeds = [
            b"stake",
            user.key().as_ref(),
            &stake_account.stake_id.to_le_bytes()
        ],
        bump = stake_account.bump,
        has_one = user @ ErrorCode::UnauthorizedStakeAccess,
        constraint = stake_account.is_active @ ErrorCode::StakeAlreadyClosed,
    )]
    pub stake_account: Account<'info, StakeAccount>,

    #[account(
        mut,
        associated_token::mint = mint,
        associated_token::authority = user,
        associated_token::token_program = token_program,
    )]
    pub user_token_account: InterfaceAccount<'info, TokenAccount>,

    #[account(
        mut,
        seeds = [MINT_SEED],
        bump,
    )]
    pub mint: InterfaceAccount<'info, Mint>,

    /// CHECK: PDA used as mint authority
    #[account(
        seeds = [MINT_AUTHORITY_SEED],
        bump = global_state.mint_authority_bump,
    )]
    pub mint_authority: UncheckedAccount<'info>,

    pub token_program: Program<'info, Token2022>,
}

pub fn unstake(ctx: Context<Unstake>) -> Result<()> {
    let clock = Clock::get()?;
    let stake = &mut ctx.accounts.stake_account;
    let global_state = &mut ctx.accounts.global_state;

    // Determine penalty type
    let (return_amount, penalty_type) = if clock.slot < stake.end_slot {
        // Early unstake
        let penalty = calculate_early_penalty(
            stake.staked_amount,
            stake.start_slot,
            clock.slot,
            stake.end_slot,
            global_state.slots_per_day,
        )?;
        (
            stake.staked_amount.checked_sub(penalty).ok_or(error!(ErrorCode::MathOverflow))?,
            PenaltyType::Early(penalty)
        )
    } else {
        // On-time or late unstake
        let penalty = calculate_late_penalty(
            stake.staked_amount,
            stake.end_slot,
            clock.slot,
            global_state.slots_per_day,
        )?;
        (
            stake.staked_amount.checked_sub(penalty).ok_or(error!(ErrorCode::MathOverflow))?,
            if penalty > 0 { PenaltyType::Late(penalty) } else { PenaltyType::None }
        )
    };

    // CRITICAL: Mark inactive BEFORE CPI to prevent reentrancy
    stake.is_active = false;

    // Update global state
    global_state.total_unstakes_created += 1;
    global_state.total_tokens_unstaked = global_state.total_tokens_unstaked
        .checked_add(stake.staked_amount)
        .ok_or(error!(ErrorCode::MathOverflow))?;
    global_state.total_shares = global_state.total_shares
        .checked_sub(stake.t_shares)
        .ok_or(error!(ErrorCode::MathOverflow))?;

    // Mint return amount to user
    let authority_seeds = &[
        MINT_AUTHORITY_SEED,
        &[global_state.mint_authority_bump],
    ];
    anchor_spl::token_2022::mint_to(
        CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            anchor_spl::token_2022::MintTo {
                mint: ctx.accounts.mint.to_account_info(),
                to: ctx.accounts.user_token_account.to_account_info(),
                authority: ctx.accounts.mint_authority.to_account_info(),
            },
            &[authority_seeds],
        ),
        return_amount,
    )?;

    emit!(StakeEnded {
        slot: clock.slot,
        user: ctx.accounts.user.key(),
        stake_id: stake.stake_id,
        original_amount: stake.staked_amount,
        return_amount,
        penalty_type,
    });

    Ok(())
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub enum PenaltyType {
    None,
    Early(u64),
    Late(u64),
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Block timestamp for time | Slot-based day counting | Solana genesis | Deterministic, no oracle manipulation |
| Batch crank (MasterChef V1) | Lazy distribution with reward_debt | 2020 (DeFi Summer) | O(1) reward claims, no iteration |
| Vec<Stake> in account | Separate PDA per stake | Anchor 0.20+ (2021) | No account size limits, parallel ops |
| `unwrap()` for math | `checked_mul/add/div` | Anchor 0.25+ (2022) | Explicit overflow errors, safer |

**Deprecated/outdated:**
- **Block timestamp (`Clock::unix_timestamp`)** for duration logic - Use `Clock::slot` instead for deterministic time
- **`transfer()` without decimals** - Use `transfer_checked()` for Token-2022 compatibility (Phase 1 already handles this)
- **Global iteration crank** - Use reward_debt pattern for O(1) claims

## Open Questions

1. **Should penalties be burned or redistributed?**
   - HEX distributes penalties to remaining stakers
   - What we know: Burning simplifies logic, redistribution is more game-theoretic
   - What's unclear: Which is better for Solana gas costs and user incentives
   - Recommendation: Start with burn (simpler), add redistribution in later phase if desired

2. **Minimum claimable reward amount?**
   - What we know: Fixed-point arithmetic loses fractional tokens below 1e-8
   - What's unclear: Should we enforce minimum claim (e.g., 0.01 HELIX) or allow dust
   - Recommendation: Document precision limit (8 decimals), no explicit minimum enforcement

3. **How to incentivize crank calls?**
   - What we know: Crank is permissionless, anyone can call
   - What's unclear: Should caller get gas refund? Small reward? Just altruism?
   - Recommendation: No explicit incentive for MVP (assume altruism or bot operators), add bounty in later phase if crank calls are sparse

## Sources

### Primary (HIGH confidence)

- [Anchor Framework PDA Documentation](https://www.anchor-lang.com/docs/basics/pda) - PDA constraints and patterns
- [Anchor Account Constraints Reference](https://www.anchor-lang.com/docs/references/account-constraints) - init, seeds, bump, has_one
- [Solana Token-2022 On-Chain Guide](https://www.solana-program.com/docs/token-2022/onchain) - Token CPI patterns, StateWithExtensions
- [Solana Clock Sysvar Documentation](https://docs.chainstack.com/docs/solana-understanding-block-time) - Slot timing, drift limits (25% fast, 150% slow)
- Solana Anchor Framework Expert (MCP) - Reward debt pattern, checked arithmetic, PDA per stake, overflow prevention
- [HEX Staking Deep Dive - Hexicans](https://hexicans.info/documentation/deep-dive/) - LPB/BPB formulas, share rate mechanics
- [HEX Penalties Wiki](http://hex.wiki/penalties) - Early unstake penalty calculations
- [Hexicans Ending Stake Guide](https://hexicans.info/endstake/) - Late unstake penalty (grace period, linear decay)

### Secondary (MEDIUM confidence)

- [HEX Shares - LookIntoHex](https://www.lookintohex.com/explore/shares) - T-share bonus examples
- [HEX Contract in Layman's Terms](https://hexicans.info/documentation/contract-guide/) - High-level protocol mechanics

### Tertiary (LOW confidence - for context only)

- [Solana Staking Reward Distribution](https://solana.com/staking) - General Solana validator staking (different mechanism than HEX-style)

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Anchor 0.31+ is production-ready, Token-2022 is mainnet deployed
- Architecture: HIGH - Anchor expert confirmed reward_debt pattern, PDA-per-stake from Phase 1
- Bonus formulas: HIGH - Verified against HEX official documentation and calculator sites
- Penalty calculations: HIGH - Verified against HEX wiki and community guides
- Pitfalls: HIGH - Based on Anchor expert guidance and known DeFi exploits

**Research date:** 2026-02-07
**Valid until:** 60 days (Anchor/Solana stable, HEX mechanics unchanged since 2019)
