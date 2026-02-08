import type { FastifyInstance, FastifyPluginCallback } from 'fastify';
import { count, desc, eq, type SQL } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '../../db/client.js';
import { stakeCreatedEvents, stakeEndedEvents } from '../../db/schema.js';

const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(200).default(50),
});

const userFilterSchema = z.object({
  user: z.string().optional(),
});

export const stakeRoutes: FastifyPluginCallback = (
  fastify: FastifyInstance,
  _opts,
  done,
) => {
  // GET /api/stakes - paginated stake creation events (newest first)
  fastify.get('/api/stakes', async (request, reply) => {
    const { page, limit } = paginationSchema.parse(request.query);
    const { user } = userFilterSchema.parse(request.query);
    const offset = (page - 1) * limit;

    const where: SQL | undefined = user
      ? eq(stakeCreatedEvents.user, user)
      : undefined;

    const [data, totalResult] = await Promise.all([
      db
        .select({
          user: stakeCreatedEvents.user,
          stakeId: stakeCreatedEvents.stakeId,
          amount: stakeCreatedEvents.amount,
          tShares: stakeCreatedEvents.tShares,
          days: stakeCreatedEvents.days,
          shareRate: stakeCreatedEvents.shareRate,
          slot: stakeCreatedEvents.slot,
          signature: stakeCreatedEvents.signature,
          createdAt: stakeCreatedEvents.createdAt,
        })
        .from(stakeCreatedEvents)
        .where(where)
        .orderBy(desc(stakeCreatedEvents.slot))
        .limit(limit)
        .offset(offset),
      db
        .select({ value: count() })
        .from(stakeCreatedEvents)
        .where(where),
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

  // GET /api/unstakes - paginated stake ended events (newest first)
  fastify.get('/api/unstakes', async (request, reply) => {
    const { page, limit } = paginationSchema.parse(request.query);
    const { user } = userFilterSchema.parse(request.query);
    const offset = (page - 1) * limit;

    const where: SQL | undefined = user
      ? eq(stakeEndedEvents.user, user)
      : undefined;

    const [data, totalResult] = await Promise.all([
      db
        .select({
          user: stakeEndedEvents.user,
          stakeId: stakeEndedEvents.stakeId,
          originalAmount: stakeEndedEvents.originalAmount,
          returnAmount: stakeEndedEvents.returnAmount,
          penaltyAmount: stakeEndedEvents.penaltyAmount,
          penaltyType: stakeEndedEvents.penaltyType,
          rewardsClaimed: stakeEndedEvents.rewardsClaimed,
          slot: stakeEndedEvents.slot,
          signature: stakeEndedEvents.signature,
          createdAt: stakeEndedEvents.createdAt,
        })
        .from(stakeEndedEvents)
        .where(where)
        .orderBy(desc(stakeEndedEvents.slot))
        .limit(limit)
        .offset(offset),
      db
        .select({ value: count() })
        .from(stakeEndedEvents)
        .where(where),
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

  done();
};
