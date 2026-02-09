import { test as base, expect } from "@playwright/test";

/**
 * Custom Playwright fixtures for transaction tests.
 * Sets up localStorage so the wallet-adapter auto-connects the TestWalletAdapter.
 */
export const test = base.extend<{ walletPage: typeof base }>({
  page: async ({ page }, use) => {
    // Inject localStorage wallet selection before React hydration.
    // The wallet-adapter reads 'walletName' from localStorage for autoConnect.
    await page.addInitScript(() => {
      localStorage.setItem("walletName", '"Test Wallet"');
    });
    await use(page);
  },
});

export { expect };

/** Wait for the wallet to connect by checking for a truncated address in the sidebar. */
export async function waitForWalletConnection(
  page: import("@playwright/test").Page,
  { timeout = 30_000 } = {}
) {
  // The sidebar shows a truncated pubkey (e.g. "HKsW...xiCe") in a span with font-mono
  await expect(
    page
      .getByLabel("Main navigation")
      .locator("span.font-mono")
  ).toBeVisible({ timeout });
}

/** Wait for a transaction success toast notification. */
export async function waitForTxSuccess(
  page: import("@playwright/test").Page,
  { timeout = 60_000 } = {}
) {
  // Sonner toast shows success messages - look for common success patterns
  await expect(
    page.locator('[data-sonner-toast][data-type="success"]').first()
  ).toBeVisible({ timeout });
}

/** Wait for any toast notification (success or error). */
export async function waitForToast(
  page: import("@playwright/test").Page,
  { timeout = 60_000 } = {}
) {
  await expect(
    page.locator("[data-sonner-toast]").first()
  ).toBeVisible({ timeout });
}
