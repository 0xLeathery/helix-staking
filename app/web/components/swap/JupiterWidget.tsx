'use client';

import * as React from 'react';
import Script from 'next/script';
import { useWallet } from '@solana/wallet-adapter-react';
import { deriveMint } from '@/lib/solana/pdas';

declare global {
  interface Window {
    Jupiter: any;
  }
}

export function JupiterWidget() {
  const { wallet, publicKey } = useWallet();
  const [isLoaded, setIsLoaded] = React.useState(false);

  const initJupiter = React.useCallback(() => {
    if (typeof window !== 'undefined' && window.Jupiter) {
      const [mint] = deriveMint();
      
      window.Jupiter.init({
        displayMode: 'integrated',
        integratedTargetId: 'jupiter-terminal',
        endpoint: process.env.NEXT_PUBLIC_RPC_URL || 'https://api.mainnet-beta.solana.com',
        strictTokenList: false,
        formProps: {
          initialOutputMint: mint.toBase58(),
          fixedOutputMint: false,
        },
        enableWalletPassthrough: true,
      });
    }
  }, []);

  // Update wallet passthrough when wallet changes
  React.useEffect(() => {
    if (isLoaded && window.Jupiter?.sync) {
      window.Jupiter.sync();
    }
  }, [isLoaded, wallet, publicKey]);

  return (
    <div className="flex flex-col items-center justify-center w-full py-4">
      <Script
        src="https://terminal.jup.ag/main-v4.js"
        onLoad={() => {
          setIsLoaded(true);
          initJupiter();
        }}
      />
      <div className="w-full max-w-[440px] bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-2xl">
        <div id="jupiter-terminal" className="min-h-[600px] w-full" />
      </div>
      <p className="mt-4 text-xs text-zinc-500 text-center max-w-[400px]">
        Swaps are powered by Jupiter. HELIX is a community-driven protocol. 
        Always verify token addresses before swapping.
      </p>
    </div>
  );
}
