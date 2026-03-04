"use client";

import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useQuery } from "@tanstack/react-query";
import { PublicKey } from "@solana/web3.js";
import { getAssociatedTokenAddressSync } from "@solana/spl-token";
import BN from "bn.js";
import { useGlobalState } from "./useGlobalState";

// Standard SPL Token program (pump.fun tokens use this, NOT Token-2022)
const SPL_TOKEN_PROGRAM_ID = new PublicKey(
  "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
);
const ASSOCIATED_TOKEN_PROGRAM_ID = new PublicKey(
  "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
);

/**
 * Extract the seed mint PublicKey from GlobalState reserved slots.
 * The seed mint is stored as 4 LE u64s at reserved[2..5].
 * Mirrors the pattern from tests/litesvm/utils.ts getSeedMintFromGlobalState.
 */
export function getSeedMintFromGlobalState(globalState: {
  reserved: (BN | { toArrayLike(b: typeof Buffer, e: string, l: number): Buffer })[];
}): PublicKey {
  const reserved = globalState.reserved as BN[];
  const mintBytes = new Uint8Array(32);
  for (let i = 0; i < 4; i++) {
    const le = reserved[2 + i].toArrayLike(Buffer, "le", 8);
    mintBytes.set(le, i * 8);
  }
  return new PublicKey(mintBytes);
}

/**
 * React Query hook for fetching the connected wallet's seed token ATA balance.
 *
 * Features:
 * - Extracts seed mint from GlobalState reserved[2..5] (4 LE u64s = 32-byte pubkey)
 * - Derives ATA using standard SPL Token program (pump.fun tokens, not Token-2022)
 * - Returns BN(0) if ATA doesn't exist yet
 * - Only fetches when wallet connected and seed mint is configured
 * - staleTime: 15s, refetchOnWindowFocus: true
 */
export function useSeedBalance() {
  const { publicKey } = useWallet();
  const { connection } = useConnection();
  const { data: globalState } = useGlobalState();

  const seedMint = globalState ? getSeedMintFromGlobalState(globalState as Parameters<typeof getSeedMintFromGlobalState>[0]) : null;

  return useQuery({
    queryKey: ["seedBalance", publicKey?.toBase58(), seedMint?.toBase58()],
    queryFn: async (): Promise<BN> => {
      if (!publicKey || !seedMint) return new BN(0);

      try {
        const ata = getAssociatedTokenAddressSync(
          seedMint,
          publicKey,
          false, // allowOwnerOffCurve
          SPL_TOKEN_PROGRAM_ID,
          ASSOCIATED_TOKEN_PROGRAM_ID
        );

        const balance = await connection.getTokenAccountBalance(ata);
        return new BN(balance.value.amount);
      } catch {
        // ATA doesn't exist = zero seed balance
        return new BN(0);
      }
    },
    enabled:
      !!publicKey &&
      !!seedMint &&
      !seedMint.equals(PublicKey.default),
    staleTime: 15_000,
    refetchOnWindowFocus: true,
  });
}
