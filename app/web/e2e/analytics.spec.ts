import { test, expect } from '@playwright/test';

test.describe('Analytics Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Need to mock wallet connection or bypass it for UAT if possible.
    // Since our layout gates by wallet, we might need a mock wallet state.
    // For now, we assume the user is "connected" or we test the title.
    await page.goto('/dashboard/analytics');
  });

  test('should display analytics page title', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Protocol Analytics');
  });

  test('should show protocol stats cards', async ({ page }) => {
    await expect(page.getByText('Total Stakes')).toBeVisible();
    await expect(page.getByText('Current Day')).toBeVisible();
    await expect(page.getByText('Share Rate')).toBeVisible();
  });

  test('should render charts', async ({ page }) => {
    // Wait for components to mount
    await expect(page.locator('body')).toContainText('T-Share Price History');
    await expect(page.locator('body')).toContainText('Stake Duration Distribution');
    await expect(page.locator('body')).toContainText('Supply Breakdown');
  });

  test('sidebar navigation works', async ({ page }) => {
    await page.goto('/dashboard');
    const analyticsLink = page.getByRole('link', { name: 'Analytics' });
    await expect(analyticsLink).toBeVisible();
    await analyticsLink.click();
    await expect(page).toHaveURL(/\/dashboard\/analytics/);
  });
});
