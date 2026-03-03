"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import BN from "bn.js";
import { PublicKey } from "@solana/web3.js";
import { useUnstake } from "@/lib/hooks/useUnstake";
import { formatHelix, formatBps } from "@/lib/utils/format";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

interface UnstakeConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  stakePublicKey: PublicKey;
  stakedAmount: BN;
  penalty: BN;
  totalReceive: BN;
  isGracePeriod: boolean;
}

/**
 * Unstake confirmation dialog with mandatory checkbox.
 *
 * Features:
 * - Abbreviated penalty summary
 * - Mandatory checkbox (cannot confirm without checking)
 * - Different checkbox text for grace period vs penalty
 * - Loading state during transaction
 * - Success navigation to dashboard
 */
export function UnstakeConfirmation({
  isOpen,
  onClose,
  stakePublicKey,
  stakedAmount,
  penalty,
  totalReceive,
  isGracePeriod,
}: UnstakeConfirmationProps) {
  const [isChecked, setIsChecked] = useState(false);
  const router = useRouter();
  const unstake = useUnstake();

  const handleConfirm = async () => {
    if (!isChecked) return;

    try {
      await unstake.mutateAsync({ stakePublicKey });
      // On success, close dialog and navigate to dashboard
      onClose();
      router.push("/dashboard");
    } catch (error) {
      // Error is handled by mutation's onError (toast)
      console.error("Unstake error:", error);
    }
  };

  const handleClose = () => {
    if (!unstake.isPending) {
      setIsChecked(false);
      onClose();
    }
  };

  // Calculate penalty percentage
  const penaltyBps = stakedAmount.isZero()
    ? 0
    : penalty.mul(new BN(10000)).div(stakedAmount).toNumber();

  // Checkbox text
  const checkboxText = isGracePeriod
    ? "I understand this will end my stake and claim all rewards"
    : `I understand I will lose ${formatHelix(penalty)} (${formatBps(penaltyBps)})`;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent open={isOpen} className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Confirm End Stake</DialogTitle>
          <DialogDescription>
            Review the details below before ending your stake.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-4">
          <div className="flex justify-between text-sm">
            <span className="text-zinc-400">Staked Amount</span>
            <span className="text-zinc-100 font-medium">{formatHelix(stakedAmount)}</span>
          </div>

          {penalty.gt(new BN(0)) && (
            <div className="flex justify-between text-sm">
              <span className="text-zinc-400">Penalty Amount</span>
              <span className="text-red-400 font-medium">
                -{formatHelix(penalty)} ({formatBps(penaltyBps)})
              </span>
            </div>
          )}

          <div className="border-t border-zinc-700 pt-3 flex justify-between font-semibold">
            <span className="text-zinc-100">You Receive</span>
            <span className={penalty.gt(new BN(0)) ? "text-yellow-400" : "text-green-400"}>
              {formatHelix(totalReceive)}
            </span>
          </div>
        </div>

        {/* Mandatory Checkbox */}
        <div className="flex items-start space-x-3 rounded-lg border border-zinc-700 p-4">
          <Checkbox
            id="confirm-unstake"
            checked={isChecked}
            onCheckedChange={(checked) => setIsChecked(checked === true)}
            disabled={unstake.isPending}
          />
          <label
            htmlFor="confirm-unstake"
            className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer select-none"
          >
            {checkboxText}
          </label>
        </div>

        <DialogFooter className="flex-row gap-2 sm:justify-end">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={unstake.isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!isChecked || unstake.isPending}
            className="bg-red-600 hover:bg-red-700"
          >
            {unstake.isPending ? (
              <>
                <SpinnerIcon className="mr-2 h-4 w-4 animate-spin" />
                Ending Stake...
              </>
            ) : (
              "End Stake"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Simple spinner icon
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
