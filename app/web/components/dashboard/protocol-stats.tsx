"use client";

import { m } from "framer-motion";
import { AlertCircle } from "lucide-react";
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
import { staggerContainer, staggerItem } from "@/lib/animation";

export function ProtocolStats() {
  const { data: globalState, isLoading, error, refetch } = useGlobalState();

  if (error) {
    return (
      <Card className="border-penalty-800">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-penalty-400 mt-0.5 shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-penalty-300">Failed to load protocol stats</p>
              <p className="text-xs text-zinc-400 mt-0.5">Check your connection and try again.</p>
            </div>
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
    <m.div
      className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      variants={staggerContainer}
      initial="hidden"
      animate="show"
    >
      {stats.map((stat) => (
        <m.div key={stat.label} variants={staggerItem}>
          <Card>
            <CardContent className="p-4">
              <Tooltip>
                <TooltipTrigger asChild>
                  <p className="text-xs uppercase tracking-widest text-zinc-400 mb-1 cursor-help border-b border-dashed border-zinc-700 inline-block">
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
                <p className="text-2xl font-bold tabular-nums text-zinc-50 truncate">
                  {stat.value}
                </p>
              )}
            </CardContent>
          </Card>
        </m.div>
      ))}
    </m.div>
  );
}
