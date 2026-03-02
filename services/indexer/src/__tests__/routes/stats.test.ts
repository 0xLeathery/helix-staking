import { describe, it, expect, vi, beforeAll, afterAll, beforeEach } from 'vitest';
import Fastify from 'fastify';

vi.mock('../../db/client.js', () => ({
  db: {
    select: vi.fn(),
  },
}));

vi.mock('../../lib/logger.js', () => ({
  logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() },
}));

import { statsRoutes } from '../../api/routes/stats.js';
import { db } from '../../db/client.js';

describe('GET /api/stats', () => {
  let app: ReturnType<typeof Fastify>;

  beforeAll(async () => {
    app = Fastify({ logger: false });
    app.register(statsRoutes);
    await app.ready();
  });

  afterAll(() => app.close());

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 200 with aggregate stats', async () => {
    let callCount = 0;
    vi.mocked(db.select).mockImplementation(() => {
      callCount++;
      if (callCount <= 5) {
        // Count queries: stakeCreated, stakeEnded, inflationDistributed, rewardsClaimed, tokensClaimed
        return {
          from: vi.fn().mockResolvedValue([{ value: callCount * 10 }]),
        } as any;
      } else {
        // Latest distribution query
        return {
          from: vi.fn().mockReturnValue({
            orderBy: vi.fn().mockReturnValue({
              limit: vi.fn().mockResolvedValue([{
                day: 5,
                newShareRate: '1100000000',
                totalShares: '5000000',
                amount: '100000',
              }]),
            }),
          }),
        } as any;
      }
    });

    const res = await app.inject({ method: 'GET', url: '/api/stats' });

    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(body.totalStakes).toBeDefined();
    expect(body.totalUnstakes).toBeDefined();
    expect(body.totalDistributions).toBeDefined();
    expect(body.currentDay).toBe(5);
    expect(body.currentShareRate).toBe('1100000000');
    expect(body.lastUpdated).toBeDefined();
  });

  it('handles empty database gracefully (null for distribution fields)', async () => {
    let callCount = 0;
    vi.mocked(db.select).mockImplementation(() => {
      callCount++;
      if (callCount <= 5) {
        return {
          from: vi.fn().mockResolvedValue([{ value: 0 }]),
        } as any;
      } else {
        // No distributions yet
        return {
          from: vi.fn().mockReturnValue({
            orderBy: vi.fn().mockReturnValue({
              limit: vi.fn().mockResolvedValue([]),
            }),
          }),
        } as any;
      }
    });

    const res = await app.inject({ method: 'GET', url: '/api/stats' });

    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(body.currentDay).toBeNull();
    expect(body.currentShareRate).toBeNull();
    expect(body.totalShares).toBeNull();
    expect(body.totalStakes).toBe(0);
  });
});

describe('GET /api/stats/history', () => {
  let app: ReturnType<typeof Fastify>;

  beforeAll(async () => {
    app = Fastify({ logger: false });
    app.register(statsRoutes);
    await app.ready();
  });

  afterAll(() => app.close());

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns distribution history (newest to oldest reversed to oldest to newest)', async () => {
    vi.mocked(db.select).mockReturnValue({
      from: vi.fn().mockReturnValue({
        orderBy: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue([
            { day: 5, shareRate: '1100000000', totalShares: '5000000', amount: '100000' },
            { day: 4, shareRate: '1090000000', totalShares: '4900000', amount: '99000' },
          ]),
        }),
      }),
    } as any);

    const res = await app.inject({ method: 'GET', url: '/api/stats/history' });

    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    // reversed() so day 4 comes first (oldest first order)
    expect(body[0].day).toBe(4);
    expect(body[1].day).toBe(5);
  });

  it('respects ?limit= parameter', async () => {
    vi.mocked(db.select).mockReturnValue({
      from: vi.fn().mockReturnValue({
        orderBy: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue([]),
        }),
      }),
    } as any);

    const res = await app.inject({
      method: 'GET',
      url: '/api/stats/history?limit=5',
    });

    expect(res.statusCode).toBe(200);
  });

  it('returns empty array when no history', async () => {
    vi.mocked(db.select).mockReturnValue({
      from: vi.fn().mockReturnValue({
        orderBy: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue([]),
        }),
      }),
    } as any);

    const res = await app.inject({ method: 'GET', url: '/api/stats/history' });

    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(body).toEqual([]);
  });
});

describe('GET /api/stats/distribution/stakes', () => {
  let app: ReturnType<typeof Fastify>;

  beforeAll(async () => {
    app = Fastify({ logger: false });
    app.register(statsRoutes);
    await app.ready();
  });

  afterAll(() => app.close());

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns duration bucket distribution', async () => {
    vi.mocked(db.select).mockReturnValue({
      from: vi.fn().mockReturnValue({
        groupBy: vi.fn().mockResolvedValue([
          { bucket: '< 30 days', count: 5, totalAmount: '5000000000' },
          { bucket: '1-2 years', count: 2, totalAmount: '200000000000' },
        ]),
      }),
    } as any);

    const res = await app.inject({
      method: 'GET',
      url: '/api/stats/distribution/stakes',
    });

    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(body).toHaveLength(2);
  });

  it('returns empty distribution when no stakes', async () => {
    vi.mocked(db.select).mockReturnValue({
      from: vi.fn().mockReturnValue({
        groupBy: vi.fn().mockResolvedValue([]),
      }),
    } as any);

    const res = await app.inject({
      method: 'GET',
      url: '/api/stats/distribution/stakes',
    });

    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(body).toEqual([]);
  });
});
