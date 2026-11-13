import { Product } from "./product.dto";
import { ProductSettings } from "./product-settings.dto";

export interface ProductApiResponse extends ProductSettings {
  products: Product[];
  total: number;
}
