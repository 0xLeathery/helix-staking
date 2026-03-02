import { env } from '../lib/env.js';
import { createRpcClient } from '../lib/rpc.js';
import { logger } from '../lib/logger.js';
import { closePool } from '../db/client.js';
import { db } from '../db/client.js';
import { getCheckpoint, updateCheckpoint } from './checkpoint.js';
import { fetchNewSignatures } from './poller.js';
import { decodeEventsFromSignature } from './decoder.js';
import { processEvent } from './processor.js';
import { startNotificationScheduler } from './notification-scheduler.js';

// ---------------------------------------------------------------------------
// State flags
// ---------------------------------------------------------------------------
let isProcessing = false;
let isShuttingDown = false;
let pollTimer: ReturnType<typeof setInterval> | null = null;

// ---------------------------------------------------------------------------
// RPC client
// ---------------------------------------------------------------------------
const rpc = createRpcClient(env.RPC_URL);

// ---------------------------------------------------------------------------
// Startup logging
// ---------------------------------------------------------------------------
const maskedRpc =
  env.RPC_URL.length > 20
    ? env.RPC_URL.slice(0, 12) + '...' + env.RPC_URL.slice(-8)
    : env.RPC_URL;

logger.info(
  {
    programId: env.PROGRAM_ID,
    pollIntervalMs: env.POLL_INTERVAL_MS,
    rpcUrl: maskedRpc,
  },
  'Helix indexer worker starting',
);

// ---------------------------------------------------------------------------
// Poll tick
// ---------------------------------------------------------------------------
async function tick(): Promise<void> {
  if (isProcessing || isShuttingDown) {
    return;
  }

  isProcessing = true;

  try {
    // 1. Get current checkpoint
    const checkpoint = await getCheckpoint(env.PROGRAM_ID);

    // 2. Fetch new signatures since checkpoint (oldest first)
    const signatures = await fetchNewSignatures(rpc, env.PROGRAM_ID, checkpoint);

    if (signatures.length === 0) {
      logger.debug('No new signatures to process');
      return;
    }

    let totalEvents = 0;
    let processedCount = 0;

    // 3. Process signatures one at a time (ordering + checkpoint consistency)
    for (const sigInfo of signatures) {
      if (isShuttingDown) {
        logger.info('Shutdown requested, stopping batch processing');
        break;
      }

      try {
        // Decode events from this transaction
        const events = await decodeEventsFromSignature(rpc, sigInfo.signature);

        // Phase 8.1 (H7/FR-008): Atomic event insert + checkpoint update
        // Wrapping in a transaction ensures we never have events stored
        // without a corresponding checkpoint update (or vice versa)
        const slot = sigInfo.slot ?? 0;
        await db.transaction(async (tx) => {
          for (const event of events) {
            await processEvent(event, sigInfo.signature, tx);
          }
          await updateCheckpoint(env.PROGRAM_ID, sigInfo.signature, slot, tx);
        });

        totalEvents += events.length;
        processedCount++;
      } catch (error) {
        // Individual signature failure does NOT abort the batch
        logger.error(
          {
            signature: sigInfo.signature,
            error: error instanceof Error ? error.message : String(error),
          },
          'Failed to process signature, continuing to next',
        );
      }
    }

    logger.info(
      { signaturesProcessed: processedCount, eventsStored: totalEvents },
      'Batch processing complete',
    );
  } catch (error) {
    // Top-level catch: don't crash the worker, next tick will retry
    logger.error(
      { error: error instanceof Error ? error.message : String(error) },
      'Polling tick failed',
    );
  } finally {
    isProcessing = false;
  }
}

// ---------------------------------------------------------------------------
// Graceful shutdown
// ---------------------------------------------------------------------------
async function shutdown(signal: string): Promise<void> {
  if (isShuttingDown) {
    return; // Prevent double-shutdown
  }

  isShuttingDown = true;
  logger.info({ signal }, 'Shutdown signal received');

  // Stop polling
  if (pollTimer) {
    clearInterval(pollTimer);
    pollTimer = null;
  }

  // Wait for current batch to finish (up to 30s)
  if (isProcessing) {
    logger.info('Waiting for current batch to complete...');
    const start = Date.now();
    const SHUTDOWN_TIMEOUT_MS = 30_000;

    while (isProcessing && Date.now() - start < SHUTDOWN_TIMEOUT_MS) {
      await new Promise((resolve) => setTimeout(resolve, 250));
    }

    if (isProcessing) {
      logger.error('Shutdown timed out after 30s while processing batch');
      await closePool();
      process.exit(1);
    }
  }

  // Close database pool
  await closePool();
  logger.info('Graceful shutdown complete');
  process.exit(0);
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

// ---------------------------------------------------------------------------
// Start polling
// ---------------------------------------------------------------------------
// Run first tick immediately, then at interval
tick();
pollTimer = setInterval(tick, env.POLL_INTERVAL_MS);

logger.info(
  { intervalMs: env.POLL_INTERVAL_MS },
  'Polling loop started',
);
startNotificationScheduler();
