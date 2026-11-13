import { Product } from "./product.dto";
import { ProductApiResponse } from "./product-api-response.dto";

export interface ProductsViewModel {
  products: Product[];
  total: number;
  loading: boolean;
  error: boolean;
  hasMore: boolean;
}

export type ProductLoadEvent =
  | { type: "loading"; response: null }
  | { type: "error"; response: null }
  | { type: "success"; response: ProductApiResponse };
