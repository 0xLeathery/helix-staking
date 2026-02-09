import { test, expect, waitForWalletConnection, waitForTxSuccess } from "../fixtures";

test.describe("Claim Rewards Transaction", () => {
  test("should claim rewards from stake detail", async ({ page }) => {
    // Navigate to dashboard and wait for wallet
    await page.goto("/dashboard");
    await waitForWalletConnection(page);

    // Wait for stakes to load — global-setup guarantees pre-existing stakes with cranked rewards
    await expect(page.getByText("Your Stakes")).toBeVisible({
      timeout: 15_000,
    });

    // Navigate to a stake's detail page via "Claim Rewards" link
    await page.getByRole("link", { name: "Claim Rewards" }).first().click();

    // Wait for stake detail page
    await expect(page.getByText("Stake Details")).toBeVisible({
      timeout: 15_000,
    });

    // Click the Claim Rewards button — rewards guaranteed by global-setup cranking
    const claimButton = page.getByRole("button", { name: "Claim Rewards" });
    await expect(claimButton).toBeVisible();
    await expect(claimButton).toBeEnabled({ timeout: 10_000 });
    await claimButton.click();

    // On localnet, transaction confirms instantly — expect success toast
    await waitForTxSuccess(page);
  });
});
