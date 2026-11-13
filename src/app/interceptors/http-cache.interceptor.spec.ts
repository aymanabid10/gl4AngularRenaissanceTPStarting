import {
  HttpClient,
  HttpRequest,
  provideHttpClient,
  withInterceptors,
} from "@angular/common/http";
import {
  HttpTestingController,
  provideHttpClientTesting,
} from "@angular/common/http/testing";
import { TestBed, fakeAsync, tick } from "@angular/core/testing";
import { CACHE_CONFIG } from "src/config/cache.config";
import { HttpCacheService } from "../services/http-cache.service";
import { withHttpCache } from "./http-cache.context";
import { httpCacheInterceptor } from "./http-cache.interceptor";

describe("httpCacheInterceptor", () => {
  const url = "https://api.test/products?limit=12&skip=0";

  let http: HttpClient;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    sessionStorage.clear();

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([httpCacheInterceptor])),
        provideHttpClientTesting(),
      ],
    });

    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    sessionStorage.clear();
  });

  it("does not cache requests that are not opted in", () => {
    http.get(url).subscribe();
    httpMock.expectOne(url).flush({ ok: true });

    http.get(url).subscribe();
    httpMock.expectOne(url).flush({ ok: true });
  });

  it("caches an opted-in GET response within the TTL", () => {
    http.get(url, { context: withHttpCache() }).subscribe();
    httpMock.expectOne(url).flush({ ok: true });

    let cachedBody: unknown;
    http
      .get(url, { context: withHttpCache() })
      .subscribe((body) => (cachedBody = body));

    httpMock.expectNone(url);
    expect(cachedBody).toEqual({ ok: true });
  });

  it("keeps different query parameters in separate cache entries", () => {
    const secondUrl = "https://api.test/products?limit=12&skip=12";

    http.get(url, { context: withHttpCache() }).subscribe();
    httpMock.expectOne(url).flush({ page: 1 });

    http.get(secondUrl, { context: withHttpCache() }).subscribe();
    httpMock.expectOne(secondUrl).flush({ page: 2 });

    http.get(url, { context: withHttpCache() }).subscribe();
    http.get(secondUrl, { context: withHttpCache() }).subscribe();

    httpMock.expectNone((request) =>
      request.url.startsWith("https://api.test/products")
    );
  });

  it("re-fetches once the TTL has expired", fakeAsync(() => {
    http.get(url, { context: withHttpCache() }).subscribe();
    httpMock.expectOne(url).flush({ ok: true });

    tick(CACHE_CONFIG.ttlMs + 1);

    http.get(url, { context: withHttpCache() }).subscribe();
    httpMock.expectOne(url).flush({ ok: true });
  }));

  it("shares one network call between concurrent identical requests", () => {
    const received: unknown[] = [];

    http
      .get(url, { context: withHttpCache() })
      .subscribe((body) => received.push(body));
    http
      .get(url, { context: withHttpCache() })
      .subscribe((body) => received.push(body));

    httpMock.expectOne(url).flush({ ok: true });

    expect(received).toEqual([{ ok: true }, { ok: true }]);
  });

  it("never caches non-GET requests", () => {
    http.post(url, { name: "test" }, { context: withHttpCache() }).subscribe();
    httpMock.expectOne(url).flush({ ok: true });

    http.post(url, { name: "test" }, { context: withHttpCache() }).subscribe();
    httpMock.expectOne(url).flush({ ok: true });
  });

  it("persists entries across service instances to survive a page reload", () => {
    http.get(url, { context: withHttpCache() }).subscribe();
    httpMock.expectOne(url).flush({ ok: true });

    const freshCache = new HttpCacheService();
    const key = freshCache.buildKey(new HttpRequest("GET", url));

    expect(freshCache.get(key)?.body).toEqual({ ok: true });
  });
});
