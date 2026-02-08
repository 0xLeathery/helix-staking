import { desc } from 'drizzle-orm';
import { db } from '../db/client.js';
import {
  protocolInitializedEvents,
  stakeCreatedEvents,
  stakeEndedEvents,
  rewardsClaimedEvents,
  inflationDistributedEvents,
  adminMintedEvents,
  claimPeriodStartedEvents,
  tokensClaimedEvents,
  vestedTokensWithdrawnEvents,
  claimPeriodEndedEvents,
  bigPayDayDistributedEvents,
} from '../db/schema.js';
import { logger } from '../lib/logger.js';

/**
 * Convert a value to string representation for storage.
 *
 * Handles BN objects (with toString method), Pubkeys (toBase58/toString),
 * byte arrays (hex encoding for merkle roots), and plain values.
 */
function toStr(val: any): string {
  if (val == null) return '';
  if (typeof val === 'string') return val;
  if (typeof val === 'number' || typeof val === 'bigint') return val.toString();
  // BN, PublicKey, or any object with toString
  if (typeof val.toBase58 === 'function') return val.toBase58();
  if (typeof val.toString === 'function' && val.constructor?.name !== 'Object') {
    return val.toString();
  }
  // Byte arrays (e.g., merkle root [u8; 32])
  if (Array.isArray(val)) {
    return Buffer.from(val).toString('hex');
  }
  return String(val);
}

/**
 * Convert a value to a number for integer columns.
 */
function toNum(val: any): number {
  if (typeof val === 'number') return val;
  if (typeof val === 'bigint') return Number(val);
  if (val && typeof val.toNumber === 'function') return val.toNumber();
  return Number(val);
}

/**
 * Route a decoded event to the correct database table with idempotent insert.
 *
 * Each insert uses onConflictDoNothing on the signature unique constraint
 * so duplicate processing is silently skipped.
 *
 * BN values are converted to strings for text columns.
 * Pubkey values are converted via toBase58/toString.
 */
export async function processEvent(
  event: { name: string; data: any; slot: number },
  signature: string,
): Promise<void> {
  const { name, data, slot } = event;

  try {
    switch (name) {
      case 'ProtocolInitialized':
        await db
          .insert(protocolInitializedEvents)
          .values({
            signature,
            slot,
            globalState: toStr(data.globalState),
            mint: toStr(data.mint),
            mintAuthority: toStr(data.mintAuthority),
            authority: toStr(data.authority),
            annualInflationBp: toStr(data.annualInflationBp),
            minStakeAmount: toStr(data.minStakeAmount),
            startingShareRate: toStr(data.startingShareRate),
            slotsPerDay: toStr(data.slotsPerDay),
          })
          .onConflictDoNothing();
        break;

      case 'StakeCreated':
        await db
          .insert(stakeCreatedEvents)
          .values({
            signature,
            slot,
            user: toStr(data.user),
            stakeId: toNum(data.stakeId),
            amount: toStr(data.amount),
            tShares: toStr(data.tShares),
            days: toNum(data.days),
            shareRate: toStr(data.shareRate),
          })
          .onConflictDoNothing();
        break;

      case 'StakeEnded':
        await db
          .insert(stakeEndedEvents)
          .values({
            signature,
            slot,
            user: toStr(data.user),
            stakeId: toNum(data.stakeId),
            originalAmount: toStr(data.originalAmount),
            returnAmount: toStr(data.returnAmount),
            penaltyAmount: toStr(data.penaltyAmount),
            penaltyType: toNum(data.penaltyType),
            rewardsClaimed: toStr(data.rewardsClaimed),
          })
          .onConflictDoNothing();
        break;

      case 'RewardsClaimed':
        await db
          .insert(rewardsClaimedEvents)
          .values({
            signature,
            slot,
            user: toStr(data.user),
            stakeId: toNum(data.stakeId),
            amount: toStr(data.amount),
          })
          .onConflictDoNothing();
        break;

      case 'InflationDistributed': {
        await db
          .insert(inflationDistributedEvents)
          .values({
            signature,
            slot,
            day: toNum(data.day),
            daysElapsed: toNum(data.daysElapsed),
            amount: toStr(data.amount),
            newShareRate: toStr(data.newShareRate),
            totalShares: toStr(data.totalShares),
          })
          .onConflictDoNothing();

        // Gap detection: check if there's a gap between this day and the
        // previous distribution that isn't explained by daysElapsed
        await detectInflationGap(toNum(data.day), toNum(data.daysElapsed));
        break;
      }

      case 'AdminMinted':
        await db
          .insert(adminMintedEvents)
          .values({
            signature,
            slot,
            authority: toStr(data.authority),
            recipient: toStr(data.recipient),
            amount: toStr(data.amount),
          })
          .onConflictDoNothing();
        break;

      case 'ClaimPeriodStarted':
        await db
          .insert(claimPeriodStartedEvents)
          .values({
            signature,
            slot,
            timestamp: toNum(data.timestamp),
            claimPeriodId: toNum(data.claimPeriodId),
            merkleRoot: toStr(data.merkleRoot),
            totalClaimable: toStr(data.totalClaimable),
            totalEligible: toNum(data.totalEligible),
            claimDeadlineSlot: toStr(data.claimDeadlineSlot),
          })
          .onConflictDoNothing();
        break;

      case 'TokensClaimed':
        await db
          .insert(tokensClaimedEvents)
          .values({
            signature,
            slot,
            timestamp: toNum(data.timestamp),
            claimer: toStr(data.claimer),
            snapshotWallet: toStr(data.snapshotWallet),
            claimPeriodId: toNum(data.claimPeriodId),
            snapshotBalance: toStr(data.snapshotBalance),
            baseAmount: toStr(data.baseAmount),
            bonusBps: toNum(data.bonusBps),
            daysElapsed: toNum(data.daysElapsed),
            totalAmount: toStr(data.totalAmount),
            immediateAmount: toStr(data.immediateAmount),
            vestingAmount: toStr(data.vestingAmount),
            vestingEndSlot: toStr(data.vestingEndSlot),
          })
          .onConflictDoNothing();
        break;

      case 'VestedTokensWithdrawn':
        await db
          .insert(vestedTokensWithdrawnEvents)
          .values({
            signature,
            slot,
            timestamp: toNum(data.timestamp),
            claimer: toStr(data.claimer),
            amount: toStr(data.amount),
            totalVested: toStr(data.totalVested),
            totalWithdrawn: toStr(data.totalWithdrawn),
            remaining: toStr(data.remaining),
          })
          .onConflictDoNothing();
        break;

      case 'ClaimPeriodEnded':
        await db
          .insert(claimPeriodEndedEvents)
          .values({
            signature,
            slot,
            timestamp: toNum(data.timestamp),
            claimPeriodId: toNum(data.claimPeriodId),
            totalClaimed: toStr(data.totalClaimed),
            claimsCount: toNum(data.claimsCount),
            unclaimedAmount: toStr(data.unclaimedAmount),
          })
          .onConflictDoNothing();
        break;

      case 'BigPayDayDistributed':
        await db
          .insert(bigPayDayDistributedEvents)
          .values({
            signature,
            slot,
            timestamp: toNum(data.timestamp),
            claimPeriodId: toNum(data.claimPeriodId),
            totalUnclaimed: toStr(data.totalUnclaimed),
            totalEligibleShareDays: toStr(data.totalEligibleShareDays),
            helixPerShareDay: toStr(data.helixPerShareDay),
            eligibleStakers: toNum(data.eligibleStakers),
          })
          .onConflictDoNothing();
        break;

      default:
        logger.warn({ eventName: name, signature }, 'Unknown event type, skipping');
        return;
    }

    logger.debug({ event: name, signature, slot }, 'Event processed');
  } catch (error) {
    logger.error(
      {
        event: name,
        signature,
        slot,
        error: error instanceof Error ? error.message : String(error),
      },
      'Failed to process event',
    );
  }
}

/**
 * Check for gaps in InflationDistributed events.
 *
 * Queries the previous day's distribution and warns if the gap between
 * the current day and the previous day exceeds daysElapsed.
 * This is informational only -- it does not take corrective action.
 */
async function detectInflationGap(
  currentDay: number,
  daysElapsed: number,
): Promise<void> {
  try {
    // Query the 2 most recent distributions by day.
    // The first may be the one we just inserted, so we grab 2 and skip current.
    const previous = await db
      .select({ day: inflationDistributedEvents.day })
      .from(inflationDistributedEvents)
      .orderBy(desc(inflationDistributedEvents.day))
      .limit(2);

    // Find the previous day that isn't the current one
    const prevRow = previous.find((r) => r.day !== currentDay);

    if (prevRow) {
      const gap = currentDay - prevRow.day;
      if (gap > daysElapsed) {
        logger.warn(
          {
            currentDay,
            previousDay: prevRow.day,
            expectedGap: daysElapsed,
            actualGap: gap,
          },
          'Potential gap detected in InflationDistributed events',
        );
      }
    }
  } catch (error) {
    // Gap detection is non-critical -- log and move on
    logger.debug(
      { error: error instanceof Error ? error.message : String(error) },
      'Gap detection query failed (non-critical)',
    );
  }
}
