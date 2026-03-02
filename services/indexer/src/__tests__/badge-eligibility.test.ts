import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../db/client.js', () => ({
  db: {
    select: vi.fn(),
    insert: vi.fn(),
    execute: vi.fn(),
  },
}));

vi.mock('../lib/logger.js', () => ({
  logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() },
}));

import { computeBadgeEligibility, BADGE_TYPES, TIER_THRESHOLDS } from '../lib/badge-eligibility.js';
import { db } from '../db/client.js';

describe('computeBadgeEligibility', () => {
  const WALLET = 'So1ana11111111111111111111111111111111111111';

  beforeEach(() => {
    vi.clearAllMocks();
    // Default: no stakes
    vi.mocked(db.select).mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          orderBy: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([]),
          }),
          limit: vi.fn().mockResolvedValue([]),
        }),
        limit: vi.fn().mockResolvedValue([]),
        orderBy: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue([]),
        }),
      }),
    } as any);

    vi.mocked(db.execute).mockResolvedValue({ rows: [] } as any);

    vi.mocked(db.insert).mockReturnValue({
      values: vi.fn().mockReturnValue({
        onConflictDoUpdate: vi.fn().mockResolvedValue(undefined),
      }),
    } as any);
  });

  it('returns results for all 8 badge types', async () => {
    let selectCallCount = 0;
    vi.mocked(db.select).mockImplementation(() => {
      selectCallCount++;
      // firstStake count query
      if (selectCallCount === 1) {
        return {
          from: vi.fn().mockReturnValue({
            where: vi.fn().mockResolvedValue([{ cnt: 0, earnedAt: null }]),
          }),
        } as any;
      }
      // BPD check
      if (selectCallCount === 2) {
        return {
          from: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([]),
          }),
        } as any;
      }
      // Largest stake
      if (selectCallCount === 3) {
        return {
          from: vi.fn().mockReturnValue({
            where: vi.fn().mockReturnValue({
              orderBy: vi.fn().mockReturnValue({
                limit: vi.fn().mockResolvedValue([]),
              }),
            }),
          }),
        } as any;
      }
      return {
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([{ cnt: 0 }]),
          limit: vi.fn().mockResolvedValue([]),
        }),
      } as any;
    });

    vi.mocked(db.execute).mockResolvedValue({ rows: [] } as any);

    const result = await computeBadgeEligibility(WALLET);

    expect(result).toHaveLength(8);
    const types = result.map((r) => r.badgeType);
    for (const t of BADGE_TYPES) {
      expect(types).toContain(t);
    }
  });

  it('first_stake badge is eligible when user has staked', async () => {
    const earnedAt = new Date('2024-01-01');
    let selectCallCount = 0;

    vi.mocked(db.select).mockImplementation(() => {
      selectCallCount++;
      if (selectCallCount === 1) {
        // firstStake count
        return {
          from: vi.fn().mockReturnValue({
            where: vi.fn().mockResolvedValue([{ cnt: 1, earnedAt }]),
          }),
        } as any;
      }
      if (selectCallCount === 2) {
        // BPD: no events
        return {
          from: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([]),
          }),
        } as any;
      }
      if (selectCallCount === 3) {
        // Largest stake: not enough for any tier
        return {
          from: vi.fn().mockReturnValue({
            where: vi.fn().mockReturnValue({
              orderBy: vi.fn().mockReturnValue({
                limit: vi.fn().mockResolvedValue([{ amount: '1000', earnedAt }]),
              }),
            }),
          }),
        } as any;
      }
      return {
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([]),
          limit: vi.fn().mockResolvedValue([]),
        }),
      } as any;
    });

    vi.mocked(db.execute).mockResolvedValue({ rows: [] } as any);

    const result = await computeBadgeEligibility(WALLET);
    const firstStake = result.find((r) => r.badgeType === 'first_stake');

    expect(firstStake?.eligible).toBe(true);
    expect(firstStake?.earnedAt).toEqual(earnedAt);
  });

  it('365_day badge eligible when completed 365-day stake', async () => {
    const endedAt = new Date('2025-06-01');
    let selectCallCount = 0;

    vi.mocked(db.select).mockImplementation(() => {
      selectCallCount++;
      if (selectCallCount === 1) {
        return {
          from: vi.fn().mockReturnValue({
            where: vi.fn().mockResolvedValue([{ cnt: 1, earnedAt: new Date() }]),
          }),
        } as any;
      }
      if (selectCallCount === 2) {
        return {
          from: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([]),
          }),
        } as any;
      }
      if (selectCallCount === 3) {
        return {
          from: vi.fn().mockReturnValue({
            where: vi.fn().mockReturnValue({
              orderBy: vi.fn().mockReturnValue({
                limit: vi.fn().mockResolvedValue([]),
              }),
            }),
          }),
        } as any;
      }
      return {
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([]),
          limit: vi.fn().mockResolvedValue([]),
        }),
      } as any;
    });

    // 365_day badge uses db.execute
    vi.mocked(db.execute).mockResolvedValue({
      rows: [{ ended_at: endedAt }],
    } as any);

    const result = await computeBadgeEligibility(WALLET);
    const badge365 = result.find((r) => r.badgeType === '365_day');

    expect(badge365?.eligible).toBe(true);
    expect(badge365?.earnedAt).toEqual(endedAt);
  });

  it('bpd badge eligible when user staked before BPD event', async () => {
    const stakeDate = new Date('2024-10-01');
    let selectCallCount = 0;

    vi.mocked(db.select).mockImplementation(() => {
      selectCallCount++;
      if (selectCallCount === 1) {
        return {
          from: vi.fn().mockReturnValue({
            where: vi.fn().mockResolvedValue([{ cnt: 1, earnedAt: stakeDate }]),
          }),
        } as any;
      }
      if (selectCallCount === 2) {
        // BPD event exists
        return {
          from: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([{ slot: 5000000 }]),
          }),
        } as any;
      }
      if (selectCallCount === 3) {
        // Stake before BPD
        return {
          from: vi.fn().mockReturnValue({
            where: vi.fn().mockReturnValue({
              limit: vi.fn().mockResolvedValue([{ earnedAt: stakeDate }]),
            }),
          }),
        } as any;
      }
      if (selectCallCount === 4) {
        // Largest stake: no tier
        return {
          from: vi.fn().mockReturnValue({
            where: vi.fn().mockReturnValue({
              orderBy: vi.fn().mockReturnValue({
                limit: vi.fn().mockResolvedValue([]),
              }),
            }),
          }),
        } as any;
      }
      return {
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([]),
          limit: vi.fn().mockResolvedValue([]),
        }),
      } as any;
    });

    vi.mocked(db.execute).mockResolvedValue({ rows: [] } as any);

    const result = await computeBadgeEligibility(WALLET);
    const bpdBadge = result.find((r) => r.badgeType === 'bpd');

    expect(bpdBadge?.eligible).toBe(true);
  });

  it('tier badges eligible based on stake amount thresholds', async () => {
    const stakeDate = new Date('2024-12-01');
    const shrimpAmount = TIER_THRESHOLDS['shrimp']; // 100000000000 (1K HELIX)
    let selectCallCount = 0;

    vi.mocked(db.select).mockImplementation(() => {
      selectCallCount++;
      if (selectCallCount === 1) {
        return {
          from: vi.fn().mockReturnValue({
            where: vi.fn().mockResolvedValue([{ cnt: 1, earnedAt: stakeDate }]),
          }),
        } as any;
      }
      if (selectCallCount === 2) {
        return {
          from: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([]),
          }),
        } as any;
      }
      if (selectCallCount === 3) {
        // Largest stake = exactly shrimp threshold
        return {
          from: vi.fn().mockReturnValue({
            where: vi.fn().mockReturnValue({
              orderBy: vi.fn().mockReturnValue({
                limit: vi.fn().mockResolvedValue([{ amount: shrimpAmount, earnedAt: stakeDate }]),
              }),
            }),
          }),
        } as any;
      }
      return {
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([]),
          limit: vi.fn().mockResolvedValue([]),
        }),
      } as any;
    });

    vi.mocked(db.execute).mockResolvedValue({ rows: [] } as any);

    const result = await computeBadgeEligibility(WALLET);
    const shrimp = result.find((r) => r.badgeType === 'shrimp');
    const fish = result.find((r) => r.badgeType === 'fish');
    const whale = result.find((r) => r.badgeType === 'whale');

    expect(shrimp?.eligible).toBe(true);
    expect(shrimp?.stakeAmount).toBe(shrimpAmount);
    expect(fish?.eligible).toBe(false); // below 10K threshold
    expect(whale?.eligible).toBe(false);
  });

  it('upserts all badge results to badge_eligibility table', async () => {
    let selectCallCount = 0;
    vi.mocked(db.select).mockImplementation(() => {
      selectCallCount++;
      if (selectCallCount === 1) {
        return {
          from: vi.fn().mockReturnValue({
            where: vi.fn().mockResolvedValue([{ cnt: 0, earnedAt: null }]),
          }),
        } as any;
      }
      if (selectCallCount === 2) {
        return {
          from: vi.fn().mockReturnValue({ limit: vi.fn().mockResolvedValue([]) }),
        } as any;
      }
      if (selectCallCount === 3) {
        return {
          from: vi.fn().mockReturnValue({
            where: vi.fn().mockReturnValue({
              orderBy: vi.fn().mockReturnValue({
                limit: vi.fn().mockResolvedValue([]),
              }),
            }),
          }),
        } as any;
      }
      return {
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([]),
          limit: vi.fn().mockResolvedValue([]),
        }),
      } as any;
    });

    vi.mocked(db.execute).mockResolvedValue({ rows: [] } as any);

    const onConflictDoUpdate = vi.fn().mockResolvedValue(undefined);
    const values = vi.fn().mockReturnValue({ onConflictDoUpdate });
    vi.mocked(db.insert).mockReturnValue({ values } as any);

    await computeBadgeEligibility(WALLET);

    expect(db.insert).toHaveBeenCalled();
    expect(values).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ wallet: WALLET }),
      ]),
    );
  });
});

describe('BADGE_TYPES and TIER_THRESHOLDS', () => {
  it('exports all expected badge types', () => {
    expect(BADGE_TYPES).toContain('first_stake');
    expect(BADGE_TYPES).toContain('365_day');
    expect(BADGE_TYPES).toContain('bpd');
    expect(BADGE_TYPES).toContain('shrimp');
    expect(BADGE_TYPES).toContain('fish');
    expect(BADGE_TYPES).toContain('dolphin');
    expect(BADGE_TYPES).toContain('shark');
    expect(BADGE_TYPES).toContain('whale');
  });

  it('tier thresholds are in ascending order', () => {
    const shrimp = BigInt(TIER_THRESHOLDS['shrimp']);
    const fish = BigInt(TIER_THRESHOLDS['fish']);
    const dolphin = BigInt(TIER_THRESHOLDS['dolphin']);
    const shark = BigInt(TIER_THRESHOLDS['shark']);
    const whale = BigInt(TIER_THRESHOLDS['whale']);

    expect(shrimp < fish).toBe(true);
    expect(fish < dolphin).toBe(true);
    expect(dolphin < shark).toBe(true);
    expect(shark < whale).toBe(true);
  });
});
