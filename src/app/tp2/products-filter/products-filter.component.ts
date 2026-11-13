import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
} from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { PRODUCTS, ProductCategory } from './product.data';
import { FilterCriteria } from './filter.interface';

@Component({
  selector: 'app-products-filter',
  imports: [FormsModule],
  standalone: true,
  templateUrl: './products-filter.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './products-filter.component.css',
})
export class ProductsFilterComponent {
  readonly allProducts = signal<ProductCategory[]>(PRODUCTS);

  readonly categories = computed(() => [
    ...new Set(this.allProducts().map((p) => p.category)),
  ]);

  readonly search = signal<string>('');
  readonly category = signal<string>('');

  private readonly search$ = toObservable(this.search).pipe(
    debounceTime(300),
    distinctUntilChanged()
  );
  readonly debouncedSearch = toSignal(this.search$, { initialValue: '' });

  readonly products = computed(() =>
    this.filterProducts({
      search: this.debouncedSearch(),
      category: this.category(),
    })
  );

  protected reset() {
    this.search.set('');
    this.category.set('');
  }

  private filterProducts(filters: FilterCriteria): ProductCategory[] {
    const s = filters.search.trim().toLowerCase();
    const cat = filters.category;

    return this.allProducts().filter((product) => {
      const matchesCategory = !cat || product.category === cat;
      const matchesSearch = !s || product.name.toLowerCase().includes(s);
      return matchesCategory && matchesSearch;
    });
  }
}
