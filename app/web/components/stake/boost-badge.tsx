"use client";

import BN from "bn.js";
import { Zap, ShieldCheck, ShieldX } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/cn";

export type BoostState = "none" | "eligible" | "active" | "revoked";

interface BoostConfig {
  label: string;
  className: string;
  description: string;
  Icon: React.ElementType;
}

const BOOST_CONFIG: Record<Exclude<BoostState, "none">, BoostConfig> = {
  eligible: {
    label: "Boost Eligible",
    className: "bg-amber-600/20 text-amber-400",
    description:
      "You hold seed tokens. Register to activate 10% bonus APY on your next stake.",
    Icon: Zap,
  },
  active: {
    label: "Boosted",
    className: "bg-green-600/20 text-green-400",
    description:
      "10% APY boost is active. Keep your seed balance above your snapshot to retain it.",
    Icon: ShieldCheck,
  },
  revoked: {
    label: "Boost Revoked",
    className: "bg-red-600/20 text-red-400",
    description:
      "Boost was permanently revoked when your seed balance dropped below your snapshot. Future claims earn base APY only.",
    Icon: ShieldX,
  },
};

interface BoostBadgeProps {
  state: BoostState;
}

export function BoostBadge({ state }: BoostBadgeProps) {
  if (state === "none") return null;

  const { label, className, description, Icon } = BOOST_CONFIG[state];

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span
          className={cn(
            "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium cursor-help",
            className
          )}
        >
          <Icon className="h-3 w-3" />
          {label}
        </span>
      </TooltipTrigger>
      <TooltipContent className="max-w-xs">
        <p>{description}</p>
      </TooltipContent>
    </Tooltip>
  );
}

/**
 * Derive the boost state for a single stake account.
 * Per-stake only has none/active/revoked states.
 * 'eligible' is a wallet-level state determined by useSeedBalance/useBoostRecord.
 */
export function getBoostState(
  account: {
    seedBalanceAtStake?: BN | { toString(): string };
    boostRevoked?: boolean;
  }
): BoostState {
  if (account.boostRevoked) return "revoked";
  const seedBal = new BN(account.seedBalanceAtStake?.toString() ?? "0");
  if (seedBal.gtn(0)) return "active";
  return "none";
}
