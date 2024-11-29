import { provideTransloco, translocoConfig } from '@ngneat/transloco';

import {
  TRANSLOCO_TYPED_TRANSLATION_PATH,
  TranslocoTypedLoader,
} from '@energinet-datahub/gf/globalization/data-access-localization';
import { DisplayLanguage } from '@energinet-datahub/gf/globalization/domain';

import { environment } from '@energinet-datahub/eo/shared/environments';

export const eoTranslocoConfig = translocoConfig({
  availableLangs: [DisplayLanguage.English, DisplayLanguage.Danish],
  defaultLang: DisplayLanguage.English,
  fallbackLang: [DisplayLanguage.English, DisplayLanguage.Danish],
  missingHandler: {
    useFallbackTranslation: true,
  },
  // Remove this option if your application doesn't support changing language in runtime.
  reRenderOnLangChange: true,
  prodMode: environment.production,
});

export const translocoProviders = [
  provideTransloco({
    config: eoTranslocoConfig,
    loader: TranslocoTypedLoader,
  }),
  {
    provide: TRANSLOCO_TYPED_TRANSLATION_PATH,
    useValue: {
      da: () => import('@energinet-datahub/eo/globalization/assets-localization/i18n/da'),
      en: () => import('@energinet-datahub/eo/globalization/assets-localization/i18n/en'),
    },
  },
];
