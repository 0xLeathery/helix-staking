<div align="center">

# HELIX

### Time-Locked Staking on Solana

**Stake longer. Stake bigger. Earn more.**

Lock HLX tokens for up to **5,555 days**, earn **T-shares** that compound daily,
and collect your cut of **3.69% annual inflation** — all enforced trustlessly on-chain.

[![License: Elastic-2.0](https://img.shields.io/badge/License-Elastic--2.0-blue.svg)](LICENSE)
[![Solana](https://img.shields.io/badge/Solana-Token--2022-9945FF?logo=solana&logoColor=white)](https://solana.com)
[![Anchor](https://img.shields.io/badge/Anchor-0.32.1-blue)](https://www.anchor-lang.com)
[![Tests](https://img.shields.io/badge/Tests-622_passing-brightgreen)]()

</div>

---

<div align="center">

| Lock Duration | Daily Rewards | Max Bonus | Anti-Whale |
|:---:|:---:|:---:|:---:|
| 1 – 5,555 days | 3.69% APY | 3× multiplier | BPD capped at 5% |

</div>

---

## The Pitch

Most DeFi staking is "deposit and pray." HELIX is different.

You choose exactly how long to lock — **days, months, or years**. Your commitment is converted into T-shares using bonus curves that reward both size and duration. Every day, protocol inflation flows proportionally to T-share holders. Stay your full term and you keep everything. Leave early and you pay a penalty that gets redistributed to the stakers who stayed.

No governance votes. No admin keys draining pools. No off-chain trust assumptions. Just math, enforced by Solana.

---

## What Makes HELIX Different

**Conviction is rewarded, not just capital.**

- Longer stakes earn up to **2x bonus** T-shares (Longer Pays Better)
- Larger stakes earn up to **1.5x bonus** T-shares (Bigger Pays Better) — with diminishing returns to prevent whale dominance
- Mature stakes earn up to **50% extra** on Big Pay Day distributions (Duration Loyalty)
- Early unstakers lose **50–100%** of principal. Patient stakers earn outsized rewards.

**Big Pay Day (BPD)** — Periodic bonus events distribute a reward pool to active stakers. Batched on-chain finalization, a 24-hour community observation window, and a 5% per-stake cap keep it transparent and fair.

**Free claim for SOL holders** — At a specific snapshot slot, SOL holders claim free HLX via Merkle proofs. Early claimers get speed bonuses. Late claimers forfeit tokens to the staker pool.

**Referral rewards** — Bring in a new staker: they get **+10% bonus T-shares**, you get **+5% bonus tokens**. All tracked on-chain.

---

## Free Claim Details

| Parameter | Value |
|-----------|-------|
| Ratio | **10,000 HLX** per SOL held |
| Minimum | 0.1 SOL |
| Vesting | 10% immediate, 90% over 30 days |
| Speed bonus | +20% (week 1), +10% (weeks 2–4) |
| Claim window | 180 days |

---

## Penalty Schedule

| Scenario | Penalty | Where it goes |
|----------|---------|---------------|
| Early unstake | 50%–100% of principal | Redistributed to stakers |
| On-time (14-day grace) | **None** | — |
| Late (after grace) | 0%–100% over 351 days | Redistributed to stakers |

Penalties aren't a punishment — they're the mechanism that makes HELIX rewards possible. Every token a quitter loses, a committed staker earns.

---

## Architecture

```
┌─────────────┐     ┌──────────────────┐     ┌──────────────┐
│   Browser    │────▶│   Next.js 14     │────▶│   Solana      │
│   Wallet     │◀────│   Dashboard      │◀────│   Program     │
└─────────────┘     └──────────────────┘     └──────────────┘
                           │                        │
                           ▼                        │
                    ┌──────────────────┐            │
                    │   Indexer         │◀───────────┘
                    │   (Fastify + PG)  │  polls events
                    └──────────────────┘
```

| Component | Stack |
|-----------|-------|
| **On-chain program** | Anchor 0.32.1 · Rust · Token-2022 |
| **Frontend** | Next.js 14 · wallet-adapter · React Query · shadcn/ui |
| **Indexer** | Fastify 5 · Drizzle ORM · PostgreSQL |
| **Testing** | anchor-litesvm (165 tests) · Vitest (337 tests) · Playwright E2E |

---

## Security Model

HELIX is designed for a world where the deployer can't be trusted either:

| Protection | How |
|-----------|-----|
| **Chain binding** | Runtime program ID assertion — forks can't reuse the protocol |
| **Two-step authority transfer** | `transfer_authority` + `accept_authority` prevents lockout |
| **Emergency pause** | Instant halt of all user-facing operations |
| **Integer safety** | `overflow-checks = true` in release; checked arithmetic throughout |
| **BPD transparency** | 24h observation window for community verification before sealing |
| **Anti-whale** | BPD cap + BPB diminishing returns + loyalty multiplier |
| **Transaction simulation** | All frontend txs simulated before wallet prompt |
| **Atomic indexing** | Checkpoint + event writes — no partial state |

---

<details>
<summary><strong>Program Instructions Reference</strong></summary>

<br>

| Instruction | Description |
|-------------|-------------|
| `initialize` | Deploy and configure protocol (one-time) |
| `create_stake` | Stake HLX for 1–5,555 days; mints T-shares |
| `create_stake_with_referral` | Stake with referrer — bonus for both parties |
| `unstake` | Return T-shares, receive principal ± penalties |
| `claim_rewards` | Collect accrued inflation + BPD bonus |
| `crank_distribution` | Permissionless crank: advance day, distribute inflation |
| `free_claim` | Claim airdrop with Merkle proof |
| `withdraw_vested` | Withdraw unlocked vested tokens |
| `trigger_big_pay_day` | Initiate BPD event |
| `finalize_bpd_calculation` | Process stakes in batches for BPD |
| `seal_bpd_finalize` | Seal BPD after 24h observation window |

</details>

---

<details>
<summary><strong>Anti-Whale Mechanics</strong></summary>

<br>

| Mechanism | Description |
|-----------|-------------|
| **BPD share cap** | No single stake receives more than 5% of a Big Pay Day pool |
| **BPB diminishing returns** | Three-tier curve — full returns up to 1.5B tokens, reduced slope above, hard cap at 1.5× |
| **Duration loyalty multiplier** | Rewards time served, not just capital — up to 50% BPD bonus at full term |

</details>

---

**Program ID**: `E9B7BsxdPS89M66CRGGbsCzQ9LkiGv6aNsra3cNBJha7`

## License

[Elastic License 2.0](LICENSE) — source-available with protections against competitive redeployment. You may read, audit, and build upon this code, but you may not offer it as a hosted or managed competing service.
