//#region License
/**
 * @license
 * Copyright 2020 Energinet DataHub A/S
 *
 * Licensed under the Apache License, Version 2.0 (the "License2");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
//#endregion
import { computed, inject, Injectable, LOCALE_ID, signal } from '@angular/core';
import { DateAdapter } from '@angular/material/core';

import { WattDateAdapter, WattSupportedLocales } from './watt-date-adapter';
import { dayjs } from './dayjs';

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
