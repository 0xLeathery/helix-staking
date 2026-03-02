import { describe, it, expect, vi } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import React from 'react';

const { mockUsePushNotifications } = vi.hoisted(() => {
  const mockUsePushNotifications = vi.fn(() => ({
    isSupported: true,
    isSubscribed: true,
    permission: 'granted',
    isIOS: false,
    isStandalone: true,
    subscribe: vi.fn(),
    unsubscribe: vi.fn(),
  }));
  return { mockUsePushNotifications };
});

vi.mock('@/hooks/use-push-notifications', () => ({
  usePushNotifications: mockUsePushNotifications,
}));

// Mock useToast
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({ toast: vi.fn() }),
}));

// Mock api
vi.mock('@/lib/api', () => ({
  api: {
    getPushPreferences: vi.fn().mockResolvedValue({
      notifyMaturity: true,
      notifyLatePenalty: false,
      notifyRewards: true,
      notifyBpd: true,
    }),
    setPushPreferences: vi.fn().mockResolvedValue({}),
  },
  PushPreferences: {},
}));

// Mock navigator.serviceWorker
Object.defineProperty(globalThis, 'navigator', {
  value: {
    ...globalThis.navigator,
    serviceWorker: {
      ready: Promise.resolve({
        pushManager: {
          getSubscription: vi.fn().mockResolvedValue({
            endpoint: 'https://fcm.example.com/push/test',
          }),
        },
      }),
    },
  },
  writable: true,
});

import { NotificationSettings } from '@/components/dashboard/notification-settings';

describe('NotificationSettings - subscribed state', () => {
  it('renders Push Notifications heading', async () => {
    await act(async () => {
      render(<NotificationSettings />);
    });
    expect(screen.getByRole('heading', { name: /Push Notifications/i })).toBeInTheDocument();
  });

  it('renders all 4 notification toggle rows', async () => {
    await act(async () => {
      render(<NotificationSettings />);
    });
    expect(screen.getByText(/Stake Maturity/i)).toBeInTheDocument();
    expect(screen.getByText(/Late Penalty Warning/i)).toBeInTheDocument();
    expect(screen.getByText(/Rewards Available/i)).toBeInTheDocument();
    expect(screen.getByText(/Big Pay Day/i)).toBeInTheDocument();
  });

  it('renders toggle switches (role=switch)', async () => {
    await act(async () => {
      render(<NotificationSettings />);
    });
    const switches = screen.getAllByRole('switch');
    expect(switches.length).toBe(4);
  });

  it('renders Disable Notifications button when subscribed', async () => {
    await act(async () => {
      render(<NotificationSettings />);
    });
    expect(screen.getByRole('button', { name: /Disable Notifications/i })).toBeInTheDocument();
  });
});

describe('NotificationSettings - unsubscribed state', () => {
  it('renders Enable Notifications button when not subscribed', async () => {
    mockUsePushNotifications.mockReturnValueOnce({
      isSupported: true,
      isSubscribed: false,
      permission: 'default',
      isIOS: false,
      isStandalone: true,
      subscribe: vi.fn(),
      unsubscribe: vi.fn(),
    });
    await act(async () => {
      render(<NotificationSettings />);
    });
    expect(screen.getByRole('button', { name: /Enable Notifications/i })).toBeInTheDocument();
  });
});

describe('NotificationSettings - not supported', () => {
  it('shows unsupported message when push not supported', async () => {
    mockUsePushNotifications.mockReturnValueOnce({
      isSupported: false,
      isSubscribed: false,
      permission: 'default',
      isIOS: false,
      isStandalone: false,
      subscribe: vi.fn(),
      unsubscribe: vi.fn(),
    });
    await act(async () => {
      render(<NotificationSettings />);
    });
    expect(screen.getByText(/does not support push notifications/i)).toBeInTheDocument();
  });
});
