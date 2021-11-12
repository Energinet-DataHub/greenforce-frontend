import { TranslocoTestingModule, TranslocoTestingOptions } from '@ngneat/transloco';
import { da, en } from '@energinet-datahub/dh/globalization/assets-localization';

export function getTranslocoTestingModule(options: TranslocoTestingOptions = {}) {
  return TranslocoTestingModule.forRoot({
    langs: { da, en },
    translocoConfig: {
      availableLangs: ['da', 'en'],
      defaultLang: 'da',
    },
    preloadLangs: true,
    ...options
  });
}
