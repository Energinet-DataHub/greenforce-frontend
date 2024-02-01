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
  eoClaimsRoutePath,
  eoDashboardRoutePath,
  eoHelpRoutePath,
  eoMeteringPointsRoutePath,
  eoPrivacyPolicyRoutePath,
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
    title: 'Terms',
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
          import('@energinet-datahub/eo/certificates/shell').then(
            (esModule) => esModule.eoCertificatesRoutes
          ),
      },
      {
        path: eoDashboardRoutePath,
        canActivate: [EoScopeGuard],
        title: 'Dashboard',
        loadChildren: () =>
          import('@energinet-datahub/eo/dashboard/shell').then(
            (esModule) => esModule.eoDashboardRoutes
          ),
      },
      {
        path: eoMeteringPointsRoutePath,
        canActivate: [EoScopeGuard],
        title: 'Metering points',
        loadChildren: () =>
          import('@energinet-datahub/eo/metering-points/shell').then(
            (esModule) => esModule.eoMeteringPointsRoutes
          ),
      },
      {
        path: eoTransferRoutePath,
        canActivate: [EoScopeGuard],
        title: 'Transfers',
        loadChildren: () =>
          import('@energinet-datahub/eo/transfers').then((esModule) => esModule.eoTransfersRoutes),
      },
      {
        path: eoClaimsRoutePath,
        canActivate: [EoScopeGuard],
        title: 'Claims',
        loadChildren: () =>
          import('@energinet-datahub/eo/claims/shell').then((esModule) => esModule.eoClaimsRoutes),
      },
      {
        path: eoPrivacyPolicyRoutePath,
        title: 'Privacy Policy',
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
