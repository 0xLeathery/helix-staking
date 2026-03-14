import type { FastifyInstance, FastifyPluginCallback } from 'fastify';
import { z } from 'zod';
import { computeBadgeEligibility } from '../../lib/badge-eligibility.js';
import { solanaAddress } from '../../lib/validation.js';

const walletSchema = z.object({
  wallet: solanaAddress(),
});

export const badgeRoutes: FastifyPluginCallback = (
  fastify: FastifyInstance,
  _opts,
  done,
) => {
  // GET /api/badges?wallet=<pubkey>
  // Returns badge eligibility for all badge types for the given wallet
  fastify.get('/api/badges', async (request, reply) => {
    const { wallet } = walletSchema.parse(request.query);
    const eligibility = await computeBadgeEligibility(wallet);
    return reply.send({ wallet, badges: eligibility });
  });

  done();
};
