import { Injectable, inject } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';

import { WattLocaleService } from '@energinet-datahub/watt/locale';
import { DisplayLanguage, toDisplayLanguage } from '@energinet-datahub/dh/globalization/domain';

const LOCALE_STORAGE_KEY = 'dh-language';

@Injectable({
  providedIn: 'root',
})
export class DhLanguageService {
  private readonly _transloco = inject(TranslocoService);
  private readonly _localeService = inject(WattLocaleService);
  /** Returns selected language, will default to 'DisplayLanguage.Danish' if none exsists */
  get selectedLanguage(): string {
    return localStorage.getItem(LOCALE_STORAGE_KEY) || DisplayLanguage.Danish;
  }
  set selectedLanguage(language: string) {
    this._localeService.setActiveLocale(toDisplayLanguage(language));
    this._transloco.setActiveLang(language);
    localStorage.setItem(LOCALE_STORAGE_KEY, language);
  }
  init(): void {
    this._transloco.setActiveLang(this.selectedLanguage);
    this._localeService.setActiveLocale(toDisplayLanguage(this.selectedLanguage));
  }
}
