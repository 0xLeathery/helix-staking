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

import { claimRoutes } from '../../api/routes/claims.js';
import { db } from '../../db/client.js';

function mockSelectPaginated(dataRows: any[], totalCount: number) {
  let callCount = 0;
  vi.mocked(db.select).mockImplementation(() => {
    callCount++;
    if (callCount % 2 === 1) {
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
      return {
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([{ value: totalCount }]),
        }),
      } as any;
    }
  });
}

describe('GET /api/claims/tokens', () => {
  let app: ReturnType<typeof Fastify>;

  beforeAll(async () => {
    app = Fastify({ logger: false });
    app.register(claimRoutes);
    await app.ready();
  });

  afterAll(() => app.close());

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 200 with token claim data', async () => {
    mockSelectPaginated([
      {
        claimer: 'wallet1',
        snapshotWallet: 'wallet1',
        claimPeriodId: 1,
        snapshotBalance: '500000000',
        baseAmount: '100000000',
        bonusBps: 100,
        totalAmount: '110000000',
        immediateAmount: '55000000',
        vestingAmount: '55000000',
        slot: 1000,
        signature: 'sig1',
        createdAt: new Date(),
      },
    ], 1);

    const res = await app.inject({ method: 'GET', url: '/api/claims/tokens' });

    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(body.data).toHaveLength(1);
    expect(body.pagination.total).toBe(1);
  });

  it('returns empty array when no token claims', async () => {
    mockSelectPaginated([], 0);

    const res = await app.inject({ method: 'GET', url: '/api/claims/tokens' });

    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(body.data).toEqual([]);
  });

  it('filters by ?claimer= query parameter', async () => {
    mockSelectPaginated([], 0);

    const res = await app.inject({
      method: 'GET',
      url: '/api/claims/tokens?claimer=wallet123',
    });

    expect(res.statusCode).toBe(200);
  });
});

describe('GET /api/claims/rewards', () => {
  let app: ReturnType<typeof Fastify>;

  beforeAll(async () => {
    app = Fastify({ logger: false });
    app.register(claimRoutes);
    await app.ready();
  });

  afterAll(() => app.close());

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 200 with reward claims data', async () => {
    mockSelectPaginated([
      {
        user: 'wallet1',
        stakeId: 1,
        amount: '50000000',
        slot: 2000,
        signature: 'sig2',
        createdAt: new Date(),
      },
    ], 1);

    const res = await app.inject({ method: 'GET', url: '/api/claims/rewards' });

    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(body.data).toHaveLength(1);
    expect(body.data[0].user).toBe('wallet1');
  });

  it('returns empty array when no reward claims', async () => {
    mockSelectPaginated([], 0);

    const res = await app.inject({ method: 'GET', url: '/api/claims/rewards' });

    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(body.data).toEqual([]);
  });

  it('filters by ?user= query parameter', async () => {
    mockSelectPaginated([], 0);

    const res = await app.inject({
      method: 'GET',
      url: '/api/claims/rewards?user=wallet456',
    });

    expect(res.statusCode).toBe(200);
  });
});

describe('GET /api/claims/bpd', () => {
  let app: ReturnType<typeof Fastify>;

  beforeAll(async () => {
    app = Fastify({ logger: false });
    app.register(claimRoutes);
    await app.ready();
  });

  afterAll(() => app.close());

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 200 with BPD distribution data', async () => {
    let callCount = 0;
    vi.mocked(db.select).mockImplementation(() => {
      callCount++;
      if (callCount === 1) {
        return {
          from: vi.fn().mockReturnValue({
            orderBy: vi.fn().mockReturnValue({
              limit: vi.fn().mockReturnValue({
                offset: vi.fn().mockResolvedValue([{
                  claimPeriodId: 1,
                  totalUnclaimed: '10000000000',
                  totalEligibleShareDays: '100000',
                  helixPerShareDay: '100000',
                  eligibleStakers: 50,
                  slot: 3000,
                  signature: 'sig3',
                  createdAt: new Date(),
                }]),
              }),
            }),
          }),
        } as any;
      } else {
        return {
          from: vi.fn().mockResolvedValue([{ value: 1 }]),
        } as any;
      }
    });

    const res = await app.inject({ method: 'GET', url: '/api/claims/bpd' });

    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(body.data).toHaveLength(1);
  });

  it('returns empty array when no BPD distributions', async () => {
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

    const res = await app.inject({ method: 'GET', url: '/api/claims/bpd' });

    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(body.data).toEqual([]);
  });
});
