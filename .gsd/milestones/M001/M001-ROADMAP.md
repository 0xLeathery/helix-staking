# M001: Migration

**Vision:** A HEX-inspired time-locked staking protocol on Solana.

## Success Criteria


## Slices

- [x] **S01: Vercel Build Fix — webpack alias, env var docs, Fluid Compute verified** `risk:medium` `depends:[]`
  > After this: Frontend builds and runs on Vercel with Fluid Compute, webpack alias resolves @noble/hashes
- [x] **S02: Automated Crank Service — standalone service, Docker integration, RPC failover** `risk:medium` `depends:[S01]`
  > After this: Standalone crank service deployed with 4-cron scheduling, RPC failover, Docker Compose integration
- [x] **S03: Tokenomics Documentation — TOKENOMICS.md, sensitivity analysis, interactive calculator** `risk:medium` `depends:[S02]`
  > After this: Published TOKENOMICS.md with supply projections, penalty mechanics, risk scenarios, and interactive calculator
- [x] **S04: Production Runbook — 1,030 Line private ops doc with key mgmt, deployment, incident response** `risk:medium` `depends:[S03]`
  > After this: Private 1,030-line runbook covering key management, deployment procedures, and incident response
- [x] **S05: Communication Boost Rules** `risk:medium` `depends:[S04]`
  > After this: Create the `/seed` launch page with all content sections explaining the seed token purpose, LP funding model, boost eligibility, headroom/revocation mechanics, and SOL flow diagram.
- [x] **S06: Anchor Program Boost System** `risk:medium` `depends:[S05]`
  > After this: Create the foundation for the on-chain boost system: state account definitions, constants, error codes, events, math helpers, admin instructions, and GlobalState extension.
- [x] **S07: Crank Boost Monitoring** `risk:medium` `depends:[S06]`
  > After this: Add a 6-hour boost-check cron job to the existing crank service that sweeps all on-chain BoostRecord PDAs and calls `update_boost_status` for any active boosted stake where the owner's seed token balance dropped below their snapshot.
- [x] **S08: Frontend Boost Ui** `risk:medium` `depends:[S07]`
  > After this: Sync the web IDL with Phase 24 boost instructions, add boost utility functions (PDA derivation, math, seed balance hook), create the BoostBadge component, and integrate boost state + boosted APY display into StakeCard.
- [x] **S09: LP Stats, Docs & Transparency — LP pool stats widget, published end-to-end documentation, SOL flow dashboard, and on-chain Explorer links** `risk:medium` `depends:[S08]`
  > After this: LP pool stats visible on dashboard, all mechanics documented end-to-end, every on-chain action links to Solana Explorer, and SOL flow from seed to LP is publicly verifiable
