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
import { MatDialogModule } from '@angular/material/dialog';
import { RouterModule, Routes } from '@angular/router';
import { EoAuthenticationGuard } from '@energinet-datahub/eo/auth/routing-security';
import {
  eoCertificatesRoutePath,
  eoConsumptionPageRoutePath,
  eoDashboardRoutePath,
  eoEmissionsRoutePath,
  eoHelpRoutePath,
  eoMeteringPointsRoutePath,
  eoOriginOfEnergyRoutePath,
  eoPrivacyPolicyRoutePath,
  eoProductionRoutePath,
} from '@energinet-datahub/eo/shared/utilities';
import { GfBrowserConfigurationModule } from '@energinet-datahub/gf/util-browser';
import { EoHttpModule } from './eo-http.module';
import { EoLoginComponent } from './eo-login.component';
import { EoMaterialModule } from './eo-material.module';
import { EoShellComponent } from './eo-shell.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadChildren: () =>
      import('@energinet-datahub/eo/landing-page/shell').then(
        (esModule) => esModule.EoLandingPageShellModule
      ),
  },
  { path: 'login', component: EoLoginComponent },
  {
    path: 'terms',
    data: { title: 'Terms' },
    loadChildren: () =>
      import('@energinet-datahub/eo/terms').then((esModule) => esModule.EoTermsModule),
  },
  {
    path: '',
    component: EoShellComponent,
    children: [
      {
        path: eoCertificatesRoutePath,
        canActivate: [EoAuthenticationGuard],
        loadChildren: () =>
          import('@energinet-datahub/eo/certificates').then(
            (esModule) => esModule.EoCertificatesModule
          ),
      },
      {
        path: eoDashboardRoutePath,
        canActivate: [EoAuthenticationGuard],
        data: { title: 'Dashboard' },
        loadChildren: () =>
          import('@energinet-datahub/eo/dashboard/shell').then(
            (esModule) => esModule.EoDashboardShellModule
          ),
      },
      {
        path: eoOriginOfEnergyRoutePath,
        canActivate: [EoAuthenticationGuard],
        data: { title: 'Renewable Share' },
        loadChildren: () =>
          import('@energinet-datahub/eo/origin-of-energy/shell').then(
            (esModule) => esModule.EoOriginOfEnergyShellModule
          ),
      },
      {
        path: eoConsumptionPageRoutePath,
        canActivate: [EoAuthenticationGuard],
        data: { title: 'Consumption' },
        loadChildren: () =>
          import('@energinet-datahub/eo/consumption-page/shell').then(
            (esModule) => esModule.EoConsumptionPageShellModule
          ),
      },
      {
        path: eoProductionRoutePath,
        canActivate: [EoAuthenticationGuard],
        data: { title: 'Production' },
        loadChildren: () =>
          import('@energinet-datahub/eo/production/shell').then(
            (esModule) => esModule.EoProductionShellModule
          ),
      },
      {
        path: eoMeteringPointsRoutePath,
        canActivate: [EoAuthenticationGuard],
        data: { title: 'Metering points' },
        loadChildren: () =>
          import('@energinet-datahub/eo/metering-points/shell').then(
            (esModule) => esModule.EoMeteringPointsShellModule
          ),
      },
      {
        path: eoEmissionsRoutePath,
        canActivate: [EoAuthenticationGuard],
        data: { title: 'Emissions' },
        loadChildren: () =>
          import('@energinet-datahub/eo/emissions/shell').then(
            (esModule) => esModule.EoEmissionsPageShellModule
          ),
      },
      {
        path: eoHelpRoutePath,
        loadChildren: () =>
          import('@energinet-datahub/eo/help/shell').then((esModule) => esModule.EoHelpModule),
      },
      {
        path: eoPrivacyPolicyRoutePath,
        data: { title: 'Privacy Policy' },
        loadChildren: () =>
          import('@energinet-datahub/eo/privacy-policy/shell').then(
            (esModule) => esModule.EoPrivacyPolicyShellModule
          ),
      },
    ],
  },
  { path: '**', redirectTo: '' }, // Catch-all that can be used for 404 redirects in the future
];

@NgModule({
  imports: [
    GfBrowserConfigurationModule.forRoot(),
    EoHttpModule.forRoot(),
    RouterModule.forRoot(routes, {
      anchorScrolling: 'enabled',
      initialNavigation: 'enabledNonBlocking',
      scrollPositionRestoration: 'enabled',
    }),
    EoMaterialModule.forRoot(),
    EoShellComponent,
    MatDialogModule,
  ],
})
export class EoCoreShellModule {}
