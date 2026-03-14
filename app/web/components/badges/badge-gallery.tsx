"use client";

import { useState } from "react";
import { AlertCircle, Trophy } from "lucide-react";
import { useBadges } from "@/lib/hooks/useBadges";
import { BadgeCard } from "./badge-card";
import { BadgeClaimDialog } from "./badge-claim-dialog";
import { BadgeCelebration } from "./badge-celebration";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import {
  MILESTONE_BADGES,
  TIER_BADGES,
  TIER_THRESHOLDS_DISPLAY,
  type BadgeType,
} from "@/lib/badges/badge-types";
import type { BadgeInfo } from "@/lib/hooks/useBadges";

export function BadgeGallery() {
  const { data: badges, isLoading, error, refetch } = useBadges();
  const [selectedBadge, setSelectedBadge] = useState<BadgeInfo | null>(null);
  const [celebrationData, setCelebrationData] = useState<{
    badgeName: string;
    badgeType: BadgeType;
    signature: string;
  } | null>(null);

  if (isLoading) {
    return (
      <div className="space-y-8">
        <SkeletonSection title="Milestones" count={3} />
        <SkeletonSection title="Tier Badges" count={5} />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-penalty-800">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-penalty-400 mt-0.5 shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-penalty-300">Failed to load badges</p>
              <p className="text-xs text-zinc-400 mt-0.5">
                {error instanceof Error ? error.message : "Unknown error"}
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!badges) {
    return (
      <EmptyState
        icon={Trophy}
        headline="Badge Collection"
        description="Connect your wallet to view your badge collection."
      />
    );
  }

  const badgeMap = new Map<string, BadgeInfo>(badges.map((b) => [b.badgeType, b]));

  // Compute currentMaxStake from tier badge eligibility data
  // All tier badges share the same source — the user's largest single stake
  let currentMaxStake: string | undefined;
  for (const tierType of TIER_BADGES) {
    const b = badgeMap.get(tierType);
    if (b?.stakeAmount) {
      if (!currentMaxStake || Number(b.stakeAmount) > Number(currentMaxStake)) {
        currentMaxStake = b.stakeAmount;
      }
    }
  }

  return (
    <>
      <div className="space-y-10">
        {/* Milestones Section */}
        <section>
          <h2 className="text-lg font-semibold text-zinc-200 mb-4">Milestones</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {MILESTONE_BADGES.map((badgeType) => {
              const badge = badgeMap.get(badgeType);
              return (
                <BadgeCard
                  key={badgeType}
                  badgeType={badgeType as BadgeType}
                  name={badge?.name ?? badgeType}
                  description={badge?.description ?? ""}
                  requirement={badge?.requirement ?? ""}
                  eligible={badge?.eligible ?? false}
                  claimed={badge?.claimed ?? false}
                  earnedAt={badge?.earnedAt ?? null}
                  stakeAmount={badge?.stakeAmount ?? null}
                  claimSignature={badge?.claimSignature}
                  onClaim={() => badge && setSelectedBadge(badge)}
                />
              );
            })}
          </div>
        </section>

        {/* Tier Badges Section */}
        <section>
          <h2 className="text-lg font-semibold text-zinc-200 mb-4">Tier Badges</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {TIER_BADGES.map((badgeType) => {
              const badge = badgeMap.get(badgeType);
              return (
                <BadgeCard
                  key={badgeType}
                  badgeType={badgeType as BadgeType}
                  name={badge?.name ?? badgeType}
                  description={badge?.description ?? ""}
                  requirement={badge?.requirement ?? ""}
                  eligible={badge?.eligible ?? false}
                  claimed={badge?.claimed ?? false}
                  earnedAt={badge?.earnedAt ?? null}
                  stakeAmount={badge?.stakeAmount ?? null}
                  claimSignature={badge?.claimSignature}
                  currentMaxStake={currentMaxStake}
                  onClaim={() => badge && setSelectedBadge(badge)}
                />
              );
            })}
          </div>
        </section>
      </div>

      {/* Claim dialog */}
      <BadgeClaimDialog
        badge={selectedBadge}
        open={!!selectedBadge}
        onOpenChange={(open) => { if (!open) setSelectedBadge(null); }}
        onSuccess={(result) => {
          setSelectedBadge(null);
          setCelebrationData({
            badgeName: result.badgeName,
            badgeType: result.badgeType as BadgeType,
            signature: result.signature,
          });
        }}
      />

      {/* Celebration overlay */}
      {celebrationData && (
        <BadgeCelebration
          show={!!celebrationData}
          badgeName={celebrationData.badgeName}
          badgeType={celebrationData.badgeType}
          signature={celebrationData.signature}
          onDismiss={() => setCelebrationData(null)}
        />
      )}
    </>
  );
}

function SkeletonSection({ title, count }: { title: string; count: number }) {
  return (
    <section>
      <Skeleton className="h-7 w-32 mb-4" />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 space-y-3">
            <Skeleton className="h-20 w-20 rounded-full mx-auto" />
            <Skeleton className="h-4 w-24 mx-auto" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-3/4 mx-auto" />
            <Skeleton className="h-9 w-full" />
          </div>
        ))}
      </div>
    </section>
  );
}
