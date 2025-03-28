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
import { EnvironmentProviders } from '@angular/core';
import { provideTransloco, translocoConfig } from '@jsverse/transloco';

import { TranslocoHttpLoader } from '@energinet-datahub/gf/globalization/data-access-localization';
import { DisplayLanguage } from '@energinet-datahub/gf/globalization/domain';
import { environment } from '@energinet-datahub/dh/shared/environments';

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
  loader: TranslocoHttpLoader,
});
