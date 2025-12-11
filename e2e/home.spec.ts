import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test('should load the home page successfully', async ({ page }) => {
    await page.goto('/');
    
    // Check for main heading
    await expect(page.getByText('DevTrunfo')).toBeVisible();
    await expect(page.getByText('GITHUB CARD GENERATOR')).toBeVisible();
  });

  test('should display input form on load', async ({ page }) => {
    await page.goto('/');
    
    // Check for username input field
    await expect(page.getByPlaceholder('ex: torvalds')).toBeVisible();
    
    // Check for submit button
    await expect(page.getByRole('button', { name: /GENERATE CARD/i })).toBeVisible();
  });

  test('should have a mock data button', async ({ page }) => {
    await page.goto('/');
    
    // Check for mock button
    await expect(page.getByRole('button', { name: /Test with Mock Data/i })).toBeVisible();
  });

  test('should have settings button', async ({ page }) => {
    await page.goto('/');
    
    // Check for settings button
    const settingsButton = page.locator('button[title="Settings / API Keys"]');
    await expect(settingsButton).toBeVisible();
  });
});
