"use client";

import { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { PublicKey } from "@solana/web3.js";
import BN from "bn.js";
import { useStakes } from "@/lib/hooks/useStakes";
import { useGlobalState } from "@/lib/hooks/useGlobalState";
import { useCurrentSlot } from "@/lib/hooks/useCurrentSlot";
import { useClaimRewards } from "@/lib/hooks/useClaimRewards";
import { calculatePendingRewards, calculateEarlyPenalty, calculateLatePenalty, calculateLpbBonus, calculateBpbBonus } from "@/lib/solana/math";
import { formatHelix, formatTShares, formatDays, formatBps } from "@/lib/utils/format";
import { GRACE_PERIOD_DAYS, SLOTS_PER_DAY, LABELS, PRECISION } from "@/lib/solana/constants";
import { PenaltyCalculator } from "@/components/stake/penalty-calculator";
import { UnstakeConfirmation } from "@/components/stake/unstake-confirmation";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ProtocolPausedBanner } from "@/components/dashboard/protocol-paused-banner";
import Link from "next/link";

/**
 * Stake detail page showing full stake information with penalty calculator and actions.
 *
 * Route: /dashboard/stakes/[stakeId]
 * stakeId = base58 public key of the StakeAccount PDA
 */
export default function StakeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [isUnstakeDialogOpen, setIsUnstakeDialogOpen] = useState(false);

  const stakeId = params.stakeId as string;

  // Fetch stakes and find the specific one
  const stakesQuery = useStakes();
  const globalStateQuery = useGlobalState();
  const currentSlotQuery = useCurrentSlot();
  const claimRewards = useClaimRewards();

  const stake = useMemo(() => {
    if (!stakesQuery.data) return null;
    return stakesQuery.data.find((s) => s.publicKey.toBase58() === stakeId);
  }, [stakesQuery.data, stakeId]);

  const globalState = globalStateQuery.data;
  const currentSlot = currentSlotQuery.data;

  // Loading state
  if (stakesQuery.isLoading || globalStateQuery.isLoading || currentSlotQuery.isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  // 404: Stake not found
  if (!stake || !globalState || currentSlot === undefined) {
    return (
      <div className="max-w-4xl mx-auto text-center space-y-4 py-12">
        <h1 className="text-2xl font-bold text-zinc-100">Stake Not Found</h1>
        <p className="text-zinc-400">
          The stake you're looking for doesn't exist or has been closed.
        </p>
        <Button asChild variant="outline">
          <Link href="/dashboard">Back to Dashboard</Link>
        </Button>
      </div>
    );
  }

  // Calculate timing info
  const currentSlotBN = new BN(currentSlot);
  const startSlot = new BN(stake.account.startSlot.toString());
  const endSlot = new BN(stake.account.endSlot.toString());
  const stakeDays = stake.account.stakeDays;
  const slotsPerDay = new BN(globalState.slotsPerDay.toString());

  const totalDuration = endSlot.sub(startSlot);
  const elapsed = currentSlotBN.sub(startSlot);
  const remaining = endSlot.sub(currentSlotBN);

  const elapsedDays = elapsed.div(slotsPerDay).toNumber();
  const remainingDays = remaining.div(slotsPerDay).toNumber();

  const gracePeriodSlots = new BN(GRACE_PERIOD_DAYS).mul(slotsPerDay);
  const graceEndSlot = endSlot.add(gracePeriodSlots);

  const isMatured = currentSlotBN.gte(endSlot);
  const isInGracePeriod = currentSlotBN.lte(graceEndSlot) && isMatured;

  // Calculate bonuses
  const stakedAmount = new BN(stake.account.stakedAmount.toString());
  const stakeDaysBN = new BN(stakeDays);
  const lpbBonus = calculateLpbBonus(stakeDaysBN);
  const bpbBonus = calculateBpbBonus(stakedAmount);

  const lpbBonusPercent = lpbBonus.mul(new BN(100)).div(PRECISION).toNumber();
  const bpbBonusPercent = bpbBonus.mul(new BN(100)).div(PRECISION).toNumber();

  // Calculate pending rewards
  const tShares = new BN(stake.account.tShares.toString());
  const currentShareRate = new BN(globalState.shareRate.toString());
  const rewardDebt = new BN(stake.account.rewardDebt.toString());
  const bpdBonusPending = new BN(stake.account.bpdBonusPending.toString());

  const pendingRewards = calculatePendingRewards(tShares, currentShareRate, rewardDebt);

  // Calculate penalty
  let penalty = new BN(0);
  if (currentSlotBN.lt(endSlot)) {
    // Early
    penalty = calculateEarlyPenalty(stakedAmount, startSlot, currentSlotBN, endSlot);
  } else {
    // Late
    penalty = calculateLatePenalty(stakedAmount, endSlot, currentSlotBN, slotsPerDay);
  }

  const returnAmount = stakedAmount.sub(penalty);
  const totalReceive = returnAmount.add(pendingRewards).add(bpdBonusPending);

  // BPD window check
  const reserved = globalState.reserved as BN[] | undefined;
  const isBpdWindowActive = reserved && reserved.length > 0 && !reserved[0].isZero();
  const isPaused = reserved && reserved.length > 1 && !reserved[1].isZero();

  // Action button label
  let actionButtonLabel: string = LABELS.ON_TIME_UNSTAKE;
  if (currentSlotBN.lt(endSlot)) {
    actionButtonLabel = LABELS.EARLY_UNSTAKE;
  } else if (!isInGracePeriod) {
    actionButtonLabel = LABELS.LATE_UNSTAKE;
  }

  // Handle claim rewards
  const handleClaimRewards = async () => {
    if (pendingRewards.add(bpdBonusPending).isZero()) return;

    try {
      await claimRewards.mutateAsync({ stakePublicKey: stake.publicKey });
    } catch (error) {
      console.error("Claim rewards error:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100">Stake Details</h1>
          <p className="text-sm text-zinc-400 mt-1">
            {stake.publicKey.toBase58().slice(0, 8)}...{stake.publicKey.toBase58().slice(-8)}
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/dashboard">Back to Dashboard</Link>
        </Button>
      </div>

      {/* Protocol Paused Banner */}
      <ProtocolPausedBanner isPaused={!!isPaused} />

      {/* BPD Window Warning Banner */}
      {isBpdWindowActive && (
        <div className="rounded-lg border border-yellow-600/50 bg-yellow-600/10 p-4">
          <div className="flex items-start gap-3">
            <WarningIcon className="h-5 w-5 text-yellow-400 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-semibold text-yellow-400">Unstaking Temporarily Unavailable</h3>
              <p className="text-sm text-zinc-300 mt-1">
                Unstaking is temporarily unavailable during Big Pay Day calculation. This ensures accurate bonus distribution. Please try again in a few minutes.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Stake Details Card */}
        <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-zinc-100">Stake Information</h2>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-zinc-400">Staked Amount</span>
              <span className="text-zinc-100 font-medium">{formatHelix(stakedAmount)}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-zinc-400">{LABELS.T_SHARES}</span>
              <span className="text-zinc-100 font-medium">{formatTShares(tShares)}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-zinc-400">{LABELS.LPB} ({stakeDays} days)</span>
              <span className="text-zinc-100 font-medium">+{lpbBonusPercent.toFixed(0)}%</span>
            </div>

            <div className="flex justify-between">
              <span className="text-zinc-400">{LABELS.BPB}</span>
              <span className="text-zinc-100 font-medium">+{bpbBonusPercent.toFixed(0)}%</span>
            </div>

            <div className="border-t border-zinc-700 pt-3 flex justify-between">
              <span className="text-zinc-400">Duration</span>
              <span className="text-zinc-100 font-medium">{formatDays(stakeDays)}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-zinc-400">Days Elapsed</span>
              <span className="text-zinc-100 font-medium">{elapsedDays}</span>
            </div>

            {isMatured ? (
              <div className="flex justify-between">
                <span className="text-zinc-400">Matured</span>
                <span className="text-green-400 font-medium">
                  {Math.abs(remainingDays)} days ago
                </span>
              </div>
            ) : (
              <div className="flex justify-between">
                <span className="text-zinc-400">Days Remaining</span>
                <span className="text-zinc-100 font-medium">{remainingDays}</span>
              </div>
            )}

            {pendingRewards.gt(new BN(0)) && (
              <div className="flex justify-between">
                <span className="text-zinc-400">Pending Rewards</span>
                <span className="text-green-400 font-medium">{formatHelix(pendingRewards)}</span>
              </div>
            )}

            {bpdBonusPending.gt(new BN(0)) && (
              <div className="flex justify-between">
                <span className="text-zinc-400">{LABELS.BIG_PAY_DAY} Bonus</span>
                <span className="text-green-400 font-medium">{formatHelix(bpdBonusPending)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Penalty Calculator Card */}
        <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-6">
          <h2 className="text-lg font-semibold text-zinc-100 mb-4">Penalty Calculator</h2>
          <PenaltyCalculator
            stakedAmount={stakedAmount}
            startSlot={startSlot}
            endSlot={endSlot}
            currentSlot={currentSlot}
            tShares={tShares}
            currentShareRate={currentShareRate}
            rewardDebt={rewardDebt}
            bpdBonusPending={bpdBonusPending}
            slotsPerDay={slotsPerDay}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="flex-1">
              <Button
                onClick={() => setIsUnstakeDialogOpen(true)}
                disabled={isBpdWindowActive || !!isPaused}
                className="w-full bg-red-600 hover:bg-red-700"
              >
                {actionButtonLabel}
              </Button>
            </span>
          </TooltipTrigger>
          {isPaused && (
            <TooltipContent>
              <p>Protocol is currently paused. Please try again later.</p>
            </TooltipContent>
          )}
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <span className="flex-1">
              <Button
                onClick={handleClaimRewards}
                disabled={pendingRewards.add(bpdBonusPending).isZero() || claimRewards.isPending || !!isPaused}
                variant="outline"
                className="w-full"
              >
                {claimRewards.isPending ? (
                  <>
                    <SpinnerIcon className="mr-2 h-4 w-4 animate-spin" />
                    Claiming...
                  </>
                ) : (
                  "Claim Rewards"
                )}
              </Button>
            </span>
          </TooltipTrigger>
          {isPaused && (
            <TooltipContent>
              <p>Protocol is currently paused. Please try again later.</p>
            </TooltipContent>
          )}
        </Tooltip>
      </div>

      {/* Unstake Confirmation Dialog */}
      <UnstakeConfirmation
        isOpen={isUnstakeDialogOpen}
        onClose={() => setIsUnstakeDialogOpen(false)}
        stakePublicKey={stake.publicKey}
        stakedAmount={stakedAmount}
        penalty={penalty}
        totalReceive={totalReceive}
        isGracePeriod={isInGracePeriod}
      />
    </div>
  );
}

// Icon components
function WarningIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  );
}

function SpinnerIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}
