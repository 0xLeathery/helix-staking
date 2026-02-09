---
color: cyan
position:
  x: 968
  y: -651
isContextNode: false
agent_name: Aki
---

# Project Planning

## The `.planning/` directory: roadmap phases, state tracking, research docs, and agent-driven audit infrastructure

### Directory Structure

```
.planning/
  PROJECT.md         -- What HELIX is, requirements, constraints, key decisions
  ROADMAP.md         -- 8 phases with plan details and completion tracking
  STATE.md           -- Current position, velocity metrics, session continuity
  REQUIREMENTS.md    -- Formal requirement specifications
  CONTEXT-HANDOFF.md -- Context for session handoffs between agents
  CLAUDE.md          -- Claude-specific project instructions
  config.json        -- Agent configuration
  agent-history.json -- Agent execution log
  v1.0-MILESTONE-AUDIT.md -- Pre-launch audit checklist
  research/          -- Initial research docs (STACK, FEATURES, ARCHITECTURE, PITFALLS, SUMMARY)
  docs/              -- Supporting documentation (security audit team config, etc.)
  phases/            -- 11 phase directories with plans, summaries, and audits
```

### PROJECT.md -- Protocol Definition

Defines HELIX as a "HEX-style staking protocol on Solana" with the core value proposition: users stake tokens for a chosen duration, earn T-shares proportional to commitment, and receive daily inflation rewards.

Key constraints documented:
- Anchor (Rust) on Solana -- locked
- Token-2022 with metadata extension
- `@solana/web3.js` v1 required (Anchor TS client incompatibility with v2)
- Light indexer only -- not a full backend
- Solo developer build with Claude as implementation partner

### ROADMAP.md -- Phase Tracking

8 main phases plus 3 inserted security phases (2.1, 3.2, 3.3):

| Phase | Name | Plans | Status |
|-------|------|-------|--------|
| 1 | Foundation & Token Infrastructure | 2/2 | Complete |
| 2 | Core Staking Mechanics | 4/4 | Complete |
| 2.1 | Critical Math Fixes (inserted) | 1/1 | Complete |
| 3 | Free Claim & Big Pay Day | 6/6 | Complete |
| 3.2 | BPD Security Critical Fixes (inserted) | 2/2 | Complete |
| 3.3 | Post-Audit Security Hardening (inserted) | 4/4 | Complete |
| 4 | Staking Dashboard | 5/5 | Complete |
| 5 | Light Indexer Service | 3/3 | Complete |
| 6 | Analytics & Jupiter Integration | 3/3 | Complete |
| 7 | Leaderboard & Marketing Site | 3/3 | Complete |
| 8 | Testing, Audit & Mainnet Launch | 3/5 | In Progress |

**Phase numbering convention**: Integer phases (1, 2, 3) are planned milestones. Decimal phases (2.1, 3.2, 3.3) are urgent insertions triggered by security audits.

Each phase directory under `phases/` contains plan files (`NN-MM-PLAN.md`), summary files (`NN-MM-SUMMARY.md`), and optional security audit reports (`NN-SECURITY-AUDIT.md`).

### STATE.md -- Session Continuity

Tracks the exact resume point between work sessions:

- **Current position**: Phase 8, Plan 3 of 5 complete (60%)
- **Last activity**: Plan 08-03 (security tests + 7-agent audit: CONDITIONAL PASS)
- **Next**: Plans 08-04 (devnet deployment) and 08-05 (mainnet deployment)
- **Total velocity**: 35 plans completed in ~5h 15min (~8.8 min average)

Contains an extensive **Accumulated Context > Decisions** section documenting every architectural decision made across all phases (130+ entries). This is the single most important reference when resuming work -- it captures the "why" behind every implementation choice.

### Research Directory

Initial research conducted before development:

| File | Content |
|------|---------|
| `STACK.md` | Technology choices and rationale |
| `FEATURES.md` | Feature breakdown and prioritization |
| `ARCHITECTURE.md` | System architecture design |
| `PITFALLS.md` | Known risks and mitigation strategies |
| `SUMMARY.md` | Research synthesis |

### Security Audit Infrastructure

The 7-agent parallel security audit system is documented in `.planning/docs/security-audit-team.md`. Agents cover:
1. Account/PDA validation
2. Tokenomics correctness
3. Logic/edge cases
4. Access control
5. Reentrancy/CPI safety
6. Arithmetic overflow/precision
7. State/data integrity

Audit reports are stored per-phase (e.g., `03-SECURITY-AUDIT.md`, `08-SECURITY-AUDIT.md`).

### Notable Gotchas

- **STATE.md is the resume file**: Always read this first when starting a new session. The `Session Continuity` section tells you exactly where to pick up.
- **Decimal phases are security insertions**: When you see Phase 3.2 or 3.3, these were emergency insertions to fix audit findings. They are complete and should not be re-executed.
- **Accumulated Context is massive**: The decisions list in STATE.md has 130+ entries. Use it as a reference, not a reading exercise. Search for specific keywords.
- **Plan files are the source of truth**: Each `NN-MM-PLAN.md` contains the exact implementation instructions that were executed. Summary files contain the outcome.
- **Phase 8 is incomplete**: Plans 08-04 (devnet deployment) and 08-05 (mainnet deployment) have not been executed yet. This is the current frontier.
- **v1.0-MILESTONE-AUDIT.md**: A pre-launch checklist that should be reviewed before mainnet deployment. It is a separate document from the phase-specific audit reports.
- **No CI/CD**: All builds, tests, and deployments are manual. The planning system tracks what was done but does not automate execution.

[[config-and-deployment.md]]
