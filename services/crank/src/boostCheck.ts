import {
  Keypair,
  PublicKey,
  ComputeBudgetProgram,
  Transaction,
} from '@solana/web3.js';
import { Program } from '@coral-xyz/anchor';
import { getAssociatedTokenAddressSync } from '@solana/spl-token';
import { logger } from './logger.js';
import { env } from './env.js';

// ---------------------------------------------------------------------------
// Result type
// ---------------------------------------------------------------------------

export interface BoostCheckResult {
  /** Total linked BoostRecord accounts examined */
  checked: number;
  /** Transactions sent to update_boost_status */
  sent: number;
  /** Records skipped (already revoked, inactive stake, or unlinked) */
  skipped: number;
  /** Transactions that failed (logged but not fatal) */
  failed: number;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const GLOBAL_STATE_SEED = 'global_state';
const STAKE_SEED = 'stake';

/** u64::MAX sentinel — indicates BoostRecord is not yet linked to a stake */
const BOOST_RECORD_UNLINKED = BigInt('18446744073709551615');

/** Associated Token Program ID */
const ASSOCIATED_TOKEN_PROGRAM = new PublicKey('ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJe1bsU');

/** System Program ID */
const SYSTEM_PROGRAM = new PublicKey('11111111111111111111111111111111');

const CU_LIMIT_BOOST_CHECK = 50_000;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Extract seed_mint from GlobalState.reserved[2..5].
 * The seed mint is stored as 4 consecutive LE u64s (32 bytes total).
 * This mirrors the pattern used in tests/litesvm/boost.test.ts.
 */
function getSeedMintFromGlobalState(globalState: any): PublicKey {
  const reserved = globalState.reserved;
  const mintBytes = new Uint8Array(32);
  for (let i = 0; i < 4; i++) {
    const le = reserved[2 + i].toArrayLike(Buffer, 'le', 8);
    mintBytes.set(le, i * 8);
  }
  return new PublicKey(mintBytes);
}

// ---------------------------------------------------------------------------
// Main sweep function
// ---------------------------------------------------------------------------

/**
 * Sweep all BoostRecord PDAs and call update_boost_status for any active
 * boosted stake where the owner's seed token balance may have dropped.
 *
 * BOOST-08: Proactive revocation so users see revoked boost status within 6 hours
 * without needing to trigger a claim transaction.
 *
 * Flow:
 * 1. Fetch GlobalState — check boost_enabled (reserved[7])
 * 2. Extract seed_mint from GlobalState.reserved[2..5]
 * 3. Enumerate all BoostRecord accounts via program.account.boostRecord.all()
 * 4. Filter: only linked records (boostedStakeId != u64::MAX)
 * 5. For each linked record: fetch StakeAccount, skip if already revoked or inactive
 * 6. Derive seed ATA, build update_boost_status tx, send (fresh blockhash per tx)
 * 7. Individual failures are caught and logged — sweep continues regardless
 */
export async function executeBoostCheck(
  program: Program,
  crankerKeypair: Keypair,
): Promise<BoostCheckResult> {
  const connection = program.provider.connection;
  const result: BoostCheckResult = { checked: 0, sent: 0, skipped: 0, failed: 0 };

  // Step 1: Fetch GlobalState
  const [globalStatePDA] = PublicKey.findProgramAddressSync(
    [Buffer.from(GLOBAL_STATE_SEED)],
    program.programId,
  );

  const globalState = await (program.account as any).globalState.fetch(globalStatePDA);

  // Check boost_enabled flag in reserved[7] (non-zero = enabled)
  const boostEnabled = !globalState.reserved[7].isZero();
  if (!boostEnabled) {
    logger.info('Boost is disabled (reserved[7] == 0) — skipping boost check sweep');
    return result;
  }

  // Step 2: Extract seed_mint from reserved[2..5]
  const seedMint = getSeedMintFromGlobalState(globalState);
  if (seedMint.equals(PublicKey.default)) {
    logger.warn('seed_mint is PublicKey.default — boost not yet configured, skipping sweep');
    return result;
  }

  // Step 3: Read SEED_TOKEN_PROGRAM_ID from env
  const seedTokenProgram = new PublicKey(env.SEED_TOKEN_PROGRAM_ID);

  logger.info(
    { seedMint: seedMint.toBase58(), seedTokenProgram: seedTokenProgram.toBase58() },
    'Starting boost check sweep',
  );

  // Step 4: Enumerate all BoostRecord accounts
  const boostRecords = await (program.account as any).boostRecord.all();

  // Step 5: Filter to linked records only (boostedStakeId != u64::MAX)
  const linkedRecords = boostRecords.filter(
    (r: any) => BigInt(r.account.boostedStakeId.toString()) !== BOOST_RECORD_UNLINKED,
  );

  logger.info(
    { total: boostRecords.length, linked: linkedRecords.length },
    'BoostRecord accounts enumerated',
  );

  // Step 6: Process each linked record
  for (const record of linkedRecords) {
    const stakeOwner: PublicKey = record.account.user;
    const stakeId = record.account.boostedStakeId;

    result.checked += 1;

    // Derive StakeAccount PDA
    const [stakePDA] = PublicKey.findProgramAddressSync(
      [
        Buffer.from(STAKE_SEED),
        stakeOwner.toBuffer(),
        stakeId.toArrayLike(Buffer, 'le', 8),
      ],
      program.programId,
    );

    // Fetch StakeAccount — skip if not found
    let stakeAccount: any;
    try {
      stakeAccount = await (program.account as any).stakeAccount.fetch(stakePDA);
    } catch (err) {
      logger.warn(
        { stakeOwner: stakeOwner.toBase58(), stakeId: stakeId.toString() },
        'StakeAccount not found — skipping',
      );
      result.skipped += 1;
      continue;
    }

    // Skip already-revoked or inactive stakes
    if (stakeAccount.boostRevoked || !stakeAccount.isActive) {
      logger.debug(
        {
          stakeOwner: stakeOwner.toBase58(),
          stakeId: stakeId.toString(),
          boostRevoked: stakeAccount.boostRevoked,
          isActive: stakeAccount.isActive,
        },
        'Skipping — already revoked or inactive',
      );
      result.skipped += 1;
      continue;
    }

    // Derive seed ATA for the stake owner
    const seedAta = getAssociatedTokenAddressSync(
      seedMint,
      stakeOwner,
      false,
      seedTokenProgram,
    );

    // Build update_boost_status instruction
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
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM,
          systemProgram: SYSTEM_PROGRAM,
        })
        .instruction();

      // Build transaction with compute budget
      const tx = new Transaction()
        .add(ComputeBudgetProgram.setComputeUnitLimit({ units: CU_LIMIT_BOOST_CHECK }))
        .add(ComputeBudgetProgram.setComputeUnitPrice({ microLamports: 5_000 }))
        .add(ix);

      // CRANK-02: Fresh blockhash per transaction — never cache from sweep start
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
      result.sent += 1;
    } catch (err) {
      // Individual transaction failure — log and continue the sweep
      logger.error(
        {
          err: err instanceof Error ? err.message : String(err),
          stakeOwner: stakeOwner.toBase58(),
        },
        'update_boost_status failed — continuing sweep',
      );
      result.failed += 1;
    }
  }

  logger.info(result, 'Boost check sweep complete');
  return result;
}
