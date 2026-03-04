"use client";

import BN from "bn.js";
import { Zap, Loader2 } from "lucide-react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BoostBadge } from "@/components/stake/boost-badge";
import { useSeedBalance } from "@/lib/hooks/useSeedBalance";
import { useBoostRecord } from "@/lib/hooks/useBoostRecord";
import { useRegisterBoost } from "@/lib/hooks/useRegisterBoost";
import { useGlobalState } from "@/lib/hooks/useGlobalState";

// u64::MAX sentinel — BoostRecord exists but no stake linked yet
const U64_MAX = new BN("18446744073709551615");

/**
 * Dashboard card for boost status.
 *
 * Renders null (no card) when:
 * - Wallet is not connected
 * - No seed balance AND no BoostRecord
 *
 * Shows one of four states:
 * - Eligible: user has seed tokens, not yet registered — shows Register button
 * - Registered: BoostRecord exists with u64::MAX stakeId — waiting for a stake
 * - Active: BoostRecord linked to a real stake — boost is live
 * - Revoked: BoostRecord with boostRevoked === true
 */
export function BoostStatusCard() {
  const { publicKey } = useWallet();
  const { data: globalState } = useGlobalState();
  const { data: seedBalance } = useSeedBalance();
  const { data: boostRecord } = useBoostRecord();
  const { mutate: registerBoost, isPending, error } = useRegisterBoost();

  // Not connected — no card
  if (!publicKey) return null;

  // Determine if boost is enabled (reserved[7] !== 0)
  const reserved = globalState?.reserved as BN[] | undefined;
  const boostEnabled = reserved && reserved.length > 7 && !reserved[7].isZero();
  if (!boostEnabled) return null;

  const hasSeedBalance = seedBalance && seedBalance.gtn(0);
  const hasBoostRecord = boostRecord !== null && boostRecord !== undefined;

  // Nothing relevant to show — no seed tokens and no existing BoostRecord
  if (!hasSeedBalance && !hasBoostRecord) return null;

  // Derive card state
  let state: "eligible" | "registered" | "active" | "revoked";
  let statusText: string;
  let statusDescription: string;

  if (hasBoostRecord) {
    if (boostRecord.boostRevoked) {
      state = "revoked";
      statusText = "Boost Revoked";
      statusDescription =
        "Your boost was permanently revoked when your seed balance dropped below your snapshot. Future claims earn base APY only.";
    } else if (boostRecord.boostedStakeId.eq(U64_MAX)) {
      state = "registered";
      statusText = "Boost Registered";
      statusDescription =
        "Your boost is registered. Create a new stake to activate the 10% APY bonus.";
    } else {
      state = "active";
      statusText = "Boost Active";
      statusDescription =
        "Your 10% APY boost is live on your active stake. Keep your seed balance above your snapshot to retain it.";
    }
  } else {
    // Has seed balance but no BoostRecord
    state = "eligible";
    statusText = "Boost Eligible";
    statusDescription =
      "You hold seed tokens. Register to activate a 10% APY bonus on your next stake.";
  }

  return (
    <Card className="border-zinc-800 bg-zinc-900">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg text-zinc-100">
          <Zap className="h-5 w-5 text-amber-400" />
          APY Boost
          <BoostBadge state={state === "registered" || state === "eligible" ? "eligible" : state} />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <p className="text-sm font-medium text-zinc-200">{statusText}</p>
          <p className="mt-1 text-sm text-zinc-400">{statusDescription}</p>
        </div>

        {/* Register button — only shown in eligible state */}
        {state === "eligible" && (
          <Button
            onClick={() => registerBoost()}
            disabled={isPending}
            size="sm"
            className="gap-2"
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Registering...
              </>
            ) : (
              <>
                <Zap className="h-4 w-4" />
                Register Boost
              </>
            )}
          </Button>
        )}

        {/* Error state */}
        {error && (
          <p className="text-sm text-red-400">
            {error.message || "Failed to register boost. Please try again."}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
