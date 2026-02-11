---
color: orange
position:
  x: 1398
  y: 203
isContextNode: false
---
# Module 3: Indexer Service (Event Processor & REST API)

**Parent**: [[run_me_context_1770768781075.md]]

## Purpose

TypeScript-based event indexer that polls Solana for program transactions, decodes Anchor events, stores them in PostgreSQL, and exposes REST API for frontend analytics, leaderboard, and whale tracking. Enables fast queries without hitting RPC limits.

## Architecture Flow

```mermaid
flowchart TD
    A[Poller] -->|getSignaturesForAddress| B[Solana RPC]
    B -->|transaction signatures| C[Decoder]
    C -->|getTransaction| B
    C -->|decode events| D[Processor]
    
    D -->|insert| E[PostgreSQL]
    D -->|update checkpoint| F[Checkpoint File]
    
    G[REST API] -->|query| E
    G -->|response| H[Frontend]
    
    I[Worker Loop] --> A
    F --> I
```

## Worker Pipeline

```mermaid
sequenceDiagram
    participant W as Worker
    participant P as Poller
    participant D as Decoder
    participant PR as Processor
    participant DB as Database
    
    W->>P: Poll for new signatures
    P->>Solana: getSignaturesForAddress(programId, lastSig)
    Solana-->>P: signatures[]
    
    P->>D: Fetch & decode transactions
    D->>Solana: getTransaction(sig)
    Solana-->>D: transaction data
    D->>D: Parse Anchor events
    
    D-->>PR: Decoded events
    PR->>DB: Batch insert events
    PR->>DB: Update aggregates
    
    W->>W: Save checkpoint
    W->>W: Sleep 5s
```

## Database Schema

```mermaid
erDiagram
    stakes {
        text stake_pubkey PK
        text wallet
        bigint staked_amount
        bigint t_shares
        bigint start_slot
        int lock_duration_days
        bigint maturity_slot
        boolean is_active
        timestamp created_at
    }
    
    rewards {
        text id PK
        text wallet
        bigint amount
        bigint slot
        timestamp timestamp
    }
    
    distributions {
        text id PK
        bigint slot
        bigint total_distributed
        int num_stakes_processed
        timestamp timestamp
    }
    
    whale_activity {
        text id PK
        text wallet
        text event_type
        bigint amount
        bigint slot
        timestamp timestamp
    }
    
    stakes ||--o{ rewards : "earns"
    stakes ||--o{ whale_activity : "generates"
```

## REST API Endpoints

| Endpoint | Method | Purpose | Query Params |
|----------|--------|---------|--------------|
| `/health` | GET | Service health check | - |
| `/stakes` | GET | All stakes (paginated) | `?wallet=...&limit=50` |
| `/stats` | GET | Global statistics | - |
| `/leaderboard` | GET | Top stakers by T-Shares | `?limit=100` |
| `/distributions` | GET | BPD distribution history | `?limit=50` |
| `/claims` | GET | Free claim events | `?wallet=...` |
| `/whale-activity` | GET | Large transactions feed | `?minAmount=1000000` |

## Event Types Decoded

| Event | Emitted By | Fields | Purpose |
|-------|-----------|--------|---------|
| `StakeCreated` | `create_stake` | `wallet, amount, t_shares, duration` | Track new stakes |
| `StakeEnded` | `unstake` | `wallet, amount, penalty, rewards` | Track unstakes |
| `RewardsClaimed` | `claim_rewards` | `wallet, amount` | Aggregate rewards |
| `BpdTriggered` | `trigger_big_pay_day` | `slot, total_shares` | BPD cycle start |
| `BpdFinalized` | `finalize_bpd_calculation` | `total_distributed, num_stakes` | BPD completion |
| `FreeClaimed` | `free_claim` | `wallet, amount, immediate, vested` | Airdrop claims |
| `VestedWithdrawn` | `withdraw_vested` | `wallet, amount` | Vesting unlocks |

## Notable Gotchas

### 🔴 CRITICAL ISSUES

1. **No transaction confirmation check**
   - **Issue**: Poller processes all signatures without checking `confirmationStatus`
   - **Impact**: Might index reverted/dropped transactions
   - **Mitigation**: RPC default is `finalized` but should be explicit

2. **Single-threaded polling**
   - **Issue**: Worker processes transactions sequentially
   - **Impact**: Backlog during high activity (> 100 tx/s)
   - **Mitigation**: Batch processing helps but not parallelized

3. **No dead letter queue**
   - **Issue**: Failed transaction decoding logs error and continues
   - **Impact**: Silent data loss if Anchor IDL changes or malformed event
   - **Workaround**: Monitor error logs, replay from checkpoint

### ⚠️ Operational Risks

- **RPC rate limits**: No exponential backoff on 429 errors
- **Database connection pool**: Fixed at 10 connections (could exhaust under load)
- **Checkpoint corruption**: If process killed mid-write, checkpoint.json can be invalid
- **No metrics**: No Prometheus/Datadog instrumentation for monitoring

### 💡 Implementation Details

- **Checkpoint format**: JSON file with `{ lastSignature, lastSlot }`
- **Polling interval**: 5 seconds (configurable via env var)
- **Batch size**: Fetches 1000 signatures per poll
- **Event decoding**: Uses Anchor's `BorshCoder` with program IDL
- **CORS**: Single origin from `FRONTEND_URL` env var (no multi-origin support)

## Key Files

| File | Purpose |
|------|---------|
| `services/indexer/src/worker/index.ts` | Main worker entry point |
| `services/indexer/src/worker/poller.ts` | Signature fetching logic |
| `services/indexer/src/worker/decoder.ts` | Anchor event decoding |
| `services/indexer/src/worker/processor.ts` | Database insert/update logic |
| `services/indexer/src/worker/checkpoint.ts` | Checkpoint persistence |
| `services/indexer/src/api/index.ts` | Express server setup |
| `services/indexer/src/api/routes/*.ts` | REST endpoint handlers |
| `services/indexer/src/db/schema.ts` | Drizzle ORM schema |
| `services/indexer/src/db/client.ts` | PostgreSQL connection pool |
| `services/indexer/src/lib/anchor.ts` | Program/IDL loading |

## Environment Variables

| Variable | Purpose | Example |
|----------|---------|---------|
| `SOLANA_RPC_URL` | Solana cluster endpoint | `https://api.devnet.solana.com` |
| `PROGRAM_ID` | Helix staking program address | `Helix...` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@localhost/helix` |
| `PORT` | API server port | `3001` |
| `FRONTEND_URL` | CORS allowed origin | `http://localhost:3000` |
| `CHECKPOINT_PATH` | Checkpoint file location | `./checkpoint.json` |

## Deployment & Operations

### Starting the Service

```bash
# 1. Setup database
npm run db:migrate

# 2. Start worker (indexing)
npm run worker

# 3. Start API (separate process)
npm run api
```

### Monitoring

```bash
# Check health
curl http://localhost:3001/health

# View indexed stats
curl http://localhost:3001/stats

# Tail worker logs
journalctl -u indexer-worker -f
```

### Recovery Procedures

**If indexer falls behind:**
1. Check RPC rate limits
2. Increase `POLL_INTERVAL_MS` to reduce load
3. Consider replaying from earlier checkpoint

**If database corrupted:**
1. Stop worker
2. Drop tables: `npm run db:drop`
3. Recreate schema: `npm run db:migrate`
4. Delete checkpoint.json
5. Restart worker (full reindex)

**If checkpoint lost:**
1. Manually create `checkpoint.json` with last known signature
2. Worker will resume from that point

## Performance Benchmarks

- **Indexing speed**: ~500 tx/min on single thread
- **API latency**: < 50ms for most queries (with indexes)
- **Database size**: ~100MB per 1M transactions
- **Memory usage**: ~200MB worker + 150MB API

## Tech Debt

1. **No websocket subscriptions**: Polling is inefficient vs `onProgramAccountChange`
2. **No pagination metadata**: API returns arrays without total count
3. **No query optimization**: Some endpoints do full table scans
4. **No caching layer**: Redis would reduce DB load for hot queries
5. **No graceful shutdown**: Worker doesn't flush pending writes on SIGTERM
6. **Hardcoded batch size**: Should be configurable per deployment scale

## Missing Indexes

Recommend adding:
```sql
CREATE INDEX idx_stakes_wallet ON stakes(wallet);
CREATE INDEX idx_whale_activity_slot ON whale_activity(slot DESC);
CREATE INDEX idx_rewards_timestamp ON rewards(timestamp DESC);
```

## Security Considerations

✅ **Implemented**:
- Input validation on API query params
- CORS restricted to single origin
- No user authentication (public read-only API)

⚠️ **Risks**:
- **DATABASE_URL exposure**: Leaked env var grants DB write access
- **No rate limiting**: API can be DoS'd
- **No input sanitization**: SQL injection risk if switching from Drizzle ORM

[[/Users/annon/projects/solhex/voicetree-9-2/module-1-onchain-program.md]]
[[/Users/annon/projects/solhex/voicetree-9-2/module-2-frontend-dashboard.md]]
[[/Users/annon/projects/solhex/voicetree-9-2/module-4-tokenomics-engine.md]]
[[/Users/annon/projects/solhex/voicetree-9-2/module-6-bpd-distribution-system.md]]
[[/Users/annon/projects/solhex/voicetree-9-2/module-5-testing-infrastructure.md]]
[[/Users/annon/projects/solhex/voicetree-9-2/module-7-free-claim-system.md]]
[[/Users/annon/projects/solhex/voicetree-9-2/codebase-architecture-map.md]]