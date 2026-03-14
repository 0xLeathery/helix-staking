import type { FastifyInstance, FastifyPluginCallback } from 'fastify';
import { count, sum, eq } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '../../db/client.js';
import { referralStakedEvents } from '../../db/schema.js';
import { solanaAddress } from '../../lib/validation.js';

const referrerSchema = z.object({
  referrer: solanaAddress(),
});

export const referralRoutes: FastifyPluginCallback = (
  fastify: FastifyInstance,
  _opts,
  done,
) => {
  // GET /api/referrals?referrer=<pubkey>
  // Returns aggregate referral stats for a given referrer wallet
  fastify.get('/api/referrals', async (request, reply) => {
    const { referrer } = referrerSchema.parse(request.query);

    const [result] = await db
      .select({
        totalReferrals: count(),
        totalReferrerBonusTokens: sum(referralStakedEvents.referrerTokenBonus),
      })
      .from(referralStakedEvents)
      .where(eq(referralStakedEvents.referrer, referrer));

    return reply.send({
      referrer,
      totalReferrals: result?.totalReferrals ?? 0,
      totalReferrerBonusTokens: result?.totalReferrerBonusTokens ?? '0',
    });
  });

  done();
};
