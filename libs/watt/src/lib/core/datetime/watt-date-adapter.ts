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
import { NativeDateAdapter } from '@angular/material/core';

export type WattSupportedLocales = 'da' | 'en';
const danishLocale = 'da';

export class WattDateAdapter extends NativeDateAdapter {
  setActiveLocale(language: WattSupportedLocales): void {
    this.setLocale(language === danishLocale ? danishLocale : 'en-GB');
  }

  /**
   * This is necessary to remove the dots from the date (ordinals) for danish locale in the calendar view.
   * due to `Intl.DateTimeFormat`
   */
  override getDateNames(): string[] {
    const dateNames = super.getDateNames();

    return this.locale === danishLocale
      ? dateNames.map((dateName) => dateName.replace(/\./g, ''))
      : dateNames;
  }

  /**
   * Our week starts on Monday
   * @returns 0 for Sunday, 1 for Monday, etc.
   */
  override getFirstDayOfWeek(): number {
    return 1;
  }
}
