---
estimated_steps: 6
estimated_files: 5
---

# T02: Wire ExplorerLink into all on-chain action components

**Slice:** S09 — LP Stats, Docs & Transparency
**Milestone:** M001

## Description

Replace all hardcoded `?cluster=devnet` Explorer URLs and Solscan links across the codebase with the shared `ExplorerLink` component from T01. Add Explorer links to StakeCard and BoostStatusCard where none exist today. This closes TRUST-02 (every on-chain action links to Solana Explorer for independent verification).

There are exactly 4 files with hardcoded cluster strings to fix:
- `success-screen.tsx` — hardcoded `?cluster=devnet` Explorer URL for tx signature
- `badge-card.tsx` — Solscan link for claim signature
- `badge-celebration.tsx` — Solscan link for claim signature  
- `footer.tsx` — already fixed in T01 (uses shared utility)

Plus 2 files that need new Explorer links added:
- `stake-card.tsx` — needs Explorer link to stake PDA
- `boost-status-card.tsx` — needs Explorer link to BoostRecord PDA

## Steps

1. **Update `app/web/components/stake/stake-wizard/success-screen.tsx`**:
   - Import `ExplorerLink` from `@/components/ui/explorer-link`
   - Replace the hardcoded `<a href={\`https://explorer.solana.com/tx/${signature}?cluster=devnet\`}>` block (around line 86) with `<ExplorerLink type="tx" value={signature} />`
   - Keep the existing truncateAddress display — use `label={truncateAddress(signature)}` on ExplorerLink
   - Verify the surrounding layout (flex items-center justify-between) still works

2. **Update `app/web/components/badges/badge-card.tsx`**:
   - Import `ExplorerLink` from `@/components/ui/explorer-link`
   - Replace the Solscan link `<a href={\`https://solscan.io/tx/${claimSignature}?cluster=devnet\`}>` (around line 167) with `<ExplorerLink type="tx" value={claimSignature} label="View on Explorer" className="text-xs text-helix-400 hover:text-helix-300 underline underline-offset-2" />`
   - Match the existing styling — the current link uses `text-xs text-helix-400 hover:text-helix-300 underline underline-offset-2`

3. **Update `app/web/components/badges/badge-celebration.tsx`**:
   - Import `ExplorerLink` from `@/components/ui/explorer-link`
   - Find the Solscan URL construction (`const solscanUrl = \`https://solscan.io/tx/${signature}?cluster=devnet\``) and replace with the shared utility
   - Replace the `<a href={solscanUrl}>` with `<ExplorerLink type="tx" value={signature} label="View on Explorer" />`
   - Read the file first to find the exact location and surrounding context

4. **Update `app/web/components/stake/stake-card.tsx`**:
   - Import `ExplorerLink` from `@/components/ui/explorer-link`
   - The StakeCard receives stake account data. It should have access to the stake's public key or PDA address.
   - Read the file to find how stake data flows in — look for public key, address, or PDA references
   - Add an `ExplorerLink type="address"` showing the stake account's public key in the card header or metadata section
   - If the stake PDA isn't available in the current data model, add a note field or derive it — check how StakesList passes data to StakeCard

5. **Update `app/web/components/dashboard/boost-status-card.tsx`**:
   - Import `ExplorerLink` from `@/components/ui/explorer-link`
   - Import `deriveBoostRecord` from `@/lib/solana/pdas`
   - When BoostRecord exists (registered, active, or revoked states), show `<ExplorerLink type="address" value={boostRecordPda.toBase58()} />` in the card
   - The BoostRecord PDA can be derived from `useWallet().publicKey` using `deriveBoostRecord()`
   - Read the file first to understand the existing state machine and where to place the link

6. **Final verification sweep**:
   - Run `grep -rn "cluster=devnet" app/web/ --include="*.tsx" --include="*.ts" | grep -v explorer.ts | grep -v node_modules` — must return 0 matches
   - Run `grep -rn "solscan.io" app/web/ --include="*.tsx" --include="*.ts" | grep -v node_modules` — must return 0 matches
   - Run `cd app/web && npx vitest run` — all existing 237+ tests pass
   - Run `cd app/web && npx tsc --noEmit` — no new type errors

## Must-Haves

- [ ] `success-screen.tsx` uses `ExplorerLink` instead of hardcoded Explorer URL
- [ ] `badge-card.tsx` uses `ExplorerLink` instead of Solscan link
- [ ] `badge-celebration.tsx` uses `ExplorerLink` instead of Solscan link
- [ ] `stake-card.tsx` shows Explorer link for stake account PDA
- [ ] `boost-status-card.tsx` shows Explorer link for BoostRecord PDA
- [ ] Zero hardcoded `cluster=devnet` strings outside `explorer.ts`
- [ ] Zero `solscan.io` URLs remaining
- [ ] All existing tests still pass

## Verification

- `grep -rn "cluster=devnet" app/web/ --include="*.tsx" --include="*.ts" | grep -v explorer.ts | grep -v node_modules` — returns 0 matches
- `grep -rn "solscan.io" app/web/ --include="*.tsx" --include="*.ts" | grep -v node_modules` — returns 0 matches
- `cd app/web && npx vitest run` — all 237+ tests pass
- `cd app/web && npx tsc --noEmit` — no new type errors

## Inputs

- `app/web/lib/utils/explorer.ts` — shared Explorer URL utility (from T01)
- `app/web/components/ui/explorer-link.tsx` — reusable ExplorerLink component (from T01)
- T01 summary — confirms the component API (type, value, label, className, truncate props)

## Expected Output

- `app/web/components/stake/stake-wizard/success-screen.tsx` — uses ExplorerLink for tx
- `app/web/components/badges/badge-card.tsx` — uses ExplorerLink instead of Solscan
- `app/web/components/badges/badge-celebration.tsx` — uses ExplorerLink instead of Solscan
- `app/web/components/stake/stake-card.tsx` — new Explorer link for stake PDA
- `app/web/components/dashboard/boost-status-card.tsx` — new Explorer link for BoostRecord PDA

## Observability Impact

- **Signals changed:** All on-chain Explorer links now route through the shared `getExplorerUrl`/`getExplorerTxUrl` functions in `lib/utils/explorer.ts`. Cluster detection reads `NEXT_PUBLIC_RPC_URL` at call time. If Explorer links point to the wrong cluster, inspect this env var.
- **Inspection:** Run `grep -rn "ExplorerLink" app/web/components/ --include="*.tsx"` to list every component that renders an Explorer link. Each link should resolve to the correct cluster.
- **Failure visibility:** If `deriveBoostRecord` fails in `BoostStatusCard`, the component will throw a React error boundary — the PDA derivation call is synchronous and not guarded by try/catch. This is intentional: a broken PDA derivation indicates a configuration or code defect that should be caught in development.
- **Verification sweep:** `grep -rn "solscan.io\|cluster=devnet" app/web/ --include="*.tsx" --include="*.ts" | grep -v explorer.ts | grep -v node_modules | grep -v __tests__` — must return 0 matches.
