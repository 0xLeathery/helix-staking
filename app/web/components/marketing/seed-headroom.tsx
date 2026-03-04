import { ScrollReveal } from "./scroll-reveal";

const mechanics = [
  {
    number: "01",
    title: "Snapshot",
    description:
      "When you create a HELIX stake, your current seed token balance is recorded on-chain. This number is your snapshot — the floor you must stay above.",
  },
  {
    number: "02",
    title: "Headroom",
    description:
      "If you buy more seed tokens after staking, you build headroom above your snapshot. You can sell up to that headroom amount without touching your snapshot floor.",
  },
  {
    number: "03",
    title: "Permanent Revocation",
    description:
      "If your seed balance ever drops below your snapshot, the boost is permanently revoked for that stake. It cannot be restored — not even by buying seed back.",
  },
  {
    number: "04",
    title: "Buying Back Does Not Restore",
    description:
      "Once a boost is revoked, it is gone. Repurchasing seed tokens after revocation has no effect on the revoked stake. Future stakes are not affected.",
  },
];

export function SeedHeadroom() {
  return (
    <section className="py-24 px-4 border-t border-zinc-800/50">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-zinc-100 mb-4">
              Headroom &amp; Revocation
            </h2>
            <p className="text-zinc-400 max-w-2xl mx-auto">
              Your boost is protected by headroom. Sell within your headroom and
              keep your boost. Sell below your snapshot and it&apos;s gone —
              that&apos;s the trade-off for 10% extra APY.
            </p>
          </div>
        </ScrollReveal>

        {/* Mechanics grid */}
        <ScrollReveal delay={0.1}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {mechanics.map((item) => (
              <div
                key={item.number}
                className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/50"
              >
                <div className="text-3xl font-bold text-helix-600/30 mb-3">
                  {item.number}
                </div>
                <h3 className="text-base font-semibold text-zinc-100 mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </ScrollReveal>

        {/* Worked headroom example */}
        <ScrollReveal delay={0.15}>
          <div className="mt-10 rounded-xl border border-zinc-700 overflow-hidden">
            <div className="px-6 py-4 bg-zinc-900 border-b border-zinc-800">
              <h3 className="text-base font-semibold text-zinc-100">
                Headroom Example
              </h3>
            </div>
            <div className="p-6 bg-zinc-950 space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-zinc-400">Snapshot balance (at stake time)</span>
                <span className="font-mono text-zinc-200">1,000 seed</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-400">Additional seed purchased after staking</span>
                <span className="font-mono text-helix-400">+ 500 seed</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-400">Current balance</span>
                <span className="font-mono text-zinc-200">1,500 seed</span>
              </div>
              <div className="h-px bg-zinc-800" />
              <div className="flex justify-between items-center">
                <span className="text-zinc-300 font-medium">Headroom (safe to sell)</span>
                <span className="font-mono font-bold text-helix-400">500 seed</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-400">Sell 500 seed → new balance</span>
                <span className="font-mono text-zinc-200">1,000 seed</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-400">Still at or above snapshot?</span>
                <span className="font-mono text-green-400">Yes — boost active</span>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Warning box */}
        <ScrollReveal delay={0.2}>
          <div className="mt-6 p-5 rounded-xl border border-amber-500/30 bg-amber-500/10">
            <div className="flex gap-3">
              <svg
                className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <div>
                <p className="text-sm font-medium text-amber-300 mb-1">
                  Permanent Revocation Warning
                </p>
                <p className="text-sm text-amber-200/70 leading-relaxed">
                  If your seed balance drops below your snapshot amount, the
                  boost for that stake is permanently revoked. Buying seed tokens
                  back after revocation does{" "}
                  <span className="font-semibold text-amber-300">not</span>{" "}
                  restore the boost. This is enforced at the protocol level and
                  cannot be overridden.
                </p>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
