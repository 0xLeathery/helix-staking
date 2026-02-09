"use client";

import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PublicKey } from "@solana/web3.js";
import { getAssociatedTokenAddressSync, TOKEN_2022_PROGRAM_ID } from "@solana/spl-token";
import { useProgram } from "./useProgram";
import { deriveGlobalState, deriveMint, deriveMintAuthority } from "@/lib/solana/pdas";
import { toast } from "sonner";
import { SystemProgram } from "@solana/web3.js";

interface ClaimRewardsParams {
  stakePublicKey: PublicKey;
}

/**
 * React Query mutation hook for claim_rewards transaction.
 *
 * Features:
 * - Simulates transaction before sending (security requirement)
 * - Handles "NoRewardsToClaim" error gracefully
 * - Invalidates stakes and tokenBalance caches on success
 */
export function useClaimRewards() {
  const program = useProgram();
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ stakePublicKey }: ClaimRewardsParams) => {
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
        .claimRewards()
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

      // SIMULATE transaction before sending (security requirement)
      try {
        await connection.simulateTransaction(tx);
      } catch (error: any) {
        // Parse error for user-friendly message
        const errorMessage = error?.message || error?.toString() || "Unknown error";

        if (errorMessage.includes("NoRewardsToClaim")) {
          throw new Error("No rewards available to claim yet");
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
      queryClient.invalidateQueries({ queryKey: ["tokenBalance", publicKey?.toBase58()] });

      toast.success("Rewards claimed successfully", {
        description: `Tokens minted to your wallet. Transaction: ${signature.slice(0, 8)}...`,
      });
    },
    onError: (error: Error) => {
      toast.error("Claim failed", {
        description: error.message,
      });
    },
  });
}
