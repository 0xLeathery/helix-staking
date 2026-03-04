import { ScrollReveal } from "./scroll-reveal";

const flowNodes = [
  {
    icon: (
      <svg
        className="w-6 h-6 text-helix-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
    ),
    title: "Buy Seed Token",
    sublabel: "on pump.fun",
    description: "You purchase the seed token on the pump.fun bonding curve.",
  },
  {
    icon: (
      <svg
        className="w-6 h-6 text-helix-400"
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
    title: "Creator Rewards",
    sublabel: "go to team wallet",
    description:
      "pump.fun routes creator rewards from every trade to the project wallet.",
  },
  {
    icon: (
      <svg
        className="w-6 h-6 text-helix-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
    ),
    title: "Fund HLX/SOL LP",
    sublabel: "permanent liquidity",
    description:
      "SOL proceeds are deployed into the HLX/SOL liquidity pool, building permanent on-chain depth.",
  },
];

export function SeedSolFlow() {
  return (
    <section className="py-24 px-4 border-t border-zinc-800/50">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-zinc-100 mb-4">
              Where Your SOL Goes
            </h2>
            <p className="text-zinc-400 max-w-2xl mx-auto">
              Every trade on the seed token generates creator rewards. Those
              rewards fund the HLX/SOL liquidity pool — not a team treasury, not
              vesting schedules. Liquidity.
            </p>
          </div>
        </ScrollReveal>

        {/* Flow Diagram */}
        <ScrollReveal delay={0.1}>
          <div className="flex flex-col lg:flex-row items-center justify-center gap-4 lg:gap-0">
            {flowNodes.map((node, i) => (
              <div key={i} className="flex flex-col lg:flex-row items-center">
                {/* Node */}
                <div className="w-64 p-6 rounded-xl border border-zinc-700 bg-zinc-900 text-center hover:border-helix-600/50 transition-colors">
                  <div className="w-12 h-12 bg-helix-600/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                    {node.icon}
                  </div>
                  <div className="text-base font-semibold text-zinc-100 mb-1">
                    {node.title}
                  </div>
                  <div className="text-xs text-zinc-500 mb-3">{node.sublabel}</div>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    {node.description}
                  </p>
                </div>

                {/* Arrow between nodes */}
                {i < flowNodes.length - 1 && (
                  <div className="flex items-center justify-center my-4 lg:my-0 lg:mx-4">
                    {/* Vertical arrow on mobile */}
                    <svg
                      className="lg:hidden w-5 h-5 text-helix-600/60 rotate-90"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                    {/* Horizontal arrow on desktop */}
                    <svg
                      className="hidden lg:block w-8 h-8 text-helix-600/60"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollReveal>

        {/* PumpSwap note */}
        <ScrollReveal delay={0.2}>
          <div className="mt-12 p-5 rounded-xl border border-zinc-800 bg-zinc-900/30 max-w-2xl mx-auto text-center">
            <p className="text-sm text-zinc-400 leading-relaxed">
              <span className="text-zinc-200 font-medium">Where does it land?</span>{" "}
              pump.fun tokens graduate to PumpSwap. The HLX/SOL liquidity pool
              lives permanently on PumpSwap — not Raydium, not a temporary pool.
              Once deployed, it cannot be withdrawn by the team.
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
