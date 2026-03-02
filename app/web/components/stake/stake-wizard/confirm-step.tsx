"use client";

import { useStakeWizard } from "@/lib/store/ui-store";
import { useCreateStake } from "@/lib/hooks/useCreateStake";
import { useCreateStakeWithReferral } from "@/lib/hooks/useCreateStakeWithReferral";
import { parseHelix, formatHelix, formatDays, formatTShares } from "@/lib/utils/format";
import { calculateLpbBonus, calculateBpbBonus, calculateTShares } from "@/lib/solana/math";
import { useGlobalState } from "@/lib/hooks/useGlobalState";
import { PRECISION } from "@/lib/solana/constants";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { PublicKey } from "@solana/web3.js";
import BN from "bn.js";

export function ConfirmStep() {
  const { amount, days, referrer, setStep } = useStakeWizard();
  const { data: globalState } = useGlobalState();
  const { mutateAsync, isPending, error } = useCreateStake();
  const {
    mutateAsync: mutateReferral,
    isPending: isReferralPending,
    error: referralError,
  } = useCreateStakeWithReferral();

  // Show loading skeleton while globalState is not yet available (F-10)
  // Using a fallback shareRate of 1 would silently display incorrect T-share calculations
  if (!globalState) {
    return <div className="animate-pulse h-48 bg-zinc-800 rounded" />;
  }

  const isLoading = isPending || isReferralPending;
  const displayError = error || referralError;

  const handleConfirm = async () => {
    try {
      const amountBn = parseHelix(amount);
      if (referrer) {
        await mutateReferral({ amount: amountBn, days, referrer: new PublicKey(referrer) });
      } else {
        await mutateAsync({ amount: amountBn, days });
      }
      setStep("success");
    } catch (err) {
      console.error("Create stake error:", err);
    }
  };

  // Protocol paused check
  const reserved = globalState.reserved as BN[] | undefined;
  const isPaused = reserved && reserved.length > 1 && !reserved[1].isZero();

  // Calculate bonuses and T-shares
  const amountBn = parseHelix(amount);
  const stakeDaysBn = new BN(days);
  const shareRate = globalState.shareRate;

  const lpbBonus = calculateLpbBonus(stakeDaysBn);
  const bpbBonus = calculateBpbBonus(amountBn);
  const tShares = calculateTShares(amountBn, stakeDaysBn, shareRate);

  // Convert bonuses to percentages
  const lpbPercent = lpbBonus.mul(new BN(10000)).div(PRECISION).toNumber() / 100;
  const bpbPercent = bpbBonus.mul(new BN(10000)).div(PRECISION).toNumber() / 100;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-zinc-100">Review & Confirm</h2>
        <p className="mt-2 text-sm text-zinc-400">
          Review your stake details before confirming.
        </p>
      </div>

      {/* Summary */}
      <div className="space-y-4 rounded-lg border border-zinc-800 bg-zinc-900/50 p-6">
        <div className="flex items-center justify-between">
          <span className="text-sm text-zinc-400">Amount</span>
          <span className="font-mono text-lg font-semibold text-zinc-100">
            {formatHelix(amountBn)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-zinc-400">Duration</span>
          <span className="font-mono text-lg font-semibold text-zinc-100">
            {formatDays(days)}
          </span>
        </div>

        <div className="border-t border-zinc-800" />

        <div className="flex items-center justify-between">
          <span className="text-sm text-zinc-400">Duration Bonus</span>
          <span className="font-mono text-sm text-blue-400">
            +{lpbPercent.toFixed(2)}%
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-zinc-400">Size Bonus</span>
          <span className="font-mono text-sm text-purple-400">
            +{bpbPercent.toFixed(2)}%
          </span>
        </div>

        <div className="border-t border-zinc-800" />

        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-zinc-300">Estimated T-Shares</span>
          <span className="font-mono text-xl font-bold text-transparent bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text">
            {formatTShares(tShares)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs text-zinc-500">T-Share Price</span>
          <span className="font-mono text-xs text-zinc-500">
            {formatHelix(new BN(shareRate.toString()), false)}
          </span>
        </div>

        {referrer && (
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Referral Bonus</span>
            <span className="text-green-400">+10% T-Shares</span>
          </div>
        )}
      </div>

      {/* Penalty Warning */}
      <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-4">
        <div className="flex gap-3">
          <div className="flex-shrink-0 text-amber-500">
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <div className="flex-1 space-y-2">
            <p className="text-sm font-semibold text-amber-300">Early Unstake Penalty</p>
            <p className="text-xs text-amber-200/80">
              If you unstake before your stake matures, you will lose at least 50% of your
              staked tokens. The penalty decreases as you serve more time. Unstaking late
              (after maturity) also incurs penalties that increase over time.
            </p>
          </div>
        </div>
      </div>

      {/* Estimated Transaction Fee */}
      <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-zinc-400">Estimated Transaction Fee</span>
          <span className="font-mono text-zinc-300">~0.000005 SOL</span>
        </div>
      </div>

      {/* Error Display */}
      {displayError && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4">
          <p className="text-sm text-red-400">{displayError.message}</p>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between pt-4">
        <Button
          variant="outline"
          onClick={() => setStep(2)}
          disabled={isLoading}
          size="lg"
        >
          Back
        </Button>
        <Tooltip>
          <TooltipTrigger asChild>
            <span>
              <Button
                onClick={handleConfirm}
                disabled={isLoading || !!isPaused}
                size="lg"
                className="min-w-40"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <svg
                      className="h-4 w-4 animate-spin"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Confirming...
                  </span>
                ) : (
                  "Confirm & Stake"
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
    </div>
  );
}
