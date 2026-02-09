---
color: yellow
position:
  x: 2244
  y: -1303
isContextNode: false
agent_name: Aki
---

# Validation Scripts & Audit Infrastructure

**Parent:** [[test-and-audit-infra.md]]

Devnet validation scripts for end-to-end lifecycle testing against live Solana infrastructure, E2E wallet setup tooling, and the 7-agent security audit team configuration. These scripts bridge the gap between local bankrun tests and production deployment by exercising the program against real Solana devnet.

## Key Test Files

### `scripts/devnet-validate.ts` -- Core Staking Lifecycle

Exercises the fundamental staking flow on devnet:

1. **Initialize protocol:** Creates `GlobalState`, Token-2022 mint, and mint authority PDAs.
2. **Admin mint:** Mints HELIX tokens to the deployer wallet.
3. **Create stake:** Creates a time-locked stake with specified amount and duration.
4. **Crank distribution:** Runs the permissionless inflation distribution crank.

Validates PDA derivation, ATA creation, and basic instruction flow against a live validator. Serves as a smoke test after program deployment.

### `scripts/devnet-validate-claims.ts` -- Full Claim Lifecycle

End-to-end claim system validation:

1. **Initialize claim period:** Sets up merkle root and claim configuration.
2. **Free claim:** Constructs Merkle proof + Ed25519 signature, submits free_claim instruction.
3. **Withdraw vested:** Tests vesting withdrawal after advancing time.
4. **BPD flow:** Attempts Big Pay Day lifecycle (expected to fail on standard devnet due to 180-day claim period duration).

Mirrors the Merkle tree implementation from `tests/bankrun/phase3/utils.ts` (keccak256, sorted leaves). Useful for verifying that the claim system works end-to-end with real RPC and real signature verification, catching issues that bankrun's simulated environment might miss (e.g., Ed25519 precompile behavior differences).

### `scripts/devnet-validate-bpd.ts` -- BPD Lifecycle with Admin Workarounds

Full Big Pay Day lifecycle validation using admin-only time manipulation instructions:

1. **`abort_bpd`**: Clear any existing BPD state from prior test runs.
2. **`admin_set_slots_per_day(10)`**: Accelerate time to avoid 180-day wait.
3. **`admin_set_claim_end_slot(past)`**: Force claim period to end immediately.
4. **`finalize_bpd_calculation`**: Process eligible stakes in batches.
5. **`seal_bpd_finalize`**: Lock the share-day accumulation.
6. **`trigger_big_pay_day`**: Distribute BPD bonuses.
7. **Restore `slots_per_day`**: Reset to production value after testing.

This script uses admin-only instructions (`admin_set_slots_per_day`, `admin_set_claim_end_slot`, `abort_bpd`) that exist specifically for devnet testing. These instructions are authority-gated and would typically be disabled or removed before mainnet deployment.

### `scripts/setup-e2e-wallet.ts` -- E2E Wallet Provisioning

Idempotent test wallet setup for Playwright E2E tests:

1. Generates a new Solana keypair (or loads existing from `.test-wallet.json`).
2. Airdrops SOL from devnet/localnet faucet.
3. Creates Associated Token Account (ATA) for the HELIX mint.
4. Mints 500 HELIX tokens via `admin_mint`.
5. Outputs base58-encoded secret key for `NEXT_PUBLIC_TEST_WALLET_SECRET` env var.

Designed to be run before Playwright tests as a standalone setup step. Idempotent: safe to run multiple times without creating duplicate accounts.

### `.planning/docs/security-audit-team.md` -- 7-Agent Audit Configuration

Configuration file for launching 7 specialized Opus audit agents in parallel:

| Agent | Focus Area | Key Files |
|-------|-----------|-----------|
| **Account/PDA** | PDA derivation correctness, seed collisions, account validation | All instruction files, state accounts |
| **Tokenomics** | Economic model correctness, inflation math, bonus curves | `math.rs`, `constants.rs`, `create_stake.rs` |
| **Logic/Edge Cases** | State machine transitions, boundary conditions, off-by-one | All instruction files, especially BPD lifecycle |
| **Access Control** | Authority checks, signer validation, unauthorized access | All instruction files (`has_one`, `constraint`) |
| **Reentrancy/CPI** | Cross-program invocation safety, CPI guard patterns | Token mint/transfer instructions, CPI calls |
| **Arithmetic** | Overflow/underflow, precision loss, division-by-zero | `math.rs`, `crank_distribution.rs`, BPD calculations |
| **State/Data** | Account discriminators, data layout, migration safety | State definitions, migration instruction |

Each agent receives the same source file context but has a specific focus lens and output format. Results are compiled into a consolidated report with deduplication and cross-referencing across agents.

**Launch workflow:**
1. Read the config file for agent specifications.
2. Glob all relevant source files to build shared context.
3. Launch all 7 agents in parallel (background).
4. Wait for completion.
5. Compile consolidated report: deduplicate findings, cross-reference between agents, compare against prior audit results.

## Test Patterns & Utilities

- **Admin instruction workarounds:** Devnet scripts use authority-only admin instructions (`admin_set_slots_per_day`, `admin_set_claim_end_slot`, `abort_bpd`) to manipulate time and state, bypassing the 180-day claim period wait that would make testing impractical.
- **Idempotent design:** Scripts check for existing state before creating (e.g., wallet keypair file, ATA existence) and skip already-completed steps.
- **Base58 key serialization:** Test wallet secret is serialized as base58 for environment variable transport, matching Solana CLI conventions.
- **Parallel audit agents:** 7 specialized agents run concurrently, each with a narrow audit focus, producing structured findings that are later deduplicated and consolidated.
- **Mirror implementations:** The devnet claim validation script re-implements the Merkle tree and Ed25519 signing logic from bankrun test utils, providing cross-validation that both implementations agree.

## Notable Gotchas

- **Admin instructions are devnet-only:** `admin_set_slots_per_day`, `admin_set_claim_end_slot`, and `abort_bpd` are authority-gated admin instructions. They exist for testing purposes and should be audited for potential mainnet misuse (e.g., authority key compromise).
- **BPD devnet testing requires time manipulation:** The 180-day claim period makes BPD lifecycle testing impossible on devnet without the admin time acceleration. The `devnet-validate-bpd.ts` script must restore `slots_per_day` after testing to avoid corrupting the devnet environment for other tests.
- **Ed25519 precompile differences:** The Ed25519 signature verification precompile may behave slightly differently between bankrun (simulated) and real validators. The devnet validation scripts serve as a critical check that signatures constructed in JavaScript actually verify on-chain.
- **Audit finding history is cumulative:** The security audit team should always compare new findings against prior audit results (Phase 3 audit found CRIT-1/CRIT-2 + 5 HIGH, post-fix audit found CRIT-NEW-1). New fixes may introduce new vulnerabilities.
- **Airdrop rate limits:** Devnet SOL airdrops are rate-limited. The `setup-e2e-wallet.ts` script may fail if run too frequently. The idempotent design mitigates this by reusing existing wallets when possible.
- **`.test-wallet.json` must not be committed:** Contains a private key. The `.gitignore` should exclude this file. If committed, the key is compromised (though devnet-only, it sets a bad precedent).
