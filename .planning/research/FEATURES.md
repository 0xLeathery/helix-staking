# SolHEX Feature Research

**Research Type**: Project Research — Features dimension
**Context**: Greenfield Solana HEX-style staking protocol
**Date**: 2026-02-07

## Executive Summary

This research identifies and categorizes features for SolHEX, a HEX-style staking protocol on Solana. Features are organized into three categories: **Table Stakes** (must-have), **Differentiators** (competitive advantage), and **Anti-Features** (deliberately excluded). The analysis draws from HEX protocol mechanics, Solana DeFi staking patterns (Marinade, Jito, marginfi), and analytics dashboard best practices (Solscan, Birdeye, Raydium).

---

## 1. Table Stakes Features

These are essential features without which users would not use or trust the protocol.

### 1.1 Core Staking Mechanics (CRITICAL)

**Feature**: Time-locked staking with variable duration
**Details**: Users must be able to stake tokens for 1-5555 days
**Complexity**: Medium — Requires epoch-aware time calculations on-chain
**Dependencies**: Anchor program, stake account PDA design
**Rationale**: Core HEX mechanic. Without this, there's no product.

**Feature**: T-share calculation and allocation
**Details**: Convert staked tokens → T-shares using bonus curves
**Complexity**: Medium — Mathematical precision, overflow protection
**Dependencies**: Bonus curve implementations
**Rationale**: T-shares are the fundamental unit of reward distribution

**Feature**: Daily inflation distribution (3.69% annual)
**Details**: Mint new tokens daily, distribute proportional to T-share holdings
**Complexity**: High — Precision math, permissionless crank, state tracking
**Dependencies**: Token mint authority, distribution algorithm
**Rationale**: Primary value proposition for stakers

**Feature**: Stake creation/ending
**Details**: Users create stakes, end stakes (with penalties if early/late)
**Complexity**: Medium — State transitions, validation logic
**Dependencies**: Core program logic
**Rationale**: Basic stake lifecycle operations

### 1.2 Penalty System (CRITICAL)

**Feature**: Early unstake penalty (minimum 50%)
**Details**: Proportional penalty based on time not served
**Complexity**: Medium — Time calculations, penalty distribution
**Dependencies**: Stake state, penalty pool
**Rationale**: Prevents gaming the system, core economic incentive

**Feature**: Late unstake penalty (grace period + linear decay)
**Details**: 14-day grace, linear to 100% over 350 days, total loss after 365
**Complexity**: Medium-High — Multi-phase time logic
**Dependencies**: Stake end date tracking
**Rationale**: Incentivizes timely stake ending, prevents abandoned stakes

### 1.3 Bonus Curves (CRITICAL)

**Feature**: Longer Pays Better (0-2x over 3641 days)
**Details**: Stake duration bonus curve
**Complexity**: Low-Medium — Non-linear calculation
**Dependencies**: None (pure math)
**Rationale**: Core HEX mechanic, rewards commitment

**Feature**: Bigger Pays Better (0-1x up to 150M threshold)
**Details**: Stake size bonus curve
**Complexity**: Low-Medium — Logarithmic or stepped calculation
**Dependencies**: Supply tracking
**Rationale**: Rewards larger stakes, creates whale incentives

### 1.4 Free Claim & Big Pay Day (CRITICAL)

**Feature**: Free claim based on SOL snapshot
**Details**: SOL holders claim tokens proportional to snapshot balance
**Complexity**: High — Snapshot verification, Merkle tree or SPL governance registry
**Dependencies**: Off-chain snapshot tooling, on-chain verification
**Rationale**: Initial distribution mechanism, faithful to HEX model

**Feature**: Big Pay Day (unclaimed token distribution)
**Details**: After claim period, distribute unclaimed tokens to T-share holders
**Complexity**: Medium-High — One-time event, state finalization
**Dependencies**: Claim period tracking, T-share snapshot
**Rationale**: Creates urgency for early staking, rewards early adopters

### 1.5 Dashboard — User Account Management (CRITICAL)

**Feature**: Wallet connection (Phantom, Solflare, Backpack, etc.)
**Details**: Standard Solana wallet adapter integration
**Complexity**: Low — @solana/wallet-adapter-react
**Dependencies**: Next.js frontend
**Rationale**: Users can't interact without wallet connection

**Feature**: View active stakes
**Details**: Display all user stakes with status, end date, T-shares, principal
**Complexity**: Low — Read from RPC, display table
**Dependencies**: Stake account PDAs
**Rationale**: Users need to see their positions

**Feature**: Create stake
**Details**: UI to specify amount + duration, execute stake transaction
**Complexity**: Low-Medium — Form validation, transaction building
**Dependencies**: Wallet adapter, program instructions
**Rationale**: Primary user action

**Feature**: End stake
**Details**: UI to end a stake, show penalty if early/late
**Complexity**: Medium — Calculate penalties client-side for preview
**Dependencies**: Penalty calculation logic
**Rationale**: Users need to exit positions

**Feature**: Claim rewards
**Details**: Claim accumulated daily inflation rewards
**Complexity**: Low — Instruction call
**Dependencies**: Reward tracking in program
**Rationale**: Users need to collect earnings

### 1.6 Dashboard — Core Analytics (CRITICAL)

**Feature**: Current T-share price
**Details**: Display current share rate (tokens per T-share)
**Complexity**: Low — Read from global state
**Dependencies**: Global state account
**Rationale**: Key metric for stake decision-making

**Feature**: Total staked / Total supply
**Details**: Protocol-level TVL and supply breakdown
**Complexity**: Low — Aggregate from global state
**Dependencies**: Global state
**Rationale**: Market health indicator

**Feature**: User's total T-shares and pending rewards
**Details**: Sum across all stakes, show claimable amount
**Complexity**: Low-Medium — Aggregate user stakes
**Dependencies**: Stake accounts, reward calculation
**Rationale**: User needs to know their position value

**Feature**: Penalty calculator (interactive)
**Details**: Input stake params, show projected penalties for early/late exit
**Complexity**: Medium — Client-side penalty simulation
**Dependencies**: Penalty formulas
**Rationale**: Users need to understand consequences before unstaking

### 1.7 Token Infrastructure (CRITICAL)

**Feature**: SPL Token-2022 with metadata extension
**Details**: Token with on-chain name, symbol, logo
**Complexity**: Low — Standard Token-2022 mint
**Dependencies**: Solana Token-2022 program
**Rationale**: Modern Solana token standard

**Feature**: PDA mint authority
**Details**: Program-controlled minting for inflation
**Complexity**: Low — Standard Anchor PDA pattern
**Dependencies**: Anchor program
**Rationale**: Trustless inflation distribution

### 1.8 Trading Infrastructure (TABLE STAKES)

**Feature**: Jupiter swap integration
**Details**: Embedded Jupiter widget for token trading
**Complexity**: Low — Jupiter React integration
**Dependencies**: Jupiter API, liquidity pools
**Rationale**: Users need liquidity access without leaving app

---

## 2. Differentiating Features

These features create competitive advantage and delight users beyond baseline expectations.

### 2.1 Advanced Analytics (DIFFERENTIATORS)

**Feature**: T-share price history chart
**Details**: Historical line chart showing share rate over time
**Complexity**: Medium — Indexer to store historical snapshots, charting library
**Dependencies**: Indexer service, chart.js or recharts
**Rationale**: HEX.com has this; shows protocol maturity and stake efficiency trends

**Feature**: Daily payout history chart
**Details**: Historical bar/line chart of daily inflation distribution
**Complexity**: Medium — Indexer stores daily events
**Dependencies**: Indexer service
**Rationale**: Transparency into reward consistency

**Feature**: Supply breakdown pie chart
**Details**: Visualize circulating vs staked vs unclaimed supply
**Complexity**: Low-Medium — Single snapshot, pie chart
**Dependencies**: Global state aggregation
**Rationale**: Market health visualization

**Feature**: Stake distribution histogram
**Details**: Distribution of stake sizes (e.g., <1K, 1K-10K, 10K-100K, 100K+)
**Complexity**: Medium-High — Requires stake enumeration or indexer
**Dependencies**: Indexer or on-chain enumeration
**Rationale**: Shows protocol usage patterns, whale concentration

**Feature**: Average stake length metric
**Details**: Show average duration of all active stakes
**Complexity**: Medium — Indexer aggregation
**Dependencies**: Indexer
**Rationale**: Indicates community commitment level

**Feature**: Total T-shares chart over time
**Details**: Historical chart of total T-shares in protocol
**Complexity**: Medium — Indexer historical tracking
**Dependencies**: Indexer
**Rationale**: Shows protocol growth and adoption

### 2.2 Leaderboard & Whale Tracking (DIFFERENTIATORS)

**Feature**: Leaderboard — largest stakes
**Details**: Top 100 stakes by principal amount
**Complexity**: Medium — Indexer query with sorting
**Dependencies**: Indexer
**Rationale**: Gamification, transparency, whale visibility

**Feature**: Leaderboard — most T-shares
**Details**: Top 100 stakes by T-share allocation
**Complexity**: Medium — Indexer query
**Dependencies**: Indexer
**Rationale**: Shows efficiency (bonus curve optimization)

**Feature**: Leaderboard — longest stakes
**Details**: Top 100 stakes by duration
**Complexity**: Low-Medium — Sort by end date
**Dependencies**: Indexer
**Rationale**: Highlights committed stakers

**Feature**: Whale tracker (large transactions)
**Details**: Recent stakes/unstakes above threshold (e.g., 100K tokens)
**Complexity**: Medium — Event monitoring with filters
**Dependencies**: Indexer or RPC subscription
**Rationale**: Market intelligence, transparency

**Feature**: Anonymous vs. named wallets (optional labels)
**Details**: Allow users to label their stakes (off-chain metadata)
**Complexity**: Medium — Separate database, authentication
**Dependencies**: Backend service for labels
**Rationale**: Community identity, competitive leaderboard

### 2.3 Advanced UX Features (DIFFERENTIATORS)

**Feature**: Multi-stake creation wizard
**Details**: Create multiple stakes in one transaction (ladder strategy)
**Complexity**: High — Transaction batching, UI complexity
**Dependencies**: Anchor program support for batching
**Rationale**: Advanced users optimize by laddering stakes

**Feature**: Stake calendar view
**Details**: Timeline view of when stakes end
**Complexity**: Medium — Calendar component, date calculations
**Dependencies**: User stakes
**Rationale**: Visual planning tool for stake management

**Feature**: Projected earnings calculator
**Details**: Input amount + duration, show projected T-shares and daily rewards
**Complexity**: Medium — Client-side simulation using current share rate
**Dependencies**: Bonus curve logic
**Rationale**: Decision support tool before staking

**Feature**: APY estimator
**Details**: Show estimated APY based on current share rate, inflation, and stake params
**Complexity**: Medium — Complex calculation (inflation ÷ total T-shares)
**Dependencies**: Global state, simulation logic
**Rationale**: Users familiar with traditional finance want APY comparison

**Feature**: Notification system (end date reminders)
**Details**: Email/push notifications X days before stake ends (grace period warning)
**Complexity**: High — Backend service, user registration, notification infrastructure
**Dependencies**: Separate backend, user accounts
**Rationale**: Prevents late penalties for forgetful users

### 2.4 Marketing & Education (DIFFERENTIATORS)

**Feature**: Interactive staking simulator (no wallet)
**Details**: Demo mode showing how staking works with fake data
**Complexity**: Medium — Standalone React component with mock state
**Dependencies**: None (client-only)
**Rationale**: Onboard non-crypto users, explain mechanics

**Feature**: Economics explainer page with visuals
**Details**: Animated diagrams explaining T-shares, bonuses, penalties, BPD
**Complexity**: Medium-High — Design + animations
**Dependencies**: Marketing site
**Rationale**: Complex mechanics require education

**Feature**: FAQ with search
**Details**: Comprehensive FAQ covering common questions
**Complexity**: Low — Static content + search filter
**Dependencies**: Marketing site
**Rationale**: Reduce support burden, improve trust

### 2.5 Transparency & Auditability (DIFFERENTIATORS)

**Feature**: Live on-chain verification links
**Details**: Every metric links to Solana Explorer for verification
**Complexity**: Low — URL generation
**Dependencies**: None
**Rationale**: Builds trust, transparency > opaque dashboards

**Feature**: Open-source codebase
**Details**: Public GitHub repos for program, frontend, indexer
**Complexity**: Zero — Project decision
**Dependencies**: None
**Rationale**: DeFi standard, builds trust

**Feature**: Real-time event stream
**Details**: WebSocket feed of recent stakes/unstakes/claims
**Complexity**: Medium — WebSocket server, event subscription
**Dependencies**: Indexer or RPC subscription
**Rationale**: Shows protocol activity, social proof

---

## 3. Anti-Features

These are features deliberately excluded to maintain simplicity and focus.

### 3.1 Referral Program

**Rationale**: Adds smart contract complexity (tracking referrers, calculating bonuses), frontend UX overhead (invite links, referral dashboards), and potential for gaming. Defer to v2 after core mechanics are proven.

### 3.2 Custom AMM/Liquidity Pool

**Rationale**: Jupiter aggregates liquidity across Raydium, Orca, etc. Building a custom AMM is high complexity with low value-add. Focus on staking, not trading infrastructure.

### 3.3 Mobile Native App

**Rationale**: Responsive web (Next.js) handles mobile. Native apps require separate codebases (iOS Swift, Android Kotlin), App Store compliance, and ongoing maintenance. Not worth it for solo dev.

### 3.4 Governance/DAO Mechanics

**Rationale**: Staking protocol doesn't require governance in v1. Parameters are fixed in code (inflation rate, penalty curves). Adding governance requires voting contracts, proposal systems, and coordination overhead.

### 3.5 Multi-Token Staking

**Rationale**: Increases complexity (cross-token accounting, multiple mint authorities). Single-token focus maintains simplicity.

### 3.6 Backend User Accounts/Authentication

**Rationale**: Users interact via wallet signatures (Solana standard). No need for email/password, user profiles, or session management. Keep it crypto-native.

### 3.7 Fiat On/Off Ramps

**Rationale**: Regulatory complexity, KYC requirements, payment processor integrations. Target is crypto-native users who already have SOL.

### 3.8 Automated Restaking/Compounding

**Rationale**: Solana doesn't support scheduled transactions. Would require centralized service or users to manually claim+restake. Adds backend complexity without clear value (users can manually compound).

### 3.9 NFT Badges for Stakers

**Rationale**: Gimmick with high implementation cost (NFT minting, metadata, marketplace integration). Focus on core value: staking returns.

### 3.10 Social Features (Chat, Forums)

**Rationale**: Scope creep. Community can organize on Discord/Telegram. Focus on protocol, not social infrastructure.

### 3.11 Advanced Order Types (Limit Orders for Staking)

**Rationale**: Staking is not trading. Users stake at current conditions. No need for "stake when share rate hits X" logic.

### 3.12 Cross-Chain Bridging

**Rationale**: Solana-only protocol. Bridging to Ethereum/other chains adds massive complexity and attack surface.

---

## 4. Feature Dependencies Map

### Critical Path (Must Build First)

```
1. Anchor program → Core staking logic (stake, unstake, T-shares, penalties)
   ↓
2. SPL Token-2022 mint → PDA authority setup
   ↓
3. Inflation distribution → Daily crank, reward calculation
   ↓
4. Free claim mechanism → SOL snapshot verification
   ↓
5. Big Pay Day → One-time unclaimed distribution
   ↓
6. Basic dashboard → Wallet connection, view stakes, create/end stake
   ↓
7. Penalty calculator → Client-side preview before unstake
   ↓
8. Jupiter integration → Trading access
```

### Parallel Tracks (Can Build Alongside)

**Track A: Analytics**
- Indexer service (polls events, stores historical data)
- T-share price history chart
- Daily payout history chart
- Supply breakdown charts

**Track B: Leaderboard**
- Indexer query endpoints
- Leaderboard UI (largest stakes, most T-shares, longest stakes)
- Whale tracker

**Track C: Marketing**
- Next.js marketing site
- Economics explainer page
- FAQ section
- Interactive simulator (demo mode)

### Optional Enhancements (Post-MVP)

- Multi-stake wizard
- Stake calendar view
- Projected earnings calculator
- APY estimator
- Notification system
- Real-time event stream

---

## 5. Complexity & Risk Assessment

### High Complexity, High Risk

1. **Free claim verification** — Merkle tree or governance registry, snapshot tooling, potential for exploits
2. **Daily inflation distribution crank** — Precision math, state management, must be permissionless
3. **Big Pay Day distribution** — One-time event, high stakes, state finalization logic
4. **Stake distribution histogram** — Requires efficient enumeration or indexer aggregation

### Medium Complexity, Medium Risk

1. **T-share bonus curves** — Non-linear math, precision edge cases
2. **Penalty calculations** — Multi-phase time logic, overflow protection
3. **Indexer service** — Event polling, database management, API design
4. **Multi-stake wizard** — Transaction batching, UI complexity

### Low Complexity, Low Risk

1. **Basic dashboard (view stakes, create/end)** — Standard React patterns
2. **Jupiter integration** — Well-documented SDK
3. **Marketing site** — Static content + Next.js
4. **Leaderboard UI** — Simple sorting/filtering

---

## 6. Solana DeFi UX Patterns (Benchmarks)

### From Marinade, Jito, marginfi, Sanctum

**Pattern 1: Zero Fees Messaging**
Marinade prominently displays "zero fees" (no commission, no protocol fees). Users keep 100% of staking rewards. **Apply to SolHEX**: No protocol fee on inflation distribution.

**Pattern 2: APY Transparency**
All staking protocols show current APY, often with historical APY chart. **Apply to SolHEX**: Show estimated APY based on current share rate + inflation + total T-shares.

**Pattern 3: Instant Liquidity Emphasis**
Liquid staking (Marinade LST, Jito JitoSOL) emphasizes instant liquidity via Sanctum or Jupiter swaps. **Apply to SolHEX**: Highlight Jupiter integration for instant token trading (vs. waiting for stake to end).

**Pattern 4: Validator Transparency**
Marinade shows validator set, performance metrics, commission rates. **Apply to SolHEX**: Show penalty distribution destination (burned? staker pool? transparent on-chain).

**Pattern 5: Epoch Timing**
Solana staking UI shows epoch countdown, rewards credited at epoch boundary. **Apply to SolHEX**: Show daily distribution time (e.g., "Next distribution in 4h 23m").

**Pattern 6: Simple Staking Flow**
marginfi/Sanctum: 2-3 clicks to stake (connect wallet → enter amount → confirm). **Apply to SolHEX**: Minimize friction in stake creation (amount + duration slider → preview → confirm).

**Pattern 7: Portfolio View**
All DeFi dashboards aggregate user positions in one place. **Apply to SolHEX**: "My Stakes" table with total value, total T-shares, total pending rewards.

### From Solscan, Birdeye, Raydium (Analytics)

**Pattern 8: Real-Time Metrics**
Solscan shows TPS, block height, validator count in real-time. **Apply to SolHEX**: Show total stakes, total T-shares, total staked value updating live.

**Pattern 9: 24h Change Indicators**
Birdeye/Raydium show 24h volume, 24h price change with up/down arrows. **Apply to SolHEX**: Show "New stakes (24h)", "T-shares created (24h)" with trend indicators.

**Pattern 10: Historical Charts with Timeframe Selection**
Standard pattern: 1h/24h/7d/30d/All buttons for chart timeframes. **Apply to SolHEX**: T-share price history, daily payout history charts with timeframe toggles.

**Pattern 11: TVL Breakdown**
DeFi dashboards show TVL split by pool, token, or category (pie/bar charts). **Apply to SolHEX**: Supply breakdown (staked vs. circulating vs. unclaimed).

**Pattern 12: Leaderboards with Pagination**
Solscan NFT/DeFi dashboards show top 100 with pagination. **Apply to SolHEX**: Leaderboards paginated (10-20 per page).

**Pattern 13: Search/Filter on Leaderboards**
Birdeye allows searching by address or filtering by criteria. **Apply to SolHEX**: Filter leaderboard by stake size, duration, or search by wallet address.

**Pattern 14: Export Data (CSV)**
Advanced users want to export leaderboard or historical data. **Apply to SolHEX**: "Export CSV" button on leaderboards and analytics pages.

---

## 7. Feature Prioritization for MVP

### Phase 1: Core Protocol (Weeks 1-4)
- Anchor program: stake/unstake, T-shares, penalties, inflation
- SPL Token-2022 mint
- Free claim mechanism
- Big Pay Day distribution

### Phase 2: Basic Dashboard (Weeks 5-6)
- Wallet connection
- View active stakes
- Create/end stake UI
- Penalty calculator

### Phase 3: Trading & Indexer (Weeks 7-8)
- Jupiter integration
- Light indexer (event polling, historical storage)
- T-share price history chart
- Daily payout history chart

### Phase 4: Leaderboard & Marketing (Weeks 9-10)
- Leaderboard (largest stakes, most T-shares)
- Whale tracker
- Marketing site (mechanics explainer, FAQ)

### Phase 5: Polish & Launch (Weeks 11-12)
- Supply breakdown charts
- Stake distribution histogram
- Audit prep, security review
- Mainnet deployment

---

## 8. Open Questions & Research Gaps

1. **Free claim snapshot mechanism**: Merkle tree (Metaplex Gumdrop pattern) vs. SPL Governance registry? Need to research proof size, verification cost, UX.

2. **Indexer architecture**: Poll RPC (`getProgramAccounts`) vs. WebSocket subscriptions vs. Geyser plugin? Need to benchmark performance and cost.

3. **Multi-stake transaction batching**: Can Anchor handle multiple stake instructions in one transaction? What's the compute unit limit?

4. **Penalty destination**: Should penalties be burned (deflationary) or redistributed to remaining stakers (HEX redistributes)? Need to decide economic model.

5. **Share rate precision**: HEX uses 18 decimals for share rate calculations. Solana u64 limits require careful math. Need overflow protection strategy.

6. **Historical data retention**: How long to keep historical snapshots in indexer? 30 days? 1 year? Forever? Storage cost vs. analytics value tradeoff.

7. **Whale definition threshold**: What token amount qualifies for "whale tracker"? 100K? 1M? Should be configurable or hardcoded?

8. **Leaderboard anonymity**: Do we allow users to opt-out of leaderboard? Privacy concern vs. transparency tradeoff.

---

## 9. Summary Table

| Category | Feature Count | Complexity Avg | Priority |
|----------|--------------|----------------|----------|
| **Table Stakes** | 24 features | Medium-High | CRITICAL |
| **Differentiators** | 21 features | Medium | HIGH |
| **Anti-Features** | 12 features | N/A | EXCLUDE |

### Table Stakes Breakdown
- Core staking mechanics: 4 features (HIGH complexity)
- Penalty system: 2 features (MEDIUM-HIGH complexity)
- Bonus curves: 2 features (MEDIUM complexity)
- Free claim & BPD: 2 features (HIGH complexity)
- Dashboard user management: 5 features (LOW-MEDIUM complexity)
- Dashboard core analytics: 4 features (LOW-MEDIUM complexity)
- Token infrastructure: 2 features (LOW complexity)
- Trading infrastructure: 1 feature (LOW complexity)

### Differentiators Breakdown
- Advanced analytics: 6 features (MEDIUM complexity)
- Leaderboard & whale tracking: 5 features (MEDIUM complexity)
- Advanced UX: 5 features (MEDIUM-HIGH complexity)
- Marketing & education: 3 features (MEDIUM complexity)
- Transparency & auditability: 3 features (LOW-MEDIUM complexity)

---

## 10. Recommendations for Requirements Definition

1. **Prioritize table stakes first**: Ship MVP with core staking, penalties, bonuses, basic dashboard. Defer all differentiators to post-launch iterations.

2. **Indexer is non-negotiable for analytics**: Historical charts, leaderboards, and whale tracking all depend on indexer. Budget time for this infrastructure.

3. **Free claim mechanism needs early validation**: High risk feature. Consider building prototype to validate snapshot → Merkle tree → on-chain verification flow before full implementation.

4. **Marketing site can be parallel track**: Doesn't block protocol development. Can be built alongside smart contract work.

5. **Notification system is out of scope for v1**: High complexity, requires backend, low value-add compared to other features. Cut from MVP.

6. **Multi-stake wizard is optional**: Advanced users want it, but not critical for launch. Can be post-launch enhancement.

7. **APY estimator vs. T-share metrics**: Consider which mental model to emphasize. HEX ecosystem uses T-shares, but traditional DeFi users expect APY. May need both.

8. **Transparency features are cheap wins**: Linking to Solana Explorer, open-sourcing code, showing real-time events are low-cost trust builders.

---

*End of Features Research*
