# Requirements: HELIX v3.0 — Seed Launch & LP Funding

**Defined:** 2026-03-04
**Core Value:** Committed stakers earn outsized rewards — conviction is rewarded, not just capital. Creator rewards from the seed token launch fund the HLX liquidity pool.

## v3.0 Requirements

Requirements for milestone v3.0. Each maps to roadmap phases.

### Communication

- [x] **COMM-01**: Seed launch page clearly states creator rewards from seed token fund the HLX/SOL liquidity pool
- [x] **COMM-02**: Seed launch page explains the seed token's purpose and its relationship to the HELIX protocol
- [x] **COMM-03**: Seed launch page explains boost eligibility — hold seed tokens for better APY when staking HLX
- [x] **COMM-04**: Pre-staking boost rules displayed prominently before any stake action — snapshot, headroom, permanent revocation explained in plain language

### On-Chain Boost

- [x] **BOOST-01**: Admin can set seed token mint address and minimum balance threshold in program GlobalState (admin-adjustable)
- [x] **BOOST-02**: User can register for APY boost by proving seed token ownership on-chain (one boosted stake per wallet)
- [x] **BOOST-03**: Seed token balance is snapshotted in StakeAccount at stake time
- [x] **BOOST-04**: `claim_rewards` verifies current seed balance >= snapshot before applying boost multiplier
- [x] **BOOST-05**: Boost revocation is permanent per stake — buying back seed tokens does not restore it
- [x] **BOOST-06**: Boost multiplier of 10% (1,000 BPS) mints extra tokens at claim time (real rewards, not display-only)
- [x] **BOOST-07**: Buying more seed tokens after staking provides headroom above snapshot threshold
- [ ] **BOOST-08**: Crank checks all boosted stakers every 6 hours and revokes if balance dropped below snapshot

### Frontend

- [ ] **FRONT-01**: Boost indicator on staking dashboard showing eligible/active/revoked states
- [ ] **FRONT-02**: Boosted APY display shows actual multiplied rate when boost is active
- [ ] **FRONT-03**: Wallet interaction to register for boost (calls `register_seed_boost` on-chain)
- [ ] **FRONT-04**: Push notification when boost is revoked (using existing notification infrastructure)
- [ ] **FRONT-05**: LP pool stats widget showing TVL, price, volume when pool exists

### Transparency

- [ ] **TRUST-01**: Published documentation explaining full seed → boost → LP mechanics end-to-end
- [ ] **TRUST-02**: Every on-chain action links to Solana Explorer for independent verification
- [ ] **TRUST-03**: SOL flow transparency dashboard showing how seed launch proceeds fund HLX LP
- [ ] **TRUST-04**: All boost state verifiable on-chain — no off-chain hidden state

## Future Requirements

Deferred to v3.x or later. Tracked but not in current roadmap.

### LP Pool Creation

- **LP-01**: HLX/SOL Raydium CPMM pool creation script from SOL proceeds
- **LP-02**: LP tokens burned for permanent liquidity (no rug risk)
- **LP-03**: Delayed pool start time (15-30 min) to prevent sandwich bots

### Launchpad Integration

- **PAD-01**: Live bonding curve progress tracker on seed launch page
- **PAD-02**: Launchpad SDK/API integration for real-time data
- **PAD-03**: Bonding curve graduation event detection

### Advanced Boost

- **ADV-01**: On-chain tiered boost levels based on seed token holdings
- **ADV-02**: Boost leaderboard (after 50+ boosted stakers)
- **ADV-03**: "Days boosted" streak gamification
- **ADV-04**: Time-held bonus — longer seed holding duration increases boost multiplier beyond base 10%

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| Seed token escrow/locking | Kills permissionless ethos; boost incentive is the soft-lock |
| Snapshot-only boost (point-in-time) | Gameable via flash loans |
| Write-once boost flag | Same flash loan vulnerability — boost becomes permanent if gamed |
| Permanent boost (no loss if sold) | Removes economic incentive to hold; destroys the mechanism |
| Actual pump.fun token launch | Team manual action, launchpad choice TBD |
| HLX/SOL Raydium pool creation | Deferred to future milestone (LP-01 through LP-03) |
| Live bonding curve tracker | Depends on launchpad choice (PAD-01) |
| Mobile app | Web-first, mobile later |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| COMM-01 | Phase 23 | Complete |
| COMM-02 | Phase 23 | Complete |
| COMM-03 | Phase 23 | Complete |
| COMM-04 | Phase 23 | Complete |
| BOOST-01 | Phase 24 | Complete |
| BOOST-02 | Phase 24 | Complete |
| BOOST-03 | Phase 24 | Complete |
| BOOST-04 | Phase 24 | Complete |
| BOOST-05 | Phase 24 | Complete |
| BOOST-06 | Phase 24 | Complete |
| BOOST-07 | Phase 24 | Complete |
| BOOST-08 | Phase 25 | Pending |
| FRONT-01 | Phase 26 | Pending |
| FRONT-02 | Phase 26 | Pending |
| FRONT-03 | Phase 26 | Pending |
| FRONT-04 | Phase 26 | Pending |
| FRONT-05 | Phase 27 | Pending |
| TRUST-01 | Phase 27 | Pending |
| TRUST-02 | Phase 27 | Pending |
| TRUST-03 | Phase 27 | Pending |
| TRUST-04 | Phase 27 | Pending |

**Coverage:**
- v3.0 requirements: 21 total
- Mapped to phases: 21
- Unmapped: 0 ✓

---
*Requirements defined: 2026-03-04*
*Last updated: 2026-03-04 — traceability filled after roadmap creation*
