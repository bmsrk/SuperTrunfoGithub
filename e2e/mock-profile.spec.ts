import { test, expect } from '@playwright/test';

test.describe('Mock Profile Generation', () => {
  test('should generate card with mock data', async ({ page }) => {
    await page.goto('/');
    
    // Click mock button
    const mockButton = page.getByRole('button', { name: /Test with Mock Data/i });
    await mockButton.click();
    
    // Wait for card to appear
    await page.waitForTimeout(500);
    
    // Check that input form is hidden
    await expect(page.getByPlaceholder('ex: torvalds')).not.toBeVisible();
    
    // Check for card elements
    await expect(page.getByText('mock-dev')).toBeVisible();
    await expect(page.getByText('Testor the Great')).toBeVisible();
    
    // Check for download button
    await expect(page.getByRole('button', { name: /Download Card/i })).toBeVisible();
    
    // Check for create new button
    await expect(page.getByRole('button', { name: /Create New/i })).toBeVisible();
  });

  test('should show card stats with mock data', async ({ page }) => {
    await page.goto('/');
    
    // Click mock button
    const mockButton = page.getByRole('button', { name: /Test with Mock Data/i });
    await mockButton.click();
    
    // Wait for card to appear
    await page.waitForTimeout(500);
    
    // Check for stats (mock profile has specific values)
    await expect(page.getByText('1337')).toBeVisible(); // repos
    await expect(page.getByText('9001')).toBeVisible(); // stars
    await expect(page.getByText('420')).toBeVisible();   // followers
  });

  test('should reset to form when "Create New" is clicked', async ({ page }) => {
    await page.goto('/');
    
    // Generate mock card
    const mockButton = page.getByRole('button', { name: /Test with Mock Data/i });
    await mockButton.click();
    
    // Wait for card
    await page.waitForTimeout(500);
    
    // Click "Create New"
    const createNewButton = page.getByRole('button', { name: /Create New/i });
    await createNewButton.click();
    
    // Form should be visible again
    await expect(page.getByPlaceholder('ex: torvalds')).toBeVisible();
    await expect(page.getByRole('button', { name: /GENERATE CARD/i })).toBeVisible();
  });

  test('should have card ID in mock profile', async ({ page }) => {
    await page.goto('/');
    
    // Click mock button
    const mockButton = page.getByRole('button', { name: /Test with Mock Data/i });
    await mockButton.click();
    
    // Wait for card to appear
    await page.waitForTimeout(500);
    
    // Check for card ID
    await expect(page.getByText('DEV-00')).toBeVisible();
  });

  test('should display archetype in mock profile', async ({ page }) => {
    await page.goto('/');
    
    // Click mock button
    const mockButton = page.getByRole('button', { name: /Test with Mock Data/i });
    await mockButton.click();
    
    // Wait for card to appear
    await page.waitForTimeout(500);
    
    // Check for archetype
    await expect(page.getByText('System Architect')).toBeVisible();
  });

  test('should have download button enabled for mock card', async ({ page }) => {
    await page.goto('/');
    
    // Generate mock card
    const mockButton = page.getByRole('button', { name: /Test with Mock Data/i });
    await mockButton.click();
    
    // Wait for card
    await page.waitForTimeout(500);
    
    // Download button should be enabled
    const downloadButton = page.getByRole('button', { name: /Download Card/i });
    await expect(downloadButton).toBeEnabled();
  });
});
