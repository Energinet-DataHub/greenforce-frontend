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
import { Router, Routes } from '@angular/router';
import { inject } from '@angular/core';

import { PermissionGuard } from '@energinet-datahub/dh/shared/feature-authorization';
import { getPath, MeteringPointDebugSubPaths } from '@energinet-datahub/dh/core/routing';
import { DhFeatureFlagsService } from '@energinet-datahub/dh/shared/feature-flags';

import { DhMeteringPointDebugComponent } from './debug.component';
import { DhMeteringPointComponent } from './debug-metering-point/metering-point.component';
import { DhMeteringPointsDebugComponent } from './debug-metering-points/metering-points.component';

export const dhMeteringPointDebugRoutes: Routes = [
  {
    path: '',
    canActivate: [
      PermissionGuard(['fas']),
      () =>
        inject(DhFeatureFlagsService).isEnabled('metering-point-debug') ||
        inject(Router).parseUrl('/'),
    ],
    data: {
      titleTranslationKey: 'meteringPointDebug.topBarTitle',
    },
    children: [
      {
        path: '',
        component: DhMeteringPointDebugComponent,
        children: [
          {
            path: '',
            pathMatch: 'full',
            redirectTo: getPath<MeteringPointDebugSubPaths>('metering-point'),
          },
          {
            path: getPath<MeteringPointDebugSubPaths>('metering-point'),
            component: DhMeteringPointComponent,
          },
          {
            path: getPath<MeteringPointDebugSubPaths>('metering-points'),
            component: DhMeteringPointsDebugComponent,
          },
        ],
      },
    ],
  },
];
