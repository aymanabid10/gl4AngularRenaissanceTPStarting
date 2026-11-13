import { ChangeDetectionStrategy, Component } from "@angular/core";

import {
  Observable,
  Subject,
  catchError,
  exhaustMap,
  map,
  of,
  scan,
  shareReplay,
  startWith,
} from "rxjs";

import { ProductApiResponse } from "./dto/product-api-response.dto";
import {
  ProductLoadEvent,
  ProductsViewModel,
} from "./dto/products-state.dto";
import { ProductService } from "./services/product.service";

@Component({
  selector: "app-products",
  templateUrl: "./products.component.html",
  styleUrls: ["./products.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class ProductsComponent {
  private readonly pageSize = 12;

  private readonly loadMore$ = new Subject<void>();

  private readonly initialState: ProductsViewModel = {
    products: [],
    total: 0,
    loading: false,
    error: false,
    hasMore: true,
  };

  readonly vm$: Observable<ProductsViewModel> = this.loadMore$.pipe(
    // Trigger the first request automatically
    startWith(undefined),

    // Calculate pagination offset
    scan((skip) => skip + this.pageSize, -this.pageSize),

    // Ignore additional clicks while a request is running
    exhaustMap((skip) =>
      this.productService
        .getProducts({
          limit: this.pageSize,
          skip,
        })
        .pipe(
          // Convert API response into a success event
          map(
            (response: ProductApiResponse): ProductLoadEvent => ({
              type: "success",
              response,
            })
          ),

          // Handle HTTP errors without terminating the stream
          catchError((error): Observable<ProductLoadEvent> => {
            console.error("Error loading products:", error);

            return of({ type: "error", response: null });
          }),

          // Emit loading state before processing the response
          startWith({ type: "loading" as const, response: null })
        )
    ),

    // Maintain the complete component state
    scan(
      (state: ProductsViewModel, event: ProductLoadEvent): ProductsViewModel => {
        if (event.type === "loading") {
          return {
            ...state,
            loading: true,
            error: false,
          };
        }

        if (event.type === "error") {
          return {
            ...state,
            loading: false,
            error: true,
          };
        }

        const products = [...state.products, ...event.response.products];

        return {
          products,
          total: event.response.total,
          loading: false,
          error: false,
          hasMore:
            products.length < event.response.total &&
            event.response.products.length > 0,
        };
      },
      this.initialState
    ),

    // Share the latest state between subscribers
    shareReplay({
      bufferSize: 1,
      refCount: true,
    })
  );

  constructor(private readonly productService: ProductService) {}

  loadMore(): void {
    this.loadMore$.next();
  }
}