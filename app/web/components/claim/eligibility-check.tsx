"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useClaimConfig } from "@/lib/hooks/useClaimConfig";
import { useGlobalState } from "@/lib/hooks/useGlobalState";
import { useProgram } from "@/lib/hooks/useProgram";
import { deriveClaimStatus } from "@/lib/solana/pdas";
import { ClaimForm } from "./claim-form";
import { VestingStatus } from "./vesting-status";

/**
 * Eligibility check component for free claim.
 *
 * Shows claim period status and determines if user can claim.
 * - Not Started: show countdown or "Coming Soon"
 * - Active: show claim form
 * - Ended: show "Claim period has ended"
 * - Already Claimed: show vesting status instead
 */
export function EligibilityCheck() {
  const wallet = useWallet();
  const program = useProgram();
  const { data: claimConfig, isLoading: isLoadingConfig } = useClaimConfig();
  const { data: globalState, isLoading: isLoadingGlobal } = useGlobalState();

  // Query ClaimStatus to check if user already claimed
  const { data: claimStatus, isLoading: isLoadingStatus } = useQuery({
    queryKey: ["claimStatus", wallet.publicKey?.toBase58()],
    queryFn: async () => {
      if (!wallet.publicKey || !claimConfig) return null;

      try {
        const [claimStatusPda] = deriveClaimStatus(
          Buffer.from(claimConfig.merkleRoot),
          wallet.publicKey
        );
        const status = await program.account.claimStatus.fetch(claimStatusPda);
        return { publicKey: claimStatusPda, data: status };
      } catch (error) {
        // Account not found: user hasn't claimed yet
        if (error instanceof Error && error.message.includes("Account does not exist")) {
          return null;
        }
        throw error;
      }
    },
    enabled: !!wallet.publicKey && !!claimConfig,
  });

  if (!wallet.publicKey) {
    return (
      <Alert>
        <AlertDescription>
          Please connect your wallet to check free claim eligibility
        </AlertDescription>
      </Alert>
    );
  }

  if (isLoadingConfig || isLoadingGlobal || isLoadingStatus) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Free Claim</CardTitle>
          <CardDescription>Loading claim period status...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  // No claim period initialized
  if (!claimConfig) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Free Claim</CardTitle>
          <CardDescription>
            The free claim period has not been initialized yet. Check back soon!
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  // User already claimed
  if (claimStatus?.data.isClaimed) {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Free Claim</CardTitle>
            <CardDescription className="text-green-400">
              ✓ You have already claimed your HELIX tokens
            </CardDescription>
          </CardHeader>
        </Card>
        <VestingStatus claimStatus={claimStatus} />
      </div>
    );
  }

  // Check claim period status
  const currentSlot = globalState
    ? globalState.initSlot.toNumber() + globalState.currentDay.toNumber() * globalState.slotsPerDay.toNumber()
    : 0;

  const isNotStarted = !claimConfig.claimPeriodStarted;
  const isEnded = currentSlot > claimConfig.endSlot.toNumber();
  const isActive = claimConfig.claimPeriodStarted && !isEnded;

  if (isNotStarted) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Free Claim</CardTitle>
          <CardDescription>
            The claim period has not started yet. Coming Soon!
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (isEnded) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Free Claim</CardTitle>
          <CardDescription className="text-red-400">
            The claim period has ended. Unclaimed tokens will be distributed via Big Pay Day.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Visit the <a href="/dashboard/rewards" className="text-primary underline">Rewards</a> page to see Big Pay Day status.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Active claim period
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Free Claim</CardTitle>
          <CardDescription className="text-green-400">
            ✓ Claim period is active
          </CardDescription>
        </CardHeader>
      </Card>
      <ClaimForm merkleRoot={Buffer.from(claimConfig.merkleRoot)} />
    </div>
  );
}
