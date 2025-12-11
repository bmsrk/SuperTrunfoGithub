import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock environment variables if needed
if (!process.env.API_KEY) {
  process.env.API_KEY = 'test-api-key';
}
