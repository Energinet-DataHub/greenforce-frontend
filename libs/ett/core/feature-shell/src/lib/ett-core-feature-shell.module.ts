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

import { EttShellComponent, EttShellScam } from './shell/ett-shell.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadChildren: () =>
      import('@energinet-datahub/ett/core/feature-onboarding').then(
        (esModule) => esModule.EttCoreFeatureOnboardingModule
      ),
  },
  {
    path: '',
    component: EttShellComponent,
    children: [
      {
        path: 'dashboard',
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
    RouterModule.forRoot(routes, {
      anchorScrolling: 'enabled',
      initialNavigation: 'enabledNonBlocking',
      scrollPositionRestoration: 'enabled',
    }),
    EttShellScam,
  ],
})
export class EttCoreFeatureShellModule {}
