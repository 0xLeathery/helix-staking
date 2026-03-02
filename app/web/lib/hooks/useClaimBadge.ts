"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useWallet } from "@solana/wallet-adapter-react";
import type { BadgeType } from "@/lib/badges/badge-types";

interface ClaimBadgeParams {
  badgeType: BadgeType;
}

interface ClaimBadgeResult {
  signature: string;
  assetId: string;
}

export function useClaimBadge() {
  const { publicKey } = useWallet();
  const queryClient = useQueryClient();

  return useMutation<ClaimBadgeResult, Error, ClaimBadgeParams>({
    mutationFn: async ({ badgeType }) => {
      if (!publicKey) {
        throw new Error("Wallet not connected");
      }

      const res = await fetch("/api/badges/mint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wallet: publicKey.toBase58(), badgeType }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: "Unknown error" }));
        if (res.status === 403) {
          throw new Error("Not eligible for this badge");
        }
        if (res.status === 409) {
          throw new Error("Badge already claimed");
        }
        throw new Error(data.error ?? `Mint failed with status ${res.status}`);
      }

      const data = await res.json() as ClaimBadgeResult;
      return data;
    },
    onSuccess: (_result, _variables) => {
      if (publicKey) {
        queryClient.invalidateQueries({ queryKey: ["badges", publicKey.toBase58()] });
      }
    },
    onError: (error) => {
      console.error("[useClaimBadge] Mint error:", error);
    },
  });
}
