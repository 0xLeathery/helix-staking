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
import { staggerContainer, staggerItem, useCountUp } from "@/lib/animation";
import { DECIMALS_FACTOR, TSHARE_DISPLAY_FACTOR } from "@/lib/solana/constants";

// Stagger offset: each stat starts 100ms after the previous
const STAGGER_OFFSET = 0.1;

/**
 * Safely convert a BN to a JS number by dividing by a given factor first,
 * then using parseFloat to handle values that still exceed Number.MAX_SAFE_INTEGER.
 * Animation only needs approximate frame values, so float precision loss is acceptable.
 */
function bnDivToNumber(bn: BN, factor: BN): number {
  const quotient = bn.div(factor);
  try {
    return quotient.toNumber();
  } catch {
    return parseFloat(quotient.toString());
  }
}

interface StatCardProps {
  label: string;
  tooltip: string;
  targetNumber: number | null;
  format: (v: number) => string;
  staggerIndex: number;
  isLoading: boolean;
}

function StatCard({ label, tooltip, targetNumber, format, staggerIndex, isLoading }: StatCardProps) {
  const animatedValue = useCountUp(targetNumber, format, {
    duration: 1.5,
    delay: staggerIndex * STAGGER_OFFSET,
    ease: "easeOut",
  });

  return (
    <Card>
      <CardContent className="p-4">
        <Tooltip>
          <TooltipTrigger asChild>
            <p className="text-xs uppercase tracking-widest text-zinc-400 mb-1 cursor-help border-b border-dashed border-zinc-700 inline-block">
              {label}
            </p>
          </TooltipTrigger>
          <TooltipContent className="max-w-xs">
            <p>{tooltip}</p>
          </TooltipContent>
        </Tooltip>
        {isLoading || targetNumber === null ? (
          <Skeleton className="h-7 w-24" />
        ) : (
          <p className="text-2xl font-bold tabular-nums text-zinc-50 truncate">
            {animatedValue}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

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

  // Normalize large BN values to display-scale before converting to JS number.
  // - Token amounts (HELIX): divide by DECIMALS_FACTOR (10^8); format reconstructs BN
  // - T-shares: divide by TSHARE_DISPLAY_FACTOR (10^12); format reconstructs BN
  // - Share rate (typically ~10^9): safe to call .toNumber() directly
  const statDefs = globalState ? [
    {
      label: "Total Staked",
      targetNumber: bnDivToNumber(new BN(globalState.totalTokensStaked.toString()), DECIMALS_FACTOR),
      format: (v: number) => formatHelixCompact(new BN(Math.round(v).toString()).mul(DECIMALS_FACTOR)),
      tooltip: "Total HELIX tokens currently locked in active stakes",
    },
    {
      label: `Total ${LABELS.T_SHARES}`,
      targetNumber: bnDivToNumber(new BN(globalState.totalShares.toString()), TSHARE_DISPLAY_FACTOR),
      format: (v: number) => formatTShares(new BN(Math.round(v).toString()).mul(TSHARE_DISPLAY_FACTOR)),
      tooltip: "Total T-Shares across all active stakes. T-Shares determine your share of daily inflation rewards.",
    },
    {
      label: LABELS.SHARE_RATE,
      targetNumber: new BN(globalState.shareRate.toString()).toNumber(),
      format: (v: number) => formatHelix(new BN(Math.round(v).toString()), false),
      tooltip: "The current cost per T-Share. Increases over time as inflation is distributed.",
    },
    {
      label: "Current Day",
      targetNumber: new BN(globalState.currentDay.toString()).toNumber(),
      format: (v: number) => Math.round(v).toString(),
      tooltip: "Number of days since protocol launch",
    },
  ] : [
    { label: "Total Staked", targetNumber: null, format: () => "", tooltip: "Total HELIX tokens currently locked in active stakes" },
    { label: `Total ${LABELS.T_SHARES}`, targetNumber: null, format: () => "", tooltip: "Total T-Shares across all active stakes. T-Shares determine your share of daily inflation rewards." },
    { label: LABELS.SHARE_RATE, targetNumber: null, format: () => "", tooltip: "The current cost per T-Share. Increases over time as inflation is distributed." },
    { label: "Current Day", targetNumber: null, format: () => "", tooltip: "Number of days since protocol launch" },
  ];

  return (
    <m.div
      className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      variants={staggerContainer}
      initial="hidden"
      animate="show"
    >
      {statDefs.map((stat, i) => (
        <m.div key={stat.label} variants={staggerItem}>
          <StatCard
            label={stat.label}
            tooltip={stat.tooltip}
            targetNumber={stat.targetNumber}
            format={stat.format}
            staggerIndex={i}
            isLoading={isLoading}
          />
        </m.div>
      ))}
    </m.div>
  );
}
