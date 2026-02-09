# User-Facing Security Audit Team — Reusable Configuration

**Created:** 2026-02-09
**Protocol:** HELIX Staking (Solana, Anchor 0.31, Token-2022)

## How to Invoke

> Run the user-facing security audit team defined in .audit/user-facing-security-team.md against the current codebase.

## Team Roster

### Agent 1: Wallet Interaction Auditor
- Transaction construction, signing UX, blind signing risks
- Scope: app/web/ — all Anchor method calls, wallet adapter usage, transaction builders
- Questions: Are transaction contents readable in wallet preview? Any blind-sign patterns? Simulation errors shown to user before signing? Multiple-instruction tx risks? Wallet adapter version pinned?

### Agent 2: Phishing & Spoofing Analyst
- Fake claim sites, spoofed UI, social engineering vectors
- Scope: Free claim flow, marketing site, domain/URL patterns, CSP headers
- Questions: Can free_claim page be cloned to phish? Domain verification visible? CSP prevents iframe embedding? Wallet connect URLs validated? Error messages leak sensitive info?

### Agent 3: Client-Side Math Parity Auditor
- Frontend math module vs on-chain calculation divergence
- Scope: app/web/src/lib/math.ts vs programs/helix-staking/src/instructions/math.rs
- Questions: Every on-chain formula has a frontend mirror? BN.js precision matches u64/u128? Rounding direction consistent? Loyalty bonus + anti-whale formulas mirrored? Displayed penalty matches actual penalty?

### Agent 4: Data Integrity Analyst
- Displayed data accuracy, stale data risks, cache invalidation
- Scope: React Query hooks, WebSocket subscriptions, indexer API data
- Questions: Stale reward amounts shown? Real-time vs cached data clearly indicated? Optimistic updates revert on tx failure? Indexer API data consistent with on-chain? Race conditions between UI updates?

### Agent 5: Client-Side Secret Auditor
- API keys, RPC endpoints, environment variables, localStorage
- Scope: .env files, middleware.ts, RPC proxy, localStorage usage
- Questions: RPC API keys in client bundle? Environment secrets in git? localStorage stores sensitive data? CORS configuration? Rate limiting on proxy?

### Agent 6: Accessibility & Error Handling Auditor
- Error message clarity, transaction failure UX, edge case UI states
- Scope: Toast notifications, error boundaries, loading states, transaction confirmation flow
- Questions: Failed tx shows useful message (not raw error code)? BPD window blocking explained to user? Penalty calculator handles edge cases? Accessible to screen readers? Mobile wallet deep-link works?

### Agent 7: Integrator
- Cross-cutting synthesis, user risk matrix, trust assumption documentation
- Tasks: Consolidate findings, map user-facing risks to likelihood/impact, identify trust assumptions visible to users, render UX SECURITY SCORE (SAFE/CAUTION/UNSAFE)

## Changelog

| Date | Event |
|------|-------|
| 2026-02-09 | Team configuration created |
