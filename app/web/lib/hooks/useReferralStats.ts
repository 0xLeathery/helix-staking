"use client";

import { useQuery } from "@tanstack/react-query";
import { useWallet } from "@solana/wallet-adapter-react";

interface ReferralStats {
  referrer: string;
  totalReferrals: number;
  totalReferrerBonusTokens: string;
}

export function useReferralStats() {
  const { publicKey } = useWallet();

  return useQuery<ReferralStats>({
    queryKey: ["referralStats", publicKey?.toBase58()],
    queryFn: async () => {
      const indexerUrl = process.env.NEXT_PUBLIC_INDEXER_URL || "http://localhost:3001";
      const res = await fetch(
        `${indexerUrl}/api/referrals?referrer=${publicKey!.toBase58()}`
      );
      if (!res.ok) throw new Error("Failed to fetch referral stats");
      return res.json();
    },
    enabled: !!publicKey,
    staleTime: 30_000, // 30 seconds
  });
}
