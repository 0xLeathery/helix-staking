import Link from "next/link";

export function MarketingNav() {
  return (
    <nav className="bg-zinc-950/80 backdrop-blur-sm border-b border-zinc-800 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="text-xl font-bold text-helix-400">
            HELIX
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-6">
            <Link
              href="/how-it-works"
              className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors"
            >
              How It Works
            </Link>
            <Link
              href="/tokenomics"
              className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors"
            >
              Tokenomics
            </Link>
            <Link
              href="/dashboard"
              className="bg-helix-600 hover:bg-helix-500 text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors"
            >
              Launch App
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
