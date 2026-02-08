"use client";

import { ProtocolStats } from "@/components/dashboard/protocol-stats";
import { PortfolioSummary } from "@/components/dashboard/portfolio-summary";
import { StakesList } from "@/components/dashboard/stakes-list";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Page Title */}
      <h1 className="text-2xl font-bold text-zinc-100">Your Dashboard</h1>

      {/* Protocol Stats - full width */}
      <ProtocolStats />

      {/* Portfolio + Stakes - 2-column on desktop */}
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <PortfolioSummary />
        </div>
        <div className="lg:col-span-2">
          <StakesList />
        </div>
      </div>
    </div>
  );
}
