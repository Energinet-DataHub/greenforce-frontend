/**
 * @license
 * Copyright 2021 Energinet DataHub A/S
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
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DhMeteringPointFeatureChildOverviewModule } from '@energinet-datahub/dh/metering-point/feature-child-overview';

import {
  DhMeteringPointOverviewComponent,
  DhMeteringPointOverviewScam,
} from './dh-metering-point-overview.component';
import { dhMeteringPointIdParam } from './routing/dh-metering-point-id-param';
import { DhMeteringPointOverviewGuard } from './routing/dh-metering-point-overview.guard';

const routes: Routes = [
  {
    path: `:${dhMeteringPointIdParam}`,
    canActivate: [DhMeteringPointOverviewGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: DhMeteringPointOverviewComponent,
      },
      {
        path: '',
        loadChildren: () => DhMeteringPointFeatureChildOverviewModule,
      },
    ],
  },
];

@NgModule({
  imports: [DhMeteringPointOverviewScam, RouterModule.forChild(routes)],
})
export class DhMeteringPointFeatureOverviewModule {}
