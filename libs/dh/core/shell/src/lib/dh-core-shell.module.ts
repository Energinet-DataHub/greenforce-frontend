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
import { BrowserUtils } from '@azure/msal-browser';
import { DhTranslocoModule } from '@energinet-datahub/dh/globalization/configuration-localization';
import { dhMeteringPointPath } from '@energinet-datahub/dh/metering-point/shell';
import { DhApiModule } from '@energinet-datahub/dh/shared/data-access-api';

import {
  DhCoreShellComponent,
  DhCoreShellScam,
} from './dh-core-shell.component';

const routes: Routes = [
  {
    path: '',
    component: DhCoreShellComponent,
    children: [
      {
        path: '',
        redirectTo: dhMeteringPointPath,
        pathMatch: 'full',
      },
      {
        path: dhMeteringPointPath,
        loadChildren: () =>
          import('@energinet-datahub/dh/metering-point/shell').then(
            (esModule) => esModule.DhMeteringPointShellModule
          ),
      },
    ],
  },
  // { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  exports: [RouterModule],
  imports: [
    DhCoreShellScam,
    HttpClientModule,
    DhApiModule.forRoot(),
    DhTranslocoModule.forRoot(),
    RouterModule.forRoot(routes, {
      anchorScrolling: 'enabled',
      useHash: true,
      // Don't perform initial navigation in iframes or popups
      initialNavigation:
        !BrowserUtils.isInIframe() && !BrowserUtils.isInPopup()
          ? 'enabled'
          : 'disabled',
      scrollPositionRestoration: 'enabled',
    }),
  ],
})
export class DhCoreShellModule {}
