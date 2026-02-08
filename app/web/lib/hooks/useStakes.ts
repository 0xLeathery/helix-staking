"use client";

import { useEffect, useRef } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useProgram } from "./useProgram";

/**
 * React Query hook for fetching user's stake accounts using memcmp filter.
 *
 * Features:
 * - Uses program.account.stakeAccount.all() with memcmp filter on user pubkey at offset 8
 *   (offset 8 = after the 8-byte Anchor discriminator)
 * - Only fetches when wallet is connected (enabled: !!publicKey)
 * - WebSocket subscriptions on each stake account for instant cache invalidation
 * - Polling fallback at 30s intervals
 * - staleTime: 15s per user decision
 */
export function useStakes() {
  const program = useProgram();
  const { publicKey } = useWallet();
  const { connection } = useConnection();
  const queryClient = useQueryClient();
  const subscriptionIds = useRef<number[]>([]);

  const query = useQuery({
    queryKey: ["stakes", publicKey?.toBase58()],
    queryFn: async () => {
      if (!publicKey) return [];

      const accounts = await program.account.stakeAccount.all([
        {
          memcmp: {
            offset: 8, // After Anchor discriminator
            bytes: publicKey.toBase58(),
          },
        },
      ]);

      return accounts;
    },
    enabled: !!publicKey,
    staleTime: 15_000,
    refetchInterval: 30_000,
    refetchOnWindowFocus: true,
  });

  // Subscribe to each stake account PDA for instant cache invalidation
  useEffect(() => {
    // Clean up previous subscriptions
    for (const id of subscriptionIds.current) {
      connection.removeAccountChangeListener(id);
    }
    subscriptionIds.current = [];

    if (!query.data || query.data.length === 0) return;

    const ids: number[] = [];
    for (const stake of query.data) {
      const id = connection.onAccountChange(
        stake.publicKey,
        () => {
          queryClient.invalidateQueries({
            queryKey: ["stakes", publicKey?.toBase58()],
          });
        },
        "confirmed"
      );
      ids.push(id);
    }
    subscriptionIds.current = ids;

    return () => {
      for (const id of ids) {
        connection.removeAccountChangeListener(id);
      }
      subscriptionIds.current = [];
    };
  }, [connection, query.data, queryClient, publicKey]);

  return query;
}
