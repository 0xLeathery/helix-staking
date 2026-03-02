import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock push library
vi.mock('../lib/push.js', () => ({
  isPushEnabled: vi.fn().mockReturnValue(true),
  dispatchToSubscribers: vi.fn().mockResolvedValue(undefined),
}));

// Mock logger
vi.mock('../lib/logger.js', () => ({
  logger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  },
}));

// Mock env
vi.mock('../lib/env.js', () => ({
  env: {
    RPC_URL: 'http://localhost:8899',
    DATABASE_URL: 'postgresql://localhost/test',
    PROGRAM_ID: 'ProgId11111111111111111111111111111111111111',
    CLUSTER: 'localnet',
  },
}));

// Mock rpc
vi.mock('../lib/rpc.js', () => ({
  createRpcClient: vi.fn().mockReturnValue({
    getSlot: vi.fn().mockResolvedValue(1000000),
  }),
}));

// Mock node-cron
vi.mock('node-cron', () => ({
  default: {
    schedule: vi.fn(),
  },
}));

// Mock db
vi.mock('../db/client.js', () => {
  return {
    db: {
      select: vi.fn(),
      insert: vi.fn(),
      update: vi.fn(),
      execute: vi.fn(),
    },
  };
});

import { sendBpdTransitionNotification, sendRewardsNotification } from '../worker/notification-scheduler.js';
import { db } from '../db/client.js';
import { isPushEnabled, dispatchToSubscribers } from '../lib/push.js';

describe('sendBpdTransitionNotification', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(isPushEnabled).mockReturnValue(true);
    vi.mocked(dispatchToSubscribers).mockResolvedValue(undefined);
  });

  it('returns early when push is not enabled', async () => {
    vi.mocked(isPushEnabled).mockReturnValue(false);

    await sendBpdTransitionNotification('finalization_started');

    expect(db.select).not.toHaveBeenCalled();
    expect(dispatchToSubscribers).not.toHaveBeenCalled();
  });

  it('dispatches finalization_started notification to BPD subscribers', async () => {
    vi.mocked(db.select).mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockResolvedValue([
          { wallet: 'wallet1' },
          { wallet: 'wallet2' },
        ]),
      }),
    } as any);

    await sendBpdTransitionNotification('finalization_started');

    expect(dispatchToSubscribers).toHaveBeenCalledWith(
      expect.arrayContaining(['wallet1', 'wallet2']),
      expect.objectContaining({
        title: 'BPD Update',
        tag: 'bpd-finalization_started',
      }),
      'notifyBpd',
    );
  });

  it('dispatches seal_complete notification', async () => {
    vi.mocked(db.select).mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockResolvedValue([{ wallet: 'wallet1' }]),
      }),
    } as any);

    await sendBpdTransitionNotification('seal_complete');

    expect(dispatchToSubscribers).toHaveBeenCalledWith(
      ['wallet1'],
      expect.objectContaining({
        title: 'BPD Update',
        tag: 'bpd-seal_complete',
      }),
      'notifyBpd',
    );
  });

  it('dispatches distribution_complete notification with correct message', async () => {
    vi.mocked(db.select).mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockResolvedValue([{ wallet: 'wallet1' }]),
      }),
    } as any);

    await sendBpdTransitionNotification('distribution_complete');

    expect(dispatchToSubscribers).toHaveBeenCalledWith(
      ['wallet1'],
      expect.objectContaining({
        title: 'BPD Complete!',
        tag: 'bpd-distribution_complete',
      }),
      'notifyBpd',
    );
  });

  it('does not dispatch when no wallets have BPD notifications enabled', async () => {
    vi.mocked(db.select).mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockResolvedValue([]),
      }),
    } as any);

    await sendBpdTransitionNotification('finalization_started');

    expect(dispatchToSubscribers).not.toHaveBeenCalled();
  });

  it('deduplicates wallets with multiple subscriptions', async () => {
    vi.mocked(db.select).mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockResolvedValue([
          { wallet: 'wallet1' },
          { wallet: 'wallet1' }, // duplicate
          { wallet: 'wallet2' },
        ]),
      }),
    } as any);

    await sendBpdTransitionNotification('finalization_started');

    const callArgs = vi.mocked(dispatchToSubscribers).mock.calls[0];
    const wallets = callArgs[0] as string[];
    // Each wallet should appear only once
    expect(wallets.filter((w) => w === 'wallet1')).toHaveLength(1);
    expect(wallets).toHaveLength(2);
  });
});

describe('sendRewardsNotification', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(isPushEnabled).mockReturnValue(true);
  });

  it('returns early when push is not enabled', async () => {
    vi.mocked(isPushEnabled).mockReturnValue(false);

    await sendRewardsNotification();

    expect(db.select).not.toHaveBeenCalled();
  });

  it('dispatches rewards notification to eligible subscribers', async () => {
    vi.mocked(db.select).mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockResolvedValue([
          { id: 1, wallet: 'wallet1' },
          { id: 2, wallet: 'wallet2' },
        ]),
      }),
    } as any);

    vi.mocked(db.update).mockReturnValue({
      set: vi.fn().mockReturnValue({
        where: vi.fn().mockResolvedValue(undefined),
      }),
    } as any);

    await sendRewardsNotification();

    expect(dispatchToSubscribers).toHaveBeenCalledWith(
      expect.arrayContaining(['wallet1', 'wallet2']),
      expect.objectContaining({
        title: 'Rewards Available',
        tag: 'rewards-available',
      }),
      'notifyRewards',
    );
  });

  it('does not dispatch when no eligible subscribers found', async () => {
    vi.mocked(db.select).mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockResolvedValue([]),
      }),
    } as any);

    await sendRewardsNotification();

    expect(dispatchToSubscribers).not.toHaveBeenCalled();
  });

  it('updates lastRewardsNotifiedAt after dispatch', async () => {
    vi.mocked(db.select).mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockResolvedValue([{ id: 1, wallet: 'wallet1' }]),
      }),
    } as any);

    const whereMock = vi.fn().mockResolvedValue(undefined);
    const setMock = vi.fn().mockReturnValue({ where: whereMock });
    vi.mocked(db.update).mockReturnValue({ set: setMock } as any);

    await sendRewardsNotification();

    expect(db.update).toHaveBeenCalled();
    expect(setMock).toHaveBeenCalled();
  });
});
