import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock web-push before importing push lib
vi.mock('web-push', () => ({
  default: {
    setVapidDetails: vi.fn(),
    sendNotification: vi.fn().mockResolvedValue({ statusCode: 201 }),
  },
}));

// Mock env — VAPID keys present to enable push
vi.mock('../lib/env.js', () => ({
  env: {
    VAPID_PUBLIC_KEY: 'testPublicKey',
    VAPID_PRIVATE_KEY: 'testPrivateKey',
    VAPID_SUBJECT: 'mailto:test@example.com',
  },
}));

// Mock db
vi.mock('../db/client.js', () => ({
  db: {
    select: vi.fn(),
    delete: vi.fn(),
  },
}));

// Mock logger
vi.mock('../lib/logger.js', () => ({
  logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() },
}));

import webpush from 'web-push';
import { sendPushNotification, dispatchToSubscribers, isPushEnabled } from '../lib/push.js';
import { db } from '../db/client.js';

const mockSub = {
  endpoint: 'https://fcm.googleapis.com/fcm/test123',
  keys: { p256dh: 'p256dhKey', auth: 'authKey' },
};

const mockPayload = {
  title: 'Test',
  body: 'Test body',
  tag: 'test',
};

describe('isPushEnabled', () => {
  it('returns true when VAPID keys are configured', () => {
    // push.ts initializes at module load time — our mock has keys set
    expect(isPushEnabled()).toBe(true);
  });
});

describe('sendPushNotification', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns "sent" on successful dispatch', async () => {
    vi.mocked(webpush.sendNotification).mockResolvedValue({ statusCode: 201 } as any);

    const result = await sendPushNotification(mockSub, mockPayload);

    expect(result).toBe('sent');
    expect(webpush.sendNotification).toHaveBeenCalledWith(
      mockSub,
      JSON.stringify(mockPayload),
    );
  });

  it('returns "expired" when endpoint returns 410', async () => {
    vi.mocked(webpush.sendNotification).mockRejectedValue({ statusCode: 410 });

    const result = await sendPushNotification(mockSub, mockPayload);

    expect(result).toBe('expired');
  });

  it('returns "expired" when endpoint returns 404', async () => {
    vi.mocked(webpush.sendNotification).mockRejectedValue({ statusCode: 404 });

    const result = await sendPushNotification(mockSub, mockPayload);

    expect(result).toBe('expired');
  });

  it('returns "error" for unexpected failures', async () => {
    vi.mocked(webpush.sendNotification).mockRejectedValue(
      new Error('Network timeout'),
    );

    const result = await sendPushNotification(mockSub, mockPayload);

    expect(result).toBe('error');
  });
});

describe('dispatchToSubscribers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(webpush.sendNotification).mockResolvedValue({ statusCode: 201 } as any);
  });

  it('returns zero counts when wallets list is empty', async () => {
    const result = await dispatchToSubscribers([], mockPayload, 'notifyMaturity');

    expect(result).toEqual({ sent: 0, expired: 0, errors: 0 });
    expect(db.select).not.toHaveBeenCalled();
  });

  it('sends to all matching subscriptions and returns sent count', async () => {
    vi.mocked(db.select).mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockResolvedValue([
          { endpoint: mockSub.endpoint, p256dh: 'p256dhKey', auth: 'authKey', wallet: 'wallet1' },
          { endpoint: 'https://endpoint2.example.com/sub2', p256dh: 'key2', auth: 'auth2', wallet: 'wallet2' },
        ]),
      }),
    } as any);

    const result = await dispatchToSubscribers(
      ['wallet1', 'wallet2'],
      mockPayload,
      'notifyMaturity',
    );

    expect(result.sent).toBe(2);
    expect(result.expired).toBe(0);
    expect(result.errors).toBe(0);
    expect(webpush.sendNotification).toHaveBeenCalledTimes(2);
  });

  it('deletes expired subscriptions and increments expired count', async () => {
    vi.mocked(db.select).mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockResolvedValue([
          { endpoint: mockSub.endpoint, p256dh: 'key', auth: 'auth', wallet: 'wallet1' },
        ]),
      }),
    } as any);

    vi.mocked(db.delete).mockReturnValue({
      where: vi.fn().mockResolvedValue(undefined),
    } as any);

    // Simulate expired endpoint
    vi.mocked(webpush.sendNotification).mockRejectedValue({ statusCode: 410 });

    const result = await dispatchToSubscribers(
      ['wallet1'],
      mockPayload,
      'notifyMaturity',
    );

    expect(result.expired).toBe(1);
    expect(result.sent).toBe(0);
    expect(db.delete).toHaveBeenCalled();
  });

  it('counts errors for unexpected send failures', async () => {
    vi.mocked(db.select).mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockResolvedValue([
          { endpoint: mockSub.endpoint, p256dh: 'key', auth: 'auth', wallet: 'wallet1' },
        ]),
      }),
    } as any);

    vi.mocked(webpush.sendNotification).mockRejectedValue(
      new Error('Connection refused'),
    );

    const result = await dispatchToSubscribers(
      ['wallet1'],
      mockPayload,
      'notifyBpd',
    );

    expect(result.errors).toBe(1);
    expect(result.sent).toBe(0);
  });

  it('returns zero counts when no matching subscriptions found', async () => {
    vi.mocked(db.select).mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockResolvedValue([]),
      }),
    } as any);

    const result = await dispatchToSubscribers(
      ['wallet1'],
      mockPayload,
      'notifyRewards',
    );

    expect(result).toEqual({ sent: 0, expired: 0, errors: 0 });
    expect(webpush.sendNotification).not.toHaveBeenCalled();
  });
});
