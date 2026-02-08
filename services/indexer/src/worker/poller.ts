import { PublicKey, type ConfirmedSignatureInfo } from '@solana/web3.js';
import type { RpcClient } from '../lib/rpc.js';
import { logger } from '../lib/logger.js';

/**
 * Fetch new transaction signatures for the program since the last checkpoint.
 *
 * Returns signatures in chronological order (oldest first) so they are
 * processed and checkpointed in the correct sequence.
 *
 * Uses `until` (not `before`) because getSignaturesForAddress returns
 * newest-first and `until` means "get signatures until (but not including)
 * this one", giving us everything AFTER our checkpoint.
 */
export async function fetchNewSignatures(
  rpc: RpcClient,
  programId: string,
  checkpoint: { lastSignature: string | null },
): Promise<ConfirmedSignatureInfo[]> {
  const options: { limit: number; until?: string } = { limit: 1000 };

  if (checkpoint.lastSignature) {
    options.until = checkpoint.lastSignature;
  }

  const signatures = await rpc.getSignaturesForAddress(
    new PublicKey(programId),
    options,
  );

  if (signatures.length === 0) {
    logger.debug('No new signatures found');
    return [];
  }

  logger.info({ count: signatures.length }, 'Fetched new signatures');

  // Reverse to process oldest first (chronological order)
  return signatures.reverse();
}
