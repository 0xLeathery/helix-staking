'use client';

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { TShareChart } from '@/components/analytics/TShareChart';
import { DistributionChart } from '@/components/analytics/DistributionChart';
import { SupplyChart } from '@/components/analytics/SupplyChart';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function AnalyticsPage() {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['stats'],
    queryFn: () => api.getStats(),
  });

  const { data: history, isLoading: historyLoading } = useQuery({
    queryKey: ['history'],
    queryFn: () => api.getHistory(),
  });

  const { data: distribution, isLoading: distributionLoading } = useQuery({
    queryKey: ['distribution'],
    queryFn: () => api.getDistribution(),
  });

  // Calculate supply breakdown
  // Note: These would ideally come from the API as well
  const staked = stats?.totalShares ? parseFloat(stats.totalShares) / 1e9 : 0; 
  const liquid = 1250000; // Mocked for now
  const unclaimed = 750000; // Mocked for now

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-zinc-100">Protocol Analytics</h1>
        <p className="text-zinc-400">Real-time and historical protocol metrics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          label="Total Stakes" 
          value={stats?.totalStakes} 
          loading={statsLoading} 
        />
        <StatCard 
          label="Current Day" 
          value={stats?.currentDay} 
          loading={statsLoading} 
        />
        <StatCard 
          label="Share Rate" 
          value={stats?.currentShareRate ? (parseFloat(stats.currentShareRate) / 10000).toFixed(4) : null} 
          loading={statsLoading} 
          unit="HELIX"
        />
        <StatCard 
          label="Last Inflation" 
          value={stats?.lastDistributionAmount ? (parseFloat(stats.lastDistributionAmount) / 1e9).toFixed(2) : null} 
          loading={statsLoading} 
          unit="HELIX"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-6 bg-surface border-zinc-800">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">T-Share Price History</h3>
            {historyLoading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : (
              <TShareChart data={history || []} />
            )}
          </div>
        </Card>
        
        <Card className="p-6 bg-surface border-zinc-800">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Stake Duration Distribution</h3>
            {distributionLoading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : (
              <DistributionChart data={distribution || []} />
            )}
          </div>
        </Card>

        <Card className="p-6 bg-surface border-zinc-800">
          <SupplyChart 
            staked={staked} 
            liquid={liquid} 
            unclaimed={unclaimed} 
          />
        </Card>

        <Card className="p-6 bg-surface border-zinc-800 flex flex-col justify-center space-y-4">
          <h3 className="text-lg font-medium">Protocol Health</h3>
          <div className="space-y-4">
            <div className="flex justify-between text-sm border-b border-zinc-800 pb-2">
              <span className="text-zinc-400">Last Updated</span>
              <span className="text-zinc-100">{stats?.lastUpdated ? new Date(stats.lastUpdated).toLocaleString() : 'Never'}</span>
            </div>
            <div className="flex justify-between text-sm border-b border-zinc-800 pb-2">
              <span className="text-zinc-400">Total Distributions</span>
              <span className="text-zinc-100">{stats?.totalDistributions}</span>
            </div>
            <div className="flex justify-between text-sm border-b border-zinc-800 pb-2">
              <span className="text-zinc-400">Total Rewards Claimed</span>
              <span className="text-zinc-100">{stats?.totalRewardsClaimed} HELIX</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-zinc-400">Total Tokens Claimed</span>
              <span className="text-zinc-100">{stats?.totalTokensClaimed} HELIX</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ label, value, loading, unit }: { label: string, value: any, loading: boolean, unit?: string }) {
  return (
    <Card className="p-4 bg-surface border-zinc-800 shadow-sm">
      <div className="text-sm text-zinc-500 font-medium">{label}</div>
      {loading ? (
        <Skeleton className="h-8 w-24 mt-2" />
      ) : (
        <div className="text-2xl font-bold text-zinc-100 mt-2">
          {value ?? '0'} {unit && <span className="text-xs font-normal text-zinc-500 ml-1">{unit}</span>}
        </div>
      )}
    </Card>
  );
}
