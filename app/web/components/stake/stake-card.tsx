"use client";

import Link from "next/link";
import BN from "bn.js";
import { PublicKey } from "@solana/web3.js";
import { useGlobalState } from "@/lib/hooks/useGlobalState";
import { calculatePendingRewards, calculateLoyaltyBonus, applyLoyaltyMultiplier } from "@/lib/solana/math";
import { formatHelix, formatTShares, formatDays } from "@/lib/utils/format";
import { LABELS, SLOTS_PER_DAY, PRECISION } from "@/lib/solana/constants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/cn";

// Account type returned by Anchor's .all() method
interface StakeAccountData {
  user: PublicKey;
  stakeId: BN | { toString(): string };
  stakedAmount: BN | { toString(): string };
  tShares: BN | { toString(): string };
  startSlot: BN | { toString(): string };
  endSlot: BN | { toString(): string };
  stakeDays: number;
  rewardDebt: BN | { toString(): string };
  isActive: boolean;
  bpdBonusPending: BN | { toString(): string };
}

interface StakeCardProps {
  stakePublicKey: PublicKey;
  account: StakeAccountData;
  currentSlot?: number;
}

type StakeStatus = "matured" | "grace" | "active-early" | "active-late" | "late";

function getStakeStatus(
  startSlot: BN,
  endSlot: BN,
  currentSlot: BN,
  slotsPerDay: number
): { status: StakeStatus; remainingDays: number; elapsedDays: number; totalDays: number } {
  const totalSlots = endSlot.sub(startSlot);
  const totalDays = totalSlots.div(new BN(slotsPerDay)).toNumber();
  const elapsedSlots = currentSlot.sub(startSlot);
  const elapsedDays = Math.max(0, elapsedSlots.div(new BN(slotsPerDay)).toNumber());

  if (currentSlot.gte(endSlot)) {
    const slotsLate = currentSlot.sub(endSlot);
    const daysLate = slotsLate.div(new BN(slotsPerDay)).toNumber();

    if (daysLate <= 14) {
      return { status: "grace", remainingDays: 0, elapsedDays, totalDays };
    }
    if (daysLate > 14) {
      return { status: "late", remainingDays: 0, elapsedDays, totalDays };
    }
    return { status: "matured", remainingDays: 0, elapsedDays, totalDays };
  }

  const remainingSlots = endSlot.sub(currentSlot);
  const remainingDays = remainingSlots.div(new BN(slotsPerDay)).toNumber();
  const progress = elapsedDays / totalDays;

  if (progress >= 0.5) {
    return { status: "active-early", remainingDays, elapsedDays, totalDays };
  }
  return { status: "active-late", remainingDays, elapsedDays, totalDays };
}

function StatusBadge({ status }: { status: StakeStatus }) {
  const config = {
    matured: { label: "Matured", className: "bg-green-600/20 text-green-400" },
    grace: {
      label: "Grace Period",
      className: "bg-green-600/20 text-green-400",
    },
    "active-early": {
      label: "Active",
      className: "bg-yellow-600/20 text-yellow-400",
    },
    "active-late": {
      label: "Active",
      className: "bg-red-600/20 text-red-400",
    },
    late: { label: "Late", className: "bg-red-600/20 text-red-400" },
  };

  const { label, className } = config[status];

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
        className
      )}
    >
      {label}
    </span>
  );
}

export function StakeCard({
  stakePublicKey,
  account,
  currentSlot: currentSlotProp,
}: StakeCardProps) {
  const { data: globalState } = useGlobalState();

  const stakedAmount = new BN(account.stakedAmount.toString());
  const tShares = new BN(account.tShares.toString());
  const startSlot = new BN(account.startSlot.toString());
  const endSlot = new BN(account.endSlot.toString());
  const rewardDebt = new BN(account.rewardDebt.toString());
  const bpdBonus = new BN(account.bpdBonusPending.toString());
  const stakeId = account.stakeId.toString();

  // Use provided slot or estimate from globalState
  const currentSlot = currentSlotProp
    ? new BN(currentSlotProp)
    : globalState
      ? new BN(globalState.initSlot.toString()).add(
          new BN(globalState.currentDay.toString()).mul(new BN(SLOTS_PER_DAY))
        )
      : startSlot; // Fallback

  const { status, remainingDays, totalDays } = getStakeStatus(
    startSlot,
    endSlot,
    currentSlot,
    SLOTS_PER_DAY
  );

  const loyaltyBonus = calculateLoyaltyBonus(
    startSlot,
    currentSlot,
    new BN(account.stakeDays),
    new BN(SLOTS_PER_DAY)
  );

  const rawPendingRewards = globalState
    ? calculatePendingRewards(
        tShares,
        new BN(globalState.shareRate.toString()),
        rewardDebt
      )
    : new BN(0);

  const pendingRewards = globalState
    ? applyLoyaltyMultiplier(rawPendingRewards, loyaltyBonus)
    : new BN(0);

  const loyaltyPct = loyaltyBonus.muln(100).div(PRECISION).toNumber();

  const stakeDetailUrl = `/dashboard/stakes/${stakePublicKey.toBase58()}`;

  return (
    <Card className="hover:border-zinc-700 transition-colors">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base">
          Stake #{stakeId}
        </CardTitle>
        <StatusBadge status={status} />
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Main Metrics */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-xs text-zinc-500">Staked Amount</p>
            <p className="font-medium text-zinc-200">
              {formatHelix(stakedAmount)}
            </p>
          </div>
          <div>
            <Tooltip>
              <TooltipTrigger asChild>
                <p className="text-xs text-zinc-500 cursor-help border-b border-dashed border-zinc-700 inline-block">
                  {LABELS.T_SHARES}
                </p>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p>
                  T-Shares determine your portion of daily inflation rewards.
                  More T-Shares = more rewards.
                </p>
              </TooltipContent>
            </Tooltip>
            <p className="font-medium text-zinc-200">
              {formatTShares(tShares)}
            </p>
          </div>
          <div>
            <p className="text-xs text-zinc-500">Duration</p>
            <p className="font-medium text-zinc-200">
              {formatDays(account.stakeDays)}
            </p>
          </div>
          <div>
            <p className="text-xs text-zinc-500">Remaining</p>
            <p className="font-medium text-zinc-200">
              {remainingDays > 0
                ? formatDays(remainingDays)
                : status === "grace"
                  ? "Grace Period"
                  : status === "late"
                    ? "Past Due"
                    : "Matured"}
            </p>
          </div>
        </div>

        {/* Rewards */}
        <div className="border-t border-zinc-800 pt-3 space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-zinc-500">Pending Rewards</span>
            <span className="text-zinc-200 font-medium">
              {formatHelix(pendingRewards)}
            </span>
          </div>
          {loyaltyPct > 0 && (
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Loyalty Bonus</span>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="font-mono text-green-400 cursor-help">+{loyaltyPct}%</span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Loyalty multiplier applied at claim/unstake. Rewards already include this bonus.</p>
                </TooltipContent>
              </Tooltip>
            </div>
          )}
          {!bpdBonus.isZero() && (
            <div className="flex justify-between text-sm">
              <span className="text-zinc-500">{LABELS.BIG_PAY_DAY} Bonus</span>
              <span className="text-helix-400 font-medium">
                {formatHelix(bpdBonus)}
              </span>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-zinc-800 rounded-full h-1.5">
          <div
            className={cn(
              "h-1.5 rounded-full transition-all",
              status === "late"
                ? "bg-red-500"
                : status === "grace" || status === "matured"
                  ? "bg-green-500"
                  : "bg-helix-500"
            )}
            style={{
              width: `${Math.min(100, totalDays > 0 ? Math.round(((totalDays - remainingDays) / totalDays) * 100) : 100)}%`,
            }}
          />
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-1">
          <Button asChild variant="outline" size="sm" className="flex-1">
            <Link href={stakeDetailUrl}>End Stake</Link>
          </Button>
          <Button asChild variant="ghost" size="sm" className="flex-1">
            <Link href={stakeDetailUrl}>Claim Rewards</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
