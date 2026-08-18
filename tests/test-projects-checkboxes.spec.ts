import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://guystals.github.io/Portfolio/');
  await page.getByRole('link', { name: 'Projects', exact: true }).click();
  await page.getByRole('button', { name: 'Desktop' }).click();
  await page.getByRole('button', { name: 'Integration' }).click();
  await page.getByRole('button', { name: 'Web' }).click();
});