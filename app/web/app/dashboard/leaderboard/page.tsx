'use client';

import { useQuery } from '@tanstack/react-query';
import { useWallet } from '@solana/wallet-adapter-react';
import { api } from '@/lib/api';
import { RankingTable } from '@/components/leaderboard/ranking-table';

export default function LeaderboardPage() {
  const { publicKey } = useWallet();

  const { data, isLoading } = useQuery({
    queryKey: ['leaderboard', publicKey?.toBase58()],
    queryFn: () => api.getLeaderboard(publicKey?.toBase58()),
    refetchInterval: 60000, // 1 minute
  });

  const totalParticipants = data?.data.length || 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-zinc-100">Leaderboard</h1>
        <p className="text-zinc-400">
          Top stakers ranked by active T-shares
          {totalParticipants > 0 && (
            <span className="ml-2 text-zinc-500">
              • {totalParticipants} {totalParticipants === 1 ? 'participant' : 'participants'}
            </span>
          )}
        </p>
      </div>

      <RankingTable
        data={data?.data || []}
        currentUser={publicKey?.toBase58() || null}
        isLoading={isLoading}
      />
    </div>
  );
}
