# Phase 4: Staking Dashboard - Research

**Researched:** 2026-02-08
**Domain:** Next.js 14 App Router + Solana Web3 + TanStack React Query
**Confidence:** HIGH

## Summary

Phase 4 requires building a Next.js 14 App Router frontend that connects to Solana wallets, reads on-chain state from the helix-staking program, and enables stake creation/management with sophisticated penalty calculations. The tech stack is locked (Next.js 14+, @solana/web3.js v1, @coral-xyz/anchor 0.31.1, TanStack React Query v5, Zustand v5) with specific infrastructure requirements (Helius RPC, Vercel hosting, Tailwind + shadcn/ui).

**Primary recommendation:** Use the Anchor TypeScript client generated from the IDL as the single source of truth for all on-chain interactions. Never duplicate on-chain state in client state management (Zustand is for UI-only state). Implement WebSocket subscriptions via `connection.onAccountChange` to invalidate React Query cache for real-time updates. Always simulate transactions before presenting to wallet. Use fixed-point arithmetic (BigInt/BN.js) for all token amounts to match the on-chain PRECISION = 1e9.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Visual Identity & Layout:**
- Dark mode only (DeFi convention, easier on eyes for financial data)
- Card-based layout for stakes, rewards, and protocol stats
- Tailwind CSS with shadcn/ui patterns for primitives (Button, Card, Modal, Toast)
- Design-in-code approach (no Figma mockups) — iterate directly in browser with Tailwind
- Modern DeFi feel — clean, data-forward, not cluttered

**Stake Creation Experience:**
- 3-step wizard flow:
  1. Amount input (balance display, max button, validation via CTA state)
  2. Duration selector (slider + input + presets: 1Y/3Y/5Y/Max) with live T-share preview showing Duration Bonus and Size Bonus breakdown
  3. Review/confirm (full summary, penalty warning, estimated fee)
- Post-stake success screen with "View My Stakes" CTA
- Bonus curve visualization showing how duration/amount affect T-shares

**Penalty & Risk Communication:**
- Mandatory penalty preview before any unstake (no way to skip)
- Visual comparison bar: "What you staked" vs "What you'd receive"
- Confirmation checkbox: "I understand I will lose X HELIX (Y%)" required before signing
- Color-coded states: green (matured/grace), yellow (early with moderate penalty), red (heavy penalty or late)
- BPD window blocking: clear explanation when unstake is temporarily unavailable

**Terminology & Branding:**
- LPB → "Duration Bonus" (user-facing display)
- BPB → "Size Bonus" (user-facing display)
- share_rate → "T-Share Price" (user-facing display)
- Keep as-is: "T-Shares", "Big Pay Day", "Free Claim"
- Early unstake labeled "Early Unstake" (not "Emergency End Stake")
- On-time unstake labeled "End Stake"
- Late unstake labeled "End Stake (Late)" with urgency indicator
- Educational tooltips on first encounter of jargon terms

**Infrastructure:**
- Helius as primary RPC provider (free tier for dev, $49/mo at launch)
- RPC proxy via Next.js API route (API keys stay server-side)
- Vercel for hosting (zero-config Next.js, preview deploys)
- No USD price display for MVP — HELIX amounts only
- Sentry for error tracking (free tier)

**Testing Strategy:**
- Defer frontend testing to Phase 8 (dedicated testing/audit phase)
- Focus Phase 4 on building functional UI

**Architecture (Expert Panel Consensus):**
- Next.js 14+ App Router, @solana/web3.js v1 (Anchor constraint), @coral-xyz/anchor 0.31.1
- TanStack React Query v5 for on-chain data (staleTime: 15s stakes, 30s global state)
- Zustand v5 for UI-only state (selected stake, form state, view toggles)
- Never duplicate on-chain data in client state — anti-pattern that causes sync bugs
- WebSocket subscriptions (connection.onAccountChange) to invalidate React Query cache
- getProgramAccounts with memcmp filter on user pubkey to find all user stakes

**Page Structure:**
```
/                           → Connect wallet prompt + protocol overview
/dashboard                  → Portfolio (stakes list, summary stats, quick actions)
/dashboard/stake            → Create new stake (3-step wizard)
/dashboard/stakes/[stakeId] → Stake detail + penalty calculator
/dashboard/claim            → Free claim (eligibility + claim + vesting)
/dashboard/rewards          → Rewards overview + BPD status
```

**On-Chain Integration (Critical Details):**
- Token-2022 program ID required for ALL token operations (not legacy SPL Token)
- Burn-and-mint model: tokens burned on stake, minted on unstake/claim — mint supply ≠ TVL
- Stake ID race condition: create_stake PDA derived from total_stakes_created counter — catch AccountAlreadyInUse, re-fetch, retry
- Free claim: Ed25519 verify instruction must immediately precede free_claim instruction in same tx
- BPD window blocks unstake: check globalState.reserved[0] !== 0
- Use BigInt/BN.js for ALL on-chain amounts (never JS Number)
- Program ID: E9B7BsxdPS89M66CRGGbsCzQ9LkiGv6aNsra3cNBJha7

**Security (Non-Negotiable):**
- CSP headers: script-src 'self' (no unsafe-inline/eval), whitelist RPC endpoints
- X-Frame-Options: DENY, X-Content-Type-Options: nosniff
- Transaction simulation before presenting to wallet (always)
- autoConnect: false on wallet adapter (require explicit user action)
- Pin exact dependency versions (no ^ or ~ for Solana packages)
- Program ID hardcoded as constant, verified in every transaction

**Recommended Plan Breakdown:**
- 04-01: Scaffold + providers + wallet connection + CSP headers + UI primitives
- 04-02: Dashboard + stake viewing + global stats + React Query hooks
- 04-03: Create stake wizard (3-step) with bonus preview and T-share calculation
- 04-04: Unstake + penalty calculator + reward claiming
- 04-05: Free claim + vesting + BPD status + mobile/a11y polish

### Claude's Discretion

- Exact color palette and design tokens within dark theme
- Loading skeleton design and animation
- Error state messaging and recovery flows
- Component internal architecture and hook composition
- Exact spacing, typography, and responsive breakpoints
- WebSocket vs polling strategy details
- Priority fee estimation approach
- Empty state illustrations/copy

### Deferred Ideas (OUT OF SCOPE)

- USD price display via Jupiter Price API — Phase 6 (Jupiter integration)
- Historical analytics charts (T-share price history, payout history) — Phase 6 (requires indexer)
- Jupiter swap widget — Phase 6
- Leaderboard / whale tracker / staker ranks — Phase 7
- Marketing/landing site — Phase 7
- Browser push notifications for stake maturity — Phase 5+
- Staking ladder planner tool — backlog
- Tax reporting export — backlog
- Multi-wallet simultaneous connection — backlog
- Good Accounting / "Secure Stake" instruction — requires on-chain program change
- HEX-style aquatic animal league system (Whale, Shark, Dolphin tiers) — Phase 7 gamification

</user_constraints>

## Standard Stack

### Core Dependencies

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Next.js | 14+ (App Router) | React framework with SSR/SSG | Industry standard for React apps, zero-config Vercel deployment, built-in API routes for RPC proxy |
| @solana/web3.js | ^1.95.0 (v1 only) | Solana blockchain interaction | **Constraint:** Anchor 0.31.1 TypeScript client requires v1, incompatible with v2 |
| @coral-xyz/anchor | ^0.31.0 | Generated TypeScript client from IDL | Provides type-safe program interface, automatic PDA derivation, account deserialization |
| @tanstack/react-query | ^5.0.0 | Server state management | De facto standard for async state, automatic caching/refetching, WebSocket integration |
| zustand | ^5.0.0 | UI state management | Lightweight (1kb), no provider wrapper needed, 40% adoption in modern React apps |
| @solana/wallet-adapter-react | latest | Wallet connection | Official Solana wallet adapter, supports Phantom/Solflare/Backpack/etc |
| @solana/wallet-adapter-react-ui | latest | Wallet UI components | Pre-built wallet selection modal |
| tailwindcss | ^3.4.0+ or ^4.0.0 | Utility-first CSS | User requirement, pairs with shadcn/ui |
| shadcn/ui | latest | Component primitives | User requirement, copy-paste components (not npm package) |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| bn.js | ^5.2.1 | BigNumber arithmetic | All token calculations (required by Anchor) |
| @noble/hashes | ^2.0.1 | Keccak-256 for Merkle proofs | Free claim verification |
| @noble/curves | ^2.0.1 | Ed25519 signatures | Free claim Ed25519 instruction |
| next-themes | ^0.2.0+ | Theme provider for shadcn/ui | Dark mode implementation |
| @sentry/nextjs | ^8.0.0 | Error tracking | User requirement (free tier) |
| clsx / tailwind-merge | latest | Conditional class merging | shadcn/ui utility pattern |

### Installation

```bash
# Core Next.js + Solana
npm install next@14 react react-dom
npm install @solana/web3.js@^1.95.0 @coral-xyz/anchor@^0.31.0
npm install @solana/wallet-adapter-base @solana/wallet-adapter-react @solana/wallet-adapter-react-ui
npm install @solana/wallet-adapter-wallets

# State management
npm install @tanstack/react-query@^5.0.0 zustand@^5.0.0

# Crypto utilities (match test suite)
npm install bn.js @noble/hashes@^2.0.1 @noble/curves@^2.0.1

# UI
npm install tailwindcss postcss autoprefixer
npm install next-themes clsx tailwind-merge
# shadcn/ui: npx shadcn-ui@latest init (follow prompts)

# Error tracking
npm install @sentry/nextjs

# Dev dependencies
npm install -D typescript @types/react @types/node @types/bn.js
```

**Version pinning:** Use exact versions (no `^` or `~`) for `@solana/web3.js`, `@coral-xyz/anchor`, and `bn.js` to prevent breaking changes. These are specified in user security requirements.

## Architecture Patterns

### Recommended Project Structure

```
app/
├── (marketing)/           # Public marketing pages (optional Phase 7)
│   ├── layout.tsx
│   └── page.tsx           # Landing page
├── dashboard/
│   ├── layout.tsx         # Dashboard shell
│   ├── page.tsx           # Portfolio view
│   ├── stake/
│   │   └── page.tsx       # 3-step wizard
│   ├── stakes/
│   │   └── [stakeId]/
│   │       └── page.tsx   # Stake detail + penalty calc
│   ├── claim/
│   │   └── page.tsx       # Free claim flow
│   └── rewards/
│       └── page.tsx       # Rewards + BPD status
├── api/
│   └── rpc/
│       └── route.ts       # Helius RPC proxy
├── providers.tsx          # "use client" provider wrapper
└── layout.tsx             # Root layout with CSP

components/
├── ui/                    # shadcn/ui primitives
│   ├── button.tsx
│   ├── card.tsx
│   ├── dialog.tsx
│   └── ...
├── wallet/
│   ├── wallet-button.tsx
│   └── wallet-modal.tsx
├── stake/
│   ├── stake-card.tsx
│   ├── stake-wizard/
│   │   ├── amount-step.tsx
│   │   ├── duration-step.tsx
│   │   └── confirm-step.tsx
│   ├── penalty-calculator.tsx
│   └── bonus-preview.tsx
└── dashboard/
    ├── protocol-stats.tsx
    ├── portfolio-summary.tsx
    └── bpd-status.tsx

lib/
├── solana/
│   ├── program.ts         # Anchor program singleton
│   ├── pdas.ts            # PDA derivation helpers
│   ├── constants.ts       # Program ID, seeds, precision
│   └── math.ts            # Match on-chain math (TypeScript versions)
├── hooks/
│   ├── useProgram.ts      # Anchor program hook
│   ├── useGlobalState.ts  # React Query hook for GlobalState
│   ├── useStakes.ts       # React Query hook for user stakes
│   ├── useCreateStake.ts  # Mutation hook
│   └── useUnstake.ts      # Mutation hook
├── store/
│   └── ui-store.ts        # Zustand store (UI-only state)
└── utils/
    ├── format.ts          # Token formatting (8 decimals)
    └── penalties.ts       # Client-side penalty preview

types/
└── program.ts             # Generated from Anchor IDL

public/
└── (static assets)
```

### Pattern 1: Provider Hierarchy (App Router)

**What:** Next.js 14 App Router requires "use client" for context providers. Wrap all providers in a single client component imported by root layout.

**When to use:** Every Next.js 14 App Router + Solana wallet adapter project.

**Example:**

```tsx
// app/providers.tsx
"use client";

import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { useMemo } from "react";

// Import wallet adapter CSS
import "@solana/wallet-adapter-react-ui/styles.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 15_000, // 15s for stakes
      gcTime: 30_000,    // 30s garbage collection
      refetchOnWindowFocus: true,
      retry: 3,
    },
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  // Use API route proxy, not Helius directly
  const endpoint = useMemo(() => "/api/rpc", []);

  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
    ],
    []
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect={false}>
        <WalletModalProvider>
          <QueryClientProvider client={queryClient}>
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem={false}
              forcedTheme="dark"
            >
              {children}
            </ThemeProvider>
          </QueryClientProvider>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
```

```tsx
// app/layout.tsx (root layout, server component)
import { Providers } from "./providers";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

**Sources:**
- [Solana wallet integration with Next.js](https://solana.com/docs/frontend/nextjs-solana)
- [TanStack Query React Quick Start](https://github.com/tanstack/query/blob/main/docs/framework/react/quick-start.md)

### Pattern 2: RPC Proxy via Next.js API Route

**What:** Proxy Helius RPC requests through Next.js API route to keep API keys server-side and enable CSP compliance.

**When to use:** Required for production security. API keys must never be exposed to client.

**Example:**

```ts
// app/api/rpc/route.ts
import { NextRequest, NextResponse } from "next/server";

const HELIUS_RPC_URL = process.env.HELIUS_RPC_URL;

if (!HELIUS_RPC_URL) {
  throw new Error("HELIUS_RPC_URL environment variable not set");
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const response = await fetch(HELIUS_RPC_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("RPC proxy error:", error);
    return NextResponse.json(
      { error: "RPC request failed" },
      { status: 500 }
    );
  }
}
```

```env
# .env.local
HELIUS_RPC_URL=https://mainnet.helius-rpc.com/?api-key=YOUR_KEY
```

**Security note:** This pattern keeps the Helius API key server-side and allows CSP to block external script sources.

### Pattern 3: CSP Headers via Middleware

**What:** Content Security Policy headers in Next.js middleware to prevent XSS attacks.

**When to use:** Required for production. User security requirement.

**Example:**

```ts
// middleware.ts
import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const isDev = process.env.NODE_ENV === "development";

  const cspHeader = `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isDev ? " 'unsafe-eval'" : ""};
    style-src 'self' 'nonce-${nonce}';
    img-src 'self' blob: data:;
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
  `
    .replace(/\s{2,}/g, " ")
    .trim();

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", cspHeader);

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  response.headers.set("Content-Security-Policy", cspHeader);
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except static files and images
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
```

**Sources:**
- [Next.js Content Security Policy Guide](https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/content-security-policy.mdx)

### Pattern 4: React Query + WebSocket Cache Invalidation

**What:** Use React Query for on-chain data caching, invalidate cache on WebSocket account updates.

**When to use:** Required pattern per user architecture decisions. Never duplicate on-chain state in Zustand.

**Example:**

```tsx
// lib/hooks/useGlobalState.ts
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useConnection } from "@solana/wallet-adapter-react";
import { useProgram } from "./useProgram";
import { useEffect } from "react";

export function useGlobalState() {
  const { connection } = useConnection();
  const program = useProgram();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["globalState"],
    queryFn: async () => {
      const [globalStatePda] = program.globalStatePda(); // From lib/solana/pdas.ts
      return await program.account.globalState.fetch(globalStatePda);
    },
    staleTime: 30_000, // 30s (global state changes infrequently)
  });

  // WebSocket subscription to invalidate cache on updates
  useEffect(() => {
    if (!query.data) return;

    const [globalStatePda] = program.globalStatePda();
    const subscriptionId = connection.onAccountChange(
      globalStatePda,
      () => {
        queryClient.invalidateQueries({ queryKey: ["globalState"] });
      },
      "confirmed"
    );

    return () => {
      connection.removeAccountChangeListener(subscriptionId);
    };
  }, [connection, query.data, queryClient]);

  return query;
}
```

```tsx
// lib/hooks/useStakes.ts
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { useProgram } from "./useProgram";
import { useEffect } from "react";
import { PublicKey } from "@solana/web3.js";

export function useStakes() {
  const { publicKey } = useWallet();
  const { connection } = useConnection();
  const program = useProgram();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["stakes", publicKey?.toBase58()],
    queryFn: async () => {
      if (!publicKey) return [];

      // Use getProgramAccounts with memcmp filter on user pubkey
      const accounts = await program.account.stakeAccount.all([
        {
          memcmp: {
            offset: 8, // After discriminator
            bytes: publicKey.toBase58(),
          },
        },
      ]);

      return accounts;
    },
    enabled: !!publicKey,
    staleTime: 15_000, // 15s for stakes
  });

  // Subscribe to ALL user stake accounts
  useEffect(() => {
    if (!publicKey || !query.data) return;

    const subscriptionIds = query.data.map((stake) => {
      return connection.onAccountChange(
        stake.publicKey,
        () => {
          queryClient.invalidateQueries({ queryKey: ["stakes", publicKey.toBase58()] });
        },
        "confirmed"
      );
    });

    return () => {
      subscriptionIds.forEach((id) => {
        connection.removeAccountChangeListener(id);
      });
    };
  }, [connection, publicKey, query.data, queryClient]);

  return query;
}
```

**Sources:**
- [TanStack Query cache invalidation patterns](https://context7.com/tanstack/query/llms.txt)
- [Helius WebSocket subscriptions](https://www.helius.dev/docs/rpc/websocket)

**Important:** Helius Enhanced WebSockets are recommended over standard WebSockets for production, but user decisions specify using standard `connection.onAccountChange`. Enhanced WebSockets support filtering up to 50,000 addresses but require gRPC client setup.

### Pattern 5: Anchor Program Singleton

**What:** Create a singleton instance of the Anchor program to avoid re-instantiation.

**When to use:** Always. Share single program instance across all hooks.

**Example:**

```ts
// lib/solana/program.ts
import { Program, AnchorProvider } from "@coral-xyz/anchor";
import { Connection, PublicKey } from "@solana/web3.js";
import { HelixStaking } from "@/types/program"; // Generated from IDL
import idl from "@/idl/helix_staking.json";

export const PROGRAM_ID = new PublicKey(
  "E9B7BsxdPS89M66CRGGbsCzQ9LkiGv6aNsra3cNBJha7"
);

export function getProgram(
  connection: Connection,
  wallet?: any
): Program<HelixStaking> {
  const provider = new AnchorProvider(
    connection,
    wallet ?? ({} as any), // Dummy wallet for read-only
    { commitment: "confirmed" }
  );

  return new Program<HelixStaking>(idl as any, PROGRAM_ID, provider);
}
```

```tsx
// lib/hooks/useProgram.ts
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useMemo } from "react";
import { getProgram } from "@/lib/solana/program";

export function useProgram() {
  const { connection } = useConnection();
  const wallet = useWallet();

  return useMemo(() => {
    return getProgram(connection, wallet);
  }, [connection, wallet]);
}
```

### Pattern 6: Transaction Simulation + Error Handling

**What:** Always simulate transactions before presenting to wallet. Catch simulation errors and display user-friendly messages.

**When to use:** Required for all transaction-building hooks (user security requirement).

**Example:**

```tsx
// lib/hooks/useCreateStake.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { useProgram } from "./useProgram";
import BN from "bn.js";
import { getAssociatedTokenAddress, TOKEN_2022_PROGRAM_ID } from "@solana/spl-token";

export function useCreateStake() {
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const program = useProgram();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ amount, days }: { amount: BN; days: number }) => {
      if (!publicKey) throw new Error("Wallet not connected");

      // Fetch global state to get total_stakes_created
      const [globalStatePda] = program.globalStatePda();
      const globalState = await program.account.globalState.fetch(globalStatePda);

      // Derive PDAs
      const [stakeAccountPda] = program.stakeAccountPda(
        publicKey,
        globalState.totalStakesCreated
      );
      const [mintPda] = program.mintPda();
      const userTokenAccount = await getAssociatedTokenAddress(
        mintPda,
        publicKey,
        false,
        TOKEN_2022_PROGRAM_ID
      );

      // Build transaction
      const tx = await program.methods
        .createStake(amount, days)
        .accounts({
          user: publicKey,
          globalState: globalStatePda,
          stakeAccount: stakeAccountPda,
          userTokenAccount,
          mint: mintPda,
          tokenProgram: TOKEN_2022_PROGRAM_ID,
        })
        .transaction();

      tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
      tx.feePayer = publicKey;

      // SIMULATE BEFORE SENDING (user requirement)
      const simulation = await connection.simulateTransaction(tx);
      if (simulation.value.err) {
        throw new Error(
          `Transaction simulation failed: ${JSON.stringify(simulation.value.err)}`
        );
      }

      // Send transaction
      const signature = await sendTransaction(tx, connection);

      // Wait for confirmation
      await connection.confirmTransaction(signature, "confirmed");

      return signature;
    },
    onSuccess: () => {
      // Invalidate stakes cache
      queryClient.invalidateQueries({ queryKey: ["stakes", publicKey?.toBase58()] });
      queryClient.invalidateQueries({ queryKey: ["globalState"] });
    },
    onError: (error) => {
      console.error("Stake creation failed:", error);
      // User-friendly error handling in UI component
    },
  });
}
```

**Sources:**
- [Solana transaction simulation](https://solana.com/docs/rpc/http/simulatetransaction)
- [Error handling in wallet adapter](https://learn.blueshift.gg/en/courses/mobile-dapp-fundamentals/error-handling)

### Pattern 7: Zustand for UI-Only State

**What:** Use Zustand v5 for transient UI state (form data, view toggles, selected items). Never store on-chain data.

**When to use:** Form state in multi-step wizard, view preferences, UI toggles.

**Example:**

```ts
// lib/store/ui-store.ts
import { create } from "zustand";

interface StakeWizardState {
  step: 1 | 2 | 3;
  amount: string;
  days: string;
  setStep: (step: 1 | 2 | 3) => void;
  setAmount: (amount: string) => void;
  setDays: (days: string) => void;
  reset: () => void;
}

export const useStakeWizard = create<StakeWizardState>((set) => ({
  step: 1,
  amount: "",
  days: "",
  setStep: (step) => set({ step }),
  setAmount: (amount) => set({ amount }),
  setDays: (days) => set({ days }),
  reset: () => set({ step: 1, amount: "", days: "" }),
}));
```

```tsx
// components/stake/stake-wizard/amount-step.tsx
"use client";

import { useStakeWizard } from "@/lib/store/ui-store";
import { useWallet } from "@solana/wallet-adapter-react";
import { useTokenBalance } from "@/lib/hooks/useTokenBalance";

export function AmountStep() {
  const { amount, setAmount, setStep } = useStakeWizard();
  const { publicKey } = useWallet();
  const balance = useTokenBalance(publicKey);

  const handleNext = () => {
    if (parseFloat(amount) > 0) {
      setStep(2);
    }
  };

  const handleMax = () => {
    if (balance.data) {
      setAmount(balance.data.toString());
    }
  };

  return (
    <div>
      <label>Amount to Stake</label>
      <input
        type="text"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="0.00"
      />
      <button onClick={handleMax}>MAX</button>
      <p>Balance: {balance.data?.toString() || "0"} HELIX</p>
      <button onClick={handleNext} disabled={!amount || parseFloat(amount) <= 0}>
        Next
      </button>
    </div>
  );
}
```

**Sources:**
- [Zustand v5 setup patterns](https://jsdev.space/howto/zustand5-react/)
- [State management in React 2026](https://www.c-sharpcorner.com/article/state-management-in-react-2026-best-practices-tools-real-world-patterns/)

### Anti-Patterns to Avoid

- **Duplicating on-chain state in Zustand:** Causes sync bugs. Use React Query for all on-chain data.
- **Using JS Number for token amounts:** Loses precision. Always use `BigInt` or `BN` from `bn.js`.
- **Not simulating transactions:** User requirement. Always simulate before `sendTransaction`.
- **Hardcoding RPC endpoint in client:** Exposes API keys. Use API route proxy.
- **autoConnect: true on wallet adapter:** Security requirement. Must be false.
- **Using @solana/web3.js v2:** Incompatible with Anchor 0.31.1 TypeScript client.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Wallet connection UI | Custom wallet dropdown | `@solana/wallet-adapter-react-ui` + `WalletModalProvider` | Handles 15+ wallets, mobile wallet protocol, edge cases |
| On-chain data fetching | Manual `connection.getAccountInfo` | Anchor program `.fetch()` methods | Automatic deserialization, type safety, PDA derivation |
| Cache invalidation | Manual state updates | React Query `invalidateQueries` | Prevents stale data, handles race conditions, refetches automatically |
| BigNumber arithmetic | Custom math functions | `bn.js` (already required by Anchor) | Matches on-chain u64/u128 behavior, prevents overflow |
| UI primitives | Custom components | shadcn/ui (user requirement) | Accessible, tested, dark mode support |
| Merkle tree verification | Custom hash logic | `@noble/hashes` keccak256 + match test suite pattern | Matches on-chain verification, battle-tested |

**Key insight:** Solana frontend development has mature tooling. Custom solutions introduce bugs (especially in math, caching, and transaction building). Use established patterns from Anchor ecosystem and React Query best practices.

## Common Pitfalls

### Pitfall 1: Stake ID Race Condition

**What goes wrong:** `create_stake` derives PDA from `global_state.total_stakes_created` counter. If user submits multiple stakes simultaneously, the second transaction fails with `AccountAlreadyInUse` because the PDA was already initialized.

**Why it happens:** Frontend fetches global state once, uses stale counter for both transactions.

**How to avoid:** Catch `AccountAlreadyInUse` error, re-fetch global state, retry with updated counter.

**Warning signs:** Intermittent stake creation failures when user creates multiple stakes quickly.

**Example fix:**

```ts
// In useCreateStake mutation
let retries = 0;
const maxRetries = 3;

while (retries < maxRetries) {
  try {
    const globalState = await program.account.globalState.fetch(globalStatePda);
    const [stakeAccountPda] = program.stakeAccountPda(
      publicKey,
      globalState.totalStakesCreated
    );

    // Build and send transaction...

    break; // Success
  } catch (error) {
    if (error.message.includes("AccountAlreadyInUse") && retries < maxRetries - 1) {
      retries++;
      await new Promise(resolve => setTimeout(resolve, 500)); // Wait 500ms
      continue;
    }
    throw error; // Re-throw if not retryable
  }
}
```

**Source:** User-provided context (on-chain integration critical details)

### Pitfall 2: Precision Loss with JS Number

**What goes wrong:** Token amounts have 8 decimals. JS `Number` loses precision beyond 53 bits. Calculations produce incorrect values.

**Why it happens:** Developers use `parseFloat()` or arithmetic operators on token amounts.

**How to avoid:** Always use `BigInt` or `bn.js`. Convert only for display formatting.

**Warning signs:** Stake amounts showing as incorrect in UI, "dust" amounts appearing/disappearing.

**Example:**

```ts
// ❌ WRONG
const amount = 1_000_000_000_000_000; // 10M HELIX (8 decimals)
const half = amount / 2; // Loses precision!

// ✅ CORRECT
import BN from "bn.js";
const amount = new BN("100000000000000"); // 1M HELIX
const half = amount.div(new BN(2));

// Display formatting
function formatHelix(amount: BN): string {
  const decimals = 8;
  const divisor = new BN(10).pow(new BN(decimals));
  const whole = amount.div(divisor);
  const remainder = amount.mod(divisor);
  return `${whole.toString()}.${remainder.toString().padStart(decimals, '0')}`;
}
```

**Source:** User-provided on-chain integration requirements

### Pitfall 3: BPD Window Blocking Unstake

**What goes wrong:** User tries to unstake during Big Pay Day calculation window, transaction fails with `UnstakeBlockedDuringBpd` error.

**Why it happens:** `global_state.reserved[0] !== 0` when BPD is being finalized. Frontend doesn't check before building transaction.

**How to avoid:** Check `globalState.reserved[0]` in UI, disable unstake button, show explanation message.

**Warning signs:** Users report "transaction failed" during specific time windows.

**Example:**

```tsx
// components/stake/stake-card.tsx
import { useGlobalState } from "@/lib/hooks/useGlobalState";

export function StakeCard({ stake }) {
  const globalState = useGlobalState();
  const isBpdWindowActive = globalState.data?.reserved[0] !== 0;

  return (
    <div>
      <button
        onClick={handleUnstake}
        disabled={isBpdWindowActive}
      >
        End Stake
      </button>
      {isBpdWindowActive && (
        <p className="text-yellow-500">
          Unstaking is temporarily unavailable during Big Pay Day calculation.
          This ensures accurate bonus distribution. Please try again in a few minutes.
        </p>
      )}
    </div>
  );
}
```

**Source:** User-provided on-chain integration requirements + program code analysis

### Pitfall 4: Token-2022 vs Legacy SPL Token

**What goes wrong:** Using `TOKEN_PROGRAM_ID` instead of `TOKEN_2022_PROGRAM_ID` causes transaction to fail.

**Why it happens:** Muscle memory from older Solana tutorials. Program uses Token-2022, not legacy token.

**How to avoid:** Always import `TOKEN_2022_PROGRAM_ID` from `@solana/spl-token`, never use `TOKEN_PROGRAM_ID`.

**Warning signs:** All token operations fail with "invalid program" error.

**Example:**

```ts
// ❌ WRONG
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";

// ✅ CORRECT
import { TOKEN_2022_PROGRAM_ID } from "@solana/spl-token";
import { getAssociatedTokenAddress } from "@solana/spl-token";

const userTokenAccount = await getAssociatedTokenAddress(
  mintPda,
  publicKey,
  false,
  TOKEN_2022_PROGRAM_ID // Must specify Token-2022
);
```

**Source:** User-provided on-chain integration requirements + program code analysis

### Pitfall 5: getProgramAccounts Performance

**What goes wrong:** `getProgramAccounts` without filters returns ALL program accounts, causes timeout or RPC rate limiting.

**Why it happens:** Not using `memcmp` filter on user pubkey.

**How to avoid:** Always filter by user pubkey at offset 8 (after discriminator). Use `dataSlice` if only partial data needed.

**Warning signs:** Slow initial load, RPC errors, high Helius usage.

**Example:**

```ts
// ❌ WRONG - fetches ALL stakes from program
const accounts = await program.account.stakeAccount.all();

// ✅ CORRECT - filter by user
const accounts = await program.account.stakeAccount.all([
  {
    memcmp: {
      offset: 8, // Skip 8-byte discriminator
      bytes: publicKey.toBase58(),
    },
  },
]);
```

**Sources:**
- [Solana Cookbook - Get Program Accounts](https://solanacookbook.com/guides/get-program-accounts.html)
- [Helius - Faster getProgramAccounts](https://www.helius.dev/blog/faster-getprogramaccounts)

### Pitfall 6: WebSocket Reliability

**What goes wrong:** WebSocket subscriptions silently drop, cache never invalidates, user sees stale data.

**Why it happens:** WebSockets are brittle over long connections. Network blips, RPC restarts, client tab backgrounding.

**How to avoid:** Combine WebSockets (for instant updates) with periodic refetching (fallback). Use React Query `refetchInterval` or `refetchOnWindowFocus`.

**Warning signs:** Data updates only after page refresh, not in real-time.

**Example:**

```tsx
// lib/hooks/useGlobalState.ts
export function useGlobalState() {
  const query = useQuery({
    queryKey: ["globalState"],
    queryFn: fetchGlobalState,
    staleTime: 30_000,
    refetchInterval: 60_000, // Fallback: poll every 60s
    refetchOnWindowFocus: true, // Refetch on tab focus
  });

  // WebSocket for instant updates (best-effort)
  useEffect(() => {
    const subscriptionId = connection.onAccountChange(
      globalStatePda,
      () => queryClient.invalidateQueries({ queryKey: ["globalState"] }),
      "confirmed"
    );
    return () => connection.removeAccountChangeListener(subscriptionId);
  }, []);

  return query;
}
```

**Source:** [Helius WebSocket caveats](https://www.helius.dev/blog/solana-data-streaming) - "WebSockets are quite brittle and unreliable in practice"

## Code Examples

Verified patterns from official sources and program analysis:

### Match On-Chain Math (TypeScript Versions)

The frontend must replicate on-chain calculations for penalty preview and T-share estimation. Use identical formulas to avoid user confusion.

```ts
// lib/solana/math.ts
import BN from "bn.js";

export const PRECISION = new BN(1_000_000_000); // 1e9
export const LPB_MAX_DAYS = new BN(3641);
export const BPB_THRESHOLD = new BN("15000000000000000"); // 150M tokens (8 decimals)
export const BPS_SCALER = new BN(10_000);
export const MIN_PENALTY_BPS = new BN(5000); // 50%
export const GRACE_PERIOD_DAYS = new BN(14);
export const LATE_PENALTY_WINDOW_DAYS = new BN(351);

/**
 * Calculate Duration Bonus (LPB)
 * Mirrors programs/helix-staking/src/instructions/math.rs::calculate_lpb_bonus
 */
export function calculateLpbBonus(stakeDays: BN): BN {
  if (stakeDays.isZero()) return new BN(0);
  if (stakeDays.gte(LPB_MAX_DAYS)) return PRECISION.mul(new BN(2)); // Exactly 2x

  // Formula: (days - 1) * 2 * PRECISION / LPB_MAX_DAYS
  const daysMinusOne = stakeDays.sub(new BN(1));
  const numerator = daysMinusOne.mul(new BN(2)).mul(PRECISION);
  return numerator.div(LPB_MAX_DAYS);
}

/**
 * Calculate Size Bonus (BPB)
 * Mirrors programs/helix-staking/src/instructions/math.rs::calculate_bpb_bonus
 */
export function calculateBpbBonus(stakedAmount: BN): BN {
  if (stakedAmount.isZero()) return new BN(0);

  const amountDiv10 = stakedAmount.div(new BN(10));
  if (amountDiv10.gte(BPB_THRESHOLD)) return PRECISION; // Exactly 100% (1x)

  // Formula: (amount / 10) * PRECISION / BPB_THRESHOLD
  return amountDiv10.mul(PRECISION).div(BPB_THRESHOLD);
}

/**
 * Calculate T-Shares
 * Mirrors programs/helix-staking/src/instructions/math.rs::calculate_t_shares
 */
export function calculateTShares(
  stakedAmount: BN,
  stakeDays: BN,
  shareRate: BN
): BN {
  const lpbBonus = calculateLpbBonus(stakeDays);
  const bpbBonus = calculateBpbBonus(stakedAmount);

  // total_multiplier = PRECISION + lpb + bpb
  const totalMultiplier = PRECISION.add(lpbBonus).add(bpbBonus);

  // t_shares = staked_amount * total_multiplier / share_rate
  return stakedAmount.mul(totalMultiplier).div(shareRate);
}

/**
 * Calculate early unstake penalty
 * Mirrors programs/helix-staking/src/instructions/math.rs::calculate_early_penalty
 */
export function calculateEarlyPenalty(
  stakedAmount: BN,
  startSlot: BN,
  currentSlot: BN,
  endSlot: BN
): BN {
  if (currentSlot.gte(endSlot)) return new BN(0);

  const totalDuration = endSlot.sub(startSlot);
  const elapsed = currentSlot.sub(startSlot);
  const remaining = totalDuration.sub(elapsed);

  // penalty_bps = MIN_PENALTY_BPS + (remaining * (BPS_SCALER - MIN_PENALTY_BPS) / total_duration)
  const variablePenalty = remaining.mul(BPS_SCALER.sub(MIN_PENALTY_BPS)).div(totalDuration);
  const penaltyBps = MIN_PENALTY_BPS.add(variablePenalty);

  // Round up: (staked * penalty_bps + BPS_SCALER - 1) / BPS_SCALER
  const numerator = stakedAmount.mul(penaltyBps).add(BPS_SCALER.sub(new BN(1)));
  return numerator.div(BPS_SCALER);
}

/**
 * Calculate late unstake penalty
 * Mirrors programs/helix-staking/src/instructions/math.rs::calculate_late_penalty
 */
export function calculateLatePenalty(
  stakedAmount: BN,
  endSlot: BN,
  currentSlot: BN,
  slotsPerDay: BN
): BN {
  const graceEndSlot = endSlot.add(GRACE_PERIOD_DAYS.mul(slotsPerDay));
  if (currentSlot.lte(graceEndSlot)) return new BN(0); // In grace period

  const slotsLate = currentSlot.sub(graceEndSlot);
  const daysLate = slotsLate.div(slotsPerDay);

  if (daysLate.gte(LATE_PENALTY_WINDOW_DAYS)) {
    return stakedAmount; // 100% penalty
  }

  // penalty_bps = days_late * BPS_SCALER / LATE_PENALTY_WINDOW_DAYS
  const penaltyBps = daysLate.mul(BPS_SCALER).div(LATE_PENALTY_WINDOW_DAYS);

  // Round up
  const numerator = stakedAmount.mul(penaltyBps).add(BPS_SCALER.sub(new BN(1)));
  return numerator.div(BPS_SCALER);
}
```

**Source:** `/Users/annon/projects/solhex/programs/helix-staking/src/instructions/math.rs`

### PDA Derivation Helpers

```ts
// lib/solana/pdas.ts
import { PublicKey } from "@solana/web3.js";
import { PROGRAM_ID } from "./program";

export const GLOBAL_STATE_SEED = Buffer.from("global_state");
export const MINT_AUTHORITY_SEED = Buffer.from("mint_authority");
export const MINT_SEED = Buffer.from("helix_mint");
export const STAKE_SEED = Buffer.from("stake");
export const CLAIM_CONFIG_SEED = Buffer.from("claim_config");
export const CLAIM_STATUS_SEED = Buffer.from("claim_status");

export function deriveGlobalState(): [PublicKey, number] {
  return PublicKey.findProgramAddressSync([GLOBAL_STATE_SEED], PROGRAM_ID);
}

export function deriveMintAuthority(): [PublicKey, number] {
  return PublicKey.findProgramAddressSync([MINT_AUTHORITY_SEED], PROGRAM_ID);
}

export function deriveMint(): [PublicKey, number] {
  return PublicKey.findProgramAddressSync([MINT_SEED], PROGRAM_ID);
}

export function deriveStakeAccount(
  user: PublicKey,
  stakeId: number
): [PublicKey, number] {
  const stakeIdBuffer = Buffer.alloc(8);
  stakeIdBuffer.writeBigUInt64LE(BigInt(stakeId));

  return PublicKey.findProgramAddressSync(
    [STAKE_SEED, user.toBuffer(), stakeIdBuffer],
    PROGRAM_ID
  );
}

export function deriveClaimConfig(): [PublicKey, number] {
  return PublicKey.findProgramAddressSync([CLAIM_CONFIG_SEED], PROGRAM_ID);
}

export function deriveClaimStatus(
  merkleRootPrefix: Buffer,
  snapshotWallet: PublicKey
): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [CLAIM_STATUS_SEED, merkleRootPrefix, snapshotWallet.toBuffer()],
    PROGRAM_ID
  );
}
```

**Source:** Program seed constants + test suite patterns

### Format Token Amounts for Display

```ts
// lib/utils/format.ts
import BN from "bn.js";

const DECIMALS = 8;
const DIVISOR = new BN(10).pow(new BN(DECIMALS));

/**
 * Format token amount (base units) for display
 * Example: 100_000_000 -> "1.00000000 HELIX"
 */
export function formatHelix(amount: BN, showSymbol = true): string {
  const whole = amount.div(DIVISOR);
  const remainder = amount.mod(DIVISOR);
  const decimal = remainder.toString().padStart(DECIMALS, "0");

  const formatted = `${whole.toString()}.${decimal}`;
  return showSymbol ? `${formatted} HELIX` : formatted;
}

/**
 * Parse user input (decimal string) to base units
 * Example: "1.5" -> BN(150_000_000)
 */
export function parseHelix(input: string): BN {
  const [whole = "0", decimal = ""] = input.split(".");
  const paddedDecimal = decimal.padEnd(DECIMALS, "0").slice(0, DECIMALS);
  const combined = whole + paddedDecimal;
  return new BN(combined);
}

/**
 * Format percentage (basis points to %)
 * Example: 5000 -> "50.00%"
 */
export function formatBps(bps: number): string {
  return (bps / 100).toFixed(2) + "%";
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Tailwind v3 CSS-in-JS config | Tailwind v4 CSS-first @theme | Jan 2026 (v4 release) | Config moved to CSS file, improved VS Code color picker support |
| @solana/web3.js v2 | @solana/web3.js v1 for Anchor | Ongoing (Anchor 0.31.1) | v2 incompatible with Anchor TS client, must use v1 |
| Standard WebSockets | Enhanced WebSockets (Helius) | 2025-2026 | Better filters (50k addresses), faster, Geyser-backed |
| next-themes v0.2 | next-themes v0.3+ | 2025 | Better App Router support, forcedTheme prop |
| React Query v4 | React Query v5 | 2023-2024 | useSyncExternalStore, simplified optimistic updates via mutation.variables |
| Zustand v4 | Zustand v5 | 2024-2025 | useSyncExternalStore, 30% performance improvement |

**Deprecated/outdated:**
- **Pages Router for new projects:** App Router is standard for Next.js 14+. Use `app/` directory.
- **Global CSS imports in components:** Tailwind v4 uses CSS-first config. Import in root layout only.
- **@solana/spl-token without specifying Token-2022:** Legacy token vs Token-2022 is explicit. Always pass `TOKEN_2022_PROGRAM_ID`.
- **Manual polling for on-chain updates:** Use React Query + WebSocket invalidation pattern.

## Open Questions

1. **Priority fee estimation for transactions**
   - What we know: Solana priority fees improve transaction landing rate. Helius has fee estimation API.
   - What's unclear: Best UX pattern (auto-calculate vs user slider), recommended starting value for staking protocol.
   - Recommendation: Start with fixed priority fee (0.000001 SOL), add dynamic estimation in Phase 5+ if users report failed transactions. User has discretion over approach.

2. **Mobile responsiveness breakpoints**
   - What we know: Tailwind default breakpoints (sm: 640px, md: 768px, lg: 1024px, xl: 1280px).
   - What's unclear: Specific mobile layouts for 3-step wizard on small screens.
   - Recommendation: Use Tailwind responsive classes, test on common viewports (375px iPhone, 768px iPad). User has discretion.

3. **Loading skeleton granularity**
   - What we know: React Query `isLoading` state available, shadcn/ui Skeleton component exists.
   - What's unclear: Skeleton UI detail level (card-level vs field-level).
   - Recommendation: Card-level skeletons for initial implementation (faster to build), refine in Phase 5+ based on user feedback. User has discretion.

4. **Error recovery flow specifics**
   - What we know: Sentry captures errors, React Query has `onError` callbacks.
   - What's unclear: Exact error messages and recovery actions for each error type.
   - Recommendation: Display generic "Transaction failed, please try again" with error details in console. Iterate based on Sentry logs. User has discretion over messaging.

## Sources

### Primary (HIGH confidence)

- [Next.js 14 CSP Guide](https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/content-security-policy.mdx) - Middleware CSP implementation
- [TanStack Query v5 Docs](https://github.com/tanstack/query/blob/main/docs/framework/react/quick-start.md) - Query setup, cache invalidation
- [TanStack Query llms.txt](https://context7.com/tanstack/query/llms.txt) - Optimistic updates, cache management
- [Solana Wallet Adapter Next.js Guide](https://solana.com/docs/frontend/nextjs-solana) - Official integration patterns
- [Helix Staking Program Source](file:///Users/annon/projects/solhex/programs/helix-staking/src) - Math formulas, constants, state structures
- [Anchor TypeScript Client Docs](https://www.anchor-lang.com/docs/clients/typescript) - Generated client usage

### Secondary (MEDIUM confidence)

- [Solana Cookbook - getProgramAccounts](https://solanacookbook.com/guides/get-program-accounts.html) - memcmp filter patterns
- [Helius - Faster getProgramAccounts](https://www.helius.dev/blog/faster-getprogramaccounts) - Performance optimization
- [Helius WebSocket Docs](https://www.helius.dev/docs/rpc/websocket) - onAccountChange subscriptions
- [shadcn/ui Theming](https://ui.shadcn.com/docs/theming) - Dark mode setup
- [Zustand v5 Guide](https://jsdev.space/howto/zustand5-react/) - State management patterns
- [Blueshift - Error Handling in Wallet Adapter](https://learn.blueshift.gg/en/courses/mobile-dapp-fundamentals/error-handling) - Transaction simulation errors

### Tertiary (LOW confidence)

- WebSearch results for "Anchor getProgramAccounts patterns 2026" - Community usage examples (verify against official docs)
- WebSearch results for "Tailwind v4 shadcn setup 2026" - Recent migration guides (cross-check with official shadcn docs)

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - User decisions lock all major dependencies with version constraints
- Architecture: HIGH - Official Next.js App Router patterns + Solana wallet adapter official docs
- On-chain integration: HIGH - Direct program source code analysis + user-provided critical details
- Pitfalls: MEDIUM-HIGH - Mix of user-provided warnings (HIGH) and ecosystem best practices (MEDIUM)
- Math formulas: HIGH - Exact match with on-chain Rust code

**Research date:** 2026-02-08
**Valid until:** 30 days (standard stack stable, but Tailwind v4 and React Query patterns evolving)

**Notes for planner:**
- User has made extensive architecture decisions that constrain implementation. Focus planning on task breakdown, not technology selection.
- Critical security requirements (CSP, simulation, version pinning) must appear in verification steps.
- Match on-chain math exactly - use provided TypeScript formulas in planning docs.
- Phase 8 handles testing - Phase 4 tasks should focus on functional implementation.
