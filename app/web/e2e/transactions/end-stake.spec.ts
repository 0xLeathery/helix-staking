import { test, expect, waitForWalletConnection } from "../fixtures";

test.describe.serial("End Stake Transaction", () => {
  test("should end a stake via the unstake dialog", async ({ page }) => {
    // Navigate to dashboard and wait for wallet + data
    await page.goto("/dashboard");
    await waitForWalletConnection(page);

    // Wait for stakes to load — global-setup guarantees pre-existing stakes
    await expect(page.getByText("Your Stakes")).toBeVisible({
      timeout: 15_000,
    });

    // Click "End Stake" link to go to stake detail page
    await page.getByRole("link", { name: "End Stake" }).first().click();

    // Wait for stake detail page to load
    await expect(page.getByText("Stake Details")).toBeVisible({
      timeout: 15_000,
    });
    await expect(page.getByText("Stake Information")).toBeVisible();

    // Click the End Stake / Early Unstake button
    // The button text varies: "Early Unstake", "End Stake", or "Late Unstake"
    const unstakeButton = page
      .getByRole("button")
      .filter({ hasText: /Early Unstake|End Stake|Late Unstake/ })
      .first();
    await expect(unstakeButton).toBeVisible();
    await unstakeButton.click();

    // Unstake confirmation dialog should appear
    await expect(page.getByText("Confirm End Stake")).toBeVisible({
      timeout: 10_000,
    });

    // Check the mandatory confirmation checkbox
    await page.locator("#confirm-unstake").click();

    // Click the dialog's "End Stake" button
    const dialogEndButton = page
      .locator('[role="dialog"]')
      .getByRole("button", { name: "End Stake" });
    await dialogEndButton.click();

    // On localnet, transaction confirms instantly — should navigate to dashboard
    await expect(page).toHaveURL(/\/dashboard$/, { timeout: 60_000 });
  });
});
