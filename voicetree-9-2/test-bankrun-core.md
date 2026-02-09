---
color: yellow
agent_name: Aki
---

# Bankrun Core Tests

**Parent:** [[test-and-audit-infra.md]]

Foundational Solana program tests using solana-bankrun with Anchor framework integration. These tests validate the core staking lifecycle: protocol initialization, stake creation with T-share calculations, unstaking with penalty mechanics, reward claiming via lazy distribution, and permissionless crank-based inflation distribution.

## Key Test Files

### `tests/bankrun/utils.ts` -- Shared Test Utilities

Central utility module imported by all bankrun test suites. Provides:

- **PDA Seeds & Derivation:** `GLOBAL_STATE_SEED`, `MINT_AUTHORITY_SEED`, `MINT_SEED`, `STAKE_SEED` with corresponding `findGlobalStatePDA()`, `findMintAuthorityPDA()`, `findMintPDA()`, `findStakePDA()` functions.
- **Protocol Defaults:** `DEFAULT_ANNUAL_INFLATION_BP` (500 = 5%), `DEFAULT_MIN_STAKE_AMOUNT` (10M base units = 0.1 HELIX), `DEFAULT_STARTING_SHARE_RATE` (10,000), `DEFAULT_SLOTS_PER_DAY` (216,000).
- **`setupTest()`**: Bootstraps a Bankrun `ProgramTestContext` via `startAnchor()`, returning `BanksClient`, `payer`, and `Anchor Provider`.
- **`initializeProtocol()`**: Initializes `GlobalState` PDA, Token-2022 mint, and mint authority. Returns all PDAs for downstream use.
- **`advanceClock(days)`**: Manipulates Bankrun's `Clock` sysvar to simulate time passage. Converts days to slots via `DEFAULT_SLOTS_PER_DAY`.
- **`mintTokensToUser()`**: Calls `admin_mint` instruction to fund test wallets.
- **`getTokenBalance()`**: Parses Token-2022 account data at byte offset 64 to extract `u64` balance.

### `tests/bankrun/initialize.test.ts` -- Protocol Initialization (4 tests)

- Verifies `GlobalState` parameters (authority, mint, inflation rate, share_rate, counters all zero).
- Validates Token-2022 mint configuration (8 decimals, 0 initial supply, correct mint authority PDA).
- Rejects double initialization (protocol already initialized).
- Confirms Bankrun clock mocking works correctly (216K slots = 86,400 seconds).

### `tests/bankrun/createStake.test.ts` -- Stake Creation (6 tests)

- **Min duration T-shares:** Verifies `t_shares = amount * PRECISION / share_rate`.
- **LPB bonus at 3641 days:** Validates the Longer Pays Better 2x multiplier at the curve maximum.
- **BPB bonus for large amounts:** Tests the Bigger Pays Better bonus scaling.
- **Below minimum rejection:** Amounts below `DEFAULT_MIN_STAKE_AMOUNT` are rejected.
- **Invalid duration rejection:** Duration of 0 days and >5555 days both fail.
- **Sequential IDs:** Same user creating multiple stakes gets incrementing `stake_id` values.

### `tests/bankrun/unstake.test.ts` -- Unstaking & Penalties (9 tests)

Organized into Early / On-Time / Late / Edge Case groups:
- **Early unstake:** 50% minimum penalty floor, proportional penalty for partial completion.
- **Mint-based return:** Confirms tokens are minted (not transferred) back to user.
- **Grace period:** 14-day grace window after stake maturity with no penalty.
- **Late penalties:** Linear late penalty after grace period, reaching 100% at 365 days late.
- **Edge cases:** Double-unstake rejection, unauthorized user rejection, `GlobalState` counter updates (`total_staked`, `total_shares`), and `share_rate` redistribution of penalty amounts to remaining stakers.

### `tests/bankrun/claimRewards.test.ts` -- Reward Claiming (7 tests)

- Correct claim amount after crank distribution.
- Rejection when no rewards are available.
- `reward_debt` mechanism prevents double-claiming same distribution.
- Multi-day accumulation (multiple cranks before one claim).
- Proportional distribution: two stakers with 3:1 T-share ratio receive 3:1 rewards.
- Rejection on inactive (already unstaked) stake.
- `share_rate` increase after distribution makes future stakes more expensive per T-share.

### `tests/bankrun/crankDistribution.test.ts` -- Inflation Distribution (5 tests)

- `share_rate` increases correctly after 1-day crank.
- Same-day double distribution rejected.
- Multi-day gap handling: cranking after 3 missed days catches up correctly.
- Zero `total_shares` handling: crank is a no-op (no division-by-zero).
- Permissionless cranking: non-authority user can successfully crank.

## Test Patterns & Utilities

- **Vitest runner** (`describe`/`it`/`expect`) with `beforeAll` setup blocks.
- **Bankrun context isolation:** Each test file gets a fresh `ProgramTestContext` via `setupTest()`.
- **Clock manipulation:** `advanceClock()` enables deterministic time-dependent testing without waiting for real block production.
- **Token-2022 parsing:** Manual byte-level account data parsing at offset 64 (avoids SPL token library dependency for balance reads).
- **PDA-based account lookups:** All state assertions read directly from on-chain PDA accounts via `getAccount()` + `program.coder.accounts.decode()`.

## Notable Gotchas

- **Token-2022 vs SPL Token:** The program uses `TOKEN_2022_PROGRAM_ID`, not the legacy SPL Token program. Token account data layout differs slightly; balance is at offset 64.
- **Slots vs seconds:** Bankrun maps 1 slot = 0.4 seconds. `DEFAULT_SLOTS_PER_DAY` (216,000) = 86,400 seconds. All time-dependent tests operate in slots, not wall clock time.
- **Mint-not-transfer model:** Unstaking mints new tokens rather than transferring from a vault. Tests must check `mint.supply` changes, not balance transfers.
- **Share rate is cumulative:** After penalty redistribution or crank distribution, `share_rate` increases permanently, affecting all future T-share calculations.
- **Sequential stake IDs:** The `next_stake_id` counter on `GlobalState` is user-specific (tracked per-user in the stake PDA seed), so stake IDs are scoped to each user.
