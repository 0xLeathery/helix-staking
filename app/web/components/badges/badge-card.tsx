"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/cn";
import {
  BADGE_NAMES,
  TIER_COLORS,
  MILESTONE_COLOR,
  MILESTONE_BADGES,
  TIER_THRESHOLDS_DISPLAY,
  type BadgeType,
} from "@/lib/badges/badge-types";

interface BadgeCardProps {
  badgeType: BadgeType;
  name: string;
  description: string;
  requirement: string;
  eligible: boolean;
  claimed: boolean;
  earnedAt: string | null;
  stakeAmount: string | null;
  claimSignature?: string;
  onClaim?: () => void;
  // For tier badges: progress toward next threshold
  currentMaxStake?: string; // user's largest single stake (base units)
}

function BadgeVisual({
  badgeType,
  eligible,
  claimed,
}: {
  badgeType: BadgeType;
  eligible: boolean;
  claimed: boolean;
}) {
  const isMilestone = MILESTONE_BADGES.includes(badgeType);
  const colors = isMilestone
    ? MILESTONE_COLOR
    : TIER_COLORS[badgeType] ?? { primary: "#6B7280", secondary: "#4B5563" };

  const isActive = eligible || claimed;

  return (
    <div className="relative flex items-center justify-center">
      <div
        className={cn(
          "h-20 w-20 rounded-full flex items-center justify-center transition-all",
          !isActive && "grayscale opacity-40"
        )}
        style={{
          background: isActive
            ? `radial-gradient(circle at 40% 35%, ${colors.primary}, ${colors.secondary})`
            : "radial-gradient(circle at 40% 35%, #4B5563, #374151)",
        }}
      >
        {isMilestone ? (
          <HexagonIcon className="h-10 w-10 text-white/80" />
        ) : (
          <TierShapeIcon badgeType={badgeType} />
        )}
      </div>
      {claimed && (
        <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-green-500 flex items-center justify-center border-2 border-zinc-900">
          <CheckIcon className="h-3 w-3 text-white" />
        </div>
      )}
      {!eligible && !claimed && (
        <div className="absolute inset-0 flex items-center justify-center">
          <LockIcon className="h-8 w-8 text-zinc-400" />
        </div>
      )}
    </div>
  );
}

function TierShapeIcon({ badgeType }: { badgeType: BadgeType }) {
  switch (badgeType) {
    case "shrimp":
      return <CircleShape className="h-9 w-9 text-white/80" />;
    case "fish":
      return <PentagonShape className="h-9 w-9 text-white/80" />;
    case "dolphin":
      return <HexagonIcon className="h-9 w-9 text-white/80" />;
    case "shark":
      return <StarShape className="h-9 w-9 text-white/80" />;
    case "whale":
      return <DiamondShape className="h-9 w-9 text-white/80" />;
    default:
      return <CircleShape className="h-9 w-9 text-white/80" />;
  }
}

export function BadgeCard({
  badgeType,
  name,
  description,
  requirement,
  eligible,
  claimed,
  earnedAt,
  stakeAmount,
  claimSignature,
  onClaim,
  currentMaxStake,
}: BadgeCardProps) {
  const isMilestone = MILESTONE_BADGES.includes(badgeType);
  const isTierBadge = !isMilestone;
  const threshold = TIER_THRESHOLDS_DISPLAY[badgeType];

  // Progress bar for tier badges
  let progressPercent = 0;
  if (isTierBadge && threshold && currentMaxStake) {
    // currentMaxStake is in base units (8 decimals), threshold is in HELIX
    const stakeInHelix = Number(currentMaxStake) / 1e8;
    progressPercent = Math.min(100, (stakeInHelix / threshold) * 100);
  }

  const formattedEarnedDate = earnedAt
    ? new Date(earnedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : null;

  return (
    <Card
      className={cn(
        "flex flex-col transition-all duration-200",
        claimed && "ring-1 ring-zinc-700",
        eligible && !claimed && "ring-2 ring-helix-400/60 shadow-lg shadow-helix-400/20",
        !eligible && !claimed && "opacity-60"
      )}
    >
      <CardContent className="flex flex-col items-center gap-3 p-4 flex-1">
        {/* Badge Visual */}
        <BadgeVisual badgeType={badgeType} eligible={eligible} claimed={claimed} />

        {/* Badge Name */}
        <h3
          className={cn(
            "text-sm font-semibold text-center",
            eligible || claimed ? "text-zinc-100" : "text-zinc-400"
          )}
        >
          {name}
        </h3>

        {/* Description */}
        <p className="text-xs text-zinc-400 text-center leading-relaxed">{description}</p>

        {/* State-specific content */}
        <div className="flex flex-col items-center gap-2 w-full mt-auto">
          {claimed ? (
            <>
              {formattedEarnedDate && (
                <p className="text-xs text-zinc-400">
                  Claimed {formattedEarnedDate}
                </p>
              )}
              {claimSignature && (
                <a
                  href={`https://solscan.io/tx/${claimSignature}?cluster=devnet`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-helix-400 hover:text-helix-300 underline underline-offset-2"
                >
                  View on Solscan
                </a>
              )}
            </>
          ) : eligible ? (
            <Button
              size="sm"
              variant="default"
              className="w-full"
              onClick={onClaim}
            >
              Claim
            </Button>
          ) : (
            <p className="text-xs text-zinc-400 text-center">{requirement}</p>
          )}
        </div>

        {/* Tier progress bar (only for unclaimed tier badges) */}
        {isTierBadge && !claimed && threshold && (
          <div className="w-full mt-1">
            <div className="flex justify-between text-xs text-zinc-400 mb-1">
              <span>Progress</span>
              <span>
                {progressPercent.toFixed(0)}% of{" "}
                {threshold >= 1_000_000
                  ? `${(threshold / 1_000_000).toFixed(0)}M`
                  : threshold >= 1_000
                  ? `${(threshold / 1_000).toFixed(0)}K`
                  : threshold}{" "}
                HELIX
              </span>
            </div>
            <Progress
              value={progressPercent}
              className="h-1.5 bg-zinc-800"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// SVG icon helpers
function HexagonIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path d="M12 2L21.5 7.5v9L12 22 2.5 16.5v-9L12 2z" />
    </svg>
  );
}

function CircleShape({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className={className}>
      <circle cx="12" cy="12" r="9" />
    </svg>
  );
}

function PentagonShape({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M12 2 L21.5 8.8 L18 20 L6 20 L2.5 8.8 Z" />
    </svg>
  );
}

function StarShape({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17 5.8 21.3l2.4-7.4L2 9.4h7.6z" />
    </svg>
  );
}

function DiamondShape({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M12 2 L22 12 L12 22 L2 12 Z" />
    </svg>
  );
}

function LockIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}
