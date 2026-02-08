"use client";

import { useMemo } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Program } from "@coral-xyz/anchor";
import type { HelixStaking } from "@/types/program";
import { getProgram } from "@/lib/solana/program";

/**
 * React hook that returns a typed Program<HelixStaking> instance.
 *
 * Uses the connected wallet for signing transactions.
 * Falls back to a read-only dummy wallet when no wallet is connected,
 * allowing data fetches (account reads) without a connected wallet.
 */
export function useProgram(): Program<HelixStaking> {
  const { connection } = useConnection();
  const wallet = useWallet();

  return useMemo(() => {
    if (wallet.publicKey && wallet.signTransaction && wallet.signAllTransactions) {
      return getProgram(connection, {
        publicKey: wallet.publicKey,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        signTransaction: wallet.signTransaction as any,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        signAllTransactions: wallet.signAllTransactions as any,
      });
    }
    // Read-only mode (no wallet connected)
    return getProgram(connection);
  }, [connection, wallet.publicKey, wallet.signTransaction, wallet.signAllTransactions]);
}
