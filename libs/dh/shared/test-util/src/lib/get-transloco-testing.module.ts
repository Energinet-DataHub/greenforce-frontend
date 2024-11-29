import { TranslocoTestingModule, TranslocoTestingOptions } from '@ngneat/transloco';

import { da, en } from '@energinet-datahub/dh/globalization/assets-localization';
import { dhTranslocoConfig } from '@energinet-datahub/dh/globalization/configuration-localization';
import { DisplayLanguage } from '@energinet-datahub/gf/globalization/domain';

export function getTranslocoTestingModule(options: TranslocoTestingOptions = {}) {
  return TranslocoTestingModule.forRoot({
    langs: { da, en },
    translocoConfig: {
      ...dhTranslocoConfig,
      defaultLang: DisplayLanguage.English,
    },
    preloadLangs: true,
    ...options,
  });
}
