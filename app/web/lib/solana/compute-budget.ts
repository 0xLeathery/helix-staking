import { ComputeBudgetProgram, TransactionInstruction } from "@solana/web3.js";

// CU limits per instruction type (measured from bankrun + safety margin)
export const CU_LIMITS = {
  createStake: 200_000,
  createStakeWithReferral: 300_000, // Extra PDA init + mint CPI
  unstake: 200_000,
  claimRewards: 200_000,
  freeClaim: 400_000, // Ed25519 verify + merkle proof
  crankDistribution: 100_000,
  triggerBigPayDay: 600_000, // 20 remaining_accounts
  finalizeBpd: 600_000, // 20 remaining_accounts
} as const;

// Default priority fee in micro-lamports per CU
const DEFAULT_PRIORITY_FEE = 50_000; // ~0.01 SOL for 200K CU

export function getComputeBudgetInstructions(
  cuLimit: number,
  priorityFee: number = DEFAULT_PRIORITY_FEE
): TransactionInstruction[] {
  return [
    ComputeBudgetProgram.setComputeUnitLimit({ units: cuLimit }),
    ComputeBudgetProgram.setComputeUnitPrice({ microLamports: priorityFee }),
  ];
}
