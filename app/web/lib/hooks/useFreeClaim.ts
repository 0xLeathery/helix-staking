"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey, Transaction, TransactionInstruction, SYSVAR_INSTRUCTIONS_PUBKEY, Ed25519Program } from "@solana/web3.js";
import { getComputeBudgetInstructions, CU_LIMITS } from "@/lib/solana/compute-budget";
import { getAssociatedTokenAddressSync, TOKEN_2022_PROGRAM_ID } from "@solana/spl-token";
import BN from "bn.js";
import { useProgram } from "./useProgram";
import { deriveClaimConfig, deriveClaimStatus, deriveMint, deriveMintAuthority, deriveGlobalState } from "@/lib/solana/pdas";
import { useToast } from "@/hooks/use-toast";
import { simulateTransactionOrThrow } from "./useTransactionSimulation";

interface FreeClaimParams {
  snapshotWallet: PublicKey;
  amount: BN;
  proof: Buffer[];
  merkleRoot: Buffer;
}

/**
 * Mutation hook for free_claim transaction.
 *
 * CRITICAL: Builds Ed25519 verify instruction that MUST immediately precede free_claim
 * instruction in the same transaction (per on-chain requirement).
 *
 * Flow:
 * 1. Connected wallet signs message "HELIX:claim:{pubkey}:{amount}"
 * 2. Ed25519 verify instruction created with signature
 * 3. free_claim instruction built
 * 4. Transaction submitted with [ed25519Ix, freeClaimIx]
 * 5. Simulated before sending
 */
export function useFreeClaim() {
  const program = useProgram();
  const { connection } = useConnection();
  const wallet = useWallet();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ snapshotWallet, amount, proof, merkleRoot }: FreeClaimParams) => {
      if (!wallet.publicKey || !wallet.signMessage) {
        throw new Error("Wallet not connected");
      }

      // Derive accounts
      const [globalStatePda] = deriveGlobalState();
      const [claimConfigPda] = deriveClaimConfig();
      const [claimStatusPda] = deriveClaimStatus(merkleRoot, snapshotWallet);
      const [mintPda] = deriveMint();
      const [mintAuthorityPda] = deriveMintAuthority();
      const claimerAta = getAssociatedTokenAddressSync(
        mintPda,
        wallet.publicKey,
        false,
        TOKEN_2022_PROGRAM_ID
      );

      // Build message for Ed25519 signature
      const message = `HELIX:claim:${snapshotWallet.toBase58()}:${amount.toString()}`;
      const messageBytes = new TextEncoder().encode(message);

      // Request wallet to sign the message
      const signature = await wallet.signMessage(messageBytes);

      // Build Ed25519 verify instruction
      const ed25519Ix = createEd25519VerifyInstruction(
        snapshotWallet.toBytes(),
        messageBytes,
        signature
      );

      // Build free_claim instruction
      const freeClaimIx = await program.methods
        .freeClaim(amount, proof.map(p => Array.from(p)))
        .accounts({
          claimer: wallet.publicKey,
          snapshotWallet,
          globalState: globalStatePda,
          claimConfig: claimConfigPda,
          claimStatus: claimStatusPda,
          claimerTokenAccount: claimerAta,
          mint: mintPda,
          mintAuthority: mintAuthorityPda,
          instructionsSysvar: SYSVAR_INSTRUCTIONS_PUBKEY,
          tokenProgram: TOKEN_2022_PROGRAM_ID,
        } as any)
        .instruction();

      // Build transaction with ComputeBudget FIRST, then Ed25519 verify, then free_claim
      // Note: Ed25519 instruction must immediately precede free_claim per on-chain requirement.
      // ComputeBudget is a sysvar instruction and does not affect that ordering constraint.
      const tx = new Transaction();
      tx.add(...getComputeBudgetInstructions(CU_LIMITS.freeClaim));
      tx.add(ed25519Ix);
      tx.add(freeClaimIx);

      // Get recent blockhash
      const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
      tx.recentBlockhash = blockhash;
      tx.feePayer = wallet.publicKey;

      // Simulate before sending
      await simulateTransactionOrThrow(connection, tx);

      // Sign and send transaction
      const signed = await wallet.signTransaction!(tx);
      const signature_tx = await connection.sendRawTransaction(signed.serialize());

      // Confirm transaction
      await connection.confirmTransaction({
        signature: signature_tx,
        blockhash,
        lastValidBlockHeight,
      });

      return signature_tx;
    },
    onSuccess: () => {
      // Invalidate relevant queries
      if (wallet.publicKey) {
        queryClient.invalidateQueries({ queryKey: ["tokenBalance", wallet.publicKey.toBase58()] });
      }
      queryClient.invalidateQueries({ queryKey: ["claimStatus"] });
      queryClient.invalidateQueries({ queryKey: ["claimConfig"] });

      toast({
        title: "Claim Successful",
        description: "Your HELIX tokens have been claimed successfully!",
      });
    },
    onError: (error: Error) => {
      // Parse common errors
      let message = error.message;

      if (message.includes("AlreadyClaimed")) {
        message = "You have already claimed your HELIX tokens";
      } else if (message.includes("InvalidMerkleProof")) {
        message = "Invalid claim proof. Please verify your eligibility.";
      } else if (message.includes("ClaimPeriodNotStarted")) {
        message = "The claim period has not started yet";
      } else if (message.includes("ClaimPeriodEnded")) {
        message = "The claim period has ended";
      }

      toast({
        title: "Claim Failed",
        description: message,
        variant: "destructive",
      });
    },
  });
}

/**
 * Create Ed25519 verify instruction manually.
 * Matches Solana's Ed25519Program instruction format.
 */
function createEd25519VerifyInstruction(
  publicKey: Uint8Array,
  message: Uint8Array,
  signature: Uint8Array
): TransactionInstruction {
  // Ed25519 instruction data format:
  // - 1 byte: number of signatures (always 1)
  // - 2 bytes: signature offset (u16 LE)
  // - 2 bytes: signature length (u16 LE) - always 64
  // - 2 bytes: public key offset (u16 LE)
  // - 2 bytes: public key length (u16 LE) - always 32
  // - 2 bytes: message offset (u16 LE)
  // - 2 bytes: message length (u16 LE)
  // Then: signature (64 bytes) + public key (32 bytes) + message (variable)

  const signatureOffset = 14; // After header
  const publicKeyOffset = signatureOffset + signature.length;
  const messageOffset = publicKeyOffset + publicKey.length;

  const data = Buffer.alloc(14 + signature.length + publicKey.length + message.length);
  let offset = 0;

  // Number of signatures
  data.writeUInt8(1, offset);
  offset += 1;

  // Signature offset and length
  data.writeUInt16LE(signatureOffset, offset);
  offset += 2;
  data.writeUInt16LE(signature.length, offset);
  offset += 2;

  // Public key offset and length
  data.writeUInt16LE(publicKeyOffset, offset);
  offset += 2;
  data.writeUInt16LE(publicKey.length, offset);
  offset += 2;

  // Message offset and length
  data.writeUInt16LE(messageOffset, offset);
  offset += 2;
  data.writeUInt16LE(message.length, offset);
  offset += 2;

  // Signature data
  data.set(signature, signatureOffset);
  // Public key data
  data.set(publicKey, publicKeyOffset);
  // Message data
  data.set(message, messageOffset);

  return new TransactionInstruction({
    keys: [],
    programId: Ed25519Program.programId,
    data,
  });
}
