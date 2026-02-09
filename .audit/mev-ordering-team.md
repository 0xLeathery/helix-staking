# MEV & Ordering Audit Team — Reusable Configuration

**Created:** 2026-02-09
**Protocol:** HELIX Staking (Solana, Anchor 0.31, Token-2022)

## How to Invoke

> Run the MEV & ordering audit team defined in .audit/mev-ordering-team.md against the current codebase.

## Team Roster

### Agent 1: Sandwich Attack Analyst
- Front-running and back-running around state-changing instructions
- Scope: create_stake (share_rate read), unstake (share_rate read), crank_distribution (share_rate write), claim_rewards
- Questions: Can attacker sandwich create_stake to manipulate share_rate? Can observing a large pending unstake let attacker profit? Does crank_distribution create a predictable state update that enables front-running?

### Agent 2: BPD Ordering Analyst
- Ordering advantages in BPD lifecycle instructions
- Scope: finalize_bpd_calculation (batch ordering), trigger_big_pay_day (distribution ordering), seal_bpd_finalize
- Questions: Does batch ordering in finalize affect rate calculation? Can trigger_big_pay_day batch ordering advantage early callers? Does whale cap interact with ordering (first-come-first-served)?

### Agent 3: Crank MEV Specialist
- Permissionless crank incentives and MEV extraction
- Scope: crank_distribution (permissionless), timing-sensitive instructions
- Questions: Is there an MEV opportunity in crank timing (run crank right before own claim)? Can crank be sandwiched? Does crank ordering across days create extraction opportunities? Should crank have a tip/incentive?

### Agent 4: Free Claim MEV Specialist
- Airdrop claim front-running, Ed25519 protection effectiveness
- Scope: free_claim instruction, Ed25519 introspection, Merkle proof submission
- Questions: Does Ed25519 signature check fully prevent relay/front-running? Can Merkle proofs be observed in mempool and replayed? Speed bonus timing — can bots claim faster than humans?

### Agent 5: Jito Bundle Analyst
- Jito-specific MEV vectors on Solana
- Scope: All time-sensitive instructions, bundle construction opportunities
- Questions: Can Jito bundles atomically crank + claim for MEV? Can bundle inclusion manipulation affect BPD distribution fairness? Tip auction dynamics around BPD trigger? Block builder collusion risks?

### Agent 6: Economic Extraction Modeler
- Quantified MEV extraction estimates and profitability thresholds
- Scope: Full protocol — model rational MEV searcher behavior
- Questions: What's the maximum extractable value per block? At what TVL does MEV extraction exceed gas costs? Which instruction pairs create the highest MEV? Is MEV extraction net-harmful or neutral to protocol?

### Agent 7: Integrator
- Cross-cutting synthesis, MEV risk matrix, mitigation recommendations
- Tasks: Consolidate extraction vectors, quantify risk per instruction, recommend mitigations (commit-reveal, batching, time-locks), render MEV RISK SCORE (LOW/MEDIUM/HIGH/CRITICAL)

## Changelog

| Date | Event |
|------|-------|
| 2026-02-09 | Team configuration created |
