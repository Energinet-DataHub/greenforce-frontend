import { computed, inject, Injectable, LOCALE_ID, signal } from '@angular/core';
import { DateAdapter } from '@angular/material/core';

import { WattDateAdapter, WattSupportedLocales } from './watt-date-adapter';
import { dayjs } from '@energinet-datahub/watt/date';

@Injectable({
  providedIn: 'root',
})
export class WattLocaleService {
  locale = signal(inject<WattSupportedLocales>(LOCALE_ID));
  isDanish = computed(() => this.locale() == 'da');
  isEnglish = computed(() => this.locale() == 'en');

  constructor(private dateAdapter: DateAdapter<unknown>) {}

  async setActiveLocale(locale: WattSupportedLocales): Promise<void> {
    if (locale === 'da') {
      await import('dayjs/locale/da');
    }

    if (locale === 'en') {
      await import('dayjs/locale/en');
    }

    dayjs.locale(locale);
    (this.dateAdapter as WattDateAdapter).setActiveLocale(locale);
    this.locale.set(locale);
  }
}
