export interface HistoryEntry {
  day: number;
  shareRate: string;
  totalShares: string;
  amount: string;
}

export interface DistributionBucket {
  bucket: string;
  count: number;
  totalAmount: string;
}

export interface LeaderboardEntry {
  user: string;
  rank: number;
  total_t_shares: string;
  active_stake_count: number;
  total_staked: string;
  max_duration: number;
}

export interface WhaleActivity {
  type: 'stake' | 'unstake';
  user: string;
  stake_id: number;
  amount: string;
  t_shares: string | null;
  days: number | null;
  slot: number;
  signature: string;
  created_at: string;
}

export interface Stats {
  totalStakes: number;
  totalUnstakes: number;
  totalDistributions: number;
  totalRewardsClaimed: number;
  totalTokensClaimed: number;
  currentDay: number | null;
  currentShareRate: string | null;
  totalShares: string | null;
  lastDistributionAmount: string | null;
  lastUpdated: string;
}

const INDEXER_URL = process.env.NEXT_PUBLIC_INDEXER_URL || 'http://localhost:3001';

async function fetcher<T>(path: string): Promise<T> {
  const res = await fetch(`${INDEXER_URL}${path}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch ${path}: ${res.statusText}`);
  }
  return res.json();
}

export interface BadgeEligibility {
  badgeType: string;
  name: string;
  description: string;
  requirement: string;
  eligible: boolean;
  earnedAt: string | null;
  stakeAmount: string | null;
}

export const api = {
  getStats: () => fetcher<Stats>('/api/stats'),
  getHistory: (limit?: number) =>
    fetcher<HistoryEntry[]>(`/api/stats/history${limit ? `?limit=${limit}` : ''}`),
  getDistribution: () =>
    fetcher<DistributionBucket[]>('/api/stats/distribution/stakes'),
  getLeaderboard: (user?: string, limit?: number) => {
    const params = new URLSearchParams();
    if (user) params.set('user', user);
    if (limit) params.set('limit', String(limit));
    const qs = params.toString();
    return fetcher<{ data: LeaderboardEntry[] }>(`/api/leaderboard${qs ? `?${qs}` : ''}`);
  },
  getWhaleActivity: (limit?: number, minAmount?: string) => {
    const params = new URLSearchParams();
    if (limit) params.set('limit', String(limit));
    if (minAmount) params.set('minAmount', minAmount);
    const qs = params.toString();
    return fetcher<{ data: WhaleActivity[] }>(`/api/whale-activity${qs ? `?${qs}` : ''}`);
  },
  getBadges: (wallet: string) =>
    fetcher<{ wallet: string; badges: BadgeEligibility[] }>(`/api/badges?wallet=${wallet}`),
};
