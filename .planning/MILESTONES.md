# Milestones

## v1.1 Growth, Polish & Quality (Shipped: 2026-03-03)

**Phases:** 9-14 (7 phases including 09.1 inserted) | **Plans:** 26 | **Commits:** 78
**Codebase:** ~47K LOC (5,985 Rust + ~39K TypeScript) | **Timeline:** 2026-03-02 → 2026-03-03
**Git range:** `feat(09-01)` → `feat(14-01)` | **Requirements:** 30/30 satisfied
**Audit:** tech_debt — 10 non-critical debt items documented

**Key accomplishments:**
1. Frontend polish — IDL synchronized with Phase 8.1 on-chain state, loyalty multiplier in reward previews, BPD seal delay observation window UI, protocol paused banner
2. Referral system — On-chain +10%/+5% T-share bonuses with self-referral prevention, duplicate guard via ReferralRecord PDA, referral stats dashboard
3. NFT badges — Bubblegum V2 soulbound cNFTs for staking milestones (First Stake, 365-Day, BPD, tier badges), badge gallery with claim flow + celebration overlay
4. Push notifications — PWA manifest + service worker, VAPID push for maturity/penalty/BPD alerts, per-event-type preference toggles
5. Test coverage — anchor-litesvm migration (165 tests), math.rs 99.08% coverage, 80%+ line coverage across indexer + frontend, Playwright E2E suite
6. Deployment hardening — Runtime env var guards for push + badge routes, .env.local.example documenting 5 missing deployment vars

### Known Gaps (from audit)
- Phase 08-05 mainnet deployment deferred — awaiting Squads multisig setup + go/no-go decision
- HELIUS_RPC_URL non-null assertion unguarded in badge mint/claimed routes (INT-01, medium severity)
- 6 v1.0/inserted phases missing VERIFICATION.md (not blockers — no v1.1 requirements)
- 4 E2E transaction tests gated by env vars — Docker binary predates Phases 10-12

### Tech Debt
- Pre-existing TSC error in e2e/global-setup.ts
- REF-03 wording inconsistency (says "T-share credit" but implementation mints HELIX tokens)
- 11 inherited TS errors from Phase 11 badge files
- Stale "bankrun" terminology in test comments and package.json script name

---

