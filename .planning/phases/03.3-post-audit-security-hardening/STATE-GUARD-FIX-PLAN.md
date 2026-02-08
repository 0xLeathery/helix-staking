# Phase 3.3: State Guard & Vulnerability Fix Plan

**Date**: 2026-02-08
**Author**: Claude (Solana state management expert)
**Scope**: Fix HIGH-2, MED-4, MED-5, MED-6, MED-8, LOW-2 from security audit + dead code cleanup
**Status**: PLANNING (no code changes)

---

## Table of Contents

1. [Vulnerability Summary Matrix](#1-vulnerability-summary-matrix)
2. [HIGH-2: Unstake During BPD Window Token Loss](#2-high-2-unstake-during-bpd-window-token-loss)
3. [MED-4: Zero-Eligible-Stakes Infinite Finalize Loop](#3-med-4-zero-eligible-stakes-infinite-finalize-loop)
4. [MED-5: claim_period_id=0 Breaks Duplicate Prevention](#4-med-5-claim_period_id0-breaks-duplicate-prevention)
5. [MED-6: admin_mint CEI Violation](#5-med-6-admin_mint-cei-violation)
6. [MED-8: Old-Format Stakes Silently Excluded from BPD](#6-med-8-old-format-stakes-silently-excluded-from-bpd)
7. [LOW-2: BPD Bonus Lost on Unstake Without claim_rewards](#7-low-2-bpd-bonus-lost-on-unstake-without-claim_rewards)
8. [Dead Code Cleanup](#8-dead-code-cleanup)
9. [Cross-Fix Interaction Analysis](#9-cross-fix-interaction-analysis)
10. [New Error Codes Summary](#10-new-error-codes-summary)
11. [State Changes Summary](#11-state-changes-summary)
12. [Implementation Order](#12-implementation-order)
13. [Test Plan](#13-test-plan)

---

## 1. Vulnerability Summary Matrix

| ID | Severity | Fix Complexity | State Change | Migration Impact | Files Modified |
|----|----------|---------------|--------------|------------------|----------------|
| HIGH-2 | HIGH | Medium | Add `bpd_window_active` to GlobalState | None (uses reserved) | unstake.rs, global_state.rs, finalize_bpd_calculation.rs, trigger_big_pay_day.rs |
| MED-4 | MEDIUM | Trivial | None | None | finalize_bpd_calculation.rs |
| MED-5 | MEDIUM | Trivial | None | None | initialize_claim_period.rs |
| MED-6 | MEDIUM | Trivial | None | None | admin_mint.rs |
| MED-8 | MEDIUM | Medium | None | Adds migrate_stake instruction | New: migrate_stake.rs; mod.rs, lib.rs |
| LOW-2 | LOW | Low | None | None | unstake.rs |

---

## 2. HIGH-2: Unstake During BPD Window Token Loss

### Problem

The BPD distribution uses a two-phase process:
1. **finalize_bpd_calculation**: Scans all eligible stakes, accumulates total share-days, calculates global rate
2. **trigger_big_pay_day**: Distributes BPD bonus using pre-calculated rate

Between phases 1 and 2, a stake that was counted in the denominator (share-days) during finalize can be unstaked. When trigger runs, it checks `is_active` and skips the now-inactive stake. That stake's proportional share of the BPD pool is never distributed. When `big_pay_day_complete` is set, the remaining amount is zeroed out, permanently losing those tokens.

**Concrete example**:
```
Pool: 1,000,000 HELIX unclaimed
Stake A: 500 share-days, Stake B: 500 share-days
Total: 1,000 share-days -> rate = 1000 HELIX/share-day

After finalize, Stake A unstakes.
Trigger processes Stake A -> is_active=false, skip
Trigger processes Stake B -> bonus = 500 * 1000 = 500,000 HELIX
big_pay_day_complete = true, remaining 500,000 HELIX lost forever.
```

### Options Analysis

| Option | Description | Pros | Cons | Chosen |
|--------|-------------|------|------|--------|
| **(a) Guard unstake** | Prevent unstaking during BPD window | Simple, no lost tokens, preserves existing rate math | Temporarily locks user funds (days to hours) | YES |
| (b) Distribute to inactive | Trigger awards BPD to inactive stakes too | No fund locking | Complex (where do tokens go? User can't claim on inactive stake) | No |
| (c) Skip but don't zero | Let remaining amount persist for future period | No fund locking | Complicates multi-period accounting, amount trapped between periods | No |

### Recommended Fix: Option (a) -- Guard Unstake During BPD Window

**Rationale**: Option (a) is the simplest and most robust. The BPD window is bounded: finalize + trigger are permissionless operations that complete in minutes to hours (depending on stake count). Temporarily preventing unstake during this window is a minor UX friction compared to permanent token loss. Options (b) and (c) introduce complex accounting problems -- (b) requires deciding what happens to BPD on an inactive stake whose owner might never call claim_rewards again, and (c) creates zombie state that leaks across claim periods.

**Mechanism**: Use a boolean flag on GlobalState to indicate BPD calculation is in progress. Set it when finalize starts; clear it when trigger completes. Unstake checks the flag and rejects if set.

### State Changes

**GlobalState**: Repurpose first `reserved` slot as a `bpd_window_active` flag.

```
Current field:
    pub reserved: [u64; 6],   // 48 bytes

Approach: Use reserved[0] as a boolean flag (0 = inactive, 1 = active)
No byte count change. No migration needed.
```

**Why reserved[0] instead of a new field?**
GlobalState is created once at initialization. Adding a new field would require a migration instruction or realloc. The reserved array was explicitly designed for future expansion. Using `reserved[0]` is zero-migration.

### Code Changes

#### File: `programs/helix-staking/src/state/global_state.rs`

No struct change needed. Add a helper method:

```rust
// CURRENT: No helper methods on GlobalState

// NEW: Add helpers for BPD window flag
impl GlobalState {
    pub const LEN: usize = /* unchanged */;

    /// Check if BPD calculation window is active (unstaking blocked)
    pub fn is_bpd_window_active(&self) -> bool {
        self.reserved[0] != 0
    }

    /// Set BPD window flag (called by finalize_bpd_calculation on first batch)
    pub fn set_bpd_window_active(&mut self, active: bool) {
        self.reserved[0] = if active { 1 } else { 0 };
    }
}
```

#### File: `programs/helix-staking/src/instructions/unstake.rs`

```rust
// CURRENT (line 56-59):
pub fn unstake(ctx: Context<Unstake>) -> Result<()> {
    let clock = Clock::get()?;
    let global_state = &mut ctx.accounts.global_state;
    let stake = &ctx.accounts.stake_account;

// NEW (add guard after getting global_state):
pub fn unstake(ctx: Context<Unstake>) -> Result<()> {
    let clock = Clock::get()?;
    let global_state = &mut ctx.accounts.global_state;

    // HIGH-2 FIX: Prevent unstaking during BPD calculation window
    // Between finalize_bpd_calculation and trigger_big_pay_day completion,
    // unstaking would cause permanent token loss in the BPD pool
    require!(
        !global_state.is_bpd_window_active(),
        HelixError::UnstakeBlockedDuringBpd
    );

    let stake = &ctx.accounts.stake_account;
```

#### File: `programs/helix-staking/src/instructions/finalize_bpd_calculation.rs`

```rust
// CURRENT (line 38-40):
pub fn finalize_bpd_calculation<'info>(
    ctx: Context<'_, '_, 'info, 'info, FinalizeBpdCalculation<'info>>,
) -> Result<()> {
    let clock = Clock::get()?;
    let claim_config = &mut ctx.accounts.claim_config;
    let global_state = &ctx.accounts.global_state;

// NEW: Change global_state to mutable, set BPD window on first batch
// Account struct change:
#[derive(Accounts)]
pub struct FinalizeBpdCalculation<'info> {
    pub caller: Signer<'info>,

    #[account(
        mut,  // <-- CHANGED from immutable to mutable
        seeds = [GLOBAL_STATE_SEED],
        bump = global_state.bump,
    )]
    pub global_state: Account<'info, GlobalState>,
    // ... rest unchanged
}

pub fn finalize_bpd_calculation<'info>(
    ctx: Context<'_, '_, 'info, 'info, FinalizeBpdCalculation<'info>>,
) -> Result<()> {
    let clock = Clock::get()?;
    let claim_config = &mut ctx.accounts.claim_config;
    let global_state = &mut ctx.accounts.global_state;  // <-- now mutable

    // ... existing verify claim period ended check ...

    // === Determine if this is first batch ===
    let is_first_batch = claim_config.bpd_remaining_unclaimed == 0
        && claim_config.bpd_total_share_days == 0;

    // HIGH-2 FIX: Set BPD window flag on first batch
    if is_first_batch {
        global_state.set_bpd_window_active(true);
    }

    // ... rest of existing logic unchanged ...
```

#### File: `programs/helix-staking/src/instructions/trigger_big_pay_day.rs`

```rust
// CURRENT: global_state is immutable
#[derive(Accounts)]
pub struct TriggerBigPayDay<'info> {
    pub caller: Signer<'info>,

    #[account(
        seeds = [GLOBAL_STATE_SEED],
        bump = global_state.bump,
    )]
    pub global_state: Account<'info, GlobalState>,
    // ...
}

// NEW: Make global_state mutable, clear BPD window on completion
#[derive(Accounts)]
pub struct TriggerBigPayDay<'info> {
    pub caller: Signer<'info>,

    #[account(
        mut,  // <-- CHANGED from immutable to mutable
        seeds = [GLOBAL_STATE_SEED],
        bump = global_state.bump,
    )]
    pub global_state: Account<'info, GlobalState>,
    // ... rest unchanged
}

// In the function body, at EVERY location where big_pay_day_complete is set to true:

// Location 1: rate=0 early return (line 55-66)
if helix_per_share_day == 0 {
    claim_config.big_pay_day_complete = true;
    global_state.set_bpd_window_active(false);  // <-- ADD
    // ... emit event ...
    return Ok(());
}

// Location 2: empty batch last batch (line 158-183)
if is_last_batch {
    claim_config.big_pay_day_complete = true;
    global_state.set_bpd_window_active(false);  // <-- ADD
    // ... emit events ...
}

// Location 3: after distribution last batch (line 239-251)
if is_last_batch {
    claim_config.big_pay_day_complete = true;
    global_state.set_bpd_window_active(false);  // <-- ADD
    // ... emit event ...
}
```

### New Error Code

```rust
#[msg("Unstaking is temporarily blocked during Big Pay Day calculation")]
UnstakeBlockedDuringBpd,
```

### Migration Impact

None. Uses reserved[0] which is already allocated and initialized to 0 (= not active). No account realloc needed.

### Edge Cases

1. **finalize starts but trigger never called**: BPD window stays active forever, blocking unstakes. **Mitigation**: The window is only set when finalize's first batch runs (which requires claim period to have ended). trigger_big_pay_day is permissionless and can be called by anyone (including bots). In practice, the same cranker that calls finalize calls trigger. As a defense-in-depth measure, consider adding a timeout check to unstake: allow unstake if bpd_window has been active for >1 day (216,000 slots) -- but this adds complexity and may not be needed for v1.

2. **Multiple claim periods**: The flag is global, not per-period. Since only one ClaimConfig PDA can exist at a time (singleton), only one BPD process can be active. This is safe.

3. **Interaction with create_stake**: New stakes CAN be created during the BPD window. They won't be counted in finalize (already completed) or trigger (start_slot > claim period), so they cause no accounting issues.

### Test Scenarios

| Test | Action | Expected |
|------|--------|----------|
| Unstake blocked during BPD window | Finalize first batch, then try unstake | Error: UnstakeBlockedDuringBpd |
| Unstake allowed after BPD complete | Finalize + trigger complete, then unstake | Success |
| Unstake allowed before BPD starts | Normal unstake with no active claim period | Success |
| BPD window cleared on rate=0 path | Finalize with 0 unclaimed, trigger with rate=0 | Window cleared, unstake allowed |
| BPD window cleared on empty trigger | All stakes filtered, last batch empty | Window cleared, unstake allowed |
| Create stake during BPD window | Finalize first batch, create new stake | Success (new stake not counted in BPD) |

---

## 3. MED-4: Zero-Eligible-Stakes Infinite Finalize Loop

### Problem

In `finalize_bpd_calculation.rs:165-171`, when the last batch finds zero total share-days (no eligible stakes across all batches), the code resets pagination state but does NOT set `bpd_calculation_complete = true`. This creates an infinite retry loop: the caller submits the "last batch" again, it resets again, ad infinitum. BPD can never complete.

```rust
// CURRENT (line 154-171):
if is_last_batch {
    if claim_config.bpd_total_share_days > 0 {
        // ... calculate rate, set bpd_calculation_complete = true ...
    } else {
        // No eligible stakes found at all - reset pagination state
        claim_config.bpd_remaining_unclaimed = 0;
        claim_config.bpd_total_share_days = 0;
        // DO NOT set calculation_complete  <-- BUG: infinite loop
    }
}
```

### Recommended Fix

Set `bpd_calculation_complete = true` and `bpd_helix_per_share_day = 0` when no eligible stakes found. The trigger_big_pay_day instruction already handles rate=0 gracefully (line 55-66): it sets `big_pay_day_complete = true` and returns.

### Code Changes

#### File: `programs/helix-staking/src/instructions/finalize_bpd_calculation.rs`

```rust
// CURRENT (line 165-171):
    } else {
        // No eligible stakes found at all - reset pagination state
        // Keep pool pending for future distribution
        claim_config.bpd_remaining_unclaimed = 0;
        claim_config.bpd_total_share_days = 0;
        // DO NOT set calculation_complete
    }

// NEW:
    } else {
        // MED-4 FIX: No eligible stakes found across all batches.
        // Set calculation complete with rate=0 so trigger_big_pay_day
        // can finalize the period (it handles rate=0 gracefully).
        // Without this, finalize loops infinitely.
        claim_config.bpd_helix_per_share_day = 0;
        claim_config.bpd_calculation_complete = true;
    }
```

Note: We also remove the reset of `bpd_remaining_unclaimed` and `bpd_total_share_days` since they are already 0 at this point (no share-days were found, and unclaimed was set on first batch). The `bpd_remaining_unclaimed` value is still needed by trigger_big_pay_day to know the original pool size for the ClaimPeriodEnded event (though with rate=0, trigger zeroes it anyway).

### State Changes

None.

### Migration Impact

None.

### New Error Codes

None.

### Interaction with HIGH-2

If HIGH-2's BPD window guard is active and finalize completes with zero eligible stakes (rate=0), trigger_big_pay_day must still be called to clear the BPD window. This is fine: trigger handles rate=0 by setting `big_pay_day_complete = true` and (with HIGH-2 fix) clearing the window flag. The flow is:
1. finalize (no eligible stakes) -> sets `bpd_calculation_complete = true`, rate = 0, window stays active
2. trigger -> sees rate = 0, sets `big_pay_day_complete = true`, clears BPD window
3. unstake -> allowed again

### Test Scenarios

| Test | Action | Expected |
|------|--------|----------|
| Finalize with zero eligible stakes | Call finalize with empty remaining_accounts as last batch | bpd_calculation_complete = true, bpd_helix_per_share_day = 0 |
| Trigger after zero-stakes finalize | Call trigger after finalize with rate=0 | big_pay_day_complete = true, no distribution |
| Full period close with no eligible stakes | finalize (empty) -> trigger (rate=0) | Period cleanly closed, no infinite loop |

---

## 4. MED-5: claim_period_id=0 Breaks Duplicate Prevention

### Problem

`StakeAccount.bpd_claim_period_id` is initialized to 0 (via realloc::zero=true or default). The duplicate prevention in trigger_big_pay_day checks:

```rust
if stake.bpd_claim_period_id == claim_config.claim_period_id {
    continue; // Already received BPD this period
}
```

If authority passes `claim_period_id = 0` to `initialize_claim_period`, then `claim_config.claim_period_id = 0`. Every stake's default `bpd_claim_period_id` is also 0. The check `0 == 0` evaluates to true, and ALL stakes are skipped as "already received BPD". No BPD is distributed. The entire unclaimed pool is lost when `big_pay_day_complete` is set.

### Recommended Fix

Add a validation in `initialize_claim_period` requiring `claim_period_id > 0`. This is the simplest and most defensive fix. Period IDs are authority-chosen, and starting at 1 is natural (period 1, period 2, ...).

### Code Changes

#### File: `programs/helix-staking/src/instructions/initialize_claim_period.rs`

```rust
// CURRENT (line 35-41):
pub fn initialize_claim_period(
    ctx: Context<InitializeClaimPeriod>,
    merkle_root: [u8; 32],
    total_claimable: u64,
    total_eligible: u32,
    claim_period_id: u32,
) -> Result<()> {
    let clock = Clock::get()?;

// NEW (add validation immediately after parameters):
pub fn initialize_claim_period(
    ctx: Context<InitializeClaimPeriod>,
    merkle_root: [u8; 32],
    total_claimable: u64,
    total_eligible: u32,
    claim_period_id: u32,
) -> Result<()> {
    // MED-5 FIX: Prevent claim_period_id=0 which collides with
    // StakeAccount's default bpd_claim_period_id=0, causing all
    // stakes to be skipped in trigger_big_pay_day
    require!(claim_period_id > 0, HelixError::InvalidClaimPeriodId);

    let clock = Clock::get()?;
```

### New Error Code

```rust
#[msg("Claim period ID must be greater than 0")]
InvalidClaimPeriodId,
```

### State Changes

None.

### Migration Impact

None. This is a parameter validation, not a state change.

### Test Scenarios

| Test | Action | Expected |
|------|--------|----------|
| Reject claim_period_id=0 | Call initialize_claim_period with claim_period_id=0 | Error: InvalidClaimPeriodId |
| Accept claim_period_id=1 | Call initialize_claim_period with claim_period_id=1 | Success |
| Accept claim_period_id=u32::MAX | Call with large valid ID | Success |

---

## 5. MED-6: admin_mint CEI Violation

### Problem

In `admin_mint.rs`, the `total_admin_minted` state update happens AFTER the CPI `mint_to` call (line 80). This violates the Check-Effects-Interactions (CEI) pattern. While SPL Token 2022's `mint_to` cannot trigger a callback to the helix-staking program (no reentrant path exists), this is still a best-practice violation that should be fixed for defense-in-depth.

```rust
// CURRENT order (lines 66-80):
// 1. CPI: mint_to (INTERACTION)
token_2022::mint_to(/* ... */, amount)?;

// 2. State update (EFFECT -- happens AFTER interaction)
global_state.total_admin_minted = new_total;
```

### Recommended Fix

Move state update before CPI.

### Code Changes

#### File: `programs/helix-staking/src/instructions/admin_mint.rs`

```rust
// CURRENT (lines 57-80):
    // Create PDA signer seeds
    let mint_authority_seeds = &[
        MINT_AUTHORITY_SEED,
        &[global_state.mint_authority_bump],
    ];
    let signer_seeds = &[&mint_authority_seeds[..]];

    // Mint tokens to recipient
    token_2022::mint_to(
        CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            token_2022::MintTo {
                mint: ctx.accounts.mint.to_account_info(),
                to: ctx.accounts.recipient_token_account.to_account_info(),
                authority: ctx.accounts.mint_authority.to_account_info(),
            },
            signer_seeds,
        ),
        amount,
    )?;

    // Update admin mint counter
    global_state.total_admin_minted = new_total;

// NEW (move state update before CPI):
    // MED-6 FIX: Update state BEFORE CPI (CEI pattern)
    global_state.total_admin_minted = new_total;

    // Create PDA signer seeds
    let mint_authority_seeds = &[
        MINT_AUTHORITY_SEED,
        &[global_state.mint_authority_bump],
    ];
    let signer_seeds = &[&mint_authority_seeds[..]];

    // Mint tokens to recipient
    token_2022::mint_to(
        CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            token_2022::MintTo {
                mint: ctx.accounts.mint.to_account_info(),
                to: ctx.accounts.recipient_token_account.to_account_info(),
                authority: ctx.accounts.mint_authority.to_account_info(),
            },
            signer_seeds,
        ),
        amount,
    )?;
```

### State Changes

None.

### Migration Impact

None.

### New Error Codes

None.

### Test Scenarios

| Test | Action | Expected |
|------|--------|----------|
| admin_mint succeeds | Call admin_mint with valid amount | Success, total_admin_minted updated |
| admin_mint cap enforced | Call admin_mint exceeding cap | Error: AdminMintCapExceeded (unchanged behavior) |

Note: Existing tests should pass unchanged. This is a reordering, not a logic change.

---

## 6. MED-8: Old-Format Stakes Silently Excluded from BPD

### Problem

Pre-migration stakes (92 bytes, the `OLD_LEN`) are silently skipped by the `data.len() < StakeAccount::LEN` check in both `finalize_bpd_calculation.rs:87` and `trigger_big_pay_day.rs:86`. Users with old-format stakes lose their BPD entitlement with no error, warning, or on-chain indication.

```rust
// In both finalize and trigger:
let data = account_info.try_borrow_data()?;
if data.len() < StakeAccount::LEN {
    continue;  // Silently skip 92-byte stakes
}
```

`StakeAccount::LEN` is 113 bytes. Old stakes are 92 bytes. The `realloc` in `claim_rewards.rs` migrates stakes to 113 bytes, but only when the user calls `claim_rewards`. Stakes that never called claim_rewards remain at 92 bytes.

### Options Analysis

| Option | Description | Pros | Cons | Chosen |
|--------|-------------|------|------|--------|
| **(a) migrate_stake instruction** | Standalone instruction to realloc old stakes | Explicit, user-friendly, transparent | Requires new instruction + rent payment | YES |
| (b) Accept and document | Mark as known limitation | No code change | Users lose tokens silently | No |
| (c) Realloc in finalize/trigger | Have BPD instructions attempt realloc | Automatic migration | Complex (needs payer account, writable), finalize is read-only for stakes | No |

### Recommended Fix: Option (a) -- Add `migrate_stake` Instruction

**Rationale**: Option (a) is explicit and safe. Users (or a UI/crank) can call `migrate_stake` to realloc old stakes before BPD distribution. Option (c) is rejected because finalize_bpd_calculation intentionally processes stakes as read-only (via remaining_accounts), and adding payer/realloc logic to both finalize and trigger is complex and error-prone. Option (b) is rejected because silent token loss is unacceptable.

The `migrate_stake` instruction reallocs the stake account from `OLD_LEN` (92 bytes) to `LEN` (113 bytes) and initializes new fields to safe defaults. Since `claim_rewards.rs` already uses `realloc::zero=true`, the new `migrate_stake` instruction follows the same pattern.

### Code Changes

#### New File: `programs/helix-staking/src/instructions/migrate_stake.rs`

```rust
use anchor_lang::prelude::*;
use anchor_lang::system_program;

use crate::constants::*;
use crate::error::HelixError;
use crate::state::StakeAccount;

#[derive(Accounts)]
pub struct MigrateStake<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,

    #[account(
        mut,
        seeds = [
            STAKE_SEED,
            stake_account.user.as_ref(),
            &stake_account.stake_id.to_le_bytes()
        ],
        bump = stake_account.bump,
        realloc = StakeAccount::LEN,
        realloc::payer = payer,
        realloc::zero = true,
    )]
    pub stake_account: Account<'info, StakeAccount>,

    pub system_program: Program<'info, System>,
}

pub fn migrate_stake(ctx: Context<MigrateStake>) -> Result<()> {
    // The realloc constraint already expanded the account and
    // zero-initialized new bytes. New fields default to:
    //   bpd_bonus_pending: 0
    //   bpd_eligible: false
    //   claim_period_start_slot: 0
    //   bpd_claim_period_id: 0
    //
    // These are all safe defaults:
    //   - 0 bonus pending (correct)
    //   - false eligible (conservative: finalize/trigger use slot checks anyway)
    //   - 0 claim period start (not used in eligibility)
    //   - 0 claim period id (means "never received BPD", since periods start at 1)

    // No additional logic needed. Anchor's realloc handles everything.
    // Emit an event for indexers if desired.

    Ok(())
}
```

#### File: `programs/helix-staking/src/instructions/mod.rs`

```rust
// ADD at end:
pub mod migrate_stake;
pub use migrate_stake::*;
```

#### File: `programs/helix-staking/src/lib.rs`

```rust
// ADD after finalize_bpd_calculation handler:
pub fn migrate_stake(ctx: Context<MigrateStake>) -> Result<()> {
    instructions::migrate_stake::migrate_stake(ctx)
}
```

### Who Pays for Realloc?

The `payer` signer pays the rent difference. This is ~0.0003 SOL for 21 bytes of additional space. The payer does NOT need to be the stake owner -- anyone can migrate any stake (permissionless). This allows a crank or the protocol team to batch-migrate old stakes before BPD distribution.

### State Changes

None to existing state structs. New instruction only.

### Migration Impact

This IS the migration. After calling `migrate_stake`, old 92-byte stakes become 113-byte stakes and are eligible for BPD.

### New Error Codes

None needed. If the stake is already at LEN (113 bytes), `realloc` is a no-op (Anchor handles this).

### Test Scenarios

| Test | Action | Expected |
|------|--------|----------|
| Migrate 92-byte stake | Create stake with old layout, call migrate_stake | Account expanded to 113 bytes, new fields zeroed |
| Migrate already-migrated stake | Call migrate_stake on 113-byte stake | No-op (realloc to same size) |
| Permissionless migration | Non-owner pays for migration | Success (payer != user) |
| BPD includes migrated stake | Migrate old stake, then run finalize + trigger | Migrated stake receives BPD |
| BPD excludes non-migrated stake | Run finalize + trigger with 92-byte stake in remaining_accounts | Stake silently skipped (existing behavior, but now documented) |

### Frontend/Documentation Requirement

The UI should check stake account data length and prompt users to call `migrate_stake` before BPD distribution. The protocol team should run a crank to batch-migrate all old stakes ahead of each BPD period.

---

## 7. LOW-2: BPD Bonus Lost on Unstake Without claim_rewards

### Problem

When a user unstakes, the `total_mint_amount` calculation in `unstake.rs:108` includes:
- `return_amount` (staked_amount - penalty)
- `pending_rewards` (from share_rate distribution)

But it does NOT include `bpd_bonus_pending`. If a user received a BPD bonus via `trigger_big_pay_day` but unstakes without first calling `claim_rewards`, the BPD bonus is permanently lost (stake becomes inactive, claim_rewards requires active stake).

### Recommended Fix: Option (a) -- Include bpd_bonus_pending in Unstake Mint

**Rationale**: This is the user-friendly approach. Users should not need to know about the BPD claim step before unstaking. Including the bonus in the unstake return is consistent with how `pending_rewards` is already handled -- it too is accumulated lazily and included in the unstake payout.

### Code Changes

#### File: `programs/helix-staking/src/instructions/unstake.rs`

```rust
// CURRENT (line 61-68):
    // Save values we'll need later (before mutating stake)
    let stake_user = stake.user;
    let stake_id = stake.stake_id;
    let staked_amount = stake.staked_amount;
    let t_shares = stake.t_shares;
    let start_slot = stake.start_slot;
    let end_slot = stake.end_slot;
    let reward_debt = stake.reward_debt;

// NEW (also save bpd_bonus_pending):
    let stake_user = stake.user;
    let stake_id = stake.stake_id;
    let staked_amount = stake.staked_amount;
    let t_shares = stake.t_shares;
    let start_slot = stake.start_slot;
    let end_slot = stake.end_slot;
    let reward_debt = stake.reward_debt;
    let bpd_bonus = stake.bpd_bonus_pending;  // LOW-2 FIX


// CURRENT (line 107-110):
    // Total amount to mint to user (return + rewards)
    let total_mint_amount = return_amount
        .checked_add(pending_rewards)
        .ok_or(HelixError::Overflow)?;

// NEW (include BPD bonus):
    // Total amount to mint to user (return + rewards + BPD bonus)
    // LOW-2 FIX: Include bpd_bonus_pending so users don't lose
    // BPD bonus if they unstake before calling claim_rewards
    let total_mint_amount = return_amount
        .checked_add(pending_rewards)
        .ok_or(HelixError::Overflow)?
        .checked_add(bpd_bonus)
        .ok_or(HelixError::Overflow)?;


// Also clear the bonus on the stake (after line 114):
// CURRENT (line 112-114):
    let stake_mut = &mut ctx.accounts.stake_account;
    stake_mut.is_active = false;

// NEW:
    let stake_mut = &mut ctx.accounts.stake_account;
    stake_mut.is_active = false;
    stake_mut.bpd_bonus_pending = 0;  // LOW-2 FIX: Clear after including in payout
```

#### Update StakeEnded Event

The `StakeEnded` event should distinguish BPD bonus from regular rewards for indexer clarity:

```rust
// CURRENT event emission (line 165-174):
    emit!(StakeEnded {
        slot: clock.slot,
        user: stake_user,
        stake_id,
        original_amount: staked_amount,
        return_amount,
        penalty_amount: penalty,
        penalty_type,
        rewards_claimed: pending_rewards,
    });

// NEW (include BPD bonus in rewards_claimed total):
    emit!(StakeEnded {
        slot: clock.slot,
        user: stake_user,
        stake_id,
        original_amount: staked_amount,
        return_amount,
        penalty_amount: penalty,
        penalty_type,
        rewards_claimed: pending_rewards
            .checked_add(bpd_bonus)
            .unwrap_or(pending_rewards),  // Defensive: don't fail event on overflow
    });
```

Note: Adding a separate `bpd_bonus_claimed` field to the event would be ideal for indexers, but it changes the event layout which may break existing indexer code. For now, include BPD in the total rewards_claimed. A separate event field can be added in a future version.

### State Changes

None.

### Migration Impact

None.

### New Error Codes

None.

### Test Scenarios

| Test | Action | Expected |
|------|--------|----------|
| Unstake includes BPD bonus | Receive BPD, then unstake without claim_rewards | total_mint_amount includes bpd_bonus_pending |
| Unstake with zero BPD | Unstake with no BPD bonus | Behavior unchanged (bpd_bonus = 0) |
| BPD cleared after unstake | Unstake with BPD bonus, check stake account | bpd_bonus_pending = 0 |
| claim_rewards then unstake | Claim rewards (clears BPD), then unstake | No double-payout (BPD already 0) |

---

## 8. Dead Code Cleanup

### 8a. `bpd_eligible` Flag (StakeAccount)

**Current state**: Set in `create_stake.rs:136` based on claim period status. Never read by any instruction. `trigger_big_pay_day` and `finalize_bpd_calculation` use slot-based validation instead.

**Recommendation: Mark as deprecated, do NOT remove.**

Removing the field would change the byte layout and break deserialization of all existing stakes. The field occupies 1 byte -- negligible cost. Keep it in the struct with a deprecation comment:

```rust
/// DEPRECATED: Set by create_stake but never checked.
/// trigger_big_pay_day uses slot-based validation instead.
/// Kept for layout compatibility with existing accounts.
pub bpd_eligible: bool,
```

**Why not use it?** The slot-based validation in finalize/trigger is more robust. The `bpd_eligible` flag is set at stake creation time based on whether a claim period is active at that moment. But BPD eligibility is actually determined by whether the stake's `start_slot` falls within the claim period's `[start_slot, end_slot]` range. These could theoretically diverge (e.g., if the claim period PDA is not passed in remaining_accounts during create_stake, `bpd_eligible` is false even though the stake IS in the period). The slot-based check in finalize/trigger is the authoritative source of truth.

**Action in create_stake.rs**: Optionally remove the ClaimConfig lookup logic (lines 109-134) and just set `bpd_eligible = false` and `claim_period_start_slot = 0` always. This simplifies create_stake without breaking the struct layout. However, this is cosmetic and not security-critical -- defer to Phase 4 cleanup.

### 8b. `ClaimConfig.authority` Field

**Current state**: Set in `initialize_claim_period.rs:56`. Never read by any instruction. The actual authority check uses `GlobalState.authority` in the account constraint (line 13).

**Recommendation: Mark as deprecated, do NOT remove.**

Same rationale as bpd_eligible: removing it would change ClaimConfig's byte layout. Since ClaimConfig is re-created per period, this is less impactful than StakeAccount, but it's still cleaner to keep for backward compatibility and just add a deprecation comment:

```rust
/// DEPRECATED: Authority is checked via GlobalState.authority constraint
/// in InitializeClaimPeriod accounts struct. This field is redundant.
/// Kept for layout compatibility.
pub authority: Pubkey,
```

The 32 bytes of wasted space per ClaimConfig (one account total) is negligible. Removing it would save ~0.00023 SOL in rent for one account.

### 8c. `claim_period_start_slot` on StakeAccount

**Current state**: Set in `create_stake.rs:137`. Never read by any instruction. Finalize and trigger calculate BPD eligibility using `stake.start_slot` and `claim_config.start_slot`/`claim_config.end_slot`.

**Recommendation: Mark as deprecated, do NOT remove.**

Same layout-compatibility reasoning. 8 bytes per stake account. Add deprecation comment:

```rust
/// DEPRECATED: Set by create_stake but never read.
/// BPD eligibility uses stake.start_slot vs claim_config slot range.
/// Kept for layout compatibility with existing accounts.
pub claim_period_start_slot: u64,
```

### Summary of Dead Code Actions

| Field | Location | Size | Action | Reason |
|-------|----------|------|--------|--------|
| `bpd_eligible` | StakeAccount | 1 byte | Deprecation comment | Layout compatibility |
| `claim_period_start_slot` | StakeAccount | 8 bytes | Deprecation comment | Layout compatibility |
| `authority` | ClaimConfig | 32 bytes | Deprecation comment | Layout compatibility |

Total wasted space: 9 bytes/stake + 32 bytes/claim period. Acceptable for v1.

---

## 9. Cross-Fix Interaction Analysis

### HIGH-2 x MED-4: BPD Window + Zero-Stakes Finalize

**Interaction**: If finalize sets the BPD window active (HIGH-2) but finds zero eligible stakes (MED-4), the window must be cleared. With the MED-4 fix, finalize sets `bpd_calculation_complete = true` and rate = 0. Then trigger sees rate = 0, sets `big_pay_day_complete = true`, and (with HIGH-2 fix) clears the BPD window. The flow is correct.

**Edge case**: What if finalize completes with rate = 0 and nobody calls trigger? The BPD window stays active. This is the same edge case discussed in HIGH-2. Since trigger is permissionless, any crank can call it. The window flag has a clear lifecycle: set by finalize -> cleared by trigger.

### HIGH-2 x LOW-2: BPD Window + Unstake Includes Bonus

**Interaction**: If the BPD window is active, unstake is blocked (HIGH-2). This means LOW-2's bonus inclusion only applies when the BPD window is NOT active. This is correct: if the window is active, the user hasn't received their BPD yet (trigger hasn't run), so there's no bonus to include. If the window is not active (trigger completed or no BPD process), any existing bonus is included.

There is one subtle scenario: User receives BPD bonus from a PREVIOUS claim period (bonus pending from period 1) but a NEW claim period's BPD window is active (period 2 finalize in progress). The user can't unstake to get their period-1 bonus. This is acceptable: the BPD window is short-lived, and the user can claim_rewards separately to get the period-1 bonus before the period-2 finalize starts.

### MED-5 x Phase 3.2 (CRIT-2 Fix): Claim Period ID Validation

**Interaction**: The Phase 3.2 fix added `bpd_claim_period_id` tracking that assumes period IDs start at 1 (default 0 = "never received"). MED-5 ensures this assumption holds by requiring `claim_period_id > 0`. These fixes are complementary and reinforce each other.

### MED-8 x finalize/trigger: Migrated Stakes in BPD

**Interaction**: After running `migrate_stake`, old 92-byte stakes become 113-byte stakes. They then pass the `data.len() < StakeAccount::LEN` check and are included in finalize/trigger. The migrated stake's new fields (bpd_bonus_pending=0, bpd_claim_period_id=0) are safe defaults. This interaction is correct.

### MED-8 x HIGH-2: Migration During BPD Window

**Interaction**: `migrate_stake` is a standalone instruction that does not read GlobalState and is not blocked by the BPD window. Users can migrate stakes during the BPD window. However, the newly migrated stake was already missed by finalize (it was 92 bytes when finalize scanned it). It will be 113 bytes when trigger runs, but trigger only distributes to stakes counted in finalize's share-days denominator. If a newly migrated stake passes trigger's eligibility checks but wasn't in finalize's total, the rate calculation is slightly off (denominator is too small).

**Mitigation**: This is a minor over-distribution, bounded by the migrated stake's share-days as a fraction of total share-days. In practice, the protocol team should batch-migrate all old stakes BEFORE finalize runs. Document this in the migration runbook.

### MED-6 (admin_mint CEI): No Cross-Interactions

The admin_mint CEI fix is a pure code reordering with no functional change. It does not interact with any other fix.

---

## 10. New Error Codes Summary

Add to `programs/helix-staking/src/error.rs`:

```rust
// After existing error codes:

#[msg("Unstaking is temporarily blocked during Big Pay Day calculation")]
UnstakeBlockedDuringBpd,

#[msg("Claim period ID must be greater than 0")]
InvalidClaimPeriodId,
```

Full updated enum (showing new entries):

```rust
#[error_code]
pub enum HelixError {
    // ... existing codes ...
    BpdCalculationNotComplete,
    BpdCalculationAlreadyComplete,

    // Phase 3.3 additions:
    #[msg("Unstaking is temporarily blocked during Big Pay Day calculation")]
    UnstakeBlockedDuringBpd,
    #[msg("Claim period ID must be greater than 0")]
    InvalidClaimPeriodId,
}
```

---

## 11. State Changes Summary

### GlobalState

| Change | Type | Migration | Notes |
|--------|------|-----------|-------|
| `reserved[0]` used as BPD window flag | Semantic only | None | Already initialized to 0 |
| Add helper methods | Code only | None | `is_bpd_window_active()`, `set_bpd_window_active()` |

**No byte count change.** LEN stays the same.

### StakeAccount

| Change | Type | Migration | Notes |
|--------|------|-----------|-------|
| Deprecation comments on bpd_eligible, claim_period_start_slot | Comment only | None | No byte change |

**No byte count change.** LEN stays at 113.

### ClaimConfig

| Change | Type | Migration | Notes |
|--------|------|-----------|-------|
| Deprecation comment on authority | Comment only | None | No byte change |

**No byte count change.** LEN stays at 168.

### New Accounts

None.

### New Instructions

| Instruction | File | Purpose |
|-------------|------|---------|
| `migrate_stake` | migrate_stake.rs | Realloc old 92-byte stakes to 113 bytes |

---

## 12. Implementation Order

Fixes should be implemented in dependency order:

```
Step 1: MED-5 (claim_period_id validation)
  - No dependencies
  - Trivial change (1 line + 1 error code)
  - Protects duplicate prevention from Phase 3.2

Step 2: MED-6 (admin_mint CEI)
  - No dependencies
  - Trivial reordering
  - Can be done in parallel with Step 1

Step 3: MED-4 (zero-stakes finalize loop)
  - No dependencies
  - Small change in finalize_bpd_calculation.rs
  - Can be done in parallel with Steps 1-2

Step 4: HIGH-2 (BPD window guard)
  - Depends on MED-4 (the zero-stakes path must be fixed first
    to ensure the window is always eventually cleared)
  - Touches 4 files: global_state.rs, unstake.rs,
    finalize_bpd_calculation.rs, trigger_big_pay_day.rs

Step 5: LOW-2 (BPD bonus in unstake)
  - Depends on HIGH-2 (the unstake file is modified by both;
    apply HIGH-2 first to avoid merge conflicts)
  - Changes unstake.rs only

Step 6: MED-8 (migrate_stake instruction)
  - No strict dependency on other fixes
  - But should come after HIGH-2 since the interaction analysis
    (Section 9) documents the migration-during-BPD-window behavior
  - New file + mod.rs + lib.rs changes

Step 7: Dead code deprecation comments
  - No dependencies
  - Comments only, can be done at any time
  - Do in same commit as the fix that touches each file
```

**Suggested commit grouping**:

1. **Commit 1**: MED-5 + MED-6 (trivial fixes, independent)
   - Files: initialize_claim_period.rs, admin_mint.rs, error.rs

2. **Commit 2**: MED-4 + HIGH-2 (BPD window lifecycle)
   - Files: finalize_bpd_calculation.rs, trigger_big_pay_day.rs, unstake.rs, global_state.rs, error.rs

3. **Commit 3**: LOW-2 (unstake BPD bonus)
   - Files: unstake.rs

4. **Commit 4**: MED-8 (migrate_stake)
   - Files: new migrate_stake.rs, mod.rs, lib.rs

5. **Commit 5**: Dead code deprecation comments
   - Files: stake_account.rs, claim_config.rs, create_stake.rs (optional)

---

## 13. Test Plan

### Unit Tests (Rust, in math.rs or new test module)

None needed for these fixes. All changes are in instruction logic, tested via integration tests.

### Integration Tests (TypeScript, Bankrun)

#### New Test File: `tests/bankrun/phase3.3/securityHardening.test.ts`

```
describe("Phase 3.3: Security Hardening", () => {

  describe("HIGH-2: BPD Window Guard", () => {
    it("blocks unstake during BPD calculation window");
    it("allows unstake before BPD window opens");
    it("allows unstake after BPD window closes (trigger complete)");
    it("clears BPD window on rate=0 trigger path");
    it("clears BPD window on empty-batch last trigger path");
    it("allows create_stake during BPD window");
  });

  describe("MED-4: Zero-Stakes Finalize", () => {
    it("sets bpd_calculation_complete when no eligible stakes found");
    it("sets bpd_helix_per_share_day=0 when no eligible stakes");
    it("allows trigger_big_pay_day after zero-stakes finalize");
    it("completes full period close with zero eligible stakes");
  });

  describe("MED-5: Claim Period ID Validation", () => {
    it("rejects claim_period_id=0");
    it("accepts claim_period_id=1");
  });

  describe("MED-6: admin_mint CEI", () => {
    it("updates total_admin_minted correctly (existing test, verify still passes)");
  });

  describe("MED-8: Stake Migration", () => {
    it("migrates 92-byte stake to 113 bytes");
    it("is no-op for already-migrated stake");
    it("allows non-owner to pay for migration");
    it("migrated stake is eligible for BPD");
  });

  describe("LOW-2: BPD Bonus in Unstake", () => {
    it("includes bpd_bonus_pending in unstake payout");
    it("clears bpd_bonus_pending after unstake");
    it("no double-payout if claim_rewards then unstake");
    it("handles zero bpd_bonus correctly");
  });

});
```

#### Existing Tests to Verify (Regression)

All existing Phase 3 tests must pass unchanged:
- `tests/bankrun/phase3/triggerBpd.test.ts` (13 tests)
- `tests/bankrun/phase3/freeClaim.test.ts` (if exists)
- `tests/bankrun/staking.test.ts` (core staking tests)
- `tests/bankrun/adminMint.test.ts` (if exists)

### Edge Case Tests

| Scenario | Setup | Expected |
|----------|-------|----------|
| BPD window timeout | Set window, never call trigger, advance 2 days | Window stays active (document as known limitation) |
| Migrate during BPD window | Finalize starts, migrate old stake, trigger runs | Migrated stake may/may not get BPD depending on timing (document) |
| Multiple claim periods | Period 1 complete, period 2 starts with id=2 | No cross-period interference |
| Unstake with max BPD bonus | Large bonus + large rewards + large return | No overflow (checked_add protects) |
| Zero-everything path | No stakes, no claims, finalize empty, trigger rate=0 | Clean period close |

---

## Appendix A: Files Modified (Complete List)

| File | Fixes Applied |
|------|---------------|
| `programs/helix-staking/src/error.rs` | HIGH-2 (new error), MED-5 (new error) |
| `programs/helix-staking/src/state/global_state.rs` | HIGH-2 (helper methods) |
| `programs/helix-staking/src/state/stake_account.rs` | Dead code (deprecation comments) |
| `programs/helix-staking/src/state/claim_config.rs` | Dead code (deprecation comment) |
| `programs/helix-staking/src/instructions/unstake.rs` | HIGH-2 (guard), LOW-2 (include bonus) |
| `programs/helix-staking/src/instructions/finalize_bpd_calculation.rs` | MED-4 (complete on zero), HIGH-2 (set window) |
| `programs/helix-staking/src/instructions/trigger_big_pay_day.rs` | HIGH-2 (clear window) |
| `programs/helix-staking/src/instructions/initialize_claim_period.rs` | MED-5 (validate id > 0) |
| `programs/helix-staking/src/instructions/admin_mint.rs` | MED-6 (CEI reorder) |
| `programs/helix-staking/src/instructions/migrate_stake.rs` | MED-8 (NEW file) |
| `programs/helix-staking/src/instructions/mod.rs` | MED-8 (register module) |
| `programs/helix-staking/src/lib.rs` | MED-8 (register instruction) |
| `programs/helix-staking/src/instructions/create_stake.rs` | Dead code (optional: simplify bpd_eligible logic) |

---

## Appendix B: Rejected Alternatives

### HIGH-2 Alternative: Distribute BPD to Inactive Stakes

If unstaked stakes still received BPD, the bonus would be written to `bpd_bonus_pending` on a stake where `is_active = false`. The user could never claim it (claim_rewards requires active stake). We'd need to either:
- Allow claim_rewards on inactive stakes (dangerous: could re-activate reward_debt accounting)
- Auto-include it in a future unstake (but unstake already happened)
- Create a separate `claim_bpd_bonus` instruction for inactive stakes

All of these add significant complexity. Blocking unstake during the BPD window is simpler.

### HIGH-2 Alternative: Skip But Don't Zero Remaining

This would leave `bpd_remaining_unclaimed > 0` after trigger completes. But the amount represents BPD for stakes that no longer exist. It can never be distributed correctly because the share-days denominator included those stakes. The remaining amount would be either:
- Rolled to the next period (unfair: next period's stakes didn't earn it)
- Held forever (dead tokens)
- Returned to authority (requires new instruction + policy decision)

The accounting becomes messy. Preventing unstake is cleaner.

### MED-8 Alternative: Realloc in Finalize/Trigger

This would require:
1. Making all remaining_accounts writable in finalize (currently read-only conceptually)
2. Adding a `payer` account to both finalize and trigger (extra rent payment)
3. Calling `AccountInfo::realloc` manually (bypasses Anchor safety)
4. Handling partial failure (some stakes migrated, others not)

This is complex, error-prone, and changes the security model of finalize (from read-only scan to read-write). The standalone `migrate_stake` instruction is much cleaner.

---

_End of Plan_
