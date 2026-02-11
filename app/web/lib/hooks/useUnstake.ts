"use client";

import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PublicKey, Transaction } from "@solana/web3.js";
import { getAssociatedTokenAddressSync, TOKEN_2022_PROGRAM_ID } from "@solana/spl-token";
import { useProgram } from "./useProgram";
import { deriveGlobalState, deriveMint, deriveMintAuthority } from "@/lib/solana/pdas";
import { simulateTransactionOrThrow, SimulationError, getSimulationErrorMessage } from "./useTransactionSimulation";
import { toast } from "sonner";

interface UnstakeParams {
  stakePublicKey: PublicKey;
}

/**
 * React Query mutation hook for unstake transaction.
 *
 * Features:
 * - Simulates transaction before sending (security requirement)
 * - Handles "UnstakeBlockedDuringBpd" error with user-friendly message
 * - Automatically claims pending rewards in same transaction (on-chain behavior)
 * - Invalidates stakes, globalState, and tokenBalance caches on success
 */
export function useUnstake() {
  const program = useProgram();
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ stakePublicKey }: UnstakeParams) => {
      if (!publicKey || !sendTransaction) {
        throw new Error("Wallet not connected");
      }

      // Derive all required accounts
      const [globalStatePda] = deriveGlobalState();
      const [mintPda] = deriveMint();
      const [mintAuthorityPda] = deriveMintAuthority();

      // Get user's Token-2022 ATA
      const userTokenAccount = getAssociatedTokenAddressSync(
        mintPda,
        publicKey,
        false,
        TOKEN_2022_PROGRAM_ID
      );

      // Build transaction — pass all writable accounts explicitly so
      // Anchor marks them correctly (auto-resolution can drop writable flag)
      const tx = await program.methods
        .unstake()
        .accountsPartial({
          user: publicKey,
          globalState: globalStatePda,
          stakeAccount: stakePublicKey,
          userTokenAccount,
          mint: mintPda,
          mintAuthority: mintAuthorityPda,
          tokenProgram: TOKEN_2022_PROGRAM_ID,
        })
        .transaction();

      // Set recent blockhash and fee payer
      const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash("confirmed");
      tx.recentBlockhash = blockhash;
      tx.feePayer = publicKey;

      // Phase 8.1 (C5/FR-005): Properly check simulation.value.err
      // Old try/catch only caught RPC errors, not on-chain program failures
      try {
        await simulateTransactionOrThrow(connection, tx);
      } catch (error: any) {
        if (error instanceof SimulationError) {
          throw new Error(getSimulationErrorMessage(error));
        }
        throw new Error(`Transaction simulation failed: ${error?.message || "Unknown error"}`);
      }

      // Send transaction
      const signature = await sendTransaction(tx, connection);

      // Confirm transaction
      await connection.confirmTransaction(
        {
          signature,
          blockhash,
          lastValidBlockHeight,
        },
        "confirmed"
      );

      return signature;
    },
    onSuccess: (signature) => {
      // Invalidate relevant caches
      queryClient.invalidateQueries({ queryKey: ["stakes", publicKey?.toBase58()] });
      queryClient.invalidateQueries({ queryKey: ["globalState"] });
      queryClient.invalidateQueries({ queryKey: ["tokenBalance", publicKey?.toBase58()] });

      toast.success("Stake ended successfully", {
        description: `Tokens returned to your wallet. Transaction: ${signature.slice(0, 8)}...`,
      });
    },
    onError: (error: Error) => {
      toast.error("Unstake failed", {
        description: error.message,
      });
    },
  });
}
