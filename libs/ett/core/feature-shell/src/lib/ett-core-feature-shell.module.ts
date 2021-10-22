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
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ettAuthRoutePath } from '@energinet-datahub/ett/auth/feature-shell';
import { EttBrowserConfigurationModule } from '@energinet-datahub/ett/core/util-browser';

import { ettDashboardRoutePath } from './../../../../dashboard/feature-shell/src/lib/ett-dashboard-route-path';
import { EttShellComponent, EttShellScam } from './ett-shell.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: ettAuthRoutePath,
  },
  {
    path: ettAuthRoutePath,
    loadChildren: () =>
      import('@energinet-datahub/ett/auth/feature-shell').then(
        (esModule) => esModule.EttAuthFeatureShellModule
      ),
  },
  {
    path: '',
    component: EttShellComponent,
    children: [
      {
        path: ettDashboardRoutePath,
        loadChildren: () =>
          import('@energinet-datahub/ett/dashboard/feature-shell').then(
            (esModule) => esModule.EttDashboardFeatureShellModule
          ),
      },
    ],
  },
];

@NgModule({
  exports: [RouterModule],
  imports: [
    EttBrowserConfigurationModule.forRoot(),
    HttpClientModule,
    RouterModule.forRoot(routes, {
      anchorScrolling: 'enabled',
      initialNavigation: 'enabledNonBlocking',
      scrollPositionRestoration: 'enabled',
    }),
    EttShellScam,
  ],
})
export class EttCoreFeatureShellModule {}
