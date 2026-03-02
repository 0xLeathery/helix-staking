"use client";

import Link from "next/link";
import { useBadges } from "@/lib/hooks/useBadges";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  TIER_COLORS,
  MILESTONE_COLOR,
  MILESTONE_BADGES,
  type BadgeType,
} from "@/lib/badges/badge-types";

function BadgeCircle({ badgeType }: { badgeType: string }) {
  const isMilestone = MILESTONE_BADGES.includes(badgeType as BadgeType);
  const colors = isMilestone
    ? MILESTONE_COLOR
    : TIER_COLORS[badgeType] ?? { primary: "#6B7280", secondary: "#4B5563" };

  return (
    <div
      className="h-8 w-8 rounded-full flex-shrink-0 border border-zinc-700/50"
      style={{
        background: `radial-gradient(circle at 40% 35%, ${colors.primary}, ${colors.secondary})`,
      }}
      title={badgeType}
    />
  );
}

export function BadgeMiniStrip() {
  const { data: badges, isLoading } = useBadges();

  // Graceful absence: nothing shown while loading or no earned badges
  if (isLoading || !badges) {
    return null;
  }

  // Only show earned badges (eligible OR claimed)
  const earnedBadges = badges.filter((b) => b.eligible || b.claimed);

  if (earnedBadges.length === 0) {
    return null;
  }

  const MAX_VISIBLE = 6;
  const visibleBadges = earnedBadges.slice(0, MAX_VISIBLE);
  const extraCount = earnedBadges.length - MAX_VISIBLE;

  return (
    <Card>
      <CardHeader className="pb-3 pt-4 px-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-zinc-100">
            Your Badges
          </CardTitle>
          <Link
            href="/dashboard/badges"
            className="text-xs text-helix-400 hover:text-helix-300 transition-colors"
          >
            View All &rarr;
          </Link>
        </div>
      </CardHeader>
      <CardContent className="px-4 pb-4 pt-0">
        <div className="flex items-center gap-2 flex-wrap">
          {visibleBadges.map((badge) => (
            <BadgeCircle key={badge.badgeType} badgeType={badge.badgeType} />
          ))}
          {extraCount > 0 && (
            <div className="h-8 w-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center flex-shrink-0">
              <span className="text-xs text-zinc-400 font-medium">+{extraCount}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
