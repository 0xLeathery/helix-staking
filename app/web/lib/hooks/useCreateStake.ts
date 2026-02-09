"use client";

import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PublicKey, Transaction } from "@solana/web3.js";
import { getAssociatedTokenAddressSync } from "@solana/spl-token";
import BN from "bn.js";
import { useProgram } from "./useProgram";
import { deriveGlobalState, deriveMint, deriveMintAuthority, deriveStakeAccount } from "@/lib/solana/pdas";

// Token-2022 program ID
const TOKEN_2022_PROGRAM_ID = new PublicKey(
  "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"
);

interface CreateStakeParams {
  amount: BN;
  days: number;
}

interface CreateStakeResult {
  signature: string;
  stakeId: BN;
}

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 500;

/**
 * React Query mutation hook for creating a new stake on-chain.
 *
 * Features:
 * - Simulates transaction before sending (security requirement)
 * - Handles stake ID race condition with retry logic
 * - Invalidates caches on success
 */
export function useCreateStake() {
  const program = useProgram();
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const queryClient = useQueryClient();

  return useMutation<CreateStakeResult, Error, CreateStakeParams>({
    mutationFn: async ({ amount, days }) => {
      if (!publicKey) {
        throw new Error("Wallet not connected");
      }

      if (!sendTransaction) {
        throw new Error("Wallet does not support sendTransaction");
      }

      // Retry loop to handle stake ID race condition
      let lastError: Error | null = null;
      for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
        try {
          // Fetch current globalState to get totalStakesCreated
          const [globalStatePda] = deriveGlobalState();
          const globalState = await program.account.globalState.fetch(globalStatePda);

          // Derive stake account PDA using current totalStakesCreated
          const stakeId = globalState.totalStakesCreated;
          const [stakeAccountPda] = deriveStakeAccount(publicKey, stakeId);

          // Derive other PDAs
          const [mintPda] = deriveMint();
          const [mintAuthorityPda] = deriveMintAuthority();

          // Get user's Token-2022 ATA
          const userTokenAccount = getAssociatedTokenAddressSync(
            mintPda,
            publicKey,
            false, // allowOwnerOffCurve
            TOKEN_2022_PROGRAM_ID
          );

          // Build transaction — pass all writable accounts explicitly so
          // Anchor marks them correctly (auto-resolution can drop writable flag)
          const tx = await program.methods
            .createStake(amount, days)
            .accountsPartial({
              user: publicKey,
              globalState: globalStatePda,
              stakeAccount: stakeAccountPda,
              userTokenAccount,
              mint: mintPda,
              tokenProgram: TOKEN_2022_PROGRAM_ID,
            })
            .transaction();

          // Set recent blockhash and fee payer
          const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash("confirmed");
          tx.recentBlockhash = blockhash;
          tx.feePayer = publicKey;

          // SIMULATE transaction before sending (security requirement)
          const simulation = await connection.simulateTransaction(tx);
          if (simulation.value.err) {
            throw new Error(
              `Transaction simulation failed: ${JSON.stringify(simulation.value.err)}`
            );
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

          return { signature, stakeId };
        } catch (error) {
          lastError = error as Error;

          // Check if error is "already in use" (stake ID race condition)
          const errorMessage = error instanceof Error ? error.message : String(error);
          const isRaceCondition =
            errorMessage.includes("already in use") ||
            errorMessage.includes("Account already exists");

          if (isRaceCondition && attempt < MAX_RETRIES - 1) {
            // Wait before retry
            await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
            continue; // Retry with fresh globalState
          }

          // Not a race condition or max retries exceeded
          throw error;
        }
      }

      // Should never reach here, but TypeScript needs it
      throw lastError || new Error("Failed to create stake after retries");
    },

    onSuccess: (data) => {
      // Invalidate caches to refetch updated data
      queryClient.invalidateQueries({ queryKey: ["stakes", publicKey?.toBase58()] });
      queryClient.invalidateQueries({ queryKey: ["globalState"] });
      queryClient.invalidateQueries({ queryKey: ["tokenBalance", publicKey?.toBase58()] });
    },

    onError: (error) => {
      console.error("Create stake error:", error);
    },
  });
}
