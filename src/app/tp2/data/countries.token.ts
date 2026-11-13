import { InjectionToken } from '@angular/core';
import { Country } from '../model/country.interface';
import { countries } from './countries';

export const COUNTRIES = new InjectionToken<readonly Country[]>('COUNTRIES', {
  providedIn: 'root',
  factory: () => countries,
});
