import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Portfolio Guy Stals test' })).toBeVisible();
});
