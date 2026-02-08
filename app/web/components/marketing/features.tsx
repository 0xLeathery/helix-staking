export function Features() {
  return (
    <section className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Section Heading */}
        <h2 className="text-3xl font-bold text-zinc-100 text-center mb-16">
          Why Stake with HELIX?
        </h2>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Feature 1: Duration Bonus */}
          <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900 transition-colors">
            <div className="w-10 h-10 bg-helix-600/10 rounded-lg flex items-center justify-center mb-4">
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
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-zinc-100 mb-2">
              Duration Bonus
            </h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Stake longer, earn more T-shares. Up to 2x bonus at max duration.
            </p>
          </div>

          {/* Feature 2: Size Bonus */}
          <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900 transition-colors">
            <div className="w-10 h-10 bg-helix-600/10 rounded-lg flex items-center justify-center mb-4">
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
                  d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-zinc-100 mb-2">
              Size Bonus
            </h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Larger stakes earn proportionally more. Up to 2x bonus for bigger
              commitments.
            </p>
          </div>

          {/* Feature 3: Daily Rewards */}
          <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900 transition-colors">
            <div className="w-10 h-10 bg-helix-600/10 rounded-lg flex items-center justify-center mb-4">
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
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-zinc-100 mb-2">
              Daily Rewards
            </h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Earn your share of daily inflation, distributed proportionally to
              T-share holders.
            </p>
          </div>

          {/* Feature 4: Big Pay Day */}
          <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900 transition-colors">
            <div className="w-10 h-10 bg-helix-600/10 rounded-lg flex items-center justify-center mb-4">
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
                  d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-zinc-100 mb-2">
              Big Pay Day
            </h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Unclaimed tokens from the free claim are distributed to active
              stakers.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
