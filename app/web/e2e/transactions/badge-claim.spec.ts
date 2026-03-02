/**
 * Badge Claim E2E spec (TEST-05, TEST-06, ROADMAP SC-5).
 *
 * Tests the badge gallery page UI flow — navigating to /dashboard/badges,
 * verifying the page renders correctly with headings, section labels, and
 * badge cards, and testing the claim dialog interaction.
 *
 * PRECONDITIONS FOR FULL TRANSACTION TEST:
 * A complete badge mint transaction requires all of the following:
 *   1. Bubblegum V2 collection initialized via setup-badge-collection.ts
 *      (creates a compressed NFT tree and registers it with the program).
 *   2. DAS (Digital Asset Standard) indexer running and synced — the
 *      /api/badges/claimed endpoint queries DAS to determine which badges
 *      a wallet has already minted.
 *   3. The badge eligibility API (/api/badges) must return eligible=true
 *      for at least one badge for the test wallet. In the default Docker
 *      localnet environment, the test wallet does have a stake (from
 *      global-setup.ts), so the "First Stake" badge should be eligible —
 *      but only after the badge_eligibility table is populated by the indexer.
 *
 * HOW THIS SPEC WORKS IN DEFAULT LOCALNET:
 *   - UI tests (Group 1) always run — they test page rendering and structure.
 *   - Transaction tests (Group 2) are skipped via BADGE_MINT_READY env var.
 *   - This is consistent with the pattern used in free-claim.spec.ts,
 *     referral-stake.spec.ts, and bpd-flow.spec.ts.
 *
 * TO ENABLE FULL TRANSACTION TESTS:
 *   1. Run setup-badge-collection.ts to initialize the Bubblegum V2 collection.
 *   2. Ensure the DAS indexer is running and badge_eligibility is populated.
 *   3. Confirm /api/badges returns at least one badge with eligible=true for
 *      the test wallet.
 *   4. Set BADGE_MINT_READY=true in the environment before running E2E tests.
 */
import { test, expect, waitForWalletConnection } from "../fixtures";

// ---------------------------------------------------------------------------
// Group 1: Badge Gallery Page — UI tests (always run)
// ---------------------------------------------------------------------------

test.describe("Badge Gallery Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/dashboard/badges");
    await waitForWalletConnection(page);
  });

  test("should render the Achievement Badges page with correct heading", async ({ page }) => {
    // h1 heading must be visible — filter by text to avoid strict mode violations
    await expect(
      page.locator("h1").filter({ hasText: "Achievement Badges" })
    ).toBeVisible({ timeout: 15_000 });

    // Description text — the page describes soulbound NFT badges
    await expect(
      page.getByText("soulbound NFT badges", { exact: false })
    ).toBeVisible({ timeout: 15_000 });
  });

  test("should show Milestones and Tier Badges sections", async ({ page }) => {
    // Wait for page heading first (confirms page loaded)
    await expect(
      page.locator("h1").filter({ hasText: "Achievement Badges" })
    ).toBeVisible({ timeout: 15_000 });

    // Both section headings must be visible — use exact:true per established
    // Pattern (prevents partial matches; see 13-05 decisions)
    await expect(
      page.getByRole("heading", { name: "Milestones", exact: true })
    ).toBeVisible({ timeout: 15_000 });

    await expect(
      page.getByRole("heading", { name: "Tier Badges", exact: true })
    ).toBeVisible({ timeout: 15_000 });
  });

  test("should display badge cards with names after loading", async ({ page }) => {
    // Wait for the Milestones section to confirm loading is complete
    await expect(
      page.getByRole("heading", { name: "Milestones", exact: true })
    ).toBeVisible({ timeout: 15_000 });

    // "First Stake" badge is always present — the milestone badge every
    // test wallet earns by having created a stake in global-setup.
    // This confirms at least one badge card was rendered by the gallery.
    await expect(page.getByText("First Stake")).toBeVisible({ timeout: 15_000 });
  });
});

// ---------------------------------------------------------------------------
// Group 2: Badge Claim Transaction Flow — skipped unless BADGE_MINT_READY=true
// ---------------------------------------------------------------------------

test.describe("Badge Claim Transaction Flow", () => {
  test.skip(
    !process.env.BADGE_MINT_READY,
    "Skipped: requires BADGE_MINT_READY=true env var. " +
      "Badge minting requires the following preconditions not available in the " +
      "default Docker localnet environment:\n" +
      "  1. Bubblegum V2 collection must be initialized via setup-badge-collection.ts " +
      "(creates a compressed NFT tree and registers it with the program).\n" +
      "  2. A DAS indexer must be running and synced — /api/badges/claimed " +
      "queries DAS to determine which badges the test wallet has already minted.\n" +
      "  3. The badge eligibility API (/api/badges) must return eligible=true " +
      "for at least one badge for the test wallet.\n" +
      "Steps to enable:\n" +
      "  1. Run: npx ts-node scripts/setup-badge-collection.ts\n" +
      "  2. Ensure the DAS-compatible indexer is running and synced.\n" +
      "  3. Verify /api/badges returns eligible=true for the test wallet.\n" +
      "  4. Set BADGE_MINT_READY=true before running the E2E suite."
  );

  test("should open claim dialog when clicking Claim on an eligible badge", async ({ page }) => {
    await page.goto("/dashboard/badges");
    await waitForWalletConnection(page);

    // Wait for the badge gallery to fully load
    await expect(
      page.getByRole("heading", { name: "Milestones", exact: true })
    ).toBeVisible({ timeout: 15_000 });

    // Click the first visible "Claim" button — appears on eligible badges
    const claimButton = page.getByRole("button", { name: "Claim" }).first();
    await expect(claimButton).toBeVisible({ timeout: 15_000 });
    await claimButton.click();

    // Dialog should open with the correct title
    await expect(
      page.getByRole("dialog").getByText("Claim Badge")
    ).toBeVisible({ timeout: 10_000 });

    // "Confirm Mint" button is inside the dialog
    await expect(
      page.getByRole("button", { name: "Confirm Mint" })
    ).toBeVisible({ timeout: 10_000 });

    // Soulbound notice is displayed in the dialog
    await expect(
      page.getByText("soulbound", { exact: false })
    ).toBeVisible({ timeout: 10_000 });

    // "Cancel" button allows dismissing without minting
    await expect(
      page.getByRole("button", { name: "Cancel" })
    ).toBeVisible({ timeout: 10_000 });
  });

  test("should submit badge mint and show celebration overlay", async ({ page }) => {
    await page.goto("/dashboard/badges");
    await waitForWalletConnection(page);

    // Wait for the badge gallery to fully load
    await expect(
      page.getByRole("heading", { name: "Milestones", exact: true })
    ).toBeVisible({ timeout: 15_000 });

    // Click the first "Claim" button to open the dialog
    const claimButton = page.getByRole("button", { name: "Claim" }).first();
    await expect(claimButton).toBeVisible({ timeout: 15_000 });
    await claimButton.click();

    // Confirm the dialog opened
    await expect(
      page.getByRole("dialog").getByText("Claim Badge")
    ).toBeVisible({ timeout: 10_000 });

    // Click "Confirm Mint" to initiate the badge mint transaction
    await page.getByRole("button", { name: "Confirm Mint" }).click();

    // Wait for success: either a toast notification OR the celebration overlay
    // The BadgeCelebration overlay shows "Share on X" on success (from Phase 11)
    const successToast = page.locator('[data-sonner-toast][data-type="success"]').first();
    const celebrationOverlay = page.getByText("Share on X", { exact: false });
    await expect(successToast.or(celebrationOverlay)).toBeVisible({ timeout: 60_000 });

    // After minting, the badge should no longer show a "Claim" button in the
    // gallery — it now shows "Claimed" with a date and "View on Solscan" link.
    // Wait for the celebration overlay to dismiss (auto-dismisses after ~5s)
    await page.waitForTimeout(6_000);
    await expect(page.getByText("Claimed", { exact: false })).toBeVisible({ timeout: 15_000 });
  });
});
