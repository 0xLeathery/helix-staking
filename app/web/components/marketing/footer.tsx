import Link from "next/link";

/**
 * Phase 8.1 (M9/FR-014): Cluster-aware external links.
 *
 * Determines the Solana cluster from NEXT_PUBLIC_RPC_URL and generates
 * correct Solana Explorer / Solscan URLs accordingly.
 */
const PROGRAM_ID = "E9B7BsxdPS89M66CRGGbsCzQ9LkiGv6aNsra3cNBJha7";

function getCluster(): "mainnet-beta" | "devnet" {
  const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL ?? "";
  if (rpcUrl.includes("devnet")) return "devnet";
  return "mainnet-beta";
}

function getExplorerUrl(address: string): string {
  const cluster = getCluster();
  const suffix = cluster === "devnet" ? "?cluster=devnet" : "";
  return `https://explorer.solana.com/address/${address}${suffix}`;
}

export function MarketingFooter() {
  return (
    <footer className="bg-zinc-950 border-t border-zinc-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Column 1: Branding */}
          <div className="space-y-3">
            <div className="text-xl font-bold text-helix-400">HELIX</div>
            <p className="text-sm text-zinc-400">
              Time-locked staking protocol on Solana
            </p>
          </div>

          {/* Column 2: Protocol Links */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-zinc-100">Protocol</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/how-it-works"
                  className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors"
                >
                  How It Works
                </Link>
              </li>
              <li>
                <Link
                  href="/tokenomics"
                  className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors"
                >
                  Tokenomics
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard"
                  className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors"
                >
                  Launch App
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Resources */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-zinc-100">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://docs.helixstaking.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors"
                >
                  Documentation
                </a>
              </li>
              <li>
                <a
                  href={getExplorerUrl(PROGRAM_ID)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors"
                >
                  Program on Explorer
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="border-t border-zinc-800 mt-8 pt-8">
          <p className="text-xs text-zinc-600 text-center">Built on Solana</p>
        </div>
      </div>
    </footer>
  );
}
