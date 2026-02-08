import type { FastifyInstance, FastifyPluginCallback } from 'fastify';
import { count, desc, eq, type SQL } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '../../db/client.js';
import {
  tokensClaimedEvents,
  rewardsClaimedEvents,
  bigPayDayDistributedEvents,
} from '../../db/schema.js';

const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(200).default(50),
});

export const claimRoutes: FastifyPluginCallback = (
  fastify: FastifyInstance,
  _opts,
  done,
) => {
  // GET /api/claims/tokens - paginated token claim events
  fastify.get('/api/claims/tokens', async (request, reply) => {
    const { page, limit } = paginationSchema.parse(request.query);
    const { claimer } = z
      .object({ claimer: z.string().optional() })
      .parse(request.query);
    const offset = (page - 1) * limit;

    const where: SQL | undefined = claimer
      ? eq(tokensClaimedEvents.claimer, claimer)
      : undefined;

    const [data, totalResult] = await Promise.all([
      db
        .select({
          claimer: tokensClaimedEvents.claimer,
          snapshotWallet: tokensClaimedEvents.snapshotWallet,
          claimPeriodId: tokensClaimedEvents.claimPeriodId,
          snapshotBalance: tokensClaimedEvents.snapshotBalance,
          baseAmount: tokensClaimedEvents.baseAmount,
          bonusBps: tokensClaimedEvents.bonusBps,
          totalAmount: tokensClaimedEvents.totalAmount,
          immediateAmount: tokensClaimedEvents.immediateAmount,
          vestingAmount: tokensClaimedEvents.vestingAmount,
          slot: tokensClaimedEvents.slot,
          signature: tokensClaimedEvents.signature,
          createdAt: tokensClaimedEvents.createdAt,
        })
        .from(tokensClaimedEvents)
        .where(where)
        .orderBy(desc(tokensClaimedEvents.slot))
        .limit(limit)
        .offset(offset),
      db
        .select({ value: count() })
        .from(tokensClaimedEvents)
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

  // GET /api/claims/rewards - paginated reward claim events
  fastify.get('/api/claims/rewards', async (request, reply) => {
    const { page, limit } = paginationSchema.parse(request.query);
    const { user } = z
      .object({ user: z.string().optional() })
      .parse(request.query);
    const offset = (page - 1) * limit;

    const where: SQL | undefined = user
      ? eq(rewardsClaimedEvents.user, user)
      : undefined;

    const [data, totalResult] = await Promise.all([
      db
        .select({
          user: rewardsClaimedEvents.user,
          stakeId: rewardsClaimedEvents.stakeId,
          amount: rewardsClaimedEvents.amount,
          slot: rewardsClaimedEvents.slot,
          signature: rewardsClaimedEvents.signature,
          createdAt: rewardsClaimedEvents.createdAt,
        })
        .from(rewardsClaimedEvents)
        .where(where)
        .orderBy(desc(rewardsClaimedEvents.slot))
        .limit(limit)
        .offset(offset),
      db
        .select({ value: count() })
        .from(rewardsClaimedEvents)
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

  // GET /api/claims/bpd - paginated BPD distribution events (global, no user filter)
  fastify.get('/api/claims/bpd', async (request, reply) => {
    const { page, limit } = paginationSchema.parse(request.query);
    const offset = (page - 1) * limit;

    const [data, totalResult] = await Promise.all([
      db
        .select({
          claimPeriodId: bigPayDayDistributedEvents.claimPeriodId,
          totalUnclaimed: bigPayDayDistributedEvents.totalUnclaimed,
          totalEligibleShareDays:
            bigPayDayDistributedEvents.totalEligibleShareDays,
          helixPerShareDay: bigPayDayDistributedEvents.helixPerShareDay,
          eligibleStakers: bigPayDayDistributedEvents.eligibleStakers,
          slot: bigPayDayDistributedEvents.slot,
          signature: bigPayDayDistributedEvents.signature,
          createdAt: bigPayDayDistributedEvents.createdAt,
        })
        .from(bigPayDayDistributedEvents)
        .orderBy(desc(bigPayDayDistributedEvents.slot))
        .limit(limit)
        .offset(offset),
      db.select({ value: count() }).from(bigPayDayDistributedEvents),
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
