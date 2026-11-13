import { provideHttpClient } from "@angular/common/http";
import {
  HttpTestingController,
  provideHttpClientTesting,
} from "@angular/common/http/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { API } from "src/config/api.config";
import { ProductApiResponse } from "./dto/product-api-response.dto";
import { Product } from "./dto/product.dto";
import { ProductsComponent } from "./products.component";
import { ProductsViewModel } from "./dto/products-state.dto";

describe("ProductsComponent", () => {
  let component: ProductsComponent;
  let fixture: ComponentFixture<ProductsComponent>;
  let httpMock: HttpTestingController;

  const buildProducts = (skip: number, count: number): Product[] =>
    Array.from({ length: count }, (_, index) => {
      const id = skip + index + 1;
      return {
        id,
        title: `Product ${id}`,
        description: "",
        price: id,
        discountPercentage: 0,
        rating: 0,
        stock: 0,
        brand: "",
        category: "",
        thumbnail: "",
        images: [],
      };
    });

  const buildResponse = (
    skip: number,
    count: number,
    total: number
  ): ProductApiResponse => ({
    limit: 12,
    skip,
    total,
    products: buildProducts(skip, count),
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductsComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductsComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("loads the first 12 products on subscription", () => {
    let vm: ProductsViewModel | undefined;
    component.vm$.subscribe((value) => (vm = value));

    const request = httpMock.expectOne(
      (req) => req.url === API.products && req.params.get("skip") === "0"
    );
    expect(request.request.params.get("limit")).toBe("12");

    request.flush(buildResponse(0, 12, 194));

    expect(vm?.products.length).toBe(12);
    expect(vm?.total).toBe(194);
    expect(vm?.hasMore).toBeTrue();
  });

  it("appends the next page and stops calling the API once everything is loaded", () => {
    let vm: ProductsViewModel | undefined;
    component.vm$.subscribe((value) => (vm = value));

    httpMock
      .expectOne((req) => req.url === API.products && req.params.get("skip") === "0")
      .flush(buildResponse(0, 12, 24));

    component.loadMore();

    httpMock
      .expectOne((req) => req.url === API.products && req.params.get("skip") === "12")
      .flush(buildResponse(12, 12, 24));

    expect(vm?.products.length).toBe(24);
    expect(vm?.hasMore).toBeFalse();

    component.loadMore();

    httpMock.expectNone((req) => req.url === API.products);
  });
});
