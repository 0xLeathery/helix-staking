# Deployment & Operations Audit Team — Reusable Configuration

**Created:** 2026-02-09
**Protocol:** HELIX Staking (Solana, Anchor 0.31, Token-2022)

## How to Invoke

> Run the deployment & operations audit team defined in .audit/deployment-ops-team.md against the current codebase.

## Team Roster

### Agent 1: Key Management Auditor
- Private key handling, multisig setup, authority lifecycle
- Scope: Anchor.toml keypairs, deploy scripts, transfer_authority/accept_authority, admin instructions
- Questions: Authority key in hardware wallet or hot wallet? Squads multisig configured? Key rotation procedure? What happens if authority key compromised? Backup authority path?

### Agent 2: Upgrade & Migration Specialist
- Program upgrade procedures, account migration safety, IDL versioning
- Scope: BPF upgradeable loader, migrate_stake instruction, account LEN changes, IDL drift
- Questions: Upgrade authority transfer to multisig planned? Can upgrade break active stakes? Account realloc safe during upgrade? IDL matches deployed program? Verifiable build hash documented?

### Agent 3: Monitoring & Alerting Analyst
- On-chain event monitoring, health checks, anomaly detection
- Scope: Indexer service, BPD lifecycle monitoring, crank reliability, error rate tracking
- Questions: Alerts for missed crank days? BPD finalization progress tracked? Authority actions logged? Large stake/unstake alerts? Token supply drift detection?

### Agent 4: Indexer Reliability Specialist
- Checkpoint recovery, data consistency, API availability
- Scope: services/indexer/, checkpoint management, Postgres, REST API
- Questions: What happens if indexer is down for 24h? Checkpoint corruption recovery? Event replay idempotent? API rate limiting? Database backup schedule?

### Agent 5: RPC & Infrastructure Specialist
- RPC provider reliability, failover, rate limits, cost management
- Scope: Frontend RPC proxy, indexer RPC connection, devnet vs mainnet config
- Questions: Single RPC provider or failover? Rate limit handling? WebSocket reconnection? Geographic distribution? Cost at scale (mainnet RPC bills)?

### Agent 6: Incident Response Planner
- Emergency procedures, rollback plans, communication protocols
- Scope: abort_bpd usage, authority emergency actions, program freeze capability
- Questions: Documented runbook for stuck BPD? Authority key compromise response? Program pause mechanism? Community communication plan? Post-mortem template?

### Agent 7: Integrator
- Cross-cutting synthesis, deployment readiness scorecard, operational risk matrix
- Tasks: Consolidate findings, create pre-mainnet checklist, identify operational single points of failure, render DEPLOYMENT READINESS (GO/CONDITIONAL/NO-GO)

## Changelog

| Date | Event |
|------|-------|
| 2026-02-09 | Team configuration created |
