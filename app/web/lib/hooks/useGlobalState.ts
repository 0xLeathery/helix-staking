"use client";

import { useEffect } from "react";
import { useConnection } from "@solana/wallet-adapter-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { deriveGlobalState } from "@/lib/solana/pdas";
import { useProgram } from "./useProgram";

/**
 * React Query hook for fetching and subscribing to GlobalState on-chain account.
 *
 * Features:
 * - Fetches GlobalState PDA via Anchor program.account.globalState.fetch()
 * - WebSocket subscription via connection.onAccountChange for instant cache invalidation
 * - Polling fallback at 60s intervals
 * - staleTime: 30s per user decision
 */
export function useGlobalState() {
  const program = useProgram();
  const { connection } = useConnection();
  const queryClient = useQueryClient();

  const [globalStatePda] = deriveGlobalState();

  const query = useQuery({
    queryKey: ["globalState"],
    queryFn: async () => {
      const state = await program.account.globalState.fetch(globalStatePda);
      return state;
    },
    staleTime: 30_000,
    refetchInterval: 60_000,
    refetchOnWindowFocus: true,
  });

  // WebSocket subscription for instant cache invalidation
  useEffect(() => {
    const subscriptionId = connection.onAccountChange(
      globalStatePda,
      () => {
        queryClient.invalidateQueries({ queryKey: ["globalState"] });
      },
      "confirmed"
    );

    return () => {
      connection.removeAccountChangeListener(subscriptionId);
    };
  }, [connection, globalStatePda, queryClient]);

  return query;
}
