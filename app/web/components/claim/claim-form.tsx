"use client";

import { useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import BN from "bn.js";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useFreeClaim } from "@/lib/hooks/useFreeClaim";
import { useGlobalState } from "@/lib/hooks/useGlobalState";
import { useClaimConfig } from "@/lib/hooks/useClaimConfig";
import { formatHelix } from "@/lib/utils/format";

interface ClaimFormProps {
  merkleRoot: Buffer;
}

interface MerkleEntry {
  address: string;
  amount: string;
  proof: string[];
}

/**
 * Claim form component.
 *
 * Loads Merkle proof data from static JSON (env var NEXT_PUBLIC_MERKLE_DATA_URL).
 * Shows claimable amount with speed bonus tier.
 * Triggers free_claim transaction with Ed25519 signature.
 */
export function ClaimForm({ merkleRoot }: ClaimFormProps) {
  const wallet = useWallet();
  const { data: globalState } = useGlobalState();
  const { data: claimConfig } = useClaimConfig();
  const freeClaim = useFreeClaim();

  const [merkleData, setMerkleData] = useState<MerkleEntry[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load Merkle proof data from CDN
  useEffect(() => {
    const loadMerkleData = async () => {
      try {
        const url = process.env.NEXT_PUBLIC_MERKLE_DATA_URL;
        if (!url) {
          setError("Merkle data URL not configured. Please contact support.");
          setLoading(false);
          return;
        }

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Failed to fetch Merkle data: ${response.statusText}`);
        }

        const data = await response.json();
        setMerkleData(data);
        setLoading(false);
      } catch (err) {
        console.error("Error loading Merkle data:", err);
        setError("Failed to load claim data. Please try again later.");
        setLoading(false);
      }
    };

    loadMerkleData();
  }, []);

  if (!wallet.publicKey) {
    return null; // Parent component (EligibilityCheck) already handles this
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading Claim Data...</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  // Look up connected wallet in Merkle data
  const entry = merkleData?.find(
    (e) => e.address.toLowerCase() === wallet.publicKey!.toBase58().toLowerCase()
  );

  if (!entry) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Not Eligible</CardTitle>
          <CardDescription>
            Your wallet is not eligible for the free claim. Only SOL holders from the snapshot are eligible.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  // Parse amount and proof
  const amount = new BN(entry.amount);
  const proof = entry.proof.map((p) => Buffer.from(p, "hex"));

  // Calculate speed bonus tier
  const currentSlot = globalState
    ? globalState.initSlot.toNumber() + globalState.currentDay.toNumber() * globalState.slotsPerDay.toNumber()
    : 0;
  const startSlot = claimConfig?.startSlot.toNumber() || 0;
  const slotsPerDay = globalState?.slotsPerDay.toNumber() || 216000;
  const daysElapsed = Math.floor((currentSlot - startSlot) / slotsPerDay);

  let bonusTier = "No Speed Bonus";
  let bonusPercent = 0;

  if (daysElapsed <= 7) {
    bonusTier = "Week 1: +20% Speed Bonus";
    bonusPercent = 20;
  } else if (daysElapsed <= 28) {
    bonusTier = "Weeks 2-4: +10% Speed Bonus";
    bonusPercent = 10;
  }

  // Calculate display amounts
  // Base amount: snapshot_balance * 1000 (from on-chain formula)
  const baseAmount = amount.muln(1000);
  const bonusAmount = baseAmount.muln(bonusPercent).divn(100);
  const totalAmount = baseAmount.add(bonusAmount);
  const immediateAmount = totalAmount.muln(10).divn(100); // 10% immediate
  const vestingAmount = totalAmount.sub(immediateAmount); // 90% vesting

  const handleClaim = async () => {
    try {
      await freeClaim.mutateAsync({
        snapshotWallet: wallet.publicKey!,
        amount,
        proof,
        merkleRoot,
      });
    } catch (err) {
      console.error("Claim failed:", err);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Claim Your HELIX Tokens</CardTitle>
        <CardDescription>
          SOL holders from the snapshot can claim free HELIX tokens proportional to their balance
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Base Amount:</span>
            <span className="font-mono">{formatHelix(baseAmount)} HELIX</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Speed Bonus:</span>
            <span className="font-mono text-green-400">
              +{formatHelix(bonusAmount)} HELIX ({bonusPercent}%)
            </span>
          </div>
          <div className="flex justify-between border-t pt-2">
            <span className="font-semibold">Total Claimable:</span>
            <span className="font-mono font-bold">{formatHelix(totalAmount)} HELIX</span>
          </div>
        </div>

        <Alert>
          <AlertDescription className="text-sm">
            <div className="font-semibold text-yellow-400 mb-2">{bonusTier}</div>
            <div className="space-y-1 text-muted-foreground">
              <p>• 10% ({formatHelix(immediateAmount)} HELIX) available immediately</p>
              <p>• 90% ({formatHelix(vestingAmount)} HELIX) vests linearly over 30 days</p>
            </div>
          </AlertDescription>
        </Alert>

        <Button
          className="w-full"
          size="lg"
          onClick={handleClaim}
          disabled={freeClaim.isPending}
        >
          {freeClaim.isPending ? "Claiming..." : "Claim HELIX"}
        </Button>

        {freeClaim.isError && (
          <Alert variant="destructive">
            <AlertDescription>
              {freeClaim.error?.message || "Claim failed. Please try again."}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
