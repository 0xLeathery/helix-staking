"use client";

import { useRouter } from "next/navigation";
import { useStakeWizard } from "@/lib/store/ui-store";
import { parseHelix, formatHelix, formatDays } from "@/lib/utils/format";
import { truncateAddress } from "@/lib/utils/format";
import { Button } from "@/components/ui/button";
import { useCreateStake } from "@/lib/hooks/useCreateStake";

export function SuccessScreen() {
  const router = useRouter();
  const { amount, days, reset } = useStakeWizard();
  const { data: result } = useCreateStake();

  const handleViewStakes = () => {
    reset();
    router.push("/dashboard");
  };

  const handleCreateAnother = () => {
    reset();
  };

  const amountBn = parseHelix(amount);
  const signature = result?.signature;

  return (
    <div className="flex flex-col items-center space-y-6 py-8">
      {/* Success Icon */}
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-500/10">
        <svg
          className="h-10 w-10 text-green-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>

      {/* Title */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-zinc-100">Stake Created Successfully!</h2>
        <p className="mt-2 text-sm text-zinc-400">
          Your HELIX tokens are now staked and earning rewards.
        </p>
      </div>

      {/* Summary */}
      <div className="w-full space-y-3 rounded-lg border border-zinc-800 bg-zinc-900/50 p-6">
        <div className="flex items-center justify-between">
          <span className="text-sm text-zinc-400">Amount Staked</span>
          <span className="font-mono text-lg font-semibold text-zinc-100">
            {formatHelix(amountBn)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-zinc-400">Duration</span>
          <span className="font-mono text-lg font-semibold text-zinc-100">
            {formatDays(days)}
          </span>
        </div>

        {result?.stakeId && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-zinc-400">Stake ID</span>
            <span className="font-mono text-sm text-zinc-300">
              {result.stakeId.toString(10)}
            </span>
          </div>
        )}
      </div>

      {/* Transaction Link */}
      {signature && (
        <div className="w-full rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-zinc-400">Transaction</span>
            <a
              href={`https://explorer.solana.com/tx/${signature}?cluster=devnet`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 font-mono text-sm text-blue-400 hover:text-blue-300"
            >
              {truncateAddress(signature)}
              <svg
                className="h-3 w-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex w-full flex-col gap-3 pt-4">
        <Button
          onClick={handleViewStakes}
          size="lg"
          className="w-full"
        >
          View My Stakes
        </Button>
        <Button
          onClick={handleCreateAnother}
          variant="outline"
          size="lg"
          className="w-full"
        >
          Create Another Stake
        </Button>
      </div>
    </div>
  );
}
