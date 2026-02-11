import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "HELIX Tokenomics",
  description:
    "Understand HELIX token economics: supply mechanics, inflation, share rate, reward distribution, and penalty redistribution.",
};

export const revalidate = 86400; // Revalidate daily

async function getStats() {
  const indexerUrl = process.env.INDEXER_URL || "http://localhost:3001";

  try {
    const response = await fetch(`${indexerUrl}/api/stats`, {
      next: { revalidate: 86400 },
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

export default async function TokenomicsPage() {
  const stats = await getStats();

  // Format current share rate if available
  const currentShareRate = stats?.currentShareRate
    ? (parseFloat(stats.currentShareRate) / 1e9).toFixed(2)
    : null;

  return (
    <div className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Page Header */}
        <h1 className="text-4xl font-bold text-zinc-100 mb-4">
          HELIX Tokenomics
        </h1>
        <p className="text-lg text-zinc-400 mb-16">
          Understanding the HELIX token economy
        </p>

        {/* Section 1: Supply Mechanics */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold text-zinc-100 mb-4">
            Supply Mechanics
          </h2>
          <p className="text-zinc-400 leading-relaxed text-base">
            HELIX uses a burn-and-mint model. When you stake, tokens are burned.
            When you unstake or claim rewards, new tokens are minted. This means
            the circulating supply reflects real usage. Active stakes reduce
            circulating supply, while claims and unstakes increase it.
          </p>
        </section>

        <div className="border-b border-zinc-800/50 pb-16" />

        {/* Section 2: Inflation */}
        <section className="mb-16 mt-16">
          <h2 className="text-2xl font-semibold text-zinc-100 mb-4">
            Inflation
          </h2>
          <p className="text-zinc-400 leading-relaxed text-base mb-6">
            Annual inflation rate of 3.69%. Inflation is distributed daily to
            all active T-share holders proportionally. This incentivizes
            long-term staking and ensures the protocol rewards participants over
            time.
          </p>

          {/* Key Metric Callout */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 text-center">
            <div className="text-4xl font-bold text-helix-400">3.69%</div>
            <div className="text-sm text-zinc-500 mt-2">
              Annual Inflation Rate
            </div>
          </div>
        </section>

        <div className="border-b border-zinc-800/50 pb-16" />

        {/* Section 3: Share Rate */}
        <section className="mb-16 mt-16">
          <h2 className="text-2xl font-semibold text-zinc-100 mb-4">
            Share Rate
          </h2>
          <p className="text-zinc-400 leading-relaxed text-base mb-6">
            The share rate increases each day after inflation distribution. This
            means future stakers need more tokens per T-share. Early stakers
            benefit from lower share rates. The share rate represents how many
            tokens equal one T-share.
          </p>

          {/* Current Share Rate Callout (if available) */}
          {currentShareRate && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 text-center">
              <div className="text-4xl font-bold text-helix-400">
                {currentShareRate}
              </div>
              <div className="text-sm text-zinc-500 mt-2">
                Current Share Rate (tokens per T-share)
              </div>
            </div>
          )}
        </section>

        <div className="border-b border-zinc-800/50 pb-16" />

        {/* Section 4: Reward Distribution */}
        <section className="mb-16 mt-16">
          <h2 className="text-2xl font-semibold text-zinc-100 mb-4">
            Reward Distribution
          </h2>
          <p className="text-zinc-400 leading-relaxed text-base mb-4">
            Daily inflation is calculated as: dailyInflation = totalStaked ×
            annualRate / 10000 / 365. This amount is distributed proportionally
            to T-share holders via share rate increase.
          </p>
          <p className="text-zinc-400 leading-relaxed text-base">
            Rewards are &quot;lazy&quot; - they accumulate and are only minted when you
            claim or unstake. This reduces transaction overhead and allows
            compounding without active management.
          </p>
        </section>

        <div className="border-b border-zinc-800/50 pb-16" />

        {/* Section 5: Penalty Redistribution */}
        <section className="mb-16 mt-16">
          <h2 className="text-2xl font-semibold text-zinc-100 mb-4">
            Penalty Redistribution
          </h2>
          <p className="text-zinc-400 leading-relaxed text-base">
            When stakers unstake early and pay penalties, those penalty amounts
            are redistributed to remaining stakers via the share rate. This
            rewards those who honor their commitments and creates an incentive
            structure that benefits the most dedicated participants.
          </p>
        </section>

        <div className="border-b border-zinc-800/50 pb-16" />

        {/* Section 6: Free Claim & Big Pay Day */}
        <section className="mb-16 mt-16">
          <h2 className="text-2xl font-semibold text-zinc-100 mb-4">
            Free Claim & Big Pay Day
          </h2>
          <p className="text-zinc-400 leading-relaxed text-base">
            During the initial claim period, SOL holders from a snapshot can
            claim free HELIX tokens. Unclaimed tokens after the period ends are
            distributed to active stakers through Big Pay Day. This ensures all
            tokens enter circulation either through direct claims or as rewards
            to committed stakers.
          </p>
        </section>
      </div>
    </div>
  );
}
