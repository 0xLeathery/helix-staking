"use client";

import { useEffect } from "react";
import { useConnection } from "@solana/wallet-adapter-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { deriveClaimConfig } from "@/lib/solana/pdas";
import { useProgram } from "./useProgram";

/**
 * React Query hook for fetching and subscribing to ClaimConfig on-chain account.
 *
 * Features:
 * - Fetches ClaimConfig PDA via Anchor program.account.claimConfig.fetch()
 * - WebSocket subscription via connection.onAccountChange for instant cache invalidation
 * - Polling fallback at 60s intervals
 * - staleTime: 60s (claim config changes rarely)
 * - Handles account-not-found gracefully (returns null)
 */
export function useClaimConfig() {
  const program = useProgram();
  const { connection } = useConnection();
  const queryClient = useQueryClient();

  const [claimConfigPda] = deriveClaimConfig();

  const query = useQuery({
    queryKey: ["claimConfig"],
    queryFn: async () => {
      try {
        const config = await program.account.claimConfig.fetch(claimConfigPda);
        return config;
      } catch (error) {
        // Account not found: claim period not initialized yet
        if (error instanceof Error && error.message.includes("Account does not exist")) {
          return null;
        }
        throw error;
      }
    },
    staleTime: 60_000,
    refetchInterval: 60_000,
    refetchOnWindowFocus: true,
  });

  // WebSocket subscription for instant cache invalidation
  useEffect(() => {
    const subscriptionId = connection.onAccountChange(
      claimConfigPda,
      () => {
        queryClient.invalidateQueries({ queryKey: ["claimConfig"] });
      },
      "confirmed"
    );

    return () => {
      connection.removeAccountChangeListener(subscriptionId);
    };
  }, [connection, claimConfigPda, queryClient]);

  return query;
}
