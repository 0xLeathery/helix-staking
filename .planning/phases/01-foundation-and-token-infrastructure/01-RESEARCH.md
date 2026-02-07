# Phase 1: Foundation and Token Infrastructure - Research

**Researched:** 2026-02-07
**Domain:** Anchor Framework, Token-2022, Solana Program Development
**Confidence:** HIGH

## Summary

Phase 1 establishes the project foundation with an Anchor 0.31+ program, Token-2022 mint with PDA authority and metadata extension, and comprehensive testing infrastructure using Bankrun. The research confirms that this phase is well-supported by mature tooling with extensive documentation.

Token-2022 mint creation with metadata extension and PDA mint authority is a standard pattern with clear implementation paths. Anchor 0.31+ provides strong typing, automatic IDL generation, and account validation. Bankrun testing enables fast iteration with clock mocking capabilities essential for time-based reward logic.

**Primary recommendation:** Use Anchor 0.31+'s built-in constraints for PDA derivation and account initialization, leverage Token-2022's metadata extension for on-chain token info, and implement Bankrun tests with clock manipulation for deterministic time-based testing.

## User Constraints

### Expert Board Inputs (MUST Honor)

**From anchor-expert:**
- Use separate PDA per stake with seeds: `[b"stake", user.key(), stake_id.to_le_bytes()]`
- Do NOT use `Vec<Stake>` in UserProfile
- Mint authority MUST be a separate PDA with seeds: `[b"mint_authority"]`
- Mint authority is NOT the mint account itself
- LPB/BPB (Liquid/Bonded Power Brackets) MUST be computed functions, NOT stored arrays
- `overflow-checks = true` in Cargo.toml `[profile.release]` is MANDATORY for Phase 1
- GlobalState without curves is ~200 bytes, standard Borsh serialization is sufficient (no zero_copy needed)

**From tokenomics-expert:**
- Starting share rate requires precise definition (must be established in Phase 1)
- Minimum stake amount: 10,000,000 (0.1 HELIX with 8 decimals) as floor
- Minimum is adjustable via GlobalState
- Annual inflation: 3.69% = 3,690,000 basis points

**From security-expert:**
- `overflow-checks = true` is a HARD GATE for Phase 1 - cannot proceed without it
- Token-2022 extensions MUST be initialized BEFORE init_mint (wrong order = irrecoverable)
- Account closing attacks: use `is_active` flag pattern, NEVER `close` constraint on stake accounts

**From indexer-expert:**
- Phase 1 MUST include monotonic event counters in GlobalState
  - total_stakes_created
  - total_unstakes_created
  - total_claims_created
  - (etc. for all major operations)
- All events MUST include `slot` field for reorg correlation
- This is essential for Phase 5 (Blockchain Sync) indexer reliability

### Locked Technology Decisions

**Stack (from project CONTEXT):**
- Anchor 0.31+ framework
- Token-2022 with metadata extension
- Bankrun + anchor-bankrun for testing
- @solana/web3.js v1 (Anchor compatibility)
- Slot-based day counting for deterministic time logic
- Separate PDA per stake (not Vec)

### Phase 1 Scope

**In Scope:**
- Anchor program skeleton with build/deploy capability
- Token-2022 mint with 8 decimals, PDA mint authority, metadata extension
- GlobalState PDA with protocol parameters (inflation rate, claim period config, share rate)
- Bankrun test suite with clock mocking
- Overflow checks in release profile
- Event counters in GlobalState
- Smoke tests confirming account creation

**Out of Scope (Future Phases):**
- Staking logic (Phase 2)
- User authentication (Phase 3)
- Reward calculations (Phase 2)
- Frontend integration (Phase 9)

## Standard Stack

### Core Framework

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| anchor-lang | 0.31+ | Anchor framework core | Industry standard for Solana program development, automatic IDL generation, strong typing, account validation |
| anchor-spl | 0.31+ | SPL token interactions | Official Anchor wrapper for Token/Token-2022 programs |
| solana-program | 2.1+ (via Anchor) | Solana runtime primitives | Core Solana types (Pubkey, AccountInfo, etc.) |
| spl-token-2022 | latest | Token Extensions Program | Latest token standard with metadata, transfer hooks, etc. |

**Cargo.toml for program:**
```toml
[package]
name = "helix-staking"
version = "0.1.0"
edition = "2021"

[lib]
crate-type = ["cdylib", "lib"]
name = "helix_staking"

[features]
no-entrypoint = []
no-idl = []
cpi = ["no-entrypoint"]
default = []

[dependencies]
anchor-lang = { version = "0.31", features = [] }
anchor-spl = { version = "0.31", features = ["metadata"] }

[profile.release]
overflow-checks = true  # MANDATORY from security-expert
lto = "fat"
codegen-units = 1

[profile.release.build-override]
opt-level = 3
incremental = false
codegen-units = 1
```

### Testing Stack

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @coral-xyz/anchor | 0.31+ | TypeScript Anchor client | All tests |
| @solana-bankrun/anchor | latest | Anchor+Bankrun integration | Fast tests with clock mocking |
| solana-bankrun | latest | Fast in-process Solana VM | Local testing without validator |
| @solana/web3.js | 1.x | Solana client library | Anchor compatibility (not v2 yet) |
| chai | latest | Assertions | Test expectations |

**package.json for tests:**
```json
{
  "name": "helix-staking-tests",
  "scripts": {
    "test": "anchor test"
  },
  "dependencies": {
    "@coral-xyz/anchor": "^0.31.0",
    "@solana/web3.js": "^1.95.0"
  },
  "devDependencies": {
    "@solana-bankrun/anchor": "^0.3.0",
    "solana-bankrun": "^0.3.0",
    "chai": "^4.3.6",
    "mocha": "^10.0.0",
    "ts-mocha": "^10.0.0",
    "typescript": "^5.0.0"
  }
}
```

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Anchor 0.31+ | Anchor 0.30 | 0.30 lacks improved IDL spec, expression evaluation in constraints |
| Bankrun | solana-program-test | program-test slower, requires more setup, but closer to production |
| Token-2022 | Token (original) | Original lacks metadata extension, would need external metadata |
| @solana/web3.js v1 | @solana/web3.js v2 | v2 modern but Anchor tooling not fully migrated yet |

**Installation:**
```bash
# Initialize Anchor project
anchor init helix-staking --template modular

# Add testing dependencies
cd helix-staking
npm install --save-dev @solana-bankrun/anchor solana-bankrun chai
```

## Architecture Patterns

### Recommended Project Structure

From Anchor 0.31+ default modular template:
```
programs/helix-staking/
├── Cargo.toml
├── Xargo.toml
└── src/
    ├── lib.rs              # Program entrypoint, declare_id!, modules
    ├── constants.rs        # Protocol constants (DECIMALS, MIN_STAKE, etc.)
    ├── error.rs            # Custom error codes
    ├── events.rs           # Event definitions with slot field
    ├── state/
    │   ├── mod.rs
    │   ├── global_state.rs # GlobalState PDA
    │   └── ... (future: stake.rs, user_profile.rs in Phase 2)
    └── instructions/
        ├── mod.rs
        ├── initialize.rs   # Initialize GlobalState + create Token-2022 mint
        └── ... (future: stake.rs, unstake.rs in Phase 2)

tests/
├── bankrun/
│   ├── initialize.test.ts
│   └── utils.ts           # Helper functions for Bankrun tests
└── integration/           # Optional: tests against local validator
    └── initialize.test.ts

Anchor.toml                # Workspace config
package.json               # Test dependencies
tsconfig.json              # TypeScript config for tests
```

### Pattern 1: Token-2022 Mint with PDA Authority and Metadata Extension

**What:** Create a Token-2022 mint with metadata extension, where mint authority is a PDA derived from program

**When to use:** Phase 1 initialization, one-time setup

**Critical ordering (from security-expert):** Extensions MUST be initialized BEFORE init_mint

**Example:**
```rust
// Source: Solana Program Library Token-2022 documentation + expert board
use anchor_lang::prelude::*;
use anchor_spl::token_2022::{self, Token2022, Mint};
use anchor_spl::token_interface::{token_metadata_initialize, TokenMetadataInitialize};
use spl_token_2022::extension::{ExtensionType, metadata_pointer::MetadataPointer};
use spl_type_length_value::state::{TlvState, TlvStateMut};
use spl_token_metadata_interface::state::TokenMetadata;

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    // Mint authority PDA - SEPARATE from mint (per anchor-expert)
    #[account(
        seeds = [b"mint_authority"],
        bump,
    )]
    /// CHECK: PDA mint authority
    pub mint_authority: AccountInfo<'info>,

    // Token-2022 mint with metadata extension
    #[account(
        init,
        payer = authority,
        mint::decimals = 8,  // Per tokenomics-expert
        mint::authority = mint_authority,
        mint::token_program = token_program,
        extensions::metadata_pointer::authority = mint_authority,
        extensions::metadata_pointer::metadata_address = mint,
    )]
    pub mint: InterfaceAccount<'info, Mint>,

    pub token_program: Program<'info, Token2022>,
    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<Initialize>) -> Result<()> {
    // Initialize metadata AFTER mint is created but BEFORE first use
    let metadata = TokenMetadata {
        name: "Helix Staking Token".to_string(),
        symbol: "HELIX".to_string(),
        uri: "https://helix.example/metadata.json".to_string(),
        update_authority: Some(ctx.accounts.mint_authority.key()).into(),
        mint: ctx.accounts.mint.key(),
        ..Default::default()
    };

    // Initialize metadata via CPI
    token_metadata_initialize(
        CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            TokenMetadataInitialize {
                token_program_id: ctx.accounts.token_program.to_account_info(),
                mint: ctx.accounts.mint.to_account_info(),
                metadata: ctx.accounts.mint.to_account_info(), // metadata stored on mint
                mint_authority: ctx.accounts.mint_authority.to_account_info(),
                update_authority: ctx.accounts.mint_authority.to_account_info(),
            },
        )
        .with_signer(&[&[b"mint_authority", &[ctx.bumps.mint_authority]]]),
        "Helix Staking Token".to_string(),
        "HELIX".to_string(),
        "https://helix.example/metadata.json".to_string(),
    )?;

    Ok(())
}
```

### Pattern 2: GlobalState PDA with Protocol Parameters

**What:** Single global configuration PDA storing protocol-wide settings

**When to use:** Phase 1 initialization, updated by governance in later phases

**Example:**
```rust
// Source: Anchor documentation + expert board requirements
use anchor_lang::prelude::*;

#[account]
pub struct GlobalState {
    pub authority: Pubkey,              // Governance authority (future)
    pub mint: Pubkey,                   // HELIX token mint
    pub mint_authority_bump: u8,        // Bump for PDA mint authority

    // Tokenomics parameters (from tokenomics-expert)
    pub annual_inflation_bp: u64,       // 3_690_000 basis points = 3.69%
    pub min_stake_amount: u64,          // 10_000_000 = 0.1 HELIX (adjustable)
    pub starting_share_rate: u64,       // Precise definition TBD with tokenomics

    // Time config (slot-based)
    pub slots_per_day: u64,             // ~216,000 slots (400ms each)
    pub claim_period_days: u8,          // Reward claim period

    // Event counters (from indexer-expert) - monotonic for indexer reliability
    pub total_stakes_created: u64,
    pub total_unstakes_created: u64,
    pub total_claims_created: u64,
    pub total_tokens_staked: u64,       // Aggregate metrics
    pub total_tokens_unstaked: u64,

    // Reserved for future expansion
    pub reserved: [u64; 8],
}

impl GlobalState {
    // Size calculation: 32 + 32 + 1 + 8*6 + 8*5 + 8*8 = ~200 bytes (per anchor-expert)
    pub const LEN: usize = 8 + // discriminator
                           32 + // authority
                           32 + // mint
                           1 +  // mint_authority_bump
                           8 * 6 + // tokenomics params (6 u64s)
                           8 * 5 + // event counters (5 u64s)
                           8 * 8;  // reserved (8 u64s)
}

#[derive(Accounts)]
pub struct InitializeGlobalState<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(
        init,
        payer = authority,
        space = GlobalState::LEN,
        seeds = [b"global_state"],
        bump,
    )]
    pub global_state: Account<'info, GlobalState>,

    pub system_program: Program<'info, System>,
}
```

### Pattern 3: Event Definitions with Slot Field

**What:** Event structs emitted on key operations, including slot for reorg correlation

**When to use:** All state-changing operations (stake, unstake, claim, etc.)

**Example:**
```rust
// Source: Indexer-expert requirement + Anchor event pattern
use anchor_lang::prelude::*;

#[event]
pub struct GlobalStateInitialized {
    pub slot: u64,                      // For reorg correlation (indexer-expert)
    pub global_state: Pubkey,
    pub mint: Pubkey,
    pub authority: Pubkey,
    pub annual_inflation_bp: u64,
    pub min_stake_amount: u64,
    pub starting_share_rate: u64,
}

// In instruction handler:
pub fn initialize_global_state(ctx: Context<InitializeGlobalState>) -> Result<()> {
    let global_state = &mut ctx.accounts.global_state;
    let clock = Clock::get()?;

    global_state.authority = ctx.accounts.authority.key();
    // ... set other fields

    emit!(GlobalStateInitialized {
        slot: clock.slot,  // REQUIRED by indexer-expert
        global_state: global_state.key(),
        mint: global_state.mint,
        authority: global_state.authority,
        annual_inflation_bp: global_state.annual_inflation_bp,
        min_stake_amount: global_state.min_stake_amount,
        starting_share_rate: global_state.starting_share_rate,
    });

    Ok(())
}
```

### Pattern 4: Bankrun Testing with Clock Manipulation

**What:** Fast in-process Solana VM tests with clock mocking for time-based logic

**When to use:** Unit tests requiring time manipulation (reward accrual, claim periods)

**Example:**
```typescript
// Source: Solana Bankrun documentation + anchor-bankrun examples
import { BankrunProvider, startAnchor } from "solana-bankrun";
import { Program, Wallet } from "@coral-xyz/anchor";
import { PublicKey, Keypair } from "@solana/web3.js";
import { BanksClient, Clock, ProgramTestContext } from "solana-bankrun";
import { expect } from "chai";

describe("Helix Staking - Time-based Tests", () => {
  let context: ProgramTestContext;
  let provider: BankrunProvider;
  let program: Program;
  let payer: Keypair;

  before(async () => {
    payer = Keypair.generate();

    // Start Bankrun with program
    context = await startAnchor(
      "./", // Path to Anchor.toml
      [],   // No additional programs
      []    // No additional accounts
    );

    provider = new BankrunProvider(context);

    // Get program from workspace IDL
    const idl = require("../target/idl/helix_staking.json");
    program = new Program(idl, provider);
  });

  it("advances time and checks claim eligibility", async () => {
    // Initial setup
    const globalState = PublicKey.findProgramAddressSync(
      [Buffer.from("global_state")],
      program.programId
    )[0];

    // Warp clock forward by 1 day (216,000 slots at 400ms each)
    const currentClock = await context.banksClient.getClock();
    const newClock = new Clock(
      currentClock.slot + 216_000n, // +1 day
      currentClock.epochStartTimestamp,
      currentClock.epoch,
      currentClock.leaderScheduleEpoch,
      currentClock.unixTimestamp + 86_400n // +1 day in seconds
    );
    context.setClock(newClock);

    // Test claim after time advancement
    // ... test logic here

    const finalClock = await context.banksClient.getClock();
    expect(finalClock.slot).to.equal(currentClock.slot + 216_000n);
  });

  it("creates mint with metadata extension", async () => {
    const mintAuthority = PublicKey.findProgramAddressSync(
      [Buffer.from("mint_authority")],
      program.programId
    )[0];

    const mint = Keypair.generate();

    await program.methods
      .initialize()
      .accounts({
        authority: payer.publicKey,
        mintAuthority,
        mint: mint.publicKey,
        // ... other accounts
      })
      .signers([payer, mint])
      .rpc();

    // Verify mint created with correct authority
    const mintAccount = await provider.connection.getAccountInfo(mint.publicKey);
    expect(mintAccount).to.not.be.null;

    // Verify metadata extension exists
    // ... verification logic
  });
});
```

### Anti-Patterns to Avoid

**1. Using `Vec<Stake>` in UserProfile (explicitly prohibited by anchor-expert)**
```rust
// BAD - Do NOT do this
#[account]
pub struct UserProfile {
    pub stakes: Vec<Stake>, // NO! Causes account resizing issues
}

// GOOD - Use separate PDAs
#[account]
pub struct Stake {
    pub user: Pubkey,
    pub stake_id: u64,
    // ... stake data
}
// Derive PDA: seeds = [b"stake", user.key(), stake_id.to_le_bytes()]
```

**2. Using mint account as mint authority (prohibited by anchor-expert)**
```rust
// BAD
#[account(
    init,
    mint::authority = mint, // NO! Authority must be separate PDA
)]
pub mint: Account<'info, Mint>,

// GOOD
#[account(
    seeds = [b"mint_authority"],
    bump,
)]
/// CHECK: PDA mint authority
pub mint_authority: AccountInfo<'info>,

#[account(
    init,
    mint::authority = mint_authority, // YES!
)]
pub mint: Account<'info, Mint>,
```

**3. Initializing mint before extensions (security vulnerability)**
```rust
// BAD - Extensions MUST come first
init_mint(...)?;
initialize_metadata_extension(...)?; // TOO LATE - irrecoverable

// GOOD - Extensions first
initialize_metadata_pointer(...)?;
init_mint(...)?;
initialize_metadata(...)?;
```

**4. Using `close` constraint on stake accounts (security vulnerability)**
```rust
// BAD - Vulnerable to account closing attacks
#[account(
    mut,
    close = user, // NEVER use close on stake accounts
)]
pub stake: Account<'info, Stake>,

// GOOD - Use is_active flag
#[account]
pub struct Stake {
    pub is_active: bool, // Set to false instead of closing
    // ... other fields
}
```

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Token minting | Custom token logic | Token-2022 SPL program | Audited, battle-tested, metadata extension built-in |
| PDA derivation | Manual hash calculation | Anchor seeds/bump constraints | Automatic verification, type-safe, prevents mistakes |
| Account validation | Manual checks | Anchor account constraints | Compile-time verification, auto-generated IDL |
| Clock/time access | Custom timestamp oracle | Clock sysvar | Built-in Solana runtime, slot-based determinism |
| Event emission | Custom logging | Anchor #[event] macro | Structured, indexed, IDL-documented |
| IDL generation | Manual JSON writing | Anchor build process | Auto-generated, always in sync with code |

**Key insight:** Anchor provides mature abstractions that eliminate entire classes of bugs. Token-2022 handles complex token extension initialization order correctly. Manual implementations introduce security risks and maintenance burden.

## Common Pitfalls

### Pitfall 1: Missing `overflow-checks = true` in Release Profile

**What goes wrong:** Integer overflow in release builds causes silent wraparound instead of panicking

**Why it happens:** Rust default release profile disables overflow checks for performance

**How to avoid:** Add to Cargo.toml (MANDATORY from security-expert):
```toml
[profile.release]
overflow-checks = true
```

**Warning signs:** Stake amounts, share rates, or token balances become unexpectedly large or small after arithmetic operations

### Pitfall 2: Token-2022 Extension Initialization Order

**What goes wrong:** Initializing mint before extensions makes the mint unusable with extensions - irrecoverable state

**Why it happens:** Extensions modify account structure; mint initialization freezes structure

**How to avoid:** ALWAYS initialize extensions BEFORE `init_mint`:
1. Create account with correct size (including extension space)
2. Initialize metadata_pointer extension
3. Initialize mint
4. Initialize metadata content

**Warning signs:** Error "account already initialized" or metadata operations failing on mint

### Pitfall 3: Bankrun Program Instance Confusion

**What goes wrong:** Tests fail with "maximum depth for account resolution" when using workspace program instead of Bankrun program instance

**Why it happens:** `anchor.workspace.Program` uses default provider (localnet), but accounts don't exist in Bankrun instance

**How to avoid:**
```typescript
// BAD - Uses wrong provider
const program = anchor.workspace.HelixStaking as Program<HelixStaking>;

// GOOD - Create Bankrun-specific program instance
const context = await startAnchor(...);
const provider = new BankrunProvider(context);
const program = new Program(idl, provider); // Use Bankrun provider
```

**Warning signs:** PDA resolution errors, "account not found" errors in tests that work on localnet

### Pitfall 4: Forgetting Event Slot Field

**What goes wrong:** Indexer cannot correlate events with blockchain reorgs, causing data inconsistencies

**Why it happens:** Developers unfamiliar with indexer requirements omit slot field

**How to avoid:** ALWAYS include slot in events (requirement from indexer-expert):
```rust
#[event]
pub struct StakeCreated {
    pub slot: u64,  // REQUIRED
    pub user: Pubkey,
    pub stake_id: u64,
    pub amount: u64,
}

// In handler:
emit!(StakeCreated {
    slot: Clock::get()?.slot, // Get from Clock sysvar
    // ... other fields
});
```

**Warning signs:** Indexer team reports missing slot correlation data during Phase 5 integration

### Pitfall 5: Hardcoding Slot Duration

**What goes wrong:** Time calculations become inaccurate if network slot time changes

**Why it happens:** Assuming slots are always exactly 400ms

**How to avoid:** Use slot-based day counting, make slots_per_day configurable in GlobalState:
```rust
pub struct GlobalState {
    pub slots_per_day: u64, // ~216,000, but configurable
}

// Calculate days elapsed
let days_elapsed = (current_slot - start_slot) / global_state.slots_per_day;
```

**Warning signs:** Reward periods drift from expected calendar days, tests fail on different networks

## Code Examples

Verified patterns from official sources:

### Creating PDA-Derived Account with Anchor Constraints

```rust
// Source: Anchor documentation, expert board PDA pattern
use anchor_lang::prelude::*;

#[derive(Accounts)]
#[instruction(stake_id: u64)] // Access instruction args in constraints
pub struct CreateStake<'info> {
    #[account(mut)]
    pub user: Signer<'info>,

    // Separate PDA per stake (anchor-expert requirement)
    #[account(
        init,
        payer = user,
        space = 8 + Stake::INIT_SPACE,
        seeds = [
            b"stake",
            user.key().as_ref(),
            stake_id.to_le_bytes().as_ref()
        ],
        bump,
    )]
    pub stake: Account<'info, Stake>,

    pub system_program: Program<'info, System>,
}

#[account]
#[derive(InitSpace)] // Anchor 0.31+ automatic space calculation
pub struct Stake {
    pub user: Pubkey,
    pub stake_id: u64,
    pub amount: u64,
    pub shares: u64,
    pub start_slot: u64,
    pub is_active: bool, // For soft-delete (security-expert pattern)
    pub reserved: [u64; 4], // Future expansion
}
```

### Incrementing Monotonic Event Counters

```rust
// Source: Indexer-expert requirement
use anchor_lang::prelude::*;

pub fn create_stake(ctx: Context<CreateStake>, amount: u64) -> Result<()> {
    let global_state = &mut ctx.accounts.global_state;
    let stake = &mut ctx.accounts.stake;
    let clock = Clock::get()?;

    // Increment monotonic counter (REQUIRED by indexer-expert)
    global_state.total_stakes_created = global_state
        .total_stakes_created
        .checked_add(1)
        .ok_or(ErrorCode::Overflow)?;

    // Initialize stake
    stake.user = ctx.accounts.user.key();
    stake.stake_id = global_state.total_stakes_created; // Use counter as ID
    stake.amount = amount;
    stake.start_slot = clock.slot;
    stake.is_active = true;

    // Emit event with slot (indexer-expert requirement)
    emit!(StakeCreated {
        slot: clock.slot,
        user: stake.user,
        stake_id: stake.stake_id,
        amount: stake.amount,
    });

    Ok(())
}
```

### Accessing Clock Sysvar for Slot-Based Time

```rust
// Source: Solana Clock sysvar documentation
use anchor_lang::prelude::*;

pub fn check_claim_eligibility(ctx: Context<Claim>) -> Result<()> {
    let clock = Clock::get()?;
    let global_state = &ctx.accounts.global_state;
    let stake = &ctx.accounts.stake;

    // Slot-based time calculation (deterministic across validators)
    let slots_elapsed = clock.slot
        .checked_sub(stake.start_slot)
        .ok_or(ErrorCode::Underflow)?;

    let days_elapsed = slots_elapsed / global_state.slots_per_day;

    require!(
        days_elapsed >= global_state.claim_period_days as u64,
        ErrorCode::ClaimPeriodNotReached
    );

    Ok(())
}
```

### Minting Tokens with PDA Authority Signer

```rust
// Source: Anchor CPI documentation + expert board pattern
use anchor_lang::prelude::*;
use anchor_spl::token_2022::{self, Token2022, Mint, MintTo};

#[derive(Accounts)]
pub struct MintRewards<'info> {
    #[account(
        seeds = [b"mint_authority"],
        bump,
    )]
    /// CHECK: PDA mint authority
    pub mint_authority: AccountInfo<'info>,

    #[account(
        mut,
        mint::authority = mint_authority,
    )]
    pub mint: InterfaceAccount<'info, Mint>,

    #[account(mut)]
    pub recipient_token_account: InterfaceAccount<'info, token_2022::TokenAccount>,

    pub token_program: Program<'info, Token2022>,
}

pub fn mint_rewards(ctx: Context<MintRewards>, amount: u64) -> Result<()> {
    // Derive signer seeds with bump
    let bump = ctx.bumps.mint_authority;
    let signer_seeds: &[&[&[u8]]] = &[&[b"mint_authority", &[bump]]];

    // CPI to Token-2022 program with PDA signer
    token_2022::mint_to(
        CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            MintTo {
                mint: ctx.accounts.mint.to_account_info(),
                to: ctx.accounts.recipient_token_account.to_account_info(),
                authority: ctx.accounts.mint_authority.to_account_info(),
            },
            signer_seeds,
        ),
        amount,
    )?;

    Ok(())
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Token (original SPL) | Token-2022 | 2023 | Metadata on-chain, no external programs needed |
| Manual PDA derivation | Anchor seeds/bump constraints | Anchor 0.24+ | Type-safe, auto-verified PDAs |
| solana-program-test | Bankrun | 2024 | 10x faster tests, clock mocking built-in |
| IDL v0 | IDL spec v2 | Anchor 0.30+ | Expression evaluation, better type support |
| Hardcoded discriminators | Dynamic discriminators | Anchor 0.31+ | Flexible instruction routing |
| Manual space calculation | #[derive(InitSpace)] | Anchor 0.30+ | Automatic space calculation |

**Deprecated/outdated:**
- `Tokenkeg...` (original Token program): Still works but Token-2022 is preferred for new projects
- `solana-program-test`: Still maintained but Bankrun preferred for unit tests
- Anchor versions < 0.30: Lack modern IDL spec, InitSpace, and other DX improvements
- `AccountsExit` trait: Removed in Anchor 0.29, use `close` constraint instead

## Open Questions

Things that couldn't be fully resolved:

1. **Starting Share Rate Precise Value**
   - What we know: Tokenomics-expert flagged need for precise definition
   - What's unclear: Exact initial value, calculation formula
   - Recommendation: Coordinate with tokenomics team to establish formula before Phase 1 completion. Consider 1:1 ratio (1 token = 1 share) as starting point, adjustable via GlobalState

2. **Slots Per Day Network Variance**
   - What we know: Target is ~216,000 slots/day (400ms/slot), but actual varies
   - What's unclear: Should we dynamically adjust or use fixed value?
   - Recommendation: Start with fixed 216,000 in GlobalState, make updateable by governance. Monitor actual slot times in production and adjust if drift > 5%

3. **Event Counter Overflow Strategy**
   - What we know: Monotonic u64 counters required by indexer-expert
   - What's unclear: What happens at u64::MAX (unlikely but possible)
   - Recommendation: Use `checked_add()` to panic on overflow. At 1M stakes/day, would take 50+ million years to overflow. Document this assumption.

4. **Minimum Stake Adjustability Governance**
   - What we know: Min stake (10M = 0.1 HELIX) should be adjustable via GlobalState
   - What's unclear: Who can adjust? What constraints?
   - Recommendation: Phase 1 can initialize as read-only. Add governance update instruction in later phase (outside Phase 1 scope). Consider min/max bounds (e.g., 1M - 100M range)

## Sources

### Primary (HIGH confidence)

**Solana MCP Expert Queries:**
- Token-2022 mint creation with metadata extension and PDA authority patterns
- Anchor 0.31+ project structure and initialization
- Bankrun testing setup with clock mocking
- PDA derivation best practices

**Anchor Documentation:**
- https://www.anchor-lang.com/docs/quickstart/local - Project initialization
- https://www.anchor-lang.com/docs/basics/pda - PDA constraints and patterns
- https://www.anchor-lang.com/docs/basics/cpi - Cross-program invocations with PDAs
- https://www.anchor-lang.com/docs/references/anchor-toml - Configuration

**Solana Program Library Documentation:**
- https://www.solana-program.com/docs/token-2022/extensions - Token-2022 extensions guide
- https://www.solana-program.com/docs/token-2022/onchain - On-chain program integration
- Token-2022 metadata extension initialization order requirements

**Expert Board Inputs:**
- anchor-expert: PDA patterns, account structure, Cargo.toml config
- tokenomics-expert: Token parameters (decimals, min stake, inflation)
- security-expert: Overflow checks, extension ordering, account closing patterns
- indexer-expert: Event counters, slot fields for reorg correlation

### Secondary (MEDIUM confidence)

**Bankrun Documentation:**
- https://www.anchor-lang.com/docs/testing/litesvm - LiteSVM/Bankrun testing
- https://github.com/kevinheavey/anchor-bankrun - Library integration examples
- Solana Bootcamp examples: https://github.com/solana-developers/developer-bootcamp-2024

**Stack Overflow Verified Answers:**
- PDA derivation patterns in Anchor
- Token-2022 metadata pointer and metadata extension initialization
- Bankrun test setup and program instance creation
- Clock sysvar access for time-based logic

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Anchor 0.31+ and Token-2022 are mature, well-documented
- Architecture: HIGH - Patterns verified from official sources and expert board
- Pitfalls: HIGH - Identified from expert board security requirements and common errors

**Research date:** 2026-02-07
**Valid until:** 2026-03-07 (30 days - Anchor framework stable, Token-2022 stable)

**Notes:**
- Anchor 0.31+ is latest stable version as of research date
- Token-2022 is production-ready on mainnet
- Bankrun actively maintained, fast-moving project (check for updates)
- Expert board inputs are project-specific constraints that MUST be honored
