---
color: cyan
agent_name: Aki
---

# Frontend Config

## Next.js 14 dashboard configuration: webpack, middleware CSP, env vars, Tailwind theme, Playwright E2E, and provider stack

### next.config.mjs (`/app/web/next.config.mjs`)

Disables Node.js polyfills that Solana packages try to require in the browser:

```js
config.resolve.fallback = {
  crypto: false, stream: false, buffer: false,
  fs: false, path: false, os: false,
};
```

No other custom webpack config. No rewrites, redirects, or image optimization overrides.

### Environment Variables (`/app/web/.env.local`)

```
HELIUS_RPC_URL=https://api.devnet.solana.com
NEXT_PUBLIC_RPC_URL=https://api.devnet.solana.com
```

The `.env.local.example` template shows `HELIUS_RPC_URL=https://mainnet.helius-rpc.com/?api-key=YOUR_KEY` for production Helius usage.

Additional env vars used at runtime:
- `NEXT_PUBLIC_SKIP_WALLET_CHECK` -- set in Playwright E2E to bypass wallet-dependent UI gates
- `NEXT_PUBLIC_TEST_WALLET_SECRET` -- loaded by Playwright for E2E transaction tests
- `NEXT_PUBLIC_MERKLE_DATA_URL` -- CDN URL for Merkle proof data (free claim)

### Middleware (`/app/web/middleware.ts`)

Applies security headers on every non-static request:

- **CSP**: `script-src 'self' 'nonce-{uuid}' 'strict-dynamic'`, with `'unsafe-eval'` added only in dev mode
- **connect-src**: whitelists `*.helius-rpc.com` and `*.solana.com` (both HTTPS and WSS). Dev mode adds `localhost:*`.
- **X-Frame-Options**: `DENY`
- **X-Content-Type-Options**: `nosniff`
- **Referrer-Policy**: `strict-origin-when-cross-origin`

Nonce is propagated via `x-nonce` request header for downstream consumption by script tags.

Matcher excludes `_next/static`, `_next/image`, `favicon.ico`, and prefetch requests.

### Providers (`/app/web/app/providers.tsx`)

Provider stack (outermost to innermost):
1. `ConnectionProvider` -- endpoint resolves to `{origin}/api/rpc` in browser, `https://localhost/api/rpc` during SSR
2. `WalletProvider` -- `autoConnect` enabled, dynamically loads `TestWalletAdapter` when `NEXT_PUBLIC_TEST_WALLET_SECRET` is set
3. `WalletModalProvider`
4. `QueryClientProvider` -- singleton `QueryClient` with `staleTime: 15s`, `gcTime: 30s`, `retry: 3`
5. `ThemeProvider` -- forced dark mode (`forcedTheme="dark"`)
6. `TooltipProvider` -- 300ms delay

### Tailwind (`/app/web/tailwind.config.ts`)

Custom color palette:
- **helix**: Green scale (50-950) -- brand color based on emerald (#10b981 at 500)
- **accent**: Blue scale -- interactive elements (#3b82f6 at 500)
- **penalty**: Red scale -- penalty/destructive states (#ef4444 at 500)
- **surface**: Dark zinc backgrounds (DEFAULT=#18181b, raised=#27272a, overlay=#3f3f46)
- **border**: Zinc borders (DEFAULT=#3f3f46, subtle=#27272a)

Dark mode is class-based. Font family uses `--font-inter` CSS variable with system-ui fallback.

### Playwright (`/app/web/playwright.config.ts`)

```ts
testDir: './e2e'
timeout: 30_000          // 30s default
fullyParallel: true
retries: process.env.CI ? 2 : 0
workers: process.env.CI ? 1 : undefined
reporter: 'html'
```

Two project configurations:
1. **chromium** -- standard E2E tests, ignores `transactions/` directory
2. **transaction-tests** -- 90s timeout, sequential (`fullyParallel: false`), depends on chromium completing first

WebServer spins up `npm run dev` at `localhost:3000` with test-specific env vars injected (`NEXT_PUBLIC_SKIP_WALLET_CHECK`, `HELIUS_RPC_URL=http://localhost:8899`).

### Key Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `next` | ^14.2.0 | Framework |
| `@coral-xyz/anchor` | 0.31.1 | Program client (pinned exact) |
| `@solana/web3.js` | 1.95.8 | Solana SDK (pinned exact, v1 required) |
| `@tanstack/react-query` | ^5.0.0 | Data fetching/caching |
| `zustand` | ^5.0.0 | Client state |
| `recharts` | ^2.15.0 | Analytics charts |
| `sonner` | ^1.7.0 | Toast notifications |
| `@radix-ui/*` | various | UI primitives (dialog, slider, checkbox, tooltip, progress) |
| `@playwright/test` | ^1.58.2 | E2E testing |

### Notable Gotchas

- **`--legacy-peer-deps` required**: Solana wallet adapter packages peer on newer `@solana/web3.js`, but Anchor 0.31 requires v1.x. Install with `npm install --legacy-peer-deps`.
- **CSP nonce per-request**: Each request gets a fresh `crypto.randomUUID()` nonce. If you add inline scripts, they must carry this nonce or they will be blocked.
- **`unsafe-eval` in dev only**: Next.js dev server uses eval for hot module replacement. Production builds must not have this.
- **RPC proxy pattern**: Browser hits `/api/rpc` (relative URL), not the RPC directly. This keeps the Helius API key server-side.
- **`@solana/web3.js` v1 locked**: Anchor TS client is incompatible with `@solana/web3.js` v2. Do not upgrade.
- **Dark mode forced**: `forcedTheme="dark"` means theme toggling does nothing. The entire UI is dark-only.
- **Playwright global setup/teardown**: Tests use `e2e/global-setup.ts` and `e2e/global-teardown.ts` for wallet provisioning.

[[config-and-deployment.md]]
