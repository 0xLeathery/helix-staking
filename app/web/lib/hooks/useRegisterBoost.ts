"use client";

import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Connection, PublicKey } from "@solana/web3.js";
import { getAssociatedTokenAddressSync } from "@solana/spl-token";
import { useProgram } from "./useProgram";
import { deriveGlobalState, deriveBoostRecord } from "@/lib/solana/pdas";
import { getComputeBudgetInstructions, CU_LIMITS } from "@/lib/solana/compute-budget";
import { getSeedMintFromGlobalState } from "./useSeedBalance";

// Standard SPL Token program (pump.fun tokens use this, NOT Token-2022)
const SPL_TOKEN_PROGRAM_ID = new PublicKey(
  "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
);
const ASSOCIATED_TOKEN_PROGRAM_ID = new PublicKey(
  "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
);

// CU limit for register_seed_boost — PDA init requires ~150K CU
const REGISTER_BOOST_CU_LIMIT = 150_000;

interface RegisterBoostResult {
  signature: string;
}

interface BuildRegisterBoostTxParams {
  publicKey: PublicKey | null;
  program: {
    account: {
      globalState: {
        fetch(pda: PublicKey): Promise<any>;
      };
    };
    methods: {
      registerSeedBoost(): {
        accountsPartial(accounts: object): {
          transaction(): Promise<import("@solana/web3.js").Transaction>;
        };
      };
    };
  };
  connection: Connection;
  sendTransaction: (
    tx: import("@solana/web3.js").Transaction,
    connection: Connection
  ) => Promise<string>;
}

/**
 * Core transaction-building logic for register_seed_boost.
 *
 * Exported as a testable pure function so tests can verify accounts,
 * simulation order, and error cases without React hook machinery.
 *
 * Security requirement: simulates before sending.
 * Uses standard SPL Token for seed ATA (pump.fun tokens, NOT Token-2022).
 */
export async function buildRegisterBoostTx({
  publicKey,
  program,
  connection,
  sendTransaction,
}: BuildRegisterBoostTxParams): Promise<RegisterBoostResult> {
  if (!publicKey) {
    throw new Error("Wallet not connected");
  }

  // Fetch globalState to extract seed mint
  const [globalStatePda] = deriveGlobalState();
  const globalState = await program.account.globalState.fetch(globalStatePda);

  // Extract seed mint from reserved[2..5]
  const seedMint = getSeedMintFromGlobalState(globalState);
  if (seedMint.equals(PublicKey.default)) {
    throw new Error("Seed mint not configured");
  }

  // Derive accounts
  const [boostRecordPda] = deriveBoostRecord(publicKey);
  const seedTokenAccount = getAssociatedTokenAddressSync(
    seedMint,
    publicKey,
    false, // allowOwnerOffCurve
    SPL_TOKEN_PROGRAM_ID,
    ASSOCIATED_TOKEN_PROGRAM_ID
  );

  // Build transaction
  const tx = await program.methods
    .registerSeedBoost()
    .accountsPartial({
      user: publicKey,
      globalState: globalStatePda,
      boostRecord: boostRecordPda,
      seedTokenAccount,
      seedMint,
      seedTokenProgram: SPL_TOKEN_PROGRAM_ID,
      associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
    })
    .transaction();

  // Prepend compute budget instructions — PDA init requires ~150K CU
  tx.instructions.unshift(
    ...getComputeBudgetInstructions(REGISTER_BOOST_CU_LIMIT)
  );

  // Set recent blockhash and fee payer
  const { blockhash, lastValidBlockHeight } =
    await connection.getLatestBlockhash("confirmed");
  tx.recentBlockhash = blockhash;
  tx.feePayer = publicKey;

  // SIMULATE before sending (security requirement — all hooks simulate before send)
  const simulation = await connection.simulateTransaction(tx);
  if (simulation.value.err) {
    throw new Error(
      `Transaction simulation failed: ${JSON.stringify(simulation.value.err)}`
    );
  }

  // Send and confirm
  const signature = await sendTransaction(tx, connection);

  await connection.confirmTransaction(
    { signature, blockhash, lastValidBlockHeight },
    "confirmed"
  );

  return { signature };
}

/**
 * React Query mutation hook for registering the seed boost on-chain.
 *
 * Features:
 * - Calls register_seed_boost instruction via connected wallet
 * - Simulates transaction before sending (security requirement)
 * - Throws "Wallet not connected" when wallet is disconnected
 * - Throws "Seed mint not configured" when seed mint not yet set in GlobalState
 * - Invalidates boostRecord, stakes, and seedBalance caches on success
 * - Uses standard SPL Token for seed ATA (pump.fun tokens, NOT Token-2022)
 */
export function useRegisterBoost() {
  const program = useProgram();
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const queryClient = useQueryClient();

  return useMutation<RegisterBoostResult, Error, void>({
    mutationFn: async () => {
      return buildRegisterBoostTx({
        publicKey,
        program,
        connection,
        sendTransaction: sendTransaction as BuildRegisterBoostTxParams["sendTransaction"],
      });
    },

    onSuccess: () => {
      // Invalidate query caches to refetch updated on-chain state
      queryClient.invalidateQueries({
        queryKey: ["boostRecord", publicKey?.toBase58()],
      });
      queryClient.invalidateQueries({
        queryKey: ["stakes", publicKey?.toBase58()],
      });
      queryClient.invalidateQueries({
        queryKey: ["seedBalance", publicKey?.toBase58()],
      });
    },

    onError: (error) => {
      console.error("Register boost error:", error);
    },
  });
}
