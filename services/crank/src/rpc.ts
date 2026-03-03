import { Connection } from '@solana/web3.js';
import { AnchorProvider, Program, Wallet } from '@coral-xyz/anchor';
import pRetry, { type FailedAttemptError } from 'p-retry';
import { logger } from './logger.js';
import { env } from './env.js';

// ---------------------------------------------------------------------------
// Retry options
// ---------------------------------------------------------------------------

const RETRY_OPTIONS = {
  retries: 5,
  factor: 2,
  minTimeout: 1_000,
  maxTimeout: 60_000,
  onFailedAttempt: (error: FailedAttemptError) => {
    logger.warn(
      {
        attempt: error.attemptNumber,
        retriesLeft: error.retriesLeft,
        message: error.message,
      },
      'RPC call failed, retrying...',
    );
  },
};

const FALLBACK_RETRY_OPTIONS = {
  retries: 3,
  factor: 2,
  minTimeout: 1_000,
  maxTimeout: 30_000,
  onFailedAttempt: (error: FailedAttemptError) => {
    logger.warn(
      {
        attempt: error.attemptNumber,
        retriesLeft: error.retriesLeft,
        message: error.message,
      },
      'Fallback RPC call failed, retrying...',
    );
  },
};

// ---------------------------------------------------------------------------
// Program factory
// ---------------------------------------------------------------------------

/**
 * Create an Anchor Program instance connected to a given RPC endpoint.
 * Both primary and fallback paths use this to build a fresh Program with
 * a new Connection — ensuring executeCrank gets a fresh blockhash source
 * when switching endpoints (CRANK-02 + CRANK-03).
 */
export function createCrankProgram(rpcUrl: string, wallet: Wallet, idl: any): Program {
  const connection = new Connection(rpcUrl, 'confirmed');
  const provider = new AnchorProvider(connection, wallet, {
    commitment: 'confirmed',
    preflightCommitment: 'confirmed',
  });
  return new Program(idl, provider);
}

// ---------------------------------------------------------------------------
// withRpcFallback
// ---------------------------------------------------------------------------

/**
 * Execute an operation with automatic RPC failover.
 *
 * Tries the primary RPC endpoint (env.RPC_URL) with full retries (5). If the
 * primary exhausts all retries and env.RPC_URL_FALLBACK is configured, switches
 * to the fallback endpoint with a shorter retry budget (3). If no fallback is
 * configured, the primary error is re-thrown unchanged — behaviour identical to
 * the previous single-endpoint p-retry wrapper.
 *
 * The fn callback receives a fully-constructed Program with a fresh Connection
 * for each endpoint. This ensures each attempt gets a fresh blockhash source.
 *
 * Usage:
 * ```ts
 * const result = await withRpcFallback(
 *   (prog) => executeCrank(prog, crankerKeypair),
 *   wallet,
 *   idl,
 * );
 * ```
 */
export async function withRpcFallback<T>(
  fn: (program: Program) => Promise<T>,
  wallet: Wallet,
  idl: any,
): Promise<T> {
  const primaryProgram = createCrankProgram(env.RPC_URL, wallet, idl);
  try {
    return await pRetry(() => fn(primaryProgram), RETRY_OPTIONS);
  } catch (primaryErr) {
    if (!env.RPC_URL_FALLBACK) throw primaryErr;
    logger.warn(
      { error: primaryErr instanceof Error ? primaryErr.message : String(primaryErr) },
      'Primary RPC exhausted all retries — switching to fallback endpoint',
    );
    const fallbackProgram = createCrankProgram(env.RPC_URL_FALLBACK, wallet, idl);
    return await pRetry(() => fn(fallbackProgram), FALLBACK_RETRY_OPTIONS);
  }
}
