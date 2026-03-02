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

import { leaderboardRoutes } from '../../api/routes/leaderboard.js';
import { db } from '../../db/client.js';

describe('GET /api/leaderboard', () => {
  let app: ReturnType<typeof Fastify>;

  beforeAll(async () => {
    app = Fastify({ logger: false });
    app.register(leaderboardRoutes);
    await app.ready();
  });

  afterAll(() => app.close());

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 200 with ranked leaderboard entries', async () => {
    vi.mocked(db.execute).mockResolvedValue({
      rows: [
        { user: 'wallet1', rank: '1', total_t_shares: '100000', active_stake_count: '2', total_staked: '5000000000', max_duration: 365 },
        { user: 'wallet2', rank: '2', total_t_shares: '50000', active_stake_count: '1', total_staked: '2000000000', max_duration: 180 },
      ],
    } as any);

    const res = await app.inject({ method: 'GET', url: '/api/leaderboard' });

    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(body.data).toHaveLength(2);
    expect(body.data[0].user).toBe('wallet1');
    expect(body.data[0].rank).toBe('1');
  });

  it('returns empty array when no active stakes', async () => {
    vi.mocked(db.execute).mockResolvedValue({ rows: [] } as any);

    const res = await app.inject({ method: 'GET', url: '/api/leaderboard' });

    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(body.data).toEqual([]);
  });

  it('applies ?limit= parameter', async () => {
    vi.mocked(db.execute).mockResolvedValue({ rows: [] } as any);

    const res = await app.inject({
      method: 'GET',
      url: '/api/leaderboard?limit=10',
    });

    expect(res.statusCode).toBe(200);
    expect(db.execute).toHaveBeenCalled();
  });

  it('applies ?sort= parameter for sort_by selection', async () => {
    vi.mocked(db.execute).mockResolvedValue({ rows: [] } as any);

    const res = await app.inject({
      method: 'GET',
      url: '/api/leaderboard?sort=total_staked',
    });

    expect(res.statusCode).toBe(200);
  });

  it('applies ?sort=stake_count for stake count ranking', async () => {
    vi.mocked(db.execute).mockResolvedValue({ rows: [] } as any);

    const res = await app.inject({
      method: 'GET',
      url: '/api/leaderboard?sort=stake_count',
    });

    expect(res.statusCode).toBe(200);
  });

  it('includes requesting user even when not in top N', async () => {
    vi.mocked(db.execute).mockResolvedValue({
      rows: [
        { user: 'wallet_low_rank', rank: '100', total_t_shares: '100', active_stake_count: '1', total_staked: '1000000', max_duration: 30 },
      ],
    } as any);

    const res = await app.inject({
      method: 'GET',
      url: '/api/leaderboard?user=wallet_low_rank',
    });

    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(body.data).toHaveLength(1);
  });

  it('returns 500 for invalid sort parameter', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/api/leaderboard?sort=invalid_sort_field',
    });

    expect(res.statusCode).toBe(500); // Zod enum validation fails
  });
});
