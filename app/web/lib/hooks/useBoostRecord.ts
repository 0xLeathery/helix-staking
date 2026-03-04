"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { useQuery } from "@tanstack/react-query";
import { deriveBoostRecord } from "@/lib/solana/pdas";
import { useProgram } from "./useProgram";

/**
 * React Query hook for fetching the BoostRecord PDA for the connected wallet.
 *
 * Features:
 * - Derives BoostRecord PDA from connected wallet pubkey
 * - Uses program.account.boostRecord.fetchNullable() — returns null if not registered
 * - Only fetches when wallet is connected
 * - staleTime: 30s
 */
export function useBoostRecord() {
  const program = useProgram();
  const { publicKey } = useWallet();

  const [boostRecordPda] = publicKey
    ? deriveBoostRecord(publicKey)
    : [null];

  return useQuery({
    queryKey: ["boostRecord", publicKey?.toBase58()],
    queryFn: async () => {
      if (!publicKey || !boostRecordPda) return null;
      try {
        return await (program.account as any).boostRecord.fetchNullable(
          boostRecordPda
        );
      } catch {
        return null;
      }
    },
    enabled: !!publicKey,
    staleTime: 30_000,
  });
}
