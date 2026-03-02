"use client";

import { useEffect } from "react";
import { useStakeWizard } from "@/lib/store/ui-store";
import { AmountStep } from "@/components/stake/stake-wizard/amount-step";
import { DurationStep } from "@/components/stake/stake-wizard/duration-step";
import { ConfirmStep } from "@/components/stake/stake-wizard/confirm-step";
import { SuccessScreen } from "@/components/stake/stake-wizard/success-screen";
import { ErrorBoundary } from "@/components/error-boundary";

export default function StakePage() {
  const { step, reset } = useStakeWizard();

  // Reset wizard on unmount or navigate away
  useEffect(() => {
    return () => {
      reset();
    };
  }, [reset]);

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      {/* Step Indicator */}
      {step !== "success" && (
        <div className="flex items-center justify-center gap-2">
          {[1, 2, 3].map((stepNum) => (
            <div key={stepNum} className="flex items-center">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition-colors ${
                  step >= stepNum
                    ? "bg-blue-500 text-white"
                    : "bg-zinc-800 text-zinc-500"
                }`}
              >
                {stepNum}
              </div>
              {stepNum < 3 && (
                <div
                  className={`h-0.5 w-16 transition-colors ${
                    step > stepNum ? "bg-blue-500" : "bg-zinc-800"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      )}

      {/* Step Content */}
      <ErrorBoundary>
        <div className="rounded-lg border border-zinc-800 bg-zinc-900/30 p-8">
          {step === 1 && <AmountStep />}
          {step === 2 && <DurationStep />}
          {step === 3 && <ConfirmStep />}
          {step === "success" && <SuccessScreen />}
        </div>
      </ErrorBoundary>
    </div>
  );
}
