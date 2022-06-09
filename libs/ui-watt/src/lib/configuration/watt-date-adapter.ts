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
import { Inject, Optional } from '@angular/core';
import { DateFnsAdapter } from '@angular/material-date-fns-adapter';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import * as daLocale from 'date-fns/locale/da/index.js';
import * as enLocale from 'date-fns/locale/en-GB/index.js';

export type WattSupportedLocales = 'da' | 'en';
const danishLocale = 'da';

export class WattDateAdapter extends DateFnsAdapter {
  // eslint-disable-next-line @typescript-eslint/ban-types
  constructor(@Optional() @Inject(MAT_DATE_LOCALE) matDateLocale: {}) {
    super(matDateLocale);
  }

  setActiveLocale(language: WattSupportedLocales): void {
    this.setLocale((language === danishLocale ? daLocale : enLocale) as Locale);
  }

  /**
   * This is necessary to remove the dots from the date (ordinals) for danish locale in the calendar view.
   * due to `Intl.DateTimeFormat`
   */
  getDateNames(): string[] {
    const dateNames = super.getDateNames();
    return this.locale.code === danishLocale
      ? dateNames.map((dateName) => dateName.replace(/\./g, ''))
      : dateNames;
  }
}
