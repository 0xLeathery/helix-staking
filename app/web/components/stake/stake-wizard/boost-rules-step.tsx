"use client";

import { useState } from "react";
import { Camera, Shield, AlertTriangle, TrendingUp } from "lucide-react";
import { useStakeWizard } from "@/lib/store/ui-store";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

interface RuleItem {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const BOOST_RULES: RuleItem[] = [
  {
    icon: <Camera className="h-5 w-5" />,
    title: "Snapshot",
    description:
      "When you stake, your current seed token balance is recorded. This becomes your snapshot — the floor you must stay above to keep your boost.",
  },
  {
    icon: <Shield className="h-5 w-5" />,
    title: "Headroom",
    description:
      "Buy more seed tokens after staking to create a safety margin. You can sell up to your headroom without losing your boost.",
  },
  {
    icon: <AlertTriangle className="h-5 w-5" />,
    title: "Permanent Revocation",
    description:
      "If your seed balance drops below your snapshot, your boost is permanently revoked for this stake. Buying back does NOT restore it.",
  },
  {
    icon: <TrendingUp className="h-5 w-5" />,
    title: "10% Multiplier",
    description:
      "Every reward claim checks your seed balance. If you still hold >= your snapshot, you earn 10% extra on that claim.",
  },
];

export function BoostRulesStep() {
  const { setStep, setBoostRulesAcknowledged } = useStakeWizard();
  const [checked, setChecked] = useState(false);

  const handleContinue = () => {
    setBoostRulesAcknowledged(true);
    setStep(4);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-zinc-100">Seed Boost Rules</h2>
        <p className="mt-2 text-sm text-zinc-400">
          Hold seed tokens to earn 10% extra APY on your stake. Here&apos;s how the boost works:
        </p>
        <p className="mt-1 text-xs text-zinc-500">
          One boosted stake per wallet. Boost is applied per reward claim.
        </p>
      </div>

      {/* Rules List */}
      <div className="space-y-4">
        {BOOST_RULES.map((rule) => (
          <div
            key={rule.title}
            className="flex gap-4 rounded-lg border border-zinc-800 bg-zinc-900/50 p-4"
          >
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-zinc-800 text-zinc-300">
              {rule.icon}
            </div>
            <div>
              <p className="font-semibold text-zinc-100">{rule.title}</p>
              <p className="mt-1 text-sm text-zinc-400">{rule.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Amber Warning Callout */}
      <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-4">
        <div className="flex gap-3">
          <div className="flex-shrink-0 text-amber-500">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-amber-300">
              Trade-off: 10% Extra APY vs. Liquidity Risk
            </p>
            <p className="mt-1 text-xs text-amber-200/80">
              Your boost is protected by headroom. Sell within your headroom and keep your boost.
              Sell below your snapshot and it&apos;s gone — that&apos;s the trade-off for 10% extra APY.
            </p>
          </div>
        </div>
      </div>

      {/* Acknowledgment Checkbox */}
      <div className="flex items-start gap-3 rounded-lg border border-zinc-700 bg-zinc-900/30 p-4">
        <Checkbox
          id="boost-rules-ack"
          checked={checked}
          onCheckedChange={(v) => setChecked(v === true)}
          className="mt-0.5"
        />
        <label
          htmlFor="boost-rules-ack"
          className="cursor-pointer text-sm text-zinc-300 leading-relaxed"
        >
          I understand that selling seed tokens below my snapshot permanently revokes my boost
          for this stake
        </label>
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-4">
        <Button
          variant="outline"
          onClick={() => setStep(2)}
          size="lg"
        >
          Back
        </Button>
        <Button
          onClick={handleContinue}
          disabled={!checked}
          size="lg"
          className="min-w-32"
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
