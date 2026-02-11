import type { FastifyInstance, FastifyPluginCallback, FastifyReply, FastifyRequest } from 'fastify';
import { logger } from '../../lib/logger.js';

/**
 * Phase 8.1 (M5/FR-010/SC-004): Simple in-memory sliding window rate limiter.
 *
 * Uses a per-IP counter with a 1-second sliding window.
 * Returns 429 Too Many Requests when the limit is exceeded.
 *
 * NOTE: For multi-instance deployments, replace with Redis-backed rate limiting.
 */

interface RateLimitConfig {
  /** Maximum requests per window per IP. Default: 100 */
  maxRequests?: number;
  /** Window size in milliseconds. Default: 1000 (1 second) */
  windowMs?: number;
}

interface WindowEntry {
  count: number;
  resetAt: number;
}

const DEFAULT_MAX_REQUESTS = 100;
const DEFAULT_WINDOW_MS = 1_000;

/** In-memory store keyed by IP */
const windows = new Map<string, WindowEntry>();

/** Periodic cleanup of expired entries (every 60 seconds) */
let cleanupTimer: ReturnType<typeof setInterval> | null = null;

function startCleanup(): void {
  if (cleanupTimer) return;
  cleanupTimer = setInterval(() => {
    const now = Date.now();
    for (const [ip, entry] of windows) {
      if (entry.resetAt <= now) {
        windows.delete(ip);
      }
    }
  }, 60_000);
  // Don't block process exit
  cleanupTimer.unref();
}

/**
 * Register the rate-limit middleware as a Fastify plugin.
 *
 * Usage:
 * ```ts
 * await fastify.register(rateLimitPlugin, { maxRequests: 100, windowMs: 1000 });
 * ```
 */
export const rateLimitPlugin: FastifyPluginCallback<RateLimitConfig> = (
  fastify: FastifyInstance,
  opts: RateLimitConfig,
  done,
) => {
  const maxRequests = opts.maxRequests ?? DEFAULT_MAX_REQUESTS;
  const windowMs = opts.windowMs ?? DEFAULT_WINDOW_MS;

  startCleanup();

  fastify.addHook('onRequest', async (request: FastifyRequest, reply: FastifyReply) => {
    const ip = request.ip;
    const now = Date.now();

    let entry = windows.get(ip);

    if (!entry || entry.resetAt <= now) {
      // New window
      entry = { count: 1, resetAt: now + windowMs };
      windows.set(ip, entry);
    } else {
      entry.count++;
    }

    // Set rate-limit headers
    const remaining = Math.max(0, maxRequests - entry.count);
    reply.header('X-RateLimit-Limit', maxRequests);
    reply.header('X-RateLimit-Remaining', remaining);
    reply.header('X-RateLimit-Reset', Math.ceil(entry.resetAt / 1000));

    if (entry.count > maxRequests) {
      logger.warn({ ip, count: entry.count, limit: maxRequests }, 'Rate limit exceeded');
      return reply.status(429).send({
        error: 'Too Many Requests',
        message: `Rate limit of ${maxRequests} requests per second exceeded`,
        retryAfter: Math.ceil((entry.resetAt - now) / 1000),
      });
    }
  });

  done();
};
