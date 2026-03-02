/**
 * Referral Stake E2E spec (TEST-06).
 *
 * Tests stake creation when a ?ref= URL parameter is provided, verifying that:
 *   - The stake wizard loads with the referral bonus indicator visible
 *   - The ConfirmStep shows "+10% T-Shares" referral bonus line
 *   - The stake transaction completes successfully via createStakeWithReferral
 *
 * The referrer is a dedicated keypair created by global-setup.ts each run.
 * global-setup creates an ATA for the referrer and writes its pubkey to
 * e2e/.referrer-pubkey.txt. This avoids self-referral (the referrer is
 * a different wallet from the connected test wallet) and ensures the
 * referrer always has a HELIX ATA (required for the pre-check in
 * useCreateStakeWithReferral).
 */
import { test, expect, waitForWalletConnection } from "../fixtures";
import * as fs from "fs";
import * as path from "path";

// Path written by global-setup.ts
const REFERRER_PUBKEY_PATH = path.resolve(__dirname, "../.referrer-pubkey.txt");

function getReferrerPubkey(): string {
  try {
    return fs.readFileSync(REFERRER_PUBKEY_PATH, "utf-8").trim();
  } catch {
    // File not yet written (first run before global-setup) — fall back to a no-op
    return "11111111111111111111111111111111"; // SystemProgram.programId (invalid referrer)
  }
}

const REFERRER_PUBKEY = getReferrerPubkey();

test.describe("Referral Stake — UI with ?ref= parameter", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to stake page with referral parameter
    await page.goto(`/dashboard/stake?ref=${REFERRER_PUBKEY}`);
    await waitForWalletConnection(page);
  });

  test("should load the stake wizard with referral parameter in URL", async ({ page }) => {
    // Step 1 of the wizard should be visible
    await expect(page.getByText("Choose Amount")).toBeVisible({ timeout: 15_000 });
    await expect(page.locator("#amount")).toBeEnabled({ timeout: 15_000 });
  });

  test("should show referral bonus indicator on ConfirmStep", async ({ page }) => {
    // Advance through wizard to ConfirmStep to see the referral bonus line
    await expect(page.getByText("Choose Amount")).toBeVisible({ timeout: 15_000 });
    await expect(page.locator("#amount")).toBeEnabled({ timeout: 15_000 });
    await page.locator("#amount").fill("1");
    await page.getByRole("button", { name: "Next" }).click();

    // Step 2: Duration
    await expect(page.getByText("Choose Duration")).toBeVisible({ timeout: 10_000 });
    await page.locator("#days").fill("30");
    await page.getByRole("button", { name: "Next" }).click();

    // Step 3: Review & Confirm — should show referral bonus
    await expect(page.getByText("Review & Confirm")).toBeVisible({ timeout: 10_000 });

    // The ConfirmStep renders "+10% T-Shares" when a referrer is set
    await expect(page.getByText("+10% T-Shares")).toBeVisible({ timeout: 10_000 });
    // Also confirm the "Referral Bonus" label is present
    await expect(page.getByText("Referral Bonus")).toBeVisible();
  });
});

// ---------------------------------------------------------------------------
// Referral stake transaction — skipped unless program supports create_stake_with_referral
// ---------------------------------------------------------------------------

test.describe.serial("Referral Stake Transaction", () => {
  test.skip(
    !process.env.REFERRAL_PROGRAM_READY,
    "Skipped: requires REFERRAL_PROGRAM_READY=true env var. " +
      "The createStakeWithReferral instruction was added in Phase 10. " +
      "The Docker validator must be restarted with the Phase 10+ program binary. " +
      "Steps:\n" +
      "  1. Rebuild the program: anchor build\n" +
      "  2. Restart the Docker validator with the updated .so binary\n" +
      "  3. Re-run the bootstrap: docker/bootstrap.ts\n" +
      "  4. Set REFERRAL_PROGRAM_READY=true before running E2E tests.\n" +
      "Note: Error 101 (InstructionFallbackNotFound) confirms the deployed program\n" +
      "does not yet include the create_stake_with_referral instruction."
  );

  test("should create a stake with referral bonus and show success screen", async ({ page }) => {
    await page.goto(`/dashboard/stake?ref=${REFERRER_PUBKEY}`);
    await waitForWalletConnection(page);

    // Step 1: Amount
    await expect(page.getByText("Choose Amount")).toBeVisible({ timeout: 15_000 });
    await expect(page.locator("#amount")).toBeEnabled({ timeout: 15_000 });
    await page.locator("#amount").fill("1");
    await page.getByRole("button", { name: "Next" }).click();

    // Step 2: Duration
    await expect(page.getByText("Choose Duration")).toBeVisible({ timeout: 10_000 });
    await page.locator("#days").fill("30");
    await page.getByRole("button", { name: "Next" }).click();

    // Step 3: Confirm — verify referral bonus line is present
    await expect(page.getByText("Review & Confirm")).toBeVisible({ timeout: 10_000 });
    await expect(page.getByText("+10% T-Shares")).toBeVisible({ timeout: 10_000 });

    // Submit
    const confirmButton = page.getByRole("button", { name: "Confirm & Stake" });
    await confirmButton.click();

    // Wait for transaction success screen
    const successText = page.getByText("Stake Created Successfully!");
    const errorToast = page.locator('[data-sonner-toast][data-type="error"]').first();
    await expect(successText.or(errorToast)).toBeVisible({ timeout: 60_000 });

    // Assert success (createStakeWithReferral instruction used)
    await expect(successText).toBeVisible();
    await expect(page.getByText("View My Stakes")).toBeVisible();
  });
});
