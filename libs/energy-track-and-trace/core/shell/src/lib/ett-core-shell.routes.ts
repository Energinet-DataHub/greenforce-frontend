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
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
  Routes,
} from '@angular/router';
import { EttScopeGuard } from '@energinet-datahub/ett/auth/routing-security';
import {
  ettCertificatesRoutePath,
  ettClaimsRoutePath,
  ettDashboardRoutePath,
  ettHelpRoutePath,
  ettMeteringPointsRoutePath,
  ettPrivacyPolicyRoutePath,
  ettTransferRoutePath,
  ettActivityLogRoutePath,
} from '@energinet-datahub/ett/shared/utilities';
import { EttLoginComponent } from './ett-login.component';
import { EttShellComponent } from './ett-shell.component';
import { translations } from '@energinet-datahub/ett/translations';
import { inject } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'dashboard',
  },
  { path: 'login', component: EttLoginComponent },
  {
    path: 'terms',
    title: 'Terms',
    loadChildren: () =>
      import('@energinet-datahub/ett/terms').then((esModule) => esModule.ettTermsRoutes),
  },
  {
    path: '',
    component: EttShellComponent,
    children: [
      {
        path: ettCertificatesRoutePath,
        canActivate: [EttScopeGuard],
        loadChildren: () =>
          import('@energinet-datahub/ett/certificates/shell').then(
            (esModule) => esModule.ettCertificatesRoutes
          ),
      },
      {
        path: ettDashboardRoutePath,
        canActivate: [EttScopeGuard],
        title: translations.dashboard.title,
        loadChildren: () =>
          import('@energinet-datahub/ett/dashboard/shell').then(
            (esModule) => esModule.ettDashboardRoutes
          ),
      },
      {
        path: ettMeteringPointsRoutePath,
        canActivate: [EttScopeGuard],
        title: translations.meteringPoints.title,
        loadChildren: () =>
          import('@energinet-datahub/ett/metering-points/shell').then(
            (esModule) => esModule.ettMeteringPointsRoutes
          ),
      },
      {
        path: ettActivityLogRoutePath,
        canActivate: [EttScopeGuard],
        title: translations.activityLog.title,
        loadChildren: () =>
          import('@energinet-datahub/ett/activity-log/shell').then(
            (esModule) => esModule.ettActivityLogRoutes
          ),
      },
      {
        path: ettTransferRoutePath,
        canActivate: [EttScopeGuard],
        title: translations.transfers.title,
        loadChildren: () =>
          import('@energinet-datahub/ett/transfers').then((esModule) => esModule.ettTransfersRoutes),
      },
      {
        path: ettClaimsRoutePath,
        canActivate: [EttScopeGuard],
        title: translations.claims.title,
        loadChildren: () =>
          import('@energinet-datahub/ett/claims/shell').then((esModule) => esModule.ettClaimsRoutes),
      },
      {
        path: ettPrivacyPolicyRoutePath,
        title: translations.privacyPolicy.title,
        loadChildren: () =>
          import('@energinet-datahub/ett/privacy-policy/shell').then(
            (esModule) => esModule.ettPrivacyPolicyRoutes
          ),
      },
      {
        path: ettHelpRoutePath,
        loadChildren: () =>
          import('@energinet-datahub/ett/help/shell').then((esModule) => esModule.ettHelpRoutes),
      },
    ],
  },
  { path: '**', redirectTo: 'dashboard' }, // Catch-all that can be used for 404 redirects in the future
];

const LanguagePrefixGuard: CanActivateFn = (
  _: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const transloco = inject(TranslocoService);
  const router = inject(Router);

  const url: string = state.url;
  const hasLanguagePrefix = url.startsWith('/en') || url.startsWith('/da');

  if (!hasLanguagePrefix) {
    router.navigate([`/${transloco.getActiveLang()}${url}`]);
    return false;
  }
  return true;
};

export const ettShellRoutes: Routes = [
  {
    path: 'en',
    children: routes,
  },
  {
    path: 'da',
    children: routes,
  },
  // Redirect from the root to the default language
  { path: '', component: EttLoginComponent, canActivate: [LanguagePrefixGuard], pathMatch: 'full' },
  { path: '**', component: EttLoginComponent, canActivate: [LanguagePrefixGuard] },
];
