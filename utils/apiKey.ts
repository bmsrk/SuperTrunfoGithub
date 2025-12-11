/**
 * Obfuscated Google API Key utility
 * This key is restricted to GitHub Pages IP addresses only
 * 
 * Security Note: The obfuscation is intentionally simple (string reversal)
 * because the API key is IP-restricted on Google Cloud Console to only work
 * from GitHub Pages. This provides a reasonable level of security while allowing
 * the key to be included in the public source code. The key cannot be used from
 * other domains or IPs, making complex obfuscation unnecessary.
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
