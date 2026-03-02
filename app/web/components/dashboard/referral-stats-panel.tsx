"use client";

import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useReferralStats } from "@/lib/hooks/useReferralStats";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatHelix } from "@/lib/utils/format";
import BN from "bn.js";

export function ReferralStatsPanel() {
  const { publicKey } = useWallet();
  const { data, isLoading } = useReferralStats();
  const [copied, setCopied] = useState(false);

  if (!publicKey) return null;

  const referralLink = `${typeof window !== "undefined" ? window.location.origin : ""}/dashboard/stake?ref=${publicKey.toBase58()}`;

  const copyLink = async () => {
    await navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="border-zinc-800 bg-zinc-900">
      <CardHeader>
        <CardTitle className="text-lg">Referral Program</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Referral Link */}
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Share your referral link. Referred stakers get +10% bonus T-Shares, and you
            earn +5% bonus tokens.
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              readOnly
              value={referralLink}
              className="flex-1 rounded-md bg-zinc-800 px-3 py-2 text-xs text-zinc-300 font-mono truncate border border-zinc-700"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={copyLink}
              className="shrink-0"
            >
              {copied ? "Copied!" : "Copy"}
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 pt-2 border-t border-zinc-800">
          <div>
            <p className="text-xs text-muted-foreground">Total Referrals</p>
            <p className="text-xl font-bold text-zinc-100">
              {isLoading ? "..." : (data?.totalReferrals ?? 0)}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Bonus Earned</p>
            <p className="text-xl font-bold text-zinc-100">
              {isLoading
                ? "..."
                : data?.totalReferrerBonusTokens
                  ? formatHelix(new BN(data.totalReferrerBonusTokens))
                  : "0"}{" "}
              HELIX
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
