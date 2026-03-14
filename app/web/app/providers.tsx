"use client";

import { useState, useEffect, useMemo } from "react";
import { LazyMotion, domAnimation, MotionConfig } from "framer-motion";
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
  // Test wallet adapter is loaded server-side via API route to prevent secret key exposure
  // in client bundles. See: app/api/test-wallet/route.ts (dev-only endpoint)
  const [wallets, setWallets] = useState<Adapter[]>([]);

  useEffect(() => {
    // E2E test wallet injection (Phase 8.2-01 F-01 safe pattern).
    // TEST_WALLET_SECRET is server-side only — never embedded in client bundles.
    // /api/test-wallet returns 404 in production (env var absent) — safe to call always.
    fetch('/api/test-wallet')
      .then((r) => (r.ok ? r.json() : null))
      .then((data: { secretKeyBase58: string; publicKey: string } | null) => {
        if (data?.secretKeyBase58) {
          import('@/lib/testing/test-wallet-adapter').then(({ TestWalletAdapter }) => {
            setWallets((prev) => [new TestWalletAdapter(data.secretKeyBase58), ...prev]);
          });
        }
      })
      .catch((err) => {
        console.warn('Test wallet adapter unavailable:', err);
      });
  }, []);

  const endpoint = useMemo(() => getRpcEndpoint(), []);

  return (
    <LazyMotion features={domAnimation}>
      <MotionConfig reducedMotion="user">
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
      </MotionConfig>
    </LazyMotion>
  );
}
