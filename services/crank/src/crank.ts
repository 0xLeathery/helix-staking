import {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  ComputeBudgetProgram,
  Transaction,
} from '@solana/web3.js';
import { Program } from '@coral-xyz/anchor';
import { logger } from './logger.js';
import { env } from './env.js';

export type CrankResult = 'cranked' | 'already_done' | 'not_yet' | 'program_paused';

export interface BalanceCheck {
  balance: number;
  belowThreshold: boolean;
}

const ALREADY_DISTRIBUTED_ERROR_CODE = 6015;
const PROGRAM_PAUSED_ERROR_CODE = 6051;
const CU_LIMIT_CRANK = 100_000; // matches compute-budget.ts CU_LIMITS.crankDistribution

/**
 * Load the cranker keypair from CRANK_KEYPAIR_JSON env var.
 * Called once at startup — keypair is immutable and safe to reuse.
 */
export function loadCrankerKeypair(): Keypair {
  const secretBytes = Uint8Array.from(JSON.parse(env.CRANK_KEYPAIR_JSON));
  return Keypair.fromSecretKey(secretBytes);
}

/**
 * Check SOL balance of the cranker wallet.
 * Logs a warning and sets belowThreshold if below env.SOL_BALANCE_THRESHOLD_SOL.
 */
export async function checkSolBalance(
  connection: Connection,
  publicKey: PublicKey,
): Promise<BalanceCheck> {
  const lamports = await connection.getBalance(publicKey);
  const balance = lamports / LAMPORTS_PER_SOL;
  const belowThreshold = balance < env.SOL_BALANCE_THRESHOLD_SOL;

  if (belowThreshold) {
    logger.warn(
      { balance, threshold: env.SOL_BALANCE_THRESHOLD_SOL },
      'Cranker SOL balance below threshold — fund the crank wallet',
    );
  }

  return { balance, belowThreshold };
}

/**
 * Execute a crank_distribution transaction.
 *
 * Flow:
 * 1. Read on-chain global_state for idempotency check and gap detection
 * 2. If day boundary not yet crossed, return 'not_yet'
 * 3. Build transaction with ComputeBudget priority fee instructions
 * 4. Fetch fresh blockhash (CRANK-02: never reuse cached blockhash)
 * 5. Sign, send, confirm
 * 6. Classify errors: 6015 = skip, 6051 = stop, other = rethrow for retry
 */
export async function executeCrank(
  program: Program,
  crankerKeypair: Keypair,
): Promise<CrankResult> {
  const connection = program.provider.connection;

  const [globalStatePda] = PublicKey.findProgramAddressSync(
    [Buffer.from('global_state')],
    program.programId,
  );

  // Read on-chain state for idempotency check and gap detection (CRANK-06, CRANK-07)
  const state = await (program.account as any).globalState.fetch(globalStatePda);
  const slot = await connection.getSlot();
  const currentDay = Math.floor(
    (slot - Number(state.initSlot)) / Number(state.slotsPerDay),
  );

  if (currentDay <= Number(state.currentDay)) {
    logger.debug(
      { slot, currentDay, chainDay: Number(state.currentDay) },
      'Day boundary not yet crossed — skipping crank',
    );
    return 'not_yet';
  }

  const daysGap = currentDay - Number(state.currentDay);
  if (daysGap > 1) {
    logger.warn(
      { daysGap, currentDay, chainDay: Number(state.currentDay) },
      'Multi-day gap detected — catching up missed distributions',
    );
  }

  try {
    // Build instruction via Anchor — only cranker needs to be specified;
    // Anchor resolves PDAs (global_state, mint, mint_authority) from IDL seeds
    const ix = await (program.methods as any)
      .crankDistribution()
      .accounts({ cranker: crankerKeypair.publicKey } as any)
      .instruction();

    // Build transaction with ComputeBudget instructions prepended
    const tx = new Transaction()
      .add(ComputeBudgetProgram.setComputeUnitLimit({ units: CU_LIMIT_CRANK }))
      .add(ComputeBudgetProgram.setComputeUnitPrice({ microLamports: 5_000 }))
      .add(ix);

    // CRANK-02: Fresh blockhash per attempt — never cache from setup
    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
    tx.recentBlockhash = blockhash;
    tx.feePayer = crankerKeypair.publicKey;
    tx.sign(crankerKeypair);

    const sig = await connection.sendRawTransaction(tx.serialize());
    await connection.confirmTransaction(
      { signature: sig, blockhash, lastValidBlockHeight },
      'confirmed',
    );

    logger.info({ signature: sig, daysGap }, 'crank_distribution confirmed');
    return 'cranked';
  } catch (err: any) {
    const code = err?.error?.errorCode?.number;

    if (code === ALREADY_DISTRIBUTED_ERROR_CODE) {
      // CRANK-05: AlreadyDistributedToday is a success variant — another caller beat us
      logger.info('Already distributed today (race condition) — skipping');
      return 'already_done';
    }

    if (code === PROGRAM_PAUSED_ERROR_CODE) {
      // CRANK-05: ProgramPaused — admin intervention required
      logger.error('Program is paused — crank blocked until admin unpause');
      return 'program_paused';
    }

    // RPC errors, network errors — rethrow for caller retry (CRANK-03)
    throw err;
  }
}
