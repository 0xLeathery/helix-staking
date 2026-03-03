"use client";

import BN from "bn.js";
import { m } from "framer-motion";
import { AlertCircle, TrendingUp } from "lucide-react";
import { useStakes } from "@/lib/hooks/useStakes";
import { StakeCard } from "@/components/stake/stake-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { SLOTS_PER_DAY } from "@/lib/solana/constants";
import { staggerContainer, staggerItem } from "@/lib/animation";

export function StakesList() {
  const { data: stakes, isLoading, error, refetch } = useStakes();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-zinc-100">Your Stakes</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-6 space-y-3">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-8 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-zinc-100">Your Stakes</h2>
        <Card className="border-penalty-800">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-penalty-400 mt-0.5 shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-penalty-300">Failed to load stakes</p>
                <p className="text-xs text-zinc-400 mt-0.5">Check your connection and try again.</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => refetch()}>
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const activeStakes = stakes?.filter((s) => s.account.isActive) ?? [];

  if (activeStakes.length === 0) {
    return (
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-zinc-100">Your Stakes</h2>
        <Card>
          <CardContent className="p-6">
            <EmptyState
              icon={TrendingUp}
              headline="No active stakes yet"
              description="Create a stake to start earning T-shares and daily rewards."
              action={{ label: "Create Stake", href: "/dashboard/stake" }}
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  // Sort: active first (with remaining days ascending = most urgent first)
  const sorted = [...activeStakes].sort((a, b) => {
    const aEnd = new BN(a.account.endSlot.toString());
    const bEnd = new BN(b.account.endSlot.toString());

    // Stakes closer to maturity (lower endSlot) come first
    if (aEnd.lt(bEnd)) return -1;
    if (aEnd.gt(bEnd)) return 1;
    return 0;
  });

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-zinc-100">
        Your Stakes ({activeStakes.length})
      </h2>
      <m.div
        className="grid gap-4 md:grid-cols-2"
        variants={staggerContainer}
        initial="hidden"
        animate="show"
      >
        {sorted.map((stake) => (
          <m.div key={stake.publicKey.toBase58()} variants={staggerItem}>
            <StakeCard
              stakePublicKey={stake.publicKey}
              account={stake.account}
            />
          </m.div>
        ))}
      </m.div>
    </div>
  );
}
