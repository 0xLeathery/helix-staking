---
type: report
title: "Agent #4: Access Control & Authorization Audit"
created: 2026-02-16
tags:
  - security
  - audit
  - access-control
  - authorization
related:
  - "[[CONSOLIDATED-SECURITY-AUDIT]]"
  - "[[SECURITY-HARDENING-01]]"
---

# Agent #4: Access Control & Authorization Audit

## Executive Summary

This audit comprehensively reviews every instruction in the HELIX Staking Protocol for access control correctness, signer validation, constraint completeness, and user isolation. **All 17 instructions and 1 initialization handler** were analyzed across 20+ source files.

**Overall Assessment: STRONG with minor observations.**

The protocol demonstrates mature access control patterns:
- All admin functions are properly authority-gated via `Signer` + `constraint` or `has_one`
- The two-step authority transfer is correctly implemented with BPD-window blocking
- Ed25519 signature verification is robust with proper introspection
- User isolation via PDA seeds and `has_one`/`constraint` checks is comprehensive
- The CRIT-1, HIGH-1, and HIGH-2 fixes from the Feb 8 audit are confirmed properly implemented
- Permissionless instructions (`crank_distribution`, `trigger_big_pay_day`) have appropriate guards against abuse

**New findings: 0 CRITICAL, 0 HIGH, 1 MEDIUM, 2 LOW, 3 INFO**

---

## Authorization Analysis of CRIT/HIGH Fixes

### CRIT-1 FIX: Per-Batch BPD Rate (trigger_big_pay_day.rs:200-211)
**Status: VERIFIED CORRECT**

The zero-bonus processing path at lines 200-211 now correctly:
1. Increments `bpd_stakes_distributed` counter (line 201-203)
2. Marks the zero-bonus stake with `bpd_claim_period_id` (line 208)
3. Serializes the updated stake back (line 209)

This prevents zero-bonus stakes from being re-submitted in subsequent batches, which was the core of CRIT-1.

**Access control aspect**: The `bpd_claim_period_id` guard at line 129 ensures no stake can receive BPD twice per period, regardless of who calls the permissionless `trigger_big_pay_day`.

### HIGH-1 FIX: Authority-Gated finalize_bpd_calculation
**Status: VERIFIED CORRECT**

`finalize_bpd_calculation.rs:15-17`:
```rust
#[account(
    constraint = caller.key() == global_state.authority @ HelixError::Unauthorized
)]
pub caller: Signer<'info>,
```

This is the critical fix from the Feb 8 audit. Previously permissionless, `finalize_bpd_calculation` is now authority-only. This prevents the attack where a malicious caller could control which stakes are included in the finalize phase. The authority constraint is enforced at the Anchor accounts validation level, meaning it fails before any instruction logic executes.

### HIGH-2 FIX: BPD Window Blocking Unstakes
**Status: VERIFIED CORRECT**

- `unstake.rs:67`: `require!(!global_state.is_bpd_window_active(), HelixError::UnstakeBlockedDuringBpd)`
- Window is SET in `finalize_bpd_calculation.rs:86`: `global_state.set_bpd_window_active(true)`
- Window is CLEARED in `trigger_big_pay_day.rs:77,255` and `abort_bpd.rs:72`
- The `is_bpd_window_active()` method uses `reserved[0]` at `global_state.rs:62-64`

**All window set/clear paths are verified consistent.** There is no path where the window can remain stuck active without authority intervention (via `abort_bpd`).

### HIGH-2 FIX: abort_bpd Authority Gate
**Status: VERIFIED CORRECT**

`abort_bpd.rs:10-16`:
```rust
#[account(
    mut,
    seeds = [GLOBAL_STATE_SEED],
    bump = global_state.bump,
    has_one = authority,
)]
pub global_state: Account<'info, GlobalState>,
// ...
pub authority: Signer<'info>,
```

Uses `has_one = authority` which verifies `global_state.authority == authority.key()`. Combined with `authority: Signer<'info>`, this is the strongest form of authority check in Anchor.

### HIGH-2 FIX: seal_bpd_finalize Authority Gate
**Status: VERIFIED CORRECT**

`seal_bpd_finalize.rs:10-12`:
```rust
#[account(
    constraint = authority.key() == global_state.authority @ HelixError::Unauthorized
)]
pub authority: Signer<'info>,
```

Authority-gated with explicit constraint. Additionally enforces:
- 24-hour observation window (`BPD_SEAL_DELAY_SECONDS = 86400`) at lines 49-58
- `expected_finalized_count` must match on-chain count (line 63-66)
- At least one stake must have been finalized (line 43-46)

---

## Complete Access Control Matrix

| # | Instruction | File | Required Signers | Authorization Checks | Perm Type | Notes |
|---|-------------|------|-----------------|---------------------|-----------|-------|
| 1 | `initialize` | `lib.rs:23` | `authority: Signer` | Init-only (PDA `init`) | Permissioned (deployer) | GlobalState PDA is `init` so can only be called once |
| 2 | `create_stake` | `create_stake.rs:13` | `user: Signer` | User signs, PDA derived from `user.key()` | User-permissioned | Stake PDA seeds include user pubkey |
| 3 | `crank_distribution` | `crank_distribution.rs:11` | `cranker: Signer` | None (any signer) | **Permissionless** | Safe: idempotent, only advances day counter |
| 4 | `unstake` | `unstake.rs:12` | `user: Signer` | `constraint = stake_account.user == user.key()` (line 27) | User-permissioned | + `is_active` check + BPD window block |
| 5 | `claim_rewards` | `claim_rewards.rs:13` | `user: Signer` | `constraint = stake_account.user == user.key()` (line 28) | User-permissioned | + `is_active` check |
| 6 | `admin_mint` | `admin_mint.rs:11` | `authority: Signer` | `constraint = global_state.authority == authority.key()` (line 19) | Admin-only | + mint cap check |
| 7 | `initialize_claim_period` | `initialize_claim_period.rs:9` | `authority: Signer` | `constraint = authority.key() == global_state.authority` (line 13) | Admin-only | `init` PDA prevents re-initialization |
| 8 | `free_claim` | `free_claim.rs:18` | `claimer: Signer` | Ed25519 sig + Merkle proof + `snapshot_wallet == claimer` (line 27) | User-permissioned | Triple verification |
| 9 | `withdraw_vested` | `withdraw_vested.rs:12` | `claimer: Signer` | `constraint = claim_status.snapshot_wallet == claimer.key()` (line 37) | User-permissioned | + `is_claimed` check |
| 10 | `trigger_big_pay_day` | `trigger_big_pay_day.rs:14` | `caller: Signer` | None (any signer) | **Permissionless** | Safe: pre-calc rate + duplicate prevention + finalize-only stakes |
| 11 | `finalize_bpd_calculation` | `finalize_bpd_calculation.rs:13` | `caller: Signer` | `constraint = caller.key() == global_state.authority` (line 16) | **Admin-only** (was permissionless) | HIGH-1 fix confirmed |
| 12 | `seal_bpd_finalize` | `seal_bpd_finalize.rs:8` | `authority: Signer` | `constraint = authority.key() == global_state.authority` (line 11) | Admin-only | + 24hr delay + count match |
| 13 | `abort_bpd` | `abort_bpd.rs:9` | `authority: Signer` | `has_one = authority` on GlobalState (line 14) | Admin-only | + pre-distribution check |
| 14 | `migrate_stake` | `migrate_stake.rs:8` | `payer: Signer` | `constraint = stake_account.user == payer.key()` (line 22) | User-permissioned (stake owner only) | A-5 fix confirmed |
| 15 | `admin_set_claim_end_slot` | `admin_set_claim_end_slot.rs:11` | `authority: Signer` | `constraint = authority.key() == global_state.authority` (line 13) | Admin-only | + bounds check |
| 16 | `admin_set_slots_per_day` | `admin_set_slots_per_day.rs:11` | `authority: Signer` | `constraint = authority.key() == global_state.authority` (line 13) | Admin-only | + bounds check |
| 17 | `transfer_authority` | `transfer_authority.rs:9` | `authority: Signer` | `constraint = global_state.authority == authority.key()` (line 13) | Admin-only | Two-step transfer initiation |
| 18 | `accept_authority` | `accept_authority.rs:9` | `new_authority: Signer` | `constraint = new_authority.key() == pending_authority.new_authority` (line 28) | New-authority-only | + BPD window block |

### Permissionless Instruction Safety Analysis

**`crank_distribution`**: Safe. The instruction:
- Checks `current_day > global_state.current_day` (line 50-53) preventing multiple distributions per day
- `distribute_pending_inflation()` is idempotent (returns early if already distributed, line 70-72)
- No state can be corrupted by calling it repeatedly

**`trigger_big_pay_day`**: Safe. The instruction:
- Requires `bpd_calculation_complete == true` (Anchor constraint line 31), which only `seal_bpd_finalize` (admin-only) can set
- Checks `bpd_finalize_period_id == claim_period_id` (line 134) ensuring only finalized stakes receive distribution
- Checks `bpd_claim_period_id != claim_period_id` (line 129) preventing duplicate distribution
- Uses pre-calculated rate from `seal_bpd_finalize`, so caller cannot influence the rate
- Anti-whale cap uses `bpd_original_unclaimed` set at seal time (immutable during distribution)
- Counter-based completion (line 252) prevents premature marking as complete

---

## Authority Transfer Security Analysis

### Two-Step Flow

**Step 1: `transfer_authority` (transfer_authority.rs)**
- Current authority initiates transfer by setting `PendingAuthority.new_authority`
- PDA: `seeds = [PENDING_AUTHORITY_SEED]` with `init_if_needed` (lines 17-23)
- Authority check: `constraint = global_state.authority == authority.key()` (line 13)
- Can overwrite existing pending transfer (emits `AuthorityTransferCancelled` event, lines 36-41)

**Step 2: `accept_authority` (accept_authority.rs)**
- New authority must sign to accept
- Signer check: `constraint = new_authority.key() == pending_authority.new_authority` (line 28)
- BPD safety: `constraint = !global_state.is_bpd_window_active()` (line 14) prevents mid-BPD transfers
- Closes PendingAuthority PDA with `close = new_authority` (line 22), returning rent to new authority
- Updates `global_state.authority = new_authority` (line 37)

### Security Assessment

| Threat | Status | Analysis |
|--------|--------|----------|
| Old authority blocks new authority | **Mitigated** | Old authority can call `transfer_authority` again to overwrite, but cannot prevent `accept_authority` once PendingAuthority is set |
| New authority griefs by not accepting | **Mitigated** | Old authority can call `transfer_authority` again to set a different new_authority, overwriting the PDA |
| Transfer during BPD | **Blocked** | `accept_authority` has `!global_state.is_bpd_window_active()` constraint (line 14) |
| Self-transfer | **Harmless** | Authority can transfer to itself; PendingAuthority gets created and closed, no state change |
| PendingAuthority PDA reuse | **Correct** | `init_if_needed` allows overwriting; `close` in accept_authority cleans up |

**One observation**: The `transfer_authority` instruction uses `init_if_needed` for the PendingAuthority PDA. If the PDA already exists (from a prior transfer that was never accepted), `init_if_needed` will reuse it without error. The `pending.bump = ctx.bumps.pending_authority` at line 44 re-sets the bump. This is correct behavior.

### Potential Concern: Rent Payment on Cancel

When the current authority calls `transfer_authority` to overwrite a pending transfer, the rent paid for the original `init_if_needed` is not refunded to anyone until `accept_authority` closes the PDA. If the authority repeatedly calls `transfer_authority` to different addresses without anyone accepting, the rent remains locked in the PDA. This is a very minor economic issue (a few lamports) and not a security vulnerability.

---

## Ed25519 Signature Verification Analysis

### Implementation (free_claim.rs:217-288)

The `verify_ed25519_signature` function uses Solana's Ed25519 pre-compile instruction introspection pattern.

#### Verification Steps

1. **Instruction index check** (line 224-227):
   ```rust
   let current_ix_index = load_current_index_checked(instructions_sysvar)?;
   require!(current_ix_index > 0, HelixError::MissingEd25519Instruction);
   ```
   Ensures there is a preceding instruction.

2. **Previous instruction load** (lines 229-232):
   ```rust
   let ed25519_ix = load_instruction_at_checked(
       (current_ix_index - 1) as usize,
       instructions_sysvar,
   )?;
   ```
   Loads the immediately preceding instruction.

3. **Program ID verification** (lines 235-238):
   ```rust
   require!(
       ed25519_ix.program_id == ed25519_program::ID,
       HelixError::MissingEd25519Instruction
   );
   ```
   Confirms the preceding instruction is actually an Ed25519 verify instruction.

4. **Message format verification** (lines 240-245):
   ```rust
   let expected_message = format!("HELIX:claim:{}:{}", snapshot_wallet, amount);
   ```
   Domain-separated message prevents cross-protocol replay.

5. **Public key extraction and verification** (lines 264-274):
   Extracts the signing public key from the Ed25519 instruction data and verifies it matches `snapshot_wallet`.

6. **Message content verification** (lines 277-285):
   Extracts the signed message from the Ed25519 instruction data and verifies it matches the expected format.

#### Security Assessment

| Check | Status | Details |
|-------|--------|---------|
| Instructions sysvar address | PASS | `#[account(address = ix_sysvar::ID)]` at line 82 |
| Ed25519 program ID | PASS | Verified at line 236 |
| Preceding instruction position | PASS | `current_ix_index - 1` at line 231 |
| Public key binding | PASS | `signed_pubkey == snapshot_wallet` at line 272 |
| Message binding | PASS | Exact byte comparison at line 283 |
| Domain separation | PASS | `"HELIX:claim:"` prefix prevents cross-protocol replay |
| Amount binding | PASS | Amount included in signed message |
| Delegation prevention | PASS | `snapshot_wallet.key() == claimer.key()` constraint at line 27 |
| Double-claim prevention | PASS | ClaimStatus PDA is `init` (cannot be created twice) |
| Claim period binding | PASS | Merkle leaf includes `claim_period_id` at line 305 |

**Finding: PASS.** The Ed25519 verification is correctly implemented. The `snapshot_wallet == claimer` constraint (line 27) prevents delegation attacks where a third party could claim on behalf of a snapshot holder. The `init` PDA for ClaimStatus prevents double-claiming. The message format includes both the wallet and amount, preventing replay with different parameters.

**INFO-1**: The Ed25519 instruction must be immediately preceding (`current_ix_index - 1`). This is the standard secure pattern. A gap (e.g., checking `current_ix_index - 2`) would allow an attacker to insert an arbitrary instruction between the Ed25519 verify and the free_claim, potentially with different parameters.

---

## Anchor Constraint Completeness Audit

### Per-Instruction Analysis

#### 1. Initialize (lib.rs:180-214)
| Account | Constraint | Correct |
|---------|-----------|---------|
| `authority` | `Signer`, `mut` | YES |
| `global_state` | `init`, PDA `seeds = [GLOBAL_STATE_SEED]`, `bump` | YES |
| `mint_authority` | PDA `seeds = [MINT_AUTHORITY_SEED]`, `bump` | YES |
| `mint` | `init`, PDA `seeds = [MINT_SEED]`, `bump`, `mint::decimals`, `mint::authority`, `mint::token_program` | YES |
| `token_program` | `Program<'info, Token2022>` | YES |
| `system_program` | `Program<'info, System>` | YES |

**Assessment**: Complete. `init` prevents re-initialization.

#### 2. CreateStake (create_stake.rs:12-54)
| Account | Constraint | Correct |
|---------|-----------|---------|
| `user` | `Signer`, `mut` | YES |
| `global_state` | PDA seeds + bump | YES |
| `stake_account` | `init`, PDA `seeds = [STAKE_SEED, user.key(), stake_id]`, `bump` | YES |
| `user_token_account` | `associated_token::mint`, `associated_token::authority = user` | YES |
| `mint` | PDA seeds | YES |

**Assessment**: Complete. PDA seeds include `user.key()` binding stake to user.

#### 3. CrankDistribution (crank_distribution.rs:11-37)
| Account | Constraint | Correct |
|---------|-----------|---------|
| `cranker` | `Signer` (no mut) | YES |
| `global_state` | PDA seeds + bump, `mut` | YES |
| `mint` | PDA seeds, `mut` | YES |
| `mint_authority` | PDA seeds + `bump = global_state.mint_authority_bump` | YES |

**Assessment**: Complete. Permissionless by design.

#### 4. Unstake (unstake.rs:12-55)
| Account | Constraint | Correct |
|---------|-----------|---------|
| `user` | `Signer`, `mut` | YES |
| `global_state` | PDA seeds + bump | YES |
| `stake_account` | PDA seeds, `bump`, `constraint user == user.key()`, `constraint is_active` | YES |
| `user_token_account` | `associated_token` constraints | YES |
| `mint` | PDA seeds | YES |
| `mint_authority` | PDA seeds + bump | YES |

**Assessment**: Complete. Dual constraint (PDA seeds + explicit user check) provides defense-in-depth.

#### 5. ClaimRewards (claim_rewards.rs:13-60)
| Account | Constraint | Correct |
|---------|-----------|---------|
| `user` | `Signer`, `mut` | YES |
| `global_state` | PDA seeds + bump | YES |
| `stake_account` | PDA seeds, `bump`, `constraint user`, `constraint is_active`, `realloc` | YES |
| `user_token_account` | `associated_token` | YES |
| `mint` | PDA seeds | YES |
| `mint_authority` | PDA seeds + bump | YES |

**Assessment**: Complete. `realloc` handles migration from older account sizes.

#### 6. AdminMint (admin_mint.rs:11-44)
| Account | Constraint | Correct |
|---------|-----------|---------|
| `authority` | `Signer`, `mut` | YES |
| `global_state` | PDA seeds + bump, `constraint authority == authority.key()` | YES |
| `mint_authority` | PDA seeds + bump | YES |
| `mint` | PDA seeds | YES |
| `recipient_token_account` | `constraint mint == global_state.mint` | YES |

**Assessment**: Complete. The `recipient_token_account` mint constraint prevents minting to a different token's account.

#### 7. InitializeClaimPeriod (initialize_claim_period.rs:9-33)
| Account | Constraint | Correct |
|---------|-----------|---------|
| `authority` | `Signer`, `mut`, `constraint == global_state.authority` | YES |
| `global_state` | PDA seeds + bump | YES |
| `claim_config` | `init`, PDA `seeds = [CLAIM_CONFIG_SEED]`, `bump` | YES |

**Assessment**: Complete. `init` ensures single claim period.

#### 8. FreeClaim (free_claim.rs:17-87)
| Account | Constraint | Correct |
|---------|-----------|---------|
| `claimer` | `Signer`, `mut` | YES |
| `snapshot_wallet` | `constraint == claimer.key()` | YES |
| `global_state` | PDA seeds + bump | YES |
| `claim_config` | PDA seeds + bump, `constraint claim_period_started` | YES |
| `claim_status` | `init`, PDA `seeds = [CLAIM_STATUS_SEED, merkle_root_prefix, snapshot_wallet]` | YES |
| `claimer_token_account` | `associated_token` | YES |
| `mint` | PDA seeds | YES |
| `mint_authority` | PDA seeds + bump | YES |
| `instructions_sysvar` | `address = ix_sysvar::ID` | YES |

**Assessment**: Complete. The ClaimStatus PDA includes `merkle_root[..8]` in seeds, which binds it to the specific claim period.

#### 9. WithdrawVested (withdraw_vested.rs:12-64)
| Account | Constraint | Correct |
|---------|-----------|---------|
| `claimer` | `Signer`, `mut` | YES |
| `global_state` | PDA seeds + bump | YES |
| `claim_config` | PDA seeds + bump | YES |
| `claim_status` | PDA seeds (using `claim_status.snapshot_wallet`), `bump`, `constraint is_claimed`, `constraint snapshot_wallet == claimer` | YES |
| `claimer_token_account` | `associated_token` | YES |
| `mint` | PDA seeds | YES |
| `mint_authority` | PDA seeds + bump | YES |

**Assessment**: Complete. Snapshot wallet constraint binds to claimer.

#### 10. TriggerBigPayDay (trigger_big_pay_day.rs:14-37)
| Account | Constraint | Correct |
|---------|-----------|---------|
| `caller` | `Signer` | YES |
| `global_state` | PDA seeds + bump, `mut` | YES |
| `claim_config` | PDA seeds + bump, `constraint claim_period_started`, `constraint !big_pay_day_complete`, `constraint bpd_calculation_complete` | YES |

**Assessment**: Complete. The three ClaimConfig constraints form a state machine gate: must have started, not yet completed, and calculation must be done.

#### 11. FinalizeBpdCalculation (finalize_bpd_calculation.rs:13-38)
| Account | Constraint | Correct |
|---------|-----------|---------|
| `caller` | `Signer`, `constraint == global_state.authority` | YES |
| `global_state` | PDA seeds + bump, `mut` | YES |
| `claim_config` | PDA seeds + bump, `constraint claim_period_started`, `constraint !bpd_calculation_complete`, `constraint !big_pay_day_complete` | YES |

**Assessment**: Complete. Authority-gated (HIGH-1 fix).

#### 12. SealBpdFinalize (seal_bpd_finalize.rs:8-30)
| Account | Constraint | Correct |
|---------|-----------|---------|
| `authority` | `Signer`, `constraint == global_state.authority` | YES |
| `global_state` | PDA seeds + bump | YES |
| `claim_config` | PDA seeds + bump, `constraint claim_period_started`, `constraint !bpd_calculation_complete`, `constraint !big_pay_day_complete` | YES |

**Assessment**: Complete. Same state machine constraints as finalize.

#### 13. AbortBpd (abort_bpd.rs:9-26)
| Account | Constraint | Correct |
|---------|-----------|---------|
| `global_state` | PDA seeds + bump, `has_one = authority`, `mut` | YES |
| `claim_config` | PDA seeds + bump, `mut` | YES |
| `authority` | `Signer` | YES |

**Assessment**: Complete. Uses `has_one` pattern.

#### 14. MigrateStake (migrate_stake.rs:8-30)
| Account | Constraint | Correct |
|---------|-----------|---------|
| `payer` | `Signer`, `mut` | YES |
| `stake_account` | PDA seeds + bump, `constraint user == payer.key()`, `realloc` | YES |

**Assessment**: Complete. A-5 fix (owner-only migration) verified.

#### 15. AdminSetClaimEndSlot (admin_set_claim_end_slot.rs:11-30)
| Account | Constraint | Correct |
|---------|-----------|---------|
| `authority` | `Signer`, `constraint == global_state.authority` | YES |
| `global_state` | PDA seeds + bump | YES |
| `claim_config` | PDA seeds + bump, `constraint claim_period_started`, `mut` | YES |

**Assessment**: Complete with bounds checking in handler.

#### 16. AdminSetSlotsPerDay (admin_set_slots_per_day.rs:11-23)
| Account | Constraint | Correct |
|---------|-----------|---------|
| `authority` | `Signer`, `constraint == global_state.authority` | YES |
| `global_state` | PDA seeds + bump, `mut` | YES |

**Assessment**: Complete with bounds checking in handler.

#### 17. TransferAuthority (transfer_authority.rs:9-30)
| Account | Constraint | Correct |
|---------|-----------|---------|
| `global_state` | PDA seeds + bump, `constraint authority == authority.key()` | YES |
| `pending_authority` | `init_if_needed`, PDA seeds, `bump` | YES |
| `authority` | `Signer`, `mut` | YES |

**Assessment**: Complete.

#### 18. AcceptAuthority (accept_authority.rs:9-31)
| Account | Constraint | Correct |
|---------|-----------|---------|
| `global_state` | PDA seeds + bump, `constraint !is_bpd_window_active()`, `mut` | YES |
| `pending_authority` | PDA seeds + bump, `close = new_authority` | YES |
| `new_authority` | `Signer`, `mut`, `constraint == pending_authority.new_authority` | YES |

**Assessment**: Complete. BPD window guard + close pattern.

---

## User Isolation Analysis

### Can User A Affect User B's Stakes, Claims, or Rewards?

#### Stake Operations

**StakeAccount PDA seeds**: `[STAKE_SEED, user.key(), stake_id.to_le_bytes()]`

Every stake is bound to its owner via PDA derivation. The authorization model is:

| Operation | Isolation Mechanism | Can A Affect B? |
|-----------|---------------------|-----------------|
| `create_stake` | PDA includes `user.key()` | NO - A cannot create a stake for B |
| `unstake` | PDA seeds + `constraint stake.user == user.key()` | NO - dual check |
| `claim_rewards` | PDA seeds + `constraint stake.user == user.key()` | NO - dual check |
| `migrate_stake` | PDA seeds + `constraint stake.user == payer.key()` | NO - A-5 fix |

**Double protection**: Both PDA seed derivation AND explicit `constraint` checks. Even if Anchor's PDA check were somehow bypassed (it cannot be), the explicit constraint would catch it.

#### Claim Operations

**ClaimStatus PDA seeds**: `[CLAIM_STATUS_SEED, merkle_root[0..8], snapshot_wallet]`

| Operation | Isolation Mechanism | Can A Affect B? |
|-----------|---------------------|-----------------|
| `free_claim` | PDA includes `snapshot_wallet`, `snapshot_wallet == claimer` constraint | NO |
| `withdraw_vested` | `constraint snapshot_wallet == claimer.key()` | NO |

#### BPD Operations (Permissionless)

`trigger_big_pay_day` modifies other users' `StakeAccount.bpd_bonus_pending`. This is **by design** -- it adds BPD bonus tokens, not removes them.

| Threat | Status | Analysis |
|--------|--------|---------|
| Caller skips a stake | Safe | Stake can be included in a later batch |
| Caller submits same stake twice | Blocked | `bpd_claim_period_id` check (line 129) |
| Caller submits non-finalized stake | Blocked | `bpd_finalize_period_id` check (line 134) |
| Caller submits fake account | Blocked | PDA validation + program ownership check |
| Caller inflates bonus | Blocked | Pre-calculated rate from sealed finalize + anti-whale cap |

**Assessment**: User isolation is comprehensive. No user can affect another user's stakes or claims negatively. The BPD distribution path allows adding bonuses to other users' stakes but cannot reduce or drain them.

---

## New Findings

### MED-AC-1: `admin_set_claim_end_slot` Lower Bound Allows Near-Immediate Period Termination

**Severity**: MEDIUM
**File**: `admin_set_claim_end_slot.rs:42-48`
**Lines**: 42-48

```rust
let min_end_slot = clock.slot
    .checked_add(global_state.slots_per_day)
    .ok_or(HelixError::Overflow)?;
require!(
    new_end_slot >= min_end_slot,
    HelixError::AdminBoundsExceeded
);
```

**Issue**: The lower bound is `current_slot + 1 day` (slots_per_day). An admin can set the claim period end to expire in just 1 day. Combined with the fact that `slots_per_day` can also be set by admin (via `admin_set_slots_per_day`), the following attack sequence exists:

1. Admin calls `admin_set_slots_per_day` with `new_slots_per_day = 1`
2. Admin calls `admin_set_claim_end_slot` with `new_end_slot = current_slot + 1`
3. Claim period effectively ends in ~0.4 seconds

While this requires admin authority (which is trusted), the bounds check provides less protection than it appears due to the `slots_per_day` dependency.

**Recommendation**: Use a hardcoded minimum slot offset (e.g., `DEFAULT_SLOTS_PER_DAY` instead of `global_state.slots_per_day`) for the lower bound in `admin_set_claim_end_slot`, or add a minimum `slots_per_day` floor that cannot be overridden.

### LOW-AC-1: `admin_set_slots_per_day` Has No Lower Bound Floor

**Severity**: LOW
**File**: `admin_set_slots_per_day.rs:29-41`

```rust
require!(new_slots_per_day > 0, HelixError::InvalidParameter);
// ...
let upper_bound = DEFAULT_SLOTS_PER_DAY.checked_mul(10)...;
require!(new_slots_per_day <= upper_bound, HelixError::AdminBoundsExceeded);
```

**Issue**: The only lower bound is `> 0`. Setting `slots_per_day = 1` effectively makes each slot a "day," which radically accelerates all time-dependent calculations (inflation distribution, stake durations, penalty calculations, vesting schedules). While bounded by the upper limit (10x default = 2,160,000), the lack of a meaningful floor (e.g., `DEFAULT_SLOTS_PER_DAY / 10 = 21,600`) means the admin can dramatically change protocol economics.

**Note**: The code comment says "Used for devnet/testing" which partially explains the permissive floor. For mainnet deployment, consider adding a meaningful lower bound.

### LOW-AC-2: `transfer_authority` Missing BPD Window Check

**Severity**: LOW
**File**: `transfer_authority.rs:9-30`

The `accept_authority` instruction correctly blocks during BPD windows (`constraint = !global_state.is_bpd_window_active()`), but `transfer_authority` does NOT have this check. This means:

1. Authority can initiate a transfer during a BPD window
2. The new authority cannot accept until the BPD window closes
3. This creates a "pending but unacceptable" state

**Impact**: Minimal. The pending transfer simply waits. The old authority retains control throughout. No funds are at risk. The current design is actually reasonable -- blocking initiation would prevent the authority from queuing a transfer that takes effect after BPD completes.

**Recommendation**: Document this as intentional behavior rather than adding a restriction.

### INFO-1: Ed25519 Instruction Position (Already Noted Above)
**Severity**: INFO
**File**: `free_claim.rs:227-232`

The Ed25519 instruction is required at position `current_ix_index - 1` (immediately preceding). This is the correct and most secure pattern. Documented here for completeness.

### INFO-2: ClaimConfig Is a Singleton PDA

**Severity**: INFO
**File**: `initialize_claim_period.rs:23-28`

```rust
seeds = [CLAIM_CONFIG_SEED],
```

The ClaimConfig PDA uses only `CLAIM_CONFIG_SEED` with no period-specific discriminator. This means only one claim period can exist at a time. The `init` constraint prevents re-initialization, so a new claim period requires closing the existing account first (which is not implemented) or a protocol upgrade.

**Access control implication**: This is acceptable for the current design but limits extensibility. The `claim_period_id` field exists for future multi-period support but the PDA structure does not currently support it.

### INFO-3: `abort_bpd` Idempotency Pattern

**Severity**: INFO
**File**: `abort_bpd.rs:42-47`

```rust
if !global_state.is_bpd_window_active() {
    return Ok(());
}
```

The idempotent early return is a good pattern for authority retries. However, note that if `bpd_window_active` is false but `claim_config` state has partially-set BPD fields (e.g., from a prior run that failed between state updates), the abort will silently succeed without clearing those fields. In practice this is not exploitable because all BPD instructions check their preconditions independently.

---

## Previous Findings Re-evaluation

### MED-2: `saturating_sub` Usage (Access Control Perspective)

**Original finding**: Use of `saturating_sub` could mask arithmetic errors.

**Access control re-evaluation**: The key usage is in `finalize_bpd_calculation.rs:73`:
```rust
let amount = claim_config.total_claimable.saturating_sub(claim_config.total_claimed);
```

This is explicitly documented (Phase 8.1 C1/FR-001): speed bonuses can cause `total_claimed` to exceed `total_claimable`, which is by design. The `saturating_sub` clamps to 0, meaning no BPD is distributed when claims exceed the pool. This is **correct behavior** from an access control perspective -- it prevents underflow errors and results in a safe "no distribution" outcome.

Other `saturating_sub` usages:
- `unstake.rs:210`: In event emission only (not security-critical)
- `withdraw_vested.rs:117`: In event emission only (not security-critical)
- `math.rs:304`: `calculate_pending_rewards` uses `saturating_sub` for `current_value - reward_debt`. This is defensive -- if reward_debt somehow exceeds current_value, the result is 0 pending rewards (not a loss for the user, just no claim).
- `math.rs:364`: `calculate_loyalty_bonus` uses `saturating_sub` for elapsed_slots, which safely handles the edge case where current_slot < start_slot.

**Status: No access control issue. Previous finding assessment stands as acceptable behavior.**

### MED-4: Singleton ClaimConfig PDA (Access Control Perspective)

**Original finding**: ClaimConfig PDA is a singleton, limiting to one active claim period.

**Access control re-evaluation**: The singleton pattern has these implications:
1. Once created via `init`, no second claim period can be created without closing the first
2. No `close` instruction exists for ClaimConfig, meaning the protocol is locked to one lifetime claim period unless upgraded
3. The `claim_period_id` parameter exists for multi-period semantics (BPD tracking) but the PDA cannot support concurrent periods

**Access control concern**: The authority cannot close or reset the ClaimConfig account. If a claim period is initialized with incorrect parameters (wrong merkle root, wrong total_claimable), the authority has no recourse except:
- `admin_set_claim_end_slot` to extend/shorten the period
- `abort_bpd` to cancel BPD distribution
- But NO ability to fix the merkle root or total_claimable

**Status: Confirmed as architectural limitation. Not an access control vulnerability per se, but the authority has limited remediation options for a misconfigured claim period.**

---

## Verified Access Controls

The following access controls have been verified as correctly implemented:

| Control | Location | Verification |
|---------|----------|-------------|
| GlobalState PDA derivation | `lib.rs:189` | `seeds = [GLOBAL_STATE_SEED]` prevents spoofing |
| Mint PDA derivation | `lib.rs:204` | `seeds = [MINT_SEED]` prevents unauthorized mints |
| Mint authority PDA | `lib.rs:196` | `seeds = [MINT_AUTHORITY_SEED]` with bump stored in GlobalState |
| StakeAccount PDA derivation | `create_stake.rs:28-32` | Seeds include user pubkey and monotonic stake_id |
| StakeAccount user binding | `unstake.rs:27`, `claim_rewards.rs:28` | Explicit constraint after PDA check |
| Admin authority check (admin_mint) | `admin_mint.rs:19` | `global_state.authority == authority.key()` |
| Admin authority check (init_claim) | `initialize_claim_period.rs:13` | `authority.key() == global_state.authority` |
| Admin authority check (finalize) | `finalize_bpd_calculation.rs:16` | `caller.key() == global_state.authority` |
| Admin authority check (seal) | `seal_bpd_finalize.rs:11` | `authority.key() == global_state.authority` |
| Admin authority check (abort) | `abort_bpd.rs:14` | `has_one = authority` on GlobalState |
| Admin authority check (set_end_slot) | `admin_set_claim_end_slot.rs:13` | `authority.key() == global_state.authority` |
| Admin authority check (set_slots) | `admin_set_slots_per_day.rs:13` | `authority.key() == global_state.authority` |
| Admin authority check (transfer) | `transfer_authority.rs:13` | `global_state.authority == authority.key()` |
| New authority check (accept) | `accept_authority.rs:28` | `new_authority.key() == pending_authority.new_authority` |
| Claim period state machine | `trigger_big_pay_day.rs:29-31` | Triple constraint: started, not complete, calculation done |
| BPD window unstake block | `unstake.rs:67` | `!global_state.is_bpd_window_active()` |
| BPD window transfer block | `accept_authority.rs:14` | `!global_state.is_bpd_window_active()` |
| Ed25519 sysvar address | `free_claim.rs:82` | `address = ix_sysvar::ID` |
| Ed25519 program ID | `free_claim.rs:236` | `ed25519_ix.program_id == ed25519_program::ID` |
| Ed25519 pubkey binding | `free_claim.rs:272` | `signed_pubkey == snapshot_wallet` |
| Ed25519 message binding | `free_claim.rs:283` | Byte-exact comparison |
| Delegation prevention | `free_claim.rs:27` | `snapshot_wallet.key() == claimer.key()` |
| Double-claim prevention | `free_claim.rs:46-57` | ClaimStatus PDA `init` |
| Duplicate BPD prevention | `trigger_big_pay_day.rs:129` | `bpd_claim_period_id` check |
| Finalize-only BPD | `trigger_big_pay_day.rs:134` | `bpd_finalize_period_id` check |
| PDA validation (remaining_accounts) | `security/pda.rs:42-71` | Full PDA re-derivation with canonical bump |
| Stake ownership in migration | `migrate_stake.rs:22` | `stake_account.user == payer.key()` |
| Admin mint cap | `admin_mint.rs:50-56` | `new_total <= max_admin_mint` |
| Slots_per_day bounds | `admin_set_slots_per_day.rs:29-41` | `> 0` and `<= 10 * DEFAULT` |
| Claim end slot bounds | `admin_set_claim_end_slot.rs:42-48` | `>= current_slot + slots_per_day` |
| Seal delay enforcement | `seal_bpd_finalize.rs:49-58` | 24-hour minimum observation window |
| Seal count verification | `seal_bpd_finalize.rs:63-66` | `bpd_stakes_finalized == expected_finalized_count` |
| Claim period ID validation | `initialize_claim_period.rs:45` | `claim_period_id > 0` |
| CEI pattern (admin_mint) | `admin_mint.rs:59` | State updated before CPI |
| CEI pattern (unstake) | `unstake.rs:148` | `is_active = false` before CPI |
| CEI pattern (claim_rewards) | `claim_rewards.rs:118` | `reward_debt` updated before CPI |
| CEI pattern (withdraw_vested) | `withdraw_vested.rs:87-90` | `withdrawn_amount` updated before mint |

---

## Summary of Findings

| ID | Severity | Title | Status |
|----|----------|-------|--------|
| MED-AC-1 | MEDIUM | `admin_set_claim_end_slot` lower bound depends on mutable `slots_per_day` | NEW |
| LOW-AC-1 | LOW | `admin_set_slots_per_day` has no meaningful lower bound floor | NEW |
| LOW-AC-2 | LOW | `transfer_authority` missing BPD window check (initiation phase) | NEW |
| INFO-1 | INFO | Ed25519 instruction position is correctly immediately preceding | NEW |
| INFO-2 | INFO | ClaimConfig singleton PDA limits extensibility | NEW (re-confirms MED-4) |
| INFO-3 | INFO | `abort_bpd` idempotent return may skip partial state cleanup | NEW |
| MED-2 | - | `saturating_sub` usage | Re-evaluated: ACCEPTABLE |
| MED-4 | - | Singleton ClaimConfig PDA | Re-evaluated: ARCHITECTURAL LIMITATION, NOT VULN |

**Bottom line**: The HELIX Staking Protocol has a well-designed access control architecture. All admin functions are properly gated, user isolation is enforced via both PDA derivation and explicit constraints, the Ed25519 verification is robust, and the authority transfer flow is secure. The new findings are minor and relate to admin parameter flexibility rather than exploitable vulnerabilities. The CRIT/HIGH fixes from the Feb 8 audit are all correctly implemented.
