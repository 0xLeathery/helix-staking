"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";

interface ProtocolPausedBannerProps {
  isPaused: boolean;
}

export function ProtocolPausedBanner({ isPaused }: ProtocolPausedBannerProps) {
  if (!isPaused) return null;

  return (
    <Alert className="border-red-500/50 bg-red-500/10">
      <AlertDescription className="text-red-400">
        <strong>Protocol Paused</strong> — Staking, unstaking, and claiming are
        temporarily disabled. Please check back later.
      </AlertDescription>
    </Alert>
  );
}
