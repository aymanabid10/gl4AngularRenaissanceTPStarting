import {
  HttpInterceptorFn,
  HttpResponse,
} from "@angular/common/http";
import { inject } from "@angular/core";
import { finalize, of, shareReplay, tap } from "rxjs";
import { HttpCacheService } from "../services/http-cache.service";
import { HTTP_CACHE_TTL } from "./http-cache.context";

export const httpCacheInterceptor: HttpInterceptorFn = (request, next) => {
  const cache = inject(HttpCacheService);
  const ttlMs = request.context.get(HTTP_CACHE_TTL);
  const cacheControl = request.headers.get("Cache-Control")?.toLowerCase() ?? "";

  const isCacheable =
    ttlMs > 0 &&
    request.method === "GET" &&
    request.body == null &&
    (request.responseType === "json" || request.responseType === "text") &&
    !cacheControl.includes("no-store") &&
    !cacheControl.includes("no-cache");
  if (!isCacheable) {
    return next(request);
  }

  const key = cache.buildKey(request);

  const cached = cache.get(key);
  if (cached) {
    return of(cached);
  }
  const pending = cache.getInFlight(key);
  if (pending) {
    return pending;
  }

  const network$ = next(request).pipe(
    tap((event) => {
      if (event instanceof HttpResponse) {
        cache.set(key, event, ttlMs);
      }
    }),
    finalize(() => cache.removeInFlight(key)),
    shareReplay({ bufferSize: 1, refCount: false })
  );

  cache.setInFlight(key, network$);

  return network$;
};
