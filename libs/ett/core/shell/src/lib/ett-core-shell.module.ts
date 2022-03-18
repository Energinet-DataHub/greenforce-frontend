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
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { eoDashboardRoutePath } from '@energinet-datahub/eo-dashboard-routing';
import { EttAuthenticationGuard } from '@energinet-datahub/ett/auth/routing-security';
import { EoTitleStore } from '@energinet-datahub/ett/shared/util-browser';
import { GfBrowserConfigurationModule } from '@energinet-datahub/gf/util-browser';

import { EttHttpModule } from './ett-http.module';
import { EttMaterialModule } from './ett-material.module';
import { EttShellComponent, EttShellScam } from './ett-shell.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    data: {
      title: 'Energy Origin',
    },
    loadChildren: () =>
      import('@energinet-datahub/eo/landing-page/shell').then(
        (esModule) => esModule.EoLandingPageShellModule
      ),
  },
  {
    path: 'terms',
    data: {
      title: 'Terms',
    },
    loadChildren: () =>
      import('@energinet-datahub/eo/auth/feature-terms').then(
        (esModule) => esModule.EoAuthFeatureTermsModule
      ),
  },
  {
    path: '',
    component: EttShellComponent,
    canActivateChild: [EttAuthenticationGuard],
    children: [
      {
        path: eoDashboardRoutePath,
        data: {
          title: 'Dashboard',
        },
        loadChildren: () =>
          import('@energinet-datahub/eo/dashboard/shell').then(
            (esModule) => esModule.EoDashboardShellModule
          ),
      },
      {
        path: 'metering-points',
        data: {
          title: 'Metering points',
        },
        loadChildren: () =>
          import('@energinet-datahub/eo/metering-points/shell').then(
            (esModule) => esModule.EoMeteringPointsShellModule
          ),
      },
      {
        path: 'privacy-policy',
        data: {
          title: 'Privacy Policy',
        },
        loadChildren: () =>
          import('@energinet-datahub/eo/privacy-policy/shell').then(
            (esModule) => esModule.EoPrivacyPolicyShellModule
          ),
      },
    ],
  },
];

@NgModule({
  exports: [RouterModule],
  imports: [
    GfBrowserConfigurationModule.forRoot(),
    EttHttpModule.forRoot(),
    RouterModule.forRoot(routes, {
      anchorScrolling: 'enabled',
      initialNavigation: 'enabledNonBlocking',
      scrollPositionRestoration: 'enabled',
    }),
    EttMaterialModule.forRoot(),
    EttShellScam,
  ],
})
export class EttCoreShellModule {
  constructor(
    // We need an instance to kick off effects
    // Can be removed in Angular 14
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    eoTitle: EoTitleStore
    // See comment about EoTitleStore
    // eslint-disable-next-line @typescript-eslint/no-empty-function
  ) {}
}
