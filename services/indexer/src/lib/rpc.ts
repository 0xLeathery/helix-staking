import {
  Connection,
  type Commitment,
  type Finality,
  type ConfirmedSignatureInfo,
  type SignaturesForAddressOptions,
  type ParsedTransactionWithMeta,
  PublicKey,
} from '@solana/web3.js';
import pRetry, { type FailedAttemptError } from 'p-retry';
import { logger } from './logger.js';
import { env } from './env.js';

const DEFAULT_COMMITMENT: Finality = 'confirmed';

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
      `RPC call failed, retrying...`,
    );
  },
};

export interface RpcClient {
  getSignaturesForAddress(
    address: PublicKey,
    options?: SignaturesForAddressOptions,
  ): Promise<ConfirmedSignatureInfo[]>;
  getParsedTransaction(
    signature: string,
    commitment?: Finality,
  ): Promise<ParsedTransactionWithMeta | null>;
  getSlot(commitment?: Commitment): Promise<number>;
  connection: Connection;
}

export function createRpcClient(endpoint: string): RpcClient {
  const connection = new Connection(endpoint, DEFAULT_COMMITMENT);

  return {
    connection,

    async getSignaturesForAddress(
      address: PublicKey,
      options?: SignaturesForAddressOptions,
    ): Promise<ConfirmedSignatureInfo[]> {
      return pRetry(
        () => connection.getSignaturesForAddress(address, options),
        RETRY_OPTIONS,
      );
    },

    async getParsedTransaction(
      signature: string,
      commitment?: Finality,
    ): Promise<ParsedTransactionWithMeta | null> {
      return pRetry(
        () =>
          connection.getParsedTransaction(signature, {
            commitment: commitment ?? DEFAULT_COMMITMENT,
            maxSupportedTransactionVersion: 0,
          }),
        RETRY_OPTIONS,
      );
    },

    async getSlot(commitment?: Commitment): Promise<number> {
      return pRetry(
        () => connection.getSlot(commitment ?? DEFAULT_COMMITMENT),
        RETRY_OPTIONS,
      );
    },
  };
}

/**
 * OPS-05: Create a fallback RPC client from RPC_URL_FALLBACK env var.
 * Returns null if no fallback is configured.
 */
export function createFallbackRpcClient(): RpcClient | null {
  if (!env.RPC_URL_FALLBACK) return null;
  return createRpcClient(env.RPC_URL_FALLBACK);
}

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

/**
 * OPS-05: Execute an RPC operation with automatic failover.
 *
 * Tries the primary RPC client with full retries (5). If primary exhausts
 * all retries and a fallback endpoint is configured, switches to the fallback
 * client with a shorter retry budget (3). If no fallback is configured, the
 * primary error is re-thrown.
 *
 * Usage:
 * ```ts
 * const sigs = await withRpcFallback((rpc) =>
 *   rpc.getSignaturesForAddress(programId, opts)
 * );
 * ```
 */
export async function withRpcFallback<T>(
  fn: (rpc: RpcClient) => Promise<T>,
): Promise<T> {
  const primary = createRpcClient(env.RPC_URL);
  try {
    return await pRetry(() => fn(primary), RETRY_OPTIONS);
  } catch (primaryErr) {
    const fallback = createFallbackRpcClient();
    if (!fallback) throw primaryErr;
    logger.warn(
      { error: primaryErr instanceof Error ? primaryErr.message : String(primaryErr) },
      'Primary RPC exhausted all retries — switching to fallback endpoint',
    );
    return await pRetry(() => fn(fallback), FALLBACK_RETRY_OPTIONS);
  }
}
