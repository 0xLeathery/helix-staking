# SolHEX Architecture Research

**Research Type:** Project Architecture
**Dimension:** Architecture patterns for Solana DeFi staking protocol
**Date:** 2026-02-07

---

## Executive Summary

This document outlines the recommended architecture for SolHEX, a HEX-style staking protocol on Solana. The architecture is designed for a **solo developer build** with emphasis on:

- **Minimal backend complexity** (no heavy server infrastructure)
- **Client-to-chain direct staking** (frontend → RPC → Anchor program)
- **Light indexer** for analytics and historical data
- **Fully on-chain staking mechanics** with off-chain data aggregation

---

## 1. Component Architecture

### 1.1 High-Level System Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     USER INTERFACE                          │
│  Next.js Frontend (staking UI + marketing + analytics)     │
│  - Wallet Adapter (Phantom, Solflare, etc.)                │
│  - Jupiter Swap Integration                                │
│  - Read-only analytics from Indexer API                    │
└────────────┬────────────────────────────────┬───────────────┘
             │                                │
             │ (transactions)                 │ (read queries)
             ▼                                ▼
┌─────────────────────────┐      ┌──────────────────────────┐
│   Solana RPC Node       │      │   Light Indexer          │
│   (Chainstack/Helius)   │◄─────┤   - Polls program events │
│                         │      │   - Stores snapshots     │
│   Anchor Program        │      │   - Serves analytics API │
│   - Global state        │      └──────────────────────────┘
│   - User stakes         │
│   - T-share calculation │
│   - Daily distribution  │
│   - Free claim merkle   │
│   - Token-2022 mint     │
└─────────────────────────┘
```

### 1.2 Component Boundaries

| Component | Responsibility | Data In | Data Out |
|-----------|---------------|---------|----------|
| **Anchor Program** | On-chain state, stake logic, distribution crank, claim verification | Transactions from frontend | Events, state updates |
| **Next.js Frontend** | User interface, wallet connection, transaction signing, Jupiter swap | User input, wallet state | Signed transactions |
| **Light Indexer** | Poll events, aggregate historical data, serve read-only API | Program events via RPC | JSON API responses |
| **Jupiter Integration** | Token swap routing | User swap requests | Swap transactions |
| **Solana RPC** | Transaction broadcast, state reads | Transactions, queries | Confirmations, account data |

---

## 2. Anchor Program Architecture

### 2.1 Account Structure

Based on Anchor best practices for staking protocols:

#### Global State Account (Single PDA)
```rust
#[account]
pub struct GlobalState {
    pub total_t_shares: u128,              // Global T-share supply
    pub last_distribution_timestamp: i64,  // Unix timestamp of last daily crank
    pub daily_inflation_rate: u64,         // Base units per day (3.69% annual)
    pub stake_token_mint: Pubkey,          // Protocol token mint (Token-2022)
    pub reward_vault: Pubkey,              // PDA holding reward tokens
    pub max_lockup_days: u16,              // 5555 max
    pub lpb_curve: [u16; 256],             // Longer Pays Better multipliers
    pub bpb_curve: [u16; 256],             // Bigger Pays Better multipliers
    pub big_pay_day_pool: u64,             // Accumulated BPD rewards
    pub free_claim_merkle_root: [u8; 32],  // Merkle root for SOL snapshot
    pub program_authority: Pubkey,         // Admin key
}

// PDA seeds: [b"global"]
```

#### User Profile Account (Single PDA per user)
```rust
#[account]
pub struct UserProfile {
    pub owner: Pubkey,                     // User wallet
    pub stakes: Vec<Stake>,                // Max 10-20 stakes per user
    pub total_t_shares: u128,              // User's total T-shares
    pub free_claim_amount: u64,            // From SOL snapshot (if claimed)
    pub free_claim_consumed: bool,         // One-time claim flag
}

// PDA seeds: [b"user", owner.key().as_ref()]

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct Stake {
    pub stake_id: u64,                     // Unique ID (seq number)
    pub start_timestamp: i64,              // Unix timestamp
    pub lockup_days: u16,                  // 1-5555
    pub stake_amount: u64,                 // Protocol tokens staked
    pub t_shares: u128,                    // T-shares earned (with bonuses)
    pub last_claimed_day: u16,             // Day index of last claim
    pub is_active: bool,                   // False if unstaked
}
```

### 2.2 PDA Design

| Account | Seeds | Purpose |
|---------|-------|---------|
| GlobalState | `["global"]` | Single source of truth |
| UserProfile | `["user", user_pubkey]` | Per-user state |
| RewardVault | `["vault"]` | Program-owned token account |
| FreeClaim | `["claim", user_pubkey]` | Merkle proof claim verification |

### 2.3 Instructions

#### Core Staking Instructions
```rust
pub fn initialize_protocol(ctx: Context<Init>, params: InitParams) -> Result<()>
pub fn stake(ctx: Context<Stake>, amount: u64, lockup_days: u16) -> Result<()>
pub fn unstake(ctx: Context<Unstake>, stake_id: u64) -> Result<()>
pub fn claim_rewards(ctx: Context<Claim>, stake_id: u64) -> Result<()>
```

#### Distribution Crank (Daily)
```rust
pub fn distribute_daily_rewards(
    ctx: Context<DistributeRewards>,
    batch_size: u8  // Process users in batches to avoid compute limits
) -> Result<()>
```

**Crank Pattern:**
- Permissionless instruction (anyone can call)
- Processes 10-20 user accounts per transaction
- Updates `last_distribution_timestamp` in GlobalState
- Emits `DailyDistribution` event with reward amounts

#### Free Claim (One-time)
```rust
pub fn claim_free_tokens(
    ctx: Context<FreeClaim>,
    amount: u64,
    merkle_proof: Vec<[u8; 32]>
) -> Result<()>
```

**Merkle Proof Verification:**
- SOL snapshot taken at predetermined block height
- Merkle tree built off-chain from snapshot data
- Root stored in GlobalState
- Users submit proof + amount to claim

### 2.4 T-Share Calculation

**Formula (pseudo-code):**
```rust
fn calculate_t_shares(amount: u64, lockup_days: u16) -> u128 {
    let base_shares = amount as u128;

    // LPB: Longer Pays Better (0-35% bonus for longer locks)
    let lpb_multiplier = lpb_curve[lockup_days as usize];
    let lpb_bonus = (base_shares * lpb_multiplier as u128) / 10000;

    // BPB: Bigger Pays Better (0-10% bonus for larger stakes)
    let bpb_multiplier = bpb_curve[amount_tier(amount)];
    let bpb_bonus = (base_shares * bpb_multiplier as u128) / 10000;

    base_shares + lpb_bonus + bpb_bonus
}
```

### 2.5 Event Emission (for Indexer)

```rust
#[event]
pub struct StakeCreated {
    pub user: Pubkey,
    pub stake_id: u64,
    pub amount: u64,
    pub lockup_days: u16,
    pub t_shares: u128,
    pub timestamp: i64,
}

#[event]
pub struct StakeEnded {
    pub user: Pubkey,
    pub stake_id: u64,
    pub principal: u64,
    pub rewards: u64,
    pub penalty: u64,  // If early unstake
    pub timestamp: i64,
}

#[event]
pub struct DailyDistribution {
    pub day_index: u16,
    pub total_rewards: u64,
    pub total_t_shares: u128,
    pub timestamp: i64,
}
```

---

## 3. Token-2022 Integration

### 3.1 Protocol Token Mint

**Token-2022 Extensions:**
- **Mint Authority:** PDA-controlled (program can mint inflation rewards)
- **Transfer Hook:** Optional (for future anti-bot mechanics)
- **Metadata:** On-chain name, symbol, logo URI

**Mint PDA:**
```rust
// Seeds: [b"mint"]
pub token_mint: InterfaceAccount<'info, Mint>
```

### 3.2 Reward Distribution Flow

1. **Daily crank** calls `distribute_daily_rewards`
2. Program calculates total rewards for the day (inflation rate × elapsed time)
3. Program mints new tokens directly to RewardVault
4. Individual users call `claim_rewards` to transfer from vault to their ATA

---

## 4. Free Claim Mechanism

### 4.1 SOL Snapshot Process

**Off-chain (one-time setup):**
1. Query Solana RPC at predetermined slot for all SOL holders
2. Filter wallets with balance > minimum threshold
3. Build merkle tree: `leaf = hash(wallet_pubkey || sol_amount)`
4. Store merkle root in GlobalState on-chain

**On-chain (user claims):**
```rust
pub fn claim_free_tokens(
    ctx: Context<FreeClaim>,
    amount: u64,
    merkle_proof: Vec<[u8; 32]>
) -> Result<()> {
    // 1. Verify merkle proof against GlobalState.free_claim_merkle_root
    // 2. Verify amount matches proof
    // 3. Check user hasn't claimed before
    // 4. Mint tokens to user's ATA
    // 5. Mark UserProfile.free_claim_consumed = true
}
```

### 4.2 Frontend Integration

- Frontend fetches user's proof from static JSON file (hosted on CDN)
- User clicks "Claim Free Tokens"
- Frontend builds transaction with proof data
- Single transaction to claim

---

## 5. Daily Distribution Crank Pattern

### 5.1 Why a Crank?

Solana has no native "scheduled execution" — all state changes require explicit transactions. The **crank pattern** allows permissionless daily reward distribution.

### 5.2 Crank Implementation

**Challenges:**
- Solana compute limit: ~1.4M CU per transaction
- Processing 1000s of user stakes in one transaction is impossible

**Solution: Batched Processing**

```rust
pub fn distribute_daily_rewards(
    ctx: Context<DistributeRewards>,
    batch_start: u16,
    batch_size: u8,
) -> Result<()> {
    let now = Clock::get()?.unix_timestamp;
    let global = &mut ctx.accounts.global_state;

    // Only allow once per day
    require!(
        now - global.last_distribution_timestamp >= 86400,
        ErrorCode::TooSoonForDistribution
    );

    // Calculate daily rewards
    let daily_inflation = global.daily_inflation_rate;

    // Process batch of users (passed as remaining_accounts)
    for (i, user_account_info) in ctx.remaining_accounts.iter().enumerate() {
        let mut user: Account<UserProfile> = Account::try_from(user_account_info)?;

        // Distribute rewards proportional to T-shares
        let user_reward = (daily_inflation as u128)
            .checked_mul(user.total_t_shares)
            .unwrap()
            .checked_div(global.total_t_shares)
            .unwrap() as u64;

        // Add to unclaimed rewards in each active stake
        // (user claims later via claim_rewards instruction)
        // ... logic to update user.stakes ...

        user.exit(&crate::ID)?;
    }

    global.last_distribution_timestamp = now;
    Ok(())
}
```

**Who calls the crank?**
- **Automated bot** (run by protocol or community incentivized)
- **Frontend prompt** ("Crank needed, earn 0.1% of daily rewards!")
- **Gas-optimized:** Crank caller pays tx fee but could receive small incentive

### 5.3 Alternative: Lazy Distribution

Instead of batched crank, use **lazy accounting**:

```rust
pub fn claim_rewards(ctx: Context<Claim>, stake_id: u64) -> Result<()> {
    let global = &ctx.accounts.global_state;
    let user = &mut ctx.accounts.user_profile;
    let stake = &mut user.stakes[stake_id as usize];

    // Calculate days since last claim
    let days_elapsed = (Clock::get()?.unix_timestamp - stake.last_claimed_day) / 86400;

    // Calculate rewards for each day
    for day in 0..days_elapsed {
        let day_reward = calculate_reward_for_day(
            stake.t_shares,
            global.total_t_shares,
            global.daily_inflation_rate
        );
        total_rewards += day_reward;
    }

    // Transfer from RewardVault to user
    // Update stake.last_claimed_day

    Ok(())
}
```

**Trade-off:** Lazy approach pushes compute to user claims (more expensive per claim) but eliminates crank complexity.

**Recommendation:** Start with lazy distribution for MVP simplicity, migrate to crank if gas costs become prohibitive.

---

## 6. Next.js Frontend Architecture

### 6.1 Tech Stack

```
Next.js 15 (App Router)
├── React 19
├── TypeScript
├── Tailwind CSS
├── @solana/wallet-adapter-react
├── @solana/web3.js (v1.x for now, migrate to v2 later)
├── @project-serum/anchor (Anchor client)
└── @jup-ag/api (Jupiter swap integration)
```

### 6.2 Page Structure

```
app/
├── page.tsx                 # Landing page (marketing)
├── stake/
│   └── page.tsx            # Staking interface
├── analytics/
│   └── page.tsx            # Global stats + user portfolio
├── claim/
│   └── page.tsx            # Free claim page
└── api/
    └── analytics/
        └── route.ts        # Proxy to indexer API (optional)
```

### 6.3 Wallet Connection

```typescript
// Using @solana/wallet-adapter-react
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

export default function StakePage() {
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();

  // Build stake transaction
  const handleStake = async (amount: number, days: number) => {
    const tx = await program.methods
      .stake(new BN(amount), days)
      .accounts({
        user: publicKey,
        userProfile: userProfilePDA,
        globalState: globalStatePDA,
        // ... other accounts
      })
      .transaction();

    const signature = await sendTransaction(tx, connection);
    await connection.confirmTransaction(signature, 'confirmed');
  };

  return <WalletMultiButton />;
}
```

### 6.4 Anchor Program Client

```typescript
// lib/anchor-client.ts
import { AnchorProvider, Program } from '@project-serum/anchor';
import { IDL, SolhexStaking } from './idl/solhex_staking';

export function getProgram(wallet, connection) {
  const provider = new AnchorProvider(connection, wallet, {
    commitment: 'confirmed',
  });

  return new Program<SolhexStaking>(
    IDL,
    'SoLHEXProgramID11111111111111111111111111111',
    provider
  );
}
```

### 6.5 Jupiter Swap Integration

```typescript
// lib/jupiter.ts
import { Connection, PublicKey } from '@solana/web3.js';

export async function getJupiterSwapTransaction(
  inputMint: string,      // e.g., USDC
  outputMint: string,     // SolHEX token
  amount: number,
  userPublicKey: PublicKey
) {
  // 1. Get quote
  const quoteResponse = await fetch(
    `https://quote-api.jup.ag/v6/quote?` +
    `inputMint=${inputMint}&` +
    `outputMint=${outputMint}&` +
    `amount=${amount}&` +
    `slippageBps=50`
  ).then(res => res.json());

  // 2. Get swap transaction
  const swapResponse = await fetch('https://quote-api.jup.ag/v6/swap', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      quoteResponse,
      userPublicKey: userPublicKey.toString(),
      wrapAndUnwrapSol: true,
    })
  }).then(res => res.json());

  // 3. Deserialize transaction
  const swapTransactionBuf = Buffer.from(swapResponse.swapTransaction, 'base64');
  return VersionedTransaction.deserialize(swapTransactionBuf);
}
```

**Usage in frontend:**
```typescript
// User wants to stake but only has USDC
// 1. Swap USDC → SolHEX
const swapTx = await getJupiterSwapTransaction(USDC_MINT, SOLHEX_MINT, amount, wallet.publicKey);
await wallet.signTransaction(swapTx);
await connection.sendRawTransaction(swapTx.serialize());

// 2. Wait for confirmation, then stake
await handleStake(amountInSolHEX, lockupDays);
```

---

## 7. Light Indexer Architecture

### 7.1 Purpose

The indexer solves these problems:
- **Historical data:** RPC nodes only store recent state
- **Aggregation:** Calculate global metrics (total T-shares, average stake duration)
- **User portfolio:** Show user's full stake history, rewards earned, etc.

### 7.2 Design: Polling + Event Parsing

**Tech Stack:**
- Node.js or Python
- PostgreSQL (for historical data)
- Redis (for caching hot data)
- Express/FastAPI (for read-only API)

**Polling Loop:**
```javascript
// indexer/poll-events.js
const anchor = require('@project-serum/anchor');
const { Connection } = require('@solana/web3.js');

const connection = new Connection('https://api.mainnet-beta.solana.com');
const program = anchor.workspace.SolhexStaking;

let lastProcessedSlot = loadCheckpoint(); // from DB

setInterval(async () => {
  const currentSlot = await connection.getSlot();

  // Fetch all signatures for program since lastProcessedSlot
  const signatures = await connection.getSignaturesForAddress(
    program.programId,
    { until: lastProcessedSlot, limit: 1000 }
  );

  for (const sig of signatures) {
    const tx = await connection.getParsedTransaction(sig.signature, {
      maxSupportedTransactionVersion: 0
    });

    // Parse Anchor events from logs
    const events = parseEventsFromLogs(tx.meta.logMessages, program.idl);

    for (const event of events) {
      await storeEvent(event); // Insert into DB
    }
  }

  lastProcessedSlot = currentSlot;
  saveCheckpoint(lastProcessedSlot);
}, 10000); // Poll every 10 seconds
```

**Event Parsing:**
```javascript
function parseEventsFromLogs(logs, idl) {
  const eventParser = new anchor.EventParser(program.programId, new anchor.BorshCoder(idl));
  const events = [];

  for (const log of logs) {
    if (log.startsWith('Program data: ')) {
      const base64Data = log.slice('Program data: '.length);
      const event = eventParser.parse(base64Data);
      if (event) events.push(event);
    }
  }

  return events;
}
```

### 7.3 Database Schema

```sql
CREATE TABLE stakes (
  id SERIAL PRIMARY KEY,
  stake_id BIGINT NOT NULL,
  user_pubkey TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  lockup_days INT NOT NULL,
  t_shares NUMERIC NOT NULL,
  start_timestamp BIGINT NOT NULL,
  end_timestamp BIGINT,
  rewards_claimed NUMERIC DEFAULT 0,
  penalty_paid NUMERIC DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  tx_signature TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE daily_snapshots (
  day_index INT PRIMARY KEY,
  total_t_shares NUMERIC NOT NULL,
  total_rewards NUMERIC NOT NULL,
  active_stakes INT NOT NULL,
  timestamp BIGINT NOT NULL
);

CREATE TABLE free_claims (
  user_pubkey TEXT PRIMARY KEY,
  amount NUMERIC NOT NULL,
  claimed_at TIMESTAMP NOT NULL,
  tx_signature TEXT NOT NULL
);
```

### 7.4 Read-Only API

```javascript
// indexer/api.js
const express = require('express');
const app = express();

// Global stats
app.get('/api/stats', async (req, res) => {
  const totalTShares = await db.query('SELECT SUM(t_shares) FROM stakes WHERE is_active = TRUE');
  const totalStaked = await db.query('SELECT SUM(amount) FROM stakes WHERE is_active = TRUE');
  const avgLockupDays = await db.query('SELECT AVG(lockup_days) FROM stakes WHERE is_active = TRUE');

  res.json({
    totalTShares: totalTShares.rows[0].sum,
    totalStaked: totalStaked.rows[0].sum,
    avgLockupDays: avgLockupDays.rows[0].avg,
  });
});

// User portfolio
app.get('/api/user/:pubkey/stakes', async (req, res) => {
  const stakes = await db.query(
    'SELECT * FROM stakes WHERE user_pubkey = $1 ORDER BY start_timestamp DESC',
    [req.params.pubkey]
  );
  res.json(stakes.rows);
});

// Historical chart data
app.get('/api/chart/total-t-shares', async (req, res) => {
  const snapshots = await db.query(
    'SELECT day_index, total_t_shares FROM daily_snapshots ORDER BY day_index ASC'
  );
  res.json(snapshots.rows);
});

app.listen(3001);
```

### 7.5 Deployment

**Minimal Setup:**
- **DigitalOcean Droplet** or **Fly.io** ($5-10/month)
- PostgreSQL + Node.js on same VM
- Nginx reverse proxy for API

**Production Setup:**
- **Helius RPC** (for reliable event polling with webhooks)
- **Supabase** or **Neon** (managed Postgres)
- **Vercel** for API routes (serverless functions)
- **Redis** for caching hot queries

---

## 8. Data Flow Between Components

### 8.1 Staking Flow

```
User (Frontend)
  │
  │ 1. Connect wallet
  ▼
Wallet Adapter
  │
  │ 2. Build stake transaction
  ▼
Anchor Program Client
  │
  │ 3. Sign transaction
  ▼
Solana RPC
  │
  │ 4. Submit transaction
  ▼
Anchor Program
  │
  │ 5. Execute stake instruction
  │    - Update GlobalState (total_t_shares)
  │    - Update UserProfile (stakes array)
  │    - Emit StakeCreated event
  ▼
Blockchain (confirmed)
  │
  │ 6. Poll for new transactions
  ▼
Light Indexer
  │
  │ 7. Parse events, store in DB
  ▼
PostgreSQL
  │
  │ 8. Frontend queries analytics API
  ▼
Frontend (display updated stats)
```

### 8.2 Claim Flow

```
User (Frontend)
  │
  │ 1. Click "Claim Rewards"
  ▼
Anchor Program Client
  │
  │ 2. Calculate pending rewards (lazy distribution)
  │    - Query GlobalState for daily inflation rate
  │    - Query UserProfile for stake T-shares
  │    - Calculate days since last claim
  ▼
Anchor Program
  │
  │ 3. Transfer from RewardVault to user ATA
  │    - Update stake.last_claimed_day
  │    - Emit RewardsClaimed event
  ▼
Blockchain (confirmed)
  │
  │ 4. Indexer updates user's total rewards
  ▼
Frontend (display updated balance)
```

### 8.3 Free Claim Flow

```
User (Frontend)
  │
  │ 1. Click "Claim Free Tokens"
  ▼
Frontend
  │
  │ 2. Fetch merkle proof from CDN
  │    GET /merkle-proofs/{user_pubkey}.json
  ▼
Static JSON File
  │
  │ 3. Build claim transaction with proof
  ▼
Anchor Program
  │
  │ 4. Verify merkle proof
  │    - hash(user_pubkey || amount) → leaf
  │    - compute_merkle_root(leaf, proof)
  │    - compare to GlobalState.free_claim_merkle_root
  │
  │ 5. Mint tokens to user ATA
  │    - Mark UserProfile.free_claim_consumed = true
  ▼
Blockchain (confirmed)
```

---

## 9. Build Order (Dependency-Based)

### Phase 1: Core Infrastructure (Weeks 1-2)
1. ✅ Anchor program skeleton
   - GlobalState account structure
   - UserProfile account structure
   - Basic PDAs
2. ✅ Token-2022 mint setup
   - Deploy mint with PDA authority
   - Test minting/burning
3. ✅ Basic stake/unstake instructions
   - T-share calculation logic
   - LPB/BPB bonus curves

### Phase 2: Distribution Mechanics (Week 3)
4. ✅ Lazy reward distribution
   - Calculate pending rewards on claim
   - RewardVault account
5. ✅ Early/late penalties
   - Early unstake: burn penalty
   - Late unstake: forfeit unclaimed rewards

### Phase 3: Free Claim (Week 4)
6. ✅ SOL snapshot script (off-chain)
   - Query RPC for all SOL holders at slot X
   - Build merkle tree
   - Generate proof JSON files
7. ✅ Free claim instruction
   - Merkle proof verification
   - One-time claim enforcement

### Phase 4: Frontend MVP (Weeks 5-6)
8. ✅ Next.js app setup
   - Wallet adapter integration
   - Basic stake UI
9. ✅ Anchor program client
   - Fetch user stakes
   - Display pending rewards
   - Submit transactions
10. ✅ Jupiter swap integration
    - Swap USDC → SolHEX
    - Combine with stake transaction

### Phase 5: Indexer (Week 7)
11. ✅ Event polling script
    - Poll program transactions
    - Parse Anchor events
12. ✅ PostgreSQL schema
    - Store stakes, claims, snapshots
13. ✅ Read-only API
    - `/api/stats`
    - `/api/user/:pubkey/stakes`

### Phase 6: Analytics UI (Week 8)
14. ✅ Charts and graphs
    - Total T-shares over time
    - Average stake duration
    - User portfolio view

### Phase 7: Advanced Features (Weeks 9-10)
15. ✅ Big Pay Day logic
    - Accumulate penalties in pool
    - Distribute to longest stakes
16. ✅ Referral system (optional)
    - Bonus T-shares for referrals

### Phase 8: Testing & Hardening (Weeks 11-12)
17. ✅ Devnet deployment
18. ✅ End-to-end testing
19. ✅ Security audit (self or third-party)
20. ✅ Mainnet launch

---

## 10. Technology Decisions Summary

| Decision | Choice | Rationale |
|----------|--------|-----------|
| **Smart Contract** | Anchor | Industry standard for Solana, better DX than raw Solana Program Library |
| **Token Standard** | Token-2022 | Modern standard with extensions (transfer hooks, metadata) |
| **Distribution Crank** | Lazy (MVP) → Batched Crank (later) | Simpler to start, migrate if gas costs are high |
| **Frontend** | Next.js 15 + Tailwind | SSR for marketing pages, client-side for wallet interaction |
| **Wallet Adapter** | @solana/wallet-adapter-react | De facto standard for Solana dApps |
| **Swap Integration** | Jupiter API | Deepest liquidity on Solana, easy REST API |
| **Indexer** | Node.js + PostgreSQL | Simple polling loop, no need for Geyser plugin for MVP |
| **RPC Provider** | Chainstack or Helius | Reliable, archive node support, reasonable pricing |
| **Hosting** | Vercel (frontend) + Fly.io (indexer) | Minimal ops, auto-scaling |

---

## 11. Quality Gates Met

- ✅ **Component boundaries clearly defined:** Anchor program, frontend, indexer
- ✅ **Data flow direction explicit:** User → Frontend → RPC → Program → Indexer → Frontend
- ✅ **Build order implications noted:** 8-phase dependency-based roadmap

---

## References

1. Anchor Framework Documentation: https://www.anchor-lang.com/docs
2. Solana Wallet Adapter: https://github.com/anza-xyz/wallet-adapter
3. Jupiter Swap API: https://station.jup.ag/docs/apis/swap-api
4. Token-2022 Guide: https://spl.solana.com/token-2022
5. Helius RPC Websockets: https://docs.helius.dev/solana-rpc-nodes/websocket-subscriptions
6. Bitquery Solana API: https://docs.bitquery.io/docs/blockchain/Solana

---

**Next Steps:**
- Use this architecture to structure phase plans in v2-ROADMAP.md
- Reference PDA design when writing Phase 2 (Smart Contract) plans
- Reference indexer architecture for Phase 5 (Blockchain Sync) plans
- Reference frontend structure for Phase 9 (Dashboard) plans
