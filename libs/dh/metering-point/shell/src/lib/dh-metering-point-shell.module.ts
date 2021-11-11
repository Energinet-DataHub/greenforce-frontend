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
import { CommonModule } from '@angular/common';

import { DhMeteringPointChildComponent } from '@energinet-datahub/dh/metering-point/feature-child';
import { DhMeteringPointDetailsComponent } from '@energinet-datahub/dh/metering-point/feature-details';
import { DhMeteringPointSearchComponent } from '@energinet-datahub/dh/metering-point/feature-search';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'search', component: DhMeteringPointSearchComponent },
  {
    path: ':id',
    component: DhMeteringPointDetailsComponent,
  },
  { path: ':id/child/:child-id', component: DhMeteringPointChildComponent },
  { path: '', redirectTo: 'search', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class DhMeteringPointShellModule {}
