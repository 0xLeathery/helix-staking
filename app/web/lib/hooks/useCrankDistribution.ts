"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Transaction } from "@solana/web3.js";
import { getComputeBudgetInstructions, CU_LIMITS } from "@/lib/solana/compute-budget";
import { TOKEN_2022_PROGRAM_ID } from "@solana/spl-token";
import { useProgram } from "./useProgram";
import { deriveGlobalState, deriveMint, deriveMintAuthority } from "@/lib/solana/pdas";
import { useToast } from "@/hooks/use-toast";
import { simulateTransactionOrThrow } from "./useTransactionSimulation";

/**
 * Mutation hook for crank_distribution transaction.
 *
 * Permissionless: anyone can trigger the daily inflation distribution.
 * Updates share_rate based on daily inflation.
 */
export function useCrankDistribution() {
  const program = useProgram();
  const { connection } = useConnection();
  const wallet = useWallet();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async () => {
      if (!wallet.publicKey || !wallet.signTransaction) {
        throw new Error("Wallet not connected");
      }

      // Derive accounts
      const [globalStatePda] = deriveGlobalState();
      const [mintPda] = deriveMint();
      const [mintAuthorityPda] = deriveMintAuthority();

      // Build crank_distribution instruction
      const crankIx = await program.methods
        .crankDistribution()
        .accounts({
          cranker: wallet.publicKey,
        } as any)
        .instruction();

      // Build transaction with ComputeBudget instructions prepended (RT-03)
      const tx = new Transaction();
      tx.add(...getComputeBudgetInstructions(CU_LIMITS.crankDistribution));
      tx.add(crankIx);

      // Get recent blockhash
      const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
      tx.recentBlockhash = blockhash;
      tx.feePayer = wallet.publicKey;

      // Simulate before sending
      await simulateTransactionOrThrow(connection, tx);

      // Sign and send transaction
      const signed = await wallet.signTransaction(tx);
      const signature = await connection.sendRawTransaction(signed.serialize());

      // Confirm transaction
      await connection.confirmTransaction({
        signature,
        blockhash,
        lastValidBlockHeight,
      });

      return signature;
    },
    onSuccess: () => {
      // Invalidate global state
      queryClient.invalidateQueries({ queryKey: ["globalState"] });

      toast({
        title: "Distribution Triggered",
        description: "Daily inflation distribution completed successfully!",
      });
    },
    onError: (error: Error) => {
      // Parse common errors
      let message = error.message;

      if (message.includes("AlreadyDistributedToday")) {
        message = "Daily distribution has already been triggered for today";
      }

      toast({
        title: "Distribution Failed",
        description: message,
        variant: "destructive",
      });
    },
  });
}
