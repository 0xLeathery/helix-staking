import { EligibilityCheck } from "@/components/claim/eligibility-check";

/**
 * Free Claim page.
 *
 * Allows SOL holders from the snapshot to claim free HELIX tokens.
 * Shows eligibility check, claim form (if eligible), and vesting status (if claimed).
 */
export default function ClaimPage() {
  return (
    <div className="container max-w-4xl py-8 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Free Claim</h1>
        <p className="text-muted-foreground">
          SOL holders from the snapshot can claim free HELIX tokens proportional to their balance.
          Claim early for speed bonuses!
        </p>
      </div>

      <EligibilityCheck />
    </div>
  );
}
