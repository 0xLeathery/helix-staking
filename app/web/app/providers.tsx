"use client";

import { useState, useEffect, useMemo } from "react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { TooltipProvider } from "@/components/ui/tooltip";
import type { Adapter } from "@solana/wallet-adapter-base";

import "@solana/wallet-adapter-react-ui/styles.css";

// Singleton QueryClient - instantiated outside component to avoid re-creation on re-renders
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 15_000,
      gcTime: 30_000,
      refetchOnWindowFocus: true,
      retry: 3,
    },
  },
});

// RPC endpoint: direct URL if set (localnet testing), otherwise proxy through /api/rpc
function getRpcEndpoint(): string {
  const directUrl = process.env.NEXT_PUBLIC_RPC_URL;
  if (directUrl) return directUrl;

  if (typeof window !== "undefined") {
    return `${window.location.origin}/api/rpc`;
  }
  // During SSR/build, use a placeholder that won't be called
  // (wallet adapter is client-only, this just satisfies the URL validator)
  return "https://localhost/api/rpc";
}

export function Providers({ children }: { children: React.ReactNode }) {
  // When NEXT_PUBLIC_TEST_WALLET_SECRET is set (E2E testing), dynamically load
  // the TestWalletAdapter. This keeps test code out of the production bundle.
  const [wallets, setWallets] = useState<Adapter[]>([]);

  useEffect(() => {
    const secret = process.env.NEXT_PUBLIC_TEST_WALLET_SECRET;
    if (secret) {
      import("@/lib/testing/test-wallet-adapter").then(({ TestWalletAdapter }) => {
        setWallets([new TestWalletAdapter(secret)]);
      });
    }
  }, []);

  const endpoint = useMemo(() => getRpcEndpoint(), []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider
          wallets={wallets}
          autoConnect
          onError={(error) => console.error("[WalletProvider]", error)}
        >
        <WalletModalProvider>
          <QueryClientProvider client={queryClient}>
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              forcedTheme="dark"
              enableSystem={false}
            >
              <TooltipProvider delayDuration={300}>
                {children}
              </TooltipProvider>
            </ThemeProvider>
          </QueryClientProvider>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
