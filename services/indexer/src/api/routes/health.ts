import type { FastifyInstance, FastifyPluginCallback } from 'fastify';
import { sql } from 'drizzle-orm';
import { db } from '../../db/client.js';
import { checkpoints } from '../../db/schema.js';
import { createRpcClient } from '../../lib/rpc.js';
import { env } from '../../lib/env.js';
import { desc } from 'drizzle-orm';

const LAG_THRESHOLD = 1000; // ~7 minutes of slots

export const healthRoutes: FastifyPluginCallback = (
  fastify: FastifyInstance,
  _opts,
  done,
) => {
  const rpc = createRpcClient(env.RPC_URL);

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
    try {
      const rows = await db
        .select({ lastSlot: checkpoints.lastSlot })
        .from(checkpoints)
        .orderBy(desc(checkpoints.updatedAt))
        .limit(1);

      if (rows.length > 0 && rows[0].lastSlot !== null) {
        lastSlot = rows[0].lastSlot;
      }
    } catch {
      // Checkpoint table may not exist yet; treat as slot 0
    }

    // 3. Get current finalized slot from RPC
    let currentSlot = 0;
    try {
      currentSlot = await rpc.getSlot('finalized');
    } catch {
      // RPC may be down; report with what we have
    }

    // 4. Calculate lag
    const lag = currentSlot - lastSlot;

    if (lag > LAG_THRESHOLD) {
      return reply.status(503).send({
        status: 'degraded',
        lag,
        lastSlot,
        currentSlot,
        message: 'Indexer behind',
      });
    }

    return reply.send({
      status: 'healthy',
      lag,
      lastSlot,
      currentSlot,
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    });
  });

  done();
};
