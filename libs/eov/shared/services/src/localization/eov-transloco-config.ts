import { EnvironmentProviders } from '@angular/core';
import { provideTransloco, translocoConfig } from '@ngneat/transloco';

import { environment } from '@energinet-datahub/eov/shared/environments';
import { EovTranslocoHttpLoader } from './eov-transloco-http-loader';

export enum DisplayLanguage {
  Danish = 'da',
  English = 'en',
}

export const dhTranslocoConfig = translocoConfig({
  availableLangs: [DisplayLanguage.Danish, DisplayLanguage.English],
  defaultLang: DisplayLanguage.Danish,
  fallbackLang: [DisplayLanguage.Danish, DisplayLanguage.English],
  flatten: {
    aot: environment.production,
  },
  missingHandler: {
    useFallbackTranslation: true,
  },
  // Remove this option if your application doesn't support changing language in runtime.
  reRenderOnLangChange: true,
  prodMode: environment.production,
});

export const translocoProviders: EnvironmentProviders[] = provideTransloco({
  config: dhTranslocoConfig,
  loader: EovTranslocoHttpLoader,
});
