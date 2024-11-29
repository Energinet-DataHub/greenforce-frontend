import { Injectable, effect, inject, signal, untracked } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';

import { WattLocaleService } from '@energinet-datahub/watt/locale';
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
