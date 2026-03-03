"use client";

import BN from "bn.js";
import { Coins } from "lucide-react";
import { useStakes } from "@/lib/hooks/useStakes";
import { useTokenBalance } from "@/lib/hooks/useTokenBalance";
import { useGlobalState } from "@/lib/hooks/useGlobalState";
import { calculatePendingRewards } from "@/lib/solana/math";
import { formatHelix, formatTShares } from "@/lib/utils/format";
import { LABELS } from "@/lib/solana/constants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import Link from "next/link";

export function PortfolioSummary() {
  const { data: stakes, isLoading: stakesLoading } = useStakes();
  const { data: balance, isLoading: balanceLoading } = useTokenBalance();
  const { data: globalState, isLoading: globalLoading } = useGlobalState();

  const isLoading = stakesLoading || balanceLoading || globalLoading;

  // Calculate aggregated portfolio data
  const activeStakes =
    stakes?.filter((s) => s.account.isActive) ?? [];
  const activeStakeCount = activeStakes.length;

  const totalTShares = activeStakes.reduce(
    (sum, s) => sum.add(new BN(s.account.tShares.toString())),
    new BN(0)
  );

  const totalPendingRewards = globalState
    ? activeStakes.reduce((sum, s) => {
        const pending = calculatePendingRewards(
          new BN(s.account.tShares.toString()),
          new BN(globalState.shareRate.toString()),
          new BN(s.account.rewardDebt.toString())
        );
        return sum.add(pending);
      }, new BN(0))
    : new BN(0);

  if (!isLoading && activeStakeCount === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <EmptyState
            icon={Coins}
            headline="No active stakes"
            description="Create your first stake to start earning T-shares and daily rewards."
            action={{ label: "Create Stake", href: "/dashboard/stake" }}
          />
        </CardContent>
      </Card>
    );
  }

  const summaryItems = [
    {
      label: "Wallet Balance",
      value: balance ? formatHelix(balance) : null,
    },
    {
      label: "Active Stakes",
      value: String(activeStakeCount),
    },
    {
      label: `Total ${LABELS.T_SHARES}`,
      value: formatTShares(totalTShares),
    },
    {
      label: "Pending Rewards",
      value: formatHelix(totalPendingRewards),
    },
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Portfolio Summary</CardTitle>
        <Button asChild size="sm">
          <Link href="/dashboard/stake">New Stake</Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {summaryItems.map((item) => (
            <div key={item.label}>
              <p className="text-xs text-zinc-400 mb-1">{item.label}</p>
              {isLoading ? (
                <Skeleton className="h-6 w-20" />
              ) : (
                <p className="text-sm font-medium text-zinc-200">
                  {item.value}
                </p>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
