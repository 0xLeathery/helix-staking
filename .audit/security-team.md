# Security Audit Team — Reusable Configuration

**Created:** 2026-02-09
**Protocol:** HELIX Staking (Solana, Anchor 0.31, Token-2022)

## How to Invoke

> Run the security audit team defined in .audit/security-team.md against the current codebase.

## Team Roster

### Agent 1: Access Control Auditor
- Authority checks, privilege escalation, signer validation
- Scope: All admin-gated instructions, transfer_authority, accept_authority
- Questions: Does every admin ix verify global_state.authority? Can remaining_accounts bypass access controls?

### Agent 2: Arithmetic & Overflow Auditor
- Integer overflow, underflow, precision loss, rounding attacks
- Scope: math.rs, share_rate, penalty math, BPD weight
- Questions: All checked_* ops? overflow-checks=true? Division-by-zero paths?

### Agent 3: CPI & Account Validation Auditor
- Cross-program invocations, account ownership, PDA validation
- Scope: All mint_to/burn/transfer CPIs, PDA derivations, remaining_accounts
- Questions: CEI pattern followed? remaining_accounts validated? Bump seeds canonical?

### Agent 4: State Integrity Auditor
- State corruption, double-spend, replay attacks
- Scope: All state mutations across GlobalState, StakeAccount, ClaimConfig, BpdState, ClaimStatus
- Questions: Double-claim vectors? is_active checked? Race conditions?

### Agent 5: Token Security Auditor
- Mint authority, token supply integrity, Token-2022 specifics
- Scope: Mint authority PDA, all mint/burn paths
- Questions: Unbounded mint path? admin_mint capped? Supply accounting correct?

### Agent 6: Frontend & Infrastructure Auditor
- Frontend security, RPC config, environment secrets
- Scope: app/web/, services/indexer/, middleware, env files
- Questions: CSP headers? Test utils in prod? IDL up-to-date?

### Agent 7: Integrator
- Cross-cutting synthesis, dedup, final verdict
- Tasks: Consolidate, assign severity, verify prior fixes, render PASS/CONDITIONAL/FAIL

## Changelog

| Date | Event |
|------|-------|
| 2026-02-09 | Team configuration created |
