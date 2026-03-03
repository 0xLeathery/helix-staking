import Link from "next/link";
import Image from "next/image";

interface HeroProps {
  totalStakes: number;
  currentDay: number | null;
  totalShares: string | null;
}

export function Hero({ totalStakes, currentDay, totalShares }: HeroProps) {
  // Format total shares: parse from string, divide by 1e9, format with commas
  const formattedShares =
    totalShares !== null
      ? (parseFloat(totalShares) / 1e9)
          .toFixed(0)
          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      : "--";

  const formattedStakes = totalStakes.toLocaleString();

  return (
    <section className="relative overflow-hidden">
      {/* Background banner image */}
      <div className="absolute inset-0">
        <Image
          src="/brand/hero-banner.jpg"
          alt=""
          fill
          className="object-cover opacity-30"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/60 via-zinc-950/80 to-zinc-950" />
      </div>

      <div className="relative max-w-4xl mx-auto py-24 px-4 text-center">
        {/* Helix Icon */}
        <div className="flex justify-center mb-8">
          <Image
            src="/brand/helix-icon-glow.jpg"
            alt="HELIX"
            width={80}
            height={80}
            className="rounded-full"
            priority
          />
        </div>

        {/* Main Heading */}
        <h1 className="text-5xl sm:text-6xl font-bold text-zinc-50 tracking-tight">
          Stake HELIX. Earn Every Day.
        </h1>

        {/* Subheading */}
        <p className="text-xl text-zinc-400 max-w-2xl mx-auto mt-6">
          Time-locked staking with T-share bonuses. The longer you commit, the
          more you earn.
        </p>

        {/* CTA Buttons */}
        <div className="flex gap-4 justify-center mt-10">
          <Link
            href="/dashboard"
            className="bg-helix-600 hover:bg-helix-500 text-white px-8 py-3 rounded-lg font-medium text-lg transition-colors"
          >
            Start Staking
          </Link>
          <Link
            href="/how-it-works"
            className="border border-zinc-700 hover:border-zinc-500 text-zinc-300 px-8 py-3 rounded-lg font-medium text-lg transition-colors"
          >
            Learn How
          </Link>
        </div>

        {/* Live Stats */}
        <div className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto">
          <div className="text-center">
            <div className="text-2xl font-bold text-zinc-100">
              {formattedStakes}
            </div>
            <div className="text-xs text-zinc-400 uppercase tracking-wider mt-1">
              Total Stakes
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-zinc-100">
              {currentDay ?? "--"}
            </div>
            <div className="text-xs text-zinc-400 uppercase tracking-wider mt-1">
              Protocol Day
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-zinc-100">
              {formattedShares}
            </div>
            <div className="text-xs text-zinc-400 uppercase tracking-wider mt-1">
              Total T-Shares
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
