"use client";
import { useQuery } from "@tanstack/react-query";
import { useWallet } from "@solana/wallet-adapter-react";
import { api, BadgeEligibility } from "@/lib/api";

export interface BadgeInfo {
  badgeType: string;
  name: string;
  description: string;
  requirement: string;
  eligible: boolean;
  earnedAt: string | null;
  stakeAmount: string | null;
  claimed: boolean;         // true if user already holds this badge cNFT
  claimSignature?: string;  // tx signature if claimed (from DAS or local state)
}

export function useBadges() {
  const { publicKey } = useWallet();

  return useQuery<BadgeInfo[]>({
    queryKey: ["badges", publicKey?.toBase58()],
    queryFn: async () => {
      // Fetch eligibility from indexer via api client
      const { badges } = await api.getBadges(publicKey!.toBase58());

      // Fetch claimed status from mint API
      // The mint API will check DAS for owned badges
      let claimedBadgeTypes: string[] = [];
      try {
        const claimedRes = await fetch(
          `/api/badges/claimed?wallet=${publicKey!.toBase58()}`
        );
        if (claimedRes.ok) {
          const data = await claimedRes.json();
          claimedBadgeTypes = data.claimedBadgeTypes || [];
        }
      } catch {
        // DAS check failed — treat all as unclaimed (safe fallback)
      }

      return badges.map((b: BadgeEligibility) => ({
        ...b,
        claimed: claimedBadgeTypes.includes(b.badgeType),
      }));
    },
    enabled: !!publicKey,
    staleTime: 30_000,
  });
}
