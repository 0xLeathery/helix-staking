import Link from "next/link";
import Image from "next/image";

export function SeedHero() {
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
        {/* Badge */}
        <div className="inline-flex items-center gap-2 border border-helix-600/40 bg-helix-600/10 text-helix-400 text-sm font-medium px-4 py-1.5 rounded-full mb-8">
          <span className="w-2 h-2 rounded-full bg-helix-400 inline-block" />
          Seed Launch
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-zinc-50 tracking-tight leading-tight">
          Every seed token funds the{" "}
          <span className="text-helix-400">HELIX liquidity pool</span>
        </h1>

        {/* Subheading */}
        <p className="text-xl text-zinc-400 max-w-2xl mx-auto mt-6 leading-relaxed">
          The seed token is how HELIX builds its HLX/SOL liquidity from day one.
          Participate early and earn a permanent 10% APY boost on your HELIX
          stakes.
        </p>

        {/* pump.fun notice */}
        <p className="text-sm text-zinc-500 mt-4">
          The seed token launches on{" "}
          <span className="text-zinc-300 font-medium">pump.fun</span>
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap gap-4 justify-center mt-10">
          <Link
            href="/dashboard"
            className="bg-helix-600 hover:bg-helix-500 text-white px-8 py-3 rounded-lg font-medium text-lg transition-colors"
          >
            Start Staking
          </Link>
          <a
            href="#how-boost-works"
            className="border border-zinc-700 hover:border-zinc-500 text-zinc-300 px-8 py-3 rounded-lg font-medium text-lg transition-colors"
          >
            How It Works
          </a>
        </div>
      </div>
    </section>
  );
}
