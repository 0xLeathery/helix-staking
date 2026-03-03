import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "How HELIX Staking Works",
  description:
    "Learn about HELIX time-locked staking, T-shares, bonuses, penalties, and Big Pay Day. Everything you need to know about the staking lifecycle.",
};

export const revalidate = 86400; // Revalidate daily

export default function HowItWorksPage() {
  return (
    <div className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Page Header */}
        <h1 className="text-4xl font-bold text-zinc-100 mb-4">
          How HELIX Staking Works
        </h1>
        <p className="text-lg text-zinc-400 mb-16">
          Everything you need to know about time-locked staking
        </p>

        {/* Section 1: What is HELIX Staking? */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold text-zinc-100 mb-4">
            What is HELIX Staking?
          </h2>
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <p className="text-zinc-400 leading-relaxed text-base flex-1">
              Lock HELIX tokens for a chosen duration (1-5,555 days). Receive
              T-shares representing your claim on daily rewards. The longer and
              larger your stake, the more T-shares you earn. Your tokens are
              burned when you stake and minted back when you unstake or claim
              rewards.
            </p>
            <div className="flex-shrink-0 mx-auto md:mx-0">
              <Image
                src="/brand/stake-card-preview.jpg"
                alt="Example: 5,555 Day Stake earning 1,234.56 T-Shares"
                width={320}
                height={200}
                className="rounded-xl border border-zinc-800"
              />
            </div>
          </div>
        </section>

        <div className="border-b border-zinc-800/50 pb-16" />

        {/* Section 2: T-Shares Explained */}
        <section className="mb-16 mt-16">
          <h2 className="text-2xl font-semibold text-zinc-100 mb-4">
            T-Shares Explained
          </h2>
          <p className="text-zinc-400 leading-relaxed text-base mb-6">
            T-shares (Time-shares) are the reward units. When you stake, you
            receive T-shares based on your stake amount, the current share rate,
            and bonus multipliers. More T-shares means a larger portion of daily
            inflation.
          </p>

          {/* Duration Bonus */}
          <h3 className="text-lg font-medium text-zinc-200 mb-2 mt-6">
            Duration Bonus (Longer Pays Better)
          </h3>
          <p className="text-zinc-400 leading-relaxed text-base">
            Stakes up to 5,555 days receive up to 2x bonus. The bonus scales
            linearly with duration. A 1-day stake receives minimal bonus, while
            a max-duration stake doubles your T-shares.
          </p>

          {/* Size Bonus */}
          <h3 className="text-lg font-medium text-zinc-200 mb-2 mt-6">
            Size Bonus (Bigger Pays Better)
          </h3>
          <p className="text-zinc-400 leading-relaxed text-base">
            Larger stakes receive up to 2x bonus. The bonus scales with stake
            size relative to a threshold. This rewards meaningful commitments to
            the protocol.
          </p>
        </section>

        <div className="border-b border-zinc-800/50 pb-16" />

        {/* Section 3: Daily Rewards */}
        <section className="mb-16 mt-16">
          <h2 className="text-2xl font-semibold text-zinc-100 mb-4">
            Daily Rewards
          </h2>
          <p className="text-zinc-400 leading-relaxed text-base">
            The protocol inflates supply at 3.69% annually. Daily inflation is
            distributed proportionally to T-share holders. A permissionless
            crank triggers distribution each day, increasing the share rate so
            your T-shares represent more tokens over time.
          </p>
        </section>

        <div className="border-b border-zinc-800/50 pb-16" />

        {/* Section 4: Penalties */}
        <section className="mb-16 mt-16">
          <h2 className="text-2xl font-semibold text-zinc-100 mb-4">
            Penalties
          </h2>

          {/* Early Unstake */}
          <h3 className="text-lg font-medium text-zinc-200 mb-2 mt-6">
            Early Unstake
          </h3>
          <p className="text-zinc-400 leading-relaxed text-base mb-4">
            If you unstake before your lock period ends, you lose a portion of
            your principal. Minimum penalty: 50%. Penalty decreases as you serve
            more time. For example, if you committed to 100 days but unstake at
            day 50, you have served 50% of your commitment and pay a reduced
            penalty.
          </p>

          {/* Late Unstake */}
          <h3 className="text-lg font-medium text-zinc-200 mb-2 mt-6">
            Late Unstake
          </h3>
          <p className="text-zinc-400 leading-relaxed text-base mb-6">
            After your stake matures, you have a 14-day grace period to unstake
            with no penalty. After that, penalties increase linearly until 100%
            loss at 365 days late. This ensures inactive stakes do not dilute
            active participants forever.
          </p>

          {/* Important Callout */}
          <div className="border-l-4 border-helix-600 bg-zinc-900/50 p-4 rounded-r-lg">
            <p className="text-zinc-300 text-sm font-medium">
              Penalties are redistributed to remaining stakers, rewarding
              commitment.
            </p>
          </div>
        </section>

        <div className="border-b border-zinc-800/50 pb-16" />

        {/* Section 5: Big Pay Day */}
        <section className="mb-16 mt-16">
          <h2 className="text-2xl font-semibold text-zinc-100 mb-4">
            Big Pay Day
          </h2>
          <p className="text-zinc-400 leading-relaxed text-base">
            After the free claim period ends, all unclaimed tokens are
            distributed proportionally to active stakers based on their
            T-share-days (T-shares multiplied by days staked). This is a
            one-time bonus event that rewards those who committed early and held
            through the claim period.
          </p>
        </section>
      </div>
    </div>
  );
}
