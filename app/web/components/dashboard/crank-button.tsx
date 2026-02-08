"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useGlobalState } from "@/lib/hooks/useGlobalState";
import { useCrankDistribution } from "@/lib/hooks/useCrankDistribution";

/**
 * Permissionless crank button.
 *
 * Anyone can trigger the daily inflation distribution.
 * Shows last distribution day and disabled state when already cranked today.
 */
export function CrankButton() {
  const { data: globalState, isLoading } = useGlobalState();
  const crankDistribution = useCrankDistribution();

  if (isLoading || !globalState) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Daily Distribution</CardTitle>
          <CardDescription>Loading...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const currentDay = globalState.currentDay.toNumber();

  // Calculate current day from current slot
  const currentSlot = globalState.initSlot.toNumber() + currentDay * globalState.slotsPerDay.toNumber();
  const currentDayFromSlot = Math.floor((currentSlot - globalState.initSlot.toNumber()) / globalState.slotsPerDay.toNumber());

  // Check if already distributed today: current_day has been updated by crank
  // If globalState.currentDay == calculated current day, then it's already been cranked
  const alreadyDistributedToday = currentDay >= currentDayFromSlot;

  const handleCrank = async () => {
    try {
      await crankDistribution.mutateAsync();
    } catch (err) {
      console.error("Crank failed:", err);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily Distribution</CardTitle>
        <CardDescription>
          Anyone can trigger the daily inflation distribution. This distributes rewards to all active stakers.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Current Day:</span>
            <span className="font-mono">{currentDay.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Last Distribution:</span>
            <span className="font-mono">
              Day {currentDay.toLocaleString()}
            </span>
          </div>
        </div>

        <Button
          className="w-full"
          size="lg"
          onClick={handleCrank}
          disabled={alreadyDistributedToday || crankDistribution.isPending}
        >
          {crankDistribution.isPending ? (
            <span className="flex items-center gap-2">
              <span className="animate-spin">⚡</span>
              Triggering...
            </span>
          ) : alreadyDistributedToday ? (
            "Already Distributed Today"
          ) : (
            <span className="flex items-center gap-2">
              <span>⚡</span>
              Trigger Daily Distribution
            </span>
          )}
        </Button>

        {alreadyDistributedToday && (
          <p className="text-xs text-center text-muted-foreground">
            The distribution has already been triggered for today. Try again tomorrow!
          </p>
        )}
      </CardContent>
    </Card>
  );
}
