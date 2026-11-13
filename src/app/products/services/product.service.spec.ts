import { provideHttpClient } from "@angular/common/http";
import {
  HttpTestingController,
  provideHttpClientTesting,
} from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { API } from "src/config/api.config";
import { HTTP_CACHE_TTL } from "src/app/interceptors/http-cache.context";
import { ProductService } from "./product.service";

describe("ProductService", () => {
  let service: ProductService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it("requests products with pagination and enables HTTP caching", () => {
    service.getProducts({ limit: 12, skip: 24 }).subscribe();

    const request = httpMock.expectOne((req) => req.url === API.products);

    expect(request.request.params.get("limit")).toBe("12");
    expect(request.request.params.get("skip")).toBe("24");
    expect(request.request.context.get(HTTP_CACHE_TTL)).toBeGreaterThan(0);

    request.flush({ limit: 12, skip: 24, total: 0, products: [] });
  });
});
