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
import { BrowserUtils } from '@azure/msal-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DhApiModule } from '@energinet-datahub/dh/shared/data-access-api';
import { dhB2CEnvironmentToken } from '@energinet-datahub/dh/shared/environments';
import {
  DhConfigurationLocalizationModule,
  DhTranslocoModule,
} from '@energinet-datahub/dh/globalization/configuration-localization';
import { dhMeteringPointPath } from '@energinet-datahub/dh/metering-point/routing';
import {
  MSAL_GUARD_CONFIG,
  MSAL_INSTANCE,
  MSAL_INTERCEPTOR_CONFIG,
  MsalGuard,
  MSALGuardConfigFactory,
  MSALInstanceFactory,
  MsalInterceptor,
  MSALInterceptorConfigFactory,
  MsalModule,
  MsalService,
} from '@energinet-datahub/dh/auth/msal';

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
        canActivate: [MsalGuard],
      },
      {
        path: 'message-archive',
        loadChildren: () =>
          import('@energinet-datahub/dh/message-archive/shell').then(
            (esModule) => esModule.DhMessageArchiveShellModule
          ),
        canActivate: [MsalGuard],
      },
      {
        path: 'market-participant',
        loadChildren: () =>
          import('@energinet-datahub/dh/market-participant/shell').then(
            (esModule) => esModule.DhMarketParticipantShellModule
          ),
        canActivate: [MsalGuard],
      },
    ],
  },
  // Used by MSAL (B2C)
  { path: 'state', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  exports: [RouterModule],
  imports: [
    DhApiModule.forRoot(),
    DhCoreShellScam,
    DhTranslocoModule.forRoot(),
    HttpClientModule,
    MsalModule,
    DhConfigurationLocalizationModule.forRoot(),
    RouterModule.forRoot(routes, {
      anchorScrolling: 'enabled',
      // Don't perform initial navigation in iframes or popups
      initialNavigation:
        BrowserUtils.isInIframe() && BrowserUtils.isInPopup()
          ? 'disabled'
          : 'enabledNonBlocking',
      scrollPositionRestoration: 'enabled',
    }),
  ],
  providers: [
    MsalService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      multi: true,
    },
    {
      provide: MSAL_INSTANCE,
      useFactory: MSALInstanceFactory,
      deps: [dhB2CEnvironmentToken],
    },
    {
      provide: MSAL_GUARD_CONFIG,
      useFactory: MSALGuardConfigFactory,
      deps: [dhB2CEnvironmentToken],
    },
    {
      provide: MSAL_INTERCEPTOR_CONFIG,
      useFactory: MSALInterceptorConfigFactory,
      deps: [dhB2CEnvironmentToken],
    },
  ],
})
export class DhCoreShellModule {}
