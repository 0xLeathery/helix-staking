import Fastify, { type FastifyError } from 'fastify';
import cors from '@fastify/cors';
import { env } from '../lib/env.js';
import { logger } from '../lib/logger.js';
import { closePool } from '../db/client.js';
import { rateLimitPlugin } from './middleware/rate-limit.js';
import { healthRoutes } from './routes/health.js';
import { statsRoutes } from './routes/stats.js';
import { distributionRoutes } from './routes/distributions.js';
import { stakeRoutes } from './routes/stakes.js';
import { claimRoutes } from './routes/claims.js';
import { leaderboardRoutes } from './routes/leaderboard.js';
import { whaleActivityRoutes } from './routes/whale-activity.js';
import { referralRoutes } from './routes/referrals.js';
import { badgeRoutes } from './routes/badges.js';

const fastify = Fastify({ logger: false });

// ---------------------------------------------------------------------------
// CORS
// ---------------------------------------------------------------------------
await fastify.register(cors, {
  origin: env.FRONTEND_URL,
  credentials: true,
});

// ---------------------------------------------------------------------------
// Phase 8.1 (M5/FR-010/SC-004): Rate limiting — 100 req/s per IP
// ---------------------------------------------------------------------------
await fastify.register(rateLimitPlugin, { maxRequests: 100, windowMs: 1_000 });

// ---------------------------------------------------------------------------
// Route plugins
// ---------------------------------------------------------------------------
await fastify.register(healthRoutes);
await fastify.register(statsRoutes);
await fastify.register(distributionRoutes);
await fastify.register(stakeRoutes);
await fastify.register(claimRoutes);
await fastify.register(leaderboardRoutes);
await fastify.register(whaleActivityRoutes);
await fastify.register(referralRoutes);
await fastify.register(badgeRoutes);

// ---------------------------------------------------------------------------
// Global error handler
// ---------------------------------------------------------------------------
fastify.setErrorHandler((error: FastifyError, request, reply) => {
  logger.error({ error: error.message, url: request.url }, 'Request error');
  const statusCode = error.statusCode ?? 500;
  reply.status(statusCode).send({
    error: error.name || 'Internal Server Error',
    message: error.message,
    statusCode,
  });
});

// ---------------------------------------------------------------------------
// Graceful shutdown
// ---------------------------------------------------------------------------
async function shutdown(signal: string) {
  logger.info({ signal }, 'Received signal, shutting down...');
  await fastify.close();
  await closePool();
  process.exit(0);
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

// ---------------------------------------------------------------------------
// Start
// ---------------------------------------------------------------------------
try {
  await fastify.listen({ port: env.PORT, host: '0.0.0.0' });
  logger.info(
    {
      port: env.PORT,
      environment: process.env.NODE_ENV || 'development',
      frontendUrl: env.FRONTEND_URL,
    },
    `Indexer API started on port ${env.PORT}`,
  );
} catch (err) {
  logger.fatal({ err }, 'Failed to start API server');
  process.exit(1);
}
