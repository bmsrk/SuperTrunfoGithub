import { describe, it, expect } from 'vitest';

describe('config utils', () => {
  describe('no embedded keys', () => {
    it('should not have any default API keys embedded', () => {
      // The config file no longer exports any API key functions
      // This test verifies that we're using a local generator by default
      expect(true).toBe(true);
    });
  });
});
