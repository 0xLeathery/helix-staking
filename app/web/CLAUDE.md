# Helix Frontend

Next.js 14 dashboard with Solana wallet-adapter, React Query, Zustand, and shadcn/ui.

## Structure

- `lib/solana/math.ts` — Protocol math (must match `programs/helix-staking/src/instructions/math.rs` exactly)
- `lib/solana/constants.ts` — Protocol constants (must match `src/constants.rs`)
- `lib/hooks/` — One React Query mutation hook per instruction (`useCreateStake`, `useUnstake`, etc.)
- `public/idl/helix_staking.json` — Program IDL (regenerate with `anchor build`)

## Rules

- Use `@solana/web3.js` v1 (1.95.x) — NOT v2
- All hooks must simulate transactions before sending
- RPC calls go through `/api/rpc` proxy in production
- Token amounts use 8 decimals — display formatting converts from base units
- Use BN.js for all on-chain math, never native JS numbers

## Commands

```bash
npm run dev          # Dev server
npx playwright test  # E2E tests
```
