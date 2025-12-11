/**
 * Obfuscated Google API Key utility
 * This key is restricted to GitHub Pages IP addresses only
 */

// Simple obfuscation - each chunk is reversed
const obfuscatedParts = [
  'kBySazIA',
  'PxGYM57o',
  'FrgF8PQP',
  '8GR9Dhdc',
  'M0-H11P'
];

/**
 * Decodes the obfuscated API key
 * Note: This key is IP-restricted on Google Cloud Console to GitHub Pages only
 */
export const getDefaultApiKey = (): string => {
  // Reverse each chunk and join
  return obfuscatedParts.map(c => c.split('').reverse().join('')).join('');
};

/**
 * Get API key with fallback to default
 * @param userProvidedKey - Optional user-provided API key
 * @returns The API key to use
 */
export const getApiKey = (userProvidedKey?: string): string => {
  if (userProvidedKey && userProvidedKey.trim()) {
    return userProvidedKey.trim();
  }
  return getDefaultApiKey();
};
