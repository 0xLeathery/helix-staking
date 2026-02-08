"use client";

import BN from "bn.js";
import { calculateLpbBonus, calculateBpbBonus, calculateTShares } from "@/lib/solana/math";
import { PRECISION, LPB_MAX_DAYS, BPB_THRESHOLD, LABELS } from "@/lib/solana/constants";
import { formatTShares } from "@/lib/utils/format";
import { useGlobalState } from "@/lib/hooks/useGlobalState";

interface BonusPreviewProps {
  amount: BN;
  days: number;
}

const ZERO = new BN(0);

/**
 * Live T-share preview showing Duration Bonus, Size Bonus, and estimated T-shares.
 * Updates instantly as user adjusts amount or duration (no debounce needed).
 */
export function BonusPreview({ amount, days }: BonusPreviewProps) {
  const { data: globalState, isLoading } = useGlobalState();

  if (isLoading || !globalState) {
    return (
      <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-6">
        <div className="space-y-4">
          <div className="h-4 w-32 animate-pulse rounded bg-zinc-800" />
          <div className="h-6 w-48 animate-pulse rounded bg-zinc-800" />
        </div>
      </div>
    );
  }

  const shareRate = globalState.shareRate;
  const stakeDaysBn = new BN(days);

  // Calculate bonuses and T-shares
  const lpbBonus = calculateLpbBonus(stakeDaysBn);
  const bpbBonus = calculateBpbBonus(amount);
  const totalMultiplier = PRECISION.add(lpbBonus).add(bpbBonus);
  const tShares = calculateTShares(amount, stakeDaysBn, shareRate);

  // Convert bonuses to percentages
  const lpbPercent = lpbBonus.mul(new BN(10000)).div(PRECISION).toNumber() / 100;
  const bpbPercent = bpbBonus.mul(new BN(10000)).div(PRECISION).toNumber() / 100;
  const totalMultiplierValue = totalMultiplier.toNumber() / PRECISION.toNumber();

  // Calculate bonus curve positions (0-100%)
  const lpbProgress = Math.min(100, (days / LPB_MAX_DAYS) * 100);
  const bpbProgress = (() => {
    const TEN = new BN(10);
    const amountDiv10 = amount.div(TEN);
    if (amountDiv10.gte(BPB_THRESHOLD)) return 100;
    return Math.min(100, amountDiv10.mul(new BN(10000)).div(BPB_THRESHOLD).toNumber() / 100);
  })();

  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-6">
      <h3 className="mb-4 text-lg font-semibold text-zinc-100">Bonus Preview</h3>

      <div className="space-y-4">
        {/* Duration Bonus */}
        <div>
          <div className="mb-1 flex items-center justify-between text-sm">
            <span className="text-zinc-400">{LABELS.LPB}</span>
            <span className="font-mono text-zinc-100">+{lpbPercent.toFixed(2)}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-zinc-800">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-blue-400 transition-all duration-300"
              style={{ width: `${lpbProgress}%` }}
            />
          </div>
        </div>

        {/* Size Bonus */}
        <div>
          <div className="mb-1 flex items-center justify-between text-sm">
            <span className="text-zinc-400">{LABELS.BPB}</span>
            <span className="font-mono text-zinc-100">+{bpbPercent.toFixed(2)}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-zinc-800">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-purple-400 transition-all duration-300"
              style={{ width: `${bpbProgress}%` }}
            />
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-zinc-800" />

        {/* Total Multiplier */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-zinc-400">Total Multiplier</span>
          <span className="font-mono text-base font-semibold text-zinc-100">
            {totalMultiplierValue.toFixed(2)}x
          </span>
        </div>

        {/* T-Share Price */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-zinc-400">{LABELS.SHARE_RATE}</span>
          <span className="font-mono text-sm text-zinc-300">
            {shareRate.toString(10)}
          </span>
        </div>

        {/* Divider */}
        <div className="border-t border-zinc-800" />

        {/* Estimated T-Shares (highlighted) */}
        <div className="rounded-lg bg-gradient-to-br from-blue-500/10 to-purple-500/10 p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-zinc-300">Estimated {LABELS.T_SHARES}</span>
            <span className="font-mono text-xl font-bold text-transparent bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text">
              {tShares.isZero() ? "0" : formatTShares(tShares)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
