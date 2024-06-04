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
import { ApplicationConfig } from '@angular/core';
import { TitleStrategy, provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { ettTranslocoConfig } from '@energinet-datahub/ett/globalization/configuration-localization';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideTransloco } from '@ngneat/transloco';
import {
  TRANSLOCO_TYPED_TRANSLATION_PATH,
  TranslocoTypedLoader,
} from '@energinet-datahub/gf/globalization/data-access-localization';

import { DA_TRANSLATIONS } from '@energinet-datahub/ett/globalization/assets-localization/i18n/da';
import { EN_TRANSLATIONS } from '@energinet-datahub/ett/globalization/assets-localization/i18n/en';

import { MetaStrategy } from './meta-strategy.service';

export const translocoProviders = [
  provideTransloco({
    config: ettTranslocoConfig,
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
    ...translocoProviders,
    {
      provide: TitleStrategy,
      useClass: MetaStrategy,
    },
  ],
};
