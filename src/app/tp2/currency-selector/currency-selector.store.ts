import {
  Injectable,
  computed,
  inject,
  linkedSignal,
  signal,
} from '@angular/core';
import { COUNTRIES } from '../data/countries.token';
import { Country } from '../model/country.interface';

@Injectable()
export class CurrencySelectorStore {
  readonly countries = inject(COUNTRIES);

  readonly #country = signal<Country>(this.countries[0]);
  readonly country = this.#country.asReadonly();

  readonly currencies = computed(() => this.#country().acceptedCurrencies);

  readonly #currency = linkedSignal(() => this.currencies()[0]);
  readonly currency = this.#currency.asReadonly();

  selectCountry(country: Country): void {
    this.#country.set(country);
  }

  selectCurrency(currency: string): void {
    this.#currency.set(currency);
  }
}
