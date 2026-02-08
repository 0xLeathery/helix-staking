'use client';

import { WhaleActivity } from '@/lib/api';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/cn';

interface WhaleFeedProps {
  data: WhaleActivity[];
  isLoading: boolean;
}

export function WhaleFeed({ data, isLoading }: WhaleFeedProps) {
  if (isLoading) {
    return (
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-20 w-full" />
        ))}
      </div>
    );
  }

  const formatTimeAgo = (timestamp: string) => {
    const now = Date.now();
    const then = new Date(timestamp).getTime();
    const diffMs = now - then;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) return `${diffDays}d ago`;
    if (diffHours > 0) return `${diffHours}h ago`;
    if (diffMins > 0) return `${diffMins}m ago`;
    return 'just now';
  };

  return (
    <div className="space-y-2">
      {data.map((activity, idx) => (
        <Card
          key={`${activity.signature}-${idx}`}
          className="p-4 bg-surface border-zinc-800 hover:border-zinc-700 transition-colors"
        >
          <div className="flex items-center justify-between gap-4">
            {/* Left: Type badge */}
            <div className="flex-shrink-0">
              {activity.type === 'stake' ? (
                <div className="px-3 py-1 rounded-md bg-emerald-500/10 text-emerald-400 text-xs font-semibold">
                  STAKED
                </div>
              ) : (
                <div className="px-3 py-1 rounded-md bg-red-500/10 text-red-400 text-xs font-semibold">
                  UNSTAKED
                </div>
              )}
            </div>

            {/* Middle: Wallet and amount */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono text-sm text-zinc-300">
                  {activity.user.slice(0, 8)}...{activity.user.slice(-6)}
                </span>
                <span className="text-zinc-500">•</span>
                <span className="text-sm font-semibold text-zinc-100">
                  {(parseFloat(activity.amount) / 1e9).toFixed(2)} HELIX
                </span>
              </div>
              {activity.type === 'stake' && activity.days && activity.t_shares && (
                <div className="text-xs text-zinc-500 mt-1">
                  {activity.days} days • {(parseFloat(activity.t_shares) / 1e9).toFixed(2)} T-shares
                </div>
              )}
            </div>

            {/* Right: Time */}
            <div className="flex-shrink-0 text-xs text-zinc-500">
              {formatTimeAgo(activity.created_at)}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
