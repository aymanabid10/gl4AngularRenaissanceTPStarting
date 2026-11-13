import {
  HttpEvent,
  HttpHeaders,
  HttpRequest,
  HttpResponse,
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { CACHE_CONFIG } from "src/config/cache.config";
import { CachedResponse } from "./interfaces/cached-response.interface";

@Injectable({
  providedIn: "root",
})
export class HttpCacheService {
  private readonly inFlight = new Map<
    string,
    Observable<HttpEvent<unknown>>
  >();
  private readonly memory = new Map<string, string>();

  buildKey(request: HttpRequest<unknown>): string {
    const authorization = request.headers.get("Authorization") ?? "";

    return [
      request.method,
      request.urlWithParams,
      request.responseType,
      authorization,
    ].join("|");
  }

  get<T = unknown>(key: string): HttpResponse<T> | null {
    const raw = this.readItem(this.storageKey(key));
    if (!raw) {
      return null;
    }

    try {
      const entry = JSON.parse(raw) as CachedResponse;

      if (entry.expiresAt <= Date.now()) {
        this.remove(key);
        return null;
      }

      return new HttpResponse<T>({
        body: entry.body as T,
        status: entry.status,
        statusText: entry.statusText,
        headers: new HttpHeaders(entry.headers),
      });
    } catch {
      this.remove(key);
      return null;
    }
  }

  set<T>(key: string, response: HttpResponse<T>, ttlMs: number): void {
    if (response.status < 200 || response.status >= 300) {
      return;
    }

    const headers: Record<string, string[]> = {};
    for (const name of response.headers.keys()) {
      headers[name] = response.headers.getAll(name) ?? [];
    }

    const entry: CachedResponse = {
      expiresAt: Date.now() + ttlMs,
      status: response.status,
      statusText: response.statusText,
      headers,
      body: response.body,
    };

    try {
      this.writeItem(this.storageKey(key), JSON.stringify(entry));
      this.enforceMaxEntries();
    } catch {
      // A cache failure must never break the actual HTTP call.
    }
  }

  remove(key: string): void {
    this.removeItem(this.storageKey(key));
  }

  clear(): void {
    this.memory.clear();

    const storage = this.getStorage();
    if (!storage) {
      return;
    }

    try {
      const keys = Array.from(
        { length: storage.length },
        (_, index) => storage.key(index)
      );

      for (const key of keys) {
        if (key?.startsWith(CACHE_CONFIG.storageKeyPrefix)) {
          storage.removeItem(key);
        }
      }
    } catch {
      // Ignore storage access errors.
    }
  }

  getInFlight(key: string): Observable<HttpEvent<unknown>> | undefined {
    return this.inFlight.get(key);
  }

  setInFlight(key: string, request$: Observable<HttpEvent<unknown>>): void {
    this.inFlight.set(key, request$);
  }

  removeInFlight(key: string): void {
    this.inFlight.delete(key);
  }

  private storageKey(key: string): string {
    return `${CACHE_CONFIG.storageKeyPrefix}${key}`;
  }

  private getStorage(): Storage | null {
    try {
      return typeof sessionStorage === "undefined" ? null : sessionStorage;
    } catch {
      return null;
    }
  }

  private readItem(key: string): string | null {
    const storage = this.getStorage();
    if (!storage) {
      return this.memory.get(key) ?? null;
    }

    try {
      return storage.getItem(key);
    } catch {
      return this.memory.get(key) ?? null;
    }
  }

  private writeItem(key: string, value: string): void {
    const storage = this.getStorage();
    if (!storage) {
      this.memory.set(key, value);
      return;
    }

    try {
      storage.setItem(key, value);
    } catch {
      this.memory.set(key, value);
    }
  }

  private removeItem(key: string): void {
    this.memory.delete(key);

    const storage = this.getStorage();
    if (!storage) {
      return;
    }

    try {
      storage.removeItem(key);
    } catch {
      // Ignore storage access errors.
    }
  }
    /** Keeps at most CACHE_CONFIG.maxEntries entries: drops the ones expiring soonest. */
  private enforceMaxEntries(): void {
    const keys = this.cachedStorageKeys();
    const overflow = keys.length - CACHE_CONFIG.maxEntries;
    if (overflow <= 0) {
      return;
    }

    keys
      .map((key) => ({ key, expiresAt: this.readExpiresAt(key) }))
      .sort((a, b) => a.expiresAt - b.expiresAt)
      .slice(0, overflow)
      .forEach(({ key }) => this.removeItem(key));
  }

  /** All cache keys (already prefixed), from sessionStorage and the memory fallback. */
  private cachedStorageKeys(): string[] {
    const keys = new Set(this.memory.keys());
    const storage = this.getStorage();
    if (storage) {
      try {
        for (let i = 0; i < storage.length; i++) {
          const key = storage.key(i);
          if (key?.startsWith(CACHE_CONFIG.storageKeyPrefix)) {
            keys.add(key);
          }
        }
      } catch {
        // Ignore storage access errors.
      }
    }
    return [...keys];
  }

  private readExpiresAt(storageKey: string): number {
    try {
      return (JSON.parse(this.readItem(storageKey) ?? "") as CachedResponse).expiresAt;
    } catch {
      return 0; // unreadable entry: evict it first
    }
  }

}
