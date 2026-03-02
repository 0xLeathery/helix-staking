import { describe, it, expect, vi, beforeAll, afterAll, beforeEach } from 'vitest';
import Fastify from 'fastify';

vi.mock('../../db/client.js', () => ({
  db: {
    insert: vi.fn(),
    delete: vi.fn(),
    update: vi.fn(),
    select: vi.fn(),
  },
}));

vi.mock('../../lib/logger.js', () => ({
  logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() },
}));

import { pushRoutes } from '../../api/routes/push.js';
import { db } from '../../db/client.js';

const VALID_ENDPOINT = 'https://fcm.googleapis.com/fcm/send/test-endpoint-12345';
const VALID_WALLET = 'So1ana11111111111111111111111111111111111111';

const VALID_SUBSCRIPTION = {
  wallet: VALID_WALLET,
  subscription: {
    endpoint: VALID_ENDPOINT,
    keys: {
      p256dh: 'BNbxyz123validKeyBase64encodedThatIsLongEnough',
      auth: 'authKeyBase64',
    },
  },
};

describe('POST /api/push/subscribe', () => {
  let app: ReturnType<typeof Fastify>;

  beforeAll(async () => {
    app = Fastify({ logger: false });
    app.register(pushRoutes);
    await app.ready();
  });

  afterAll(() => app.close());

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(db.insert).mockReturnValue({
      values: vi.fn().mockReturnValue({
        onConflictDoUpdate: vi.fn().mockResolvedValue(undefined),
      }),
    } as any);
  });

  it('returns 201 when subscription is created', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/push/subscribe',
      payload: VALID_SUBSCRIPTION,
      headers: { 'content-type': 'application/json' },
    });

    expect(res.statusCode).toBe(201);
    const body = JSON.parse(res.body);
    expect(body.ok).toBe(true);
  });

  it('calls db.insert with subscription data', async () => {
    const valuesMock = vi.fn().mockReturnValue({
      onConflictDoUpdate: vi.fn().mockResolvedValue(undefined),
    });
    vi.mocked(db.insert).mockReturnValue({ values: valuesMock } as any);

    await app.inject({
      method: 'POST',
      url: '/api/push/subscribe',
      payload: VALID_SUBSCRIPTION,
      headers: { 'content-type': 'application/json' },
    });

    expect(valuesMock).toHaveBeenCalledWith(
      expect.objectContaining({
        wallet: VALID_WALLET,
        endpoint: VALID_ENDPOINT,
      }),
    );
  });

  it('returns 500 for invalid subscription body (missing keys)', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/push/subscribe',
      payload: { wallet: VALID_WALLET },
      headers: { 'content-type': 'application/json' },
    });

    expect(res.statusCode).toBe(500);
  });
});

describe('DELETE /api/push/unsubscribe', () => {
  let app: ReturnType<typeof Fastify>;

  beforeAll(async () => {
    app = Fastify({ logger: false });
    app.register(pushRoutes);
    await app.ready();
  });

  afterAll(() => app.close());

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(db.delete).mockReturnValue({
      where: vi.fn().mockResolvedValue(undefined),
    } as any);
  });

  it('returns 200 when subscription is removed', async () => {
    const res = await app.inject({
      method: 'DELETE',
      url: '/api/push/unsubscribe',
      payload: { endpoint: VALID_ENDPOINT },
      headers: { 'content-type': 'application/json' },
    });

    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(body.ok).toBe(true);
  });

  it('calls db.delete with endpoint filter', async () => {
    const whereMock = vi.fn().mockResolvedValue(undefined);
    vi.mocked(db.delete).mockReturnValue({ where: whereMock } as any);

    await app.inject({
      method: 'DELETE',
      url: '/api/push/unsubscribe',
      payload: { endpoint: VALID_ENDPOINT },
      headers: { 'content-type': 'application/json' },
    });

    expect(db.delete).toHaveBeenCalled();
    expect(whereMock).toHaveBeenCalled();
  });

  it('returns 500 for invalid body (non-URL endpoint)', async () => {
    const res = await app.inject({
      method: 'DELETE',
      url: '/api/push/unsubscribe',
      payload: { endpoint: 'not-a-url' },
      headers: { 'content-type': 'application/json' },
    });

    expect(res.statusCode).toBe(500);
  });
});

describe('GET /api/push/preferences', () => {
  let app: ReturnType<typeof Fastify>;

  beforeAll(async () => {
    app = Fastify({ logger: false });
    app.register(pushRoutes);
    await app.ready();
  });

  afterAll(() => app.close());

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 200 with preferences when subscription exists', async () => {
    vi.mocked(db.select).mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockResolvedValue([
          {
            notifyMaturity: true,
            notifyLatePenalty: true,
            notifyRewards: false,
            notifyBpd: true,
          },
        ]),
      }),
    } as any);

    const res = await app.inject({
      method: 'GET',
      url: `/api/push/preferences?endpoint=${encodeURIComponent(VALID_ENDPOINT)}`,
    });

    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(body.notifyMaturity).toBe(true);
    expect(body.notifyRewards).toBe(false);
  });

  it('returns 404 when subscription not found', async () => {
    vi.mocked(db.select).mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockResolvedValue([]),
      }),
    } as any);

    const res = await app.inject({
      method: 'GET',
      url: `/api/push/preferences?endpoint=${encodeURIComponent(VALID_ENDPOINT)}`,
    });

    expect(res.statusCode).toBe(404);
    const body = JSON.parse(res.body);
    expect(body.error).toBe('Subscription not found');
  });
});

describe('PUT /api/push/preferences', () => {
  let app: ReturnType<typeof Fastify>;

  beforeAll(async () => {
    app = Fastify({ logger: false });
    app.register(pushRoutes);
    await app.ready();
  });

  afterAll(() => app.close());

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 200 when preferences are updated', async () => {
    vi.mocked(db.update).mockReturnValue({
      set: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          returning: vi.fn().mockResolvedValue([{ id: 1 }]),
        }),
      }),
    } as any);

    const res = await app.inject({
      method: 'PUT',
      url: '/api/push/preferences',
      payload: {
        endpoint: VALID_ENDPOINT,
        preferences: { notifyMaturity: false, notifyBpd: true },
      },
      headers: { 'content-type': 'application/json' },
    });

    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(body.ok).toBe(true);
  });

  it('returns 404 when subscription not found during preferences update', async () => {
    vi.mocked(db.update).mockReturnValue({
      set: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          returning: vi.fn().mockResolvedValue([]),
        }),
      }),
    } as any);

    const res = await app.inject({
      method: 'PUT',
      url: '/api/push/preferences',
      payload: {
        endpoint: VALID_ENDPOINT,
        preferences: { notifyMaturity: false },
      },
      headers: { 'content-type': 'application/json' },
    });

    expect(res.statusCode).toBe(404);
    const body = JSON.parse(res.body);
    expect(body.error).toBe('Subscription not found');
  });

  it('returns 500 when no preferences provided', async () => {
    const res = await app.inject({
      method: 'PUT',
      url: '/api/push/preferences',
      payload: {
        endpoint: VALID_ENDPOINT,
        preferences: {}, // empty — Zod refine will reject
      },
      headers: { 'content-type': 'application/json' },
    });

    expect(res.statusCode).toBe(500);
  });
});
