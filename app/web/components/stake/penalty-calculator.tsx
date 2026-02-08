"use client";

import BN from "bn.js";
import { calculateEarlyPenalty, calculateLatePenalty, calculatePendingRewards } from "@/lib/solana/math";
import { formatHelix, formatBps } from "@/lib/utils/format";
import { GRACE_PERIOD_DAYS, SLOTS_PER_DAY, LATE_PENALTY_WINDOW_DAYS, LABELS } from "@/lib/solana/constants";

interface PenaltyCalculatorProps {
  stakedAmount: BN;
  startSlot: BN;
  endSlot: BN;
  currentSlot: number;
  tShares: BN;
  currentShareRate: BN;
  rewardDebt: BN;
  bpdBonusPending: BN;
  slotsPerDay: BN;
}

/**
 * Visual penalty calculator component.
 *
 * Determines stake state (early/on-time/late) and displays:
 * - Status label with color coding
 * - Visual comparison bar (what you staked vs what you'd receive)
 * - Detailed breakdown (staked, penalty, rewards, BPD bonus, total receive)
 * - Urgency indicator for late unstake
 */
export function PenaltyCalculator({
  stakedAmount,
  startSlot,
  endSlot,
  currentSlot,
  tShares,
  currentShareRate,
  rewardDebt,
  bpdBonusPending,
  slotsPerDay,
}: PenaltyCalculatorProps) {
  const currentSlotBN = new BN(currentSlot);
  const gracePeriodSlots = new BN(GRACE_PERIOD_DAYS).mul(slotsPerDay);
  const graceEndSlot = endSlot.add(gracePeriodSlots);

  // Determine stake state
  let stakeState: "early" | "grace" | "late";
  let penalty = new BN(0);
  let statusLabel: string;
  let statusColor: string;

  if (currentSlotBN.lt(endSlot)) {
    // EARLY
    stakeState = "early";
    penalty = calculateEarlyPenalty(stakedAmount, startSlot, currentSlotBN, endSlot);
    statusLabel = LABELS.EARLY_UNSTAKE;

    // Color based on penalty severity
    const penaltyBps = penalty.mul(new BN(10000)).div(stakedAmount).toNumber();
    if (penaltyBps >= 7500) {
      statusColor = "text-red-400 bg-red-400/10"; // Heavy penalty >= 75%
    } else {
      statusColor = "text-yellow-400 bg-yellow-400/10"; // Moderate penalty
    }
  } else if (currentSlotBN.lte(graceEndSlot)) {
    // GRACE PERIOD (on-time)
    stakeState = "grace";
    penalty = new BN(0);
    statusLabel = LABELS.ON_TIME_UNSTAKE;
    statusColor = "text-green-400 bg-green-400/10"; // No penalty
  } else {
    // LATE
    stakeState = "late";
    penalty = calculateLatePenalty(stakedAmount, endSlot, currentSlotBN, slotsPerDay);
    statusLabel = LABELS.LATE_UNSTAKE;
    statusColor = "text-red-400 bg-red-400/10"; // Late penalty
  }

  // Calculate pending rewards
  const pendingRewards = calculatePendingRewards(tShares, currentShareRate, rewardDebt);

  // Calculate total receive amount
  const returnAmount = stakedAmount.sub(penalty);
  const totalReceive = returnAmount.add(pendingRewards).add(bpdBonusPending);

  // Calculate penalty percentage
  const penaltyBps = stakedAmount.isZero()
    ? 0
    : penalty.mul(new BN(10000)).div(stakedAmount).toNumber();

  // For late unstake: calculate days until total loss
  let daysUntilTotalLoss: number | null = null;
  if (stakeState === "late") {
    const slotsLate = currentSlotBN.sub(endSlot);
    const lateDays = slotsLate.div(slotsPerDay).toNumber();
    const daysIntoLate = lateDays - GRACE_PERIOD_DAYS;
    daysUntilTotalLoss = LATE_PENALTY_WINDOW_DAYS - daysIntoLate;
    if (daysUntilTotalLoss < 0) daysUntilTotalLoss = 0;
  }

  // Visual bar percentages
  const totalStaked = stakedAmount.toNumber();
  const totalReceiveNum = totalReceive.toNumber();
  const penaltyNum = penalty.toNumber();

  const receivePercent = totalStaked > 0 ? (totalReceiveNum / totalStaked) * 100 : 0;
  const penaltyPercent = totalStaked > 0 ? (penaltyNum / totalStaked) * 100 : 0;

  return (
    <div className="space-y-4">
      {/* Status Badge */}
      <div className="flex items-center gap-3">
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusColor}`}>
          {statusLabel}
        </span>
        {stakeState === "late" && daysUntilTotalLoss !== null && daysUntilTotalLoss > 0 && (
          <span className="text-sm text-red-400">
            {daysUntilTotalLoss} days until total loss
          </span>
        )}
      </div>

      {/* Visual Comparison Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-zinc-400">
          <span>What you staked</span>
          <span>{formatHelix(stakedAmount)}</span>
        </div>
        <div className="h-8 bg-zinc-800 rounded-lg overflow-hidden flex">
          {receivePercent > 0 && (
            <div
              className="bg-green-500 flex items-center justify-center text-xs font-medium text-white"
              style={{ width: `${receivePercent}%` }}
            >
              {receivePercent >= 15 && "Receive"}
            </div>
          )}
          {penaltyPercent > 0 && (
            <div
              className="bg-red-500 flex items-center justify-center text-xs font-medium text-white"
              style={{ width: `${penaltyPercent}%` }}
            >
              {penaltyPercent >= 15 && "Penalty"}
            </div>
          )}
        </div>
      </div>

      {/* Detailed Breakdown */}
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-zinc-400">Staked Amount</span>
          <span className="text-zinc-100 font-medium">{formatHelix(stakedAmount)}</span>
        </div>

        {penalty.gt(new BN(0)) && (
          <div className="flex justify-between">
            <span className="text-zinc-400">Penalty Amount</span>
            <span className="text-red-400 font-medium">
              -{formatHelix(penalty)} ({formatBps(penaltyBps)})
            </span>
          </div>
        )}

        {pendingRewards.gt(new BN(0)) && (
          <div className="flex justify-between">
            <span className="text-zinc-400">Pending Rewards</span>
            <span className="text-green-400 font-medium">+{formatHelix(pendingRewards)}</span>
          </div>
        )}

        {bpdBonusPending.gt(new BN(0)) && (
          <div className="flex justify-between">
            <span className="text-zinc-400">BPD Bonus</span>
            <span className="text-green-400 font-medium">+{formatHelix(bpdBonusPending)}</span>
          </div>
        )}

        <div className="border-t border-zinc-700 pt-2 flex justify-between font-semibold">
          <span className="text-zinc-100">You Receive</span>
          <span className={penalty.gt(new BN(0)) ? "text-yellow-400" : "text-green-400"}>
            {formatHelix(totalReceive)}
          </span>
        </div>
      </div>

      {/* Note about auto-claim */}
      <p className="text-xs text-zinc-500 italic">
        Note: Ending your stake will also claim all pending rewards in the same transaction.
      </p>
    </div>
  );
}
