"use client";

import { useState, useEffect } from "react";
import { useStakeWizard } from "@/lib/store/ui-store";
import { useTokenBalance } from "@/lib/hooks/useTokenBalance";
import { formatHelix, parseHelix } from "@/lib/utils/format";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import BN from "bn.js";

export function AmountStep() {
  const { amount, setAmount, setStep } = useStakeWizard();
  const { data: balance, isLoading } = useTokenBalance();
  const [error, setError] = useState<string>("");

  // Validate amount whenever it changes
  useEffect(() => {
    if (!amount) {
      setError("");
      return;
    }

    try {
      const parsedAmount = parseHelix(amount);
      if (parsedAmount.isZero()) {
        setError("Amount must be greater than 0");
        return;
      }

      if (balance && parsedAmount.gt(balance)) {
        setError("Insufficient balance");
        return;
      }

      setError("");
    } catch {
      setError("Invalid number format");
    }
  }, [amount, balance]);

  const handleMaxClick = () => {
    if (balance) {
      // Format balance without "HELIX" symbol for input
      setAmount(formatHelix(balance, false));
    }
  };

  const handleNext = () => {
    if (!error && amount) {
      setStep(2);
    }
  };

  const isNextDisabled = !amount || !!error || isLoading;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-zinc-100">Choose Amount</h2>
        <p className="mt-2 text-sm text-zinc-400">
          Enter the amount of HELIX tokens you want to stake.
        </p>
      </div>

      <div className="space-y-4">
        {/* Amount Input */}
        <div>
          <label htmlFor="amount" className="mb-2 block text-sm font-medium text-zinc-300">
            Amount
          </label>
          <div className="relative">
            <Input
              id="amount"
              type="text"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="pr-24 font-mono text-lg"
              autoComplete="off"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleMaxClick}
              disabled={isLoading || !balance || balance.isZero()}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-semibold text-blue-400 hover:text-blue-300"
            >
              MAX
            </Button>
          </div>
          {error && (
            <p className="mt-1 text-xs text-red-400">{error}</p>
          )}
        </div>

        {/* Wallet Balance */}
        <div className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
          <span className="text-sm text-zinc-400">Wallet Balance</span>
          <span className="font-mono text-sm text-zinc-100">
            {isLoading ? (
              <span className="animate-pulse">Loading...</span>
            ) : balance ? (
              formatHelix(balance)
            ) : (
              "0.00 HELIX"
            )}
          </span>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-end pt-4">
        <Button
          onClick={handleNext}
          disabled={isNextDisabled}
          size="lg"
          className="min-w-32"
        >
          Next
        </Button>
      </div>
    </div>
  );
}
