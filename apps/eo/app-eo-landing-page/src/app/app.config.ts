import { ApplicationConfig } from '@angular/core';
import { TitleStrategy, provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { eoTranslocoConfig } from '@energinet-datahub/eo/globalization/configuration-localization';
import { HttpClient, provideHttpClient, withFetch } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideTransloco } from '@ngneat/transloco';
import { provideMarkdown } from 'ngx-markdown';

import {
  TRANSLOCO_TYPED_TRANSLATION_PATH,
  TranslocoTypedLoader,
} from '@energinet-datahub/gf/globalization/data-access-localization';
import { DA_TRANSLATIONS } from '@energinet-datahub/eo/globalization/assets-localization/i18n/da';
import { EN_TRANSLATIONS } from '@energinet-datahub/eo/globalization/assets-localization/i18n/en';

import { MetaStrategy } from './meta-strategy.service';

export const translocoProviders = [
  provideTransloco({
    config: eoTranslocoConfig,
    loader: TranslocoTypedLoader,
  }),
  {
    provide: TRANSLOCO_TYPED_TRANSLATION_PATH,
    useValue: {
      da: DA_TRANSLATIONS,
      en: EN_TRANSLATIONS,
    },
  },
];

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    provideClientHydration(),
    provideHttpClient(withFetch()),
    provideRouter(appRoutes),
    provideMarkdown({ loader: HttpClient }),
    ...translocoProviders,
    {
      provide: TitleStrategy,
      useClass: MetaStrategy,
    },
  ],
};
