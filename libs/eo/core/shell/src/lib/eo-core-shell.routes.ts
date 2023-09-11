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
import { EoScopeGuard } from '@energinet-datahub/eo/auth/routing-security';
import {
  eoCertificatesRoutePath,
  eoConnectionsRoutePath,
  eoConsumptionPageRoutePath,
  eoDashboardRoutePath,
  eoEmissionsRoutePath,
  eoHelpRoutePath,
  eoMeteringPointsRoutePath,
  eoOriginOfEnergyRoutePath,
  eoPrivacyPolicyRoutePath,
  eoProductionRoutePath,
  eoTransferRoutePath,
} from '@energinet-datahub/eo/shared/utilities';
import { EoLoginComponent } from './eo-login.component';
import { EoShellComponent } from './eo-shell.component';

export const eoShellRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadChildren: () =>
      import('@energinet-datahub/eo/landing-page/shell').then(
        (esModule) => esModule.eoLandingPageRoutes
      ),
  },
  { path: 'login', component: EoLoginComponent },
  {
    path: 'terms',
    data: { title: 'Terms' },
    loadChildren: () =>
      import('@energinet-datahub/eo/terms').then((esModule) => esModule.eoTermsRoutes),
  },
  {
    path: '',
    component: EoShellComponent,
    children: [
      {
        path: eoCertificatesRoutePath,
        canActivate: [EoScopeGuard],
        loadChildren: () =>
          import('@energinet-datahub/eo/certificates').then(
            (esModule) => esModule.eoCertificatesRoutes
          ),
      },
      {
        path: eoDashboardRoutePath,
        canActivate: [EoScopeGuard],
        data: { title: 'Dashboard' },
        loadChildren: () =>
          import('@energinet-datahub/eo/dashboard/shell').then(
            (esModule) => esModule.eoDashboardRoutes
          ),
      },
      {
        path: eoOriginOfEnergyRoutePath,
        canActivate: [EoScopeGuard],
        data: { title: 'Renewable Share' },
        loadChildren: () =>
          import('@energinet-datahub/eo/origin-of-energy/shell').then(
            (esModule) => esModule.eoOriginOfEnergyRoutes
          ),
      },
      {
        path: eoConsumptionPageRoutePath,
        canActivate: [EoScopeGuard],
        data: { title: 'Consumption' },
        loadChildren: () =>
          import('@energinet-datahub/eo/consumption-page/shell').then(
            (esModule) => esModule.eoConsumptionPageRoutes
          ),
      },
      {
        path: eoProductionRoutePath,
        canActivate: [EoScopeGuard],
        data: { title: 'Production' },
        loadChildren: () =>
          import('@energinet-datahub/eo/production/shell').then(
            (esModule) => esModule.eoProductionRoutes
          ),
      },
      {
        path: eoMeteringPointsRoutePath,
        canActivate: [EoScopeGuard],
        data: { title: 'Metering points' },
        loadChildren: () =>
          import('@energinet-datahub/eo/metering-points/shell').then(
            (esModule) => esModule.eoMeteringPointsRoutes
          ),
      },
      {
        path: eoEmissionsRoutePath,
        canActivate: [EoScopeGuard],
        data: { title: 'Emissions' },
        loadChildren: () =>
          import('@energinet-datahub/eo/emissions/shell').then(
            (esModule) => esModule.eoEmissionsRoutes
          ),
      },
      {
        path: eoTransferRoutePath,
        canActivate: [EoScopeGuard],
        data: { title: 'Transfers' },
        loadChildren: () =>
          import('@energinet-datahub/eo/transfers').then((esModule) => esModule.eoTransfersRoutes),
      },
      {
        path: eoConnectionsRoutePath,
        canActivate: [EoScopeGuard],
        data: { title: 'Connections' },
        loadChildren: () =>
          import('@energinet-datahub/eo/connections/shell').then(
            (esModule) => esModule.eoConnectionsRoutes
          ),
      },
      {
        path: eoPrivacyPolicyRoutePath,
        data: { title: 'Privacy Policy' },
        loadChildren: () =>
          import('@energinet-datahub/eo/privacy-policy/shell').then(
            (esModule) => esModule.eoPrivacyPolicyRoutes
          ),
      },
      {
        path: eoHelpRoutePath,
        loadChildren: () =>
          import('@energinet-datahub/eo/help/shell').then((esModule) => esModule.eoHelpRoutes),
      },
    ],
  },
  { path: '**', redirectTo: '' }, // Catch-all that can be used for 404 redirects in the future
];
