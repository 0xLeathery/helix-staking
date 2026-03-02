import { describe, it, expect, vi, beforeAll, afterAll, beforeEach } from 'vitest';
import Fastify from 'fastify';

vi.mock('../../db/client.js', () => ({
  db: {
    execute: vi.fn(),
  },
}));

vi.mock('../../lib/logger.js', () => ({
  logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() },
}));

import { whaleActivityRoutes } from '../../api/routes/whale-activity.js';
import { db } from '../../db/client.js';

describe('GET /api/whale-activity', () => {
  let app: ReturnType<typeof Fastify>;

  beforeAll(async () => {
    app = Fastify({ logger: false });
    app.register(whaleActivityRoutes);
    await app.ready();
  });

  afterAll(() => app.close());

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 200 with whale stake events', async () => {
    vi.mocked(db.execute).mockResolvedValue({
      rows: [
        {
          type: 'stake',
          user: 'whale1',
          stake_id: 1,
          amount: '100000000000',
          t_shares: '10000000',
          days: 365,
          slot: 50000,
          signature: 'sig1',
          created_at: new Date().toISOString(),
        },
      ],
    } as any);

    const res = await app.inject({ method: 'GET', url: '/api/whale-activity' });

    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(body.data).toHaveLength(1);
    expect(body.data[0].type).toBe('stake');
    expect(body.data[0].user).toBe('whale1');
  });

  it('returns empty array when no whale activity', async () => {
    vi.mocked(db.execute).mockResolvedValue({ rows: [] } as any);

    const res = await app.inject({ method: 'GET', url: '/api/whale-activity' });

    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(body.data).toEqual([]);
  });

  it('applies custom ?limit= parameter', async () => {
    vi.mocked(db.execute).mockResolvedValue({ rows: [] } as any);

    const res = await app.inject({
      method: 'GET',
      url: '/api/whale-activity?limit=10',
    });

    expect(res.statusCode).toBe(200);
  });

  it('uses custom ?minAmount= threshold', async () => {
    vi.mocked(db.execute).mockResolvedValue({ rows: [] } as any);

    const res = await app.inject({
      method: 'GET',
      url: '/api/whale-activity?minAmount=500000000000',
    });

    expect(res.statusCode).toBe(200);
  });

  it('returns both stake and unstake activity types', async () => {
    vi.mocked(db.execute).mockResolvedValue({
      rows: [
        { type: 'stake', user: 'whale1', amount: '200000000000', slot: 60000, signature: 'sig2' },
        { type: 'unstake', user: 'whale2', amount: '150000000000', slot: 55000, signature: 'sig3' },
      ],
    } as any);

    const res = await app.inject({ method: 'GET', url: '/api/whale-activity' });

    const body = JSON.parse(res.body);
    const types = body.data.map((d: any) => d.type);
    expect(types).toContain('stake');
    expect(types).toContain('unstake');
  });
});
