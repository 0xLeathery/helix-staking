import type { FastifyInstance, FastifyPluginCallback } from 'fastify';
import { sql, desc } from 'drizzle-orm';
import { db } from '../../db/client.js';
import {
  checkpoints,
  bpdBatchFinalizedEvents,
  bigPayDayDistributedEvents,
  bpdAbortedEvents,
} from '../../db/schema.js';

/**
 * Phase 8.1 (L3/FR-012): Lightweight health check.
 *
 * Per contracts/indexer-api.yaml, the health endpoint must NOT create heavy
 * RPC clients. We only check DB connectivity and report the last indexed slot.
 * Slot lag calculation is deferred — callers can compare lastSlot against
 * their own RPC source if needed.
 */
export const healthRoutes: FastifyPluginCallback = (
  fastify: FastifyInstance,
  _opts,
  done,
) => {
  fastify.get('/health', async (_request, reply) => {
    // 1. Check database connectivity
    try {
      await db.execute(sql`SELECT 1`);
    } catch (dbError) {
      return reply.status(503).send({
        status: 'unhealthy',
        error:
          dbError instanceof Error
            ? dbError.message
            : 'Database unreachable',
      });
    }

    // 2. Get last indexed slot from checkpoints
    let lastSlot = 0;
    let processedCount = 0;
    try {
      const rows = await db
        .select({
          lastSlot: checkpoints.lastSlot,
          processedCount: checkpoints.processedCount,
        })
        .from(checkpoints)
        .orderBy(desc(checkpoints.updatedAt))
        .limit(1);

      if (rows.length > 0) {
        lastSlot = rows[0].lastSlot ?? 0;
        processedCount = rows[0].processedCount ?? 0;
      }
    } catch {
      // Checkpoint table may not exist yet; treat as slot 0
    }

    return reply.send({
      status: 'healthy',
      lastSlot,
      processedCount,
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    });
  });

  /**
   * OPS-08: BPD lifecycle health check.
   *
   * Uses indexed DB events to detect stalled BPD operations without
   * requiring an RPC client in the health endpoint (preserves L3/FR-012).
   *
   * Stall detection rules:
   * - If the latest BpdBatchFinalized event is > 1 hour old and no
   *   BigPayDayDistributed or BpdAborted event exists after it, the
   *   finalize phase may be stuck.
   * - If BigPayDayDistributed exists but bpdStakesDistributed <
   *   bpdStakesFinalized (from latest batch), distribution is in-progress.
   */
  fastify.get('/health/bpd', async (_request, reply) => {
    // Last BPD finalize batch
    const latestBatch = await db
      .select()
      .from(bpdBatchFinalizedEvents)
      .orderBy(desc(bpdBatchFinalizedEvents.slot))
      .limit(1);

    if (latestBatch.length === 0) {
      // No finalize activity yet
      return reply.send({
        bpdActive: false,
        health: 'ok',
        message: 'No BPD finalize activity recorded',
      });
    }

    const batch = latestBatch[0];
    const stakesFinalized = batch.totalStakesFinalized;
    const claimPeriodId = batch.claimPeriodId;
    const batchSlot = batch.slot;

    // Check if distribution has started for this claim period
    const latestDistribution = await db
      .select()
      .from(bigPayDayDistributedEvents)
      .orderBy(desc(bigPayDayDistributedEvents.slot))
      .limit(1);

    const distributionEvent =
      latestDistribution.length > 0 &&
      latestDistribution[0].claimPeriodId === claimPeriodId
        ? latestDistribution[0]
        : null;

    const stakesDistributed = distributionEvent
      ? distributionEvent.eligibleStakers
      : 0;

    // Check if BPD was aborted for this period
    const latestAbort = await db
      .select()
      .from(bpdAbortedEvents)
      .orderBy(desc(bpdAbortedEvents.slot))
      .limit(1);

    const aborted =
      latestAbort.length > 0 &&
      latestAbort[0].claimPeriodId === claimPeriodId;

    if (aborted) {
      return reply.send({
        bpdActive: false,
        claimPeriodId,
        stakesFinalized,
        stakesDistributed,
        health: 'ok',
        message: 'BPD aborted for this period',
      });
    }

    // Determine stall: finalize batch > 1 hour ago with no distribution completion
    const ONE_HOUR_MS = 60 * 60 * 1000;
    const batchAge = Date.now() - (batchSlot * 400); // approximate: 400ms/slot
    const distributionComplete = stakesDistributed >= stakesFinalized;

    let health: 'ok' | 'in_progress' | 'stalled';
    let message: string;

    if (distributionComplete) {
      health = 'ok';
      message = 'BPD distribution complete';
    } else if (!distributionComplete && batchAge > ONE_HOUR_MS) {
      health = 'stalled';
      message = `BPD finalize batch ${stakesFinalized - stakesDistributed} stakes pending distribution for over 1 hour`;
    } else {
      health = 'in_progress';
      message = `BPD distribution in progress: ${stakesDistributed}/${stakesFinalized} stakes distributed`;
    }

    return reply.send({
      bpdActive: !distributionComplete && !aborted,
      claimPeriodId,
      stakesFinalized,
      stakesDistributed,
      remaining: stakesFinalized - stakesDistributed,
      batchSlot,
      health,
      message,
    });
  });

  done();
};
