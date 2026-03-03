"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { useClaimBadge } from "@/lib/hooks/useClaimBadge";
import {
  MILESTONE_BADGES,
  TIER_COLORS,
  MILESTONE_COLOR,
  type BadgeType,
} from "@/lib/badges/badge-types";
import type { BadgeInfo } from "@/lib/hooks/useBadges";
import { cn } from "@/lib/cn";

interface BadgeClaimDialogProps {
  badge: BadgeInfo | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (result: {
    signature: string;
    assetId: string;
    badgeType: string;
    badgeName: string;
  }) => void;
}

function DialogBadgeVisual({ badgeType }: { badgeType: BadgeType }) {
  const isMilestone = MILESTONE_BADGES.includes(badgeType);
  const colors = isMilestone
    ? MILESTONE_COLOR
    : TIER_COLORS[badgeType] ?? { primary: "#6B7280", secondary: "#4B5563" };

  return (
    <div
      className="h-20 w-20 rounded-full flex items-center justify-center mx-auto"
      style={{
        background: `radial-gradient(circle at 40% 35%, ${colors.primary}, ${colors.secondary})`,
        boxShadow: `0 0 24px ${colors.primary}66`,
      }}
    />
  );
}

function SpinnerIcon({ className }: { className?: string }) {
  return (
    <svg
      className={cn("animate-spin", className)}
      xmlns="http://www.w3.org/2000/svg"
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
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}

export function BadgeClaimDialog({
  badge,
  open,
  onOpenChange,
  onSuccess,
}: BadgeClaimDialogProps) {
  const claimBadge = useClaimBadge();
  const [mintError, setMintError] = useState<string | null>(null);

  async function handleConfirmMint() {
    if (!badge) return;
    setMintError(null);

    try {
      const result = await claimBadge.mutateAsync({
        badgeType: badge.badgeType as BadgeType,
      });
      onSuccess({
        signature: result.signature,
        assetId: result.assetId,
        badgeType: badge.badgeType,
        badgeName: badge.name,
      });
      onOpenChange(false);
    } catch (err) {
      setMintError(err instanceof Error ? err.message : "Minting failed. Please try again.");
    }
  }

  function handleOpenChange(nextOpen: boolean) {
    if (!claimBadge.isPending) {
      setMintError(null);
      onOpenChange(nextOpen);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent open={open} className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-center">Claim Badge</DialogTitle>
          <DialogDescription className="text-center">
            Preview your badge before minting
          </DialogDescription>
        </DialogHeader>

        {badge && (
          <div className="flex flex-col items-center gap-4 py-2">
            {/* Badge preview */}
            <DialogBadgeVisual badgeType={badge.badgeType as BadgeType} />

            {/* Badge info */}
            <div className="text-center space-y-1">
              <h3 className="text-base font-semibold text-zinc-100">{badge.name}</h3>
              <p className="text-sm text-zinc-400">{badge.description}</p>
            </div>

            {/* Soulbound notice */}
            <div className="w-full rounded-lg bg-zinc-800/60 border border-zinc-700/50 px-3 py-2">
              <p className="text-xs text-zinc-400 text-center leading-relaxed">
                This badge is permanently soulbound (non-transferable) and will be
                minted directly to your wallet at no cost.
              </p>
            </div>

            {/* Error state */}
            {mintError && (
              <Alert variant="destructive" className="w-full">
                <p className="text-sm font-medium">Minting failed</p>
                <p className="text-sm text-zinc-300 mt-0.5">{mintError}</p>
                <button
                  onClick={() => setMintError(null)}
                  className="mt-2 text-xs text-zinc-300 hover:text-white underline underline-offset-2"
                >
                  Try Again
                </button>
              </Alert>
            )}
          </div>
        )}

        <DialogFooter className="gap-2 sm:gap-0">
          <DialogClose asChild>
            <Button
              variant="secondary"
              disabled={claimBadge.isPending}
              onClick={() => setMintError(null)}
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            onClick={handleConfirmMint}
            disabled={claimBadge.isPending || !badge}
            className="min-w-[120px]"
          >
            {claimBadge.isPending ? (
              <span className="flex items-center gap-2">
                <SpinnerIcon className="h-4 w-4" />
                Minting...
              </span>
            ) : (
              "Confirm Mint"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
