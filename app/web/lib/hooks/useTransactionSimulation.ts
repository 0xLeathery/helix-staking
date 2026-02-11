"use client";

import { Connection, Transaction } from "@solana/web3.js";

/**
 * Phase 8.1 (C5/FR-005): Proper simulation guard that checks simulation.value.err
 *
 * connection.simulateTransaction() does NOT throw on program errors —
 * it returns them in `result.value.err`. The old try/catch pattern only
 * caught RPC communication failures, silently ignoring on-chain errors.
 *
 * This utility:
 * 1. Calls simulateTransaction
 * 2. Checks result.value.err (the actual simulation result)
 * 3. Parses Anchor error names from simulation logs for user-friendly messages
 * 4. Throws SimulationError with structured data
 */

/** Structured simulation error with parsed Anchor error name and logs */
export class SimulationError extends Error {
  public readonly errorName: string;
  public readonly logs: string[];

  constructor(errorName: string, logs: string[]) {
    super(`Transaction simulation failed: ${errorName}`);
    this.name = "SimulationError";
    this.errorName = errorName;
    this.logs = logs;
  }
}

/**
 * Simulate a transaction and throw if the simulation indicates failure.
 *
 * @throws {SimulationError} when simulation.value.err is non-null
 * @throws {Error} when the RPC call itself fails (network error)
 */
export async function simulateTransactionOrThrow(
  connection: Connection,
  tx: Transaction,
): Promise<void> {
  const simulation = await connection.simulateTransaction(tx);

  if (simulation.value.err) {
    const logs = simulation.value.logs || [];

    // Anchor errors appear as: "Program log: AnchorError ... Error Name: SomeVariant"
    const anchorLogLine = logs.find((l) => l.includes("AnchorError"));
    if (anchorLogLine) {
      const match = anchorLogLine.match(/Error Name:\s*(\w+)/);
      if (match) {
        throw new SimulationError(match[1], logs);
      }
    }

    // Fallback: stringify the error object
    throw new SimulationError(
      JSON.stringify(simulation.value.err),
      logs,
    );
  }
}

/** Map of known Anchor error names to user-friendly messages */
const KNOWN_ERRORS: Record<string, string> = {
  UnstakeBlockedDuringBpd:
    "Unstaking is temporarily unavailable during Big Pay Day calculation. This ensures accurate bonus distribution. Please try again in a few minutes.",
  NoRewardsToClaim: "No rewards available to claim yet.",
  ClaimAmountZero: "The claimable amount is zero.",
  StakeNotActive: "This stake is no longer active.",
  Unauthorized: "You are not authorized to perform this action.",
  ClaimPeriodEnded: "The claim period has ended.",
  ClaimPeriodNotStarted: "The claim period has not started yet.",
};

/**
 * Get a user-friendly error message from a SimulationError.
 * Falls back to the raw error name if no mapping exists.
 */
export function getSimulationErrorMessage(error: SimulationError): string {
  return KNOWN_ERRORS[error.errorName] ?? `Transaction would fail: ${error.errorName}`;
}
