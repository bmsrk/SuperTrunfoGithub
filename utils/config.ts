// Application configuration utilities
const k = 'QUl6YVN5QmtvNzVNWUd4UFBRUDhGZ3JGY2RoRDlSRzhQMTFILTBN';

const d = (s: string): string => {
  try {
    return atob(s);
  } catch {
    return '';
  }
};

export const getDefaultApiKey = (): string => d(k);

export const getApiKey = (userProvidedKey?: string): string => {
  if (userProvidedKey && userProvidedKey.trim()) {
    return userProvidedKey.trim();
  }
  return getDefaultApiKey();
};
