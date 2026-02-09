# Business Logic Audit Team — Reusable Configuration

**Created:** 2026-02-09
**Protocol:** HELIX Staking (Solana, Anchor 0.31, Token-2022)

## How to Invoke

> Run the business logic audit team defined in .audit/business-logic-team.md against the current codebase.

## Team Roster

### Agent 1: Economist
- Inflation model, tokenomics, supply dynamics
- Scope: crank_distribution, math.rs, constants.rs, initialize
- Questions: Sustainable inflation? Supply unbounded? Admin mint caps? Share_rate overflow?

### Agent 2: Game Theorist
- Incentive alignment, MEV, griefing, rational actor exploits
- Scope: stake, unstake, trigger_big_pay_day, penalty redistribution, crank_distribution
- Questions: Outsized extraction? MEV? Griefing? Penalty sufficient? Crank incentive? Nash equilibria?

### Agent 3: State Machine Analyst
- Protocol state transitions, invariant preservation, edge cases
- Scope: All state accounts and instructions
- Questions: Unrecoverable states? Invariants preserved? Zero-state boundaries? Singleton limits?

### Agent 4: Fairness Auditor
- Reward distribution equity, whale vs retail, early vs late
- Scope: share_rate model, BPD bonus, free_claim, withdraw_vested
- Questions: Whale super-linear advantage? Longer-pays-better? Rounding direction? Vesting fairness?

### Agent 5: Stress Tester
- Boundary conditions, extreme parameters, protocol limits
- Scope: All numeric computations, parameter ranges, account limits
- Questions: Overflow boundaries? Zero/min/max params? Dangerous param values? Account scaling?

### Agent 6: Operations Analyst
- Crank reliability, BPD lifecycle, admin procedure risks
- Scope: Crank automation, BPD batching, admin instructions, authority management
- Questions: Single points of failure? Missed steps? Time-sensitive ops? Admin misuse?

### Agent 7: Integrator
- Cross-cutting synthesis, dedup, final verdict
- Tasks: Consolidate, assign severity, cross-agent patterns, PASS/CONDITIONAL/FAIL

## Changelog

| Date | Event | Findings |
|------|-------|----------|
| 2026-02-09 | Initial full sweep | 3 HIGH, 6 MEDIUM, 10 INFO/LOW — CONDITIONAL PASS |
