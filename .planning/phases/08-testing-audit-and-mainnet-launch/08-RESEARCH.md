# Phase 8: Testing, Audit, and Mainnet Launch - Research

**Researched:** 2026-02-08
**Domain:** Solana program testing, security auditing, and mainnet deployment
**Confidence:** HIGH

## Summary

Phase 8 requires completing comprehensive testing, security auditing, devnet validation, and mainnet deployment with proper upgrade authority management. The codebase already has strong test infrastructure (35 Phase 2 tests + 43 Phase 3 tests + 16 Phase 3.3 security tests) but faces a known blocker: ts-mocha cannot execute tests due to ESM/CJS interop issues with @noble/hashes. The standard Solana deployment stack is well-established with Anchor 0.31+ providing streamlined devnet/mainnet deployment, and Squads Protocol providing industry-standard multisig upgrade authority management securing $10B+ in assets.

**Primary recommendations:**
1. Fix the ts-mocha ESM blocker by migrating to native Node ESM with tsx or vitest
2. Leverage existing 7-agent Opus security audit team for comprehensive pre-mainnet review
3. Deploy to devnet with multi-day real usage simulation before mainnet
4. Transfer upgrade authority to Squads v4 multisig immediately after mainnet deployment

## Standard Stack

### Core Testing

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| solana-bankrun | ^0.4.0 | Fast in-memory Solana testing | Orders of magnitude faster than solana-test-validator; time manipulation support |
| anchor-bankrun | ^0.5.0 | Anchor integration for bankrun | Simplifies Anchor workspace testing with auto-detection |
| @solana/web3.js | ^1.95.0 | Solana TypeScript SDK | Official Solana JS library for transactions and accounts |
| mocha | ^10.0.0 | Test runner | Industry-standard test framework with excellent async support |
| chai | ^4.3.6 | Assertion library | Expressive assertions for test validation |
| typescript | ^5.0.0 | Type-safe tests | Catches errors at compile time, better IDE support |

### Deployment & Authority Management

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| @coral-xyz/anchor | ^0.31.0 | Solana program framework | Streamlined deploy to devnet/mainnet, upgrade authority management |
| Squads Protocol | v4 | Multisig upgrade authority | Industry standard securing $10B+; formally-verified autonomous finance layer |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @noble/hashes | ^2.0.1 | Cryptographic hashing | Merkle tree construction for free_claim (already in use) |
| @noble/curves | ^2.0.1 | Ed25519 signature verification | MEV protection in free_claim (already in use) |
| ts-mocha | ^10.0.0 | TypeScript test runner | Currently used but has ESM/CJS interop issues (see Known Blockers) |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| solana-bankrun | solana-test-validator | More realistic but 100-1000x slower; better for RPC-specific features |
| mocha | vitest | Modern ESM-first with native TypeScript; requires test migration |
| mocha | jest | Larger ecosystem but slower for Solana tests; bankrun has official jest guide |
| Squads v4 | Squads v3 | v3 still works but v4 adds time locks, spending limits, roles, sub-accounts |
| Squads | Custom multisig | Squads is formally-verified and battle-tested with $10B+ secured |

**Installation:**
```bash
# Core testing dependencies (already installed)
npm install --save-dev solana-bankrun@^0.4.0 anchor-bankrun@^0.5.0
npm install --save-dev @types/mocha@^10.0.0 @types/chai@^4.3.0
npm install --save-dev mocha@^10.0.0 chai@^4.3.6 typescript@^5.0.0

# For ESM migration (if fixing ts-mocha blocker)
npm install --save-dev tsx@latest      # Option A: TypeScript execute
npm install --save-dev vitest@latest   # Option B: Modern test runner
```

## Architecture Patterns

### Recommended Test Structure

```
tests/
├── bankrun/                 # In-memory fast tests
│   ├── utils.ts            # Shared test helpers
│   ├── initialize.test.ts  # Protocol initialization
│   ├── createStake.test.ts # Stake creation flows
│   ├── unstake.test.ts     # Unstake + penalties
│   ├── claimRewards.test.ts # Reward claiming
│   ├── crankDistribution.test.ts # Inflation distribution
│   ├── phase3/             # Phase 3 features
│   │   ├── utils.ts        # Phase 3 helpers (Merkle, Ed25519)
│   │   ├── initializeClaim.test.ts
│   │   ├── freeClaim.test.ts
│   │   ├── withdrawVested.test.ts
│   │   ├── migration.test.ts
│   │   └── triggerBpd.test.ts
│   └── phase3.3/           # Security hardening tests
│       └── securityHardening.test.ts (16 tests)
├── integration/            # Optional: RPC-based tests
│   └── e2e.test.ts         # End-to-end with real RPC
└── devnet/                 # Optional: Devnet validation scripts
    └── validate.ts         # Multi-day usage simulation
```

### Pattern 1: Bankrun Test Setup

**What:** Fast in-memory test with deterministic clock
**When to use:** All instruction-level testing (current approach)
**Example:**
```typescript
// Source: https://github.com/kevinheavey/solana-bankrun + project tests
import { startAnchor } from "solana-bankrun";
import { BankrunProvider } from "anchor-bankrun";

async function setupTest() {
  const context = await startAnchor("./", [], []);
  const provider = new BankrunProvider(context);
  const program = anchor.workspace.HelixStaking as Program<HelixStaking>;
  const payer = context.payer;
  return { context, provider, program, payer };
}

// Time manipulation for time-based logic
await advanceClock(context, BigInt(DEFAULT_SLOTS_PER_DAY * 365));
```

### Pattern 2: Security Audit Workflow

**What:** 7-agent parallel security audit with specialized focus areas
**When to use:** Before devnet, after major changes, pre-mainnet
**Example:**
```typescript
// Source: .planning/docs/security-audit-team.md
// 1. Glob program source files
// 2. Build shared context (what changed)
// 3. Launch 7 Opus agents in parallel (run_in_background: true):
//    - Agent #1: Account Security & PDA Validation
//    - Agent #2: Tokenomics & Economic Exploits
//    - Agent #3: Logic & Edge Cases
//    - Agent #4: Access Control & Authorization
//    - Agent #5: Reentrancy & CPI Security
//    - Agent #6: Arithmetic Safety & Precision
//    - Agent #7: State Management & Data Integrity
// 4. Compile consolidated report with cross-references
```

### Pattern 3: Devnet Deployment

**What:** Deploy to devnet for multi-day real usage validation
**When to use:** After all tests pass, before mainnet
**Example:**
```toml
# Source: https://www.anchor-lang.com/docs/quickstart/local
# Anchor.toml
[provider]
cluster = "Devnet"
wallet = "~/.config/solana/id.json"

[test]
upgradeable = true  # Test upgrade authority instructions
```

```bash
# Deploy to devnet
anchor deploy

# Run devnet validation (multi-day test period)
# - Create real stakes with devnet SOL
# - Execute claim periods
# - Trigger BPD flow
# - Monitor indexer accuracy
# - Validate frontend UX
```

### Pattern 4: Mainnet Deployment with Multisig

**What:** Deploy to mainnet and transfer upgrade authority to Squads multisig
**When to use:** Final production deployment
**Example:**
```bash
# Source: https://squads.xyz/blog/solana-multisig-program-upgrades-management
# 1. Deploy to mainnet
anchor deploy --provider.cluster mainnet

# 2. Create Squads v4 multisig at https://v4.squads.so/
# - Set threshold (e.g., 3 of 5 signers)
# - Add team member keys
# - Configure time locks if desired

# 3. Transfer upgrade authority
solana program set-upgrade-authority \
  <PROGRAM_ID> \
  --new-upgrade-authority <SQUADS_MULTISIG_PDA>

# 4. Verify transfer
solana program show <PROGRAM_ID>
```

### Anti-Patterns to Avoid

- **Hardcoding test values that cause overflow:** Use small token amounts (10-100) instead of millions to avoid T-share overflow (already fixed in Phase 2)
- **Skipping time-based edge cases:** Test boundary conditions at exactly 0 days, 1 day, 365 days, grace period edges
- **Testing only happy paths:** Phase 3.3 added 16 security tests for adversarial scenarios -- this is the standard
- **Deploying to mainnet without devnet validation:** Always run multi-day devnet test with real usage patterns
- **Single-key upgrade authority on mainnet:** Use multisig (Squads) to prevent single point of failure
- **Ignoring audit findings:** All CRITICAL and HIGH findings must be addressed before mainnet

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| In-memory Solana testing | Custom bank simulator | solana-bankrun | Built on solana-program-test (official); 100-1000x faster than validator |
| Test clock manipulation | Manual slot tracking | bankrun's `context.warp_to_slot()` | Deterministic time travel for time-based logic |
| Multisig upgrade authority | Custom multisig program | Squads Protocol v4 | Formally-verified; securing $10B+; proven in production |
| Merkle tree construction | Custom hash tree | @noble/hashes with standard construction | Cryptographically reviewed; already in use for free_claim |
| Security auditing | Single-agent review | 7-agent parallel audit team | Specialized focus areas catch more issues (Phase 3.3 found CRITICAL after single review) |
| Deployment orchestration | Custom bash scripts | Anchor CLI + GitHub Actions | Anchor 0.31+ auto-detects network from config; battle-tested |

**Key insight:** Solana testing and deployment require specialized tooling that accounts for account-based architecture, PDA security, and CPI safety. Generic blockchain testing approaches miss Solana-specific attack vectors. Using the standard stack (bankrun, Anchor CLI, Squads) ensures you benefit from ecosystem-wide security hardening.

## Common Pitfalls

### Pitfall 1: ESM/CJS Import Incompatibility

**What goes wrong:** ts-mocha with `--require ts-node/register` fails on pure ESM packages like @noble/hashes/sha3
**Why it happens:** @noble/hashes exports only ESM; ts-node in CJS mode uses `require()` which throws ERR_REQUIRE_ESM
**How to avoid:**
- **Option A:** Migrate to native Node ESM with tsx test runner: `"test": "tsx --test tests/**/*.test.ts"`
- **Option B:** Use vitest (ESM-first): `"test": "vitest run"`
- **Option C:** Use mocha with native loader: `mocha --loader ts-node/esm tests/**/*.test.ts`
- **Option D:** Use dynamic import: `const { keccak_256 } = await import("@noble/hashes/sha3");`

**Warning signs:**
```
Error [ERR_REQUIRE_ESM]: require() of ES Module not supported
```

**Current status:** Project uses ts-mocha with CJS mode; Phase 3 and 3.3 tests cannot run (known blocker documented in 03.3-04 and additional_context)

### Pitfall 2: Test Token Amounts Causing Overflow

**What goes wrong:** Tests use millions/billions of tokens causing T-share calculations to overflow u64
**Why it happens:** `t_shares = staked_amount * days * (1 + LPB + BPB)` with large amounts exceeds u64::MAX
**How to avoid:** Use small test amounts (10-100 tokens) as documented in Phase 2 decisions
**Warning signs:**
```rust
thread 'test_name' panicked at 'attempt to multiply with overflow'
```

**Current status:** Fixed in Phase 2 (02-04); all tests use 10-100 token range

### Pitfall 3: Ignoring Security Audit Findings

**What goes wrong:** Deploying to mainnet with unaddressed CRITICAL or HIGH findings
**Why it happens:** Time pressure, underestimating exploit impact, trusting "it won't happen"
**How to avoid:**
- Treat CRITICAL findings as deployment blockers (no exceptions)
- Address HIGH findings or document explicit risk acceptance
- Re-audit after fixes to verify resolution
- Phase 3.3 example: CRIT-1 (zero-bonus deadlock) must be fixed before mainnet -- no workaround exists

**Warning signs:**
- "We'll fix it after launch"
- "The attacker would need to..."
- "That's unlikely to happen"

**Current status:** Phase 3.3 audit found 1 NEW CRITICAL (zero-bonus deadlock), 2 HIGH, 5 MEDIUM -- must be addressed before mainnet

### Pitfall 4: Insufficient Devnet Testing Duration

**What goes wrong:** Deploy to mainnet after 1-hour devnet test; production load reveals bugs
**Why it happens:** Devnet testing focuses on happy paths, not sustained multi-day usage or edge case timing
**How to avoid:**
- Run devnet for minimum 3-7 days with real usage patterns
- Test full claim period lifecycle (180 days simulated with clock warping)
- Execute multiple BPD cycles
- Monitor indexer accuracy over time
- Test frontend UX with real network latency
- Simulate whale stakes, many small stakes, edge case timing

**Warning signs:**
- "Tests pass, let's deploy to mainnet"
- Skipping indexer/frontend validation
- No load testing with realistic stake distributions

### Pitfall 5: Single-Key Upgrade Authority on Mainnet

**What goes wrong:** Deploying to mainnet with wallet-based upgrade authority; key compromise = protocol compromise
**Why it happens:** Developer convenience; delaying multisig setup
**How to avoid:**
- Create Squads v4 multisig BEFORE mainnet deployment
- Transfer upgrade authority immediately after deploy
- Verify transfer with `solana program show <PROGRAM_ID>`
- Document multisig signers and threshold in project README

**Warning signs:**
- "We'll add multisig later"
- Upgrade authority is a wallet file
- No documented governance process

**Current status:** Phase 8 requirement DEPL-01 mandates Squads multisig for upgrade authority

### Pitfall 6: Hardcoded Mainnet Addresses in Devnet Config

**What goes wrong:** Deploy to devnet but frontend/indexer use hardcoded mainnet addresses; tests fail mysteriously
**Why it happens:** Copy-paste config without environment-specific overrides
**How to avoid:**
- Use environment variables for all network-specific config
- Load program IDs from Anchor.toml or deployed JSON
- Validate config on startup (fail fast if mainnet addresses on devnet)
- Test config loading with both devnet and mainnet env vars

**Warning signs:**
```typescript
// BAD: Hardcoded mainnet program ID
const PROGRAM_ID = new PublicKey("E9B7BsxdPS89M66CRGGbsCzQ9LkiGv6aNsra3cNBJha7");

// GOOD: Load from environment
const PROGRAM_ID = new PublicKey(process.env.HELIX_PROGRAM_ID!);
```

**Best practice:** Use Anchor's generated target/deploy/*.json for program IDs

## Code Examples

Verified patterns from official sources and project codebase:

### Bankrun Test Setup with Anchor

```typescript
// Source: tests/bankrun/phase3.3/securityHardening.test.ts
import { describe, it } from "mocha";
import { expect } from "chai";
import { startAnchor } from "solana-bankrun";
import { BankrunProvider } from "anchor-bankrun";
import { Program } from "@coral-xyz/anchor";

describe("Security Tests", () => {
  async function setupTest() {
    const context = await startAnchor(
      "./",  // Path to Anchor workspace
      [],    // No extra programs
      []     // No extra accounts
    );
    const provider = new BankrunProvider(context);
    const program = anchor.workspace.HelixStaking as Program<HelixStaking>;
    const payer = context.payer;
    return { context, provider, program, payer };
  }

  it("tests with deterministic time", async () => {
    const { context, program, payer } = await setupTest();

    // Advance time by 365 days
    const slotsPerDay = 216_000;
    await context.warp_to_slot(
      BigInt(context.context.slot) + BigInt(slotsPerDay * 365)
    );

    // Test time-dependent logic
  });
});
```

### Deploy to Devnet/Mainnet

```bash
# Source: https://www.anchor-lang.com/docs/quickstart/local
# Step 1: Configure cluster in Anchor.toml
# [provider]
# cluster = "Devnet"  # or "Mainnet"

# Step 2: Fund wallet
# Devnet: Use faucet at https://faucet.solana.com/ (5 SOL limit, 2x per hour)
# Mainnet: Fund with real SOL

# Step 3: Build program
anchor build

# Step 4: Deploy
anchor deploy

# Step 5: Note program ID from output
# Deploy success. Program ID: E9B7BsxdPS89M66CRGGbsCzQ9LkiGv6aNsra3cNBJha7
```

### Transfer Upgrade Authority to Squads Multisig

```bash
# Source: https://squads.xyz/blog/solana-multisig-program-upgrades-management
# Step 1: Create Squads v4 multisig at https://v4.squads.so/
# - Set threshold (e.g., 3 of 5)
# - Add team member keys
# - Copy multisig PDA

# Step 2: Transfer authority
solana program set-upgrade-authority \
  E9B7BsxdPS89M66CRGGbsCzQ9LkiGv6aNsra3cNBJha7 \
  --new-upgrade-authority <SQUADS_MULTISIG_PDA> \
  --keypair ~/.config/solana/id.json

# Step 3: Verify transfer
solana program show E9B7BsxdPS89M66CRGGbsCzQ9LkiGv6aNsra3cNBJha7
# Output should show: Upgrade Authority: <SQUADS_MULTISIG_PDA>

# Step 4: Future upgrades require multisig proposal + threshold signatures
# - Create proposal in Squads UI
# - Upload new program binary
# - Signers approve
# - Execute upgrade transaction
```

### Security Audit with 7-Agent Team

```typescript
// Source: .planning/docs/security-audit-team.md
// Usage: Read config file, build context, launch 7 agents in parallel

// Shared context (update before each audit)
const context = `
## Context
- Phase 3.3 security hardening implemented
- CRIT-1 and CRIT-2 from Phase 3 audit fixed
- New: seal_bpd_finalize authority gate
- Modified: trigger_big_pay_day with counter-based completion

## Previous Findings to Re-evaluate
- CRIT-1: Per-batch BPD rate (fixed with finalize/seal/trigger flow)
- CRIT-2: Duplicate BPD (fixed with bpd_claim_period_id)
`;

// Launch agents (run_in_background: true)
const agents = [
  { name: "Account Security & PDA", focus: "PDA derivation, ownership, signers" },
  { name: "Tokenomics & Economic", focus: "Reward fairness, MEV, exploits" },
  { name: "Logic & Edge Cases", focus: "Business logic, boundaries, race conditions" },
  { name: "Access Control", focus: "Authority checks, privilege escalation" },
  { name: "Reentrancy & CPI", focus: "CPI safety, CEI pattern, reentrancy" },
  { name: "Arithmetic Safety", focus: "Overflow, precision, rounding" },
  { name: "State Management", focus: "LEN calculations, counters, flags" }
];

// After all agents complete:
// 1. Deduplicate findings (highest severity wins)
// 2. Cross-reference (multi-agent findings = higher confidence)
// 3. Compare to previous audit (fixed/persists/new)
// 4. Assign overall verdict (SECURE / CONDITIONAL / NOT PRODUCTION READY)
```

### Run Tests with ESM Migration (Option A: tsx)

```json
// Source: https://github.com/mochajs/mocha/issues/4916 + ESM best practices
// package.json
{
  "type": "module",  // Enable native ESM
  "scripts": {
    "test": "tsx --test tests/bankrun/**/*.test.ts",
    "test:phase3": "tsx --test tests/bankrun/phase3/**/*.test.ts"
  },
  "devDependencies": {
    "tsx": "latest"
  }
}
```

### Run Tests with ESM Migration (Option B: vitest)

```json
// Source: https://medium.com/@s4y.solutions/es-modules-typescript-and-mocha-9e6138883e57
// package.json
{
  "type": "module",
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "devDependencies": {
    "vitest": "latest"
  }
}
```

```typescript
// vitest.config.ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["tests/bankrun/**/*.test.ts"],
    testTimeout: 1000000  // 1000 seconds like ts-mocha
  }
});
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| solana-test-validator | solana-bankrun | 2024 | 100-1000x faster tests; deterministic time manipulation |
| Jest for Solana tests | Mocha + bankrun or Vitest | 2024-2025 | Better async support; faster execution |
| Anchor 0.28-0.29 | Anchor 0.31+ | 2025 | Auto-detects network config; streamlined deployment |
| Squads v3 | Squads v4 | 2025 | Time locks, spending limits, roles, sub-accounts, ALT support |
| Manual upgrade scripts | GitHub Actions with Squads | 2025 | Automated CI/CD with multisig signature delegation |
| ts-mocha with CJS | Native Node ESM with tsx/vitest | 2025-2026 | Fixes ESM/CJS import issues with modern packages |

**Deprecated/outdated:**
- **solana-test-validator for unit tests:** Still used for RPC-specific testing but bankrun is preferred for instruction-level tests (faster, more control)
- **CJS with ts-node/register:** Modern packages like @noble/hashes are ESM-only; requires native ESM or dynamic imports
- **Single-wallet upgrade authority:** Industry standard is multisig (Squads securing $10B+)
- **Anchor 0.28-0.29:** 0.31+ required for streamlined deployment and network auto-detection

## Known Blockers

### Blocker 1: ts-mocha ESM/CJS Interop with @noble/hashes

**Issue:** Current test runner (ts-mocha with `--require ts-node/register`) cannot resolve @noble/hashes/sha3 ESM exports
**Status:** Documented in Phase 3.3-04 and additional_context
**Impact:** Phase 3 (43 tests) and Phase 3.3 (16 tests) cannot execute; only Phase 2 tests (35 tests) run
**Root cause:** @noble/hashes is pure ESM; ts-node in CJS mode uses `require()` which throws ERR_REQUIRE_ESM

**Solutions (pick one):**
1. **Migrate to native Node ESM with tsx:** Change `package.json` to `"type": "module"` and use `tsx --test`
2. **Migrate to vitest:** ESM-first test runner with native TypeScript support
3. **Use mocha with ESM loader:** `mocha --loader ts-node/esm tests/**/*.test.ts`
4. **Dynamic import workaround:** `const { keccak_256 } = await import("@noble/hashes/sha3");` (hacky, not recommended)

**Recommendation:** Option 1 (tsx) or Option 2 (vitest) for clean ESM migration; vitest has official bankrun integration guide

**References:**
- https://github.com/mochajs/mocha/issues/4916
- https://medium.com/@s4y.solutions/es-modules-typescript-and-mocha-9e6138883e57
- https://solana.com/developers/guides/advanced/testing-with-jest-and-bankrun

## Open Questions

1. **Which ESM migration path is preferred?**
   - What we know: tsx and vitest both solve the @noble/hashes ESM issue
   - What's unclear: User preference for test runner (tsx keeps mocha-style syntax, vitest requires migration)
   - Recommendation: Ask user preference; tsx has minimal migration (change test command only)

2. **Devnet testing duration requirement?**
   - What we know: Multi-day testing recommended; claim period is 180 days
   - What's unclear: Minimum devnet duration before mainnet approval (3 days? 7 days? Full 180 days?)
   - Recommendation: Plan for 7-day devnet test with simulated claim period using clock warping; optionally run extended test with real-time claim period

3. **Security audit scope: self-review or third-party?**
   - What we know: 7-agent Opus team provides comprehensive self-review; Phase 3.3 found NEW CRITICAL
   - What's unclear: Budget/desire for paid third-party audit (Zellic, Neodyme, OtterSec, etc.)
   - Recommendation: Run 7-agent audit first; if budget allows, consider third-party audit for mainnet assurance (typical cost: $20-50K for program this size)

4. **Mainnet launch ceremony or silent deploy?**
   - What we know: Standard practice is deploy -> transfer authority -> test -> announce
   - What's unclear: Marketing timeline and coordination with dashboard/indexer launch
   - Recommendation: Coordinate launch date after successful devnet validation; ensure indexer and frontend are ready on mainnet before public announcement

## Test Coverage Analysis

**Existing test suite (as of Phase 3.3):**
- **Phase 2 (35 tests):** create_stake, crank_distribution, unstake, claim_rewards, initialize
- **Phase 3 (43 tests):** initialize_claim, free_claim, withdraw_vested, migration, trigger_bpd
- **Phase 3.3 (16 tests):** Security hardening covering CRIT-NEW-1 (7), HIGH-2 (2), MED-5 (2), LOW-2 (1), Integration (1)

**Coverage by instruction:**
- ✅ initialize_protocol (covered)
- ✅ admin_mint (covered)
- ✅ create_stake (covered)
- ✅ unstake (covered + early/late penalties)
- ✅ claim_rewards (covered)
- ✅ crank_distribution (covered)
- ✅ initialize_claim_period (covered)
- ✅ free_claim (covered + MEV protection)
- ✅ withdraw_vested (covered)
- ✅ migrate_stake (covered)
- ✅ finalize_bpd_calculation (covered + security tests)
- ✅ seal_bpd_finalize (covered + authority gate tests)
- ✅ trigger_big_pay_day (covered + security tests)

**Test categories covered:**
- ✅ Happy paths (all instructions)
- ✅ Time-based edge cases (early/late unstake, grace period, vesting, claim period)
- ✅ Arithmetic edge cases (zero amounts, overflow protection, precision)
- ✅ Security scenarios (duplicate BPD, authority bypass, counter desync, MEV attacks)
- ✅ Access control (authority-gated instructions, signer validation)
- ⚠️ Integration testing (minimal -- mostly unit-level instruction tests)
- ❌ Load testing (not covered -- plan for devnet)
- ❌ Network resilience (not covered -- plan for devnet)

**Recommendations for Phase 8:**
1. Fix ts-mocha ESM blocker to enable execution of all 94 existing tests
2. Add integration test suite (multi-instruction flows, realistic user journeys)
3. Run devnet load testing with realistic stake distributions (whales, many small stakes, edge timing)
4. Add indexer accuracy tests (compare on-chain state with indexed data)
5. Add frontend E2E tests (Playwright/Cypress for full user flows)

## Sources

### Primary (HIGH confidence)

**Solana Testing:**
- [solana-bankrun GitHub](https://github.com/kevinheavey/solana-bankrun) - Superfast Solana testing framework
- [Bankrun Official Docs](https://kevinheavey.github.io/solana-bankrun/) - Tutorial and API reference
- [Helius: Guide to Testing Solana Programs](https://www.helius.dev/blog/a-guide-to-testing-solana-programs) - Comprehensive testing strategies
- [Solana: Speed up tests with Jest and Bankrun](https://solana.com/developers/guides/advanced/testing-with-jest-and-bankrun) - Official guide

**Anchor Deployment:**
- [Anchor Docs: Deployment](https://www.anchor-lang.com/docs/quickstart/local) - Official deployment guide
- [Anchor Docs: CLI Reference](https://www.anchor-lang.com/docs/references/cli) - anchor deploy, anchor upgrade
- [Anchor Docs: Anchor.toml](https://www.anchor-lang.com/docs/references/anchor-toml) - Configuration reference

**Squads Multisig:**
- [Squads Protocol GitHub](https://github.com/Squads-Protocol/v4) - Squads v4 source
- [Squads: Managing Program Upgrades](https://squads.xyz/blog/solana-multisig-program-upgrades-management) - Best practices guide
- [Squads Multisig Homepage](https://squads.xyz/multisig) - Product overview

**Security Auditing:**
- [Zealynx: Solana Security Checklist](https://www.zealynx.io/blogs/solana-security-checklist) - 45 critical checks
- [Helius: Hitchhiker's Guide to Solana Security](https://www.helius.dev/blog/a-hitchhikers-guide-to-solana-program-security) - Security guide
- [Cantina: Securing Solana Developer Guide](https://cantina.xyz/blog/securing-solana-a-developers-guide) - Security risks and mitigation

**CI/CD:**
- [solana-developers GitHub Actions](https://github.com/solana-developers/github-actions) - Official Solana CI/CD tools with Squads support
- [Don's Blog: Solana GitHub Workflows](https://www.donaldsimpson.co.uk/2025/01/16/integrating-solana-with-github-workflows-for-enhanced-ci-cd/) - 2025 CI/CD patterns

### Secondary (MEDIUM confidence)

**ESM/CJS Troubleshooting:**
- [Mocha Issue #4916](https://github.com/mochajs/mocha/issues/4916) - ERR_REQUIRE_ESM discussion
- [Medium: ES Modules, TypeScript and Mocha](https://medium.com/@s4y.solutions/es-modules-typescript-and-mocha-9e6138883e57) - ESM migration guide

**Testing Best Practices:**
- [RapidInnovation: Solana Testing & Debugging](https://www.rapidinnovation.io/post/testing-and-debugging-solana-smart-contracts) - 2024 guide
- [TopSolCoins: Test Coverage Tools](https://topsolcoins.com/blog/solana-test-coverage-tools-2024-developer-guide/) - Coverage tooling overview

**Devnet Resources:**
- [Solana: Devnet Overview](https://solana.com/docs/references/clusters) - Cluster documentation
- [Alchemy: Everything About Solana Devnet](https://www.alchemy.com/overviews/solana-devnet) - Devnet guide
- [Solana: Devnet Faucets](https://solana.com/developers/guides/getstarted/solana-token-airdrop-and-faucets) - Getting test SOL

### Tertiary (LOW confidence)

- [Medium: Deploying to Devnet](https://medium.com/coinmonks/deploying-to-devnet-solana-anchor-smart-contract-796e7d6825b7) - Community tutorial
- [Medium: Deploying Solana Program in 2025](https://medium.com/@palmartin99/deploying-a-solana-rust-program-in-2025-devnet-mainnet-beta-in-9-minutes-flat-616913bcdb96) - 2025 deployment flow

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - All recommendations verified with Context7 (Anchor) and official docs (bankrun, Squads)
- Architecture: HIGH - Existing test suite demonstrates proven patterns; bankrun GitHub and official guides confirm
- Deployment: HIGH - Anchor docs and Squads blog provide authoritative guidance
- ESM blocker: HIGH - Direct evidence from project code and Mocha GitHub issues
- Pitfalls: HIGH - Phase 3.3 audit demonstrates real vulnerabilities (CRITICAL found); security sources corroborate
- CI/CD: MEDIUM - GitHub Actions guide is from community (Don's Blog) but references official solana-developers repo

**Research date:** 2026-02-08
**Valid until:** 60 days (stable domain -- Anchor 0.31, bankrun 0.4, Squads v4 are mature; ESM patterns are settled)

**Test execution status:**
- ✅ Phase 2 tests (35): Can execute (no ESM dependencies)
- ❌ Phase 3 tests (43): Cannot execute (ts-mocha ESM blocker with @noble/hashes)
- ❌ Phase 3.3 tests (16): Cannot execute (ts-mocha ESM blocker)
- 🎯 **94 total tests exist; 59 currently blocked**

**Phase 3.3 security findings (require fixes before mainnet):**
- 🚨 **CRIT-1:** Zero-bonus stake deadlock (permanent protocol freeze)
- ⚠️ **HIGH-1:** No emergency BPD recovery mechanism
- ⚠️ **HIGH-2:** Authority can seal BPD rate prematurely
- ℹ️ **5 MEDIUM, 6 LOW, 8 INFO** (documented in FINAL-SECURITY-AUDIT.md)
