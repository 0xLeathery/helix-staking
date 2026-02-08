'use client';

import { LeaderboardEntry } from '@/lib/api';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/cn';

interface RankingTableProps {
  data: LeaderboardEntry[];
  currentUser: string | null;
  isLoading: boolean;
}

export function RankingTable({ data, currentUser, isLoading }: RankingTableProps) {
  if (isLoading) {
    return <Skeleton className="h-[600px] w-full" />;
  }

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return '#FFD700'; // Gold
      case 2:
        return '#C0C0C0'; // Silver
      case 3:
        return '#CD7F32'; // Bronze
      default:
        return undefined;
    }
  };

  return (
    <Card className="bg-surface border-zinc-800 p-0 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-zinc-800 text-sm text-zinc-500 uppercase tracking-wider">
            <tr>
              <th className="px-6 py-3 text-left font-medium">Rank</th>
              <th className="px-6 py-3 text-left font-medium">Wallet</th>
              <th className="px-6 py-3 text-right font-medium">T-Shares</th>
              <th className="px-6 py-3 text-right font-medium">Stakes</th>
              <th className="px-6 py-3 text-right font-medium">Total Staked</th>
              <th className="px-6 py-3 text-right font-medium">Duration</th>
            </tr>
          </thead>
          <tbody>
            {data.map((entry) => {
              const isCurrentUser = currentUser && entry.user === currentUser;
              const rankColor = getRankColor(entry.rank);

              return (
                <tr
                  key={entry.user}
                  className={cn(
                    'border-b border-zinc-900 text-sm hover:bg-zinc-900/50 transition-colors',
                    isCurrentUser && 'bg-helix-600/10 border-l-2 border-helix-400'
                  )}
                >
                  <td className="px-6 py-4">
                    <span
                      className="font-semibold"
                      style={{ color: rankColor }}
                    >
                      #{entry.rank}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-zinc-300">
                        {entry.user.slice(0, 8)}...{entry.user.slice(-6)}
                      </span>
                      {isCurrentUser && (
                        <span className="text-xs text-helix-400 font-medium">(You)</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right text-zinc-300">
                    {(parseFloat(entry.total_t_shares) / 1e9).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-right text-zinc-300">
                    {entry.active_stake_count}
                  </td>
                  <td className="px-6 py-4 text-right text-zinc-300">
                    {(parseFloat(entry.total_staked) / 1e9).toFixed(2)} HELIX
                  </td>
                  <td className="px-6 py-4 text-right text-zinc-300">
                    {entry.max_duration} days
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
