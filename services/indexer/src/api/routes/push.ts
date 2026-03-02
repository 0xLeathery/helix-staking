import type { FastifyInstance, FastifyPluginCallback } from 'fastify';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '../../db/client.js';
import { pushSubscriptions } from '../../db/schema.js';

// ---------------------------------------------------------------------------
// Zod schemas
// ---------------------------------------------------------------------------

const subscribeBodySchema = z.object({
  wallet: z.string().min(32).max(50),
  subscription: z.object({
    endpoint: z.string().url(),
    keys: z.object({
      p256dh: z.string().min(1),
      auth: z.string().min(1),
    }),
  }),
});

const unsubscribeBodySchema = z.object({
  endpoint: z.string().url(),
});

const preferencesBodySchema = z.object({
  endpoint: z.string().url(),
  preferences: z
    .object({
      notifyMaturity: z.boolean().optional(),
      notifyLatePenalty: z.boolean().optional(),
      notifyRewards: z.boolean().optional(),
      notifyBpd: z.boolean().optional(),
    })
    .refine(
      (p) =>
        p.notifyMaturity !== undefined ||
        p.notifyLatePenalty !== undefined ||
        p.notifyRewards !== undefined ||
        p.notifyBpd !== undefined,
      { message: 'At least one preference must be provided' },
    ),
});

const preferencesQuerySchema = z.object({
  endpoint: z.string().url(),
});

// ---------------------------------------------------------------------------
// Route plugin
// ---------------------------------------------------------------------------

export const pushRoutes: FastifyPluginCallback = (
  fastify: FastifyInstance,
  _opts,
  done,
) => {
  // POST /api/push/subscribe
  // Upserts a push subscription for a wallet
  fastify.post('/api/push/subscribe', async (request, reply) => {
    const { wallet, subscription } = subscribeBodySchema.parse(request.body);

    await db
      .insert(pushSubscriptions)
      .values({
        wallet,
        endpoint: subscription.endpoint,
        p256dh: subscription.keys.p256dh,
        auth: subscription.keys.auth,
      })
      .onConflictDoUpdate({
        target: pushSubscriptions.endpoint,
        set: {
          wallet,
          p256dh: subscription.keys.p256dh,
          auth: subscription.keys.auth,
          updatedAt: new Date(),
        },
      });

    return reply.status(201).send({ ok: true });
  });

  // DELETE /api/push/unsubscribe
  // Removes a push subscription by endpoint
  fastify.delete('/api/push/unsubscribe', async (request, reply) => {
    const { endpoint } = unsubscribeBodySchema.parse(request.body);

    await db
      .delete(pushSubscriptions)
      .where(eq(pushSubscriptions.endpoint, endpoint));

    return reply.status(200).send({ ok: true });
  });

  // PUT /api/push/preferences
  // Updates notification preference toggles for a subscription
  fastify.put('/api/push/preferences', async (request, reply) => {
    const { endpoint, preferences } = preferencesBodySchema.parse(request.body);

    const updateSet: Partial<typeof pushSubscriptions.$inferInsert> = {
      updatedAt: new Date(),
    };

    if (preferences.notifyMaturity !== undefined)
      updateSet.notifyMaturity = preferences.notifyMaturity;
    if (preferences.notifyLatePenalty !== undefined)
      updateSet.notifyLatePenalty = preferences.notifyLatePenalty;
    if (preferences.notifyRewards !== undefined)
      updateSet.notifyRewards = preferences.notifyRewards;
    if (preferences.notifyBpd !== undefined)
      updateSet.notifyBpd = preferences.notifyBpd;

    const result = await db
      .update(pushSubscriptions)
      .set(updateSet)
      .where(eq(pushSubscriptions.endpoint, endpoint))
      .returning({ id: pushSubscriptions.id });

    if (result.length === 0) {
      return reply.status(404).send({ error: 'Subscription not found' });
    }

    return reply.status(200).send({ ok: true });
  });

  // GET /api/push/preferences?endpoint=<endpoint>
  // Returns current notification preferences for a subscription
  fastify.get('/api/push/preferences', async (request, reply) => {
    const { endpoint } = preferencesQuerySchema.parse(request.query);

    const [sub] = await db
      .select({
        notifyMaturity: pushSubscriptions.notifyMaturity,
        notifyLatePenalty: pushSubscriptions.notifyLatePenalty,
        notifyRewards: pushSubscriptions.notifyRewards,
        notifyBpd: pushSubscriptions.notifyBpd,
      })
      .from(pushSubscriptions)
      .where(eq(pushSubscriptions.endpoint, endpoint));

    if (!sub) {
      return reply.status(404).send({ error: 'Subscription not found' });
    }

    return reply.status(200).send(sub);
  });

  done();
};
