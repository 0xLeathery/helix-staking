"use client";

import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useQuery } from "@tanstack/react-query";
import { PublicKey } from "@solana/web3.js";
import { getAssociatedTokenAddressSync } from "@solana/spl-token";
import BN from "bn.js";
import { deriveMint } from "@/lib/solana/pdas";

// Token-2022 program ID (NOT legacy SPL Token)
const TOKEN_2022_PROGRAM_ID = new PublicKey(
  "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"
);

// Associated Token Program ID
const ASSOCIATED_TOKEN_PROGRAM_ID = new PublicKey(
  "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
);

/**
 * React Query hook for fetching user's HELIX token balance (Token-2022).
 *
 * Features:
 * - Derives Token-2022 ATA using TOKEN_2022_PROGRAM_ID (Pitfall 4)
 * - Returns balance as BN (base units, 8 decimals)
 * - Only fetches when wallet is connected
 * - staleTime: 10s
 */
export function useTokenBalance() {
  const { publicKey } = useWallet();
  const { connection } = useConnection();

  const [mintPda] = deriveMint();

  return useQuery({
    queryKey: ["tokenBalance", publicKey?.toBase58()],
    queryFn: async (): Promise<BN> => {
      if (!publicKey) return new BN(0);

      try {
        // Derive Token-2022 ATA
        const ata = getAssociatedTokenAddressSync(
          mintPda,
          publicKey,
          false, // allowOwnerOffCurve
          TOKEN_2022_PROGRAM_ID,
          ASSOCIATED_TOKEN_PROGRAM_ID
        );

        const balance = await connection.getTokenAccountBalance(ata);
        return new BN(balance.value.amount);
      } catch {
        // Account doesn't exist yet (no tokens) - return 0
        return new BN(0);
      }
    },
    enabled: !!publicKey,
    staleTime: 10_000,
    refetchOnWindowFocus: true,
  });
}
