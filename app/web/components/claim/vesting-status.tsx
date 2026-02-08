"use client";

import { PublicKey } from "@solana/web3.js";
import BN from "bn.js";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useGlobalState } from "@/lib/hooks/useGlobalState";
import { useWithdrawVested } from "@/lib/hooks/useWithdrawVested";
import { formatHelix } from "@/lib/utils/format";

interface VestingStatusProps {
  claimStatus: {
    publicKey: PublicKey;
    data: {
      claimedAmount: BN;
      claimedSlot: BN;
      withdrawnAmount: BN;
      vestingEndSlot: BN;
    };
  };
}

/**
 * Vesting status component.
 *
 * Shows vesting progress with:
 * - Total claimed
 * - Vesting progress bar (0-100% over 30 days)
 * - Already withdrawn
 * - Available to withdraw (calculated based on time elapsed)
 * - Withdraw button
 */
export function VestingStatus({ claimStatus }: VestingStatusProps) {
  const { data: globalState } = useGlobalState();
  const withdrawVested = useWithdrawVested();

  if (!globalState) {
    return null;
  }

  const { claimedAmount, claimedSlot, withdrawnAmount, vestingEndSlot } = claimStatus.data;

  // Calculate current slot
  const currentSlot =
    globalState.initSlot.toNumber() + globalState.currentDay.toNumber() * globalState.slotsPerDay.toNumber();

  // Calculate vesting progress
  const totalVestingDuration = vestingEndSlot.sub(claimedSlot).toNumber();
  const elapsedVesting = Math.min(currentSlot - claimedSlot.toNumber(), totalVestingDuration);
  const vestingProgress = Math.floor((elapsedVesting / totalVestingDuration) * 100);

  // Calculate vested amount
  // 10% immediate + 90% linear over 30 days
  const immediateAmount = claimedAmount.muln(10).divn(100);
  const vestingPortion = claimedAmount.sub(immediateAmount);

  let totalVested: BN;
  if (currentSlot >= vestingEndSlot.toNumber()) {
    // Fully vested
    totalVested = claimedAmount;
  } else if (currentSlot <= claimedSlot.toNumber()) {
    // Only immediate (shouldn't happen)
    totalVested = immediateAmount;
  } else {
    // Linear vesting: immediate + (vesting_portion * elapsed / duration)
    const unlockedVesting = vestingPortion.muln(elapsedVesting).divn(totalVestingDuration);
    totalVested = immediateAmount.add(unlockedVesting);
  }

  const availableToWithdraw = totalVested.sub(withdrawnAmount);
  const isFullyVested = currentSlot >= vestingEndSlot.toNumber();

  const handleWithdraw = async () => {
    try {
      await withdrawVested.mutateAsync({
        claimStatusPublicKey: claimStatus.publicKey,
      });
    } catch (err) {
      console.error("Withdraw failed:", err);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vesting Status</CardTitle>
        <CardDescription>
          {isFullyVested
            ? "Your tokens are fully vested!"
            : `${vestingProgress}% vested - ${100 - vestingProgress}% remaining`}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Total Claimed:</span>
            <span className="font-mono">{formatHelix(claimedAmount)} HELIX</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Immediately Available (10%):</span>
            <span className="font-mono">{formatHelix(immediateAmount)} HELIX</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Vesting Progress:</span>
            <span className="font-mono">{vestingProgress}%</span>
          </div>
          <Progress value={vestingProgress} className="h-2" />
          {!isFullyVested && (
            <p className="text-xs text-muted-foreground">
              90% of your tokens vest linearly over 30 days
            </p>
          )}
        </div>

        <div className="space-y-2 border-t pt-4">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Already Withdrawn:</span>
            <span className="font-mono">{formatHelix(withdrawnAmount)} HELIX</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Available to Withdraw:</span>
            <span className="font-mono font-bold text-green-400">
              {formatHelix(availableToWithdraw)} HELIX
            </span>
          </div>
        </div>

        <Button
          className="w-full"
          size="lg"
          onClick={handleWithdraw}
          disabled={availableToWithdraw.isZero() || withdrawVested.isPending}
        >
          {withdrawVested.isPending
            ? "Withdrawing..."
            : availableToWithdraw.isZero()
            ? "No Tokens Available"
            : "Withdraw Available"}
        </Button>

        {isFullyVested && (
          <p className="text-sm text-center text-muted-foreground">
            All tokens have vested. Withdraw your remaining balance above.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
