"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BpdStatus } from "@/components/dashboard/bpd-status";
import { CrankButton } from "@/components/dashboard/crank-button";
import { useStakes } from "@/lib/hooks/useStakes";
import { useGlobalState } from "@/lib/hooks/useGlobalState";
import { calculatePendingRewards } from "@/lib/solana/math";
import { formatHelix } from "@/lib/utils/format";
import BN from "bn.js";

/**
 * Rewards page.
 *
 * Shows:
 * - Overview card with total pending rewards and BPD bonus
 * - BPD status card
 * - Crank button
 */
export default function RewardsPage() {
  const { data: stakes, isLoading: isLoadingStakes } = useStakes();
  const { data: globalState, isLoading: isLoadingGlobal } = useGlobalState();

  // Calculate total pending rewards and BPD bonus
  let totalPendingRewards = new BN(0);
  let totalBpdBonus = new BN(0);

  if (stakes && globalState) {
    stakes.forEach((stake) => {
      const pending = calculatePendingRewards(
        stake.account.tShares,
        globalState.shareRate,
        stake.account.rewardDebt
      );
      totalPendingRewards = totalPendingRewards.add(pending);

      if (stake.account.bpdBonusPending) {
        totalBpdBonus = totalBpdBonus.add(stake.account.bpdBonusPending);
      }
    });
  }

  return (
    <div className="container max-w-4xl py-8 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Rewards</h1>
        <p className="text-muted-foreground">
          Track your pending rewards, Big Pay Day status, and trigger daily distributions.
        </p>
      </div>

      {/* Overview Card */}
      <Card>
        <CardHeader>
          <CardTitle>Rewards Overview</CardTitle>
          <CardDescription>Your total pending rewards across all stakes</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoadingStakes || isLoadingGlobal ? (
            <p className="text-sm text-muted-foreground">Loading rewards...</p>
          ) : (
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Pending Rewards:</span>
                <span className="font-mono font-bold text-green-400">
                  {formatHelix(totalPendingRewards)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total BPD Bonus Pending:</span>
                <span className="font-mono font-bold text-yellow-400">
                  {formatHelix(totalBpdBonus)}
                </span>
              </div>
              {globalState && (
                <div className="flex justify-between border-t pt-2">
                  <span className="text-sm text-muted-foreground">Last Distribution:</span>
                  <span className="text-sm font-mono">
                    Day {globalState.currentDay.toNumber().toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* BPD Status */}
      <BpdStatus />

      {/* Crank Button */}
      <CrankButton />
    </div>
  );
}
