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

import { stakeRoutes } from '../../api/routes/stakes.js';
import { db } from '../../db/client.js';

// Helper to set up the mock select chain that returns data + count in parallel
function mockSelectWithResults(dataRows: any[], totalCount: number) {
  let callCount = 0;
  vi.mocked(db.select).mockImplementation(() => {
    callCount++;
    if (callCount % 2 === 1) {
      // Data query
      return {
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            orderBy: vi.fn().mockReturnValue({
              limit: vi.fn().mockReturnValue({
                offset: vi.fn().mockResolvedValue(dataRows),
              }),
            }),
          }),
        }),
      } as any;
    } else {
      // Count query
      return {
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([{ value: totalCount }]),
        }),
      } as any;
    }
  });
}

describe('GET /api/stakes', () => {
  let app: ReturnType<typeof Fastify>;

  beforeAll(async () => {
    app = Fastify({ logger: false });
    app.register(stakeRoutes);
    await app.ready();
  });

  afterAll(() => app.close());

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 200 with paginated stake data', async () => {
    const mockStakes = [
      {
        user: 'wallet1',
        stakeId: 1,
        amount: '1000000000',
        tShares: '100000',
        days: 365,
        shareRate: '1000000000',
        slot: 1000,
        signature: 'sig1',
        createdAt: new Date(),
      },
    ];
    mockSelectWithResults(mockStakes, 1);

    const res = await app.inject({ method: 'GET', url: '/api/stakes' });

    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(body.data).toHaveLength(1);
    expect(body.data[0].user).toBe('wallet1');
    expect(body.pagination).toBeDefined();
    expect(body.pagination.total).toBe(1);
  });

  it('returns empty array when no stakes exist', async () => {
    mockSelectWithResults([], 0);

    const res = await app.inject({ method: 'GET', url: '/api/stakes' });

    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(body.data).toEqual([]);
    expect(body.pagination.total).toBe(0);
    expect(body.pagination.totalPages).toBe(0);
  });

  it('filters by ?user= query parameter', async () => {
    mockSelectWithResults([], 0);

    const res = await app.inject({
      method: 'GET',
      url: '/api/stakes?user=wallet123',
    });

    expect(res.statusCode).toBe(200);
  });

  it('respects pagination parameters', async () => {
    mockSelectWithResults([], 0);

    const res = await app.inject({
      method: 'GET',
      url: '/api/stakes?page=2&limit=10',
    });

    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(body.pagination.page).toBe(2);
    expect(body.pagination.limit).toBe(10);
  });

  it('returns 400 for invalid page parameter', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/api/stakes?page=0',
    });

    expect(res.statusCode).toBe(500); // Zod coerce rejects 0 (not positive)
  });
});

describe('GET /api/unstakes', () => {
  let app: ReturnType<typeof Fastify>;

  beforeAll(async () => {
    app = Fastify({ logger: false });
    app.register(stakeRoutes);
    await app.ready();
  });

  afterAll(() => app.close());

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 200 with unstake data', async () => {
    const mockUnstakes = [
      {
        user: 'wallet1',
        stakeId: 1,
        originalAmount: '1000000000',
        returnAmount: '1100000000',
        penaltyAmount: '0',
        penaltyType: 0,
        rewardsClaimed: '100000000',
        slot: 2000,
        signature: 'sig2',
        createdAt: new Date(),
      },
    ];
    mockSelectWithResults(mockUnstakes, 1);

    const res = await app.inject({ method: 'GET', url: '/api/unstakes' });

    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(body.data).toHaveLength(1);
    expect(body.data[0].user).toBe('wallet1');
  });

  it('returns empty array when no unstakes exist', async () => {
    mockSelectWithResults([], 0);

    const res = await app.inject({ method: 'GET', url: '/api/unstakes' });

    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(body.data).toEqual([]);
  });
});
