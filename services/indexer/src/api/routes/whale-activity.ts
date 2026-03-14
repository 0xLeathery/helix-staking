import type { FastifyInstance, FastifyPluginCallback } from 'fastify';
import { sql } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '../../db/client.js';

const querySchema = z.object({
  limit: z.coerce.number().int().positive().max(100).default(50),
  minAmount: z.string().default('10000000000'), // 100 HELIX (8 decimals: 100 * 10^8)
});

export const whaleActivityRoutes: FastifyPluginCallback = (
  fastify: FastifyInstance,
  _opts,
  done,
) => {
  // GET /api/whale-activity - large stake movements feed
  fastify.get('/api/whale-activity', async (request, reply) => {
    const { limit, minAmount } = querySchema.parse(request.query);

    const result = await db.execute(sql`
      SELECT 'stake' as type, user, stake_id, amount, t_shares, days, slot, signature, created_at
      FROM stake_created_events
      WHERE amount::numeric >= ${minAmount}::numeric
      UNION ALL
      SELECT 'unstake' as type, user, stake_id, original_amount as amount, NULL as t_shares, NULL as days, slot, signature, created_at
      FROM stake_ended_events
      WHERE original_amount::numeric >= ${minAmount}::numeric
      ORDER BY slot DESC
      LIMIT ${limit}
    `);

    return reply.send({ data: result.rows });
  });

  done();
};
