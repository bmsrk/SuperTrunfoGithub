import { describe, it, expect } from 'vitest';
import { getDefaultApiKey, getApiKey } from './config';

describe('config utils', () => {
  describe('getDefaultApiKey', () => {
    it('should return a non-empty string', () => {
      const key = getDefaultApiKey();
      expect(key).toBeTruthy();
      expect(typeof key).toBe('string');
      expect(key.length).toBeGreaterThan(0);
    });

    it('should decode base64 encoded key', () => {
      const key = getDefaultApiKey();
      // Should start with AIzaSy (typical Gemini API key format)
      expect(key).toMatch(/^AIzaSy/);
    });
  });

  describe('getApiKey', () => {
    it('should return user provided key when given', () => {
      const userKey = 'user-api-key-123';
      const result = getApiKey(userKey);
      expect(result).toBe(userKey);
    });

    it('should trim whitespace from user provided key', () => {
      const userKey = '  user-api-key-123  ';
      const result = getApiKey(userKey);
      expect(result).toBe('user-api-key-123');
    });

    it('should return default key when user key is empty', () => {
      const result = getApiKey('');
      expect(result).toBe(getDefaultApiKey());
    });

    it('should return default key when user key is whitespace only', () => {
      const result = getApiKey('   ');
      expect(result).toBe(getDefaultApiKey());
    });

    it('should return default key when user key is undefined', () => {
      const result = getApiKey(undefined);
      expect(result).toBe(getDefaultApiKey());
    });

    it('should prefer user key over default', () => {
      const userKey = 'custom-key';
      const result = getApiKey(userKey);
      expect(result).not.toBe(getDefaultApiKey());
      expect(result).toBe(userKey);
    });
  });
});
