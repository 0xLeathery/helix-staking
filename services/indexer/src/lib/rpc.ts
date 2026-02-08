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
