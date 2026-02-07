# Requirements: HELIX

**Defined:** 2026-02-07
**Core Value:** Users can stake tokens for a chosen duration, earn T-shares proportional to their commitment, and receive daily inflation rewards — the complete stake-lock-earn lifecycle must work trustlessly on-chain.

## v1 Requirements

Requirements for initial release. Each maps to roadmap phases.

### Token Infrastructure

- [ ] **TOKEN-01**: SPL token created via Token-2022 with PDA mint authority and metadata extension (8 decimals)

### Staking Mechanics

- [ ] **STAKE-01**: Anchor program handles complete staking lifecycle (stake, unstake, claim rewards)
- [ ] **STAKE-02**: T-share bonus curves: Longer Pays Better (0-2x over 3641 days) and Bigger Pays Better (0-1x up to 150M threshold)
- [ ] **STAKE-03**: Early unstake penalty proportional to time not served (minimum 50%)
- [ ] **STAKE-04**: Late unstake penalty: 14-day grace period, linear to 100% over 350 days, total loss after 365
- [ ] **STAKE-05**: Daily inflation (3.69% annual) minted and distributed proportionally to T-share holders
- [ ] **STAKE-06**: Permissionless daily distribution crank anyone can call
- [ ] **STAKE-07**: Share rate increases over time (future stakes cost more per T-share)

### Free Claim and Big Pay Day

- [ ] **CLAIM-01**: Free claim period where SOL holders claim tokens proportional to a balance snapshot via Merkle proof verification
- [ ] **CLAIM-02**: Big Pay Day distributes unclaimed tokens to active T-share holders after claim period ends

### Staking Dashboard

- [ ] **DASH-01**: Staking dashboard with wallet connection: stake/unstake, view active stakes, penalty calculator
- [ ] **DASH-02**: Rich analytics: T-share price history, daily payout history, supply breakdown, stake distribution histogram
- [ ] **DASH-03**: Leaderboard and whale tracker
- [ ] **DASH-04**: Jupiter swap widget integration for token trading

### Marketing Site

- [ ] **SITE-01**: Next.js marketing site explaining the protocol mechanics, economics, and how to participate

### Indexer

- [ ] **INDX-01**: Light indexer service polling program events, storing historical data in Postgres, serving read-only REST API for analytics, leaderboards, and charts

### Deployment

- [ ] **DEPL-01**: Devnet deployment for testing, mainnet deployment for launch with upgrade authority management

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Social

- **SOCL-01**: Referral bonus system for stakers who bring in new participants
- **SOCL-02**: NFT badges for staking milestones (longest stake, most T-shares)

### Advanced Features

- **ADV-01**: Notification system for stake maturity, penalty warnings, reward claims
- **ADV-02**: Multi-stake wizard for batch stake creation
- **ADV-03**: Governance/DAO mechanics for protocol parameter changes

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| Custom AMM/liquidity pool | Jupiter handles liquidity and routing |
| Mobile native app | Responsive web sufficient for crypto-native users |
| Multi-token staking | Single token only — faithful to HEX model |
| Backend user accounts/auth | Users interact directly via wallet signatures |
| Fiat on/off ramps | Crypto-native users only |
| Cross-chain bridging | Solana-native, no bridge complexity |
| Social features (comments, follows) | Not a social platform — pure financial protocol |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| TOKEN-01 | Phase 1: Foundation and Token Infrastructure | Pending |
| STAKE-01 | Phase 2: Core Staking Mechanics | Pending |
| STAKE-02 | Phase 2: Core Staking Mechanics | Pending |
| STAKE-03 | Phase 2: Core Staking Mechanics | Pending |
| STAKE-04 | Phase 2: Core Staking Mechanics | Pending |
| STAKE-05 | Phase 2: Core Staking Mechanics | Pending |
| STAKE-06 | Phase 2: Core Staking Mechanics | Pending |
| STAKE-07 | Phase 2: Core Staking Mechanics | Pending |
| CLAIM-01 | Phase 3: Free Claim and Big Pay Day | Pending |
| CLAIM-02 | Phase 3: Free Claim and Big Pay Day | Pending |
| DASH-01 | Phase 4: Staking Dashboard | Pending |
| DASH-02 | Phase 6: Analytics and Jupiter Integration | Pending |
| DASH-03 | Phase 7: Leaderboard and Marketing Site | Pending |
| DASH-04 | Phase 6: Analytics and Jupiter Integration | Pending |
| SITE-01 | Phase 7: Leaderboard and Marketing Site | Pending |
| INDX-01 | Phase 5: Light Indexer Service | Pending |
| DEPL-01 | Phase 8: Testing, Audit, and Mainnet Launch | Pending |

**Coverage:**
- v1 requirements: 17 total
- Mapped to phases: 17
- Unmapped: 0

---
*Requirements defined: 2026-02-07*
*Last updated: 2026-02-07 after roadmap creation*
