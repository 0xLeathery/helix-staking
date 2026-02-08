# Phase 4: Staking Dashboard - Context

**Gathered:** 2026-02-08
**Status:** Ready for planning
**Source:** 5-agent expert panel (Frontend Architect, DeFi UX, HEX Analyst, On-Chain Integration, Security/Infra) + user confirmation

<domain>
## Phase Boundary

Web interface where users connect a Solana wallet to create/manage stakes, view rewards, claim free tokens, and track Big Pay Day. All state read directly from the chain. No backend required.

**IN scope:** Wallet connection, stake creation wizard, active stakes list, unstake with penalty calculator, reward claiming, free claim with vesting, global protocol stats, BPD status display, permissionless crank button.

**OUT of scope:** Historical analytics/charts (Phase 6), Jupiter swap widget (Phase 6), leaderboards/whale tracker (Phase 7), marketing/landing site (Phase 7), notifications (Phase 5+), multi-wallet support, USD price display, staking ladder planner, tax export.

</domain>

<decisions>
## Implementation Decisions

### Visual Identity & Layout
- Dark mode only (DeFi convention, easier on eyes for financial data)
- Card-based layout for stakes, rewards, and protocol stats
- Tailwind CSS with shadcn/ui patterns for primitives (Button, Card, Modal, Toast)
- Design-in-code approach (no Figma mockups) — iterate directly in browser with Tailwind
- Modern DeFi feel — clean, data-forward, not cluttered

### Stake Creation Experience
- 3-step wizard flow:
  1. Amount input (balance display, max button, validation via CTA state)
  2. Duration selector (slider + input + presets: 1Y/3Y/5Y/Max) with live T-share preview showing Duration Bonus and Size Bonus breakdown
  3. Review/confirm (full summary, penalty warning, estimated fee)
- Post-stake success screen with "View My Stakes" CTA
- Bonus curve visualization showing how duration/amount affect T-shares

### Penalty & Risk Communication
- Mandatory penalty preview before any unstake (no way to skip)
- Visual comparison bar: "What you staked" vs "What you'd receive"
- Confirmation checkbox: "I understand I will lose X HELIX (Y%)" required before signing
- Color-coded states: green (matured/grace), yellow (early with moderate penalty), red (heavy penalty or late)
- BPD window blocking: clear explanation when unstake is temporarily unavailable

### Terminology & Branding
- LPB → "Duration Bonus" (user-facing display)
- BPB → "Size Bonus" (user-facing display)
- share_rate → "T-Share Price" (user-facing display)
- Keep as-is: "T-Shares", "Big Pay Day", "Free Claim"
- Early unstake labeled "Early Unstake" (not "Emergency End Stake")
- On-time unstake labeled "End Stake"
- Late unstake labeled "End Stake (Late)" with urgency indicator
- Educational tooltips on first encounter of jargon terms

### Infrastructure
- Helius as primary RPC provider (free tier for dev, $49/mo at launch)
- RPC proxy via Next.js API route (API keys stay server-side)
- Vercel for hosting (zero-config Next.js, preview deploys)
- No USD price display for MVP — HELIX amounts only
- Sentry for error tracking (free tier)

### Testing Strategy
- Defer frontend testing to Phase 8 (dedicated testing/audit phase)
- Focus Phase 4 on building functional UI

### Claude's Discretion
- Exact color palette and design tokens within dark theme
- Loading skeleton design and animation
- Error state messaging and recovery flows
- Component internal architecture and hook composition
- Exact spacing, typography, and responsive breakpoints
- WebSocket vs polling strategy details
- Priority fee estimation approach
- Empty state illustrations/copy

</decisions>

<specifics>
## Specific Ideas

### Architecture (Expert Panel Consensus)
- Next.js 14+ App Router, @solana/web3.js v1 (Anchor constraint), @coral-xyz/anchor 0.31.1
- TanStack React Query v5 for on-chain data (staleTime: 15s stakes, 30s global state)
- Zustand v5 for UI-only state (selected stake, form state, view toggles)
- Never duplicate on-chain data in client state — anti-pattern that causes sync bugs
- WebSocket subscriptions (connection.onAccountChange) to invalidate React Query cache
- getProgramAccounts with memcmp filter on user pubkey to find all user stakes

### Page Structure
```
/                           → Connect wallet prompt + protocol overview
/dashboard                  → Portfolio (stakes list, summary stats, quick actions)
/dashboard/stake            → Create new stake (3-step wizard)
/dashboard/stakes/[stakeId] → Stake detail + penalty calculator
/dashboard/claim            → Free claim (eligibility + claim + vesting)
/dashboard/rewards          → Rewards overview + BPD status
```

### On-Chain Integration (Critical Details)
- Token-2022 program ID required for ALL token operations (not legacy SPL Token)
- Burn-and-mint model: tokens burned on stake, minted on unstake/claim — mint supply ≠ TVL
- Stake ID race condition: create_stake PDA derived from total_stakes_created counter — catch AccountAlreadyInUse, re-fetch, retry
- Free claim: Ed25519 verify instruction must immediately precede free_claim instruction in same tx
- BPD window blocks unstake: check globalState.reserved[0] !== 0
- Use BigInt/BN.js for ALL on-chain amounts (never JS Number)
- Program ID: E9B7BsxdPS89M66CRGGbsCzQ9LkiGv6aNsra3cNBJha7

### Security (Non-Negotiable)
- CSP headers: script-src 'self' (no unsafe-inline/eval), whitelist RPC endpoints
- X-Frame-Options: DENY, X-Content-Type-Options: nosniff
- Transaction simulation before presenting to wallet (always)
- autoConnect: false on wallet adapter (require explicit user action)
- Pin exact dependency versions (no ^ or ~ for Solana packages)
- Program ID hardcoded as constant, verified in every transaction

### Recommended Plan Breakdown
- 04-01: Scaffold + providers + wallet connection + CSP headers + UI primitives
- 04-02: Dashboard + stake viewing + global stats + React Query hooks
- 04-03: Create stake wizard (3-step) with bonus preview and T-share calculation
- 04-04: Unstake + penalty calculator + reward claiming
- 04-05: Free claim + vesting + BPD status + mobile/a11y polish

</specifics>

<deferred>
## Deferred Ideas

- USD price display via Jupiter Price API — Phase 6 (Jupiter integration)
- Historical analytics charts (T-share price history, payout history) — Phase 6 (requires indexer)
- Jupiter swap widget — Phase 6
- Leaderboard / whale tracker / staker ranks — Phase 7
- Marketing/landing site — Phase 7
- Browser push notifications for stake maturity — Phase 5+
- Staking ladder planner tool — backlog
- Tax reporting export — backlog
- Multi-wallet simultaneous connection — backlog
- Good Accounting / "Secure Stake" instruction — requires on-chain program change
- HEX-style aquatic animal league system (Whale, Shark, Dolphin tiers) — Phase 7 gamification

</deferred>

---

*Phase: 04-staking-dashboard*
*Context gathered: 2026-02-08*
