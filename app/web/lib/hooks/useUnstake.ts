"use client";

import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PublicKey, Transaction } from "@solana/web3.js";
import { getAssociatedTokenAddressSync, TOKEN_2022_PROGRAM_ID } from "@solana/spl-token";
import { useProgram } from "./useProgram";
import { deriveGlobalState, deriveMint, deriveMintAuthority } from "@/lib/solana/pdas";
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

      // Build transaction (Anchor auto-resolves PDA accounts)
      const tx = await program.methods
        .unstake()
        .accountsPartial({
          user: publicKey,
          stakeAccount: stakePublicKey,
          userTokenAccount,
        })
        .transaction();

      // Set recent blockhash and fee payer
      const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash("confirmed");
      tx.recentBlockhash = blockhash;
      tx.feePayer = publicKey;

      // SIMULATE transaction before sending (security requirement)
      try {
        await connection.simulateTransaction(tx);
      } catch (error: any) {
        // Parse error for user-friendly message
        const errorMessage = error?.message || error?.toString() || "Unknown error";

        if (errorMessage.includes("UnstakeBlockedDuringBpd")) {
          throw new Error(
            "Unstaking is temporarily unavailable during Big Pay Day calculation. This ensures accurate bonus distribution. Please try again in a few minutes."
          );
        }

        // Generic error
        throw new Error(`Transaction simulation failed: ${errorMessage}`);
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
