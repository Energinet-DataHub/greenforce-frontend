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
import { inject } from '@angular/core';
import { Routes } from '@angular/router';

import { DhFeatureFlagsService } from '@energinet-datahub/dh/shared/feature-flags';
import { DhMessageArchiveLogSearchComponent } from '@energinet-datahub/dh/message-archive/feature-log-search';

export const dhMessageArchiveShellRoutes: Routes = [
  {
    path: '',
    canMatch: [() => inject(DhFeatureFlagsService).isEnabled('message-archive-v2')],
    loadComponent: () =>
      import('@energinet-datahub/dh/message-archive/feature-search').then(
        (m) => m.DhMessageArchiveSearchPageComponent
      ),
    pathMatch: 'full',
    data: {
      titleTranslationKey: 'messageArchive.topBarTitle',
    },
  },
  {
    path: '',
    component: DhMessageArchiveLogSearchComponent,
    pathMatch: 'full',
    data: {
      titleTranslationKey: 'messageArchive.topBarTitle',
    },
  },
];
