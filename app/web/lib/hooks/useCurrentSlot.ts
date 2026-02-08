"use client";

import { useConnection } from "@solana/wallet-adapter-react";
import { useQuery } from "@tanstack/react-query";

/**
 * React Query hook for fetching current blockchain slot.
 *
 * Features:
 * - Fetches current slot via connection.getSlot("confirmed")
 * - Polling at 10s intervals (slots change every ~400ms, but we don't need real-time)
 * - staleTime: 5s
 * - Returns current slot as number (convert to BN when needed for math)
 */
export function useCurrentSlot() {
  const { connection } = useConnection();

  return useQuery({
    queryKey: ["currentSlot"],
    queryFn: async () => {
      const slot = await connection.getSlot("confirmed");
      return slot;
    },
    staleTime: 5_000, // 5s
    refetchInterval: 10_000, // 10s polling
    refetchOnWindowFocus: true,
  });
}
