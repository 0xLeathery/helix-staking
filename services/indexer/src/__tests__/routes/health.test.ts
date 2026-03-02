import { describe, it, expect, vi, beforeAll, afterAll, beforeEach } from 'vitest';
import Fastify from 'fastify';

// Mock db client before importing routes
vi.mock('../../db/client.js', () => ({
  db: {
    execute: vi.fn().mockResolvedValue(undefined),
    select: vi.fn(),
  },
}));

// Mock logger
vi.mock('../../lib/logger.js', () => ({
  logger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  },
}));

import { healthRoutes } from '../../api/routes/health.js';
import { db } from '../../db/client.js';

describe('GET /health', () => {
  let app: ReturnType<typeof Fastify>;

  beforeAll(async () => {
    app = Fastify({ logger: false });
    app.register(healthRoutes);
    await app.ready();
  });

  afterAll(() => app.close());

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 200 with healthy status when db is reachable', async () => {
    vi.mocked(db.execute).mockResolvedValue(undefined as any);
    vi.mocked(db.select).mockReturnValue({
      from: vi.fn().mockReturnValue({
        orderBy: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue([
            { lastSlot: 12345, processedCount: 100 },
          ]),
        }),
      }),
    } as any);

    const res = await app.inject({ method: 'GET', url: '/health' });

    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(body.status).toBe('healthy');
    expect(body.lastSlot).toBe(12345);
    expect(body.processedCount).toBe(100);
    expect(body.uptime).toBeDefined();
    expect(body.timestamp).toBeDefined();
  });

  it('returns 503 when database is unreachable', async () => {
    vi.mocked(db.execute).mockRejectedValue(new Error('ECONNREFUSED'));

    const res = await app.inject({ method: 'GET', url: '/health' });

    expect(res.statusCode).toBe(503);
    const body = JSON.parse(res.body);
    expect(body.status).toBe('unhealthy');
    expect(body.error).toBe('ECONNREFUSED');
  });

  it('returns lastSlot=0 when no checkpoint exists', async () => {
    vi.mocked(db.execute).mockResolvedValue(undefined as any);
    vi.mocked(db.select).mockReturnValue({
      from: vi.fn().mockReturnValue({
        orderBy: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue([]),
        }),
      }),
    } as any);

    const res = await app.inject({ method: 'GET', url: '/health' });

    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(body.lastSlot).toBe(0);
    expect(body.processedCount).toBe(0);
  });
});

describe('GET /health/bpd', () => {
  let app: ReturnType<typeof Fastify>;

  beforeAll(async () => {
    app = Fastify({ logger: false });
    app.register(healthRoutes);
    await app.ready();
  });

  afterAll(() => app.close());

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns bpdActive=false when no BPD finalize activity', async () => {
    vi.mocked(db.select).mockReturnValue({
      from: vi.fn().mockReturnValue({
        orderBy: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue([]),
        }),
      }),
    } as any);

    const res = await app.inject({ method: 'GET', url: '/health/bpd' });

    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(body.bpdActive).toBe(false);
    expect(body.health).toBe('ok');
  });

  it('returns health=ok when BPD distribution is complete', async () => {
    let callCount = 0;
    vi.mocked(db.select).mockImplementation(() => {
      callCount++;
      if (callCount === 1) {
        // bpdBatchFinalizedEvents
        return {
          from: vi.fn().mockReturnValue({
            orderBy: vi.fn().mockReturnValue({
              limit: vi.fn().mockResolvedValue([{
                totalStakesFinalized: 10,
                claimPeriodId: 1,
                slot: 500000,
                createdAt: new Date(),
              }]),
            }),
          }),
        } as any;
      } else if (callCount === 2) {
        // bigPayDayDistributedEvents
        return {
          from: vi.fn().mockReturnValue({
            orderBy: vi.fn().mockReturnValue({
              limit: vi.fn().mockResolvedValue([{
                claimPeriodId: 1,
                eligibleStakers: 10,
                slot: 500100,
              }]),
            }),
          }),
        } as any;
      } else {
        // bpdAbortedEvents
        return {
          from: vi.fn().mockReturnValue({
            orderBy: vi.fn().mockReturnValue({
              limit: vi.fn().mockResolvedValue([]),
            }),
          }),
        } as any;
      }
    });

    const res = await app.inject({ method: 'GET', url: '/health/bpd' });

    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(body.health).toBe('ok');
    expect(body.message).toBe('BPD distribution complete');
  });
});
