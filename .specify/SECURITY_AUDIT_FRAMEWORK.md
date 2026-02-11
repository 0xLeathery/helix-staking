# Phase 1 Security Audit Framework
## Helix Staking Protocol — Self-Audit Baseline

**Status**: Localnet testing, $30 SOL at risk on mainnet launch  
**Objectives**: Establish measurable security criteria, identify critical gaps, prepare for Phase 2 professional audit  
**Timeline**: Complete by mainnet readiness

---

## I. ON-CHAIN PROGRAM SECURITY

### 1.1 Authority & Access Control

#### Criterion: All privileged instructions enforce correct authority
**What to measure:**
- [ ] Every admin instruction verifies `signer == global_state.admin`
- [ ] Every multisig instruction verifies Squads v4 authority (if applicable)
- [ ] No instruction can be called without proper authority checks

**How to test:**
```bash
# Run auth-specific tests
npx vitest run tests/bankrun -t "admin" -t "authority" -t "multisig"
```

**Acceptance criteria:**
- All unauthorized calls fail with proper error code
- All authorized calls succeed
- No way to escalate privileges

**Files to review:**
- `programs/helix-staking/src/instructions/*.rs` (all admin instructions)
- `programs/helix-staking/src/lib.rs` (instruction routing)

---

### 1.2 Token Operations & Overflow/Underflow

#### Criterion: No user funds can be lost due to arithmetic errors
**What to measure:**
- [ ] All token transfers use checked math (no unwrap/expect on arithmetic)
- [ ] All token mint/burn operations validate account ownership
- [ ] Staking amounts cannot exceed u64::MAX or available balance
- [ ] BPD calculations use `saturating_sub` to prevent underflow from speed bonuses

**How to test:**
```bash
npx vitest run tests/bankrun -t "overflow" -t "underflow" -t "balance" -t "stake amount"
```

**Acceptance criteria:**
- No panics from arithmetic operations
- Token amounts never exceed user's balance
- Speed bonus calculations never panic

**Files to review:**
- `programs/helix-staking/src/instructions/trigger_big_pay_day.rs`
- `programs/helix-staking/src/instructions/finalize_bpd_calculation.rs`
- `programs/helix-staking/src/instructions/crank_distribution.rs`
- `programs/helix-staking/src/instructions/math.rs`

---

### 1.3 PDA Validation & Signer Checks

#### Criterion: All PDAs are correctly derived and validated
**What to measure:**
- [ ] Every PDA is derived with correct seeds and program ID
- [ ] PDAs are immutable (no code can change them mid-operation)
- [ ] Signer validation matches account requirements
- [ ] Required signer PDAs are properly initialized

**How to test:**
```bash
npx vitest run tests/bankrun -t "PDA" -t "seed" -t "signer"
```

**Acceptance criteria:**
- All PDA derivations match anchor's auto-derived addresses
- Transactions fail if wrong PDA is provided
- Signer flags are validated

**Files to review:**
- `programs/helix-staking/src/state/*.rs`
- `programs/helix-staking/src/instructions/*.rs` (context structs)

---

### 1.4 State Initialization & Reinitialization

#### Criterion: Critical state cannot be overwritten or duplicated
**What to measure:**
- [ ] GlobalState can only be initialized once
- [ ] StakeAccounts cannot be reinitialized
- [ ] All initialization checks use proper constraints

**How to test:**
```bash
npx vitest run tests/bankrun -t "initialize" -t "reinitialize"
```

**Acceptance criteria:**
- Second initialization attempt fails
- No duplicate stake accounts for same user

**Files to review:**
- `programs/helix-staking/src/instructions/` (all init instructions)

---

### 1.5 Token-2022 Specific Concerns

#### Criterion: Token-2022 extensions are configured safely
**What to measure:**
- [ ] Mint extensions don't allow unauthorized modifications
- [ ] No transfer hooks bypass user intent
- [ ] Burn-and-mint model correctly handles supply changes
- [ ] Token accounts are created with correct metadata

**How to test:**
```bash
npx vitest run tests/bankrun -t "token" -t "mint" -t "burn"
```

**Acceptance criteria:**
- Mint supply changes only via authorized instructions
- No supply changes without events
- All burns correspond to claims

**Files to review:**
- `programs/helix-staking/src/instructions/admin_mint.rs`
- `programs/helix-staking/src/instructions/withdraw_vested.rs`
- Token initialization in setup code

---

## II. FRONTEND SECURITY

### 2.1 Private Key & Wallet Security

#### Criterion: User private keys are never exposed or misused
**What to measure:**
- [ ] No private keys stored in localStorage, sessionStorage, or memory logs
- [ ] Wallet adapter is correctly integrated (latest version)
- [ ] No custom key derivation or signing logic
- [ ] Signing requests are explicit and user-approved

**How to test:**
```bash
# Search for key storage
grep -r "localStorage\|sessionStorage" app/web/src --include="*.ts" --include="*.tsx"
grep -r "privateKey\|secret" app/web/src --include="*.ts" --include="*.tsx"
```

**Acceptance criteria:**
- No private key references in code
- All key operations delegated to wallet adapter

**Files to review:**
- `app/web/src/` (all wallet integration code)

---

### 2.2 Transaction Simulation & Validation

#### Criterion: All transactions are simulated before signing
**What to measure:**
- [ ] Every transaction is simulated via `simulateTransaction()`
- [ ] Simulation errors are shown to user before signing
- [ ] User sees clear confirmation of transaction intent (amount, recipient, fees)
- [ ] Stale data (outdated balances) is detected and handled

**How to test:**
```bash
# E2E tests should verify simulation flow
cd app/web
npx playwright test
```

**Acceptance criteria:**
- Transactions cannot be signed if simulation fails
- User must approve simulation result
- Clear error messages on failures

**Files to review:**
- `app/web/src/` (transaction creation and signing)

---

### 2.3 Input Validation

#### Criterion: User input cannot cause invalid transactions
**What to measure:**
- [ ] Stake amounts: > 0, <= user's balance, not NaN/Infinity
- [ ] Claim amounts: > 0, <= vested balance
- [ ] Recipient addresses: valid Solana pubkey format
- [ ] No XSS vectors in displayed data (escape balances, labels, etc.)

**How to test:**
```bash
# Check for input sanitization
grep -r "sanitize\|escape\|validate" app/web/src --include="*.ts" --include="*.tsx"
```

**Acceptance criteria:**
- Form rejects invalid inputs with clear errors
- Balances displayed as numbers, not raw data
- No user-supplied data in DOM without escaping

**Files to review:**
- `app/web/src/components/` (form handling)
- `app/web/src/hooks/` (validation logic)

---

## III. INDEXER & OFF-CHAIN SECURITY

### 3.1 Event Processing Atomicity

#### Criterion: Database state always matches on-chain state
**What to measure:**
- [ ] Event processing uses database transactions
- [ ] Checkpoint is only updated after all events are committed
- [ ] Duplicate events are idempotent (no duplicate rewards, claims, stakes)
- [ ] Events are processed in order

**How to test:**
```bash
cd services/indexer
npm run test
# Check for transaction boundaries in code
grep -r "transaction\|atomically" src --include="*.ts"
```

**Acceptance criteria:**
- Database rollback on failed event processing
- No partial state updates
- Duplicate events don't create duplicate entries

**Files to review:**
- `services/indexer/src/` (event handlers)
- `services/indexer/src/db/` (schema and transactions)

---

### 3.2 API Input Validation & Rate Limiting

#### Criterion: API cannot be abused to extract data or cause DoS
**What to measure:**
- [ ] All query parameters validated and type-checked
- [ ] Rate limiting prevents DoS (per-IP or per-key)
- [ ] No N+1 queries in API endpoints
- [ ] Sensitive data (private keys, wallet details) never returned

**How to test:**
```bash
# Test rate limiting
for i in {1..100}; do curl http://localhost:3000/api/stake-accounts; done

# Check for rate limit headers
curl -I http://localhost:3000/api/stake-accounts

# Look for sensitive data exposure
grep -r "private\|secret\|key" services/indexer/src --include="*.ts"
```

**Acceptance criteria:**
- 429 Too Many Requests after threshold
- All numeric inputs validated as numbers
- Queries use indexes and limits

**Files to review:**
- `services/indexer/src/routes/` (API endpoints)
- `services/indexer/src/middleware/` (validation, rate limiting)

---

### 3.3 Database Integrity & Migrations

#### Criterion: Database schema is consistent and migrations are safe
**What to measure:**
- [ ] All migrations are backward-compatible or have rollback plan
- [ ] Foreign key constraints prevent orphaned records
- [ ] Indexes exist on query columns (avoid full table scans)
- [ ] No direct SQL (use ORM to prevent SQL injection)

**How to test:**
```bash
cd services/indexer
npm run db:generate  # Check for schema conflicts
npm run db:verify    # If available

# Look for raw SQL
grep -r "query\|sql" src --include="*.ts" | grep -v "drizzle"
```

**Acceptance criteria:**
- Migrations run without errors
- All foreign keys are valid
- Common queries complete in <100ms

**Files to review:**
- `services/indexer/src/db/schema.ts`
- `services/indexer/src/db/migrations/`

---

## IV. CROSS-SYSTEM INTEGRATION

### 4.1 On-Chain to Off-Chain Synchronization

#### Criterion: Frontend and indexer see consistent state
**What to measure:**
- [ ] Indexer lag is acceptable (< 30 seconds for staking claims)
- [ ] Frontend gracefully handles stale data
- [ ] Transaction history matches on-chain events
- [ ] Balances always match: on-chain authority >= database total

**How to test:**
```bash
# Stake, then check indexer catches up
# Compare on-chain vs indexer balance for user
# Check transaction history completeness
```

**Acceptance criteria:**
- Indexer reprocess time < 30 seconds
- No discrepancies between on-chain and indexer
- All transactions appear in UI within timeout

**Files to review:**
- Program events emissions
- Indexer event handlers
- Frontend RPC queries

---

### 4.2 Multisig Integration (if applicable)

#### Criterion: Squads v4 multisig works correctly with program
**What to measure:**
- [ ] Admin instructions require Squads v4 signature
- [ ] Multisig transaction execution matches program expectations
- [ ] No way to bypass multisig for sensitive operations

**How to test:**
```bash
# Check that admin instructions reject non-multisig signers
npx vitest run tests/bankrun -t "multisig" -t "admin"
```

**Acceptance criteria:**
- Admin instruction fails without valid multisig authority
- Multisig member can create and execute proposals

**Files to review:**
- Admin instructions
- Squads v4 integration code

---

## V. TESTING & VERIFICATION

### Current Test Status
- **Bankrun tests**: Run with `npx vitest run tests/bankrun`
- **E2E tests**: Run with `cd app/web && npx playwright test`
- **Code analysis**: Run with `npm run xray` (X-Ray security scanner)

### Automated Tools to Run

**1. X-Ray Security Scanner (Sec3)**
```bash
npm run xray  # Scans Rust code for common Solana vulnerabilities
```

**2. Test Coverage**
```bash
npx vitest run --coverage tests/bankrun
# Goal: >95% coverage on critical paths (instructions, state mutations)
```

**3. Cargo Audit (Rust dependencies)**
```bash
cargo audit  # Checks for known vulnerabilities in dependencies
```

**4. Static Analysis**
```bash
# Check for unwrap/expect (panic vectors)
grep -r "unwrap\|expect" programs/helix-staking/src --include="*.rs" | grep -v "test"

# Check for unsafe blocks
grep -r "unsafe" programs/helix-staking/src --include="*.rs"
```

---

## VI. CRITICAL CHECKLIST FOR MAINNET

Before deploying to mainnet, verify all of the following:

- [ ] All tests pass: `npx vitest run tests/bankrun`
- [ ] All E2E tests pass: `cd app/web && npx playwright test`
- [ ] X-Ray scan shows no critical findings
- [ ] No unwrap/expect in production instruction handlers
- [ ] All admin instructions require multisig
- [ ] Indexer is synced within 30 seconds of on-chain activity
- [ ] No sensitive data in logs or error messages
- [ ] Rate limiting is enabled on API
- [ ] RPC proxy whitelist is configured
- [ ] Program ID is recorded for verification: `E9B7BsxdPS89M66CRGGbsCzQ9LkiGv6aNsra3cNBJha7`
- [ ] Verifiable build matches deployed program: `anchor build --verifiable && anchor verify <PROGRAM_ID>`

---

## VII. REMEDIATION WORKFLOW

When you find an issue:
1. Document it with test case (ideally failing test)
2. Create fix in isolated branch
3. Verify test passes
4. Re-run full audit checklist
5. Get second opinion from professional auditor (Phase 2)

---

## Next Steps

1. **Run Phase 1 checks** (right now)
   - Execute all automated tools
   - Review critical files
   - Document findings

2. **Fix high-severity issues** (this week)
   - Authority checks
   - Overflow/underflow
   - Input validation

3. **Schedule Phase 2 professional audit** (2-4 weeks)
   - Once Phase 1 is clean
   - Before mainnet deployment

---

**Last Updated**: 2026-02-12
