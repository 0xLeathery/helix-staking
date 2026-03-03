import { ScrollReveal } from "./scroll-reveal";

export function Mechanics() {
  return (
    <section className="py-24 px-4 bg-zinc-900/30">
      <div className="max-w-6xl mx-auto">
        {/* Section Heading */}
        <ScrollReveal>
          <h2 className="text-3xl font-bold text-zinc-100 text-center mb-4">
            How HELIX Staking Works
          </h2>
          <p className="text-zinc-400 text-center mb-16">
            A simple 3-step process
          </p>
        </ScrollReveal>

        {/* Steps Grid */}
        <ScrollReveal delay={0.1}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="text-center">
            <div className="w-12 h-12 rounded-full border-2 border-helix-600 flex items-center justify-center mx-auto mb-6">
              <span className="text-helix-400 font-bold text-lg">1</span>
            </div>
            <h3 className="text-xl font-semibold text-zinc-100 mb-3">
              Choose Duration
            </h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Select how long to lock your tokens. 1 day to 5,555 days. Longer
              stakes earn more T-shares.
            </p>
          </div>

          {/* Step 2 */}
          <div className="text-center">
            <div className="w-12 h-12 rounded-full border-2 border-helix-600 flex items-center justify-center mx-auto mb-6">
              <span className="text-helix-400 font-bold text-lg">2</span>
            </div>
            <h3 className="text-xl font-semibold text-zinc-100 mb-3">
              Earn T-Shares
            </h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              T-shares represent your claim on daily inflation rewards. Bonuses
              for bigger and longer stakes.
            </p>
          </div>

          {/* Step 3 */}
          <div className="text-center">
            <div className="w-12 h-12 rounded-full border-2 border-helix-600 flex items-center justify-center mx-auto mb-6">
              <span className="text-helix-400 font-bold text-lg">3</span>
            </div>
            <h3 className="text-xl font-semibold text-zinc-100 mb-3">
              Collect Rewards
            </h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Claim your share of daily inflation. Hold until maturity to
              receive your full principal back.
            </p>
          </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
