import webpush from 'web-push';
import { eq, inArray, and } from 'drizzle-orm';
import { env } from './env.js';
import { db } from '../db/client.js';
import { pushSubscriptions } from '../db/schema.js';
import { logger } from './logger.js';

// ---------------------------------------------------------------------------
// VAPID initialisation
// ---------------------------------------------------------------------------
let pushEnabled = false;

if (env.VAPID_PUBLIC_KEY && env.VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(
    env.VAPID_SUBJECT,
    env.VAPID_PUBLIC_KEY,
    env.VAPID_PRIVATE_KEY,
  );
  pushEnabled = true;
  logger.info('Web Push configured — VAPID keys loaded');
} else {
  logger.warn(
    'VAPID_PUBLIC_KEY or VAPID_PRIVATE_KEY not set — push notifications disabled',
  );
}

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------

/** Returns true if VAPID keys were provided at startup */
export function isPushEnabled(): boolean {
  return pushEnabled;
}

/** Payload shape sent to the browser service worker */
export interface PushPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  data?: {
    url?: string;
    eventType?: string;
    stakeId?: number;
  };
}

/**
 * Send a single push notification to one subscription.
 * Returns:
 *   'sent'    — notification dispatched successfully
 *   'expired' — endpoint returned 410/404 (subscription revoked by browser)
 *   'error'   — unexpected failure (logged, should not stop other sends)
 */
export async function sendPushNotification(
  subscription: { endpoint: string; keys: { p256dh: string; auth: string } },
  payload: PushPayload,
): Promise<'sent' | 'expired' | 'error'> {
  try {
    await webpush.sendNotification(subscription, JSON.stringify(payload));
    return 'sent';
  } catch (err: unknown) {
    const statusCode = (err as { statusCode?: number }).statusCode;
    if (statusCode === 410 || statusCode === 404) {
      return 'expired';
    }
    logger.error(
      { err, endpoint: subscription.endpoint },
      'Failed to send push notification',
    );
    return 'error';
  }
}

/**
 * Fan out a push notification to all subscribers who:
 *   1. Have a wallet in the `wallets` list, AND
 *   2. Have the given preference column set to true
 *
 * Automatically removes subscriptions that come back as expired (410/404).
 */
export async function dispatchToSubscribers(
  wallets: string[],
  payload: PushPayload,
  preferenceKey:
    | 'notifyMaturity'
    | 'notifyLatePenalty'
    | 'notifyRewards'
    | 'notifyBpd',
): Promise<{ sent: number; expired: number; errors: number }> {
  if (!pushEnabled) {
    return { sent: 0, expired: 0, errors: 0 };
  }

  if (wallets.length === 0) {
    return { sent: 0, expired: 0, errors: 0 };
  }

  const subs = await db
    .select()
    .from(pushSubscriptions)
    .where(
      and(
        inArray(pushSubscriptions.wallet, wallets),
        eq(pushSubscriptions[preferenceKey], true),
      ),
    );

  let sent = 0;
  let expired = 0;
  let errors = 0;

  for (const sub of subs) {
    const result = await sendPushNotification(
      {
        endpoint: sub.endpoint,
        keys: { p256dh: sub.p256dh, auth: sub.auth },
      },
      payload,
    );

    if (result === 'sent') {
      sent++;
    } else if (result === 'expired') {
      expired++;
      // Clean up the stale subscription
      await db
        .delete(pushSubscriptions)
        .where(eq(pushSubscriptions.endpoint, sub.endpoint));
    } else {
      errors++;
    }
  }

  logger.info(
    { wallets: wallets.length, subs: subs.length, sent, expired, errors, preferenceKey },
    'dispatchToSubscribers complete',
  );

  return { sent, expired, errors };
}
