---
type: report
title: "Agent #2: Tokenomics & Economic Exploits Audit"
created: 2026-02-16
tags:
  - security
  - audit
  - tokenomics
  - economics
related:
  - "[[CONSOLIDATED-SECURITY-AUDIT]]"
  - "[[SECURITY-HARDENING-01]]"
---

# Agent #2: Tokenomics & Economic Exploits Audit

## Executive Summary

This audit examines the HELIX Staking Protocol's economic model for exploitable vulnerabilities, covering reward distribution, MEV vectors, flash loan attacks, BPD gaming, pool draining, inflation exploits, whale dominance, and timing attacks. All source files in `programs/helix-staking/src/` were reviewed (26 files total).

**Overall Assessment: The protocol's economic model is SUBSTANTIALLY HARDENED since the Feb 8 audit.** The three-phase BPD flow (finalize -> seal -> trigger), anti-whale caps, BPB diminishing returns, loyalty bonus, and the 24-hour observation window address the previously identified CRITICAL and HIGH findings. However, several new economic concerns emerge from this analysis.

**New Findings Summary:**
- 1 MEDIUM: Loyalty bonus creates unbounded inflation on claimed rewards
- 1 MEDIUM: BPD whale cap circumvention via stake splitting (Sybil)
- 1 MEDIUM: Speed bonus can cause `total_claimed > total_claimable`, reducing BPD pool to zero
- 1 LOW: Penalty redistribution timing creates marginal MEV opportunity
- 1 LOW: `saturating_sub` at `math.rs:304` silently absorbs accounting errors
- 1 INFO: `crank_distribution` inflation compounding is slightly favorable to late crankers
- 1 INFO: `admin_set_slots_per_day` retroactively changes all time calculations

**Previous Finding Status:**
- MED-2 (`saturating_sub`): Confirmed. Risk remains LOW in practice but masks bugs. See detailed analysis.
- MED-4 (Singleton ClaimConfig): Confirmed by design. Economic impact is bounded.

---

## Economic Analysis of CRIT/HIGH Fixes

### CRIT-1 FIX: Per-Batch BPD Rate (VERIFIED FIXED)

**Previous Issue:** Permissionless `finalize_bpd_calculation` allowed a caller to control which stakes were included, and a single batch with few stakes would get a disproportionately high rate.

**Fix Location:** Three-phase BPD flow now splits the process:
1. `finalize_bpd_calculation.rs` (authority-gated, line 16): Accumulates share-days across batches but does NOT compute the rate.
2. `seal_bpd_finalize.rs` (authority-gated, line 11): Computes the global rate from accumulated totals after a 24-hour observation window.
3. `trigger_big_pay_day.rs` (permissionless, line 16): Distributes using the sealed rate.

**Economic Verification:**
- `seal_bpd_finalize.rs:78-82`: Rate = `(unclaimed_amount * PRECISION) / bpd_total_share_days`. This uses the ACCUMULATED total across ALL finalize batches, not per-batch totals. **Correct.**
- `seal_bpd_finalize.rs:63-66`: `expected_finalized_count` parameter forces authority to acknowledge the exact count. **Correct.**
- `seal_bpd_finalize.rs:49-58`: 24-hour delay (`BPD_SEAL_DELAY_SECONDS = 86400`) prevents rush-sealing. **Correct.**
- `finalize_bpd_calculation.rs:134`: `bpd_finalize_period_id` duplicate check prevents double-counting. **Correct.**

**Verdict: CRIT-1 is FIXED. The rate cannot be gamed by controlling batch composition.**

### CRIT-2 FIX: Duplicate BPD Distribution (VERIFIED FIXED)

**Previous Issue:** Same stake could receive BPD bonus multiple times.

**Fix Location:**
- `trigger_big_pay_day.rs:129`: `stake.bpd_claim_period_id == claim_config.claim_period_id` check.
- `trigger_big_pay_day.rs:134`: `stake.bpd_finalize_period_id != claim_config.claim_period_id` ensures only finalized stakes receive distribution.
- `trigger_big_pay_day.rs:200-211`: Zero-bonus stakes are also marked as processed.

**Economic Verification:**
- Line 129 skips already-distributed stakes. Line 223 sets the period ID after distribution. The write happens via `stake.try_serialize()` at line 225. **Correct.**
- Line 200-210: Even zero-bonus stakes get `bpd_claim_period_id` set, preventing re-submission. **Correct.**

**Verdict: CRIT-2 is FIXED. No duplicate BPD distribution is possible.**

### HIGH-1 FIX: `abort_bpd` Authority Gate (VERIFIED FIXED)

**Fix Location:** `abort_bpd.rs:13-15`: `has_one = authority` constraint on GlobalState.
**Economic Impact:** Only authority can abort BPD. Idempotent behavior (line 45) prevents error on retry. Cannot abort after distribution starts (line 52).

**Verdict: HIGH-1 is FIXED.**

### HIGH-2 FIX: BPD Window Unstake Block (VERIFIED FIXED)

**Fix Location:** `unstake.rs:67`: `require!(!global_state.is_bpd_window_active(), HelixError::UnstakeBlockedDuringBpd)`
**Economic Impact:** Prevents share dilution during BPD calculation. Window is set on first finalize batch (`finalize_bpd_calculation.rs:86`) and cleared on completion (`trigger_big_pay_day.rs:255`) or abort (`abort_bpd.rs:72`).

**Potential Concern:** The BPD window also blocks legitimate unstaking. If the authority becomes unresponsive during BPD, stakes are frozen until abort or completion. This is a liveness risk, not a security risk.

**Verdict: HIGH-2 is FIXED. Economic attack surface is closed.**

---

## Reward Distribution Fairness Analysis

### Share Rate Mechanism

The protocol uses a lazy distribution model where inflation increases `share_rate` globally (`crank_distribution.rs:114`):

```rust
// crank_distribution.rs:114
let share_rate_increase = mul_div(daily_inflation_total, PRECISION, global_state.total_shares)?;
```

Each staker's rewards are computed as:
```rust
// math.rs:299-311
let current_value = (t_shares as u128) * (current_share_rate as u128);
let pending = current_value.saturating_sub(reward_debt as u128);
let pending_rewards = pending / (PRECISION as u128);
```

**Fairness Assessment:**
- T-shares are calculated at stake creation using `share_rate` at that time (`create_stake.rs:82`).
- `create_stake` calls `distribute_pending_inflation` first (line 64), ensuring the share rate is current before T-share computation. This prevents sandwich attacks where a staker creates a stake just before inflation hits.
- Reward debt is set to `t_shares * share_rate` at creation (line 95), so new stakers cannot claim pre-existing inflation.

**Finding: The basic distribution is FAIR.** New stakers cannot extract pre-existing rewards, and all active stakers receive proportional inflation.

### Loyalty Bonus Fairness Concern (NEW MEDIUM)

The loyalty bonus (`math.rs:354-373`) multiplies inflation rewards by up to 1.5x:

```rust
// unstake.rs:95-107
let loyalty_adjusted_rewards = if loyalty_bonus > 0 && pending_rewards > 0 {
    let total_multiplier = (PRECISION as u128).checked_add(loyalty_bonus as u128)...;
    let adjusted = (pending_rewards as u128).checked_mul(total_multiplier)...
        .checked_div(PRECISION as u128)...;
    ...
};
```

**Economic Concern:** The loyalty bonus is applied to `pending_rewards` (which are calculated from the global share rate), but the bonus tokens are minted from nothing -- they are NOT deducted from the global share pool. This means:

1. A staker with 50% loyalty bonus claiming 100 HELIX in inflation rewards receives 150 HELIX.
2. The extra 50 HELIX is inflationary -- it dilutes all other stakers.
3. The `total_shares` does NOT account for this extra inflation.
4. Over time, if many long-term stakers claim loyalty bonuses, the effective inflation rate can exceed `annual_inflation_bp` by up to 50%.

**Severity: MEDIUM** -- The loyalty bonus creates hidden inflation that is not accounted for in the protocol's inflation model. The maximum impact is bounded (50% of inflation rewards for full-term stakers), but it systematically transfers value from new/short-term stakers to long-term stakers beyond what the T-share mechanism already provides.

**Recommendation:** Either:
(a) Fund loyalty bonuses from penalty redistributions rather than minting, or
(b) Account for loyalty in the share rate calculation by reducing the effective share rate increase, or
(c) Document this as intentional (up to ~5.5% effective annual inflation vs. stated 3.69%).

### Penalty Redistribution

Penalties from early/late unstaking are redistributed to remaining stakers (`unstake.rs:170-179`):

```rust
// unstake.rs:174-178
if penalty > 0 && global_state.total_shares > 0 {
    let penalty_share_increase = mul_div(penalty, PRECISION, global_state.total_shares)?;
    global_state.share_rate = global_state.share_rate.checked_add(penalty_share_increase)...;
}
```

**Important:** The unstaker's shares are removed BEFORE penalty redistribution (line 162-163), so they do NOT benefit from their own penalty. **Correct.**

---

## MEV & Front-running Analysis

### 1. `crank_distribution` Front-Running

`crank_distribution` is permissionless (any signer). The share rate increase depends solely on on-chain state (`total_tokens_staked`, `annual_inflation_bp`, `total_shares`, `days_elapsed`). A front-runner cannot manipulate the amount distributed.

**However:** `create_stake.rs:64` calls `distribute_pending_inflation` before computing T-shares. This means a staker who front-runs a `crank_distribution` call gets their stake created at the NEW (higher) share rate, receiving fewer T-shares. This is actually PROTECTIVE -- it prevents the sandwich attack where a staker creates a stake just before inflation hits to get cheap T-shares.

**Verdict: Low MEV risk.** The protocol's design of calling `distribute_pending_inflation` at the start of `create_stake`, `unstake`, and `claim_rewards` is correct.

### 2. `trigger_big_pay_day` Front-Running

`trigger_big_pay_day` is permissionless. A front-runner could:
- Observe a pending `trigger_big_pay_day` transaction
- Insert their own `trigger_big_pay_day` with specific stake accounts

**Impact:** Since `trigger_big_pay_day` uses a fixed pre-calculated rate (`bpd_helix_per_share_day`), the order of stake processing does NOT affect the bonus amount. The rate is constant across all batches. **No economic advantage from front-running.**

### 3. `create_stake` / `unstake` Sandwich

**Scenario:** Attacker sees a large stake being created, front-runs with their own stake, then back-runs with unstake.

**Defense:**
- `create_stake.rs:64`: `distribute_pending_inflation` is called first, ensuring share rate is current.
- `unstake.rs:61`: Same protection on unstake.
- Minimum stake amount (`min_stake_amount = 0.1 HELIX`) prevents dust spam but doesn't prevent meaningful sandwiches.

**Finding (LOW):** A validator/searcher could see a pending large early-unstake and front-run it by staking, then back-run by claiming rewards. The early unstake penalty is redistributed via `share_rate` increase (line 175). The front-runner would receive a proportional share of the penalty.

**Economic impact:** For a 1000 HELIX early unstake with 50% penalty, the penalty is 500 HELIX. If the front-runner holds 10% of total shares, they'd receive ~50 HELIX. This requires significant capital and the penalty size is unpredictable. **Risk: LOW.**

---

## Flash Loan / Same-Block Manipulation

### Can an attacker stake and unstake in the same block?

**Analysis of timing checks:**

1. `create_stake`: No minimum lock period enforced in code. `days` parameter must be >= 1, but the stake is created at `clock.slot` with `end_slot = clock.slot + (days * slots_per_day)`.

2. `unstake`: Checks `stake_account.is_active @ HelixError::StakeAlreadyClosed` (line 28-29). Uses the SAME `clock.slot` for penalty calculations.

3. If `days = 1` and `slots_per_day = 216000`, then `end_slot = current_slot + 216000`. The stake would mature in ~1 day.

**Same-block unstake scenario:**
- Stake with `days = 1` in slot N. `end_slot = N + 216000`.
- Unstake in same slot N. `clock.slot = N < end_slot`. This is an early unstake.
- Early penalty: `served_fraction = 0/216000 = 0`. `penalty_bps = 10000`. But minimum is `MIN_PENALTY_BPS = 5000`.
- Actually penalty = 100% because `served_fraction = 0`, so `penalty_bps = 10000 (100%)`.
- Return amount = `staked_amount - penalty = 0`.
- Pending rewards = `t_shares * share_rate - reward_debt = 0` (no time has passed for inflation).

**Verdict: Flash loan attack is NOT profitable.** Same-block stake+unstake yields 0 return amount and 0 rewards. The 100% early penalty is a complete deterrent.

**BPD flash loan:** Could an attacker create a stake, get finalized for BPD, and then receive BPD bonus?
- BPD requires `stake.start_slot >= claim_config.start_slot` and `stake.start_slot <= claim_config.end_slot`.
- BPD also requires `days_staked >= 1` (measured in slots).
- A same-block stake would have `days_staked = 0` and be filtered out.
- Even if unstake is blocked during BPD window (HIGH-2 fix), the attacker cannot extract BPD in the same block.

**Verdict: Flash loan attacks on BPD are NOT possible.**

---

## Whale Dominance & Anti-Whale Mechanisms

### BPD_MAX_SHARE_PCT (5% Cap)

**Location:** `constants.rs:71` and `trigger_big_pay_day.rs:66-72`:

```rust
let max_bonus_per_stake = mul_div(
    claim_config.bpd_original_unclaimed,
    BPD_MAX_SHARE_PCT,  // 5
    100,
)?;
```

**Effectiveness Analysis:**
- The cap limits any single stake's BPD bonus to 5% of the total BPD pool.
- `bpd_original_unclaimed` is set at seal time (`seal_bpd_finalize.rs:88`) and remains constant across all trigger batches. **Correct -- prevents manipulation between batches.**
- The cap applies to the raw bonus BEFORE accumulation: `let bonus = raw_bonus.min(max_bonus_per_stake)` (line 198).

### Sybil Attack: Stake Splitting (NEW MEDIUM)

**Attack Scenario:**
1. Whale has 100M HELIX to stake.
2. Instead of one stake, whale creates 20 stakes of 5M HELIX each during the claim period.
3. Each stake is well below the BPD 5% cap.
4. Each stake gets its proportional BPD share without hitting the cap.

**Analysis:**
- The 5% cap applies per-stake, not per-user. There is no on-chain identity linking stakes from the same wallet.
- A whale can trivially split into N stakes from the same wallet or multiple wallets.
- 20 stakes at 5M each = same total T-shares as 1 stake at 100M (before BPB bonus differences).

**BPB Diminishing Returns Interaction:**
The BPB diminishing returns tiers DO help here:
```
Tier 1: 0 -> 1.5B tokens: Linear 0 -> 1.0x
Tier 2: 1.5B -> 5B tokens: Linear 1.0x -> 1.25x
Tier 3: 5B -> 10B tokens: Linear 1.25x -> 1.4x
Tier 4: Above 10B: Hard cap at 1.5x
```

For a 100M HELIX whale (well below Tier 1 threshold of 1.5B):
- Single stake: `calculate_bpb_bonus(100M * 1e8) = (100M * 1e8 / 10) * PRECISION / BPB_THRESHOLD`
  - `= 10M * 1e8 * 1e9 / (150M * 1e8 * 100) = ~6.67% of PRECISION`
- 20 stakes of 5M each: Each gets `(5M * 1e8 / 10) * PRECISION / BPB_THRESHOLD = ~0.33% of PRECISION`
- Total multiplier difference: ~6.67% vs 20 * 0.33% = 6.67%. **Same total.**

**Key insight:** For amounts below BPB_THRESHOLD * 10 (1.5B tokens), BPB is perfectly linear. Splitting has NO BPB disadvantage. The BPB diminishing returns only penalize mega-whales above 1.5B tokens.

**For the BPD cap specifically:** A whale with enough share-days to exceed 5% of the pool can circumvent the cap entirely by splitting into multiple stakes. If the BPD pool is 1M HELIX and the 5% cap is 50K HELIX per stake, a whale who would naturally receive 200K HELIX can split into 4 stakes and receive the full 200K.

**Severity: MEDIUM** -- The 5% BPD cap is circumventable via Sybil. It only prevents lazy whales from dominating, not determined ones. The BPB diminishing returns tiers are effective for amounts above 1.5B tokens but irrelevant for most real-world stake sizes.

**Recommendation:**
- Consider per-wallet BPD caps (though this still fails against multi-wallet Sybil).
- Document the limitation transparently.
- The cap still provides value as a speed bump / friction mechanism.

### BPB Diminishing Returns Tiers

**Location:** `math.rs:91-150`

**Tier Boundary Analysis:**

| Threshold | Display Tokens | Bonus |
|-----------|---------------|-------|
| BPB_THRESHOLD * 10 | 1.5B | 1.0x |
| BPB_TIER_2 | 5B | 1.25x |
| BPB_TIER_3 | 10B | 1.4x |
| Above TIER_3 | >10B | 1.5x (hard cap) |

**Boundary correctness check (`math.rs:120-121`):**
```rust
if staked_amount <= BPB_TIER_2 {
    let excess = (staked_amount - BPB_THRESHOLD * 10) as u128;
    let tier_range = (BPB_TIER_2 - BPB_THRESHOLD * 10) as u128;
```

The effective threshold is `BPB_THRESHOLD * 10`:
- `BPB_THRESHOLD = 150_000_000_00_000_000 = 1.5e16` (150M tokens with 8 decimals)
- `BPB_THRESHOLD * 10 = 1.5e17` (1.5B tokens with 8 decimals)
- `BPB_TIER_2 = 5e17` (5B tokens)
- `BPB_TIER_3 = 1e18` (10B tokens)

**The tiers are correctly computed and monotonically increasing.** Unit tests at `math.rs:407-444` confirm this.

**Economic concern:** The tier thresholds are hardcoded and cannot be adjusted. If the token price increases 100x, a stake of "1.5B tokens" might represent only $1.5M, making the anti-whale protection trivial to exceed. **Risk: INFO** -- this is a long-term governance concern, not an immediate exploit.

---

## Reward Rate Manipulation and Gaming

### Three-Phase BPD Flow Analysis

**Phase 1: `finalize_bpd_calculation` (Authority-gated)**
- Accumulates `bpd_total_share_days` across batches.
- Pins `bpd_snapshot_slot` on first batch (line 80).
- Sets `bpd_finalize_start_timestamp` for seal delay (line 83).
- Marks stakes with `bpd_finalize_period_id` to prevent double-counting (line 181).

**Phase 2: `seal_bpd_finalize` (Authority-gated)**
- Requires 24-hour delay from first finalize batch (line 49-58).
- Requires `expected_finalized_count` to match actual count (line 63-66).
- Computes rate: `bpd_helix_per_share_day = unclaimed * PRECISION / total_share_days` (line 78-82).
- Sets `bpd_original_unclaimed` for whale cap (line 88).

**Phase 3: `trigger_big_pay_day` (Permissionless)**
- Uses sealed rate, no recalculation possible.
- Applies whale cap per stake.
- Tracks `bpd_stakes_distributed` and completes when `>= bpd_stakes_finalized`.

**Gaming Vector Analysis:**

1. **Authority Stake Selection:** The authority controls WHICH stakes are passed to `finalize_bpd_calculation`. Could an authority exclude legitimate stakes?
   - Yes, the authority could pass only their own stakes to finalize, then seal.
   - This would give them ALL the BPD pool (since total_share_days would only include their stakes, the rate would be proportionally higher for them).
   - **Mitigation:** The 24-hour observation window allows the community to verify which stakes were finalized. Off-chain monitoring can detect if eligible stakes were excluded.
   - **Residual Risk:** This relies on off-chain monitoring, which is a trust assumption.

2. **Snapshot Slot Manipulation:** The `bpd_snapshot_slot` is pinned on the first finalize batch. Could the authority manipulate when they start finalization to advantage certain stakes?
   - Starting finalization later means more `days_staked` for all stakes. This benefits all stakes proportionally, so no selective advantage. **No gaming vector.**

3. **Speed Bonus and BPD Pool Interaction (NEW MEDIUM):**

   In `free_claim.rs:134-141`, claiming with a speed bonus can cause `total_claimed` to exceed `total_claimable`:
   - `total_claimable` is set by the authority at initialization.
   - Speed bonus adds 10-20% to each claim.
   - After all claimers claim with bonuses, `total_claimed` could be up to 120% of `total_claimable`.

   In `finalize_bpd_calculation.rs:73-74`:
   ```rust
   let amount = claim_config.total_claimable.saturating_sub(claim_config.total_claimed);
   ```
   If `total_claimed > total_claimable`, this saturates to 0, making the BPD pool ZERO.

   **Attack Scenario:** If all eligible claimers claim within week 1 (+20% bonus), the BPD pool could be empty. This is by design per the code comment ("speed bonuses can cause total_claimed to exceed total_claimable"), but it means:
   - Fast claimers get a speed bonus
   - Late claimers get no bonus
   - BPD stakers get nothing

   **Severity: MEDIUM** -- This is a design tradeoff, not a bug. But it means the BPD pool size is UNPREDICTABLE at initialization time. The authority must account for maximum speed bonus usage when setting `total_claimable`.

   **Recommendation:** Document clearly that `total_claimable` should include a buffer for speed bonuses (up to 20% additional). Alternatively, track bonuses separately from base claims.

---

## Pool Draining Attacks

### Can the reward pool be drained?

The HELIX protocol uses a burn-and-mint model:
- `create_stake`: Burns tokens from user (`create_stake.rs:157-167`).
- `unstake` / `claim_rewards`: Mints tokens to user (`unstake.rs:186-198`, `claim_rewards.rs:134-146`).

There is no token vault to drain. The protocol controls the mint authority PDA.

**Inflation-based draining:** Could repeated `crank_distribution` calls inflate the share rate faster than intended?

`crank_distribution.rs:70`: `if current_day <= global_state.current_day { return Ok(()); }` -- Idempotent. Can only advance once per day. **Safe.**

**BPD-based draining:** Could `trigger_big_pay_day` distribute more than `bpd_remaining_unclaimed`?

`trigger_big_pay_day.rs:246-248`:
```rust
claim_config.bpd_remaining_unclaimed = claim_config.bpd_remaining_unclaimed
    .checked_sub(batch_distributed)
    .ok_or(HelixError::BpdOverDistribution)?;
```

Uses `checked_sub`, not `saturating_sub`. If `batch_distributed > bpd_remaining_unclaimed`, the transaction fails. **Safe.**

**Admin mint draining:** `admin_mint.rs:50-56` enforces `max_admin_mint` cap. **Safe.**

**Verdict: No pool draining vectors identified.**

---

## Inflation/Deflation Exploits

### Daily Inflation Mechanism (`crank_distribution.rs`)

```rust
// Line 98-114
let total_staked = global_state.total_tokens_staked;
let annual_inflation = mul_div(total_staked, global_state.annual_inflation_bp, 100_000_000)?;
let daily_inflation_total = mul_div(annual_inflation, days_elapsed, 365)?;
let share_rate_increase = mul_div(daily_inflation_total, PRECISION, global_state.total_shares)?;
```

**Inflation Base Analysis:**
- Uses `total_tokens_staked` (not mint supply) as the inflation base.
- `total_tokens_staked` is updated on `create_stake` (+amount) and `unstake` (-staked_amount).
- Penalties do NOT change `total_tokens_staked` -- they are redistributed via `share_rate`.

**Compounding Effect (INFO):**

The inflation is computed as a simple daily rate: `annual / 365 * days_elapsed`. This is NOT compounding. If `days_elapsed = 2` (crank was missed for a day), the distribution is `2 * daily_rate`, which is correct for simple interest.

However, the `total_tokens_staked` base does NOT increase when inflation rewards are accrued (they are only minted on claim/unstake). This means the inflation rate is applied to the STAKED amount, not the staked + accrued amount. This is slightly deflationary compared to true compound interest.

**Multi-day catch-up gaming (INFO):**

If the crank is not called for N days, then `days_elapsed = N` and a single call distributes N days of inflation at once. The inflation base is the CURRENT `total_tokens_staked`, not the base at each intermediate day. If stakes were created/removed during the gap, the inflation is retroactively applied to the current state. This creates a minor timing advantage:

- If a large stake is created during the gap, they would receive inflation for days they weren't staked.
- **But:** `create_stake.rs:64` calls `distribute_pending_inflation`, which closes the gap before the stake is created. **This is correctly defended.**

**Verdict: The inflation mechanism is sound. Minor compounding simplification is by design and economically acceptable.**

### `admin_set_slots_per_day` Retroactive Effect (INFO)

Changing `slots_per_day` retroactively affects:
1. Day calculation for inflation: `get_current_day` uses current `slots_per_day`.
2. BPD `days_staked` calculation.
3. Penalty calculations (both early and late).

If authority decreases `slots_per_day`, the current day number jumps forward, potentially triggering a large multi-day inflation distribution on the next crank. This is bounded by the ceiling at `10 * DEFAULT_SLOTS_PER_DAY` (`admin_set_slots_per_day.rs:35-40`).

**Severity: INFO** -- Authority-only, bounded, primarily for devnet.

---

## Timing-Based Economic Attacks

### BPD Window Timing

**Attack: Stake just before claim period ends to maximize BPD**

- BPD eligibility requires `stake.start_slot >= claim_config.start_slot` AND `stake.start_slot <= claim_config.end_slot`.
- BPD share-days = `t_shares * days_staked_during_period`.
- If staking on the last day: `days_staked = 1` (minimum). BPD bonus = `1 * t_shares * helix_per_share_day / PRECISION`.
- A large last-minute stake gets minimal BPD per token but does dilute the rate for other stakers (since their share-days are fixed but the total increases).

**However:** The finalize phase happens AFTER the claim period ends. The snapshot slot is pinned to the first finalize batch. If the stake was created in the last slot of the claim period, `days_staked = (snapshot_slot - start_slot) / slots_per_day`, which would be at least `(end_slot + 1 - (end_slot)) / slots_per_day = 0`. So a last-second stake gets 0 days and is excluded.

**Verdict: Last-second BPD gaming is NOT profitable due to the 1-day minimum.**

### Claim Period Timing

**Speed Bonus Optimization:**
- Claiming in week 1 gives +20% bonus.
- Claiming in weeks 2-4 gives +10% bonus.
- Claiming after week 4 gives 0% bonus.

There is no economic attack here -- the speed bonus is designed to incentivize early claiming. The only concern is the interaction with BPD pool size (covered above).

### Unstake Timing Around BPD

**Scenario:** Staker wants to unstake but BPD window is active.

- `unstake.rs:67` blocks unstaking during BPD window.
- After BPD completes, the staker can unstake and their `bpd_bonus_pending` is included in the payout (line 143).
- If the staker would prefer to claim rewards separately, they can call `claim_rewards` first (but this is also blocked if BPD window is active? No -- `claim_rewards` does NOT check `is_bpd_window_active()`).

**Finding:** `claim_rewards` is NOT blocked during the BPD window. A staker could:
1. Receive BPD bonus via `trigger_big_pay_day`
2. Call `claim_rewards` to claim inflation rewards + BPD bonus while the window is still active
3. Later, after the window closes, call `unstake`

This is actually correct behavior -- claiming rewards does not change T-shares and doesn't affect BPD calculations. The BPD window only needs to block unstaking (which removes shares and changes the total_shares denominator).

---

## New Economic Findings

### ECON-1: Loyalty Bonus Creates Unbounded Extra Inflation (MEDIUM)

**Severity: MEDIUM**
**Location:** `unstake.rs:95-107`, `claim_rewards.rs:92-104`, `math.rs:354-373`

**Description:** The loyalty bonus multiplies inflation rewards by up to 1.5x (for stakes that have served their full term). These bonus tokens are minted from nothing, creating inflation beyond the stated `annual_inflation_bp` rate. The loyalty bonus is applied to both `claim_rewards` and `unstake` payouts.

**Attack Scenario:**
1. Protocol has 3.69% annual inflation rate.
2. 100% of stakers are long-term (full term = max loyalty bonus of 50%).
3. Effective inflation = 3.69% * 1.5 = 5.535%.
4. The protocol documentation and tokenomics model states 3.69%, but actual inflation is ~50% higher.

**Impact:** Token holders who are not staking experience higher dilution than expected. The economic model's stated inflation rate is misleading.

**Recommendation:** Either fund loyalty bonuses from penalty redistributions, reduce the base inflation rate to account for loyalty bonuses, or clearly document the maximum effective inflation rate.

### ECON-2: BPD Whale Cap Circumvention via Stake Splitting (MEDIUM)

**Severity: MEDIUM**
**Location:** `trigger_big_pay_day.rs:198`, `constants.rs:71`

**Description:** The 5% per-stake BPD cap can be trivially circumvented by splitting a large stake into multiple smaller stakes. There is no per-wallet or per-identity cap.

**Attack Scenario:**
1. BPD pool has 1M HELIX. 5% cap = 50K per stake.
2. Whale's single stake would receive 300K HELIX based on share-days.
3. Whale instead creates 6 stakes. Each receives ~50K HELIX.
4. Total received: 300K HELIX (full amount, cap bypassed).

**Impact:** The anti-whale mechanism provides friction but not hard protection. Sophisticated actors will bypass it.

**Recommendation:** Accept this as a limitation and document it. On-chain Sybil resistance is fundamentally hard. Consider UI/communication that the cap is a fairness signal, not a hard guarantee.

### ECON-3: Speed Bonus Can Zero Out BPD Pool (MEDIUM)

**Severity: MEDIUM**
**Location:** `free_claim.rs:134-141`, `finalize_bpd_calculation.rs:73-74`

**Description:** The speed bonus (up to +20%) causes `total_claimed` to exceed `total_claimable`. The BPD unclaimed amount is computed as `total_claimable.saturating_sub(total_claimed)`, which can saturate to 0.

**Attack Scenario:**
1. Authority sets `total_claimable = 1M HELIX`.
2. All 100 eligible claimers claim in week 1 with +20% bonus.
3. `total_claimed = 1.2M HELIX > total_claimable`.
4. BPD pool = `1M - 1.2M = 0` (saturating).
5. All BPD-eligible stakers receive nothing.

**Impact:** BPD pool size depends on claiming behavior, which is unpredictable. The authority must over-provision `total_claimable` to account for maximum bonus usage, which is wasteful in the average case.

**Recommendation:** Either:
(a) Track speed bonuses separately: `unclaimed = total_claimable - (total_claimed - total_bonus_claimed)`, or
(b) Set `total_claimable` to `base_claims * 1.2` to fully provision for maximum bonuses, or
(c) Fund speed bonuses from a separate allocation rather than the claim pool.

### ECON-4: Penalty Redistribution MEV (LOW)

**Severity: LOW**
**Location:** `unstake.rs:170-179`

**Description:** When a staker unstakes early, the penalty is immediately redistributed via `share_rate`. A validator or MEV searcher who observes a pending early-unstake transaction could front-run it with a `create_stake` and back-run with `claim_rewards`, extracting a share of the penalty.

**Requirements for exploitation:**
- Attacker must hold/acquire tokens to stake.
- Attacker must know the penalty amount (predictable from on-chain state).
- Profit margin is `penalty * (attacker_shares / total_shares)`.
- The 100% early penalty on same-block unstake makes this capital-inefficient.

**Impact:** Very low practical impact. The attacker's share of the penalty is proportional to their capital commitment, and the attack window is a single transaction.

### ECON-5: `saturating_sub` Masks Accounting Errors (LOW)

**Severity: LOW**
**Location:** `math.rs:304`

**Description:**
```rust
let pending_128 = current_value.saturating_sub(reward_debt as u128);
```

If `reward_debt > current_value`, this silently returns 0 instead of erroring. While this should "never happen" in correct operation, it could mask bugs where:
- `reward_debt` is set incorrectly during migration
- A rounding error causes `reward_debt` to slightly exceed the expected value
- An overflow in `calculate_reward_debt` produces an inflated debt

**Scenario where `reward_debt > current_value`:**
1. Staker creates stake at `share_rate = 10000`. `reward_debt = t_shares * 10000`.
2. Due to a bug or rounding, `reward_debt` is stored as `t_shares * 10001`.
3. On next claim, `current_value = t_shares * current_share_rate`. If `current_share_rate` hasn't increased past 10001, `current_value < reward_debt`.
4. `saturating_sub` returns 0. Staker gets no rewards.
5. No error is raised. The bug is silently absorbed.

**Impact:** The saturating_sub cannot cause THEFT (it can only reduce rewards to 0). But it can mask bugs that would otherwise be caught early. In the worst case, a staker could permanently lose rewards if their `reward_debt` is too high due to a bug.

**Recommendation:** Add an event or log when `reward_debt > current_value` for monitoring purposes, even if the behavior is to return 0.

---

## Previous Findings Re-evaluation

### MED-2: `saturating_sub` in `math.rs:304`

**Status: Confirmed, risk LOW in practice.**

The `saturating_sub` is at the pending rewards calculation:
```rust
// math.rs:304
let pending_128 = current_value.saturating_sub(reward_debt as u128);
```

**Can `reward_debt > current_value` happen in normal operation?**

The `reward_debt` is set in two places:
1. `create_stake.rs:95`: `reward_debt = calculate_reward_debt(t_shares, share_rate)` = `t_shares * share_rate`
2. `claim_rewards.rs:118`: `stake_mut.reward_debt = calculate_reward_debt(t_shares, global_state.share_rate)`

After creation: `current_value = t_shares * current_share_rate`, `reward_debt = t_shares * creation_share_rate`.
Since `share_rate` only increases (via inflation and penalty redistribution), `current_value >= reward_debt` should always hold.

**Exception:** If `share_rate` could decrease, `current_value < reward_debt`. But `share_rate` is monotonically increasing (only `checked_add` in `crank_distribution.rs:116-118` and `unstake.rs:176-178`). **No decrease path exists.**

**Rounding concern:** `calculate_reward_debt` uses u128 intermediate and truncates to u64. The multiplication `t_shares * share_rate` as u128 is exact (no rounding). The conversion to u64 fails with `RewardDebtOverflow` if it exceeds u64::MAX. So rounding cannot cause `reward_debt > current_value`.

**Verdict: The `saturating_sub` is defensive and will never trigger in normal operation.** However, it masks potential bugs in migration or future code changes. **Risk remains LOW. Recommend keeping but adding monitoring.**

### MED-4: Singleton ClaimConfig PDA

**Status: Confirmed by design.**

`initialize_claim_period.rs:28-29` uses `seeds = [CLAIM_CONFIG_SEED]` with `init` (not `init_if_needed`). This means:
- Only ONE `ClaimConfig` can exist at a time.
- A new claim period requires the previous `ClaimConfig` PDA to be closed first (which happens implicitly when the account is re-initialized, but since `init` requires the account to not exist, the authority must somehow close it).

**Wait:** Looking more carefully, `init` in Anchor will fail if the account already exists. There is NO close instruction for `ClaimConfig`. This means **the protocol can only ever have ONE claim period.** After the first claim period, `initialize_claim_period` will always fail because the PDA already exists.

**Correction:** This is actually managed by account lifecycle. On Solana, if the account is closed (rent reclaimed), the PDA can be re-initialized. But there is no explicit close instruction. The `ClaimConfig` account would need to be closed via another mechanism (e.g., a future admin instruction, or the account could reach 0 lamports if rent-exempt is reclaimed).

**Economic Impact:** This means:
1. Only one BPD distribution can occur per protocol lifetime unless ClaimConfig is closed.
2. The `claim_period_id` parameter (which prevents ID=0 collisions) becomes less useful with only one period.
3. Future claim periods require protocol upgrade or an account-closing instruction.

**This is a significant architectural limitation but not an economic exploit.** The current design appears intentional for an MVP/initial launch with a single claim period.

---

## Economic Model Assessment

### Inflation Model

| Parameter | Value | Assessment |
|-----------|-------|------------|
| Annual inflation rate | 3.69% (3,690,000 bp) | Reasonable for PoS-style staking |
| Inflation base | `total_tokens_staked` | Conservative (doesn't compound) |
| Effective max inflation | ~5.5% (with loyalty bonus) | Undocumented, potential concern |
| Distribution frequency | Daily (slot-based) | Standard, idempotent |

### Bonus Structure

| Bonus | Range | Assessment |
|-------|-------|------------|
| LPB (Longer Pays Better) | 0-2x for 1-3641 days | Linear, reasonable |
| BPB (Bigger Pays Better) | 0-1.5x, diminishing returns | Well-tiered, but circumventable below 1.5B |
| Loyalty Bonus | 0-0.5x on inflation rewards | Creates hidden inflation |
| Speed Bonus (claims) | 0-20% | Can deplete BPD pool |

### Penalty Structure

| Penalty | Calculation | Assessment |
|---------|------------|------------|
| Early unstake | 50-100% of principal | Strong deterrent, correctly implemented |
| Late unstake | 0-100% over 351 days (after 14-day grace) | Graduated, correctly implemented |
| Penalty redistribution | Via share_rate increase | Fair, unstaker excluded |

### BPD (Big Pay Day) Economics

| Aspect | Assessment |
|--------|------------|
| Three-phase flow | Properly prevents single-batch gaming |
| 24-hour observation window | Provides transparency but relies on off-chain monitoring |
| Authority control over finalization | Trust assumption, mitigated by transparency |
| 5% per-stake cap | Circumventable via Sybil but provides friction |
| Pool size predictability | Unpredictable due to speed bonus interaction |

### Overall Protocol Economic Health

**Strengths:**
1. Burn-and-mint model eliminates token vault attack surface.
2. Lazy distribution via share_rate is gas-efficient and mathematically sound.
3. Three-phase BPD with 24-hour delay is a significant improvement.
4. `distribute_pending_inflation` called before state-changing operations prevents sandwich attacks.
5. Checked arithmetic throughout prevents overflow/underflow exploits.
6. Authority-gated BPD finalization prevents griefing.

**Weaknesses:**
1. Loyalty bonus creates undocumented additional inflation (up to 50% above stated rate).
2. BPD whale cap is circumventable via stake splitting.
3. Speed bonus + BPD pool interaction can zero out BPD distributions.
4. Singleton ClaimConfig limits protocol to one claim period.
5. BPD finalization trusts the authority to include all eligible stakes (off-chain verification only).
6. `saturating_sub` in rewards calculation silently absorbs potential accounting errors.

**Final Risk Rating:** The protocol's economic model is **sound at the core** with **well-defended boundaries** for the most critical attack vectors (flash loans, double distribution, rate manipulation). The remaining concerns are primarily in the **economic design** (loyalty inflation, BPD pool unpredictability) rather than in **exploitable bugs**. No CRITICAL economic vulnerabilities were identified.
