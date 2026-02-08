import { test, expect } from '@playwright/test';

test.describe('Swap Page', () => {
  test('should display swap page and load jupiter', async ({ page }) => {
    await page.goto('/dashboard/swap');
    
    await expect(page.locator('h1')).toContainText('Swap');
    
    // Check if Jupiter terminal container exists
    const jupiterTerminal = page.locator('#jupiter-terminal');
    await expect(jupiterTerminal).toBeVisible();
    
    // The script should be injected
    const script = page.locator('script[src*="terminal.jup.ag"]');
    await expect(script).toBeAttached();
  });

  test('sidebar navigation to swap works', async ({ page }) => {
    await page.goto('/dashboard');
    const swapLink = page.getByRole('link', { name: 'Swap' });
    await expect(swapLink).toBeVisible();
    await swapLink.click();
    await expect(page).toHaveURL(/\/dashboard\/swap/);
  });
});
