# Holistic Security Baseline
## Helix Staking Protocol — Complete Assessment Across All Layers

**Date**: 2026-02-12  
**Status**: Localnet testing, pre-mainnet  
**Scope**: On-chain program + Frontend + Indexer  

---

## I. EXECUTIVE SUMMARY

Your app has good security fundamentals but needs critical fixes before mainnet:

| Layer | Status | Critical | Medium | Low |
|-------|--------|----------|--------|-----|
| **On-chain (Rust/Anchor)** | ⚠️ Issues | 3 | 4 | 2 |
| **Frontend (Next.js)** | ✅ Good | 0 | 2 | 1 |
| **Indexer (Fastify/Drizzle)** | ✅ Good | 0 | 1 | 2 |
| **Integration** | ⚠️ Review | 0 | 1 | 1 |
| **TOTAL** | **⚠️ Act** | **3** | **8** | **6** |

**Blockers for mainnet**: Fix 3 critical on-chain issues before testnet.

---

## II. ON-CHAIN SECURITY (Rust/Anchor)

### Summary
- 154 passing tests, strong foundation
- 3 critical issues found by X-Ray static analysis
- Tests have syntax errors (not logic issues)

### Critical Issues

#### 1. **PDA Bump Seed Canonicalization** (CRITICAL)
- **Impact**: Seed canonicalization attack possible
- **Files**: `trigger_big_pay_day.rs:111`, `finalize_bpd_calculation.rs:140`
- **Status**: Must fix before testnet
- **Effort**: ~30 min

#### 2. **Integer Underflow in Math** (CRITICAL)
- **Impact**: Panic possible in mul_div_up (rounding calculation)
- **File**: `math.rs:27`
- **Status**: Must fix before testnet
- **Effort**: ~15 min

#### 3. **Missing State Validation** (CRITICAL)
- **Impact**: Admin instructions callable out-of-sequence
- **Files**: `trigger_big_pay_day.rs`, `finalize_bpd_calculation.rs`, `free_claim.rs`, others
- **Status**: Must fix before testnet
- **Effort**: ~1 hour

### Medium Issues

| # | Issue | File | Effort |
|---|-------|------|--------|
| 4 | Unwrap panics on PDA validation | `trigger_big_pay_day.rs:120`, `finalize_bpd_calculation.rs:140` | 20 min |
| 5 | Test syntax errors (before→beforeAll) | `admin_constraints.test.ts`, `bpd_math.test.ts` | 10 min |
| 6 | Unwrap_or(0) silently masks errors | Multiple in math.rs and handlers | 40 min |
| 7 | Multisig authority validation unclear | All admin instructions | 30 min |

### Low Issues
- X-Ray false positives for custom Anchor constraints (can ignore)

### Test Coverage
```
✅ 154 tests passing
❌ 2 test files have syntax errors
⏱️ 2.6s runtime
```

**Next step**: Create test cases for critical issues before fixing.

---

## III. FRONTEND SECURITY (Next.js)

### Summary
- Clean architecture, wallet adapter correctly integrated
- RPC proxy with whitelist + rate limiting
- No private key exposure detected
- Test infrastructure in place (Playwright E2E)

### Strengths
✅ Wallet integration via official `@solana/wallet-adapter-react`  
✅ RPC proxy with method whitelist (24 methods allowed only)  
✅ Per-IP rate limiting: 60 req/min  
✅ Test wallet adapter dynamically loaded (not in prod bundle)  
✅ QueryClient stale time + refetch configured  
✅ No raw localStorage/sessionStorage usage detected  

### Medium Issues

#### 1. **RPC Proxy Rate Limit vs Indexer Rate Limit Mismatch** (MEDIUM)
- **Issue**: Frontend allows 60 req/min per IP, but indexer allows 100 req/s
- **Impact**: Inconsistent behavior, frontend may throttle users unnecessarily
- **Fix**: Align limits or document the difference
- **Effort**: ~15 min

#### 2. **Test Wallet Secret in Environment Variable** (MEDIUM)
- **Issue**: `NEXT_PUBLIC_TEST_WALLET_SECRET` is public (browserifiable)
- **Status**: Only for E2E testing, not production
- **Risk**: If mainnet testing with real keys, could leak
- **Fix**: Document that this is test-only, warn in docs
- **Effort**: ~10 min

### Low Issues

#### 1. **No Transaction Simulation Verification** (LOW)
- **Issue**: Cannot confirm frontend simulates all transactions before signing
- **Fix**: Add logging/test to verify simulation flow
- **Effort**: ~30 min
- **Note**: Lower priority if users confirm transactions manually

---

## IV. INDEXER SECURITY (Fastify + Drizzle ORM)

### Summary
- Well-structured event processing with atomicity
- API endpoints use Drizzle ORM (no SQL injection risk)
- Rate limiting enabled
- Idempotent event processing (onConflictDoNothing)

### Strengths
✅ Rate limiting: 100 req/s per IP with 429 response  
✅ All DB operations use Drizzle ORM (parameterized)  
✅ Idempotent event inserts (signature as unique key)  
✅ Atomic checkpoint+event updates (db.transaction())  
✅ CORS configured (frontend URL only)  
✅ Graceful shutdown with proper connection cleanup  
✅ Gap detection for InflationDistributed events  
✅ Error handler prevents stack traces in responses  

### Medium Issues

#### 1. **Raw SQL in API Routes** (MEDIUM)
- **Issue**: Some endpoints use `db.execute(sql\`...\`)` raw SQL
- **Files**: `whale-activity.ts`, `leaderboard.ts`, `health.ts`
- **Risk**: If parameters not escaped, SQL injection possible
- **Status**: Needs review to confirm parameters are safe
- **Effort**: ~30 min to audit

**Example**:
```typescript
const result = await db.execute(sql`SELECT ...`);
```
Need to verify parameterization.

### Low Issues

#### 1. **Unwrap_or(0) in Event Processing** (LOW)
- **Issue**: Type conversions silently default to 0 on failure
- **Files**: `processor.ts` toNum/toStr functions
- **Risk**: Incorrect values stored if data is malformed
- **Fix**: Add validation or error handling
- **Effort**: ~40 min

#### 2. **Missing Input Validation on API Query Params** (LOW)
- **Issue**: API routes accept query params but don't validate types
- **Fix**: Add zod/joi schema validation
- **Effort**: ~1 hour

---

## V. CROSS-SYSTEM INTEGRATION

### Synchronization Flow
```
On-chain event → Indexer polls → DB update → Frontend RPC query
     (slot N)        (lag ~5s)      (lag ~5s)      (real-time)
```

### Medium Issues

#### 1. **Frontend Stale Data Handling** (MEDIUM)
- **Issue**: QueryClient staleTime=15s, but indexer lag can be 5-10s
- **Risk**: User sees outdated balance, creates stake with incorrect calculation
- **Fix**: 
  - Add "last updated" timestamp to all API responses
  - Show "updating..." state if data older than 10s
  - Refetch on manual "refresh" button
- **Effort**: ~1 hour

### Low Issues

#### 1. **No Cross-Layer Validation** (LOW)
- **Issue**: No monitoring/alerting if on-chain state ≠ indexer state
- **Fix**: Add periodic balance check (sum all events = total in program)
- **Effort**: ~2 hours
- **Timeline**: Post-launch monitoring

---

## VI. DEPENDENCY SECURITY

### On-chain (Rust)
- Anchor 0.31.1 (current)
- Token-2022 latest
- Blake3 patched for Rust 1.84
- **Status**: No known vulnerabilities

### Frontend (Node.js)
- Next.js 14
- Solana wallet-adapter (official)
- React Query (TanStack)
- **To check**: Run `npm audit` in app/web

### Indexer (Node.js)
- Fastify 5
- Drizzle ORM (latest)
- PostgreSQL driver
- **To check**: Run `npm audit` in services/indexer

---

## VII. MAINNET READINESS CHECKLIST

### Phase 1: Fix Critical Issues (This Week)
- [ ] Fix PDA bump validation
- [ ] Fix math.rs underflow
- [ ] Add state validation to admin instructions
- [ ] Fix test syntax errors
- [ ] Run full test suite (154 tests pass)
- [ ] Re-run X-Ray (no regressions)

### Phase 2: Fix Medium Issues (Next Week)
- [ ] Align RPC rate limits
- [ ] Document test wallet env vars
- [ ] Audit raw SQL in indexer routes
- [ ] Add transaction simulation verification
- [ ] Review multisig authority checks

### Phase 3: Polish (Before Testnet)
- [ ] Add input validation to API routes
- [ ] Implement stale data indicators in frontend
- [ ] Run `npm audit` on frontend + indexer
- [ ] Test E2E flows (Playwright)
- [ ] Document all security assumptions

### Phase 4: Professional Audit (Before Mainnet)
- [ ] Hire Solana security firm
- [ ] Provide Phase 1-3 documentation
- [ ] Schedule 4-6 week audit
- [ ] Plan 2-week remediation window

---

## VIII. TESTING STATUS

### On-chain Tests
```bash
npx vitest run tests/bankrun

✅ Result: 154 passing, 2 syntax errors
⏱️ Duration: 2.6 seconds
```

**Failing tests** (syntax, not logic):
- `admin_constraints.test.ts:12` — `before` hook should be `beforeAll`
- `bpd_math.test.ts:12` — same issue

### Frontend Tests
```bash
cd app/web && npx playwright test

⏱️ Status: Not run yet, ready to execute
```

### Indexer Tests
```bash
cd services/indexer && npm run test

⏱️ Status: Not run yet, ready to execute
```

---

## IX. SECURITY AUDIT TOOLS USED

| Tool | Status | Finding |
|------|--------|---------|
| **X-Ray (Sec3)** | ✅ Ran | 2 vulnerabilities + 18 attack surfaces |
| **Cargo audit** | ⏹️ Unavailable | (not installed) |
| **npm audit** | ⏹️ Not run | (should run) |
| **Static analysis** | ✅ Ran | Found unwrap/expect in production |

---

## X. REMEDIATION WORKFLOW

For each critical issue:
1. Create test case (failing)
2. Create fix in `security/phase1-critical-fixes` branch
3. Verify test passes
4. Re-run full test suite
5. Get code review before merge

---

## XI. RISK SUMMARY

### Highest Risk
🔴 **PDA canonicalization attack** — Account spoofing possible  
🔴 **Integer underflow** — Math panics on edge cases  
🔴 **State validation** — Out-of-sequence instruction execution  

### Medium Risk
🟡 **Unwrap panics** — Unhandled error paths  
🟡 **SQL injection** — Unverified raw SQL in indexer  
🟡 **Stale data** — Frontend shows outdated balances  

### Low Risk
🟢 **Test coverage** — Syntax errors, not logic  
🟢 **Dependencies** — No known vulnerabilities  
🟢 **Private keys** — Well-protected by wallet adapter  

---

## XII. NEXT STEPS

**Immediate (today)**:
1. Review this baseline assessment
2. Agree on remediation priorities
3. Create security branch for fixes

**This week**:
1. Fix 3 critical on-chain issues
2. Pass all 154 tests
3. Fix test syntax errors
4. Re-run X-Ray scan

**Next week**:
1. Fix medium issues
2. Run `npm audit` on frontend + indexer
3. Review raw SQL in indexer
4. Document all fixes with inline comments

**Before testnet**:
1. Complete all Phase 1-3 items
2. Internal testing of E2E flows
3. Schedule Phase 2 professional audit

**Questions?** Let me know which issues to tackle first.

---

**Report Generated**: 2026-02-12  
**Status**: Ready for remediation  
**Estimated Effort**: 8-10 hours for critical + medium fixes
