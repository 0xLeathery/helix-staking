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

import { distributionRoutes } from '../../api/routes/distributions.js';
import { db } from '../../db/client.js';

describe('GET /api/distributions', () => {
  let app: ReturnType<typeof Fastify>;

  beforeAll(async () => {
    app = Fastify({ logger: false });
    app.register(distributionRoutes);
    await app.ready();
  });

  afterAll(() => app.close());

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 200 with paginated distributions', async () => {
    let callCount = 0;
    vi.mocked(db.select).mockImplementation(() => {
      callCount++;
      if (callCount === 1) {
        return {
          from: vi.fn().mockReturnValue({
            orderBy: vi.fn().mockReturnValue({
              limit: vi.fn().mockReturnValue({
                offset: vi.fn().mockResolvedValue([
                  {
                    day: 5,
                    daysElapsed: 1,
                    amount: '1000000',
                    newShareRate: '1100000000',
                    totalShares: '5000000',
                    slot: 1000,
                    signature: 'sig1',
                    createdAt: new Date(),
                  },
                ]),
              }),
            }),
          }),
        } as any;
      } else {
        return {
          from: vi.fn().mockResolvedValue([{ value: 5 }]),
        } as any;
      }
    });

    const res = await app.inject({ method: 'GET', url: '/api/distributions' });

    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(body.data).toHaveLength(1);
    expect(body.data[0].day).toBe(5);
    expect(body.pagination.total).toBe(5);
  });

  it('returns empty array when no distributions', async () => {
    let callCount = 0;
    vi.mocked(db.select).mockImplementation(() => {
      callCount++;
      if (callCount === 1) {
        return {
          from: vi.fn().mockReturnValue({
            orderBy: vi.fn().mockReturnValue({
              limit: vi.fn().mockReturnValue({
                offset: vi.fn().mockResolvedValue([]),
              }),
            }),
          }),
        } as any;
      } else {
        return {
          from: vi.fn().mockResolvedValue([{ value: 0 }]),
        } as any;
      }
    });

    const res = await app.inject({ method: 'GET', url: '/api/distributions' });

    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(body.data).toEqual([]);
    expect(body.pagination.totalPages).toBe(0);
  });

  it('respects pagination parameters', async () => {
    let callCount = 0;
    vi.mocked(db.select).mockImplementation(() => {
      callCount++;
      if (callCount === 1) {
        return {
          from: vi.fn().mockReturnValue({
            orderBy: vi.fn().mockReturnValue({
              limit: vi.fn().mockReturnValue({
                offset: vi.fn().mockResolvedValue([]),
              }),
            }),
          }),
        } as any;
      } else {
        return {
          from: vi.fn().mockResolvedValue([{ value: 0 }]),
        } as any;
      }
    });

    const res = await app.inject({
      method: 'GET',
      url: '/api/distributions?page=2&limit=20',
    });

    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(body.pagination.page).toBe(2);
    expect(body.pagination.limit).toBe(20);
  });
});

describe('GET /api/distributions/chart', () => {
  let app: ReturnType<typeof Fastify>;

  beforeAll(async () => {
    app = Fastify({ logger: false });
    app.register(distributionRoutes);
    await app.ready();
  });

  afterAll(() => app.close());

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 200 with all distributions in ascending order', async () => {
    vi.mocked(db.select).mockReturnValue({
      from: vi.fn().mockReturnValue({
        orderBy: vi.fn().mockResolvedValue([
          { day: 1, newShareRate: '1000000000', amount: '500000', totalShares: '1000000' },
          { day: 2, newShareRate: '1001000000', amount: '500000', totalShares: '1000000' },
        ]),
      }),
    } as any);

    const res = await app.inject({
      method: 'GET',
      url: '/api/distributions/chart',
    });

    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(body.data).toHaveLength(2);
    expect(body.data[0].day).toBe(1);
  });

  it('returns empty data array when no distributions', async () => {
    vi.mocked(db.select).mockReturnValue({
      from: vi.fn().mockReturnValue({
        orderBy: vi.fn().mockResolvedValue([]),
      }),
    } as any);

    const res = await app.inject({
      method: 'GET',
      url: '/api/distributions/chart',
    });

    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(body.data).toEqual([]);
  });
});
