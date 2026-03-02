import { eq, count, sql, and, lt } from 'drizzle-orm';
import { db } from '../db/client.js';
import {
  badgeEligibility,
  stakeCreatedEvents,
  stakeEndedEvents,
  bigPayDayDistributedEvents,
} from '../db/schema.js';

// ---------------------------------------------------------------------------
// Badge type constants
// ---------------------------------------------------------------------------
export const BADGE_TYPES = [
  'first_stake',
  '365_day',
  'bpd',
  'shrimp',
  'fish',
  'dolphin',
  'shark',
  'whale',
] as const;

export type BadgeType = (typeof BADGE_TYPES)[number];

// Tier thresholds in base units (8 decimals)
// Shrimp >= 1K, Fish >= 10K, Dolphin >= 100K, Shark >= 1M, Whale >= 10M HELIX
export const TIER_THRESHOLDS: Record<string, string> = {
  shrimp:  '100000000000',      // 1K * 10^8
  fish:    '1000000000000',     // 10K * 10^8
  dolphin: '10000000000000',    // 100K * 10^8
  shark:   '100000000000000',   // 1M * 10^8
  whale:   '1000000000000000',  // 10M * 10^8
};

// Human-readable badge metadata (used by frontend and API)
export const BADGE_META: Record<BadgeType, { name: string; description: string; requirement: string }> = {
  first_stake: { name: 'First Stake', description: 'Created your first HELIX stake', requirement: 'Create at least one stake' },
  '365_day':   { name: '365-Day Staker', description: 'Completed a stake of 365+ days', requirement: 'Complete a stake with 365+ day commitment' },
  bpd:         { name: 'Big Pay Day', description: 'Received a Big Pay Day distribution', requirement: 'Have an active stake during a BPD event' },
  shrimp:      { name: 'Shrimp', description: 'Staked 1,000+ HELIX in a single stake', requirement: 'Stake >= 1,000 HELIX' },
  fish:        { name: 'Fish', description: 'Staked 10,000+ HELIX in a single stake', requirement: 'Stake >= 10,000 HELIX' },
  dolphin:     { name: 'Dolphin', description: 'Staked 100,000+ HELIX in a single stake', requirement: 'Stake >= 100,000 HELIX' },
  shark:       { name: 'Shark', description: 'Staked 1,000,000+ HELIX in a single stake', requirement: 'Stake >= 1,000,000 HELIX' },
  whale:       { name: 'Whale', description: 'Staked 10,000,000+ HELIX in a single stake', requirement: 'Stake >= 10,000,000 HELIX' },
};

// ---------------------------------------------------------------------------
// Result type
// ---------------------------------------------------------------------------
export interface BadgeEligibilityResult {
  badgeType: BadgeType;
  name: string;
  description: string;
  requirement: string;
  eligible: boolean;
  earnedAt: Date | null;
  stakeAmount: string | null; // for tier badges
}

// ---------------------------------------------------------------------------
// Main computation function
// ---------------------------------------------------------------------------
export async function computeBadgeEligibility(wallet: string): Promise<BadgeEligibilityResult[]> {
  const results: BadgeEligibilityResult[] = [];

  // -------------------------------------------------------------------------
  // 1. first_stake: wallet has at least one stake_created_events row
  // -------------------------------------------------------------------------
  const firstStakeRows = await db
    .select({ cnt: count(), earnedAt: sql<Date | null>`MIN(created_at)` })
    .from(stakeCreatedEvents)
    .where(eq(stakeCreatedEvents.user, wallet));

  const firstStakeCount = Number(firstStakeRows[0]?.cnt ?? 0);
  const firstStakeEarnedAt = firstStakeRows[0]?.earnedAt ?? null;

  results.push({
    badgeType: 'first_stake',
    ...BADGE_META['first_stake'],
    eligible: firstStakeCount > 0,
    earnedAt: firstStakeEarnedAt,
    stakeAmount: null,
  });

  // -------------------------------------------------------------------------
  // 2. 365_day: wallet has completed (stakeEnded) a stake with days >= 365
  //    Join on stakeId AND user — stakeId is per-user, not globally unique
  // -------------------------------------------------------------------------
  const longStakeRows = await db.execute(sql`
    SELECT see.created_at AS ended_at
    FROM stake_ended_events see
    JOIN stake_created_events sce
      ON sce.stake_id = see.stake_id
      AND sce.user = see.user
    WHERE see.user = ${wallet}
      AND sce.days >= 365
    LIMIT 1
  `);

  const longStake = (longStakeRows as unknown as { rows: Array<{ ended_at: Date | null }> }).rows[0] ?? null;

  results.push({
    badgeType: '365_day',
    ...BADGE_META['365_day'],
    eligible: longStake !== null,
    earnedAt: longStake?.ended_at ?? null,
    stakeAmount: null,
  });

  // -------------------------------------------------------------------------
  // 3. bpd: wallet had a stake_created_events with slot < any BPD event slot
  //    Simplification: just check if any BPD event exists AND user has any stake
  //    with slot less than any BPD slot.
  // -------------------------------------------------------------------------
  const bpdRows = await db
    .select({ slot: bigPayDayDistributedEvents.slot })
    .from(bigPayDayDistributedEvents)
    .limit(1);

  let bpdEligible = false;
  let bpdEarnedAt: Date | null = null;

  if (bpdRows.length > 0) {
    const bpdSlot = bpdRows[0].slot;
    const stakeBeforeBpd = await db
      .select({ earnedAt: stakeCreatedEvents.createdAt })
      .from(stakeCreatedEvents)
      .where(and(
        eq(stakeCreatedEvents.user, wallet),
        lt(stakeCreatedEvents.slot, bpdSlot),
      ))
      .limit(1);

    if (stakeBeforeBpd.length > 0) {
      bpdEligible = true;
      bpdEarnedAt = stakeBeforeBpd[0].earnedAt;
    }
  }

  results.push({
    badgeType: 'bpd',
    ...BADGE_META['bpd'],
    eligible: bpdEligible,
    earnedAt: bpdEarnedAt,
    stakeAmount: null,
  });

  // -------------------------------------------------------------------------
  // 4. Tier badges: find the largest single stake amount for this wallet
  //    Compare against each tier threshold using BigInt
  // -------------------------------------------------------------------------
  const largestStakeRows = await db
    .select({ amount: stakeCreatedEvents.amount, earnedAt: stakeCreatedEvents.createdAt })
    .from(stakeCreatedEvents)
    .where(eq(stakeCreatedEvents.user, wallet))
    .orderBy(sql`amount::numeric DESC`)
    .limit(1);

  const largestAmount = largestStakeRows[0]?.amount ?? null;
  const largestAmountEarnedAt = largestStakeRows[0]?.earnedAt ?? null;
  const largestAmountBigInt = largestAmount !== null ? BigInt(largestAmount) : BigInt(0);

  const tierBadges: BadgeType[] = ['shrimp', 'fish', 'dolphin', 'shark', 'whale'];
  for (const tier of tierBadges) {
    const threshold = BigInt(TIER_THRESHOLDS[tier]);
    const isEligible = largestAmountBigInt >= threshold;
    results.push({
      badgeType: tier,
      ...BADGE_META[tier],
      eligible: isEligible,
      earnedAt: isEligible ? largestAmountEarnedAt : null,
      stakeAmount: isEligible ? largestAmount : null,
    });
  }

  // -------------------------------------------------------------------------
  // Upsert all results into badge_eligibility table for caching
  // -------------------------------------------------------------------------
  const upsertRows = results.map((r) => ({
    wallet,
    badgeType: r.badgeType,
    eligible: r.eligible,
    earnedAt: r.earnedAt,
    stakeAmount: r.stakeAmount,
    computedAt: new Date(),
  }));

  await db
    .insert(badgeEligibility)
    .values(upsertRows)
    .onConflictDoUpdate({
      target: [badgeEligibility.wallet, badgeEligibility.badgeType],
      set: {
        eligible: sql`excluded.eligible`,
        earnedAt: sql`excluded.earned_at`,
        stakeAmount: sql`excluded.stake_amount`,
        computedAt: sql`NOW()`,
      },
    });

  return results;
}
