# S07: Crank Boost Monitoring

**Goal:** Add a 6-hour boost-check cron job to the existing crank service that sweeps all on-chain BoostRecord PDAs and calls `update_boost_status` for any active boosted stake where the owner's seed token balance dropped below their snapshot.
**Demo:** Add a 6-hour boost-check cron job to the existing crank service that sweeps all on-chain BoostRecord PDAs and calls `update_boost_status` for any active boosted stake where the owner's seed token balance dropped below their snapshot.

## Must-Haves


## Tasks

- [x] **T01: 25-crank-boost-monitoring 01** `est:7min`
  - Add a 6-hour boost-check cron job to the existing crank service that sweeps all on-chain BoostRecord PDAs and calls `update_boost_status` for any active boosted stake where the owner's seed token balance dropped below their snapshot.

Purpose: BOOST-08 requires proactive revocation so users see their revoked boost status in the dashboard within 6 hours, without needing to trigger a claim transaction. The on-chain `update_boost_status` instruction already exists and is fully tested (Phase 24). This plan adds the automated crank sweep that calls it.

Output: `services/crank/src/boostCheck.ts` with `executeBoostCheck()`, wired into `index.ts` via a 6-hour `node-cron` schedule. Plus an additional LiteSVM test for already-revoked idempotency.

## Files Likely Touched

- `services/crank/package.json`
- `services/crank/src/boostCheck.ts`
- `services/crank/src/env.ts`
- `services/crank/src/index.ts`
- `tests/litesvm/boost.test.ts`
