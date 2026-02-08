# Security Audit Team Configuration

**Team Size**: 7 specialized agents (Opus model, run in background)
**Purpose**: Comprehensive security audit of helix-staking Solana/Anchor program
**Usage**: Say "spin up the security team" or "run security audit" to launch all 7

---

## Shared Context Block

Each agent receives this context block (update before each run):

```
## Context
[Describe what changed since last audit. Example:]
- Phase 3.2 implemented fixes for CRIT-1 and CRIT-2
- New `finalize_bpd_calculation` instruction added
- Modified `trigger_big_pay_day` with duplicate prevention
- StakeAccount expanded to 113 bytes
- ClaimConfig expanded to 168 bytes

## Previous Audit Findings Reference
[List any prior findings to re-evaluate]
```

## Source Files (update if new files added)

**State:** `programs/helix-staking/src/state/*.rs`
**Instructions:** `programs/helix-staking/src/instructions/*.rs`
**Core:** `programs/helix-staking/src/lib.rs`, `error.rs`, `constants.rs`, `events.rs`
**Tests:** `tests/bankrun/**/*.test.ts`

---

## Agent #1: Account Security & PDA Validation

**Subagent**: `general-purpose` | **Model**: `opus` | **Background**: `true`

**Focus Areas**:
- PDA derivation correctness and seed collisions
- Account ownership validation (program_id checks)
- Signer requirements and authorization
- Bump seed storage and usage
- Discriminator checks via Anchor
- remaining_accounts validation
- Account initialization and reinitialization attacks
- Rent exemption edge cases

**Output Sections**: Summary, CRIT Fix Verification, New Findings, Previous Findings Re-evaluation, Verified Secure Patterns

---

## Agent #2: Tokenomics & Economic Exploits

**Subagent**: `general-purpose` | **Model**: `opus` | **Background**: `true`

**Focus Areas**:
- Token economics and reward distribution fairness
- MEV and front-running attack vectors
- Flash loan / same-block manipulation
- Reward rate manipulation and gaming
- Pool draining attacks
- Inflation/deflation exploits
- Economic incentive misalignment
- Whale dominance and centralization risks
- Timing-based economic attacks

**Key Files**: `math.rs`, `finalize_bpd_calculation.rs`, `trigger_big_pay_day.rs`, `crank_distribution.rs`, `free_claim.rs`, `unstake.rs`, `claim_rewards.rs`, `constants.rs`

**Output Sections**: Summary, Economic Analysis of Fixes, New Economic Findings (with attack scenarios), Previous Findings Re-evaluation, Economic Model Assessment

---

## Agent #3: Logic & Edge Cases

**Subagent**: `general-purpose` | **Model**: `opus` | **Background**: `true`

**Focus Areas**:
- Business logic correctness and state machine integrity
- Edge cases and boundary conditions
- Off-by-one errors in time/slot calculations
- Race conditions between instructions
- State inconsistency across related accounts
- Impossible/unreachable states
- Zero-value edge cases (zero stakes, zero rewards, zero time)
- Ordering dependencies between instructions

**Key Questions**: What happens if stakes are added between finalize batches? New stake after finalize but before trigger? Can finalize and trigger race? Off-by-one at period end? Unstake between finalize and trigger?

**Output Sections**: Summary, Logic Analysis of Fixes, New Findings, Previous Findings Re-evaluation, State Machine Verification

---

## Agent #4: Access Control & Authorization

**Subagent**: `general-purpose` | **Model**: `opus` | **Background**: `true`

**Focus Areas**:
- Authority checks and privilege escalation
- Permissionless vs. permissioned instruction analysis
- Signer validation completeness
- Admin function protection
- User isolation (can user A affect user B?)
- Ed25519 signature verification (free_claim)
- Constraint validation completeness in Anchor accounts structs
- Missing has_one / constraint checks
- Authority transfer and key management

**Output Sections**: Summary, Authorization Analysis of Fixes, Access Control Matrix (all instructions), New Findings, Previous Findings Re-evaluation, Verified Access Controls

---

## Agent #5: Reentrancy & CPI Security

**Subagent**: `general-purpose` | **Model**: `opus` | **Background**: `true`

**Focus Areas**:
- Cross-Program Invocation (CPI) safety
- Check-Effects-Interactions (CEI) pattern compliance
- Reentrancy attack vectors
- Callback attack analysis
- CPI signer seed correctness
- Mint authority and token account validation
- SPL Token program interaction safety
- State mutation ordering relative to external calls
- Account data borrowing conflicts

**Key Files**: All instructions with CPI calls: `trigger_big_pay_day.rs`, `free_claim.rs`, `admin_mint.rs`, `claim_rewards.rs`, `unstake.rs`, `withdraw_vested.rs`, `crank_distribution.rs`

**Output Sections**: Summary, CPI Call Map, CPI Analysis of Fixes, New Findings, Previous Findings Re-evaluation, Verified CPI Safety Patterns

---

## Agent #6: Arithmetic Safety & Precision

**Subagent**: `general-purpose` | **Model**: `opus` | **Background**: `true`

**Focus Areas**:
- Integer overflow/underflow in ALL arithmetic operations
- Checked vs unchecked arithmetic usage
- Fixed-point arithmetic precision and PRECISION constant usage
- Rounding direction analysis (who benefits from rounding?)
- Division by zero protection
- u64 vs u128 type safety
- Truncation when downcasting (u128 to u64)
- Dust attacks via precision loss
- Accumulated rounding errors across operations
- Token amount calculations correctness

**Key Arithmetic to Verify**: BPD rate calculation overflow safety, bonus precision loss, sum(bonuses) <= unclaimed guarantee, share_days overflow with large T-shares, all math.rs formulas, calculate_reward_debt overflow protection, event u128-to-u64 truncation

**Output Sections**: Summary, Arithmetic Analysis of Fixes (with value range traces), New Findings, Previous Findings Re-evaluation, Verified Arithmetic Patterns

---

## Agent #7: State Management & Data Integrity

**Subagent**: `general-purpose` | **Model**: `opus` | **Background**: `true`

**Focus Areas**:
- Account size (LEN) calculations and realloc correctness
- State field initialization completeness
- Counter consistency (total_stakers, total_t_shares, etc.)
- State machine transitions and flag management
- Double-action prevention (double-claim, double-unstake, double-BPD)
- Data serialization/deserialization correctness
- Account space allocation and realloc
- State migration and backward compatibility
- Cross-account state consistency
- Orphaned state and cleanup

**Key Checks**: LEN byte-by-byte verification, field initialization in create/init instructions, try_serialize safety in remaining_accounts loops, counter increment/decrement pairing, realloc::zero behavior

**Output Sections**: Summary, LEN Verification (byte-by-byte), State Analysis of Fixes, New Findings, Previous Findings Re-evaluation, Counter Consistency Matrix, Verified State Patterns

---

## Launch Instructions

To spin up the full team:
1. Read this file
2. Glob `programs/helix-staking/src/**/*.rs` to get current file list
3. Build shared context block with what changed since last audit
4. Launch all 7 agents in parallel with `run_in_background: true`
5. Each agent's prompt should include: their focus areas, shared context, full file list, output format, previous findings to re-evaluate
6. Wait for all 7 to complete
7. Compile consolidated report with cross-referenced findings

## Report Compilation

After all agents complete, produce:
- **Consolidated findings table** (deduplicated, highest severity wins)
- **Cross-agent corroboration** (findings flagged by multiple agents are higher confidence)
- **Comparison to previous audit** (what's fixed, what persists, what's new)
- **Overall verdict** (SECURE / CONDITIONAL / NOT PRODUCTION READY)
