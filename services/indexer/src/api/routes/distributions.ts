import type { FastifyInstance, FastifyPluginCallback } from 'fastify';
import { count, desc, asc } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '../../db/client.js';
import { inflationDistributedEvents } from '../../db/schema.js';

const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(200).default(50),
});

export const distributionRoutes: FastifyPluginCallback = (
  fastify: FastifyInstance,
  _opts,
  done,
) => {
  // GET /api/distributions - paginated distribution history (newest first)
  fastify.get('/api/distributions', async (request, reply) => {
    const { page, limit } = paginationSchema.parse(request.query);
    const offset = (page - 1) * limit;

    const [data, totalResult] = await Promise.all([
      db
        .select({
          day: inflationDistributedEvents.day,
          daysElapsed: inflationDistributedEvents.daysElapsed,
          amount: inflationDistributedEvents.amount,
          newShareRate: inflationDistributedEvents.newShareRate,
          totalShares: inflationDistributedEvents.totalShares,
          slot: inflationDistributedEvents.slot,
          signature: inflationDistributedEvents.signature,
          createdAt: inflationDistributedEvents.createdAt,
        })
        .from(inflationDistributedEvents)
        .orderBy(desc(inflationDistributedEvents.day))
        .limit(limit)
        .offset(offset),
      db.select({ value: count() }).from(inflationDistributedEvents),
    ]);

    const total = totalResult[0].value;

    return reply.send({
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  });

  // GET /api/distributions/chart - all distributions optimized for charting (oldest first)
  fastify.get('/api/distributions/chart', async (_request, reply) => {
    const data = await db
      .select({
        day: inflationDistributedEvents.day,
        newShareRate: inflationDistributedEvents.newShareRate,
        amount: inflationDistributedEvents.amount,
        totalShares: inflationDistributedEvents.totalShares,
      })
      .from(inflationDistributedEvents)
      .orderBy(asc(inflationDistributedEvents.day));

    return reply.send({ data });
  });

  done();
};
