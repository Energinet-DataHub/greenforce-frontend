import { Injectable } from '@angular/core';
import { DateAdapter } from '@angular/material/core';
import { WattDateAdapter, WattSupportedLocales } from './watt-date-adapter';

@Injectable({
  providedIn: 'root',
})
export class WattLocaleService {
  constructor(private dateAdapter: DateAdapter<unknown>) {}

  setActiveLocale(locale: WattSupportedLocales): void {
    (this.dateAdapter as WattDateAdapter).setActiveLocale(locale);
  }
}
