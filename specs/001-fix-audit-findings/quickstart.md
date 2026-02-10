# Quickstart: Testing Audit Fixes

## Prerequisites
- Rust 1.75+
- Node.js 20+
- Anchor 0.31.0
- Docker (for verifiable build test)

## 1. Program Security Tests (Bankrun)
Run the bankrun test suite to verify math fixes and constraints.
```bash
cd tests/bankrun
npm test
# Verify specific BPD scenario
npm test -- -t "BPD speed bonus saturation"
```

## 2. Frontend Security Checks
Verify no secrets in bundle and simulation guards.
```bash
cd app/web
# Check for secrets (should be empty)
grep -r "NEXT_PUBLIC_TEST_WALLET_SECRET" .next/
# Run E2E tests for error handling
npx playwright test e2e/error-boundary.spec.ts
```

## 3. Indexer Pagination Test
Simulate a large gap and verify catchup.
```bash
cd services/indexer
# 1. Reset DB
npm run db:reset
# 2. Start mock chain with gap (custom script)
npm run test:mock-gap
# 3. Start indexer
npm start
# 4. Check logs for "Backward pagination: fetching previous batch"
```

## 4. Verifiable Build
Test the Docker build process.
```bash
# From repo root
anchor build --verifiable
# Check output in target/verifiable/
ls -l target/verifiable/helix_staking.so
```