---
phase: 04-staking-dashboard
plan: 01
subsystem: ui
tags: [nextjs, solana, wallet-adapter, tailwind, shadcn, csp, rpc-proxy, anchor]

# Dependency graph
requires:
  - phase: 03.3-post-audit-security-hardening
    provides: "Secure on-chain program with IDL and types"
provides:
  - "Next.js 14 App Router scaffold with dark theme"
  - "Solana wallet connection (Phantom, Solflare) with autoConnect=false"
  - "CSP middleware with nonce and security headers"
  - "RPC proxy at /api/rpc protecting Helius API key"
  - "shadcn/ui component library (Button, Card, Dialog, Tooltip, Toast, Skeleton, Input, Slider, Checkbox)"
  - "Typed Program<HelixStaking> singleton with read-only mode"
  - "PDA derivation helpers for all program accounts"
  - "On-chain constants matching programs/helix-staking/src/constants.rs"
affects: [04-02, 04-03, 04-04, 04-05]

# Tech tracking
tech-stack:
  added: [next@14, react@18, tailwindcss, "@solana/web3.js@1.95.8", "@coral-xyz/anchor@0.31.1", "bn.js@5.2.1", "@solana/wallet-adapter-*", "@tanstack/react-query@5", "zustand@5", "sonner", "next-themes", "class-variance-authority", "lucide-react", "@radix-ui/react-*"]
  patterns: ["App Router with server/client component split", "ConnectionProvider > WalletProvider > QueryClientProvider hierarchy", "shadcn/ui copy-paste components with cn() utility", "RPC proxy pattern for API key protection", "CSP nonce per request via middleware"]

key-files:
  created:
    - app/web/package.json
    - app/web/app/providers.tsx
    - app/web/app/layout.tsx
    - app/web/app/page.tsx
    - app/web/middleware.ts
    - app/web/app/api/rpc/route.ts
    - app/web/lib/solana/constants.ts
    - app/web/lib/solana/program.ts
    - app/web/lib/solana/pdas.ts
    - app/web/components/wallet/wallet-button.tsx
    - app/web/public/idl/helix_staking.json
    - app/web/types/program.ts
  modified: []

key-decisions:
  - "Used --legacy-peer-deps for npm install due to @solana/wallet-adapter-base requiring @solana/web3.js ^1.98.0 while plan pins 1.95.8"
  - "ConnectionProvider endpoint uses window.location.origin for browser, https://localhost fallback for SSR/build prerender"
  - "QueryClient singleton instantiated outside component to prevent re-creation on re-renders"
  - "Toaster uses sonner directly rather than building custom toast system"
  - "class-variance-authority (cva) added for Button variant management following shadcn/ui pattern"

patterns-established:
  - "Provider hierarchy: Connection > Wallet > Modal > Query > Theme > Tooltip"
  - "cn() utility for Tailwind class merging in all components"
  - "Dark-mode-only theme: forcedTheme='dark', no light mode variants"
  - "getProgram(connection, wallet?) returns typed Program<HelixStaking>"
  - "PDA derive functions return [PublicKey, number] tuples"
  - "LABELS constant object maps on-chain names to user-facing display names"

# Metrics
duration: 8min
completed: 2026-02-08
---

# Phase 4 Plan 1: Scaffold and Wallet Integration Summary

**Next.js 14 App Router with Solana wallet adapter, CSP middleware, RPC proxy, 10 shadcn/ui components, typed Anchor program singleton, and PDA helpers**

## Performance

- **Duration:** 8 min
- **Started:** 2026-02-08T05:31:17Z
- **Completed:** 2026-02-08T05:39:40Z
- **Tasks:** 2
- **Files modified:** 32

## Accomplishments
- Complete Next.js 14 App Router project scaffold with dark-mode-only Tailwind theme
- Wallet connection via Phantom and Solflare with autoConnect=false security requirement
- CSP middleware generating per-request nonce, X-Frame-Options DENY, and nosniff headers
- RPC proxy at /api/rpc forwarding to Helius with server-side API key
- 10 shadcn/ui component primitives ready for composition in dashboard plans
- Typed Program<HelixStaking> singleton with IDL copied from Anchor build output
- 6 PDA derivation helpers matching on-chain program seeds
- On-chain constants (PRECISION, BPB_THRESHOLD, seeds, etc.) mirroring constants.rs

## Task Commits

Each task was committed atomically:

1. **Task 1: Scaffold Next.js project with Solana providers, wallet connection, CSP, and RPC proxy** - `030acb9` (feat)
2. **Task 2: UI primitives, wallet button, Solana constants, IDL, and PDA helpers** - `09eba84` (feat)

## Files Created/Modified

- `app/web/package.json` - Project manifest with pinned Solana package versions
- `app/web/tsconfig.json` - TypeScript config with @/ path alias
- `app/web/tailwind.config.ts` - Dark theme with HELIX brand palette (helix green, accent blue, penalty red)
- `app/web/postcss.config.mjs` - PostCSS with Tailwind and autoprefixer
- `app/web/next.config.mjs` - Webpack config for Node.js polyfill fallbacks
- `app/web/middleware.ts` - CSP headers with nonce, X-Frame-Options DENY, nosniff
- `app/web/app/globals.css` - Tailwind directives, CSS variables for shadcn/ui, wallet adapter overrides
- `app/web/app/layout.tsx` - Root layout with Inter font, metadata, Providers wrapper
- `app/web/app/providers.tsx` - Provider hierarchy (Connection > Wallet > Modal > Query > Theme > Tooltip)
- `app/web/app/page.tsx` - Home page with HELIX branding and wallet connect prompt
- `app/web/app/api/rpc/route.ts` - RPC proxy forwarding JSON-RPC to Helius
- `app/web/lib/cn.ts` - clsx + tailwind-merge utility
- `app/web/components/ui/button.tsx` - Button with 5 variants and 4 sizes
- `app/web/components/ui/card.tsx` - Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter
- `app/web/components/ui/dialog.tsx` - Dialog with overlay, content, header, footer, title, description
- `app/web/components/ui/tooltip.tsx` - Tooltip with TooltipProvider for educational jargon tooltips
- `app/web/components/ui/toast.tsx` - Toast re-export from sonner
- `app/web/components/ui/toaster.tsx` - Toaster component with dark theme styling
- `app/web/components/ui/skeleton.tsx` - Skeleton loading component
- `app/web/components/ui/input.tsx` - Input with dark mode styling
- `app/web/components/ui/slider.tsx` - Radix slider for duration picker
- `app/web/components/ui/checkbox.tsx` - Radix checkbox for penalty confirmation
- `app/web/components/wallet/wallet-button.tsx` - Wallet connect/disconnect button with truncated address
- `app/web/lib/solana/constants.ts` - On-chain constants, PDA seeds, display labels
- `app/web/lib/solana/program.ts` - Typed Program<HelixStaking> singleton with read-only mode
- `app/web/lib/solana/pdas.ts` - 6 PDA derivation helpers
- `app/web/public/idl/helix_staking.json` - Anchor IDL (copied from target/idl/)
- `app/web/types/program.ts` - TypeScript types (copied from target/types/)
- `app/web/.env.local.example` - Environment variable template
- `app/web/.gitignore` - Git ignore for node_modules, .next, .env.local
- `app/web/.npmrc` - legacy-peer-deps=true for Solana package compatibility

## Decisions Made

- **legacy-peer-deps:** Required because @solana/wallet-adapter-base@0.9.27 peers on @solana/web3.js@^1.98.0, but the plan pins 1.95.8 for security. Persisted via .npmrc.
- **SSR endpoint fix:** ConnectionProvider requires absolute URL. Used window.location.origin in browser with https://localhost fallback during build prerender to prevent TypeError.
- **class-variance-authority:** Added for Button variant management (standard shadcn/ui pattern, not in original plan but required for the component pattern).
- **lucide-react:** Added for icon support (standard shadcn/ui companion library).

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Fixed ConnectionProvider endpoint URL for SSR**
- **Found during:** Task 1 (next build verification)
- **Issue:** ConnectionProvider validates URL format and rejects relative `/api/rpc` during SSR/build prerender (no window.location available)
- **Fix:** Created getRpcEndpoint() that uses window.location.origin in browser, https://localhost fallback during SSR
- **Files modified:** app/web/app/providers.tsx
- **Verification:** `next build` succeeds with static prerendering
- **Committed in:** 030acb9 (Task 1 commit)

**2. [Rule 3 - Blocking] Added --legacy-peer-deps for npm install**
- **Found during:** Task 1 (npm install)
- **Issue:** @solana/wallet-adapter-base@0.9.27 requires @solana/web3.js@^1.98.0, conflicting with pinned 1.95.8
- **Fix:** Used --legacy-peer-deps flag and persisted in .npmrc
- **Files modified:** app/web/.npmrc
- **Verification:** npm install completes, build succeeds, wallet adapter functions correctly
- **Committed in:** 030acb9 (Task 1 commit)

---

**Total deviations:** 2 auto-fixed (2 blocking issues)
**Impact on plan:** Both auto-fixes necessary to unblock installation and build. No scope creep.

## Issues Encountered

- pino-pretty module warning during build (from WalletConnect dependency chain) - cosmetic only, does not affect functionality
- bigint binding warning during prerender - pure JS fallback used automatically, no impact

## Next Phase Readiness

- App shell complete: all subsequent plans (04-02 through 04-05) can import from established providers, constants, and component library
- Wallet connection functional: plans can build wallet-dependent features
- Program singleton ready: plans can fetch on-chain state via getProgram()
- PDA helpers ready: plans can derive any program account address
- Component library ready: plans can compose UI from shadcn/ui primitives

---
*Phase: 04-staking-dashboard*
*Completed: 2026-02-08*
