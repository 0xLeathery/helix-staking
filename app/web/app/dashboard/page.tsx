"use client";

import BN from "bn.js";
import { m } from "framer-motion";
import { ProtocolStats } from "@/components/dashboard/protocol-stats";
import { PortfolioSummary } from "@/components/dashboard/portfolio-summary";
import { StakesList } from "@/components/dashboard/stakes-list";
import { ErrorBoundary } from "@/components/error-boundary";
import { ProtocolPausedBanner } from "@/components/dashboard/protocol-paused-banner";
import { ReferralStatsPanel } from "@/components/dashboard/referral-stats-panel";
import { BadgeMiniStrip } from "@/components/badges/badge-mini-strip";
import { useGlobalState } from "@/lib/hooks/useGlobalState";
import { staggerContainer, staggerItem } from "@/lib/animation";

export default function DashboardPage() {
  const { data: globalState } = useGlobalState();
  const reserved = globalState?.reserved as BN[] | undefined;
  const isPaused = reserved && reserved.length > 1 && !reserved[1].isZero();

  return (
    <m.div
      className="space-y-8"
      variants={staggerContainer}
      initial="hidden"
      animate="show"
    >
      {/* Page Title */}
      <m.h1 variants={staggerItem} className="text-2xl font-bold text-zinc-100">
        Your Dashboard
      </m.h1>

      {/* Protocol Paused Banner */}
      <m.div variants={staggerItem}>
        <ProtocolPausedBanner isPaused={!!isPaused} />
      </m.div>

      {/* Protocol Stats - full width */}
      <m.div variants={staggerItem}>
        <ProtocolStats />
      </m.div>

      {/* Referral Program */}
      <m.div variants={staggerItem}>
        <ErrorBoundary>
          <ReferralStatsPanel />
        </ErrorBoundary>
      </m.div>

      {/* Badge Mini Strip */}
      <m.div variants={staggerItem}>
        <ErrorBoundary>
          <BadgeMiniStrip />
        </ErrorBoundary>
      </m.div>

      {/* Portfolio + Stakes - 2-column on desktop */}
      <m.div variants={staggerItem}>
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
      </m.div>
    </m.div>
  );
}
