import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import { AnchorProvider, Program } from "@coral-xyz/anchor";
import type { HelixStaking } from "@/types/program";
import idl from "@/public/idl/helix_staking.json";
import { PROGRAM_ID } from "./constants";

// Dummy wallet for read-only operations (fetching global state without connected wallet)
const DUMMY_WALLET = {
  publicKey: Keypair.generate().publicKey,
  signTransaction: () => Promise.reject(new Error("Read-only mode")),
  signAllTransactions: () => Promise.reject(new Error("Read-only mode")),
};

/**
 * Get a typed Program instance for the HELIX staking program.
 *
 * @param connection - Solana connection
 * @param wallet - Optional wallet for signing. If omitted, returns read-only program.
 * @returns Typed Program<HelixStaking> instance
 */
export function getProgram(
  connection: Connection,
  wallet?: {
    publicKey: PublicKey;
    signTransaction: (...args: unknown[]) => Promise<unknown>;
    signAllTransactions: (...args: unknown[]) => Promise<unknown>;
  }
): Program<HelixStaking> {
  const provider = new AnchorProvider(
    connection,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (wallet ?? DUMMY_WALLET) as any,
    { commitment: "confirmed" }
  );

  return new Program(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    idl as any,
    provider
  ) as unknown as Program<HelixStaking>;
}

export { PROGRAM_ID };
