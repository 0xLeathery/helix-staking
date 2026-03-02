"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  MILESTONE_BADGES,
  TIER_COLORS,
  MILESTONE_COLOR,
  type BadgeType,
} from "@/lib/badges/badge-types";
import { cn } from "@/lib/cn";

interface BadgeCelebrationProps {
  show: boolean;
  badgeName: string;
  badgeType: BadgeType;
  signature: string;
  onDismiss: () => void;
}

// Confetti particles: color, angle, distance
const PARTICLES = [
  { color: "#A78BFA", angle: 0,   dist: 90 },
  { color: "#FBBF24", angle: 30,  dist: 100 },
  { color: "#7C3AED", angle: 60,  dist: 85 },
  { color: "#FFFFFF", angle: 90,  dist: 110 },
  { color: "#A78BFA", angle: 120, dist: 95 },
  { color: "#FBBF24", angle: 150, dist: 105 },
  { color: "#7C3AED", angle: 180, dist: 88 },
  { color: "#FFFFFF", angle: 210, dist: 98 },
  { color: "#A78BFA", angle: 240, dist: 92 },
  { color: "#FBBF24", angle: 270, dist: 108 },
  { color: "#7C3AED", angle: 300, dist: 80 },
  { color: "#FFFFFF", angle: 330, dist: 102 },
  { color: "#A78BFA", angle: 15,  dist: 75 },
  { color: "#FBBF24", angle: 75,  dist: 115 },
  { color: "#7C3AED", angle: 195, dist: 72 },
  { color: "#FFFFFF", angle: 315, dist: 95 },
];

function CelebrationBadgeVisual({ badgeType }: { badgeType: BadgeType }) {
  const isMilestone = MILESTONE_BADGES.includes(badgeType);
  const colors = isMilestone
    ? MILESTONE_COLOR
    : TIER_COLORS[badgeType] ?? { primary: "#6B7280", secondary: "#4B5563" };

  return (
    <div
      className="h-[120px] w-[120px] rounded-full flex items-center justify-center relative"
      style={{
        background: `radial-gradient(circle at 40% 35%, ${colors.primary}, ${colors.secondary})`,
        boxShadow: `0 0 40px ${colors.primary}88, 0 0 80px ${colors.primary}44`,
      }}
    >
      {/* Pulsing ring */}
      <div
        className="absolute inset-0 rounded-full animate-ping opacity-20"
        style={{ background: colors.primary }}
      />
    </div>
  );
}

function ConfettiParticles({ show }: { show: boolean }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      {PARTICLES.map((p, i) => {
        const rad = (p.angle * Math.PI) / 180;
        const tx = Math.cos(rad) * p.dist;
        const ty = Math.sin(rad) * p.dist;

        return (
          <div
            key={i}
            className={cn(
              "absolute h-2.5 w-2.5 rounded-full transition-all",
              show ? "opacity-0" : "opacity-0"
            )}
            style={{
              backgroundColor: p.color,
              transform: show
                ? `translate(${tx}px, ${ty}px) scale(0)`
                : "translate(0, 0) scale(1)",
              opacity: show ? 0 : 0,
              animation: show
                ? `confettiBurst 1.4s ease-out ${i * 40}ms both`
                : "none",
            }}
          />
        );
      })}

      <style>{`
        @keyframes confettiBurst {
          0% {
            transform: translate(0, 0) scale(1);
            opacity: 1;
          }
          70% {
            opacity: 0.8;
          }
          100% {
            transform: translate(var(--tx), var(--ty)) scale(0.3);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}

function InlineConfetti({ show }: { show: boolean }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
      <style>{`
        @keyframes burst-out {
          0%   { transform: translate(0, 0) scale(1); opacity: 1; }
          100% { opacity: 0; }
        }
      `}</style>
      {PARTICLES.map((p, i) => {
        const rad = (p.angle * Math.PI) / 180;
        const tx = Math.cos(rad) * p.dist;
        const ty = Math.sin(rad) * p.dist;
        return (
          <div
            key={i}
            className="absolute h-3 w-3 rounded-full"
            style={{
              backgroundColor: p.color,
              opacity: show ? 1 : 0,
              animation: show
                ? `burst-out 1.4s ease-out ${i * 50}ms forwards`
                : "none",
              transform: show
                ? `translate(${tx}px, ${ty}px) scale(0.4)`
                : "translate(0,0) scale(1)",
            }}
          />
        );
      })}
    </div>
  );
}

export function BadgeCelebration({
  show,
  badgeName,
  badgeType,
  signature,
  onDismiss,
}: BadgeCelebrationProps) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-dismiss after 10 seconds
  useEffect(() => {
    if (show) {
      timerRef.current = setTimeout(() => {
        onDismiss();
      }, 10_000);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [show, onDismiss]);

  if (!show) return null;

  const shareText = encodeURIComponent(
    `I just earned the ${badgeName} badge on HELIX! #HELIXstaking`
  );
  const shareUrl = `https://twitter.com/intent/tweet?text=${shareText}`;
  const solscanUrl = `https://solscan.io/tx/${signature}?cluster=devnet`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/80 backdrop-blur-sm"
      style={{
        animation: "fadeScaleIn 0.35s ease-out both",
      }}
    >
      <style>{`
        @keyframes fadeScaleIn {
          from { opacity: 0; transform: scale(0.85); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes confettiFloat {
          0%   { transform: translate(0, 0) scale(1); opacity: 1; }
          100% { opacity: 0; }
        }
        @keyframes radialPulse {
          0%   { opacity: 0.15; transform: scale(0.9); }
          50%  { opacity: 0.3; transform: scale(1.1); }
          100% { opacity: 0.15; transform: scale(0.9); }
        }
      `}</style>

      <div className="relative flex flex-col items-center gap-6 px-8 py-10 text-center max-w-xs w-full">
        {/* Radial glow pulse behind badge */}
        <div
          className="absolute rounded-full w-64 h-64 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(167,139,250,0.25) 0%, transparent 70%)",
            animation: "radialPulse 2.5s ease-in-out infinite",
          }}
        />

        {/* Badge visual with confetti burst around it */}
        <div className="relative flex items-center justify-center">
          <InlineConfetti show={show} />
          <CelebrationBadgeVisual badgeType={badgeType} />
        </div>

        {/* Success text */}
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-widest text-helix-400">
            Badge Earned!
          </p>
          <h2 className="text-2xl font-bold text-white">{badgeName}</h2>
          <p className="text-sm text-zinc-400">
            Permanently minted to your wallet
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col gap-2 w-full">
          <a
            href={shareUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-md border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-100 hover:bg-zinc-700 transition-colors"
          >
            <XIcon className="h-4 w-4" />
            Share on X
          </a>
          <a
            href={solscanUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-helix-400 hover:text-helix-300 underline underline-offset-2"
          >
            View Transaction on Solscan
          </a>
        </div>

        {/* Dismiss */}
        <Button variant="ghost" size="sm" onClick={onDismiss} className="text-zinc-500">
          Done
        </Button>
      </div>
    </div>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}
