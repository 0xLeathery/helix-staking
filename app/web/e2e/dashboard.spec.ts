import { test, expect } from '@playwright/test';

test.describe('Dashboard Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard');
  });

  test('should display page title', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Your Dashboard');
  });

  test('should display protocol stats with values', async ({ page }) => {
    // These load from GlobalState (no wallet needed)
    // Use .first() for labels that appear in both ProtocolStats and PortfolioSummary
    await expect(page.getByText('Total Staked')).toBeVisible({ timeout: 15_000 });
    await expect(page.getByText('Total T-Shares').first()).toBeVisible();
    await expect(page.getByText('T-Share Price')).toBeVisible();
    await expect(page.getByText('Current Day')).toBeVisible();

    // Stats should show numeric values once loaded (not just skeleton placeholders)
    // Each stat card renders a <p> with text-lg font-semibold when loaded
    const statValues = page.locator('p.text-lg.font-semibold');
    await expect(statValues.first()).toBeVisible({ timeout: 15_000 });
  });

  test('should display portfolio section', async ({ page }) => {
    // Without a connected wallet, portfolio shows the no-stakes CTA
    // or the portfolio summary card - either way, dashboard content loads
    const portfolioOrCta = page.locator('#main-content');
    await expect(portfolioOrCta).toBeVisible();

    // Should have either "Portfolio Summary" or "No active stakes" message
    const hasPortfolio = await page.getByText('Portfolio Summary').isVisible().catch(() => false);
    const hasNoStakes = await page.getByText('No active stakes').isVisible().catch(() => false);
    expect(hasPortfolio || hasNoStakes).toBeTruthy();
  });

  test('should display stakes section', async ({ page }) => {
    // Stakes section always renders with heading
    await expect(page.getByText('Your Stakes')).toBeVisible({ timeout: 15_000 });
  });

  test('should show sidebar navigation', async ({ page }) => {
    const sidebar = page.getByLabel('Main navigation');
    await expect(sidebar).toBeVisible();

    // Verify key nav items in sidebar
    await expect(sidebar.getByRole('link', { name: 'Dashboard' })).toBeVisible();
    await expect(sidebar.getByRole('link', { name: 'Rewards' })).toBeVisible();
    await expect(sidebar.getByRole('link', { name: 'Analytics' })).toBeVisible();
  });
});

test.describe('Stake Detail Page', () => {
  test('should show not-found for invalid stake ID', async ({ page }) => {
    // Navigate to a non-existent stake address
    await page.goto('/dashboard/stakes/11111111111111111111111111111111');

    // Should show the not-found state
    await expect(page.getByText('Stake Not Found')).toBeVisible({ timeout: 15_000 });
    await expect(page.getByRole('link', { name: 'Back to Dashboard' })).toBeVisible();
  });

  test('should show back to dashboard link', async ({ page }) => {
    await page.goto('/dashboard/stakes/11111111111111111111111111111111');

    // Wait for loading to finish and page to render
    await expect(page.getByRole('link', { name: 'Back to Dashboard' })).toBeVisible({ timeout: 15_000 });
  });
});
