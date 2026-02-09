---
color: red
agent_name: Amy
---

# Operations Runbook

## Incident response, troubleshooting, and operational procedures for the Helix Indexer Service

---

## Quick Health Check

```bash
# Check if both processes are running
ps aux | grep -E "(worker|api)/index.ts"

# Check API health endpoint
curl http://localhost:3001/health | jq

# Check database connectivity
psql $DATABASE_URL -c "SELECT COUNT(*) FROM checkpoints;"

# Check indexer lag
curl http://localhost:3001/health | jq '.indexer.behind_by_seconds'
```

**Healthy State**:
- Both processes running
- `/health` returns 200
- `behind_by_seconds` < 60

---

## Common Issues & Resolution

### Issue 1: Indexer Falling Behind

**Symptoms**:
- `/health` shows `behind_by_seconds` increasing over time
- Frontend shows stale data

**Diagnosis**:
```bash
# Check current lag
curl http://localhost:3001/health | jq '.indexer'

# Check worker logs for errors
tail -f logs/worker.log | grep -E "(error|failed)"

# Check RPC response times
time curl -X POST $RPC_URL \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"getSlot"}'
```

**Root Causes & Fixes**:

#### A. RPC Rate Limiting
**Evidence**: Worker logs show 429 errors or timeout failures

**Fix**:
```bash
# Option 1: Increase poll interval (temporary)
export POLL_INTERVAL_MS=10000  # Slow down to 10s
npm run dev:worker

# Option 2: Upgrade RPC provider tier (permanent)
# Update RPC_URL to paid tier endpoint
```

#### B. 1000-Signature Catch-up Gap
**Evidence**: Large spike in activity, `processed_count` jumping by 1000

**Explanation**: Worker can only fetch 1000 sigs per poll. If >1000 txns accumulated between polls, older ones are permanently missed.

**Fix**:
```bash
# Prevention: Reduce poll interval during high activity
export POLL_INTERVAL_MS=2000

# Recovery: No automatic fix - missed transactions are lost
# Manual: Re-index from scratch if critical
```

#### C. Database Write Contention
**Evidence**: Worker logs show slow query warnings

**Fix**:
```bash
# Check database performance
psql $DATABASE_URL -c "
  SELECT query, calls, mean_exec_time
  FROM pg_stat_statements
  ORDER BY mean_exec_time DESC
  LIMIT 10;
"

# Scale database resources (Neon Console)
# Or optimize indexes if needed
```

---

### Issue 2: Worker Process Crashed

**Symptoms**:
- Worker process not in `ps aux` output
- No recent entries in worker logs

**Diagnosis**:
```bash
# Check exit status
tail -100 logs/worker.log

# Common crash reasons:
# - Unhandled promise rejection
# - Out of memory
# - DATABASE_URL invalid
```

**Recovery**:
```bash
# Restart worker (using process manager)
pm2 restart helix-worker

# Or manually
npm run dev:worker

# Verify checkpoint preserved
psql $DATABASE_URL -c "SELECT * FROM checkpoints;"
```

**Prevention**:
- Use process manager (PM2, systemd, Docker restart policies)
- Monitor with health checks (e.g., every 30s)
- Set up alerting for process down

---

### Issue 3: API Returning 500 Errors

**Symptoms**:
- Frontend shows errors
- `/health` returns 503 or 500

**Diagnosis**:
```bash
# Check API logs
tail -f logs/api.log

# Test database connection
psql $DATABASE_URL -c "SELECT 1;"

# Check if API process is running
ps aux | grep "api/index.ts"
```

**Root Causes & Fixes**:

#### A. Database Connection Exhausted
**Evidence**: API logs show "no more connections available"

**Fix**:
```bash
# Check active connections
psql $DATABASE_URL -c "
  SELECT count(*)
  FROM pg_stat_activity
  WHERE datname = current_database();
"

# If at max (10), restart API to reset pool
pm2 restart helix-api

# Long-term: Optimize queries or scale DB
```

#### B. Query Timeout
**Evidence**: API logs show specific endpoint timing out

**Fix**:
```sql
-- Identify slow queries
SELECT query, mean_exec_time, calls
FROM pg_stat_statements
WHERE mean_exec_time > 1000  -- >1 second
ORDER BY mean_exec_time DESC;

-- Add missing indexes if needed
CREATE INDEX CONCURRENTLY idx_name ON table_name (column);
```

---

### Issue 4: Missing Events in Database

**Symptoms**:
- User reports stake not showing in frontend
- Event count doesn't match on-chain data

**Diagnosis**:
```bash
# Check if transaction was indexed
psql $DATABASE_URL -c "
  SELECT * FROM stake_created_events
  WHERE signature = 'TRANSACTION_SIGNATURE';
"

# Check if signature was processed
psql $DATABASE_URL -c "
  SELECT * FROM checkpoints
  WHERE program_id = '$PROGRAM_ID';
"

# Compare checkpoint slot vs transaction slot
solana confirm TRANSACTION_SIGNATURE -u $RPC_URL
```

**Root Causes**:

#### A. Transaction Before Indexer Started
**Evidence**: Transaction slot < checkpoint `last_slot`

**Resolution**: This is expected. Indexer only processes forward from checkpoint.

**Fix**: If historical data needed, re-index from genesis or earlier checkpoint.

#### B. Signature Processing Failed
**Evidence**: Worker logs show error for that specific signature

**Resolution**: Individual failure doesn't crash worker, but event is lost.

**Fix**: Manual backfill or re-index if critical.

#### C. Wrong Program ID
**Evidence**: Transaction exists but is for different program

**Fix**: Verify `PROGRAM_ID` env var matches actual deployed program.

---

### Issue 5: CORS Errors in Frontend

**Symptoms**:
- Browser console: "blocked by CORS policy"
- Requests fail with 0 status code

**Diagnosis**:
```bash
# Check CORS config
curl -I http://localhost:3001/api/stats \
  -H "Origin: http://localhost:3000"

# Should include:
# Access-Control-Allow-Origin: http://localhost:3000
# Access-Control-Allow-Credentials: true
```

**Fix**:
```bash
# Update FRONTEND_URL to match exact origin
export FRONTEND_URL=http://localhost:3000  # Include port!

# Restart API
pm2 restart helix-api

# Verify
curl -v http://localhost:3001/api/stats \
  -H "Origin: http://localhost:3000" 2>&1 | grep -i "access-control"
```

---

## Deployment Procedures

### Initial Deployment

```bash
# 1. Set up environment
cp .env.example .env
# Edit .env with production values

# 2. Install dependencies
npm install

# 3. Run database migrations
npm run db:migrate

# 4. Verify database schema
npm run db:studio  # Opens Drizzle Studio

# 5. Start worker (indexes from current slot)
pm2 start npm --name helix-worker -- run dev:worker

# 6. Verify worker is processing
pm2 logs helix-worker

# 7. Start API
pm2 start npm --name helix-api -- run dev:api

# 8. Verify API is responding
curl http://localhost:3001/health

# 9. Save PM2 config
pm2 save
pm2 startup  # Follow instructions
```

### Rolling Update (Zero Downtime)

```bash
# 1. Pull latest code
git pull origin main

# 2. Install dependencies
npm install

# 3. Update API first (no state, safe to restart)
pm2 reload helix-api

# 4. Wait 30s for API to stabilize
sleep 30

# 5. Update worker (graceful shutdown)
pm2 reload helix-worker --update-env

# 6. Monitor for errors
pm2 logs --lines 50
```

### Database Migration

```bash
# 1. Generate migration
npm run db:generate

# 2. Review migration in drizzle/migrations/
cat drizzle/migrations/0001_*.sql

# 3. Apply to staging first
DATABASE_URL=$STAGING_DB npm run db:migrate

# 4. Verify schema
psql $STAGING_DB -c "\dt"

# 5. Test on staging
curl http://staging-api.helix.app/health

# 6. Apply to production (during maintenance window)
DATABASE_URL=$PROD_DB npm run db:migrate

# 7. Restart both processes
pm2 restart all
```

---

## Monitoring & Alerting

### Critical Metrics

| Metric | Source | Alert Threshold |
|--------|--------|----------------|
| Indexer Lag | `/health` endpoint | > 300 seconds |
| Worker Process Uptime | PM2/systemd | Process down |
| API Process Uptime | PM2/systemd | Process down |
| RPC Error Rate | Worker logs | > 10% |
| Database Connection Pool | API logs | > 8/10 connections |
| Disk Space | Server monitoring | > 80% |

### Example Prometheus Alerts

```yaml
groups:
  - name: helix-indexer
    rules:
      - alert: IndexerHighLag
        expr: helix_indexer_lag_seconds > 300
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "Indexer is >5min behind"

      - alert: IndexerDown
        expr: up{job="helix-worker"} == 0
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: "Worker process is down"
```

### Health Check Endpoints for Monitoring

```bash
# Uptime monitoring (e.g., UptimeRobot, Pingdom)
URL: https://api.helix.app/health
Method: GET
Expected: 200 status code
Frequency: Every 60 seconds

# Advanced check with lag validation
curl https://api.helix.app/health | jq -e '.indexer.behind_by_seconds < 300'
# Exit code 0 = healthy, 1 = unhealthy
```

---

## Backup & Recovery

### Checkpoint Backup

```bash
# Backup checkpoint state (for disaster recovery)
psql $DATABASE_URL -c "
  COPY checkpoints TO STDOUT WITH CSV HEADER
" > checkpoint_backup_$(date +%Y%m%d).csv

# Restore checkpoint
psql $DATABASE_URL -c "
  TRUNCATE checkpoints;
  COPY checkpoints FROM STDIN WITH CSV HEADER;
" < checkpoint_backup_20240208.csv
```

### Full Re-index from Scratch

```bash
# 1. Stop worker
pm2 stop helix-worker

# 2. Clear all event tables (DESTRUCTIVE!)
psql $DATABASE_URL <<EOF
  TRUNCATE
    protocol_initialized_events,
    stake_created_events,
    stake_ended_events,
    rewards_claimed_events,
    inflation_distributed_events,
    admin_minted_events,
    claim_period_started_events,
    tokens_claimed_events,
    vested_tokens_withdrawn_events,
    claim_period_ended_events,
    big_pay_day_distributed_events,
    bpd_aborted_events,
    checkpoints
  CASCADE;
EOF

# 3. Restart worker (will start from current slot)
pm2 start helix-worker

# 4. Monitor progress
watch -n 5 "curl -s http://localhost:3001/health | jq '.indexer.processed_count'"
```

**Note**: Re-indexing only captures events from current slot forward. Historical data before restart is lost unless using archive node.

### Historical Backfill

To index historical data:

```bash
# Option 1: Use archive node RPC (expensive)
export RPC_URL=https://archive.helius-rpc.com

# Option 2: Request historical transaction dump from program authority
# (if program emits all events in a migration transaction)
```

---

## Performance Optimization

### Query Optimization

```sql
-- Analyze table statistics
ANALYZE stake_created_events;
ANALYZE inflation_distributed_events;

-- Find missing indexes
SELECT schemaname, tablename, attname, n_distinct, correlation
FROM pg_stats
WHERE schemaname = 'public'
  AND correlation < 0.1
  AND n_distinct > 100;

-- Create helpful indexes
CREATE INDEX CONCURRENTLY idx_stake_created_slot
  ON stake_created_events(slot DESC);

CREATE INDEX CONCURRENTLY idx_inflation_day
  ON inflation_distributed_events(day DESC);
```

### Polling Tuning

```bash
# High-traffic periods: Aggressive polling
export POLL_INTERVAL_MS=1000

# Low-traffic periods: Conservative polling
export POLL_INTERVAL_MS=5000

# Restart worker to apply
pm2 reload helix-worker --update-env
```

### Database Connection Pooling

```typescript
// Increase pool size for high-traffic API
// In src/db/client.ts:
const pool = new Pool({
  connectionString: env.DATABASE_URL,
  max: 20,  // Default is 10
});
```

---

## Security Hardening

### Production Checklist

- [ ] **Environment Variables**: Stored in secure vault (not .env files)
- [ ] **Database Credentials**: Rotated quarterly
- [ ] **RPC URL**: Use paid tier with authentication
- [ ] **CORS**: Locked to specific frontend domain (no wildcards)
- [ ] **Rate Limiting**: Implemented on API endpoints
- [ ] **HTTPS**: API behind reverse proxy with TLS
- [ ] **Firewall**: Database only accessible from API/worker IPs
- [ ] **Logging**: Mask sensitive data (signatures, pubkeys OK)
- [ ] **Alerts**: Set up for critical failures
- [ ] **Backups**: Automated daily database snapshots

### Incident Response Plan

1. **Detection**: Monitoring alert triggered
2. **Assessment**: Check health endpoint, logs, and metrics
3. **Mitigation**: Apply fix from runbook or failover
4. **Communication**: Update status page, notify team
5. **Resolution**: Verify metrics returned to normal
6. **Post-mortem**: Document root cause, update runbook

---

## Useful Commands

```bash
# View worker logs in real-time
pm2 logs helix-worker --lines 100

# View API logs
pm2 logs helix-api --lines 100

# Restart both processes
pm2 restart all

# Check process status
pm2 status

# Monitor system resources
pm2 monit

# Database query performance
psql $DATABASE_URL -c "
  SELECT * FROM pg_stat_statements
  ORDER BY total_exec_time DESC
  LIMIT 10;
"

# Check indexer progress
watch -n 5 "curl -s http://localhost:3001/health | jq"

# Count events by type
psql $DATABASE_URL -c "
  SELECT
    'stake_created' AS event, COUNT(*) FROM stake_created_events
  UNION ALL SELECT
    'stake_ended', COUNT(*) FROM stake_ended_events
  UNION ALL SELECT
    'inflation_distributed', COUNT(*) FROM inflation_distributed_events;
"

# Find slow queries
psql $DATABASE_URL -c "
  SELECT query, mean_exec_time, calls
  FROM pg_stat_statements
  WHERE mean_exec_time > 100
  ORDER BY mean_exec_time DESC;
"
```

---

## Escalation Contacts

| Issue Type | Contact | SLA |
|------------|---------|-----|
| Database down | Neon Support | 15 min |
| RPC rate limits | Helius/QuickNode Support | 1 hour |
| Worker/API bugs | Dev Team (GitHub Issues) | Best effort |
| Infrastructure | DevOps Team | 30 min |

---

[[idx-infrastructure.md]]
