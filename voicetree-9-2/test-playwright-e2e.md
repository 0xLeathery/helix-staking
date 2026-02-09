---
color: yellow
agent_name: Aki
---

# Playwright E2E Tests

**Parent:** [[test-and-audit-infra.md]]

Browser-based end-to-end tests using Playwright for the Next.js web application. Tests cover navigation, dashboard rendering, transaction flows (create stake, end stake, claim rewards), and UI feature pages. The suite runs against a local solana-test-validator with pre-seeded protocol state.

## Key Test Files

### `app/web/playwright.config.ts` -- Test Configuration

Defines two Playwright projects with different execution strategies:

- **"chromium" project:** Runs all E2E specs except `transactions/` directory. Standard timeout. Parallelizable.
- **"transaction-tests" project:** Runs only `transactions/` specs with 90-second timeout, serial execution mode, and dependency on "chromium" project completing first (ensures UI is working before testing on-chain transactions).
- **Global setup/teardown:** `global-setup.ts` starts `solana-test-validator` with the BPF program loaded, initializes protocol, seeds test data. `global-teardown.ts` kills the validator process.
- **Web server:** Starts Next.js dev server with `NEXT_PUBLIC_SKIP_WALLET_CHECK=true` and `NEXT_PUBLIC_TEST_WALLET_SECRET` environment variables for automated wallet connection.

### `app/web/e2e/fixtures.ts` -- Custom Test Fixtures

Extends Playwright's base `test` with automatic wallet connection:

- **localStorage injection:** Sets `walletName` in localStorage to trigger `TestWalletAdapter` auto-connect on page load.
- **`waitForWalletConnection(page)`**: Polls for a truncated public key string appearing in the sidebar, confirming wallet is connected.
- **`waitForTxSuccess(page)`**: Waits for a Sonner toast notification with success status, used after transaction submission.
- **`waitForToast(page, text)`**: Generic toast detection helper.

### `app/web/e2e/global-setup.ts` -- Environment Bootstrap

Comprehensive test environment setup:

1. Starts `solana-test-validator` with `--bpf-program` flag loading the compiled Helix Staking program.
2. Initializes protocol with `slotsPerDay=10` (accelerated time for fast test execution).
3. Generates a test wallet keypair.
4. Creates Associated Token Account (ATA) for the test wallet.
5. Mints 500 HELIX to the test wallet via `admin_mint`.
6. Creates 2 pre-existing stakes (10 HELIX / 30 days and 5 HELIX / 60 days) so dashboard tests have data.
7. Advances 50 slots and cranks distribution 5 times to generate claimable rewards.
8. Saves test wallet secret as base58 string to `.test-wallet.json` for the Next.js app to load.

### `app/web/e2e/dashboard.spec.ts` -- Dashboard Tests (6 tests)

- Page title displays correctly.
- Protocol stats section shows values (Total Staked, Total Shares, Current Day).
- Portfolio section renders with connected wallet data.
- Stakes section lists pre-seeded stakes.
- Sidebar navigation links are present and functional.
- Stake detail page shows not-found for invalid stake ID, with back-to-dashboard link.

### `app/web/e2e/navigation.spec.ts` -- Navigation Tests (8 tests)

Tests all sidebar navigation links exist and route correctly:
Dashboard, New Stake, Rewards, Free Claim, Analytics, Swap, Leaderboard, Whale Tracker.

### `app/web/e2e/rewards.spec.ts` -- Rewards Page Tests (3 tests)

- Rewards heading renders.
- Rewards overview section shows pending rewards and BPD information.
- Values display in HELIX denomination.

### `app/web/e2e/analytics.spec.ts` -- Analytics Page Tests (4 tests)

- Page title renders.
- Stats cards display key metrics.
- Charts render: T-Share Price History, Stake Duration Distribution, Supply Breakdown.
- Sidebar navigation functional from analytics page.

### `app/web/e2e/swap.spec.ts` -- Swap Page Tests (2 tests)

- Jupiter terminal container and script tag are present in DOM.
- Sidebar navigation functional from swap page.

### `app/web/e2e/transactions/create-stake.spec.ts` -- Create Stake Flow (2 tests)

- **Full wizard flow:** Navigate to New Stake -> enter amount -> select duration -> confirm step -> submit transaction -> verify success toast and redirect.
- **Wizard step verification:** Each step displays correct content, back button navigates to previous step.

### `app/web/e2e/transactions/end-stake.spec.ts` -- End Stake Flow (1 serial test)

- Navigate to a specific stake detail page.
- Click "End Stake" / unstake button.
- Check the confirmation checkbox (acknowledging potential penalty).
- Submit the unstake transaction.
- Verify redirect back to dashboard after success.

### `app/web/e2e/transactions/claim-rewards.spec.ts` -- Claim Rewards Flow (1 test)

- Navigate to a stake detail page via "Claim Rewards" link.
- Click the claim button.
- Verify success toast notification.

## Test Patterns & Utilities

- **TestWalletAdapter pattern:** The app's `providers.tsx` detects `NEXT_PUBLIC_TEST_WALLET_SECRET` and registers a `TestWalletAdapter` that auto-connects with the seeded keypair, bypassing real wallet UI.
- **Fixture-based wallet injection:** Custom Playwright fixtures set localStorage before each test, enabling wallet auto-connection without manual interaction.
- **Serial transaction tests:** Transaction specs run serially because they modify on-chain state (creating/ending stakes). Running in parallel would cause race conditions on shared validator state.
- **Accelerated time:** `slotsPerDay=10` in global setup means 1 "protocol day" passes in ~4 seconds of real time, enabling reward accumulation tests without long waits.
- **Pre-seeded state:** Global setup creates stakes and cranks distributions before tests run, so dashboard/rewards tests have meaningful data to assert against.
- **Toast-based transaction verification:** Success/failure is detected via Sonner toast notifications rather than polling on-chain state, testing the actual user experience.

## Notable Gotchas

- **Validator must be killed on teardown:** Global teardown kills the `solana-test-validator` process. If tests crash without cleanup, a zombie validator blocks port 8899 for subsequent runs.
- **`NEXT_PUBLIC_SKIP_WALLET_CHECK=true` is required:** Without this env var, the dashboard layout shows a "connect wallet" gate, blocking all dashboard test navigation.
- **Transaction tests depend on chromium project:** The `"transaction-tests"` Playwright project has `dependencies: ["chromium"]`, ensuring basic UI tests pass before attempting on-chain transactions. If UI is broken, transaction tests are skipped.
- **`.test-wallet.json` is ephemeral:** Generated by global setup, consumed by the Next.js app at runtime. Must not be committed to git. If it persists between runs with different validator states, tests may fail with stale keypair data.
- **90-second timeout for transactions:** On-chain transaction confirmation can be slow in test validator; the extended timeout prevents flaky failures on slower machines.
- **CSP headers affect wallet:** The Next.js middleware sets Content Security Policy headers that must whitelist Solana RPC endpoints. Misconfigured CSP silently blocks wallet RPC calls.
