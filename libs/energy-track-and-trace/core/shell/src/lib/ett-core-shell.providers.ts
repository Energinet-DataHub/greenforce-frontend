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
import { importProvidersFrom } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { TitleStrategy } from '@angular/router';

import { translocoProviders } from '@energinet-datahub/ett/globalization/configuration-localization';
import {
  ettApiVersioningInterceptorProvider,
  ettAuthorizationInterceptorProvider,
} from '@energinet-datahub/ett/shared/services';
import { danishLocalProviders } from '@energinet-datahub/gf/globalization/configuration-danish-locale';
import { browserConfigurationProviders } from '@energinet-datahub/gf/util-browser';
import { danishDatetimeProviders } from '@energinet-datahub/watt/danish-date-time';
import { WattModalService } from '@energinet-datahub/watt/modal';
import { ettLanguageServiceInitializer } from '@energinet-datahub/ett/globalization/feature-language-switcher';
import { ettWattTranslationsProviders } from '@energinet-datahub/ett/globalization/configuration-watt-translation';

import { PageTitleStrategy } from './title-strategy.service';

export const ettCoreShellProviders = [
  browserConfigurationProviders,
  danishLocalProviders,
  danishDatetimeProviders,
  importProvidersFrom(MatDialogModule, MatSnackBarModule),
  ettAuthorizationInterceptorProvider,
  ettApiVersioningInterceptorProvider,
  WattModalService,
  ...translocoProviders,
  ettLanguageServiceInitializer,
  ettWattTranslationsProviders,
  {
    provide: TitleStrategy,
    useClass: PageTitleStrategy,
  },
];
