import cron from 'node-cron';
import { eq, and, isNull, sql, inArray } from 'drizzle-orm';
import { db } from '../db/client.js';
import {
  pushSubscriptions,
  notificationState,
  stakeCreatedEvents,
  stakeEndedEvents,
  protocolInitializedEvents,
  bpdBatchFinalizedEvents,
} from '../db/schema.js';
import {
  dispatchToSubscribers,
  isPushEnabled,
  type PushPayload,
} from '../lib/push.js';
import { logger } from '../lib/logger.js';
import { createRpcClient, type RpcClient } from '../lib/rpc.js';
import { env } from '../lib/env.js';

// ---------------------------------------------------------------------------
// Module-level slotsPerDay cache
// ---------------------------------------------------------------------------
let cachedSlotsPerDay: number | null = null;

/**
 * Fetch slotsPerDay from the ProtocolInitialized event or use Solana default.
 * Cached after first fetch to avoid repeated DB hits.
 */
async function getSlotsPerDay(): Promise<number> {
  if (cachedSlotsPerDay !== null) {
    return cachedSlotsPerDay;
  }

  const rows = await db
    .select({ slotsPerDay: protocolInitializedEvents.slotsPerDay })
    .from(protocolInitializedEvents)
    .orderBy(protocolInitializedEvents.id)
    .limit(1);

  if (rows.length > 0 && rows[0].slotsPerDay) {
    const parsed = parseInt(rows[0].slotsPerDay, 10);
    if (!isNaN(parsed) && parsed > 0) {
      cachedSlotsPerDay = parsed;
      return cachedSlotsPerDay;
    }
  }

  // Solana standard: ~400ms slots × 86400s/day ≈ 216000 slots/day
  cachedSlotsPerDay = 216_000;
  return cachedSlotsPerDay;
}

// ---------------------------------------------------------------------------
// NOTIF-02: Maturity 7-day warning
// ---------------------------------------------------------------------------

/**
 * Check for stakes approaching maturity within 7 days and dispatch notifications.
 * Deduplicates via notificationState (maturity_7d).
 */
async function checkMaturityNotifications(rpc: RpcClient): Promise<void> {
  try {
    const currentSlot = await rpc.getSlot();
    const slotsPerDay = await getSlotsPerDay();
    const warningSlots = 7 * slotsPerDay;

    // Raw SQL join: active stakes (not ended, not already notified) within 7-day window
    const stakes = await db.execute<{
      user: string;
      stake_id: number;
      amount: string;
      days: number;
      slot: number;
    }>(sql`
      SELECT
        sce.user,
        sce.stake_id,
        sce.amount,
        sce.days,
        sce.slot
      FROM stake_created_events sce
      LEFT JOIN stake_ended_events see
        ON sce.user = see.user AND sce.stake_id = see.stake_id
      LEFT JOIN notification_state ns
        ON sce.user = ns.wallet AND sce.stake_id = ns.stake_id AND ns.event_type = 'maturity_7d'
      WHERE see.id IS NULL
        AND ns.id IS NULL
        AND (sce.slot + sce.days::bigint * ${slotsPerDay}) - ${currentSlot} <= ${warningSlots}
        AND (sce.slot + sce.days::bigint * ${slotsPerDay}) > ${currentSlot}
    `);

    const rows = stakes.rows ?? (stakes as unknown as any[]);

    let notified = 0;
    for (const stake of rows) {
      const maturitySlot = Number(stake.slot) + Number(stake.days) * slotsPerDay;
      const slotsRemaining = maturitySlot - currentSlot;
      const daysRemaining = Math.ceil(slotsRemaining / slotsPerDay);

      const formattedAmount = (Number(BigInt(stake.amount)) / 1e8).toLocaleString('en-US', {
        maximumFractionDigits: 2,
      });

      const payload: PushPayload = {
        title: 'Stake Maturing Soon',
        body: `Your ${formattedAmount} HELIX stake matures in ~${daysRemaining} days`,
        tag: `maturity-${stake.stake_id}`,
        data: {
          url: '/dashboard',
          eventType: 'maturity_7d',
          stakeId: Number(stake.stake_id),
        },
      };

      await dispatchToSubscribers([stake.user], payload, 'notifyMaturity');

      // Record in notificationState to prevent re-sending
      await db
        .insert(notificationState)
        .values({
          wallet: stake.user,
          stakeId: Number(stake.stake_id),
          eventType: 'maturity_7d',
        })
        .onConflictDoNothing();

      notified++;
    }

    logger.info(
      { currentSlot, slotsPerDay, stakesFound: rows.length, notified },
      'Maturity notification check complete',
    );
  } catch (err) {
    logger.error(
      { err: err instanceof Error ? err.message : String(err) },
      'checkMaturityNotifications failed',
    );
  }
}

// ---------------------------------------------------------------------------
// NOTIF-03: Late penalty 14-day window warning
// ---------------------------------------------------------------------------

/**
 * Check for stakes past maturity but within the 14-day late penalty window.
 * Deduplicates via notificationState (late_penalty).
 */
async function checkLatePenaltyNotifications(rpc: RpcClient): Promise<void> {
  try {
    const currentSlot = await rpc.getSlot();
    const slotsPerDay = await getSlotsPerDay();
    const lateWindowSlots = 14 * slotsPerDay;

    const stakes = await db.execute<{
      user: string;
      stake_id: number;
      amount: string;
      days: number;
      slot: number;
    }>(sql`
      SELECT
        sce.user,
        sce.stake_id,
        sce.amount,
        sce.days,
        sce.slot
      FROM stake_created_events sce
      LEFT JOIN stake_ended_events see
        ON sce.user = see.user AND sce.stake_id = see.stake_id
      LEFT JOIN notification_state ns
        ON sce.user = ns.wallet AND sce.stake_id = ns.stake_id AND ns.event_type = 'late_penalty'
      WHERE see.id IS NULL
        AND ns.id IS NULL
        AND ${currentSlot} > (sce.slot + sce.days::bigint * ${slotsPerDay})
        AND ${currentSlot} <= (sce.slot + sce.days::bigint * ${slotsPerDay} + ${lateWindowSlots})
    `);

    const rows = stakes.rows ?? (stakes as unknown as any[]);

    let notified = 0;
    for (const stake of rows) {
      const formattedAmount = (Number(BigInt(stake.amount)) / 1e8).toLocaleString('en-US', {
        maximumFractionDigits: 2,
      });

      const payload: PushPayload = {
        title: 'Late Penalty Warning',
        body: `Your ${formattedAmount} HELIX stake is past maturity. Late penalties are accumulating — unstake soon to avoid losses.`,
        tag: `late-penalty-${stake.stake_id}`,
        data: {
          url: '/dashboard/stakes',
          eventType: 'late_penalty',
          stakeId: Number(stake.stake_id),
        },
      };

      await dispatchToSubscribers([stake.user], payload, 'notifyLatePenalty');

      await db
        .insert(notificationState)
        .values({
          wallet: stake.user,
          stakeId: Number(stake.stake_id),
          eventType: 'late_penalty',
        })
        .onConflictDoNothing();

      notified++;
    }

    logger.info(
      { currentSlot, slotsPerDay, stakesFound: rows.length, notified },
      'Late penalty notification check complete',
    );
  } catch (err) {
    logger.error(
      { err: err instanceof Error ? err.message : String(err) },
      'checkLatePenaltyNotifications failed',
    );
  }
}

// ---------------------------------------------------------------------------
// NOTIF-05: BPD seal_complete (scheduler-detected, 24h after BpdBatchFinalized)
// ---------------------------------------------------------------------------

/**
 * Check if 24 hours have passed since the most recent BpdBatchFinalized event
 * and dispatch a seal_complete notification if not already sent for this cycle.
 */
async function checkSealCompleteNotifications(): Promise<void> {
  try {
    const rows = await db
      .select({ createdAt: bpdBatchFinalizedEvents.createdAt })
      .from(bpdBatchFinalizedEvents)
      .orderBy(sql`${bpdBatchFinalizedEvents.id} DESC`)
      .limit(1);

    if (rows.length === 0) {
      return; // No BPD finalization recorded yet
    }

    const { createdAt } = rows[0];
    const twentyFourHoursLater = new Date(createdAt.getTime() + 24 * 60 * 60 * 1000);

    if (new Date() < twentyFourHoursLater) {
      return; // 24h window not yet elapsed
    }

    // Check if we already sent a seal_complete notification for this finalization cycle.
    // The anchor is createdAt - 1 hour to catch notifications sent slightly before the 24h mark.
    const anchorTime = new Date(createdAt.getTime() - 60 * 60 * 1000);

    const existing = await db
      .select({ id: notificationState.id })
      .from(notificationState)
      .where(
        and(
          eq(notificationState.wallet, '__global__'),
          eq(notificationState.stakeId, 0),
          eq(notificationState.eventType, 'seal_complete'),
          sql`${notificationState.sentAt} > ${anchorTime}`,
        ),
      )
      .limit(1);

    if (existing.length > 0) {
      return; // Already sent for this cycle
    }

    // Send the seal_complete notification
    await sendBpdTransitionNotification('seal_complete');

    // Record to prevent re-sending
    await db
      .insert(notificationState)
      .values({
        wallet: '__global__',
        stakeId: 0,
        eventType: 'seal_complete',
      })
      .onConflictDoNothing();

    logger.info({ createdAt }, 'Seal complete notification dispatched');
  } catch (err) {
    logger.error(
      { err: err instanceof Error ? err.message : String(err) },
      'checkSealCompleteNotifications failed',
    );
  }
}

// ---------------------------------------------------------------------------
// NOTIF-05: BPD phase transition notifications (event-driven)
// ---------------------------------------------------------------------------

/**
 * Dispatch a BPD phase transition notification to all users with notifyBpd enabled.
 * Called from the event processor on BpdBatchFinalized and BigPayDayDistributed events.
 * Also called internally for seal_complete by the scheduler.
 */
export async function sendBpdTransitionNotification(
  eventType: 'finalization_started' | 'seal_complete' | 'distribution_complete',
): Promise<void> {
  if (!isPushEnabled()) return;

  const messages: Record<
    'finalization_started' | 'seal_complete' | 'distribution_complete',
    { title: string; body: string }
  > = {
    finalization_started: {
      title: 'BPD Update',
      body: 'Big Pay Day finalization has started. The protocol is calculating your share of unclaimed tokens.',
    },
    seal_complete: {
      title: 'BPD Update',
      body: 'Big Pay Day observation window is complete. Distribution will begin shortly.',
    },
    distribution_complete: {
      title: 'BPD Complete!',
      body: 'Big Pay Day distribution is complete! Check your rewards in the dashboard.',
    },
  };

  const { title, body } = messages[eventType];

  const payload: PushPayload = {
    title,
    body,
    tag: `bpd-${eventType}`,
    data: {
      url: '/dashboard/rewards',
      eventType,
    },
  };

  // Get all unique wallets with BPD notifications enabled
  const subs = await db
    .select({ wallet: pushSubscriptions.wallet })
    .from(pushSubscriptions)
    .where(eq(pushSubscriptions.notifyBpd, true));

  const wallets = [...new Set(subs.map((s) => s.wallet))];

  if (wallets.length === 0) {
    return;
  }

  await dispatchToSubscribers(wallets, payload, 'notifyBpd');

  logger.info({ eventType, wallets: wallets.length }, 'BPD transition notification dispatched');
}

// ---------------------------------------------------------------------------
// NOTIF-04: Rewards available (triggered from InflationDistributed event)
// ---------------------------------------------------------------------------

/**
 * Dispatch a rewards-available notification to subscribers.
 * Throttled: only sends if lastRewardsNotifiedAt is NULL or > 6 hours ago.
 * Updates lastRewardsNotifiedAt after successful dispatch.
 */
export async function sendRewardsNotification(): Promise<void> {
  if (!isPushEnabled()) return;

  // Filter subscriptions: notifyRewards enabled AND (never notified OR notified > 6h ago)
  const eligibleSubs = await db
    .select({ id: pushSubscriptions.id, wallet: pushSubscriptions.wallet })
    .from(pushSubscriptions)
    .where(
      and(
        eq(pushSubscriptions.notifyRewards, true),
        sql`(${pushSubscriptions.lastRewardsNotifiedAt} IS NULL
          OR ${pushSubscriptions.lastRewardsNotifiedAt} < NOW() - INTERVAL '6 hours')`,
      ),
    );

  if (eligibleSubs.length === 0) {
    return;
  }

  const wallets = [...new Set(eligibleSubs.map((s) => s.wallet))];
  const subIds = eligibleSubs.map((s) => s.id);

  const payload: PushPayload = {
    title: 'Rewards Available',
    body: 'New staking rewards have been distributed. Check your dashboard to claim.',
    tag: 'rewards-available',
    data: {
      url: '/dashboard/rewards',
      eventType: 'rewards_available',
    },
  };

  await dispatchToSubscribers(wallets, payload, 'notifyRewards');

  // Update lastRewardsNotifiedAt for all dispatched subscriptions
  await db
    .update(pushSubscriptions)
    .set({ lastRewardsNotifiedAt: sql`NOW()` })
    .where(
      and(
        inArray(pushSubscriptions.id, subIds),
        eq(pushSubscriptions.notifyRewards, true),
      ),
    );

  logger.info({ wallets: wallets.length, subs: eligibleSubs.length }, 'Rewards notification dispatched');
}

// ---------------------------------------------------------------------------
// Scheduler startup
// ---------------------------------------------------------------------------

/**
 * Start the notification scheduler.
 * Schedules checks every 15 minutes for:
 *   - Stake maturity warnings (7 days before maturity)
 *   - Late penalty entry warnings (14-day window after maturity)
 *   - BPD seal_complete detection (24h after BpdBatchFinalized)
 *
 * No-ops if VAPID keys are not configured.
 */
export function startNotificationScheduler(): void {
  if (!isPushEnabled()) {
    logger.warn('Push not configured, notification scheduler disabled');
    return;
  }

  const rpc = createRpcClient(env.RPC_URL);

  cron.schedule('*/15 * * * *', async () => {
    try {
      await checkMaturityNotifications(rpc);
      await checkLatePenaltyNotifications(rpc);
      await checkSealCompleteNotifications();
    } catch (err) {
      logger.error(
        { err: err instanceof Error ? err.message : String(err) },
        'Notification scheduler tick failed',
      );
    }
  });

  logger.info('Notification scheduler started (15-min interval)');
}
