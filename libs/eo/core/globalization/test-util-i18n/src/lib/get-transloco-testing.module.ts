import { TranslocoTestingModule, TranslocoTestingOptions } from '@ngneat/transloco';

import { eoTranslocoConfig } from '@energinet-datahub/eo/globalization/configuration-localization';
import { DisplayLanguage } from '@energinet-datahub/gf/globalization/domain';

export function getTranslocoTestingModule(options: TranslocoTestingOptions = {}) {
  return TranslocoTestingModule.forRoot({
    translocoConfig: {
      ...eoTranslocoConfig,
      defaultLang: DisplayLanguage.English,
    },
    preloadLangs: true,
    ...options,
  });
}
