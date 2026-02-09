"use client";

import { useGlobalState } from "@/lib/hooks/useGlobalState";
import { formatHelixCompact, formatTShares, formatHelix } from "@/lib/utils/format";
import { LABELS } from "@/lib/solana/constants";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import BN from "bn.js";

export function ProtocolStats() {
  const { data: globalState, isLoading, error, refetch } = useGlobalState();

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-penalty-400">
              Failed to load protocol stats
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
            >
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const stats = [
    {
      label: "Total Staked",
      value: globalState
        ? formatHelixCompact(new BN(globalState.totalTokensStaked.toString()))
        : null,
      tooltip: "Total HELIX tokens currently locked in active stakes",
    },
    {
      label: `Total ${LABELS.T_SHARES}`,
      value: globalState
        ? formatTShares(new BN(globalState.totalShares.toString()))
        : null,
      tooltip:
        "Total T-Shares across all active stakes. T-Shares determine your share of daily inflation rewards.",
    },
    {
      label: LABELS.SHARE_RATE,
      value: globalState
        ? formatHelix(new BN(globalState.shareRate.toString()), false)
        : null,
      tooltip:
        "The current cost per T-Share. Increases over time as inflation is distributed.",
    },
    {
      label: "Current Day",
      value: globalState ? globalState.currentDay.toString() : null,
      tooltip: "Number of days since protocol launch",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.label}>
          <CardContent className="p-4">
            <Tooltip>
              <TooltipTrigger asChild>
                <p className="text-xs text-zinc-500 mb-1 cursor-help border-b border-dashed border-zinc-700 inline-block">
                  {stat.label}
                </p>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p>{stat.tooltip}</p>
              </TooltipContent>
            </Tooltip>
            {isLoading || stat.value === null ? (
              <Skeleton className="h-7 w-24" />
            ) : (
              <p className="text-lg font-semibold text-zinc-100 truncate">
                {stat.value}
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
