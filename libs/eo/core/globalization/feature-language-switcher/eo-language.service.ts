import { Injectable, inject } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';

import { WattLocaleService } from '@energinet-datahub/watt/locale';
import { toDisplayLanguage } from '@energinet-datahub/gf/globalization/domain';

@Injectable({
  providedIn: 'root',
})
export class EoLanguageService {
  private readonly transloco = inject(TranslocoService);
  private readonly localeService = inject(WattLocaleService);

  init(): void {
    let language = navigator.language.split('-')[0];
    if (language !== 'da' && language !== 'en') {
      language = 'en';
    }
    this.transloco.setActiveLang(language);
    this.localeService.setActiveLocale(toDisplayLanguage(language));
  }
}
