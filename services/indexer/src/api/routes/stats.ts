import type { FastifyInstance, FastifyPluginCallback } from 'fastify';
import { count, desc, sql } from 'drizzle-orm';
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

  fastify.get('/api/stats/history', async (request, reply) => {
    // Phase 8.1 (M5/FR-010): Enforce strict bounds per contracts/indexer-api.yaml
    const raw = (request.query as { limit?: string }).limit;
    const parsed = raw ? parseInt(raw, 10) : 20;
    const limit = Math.min(100, Math.max(1, Number.isNaN(parsed) ? 20 : parsed));

    const history = await db
      .select({
        day: inflationDistributedEvents.day,
        shareRate: inflationDistributedEvents.newShareRate,
        totalShares: inflationDistributedEvents.totalShares,
        amount: inflationDistributedEvents.amount,
      })
      .from(inflationDistributedEvents)
      .orderBy(desc(inflationDistributedEvents.day))
      .limit(limit);

    return reply.send(history.reverse());
  });

  fastify.get('/api/stats/distribution/stakes', async (_request, reply) => {
    const distribution = await db
      .select({
        bucket: sql<string>`
          CASE 
            WHEN ${stakeCreatedEvents.days} < 30 THEN '< 30 days'
            WHEN ${stakeCreatedEvents.days} BETWEEN 30 AND 89 THEN '30-90 days'
            WHEN ${stakeCreatedEvents.days} BETWEEN 90 AND 179 THEN '90-180 days'
            WHEN ${stakeCreatedEvents.days} BETWEEN 180 AND 364 THEN '180-365 days'
            WHEN ${stakeCreatedEvents.days} BETWEEN 365 AND 729 THEN '1-2 years'
            ELSE '> 2 years'
          END
        `.as('bucket'),
        count: count(),
        totalAmount: sql<string>`SUM(${stakeCreatedEvents.amount}::numeric)`.as(
          'total_amount',
        ),
      })
      .from(stakeCreatedEvents)
      .groupBy(sql`bucket`);

    return reply.send(distribution);
  });

  done();
};
