"use client";

import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PublicKey } from "@solana/web3.js";
import { getAssociatedTokenAddressSync, TOKEN_2022_PROGRAM_ID } from "@solana/spl-token";
import { useProgram } from "./useProgram";
import { deriveGlobalState, deriveMint, deriveMintAuthority } from "@/lib/solana/pdas";
import { simulateTransactionOrThrow, SimulationError, getSimulationErrorMessage } from "./useTransactionSimulation";
import { getComputeBudgetInstructions, CU_LIMITS } from "@/lib/solana/compute-budget";
import { toast } from "sonner";

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

      // Prepend ComputeBudget instructions (RT-03: CU limit + priority fee)
      tx.instructions.unshift(...getComputeBudgetInstructions(CU_LIMITS.claimRewards));

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
