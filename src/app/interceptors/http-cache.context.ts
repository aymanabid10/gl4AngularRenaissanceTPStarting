import { HttpContext, HttpContextToken } from "@angular/common/http";
import { CACHE_CONFIG } from "src/config/cache.config";

export const HTTP_CACHE_TTL = new HttpContextToken<number>(() => 0);

export function withHttpCache(ttlMs = CACHE_CONFIG.ttlMs): HttpContext {
  return new HttpContext().set(HTTP_CACHE_TTL, ttlMs);
}
