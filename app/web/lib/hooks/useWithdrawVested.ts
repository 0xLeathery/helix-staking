"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey, Transaction } from "@solana/web3.js";
import { getAssociatedTokenAddressSync, TOKEN_2022_PROGRAM_ID } from "@solana/spl-token";
import { useProgram } from "./useProgram";
import { deriveClaimConfig, deriveGlobalState, deriveMint, deriveMintAuthority } from "@/lib/solana/pdas";
import { useToast } from "@/hooks/use-toast";
import { simulateTransactionOrThrow } from "./useTransactionSimulation";

interface WithdrawVestedParams {
  claimStatusPublicKey: PublicKey;
}

/**
 * Mutation hook for withdraw_vested transaction.
 *
 * Allows user to withdraw tokens that have vested from their free claim.
 * Vesting schedule: 10% immediate + 90% linear over 30 days.
 */
export function useWithdrawVested() {
  const program = useProgram();
  const { connection } = useConnection();
  const wallet = useWallet();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ claimStatusPublicKey }: WithdrawVestedParams) => {
      if (!wallet.publicKey || !wallet.signTransaction) {
        throw new Error("Wallet not connected");
      }

      // Derive accounts
      const [globalStatePda] = deriveGlobalState();
      const [claimConfigPda] = deriveClaimConfig();
      const [mintPda] = deriveMint();
      const [mintAuthorityPda] = deriveMintAuthority();
      const claimerAta = getAssociatedTokenAddressSync(
        mintPda,
        wallet.publicKey,
        false,
        TOKEN_2022_PROGRAM_ID
      );

      // Build withdraw_vested instruction
      const withdrawIx = await program.methods
        .withdrawVested()
        .accounts({
          claimer: wallet.publicKey,
          globalState: globalStatePda,
          claimConfig: claimConfigPda,
          claimStatus: claimStatusPublicKey,
          claimerTokenAccount: claimerAta,
          mint: mintPda,
          mintAuthority: mintAuthorityPda,
          tokenProgram: TOKEN_2022_PROGRAM_ID,
        } as any)
        .instruction();

      // Build transaction
      const tx = new Transaction().add(withdrawIx);

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
      // Invalidate relevant queries
      if (wallet.publicKey) {
        queryClient.invalidateQueries({ queryKey: ["tokenBalance", wallet.publicKey.toBase58()] });
      }
      queryClient.invalidateQueries({ queryKey: ["claimStatus"] });

      toast({
        title: "Withdrawal Successful",
        description: "Your vested HELIX tokens have been withdrawn!",
      });
    },
    onError: (error: Error) => {
      // Parse common errors
      let message = error.message;

      if (message.includes("NoVestedTokens")) {
        message = "No vested tokens available to withdraw at this time";
      }

      toast({
        title: "Withdrawal Failed",
        description: message,
        variant: "destructive",
      });
    },
  });
}
