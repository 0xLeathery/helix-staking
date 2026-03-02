'use client';

import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';

/**
 * Converts a URL-safe base64 VAPID public key to a Uint8Array
 * required by PushManager.subscribe's applicationServerKey.
 */
function urlBase64ToUint8Array(base64String: string): ArrayBuffer {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; i++) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray.buffer;
}

export interface UsePushNotificationsReturn {
  isSupported: boolean;
  isSubscribed: boolean;
  permission: NotificationPermission | null;
  isStandalone: boolean;
  isIOS: boolean;
  subscribe: () => Promise<void>;
  unsubscribe: () => Promise<void>;
}

export function usePushNotifications(wallet: string | null): UsePushNotificationsReturn {
  const [isSupported, setIsSupported] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission | null>(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    const supported =
      'serviceWorker' in navigator && 'PushManager' in window;
    setIsSupported(supported);

    setIsStandalone(
      window.matchMedia('(display-mode: standalone)').matches
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setIsIOS(
      /iPad|iPhone|iPod/.test(navigator.userAgent) &&
        !(window as unknown as { MSStream?: unknown }).MSStream
    );

    if (supported) {
      navigator.serviceWorker
        .register('/sw.js', { scope: '/', updateViaCache: 'none' })
        .then((reg) => reg.pushManager.getSubscription())
        .then((sub) => {
          if (sub !== null) {
            setIsSubscribed(true);
          }
        })
        .catch(() => {
          // Service worker registration failed — not subscribed
        });

      setPermission(Notification.permission);
    }
  }, []);

  const subscribe = useCallback(async () => {
    if (!wallet) {
      throw new Error('Wallet required');
    }
    if (!isSupported) {
      throw new Error('Push not supported');
    }

    const perm = await Notification.requestPermission();
    setPermission(perm);
    if (perm !== 'granted') {
      return;
    }

    const reg = await navigator.serviceWorker.ready;
    const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!;
    const sub = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(vapidKey),
    });

    await api.subscribePush(wallet, sub.toJSON());
    setIsSubscribed(true);
    setPermission('granted');
  }, [wallet, isSupported]);

  const unsubscribe = useCallback(async () => {
    if (!isSupported) return;

    const reg = await navigator.serviceWorker.ready;
    const sub = await reg.pushManager.getSubscription();
    if (sub) {
      await sub.unsubscribe();
      await api.unsubscribePush(sub.endpoint);
      setIsSubscribed(false);
    }
  }, [isSupported]);

  return {
    isSupported,
    isSubscribed,
    permission,
    isStandalone,
    isIOS,
    subscribe,
    unsubscribe,
  };
}
