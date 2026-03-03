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
import { useCountUp } from "@/lib/animation";
import { TOKEN_DECIMALS, TSHARE_DISPLAY_FACTOR } from "@/lib/solana/constants";

// Stagger offset: each stat starts 100ms after the previous
const STAGGER_OFFSET = 0.1;
const DECIMALS_FACTOR = new BN(10).pow(new BN(TOKEN_DECIMALS)); // 10^8

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

interface SummaryStatProps {
  label: string;
  targetNumber: number | null;
  format: (v: number) => string;
  staggerIndex: number;
  isLoading: boolean;
}

function SummaryStat({ label, targetNumber, format, staggerIndex, isLoading }: SummaryStatProps) {
  const animatedValue = useCountUp(targetNumber, format, {
    duration: 1.5,
    delay: staggerIndex * STAGGER_OFFSET,
    ease: "easeOut",
  });

  return (
    <div>
      <p className="text-xs text-zinc-400 mb-1">{label}</p>
      {isLoading ? (
        <Skeleton className="h-6 w-20" />
      ) : (
        <p className="text-sm font-medium text-zinc-200">
          {animatedValue}
        </p>
      )}
    </div>
  );
}

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

  // Normalize BN values to display-scale before converting to JS number,
  // to stay within Number.MAX_SAFE_INTEGER for animation interpolation.
  // - Token amounts (HELIX): divide by DECIMALS_FACTOR (10^8); format reconstructs BN
  // - T-shares: divide by TSHARE_DISPLAY_FACTOR (10^12); format reconstructs BN
  // Normalize BN values to display-scale before converting to JS number.
  // Format callbacks use string-based BN construction to avoid safe-integer assertions.
  const summaryItems = [
    {
      label: "Wallet Balance",
      targetNumber: balance ? bnDivToNumber(balance, DECIMALS_FACTOR) : null,
      format: (v: number) => formatHelix(new BN(Math.round(v).toString()).mul(DECIMALS_FACTOR)),
    },
    {
      label: "Active Stakes",
      targetNumber: activeStakeCount,
      format: (v: number) => Math.round(v).toString(),
    },
    {
      label: `Total ${LABELS.T_SHARES}`,
      targetNumber: totalTShares.isZero() ? 0 : bnDivToNumber(totalTShares, TSHARE_DISPLAY_FACTOR),
      format: (v: number) => formatTShares(new BN(Math.round(v).toString()).mul(TSHARE_DISPLAY_FACTOR)),
    },
    {
      label: "Pending Rewards",
      targetNumber: bnDivToNumber(totalPendingRewards, DECIMALS_FACTOR),
      format: (v: number) => formatHelix(new BN(Math.round(v).toString()).mul(DECIMALS_FACTOR)),
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
          {summaryItems.map((item, i) => (
            <SummaryStat
              key={item.label}
              label={item.label}
              targetNumber={item.targetNumber}
              format={item.format}
              staggerIndex={i}
              isLoading={isLoading}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
