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
import { Routes } from '@angular/router';
import { EovShellComponent } from './eov-shell.component';

export const eovShellRoutes: Routes = [
  {
    path: '',
    component: EovShellComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
        import('@energinet-datahub/eov/landing-page/shell').then(
          (esModule) => esModule.eovLandingPageRoutes
        ),
      },
      {
        path: 'overview',
        loadChildren: () =>
          import('@energinet-datahub/eov/overview/shell').then(
            (esModule) => esModule.eovOverviewRoutes
          ),
      },
      {
        path: 'help',
        loadComponent: () => import('./help/help.component').then(mod => mod.HelpComponent)
      },
    ]
  },
  { path: '**', redirectTo: '' }, // Catch-all that can be used for 404 redirects in the future
];
