import Link from "next/link";
import Image from "next/image";
import { ScrollReveal } from "./scroll-reveal";

export function SeedCta() {
  return (
    <section className="relative py-24 px-4 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <Image
          src="/brand/helix-strands.jpg"
          alt=""
          fill
          className="object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 via-transparent to-zinc-950" />
      </div>

      <ScrollReveal>
        <div className="relative max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-zinc-100 mb-4">
            Ready to Participate?
          </h2>
          <p className="text-zinc-400 mb-8 leading-relaxed">
            Hold seed tokens, create a HELIX stake, and earn 10% extra APY on
            every reward claim. The seed token is live on pump.fun — your staking
            journey starts in the dashboard.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/dashboard"
              className="bg-helix-600 hover:bg-helix-500 text-white px-10 py-4 rounded-lg font-medium text-lg inline-block transition-colors"
            >
              Start Staking
            </Link>
            <Link
              href="/how-it-works"
              className="border border-zinc-700 hover:border-zinc-500 text-zinc-300 px-10 py-4 rounded-lg font-medium text-lg inline-block transition-colors"
            >
              Learn How HELIX Works
            </Link>
          </div>
          <p className="text-xs text-zinc-600 mt-6">
            No sign-up required. Just a Solana wallet and seed tokens.
          </p>
        </div>
      </ScrollReveal>
    </section>
  );
}
