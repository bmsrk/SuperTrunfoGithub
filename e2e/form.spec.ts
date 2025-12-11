import { test, expect } from '@playwright/test';

test.describe('Form Validation', () => {
  test('should disable submit button when username is empty', async ({ page }) => {
    await page.goto('/');
    
    const submitButton = page.getByRole('button', { name: /GENERATE CARD/i });
    
    // Button should be disabled initially
    await expect(submitButton).toBeDisabled();
  });

  test('should enable submit button when username is entered', async ({ page }) => {
    await page.goto('/');
    
    const usernameInput = page.getByPlaceholder('ex: torvalds');
    const submitButton = page.getByRole('button', { name: /GENERATE CARD/i });
    
    // Enter username
    await usernameInput.fill('testuser');
    
    // Button should be enabled
    await expect(submitButton).toBeEnabled();
  });

  test('should show/hide settings when settings button is clicked', async ({ page }) => {
    await page.goto('/');
    
    const settingsButton = page.locator('button[title="Settings / API Keys"]');
    
    // Click settings button to show
    await settingsButton.click();
    
    // Settings should be visible
    await expect(page.getByText('GITHUB TOKEN (OPTIONAL)')).toBeVisible();
    await expect(page.getByText('GEMINI API KEY (OPTIONAL)')).toBeVisible();
    
    // Verify input fields are accessible
    const githubTokenInput = page.getByPlaceholder('ghp_...');
    await expect(githubTokenInput).toBeVisible();
  });

  test('should accept input in username field', async ({ page }) => {
    await page.goto('/');
    
    const usernameInput = page.getByPlaceholder('ex: torvalds');
    
    await usernameInput.fill('octocat');
    
    await expect(usernameInput).toHaveValue('octocat');
  });

  test('should accept input in API key fields', async ({ page }) => {
    await page.goto('/');
    
    // Open settings
    const settingsButton = page.locator('button[title="Settings / API Keys"]');
    await settingsButton.click();
    
    // Fill GitHub token
    const githubTokenInput = page.getByPlaceholder('ghp_...');
    await githubTokenInput.fill('test_token_123');
    await expect(githubTokenInput).toHaveValue('test_token_123');
    
    // Fill Gemini API key
    const geminiKeyInput = page.getByPlaceholder('AIzaSy...');
    await geminiKeyInput.fill('test_api_key_456');
    await expect(geminiKeyInput).toHaveValue('test_api_key_456');
  });
});
