"use client";

import { BadgeGallery } from "@/components/badges/badge-gallery";
import { ErrorBoundary } from "@/components/error-boundary";

export default function BadgesPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-zinc-100">Achievement Badges</h1>
        <p className="text-zinc-400 mt-1">
          Earn soulbound NFT badges by reaching staking milestones. Badges are permanently yours and non-transferable.
        </p>
      </div>
      <ErrorBoundary>
        <BadgeGallery />
      </ErrorBoundary>
    </div>
  );
}
