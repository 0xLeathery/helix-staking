import type { Metadata } from "next";
import { Hero } from "@/components/marketing/hero";
import { Features } from "@/components/marketing/features";
import { Mechanics } from "@/components/marketing/mechanics";
import { CallToAction } from "@/components/marketing/cta";

export const metadata: Metadata = {
  title: "HELIX Protocol - Time-Locked Staking on Solana",
  description:
    "Stake HELIX tokens with time-locked commitments. Earn T-shares and claim daily inflation rewards. The longer you stake, the more you earn.",
};

export const revalidate = 3600; // Revalidate every hour

async function getStats() {
  const indexerUrl = process.env.INDEXER_URL || "http://localhost:3001";

  try {
    const response = await fetch(`${indexerUrl}/api/stats`, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch stats");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching stats:", error);
    return null;
  }
}

export default async function LandingPage() {
  const stats = await getStats();

  // Extract stats with fallbacks
  const totalStakes = stats?.totalStakes ?? 0;
  const currentDay = stats?.currentDay ?? null;
  const totalShares = stats?.totalShares ?? null;

  return (
    <>
      <Hero
        totalStakes={totalStakes}
        currentDay={currentDay}
        totalShares={totalShares}
      />
      <Features />
      <Mechanics />
      <CallToAction />
    </>
  );
}
