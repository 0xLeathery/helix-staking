import type { FastifyInstance, FastifyPluginCallback } from 'fastify';
import { sql } from 'drizzle-orm';
import { db } from '../../db/client.js';
import { checkpoints } from '../../db/schema.js';
import { desc } from 'drizzle-orm';

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

  done();
};
