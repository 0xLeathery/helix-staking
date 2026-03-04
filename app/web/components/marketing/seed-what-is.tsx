import { ScrollReveal } from "./scroll-reveal";

const features = [
  {
    icon: (
      <svg
        className="w-5 h-5 text-helix-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    title: "A launch vehicle for liquidity",
    description:
      "The seed token exists for one purpose: to fund the HLX/SOL liquidity pool. Creator rewards earned from the seed token go directly toward building permanent on-chain liquidity for HELIX.",
  },
  {
    icon: (
      <svg
        className="w-5 h-5 text-helix-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
        />
      </svg>
    ),
    title: "Earn 10% extra APY",
    description:
      "Hold seed tokens when you stake HLX and earn a 10% boost on every reward claim. The boost is applied automatically — no separate action required.",
  },
  {
    icon: (
      <svg
        className="w-5 h-5 text-helix-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 10V3L4 14h7v7l9-11h-7z"
        />
      </svg>
    ),
    title: "Stays liquid — no locking",
    description:
      "The seed token is never locked or escrowed. You can buy and sell it freely. The 10% APY boost is the incentive to hold — that&apos;s the soft-lock.",
  },
  {
    icon: (
      <svg
        className="w-5 h-5 text-helix-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
        />
      </svg>
    ),
    title: "One boosted stake per wallet",
    description:
      "Each wallet can have one active boosted stake at a time. The boost is tied to the specific stake created while holding the seed snapshot balance.",
  },
];

export function SeedWhatIs() {
  return (
    <section className="py-24 px-4 border-t border-zinc-800/50">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-zinc-100 mb-4">
              What is the Seed Token?
            </h2>
            <p className="text-zinc-400 max-w-2xl mx-auto">
              The seed token is a Solana SPL token launched on pump.fun. Its
              purpose is straightforward: bootstrap the HLX/SOL liquidity pool
              and reward early participants with a permanent staking boost.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {features.map((feature, i) => (
              <div
                key={i}
                className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900 transition-colors"
              >
                <div className="w-10 h-10 bg-helix-600/10 rounded-lg flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-zinc-100 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <div className="mt-10 p-6 rounded-xl border border-zinc-800 bg-zinc-900/30">
            <p className="text-sm text-zinc-400 leading-relaxed">
              <span className="text-zinc-200 font-medium">
                How the seed token relates to HELIX staking:
              </span>{" "}
              When you create a HELIX stake, the protocol records your current
              seed token balance as a snapshot. If you still hold at least that
              amount when you claim rewards, you receive 10% extra on that
              claim. The relationship is simple — hold your seed tokens,
              keep your boost.
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
