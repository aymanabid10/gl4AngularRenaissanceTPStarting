import {
  ChangeDetectionStrategy,
  Component,
  linkedSignal,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PRODUCTS, ProductCategory } from './product.data';

interface filters {
  search: string;
  category: string;
}

@Component({
  selector: 'app-products-filter',
  imports: [FormsModule],
  standalone: true,
  templateUrl: './products-filter.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './products-filter.component.css',
})
export class ProductsFilterComponent {
  readonly allProducts = PRODUCTS;
  protected categories = [...new Set(PRODUCTS.map((p) => p.category))];

  search = signal<string>('');
  category = signal<string>('');

  products = linkedSignal<filters, ProductCategory[]>({
    source: () => ({ search: this.search(), category: this.category() }),
    computation: (filt) => this.filterProducts(filt.search, filt.category),
  });

  protected reset() {
    this.search.set('');
    this.category.set('');
  }

  private filterProducts(search: string, category: string): ProductCategory[] {
    const s = search.trim().toLowerCase();
    return this.allProducts.filter((product) => {
      const matchesCategory = !category || product.category === category;
      const matchesSearch = !s || product.name.toLowerCase().includes(s);
      return matchesCategory && matchesSearch;
    });
  }
}
