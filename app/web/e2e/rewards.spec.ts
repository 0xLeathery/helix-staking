import { test, expect } from '@playwright/test';

test.describe('Rewards Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard/rewards');
  });

  test('should display rewards page heading', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Rewards');
  });

  test('should display rewards overview', async ({ page }) => {
    await expect(page.getByText('Rewards Overview')).toBeVisible({ timeout: 15_000 });
    await expect(page.getByText('Total Pending Rewards:')).toBeVisible();
    await expect(page.getByText('Total BPD Bonus Pending:')).toBeVisible();
  });

  test('should show HELIX values in rewards', async ({ page }) => {
    // Wait for data to load
    await expect(page.getByText('Rewards Overview')).toBeVisible({ timeout: 15_000 });

    // Values should contain HELIX denomination
    const helixValues = page.locator('text=/HELIX/');
    await expect(helixValues.first()).toBeVisible({ timeout: 15_000 });
  });
});
