"use client";

import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PublicKey, Transaction } from "@solana/web3.js";
import { getAssociatedTokenAddressSync } from "@solana/spl-token";
import BN from "bn.js";
import { useProgram } from "./useProgram";
import {
  deriveGlobalState,
  deriveMint,
  deriveMintAuthority,
  deriveStakeAccount,
  deriveReferralRecord,
} from "@/lib/solana/pdas";
import { getComputeBudgetInstructions, CU_LIMITS } from "@/lib/solana/compute-budget";

// Token-2022 program ID
const TOKEN_2022_PROGRAM_ID = new PublicKey(
  "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"
);

interface CreateStakeWithReferralParams {
  amount: BN;
  days: number;
  referrer: PublicKey;
}

interface CreateStakeWithReferralResult {
  signature: string;
  stakeId: BN;
}

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 500;

/**
 * React Query mutation hook for creating a new stake on-chain with a referral.
 *
 * Features:
 * - Pre-checks that the referrer's ATA exists before attempting transaction
 * - Derives the ReferralRecord PDA for the referrer-referee pair
 * - Calls createStakeWithReferral instruction (not createStake)
 * - Handles stake ID race condition with retry logic
 * - Invalidates caches on success including referral stats
 */
export function useCreateStakeWithReferral() {
  const program = useProgram();
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const queryClient = useQueryClient();

  return useMutation<CreateStakeWithReferralResult, Error, CreateStakeWithReferralParams>({
    mutationFn: async ({ amount, days, referrer }) => {
      if (!publicKey) {
        throw new Error("Wallet not connected");
      }

      if (!sendTransaction) {
        throw new Error("Wallet does not support sendTransaction");
      }

      // Derive PDAs upfront (don't change between retries)
      const [mintPda] = deriveMint();
      const [mintAuthorityPda] = deriveMintAuthority();

      // Get user's Token-2022 ATA
      const userTokenAccount = getAssociatedTokenAddressSync(
        mintPda,
        publicKey,
        false, // allowOwnerOffCurve
        TOKEN_2022_PROGRAM_ID
      );

      // Get referrer's Token-2022 ATA
      const referrerTokenAccount = getAssociatedTokenAddressSync(
        mintPda,
        referrer,
        false, // allowOwnerOffCurve
        TOKEN_2022_PROGRAM_ID
      );

      // Pre-check: verify referrer has a HELIX token account
      const referrerAtaInfo = await connection.getAccountInfo(referrerTokenAccount);
      if (!referrerAtaInfo) {
        throw new Error(
          "Referrer has no HELIX token account. This referral link may be invalid."
        );
      }

      // Derive ReferralRecord PDA for this referrer-referee pair
      const [referralRecordPda] = deriveReferralRecord(referrer, publicKey);

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

          // Build transaction
          const tx = await program.methods
            .createStakeWithReferral(amount, days, referrer)
            .accountsPartial({
              user: publicKey,
              globalState: globalStatePda,
              stakeAccount: stakeAccountPda,
              userTokenAccount,
              referrerTokenAccount,
              referralRecord: referralRecordPda,
              mint: mintPda,
              mintAuthority: mintAuthorityPda,
              tokenProgram: TOKEN_2022_PROGRAM_ID,
            })
            .transaction();

          // Prepend ComputeBudget instructions
          tx.instructions.unshift(
            ...getComputeBudgetInstructions(CU_LIMITS.createStakeWithReferral)
          );

          // Set recent blockhash and fee payer
          const { blockhash, lastValidBlockHeight } =
            await connection.getLatestBlockhash("confirmed");
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
            await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
            continue; // Retry with fresh globalState
          }

          // Not a race condition or max retries exceeded
          throw error;
        }
      }

      // Should never reach here, but TypeScript needs it
      throw lastError || new Error("Failed to create stake with referral after retries");
    },

    onSuccess: (data) => {
      // Invalidate caches to refetch updated data
      queryClient.invalidateQueries({ queryKey: ["stakes", publicKey?.toBase58()] });
      queryClient.invalidateQueries({ queryKey: ["globalState"] });
      queryClient.invalidateQueries({ queryKey: ["tokenBalance", publicKey?.toBase58()] });
      queryClient.invalidateQueries({ queryKey: ["referralStats", publicKey?.toBase58()] });
    },

    onError: (error) => {
      console.error("Create stake with referral error:", error);
    },
  });
}
