export const CACHE_CONFIG = {
  maxEntries: 50,
  ttlMs: 1 * 60 * 1000, // 1 minute cache duration
  storageKeyPrefix: "http-cache:", // Prefix for keys in localStorage to avoid collisions with other data
};
