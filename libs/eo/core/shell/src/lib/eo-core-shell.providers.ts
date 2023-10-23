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
import { FormGroupDirective } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { eoAuthorizationInterceptorProvider } from '@energinet-datahub/eo/shared/services';
import { danishLocalProviders } from '@energinet-datahub/gf/configuration-danish-locale';
import { browserConfigurationProviders } from '@energinet-datahub/gf/util-browser';
import { danishDatetimeProviders } from '@energinet-datahub/watt/danish-date-time';
import { WattModalService } from '@energinet-datahub/watt/modal';

export const eoCoreShellProviders = [
  FormGroupDirective,
  browserConfigurationProviders,
  danishLocalProviders,
  danishDatetimeProviders,
  importProvidersFrom(MatDialogModule, MatSnackBarModule),
  eoAuthorizationInterceptorProvider,
  WattModalService,
];
