import {
  ChangeDetectionStrategy,
  Component,
  linkedSignal,
  signal,
} from '@angular/core';
import { PRODUCTS, ProductCategory } from './product.data';

@Component({
  selector: 'app-products-filter',
  imports: [],
  standalone: true,
  templateUrl: './products-filter.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './products-filter.component.css',
})
export class ProductsFilterComponent {
  readonly allProducts = PRODUCTS;
  protected categories = [...new Set(PRODUCTS.map((p) => p.category))];

  protected search = signal<string>('');
  protected category = signal<string>('');

  // linkedSignal avec pour source la catégorie :
  // Lors d'un changement de catégorie, linkedSignal recalcule automatiquement
  // la liste des produits tout en conservant le filtre de la chaîne saisie (search())
  products = linkedSignal<string, ProductCategory[]>({
    source: this.category,
    computation: (cat) => this.filterProducts(this.search(), cat),
  });

  protected onSearch(value: string) {
    this.search.set(value);
    this.products.set(this.filterProducts(value, this.category()));
  }

  protected onCategoryChange(value: string) {
    this.category.set(value);
  }

  protected reset(form?: HTMLInputElement, filter?: HTMLSelectElement) {
    this.search.set('');
    this.category.set('');
    this.products.set(this.allProducts);
    if (form) form.value = '';
    if (filter) filter.value = '';
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
