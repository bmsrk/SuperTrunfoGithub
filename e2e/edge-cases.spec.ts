import { test, expect } from '@playwright/test';

test.describe('Edge Cases and Error Handling', () => {
  test('should handle very long usernames gracefully', async ({ page }) => {
    await page.goto('/');
    
    const usernameInput = page.getByPlaceholder('ex: torvalds');
    const veryLongUsername = 'a'.repeat(100);
    
    await usernameInput.fill(veryLongUsername);
    
    // Form should still accept it
    await expect(usernameInput).toHaveValue(veryLongUsername);
  });

  test('should handle special characters in GitHub token input', async ({ page }) => {
    await page.goto('/');
    
    // Open settings
    const settingsButton = page.locator('button[title="Settings / API Keys"]');
    await settingsButton.click();
    
    // Try special characters in GitHub token
    const githubTokenInput = page.getByPlaceholder('ghp_...');
    await githubTokenInput.fill('ghp_test-token-with-special-chars');
    
    await expect(githubTokenInput).toHaveValue('ghp_test-token-with-special-chars');
  });

  test('should persist after settings panel toggle', async ({ page }) => {
    await page.goto('/');
    
    const usernameInput = page.getByPlaceholder('ex: torvalds');
    await usernameInput.fill('testuser');
    
    // Open and close settings
    const settingsButton = page.locator('button[title="Settings / API Keys"]');
    await settingsButton.click();
    await settingsButton.click();
    
    // Username should still be there
    await expect(usernameInput).toHaveValue('testuser');
  });

  test('should show form after mock card is created and reset', async ({ page }) => {
    await page.goto('/');
    
    // Generate mock card
    const mockButton = page.getByRole('button', { name: /Test with Mock Data/i });
    await mockButton.click();
    
    // Wait for card
    await page.waitForTimeout(500);
    
    // Click "Create New"
    const createNewButton = page.getByRole('button', { name: /Create New/i });
    await createNewButton.click();
    
    // Should be back to initial state
    await expect(page.getByPlaceholder('ex: torvalds')).toBeVisible();
    await expect(mockButton).toBeVisible();
  });

  test('should display all required card elements in mock profile', async ({ page }) => {
    await page.goto('/');
    
    const mockButton = page.getByRole('button', { name: /Test with Mock Data/i });
    await mockButton.click();
    
    await page.waitForTimeout(500);
    
    // Check for all major card elements
    await expect(page.getByText('mock-dev')).toBeVisible();
    await expect(page.getByText('Testor the Great')).toBeVisible();
    await expect(page.getByText('System Architect')).toBeVisible();
    
    // Check stats labels (checking first occurrence is enough)
    await expect(page.getByText('Repositórios').first()).toBeVisible();
    await expect(page.getByText('Estrelas').first()).toBeVisible();
    await expect(page.getByText('Seguidores').first()).toBeVisible();
    await expect(page.getByText('Commits', { exact: true }).first()).toBeVisible();
    
    // Check special ability
    await expect(page.getByText('Hotfix Instantâneo')).toBeVisible();
  });

  test('should have proper button states', async ({ page }) => {
    await page.goto('/');
    
    // Initial state - submit disabled, mock enabled
    const submitButton = page.getByRole('button', { name: /GENERATE CARD/i });
    const mockButton = page.getByRole('button', { name: /Test with Mock Data/i });
    
    await expect(submitButton).toBeDisabled();
    await expect(mockButton).toBeEnabled();
    
    // After typing - submit enabled
    const usernameInput = page.getByPlaceholder('ex: torvalds');
    await usernameInput.fill('user');
    
    await expect(submitButton).toBeEnabled();
  });

  test('should clear input when form is reset', async ({ page }) => {
    await page.goto('/');
    
    const usernameInput = page.getByPlaceholder('ex: torvalds');
    await usernameInput.fill('testuser');
    
    await expect(usernameInput).toHaveValue('testuser');
    
    // Generate mock card to hide form
    const mockButton = page.getByRole('button', { name: /Test with Mock Data/i });
    await mockButton.click();
    
    await page.waitForTimeout(500);
    
    // Reset
    const createNewButton = page.getByRole('button', { name: /Create New/i });
    await createNewButton.click();
    
    // Input should be clear
    await expect(usernameInput).toHaveValue('');
  });

  test('should have settings panel with GitHub token field', async ({ page }) => {
    await page.goto('/');
    
    const settingsButton = page.locator('button[title="Settings / API Keys"]');
    await settingsButton.click();
    
    // Check GitHub token field exists
    const githubTokenInput = page.getByPlaceholder('ghp_...');
    
    await expect(githubTokenInput).toBeVisible();
    
    // Check label
    await expect(page.getByText('GITHUB TOKEN (OPTIONAL)')).toBeVisible();
  });

  test('should maintain button visibility in card view', async ({ page }) => {
    await page.goto('/');
    
    // Generate mock card
    const mockButton = page.getByRole('button', { name: /Test with Mock Data/i });
    await mockButton.click();
    
    await page.waitForTimeout(500);
    
    // Both buttons should be visible
    const downloadButton = page.getByRole('button', { name: /Download Card/i });
    const createNewButton = page.getByRole('button', { name: /Create New/i });
    
    await expect(downloadButton).toBeVisible();
    await expect(createNewButton).toBeVisible();
    await expect(downloadButton).toBeEnabled();
    await expect(createNewButton).toBeEnabled();
  });

  test('should show footer credits', async ({ page }) => {
    await page.goto('/');
    
    // Check for footer before card generation
    await expect(page.getByText(/@enrichthesoil/i)).toBeVisible();
  });
});
