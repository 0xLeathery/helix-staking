import { PublicKey, type ConfirmedSignatureInfo } from '@solana/web3.js';
import type { RpcClient } from '../lib/rpc.js';
import { logger } from '../lib/logger.js';

/** Maximum signatures per RPC call (Solana's hard limit) */
const PAGE_SIZE = 1000;

/**
 * Fetch ALL new transaction signatures for the program since the last checkpoint.
 *
 * Phase 8.1 (H6/FR-007): Implements recursive backward pagination to handle
 * gaps >1000 signatures. getSignaturesForAddress returns newest-first with a
 * max of 1000 per call. When we receive a full page, we paginate backward
 * using `before` (oldest sig in current batch) until we get a partial page.
 *
 * Returns signatures in chronological order (oldest first) so they are
 * processed and checkpointed in the correct sequence.
 */
export async function fetchNewSignatures(
  rpc: RpcClient,
  programId: string,
  checkpoint: { lastSignature: string | null },
): Promise<ConfirmedSignatureInfo[]> {
  const allSignatures: ConfirmedSignatureInfo[] = [];
  let beforeSig: string | undefined;

  // Paginate backward from newest to checkpoint
  while (true) {
    const options: {
      limit: number;
      until?: string;
      before?: string;
    } = { limit: PAGE_SIZE };

    // `until` = stop when we reach our checkpoint (exclusive)
    if (checkpoint.lastSignature) {
      options.until = checkpoint.lastSignature;
    }

    // `before` = fetch sigs older than this (for pagination)
    if (beforeSig) {
      options.before = beforeSig;
    }

    const batch = await rpc.getSignaturesForAddress(
      new PublicKey(programId),
      options,
    );

    if (batch.length === 0) {
      break;
    }

    allSignatures.push(...batch);

    logger.info(
      { batchSize: batch.length, totalFetched: allSignatures.length },
      'Fetched signature batch',
    );

    // If we got fewer than PAGE_SIZE, there are no more pages
    if (batch.length < PAGE_SIZE) {
      break;
    }

    // Use the OLDEST signature in this batch (last element, since results are newest-first)
    // as the `before` cursor for the next page
    beforeSig = batch[batch.length - 1].signature;
  }

  if (allSignatures.length === 0) {
    logger.debug('No new signatures found');
    return [];
  }

  logger.info({ count: allSignatures.length }, 'Fetched all new signatures');

  // Reverse to process oldest first (chronological order)
  return allSignatures.reverse();
}
