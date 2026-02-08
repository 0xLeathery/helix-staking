"use client";

import Link from "next/link";
import BN from "bn.js";
import { useStakes } from "@/lib/hooks/useStakes";
import { StakeCard } from "@/components/stake/stake-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SLOTS_PER_DAY } from "@/lib/solana/constants";

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
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm text-penalty-400">
                Failed to load stakes
              </p>
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
            <div className="text-center space-y-4 py-4">
              <p className="text-zinc-400">No active stakes yet</p>
              <Button asChild>
                <Link href="/dashboard/stake">Create Stake</Link>
              </Button>
            </div>
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
      <div className="grid gap-4 md:grid-cols-2">
        {sorted.map((stake) => (
          <StakeCard
            key={stake.publicKey.toBase58()}
            stakePublicKey={stake.publicKey}
            account={stake.account}
          />
        ))}
      </div>
    </div>
  );
}
