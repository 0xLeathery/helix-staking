# Phase 25: Crank Boost Monitoring - Research

**Researched:** 2026-03-04
**Domain:** Node.js crank service extension — scheduled boost-check job, on-chain BoostRecord enumeration, `update_boost_status` instruction dispatch
**Confidence:** HIGH

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| BOOST-08 | Crank checks all boosted stakers every 6 hours and revokes if balance dropped below snapshot | `update_boost_status` instruction already exists on-chain and is permissionless; crank adds a 6-hour cron job that (1) fetches all BoostRecord PDAs via `getProgramAccounts` discriminator filter, (2) for each linked+active+non-revoked boost, builds and sends an `update_boost_status` transaction; existing `withRpcFallback` + `pRetry` wrappers cover retry/failover |
</phase_requirements>

---

## Summary

Phase 25 extends the existing `services/crank/` Node.js service to add a second scheduled job that runs every 6 hours. The on-chain side is already complete: `update_boost_status` is a permissionless instruction (Phase 24) that reads the stake owner's current seed ATA balance and permanently sets `boost_revoked = true` on the StakeAccount if the balance dropped below the snapshotted threshold. The crank's only job is to enumerate all active boosted stakes and call this instruction for each one.

The core technical challenge is enumeration. The crank needs to find every `BoostRecord` PDA on-chain. Anchor's `program.account.boostRecord.all()` method uses `getProgramAccounts` with the 8-byte discriminator filter under the hood — this is the established pattern and the simplest approach. Each BoostRecord contains a `boosted_stake_id` field; when it is not `u64::MAX`, the BoostRecord is linked to an active stake. For each linked BoostRecord, the crank fetches the corresponding StakeAccount to check if it is still active and not already revoked. If so, it builds and sends an `update_boost_status` transaction.

The phase produces one new file (`services/crank/src/boostCheck.ts`) and modifications to `index.ts` to schedule the new job. No new dependencies are needed; everything required is already in the crank's `package.json`. The integration test uses the real Anchor program via LiteSVM (the established pattern) and validates that a user who sold their seed tokens has `boost_revoked = true` on their StakeAccount after `executeBoostCheck` runs.

**Primary recommendation:** Implement `executeBoostCheck` in a new `boostCheck.ts` file mirroring the structure of `crank.ts`. Schedule it with `node-cron` at `'0 0,6,12,18 * * *'` (UTC midnight, 6 AM, noon, 6 PM). Wrap each `update_boost_status` call individually in a try/catch so one failed transaction does not abort the entire sweep.

---

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `node-cron` | `^4.2.1` (already installed) | Schedule 6-hour cron job | Already used for `crank_distribution` scheduling |
| `@coral-xyz/anchor` | `^0.30.1` (already installed) | `program.account.boostRecord.all()`, instruction builder | Already the project's Anchor client |
| `@solana/web3.js` | `^1.95.0` (already installed) | `PublicKey`, `Transaction`, `ComputeBudgetProgram` | Already used throughout crank |
| `p-retry` | `^6.2.1` (already installed) | Per-transaction retry on RPC errors | Already used in `withRpcFallback` |
| `pino` | `^9.6.0` (already installed) | Structured logging | Already the project logger |
| `zod` | `^3.24.1` (already installed) | Environment variable validation | Already used in `env.ts` |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `@solana/spl-token` | (via `@coral-xyz/anchor` transitive) | `getAssociatedTokenAddressSync` for seed ATA derivation | Used to compute the seed ATA address to pass to `update_boost_status` |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| `program.account.boostRecord.all()` (Anchor) | Raw `connection.getProgramAccounts()` with manual discriminator filter | Anchor's `.all()` is simpler — handles discriminator filter and deserialization automatically. Use `.all()`. |
| Individual per-transaction retries | Batch all transactions in one loop with no retry | Individual retries prevent one RPC blip from aborting the whole sweep. The existing `p-retry` pattern is the right model. |
| Separate RPC Program instances per transaction | Reuse a single Program for the entire sweep | Single Program reuse is correct — connection is already established. Create fresh blockhash per transaction, not per sweep. |

**Installation:** No new dependencies. All required packages are already in `services/crank/package.json`.

---

## Architecture Patterns

### Recommended File Structure

New file to create:
```
services/crank/src/
└── boostCheck.ts     # executeBoostCheck() function — mirrors crank.ts structure
```

Modified files:
```
services/crank/src/
└── index.ts          # Add 6-hour cron schedule, call executeBoostCheck
```

### Pattern 1: Enumerate All BoostRecords with Anchor `.all()`

**What:** Fetch every on-chain `BoostRecord` account using Anchor's typed account fetcher. Anchor applies the 8-byte discriminator filter automatically.

**When to use:** At the start of every `executeBoostCheck()` sweep.

```typescript
// Source: Anchor docs + existing program.account.globalState.fetch() pattern in crank.ts
const boostRecords = await (program.account as any).boostRecord.all();
// boostRecords: Array<{ publicKey: PublicKey, account: { user: PublicKey, slot: BN, bump: number, boostedStakeId: BN } }>

// Filter to only linked records (boosted_stake_id != u64::MAX)
const U64_MAX = BigInt('18446744073709551615');
const linked = boostRecords.filter(
  (r: any) => BigInt(r.account.boostedStakeId.toString()) !== U64_MAX,
);
```

**Confidence:** HIGH — Anchor's `.all()` method is the standard pattern for fetching all accounts of a given type. The existing `crank.ts` already uses `(program.account as any).globalState.fetch(...)` confirming this pattern works in the project.

### Pattern 2: Fetch StakeAccount and Check Active + Not Revoked

**What:** For each linked BoostRecord, derive the StakeAccount PDA and fetch it. Skip if already revoked or inactive (unstaked).

**When to use:** After filtering linked BoostRecords, before calling `update_boost_status`.

```typescript
// Source: existing crank.ts PDA derivation pattern
import { PublicKey } from '@solana/web3.js';
import BN from 'bn.js';

const STAKE_SEED = Buffer.from('stake');

function findStakePDA(programId: PublicKey, user: PublicKey, stakeId: BN): PublicKey {
  const idBuffer = Buffer.alloc(8);
  stakeId.toArrayLike(Buffer, 'le', 8).copy(idBuffer);
  const [pda] = PublicKey.findProgramAddressSync(
    [STAKE_SEED, user.toBuffer(), idBuffer],
    programId,
  );
  return pda;
}

// In sweep loop:
const stakeId = record.account.boostedStakeId; // BN
const stakeOwner = record.account.user;         // PublicKey
const stakePDA = findStakePDA(program.programId, stakeOwner, stakeId);

let stakeAccount: any;
try {
  stakeAccount = await (program.account as any).stakeAccount.fetch(stakePDA);
} catch {
  // StakeAccount doesn't exist (shouldn't happen but guard anyway)
  continue;
}

// Skip if already revoked or unstaked (inactive)
if (stakeAccount.boostRevoked || !stakeAccount.isActive) {
  continue;
}
```

### Pattern 3: Call `update_boost_status` Per Stake

**What:** Build and send the `update_boost_status` transaction for one stake at a time. Wrap in try/catch so a single failure does not abort the sweep.

**When to use:** For each active, non-revoked boosted stake.

```typescript
// Source: mirrors executeCrank() in crank.ts — ComputeBudget + fresh blockhash + sendRawTransaction
import { ComputeBudgetProgram, Transaction, PublicKey } from '@solana/web3.js';
import { getAssociatedTokenAddressSync, TOKEN_2022_PROGRAM_ID } from '@solana/spl-token';

const ASSOCIATED_TOKEN_PROGRAM_ID = new PublicKey('ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJe1bsU');

// Derive the seed ATA for the stake owner
const seedMint = globalState.getSeedMint(); // Extract from reserved slots
const seedAta = getAssociatedTokenAddressSync(
  seedMint,
  stakeOwner,
  false,
  TOKEN_2022_PROGRAM_ID,
);

const ix = await (program.methods as any)
  .updateBoostStatus()
  .accounts({
    payer: crankerKeypair.publicKey,
    globalState: globalStatePDA,
    stakeAccount: stakePDA,
    stakeOwner: stakeOwner,
    seedTokenAccount: seedAta,
    seedMint: seedMint,
    seedTokenProgram: TOKEN_2022_PROGRAM_ID,
    associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
    systemProgram: SystemProgram.programId,
  })
  .instruction();

const tx = new Transaction()
  .add(ComputeBudgetProgram.setComputeUnitLimit({ units: 50_000 }))
  .add(ComputeBudgetProgram.setComputeUnitPrice({ microLamports: 5_000 }))
  .add(ix);

const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
tx.recentBlockhash = blockhash;
tx.feePayer = crankerKeypair.publicKey;
tx.sign(crankerKeypair);

const sig = await connection.sendRawTransaction(tx.serialize());
await connection.confirmTransaction({ signature: sig, blockhash, lastValidBlockHeight }, 'confirmed');
```

**CRITICAL:** The seed ATA may not exist if the user never held any seed tokens in that ATA (edge case: boost was registered but ATA was closed). Guard this with a try/catch on the transaction send — Anchor will return an `InvalidSeedTokenAccount` error which should be logged and skipped, not retried.

### Pattern 4: `executeBoostCheck` Full Structure

**What:** Top-level function mirroring `executeCrank`. Idempotent: calling it multiple times in the same 6-hour window is safe (the on-chain instruction is a no-op for already-revoked or non-boosted stakes).

```typescript
// Source: mirrors executeCrank() structure in crank.ts

export type BoostCheckResult = {
  checked: number;       // Total BoostRecords examined
  revoked: number;       // Transactions that resulted in a revocation
  skipped: number;       // Already revoked / inactive / boost disabled
  failed: number;        // RPC/transaction errors (logged individually)
};

export async function executeBoostCheck(
  program: Program,
  crankerKeypair: Keypair,
): Promise<BoostCheckResult> {
  const connection = program.provider.connection;

  const [globalStatePDA] = PublicKey.findProgramAddressSync(
    [Buffer.from('global_state')],
    program.programId,
  );

  // Read global state — need seed_mint and boost_enabled from reserved slots
  const globalState = await (program.account as any).globalState.fetch(globalStatePDA);

  // Check boost_enabled (reserved[7] != 0)
  const boostEnabled = globalState.reserved[7].toNumber() !== 0;
  if (!boostEnabled) {
    logger.info('Boost system disabled — skipping boost check sweep');
    return { checked: 0, revoked: 0, skipped: 0, failed: 0 };
  }

  // Fetch all BoostRecord PDAs
  const allBoostRecords = await (program.account as any).boostRecord.all();
  // ... filter, fetch StakeAccounts, send update_boost_status transactions
}
```

### Pattern 5: 6-Hour Cron Schedule in `index.ts`

**What:** Add a second cron schedule alongside the existing daily crank. Use `noOverlap: true` to prevent concurrent sweeps.

**When to use:** At startup, after `setupProgram()`.

```typescript
// Source: mirrors existing CRANK_TIMES pattern in index.ts
// node-cron format: minute hour day-of-month month day-of-week
// '0 0,6,12,18 * * *' = UTC 00:00, 06:00, 12:00, 18:00 every day
const BOOST_CHECK_TIMES = ['0 0,6,12,18 * * *'];

// In startup IIFE:
for (const expr of BOOST_CHECK_TIMES) {
  cron.schedule(expr, () => void boostCheckTick(), { timezone: 'UTC', noOverlap: true });
}
```

**Verify node-cron syntax:** The existing code uses `'5 0 * * *'` (minute=5, hour=0) successfully. The format for 4 times per day using a comma-separated hour list: `'0 0,6,12,18 * * *'` is valid node-cron v4 syntax. Confirmed by node-cron README which states: "Multiple values: comma-separated (e.g. `1,2,3`)".

### Pattern 6: Reading `seed_mint` from GlobalState Reserved Slots (TypeScript)

**What:** The seed mint is packed as 4 LE u64 values in `reserved[2..5]`. The same reconstruction logic exists in `boost.test.ts`.

**When to use:** Inside `executeBoostCheck` to know which mint address to use for ATA derivation.

```typescript
// Source: boost.test.ts lines 53-60 — same reconstruction logic
function getSeedMintFromGlobalState(globalState: any): PublicKey {
  const reserved = globalState.reserved; // Array of 10 BN values
  const mintBytes = new Uint8Array(32);
  for (let i = 0; i < 4; i++) {
    const le = reserved[2 + i].toArrayLike(Buffer, 'le', 8);
    mintBytes.set(le, i * 8);
  }
  return new PublicKey(mintBytes);
}
```

### Anti-Patterns to Avoid

- **Batching all `update_boost_status` calls in one transaction:** Each call touches a different StakeAccount PDA — no way to batch. One transaction per stake is correct.
- **Aborting the entire sweep on a single failure:** Wrap each transaction in its own try/catch. Log failures and continue to the next BoostRecord.
- **Re-checking already-revoked stakes:** Read StakeAccount before sending — skip if `boost_revoked == true`. This avoids paying fees for no-op transactions.
- **Hardcoding TOKEN_2022_PROGRAM_ID for the seed token program:** The on-chain instruction uses `token_interface` which accepts both SPL Token and Token-2022. However, the seed ATA derivation for the ATA address needs to match the actual token program. Since pump.fun tokens are standard SPL Token (not Token-2022), use the standard `TOKEN_PROGRAM_ID` from `@solana/spl-token`, not `TOKEN_2022_PROGRAM_ID`. The program derives the seed ATA via `associated_token::mint` + `associated_token::authority` constraints — the ATA address itself is identical for both programs if the same program ID was used at creation. Read the seed_token_program from the global state or use a configurable env var.
- **Using a stale blockhash across many transactions:** Fetch a fresh blockhash for each transaction. A single sweep could process 100+ stakes over several minutes — blockhashes expire after ~90 seconds.
- **Not logging per-stake outcomes:** Log `{ stakeOwner, stakeId, result }` for each transaction. This is essential for debugging and auditing which stakes were checked/revoked.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Enumerate all BoostRecord PDAs | Raw `getProgramAccounts` with manual memcmp filter on discriminator bytes | `program.account.boostRecord.all()` | Anchor's `.all()` applies the discriminator filter and deserializes automatically; same pattern used for `globalState.fetch()` throughout the crank |
| Retry failed transactions | Custom sleep-retry loop | `p-retry` (already installed) | Handles exponential backoff, max retries, per-attempt logging — already the project standard |
| RPC failover | Manual try/catch + second connection | `withRpcFallback` (already in `rpc.ts`) | Already handles primary + fallback RPC, error classification, fresh Program construction |
| Seed ATA address derivation | Manual PDA derivation | `getAssociatedTokenAddressSync` from `@solana/spl-token` | Deterministic ATA address; same library already used throughout tests |
| Cron scheduling | `setInterval` or custom timer | `node-cron` (already installed) | Already used for the daily distribution crank; same `noOverlap: true` option prevents concurrent sweeps |

**Key insight:** Everything needed is already built. The Phase 25 crank job is a thin orchestration layer on top of the `update_boost_status` instruction. The only new TypeScript code is: (1) enumerate BoostRecords, (2) filter to active boosted stakes, (3) call `update_boost_status` per stake.

---

## Common Pitfalls

### Pitfall 1: Token Program ID Mismatch for Seed ATA Derivation

**What goes wrong:** The `update_boost_status` instruction has an `associated_token::token_program = seed_token_program` constraint. If the crank derives the seed ATA using `TOKEN_2022_PROGRAM_ID` but the actual seed token is on standard SPL Token (`TOKEN_PROGRAM_ID`), Anchor will reject the account with a constraint violation.

**Why it happens:** pump.fun tokens are standard SPL Token (`TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA`), not Token-2022. The Phase 24 code uses `token_interface` to handle both, but the ATA address derivation must use the correct token program ID.

**How to avoid:** Read the token program from GlobalState (if stored) or configure it as an env var. The safest approach: attempt with SPL Token first; if the ATA doesn't exist, try Token-2022. Alternatively, pass the correct program ID via an env var `SEED_TOKEN_PROGRAM_ID` (defaulting to SPL Token until the seed mint is confirmed). Verify against devnet before mainnet.

**Warning signs:** `update_boost_status` transactions fail with `AccountConstraintViolation` or `InvalidSeedTokenAccount` error from Anchor.

### Pitfall 2: BoostRecord With `boosted_stake_id == u64::MAX` (Unlinked)

**What goes wrong:** A user who called `register_seed_boost` but never created a stake has a BoostRecord with `boosted_stake_id == u64::MAX`. Trying to derive a StakeAccount PDA from this sentinel value would derive an arbitrary address that doesn't contain a valid StakeAccount.

**Why it happens:** `boosted_stake_id` is initialized to `u64::MAX` in `register_seed_boost` and only written by `create_stake`. If the user registered but never staked, the crank would attempt to process an invalid stake ID.

**How to avoid:** Filter out unlinked BoostRecords before processing:
```typescript
const U64_MAX = BigInt('18446744073709551615');
const linked = allBoostRecords.filter(
  (r: any) => BigInt(r.account.boostedStakeId.toString()) !== U64_MAX,
);
```

**Warning signs:** `AccountNotFound` or `AccountDoesNotExist` errors when fetching StakeAccount, or transactions sent to invalid PDAs.

### Pitfall 3: Stale Blockhash Across Long Sweep

**What goes wrong:** With many boosted stakers (100+), a sweep could take several minutes. Reusing the same blockhash (fetched once at sweep start) causes `BlockhashNotFound` errors for transactions sent after ~90 seconds.

**Why it happens:** Solana blockhashes expire after approximately 150 slots (~60 seconds on mainnet, ~90 seconds with confirmation buffer). A single `getLatestBlockhash` at sweep start is invalid by the time later transactions are built.

**How to avoid:** Fetch a fresh `getLatestBlockhash` immediately before each transaction, not once at the start of the sweep. This is the same practice already enforced in `executeCrank` ("CRANK-02: Fresh blockhash per attempt — never cache from setup").

**Warning signs:** `BlockhashNotFound` errors logged for stakes processed late in the sweep.

### Pitfall 4: Sweep Rate Limiting / RPC Throttling

**What goes wrong:** Sending many `update_boost_status` transactions in rapid succession can hit RPC rate limits, especially on shared endpoints like public devnet.

**Why it happens:** The sweep could issue dozens of RPC calls (one `getLatestBlockhash` + one `sendRawTransaction` + one `confirmTransaction` per stake) in a tight loop.

**How to avoid:** Add a small delay between transactions (e.g., 100-200ms) if the staker count grows large. For the initial launch (few dozen stakers), this is not a concern. Use `p-retry` with exponential backoff on the per-transaction send. Log a warning if sweep duration exceeds 5 minutes.

**Warning signs:** HTTP 429 responses, `TooManyRequests` errors in the Pino log.

### Pitfall 5: Boost Check and Crank Distribution Schedules Overlapping at Midnight

**What goes wrong:** Both the crank distribution job (runs at `'5 0 * * *'`, `'20 0 * * *'`, etc.) and the boost check job (runs at `'0 0,6,12,18 * * *'`) fire near UTC midnight. If the `noOverlap: true` option is scoped globally to both jobs sharing the same cron instance, they might block each other.

**Why it happens:** `node-cron`'s `noOverlap` is per-schedule instance, not global. Two separate `cron.schedule()` calls with independent `noOverlap: true` do NOT block each other. They can run concurrently.

**How to avoid:** This is actually NOT a problem — the two jobs access different on-chain instructions and different accounts. They don't share state on the crank service side. Running concurrently is safe. The cron schedules are intentionally staggered (distribution fires at :05/:20/:35/:50 past midnight, boost check fires at :00). Confirm this is acceptable.

**Warning signs:** Not a real issue, but document in code comments for future maintainers.

---

## Code Examples

Verified patterns from official sources and the existing codebase:

### `boostCheck.ts` — Full Module Structure

```typescript
// Source: mirrors services/crank/src/crank.ts structure exactly

import {
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  ComputeBudgetProgram,
  Transaction,
} from '@solana/web3.js';
import { Program } from '@coral-xyz/anchor';
import { getAssociatedTokenAddressSync } from '@solana/spl-token';
import { logger } from './logger.js';

// Standard SPL Token program (pump.fun tokens are SPL Token, not Token-2022)
const SPL_TOKEN_PROGRAM_ID = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');
const ASSOCIATED_TOKEN_PROGRAM_ID = new PublicKey('ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJe1bsU');
const TOKEN_2022_PROGRAM_ID = new PublicKey('TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb');

// u64::MAX sentinel (BoostRecord.boosted_stake_id when unlinked)
const U64_MAX = BigInt('18446744073709551615');

// CU limit for update_boost_status (lightweight — just reads + conditional write)
const CU_LIMIT_BOOST_CHECK = 50_000;

export interface BoostCheckResult {
  checked: number;
  revoked: number;
  skipped: number;
  failed: number;
}

/** Extract seed_mint Pubkey from GlobalState reserved[2..5] */
function getSeedMintFromGlobalState(globalState: any): PublicKey {
  const reserved = globalState.reserved; // Array of 10 BN values
  const mintBytes = new Uint8Array(32);
  for (let i = 0; i < 4; i++) {
    const le = reserved[2 + i].toArrayLike(Buffer, 'le', 8);
    mintBytes.set(le, i * 8);
  }
  return new PublicKey(mintBytes);
}

/** Derive StakeAccount PDA for a given owner + stakeId */
function findStakePDA(programId: PublicKey, user: PublicKey, stakeId: any): PublicKey {
  const idBuffer = Buffer.alloc(8);
  stakeId.toArrayLike(Buffer, 'le', 8).copy(idBuffer);
  const [pda] = PublicKey.findProgramAddressSync(
    [Buffer.from('stake'), user.toBuffer(), idBuffer],
    programId,
  );
  return pda;
}

/**
 * Sweep all BoostRecord PDAs and call update_boost_status for any active
 * boosted stake where the owner's seed balance may have dropped.
 *
 * Idempotent: the on-chain instruction is a no-op for already-revoked stakes.
 */
export async function executeBoostCheck(
  program: Program,
  crankerKeypair: Keypair,
): Promise<BoostCheckResult> {
  const result: BoostCheckResult = { checked: 0, revoked: 0, skipped: 0, failed: 0 };
  const connection = program.provider.connection;

  const [globalStatePDA] = PublicKey.findProgramAddressSync(
    [Buffer.from('global_state')],
    program.programId,
  );

  // Read GlobalState for boost_enabled and seed_mint
  const globalState = await (program.account as any).globalState.fetch(globalStatePDA);
  const boostEnabled = globalState.reserved[7].toNumber() !== 0;

  if (!boostEnabled) {
    logger.info('Boost system disabled — skipping boost check sweep');
    return result;
  }

  const seedMint = getSeedMintFromGlobalState(globalState);
  if (seedMint.equals(PublicKey.default)) {
    logger.warn('seed_mint not configured in GlobalState — skipping boost check sweep');
    return result;
  }

  // Fetch all BoostRecord accounts (Anchor applies discriminator filter)
  const allBoostRecords = await (program.account as any).boostRecord.all();
  logger.info({ count: allBoostRecords.length }, 'Boost check: fetched all BoostRecords');

  // Filter to linked records only (boosted_stake_id != u64::MAX)
  const linked = allBoostRecords.filter(
    (r: any) => BigInt(r.account.boostedStakeId.toString()) !== U64_MAX,
  );

  logger.info({ linked: linked.length }, 'Boost check: linked BoostRecords to process');

  for (const record of linked) {
    result.checked++;
    const stakeOwner: PublicKey = record.account.user;
    const stakeId = record.account.boostedStakeId;
    const stakePDA = findStakePDA(program.programId, stakeOwner, stakeId);

    // Fetch StakeAccount to check if already revoked or inactive
    let stakeAccount: any;
    try {
      stakeAccount = await (program.account as any).stakeAccount.fetch(stakePDA);
    } catch {
      logger.warn({ stakeOwner: stakeOwner.toBase58(), stakeId: stakeId.toString() }, 'StakeAccount not found — skipping');
      result.skipped++;
      continue;
    }

    if (stakeAccount.boostRevoked || !stakeAccount.isActive) {
      result.skipped++;
      continue;
    }

    // Derive seed ATA — default to SPL Token program (pump.fun)
    // TODO: make seed token program configurable via env var if seed uses Token-2022
    const seedTokenProgram = SPL_TOKEN_PROGRAM_ID;
    const seedAta = getAssociatedTokenAddressSync(seedMint, stakeOwner, false, seedTokenProgram);

    try {
      const ix = await (program.methods as any)
        .updateBoostStatus()
        .accounts({
          payer: crankerKeypair.publicKey,
          globalState: globalStatePDA,
          stakeAccount: stakePDA,
          stakeOwner,
          seedTokenAccount: seedAta,
          seedMint,
          seedTokenProgram,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
        })
        .instruction();

      const tx = new Transaction()
        .add(ComputeBudgetProgram.setComputeUnitLimit({ units: CU_LIMIT_BOOST_CHECK }))
        .add(ComputeBudgetProgram.setComputeUnitPrice({ microLamports: 5_000 }))
        .add(ix);

      // Fresh blockhash per transaction (CRANK-02 pattern)
      const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
      tx.recentBlockhash = blockhash;
      tx.feePayer = crankerKeypair.publicKey;
      tx.sign(crankerKeypair);

      const sig = await connection.sendRawTransaction(tx.serialize());
      await connection.confirmTransaction(
        { signature: sig, blockhash, lastValidBlockHeight },
        'confirmed',
      );

      logger.info(
        { signature: sig, stakeOwner: stakeOwner.toBase58(), stakeId: stakeId.toString() },
        'update_boost_status sent',
      );
      result.revoked++; // Counts attempted (may be no-op if balance >= snapshot)
    } catch (err: any) {
      logger.error(
        { err: err instanceof Error ? err.message : String(err), stakeOwner: stakeOwner.toBase58() },
        'update_boost_status failed — skipping this stake',
      );
      result.failed++;
    }
  }

  logger.info(result, 'Boost check sweep complete');
  return result;
}
```

### Cron Schedule Addition in `index.ts`

```typescript
// Source: mirrors existing CRANK_TIMES pattern in index.ts

import { executeBoostCheck } from './boostCheck.js';

// BOOST-08: 6-hour boost check — fires at UTC 00:00, 06:00, 12:00, 18:00
const BOOST_CHECK_TIMES = ['0 0,6,12,18 * * *'];

async function boostCheckTick(): Promise<void> {
  if (isShuttingDown) return;
  try {
    const result = await withRpcFallback(
      (prog) => executeBoostCheck(prog, crankerKeypair),
      wallet,
      idl,
    );
    logger.info(result, 'Boost check tick complete');
  } catch (err) {
    logger.error(
      { err: err instanceof Error ? err.message : String(err) },
      'Boost check tick failed after all retries',
    );
  }
}

// In startup IIFE — add after existing crank schedule:
for (const expr of BOOST_CHECK_TIMES) {
  cron.schedule(expr, () => void boostCheckTick(), { timezone: 'UTC', noOverlap: true });
}
```

### LiteSVM Integration Test Structure

```typescript
// Source: mirrors boost.test.ts pattern from Phase 24

describe("executeBoostCheck (BOOST-08)", () => {
  it("revokes boost for user whose seed balance dropped below snapshot", async () => {
    // 1. setupTest() + initializeProtocol()
    // 2. createSeedMintAndFund(user, 10_000_000n)
    // 3. adminSetSeedMint + adminToggleBoost(true)
    // 4. registerSeedBoost (user registers with 10M seed tokens)
    // 5. createStake with BoostRecord + seed ATA remaining_accounts
    //    -> StakeAccount.seed_balance_at_stake = 10_000_000
    // 6. transferSeedTokens (user sends all seed tokens away, balance = 0)
    // 7. Call executeBoostCheck equivalent:
    //    program.methods.updateBoostStatus().accounts({...}).rpc()
    //    (or mock the sweep by calling update_boost_status directly)
    // 8. Fetch StakeAccount -> assert boost_revoked == true

    // NOTE: The LiteSVM test calls update_boost_status directly (not the crank sweep)
    // because LiteSVM is in-process and doesn't run the crank service.
    // The integration test validates the on-chain instruction; the crank sweep
    // is tested via the TypeScript unit test for executeBoostCheck.
  });

  it("no-ops for user with sufficient seed balance", async () => {
    // Same setup but do NOT transfer tokens away
    // Call update_boost_status
    // Assert: boost_revoked still false
  });

  it("no-ops for already-revoked boost", async () => {
    // Revoke boost (via claim_rewards or update_boost_status)
    // Call update_boost_status again
    // Assert: boost_revoked still true (no double-event, same state)
  });
});
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Single daily crank job | Multiple cron schedules (distribution + boost check) | Phase 25 | `node-cron` handles multiple independent schedules cleanly with `noOverlap: true` per schedule |
| Manual account enumeration with raw RPC | `program.account.TYPE.all()` via Anchor | Anchor 0.29+ | Typed deserialization + discriminator filter in one call; eliminates manual memcmp byte construction |
| Retry-all-or-nothing | Per-entity try/catch with aggregate result | Phase 25 | One failed transaction doesn't abort sweep; supports progressive success on partial RPC failures |

**Deprecated/outdated:**
- Raw `getProgramAccounts` with manual discriminator buffer construction: replaced by Anchor's `.all()` — still works but more verbose and error-prone.

---

## Open Questions

1. **Seed token program ID (SPL Token vs Token-2022)**
   - What we know: The on-chain `update_boost_status` uses `token_interface` and accepts both. pump.fun tokens are standard SPL Token. The ATA address derivation needs the correct program ID to match what was used when the ATA was created.
   - What's unclear: Which token program was used when the seed token launch happens. If it's pump.fun, it is SPL Token. If a Token-2022 mint is used, it's Token-2022.
   - Recommendation: Default to SPL Token program ID in the crank. Add an optional `SEED_TOKEN_PROGRAM_ID` env var to `env.ts` that defaults to `TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA`. The LiteSVM tests use Token-2022 (how Phase 24 tests were written) — the crank default needs to match actual production deployment.

2. **"revoked" count semantics in BoostCheckResult**
   - What we know: `update_boost_status` is a no-op if current balance >= snapshot. A transaction sent for a healthy user succeeds but does nothing.
   - What's unclear: Should `result.revoked` count only transactions that actually changed state (balance < snapshot) or all non-skipped transactions sent?
   - Recommendation: Rename to `result.sent` to count all transactions sent; if granular revocation counting is needed, parse the emitted `BoostRevoked` event from the transaction logs. For v3.0, counting sent transactions is sufficient.

3. **On-chain `boost_enabled` guard in `update_boost_status`**
   - What we know: The current `update_boost_status` implementation does NOT check `global_state.get_boost_enabled()` — it revokes any stake where balance < snapshot regardless of the boost_enabled flag.
   - What's unclear: If admin disables boost via `admin_toggle_boost(false)`, should the crank still revoke? Semantically no — disabling boost means the system is off. But the on-chain instruction doesn't guard against this.
   - Recommendation: In `executeBoostCheck`, check `boost_enabled` from GlobalState before iterating (already shown in the code example above). This is a crank-side guard that matches the intent. The on-chain instruction can also be updated to check the flag, but that's a Phase 24 concern, not Phase 25.

---

## Validation Architecture

> `workflow.nyquist_validation` is not explicitly set to false in `.planning/config.json` — validation section included.

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Vitest + LiteSVM (litesvm + anchor-litesvm) |
| Config file | `vitest.config.ts` at workspace root |
| Quick run command | `npx vitest run tests/litesvm/boost.test.ts -t "update_boost_status"` |
| Full suite command | `npx vitest run tests/litesvm/` |

### Phase Requirements -> Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| BOOST-08 | `update_boost_status` revokes boost when seed balance < snapshot | integration (LiteSVM) | `npx vitest run tests/litesvm/boost.test.ts -t "update_boost_status"` | Partial — `boost.test.ts` exists but needs BOOST-08 describe block |
| BOOST-08 | `update_boost_status` is a no-op when balance >= snapshot | integration (LiteSVM) | `npx vitest run tests/litesvm/boost.test.ts -t "update_boost_status"` | ❌ Wave 0 |
| BOOST-08 | `update_boost_status` is a no-op when already revoked | integration (LiteSVM) | `npx vitest run tests/litesvm/boost.test.ts -t "update_boost_status"` | ❌ Wave 0 |
| BOOST-08 | User sees revoked status within 6h without a claim | manual (production only) | `npx vitest run tests/litesvm/boost.test.ts -t "update_boost_status"` | N/A — on-chain instruction test is the automated proxy |
| BOOST-08 | `executeBoostCheck` skips unlinked BoostRecords (boosted_stake_id == u64::MAX) | unit (TypeScript) | `npx vitest run services/crank/src/boostCheck.test.ts` | ❌ Wave 0 |
| BOOST-08 | `executeBoostCheck` skips already-revoked stakes | unit (TypeScript) | `npx vitest run services/crank/src/boostCheck.test.ts` | ❌ Wave 0 |

### Sampling Rate

- **Per task commit:** `npx vitest run tests/litesvm/boost.test.ts`
- **Per wave merge:** `npx vitest run tests/litesvm/`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps

- [ ] `tests/litesvm/boost.test.ts` — add `describe("update_boost_status (BOOST-08)")` block covering: revoke when balance dropped, no-op when balance sufficient, no-op when already revoked
- [ ] `services/crank/src/boostCheck.ts` — new file (primary deliverable)
- [ ] TypeScript unit tests for `executeBoostCheck` — optional but recommended for the filter logic (unlinked skip, revoked skip); can be in `services/crank/src/boostCheck.test.ts` if Vitest is configured for the crank service, otherwise skip and rely on LiteSVM integration tests

*(The primary test coverage for BOOST-08 comes from adding `update_boost_status` tests to the existing `boost.test.ts`. The crank's TypeScript orchestration logic is sufficiently simple that LiteSVM coverage of the instruction is the meaningful test.)*

---

## Sources

### Primary (HIGH confidence)

- `services/crank/src/crank.ts` — read directly; `executeCrank` is the direct template for `executeBoostCheck`
- `services/crank/src/index.ts` — read directly; cron scheduling pattern, `boostCheckTick` mirrors `tick`
- `services/crank/src/rpc.ts` — read directly; `withRpcFallback` wraps `executeBoostCheck` unchanged
- `services/crank/src/env.ts` — read directly; Zod env validation pattern for any new env vars
- `programs/helix-staking/src/instructions/update_boost_status.rs` — read directly; confirms instruction is permissionless, confirms account layout for `program.methods.updateBoostStatus().accounts({...})`
- `programs/helix-staking/src/state/boost_record.rs` — read directly; confirms `BoostRecord` fields and LEN
- `programs/helix-staking/src/state/global_state.rs` — read directly; confirms reserved slot layout for seed_mint (reserved[2..5]), min_seed_balance (reserved[6]), boost_enabled (reserved[7])
- `programs/helix-staking/src/state/stake_account.rs` — read directly; confirms `boost_revoked` and `is_active` fields
- `target/idl/helix_staking.json` — read directly; confirms `boostRecord` account type exists in IDL (Anchor `.all()` will work), `update_boost_status` instruction and accounts confirmed, BoostRecord discriminator `[35, 20, 234, 24, 56, 202, 3, 116]`
- `tests/litesvm/utils.ts` — read directly; `findBoostRecordPDA`, `createSeedMintAndFund`, `getSeedMintFromGlobalState` reconstruction logic (lines 53-60 of boost.test.ts)
- `services/crank/package.json` — read directly; confirms all needed libraries already installed

### Secondary (MEDIUM confidence)

- Anchor `.all()` pattern — documented in Anchor docs and confirmed by `(program.account as any).globalState.fetch()` usage in existing `crank.ts`; discriminator filter is applied automatically
- node-cron v4 comma-separated hour syntax (`'0 0,6,12,18 * * *'`) — consistent with node-cron README syntax and v4 changelog; no breaking changes to basic cron expression syntax

### Tertiary (LOW confidence)

- None — all findings are supported by in-codebase evidence at HIGH or MEDIUM level

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all libraries already installed and in use; no new dependencies
- Architecture: HIGH — `update_boost_status` is already implemented; the crank extension follows the exact existing pattern from `executeCrank`
- Pitfalls: HIGH — derived from concrete code analysis (token program ID ambiguity, u64::MAX sentinel, blockhash staleness are all addressable concerns with known solutions)
- Validation: HIGH — existing test framework is established; Wave 0 gaps are clearly bounded to one new describe block in `boost.test.ts`

**Research date:** 2026-03-04
**Valid until:** 2026-04-04 (stable Anchor/node-cron ecosystem; internal patterns change only when team changes them)