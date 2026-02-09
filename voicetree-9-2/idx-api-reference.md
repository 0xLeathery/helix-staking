---
color: green
agent_name: Amy
---

# REST API Reference

## Complete endpoint documentation with request/response examples

Base URL: `http://localhost:3001` (development)

### Authentication

Currently **no authentication required** (public read-only API). All endpoints accept `GET` requests.

### CORS Configuration

- **Allowed Origin**: Value from `FRONTEND_URL` env var
- **Credentials**: Enabled
- **Methods**: GET, POST, OPTIONS (though only GET is used)

---

## Endpoints

### 1. Health Check

**Endpoint**: `GET /health`

**Purpose**: Service health status and indexer synchronization lag

**Query Parameters**: None

**Response Schema**:
```typescript
{
  status: 'ok' | 'degraded';
  database: 'connected' | 'error';
  indexer: {
    program_id: string;           // Helix program address
    last_signature: string | null; // Most recent indexed signature
    last_slot: number | null;      // Most recent indexed slot
    processed_count: number;       // Total signatures processed
    current_slot: number;          // Current Solana network slot
    behind_by_seconds: number;     // Estimated lag (slots * 0.4s)
  };
}
```

**Example Response**:
```json
{
  "status": "ok",
  "database": "connected",
  "indexer": {
    "program_id": "He1ix2Nmd8LSwqTG9yXPnFrPjfYC7sQv8EV8xC47pump",
    "last_signature": "5J7ZqF...",
    "last_slot": 245621234,
    "processed_count": 15234,
    "current_slot": 245621250,
    "behind_by_seconds": 6.4
  }
}
```

**Status Codes**:
- `200 OK`: All systems operational
- `503 Service Unavailable`: Database disconnected or checkpoint missing

**Use Cases**:
- Frontend loading state (show "Syncing..." if `behind_by_seconds > 30`)
- DevOps monitoring (alert if `behind_by_seconds > 300`)

---

### 2. Protocol Statistics

**Endpoint**: `GET /api/stats`

**Purpose**: Aggregate protocol metrics (total staked, share rate, etc.)

**Query Parameters**: None

**Response Schema**:
```typescript
{
  total_stakes_created: number;
  total_stakes_ended: number;
  total_rewards_claimed: string;      // BigInt as string
  latest_share_rate: string | null;   // BigInt as string
  total_shares: string | null;        // BigInt as string
  current_day: number | null;
  total_inflation_distributed: string; // BigInt as string
  average_stake_duration_days: number | null;
}
```

**Example Response**:
```json
{
  "total_stakes_created": 1523,
  "total_stakes_ended": 234,
  "total_rewards_claimed": "450000000000000",
  "latest_share_rate": "1000000000",
  "total_shares": "567890000000000",
  "current_day": 123,
  "total_inflation_distributed": "1234567890000000",
  "average_stake_duration_days": 87.5
}
```

**Implementation Notes**:
- Aggregates across all event tables
- `average_stake_duration_days` calculated from `StakeCreated.days` (arithmetic mean)
- Returns `null` for metrics when no events exist yet

**Use Cases**:
- Homepage statistics dashboard
- Protocol health monitoring

---

### 3. Historical Share Rate

**Endpoint**: `GET /api/stats/history`

**Purpose**: Time-series data of share rate evolution for charting

**Query Parameters**: None

**Response Schema**:
```typescript
{
  data: Array<{
    day: number;
    share_rate: string;  // BigInt as string
    slot: number;
  }>;
}
```

**Example Response**:
```json
{
  "data": [
    { "day": 1, "share_rate": "1000000000", "slot": 200000000 },
    { "day": 2, "share_rate": "1000123456", "slot": 200216000 },
    { "day": 3, "share_rate": "1000247890", "slot": 200432000 }
  ]
}
```

**Data Source**: `inflation_distributed_events` table, ordered by day ascending

**Use Cases**:
- Line chart of share rate growth over time
- Historical APY calculations

---

### 4. User Stakes

**Endpoint**: `GET /api/stakes`

**Purpose**: Paginated list of stake creation events, optionally filtered by user

**Query Parameters**:
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `user` | string (Pubkey) | No | - | Filter by user public key |
| `limit` | number | No | `50` | Results per page (max 100) |
| `offset` | number | No | `0` | Pagination offset |

**Response Schema**:
```typescript
{
  stakes: Array<{
    id: number;              // Database serial ID
    signature: string;
    slot: number;
    created_at: string;      // ISO 8601 timestamp
    user: string;            // Pubkey
    stake_id: number;        // On-chain stake ID
    amount: string;          // BigInt as string
    t_shares: string;        // BigInt as string
    days: number;
    share_rate: string;      // BigInt as string
  }>;
  total: number;             // Total count (for pagination)
}
```

**Example Request**:
```
GET /api/stakes?user=7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU&limit=20&offset=0
```

**Example Response**:
```json
{
  "stakes": [
    {
      "id": 1234,
      "signature": "5J7ZqF...",
      "slot": 245621234,
      "created_at": "2024-02-08T15:30:00.000Z",
      "user": "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
      "stake_id": 42,
      "amount": "5000000000000",
      "t_shares": "6250000000000",
      "days": 90,
      "share_rate": "1000000000"
    }
  ],
  "total": 127
}
```

**Sorting**: Descending by `slot` (most recent first)

**Use Cases**:
- User portfolio view (stakes list)
- Admin analytics (all stakes with pagination)

---

### 5. Distribution Chart Data

**Endpoint**: `GET /api/distributions/chart`

**Purpose**: Time-series inflation distribution data optimized for charting

**Query Parameters**: None

**Response Schema**:
```typescript
{
  data: Array<{
    day: number;
    amount: string;        // BigInt as string
    new_share_rate: string;
    total_shares: string;
    slot: number;
    days_elapsed: number;  // Catch-up indicator
  }>;
}
```

**Example Response**:
```json
{
  "data": [
    {
      "day": 1,
      "amount": "123456789000",
      "new_share_rate": "1000123456",
      "total_shares": "567890000000",
      "slot": 200216000,
      "days_elapsed": 1
    }
  ]
}
```

**Data Source**: `inflation_distributed_events`, ordered by day ascending

**Implementation Notes**:
- `days_elapsed > 1` indicates multi-day catch-up event (cranked after missing days)

**Use Cases**:
- Bar chart of daily inflation distribution
- Inflation schedule verification

---

### 6. User Claims

**Endpoint**: `GET /api/claims/tokens`

**Purpose**: Free claim history for a specific user

**Query Parameters**:
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `claimer` | string (Pubkey) | Yes | - | Claimer public key |
| `limit` | number | No | `50` | Results per page |
| `offset` | number | No | `0` | Pagination offset |

**Response Schema**:
```typescript
{
  claims: Array<{
    id: number;
    signature: string;
    slot: number;
    created_at: string;
    timestamp: number;           // On-chain Unix timestamp
    claimer: string;
    snapshot_wallet: string;
    claim_period_id: number;
    snapshot_balance: string;
    base_amount: string;
    bonus_bps: number;           // Speed bonus (0-3000)
    days_elapsed: number;
    total_amount: string;
    immediate_amount: string;    // 10% unlocked
    vesting_amount: string;      // 90% vesting
    vesting_end_slot: string;
  }>;
  total: number;
}
```

**Example Request**:
```
GET /api/claims/tokens?claimer=7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU
```

**Error Handling**:
- `400 Bad Request`: Missing `claimer` parameter
- `200 OK` with `claims: []`: User has no claims

**Use Cases**:
- Claim history page in frontend
- Vesting schedule display

---

### 7. Leaderboard

**Endpoint**: `GET /api/leaderboard`

**Purpose**: Top stakers by total HELIX staked

**Query Parameters**:
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `limit` | number | No | `100` | Number of top stakers (max 500) |

**Response Schema**:
```typescript
{
  leaderboard: Array<{
    user: string;              // Pubkey
    total_staked: string;      // Sum of all stake amounts (BigInt)
    stake_count: number;       // Number of stakes created
    total_t_shares: string;    // Sum of all T-shares (BigInt)
    first_stake_slot: number;  // Earliest stake slot
  }>;
}
```

**Example Response**:
```json
{
  "leaderboard": [
    {
      "user": "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
      "total_staked": "100000000000000",
      "stake_count": 15,
      "total_t_shares": "125000000000000",
      "first_stake_slot": 200000000
    }
  ]
}
```

**Sorting**: Descending by `total_staked`

**Implementation**: Aggregates `stake_created_events` grouped by `user`

**Use Cases**:
- Leaderboard page
- Whale identification

---

### 8. Whale Activity

**Endpoint**: `GET /api/whale-activity`

**Purpose**: Recent large stake events (whale watching)

**Query Parameters**:
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `threshold` | string | No | `1000000000000` | Minimum stake amount (BigInt) |
| `limit` | number | No | `20` | Results to return |

**Response Schema**:
```typescript
{
  activity: Array<{
    signature: string;
    slot: number;
    created_at: string;
    user: string;
    stake_id: number;
    amount: string;
    t_shares: string;
    days: number;
    share_rate: string;
  }>;
}
```

**Example Request**:
```
GET /api/whale-activity?threshold=5000000000000&limit=10
```

**Sorting**: Descending by `slot` (most recent first)

**Use Cases**:
- Protocol activity feed
- Large stake alerts

---

## Error Responses

### Standard Error Format
```json
{
  "error": "Bad Request",
  "message": "Missing required parameter: user",
  "statusCode": 400
}
```

### Common Status Codes
- `200 OK`: Success
- `400 Bad Request`: Invalid query parameters
- `404 Not Found`: Endpoint doesn't exist
- `500 Internal Server Error`: Database or processing error
- `503 Service Unavailable`: Database disconnected (health check only)

### Rate Limiting

Currently **no rate limiting** implemented. Consider adding in production:
- Recommended: 100 req/min per IP
- Tool: `@fastify/rate-limit` plugin

---

## Data Format Notes

### BigInt Values
All Solana u64/u128 values returned as strings to avoid JavaScript precision loss:
```typescript
// ❌ Incorrect (loses precision)
{ amount: 123456789012345678 }

// ✅ Correct (preserves precision)
{ amount: "123456789012345678" }
```

Frontend must parse using `BigInt()` constructor or bn.js library.

### Pubkey Format
All Solana public keys returned as base58-encoded strings:
```
"7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU"
```

### Timestamps
- `created_at`: Database insertion time (ISO 8601 with timezone)
- `timestamp`: On-chain Unix timestamp (seconds since epoch)
- `slot`: Solana slot number

---

## Performance Characteristics

| Endpoint | Avg Latency | Query Complexity | Cache-able |
|----------|-------------|------------------|------------|
| `/health` | <50ms | Simple (1 query) | No |
| `/api/stats` | 100-200ms | Complex (5 aggregations) | Yes (5min) |
| `/api/stats/history` | <100ms | Simple (1 query) | Yes (1min) |
| `/api/stakes` | <100ms | Simple (1 indexed query) | No |
| `/api/distributions/chart` | <100ms | Simple (1 query) | Yes (1min) |
| `/api/claims/tokens` | <100ms | Simple (1 indexed query) | No |
| `/api/leaderboard` | 200-500ms | Complex (GROUP BY aggregation) | Yes (5min) |
| `/api/whale-activity` | <100ms | Simple (1 indexed query) | Yes (30s) |

**Caching Strategy** (not currently implemented):
- Consider Redis/Memcached for stats and leaderboard endpoints
- Invalidate on new events processed

[[idx-rest-api.md]]
