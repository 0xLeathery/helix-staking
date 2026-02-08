# HELIX Liquidity Launch Plan

## Overview

This document outlines strategies for launching HELIX with minimal upfront capital while establishing healthy initial liquidity.

---

## Option 1: Liquidity Bootstrapping Pool (LBP) - RECOMMENDED

**Platform:** Meteora LBP or Armada

**How it works:**
1. Start with minimal HELIX tokens + small SOL amount (even 1-5 SOL works)
2. Price starts HIGH (e.g., $0.10/HELIX) and drops over 24-72 hours
3. Early buyers pay premium, late buyers get discount
4. All SOL collected becomes protocol-owned liquidity
5. At end, auto-migrate to Raydium CLMM with collected SOL

**Pros:**
- No upfront liquidity needed
- Fair price discovery
- Discourages sniping/bots (price starts high)
- You end up with protocol-owned LP

**Cons:**
- Requires setup/coordination
- Price volatility during LBP window

**Timeline:**
- Day 1-3: LBP active
- Day 4: Auto-migrate to Raydium
- Day 5+: Normal trading begins

---

## Option 2: Bonding Curve Launch (pump.fun style)

**Platform:** pump.fun, Moonshot, or custom bonding curve

**How it works:**
1. Deploy token with bonding curve contract
2. Users buy directly from curve (no LP needed)
3. Price rises automatically with each purchase
4. At graduation threshold (~85 SOL on pump.fun), auto-migrates to Raydium
5. Collected SOL becomes permanent LP

**Pros:**
- Zero upfront capital
- Simple setup
- Built-in viral mechanics
- Automatic LP creation

**Cons:**
- Associated with meme coins (may hurt credibility)
- Platform takes fees (~1-2%)
- Less control over initial price

---

## Option 3: Small Private Round + LP Seed

**How it works:**
1. Find 2-5 early believers
2. Raise 10-30 SOL at fixed price (e.g., 0.001 SOL per HELIX)
3. Use raised SOL to seed Raydium LP
4. Lock LP tokens for 6-12 months (transparency)

**Allocation example:**
- Investor A: 5 SOL → 5,000 HELIX
- Investor B: 5 SOL → 5,000 HELIX
- LP Seed: 10 SOL + 10,000 HELIX from treasury

**Pros:**
- Sets real price floor
- Investors are aligned (locked tokens)
- Professional approach

**Cons:**
- Requires finding believers
- More coordination

---

## Option 4: LP Incentive Mining

**How it works:**
1. Start with minimal LP (whatever you can afford, even 2-5 SOL)
2. Allocate 5-10% of token supply to LP rewards
3. Early LPs earn bonus HELIX tokens
4. Mercenary capital comes, liquidity deepens
5. Reduce rewards over time as liquidity stabilizes

**Pros:**
- Minimal upfront cost
- Attracts liquidity organically

**Cons:**
- Mercenary capital may leave when rewards end
- Dilutes token supply

---

## Recommended Approach for HELIX

Given HELIX has real utility (staking, T-shares, inflation rewards), I recommend:

### Phase 1: Small Seed Round (Week -2)
- Find 2-3 believers
- Raise 10-20 SOL at 0.001 SOL/HELIX
- Tokens vest over 6 months

### Phase 2: LP Creation (Week -1)
- Use 10 SOL + 10,000 HELIX to create initial Raydium pool
- Lock LP tokens for 1 year (show commitment)

### Phase 3: Free Claim Airdrop (Launch Day)
- Phase 3 of HELIX: SOL snapshot holders claim HELIX
- Creates immediate demand and attention

### Phase 4: Staking Opens (Launch Day)
- Users can stake claimed tokens
- Inflation rewards begin
- Natural demand cycle starts

---

## LP Lock Providers

To build trust, lock LP tokens:

1. **Streamflow** - https://streamflow.finance/
2. **Jupiter Lock** - Built into Jupiter ecosystem
3. **Squads Multisig** - Lock in multisig with timelock

---

## Token Allocation (Suggested)

| Allocation | % | Purpose |
|------------|---|---------|
| Free Claim (Airdrop) | 40% | SOL snapshot distribution |
| Staking Rewards (Inflation) | 30% | Minted via daily crank |
| Team/Development | 15% | 12-month vest |
| Initial LP | 10% | Locked 1 year |
| Private Round | 5% | Early believers, 6-month vest |

---

## Launch Checklist

- [ ] Decide on launch strategy (LBP vs Seed Round vs Bonding)
- [ ] Create SOL snapshot for airdrop
- [ ] Generate Merkle tree for claims
- [ ] Set up LP on Raydium/Orca
- [ ] Lock LP tokens
- [ ] Deploy mainnet contract
- [ ] Announce launch date
- [ ] Marketing push
- [ ] Launch!

---

*Last updated: 2026-02-07*
