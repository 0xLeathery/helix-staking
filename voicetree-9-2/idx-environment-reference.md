---
color: green
position:
  x: -124
  y: -1470
isContextNode: false
agent_name: Amy
---

# Environment Variables Reference

## Complete environment configuration for the Helix Indexer Service (worker + API)

### Required Variables

| Variable | Type | Example | Description |
|----------|------|---------|-------------|
| `DATABASE_URL` | string | `postgresql://user:pass@host:5432/db` | Neon Postgres connection string (required for both processes) |
| `PROGRAM_ID` | Pubkey | `He1ix...` | Helix staking program address to monitor |
| `PORT` | number | `3001` | HTTP port for the API server |
| `FRONTEND_URL` | string | `http://localhost:3000` | Frontend origin for CORS (supports wildcards in production) |

### Optional Variables (with defaults)

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `RPC_URL` | string | `https://api.devnet.solana.com` | ⚠️ **GOTCHA**: Defaults to devnet! Must override for mainnet |
| `POLL_INTERVAL_MS` | number | `5000` | Worker polling frequency (milliseconds) |
| `NODE_ENV` | string | `development` | Environment mode (affects logging) |

### Configuration File Location

The indexer loads environment variables through:
```typescript
// src/lib/env.ts
import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  RPC_URL: z.string().url().default('https://api.devnet.solana.com'),
  PROGRAM_ID: z.string().min(32),
  DATABASE_URL: z.string().url(),
  PORT: z.coerce.number().default(3001),
  FRONTEND_URL: z.string().url(),
  POLL_INTERVAL_MS: z.coerce.number().default(5000),
});

export const env = envSchema.parse(process.env);
```

### Validation Behavior

- **Startup failure**: Missing required vars cause immediate process exit with Zod error
- **Type coercion**: `PORT` and `POLL_INTERVAL_MS` auto-convert from strings to numbers
- **URL validation**: `RPC_URL`, `DATABASE_URL`, and `FRONTEND_URL` validated as valid URLs
- **No runtime refresh**: Changes require process restart

### Environment-Specific Examples

#### Development (.env.local)
```bash
# Local development against devnet
RPC_URL=https://api.devnet.solana.com
PROGRAM_ID=He1ix2Nmd8LSwqTG9yXPnFrPjfYC7sQv8EV8xC47pump
DATABASE_URL=postgresql://localhost:5432/helix_dev
PORT=3001
FRONTEND_URL=http://localhost:3000
POLL_INTERVAL_MS=5000
```

#### Staging
```bash
# Staging environment with devnet program
RPC_URL=https://api.devnet.solana.com
PROGRAM_ID=He1ix2Nmd8LSwqTG9yXPnFrPjfYC7sQv8EV8xC47pump
DATABASE_URL=postgresql://staging-db.neon.tech:5432/helix_staging?sslmode=require
PORT=3001
FRONTEND_URL=https://staging.helix.app
POLL_INTERVAL_MS=3000
NODE_ENV=staging
```

#### Production
```bash
# Production environment with mainnet program
RPC_URL=https://mainnet.helius-rpc.com/?api-key=YOUR_KEY
PROGRAM_ID=He1ix... # Mainnet program address
DATABASE_URL=postgresql://prod-db.neon.tech:5432/helix_prod?sslmode=require
PORT=3001
FRONTEND_URL=https://app.helix.fi
POLL_INTERVAL_MS=2000
NODE_ENV=production
```

### Performance Tuning

#### `POLL_INTERVAL_MS` Recommendations

| Environment | Recommended | Reasoning |
|-------------|------------|-----------|
| Development | `5000` (5s) | Gentle on free RPC tier |
| Staging | `3000` (3s) | Balance between freshness and load |
| Production | `1000-2000` (1-2s) | Near real-time for live users |

**Trade-offs**:
- **Lower interval**: Fresher data, higher RPC costs, more DB writes
- **Higher interval**: Cheaper operation, stale data risk, potential 1000-sig catch-up gaps

#### RPC Provider Selection

**Free Tier (Development)**
- Solana public RPC: `https://api.devnet.solana.com`
- Rate limits: ~1-2 req/s
- Suitable for: Local dev only

**Paid Tier (Staging/Production)**
- Helius: `https://mainnet.helius-rpc.com`
- QuickNode: `https://solana-mainnet.quiknode.pro`
- Triton: `https://mainnet.rpc.extrnode.com`
- Rate limits: 10-100+ req/s depending on plan

**RPC Retry Configuration** (hardcoded in `src/lib/rpc.ts`):
```typescript
import pRetry from 'p-retry';

const rpcWithRetry = pRetry(
  () => connection.getSignaturesForAddress(...),
  {
    retries: 5,
    factor: 2,        // Exponential backoff
    minTimeout: 1000, // 1s, 2s, 4s, 8s, 16s
    onFailedAttempt: (error) => {
      logger.warn({ attempt: error.attemptNumber }, 'RPC request failed, retrying...');
    },
  }
);
```

### Database Connection

**Pool Configuration** (hardcoded in `src/db/client.ts`):
```typescript
import { Pool } from '@neondatabase/serverless';

const pool = new Pool({
  connectionString: env.DATABASE_URL,
  max: 10, // Maximum 10 concurrent connections
});
```

**Connection Behavior**:
- Lazy initialization (first query triggers connection)
- Automatic reconnection on transient failures
- Graceful shutdown on SIGTERM/SIGINT

### Security Considerations

⚠️ **Never commit `.env` files to git**

Recommended secrets management:
- **Local**: `.env.local` (gitignored)
- **Staging/Production**: Vercel env vars, Railway vars, or cloud provider secrets

**DATABASE_URL Security**:
- Always use SSL (`?sslmode=require`)
- Rotate credentials quarterly
- Use read-only credentials for API process if possible

### Troubleshooting

#### "RPC rate limit exceeded"
- **Symptom**: Worker logs show 429 errors with retries exhausted
- **Fix**: Upgrade RPC provider tier or increase `POLL_INTERVAL_MS`

#### "Database connection refused"
- **Symptom**: Both processes fail with `ECONNREFUSED`
- **Check**: `DATABASE_URL` format, network access, Neon project status

#### "Indexer is behind by X hours"
- **Symptom**: `/health` endpoint shows large `behind_by_seconds`
- **Causes**:
  - 1000-signature catch-up gap (too many txns accumulated)
  - RPC failures causing batch skips
  - Database write contention
- **Fix**:
  - Lower `POLL_INTERVAL_MS` to prevent accumulation
  - Check RPC provider health
  - Scale database resources

#### "CORS errors in frontend"
- **Symptom**: Browser console shows CORS blocked requests
- **Check**: `FRONTEND_URL` exactly matches frontend origin (including protocol, port)

### Monitoring Recommendations

**Critical Metrics to Track**:
- Indexer lag (`behind_by_seconds` from `/health`)
- RPC request success rate
- Database query latency
- Worker processing rate (signatures/minute)

**Alerting Thresholds**:
- Lag > 5 minutes: Warning
- Lag > 15 minutes: Critical
- RPC error rate > 10%: Critical
- Worker process down: Critical

[[idx-infrastructure.md]]
