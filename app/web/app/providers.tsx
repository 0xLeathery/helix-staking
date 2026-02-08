"use client";

import { useMemo } from "react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter, SolflareWalletAdapter } from "@solana/wallet-adapter-wallets";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { TooltipProvider } from "@/components/ui/tooltip";

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

// RPC endpoint: use relative /api/rpc in browser, absolute URL during SSR/build
function getRpcEndpoint(): string {
  if (typeof window !== "undefined") {
    return `${window.location.origin}/api/rpc`;
  }
  // During SSR/build, use a placeholder that won't be called
  // (wallet adapter is client-only, this just satisfies the URL validator)
  return "https://localhost/api/rpc";
}

export function Providers({ children }: { children: React.ReactNode }) {
  // Wallet adapters - memoized to prevent re-creation
  const wallets = useMemo(
    () => [new PhantomWalletAdapter(), new SolflareWalletAdapter()],
    []
  );

  const endpoint = useMemo(() => getRpcEndpoint(), []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect={false}>
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
