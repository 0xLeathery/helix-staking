# Phase 24: Anchor Program Boost System - Research

**Researched:** 2026-03-04
**Domain:** Anchor/Solana on-chain boost system — new PDA, modified instructions, Token-2022 ATA validation, reserved-slot packing
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**BoostRecord PDA Design**
- Per-wallet scope: one BoostRecord PDA per user with seeds `["boost_record", user]`
- Snapshot happens at stake time only — `register_seed_boost` creates the BoostRecord but does NOT record a balance; `create_stake` reads the live seed ATA balance and writes `seed_balance_at_stake` to StakeAccount
- Revocation flag (`boost_revoked: bool`) lives on StakeAccount, not BoostRecord — keeps all stake-related state together and avoids passing an extra account into `claim_rewards`
- Auto-link at stake time: `register_seed_boost` doesn't specify a target stake; `create_stake` detects an active BoostRecord and automatically links the new stake as the boosted stake

**Reward Multiplier Integration**
- Boost applies after loyalty multiplier, before BPD bonus: `final = (loyalty_adjusted * 1.10) + bpd_bonus`
- Compounding: full-term staker with boost gets base * 1.50 * 1.10 = 1.65x
- BPD bonus is NOT amplified by boost — stays as a separate additive term
- Live seed ATA balance check on every `claim_rewards` call — reads current balance and compares to `seed_balance_at_stake` snapshot (matches BOOST-04 requirement)
- On revocation during claim: mint base rewards (non-boosted), set `boost_revoked = true` on StakeAccount — no transaction failure, clean UX

**Seed ATA Validation**
- Reject registration if user has no seed token ATA — custom `HelixError::SeedTokenAccountNotFound`
- Enforce minimum balance at registration: `balance >= GlobalState.min_seed_balance` required
- ATA derivation enforced on-chain: program derives expected ATA from `GlobalState.seed_mint + user` and validates the passed account matches (non-ATA accounts rejected per BOOST-02)
- Launchpad not yet confirmed — token program choice (SPL Token vs Token-2022) is Claude's discretion; use `token_interface` for flexibility

**Admin Configuration**
- Boost multiplier hardcoded: `BOOST_MULTIPLIER_BPS = 1_000` (10%) in `constants.rs` — immutable, transparent, auditable
- Explicit admin toggle: `boost_enabled` flag in GlobalState with `admin_toggle_boost` instruction — allows disabling the entire boost system without a program upgrade
- New GlobalState fields stored in existing `reserved: [u64; 6]` slots (slots 2-5) — no account reallocation needed
  - reserved[2..3]: seed_mint (Pubkey, 32 bytes packed into 4 x u64)
  - reserved[4]: min_seed_balance (u64)
  - reserved[5]: boost_enabled (u64 as bool)
- `admin_set_seed_mint` is re-callable — admin can update the seed mint address at any time

### Claude's Discretion
- Token program interface choice (SPL Token vs Token-2022 vs token_interface)
- BoostRecord account sizing and exact field layout
- StakeAccount realloc strategy for adding boost fields (seed_balance_at_stake, boost_revoked, boosted_stake_id)
- Error code numbering and error message wording
- Test structure organization within tests/litesvm/
- Event emission design for boost registration, revocation, and boosted claims
- Packing strategy for Pubkey into reserved u64 slots (byte alignment approach)

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| BOOST-01 | Admin can set seed token mint address and minimum balance threshold in program GlobalState (admin-adjustable) | `admin_set_seed_mint` + `admin_toggle_boost` instructions; reserved slot packing for seed_mint (Pubkey) and min_seed_balance into GlobalState.reserved[2..5] |
| BOOST-02 | User can register for APY boost by proving seed token ownership on-chain (one boosted stake per wallet) | `register_seed_boost` instruction; BoostRecord PDA with seeds `["boost_record", user]`; ATA derivation validation via `get_associated_token_address` equivalent; min balance gate |
| BOOST-03 | Seed token balance is snapshotted in StakeAccount at stake time | `create_stake` detects active BoostRecord, reads seed ATA balance, writes `seed_balance_at_stake` to StakeAccount; realloc pattern already established |
| BOOST-04 | `claim_rewards` verifies current seed balance >= snapshot before applying boost multiplier | Live ATA balance read in `claim_rewards`; conditional multiplier application; graceful revocation path |
| BOOST-05 | Boost revocation is permanent per stake — buying back seed tokens does not restore it | `boost_revoked: bool` on StakeAccount; once set to true, claim_rewards skips boost even if current balance >= snapshot |
| BOOST-06 | Boost multiplier of 10% (1,000 BPS) mints extra tokens at claim time (real rewards, not display-only) | `BOOST_MULTIPLIER_BPS = 1_000`; `apply_boost_multiplier` function in math.rs; same mint_to CPI path as existing rewards |
| BOOST-07 | Buying more seed tokens after staking provides headroom above snapshot threshold | Headroom is automatic: balance check is `current >= seed_balance_at_stake`; buying more raises current above snapshot so sells of the surplus don't trigger revocation |
</phase_requirements>

---

## Summary

Phase 24 adds an on-chain boost system to the existing Anchor/Solana staking program. The work is entirely within `programs/helix-staking/` — no new programs, no new token mints. The three pillars are: (1) a new `BoostRecord` PDA that marks a wallet as boost-eligible, (2) two extended state accounts (`StakeAccount` gains `seed_balance_at_stake`, `boost_revoked`, `boosted_stake_id`; `GlobalState` reuses existing `reserved[2..5]` for `seed_mint`, `min_seed_balance`, `boost_enabled`), and (3) modified `create_stake` and `claim_rewards` instructions that read those fields.

All patterns required already exist in the codebase. The `ReferralRecord` PDA in `state/referral_record.rs` is a direct template for `BoostRecord`. The `migrate_stake` realloc pattern handles StakeAccount expansion. The `admin_set_slots_per_day` / `admin_set_bpd_finalize_timestamp` instructions are templates for the new admin instructions. Token-2022 CPI via `mint_to` with the `mint_authority` PDA is already used in `claim_rewards` and `admin_mint`. LiteSVM + Vitest is the established test framework — the same `setupTest` / `initializeProtocol` / `advanceClock` utilities apply.

The one non-trivial engineering problem is packing a `Pubkey` (32 bytes) into `reserved[u64; 6]` slots 2..5 (4 × u64 = 32 bytes). This is straightforward byte-level packing: interpret the `Pubkey`'s bytes as four little-endian u64 values. A helper on `GlobalState` (e.g., `get_seed_mint` / `set_seed_mint`) handles the cast, keeping the usage sites clean.

**Primary recommendation:** Use `token_interface` (already imported in `claim_rewards` and `create_stake`) for all seed ATA reads. Use `InterfaceAccount<TokenAccount>` with `associated_token::mint` + `associated_token::authority` constraints for ATA validation — the same pattern already used for `user_token_account` in every existing instruction.

---

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `anchor-lang` | existing (workspace) | Account macros, PDA seeds, constraints | Already the project framework |
| `anchor-spl` | existing (workspace) | `token_interface`, `Token2022`, `InterfaceAccount<TokenAccount>` | Used in every existing instruction |
| `litesvm` | existing (workspace) | Fast on-chain simulation for tests | Project test standard |
| `anchor-litesvm` | existing (workspace) | `fromWorkspace`, `LiteSVMProvider` | Project test standard |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `spl-associated-token-account` crate (on-chain) | via anchor-spl | ATA address derivation | `register_seed_boost` to validate passed account is canonical ATA |
| `anchor_spl::associated_token` | via anchor-spl | `AssociatedToken` program type | Needed if using `init_if_needed` on seed ATA; not needed here since we only read |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| `token_interface` (flexible) | `Token2022` only | `token_interface` handles both SPL Token and Token-2022 — correct choice since seed token's program is not yet confirmed |
| Pubkey field in BoostRecord | Embedded in GlobalState.reserved | BoostRecord stores user reference; seed_mint in GlobalState is correct — it is a protocol-level config |

**Installation:** No new dependencies. All required crates are already in workspace Cargo.toml.

---

## Architecture Patterns

### Recommended Project Structure

New files to create:
```
programs/helix-staking/src/
├── state/
│   └── boost_record.rs          # BoostRecord account struct + LEN
├── instructions/
│   ├── admin_set_seed_mint.rs   # AdminSetSeedMint accounts + handler
│   ├── admin_toggle_boost.rs    # AdminToggleBoost accounts + handler
│   ├── register_seed_boost.rs   # RegisterSeedBoost accounts + handler
│   └── update_boost_status.rs   # UpdateBoostStatus accounts + handler (BOOST-05 explicit revoke)
tests/litesvm/
└── boost.test.ts                # All boost LiteSVM integration tests
```

Modified files:
```
programs/helix-staking/src/
├── constants.rs                 # Add BOOST_MULTIPLIER_BPS, BOOST_RECORD_SEED
├── error.rs                     # Add boost-specific errors
├── events.rs                    # Add BoostRegistered, BoostRevoked, BoostedRewardsClaimed
├── instructions/
│   ├── math.rs                  # Add apply_boost_multiplier
│   ├── claim_rewards.rs         # Insert boost check after loyalty multiplier
│   └── create_stake.rs          # Detect BoostRecord, write seed_balance_at_stake
├── state/
│   ├── mod.rs                   # Export boost_record
│   ├── global_state.rs          # Add reserved[2..5] helper methods, extend LEN comment
│   └── stake_account.rs         # Add seed_balance_at_stake, boost_revoked, boosted_stake_id; bump LEN
├── security/pda.rs              # Add validate_boost_record_pda
└── lib.rs                       # Add 4 new instruction dispatchers
```

### Pattern 1: BoostRecord PDA (modeled on ReferralRecord)

**What:** A per-wallet account created by `register_seed_boost`. Its existence signals boost eligibility. It does NOT store a balance.

**When to use:** Check for its existence in `create_stake` via optional account.

```rust
// Source: modeled on programs/helix-staking/src/state/referral_record.rs

use anchor_lang::prelude::*;

pub const BOOST_RECORD_SEED: &[u8] = b"boost_record";

#[account]
pub struct BoostRecord {
    pub user: Pubkey,          // Wallet that registered
    pub slot: u64,             // Registration slot (indexer correlation)
    pub bump: u8,              // Canonical bump
    // boosted_stake_id written by create_stake (u64::MAX = not yet linked)
    pub boosted_stake_id: u64,
}

impl BoostRecord {
    // 8 (discriminator) + 32 (user) + 8 (slot) + 1 (bump) + 8 (boosted_stake_id) = 57
    pub const LEN: usize = 8 + 32 + 8 + 1 + 8;
}
```

**Note on `boosted_stake_id`:** Placing it on BoostRecord (not StakeAccount) allows `create_stake` to write the link both ways: stake account gets `seed_balance_at_stake`, BoostRecord gets `boosted_stake_id`. This is the natural home since `create_stake` takes BoostRecord as an optional account — once written, one BoostRecord = one boosted stake is enforced by checking `boosted_stake_id != u64::MAX`.

### Pattern 2: GlobalState Reserved Slot Packing for Pubkey

**What:** Pack a 32-byte Pubkey into reserved[2..6] (4 × u64) using byte transmutation.

**When to use:** `admin_set_seed_mint` writes, all other instructions read via helper.

```rust
// Source: derived from existing GlobalState reserved pattern in global_state.rs
// reserved[0] = BPD window, reserved[1] = is_paused

impl GlobalState {
    // --- Boost fields in reserved slots ---
    // reserved[2..5] = seed_mint (Pubkey packed as 4 × u64, little-endian bytes)
    // reserved[4]    = min_seed_balance (u64)
    // reserved[5]    = boost_enabled (u64 as bool)

    pub fn get_seed_mint(&self) -> Pubkey {
        // Reinterpret 4 consecutive u64s as a [u8; 32]
        let mut bytes = [0u8; 32];
        bytes[0..8].copy_from_slice(&self.reserved[2].to_le_bytes());
        bytes[8..16].copy_from_slice(&self.reserved[3].to_le_bytes());
        bytes[16..24].copy_from_slice(&self.reserved[4].to_le_bytes());
        bytes[24..32].copy_from_slice(&self.reserved[5].to_le_bytes());
        Pubkey::from(bytes)
    }

    pub fn set_seed_mint(&mut self, mint: &Pubkey) {
        let bytes = mint.to_bytes();
        self.reserved[2] = u64::from_le_bytes(bytes[0..8].try_into().unwrap());
        self.reserved[3] = u64::from_le_bytes(bytes[8..16].try_into().unwrap());
        self.reserved[4] = u64::from_le_bytes(bytes[16..24].try_into().unwrap());
        self.reserved[5] = u64::from_le_bytes(bytes[24..32].try_into().unwrap());
    }

    pub fn get_min_seed_balance(&self) -> u64 {
        // WAIT: slots 2-5 are consumed by seed_mint (4 u64s).
        // min_seed_balance and boost_enabled need a different approach.
        // See "Slot Layout Correction" in Architecture Patterns below.
    }
}
```

**CRITICAL — Slot Layout Correction:** The CONTEXT.md assigns `reserved[2..3]` to `seed_mint` (32 bytes = 4 × u64) and `reserved[4]` to `min_seed_balance` and `reserved[5]` to `boost_enabled`. But a Pubkey is 32 bytes = exactly 4 × u64 = slots 2, 3, 4, 5. This exhausts all 6 reserved slots if reserved[0] and reserved[1] are already used. There is no room for `min_seed_balance` and `boost_enabled` in the current `reserved: [u64; 6]` layout.

**Resolution options (Claude's discretion):**

1. **Preferred: Extend `GlobalState.reserved` from `[u64; 6]` to `[u64; 10]`** — this requires reallocating GlobalState, but GlobalState has `realloc` already used in `claim_rewards` for StakeAccount; however `GlobalState` itself is not reallocated anywhere yet. This would require a one-time `migrate_global_state` instruction or expanding the space at `init`. Since the program is not yet on mainnet (still testing), the simplest approach is to change `GlobalState::LEN` to include `[u64; 10]` and rebuild — existing devnet/test state can be reset. **This is the cleanest path.**

2. **Alternative: Compress seed_mint storage** — store seed_mint as a separate field added to GlobalState struct (requires realloc) rather than via reserved slots. Same realloc requirement.

3. **Alternative: Store min_seed_balance and boost_enabled in BoostRecord or a new AdminBoostConfig PDA** — avoids GlobalState realloc but adds complexity.

**Recommendation:** Extend `reserved: [u64; 6]` to `[u64; 10]` in GlobalState. Slots 0-1 stay the same. Slots 2-5 = seed_mint (Pubkey). Slot 6 = min_seed_balance. Slot 7 = boost_enabled. Slots 8-9 remain free for future use. Update `GlobalState::LEN` accordingly. This requires a one-time devnet reset or `migrate_global_state` instruction.

### Pattern 3: ATA Validation in register_seed_boost

**What:** Derive expected ATA address on-chain and compare to passed account.

**When to use:** `register_seed_boost` validates seed ATA ownership and balance.

```rust
// Source: anchor-spl associated_token pattern; verified against existing create_stake.rs usage
use anchor_spl::associated_token::get_associated_token_address_with_program_id;

// In RegisterSeedBoost accounts struct:
#[account(
    associated_token::mint = seed_mint,     // derives + validates canonical ATA
    associated_token::authority = user,
    associated_token::token_program = seed_token_program,
)]
pub seed_token_account: InterfaceAccount<'info, TokenAccount>,

// In handler — read balance:
let seed_balance = ctx.accounts.seed_token_account.amount;
require!(
    seed_balance >= global_state.get_min_seed_balance(),
    HelixError::SeedBalanceBelowMinimum
);
```

Anchor's `associated_token::mint` + `associated_token::authority` constraint automatically validates that the passed account is the canonical ATA. If a non-ATA account is passed, the constraint fails. No manual address derivation is needed.

### Pattern 4: Optional BoostRecord in create_stake

**What:** `create_stake` optionally reads BoostRecord from `remaining_accounts[1]` (index 0 is already ClaimConfig). If present and unlinked, snapshot the seed ATA balance.

**When to use:** Only when user has previously called `register_seed_boost`.

```rust
// In create_stake handler — after BPD check, before emit:
// remaining_accounts[0] = ClaimConfig (existing)
// remaining_accounts[1] = BoostRecord (new, optional)
// remaining_accounts[2] = seed_token_account (new, optional, only if [1] present)

let mut seed_balance_at_stake: u64 = 0;
let mut boost_revoked = false;
let mut boosted_stake_id: u64 = u64::MAX; // u64::MAX = not boosted

if ctx.remaining_accounts.len() >= 3 {
    let boost_record_info = &ctx.remaining_accounts[1];
    let seed_ata_info = &ctx.remaining_accounts[2];

    // Validate boost record PDA
    let (expected_boost_pda, _) = Pubkey::find_program_address(
        &[BOOST_RECORD_SEED, ctx.accounts.user.key().as_ref()],
        ctx.program_id,
    );

    if boost_record_info.key() == expected_boost_pda {
        if let Ok(mut boost_record) = Account::<BoostRecord>::try_from(boost_record_info) {
            // Only auto-link if not already linked to a stake
            if boost_record.boosted_stake_id == u64::MAX
               && global_state.get_boost_enabled()
               && !global_state.get_seed_mint().eq(&Pubkey::default()) {
                // Read seed ATA balance (validated externally since remaining_accounts aren't checked by Anchor)
                // Parse amount at offset 64 (Token-2022 TokenAccount layout)
                let data = seed_ata_info.try_borrow_data()?;
                seed_balance_at_stake = u64::from_le_bytes(data[64..72].try_into().unwrap());

                // Write link back to BoostRecord
                boost_record.boosted_stake_id = stake_account.stake_id;
                // BoostRecord is in remaining_accounts — must write via account_info
                // Use serialization:
                let mut writer: &mut [u8] = &mut boost_record_info.try_borrow_mut_data()?;
                boost_record.try_serialize(&mut writer)?;
            }
        }
    }
}

stake_account.seed_balance_at_stake = seed_balance_at_stake;
stake_account.boost_revoked = boost_revoked;
```

**Caution:** Reading/writing `remaining_accounts` without Anchor constraints requires manual validation. Use `validate_boost_record_pda` helper from `security/pda.rs` (same pattern as `validate_stake_pda` already there).

### Pattern 5: Boost Application in claim_rewards

**What:** After loyalty multiplier, before BPD addition — apply 10% boost if eligible.

**When to use:** Every `claim_rewards` call for a boosted stake.

```rust
// Source: derived from apply_loyalty_multiplier in claim_rewards.rs

fn apply_boost_multiplier(loyalty_adjusted: u64) -> Result<u64> {
    // BOOST_MULTIPLIER_BPS = 1_000 (10%)
    let boost_amount = mul_div(loyalty_adjusted, BOOST_MULTIPLIER_BPS, BPS_SCALER)?;
    loyalty_adjusted
        .checked_add(boost_amount)
        .ok_or(error!(HelixError::Overflow))
}

// In claim_rewards handler — after apply_loyalty_multiplier, before bpd_bonus:
let (final_rewards, boost_applied) = if stake.seed_balance_at_stake > 0 && !stake.boost_revoked {
    // Read current seed ATA balance (passed as optional account)
    let current_seed_balance = /* read from seed_ata account */;

    if current_seed_balance >= stake.seed_balance_at_stake {
        // Boost active — apply multiplier
        (apply_boost_multiplier(loyalty_adjusted_rewards)?, true)
    } else {
        // Balance dropped below snapshot — revoke permanently
        let stake_mut = &mut ctx.accounts.stake_account;
        stake_mut.boost_revoked = true;
        emit!(BoostRevoked { ... });
        (loyalty_adjusted_rewards, false)
    }
} else {
    (loyalty_adjusted_rewards, false)
};

// Then add BPD:
let total_rewards = final_rewards
    .checked_add(bpd_bonus)
    .ok_or(HelixError::Overflow)?;
```

### Pattern 6: StakeAccount Realloc for New Fields

**What:** Add `seed_balance_at_stake: u64`, `boost_revoked: bool`, `boosted_stake_id: u64` — 17 bytes. Realloc via existing `realloc` constraint.

Current `StakeAccount::LEN = 117`. New fields add 17 bytes → new `LEN = 134`.

```rust
// In StakeAccount:
pub const LEN: usize = 8    // discriminator
    + 32   // user
    + 8    // stake_id
    + 8    // staked_amount
    + 8    // t_shares
    + 8    // start_slot
    + 8    // end_slot
    + 2    // stake_days
    + 8    // reward_debt
    + 1    // is_active
    + 1    // bump
    + 8    // bpd_bonus_pending
    + 1    // bpd_eligible
    + 8    // claim_period_start_slot
    + 4    // bpd_claim_period_id
    + 4    // bpd_finalize_period_id
    // === Phase 24: Boost ===
    + 8    // seed_balance_at_stake (0 = not boosted)
    + 1    // boost_revoked
    + 8;   // boosted_stake_id (u64::MAX = not linked / not boosted)
    // Total: 134 bytes
```

The `realloc` constraint already in `claim_rewards` and `migrate_stake` handles the expansion automatically. New stakes (`create_stake`) will `init` at the new LEN. Old stakes will realloc on their next `claim_rewards` call (existing pattern).

**IMPORTANT:** New fields default to zero-initialized bytes when realloc adds space (`realloc::zero = false` in Anchor means only the NEW bytes are zeroed; existing bytes are preserved). Since `seed_balance_at_stake = 0` means "not boosted" and `boost_revoked = false` (0) means "not revoked", zero-initialization is correct for both. For `boosted_stake_id`, `0` would conflict with a real stake_id of 0. Use `u64::MAX` as sentinel — but zero-init won't set it to `u64::MAX`. Resolution: treat `seed_balance_at_stake == 0` as the primary "not boosted" signal (sufficient — any boosted stake has seed_balance_at_stake > 0 by the minimum balance requirement). `boosted_stake_id` on BoostRecord can start at 0 with "linked" checked via `boosted_stake_id < u64::MAX` OR `seed_balance_at_stake > 0` on StakeAccount.

### Anti-Patterns to Avoid

- **Checking `boost_revoked` on BoostRecord:** The CONTEXT.md explicitly puts `boost_revoked` on `StakeAccount`. Don't add it to BoostRecord.
- **Failing the transaction on revocation:** When `claim_rewards` detects dropped seed balance, mint base rewards (non-boosted), set `boost_revoked = true`, and return `Ok(())`. Never `return Err(...)` for revocation.
- **Using `find_program_address` in hot path:** In `claim_rewards`, derive the seed ATA address once with `get_associated_token_address` and compare — avoid `find_program_address` which iterates bump candidates.
- **Accepting arbitrary token accounts:** Always validate that the seed ATA passed to `claim_rewards` matches the canonical ATA derived from `GlobalState.seed_mint + user`.
- **Skipping GlobalState boost_enabled check:** Both `register_seed_boost` and `create_stake` boost auto-link should gate on `global_state.get_boost_enabled()`.
- **Minting boost separately from base rewards:** Boost is a multiplier on the existing total — mint one combined amount via a single `mint_to` CPI. Never two separate CPI calls.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| ATA address validation | Manual PDA derivation loop | Anchor `associated_token::mint` + `associated_token::authority` constraint | Anchor derives and validates the canonical ATA automatically; non-ATA accounts fail constraint |
| Token balance reading | Raw account data parsing | `InterfaceAccount<TokenAccount>.amount` | Anchor deserializes the token account; amount is at `.amount` field |
| Pubkey packing into u64 slots | Complex serialization | Byte slice copy via `to_bytes()` / `from()` | Pubkey is `[u8; 32]`; 4 × u64 in LE bytes is exact — simple `copy_from_slice` |
| Boost arithmetic overflow | Custom safe math | `mul_div` from `instructions/math.rs` (already exists) | mul_div already uses u128 intermediate; use `mul_div(loyalty_adjusted, BOOST_MULTIPLIER_BPS, BPS_SCALER)` |
| PDA validation in remaining_accounts | Ad-hoc key checks | `validate_boost_record_pda` in `security/pda.rs` (extend existing pattern) | Consistent with `validate_stake_pda` — canonical bump check + key equality |

**Key insight:** The hardest part of this phase is the `remaining_accounts` pattern in `create_stake` — manually deserializing and re-serializing BoostRecord without Anchor's declarative account validation. The existing `trigger_big_pay_day` and `finalize_bpd_calculation` instructions already do this for StakeAccount arrays; follow those patterns exactly.

---

## Common Pitfalls

### Pitfall 1: GlobalState Reserved Slot Exhaustion

**What goes wrong:** Attempting to pack seed_mint (32 bytes = 4 × u64), min_seed_balance (1 × u64), and boost_enabled (1 × u64) into `reserved[2..5]` (4 slots total). That's 6 u64s needed but only 4 slots available (reserved[0..1] are taken).

**Why it happens:** The CONTEXT.md notation `reserved[2..3]` uses Rust range syntax, but a Pubkey is 32 bytes = 4 u64s, so it occupies slots 2, 3, 4, 5 — not just 2 and 3.

**How to avoid:** Extend `reserved` to `[u64; 10]` before writing any helper methods. Update `GlobalState::LEN` to `+ 80 // reserved (10 * u64)`. Reset devnet state.

**Warning signs:** Code that writes `reserved[4]` for both the last byte of seed_mint AND min_seed_balance.

### Pitfall 2: Zero-Initialized Sentinel Ambiguity

**What goes wrong:** `boosted_stake_id = 0` in StakeAccount after realloc means "unset", but stake_id 0 is a valid real stake ID. Code that checks `if boosted_stake_id == 0 { not_boosted }` incorrectly treats the first-ever stake as non-boosted.

**Why it happens:** Anchor's `realloc::zero = false` means new bytes are zero-filled; `u64::MAX` sentinel is not automatically set.

**How to avoid:** Use `seed_balance_at_stake > 0` as the primary boost eligibility signal (not `boosted_stake_id`). `seed_balance_at_stake` cannot be zero for a legitimate boosted stake (min balance > 0). For BoostRecord's `boosted_stake_id`, initialize to `u64::MAX` in `register_seed_boost` (explicit init, not relying on zero fill).

**Warning signs:** Boost logic branching on `boosted_stake_id == 0`.

### Pitfall 3: Seed ATA Not Passed to claim_rewards — Account Set Mismatch

**What goes wrong:** `claim_rewards` needs the user's seed ATA to check current balance, but the current accounts struct has no field for it. Adding a mandatory account breaks backward compatibility for non-boosted stakers.

**Why it happens:** Anchor account structs are fixed at compile time. Adding a mandatory `seed_token_account` requires all callers to pass it.

**How to avoid:** Pass the seed ATA as `remaining_accounts[0]` in `claim_rewards` for boosted stakers, and skip balance check if `remaining_accounts` is empty OR if `stake.seed_balance_at_stake == 0`. Non-boosted stakers never need to pass it.

**Warning signs:** Compile error saying "wrong number of accounts" in tests for non-boosted claim.

### Pitfall 4: Re-Serializing remaining_accounts BoostRecord

**What goes wrong:** After reading a `BoostRecord` from `remaining_accounts`, modifying it in memory, and attempting to write back, the account data is not persisted because Anchor does not manage it (no `mut` constraint, no automatic serialization).

**Why it happens:** Anchor's `Account<T>` auto-serializes on drop only for declaratively listed accounts.

**How to avoid:** Use `boost_record.try_serialize(&mut &mut boost_record_info.data.borrow_mut()[..])?` for the write-back. This is the same pattern used by `trigger_big_pay_day` for StakeAccount remaining_accounts. Also mark `boost_record_info` as writable in the transaction (client-side).

**Warning signs:** BoostRecord `boosted_stake_id` stays at `u64::MAX` after `create_stake` runs — the write-back silently did nothing.

### Pitfall 5: token_interface vs Token2022 Program Account

**What goes wrong:** The seed token may be on SPL Token (not Token-2022). Using `Program<'info, Token2022>` for the `seed_token_program` account causes a constraint failure if the seed token is standard SPL Token.

**Why it happens:** Launchpad choice is not confirmed — seed token could be pump.fun (SPL Token) or Token-2022.

**How to avoid:** In `register_seed_boost`, accept `seed_token_program: Interface<'info, TokenInterface>` rather than `Program<'info, Token2022>`. Use `InterfaceAccount<TokenAccount>` for the seed ATA. This is already the pattern in `claim_rewards.rs` (`token_interface::Mint`, `InterfaceAccount<TokenAccount>`).

**Warning signs:** `register_seed_boost` transaction fails on devnet with "invalid program id" when the seed token is standard SPL Token.

### Pitfall 6: Double-Revocation / Idempotency

**What goes wrong:** `claim_rewards` is called twice in quick succession; both calls see `boost_revoked = false` before either writes `boost_revoked = true`. The user gets non-boosted rewards twice but the event is emitted twice.

**Why it happens:** On LiteSVM this is a non-issue (sequential transactions). On mainnet, atomic within one slot per transaction.

**How to avoid:** The `boost_revoked = true` write happens via `stake_mut.boost_revoked = true` BEFORE the `mint_to` CPI (Check-Effects-Interactions pattern, same as `reward_debt` update). This ensures the flag is set even if CPI fails.

---

## Code Examples

Verified patterns from official sources (all from existing codebase):

### Admin Instruction Template (admin_set_seed_mint)
```rust
// Source: programs/helix-staking/src/instructions/admin_set_slots_per_day.rs pattern

#[derive(Accounts)]
pub struct AdminSetSeedMint<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(
        mut,
        seeds = [GLOBAL_STATE_SEED],
        bump = global_state.bump,
        constraint = global_state.authority == authority.key() @ HelixError::Unauthorized,
    )]
    pub global_state: Account<'info, GlobalState>,
}

pub fn admin_set_seed_mint(ctx: Context<AdminSetSeedMint>, new_seed_mint: Pubkey) -> Result<()> {
    ctx.accounts.global_state.set_seed_mint(&new_seed_mint);
    // Emit event
    Ok(())
}
```

### apply_boost_multiplier (math.rs addition)
```rust
// Source: modeled on apply_loyalty_multiplier in claim_rewards.rs
// Applies 10% boost: result = amount * (BPS_SCALER + BOOST_MULTIPLIER_BPS) / BPS_SCALER
pub fn apply_boost_multiplier(amount: u64) -> Result<u64> {
    if amount == 0 { return Ok(0); }
    let boosted = (amount as u128)
        .checked_mul((BPS_SCALER + BOOST_MULTIPLIER_BPS) as u128)
        .ok_or(error!(HelixError::Overflow))?
        .checked_div(BPS_SCALER as u128)
        .ok_or(error!(HelixError::DivisionByZero))?;
    u64::try_from(boosted).map_err(|_| error!(HelixError::Overflow))
}
// Equivalent: mul_div(amount, BPS_SCALER + BOOST_MULTIPLIER_BPS, BPS_SCALER)
// 1_000_000 * 11000 / 10000 = 1_100_000 ✓ (10% boost)
```

### New Events
```rust
// Source: modeled on existing events.rs patterns

#[event]
pub struct BoostRegistered {
    pub slot: u64,
    pub user: Pubkey,
    pub seed_balance: u64,     // Balance at registration (not snapshot — just proof)
}

#[event]
pub struct BoostRevoked {
    pub slot: u64,
    pub user: Pubkey,
    pub stake_id: u64,
    pub current_balance: u64,   // Balance at revocation time
    pub required_balance: u64,  // seed_balance_at_stake (the snapshot)
}

#[event]
pub struct BoostedRewardsClaimed {
    pub slot: u64,
    pub user: Pubkey,
    pub stake_id: u64,
    pub base_amount: u64,       // loyalty_adjusted_rewards
    pub boost_amount: u64,      // additional 10%
    pub total_amount: u64,      // base + boost + bpd
}
```

### LiteSVM Boost Test Utility Functions (boost.test.ts pattern)
```typescript
// Source: modeled on utils.ts patterns (findStakePDA, getTokenBalance)
export const BOOST_RECORD_SEED = Buffer.from("boost_record");

export function findBoostRecordPDA(
  programId: PublicKey,
  user: PublicKey,
): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [BOOST_RECORD_SEED, user.toBuffer()],
    programId,
  );
}

// Helper to create a mock seed mint (Token-2022) and fund a user ATA
export async function createSeedMintAndFund(
  client: LiteSVM,
  program: any,
  payer: Keypair,
  user: PublicKey,
  amount: bigint,
): Promise<{ seedMint: PublicKey; seedAta: PublicKey }> {
  // ... uses spl-token-2022 createMint, createAssociatedTokenAccount, mintTo
}
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Separate realloc instruction per layout change | `realloc` constraint on every instruction that touches the account | Phase 3.3 (migrate_stake) | New instructions auto-upgrade old accounts on first touch |
| `Program<'info, Token2022>` hard-coded | `Interface<'info, TokenInterface>` + `InterfaceAccount` | anchor-spl 0.28+ | Handles both SPL Token and Token-2022 in same instruction |
| Manual PDA bump iteration | `Pubkey::try_find_program_address` + canonical bump validation | Existing pattern in pda.rs | Security: prevents non-canonical bump attacks |

---

## Open Questions

1. **GlobalState realloc on devnet/mainnet**
   - What we know: Extending `reserved` from `[u64; 6]` to `[u64; 10]` changes `GlobalState::LEN` and requires all existing GlobalState accounts to be migrated
   - What's unclear: Whether there's a deployed devnet instance that needs a `migrate_global_state` instruction vs. a clean devnet reset
   - Recommendation: Ask the team. If devnet, clean reset is far simpler. If there's a production state, add `migrate_global_state` instruction.

2. **update_boost_status instruction scope**
   - What we know: CONTEXT.md mentions this instruction in code_context but doesn't define it; crank (Phase 25) handles proactive revocation
   - What's unclear: Whether `update_boost_status` is user-callable (to self-revoke) or admin/crank-callable only
   - Recommendation: Make it permissionless — anyone can call it for any stake. It simply checks current seed balance vs. snapshot and sets `boost_revoked` if below. This allows the Phase 25 crank to call it without special authority.

3. **Seed ATA accounts in claim_rewards transaction size**
   - What we know: Adding `remaining_accounts` for seed ATA increases the number of accounts in the transaction; Solana's limit is 64 accounts (legacy) / higher with ALT
   - What's unclear: Whether the current `claim_rewards` transaction is already near the account limit
   - Recommendation: Count current accounts in `ClaimRewards` (7 accounts) + 1 seed ATA = 8. Well within limits. No ALT needed.

---

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest + LiteSVM (litesvm + anchor-litesvm) |
| Config file | `vitest.config.ts` in workspace root |
| Quick run command | `npx vitest run tests/litesvm/boost.test.ts` |
| Full suite command | `npx vitest run tests/litesvm/` |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| BOOST-01 | Admin sets seed_mint in GlobalState; re-callable | integration | `npx vitest run tests/litesvm/boost.test.ts -t "admin_set_seed_mint"` | ❌ Wave 0 |
| BOOST-01 | Admin sets min_seed_balance; admin_toggle_boost enables/disables | integration | `npx vitest run tests/litesvm/boost.test.ts -t "admin_toggle_boost"` | ❌ Wave 0 |
| BOOST-02 | register_seed_boost creates BoostRecord; rejects non-ATA; rejects below min balance | integration | `npx vitest run tests/litesvm/boost.test.ts -t "register_seed_boost"` | ❌ Wave 0 |
| BOOST-03 | create_stake writes seed_balance_at_stake when BoostRecord present | integration | `npx vitest run tests/litesvm/boost.test.ts -t "create_stake boost"` | ❌ Wave 0 |
| BOOST-04 | claim_rewards applies boost when current >= snapshot | integration | `npx vitest run tests/litesvm/boost.test.ts -t "claim_rewards boost active"` | ❌ Wave 0 |
| BOOST-04 | claim_rewards skips boost when current < snapshot; sets boost_revoked | integration | `npx vitest run tests/litesvm/boost.test.ts -t "claim_rewards boost revoked"` | ❌ Wave 0 |
| BOOST-05 | boost_revoked=true prevents boost even after repurchase | integration | `npx vitest run tests/litesvm/boost.test.ts -t "revocation permanent"` | ❌ Wave 0 |
| BOOST-06 | RewardsClaimed.amount is strictly higher for seed holder vs non-seed | integration | `npx vitest run tests/litesvm/boost.test.ts -t "boost mints extra tokens"` | ❌ Wave 0 |
| BOOST-07 | Sell surplus (balance stays >= snapshot) — no revocation | integration | `npx vitest run tests/litesvm/boost.test.ts -t "headroom"` | ❌ Wave 0 |

### Sampling Rate
- **Per task commit:** `npx vitest run tests/litesvm/boost.test.ts`
- **Per wave merge:** `npx vitest run tests/litesvm/`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `tests/litesvm/boost.test.ts` — entire test file; covers BOOST-01 through BOOST-07
- [ ] Seed mint creation helpers in `tests/litesvm/utils.ts` — `createSeedMintAndFund`, `findBoostRecordPDA`
- [ ] Rust unit tests in each new instruction file — `admin_set_seed_mint.rs`, `register_seed_boost.rs`, `update_boost_status.rs`
- [ ] Rust unit tests for `apply_boost_multiplier` in `math.rs`
- [ ] Rust unit tests for `get_seed_mint` / `set_seed_mint` / `get_min_seed_balance` / `get_boost_enabled` in `global_state.rs`

---

## Sources

### Primary (HIGH confidence)
- Existing codebase — `programs/helix-staking/src/` — all files read directly; patterns verified against working code
- `state/global_state.rs` — reserved slot pattern, LEN calculation
- `state/stake_account.rs` — current LEN (117), field layout, OLD_LEN / PHASE3_LEN migration history
- `state/referral_record.rs` — BoostRecord template
- `instructions/claim_rewards.rs` — loyalty multiplier pattern, BPD additive pattern, mint_to CPI
- `instructions/create_stake.rs` — remaining_accounts pattern for ClaimConfig
- `instructions/migrate_stake.rs` — realloc pattern
- `instructions/create_stake_with_referral.rs` — additional account pattern, referral record init
- `security/pda.rs` — validate_stake_pda pattern (template for validate_boost_record_pda)
- `tests/litesvm/utils.ts` — setupTest, initializeProtocol, advanceClock, getTokenBalance

### Secondary (MEDIUM confidence)
- Anchor docs pattern: `associated_token::mint` + `associated_token::authority` constraint for ATA validation — well-documented Anchor feature, verified by existing `user_token_account` usage in `create_stake.rs`
- `token_interface` vs `Token2022` flexibility — verified by `claim_rewards.rs` already using `InterfaceAccount<TokenAccount>` and `token_interface::Mint`

### Tertiary (LOW confidence)
- None — all findings are supported by in-codebase evidence at HIGH or MEDIUM level

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all libraries already in workspace Cargo.toml
- Architecture: HIGH — all patterns have working precedents in the existing codebase
- Pitfalls: HIGH — derived from concrete code analysis (reserved slot math, Anchor account handling)
- Validation: HIGH — existing test framework is well-established, only new test file needed

**Research date:** 2026-03-04
**Valid until:** 2026-04-04 (stable Anchor/LiteSVM ecosystem; internal patterns change only when team changes them)