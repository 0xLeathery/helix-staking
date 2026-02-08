import { WalletButton } from "@/components/wallet/wallet-button";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="text-center space-y-8 max-w-lg">
        {/* Protocol branding */}
        <div className="space-y-2">
          <h1 className="text-5xl font-bold tracking-tight text-zinc-50">
            HELIX
          </h1>
          <p className="text-lg text-zinc-400">
            Stake. Earn T-Shares. Collect Daily Rewards.
          </p>
        </div>

        {/* Connect prompt */}
        <div className="space-y-4">
          <p className="text-sm text-zinc-500">
            Connect your wallet to start staking
          </p>
          <WalletButton />
        </div>

        {/* Protocol highlights */}
        <div className="grid grid-cols-3 gap-4 pt-8 border-t border-zinc-800">
          <div className="space-y-1">
            <p className="text-xs text-zinc-500 uppercase tracking-wider">
              Max Duration
            </p>
            <p className="text-lg font-semibold text-zinc-200">5,555 days</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-zinc-500 uppercase tracking-wider">
              Duration Bonus
            </p>
            <p className="text-lg font-semibold text-zinc-200">Up to 2x</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-zinc-500 uppercase tracking-wider">
              Size Bonus
            </p>
            <p className="text-lg font-semibold text-zinc-200">Up to 2x</p>
          </div>
        </div>
      </div>
    </main>
  );
}
