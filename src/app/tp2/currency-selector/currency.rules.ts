import { Country } from '../model/country.interface';

export function resolveCurrency(country: Country, previous?: string): string {
  if (previous && country.acceptedCurrencies.includes(previous)) {
    return previous;
  }
  return country.acceptedCurrencies[0];
}
