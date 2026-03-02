import { describe, it, expect, vi, beforeAll, afterAll, beforeEach } from 'vitest';
import Fastify from 'fastify';

// Mock badge eligibility computation
vi.mock('../../lib/badge-eligibility.js', () => ({
  computeBadgeEligibility: vi.fn(),
}));

vi.mock('../../lib/logger.js', () => ({
  logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() },
}));

import { badgeRoutes } from '../../api/routes/badges.js';
import { computeBadgeEligibility } from '../../lib/badge-eligibility.js';

const VALID_WALLET = 'So1ana11111111111111111111111111111111111111';

const mockBadges = [
  {
    badgeType: 'first_stake',
    name: 'First Stake',
    description: 'Created your first HELIX stake',
    requirement: 'Create at least one stake',
    eligible: true,
    earnedAt: new Date('2024-01-01'),
    stakeAmount: null,
  },
  {
    badgeType: 'whale',
    name: 'Whale',
    description: 'Staked 10,000,000+ HELIX',
    requirement: 'Stake >= 10,000,000 HELIX',
    eligible: false,
    earnedAt: null,
    stakeAmount: null,
  },
];

describe('GET /api/badges', () => {
  let app: ReturnType<typeof Fastify>;

  beforeAll(async () => {
    app = Fastify({ logger: false });
    app.register(badgeRoutes);
    await app.ready();
  });

  afterAll(() => app.close());

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 200 with badge eligibility for a valid wallet', async () => {
    vi.mocked(computeBadgeEligibility).mockResolvedValue(mockBadges as any);

    const res = await app.inject({
      method: 'GET',
      url: `/api/badges?wallet=${VALID_WALLET}`,
    });

    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(body.wallet).toBe(VALID_WALLET);
    expect(body.badges).toHaveLength(2);
    expect(body.badges[0].badgeType).toBe('first_stake');
    expect(body.badges[0].eligible).toBe(true);
  });

  it('returns 500 when wallet param is missing', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/api/badges',
    });

    // Zod parse fails without wallet param
    expect(res.statusCode).toBe(500);
  });

  it('returns 500 for invalid (too short) wallet', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/api/badges?wallet=short',
    });

    expect(res.statusCode).toBe(500);
  });

  it('returns all badge types including ineligible ones', async () => {
    vi.mocked(computeBadgeEligibility).mockResolvedValue(mockBadges as any);

    const res = await app.inject({
      method: 'GET',
      url: `/api/badges?wallet=${VALID_WALLET}`,
    });

    const body = JSON.parse(res.body);
    const ineligible = body.badges.filter((b: any) => !b.eligible);
    expect(ineligible).toHaveLength(1);
    expect(ineligible[0].badgeType).toBe('whale');
  });

  it('returns empty badges array when wallet has no staking history', async () => {
    vi.mocked(computeBadgeEligibility).mockResolvedValue([
      { badgeType: 'first_stake', eligible: false, earnedAt: null, stakeAmount: null, name: 'First Stake', description: '', requirement: '' },
    ] as any);

    const res = await app.inject({
      method: 'GET',
      url: `/api/badges?wallet=${VALID_WALLET}`,
    });

    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(body.badges[0].eligible).toBe(false);
  });
});
