import { test, expect } from '@playwright/test';

test.describe('API Key Optional Functionality', () => {
  test('should generate card with mock data without API key', async ({ page }) => {
    await page.goto('/');
    
    // Click mock button without providing any API keys
    const mockButton = page.getByRole('button', { name: /Test with Mock Data/i });
    await mockButton.click();
    
    // Wait for card to appear
    await page.waitForTimeout(2000);
    
    // Check that card is displayed
    await expect(page.getByText('mock-dev')).toBeVisible();
    await expect(page.getByText('Testor the Great')).toBeVisible();
    
    // Check for stats
    await expect(page.getByText('1337')).toBeVisible();
    await expect(page.getByText('9001')).toBeVisible();
    
    // Verify Download and Create New buttons are present
    await expect(page.getByRole('button', { name: /Download Card/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Create New/i })).toBeVisible();
  });

  test('should show API key fields in settings', async ({ page }) => {
    await page.goto('/');
    
    // Click settings button to show API key fields
    const settingsButton = page.locator('button[title="Settings / API Keys"]');
    await settingsButton.click();
    
    // Verify both API key fields are visible
    await expect(page.getByText('GITHUB TOKEN (OPTIONAL)')).toBeVisible();
    await expect(page.getByText('GEMINI API KEY (OPTIONAL)')).toBeVisible();
    
    // Verify the fields have placeholders
    await expect(page.getByPlaceholder('ghp_...')).toBeVisible();
    await expect(page.getByPlaceholder('AIzaSy...')).toBeVisible();
  });

  test('should mark API keys as optional in UI', async ({ page }) => {
    await page.goto('/');
    
    // Open settings
    const settingsButton = page.locator('button[title="Settings / API Keys"]');
    await settingsButton.click();
    
    // Check that "OPTIONAL" text is displayed
    const optionalLabels = page.getByText('(OPTIONAL)');
    await expect(optionalLabels.first()).toBeVisible();
  });
});
