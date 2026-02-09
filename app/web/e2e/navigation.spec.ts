import { test, expect } from '@playwright/test';

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'New Stake', href: '/dashboard/stake' },
  { label: 'Rewards', href: '/dashboard/rewards' },
  { label: 'Free Claim', href: '/dashboard/claim' },
  { label: 'Analytics', href: '/dashboard/analytics' },
  { label: 'Swap', href: '/dashboard/swap' },
  { label: 'Leaderboard', href: '/dashboard/leaderboard' },
  { label: 'Whale Tracker', href: '/dashboard/whale-tracker' },
];

test.describe('Sidebar Navigation', () => {
  test('should display all navigation links in sidebar', async ({ page }) => {
    await page.goto('/dashboard');

    const sidebar = page.getByLabel('Main navigation');
    await expect(sidebar).toBeVisible();

    for (const item of NAV_ITEMS) {
      await expect(sidebar.getByRole('link', { name: item.label })).toBeVisible();
    }
  });

  for (const item of NAV_ITEMS) {
    test(`should navigate to ${item.label}`, async ({ page }) => {
      await page.goto('/dashboard');

      // Scope to sidebar to avoid duplicate links in main content
      const sidebar = page.getByLabel('Main navigation');
      const link = sidebar.getByRole('link', { name: item.label });
      await expect(link).toBeVisible();
      await link.click();

      await expect(page).toHaveURL(new RegExp(item.href.replace(/\//g, '\\/')));
    });
  }
});
