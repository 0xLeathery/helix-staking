# SolHEX Critical Pitfalls Research

**Research Type:** Project Pitfalls
**Date:** 2026-02-07
**Context:** Greenfield HEX-style staking protocol on Solana
**Downstream:** Roadmap planning, security audit preparation, phase assignments

## Executive Summary

This document identifies critical pitfalls when building HEX-style staking protocols on Solana, specifically for SolHEX. Each pitfall includes warning signs, prevention strategies, and phase assignments for addressing during development. As a solo developer project, these patterns are essential for avoiding costly mistakes before security audits.

---

## 1. ANCHOR PROGRAM SECURITY

### 1.1 Integer Overflow/Underflow in Financial Calculations

**Risk Level:** CRITICAL
**Phase to Address:** Phase 2 (Smart Contract)

#### The Pitfall
Solana/Rust defaults to panicking on overflow in debug mode but wrapping in release mode. For a HEX-style protocol with 3.69% inflation calculations, T-share math, and penalty calculations involving large numbers (up to u128), unchecked arithmetic will silently wrap, causing catastrophic loss.

**Specific SolHEX Scenarios:**
- T-share calculations: `(amount * days) / 1820` could overflow with max stake (e.g., 1B tokens × 5555 days)
- Inflation distribution: `total_supply * 369 / 10000` over 15 years
- Penalty calculations: `stake_amount * penalty_rate / denominator`
- LPB/BPB bonus curves: polynomial calculations with large exponents

#### Warning Signs
- Test transactions succeed but mainnet with real amounts fail
- Rewards suddenly drop to zero or show impossible values
- Users with large stakes get fewer shares than small stakers
- Division results in zero when they shouldn't

#### Prevention Strategy

**Mandatory Use of Checked Math:**
```rust
// ❌ NEVER DO THIS
let t_shares = (amount * days) / 1820;

// ✅ ALWAYS DO THIS
let t_shares = amount
    .checked_mul(days)
    .and_then(|x| x.checked_div(1820))
    .ok_or(ErrorCode::ArithmeticOverflow)?;

// ✅ OR use a wrapper helper
fn safe_multiply_divide(a: u64, b: u64, c: u64) -> Result<u64> {
    a.checked_mul(b)
        .and_then(|x| x.checked_div(c))
        .ok_or(ErrorCode::ArithmeticOverflow)
}
```

**Anchor Configuration:**
```toml
# Cargo.toml - REQUIRED
[profile.release]
overflow-checks = true  # Explicitly enable in release builds
```

**Testing Requirements:**
- Test with max values: u64::MAX, u128::MAX
- Test boundary conditions: stake_amount = 1, days = 5555
- Fuzz testing for all financial operations
- Verify `overflow-checks = true` in CI/CD

**References:**
- Anchor best practice: checked arithmetic ([Anchor changelog](https://www.anchor-lang.com/docs/updates/changelog))
- Example from Solana Stack Exchange: [Safe math in Anchor](https://solana.stackexchange.com/questions/7948/)

---

### 1.2 PDA Collision Attacks

**Risk Level:** HIGH
**Phase to Address:** Phase 2 (Smart Contract)

#### The Pitfall
Program Derived Addresses (PDAs) in SolHEX will be used for stake accounts and potentially claim records. If seeds are not sufficiently unique, an attacker could:
1. Create a PDA that collides with another user's expected address
2. Front-run legitimate operations
3. Drain funds or manipulate state

**Specific SolHEX Scenarios:**
- Stake accounts: Must be unique per user per stake ID
- Claim records: Must be unique per user (SOL address) from snapshot
- T-share tracking accounts: Must prevent duplicate entries

#### Warning Signs
- Users unable to create stakes ("account already exists")
- Unexpected account ownership
- Failed transactions with "invalid seeds" errors
- Multiple users appear to share same PDA

#### Prevention Strategy

**Use Sufficiently Unique Seeds:**
```rust
// ❌ VULNERABLE - Only user pubkey
#[derive(Accounts)]
pub struct CreateStake<'info> {
    #[account(
        init,
        payer = user,
        space = 8 + StakeAccount::INIT_SPACE,
        seeds = [b"stake", user.key().as_ref()],
        bump
    )]
    pub stake: Account<'info, StakeAccount>,
    // ...
}

// ✅ SECURE - Include stake_id counter
#[derive(Accounts)]
#[instruction(stake_id: u64)]
pub struct CreateStake<'info> {
    #[account(
        init,
        payer = user,
        space = 8 + StakeAccount::INIT_SPACE,
        seeds = [
            b"stake",
            user.key().as_ref(),
            stake_id.to_le_bytes().as_ref()  // Unique per user
        ],
        bump
    )]
    pub stake: Account<'info, StakeAccount>,
    // ...
}

// ✅ SECURE - For claim accounts
#[account(
    init,
    payer = payer,
    space = 8 + ClaimRecord::INIT_SPACE,
    seeds = [
        b"claim",
        sol_snapshot_address.as_ref(),  // Original SOL address
        user.key().as_ref()              // Claiming Solana address
    ],
    bump
)]
pub claim_record: Account<'info, ClaimRecord>,
```

**Testing Requirements:**
- Attempt to create multiple stakes with same user
- Verify stake_id increments correctly
- Test claim uniqueness across snapshot addresses
- Audit all PDA derivations in code review

**References:**
- Anchor PDA examples ([Anchor basics](https://www.anchor-lang.com/docs/basics/pda))
- Stack Exchange discussion on [PDA seeds](https://solana.stackexchange.com/questions/1261/)

---

### 1.3 Account Closing & Reallocation Attacks

**Risk Level:** HIGH
**Phase to Address:** Phase 2 (Smart Contract)

#### The Pitfall
If a stake account can be closed (via `close` constraint) and its lamports recovered, an attacker could:
1. Create a stake
2. Close it before maturity
3. Replay the same PDA for a new stake
4. Potentially manipulate T-share calculations or claim double rewards

**Specific SolHEX Scenarios:**
- Early unstake should penalize, not close the account
- Claim accounts must never be closeable until after claim period
- Global state accounts must never be closeable

#### Warning Signs
- Accounts with data unexpectedly become zero balance
- Reinitialization of PDAs that should be immutable
- Users able to "reset" stakes without proper penalties
- Discriminator checks failing on previously valid accounts

#### Prevention Strategy

**Never Close Critical Accounts:**
```rust
// ❌ DANGEROUS
pub fn early_unstake(ctx: Context<EarlyUnstake>) -> Result<()> {
    let stake = &mut ctx.accounts.stake;
    // Calculate penalty
    let penalty = calculate_penalty(stake.amount, stake.days_left)?;
    // Transfer with penalty...

    // DON'T CLOSE - mark as completed instead
    // close_account(ctx.accounts.stake)?; // ❌
    Ok(())
}

// ✅ SECURE - Mark as withdrawn, keep account
#[account]
pub struct StakeAccount {
    pub owner: Pubkey,
    pub amount: u64,
    pub t_shares: u64,
    pub start_day: u64,
    pub end_day: u64,
    pub is_active: bool,      // ✅ Flag instead of close
    pub withdrawn_day: u64,   // ✅ Track when withdrawn
}

pub fn early_unstake(ctx: Context<EarlyUnstake>) -> Result<()> {
    let stake = &mut ctx.accounts.stake;

    require!(stake.is_active, ErrorCode::StakeAlreadyWithdrawn);

    // Mark as inactive
    stake.is_active = false;
    stake.withdrawn_day = current_day;

    // Process withdrawal with penalty...
    Ok(())
}

// ✅ For claim accounts - never close during claim window
#[account(
    mut,
    constraint = claim_record.claimed == false @ ErrorCode::AlreadyClaimed,
    // No close = realloc constraint here
)]
pub claim_record: Account<'info, ClaimRecord>,
```

**Testing Requirements:**
- Attempt to recreate closed PDAs
- Verify stake accounts persist after withdrawal
- Test that withdrawn stakes cannot be re-activated
- Audit all uses of `close` constraint

**References:**
- Anchor account closing ([Anchor changelog v0.8.0](https://www.anchor-lang.com/docs/updates/changelog))
- Neodyme audit: [Common Pitfalls](https://blog.neodyme.io/posts/solana_common_pitfalls)

---

### 1.4 Rent Exemption Edge Cases

**Risk Level:** MEDIUM
**Phase to Address:** Phase 2 (Smart Contract)

#### The Pitfall
Accounts below rent-exempt threshold can be garbage collected. If SolHEX creates accounts that fall below rent exemption (e.g., after partial withdrawals or dust amounts), data can be lost.

**Specific SolHEX Scenarios:**
- Small test stakes (< 0.001 SOL)
- Claim amounts below rent threshold
- Accumulated penalties reducing account balance

#### Warning Signs
- Accounts disappearing after epochs
- "Account not found" errors for previously valid accounts
- Balance decreasing without user action

#### Prevention Strategy

**Enforce Minimum Balances:**
```rust
// ✅ Require minimum stake amount
pub const MIN_STAKE_AMOUNT: u64 = 1_000_000; // 0.001 SOL

pub fn create_stake(
    ctx: Context<CreateStake>,
    amount: u64,
    days: u16
) -> Result<()> {
    require!(
        amount >= MIN_STAKE_AMOUNT,
        ErrorCode::StakeTooSmall
    );
    // ...
}

// ✅ Account space calculation
#[derive(Accounts)]
pub struct CreateStake<'info> {
    #[account(
        init,
        payer = user,
        space = 8 + StakeAccount::INIT_SPACE, // Discriminator + data
    )]
    pub stake: Account<'info, StakeAccount>,
}

// ✅ Verify rent exemption in tests
#[test]
fn test_rent_exemption() {
    let rent = Rent::default();
    let account_size = 8 + StakeAccount::INIT_SPACE;
    let min_balance = rent.minimum_balance(account_size);

    assert!(min_balance > 0);
    // Create stake with sufficient balance...
}
```

**Testing Requirements:**
- Calculate rent for all account types
- Test with minimum stake amounts
- Verify accounts persist across epochs
- Monitor rent-exempt thresholds during Solana upgrades

**References:**
- Solana rent documentation
- Anchor test examples ([Anchor tests](https://github.com/solana-foundation/anchor/blob/master/tests/misc))

---

## 2. TOKEN-2022 GOTCHAS

### 2.1 Extension Initialization Order

**Risk Level:** MEDIUM
**Phase to Address:** Phase 2 (Smart Contract)

#### The Pitfall
Token-2022 extensions (e.g., metadata, transfer hooks) must be initialized in a specific order BEFORE the mint is initialized. Incorrect order causes transaction failures.

**Specific SolHEX Scenarios:**
- If using Token-2022 for SOLHEX token
- Adding metadata pointer
- Future transfer hooks (unlikely for HEX mechanics)

#### Warning Signs
- Mint initialization fails with "invalid extension"
- Unable to add metadata after mint creation
- Extension instructions rejected

#### Prevention Strategy

**Correct Initialization Sequence:**
```rust
// ✅ Correct order from Solana docs
use spl_token_2022::{extension::ExtensionType, instruction::*};

// 1. Calculate space with extensions FIRST
let space = ExtensionType::try_calculate_account_len::<Mint>(&[
    ExtensionType::MintCloseAuthority,
    ExtensionType::MetadataPointer,
]).unwrap();

// 2. Create account with sufficient space
let create_instruction = system_instruction::create_account(
    &payer.pubkey(),
    mint_pubkey,
    rent_required,
    space,
    token_program_id
);

// 3. Initialize extensions BEFORE init_mint
let init_close_authority = initialize_mint_close_authority(
    token_program_id,
    mint_pubkey,
    Some(&close_authority.pubkey())
).unwrap();

let init_metadata_pointer = initialize_metadata_pointer(
    token_program_id,
    mint_pubkey,
    Some(authority.pubkey()),
    Some(mint_pubkey)
).unwrap();

// 4. Initialize mint LAST
let init_mint = initialize_mint(
    token_program_id,
    mint_pubkey,
    &mint_authority.pubkey(),
    Some(&freeze_authority.pubkey()),
    decimals
).unwrap();

// Transaction: [create, init_close, init_metadata, init_mint]
```

**Testing Requirements:**
- Test extension initialization on devnet
- Verify mint creation succeeds with all extensions
- Document required extension order in code comments

**References:**
- SPL Token-2022 docs ([Token-2022 extensions](https://www.solana-program.com/docs/token-2022/extensions))
- Extension initialization examples

---

### 2.2 Transfer Hook Complexity

**Risk Level:** LOW (if not using transfer hooks)
**Phase to Address:** Phase 2 (Smart Contract) - IF APPLICABLE

#### The Pitfall
Transfer hooks execute additional logic on every token transfer. If SolHEX uses Token-2022 with transfer hooks for rewards distribution or penalties, hooks can:
- Increase compute units significantly
- Fail if hook program has bugs
- Create composability issues with DEXs/wallets

**Specific SolHEX Scenarios:**
- Unlikely to need transfer hooks (HEX mechanics don't require per-transfer logic)
- May need hooks if implementing auto-staking on transfer

#### Prevention Strategy
**Avoid unless absolutely necessary.** If needed:
- Keep hook logic minimal (<5k CU)
- Test with DEX integrations (Jupiter, Orca)
- Provide clear docs for wallet developers

---

## 3. FINANCIAL MATH ON-CHAIN

### 3.1 Fixed-Point Arithmetic & Precision Loss

**Risk Level:** CRITICAL
**Phase to Address:** Phase 2 (Smart Contract)

#### The Pitfall
Solana has no native floating-point math. All calculations use integers. For SolHEX:
- **3.69% inflation** = `369 / 10000` but integer division truncates
- **LPB curve** = polynomial with large exponents
- **BPB curve** = bonus percentage calculations
- **T-shares** = `(amount * days) / 1820` loses precision on small amounts

**Specific SolHEX Scenarios:**
```rust
// ❌ PRECISION LOSS
let inflation_amount = total_supply * 369 / 10000; // Truncates!

// With total_supply = 100 tokens:
// Expected: 0.369 tokens
// Actual: 0 tokens (100 * 369 / 10000 = 3690 / 10000 = 0)

// ✅ CORRECT - Scale up first
const PRECISION: u64 = 1_000_000_000; // 9 decimals
let inflation_scaled = total_supply
    .checked_mul(369)?
    .checked_mul(PRECISION)?
    .checked_div(10000)?;
let inflation_amount = inflation_scaled / PRECISION;
```

#### Warning Signs
- Small stakes get 0 T-shares
- Inflation rewards are 0 for small holders
- Sum of individual rewards ≠ total inflation distributed
- Users with identical stakes get different rewards

#### Prevention Strategy

**Use High-Precision Math Library:**
```rust
// ✅ Use u128 for intermediate calculations
fn calculate_t_shares(amount: u64, days: u16) -> Result<u64> {
    const T_SHARE_RATE: u128 = 1820;

    let amount_u128 = amount as u128;
    let days_u128 = days as u128;

    let t_shares_u128 = amount_u128
        .checked_mul(days_u128)
        .ok_or(ErrorCode::Overflow)?
        .checked_div(T_SHARE_RATE)
        .ok_or(ErrorCode::Overflow)?;

    // Verify fits in u64 before downcasting
    u64::try_from(t_shares_u128)
        .map_err(|_| ErrorCode::Overflow.into())
}

// ✅ For percentage calculations
fn calculate_penalty(
    principal: u64,
    penalty_rate: u16, // e.g., 500 = 5%
) -> Result<u64> {
    const BASIS_POINTS: u64 = 10_000;

    (principal as u128)
        .checked_mul(penalty_rate as u128)?
        .checked_div(BASIS_POINTS)?
        .try_into()
        .map_err(|_| ErrorCode::Overflow.into())
}

// ✅ For daily inflation
fn calculate_daily_inflation(
    total_supply: u64,
    annual_rate_bps: u16, // 369 for 3.69%
) -> Result<u64> {
    const DAYS_PER_YEAR: u128 = 365;
    const BASIS_POINTS: u128 = 10_000;

    let daily_rate = (annual_rate_bps as u128)
        .checked_mul(total_supply as u128)?
        .checked_div(BASIS_POINTS)?
        .checked_div(DAYS_PER_YEAR)?;

    u64::try_from(daily_rate)
        .map_err(|_| ErrorCode::Overflow.into())
}
```

**Testing Requirements:**
- Test with amount = 1 (minimum)
- Test with amount = u64::MAX (maximum)
- Verify sum of parts = total (commutative property)
- Fuzz test all financial operations
- Compare against off-chain reference implementation

**Phase-Specific Checklist:**
- Phase 2: Implement and unit test all math functions
- Phase 5: Verify indexer calculations match on-chain
- Phase 10: Audit math operations before mainnet

---

### 3.2 Rounding Attacks

**Risk Level:** HIGH
**Phase to Address:** Phase 2 (Smart Contract)

#### The Pitfall
Attackers can exploit rounding by:
1. Creating many tiny stakes to accumulate rounding errors in their favor
2. Timing withdrawals to maximize rounding benefits
3. Manipulating share prices through dust trades

**Specific SolHEX Scenarios:**
- T-share calculation rounding: `(1 token * 5555 days) / 1820 = 3 T-shares` (should be 3.05)
- Inflation distribution: Rounding favors first claimer in each epoch
- Penalty calculations: Round down = user keeps dust

#### Warning Signs
- Users creating thousands of 1-token stakes
- Total T-shares drifting from expected value
- Inflation pool not fully distributed
- Withdrawal amounts slightly higher than deposited

#### Prevention Strategy

**Round in Protocol's Favor:**
```rust
// ✅ Always round DOWN for user benefits
fn calculate_withdrawal_amount(
    t_shares: u64,
    share_price: u64,
) -> Result<u64> {
    // Division automatically rounds down
    t_shares
        .checked_mul(share_price)?
        .checked_div(T_SHARE_PRECISION)
        .ok_or(ErrorCode::ArithmeticError)
}

// ✅ Always round UP for penalties
fn calculate_penalty_amount(
    principal: u64,
    penalty_rate: u16,
) -> Result<u64> {
    const BASIS_POINTS: u64 = 10_000;

    let penalty = principal
        .checked_mul(penalty_rate as u64)?
        .checked_add(BASIS_POINTS - 1)?  // Round up
        .checked_div(BASIS_POINTS)?;

    Ok(penalty)
}

// ✅ Enforce minimum stake to prevent dust attacks
pub const MIN_STAKE_AMOUNT: u64 = 1_000_000; // 0.001 SOL

pub fn create_stake(
    ctx: Context<CreateStake>,
    amount: u64,
    days: u16,
) -> Result<()> {
    require!(
        amount >= MIN_STAKE_AMOUNT,
        ErrorCode::StakeTooSmall
    );
    require!(
        days >= MIN_STAKE_DAYS && days <= MAX_STAKE_DAYS,
        ErrorCode::InvalidStakeDuration
    );
    // ...
}
```

**Testing Requirements:**
- Create 1000 minimum stakes, verify total = sum
- Test rounding direction for all operations
- Simulate attacker creating dust stakes
- Verify inflation distribution sums to total

---

## 4. MERKLE PROOF CLAIM SECURITY

### 4.1 Double-Claim Prevention

**Risk Level:** CRITICAL
**Phase to Address:** Phase 2 (Smart Contract)

#### The Pitfall
Without proper state tracking, users could:
1. Submit same Merkle proof multiple times
2. Claim from multiple Solana addresses for same SOL snapshot address
3. Drain the claim pool

**Specific SolHEX Scenarios:**
- SOL snapshot → SOLHEX free claim
- One SOL address should map to ONE claim
- Must prevent replay attacks

#### Warning Signs
- Claim pool depleting faster than expected
- Same proof succeeds multiple times
- Users claiming more than snapshot allocation

#### Prevention Strategy

**Use Claim Record PDAs:**
```rust
// ✅ Claim record tied to snapshot address
#[account]
pub struct ClaimRecord {
    pub sol_snapshot_address: Pubkey,  // From snapshot
    pub solana_claim_address: Pubkey,  // Who claimed it
    pub amount_claimed: u64,
    pub claimed_at: i64,
    pub bump: u8,
}

#[derive(Accounts)]
#[instruction(
    sol_snapshot_address: Pubkey,
    amount: u64,
    proof: Vec<[u8; 32]>
)]
pub struct ProcessClaim<'info> {
    #[account(mut)]
    pub claimer: Signer<'info>,

    // Claim record PDA prevents double claims
    #[account(
        init,
        payer = claimer,
        space = 8 + ClaimRecord::INIT_SPACE,
        seeds = [
            b"claim",
            sol_snapshot_address.as_ref(),  // Unique per SOL address
        ],
        bump
    )]
    pub claim_record: Account<'info, ClaimRecord>,

    #[account(
        mut,
        seeds = [b"claim_pool"],
        bump
    )]
    pub claim_pool: Account<'info, ClaimPool>,

    pub system_program: Program<'info, System>,
}

pub fn process_claim(
    ctx: Context<ProcessClaim>,
    sol_snapshot_address: Pubkey,
    amount: u64,
    proof: Vec<[u8; 32]>,
) -> Result<()> {
    // Verify Merkle proof
    let leaf = hash_claim_data(&sol_snapshot_address, amount);
    require!(
        verify_merkle_proof(&proof, ctx.accounts.claim_pool.merkle_root, leaf),
        ErrorCode::InvalidMerkleProof
    );

    // Initialize claim record (init constraint ensures one-time only)
    let claim_record = &mut ctx.accounts.claim_record;
    claim_record.sol_snapshot_address = sol_snapshot_address;
    claim_record.solana_claim_address = ctx.accounts.claimer.key();
    claim_record.amount_claimed = amount;
    claim_record.claimed_at = Clock::get()?.unix_timestamp;

    // Transfer tokens...

    Ok(())
}
```

**Testing Requirements:**
- Attempt to claim twice with same proof
- Verify `init` constraint prevents recreation
- Test claim after account closed (should fail)
- Audit Merkle proof verification logic

**References:**
- Merkle proof examples in SPL programs
- Anchor init constraint behavior

---

### 4.2 Merkle Proof Verification Compute Cost

**Risk Level:** MEDIUM
**Phase to Address:** Phase 2 (Smart Contract)

#### The Pitfall
Merkle proof verification for deep trees (e.g., 2^20 leaves = 20 proofs) can exceed compute budget (200k CU default). For SolHEX with potentially millions of SOL snapshot addresses:

**Specific SolHEX Scenarios:**
- SOL snapshot: ~50M addresses
- Tree depth: log2(50M) ≈ 26 levels
- Each hash ≈ 500 CU → 26 * 500 = 13k CU (acceptable)
- BUT: inefficient implementation could 10x this

#### Warning Signs
- Claims failing with "compute budget exceeded"
- Transaction simulation shows high CU usage
- Larger trees fail while small trees succeed

#### Prevention Strategy

**Optimize Hash Function:**
```rust
use solana_program::keccak;

// ✅ Use Solana's built-in keccak (most efficient)
fn hash_pair(a: [u8; 32], b: [u8; 32]) -> [u8; 32] {
    let mut combined = [0u8; 64];
    if a <= b {
        combined[..32].copy_from_slice(&a);
        combined[32..].copy_from_slice(&b);
    } else {
        combined[..32].copy_from_slice(&b);
        combined[32..].copy_from_slice(&a);
    }
    keccak::hash(&combined).to_bytes()
}

fn verify_merkle_proof(
    proof: &[[u8; 32]],
    root: [u8; 32],
    leaf: [u8; 32],
) -> bool {
    let mut computed_hash = leaf;

    for proof_element in proof.iter() {
        computed_hash = hash_pair(computed_hash, *proof_element);
    }

    computed_hash == root
}

// ✅ Add compute budget instruction
use solana_program::instruction::Instruction;
use solana_program::compute_budget::ComputeBudgetInstruction;

// In client code:
let compute_budget_ix = ComputeBudgetInstruction::set_compute_unit_limit(300_000);
// Add to transaction before claim instruction
```

**Testing Requirements:**
- Benchmark proof verification (vary tree depth)
- Test with 26-level tree (worst case)
- Monitor CU usage in transaction simulations
- Set appropriate compute budget in client

**Cost Analysis:**
- Depth 26 tree: ~13k CU (safe)
- Keep under 100k CU to leave room for other logic
- Consider batching if Big Pay Day claims exceed budget

---

## 5. TIME MANIPULATION RISKS

### 5.1 Clock Sysvar Reliability

**Risk Level:** MEDIUM
**Phase to Address:** Phase 2 (Smart Contract)

#### The Pitfall
SolHEX mechanics rely heavily on time:
- **Day number** for stake start/end
- **Epoch timing** for inflation distribution
- **Late unstake penalties** based on days past maturity

The `Clock` sysvar provides `unix_timestamp` and `slot`, but:
- Slots can be skipped (network issues)
- Validators can't manipulate timestamps significantly (consensus enforced)
- BUT: precision is ±30 seconds across validators

**Specific SolHEX Scenarios:**
- User stakes on day boundary: could be day N or N+1
- Unstake exactly on maturity: might be "late" by 1 day
- Inflation distribution: triggered by slot vs timestamp mismatch

#### Warning Signs
- Stakes show inconsistent day numbers
- Penalties applied when shouldn't be
- Inflation distribution timing drift
- Time-based logic behaving erratically

#### Prevention Strategy

**Use Slot Instead of Timestamp Where Possible:**
```rust
use solana_program::clock::Clock;

// ❌ Don't use unix_timestamp for critical logic
let clock = Clock::get()?;
let current_day = clock.unix_timestamp / 86400; // ❌ Can be inconsistent

// ✅ Use slot-based day counter (deterministic)
#[account]
pub struct GlobalState {
    pub genesis_slot: u64,      // Slot at program launch
    pub slots_per_day: u64,     // ~216,000 slots/day (400ms/slot)
    // ...
}

fn get_current_day(clock: &Clock, state: &GlobalState) -> Result<u64> {
    let slots_elapsed = clock.slot
        .checked_sub(state.genesis_slot)
        .ok_or(ErrorCode::InvalidClock)?;

    Ok(slots_elapsed / state.slots_per_day)
}

// ✅ For inflation timing, use epoch instead of day
#[account]
pub struct GlobalState {
    pub last_inflation_epoch: u64,
    // ...
}

pub fn distribute_inflation(ctx: Context<DistributeInflation>) -> Result<()> {
    let clock = Clock::get()?;
    let state = &mut ctx.accounts.global_state;

    // Only allow once per epoch
    require!(
        clock.epoch > state.last_inflation_epoch,
        ErrorCode::InflationAlreadyDistributed
    );

    state.last_inflation_epoch = clock.epoch;

    // Distribute rewards...
    Ok(())
}
```

**Testing Requirements:**
- Test day boundary conditions (slot = genesis + N * slots_per_day)
- Verify stakes created in same slot get same day number
- Test inflation triggers at epoch boundaries
- Document precision limitations in user-facing docs

**References:**
- Solana Clock sysvar documentation
- Epoch schedule: ~2-3 days per epoch

---

### 5.2 Crank Timing Attacks

**Risk Level:** LOW
**Phase to Address:** Phase 5 (Blockchain Sync)

#### The Pitfall
If SolHEX uses "crank" functions (e.g., anyone can call `distribute_inflation`), attackers could:
1. Delay calling the crank to manipulate inflation timing
2. Front-run crank calls to extract MEV
3. Spam crank calls to waste compute

**Specific SolHEX Scenarios:**
- Big Pay Day distribution (manual trigger?)
- Daily inflation distribution (if not automatic)
- Stake maturity checks (if requires crank)

#### Prevention Strategy

**Make Cranks Permissionless But Idempotent:**
```rust
// ✅ Anyone can call, but only works once per epoch
pub fn distribute_daily_inflation(
    ctx: Context<DistributeInflation>
) -> Result<()> {
    let clock = Clock::get()?;
    let state = &mut ctx.accounts.global_state;

    // Check if already distributed this epoch
    require!(
        clock.epoch > state.last_inflation_epoch,
        ErrorCode::AlreadyDistributed
    );

    state.last_inflation_epoch = clock.epoch;

    // Calculate and distribute...

    Ok(())
}

// ✅ Incentivize crank callers (optional)
pub fn distribute_daily_inflation(
    ctx: Context<DistributeInflation>
) -> Result<()> {
    // ... distribution logic ...

    // Reward caller with small fee
    let crank_reward = 1_000_000; // 0.001 SOL
    **ctx.accounts.crank_caller.lamports.borrow_mut() += crank_reward;

    Ok(())
}
```

**Testing Requirements:**
- Call crank multiple times in same epoch (should fail)
- Verify crank works across epoch boundary
- Test crank rewards (if applicable)

---

## 6. FRONTEND WALLET INTEGRATION

### 6.1 Transaction Size Limits

**Risk Level:** MEDIUM
**Phase to Address:** Phase 3 (Agent Identity) & Phase 9 (Dashboard)

#### The Pitfall
Solana transactions are limited to **1232 bytes** (legacy) or **1644 bytes** (v0 with lookup tables). For SolHEX:
- **Merkle proofs** with 26 hashes = 26 * 32 = 832 bytes
- **Multiple instructions** (compute budget + claim + transfer) = ~300 bytes
- **Accounts** = ~32 bytes each × 5 = 160 bytes
- **Total**: ~1292 bytes → **EXCEEDS LEGACY LIMIT**

**Specific SolHEX Scenarios:**
- Free claim with deep Merkle proof
- Batch operations (multiple stakes in one tx)
- Complex transactions during Big Pay Day

#### Warning Signs
- Transactions fail with "transaction too large"
- Wallets reject transaction before submission
- Serialization errors in client code
- Transactions work in tests but fail in production

#### Prevention Strategy

**Use Versioned Transactions (v0):**
```typescript
// ✅ Use v0 transactions for larger data
import {
    VersionedTransaction,
    TransactionMessage,
    AddressLookupTableProgram,
} from '@solana/web3.js';

// Create v0 transaction
const message = new TransactionMessage({
    payerKey: wallet.publicKey,
    recentBlockhash: blockhash,
    instructions: [
        computeBudgetIx,
        claimIx,
    ],
}).compileToV0Message();

const tx = new VersionedTransaction(message);

// ✅ For large Merkle proofs, split into multiple transactions
async function processClaim(
    connection: Connection,
    wallet: Wallet,
    proof: Buffer[],
    amount: BN,
) {
    // If proof is too large, use an alternative approach:
    // Option 1: Store proof on-chain in separate account
    // Option 2: Use compressed proof format
    // Option 3: Batch verification in multiple transactions

    if (proof.length > 20) {
        // Store proof in account first
        const storeProofIx = await createStoreProofInstruction(wallet, proof);
        await sendAndConfirm(connection, [storeProofIx], wallet);

        // Then claim using stored proof
        const claimIx = await createClaimWithStoredProofInstruction(wallet, amount);
        await sendAndConfirm(connection, [claimIx], wallet);
    } else {
        // Direct claim
        const claimIx = await createClaimInstruction(wallet, amount, proof);
        await sendAndConfirm(connection, [claimIx], wallet);
    }
}
```

**Testing Requirements:**
- Calculate transaction size for max-depth proof
- Test with v0 and legacy transactions
- Verify wallet compatibility (Phantom, Solflare support v0)
- Document transaction version requirements

**Alternative Solutions:**
- Store Merkle proof on-chain in separate account (adds cost)
- Use proof compression techniques
- Batch claims in multiple transactions

---

### 6.2 Blockhash Expiration Handling

**Risk Level:** MEDIUM
**Phase to Address:** Phase 3 (Agent Identity) & Phase 9 (Dashboard)

#### The Pitfall
Solana blockhashes expire after **~60 seconds** (151 blocks). If a user:
1. Signs a transaction
2. Waits >60s before submitting
3. Transaction fails with "blockhash not found"

**Specific SolHEX Scenarios:**
- User creates stake, reviews in wallet, waits >60s → transaction fails
- Hardware wallet users (slow to sign) → frequent failures
- Mobile wallet users (network latency) → intermittent failures

#### Warning Signs
- Users reporting "transaction failed" after wallet confirmation
- Higher failure rate for hardware wallet users
- Transactions succeed in simulation but fail on submission
- Error: "Blockhash not found"

#### Prevention Strategy

**Implement Retry with Fresh Blockhash:**
```typescript
// ✅ Retry logic with blockhash refresh
async function sendTransactionWithRetry(
    connection: Connection,
    transaction: Transaction,
    signers: Keypair[],
    maxRetries: number = 3,
): Promise<string> {
    let lastError: Error | null = null;

    for (let i = 0; i < maxRetries; i++) {
        try {
            // Get fresh blockhash for each attempt
            const { blockhash, lastValidBlockHeight } =
                await connection.getLatestBlockhash('finalized');

            transaction.recentBlockhash = blockhash;
            transaction.lastValidBlockHeight = lastValidBlockHeight;

            // Sign and send
            transaction.sign(...signers);
            const signature = await connection.sendRawTransaction(
                transaction.serialize(),
                {
                    skipPreflight: false,
                    maxRetries: 0, // Handle retries ourselves
                }
            );

            // Wait for confirmation
            await connection.confirmTransaction({
                signature,
                blockhash,
                lastValidBlockHeight,
            });

            return signature;

        } catch (error) {
            lastError = error as Error;

            // If blockhash expired, retry with new one
            if (error.message.includes('Blockhash not found')) {
                console.log(`Retry ${i + 1}/${maxRetries}: Blockhash expired`);
                continue;
            }

            // Other errors, don't retry
            throw error;
        }
    }

    throw lastError || new Error('Transaction failed after retries');
}

// ✅ Warn users about expiration
function showTransactionModal(tx: Transaction) {
    return (
        <Modal>
            <p>Please sign and submit within 60 seconds</p>
            <Timer duration={60} onExpire={() => refreshBlockhash()} />
            <SignButton onClick={() => signAndSend(tx)} />
        </Modal>
    );
}
```

**Testing Requirements:**
- Simulate blockhash expiration (wait >60s)
- Test retry logic with expired blockhash
- Verify user experience with slow wallets
- Document expiration behavior in user guide

**References:**
- Solana transaction expiration
- Wallet SDK retry patterns

---

## 7. INDEXER RELIABILITY

### 7.1 Missed Events & Reorg Handling

**Risk Level:** HIGH
**Phase to Address:** Phase 5 (Blockchain Sync)

#### The Pitfall
Indexers can miss events due to:
- **Slot skips** (validators fail to produce blocks)
- **Reorgs** (forks in the blockchain, ~0.01% of blocks)
- **RPC node issues** (rate limits, connection drops)
- **Parser bugs** (failing to decode specific instruction types)

For SolHEX, this could mean:
- User stakes but indexer doesn't see it → UI shows 0 balance
- Inflation distributed but indexer misses it → rewards incorrect
- Big Pay Day triggered but event not captured

#### Warning Signs
- User balances in UI don't match on-chain state
- Sum of stakes in indexer ≠ total T-shares on-chain
- Missing transactions in explorer
- Gaps in event history

#### Prevention Strategy

**Implement Checkpoint & Recovery System:**
```rust
// ✅ On-chain: Add monotonic counter for events
#[account]
pub struct GlobalState {
    pub total_stakes_created: u64,     // Increments on each stake
    pub total_claims_processed: u64,   // Increments on each claim
    pub last_inflation_epoch: u64,
    // ...
}

#[event]
pub struct StakeCreated {
    pub stake_id: u64,           // Global monotonic ID
    pub owner: Pubkey,
    pub amount: u64,
    pub t_shares: u64,
    pub start_day: u64,
    pub end_day: u64,
}

pub fn create_stake(
    ctx: Context<CreateStake>,
    amount: u64,
    days: u16,
) -> Result<()> {
    let state = &mut ctx.accounts.global_state;

    // Increment global counter
    state.total_stakes_created = state.total_stakes_created
        .checked_add(1)
        .ok_or(ErrorCode::Overflow)?;

    let stake_id = state.total_stakes_created;

    // Emit event with ID
    emit!(StakeCreated {
        stake_id,
        owner: ctx.accounts.user.key(),
        amount,
        // ...
    });

    Ok(())
}
```

**Indexer Recovery Logic:**
```typescript
// ✅ Indexer: Detect and recover from gaps
interface IndexerState {
    lastProcessedSlot: number;
    lastStakeId: number;
    lastClaimId: number;
}

async function syncWithRecovery(
    connection: Connection,
    programId: PublicKey,
    state: IndexerState,
) {
    // Get on-chain counters
    const globalState = await fetchGlobalState(connection, programId);

    // Detect gap
    if (state.lastStakeId < globalState.total_stakes_created) {
        console.warn(`Gap detected: local=${state.lastStakeId}, on-chain=${globalState.total_stakes_created}`);

        // Backfill missing events
        await backfillStakes(
            connection,
            programId,
            state.lastStakeId + 1,
            globalState.total_stakes_created
        );
    }

    // Continue normal sync
    await subscribeToEvents(connection, programId, state.lastProcessedSlot);
}

async function backfillStakes(
    connection: Connection,
    programId: PublicKey,
    fromId: number,
    toId: number,
) {
    // Query all stake accounts, filter by ID range
    const accounts = await connection.getProgramAccounts(programId, {
        filters: [
            { dataSize: 8 + StakeAccount.SPACE },
            // Filter by stake_id range (requires indexed field)
        ],
    });

    // Process missing stakes
    for (const account of accounts) {
        const stake = decodeStakeAccount(account.account.data);
        if (stake.stakeId >= fromId && stake.stakeId <= toId) {
            await indexStake(stake);
        }
    }
}

// ✅ Reorg detection
async function detectReorg(
    connection: Connection,
    lastProcessedBlockhash: string,
): Promise<boolean> {
    try {
        const status = await connection.getSignatureStatus(lastProcessedBlockhash);
        return status === null; // Blockhash disappeared = reorg
    } catch {
        return true; // Assume reorg if query fails
    }
}
```

**Testing Requirements:**
- Simulate slot skips (stop RPC node mid-sync)
- Test gap detection and recovery
- Verify monotonic IDs are continuous
- Audit indexer against on-chain state weekly

**Phase 5 Deliverables:**
- Checkpoint system (slot + event IDs)
- Backfill logic for gaps
- Reorg detection and recovery
- Monitoring alerts for indexer lag

**References:**
- Solana reorg frequency: ~0.01% of blocks
- Geyser plugin for reliable indexing

---

### 7.2 Checkpoint & Recovery Strategy

**Risk Level:** HIGH
**Phase to Address:** Phase 5 (Blockchain Sync)

**Already covered in 7.1 - see above**

---

## 8. ECONOMIC DESIGN FLAWS

### 8.1 Inflation Death Spiral

**Risk Level:** CRITICAL
**Phase to Address:** Phase 2 (Smart Contract) + Phase 10 (Audits)

#### The Pitfall
If inflation rewards (3.69% APY) become worth less than the cost to claim them, users will:
1. Stop staking → T-shares decrease
2. Remaining stakers get higher share of inflation → but total value drops
3. More users leave → death spiral

**Specific SolHEX Scenarios:**
- Gas costs to claim > reward amount
- Inflation dilutes token value faster than rewards accumulate
- Late unstake penalties too harsh → users never stake long-term

#### Warning Signs
- T-share supply declining month-over-month
- Average stake duration decreasing
- Claim transaction volume dropping
- Token price declining faster than inflation rate

#### Prevention Strategy

**Design Checks (Pre-Launch):**
```typescript
// ✅ Model worst-case scenarios
function simulateInflationEconomics() {
    const scenarios = [
        { gasPrice: 0.0001, tokenPrice: 0.01, stakingRate: 10 },
        { gasPrice: 0.001, tokenPrice: 0.001, stakingRate: 5 },
        { gasPrice: 0.01, tokenPrice: 0.0001, stakingRate: 1 },
    ];

    for (const scenario of scenarios) {
        const dailyReward = calculateDailyReward(
            1000, // stake amount
            scenario.tokenPrice,
            scenario.stakingRate
        );

        const claimCost = scenario.gasPrice;

        if (claimCost > dailyReward * 365) {
            console.error(`Death spiral risk: ${JSON.stringify(scenario)}`);
        }
    }
}

// ✅ Ensure minimum viable stake economics
const MIN_VIABLE_STAKE = 1000; // tokens
const ANNUAL_INFLATION = 0.0369;
const WORST_CASE_GAS = 0.001; // SOL

const minReward = MIN_VIABLE_STAKE * ANNUAL_INFLATION;
if (minReward < WORST_CASE_GAS * 100) { // 100x gas cost
    throw new Error('Economics unsustainable');
}
```

**Mitigation Mechanisms:**
1. **Compound rewards automatically** (avoid claim gas costs)
2. **Batch claim operations** (amortize gas across multiple users)
3. **Emergency inflation adjustment** (governance-controlled, e.g., decrease from 3.69% to 2% if needed)

**Testing Requirements:**
- Economic modeling spreadsheet (shared with auditors)
- Simulate 10-year projection under various token prices
- Stress test with 99% of tokens unstaked
- Document sustainable ranges in whitepaper

**References:**
- HEX tokenomics (study original design)
- Failed staking protocols (e.g., OHM, TITAN)

---

### 8.2 Whale Manipulation of T-Shares

**Risk Level:** HIGH
**Phase to Address:** Phase 2 (Smart Contract)

#### The Pitfall
A whale could:
1. Stake 90% of supply for 5555 days
2. Accumulate 90% of all T-shares
3. Receive 90% of all future inflation
4. Late-unstake and dump on the market, crashing price

**Specific SolHEX Scenarios:**
- Large holder from free claim stakes maximum amount
- Coordinates mass early-unstake to trigger panic
- Manipulates Big Pay Day by timing stakes

#### Warning Signs
- Single address holds >30% of T-shares
- Sudden large stake right before Big Pay Day
- Coordinated unstakes across multiple addresses
- T-share distribution increasingly concentrated

#### Prevention Strategy

**No Code-Level Fix (Economic Design):**
```rust
// ⚠️ Cannot prevent at smart contract level
// Whales can always buy and stake more

// ✅ But can add transparency
#[account]
pub struct GlobalState {
    pub top_10_holders: [TopHolder; 10], // Track largest T-share holders
    pub gini_coefficient: u16,           // Wealth distribution metric
    // ...
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct TopHolder {
    pub address: Pubkey,
    pub t_shares: u64,
    pub percentage: u16, // Basis points (e.g., 2500 = 25%)
}

// Update on every stake/unstake
pub fn create_stake(ctx: Context<CreateStake>, amount: u64, days: u16) -> Result<()> {
    // ... normal stake logic ...

    // Update distribution metrics
    update_holder_distribution(&mut ctx.accounts.global_state)?;

    Ok(())
}
```

**Mitigation via Tokenomics:**
1. **Long lock bonuses** (LPB) incentivize long-term holding
2. **Early unstake penalties** (50%+) deter manipulation
3. **Community monitoring** (publish T-share distribution weekly)
4. **Gradual distribution** (Big Pay Day over 50 weeks, not instant)

**Testing Requirements:**
- Simulate whale with 50% of supply
- Model impact of early unstake on remaining stakers
- Publish distribution metrics on explorer

---

### 8.3 Early Unstake Gaming

**Risk Level:** MEDIUM
**Phase to Address:** Phase 2 (Smart Contract)

#### The Pitfall
Users could game early unstake penalties if:
1. Penalty is too lenient → everyone unstakes early
2. Penalty is too harsh → no one stakes long-term
3. Penalty calculation has bugs → users extract value

**Specific SolHEX Scenarios:**
- Penalty = `principal * days_remaining / total_days` might allow gaming
- Users stake 5555 days, then unstake next day with minimal penalty
- Calculate that short-term + penalty is better than not staking

#### Warning Signs
- Most stakes unstake within first 10% of duration
- Users exploiting penalty rounding errors
- Penalty revenue lower than expected

#### Prevention Strategy

**Implement HEX-Style Penalties:**
```rust
// ✅ Early unstake penalty (50% principal + all interest)
pub fn early_unstake(ctx: Context<EarlyUnstake>) -> Result<()> {
    let stake = &ctx.accounts.stake;
    let current_day = get_current_day(&Clock::get()?, &ctx.accounts.global_state)?;

    require!(stake.is_active, ErrorCode::StakeNotActive);
    require!(current_day < stake.end_day, ErrorCode::StakeMatured);

    // Calculate penalty
    let penalty_rate = if current_day < stake.start_day + 7 {
        50_00 // 50% if within first week
    } else {
        // Linear penalty: 50% → 10% over stake duration
        let days_elapsed = current_day - stake.start_day;
        let total_duration = stake.end_day - stake.start_day;
        let penalty_reduction = (days_elapsed * 40_00) / total_duration;
        50_00 - penalty_reduction.min(40_00) // Min 10% penalty
    };

    let penalty_amount = stake.principal
        .checked_mul(penalty_rate as u64)?
        .checked_div(100_00)?;

    let withdrawal_amount = stake.principal
        .checked_sub(penalty_amount)?;

    // All accrued interest is forfeited (goes to penalty pool)
    let penalty_pool = &mut ctx.accounts.penalty_pool;
    penalty_pool.total_penalties = penalty_pool.total_penalties
        .checked_add(penalty_amount)?
        .checked_add(stake.accrued_interest)?;

    // Transfer withdrawal amount to user...

    // Mark stake as inactive
    stake.is_active = false;
    stake.withdrawn_day = current_day;

    emit!(EarlyUnstakeEvent {
        stake_id: stake.stake_id,
        owner: stake.owner,
        principal: stake.principal,
        penalty_amount,
        withdrawal_amount,
    });

    Ok(())
}
```

**Testing Requirements:**
- Test early unstake at day 1, 7, 100, 5000
- Verify penalty amounts match specification
- Simulate user creating 1000 tiny stakes and unstaking
- Audit penalty pool accounting

---

### 8.4 Big Pay Day Gaming

**Risk Level:** MEDIUM
**Phase to Address:** Phase 2 (Smart Contract)

#### The Pitfall
If Big Pay Day rewards are known in advance, whales could:
1. Stake maximum amount just before BPD snapshot
2. Claim huge portion of BPD rewards
3. Immediately unstake (with penalty)
4. Net profit from BPD > early unstake penalty

**Specific SolHEX Scenarios:**
- BPD triggered at specific day/slot known in advance
- Snapshot uses T-shares at exact moment
- Whale coordinates 100 wallets to stake simultaneously

#### Warning Signs
- Large stakes created exactly before BPD
- Immediate unstakes after BPD distribution
- T-share supply spikes then crashes around BPD

#### Prevention Strategy

**Time-Weighted BPD Allocation:**
```rust
// ✅ BPD rewards based on time-weighted average, not snapshot
#[account]
pub struct StakeAccount {
    pub owner: Pubkey,
    pub principal: u64,
    pub t_shares: u64,
    pub start_day: u64,
    pub end_day: u64,
    pub t_share_days_accrued: u128,  // ✅ Accumulates daily
    // ...
}

// ✅ Update T-share-days on every relevant action
pub fn update_t_share_days(
    stake: &mut StakeAccount,
    current_day: u64,
) -> Result<()> {
    if !stake.is_active {
        return Ok(());
    }

    let days_since_last_update = current_day
        .checked_sub(stake.last_updated_day)?;

    let new_t_share_days = (stake.t_shares as u128)
        .checked_mul(days_since_last_update as u128)?;

    stake.t_share_days_accrued = stake.t_share_days_accrued
        .checked_add(new_t_share_days)?;

    stake.last_updated_day = current_day;

    Ok(())
}

// ✅ BPD distribution uses time-weighted T-shares
pub fn claim_bpd_share(ctx: Context<ClaimBPD>) -> Result<()> {
    let stake = &mut ctx.accounts.stake;
    let bpd_state = &ctx.accounts.bpd_state;

    // Update T-share-days to BPD trigger day
    update_t_share_days(stake, bpd_state.trigger_day)?;

    // Calculate share
    let user_share = stake.t_share_days_accrued
        .checked_mul(bpd_state.total_pool as u128)?
        .checked_div(bpd_state.total_t_share_days)?;

    // Prevent re-claiming
    require!(!stake.claimed_bpd, ErrorCode::AlreadyClaimedBPD);
    stake.claimed_bpd = true;

    // Transfer BPD reward...

    Ok(())
}
```

**Testing Requirements:**
- Simulate whale staking right before BPD
- Verify time-weighted allocation prevents gaming
- Test BPD distribution sums to total pool
- Audit BPD logic separately (high-value target)

---

## 9. SOLANA-SPECIFIC LIMITS

### 9.1 Compute Budget for Complex Operations

**Risk Level:** HIGH
**Phase to Address:** Phase 2 (Smart Contract)

#### The Pitfall
Default compute budget is **200,000 CU per instruction**. SolHEX operations that could exceed:
- Big Pay Day distribution (iterating many stakes)
- Merkle proof verification (26 levels)
- Complex math (LPB/BPB curves, inflation calculation)
- Multiple account writes (update global state + user stake + pool)

#### Warning Signs
- Transactions fail with "exceeded CU budget"
- Simulation shows CU usage >180k
- Production transactions inconsistent with testing

#### Prevention Strategy

**Request Additional Compute:**
```rust
// ✅ In client code
use solana_sdk::compute_budget::ComputeBudgetInstruction;

let compute_budget_ix = ComputeBudgetInstruction::set_compute_unit_limit(400_000);
let priority_fee_ix = ComputeBudgetInstruction::set_compute_unit_price(1_000);

// Add to transaction BEFORE program instructions
let tx = Transaction::new_signed_with_payer(
    &[
        compute_budget_ix,     // ✅ First
        priority_fee_ix,       // ✅ Second
        program_ix,            // ✅ Third
    ],
    Some(&payer.pubkey()),
    &[&payer],
    recent_blockhash,
);

// ✅ In program code: optimize loops
pub fn distribute_inflation_batch(
    ctx: Context<DistributeBatch>,
    start_index: u32,
    count: u32,
) -> Result<()> {
    // Batch processing to stay under CU limit
    let stakes = &ctx.accounts.stakes;

    require!(
        count <= 100,  // Max 100 stakes per call
        ErrorCode::BatchTooLarge
    );

    for i in start_index..(start_index + count) {
        let stake = &mut stakes[i as usize];
        // Process inflation for this stake...
    }

    Ok(())
}
```

**Optimization Techniques:**
```rust
// ✅ Minimize account writes
#[account(mut)]
pub global_state: Account<'info, GlobalState>, // Only write once

// ✅ Use zero-copy for large accounts (if >10KB)
#[account(zero_copy)]
pub large_data: AccountLoader<'info, LargeData>,

// ✅ Avoid expensive operations
// ❌ Floating point (not available on-chain)
// ❌ Division in loops (use multiplication)
// ✅ Bitwise operations
```

**Testing Requirements:**
- Simulate max complexity (26-level proof + max stake)
- Measure CU usage for each instruction
- Test with compute budget limits (100k, 200k, 400k)
- Document required CU in client code

**References:**
- Solana compute budget docs
- Optimization guide

---

### 9.2 Account Size Limits

**Risk Level:** MEDIUM
**Phase to Address:** Phase 2 (Smart Contract)

#### The Pitfall
Maximum account size is **10MB**. SolHEX accounts that could hit this:
- Global state (if storing too much historical data)
- Stake registry (if trying to store all stakes in one account)
- Claim pool (if storing Merkle tree on-chain)

**Specific SolHEX Scenarios:**
- ❌ Storing all stake records in global state
- ❌ Storing Merkle tree on-chain (millions of leaves)
- ✅ Each stake = separate PDA (unlimited total)

#### Warning Signs
- Account initialization fails with "insufficient space"
- Realloc operations fail
- Cannot add more data to account

#### Prevention Strategy

**Use Separate PDAs:**
```rust
// ❌ DON'T store all stakes in one account
#[account]
pub struct GlobalState {
    pub all_stakes: Vec<StakeAccount>, // ❌ Will hit 10MB limit
}

// ✅ DO use separate PDAs per stake
#[account]
pub struct StakeAccount {
    pub owner: Pubkey,
    pub principal: u64,
    pub t_shares: u64,
    // ... (165 bytes total)
}

// Each stake = separate 165-byte PDA
// Unlimited stakes possible

// ✅ Global state only stores aggregates
#[account]
pub struct GlobalState {
    pub total_staked: u64,
    pub total_t_shares: u64,
    pub total_stakes_count: u64,
    pub total_penalties: u64,
    // ... (< 1KB)
}
```

**Account Size Limits:**
- **10MB** = max per account
- **10KB** = max realloc per instruction
- **1KB** = recommended for frequently updated accounts

**Testing Requirements:**
- Calculate max account sizes
- Test realloc operations (if used)
- Verify no single account >1KB (unless zero-copy)

---

## 10. LAUNCH RISKS

### 10.1 Bot Sniping on Free Claim

**Risk Level:** HIGH
**Phase to Address:** Phase 3 (Agent Identity)

#### The Pitfall
Bots can monitor mempool and:
1. See user claim transaction
2. Extract Merkle proof from transaction data
3. Front-run with higher priority fee
4. Steal user's claim

**Specific SolHEX Scenarios:**
- Free claim from SOL snapshot
- Merkle proof visible in transaction
- High-value claims (whales) especially vulnerable

#### Warning Signs
- Users report "already claimed" when they didn't claim
- Claims from addresses not in snapshot
- High percentage of claims from same few addresses

#### Prevention Strategy

**Require Signature from Snapshot Address:**
```rust
// ✅ Claim requires signature from original SOL address
#[derive(Accounts)]
#[instruction(
    amount: u64,
    proof: Vec<[u8; 32]>
)]
pub struct ProcessClaim<'info> {
    #[account(mut)]
    pub claimer: Signer<'info>,  // Solana address claiming

    // ✅ CRITICAL: Require signature from snapshot address
    pub sol_snapshot_signer: Signer<'info>,  // Original SOL address

    #[account(
        init,
        payer = claimer,
        space = 8 + ClaimRecord::INIT_SPACE,
        seeds = [
            b"claim",
            sol_snapshot_signer.key().as_ref(),  // ✅ Tied to signer
        ],
        bump
    )]
    pub claim_record: Account<'info, ClaimRecord>,
    // ...
}

pub fn process_claim(
    ctx: Context<ProcessClaim>,
    amount: u64,
    proof: Vec<[u8; 32]>,
) -> Result<()> {
    // Verify Merkle proof against snapshot signer
    let leaf = hash_claim_data(
        &ctx.accounts.sol_snapshot_signer.key(),
        amount
    );

    require!(
        verify_merkle_proof(&proof, ctx.accounts.claim_pool.merkle_root, leaf),
        ErrorCode::InvalidMerkleProof
    );

    // Initialize claim record
    let claim_record = &mut ctx.accounts.claim_record;
    claim_record.sol_snapshot_address = ctx.accounts.sol_snapshot_signer.key();
    claim_record.solana_claim_address = ctx.accounts.claimer.key();
    claim_record.amount_claimed = amount;

    // Transfer tokens to claimer...

    Ok(())
}
```

**Alternative: Two-Step Claim:**
```rust
// Step 1: Register intent (signed by snapshot address)
pub fn register_claim_intent(
    ctx: Context<RegisterIntent>,
    destination: Pubkey,
) -> Result<()> {
    let intent = &mut ctx.accounts.claim_intent;
    intent.sol_snapshot_address = ctx.accounts.snapshot_signer.key();
    intent.destination = destination;
    intent.timestamp = Clock::get()?.unix_timestamp;
    Ok(())
}

// Step 2: Claim (24 hours later, prevents front-running)
pub fn claim_with_intent(
    ctx: Context<ClaimWithIntent>,
    amount: u64,
    proof: Vec<[u8; 32]>,
) -> Result<()> {
    let intent = &ctx.accounts.claim_intent;

    // Verify time delay
    require!(
        Clock::get()?.unix_timestamp >= intent.timestamp + 86400,
        ErrorCode::IntentTooRecent
    );

    // Verify destination matches
    require!(
        ctx.accounts.claimer.key() == intent.destination,
        ErrorCode::InvalidDestination
    );

    // Process claim...
    Ok(())
}
```

**Testing Requirements:**
- Simulate bot front-running claim transaction
- Verify signature requirement prevents theft
- Test with hardware wallet (slow signing)
- Document claim process clearly in UI

---

### 10.2 Front-Running Stakes

**Risk Level:** LOW
**Phase to Address:** Phase 2 (Smart Contract)

#### The Pitfall
Bots could front-run stake transactions to:
- Extract information about large stakes
- Manipulate T-share price before large stake executes

**However:** Unlike claims, stakes don't leak valuable info to front-runners since:
- Each user gets their own PDA (no competition)
- T-share calculation is deterministic
- No slippage or price impact

#### Prevention Strategy
**Not required - stakes are not vulnerable to front-running.**

Monitor for:
- MEV bots extracting value
- Unusual staking patterns around large transactions

---

## PHASE MAPPING SUMMARY

| Pitfall | Risk | Phase(s) |
|---------|------|----------|
| Integer overflow | CRITICAL | Phase 2 |
| PDA collisions | HIGH | Phase 2 |
| Account closing attacks | HIGH | Phase 2 |
| Rent exemption | MEDIUM | Phase 2 |
| Token-2022 extensions | MEDIUM | Phase 2 |
| Precision loss | CRITICAL | Phase 2 |
| Rounding attacks | HIGH | Phase 2 |
| Double-claim | CRITICAL | Phase 2 |
| Merkle proof CU cost | MEDIUM | Phase 2 |
| Clock manipulation | MEDIUM | Phase 2, 5 |
| Crank timing | LOW | Phase 5 |
| Transaction size limits | MEDIUM | Phase 3, 9 |
| Blockhash expiration | MEDIUM | Phase 3, 9 |
| Indexer gaps | HIGH | Phase 5 |
| Indexer reorgs | HIGH | Phase 5 |
| Inflation death spiral | CRITICAL | Phase 2, 10 |
| Whale manipulation | HIGH | Phase 2 |
| Early unstake gaming | MEDIUM | Phase 2 |
| Big Pay Day gaming | MEDIUM | Phase 2 |
| Compute budget limits | HIGH | Phase 2 |
| Account size limits | MEDIUM | Phase 2 |
| Bot sniping claims | HIGH | Phase 3 |

## AUDIT PREPARATION CHECKLIST

**Pre-Audit (Phase 10):**
- [ ] All checked math verified in unit tests
- [ ] PDA seeds documented and reviewed
- [ ] Account closing logic audited
- [ ] Financial math tested against reference implementation
- [ ] Merkle proof verification benchmarked
- [ ] Clock/time logic verified on devnet
- [ ] Indexer recovery tested with simulated outage
- [ ] Economic model validated by tokenomics expert
- [ ] Compute budget requirements documented
- [ ] Bot protection tested in adversarial environment

**Security Auditor Checklist:**
- [ ] Neodyme-style audit (common Solana pitfalls)
- [ ] Kudelski-style audit (comprehensive security review)
- [ ] Economic audit (tokenomics specialist)
- [ ] Formal verification (critical math functions)

---

## REFERENCES

### Documentation
- [Anchor Framework Basics](https://www.anchor-lang.com/docs/basics)
- [SPL Token-2022](https://www.solana-program.com/docs/token-2022)
- [Solana Compute Budget](https://www.solanakit.com/docs/getting-started/build-transaction#set-the-compute-limit-dynamically)
- [Neodyme: Common Pitfalls](https://blog.neodyme.io/posts/solana_common_pitfalls)

### Tools
- [Anchor Test Examples](https://github.com/solana-foundation/anchor/blob/master/tests)
- [Solana Kit (v2.x)](https://www.solanakit.com/)
- [QuickNode Transaction Optimization](https://www.quicknode.com/docs/solana/transactions)

### Economic Design
- [HEX Tokenomics](https://hex.com/) (original inspiration)
- [Marinade Finance](https://marinade.finance/) (liquid staking reference)
- [Solana Inflation Schedule](https://www.helius.dev/blog/solana-issuance-inflation-schedule)

---

**Document Version:** 1.0
**Last Updated:** 2026-02-07
**Next Review:** Before Phase 2 implementation
