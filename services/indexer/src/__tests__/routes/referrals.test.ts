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

import { referralRoutes } from '../../api/routes/referrals.js';
import { db } from '../../db/client.js';

const VALID_REFERRER = 'So1ana11111111111111111111111111111111111111';

describe('GET /api/referrals', () => {
  let app: ReturnType<typeof Fastify>;

  beforeAll(async () => {
    app = Fastify({ logger: false });
    app.register(referralRoutes);
    await app.ready();
  });

  afterAll(() => app.close());

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 200 with referral stats for a valid referrer', async () => {
    vi.mocked(db.select).mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockResolvedValue([
          {
            totalReferrals: 5,
            totalReferrerBonusTokens: '25000000',
          },
        ]),
      }),
    } as any);

    const res = await app.inject({
      method: 'GET',
      url: `/api/referrals?referrer=${VALID_REFERRER}`,
    });

    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(body.referrer).toBe(VALID_REFERRER);
    expect(body.totalReferrals).toBe(5);
    expect(body.totalReferrerBonusTokens).toBe('25000000');
  });

  it('returns zero stats when referrer has no referrals', async () => {
    vi.mocked(db.select).mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockResolvedValue([
          {
            totalReferrals: 0,
            totalReferrerBonusTokens: null, // sum() returns null when no rows
          },
        ]),
      }),
    } as any);

    const res = await app.inject({
      method: 'GET',
      url: `/api/referrals?referrer=${VALID_REFERRER}`,
    });

    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    // null coalesced to '0'
    expect(body.totalReferrerBonusTokens).toBe('0');
    expect(body.totalReferrals).toBe(0);
  });

  it('returns zero stats on empty result set', async () => {
    vi.mocked(db.select).mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockResolvedValue([]),
      }),
    } as any);

    const res = await app.inject({
      method: 'GET',
      url: `/api/referrals?referrer=${VALID_REFERRER}`,
    });

    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(body.totalReferrals).toBe(0);
    expect(body.totalReferrerBonusTokens).toBe('0');
  });

  it('returns 500 when referrer param is missing', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/api/referrals',
    });

    expect(res.statusCode).toBe(500);
  });

  it('returns 500 for invalid (too short) referrer', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/api/referrals?referrer=short',
    });

    expect(res.statusCode).toBe(500);
  });
});
