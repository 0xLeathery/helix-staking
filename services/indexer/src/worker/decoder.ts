import type { RpcClient } from '../lib/rpc.js';
import { parseEventsFromLogs } from '../lib/anchor.js';
import { logger } from '../lib/logger.js';

/**
 * Fetch a parsed transaction by signature and decode Anchor events from its logs.
 *
 * Returns an empty array (never throws) if the transaction is pruned, has no
 * logs, or an error occurs during decoding -- the worker should continue
 * processing subsequent signatures.
 */
export async function decodeEventsFromSignature(
  rpc: RpcClient,
  signature: string,
): Promise<Array<{ name: string; data: any; slot: number }>> {
  try {
    const tx = await rpc.getParsedTransaction(signature, 'confirmed');

    if (!tx) {
      logger.warn({ signature }, 'Transaction not found (pruned or unavailable)');
      return [];
    }

    if (!tx.meta || !tx.meta.logMessages || tx.meta.logMessages.length === 0) {
      return [];
    }

    const events = parseEventsFromLogs(tx.meta.logMessages);
    const slot = tx.slot;

    return events.map((event) => ({
      name: event.name,
      data: event.data,
      slot,
    }));
  } catch (error) {
    logger.error(
      { signature, error: error instanceof Error ? error.message : String(error) },
      'Failed to decode events from transaction',
    );
    return [];
  }
}
