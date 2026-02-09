---
color: yellow
agent_name: Aki
---

# Bankrun Phase 3 Tests

**Parent:** [[test-and-audit-infra.md]]

Phase 3 test suite validates the free claim system, Big Pay Day (BPD) distribution, vesting mechanics, and account migration. These tests extend the core bankrun infrastructure with Merkle tree proofs, Ed25519 signature verification, and multi-phase BPD lifecycle testing.

## Key Test Files

### `tests/bankrun/phase3/utils.ts` -- Extended Test Utilities

Builds on top of `tests/bankrun/utils.ts` with claim-specific infrastructure:

- **Merkle Tree:** `buildMerkleTree()` using keccak256 hashing with sorted leaves for deterministic ordering. `getMerkleProof()` extracts inclusion proofs. `ClaimEntry` interface: `{ pubkey, amount }`.
- **Ed25519 Signatures:** `buildClaimMessage("HELIX:claim:{pubkey}:{amount}")`, `signClaimMessage()` using Ed25519, `createEd25519Instruction()` manually constructs the Ed25519 program instruction with 112-byte signature data layout.
- **PDA Derivation:** `findClaimConfigPDA()` and `findClaimStatusPDA()` with `MERKLE_ROOT_PREFIX_LEN=8` (first 8 bytes of merkle root used in PDA seed).
- **Vesting Math:** `calculateVestedAmount()` implements linear vesting formula, `calculateSpeedBonus()` with `HELIX_PER_SOL=10000` and decimal precision adjustment.
- **Constants:** `VESTING_DAYS=30`, `IMMEDIATE_RELEASE_BPS=1000` (10%), `CLAIM_PERIOD_DAYS=180`, `SPEED_BONUS_WEEK1_BPS=2000` (+20%), `SPEED_BONUS_WEEK2_4_BPS=1000` (+10%), `MIN_SOL_BALANCE=100M` lamports (0.1 SOL).

### `tests/bankrun/phase3/initializeClaim.test.ts` -- Claim Period Setup (5 tests)

- Valid merkle root initialization by authority.
- Non-authority user rejection.
- Double initialization rejection (claim config PDA already exists).
- Correct `end_slot` calculation: `current_slot + (CLAIM_PERIOD_DAYS * slots_per_day)`.
- Event data verification by reading persisted state fields.

### `tests/bankrun/phase3/freeClaim.test.ts` -- Free Claim Mechanics (11 tests)

- **Valid claim flow:** Merkle proof + Ed25519 signature verification, tokens minted to claimant.
- **Speed bonus tiers:** +20% in week 1, +10% in weeks 2-4, 0% after day 28.
- **Vesting split:** 10% immediate release, 90% vested over 30 days. Tests verify exact amounts.
- **Rejection cases:** Invalid merkle proof, missing Ed25519 instruction, wrong signer key, double claim (ClaimStatus PDA already exists), claim after period ends, claim before period starts.
- **SOL balance gate:** Snapshot balance below `MIN_SOL_BALANCE` (0.1 SOL) rejected.
- **Boundary tests:** Exact day 7 (last day of week 1 bonus) and day 28 (last day of weeks 2-4 bonus) boundary verification.

### `tests/bankrun/phase3/triggerBpd.test.ts` -- Big Pay Day Distribution (13 tests)

Tests the two-phase BPD architecture: `finalize_bpd_calculation` -> `seal_bpd_finalize` -> `trigger_big_pay_day`.

- **Unclaimed distribution:** Remaining tokens (total_claimable - total_claimed) distributed to eligible stakers.
- **Permissionless triggering:** Any user can call trigger after finalization is sealed.
- **T-share-days weighting:** Two stakers with different durations receive BPD proportional to `t_shares * days_staked`.
- **Eligibility filtering:** Only stakes active during the claim period qualify. Stakes created after the period ends are excluded.
- **Attack prevention:** Last-minute staking (stake created just before claim period ends) gets minimal share-days, preventing gaming.
- **Guard rails:** Rejection before period ends, rejection when finalize not complete, double trigger rejection, no eligible stakers handling (`NoEligibleStakers` error).
- **Cross-period safety:** `bpd_claim_period_id` prevents duplicate BPD across different claim periods.
- **Batch processing:** Within-batch duplicate stake prevention, cross-batch rate fairness (3 stakes split across 2 finalize batches, verified equal rate applied).
- **Double finalize rejection:** Cannot re-finalize already-finalized stakes.

### `tests/bankrun/phase3/withdrawVested.test.ts` -- Vesting Withdrawals (7 tests)

- Immediate 10% already withdrawn at claim time; `NoVestedTokens` error on day 0.
- Partial mid-period withdrawal (e.g., day 15 of 30 releases ~50% of vested portion).
- Full amount withdrawal after 30 days (entire 90% vested portion released).
- Cumulative `withdrawn_amount` tracking across multiple withdrawals.
- Double-withdrawal prevention (no tokens to withdraw after full withdrawal).
- Linear vesting correctness verification with exact BN arithmetic.
- Rejection when no prior claim exists (ClaimStatus account missing).

### `tests/bankrun/phase3/migration.test.ts` -- Account Migration (7 tests)

Tests backward compatibility when stake accounts grow from 92 bytes (v1) to 112 bytes (v2 with BPD fields):

- Old stakes (92 bytes) continue working with `claim_rewards` instruction.
- Migrated stake gets `bpd_bonus_pending = 0` (clean initialization).
- New stakes (112 bytes) have BPD fields from creation.
- Migration preserves all existing data fields.
- User pays rent difference for the additional 20 bytes.
- `claim_rewards` includes `bpd_bonus_pending` amount after BPD trigger.
- `claim_rewards` clears `bpd_bonus_pending` to zero after payout.
- Ineligible stake (created outside claim period) returns zero BPD bonus.

## Test Patterns & Utilities

- **Merkle tree construction:** keccak256 with sorted leaf pairs for deterministic tree structure. Proofs are arrays of 32-byte hashes.
- **Ed25519 instruction building:** Manual construction of the Ed25519 program instruction data (2-byte count header, 48-byte offset structure, 64-byte signature, 32-byte pubkey, variable message). This mirrors the on-chain Ed25519 precompile validation.
- **Two-phase BPD helper functions:** `finalizeBpd(stakeAccounts)` processes a batch, `sealBpdFinalize()` locks the calculation, `triggerBigPayDay(stakeAccounts)` distributes. Tests exercise multiple batches by calling finalize with different stake subsets.
- **BN arithmetic throughout:** All token amounts, T-shares, and vesting calculations use `bn.js` to match on-chain u64/u128 precision.
- **Clock advancement for vesting:** Tests advance the Bankrun clock to specific days within the 30-day vesting window to verify partial release amounts.

## Notable Gotchas

- **Ed25519 instruction must be in same transaction:** The on-chain program verifies the Ed25519 signature instruction exists in the transaction's instruction sysvar. It must be the instruction immediately preceding the free_claim instruction.
- **Merkle root prefix length:** Only the first 8 bytes of the merkle root are used in the ClaimStatus PDA seed (`MERKLE_ROOT_PREFIX_LEN=8`). This is a deliberate space optimization but means different merkle roots sharing the same 8-byte prefix would collide.
- **BPD two-phase is security-critical:** The split between finalize (accumulate share-days) and seal (calculate rate) prevents early batches from draining the pool. Rate calculation must happen only after ALL eligible stakes are counted.
- **Batch size limit:** `MAX_STAKES_PER_FINALIZE = 20` per transaction due to Solana compute budget constraints. Large protocols need multiple finalize transactions.
- **Snapshot slot consistency:** `bpd_snapshot_slot` is captured on the first finalize batch and reused for all subsequent batches, preventing time-of-check-time-of-use manipulation.
- **Migration rent difference:** When migrating a 92-byte stake to 112 bytes, the calling user (not necessarily the stake owner) pays the additional rent. Tests verify this cost transfer.
