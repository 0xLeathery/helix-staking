"use client";

import { useBadges } from "@/lib/hooks/useBadges";
import { BadgeCard } from "./badge-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert } from "@/components/ui/alert";
import {
  MILESTONE_BADGES,
  TIER_BADGES,
  TIER_THRESHOLDS_DISPLAY,
  type BadgeType,
} from "@/lib/badges/badge-types";
import type { BadgeInfo } from "@/lib/hooks/useBadges";

export function BadgeGallery() {
  const { data: badges, isLoading, error, refetch } = useBadges();

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
      <Alert variant="destructive">
        <p className="text-sm font-medium">Failed to load badges</p>
        <p className="text-sm text-zinc-400 mt-1">
          {error instanceof Error ? error.message : "Unknown error"}
        </p>
        <button
          onClick={() => refetch()}
          className="mt-3 text-sm text-helix-400 hover:text-helix-300 underline underline-offset-2"
        >
          Try again
        </button>
      </Alert>
    );
  }

  if (!badges) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-zinc-400 text-sm">
          Connect your wallet to view your badge collection.
        </p>
      </div>
    );
  }

  const badgeMap = new Map<string, BadgeInfo>(badges.map((b) => [b.badgeType, b]));

  // Compute currentMaxStake from tier badge eligibility data
  // All tier badges share the same source — the user's largest single stake
  let currentMaxStake: string | undefined;
  for (const tierType of TIER_BADGES) {
    const b = badgeMap.get(tierType);
    if (b?.stakeAmount) {
      if (!currentMaxStake || BigInt(b.stakeAmount) > BigInt(currentMaxStake)) {
        currentMaxStake = b.stakeAmount;
      }
    }
  }

  return (
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
              />
            );
          })}
        </div>
      </section>
    </div>
  );
}

function SkeletonSection({ title, count }: { title: string; count: number }) {
  return (
    <section>
      <div className="h-7 w-32 bg-zinc-800 rounded mb-4 animate-pulse" />
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
