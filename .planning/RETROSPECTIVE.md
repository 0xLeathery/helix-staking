# Project Retrospective

*A living document updated after each milestone. Lessons feed forward into future planning.*

## Milestone: v1.1 — Growth, Polish & Quality

**Shipped:** 2026-03-03
**Phases:** 20 (7 v1.1 + 13 v1.0 baseline) | **Plans:** 77 | **Commits:** 200

### What Was Built
- Frontend polish: IDL sync, loyalty multiplier in reward previews, BPD observation window UI, protocol paused banner
- On-chain referral system: +10%/+5% T-share bonuses, ReferralRecord PDA, self-referral prevention, referral stats dashboard
- Soulbound NFT badges: Bubblegum V2 cNFTs for 6 staking milestones, badge gallery with claim flow + celebration overlay
- Browser push notifications: PWA manifest, VAPID push, maturity/penalty/BPD alerts, notification preferences
- Test infrastructure: anchor-litesvm migration (165 tests), math.rs 99.08%, 80%+ indexer + frontend coverage, Playwright E2E
- Deployment hardening: Runtime env var guards, .env.local.example documentation

### What Worked
- Wave-based plan execution enabled high parallelism — independent plans executed concurrently
- The 7-agent security audit approach (from v1.0) established a strong pattern for catching cross-cutting concerns
- Milestone audit (`/gsd:audit-milestone`) before completion caught the HELIUS_RPC_URL gap (INT-01) and surfaced 10 tech debt items for documentation
- Phase 09.1 insertion for local stack validation caught 2 bugs and verified all Phase 9 UI features against real data
- ReferralRecord as separate PDA preserved backward compatibility with existing 117-byte StakeAccount

### What Was Inefficient
- Phase 8.1 SUMMARY.md files not written during execution — created a `disk_status: planned` discrepancy that confused the roadmap analyzer
- 6 phases missing VERIFICATION.md from v1.0 — accumulated debt that should have been addressed before starting v1.1
- Some summary frontmatter missing `requirements_completed` entries (POLISH-02, POLISH-04, NOTIF-02-05) — metadata gap in plan-executor output
- Duplicate decisions in STATE.md accumulated context (Phase 09.1 entries repeated)

### Patterns Established
- Phase 14 "gap closure" phase pattern — dedicated phase for audit-identified env/deployment gaps
- `tech_debt` audit status as acceptable milestone exit criteria when all requirements are satisfied
- Bubblegum V2 + DAS retry pattern for soulbound NFT minting with variable indexing lag
- VAPID-optional indexer startup — push feature degrades gracefully when keys not configured
- anchor-litesvm as standard test runner replacing deprecated anchor-bankrun

### Key Lessons
1. Always write SUMMARY.md during plan execution, not retroactively — disk_status discrepancies cause tooling confusion
2. Phase insertions (decimal phases like 09.1) are valuable for urgent validation but need VERIFICATION.md to match
3. RPC endpoint env vars (HELIUS_RPC_URL) need the same guard pattern as secret keys — Phase 14 caught VAPID/badge vars but missed HELIUS
4. E2E transaction tests need env var gates when Docker binary predates new instructions — document which program version the binary contains
5. anchor-litesvm `fromWorkspace()` is synchronous (unlike bankrun's `startAnchor()`) — removes await but requires `client.expireBlockhash()` between identical transactions

### Cost Observations
- Model mix: ~70% opus, ~25% sonnet, ~5% haiku (research agents)
- Notable: v1.1 (26 plans) completed in ~1 day of wall-clock time — high throughput from wave-based parallelism

---

## Cross-Milestone Trends

### Process Evolution

| Milestone | Commits | Phases | Key Change |
|-----------|---------|--------|------------|
| v1.1 | 200 | 20 | Gap closure phase pattern, milestone audit before completion |

### Cumulative Quality

| Milestone | Tests | Coverage | Audit Status |
|-----------|-------|----------|-------------|
| v1.1 | 165 litesvm + 120 unit + Vitest + E2E | math 99%, indexer 80%+, frontend 91% | tech_debt (30/30 reqs) |

### Top Lessons (Verified Across Milestones)

1. Security audits before frontend work prevent rework — Phase 8.1 findings shaped Phase 9 UI
2. Separate PDA accounts for new features preserve backward compatibility
3. Runtime env var guards should be standard for all non-null assertions in API routes
