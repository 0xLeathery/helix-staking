---
estimated_steps: 7
estimated_files: 5
---

# T01: Extract Explorer utility and create ExplorerLink component with tests

**Slice:** S09 — LP Stats, Docs & Transparency
**Milestone:** M001

## Description

Extract the cluster-aware Explorer URL logic from `footer.tsx` into a shared utility module (`lib/utils/explorer.ts`) and create a reusable `ExplorerLink` React component. This is the foundation task — every other task in S09 depends on these two artifacts.

The existing `footer.tsx` has `getCluster()` (reads `NEXT_PUBLIC_RPC_URL` to detect devnet vs mainnet) and `getExplorerUrl(address)` (builds Solana Explorer address URLs). These need to be extracted and extended with tx and token URL variants.

**Relevant skill:** `frontend-design` — for the ExplorerLink component styling. Match the existing zinc color palette and helix accent colors used throughout the app.

## Steps

1. **Create `app/web/lib/utils/explorer.ts`** with these exports:
   - `getCluster(): "mainnet-beta" | "devnet"` — reads `process.env.NEXT_PUBLIC_RPC_URL`, returns "devnet" if URL contains "devnet", else "mainnet-beta"
   - `getExplorerUrl(address: string): string` — `https://explorer.solana.com/address/${address}${suffix}`
   - `getExplorerTxUrl(signature: string): string` — `https://explorer.solana.com/tx/${signature}${suffix}`
   - `getExplorerTokenUrl(mint: string): string` — `https://explorer.solana.com/address/${mint}${suffix}` (same as address but semantically named)
   - Where `suffix = cluster === "devnet" ? "?cluster=devnet" : ""`

2. **Create `app/web/__tests__/lib/explorer.test.ts`** with tests:
   - `getCluster` returns "devnet" when `NEXT_PUBLIC_RPC_URL` contains "devnet"
   - `getCluster` returns "mainnet-beta" when `NEXT_PUBLIC_RPC_URL` is mainnet URL
   - `getCluster` returns "mainnet-beta" when `NEXT_PUBLIC_RPC_URL` is empty/undefined
   - `getExplorerUrl` returns correct URL with `?cluster=devnet` suffix for devnet
   - `getExplorerUrl` returns correct URL without suffix for mainnet
   - `getExplorerTxUrl` returns correct tx URL for devnet/mainnet
   - `getExplorerTokenUrl` returns correct token URL
   - Use `vi.stubEnv('NEXT_PUBLIC_RPC_URL', ...)` to control env in tests

3. **Create `app/web/components/ui/explorer-link.tsx`** — a `"use client"` component:
   - Props: `type: "address" | "tx" | "token"`, `value: string`, `label?: string`, `className?: string`, `truncate?: boolean` (default true)
   - Computes href using the appropriate `getExplorer*Url` function
   - Renders an `<a>` tag with `target="_blank" rel="noopener noreferrer"`
   - Shows truncated value by default (first 4 + last 4 chars with `…`) or custom label
   - Includes an `ExternalLink` icon from `lucide-react` (already installed in the project)
   - Styling: `text-helix-400 hover:text-helix-300 font-mono text-sm inline-flex items-center gap-1`
   - When `truncate={false}`, shows the full value

4. **Create `app/web/__tests__/components/explorer-link.test.tsx`** with tests:
   - Renders with correct href for type="address"
   - Renders with correct href for type="tx"
   - Renders with correct href for type="token"
   - Truncates value by default (shows first 4 + last 4)
   - Shows full value when truncate={false}
   - Renders custom label when provided
   - Has `target="_blank"` and `rel="noopener noreferrer"`
   - Renders ExternalLink icon

5. **Update `app/web/components/marketing/footer.tsx`**:
   - Remove local `getCluster()` and `getExplorerUrl()` functions
   - Import from `@/lib/utils/explorer`
   - Ensure the `PROGRAM_ID` constant stays in footer.tsx (it's only used there)
   - Verify the footer still renders the same Explorer link

## Must-Haves

- [ ] `getCluster()` detects devnet from `NEXT_PUBLIC_RPC_URL` exactly like footer.tsx does
- [ ] Three URL generation functions exported: `getExplorerUrl`, `getExplorerTxUrl`, `getExplorerTokenUrl`
- [ ] `ExplorerLink` component accepts type, value, label props and renders correct href
- [ ] `ExplorerLink` truncates address/signature display by default
- [ ] `ExplorerLink` has external link icon and opens in new tab
- [ ] `footer.tsx` updated to use shared utility (no duplicate logic)
- [ ] All new tests pass
- [ ] `npx tsc --noEmit` shows no new type errors

## Verification

- `cd app/web && npx vitest run __tests__/lib/explorer.test.ts __tests__/components/explorer-link.test.tsx` — all pass
- `cd app/web && npx tsc --noEmit` — no new type errors (pre-existing test TS errors acceptable)
- `grep -n "getCluster\|getExplorerUrl" app/web/components/marketing/footer.tsx` — shows imports from `@/lib/utils/explorer`, not local function definitions

## Inputs

- `app/web/components/marketing/footer.tsx` — contains the existing `getCluster()` and `getExplorerUrl()` functions to extract (lines 10-21)
- Existing `truncateAddress` utility in `app/web/lib/utils/format.ts` — may be reusable for the ExplorerLink truncation display (check before writing a new one)
- `lucide-react` is already installed — use `ExternalLink` icon from it

## Observability Impact

- **Signals changed:** Explorer URLs are now generated from a single shared utility (`lib/utils/explorer.ts`). Cluster detection (devnet vs mainnet) flows through `getCluster()` — a future agent can verify active cluster by checking `process.env.NEXT_PUBLIC_RPC_URL`.
- **Inspection:** `grep -rn "getExplorerUrl\|getExplorerTxUrl\|getExplorerTokenUrl" app/web/ --include="*.ts" --include="*.tsx" | grep -v node_modules` shows all Explorer link consumers. All should import from `@/lib/utils/explorer`.
- **Failure visibility:** If `NEXT_PUBLIC_RPC_URL` is misconfigured, Explorer links default to mainnet (safe fallback). No runtime errors — just potentially wrong cluster suffix.
- **Test coverage:** 10 unit tests for the utility, 8 render tests for the component (18 total).

## Expected Output

- `app/web/lib/utils/explorer.ts` — shared Explorer URL utility with 4 exported functions
- `app/web/components/ui/explorer-link.tsx` — reusable ExplorerLink component
- `app/web/__tests__/lib/explorer.test.ts` — utility unit tests
- `app/web/__tests__/components/explorer-link.test.tsx` — component render tests
- `app/web/components/marketing/footer.tsx` — modified to import from shared utility
