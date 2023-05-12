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
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  DhConfigurationLocalizationModule,
  DhTranslocoModule,
} from '@energinet-datahub/dh/globalization/configuration-localization';
import { DhGlobalizationUiWattTranslationModule } from '@energinet-datahub/dh/globalization/ui-watt-translation';
import {
  AuthConfigModule,
  AuthenticationGuard,
  DhAuthLoginComponent,
  dhAuthenticationInterceptor,
} from '@energinet-datahub/dh/auth/oidc';
import { DhApiModule } from '@energinet-datahub/dh/shared/data-access-api';
import { DhGraphQLModule } from '@energinet-datahub/dh/shared/data-access-graphql';
import { environment } from '@energinet-datahub/dh/shared/environments';
import { dhMarketParticipantPath } from '@energinet-datahub/dh/market-participant/routing';
import { dhMeteringPointPath } from '@energinet-datahub/dh/metering-point/routing';
import { dhChargesPath } from '@energinet-datahub/dh/charges/routing';
import { WattDanishDatetimeModule } from '@energinet-datahub/watt/danish-date-time';
import { WattToastModule } from '@energinet-datahub/watt/toast';
import { DhCoreShellComponent } from './dh-core-shell.component';
import { DhSharedUtilApplicationInsightsModule } from '@energinet-datahub/dh/shared/util-application-insights';
import { WHOLESALE_BASE_PATH } from '@energinet-datahub/dh/wholesale/routing';
import { dhAuthorizationInterceptor } from '@energinet-datahub/dh/shared/feature-authorization';
import { dhAdminPath } from '@energinet-datahub/dh/admin/routing';

const routes: Routes = [
  // Open routes.
  { path: 'signin', component: DhAuthLoginComponent },
  { path: 'state', redirectTo: '', pathMatch: 'full' },

  // Routes that must be protected.
  {
    path: '',
    component: DhCoreShellComponent,
    canActivate: [AuthenticationGuard],
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
      {
        path: 'message-archive',
        loadChildren: () =>
          import('@energinet-datahub/dh/message-archive/shell').then(
            (esModule) => esModule.DhMessageArchiveShellModule
          ),
      },
      {
        path: dhMarketParticipantPath,
        loadChildren: () =>
          import('@energinet-datahub/dh/market-participant/shell').then(
            (esModule) => esModule.DhMarketParticipantShellModule
          ),
      },
      {
        path: WHOLESALE_BASE_PATH,
        loadChildren: () =>
          import('@energinet-datahub/dh/wholesale/shell').then(
            (esModule) => esModule.WHOLESALE_SHELL
          ),
      },
      {
        path: dhChargesPath,
        loadChildren: () =>
          import('@energinet-datahub/dh/charges/shell').then(
            (esModule) => esModule.DhChargesShellModule
          ),
      },
      {
        path: dhAdminPath,
        loadChildren: () =>
          import('@energinet-datahub/dh/admin/shell').then((esModule) => esModule.routes),
      },
    ],
  },
];

@NgModule({
  exports: [RouterModule],
  imports: [
    DhApiModule.forRoot(),
    DhGraphQLModule.forRoot(),
    DhCoreShellComponent,
    DhTranslocoModule.forRoot(),
    HttpClientModule,
    AuthConfigModule,
    DhConfigurationLocalizationModule.forRoot(),
    WattDanishDatetimeModule.forRoot(),
    environment.production ? DhSharedUtilApplicationInsightsModule.forRoot() : [],
    RouterModule.forRoot(routes, {
      anchorScrolling: 'enabled',
      // Don't perform initial navigation in iframes or popups
      initialNavigation: 'enabledNonBlocking', // TODO: Reimplement without MSAL: BrowserUtils.isInIframe() && BrowserUtils.isInPopup() ? 'disabled' : 'enabledNonBlocking',
      scrollPositionRestoration: 'enabled',
    }),
    WattToastModule.forRoot(),
    DhGlobalizationUiWattTranslationModule.forRoot(),
  ],
  providers: [dhAuthenticationInterceptor, dhAuthorizationInterceptor],
})
export class DhCoreShellModule {}
