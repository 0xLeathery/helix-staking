"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useClaimConfig } from "@/lib/hooks/useClaimConfig";
import { useGlobalState } from "@/lib/hooks/useGlobalState";

/**
 * Big Pay Day status component.
 *
 * Shows BPD status across all phases:
 * - Not Started: claim period active
 * - Finalization In Progress: calculating distribution
 * - Sealed / Ready for Distribution: calculation complete
 * - Distribution In Progress: distributing to stakes
 * - Completed: all eligible stakers received bonus
 *
 * Also shows BPD window active banner (unstaking blocked).
 */
export function BpdStatus() {
  const { data: claimConfig, isLoading: isLoadingConfig } = useClaimConfig();
  const { data: globalState, isLoading: isLoadingGlobal } = useGlobalState();

  if (isLoadingConfig || isLoadingGlobal) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Big Pay Day</CardTitle>
          <CardDescription>Loading status...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!claimConfig || !globalState) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Big Pay Day</CardTitle>
          <CardDescription>
            Big Pay Day will distribute unclaimed tokens after the claim period ends.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  // Check BPD window status (reserved[0] !== 0)
  const isBpdWindowActive = globalState.reserved && globalState.reserved.length > 0 && !globalState.reserved[0].isZero();

  // Determine BPD phase
  const currentSlot = globalState.initSlot.toNumber() + globalState.currentDay.toNumber() * globalState.slotsPerDay.toNumber();
  const isClaimPeriodEnded = currentSlot > claimConfig.endSlot.toNumber();

  const bpdCalculationComplete = claimConfig.bpdCalculationComplete || false;
  const bpdStakesFinalized = claimConfig.bpdStakesFinalized || 0;
  const bpdStakesDistributed = claimConfig.bpdStakesDistributed || 0;

  let phase: "not_started" | "finalization" | "sealed" | "distributing" | "completed" = "not_started";
  let statusColor = "text-muted-foreground";
  let statusBadge = "Not Started";

  if (!isClaimPeriodEnded) {
    phase = "not_started";
    statusColor = "text-muted-foreground";
    statusBadge = "Not Started";
  } else if (!bpdCalculationComplete && bpdStakesFinalized > 0) {
    phase = "finalization";
    statusColor = "text-blue-400";
    statusBadge = "Finalization In Progress";
  } else if (bpdCalculationComplete && bpdStakesDistributed === 0) {
    phase = "sealed";
    statusColor = "text-yellow-400";
    statusBadge = "Ready for Distribution";
  } else if (bpdStakesDistributed > 0 && bpdStakesDistributed < bpdStakesFinalized) {
    phase = "distributing";
    statusColor = "text-blue-400";
    statusBadge = "Distribution In Progress";
  } else if (bpdStakesDistributed > 0 && bpdStakesDistributed >= bpdStakesFinalized) {
    phase = "completed";
    statusColor = "text-green-400";
    statusBadge = "Completed";
  }

  return (
    <div className="space-y-4">
      {isBpdWindowActive && (
        <Alert className="border-yellow-500/50 bg-yellow-500/10">
          <AlertDescription className="text-yellow-400">
            <strong>BPD Window Active</strong> - Unstaking is temporarily blocked during Big Pay Day distribution
          </AlertDescription>
        </Alert>
      )}

      <Card className={`border-${statusColor.split("-")[1]}-500/50`}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Big Pay Day</CardTitle>
            <span className={`text-sm font-semibold ${statusColor}`}>{statusBadge}</span>
          </div>
          <CardDescription>
            Unclaimed tokens from the free claim period are distributed to active stakers proportional to their T-share-days
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {phase === "not_started" && (
            <p className="text-sm text-muted-foreground">
              Big Pay Day will begin after the claim period ends. Stay tuned!
            </p>
          )}

          {phase === "finalization" && (
            <div className="space-y-2">
              <p className="text-sm">
                Calculating Big Pay Day distribution for all eligible stakes...
              </p>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Stakes Processed:</span>
                <span className="font-mono">{bpdStakesFinalized.toLocaleString()}</span>
              </div>
            </div>
          )}

          {phase === "sealed" && (
            <div className="space-y-2">
              <p className="text-sm text-green-400">
                Big Pay Day calculation complete! Ready for distribution.
              </p>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Eligible Stakes:</span>
                <span className="font-mono">{bpdStakesFinalized.toLocaleString()}</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Distribution will begin shortly. Your BPD bonus will be added to your pending rewards.
              </p>
            </div>
          )}

          {phase === "distributing" && (
            <div className="space-y-2">
              <p className="text-sm">
                Distributing Big Pay Day bonuses to eligible stakers...
              </p>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Progress:</span>
                <span className="font-mono">
                  {bpdStakesDistributed.toLocaleString()} / {bpdStakesFinalized.toLocaleString()} stakes
                </span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-400 transition-all"
                  style={{
                    width: `${Math.floor((bpdStakesDistributed / bpdStakesFinalized) * 100)}%`,
                  }}
                />
              </div>
            </div>
          )}

          {phase === "completed" && (
            <div className="space-y-2">
              <p className="text-sm text-green-400">
                Big Pay Day complete! All eligible stakers have received their bonus.
              </p>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Stakes:</span>
                <span className="font-mono">{bpdStakesFinalized.toLocaleString()}</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Check your stakes to see your BPD bonus in pending rewards.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
