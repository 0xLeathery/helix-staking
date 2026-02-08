# Phase 06 Research: Analytics and Jupiter Integration

## Overview
This phase adds rich historical analytics and a swap interface to the HELIX dashboard. It leverages the indexer service (Phase 5) for data and Jupiter Terminal for the swap experience.

## Findings

### 1. Visualization Stack
- **Recommendation:** `recharts` (https://recharts.org/)
- **Why:** Responsive, declarative, and works well with Tailwind.
- **SSR Note:** Recharts components MUST be used inside `'use client'` components in Next.js App Router due to heavy use of browser APIs (SVG rendering).

### 2. Jupiter Integration
- **Recommendation:** `Jupiter Terminal` (V4)
- **Mode:** Widget Mode (standard for dashboard integrations).
- **Key Feature:** `enableWalletPassthrough: true`. This allows Jupiter to use the same wallet connection as the main dApp without a second login.
- **RPC Note:** Should use a dedicated RPC endpoint (not the default public one) to avoid rate limits during swaps.

### 3. Indexer API Requirements
The following new endpoints are needed in `services/indexer`:
- `GET /api/stats/history`: Returns time-series data for:
    - Share Rate (T-Share Price)
    - Total Staked HELIX
    - Daily Inflation Distributed
- `GET /api/stats/distribution/stakes`: Returns data for a histogram of stake durations and amounts.

### 4. Implementation Details
- **T-Share Price:** Calculated as `share_rate / 10000.0` (based on PRECISION in contract).
- **Supply Breakdown:**
    - Staked: Sum of all active `StakeAccount.amount`.
    - Liquid: Token-2022 Total Supply minus Staked.
    - Unclaimed: Total possible BPD pool minus already claimed.

## Pitfalls & Mitigation
- **Hydration Errors:** Use `dynamic(() => import('...'), { ssr: false })` for Recharts to avoid mismatch between server and client.
- **Data Freshness:** Indexer polling might be behind on-chain state. Display a "Last updated" timestamp based on the indexer's latest checkpoint.
- **Wallet Sync:** Ensure the wallet adapter from `@solana/wallet-adapter-react` is correctly passed to Jupiter Terminal.
