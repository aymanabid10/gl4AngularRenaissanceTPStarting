export interface CachedResponse {
  expiresAt: number;
  status: number;
  statusText: string;
  headers: Record<string, string[]>;
  body: unknown;
}
