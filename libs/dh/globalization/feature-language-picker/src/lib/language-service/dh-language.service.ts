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
import { Injectable, effect, inject, signal, untracked } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';

import { WattLocaleService } from '@energinet-datahub/watt/date';
import { DisplayLanguage, toDisplayLanguage } from '@energinet-datahub/gf/globalization/domain';

const LOCALE_STORAGE_KEY = 'dh-language';

@Injectable({
  providedIn: 'root',
})
export class DhLanguageService {
  private readonly transloco = inject(TranslocoService);
  private readonly wattLocaleService = inject(WattLocaleService);

  /** Returns selected language, will default to 'DisplayLanguage.Danish' if none exsists */
  public selectedLanguage = signal(
    localStorage.getItem(LOCALE_STORAGE_KEY) ?? DisplayLanguage.Danish
  );

  constructor() {
    effect(() => {
      const selectedLanguage = this.selectedLanguage();

      // Prevent tracking signals from subscribers to the translation API
      untracked(() => {
        this.transloco.setActiveLang(selectedLanguage);
        this.wattLocaleService.setActiveLocale(toDisplayLanguage(selectedLanguage));
      });

      localStorage.setItem(LOCALE_STORAGE_KEY, this.selectedLanguage());
    });
  }

  init(): void {
    this.transloco.setActiveLang(this.selectedLanguage());
    this.wattLocaleService.setActiveLocale(toDisplayLanguage(this.selectedLanguage()));
  }
}
