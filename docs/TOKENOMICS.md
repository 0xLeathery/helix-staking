# HELIX Protocol Tokenomics

> **Source of truth:** All numeric constants cited in this document trace to
> [`programs/helix-staking/src/constants.rs`](../programs/helix-staking/src/constants.rs).
> Every formula traces to the instruction files listed in the sections below.
> Analytical sections (participation thresholds, risk scenarios) are explicitly
> labeled as analysis, not on-chain facts.

---

## Table of Contents

1. [Overview](#1-overview)
2. [Supply Projections](#2-supply-projections)
3. [Staking Participation Analysis](#3-staking-participation-analysis)
4. [Penalty Redistribution Mechanics](#4-penalty-redistribution-mechanics)
5. [Risk Scenarios](#5-risk-scenarios)
6. [Protocol Parameters Reference](#6-protocol-parameters-reference)

---

## 1. Overview

HELIX is a time-locked staking protocol on Solana inspired by the HEX model: longer pays better, bigger pays better, and conviction is rewarded. Stakers commit tokens for a chosen duration (1 day to `MAX_STAKE_DAYS = 5555` days, approximately 15.2 years), receiving T-shares proportional to their stake size and duration. T-shares represent a claim on all future protocol inflation for the life of the stake.

HELIX uses a **burn-and-mint model** to track locked value without a protocol treasury. When a user creates a stake (`create_stake`), their HLX tokens are burned from circulating supply. When the stake ends (`unstake`), the protocol mints exactly `return_amount + rewards` back to the user — no more, no less. The total supply at any moment therefore equals circulating (unstaked) HLX plus the protocol's internal accounting of `total_tokens_staked` in `GlobalState`.

Daily inflation is distributed through a permissionless `crank_distribution` instruction. Anyone can call this instruction once per day; it increases the global `share_rate` by the day's inflation amount divided by total T-shares outstanding. Early or late unstake penalties do not burn tokens a second time — instead, they increase `share_rate` proportionally, crediting forfeited value directly to committed stakers. This creates a direct economic incentive for staying the course: panic sellers subsidize holders.

---

## 2. Supply Projections

_Source: [`programs/helix-staking/src/instructions/crank_distribution.rs`](../programs/helix-staking/src/instructions/crank_distribution.rs)_

### Inflation Rate

HELIX targets **3.69% annual inflation**, applied to the staked supply (`total_tokens_staked`), not total supply.

The constant encoding this rate is:

```rust
// programs/helix-staking/src/constants.rs
pub const DEFAULT_ANNUAL_INFLATION_BP: u64 = 3_690_000;
```

The denominator used on-chain is `100_000_000` (100 million), not the standard basis-point denominator of 10,000. This provides two extra decimal places of precision:

```
3_690_000 / 100_000_000 = 0.0369 = 3.69%
```

### On-Chain Inflation Formula

The daily crank computes inflation as follows (`crank_distribution.rs`):

```rust
// annual_inflation = total_staked * annual_inflation_bp / 100_000_000
let annual_inflation = mul_div(total_staked, global_state.annual_inflation_bp, 100_000_000)?;

// daily_inflation = annual_inflation * days_elapsed / 365
let daily_inflation_total = mul_div(annual_inflation, days_elapsed, 365)?;

// share_rate_increase = daily_inflation * PRECISION / total_shares
let share_rate_increase = mul_div(daily_inflation_total, PRECISION, global_state.total_shares)?;
global_state.share_rate += share_rate_increase;
```

The formula computes inflation against `total_tokens_staked` specifically because the burn-and-mint model means the mint's on-chain supply does not reflect locked value (tokens are burned at stake entry).

### Compound Growth Formula

For supply projection purposes, treating initial supply as `S₀`:

```
S(t) = S₀ × (1.0369)^t
```

where `t` is measured in years and the formula assumes 100% of supply is staked (upper bound).

> `S₀` represents the initial supply at protocol launch. It is not hardcoded in the program — it depends on the free-claim distribution at genesis (`HELIX_PER_SOL = 10_000` HLX per SOL in the snapshot).

### Supply Projection Table

The following multipliers are computed as `(1.0369)^t` using exact arithmetic:

| Horizon | Formula       | Multiplier (×S₀) |
|---------|---------------|-----------------|
| Year 1  | 1.0369^1      | 1.0369          |
| Year 5  | 1.0369^5      | 1.1986          |
| Year 10 | 1.0369^10     | 1.4367          |
| Year 20 | 1.0369^20     | 2.0641          |
| Year 50 | 1.0369^50     | 6.1213          |

> **Important:** These projections assume 100% staking participation as an upper bound. Actual supply growth equals `3.69% × participation_ratio`. At 50% participation, effective annual inflation on total supply is approximately **1.845%**.

---

## 3. Staking Participation Analysis

> **This section contains analytical reasoning.** The participation thresholds below are not on-chain constants — they are derived from the economic mechanics of the share-rate system.

### The Share-Rate Dilution Mechanism

The core incentive for early commitment is share-rate dilution. When a new staker joins, they receive T-shares equal to:

```
t_shares = staked_amount × total_multiplier / share_rate
```

Because `share_rate` rises continuously as inflation accumulates, late joiners receive fewer T-shares per token staked. Early committed stakers locked in more T-shares at a lower rate; they are rewarded proportionally more of all future inflation. This design explicitly prices conviction: the longer a staker waits to enter, the less of the inflation pool they can claim per token.

### Participation Thresholds

**Healthy — 40%+ of total supply staked**

At 40%+ participation, circulating supply is meaningfully constrained, creating price support through scarcity. The penalty redistribution pool is large enough to be economically significant — early unstakers forfeit substantial value to remaining stakers. Individual effective APY is moderate and sustainable. Effective APY per token ≈ `3.69% / participation_ratio`; at 40% participation, effective staking APY ≈ 9.2%.

**At-Risk — below 20% staked**

Below 20%, individual stakers earn outsized APY (at 10% participation, effective APY ≈ 36.9%), which is a self-correcting signal: high yields attract new participants, driving participation back up. However, the penalty redistribution pool is small, and price support from supply lock is weak. This is a warning condition, not a crisis.

**Death Spiral Risk — below 5% staked**

Below 5% participation, a single large staker can begin to dominate the T-share pool. Their effective share of every daily inflation distribution approaches a majority. Share-rate manipulation via coordinated unstake/restake cycles becomes feasible. See Section 5 for detailed analysis.

### Self-Correcting Mechanism

Low participation → high APY per token → attracts new stakers → participation rises. This feedback loop is an inherent property of the fixed-rate-on-staked-supply design: the total inflation amount is proportional to `total_tokens_staked`, so each individual staker's yield per token scales inversely with participation.

---

## 4. Penalty Redistribution Mechanics

_Source: [`programs/helix-staking/src/instructions/unstake.rs`](../programs/helix-staking/src/instructions/unstake.rs), [`programs/helix-staking/src/instructions/math.rs`](../programs/helix-staking/src/instructions/math.rs)_

### How Redistribution Works

Penalties are **not burned**. When a staker unstakes with a penalty, the protocol increases the global `share_rate` by the penalty amount divided by the remaining total T-shares. This credits the forfeited value proportionally to every committed staker still in the pool.

The on-chain implementation (`unstake.rs`, lines 183–188):

```rust
// Redistribute penalty to remaining stakers via share_rate increase
// This happens AFTER removing unstaker's shares so they don't benefit from their own penalty
// Formula: share_rate_increase = (penalty_amount * PRECISION) / remaining_total_shares
if penalty > 0 && global_state.total_shares > 0 {
    let penalty_share_increase = mul_div(penalty, PRECISION, global_state.total_shares)?;
    global_state.share_rate = global_state.share_rate
        .checked_add(penalty_share_increase)
        .ok_or(HelixError::Overflow)?;
}
```

**Critical detail:** The unstaker's T-shares are removed from `global_state.total_shares` **before** the penalty redistribution calculation. They do not benefit from their own penalty — the increase goes entirely to the remaining committed stakers.

### Early Unstake Penalty Formula

Source: `calculate_early_penalty` in `math.rs`:

```rust
// served_fraction_bps = (elapsed / total_duration) * BPS_SCALER
let served_fraction_bps = elapsed * BPS_SCALER / total_duration;

// penalty_bps = BPS_SCALER - served_fraction_bps
let penalty_bps = BPS_SCALER - served_fraction_bps;

// Enforce minimum 50% penalty (MIN_PENALTY_BPS = 5000)
let final_penalty_bps = max(penalty_bps, MIN_PENALTY_BPS);

// penalty = staked_amount * final_penalty_bps / BPS_SCALER (rounded up)
let penalty_amount = mul_div_up(staked_amount, final_penalty_bps, BPS_SCALER);
```

Key properties:
- Penalty decreases linearly as the stake term is served.
- Minimum penalty is **50%** (`MIN_PENALTY_BPS = 5000`) — enforced even if 99% of the term is served.
- Penalty rounds **up** to favor the protocol.

### Late Unstake Penalty Formula

Source: `calculate_late_penalty` in `math.rs`:

```rust
// No penalty within grace period (GRACE_PERIOD_DAYS = 14)
if late_days <= GRACE_PERIOD_DAYS { return 0; }

// penalty_days = late_days - GRACE_PERIOD_DAYS
// penalty_bps = penalty_days * BPS_SCALER / LATE_PENALTY_WINDOW_DAYS (= 351)
let penalty_bps = min(penalty_days * 10000 / 351, 10000);

// penalty = staked_amount * penalty_bps / BPS_SCALER (rounded up)
```

Key properties:
- A 14-day grace period (`GRACE_PERIOD_DAYS = 14`) after maturity incurs no penalty.
- After the grace period, penalty rises linearly from 0% to 100% over 351 days (`LATE_PENALTY_WINDOW_DAYS = 351`).
- 100% penalty is reached exactly at day `14 + 351 = 365` past maturity.
- This incentivizes timely unstaking after maturity.

### Worked Example: Early Unstake

Alice stakes **1,000 HLX** for **365 days**, then early-unstakes at **day 1** (approximately 0.27% of the term served).

1. `served_fraction_bps = 1 * 10000 / 365 = 27 bps` (0.27%)
2. `penalty_bps = 10000 - 27 = 9973 bps` (99.73%)
3. Minimum not applicable here: 9973 > 5000
4. `penalty = ceil(1000 HLX × 9973 / 10000) ≈ 997.3 HLX` → rounds up to 997.3 HLX (in base units)
5. Alice receives back: `1,000 - 997.3 = 2.7 HLX` plus any accrued inflation rewards for 1 day (negligible)

**For remaining stakers:** The protocol computes `penalty_share_increase = 997.3 HLX × PRECISION / remaining_total_shares` and adds it to `share_rate`. Every committed staker's pending rewards increase by their proportional share of those 997.3 HLX.

**Net supply effect:** 1,000 HLX were burned at stake entry. On unstake, the protocol mints only ~2.7 HLX back to Alice. The remaining 997.3 HLX are never minted — their value is instead encoded in the higher `share_rate` for remaining stakers, who will receive those tokens when they unstake.

### Worked Example: Late Unstake

Bob completes his **365-day stake**, then waits until **100 days past maturity** (86 days past the end of the grace period).

1. `late_days = 100`
2. Grace period: 14 days → penalty starts at day 15
3. `penalty_days = 100 - 14 = 86`
4. `penalty_bps = 86 × 10000 / 351 = 2450 bps` → 24.5%
5. Bob receives: **75.5%** of his entitled return (principal + rewards)

The 24.5% penalty is redistributed to remaining stakers via `share_rate` increase.

---

## 5. Risk Scenarios

> **This section contains analytical reasoning** about conditions and edge cases. The scenarios below are not encoded as on-chain safety mechanisms (with the exception of the mitigation constants cited). They represent economic analysis of the protocol's boundaries.

### 5.1 Death Spiral Conditions

**Trigger sequence:**
1. Mass unstaking event → `total_shares` drops sharply
2. Daily inflation is now divided among fewer shares → remaining stakers' APY spikes
3. If remaining stakers also exit, the cycle could theoretically continue

**Counter-mechanism — exit penalties:**
The minimum 50% early unstake penalty (`MIN_PENALTY_BPS = 5000`) acts as an economic exit tax. A staker who panics during a mass exit:
- Immediately forfeits at least 50% of principal
- Those forfeited tokens flow directly to the stakers who **stay**
- The combined effect is that exiting during a panic is extremely expensive for exiters and directly profitable for holders

For a true death spiral to occur, penalties would need to fail to offset the dilution of remaining rewards. In HELIX's design, every exit penalty is immediately redistributed to remaining stakers — making irrational exits self-defeating.

**Remaining vulnerability — protocol dormancy:**
If all stakes happen to mature simultaneously and most holders unstake without being replaced, the protocol enters a state of zero active shares. This is **not a death spiral**: the daily crank still runs (emitting a zero-amount inflation event), new stakers can enter at any time at the current `share_rate`, and the protocol reactivates naturally with the next stake creation. There is no value lost and no systemic collapse — simply a period of inactivity.

### 5.2 Whale Concentration

**Risk:** A single actor accumulating a majority of T-shares captures a majority of daily inflation and can potentially manipulate `share_rate` through coordinated unstake/restake cycles timed with the daily crank.

**On-chain mitigations:**

| Mechanism | Constant | Effect |
|-----------|----------|--------|
| BPD per-stake cap | `BPD_MAX_SHARE_PCT = 5` | No single stake can receive more than 5% of the Big Pay Day pool |
| BPB diminishing returns | `BPB_MAX_BONUS = 1_500_000_000` (1.5x) | Bigger-pays-better bonus caps at 1.5x; above 1.5B tokens the curve flattens through three tiers before capping |
| Loyalty multiplier | `LOYALTY_MAX_BONUS = 500_000_000` (0.5x) | Rewards time-serving commitment, not capital size alone |

**BPB tier structure** (from `math.rs` `calculate_bpb_bonus`):
- Tier 1 (0 → 1.5B tokens): Linear 0x → 1.0x bonus
- Tier 2 (1.5B → 5B tokens): Linear 1.0x → 1.25x (diminishing slope)
- Tier 3 (5B → 10B tokens): Linear 1.25x → 1.4x (further reduced slope)
- Tier 4 (>10B tokens): Hard cap at 1.5x (`BPB_MAX_BONUS`)

**Residual risk:** Large holders still capture proportional daily inflation. The BPB cap bounds the whale advantage on share acquisition but does not eliminate it. This is by design — larger committed stakes contribute more locked supply and more penalty redistribution mass.

### 5.3 Existing Mitigation Mechanisms

| Risk | Mechanism | On-Chain Parameter |
|------|-----------|-------------------|
| Death spiral | Exit penalties + redistribution to remaining stakers | `MIN_PENALTY_BPS = 5000` (50% min) |
| Whale BPD capture | Per-stake BPD pool cap | `BPD_MAX_SHARE_PCT = 5` |
| Whale BPB inflation capture | Diminishing returns bonus curve | `BPB_MAX_BONUS = 1_500_000_000` (1.5x cap) |
| Protocol failure / exploit | Emergency pause | `pause()` instruction |
| Admin key compromise | Two-step authority transfer | `transfer_authority` + `accept_authority` instructions |
| Fork exploitation | Chain binding | Runtime program ID assertion |

---

## 6. Protocol Parameters Reference

_Source: [`programs/helix-staking/src/constants.rs`](../programs/helix-staking/src/constants.rs)_

All values below are exact copies from `constants.rs` as of the current program version.

| Constant | Value | Human-Readable Meaning |
|----------|-------|------------------------|
| `DEFAULT_ANNUAL_INFLATION_BP` | `3_690_000` | 3.69% annual inflation rate on staked supply. Denominator is 100,000,000 (not 10,000): `3,690,000 / 100,000,000 = 0.0369` |
| `MIN_PENALTY_BPS` | `5_000` | 50% minimum early unstake penalty (denominator: `BPS_SCALER = 10,000`) |
| `GRACE_PERIOD_DAYS` | `14` | 14-day window after stake maturity during which no late penalty applies |
| `LATE_PENALTY_WINDOW_DAYS` | `351` | Days from grace-period end to 100% late penalty. `14 + 351 = 365` total days past maturity |
| `MAX_STAKE_DAYS` | `5_555` | Maximum stake duration (~15.2 years) |
| `LPB_MAX_DAYS` | `3_641` | Duration at which the longer-pays-better bonus reaches its maximum of 2x (`2 × PRECISION`) |
| `BPB_MAX_BONUS` | `1_500_000_000` | Maximum bigger-pays-better bonus: 1.5x (in `PRECISION` units where `PRECISION = 1e9`) |
| `BPD_MAX_SHARE_PCT` | `5` | Maximum percentage of the Big Pay Day pool any single stake can receive: 5% |
| `LOYALTY_MAX_BONUS` | `500_000_000` | Maximum loyalty bonus: 0.5x (in `PRECISION` units). Accrues linearly over the stake's committed term |
| `PRECISION` | `1_000_000_000` | Fixed-point scaling factor (1e9). All bonus multipliers are expressed as multiples of this value |
| `TOKEN_DECIMALS` | `8` | HLX uses 8 decimal places. Display value = raw value ÷ 10^8 |

### Additional Constants Referenced in This Document

| Constant | Value | Meaning |
|----------|-------|---------|
| `BPS_SCALER` | `10_000` | Standard basis-point denominator (used for penalty formulas) |
| `HELIX_PER_SOL` | `10_000` | HLX distributed per SOL in the genesis free-claim snapshot |
| `DEFAULT_STARTING_SHARE_RATE` | `10_000` | Initial share rate at protocol launch (1:1 base ratio) |
| `DEFAULT_MIN_STAKE_AMOUNT` | `10_000_000` | Minimum stake: 0.1 HLX (raw units with 8 decimals) |

---

*This document reflects the on-chain program state. If the program is upgraded, verify all constants against the updated `constants.rs`.*
