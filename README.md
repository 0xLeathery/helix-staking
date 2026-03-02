# HELIX Staking Protocol

[![License: Elastic-2.0](https://img.shields.io/badge/License-Elastic--2.0-blue.svg)](LICENSE)

**Stake longer. Stake bigger. Earn more.**

HELIX is a time-locked staking protocol on Solana that rewards patience and conviction. Inspired by the proven mechanics of HEX, HELIX lets users lock HLX tokens for up to 5,555 days — earning T-shares that compound daily through protocol inflation. The longer and larger your stake, the greater your multiplier. No middlemen, no custodians, no permission needed.

Built on Solana with Anchor and Token-2022 for speed, low fees, and native token extensions.

**Program ID**: `E9B7BsxdPS89M66CRGGbsCzQ9LkiGv6aNsra3cNBJha7`

---

## Why HELIX?

- **Time-locked conviction** — Commit your tokens for days to years. Early unstakers pay penalties; patient stakers earn outsized rewards.
- **Daily inflation rewards** — 3.69% annual inflation distributed daily to all active stakers, proportional to T-shares.
- **Big Pay Day events** — Periodic bonus distributions reward the most committed stakers with extra yield.
- **Anti-whale by design** — Diminishing returns on large stakes, per-stake BPD caps, and loyalty multipliers ensure fair distribution.
- **SOL snapshot airdrop** — Free HLX claim for SOL holders at snapshot. Early claimers get speed bonuses.
- **Referral rewards** — Bring in new stakers and both parties earn bonus T-shares and tokens.
- **Fully on-chain** — Every stake, reward, and penalty is computed and enforced by the Solana program. No off-chain trust assumptions.

---

## How It Works

### Stake and Earn

Lock HLX tokens for 1 to 5,555 days. Your stake is converted into **T-shares** based on the amount, duration, and current share rate. T-shares earn a proportional cut of daily inflation — the more T-shares you hold, the more you earn.

### Bonus Multipliers

| Bonus | Mechanic | Maximum |
|-------|----------|---------|
| **Longer Pays Better (LPB)** | Linear bonus scaling with stake duration up to 3,641 days | 2× |
| **Bigger Pays Better (BPB)** | Tiered bonus for larger stakes with diminishing returns | 1.5× |
| **Duration Loyalty** | BPD bonus for stakes that have served their full committed term | +50% |

### Big Pay Day (BPD)

A periodic bonus event that distributes a reward pool to active stakers. Designed for transparency and fairness:

- Batched on-chain finalization handles thousands of stakers
- 24-hour community observation window before results are sealed
- 5% per-stake cap prevents any single whale from dominating
- Admin abort capability as a safety valve

### Penalties

| Scenario | Penalty |
|----------|---------|
| Early unstake (before end) | 50%–100% of principal |
| On-time (within 14-day grace) | None |
| Late (after grace period) | 0%–100% over 351 days |

Penalties exist to protect committed stakers. If you stay your term, you keep everything.

---

## Anti-Whale Protections

HELIX is built to resist concentration of rewards by large holders:

| Mechanism | Description |
|-----------|-------------|
| **BPD share cap** | No single stake can receive more than 5% of a Big Pay Day pool |
| **BPB diminishing returns** | Three-tier bonus curve — full returns up to 1.5B tokens, reduced slope above, hard cap at 1.5× |
| **Duration loyalty multiplier** | Rewards time served, not just capital deployed — up to 50% BPD bonus at full term |

---

## Free Claim (SOL Snapshot Airdrop)

SOL holders at a specific snapshot slot can claim free HLX tokens using Merkle proofs — no purchase required.

| Parameter | Value |
|-----------|-------|
| Ratio | 10,000 HLX per SOL held |
| Minimum SOL | 0.1 SOL |
| Vesting | 10% immediate, 90% over 30 days |
| Speed bonus | +20% (week 1), +10% (weeks 2–4) |
| Claim window | 180 days |

Early claimers are rewarded. Late claimers forfeit unclaimed tokens.

---

## Referral System

Grow the network and earn rewards:

- **Referee** receives a +10% T-share bonus on their first stake
- **Referrer** earns a +5% token bonus minted at stake creation
- Referral records are tracked on-chain — fully transparent and verifiable

---

## Architecture

| Component | Stack |
|-----------|-------|
| On-chain program | Anchor 0.32.1, Rust, Token-2022 |
| Frontend | Next.js 14, wallet-adapter, React Query |
| Indexer | Fastify 5, Drizzle ORM, PostgreSQL |

---

## Program Instructions

| Instruction | Description |
|-------------|-------------|
| `initialize` | Deploy and configure protocol (one-time) |
| `create_stake` | Stake HLX for 1–5,555 days; mints T-shares |
| `create_stake_with_referral` | Stake with referrer — bonus for both parties |
| `unstake` | Return T-shares, receive principal ± penalties |
| `claim_rewards` | Collect accrued inflation + BPD bonus |
| `crank_distribution` | Public crank: advance day counter, distribute inflation |
| `free_claim` | Claim airdrop with Merkle proof |
| `withdraw_vested` | Withdraw unlocked vested tokens |
| `trigger_big_pay_day` | Initiate BPD event |
| `finalize_bpd_calculation` | Process stakes in batches for BPD |
| `seal_bpd_finalize` | Seal BPD after 24-hour observation window |

---

## Security

- **Chain binding** — Explicit runtime program ID assertion prevents unauthorized forks from reusing the protocol
- **Two-step authority transfer** — `transfer_authority` + `accept_authority` prevents accidental lockout
- **Emergency pause** — Instant halt of all user-facing operations if needed
- **Integer safety** — `overflow-checks = true` in release profile; checked arithmetic throughout
- **BPD transparency** — 24-hour observation window for community verification before sealing
- **Anti-whale protections** — BPD cap, BPB diminishing returns, and loyalty multiplier
- **Transaction simulation** — All frontend transactions simulated before presenting to wallet
- **Atomic indexing** — Checkpoint + event writes with no partial state

---

## License

This project is licensed under the [Elastic License 2.0](LICENSE) — source-available with protections against competitive redeployment. You may read, audit, and build upon this code, but you may not offer it as a hosted or managed competing service. See [LICENSE](LICENSE) for full terms.
