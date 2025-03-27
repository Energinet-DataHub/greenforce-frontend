//#region License
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
//#endregion
import { provideTransloco, translocoConfig } from '@jsverse/transloco';

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
