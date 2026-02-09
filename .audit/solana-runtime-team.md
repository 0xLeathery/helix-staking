# Solana Runtime Audit Team — Reusable Configuration

**Created:** 2026-02-09
**Protocol:** HELIX Staking (Solana, Anchor 0.31, Token-2022)

## How to Invoke

> Run the Solana runtime audit team defined in .audit/solana-runtime-team.md against the current codebase.

## Team Roster

### Agent 1: Compute Budget Analyst
- CU consumption per instruction, remaining_accounts scaling, batch sizing
- Scope: trigger_big_pay_day, finalize_bpd_calculation, crank_distribution, create_stake (with remaining_accounts)
- Questions: CU cost at MAX_STAKES_PER_BPD=20? Does batch instruction hit 200K CU limit? Cost with loyalty multiplier added? Hot path CU breakdown?

### Agent 2: Account Model Specialist
- Account sizes, reallocation costs, rent exemption, PDA derivation cost
- Scope: All account structs (GlobalState, StakeAccount, ClaimConfig, ClaimStatus, DailyData), realloc annotations
- Questions: LEN calculations correct after expansions? Rent cost for new users? Max accounts per tx? realloc::zero security? Reserved field usage safe?

### Agent 3: Clock & Slot Analyst
- Slot-based timing assumptions, clock manipulation, epoch boundaries
- Scope: slots_per_day usage, day calculation, claim period windows, BPD seal delay, grace periods
- Questions: What happens at slot skip/gap? Clock drift between unix_timestamp and slot? Epoch boundary effects on day counting? slots_per_day accuracy vs reality (~400ms)?

### Agent 4: Transaction Limits Specialist
- Transaction size (1232 bytes), instruction data size, remaining_accounts limits
- Scope: All instructions using remaining_accounts, Merkle proof data size, Ed25519 introspection data
- Questions: Max remaining_accounts before tx too large? Merkle proof depth limit? Ed25519 instruction data fits in single tx? ALT (Address Lookup Table) needed?

### Agent 5: Versioned Transaction & Priority Fee Analyst
- Priority fee handling, versioned transaction compatibility, Jito tips
- Scope: Frontend transaction construction, RPC proxy, wallet adapter integration
- Questions: Versioned tx support in all instructions? Priority fee estimation for batch instructions? Jito tip instruction compatibility?

### Agent 6: Program Upgrade & Deployment Specialist
- BPF loader, program data account, upgrade authority, IDL account
- Scope: Anchor.toml config, deploy scripts, verifiable builds, program size
- Questions: Program size under 10MB limit? Verifiable build reproducible? IDL matches deployed program? Upgrade authority correctly configured?

### Agent 7: Integrator
- Cross-cutting synthesis, Solana-specific risk matrix, final verdict
- Tasks: Consolidate findings, map to Solana runtime constraints, identify CU-critical paths, render PASS/CONDITIONAL/FAIL with runtime risk score

## Changelog

| Date | Event |
|------|-------|
| 2026-02-09 | Team configuration created |
