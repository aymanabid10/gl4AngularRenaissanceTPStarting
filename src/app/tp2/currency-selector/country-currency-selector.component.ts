import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CurrencySelectorStore } from './currency-selector.store';

@Component({
  selector: 'app-country-currency-selector',
  imports: [FormsModule],
  standalone: true,
  templateUrl: './country-currency-selector.component.html',
  styleUrl: './country-currency-selector.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [CurrencySelectorStore],
})
export class CountryCurrencySelectorComponent {
  protected readonly store = inject(CurrencySelectorStore);
}
