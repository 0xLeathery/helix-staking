import type { FastifyInstance, FastifyPluginCallback } from 'fastify';
import { count, desc } from 'drizzle-orm';
import { db } from '../../db/client.js';
import {
  stakeCreatedEvents,
  stakeEndedEvents,
  inflationDistributedEvents,
  rewardsClaimedEvents,
  tokensClaimedEvents,
} from '../../db/schema.js';

export const statsRoutes: FastifyPluginCallback = (
  fastify: FastifyInstance,
  _opts,
  done,
) => {
  fastify.get('/api/stats', async (_request, reply) => {
    // Run all count queries in parallel
    const [
      stakeCountResult,
      unstakeCountResult,
      distributionCountResult,
      rewardsClaimedCountResult,
      tokensClaimedCountResult,
      latestDistributionResult,
    ] = await Promise.all([
      db.select({ value: count() }).from(stakeCreatedEvents),
      db.select({ value: count() }).from(stakeEndedEvents),
      db.select({ value: count() }).from(inflationDistributedEvents),
      db.select({ value: count() }).from(rewardsClaimedEvents),
      db.select({ value: count() }).from(tokensClaimedEvents),
      db
        .select({
          day: inflationDistributedEvents.day,
          newShareRate: inflationDistributedEvents.newShareRate,
          totalShares: inflationDistributedEvents.totalShares,
          amount: inflationDistributedEvents.amount,
        })
        .from(inflationDistributedEvents)
        .orderBy(desc(inflationDistributedEvents.day))
        .limit(1),
    ]);

    const latest =
      latestDistributionResult.length > 0 ? latestDistributionResult[0] : null;

    return reply.send({
      totalStakes: stakeCountResult[0].value,
      totalUnstakes: unstakeCountResult[0].value,
      totalDistributions: distributionCountResult[0].value,
      totalRewardsClaimed: rewardsClaimedCountResult[0].value,
      totalTokensClaimed: tokensClaimedCountResult[0].value,
      currentDay: latest?.day ?? null,
      currentShareRate: latest?.newShareRate ?? null,
      totalShares: latest?.totalShares ?? null,
      lastDistributionAmount: latest?.amount ?? null,
      lastUpdated: new Date().toISOString(),
    });
  });

  done();
};
