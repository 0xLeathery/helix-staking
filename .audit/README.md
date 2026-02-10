# HELIX Audit Teams

Reusable multi-agent audit configurations for the HELIX staking protocol.

## Teams

| Team | File | Purpose |
|------|------|---------|
| **Security** | [security-team.md](security-team.md) | On-chain exploits, access control, CPI safety, token security, frontend |
| **Business Logic** | [business-logic-team.md](business-logic-team.md) | Economics, game theory, fairness, state machines, operations |
| **Solana Runtime** | [solana-runtime-team.md](solana-runtime-team.md) | CU budgets, account limits, clock/slot edge cases, tx size, priority fees |
| **MEV & Ordering** | [mev-ordering-team.md](mev-ordering-team.md) | Sandwich attacks, Jito bundles, crank MEV, BPD ordering, front-running |
| **Deployment & Ops** | [deployment-ops-team.md](deployment-ops-team.md) | Key management, upgrade safety, monitoring, indexer reliability, incident response |
| **User-Facing Security** | [user-facing-security-team.md](user-facing-security-team.md) | Wallet UX, phishing, math parity, data integrity, client secrets |

## How to Use

Prompt GitHub Copilot with:

- `Run the security audit team defined in .audit/security-team.md against the current codebase.`
- `Run the business logic audit team defined in .audit/business-logic-team.md against the current codebase.`
- `Run the Solana runtime audit team defined in .audit/solana-runtime-team.md against the current codebase.`
- `Run the MEV & ordering audit team defined in .audit/mev-ordering-team.md against the current codebase.`
- `Run the deployment & operations audit team defined in .audit/deployment-ops-team.md against the current codebase.`
- `Run the user-facing security audit team defined in .audit/user-facing-security-team.md against the current codebase.`

## Audit Reports

| Report | Date | Location |
|--------|------|----------|
| **Phase 8.1 Complete Audit (6-team)** | **2026-02-11** | [phase-8.1-complete-audit-feb-11-2026.md](phase-8.1-complete-audit-feb-11-2026.md) |
| Mainnet Readiness Review | 2026-02-09 | /MAINNET_READINESS_REVIEW.md |
| Business Logic Audit | 2026-02-09 | /BUSINESS_LOGIC_AUDIT.md |
| X-Ray Static Analysis | 2026-02-09 | /voicetree-9-2/xray-static-analysis-feb-9-2026.md |

## When to Re-run

- Before any mainnet deployment — full sweep with both teams
- After any instruction added/modified — targeted sweep on changed code
- After parameter changes — Stress Tester + Operations Analyst focused run
- Quarterly — full sweep to catch drift
