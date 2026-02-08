import Link from "next/link";

export function CallToAction() {
  return (
    <section className="py-24 px-4">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-zinc-100 mb-4">
          Ready to Start Earning?
        </h2>
        <p className="text-zinc-400 mb-8">
          Connect your wallet and create your first stake in minutes.
        </p>
        <Link
          href="/dashboard"
          className="bg-helix-600 hover:bg-helix-500 text-white px-10 py-4 rounded-lg font-medium text-lg inline-block transition-colors"
        >
          Launch App
        </Link>
        <p className="text-xs text-zinc-600 mt-4">
          No sign-up required. Just a Solana wallet.
        </p>
      </div>
    </section>
  );
}
