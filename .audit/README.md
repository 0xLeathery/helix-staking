# HELIX Audit Teams

Reusable multi-agent audit configurations for the HELIX staking protocol.

## Teams

| Team | File | Purpose |
|------|------|---------|
| **Security** | [security-team.md](security-team.md) | On-chain exploits, access control, CPI safety, token security, frontend |
| **Business Logic** | [business-logic-team.md](business-logic-team.md) | Economics, game theory, fairness, state machines, operations |

## How to Use

Prompt GitHub Copilot with:

- `Run the security audit team defined in .audit/security-team.md against the current codebase.`
- `Run the business logic audit team defined in .audit/business-logic-team.md against the current codebase.`

## Audit Reports

| Report | Date | Location |
|--------|------|----------|
| Mainnet Readiness Review | 2026-02-09 | /MAINNET_READINESS_REVIEW.md |
| Business Logic Audit | 2026-02-09 | /BUSINESS_LOGIC_AUDIT.md |
| X-Ray Static Analysis | 2026-02-09 | /voicetree-9-2/xray-static-analysis-feb-9-2026.md |

## When to Re-run

- Before any mainnet deployment — full sweep with both teams
- After any instruction added/modified — targeted sweep on changed code
- After parameter changes — Stress Tester + Operations Analyst focused run
- Quarterly — full sweep to catch drift
