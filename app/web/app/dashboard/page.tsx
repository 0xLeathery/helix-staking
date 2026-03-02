"use client";

import BN from "bn.js";
import { ProtocolStats } from "@/components/dashboard/protocol-stats";
import { PortfolioSummary } from "@/components/dashboard/portfolio-summary";
import { StakesList } from "@/components/dashboard/stakes-list";
import { ErrorBoundary } from "@/components/error-boundary";
import { ProtocolPausedBanner } from "@/components/dashboard/protocol-paused-banner";
import { ReferralStatsPanel } from "@/components/dashboard/referral-stats-panel";
import { useGlobalState } from "@/lib/hooks/useGlobalState";

export default function DashboardPage() {
  const { data: globalState } = useGlobalState();
  const reserved = globalState?.reserved as BN[] | undefined;
  const isPaused = reserved && reserved.length > 1 && !reserved[1].isZero();

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <h1 className="text-2xl font-bold text-zinc-100">Your Dashboard</h1>

      {/* Protocol Paused Banner */}
      <ProtocolPausedBanner isPaused={!!isPaused} />

      {/* Protocol Stats - full width */}
      <ProtocolStats />

      {/* Referral Program */}
      <ErrorBoundary>
        <ReferralStatsPanel />
      </ErrorBoundary>

      {/* Portfolio + Stakes - 2-column on desktop */}
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <ErrorBoundary>
            <PortfolioSummary />
          </ErrorBoundary>
        </div>
        <div className="lg:col-span-2">
          <ErrorBoundary>
            <StakesList />
          </ErrorBoundary>
        </div>
      </div>
    </div>
  );
}
