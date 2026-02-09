import { test, expect, waitForWalletConnection } from "../fixtures";

test.describe("Create Stake Transaction", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/dashboard/stake");
    await waitForWalletConnection(page);
  });

  test("should navigate through stake wizard and submit transaction", async ({ page }) => {
    // Step 1: Amount
    await expect(page.getByText("Choose Amount")).toBeVisible({
      timeout: 15_000,
    });
    await expect(page.locator("#amount")).toBeEnabled({ timeout: 15_000 });
    await page.locator("#amount").fill("1");
    await page.getByRole("button", { name: "Next" }).click();

    // Step 2: Duration
    await expect(page.getByText("Choose Duration")).toBeVisible({
      timeout: 10_000,
    });
    await page.locator("#days").fill("30");
    await page.getByRole("button", { name: "Next" }).click();

    // Step 3: Review & Confirm
    await expect(page.getByText("Review & Confirm")).toBeVisible({
      timeout: 10_000,
    });

    // Verify summary shows our values
    await expect(page.getByText("1.00", { exact: false })).toBeVisible();
    await expect(page.getByText("30 days", { exact: false })).toBeVisible();

    // Click confirm and submit transaction
    const confirmButton = page.getByRole("button", { name: "Confirm & Stake" });
    await confirmButton.click();

    // Wait for transaction to complete — success screen or error toast
    const successText = page.getByText("Stake Created Successfully!");
    const errorToast = page.locator('[data-sonner-toast][data-type="error"]').first();

    await expect(
      successText.or(errorToast)
    ).toBeVisible({ timeout: 60_000 });

    // Verify we got the success screen (not an error)
    await expect(successText).toBeVisible();
    await expect(page.getByText("View My Stakes")).toBeVisible();
    await expect(page.getByText("Create Another Stake")).toBeVisible();
  });

  test("should display wizard steps with correct content", async ({ page }) => {
    // Step 1 renders
    await expect(page.getByText("Choose Amount")).toBeVisible({ timeout: 15_000 });
    await expect(page.locator("#amount")).toBeVisible();
    await expect(page.getByText("Wallet Balance")).toBeVisible();
    await expect(page.getByRole("button", { name: "MAX" })).toBeVisible();

    // Fill and advance
    await page.locator("#amount").fill("1");
    await page.getByRole("button", { name: "Next" }).click();

    // Step 2 renders
    await expect(page.getByText("Choose Duration")).toBeVisible({ timeout: 10_000 });
    await expect(page.locator("#days")).toBeVisible();
    await expect(page.getByText("Duration Bonus")).toBeVisible();
    await expect(page.getByText("Size Bonus")).toBeVisible();

    // Fill and advance
    await page.locator("#days").fill("365");
    await page.getByRole("button", { name: "Next" }).click();

    // Step 3 renders
    await expect(page.getByText("Review & Confirm")).toBeVisible({ timeout: 10_000 });
    await expect(page.getByText("Early Unstake Penalty")).toBeVisible();
    await expect(page.getByText("Estimated Transaction Fee")).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Confirm & Stake" })
    ).toBeVisible();

    // Back button works
    await page.getByRole("button", { name: "Back" }).click();
    await expect(page.getByText("Choose Duration")).toBeVisible({ timeout: 5_000 });
  });
});
