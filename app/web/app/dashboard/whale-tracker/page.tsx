'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { WhaleFeed } from '@/components/leaderboard/whale-feed';

export default function WhaleTrackerPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['whale-activity'],
    queryFn: () => api.getWhaleActivity(50),
    refetchInterval: 30000, // 30 seconds
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-zinc-100">Whale Tracker</h1>
        <p className="text-zinc-400">
          Large stake movements
          <span className="ml-2 text-xs text-zinc-400">
            Showing transactions &gt;= 100 HELIX
          </span>
        </p>
      </div>

      <WhaleFeed data={data?.data || []} isLoading={isLoading} />
    </div>
  );
}
