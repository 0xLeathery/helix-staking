import { ScrollReveal } from "./scroll-reveal";

const steps = [
  {
    number: "01",
    title: "Hold seed tokens when you stake HLX",
    description:
      "Your seed token balance is recorded at the moment you create your stake. This is called your snapshot balance.",
  },
  {
    number: "02",
    title: "Snapshot recorded",
    description:
      "The protocol stores your seed balance as part of the stake account on-chain. This becomes the threshold you must maintain.",
  },
  {
    number: "03",
    title: "Every reward claim checks your balance",
    description:
      "When you claim rewards, the protocol checks your current seed token balance against your snapshot. This happens on every claim.",
  },
  {
    number: "04",
    title: "Hold >= snapshot, earn 10% extra",
    description:
      "If your current seed balance is at or above your snapshot amount, the 10% boost is applied to that claim automatically.",
  },
];

export function SeedBoostExplain() {
  return (
    <section id="how-boost-works" className="py-24 px-4 border-t border-zinc-800/50">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-zinc-100 mb-4">
              How the Boost Works
            </h2>
            <p className="text-zinc-400 max-w-2xl mx-auto">
              The boost is checked on every reward claim, not locked in
              permanently. Keep your seed tokens and keep earning 10% extra.
            </p>
          </div>
        </ScrollReveal>

        {/* Steps */}
        <ScrollReveal delay={0.1}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
            {steps.map((step) => (
              <div
                key={step.number}
                className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/50"
              >
                <div className="text-3xl font-bold text-helix-600/30 mb-3">
                  {step.number}
                </div>
                <h3 className="text-base font-semibold text-zinc-100 mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </ScrollReveal>

        {/* Worked Example */}
        <ScrollReveal delay={0.2}>
          <div className="rounded-xl border border-zinc-700 overflow-hidden">
            <div className="px-6 py-4 bg-zinc-900 border-b border-zinc-800">
              <h3 className="text-base font-semibold text-zinc-100">
                Worked Example — Base vs Boosted APY
              </h3>
              <p className="text-sm text-zinc-500 mt-1">
                Assumes 10% boost multiplier (1,000 BPS), locked at protocol
                level
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-zinc-800">
              {/* Without boost */}
              <div className="p-6 bg-zinc-950">
                <div className="text-xs text-zinc-500 uppercase tracking-wider mb-4">
                  Without Seed Boost
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-zinc-400">Base APY</span>
                    <span className="text-sm font-mono text-zinc-200">
                      3.69%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-zinc-400">Boost multiplier</span>
                    <span className="text-sm font-mono text-zinc-500">
                      None
                    </span>
                  </div>
                  <div className="h-px bg-zinc-800" />
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-zinc-300">
                      Effective APY
                    </span>
                    <span className="text-base font-bold font-mono text-zinc-200">
                      3.69%
                    </span>
                  </div>
                </div>
              </div>

              {/* With boost */}
              <div className="p-6 bg-zinc-950">
                <div className="text-xs text-helix-500 uppercase tracking-wider mb-4">
                  With Seed Boost
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-zinc-400">Base APY</span>
                    <span className="text-sm font-mono text-zinc-200">
                      3.69%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-zinc-400">Boost multiplier</span>
                    <span className="text-sm font-mono text-helix-400">
                      +10%
                    </span>
                  </div>
                  <div className="h-px bg-zinc-800" />
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-zinc-300">
                      Effective APY
                    </span>
                    <span className="text-base font-bold font-mono text-helix-400">
                      4.06%
                    </span>
                  </div>
                </div>

                <div className="mt-4 text-xs text-zinc-600">
                  3.69% × 1.10 = 4.059% → 4.06%
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.25}>
          <p className="text-center text-sm text-zinc-500 mt-6">
            APY figures are illustrative. Actual APY depends on protocol day,
            T-share count, and total stakers. One boosted stake per wallet.
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
