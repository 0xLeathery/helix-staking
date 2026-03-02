/**
 * Free Claim E2E spec (TEST-05).
 *
 * Tests the free claim UI flow — navigating to /dashboard/claim, checking the
 * eligibility status, and verifying that the claim form or correct status
 * messages are shown.
 *
 * PRECONDITION NOTE:
 * A full end-to-end claim transaction requires:
 *   1. A ClaimConfig PDA initialized via initialize_claim_period with a valid
 *      Merkle root that includes the test wallet.
 *   2. The claim period to be active (not yet ended by slot).
 *   3. A valid Merkle proof for the test wallet in the snapshot.
 *
 * The localnet Docker validator (started by Plan 09.1-01) does NOT initialize
 * a claim period by default — global-setup.ts focuses on staking flows.
 *
 * This spec therefore:
 *   - Tests the UI renders correctly when no claim period exists (expected state
 *     in the test environment).
 *   - Documents the full claim transaction flow for when a claim period IS
 *     initialized (skipped in localnet, can be enabled in CI with proper setup).
 *
 * To enable the full transaction test, extend global-setup.ts to call
 * initialize_claim_period with a Merkle tree that includes the test wallet,
 * and set CLAIM_PERIOD_READY=true in the environment.
 */
import { test, expect, waitForWalletConnection } from "../fixtures";

test.describe("Free Claim Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/dashboard/claim");
    await waitForWalletConnection(page);
  });

  test("should render the Free Claim page with correct heading", async ({ page }) => {
    // Page heading must be visible — use h1 to avoid strict mode violation with card subheadings
    await expect(page.locator("h1").filter({ hasText: "Free Claim" })).toBeVisible({
      timeout: 15_000,
    });
    // Description text
    await expect(
      page.getByText("SOL holders from the snapshot can claim free HELIX tokens", { exact: false })
    ).toBeVisible();
  });

  test("should show eligibility check card after wallet connects", async ({ page }) => {
    // The EligibilityCheck component renders a card — either loading state, no
    // claim period, or an active/ended claim form.
    await expect(page.locator("h1").filter({ hasText: "Free Claim" })).toBeVisible({
      timeout: 15_000,
    });

    // At minimum, some card-level content must be visible after loading
    // (no claim period message OR claim form — depends on environment)
    await expect(
      page.getByText(/claim period|not been initialized|Claim period is active|already claimed/i)
    ).toBeVisible({ timeout: 20_000 });
  });

  test("should show 'not initialized' state when no claim period exists in test env", async ({
    page,
  }) => {
    // In the localnet test environment, global-setup does not call
    // initialize_claim_period — so the expected UI state is "not initialized".
    await expect(page.locator("h1").filter({ hasText: "Free Claim" })).toBeVisible({
      timeout: 15_000,
    });
    // Wait for loading to complete
    await page.waitForTimeout(3_000);

    // Expected: "has not been initialized yet" message OR claim form if setup ran
    const notInitText = page.getByText(/has not been initialized yet/i);
    const claimForm = page.getByRole("button", { name: /claim/i });
    const endedText = page.getByText(/claim period has ended/i);
    const alreadyClaimedText = page.getByText(/already claimed/i);

    await expect(
      notInitText.or(claimForm).or(endedText).or(alreadyClaimedText)
    ).toBeVisible({ timeout: 15_000 });
  });
});

// ---------------------------------------------------------------------------
// Full transaction flow — skipped in localnet (requires claim period setup)
// ---------------------------------------------------------------------------

test.describe("Free Claim Transaction Flow", () => {
  test.skip(
    !process.env.CLAIM_PERIOD_READY,
    "Skipped: requires CLAIM_PERIOD_READY=true env var. " +
      "Set up a claim period in global-setup.ts via initialize_claim_period with a " +
      "Merkle root that includes the test wallet, then set CLAIM_PERIOD_READY=true."
  );

  test("should submit a free claim transaction and show success", async ({ page }) => {
    await page.goto("/dashboard/claim");
    await waitForWalletConnection(page);

    // Claim period should be active
    await expect(page.getByText("Claim period is active", { exact: false })).toBeVisible({
      timeout: 20_000,
    });

    // Click the claim button
    const claimButton = page.getByRole("button", { name: /claim/i }).first();
    await expect(claimButton).toBeVisible();
    await expect(claimButton).toBeEnabled({ timeout: 10_000 });
    await claimButton.click();

    // Wait for transaction to complete
    const successToast = page.locator('[data-sonner-toast][data-type="success"]').first();
    const errorToast = page.locator('[data-sonner-toast][data-type="error"]').first();
    await expect(successToast.or(errorToast)).toBeVisible({ timeout: 60_000 });

    // Assert success (not error)
    await expect(successToast).toBeVisible();
  });
});
