//#region License
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
//#endregion
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
  Routes,
  UrlSegment,
  UrlSegmentGroup,
} from '@angular/router';
import { inject } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';

import { ettActorSelfGuard, ettScopeGuard } from '@energinet-datahub/ett/auth/data-access';
import {
  ettActivityLogRoutePath,
  ettCertificatesRoutePath,
  ettClaimsRoutePath,
  ettConsentRoutePath,
  ettContactSupportRoutePath,
  ettDashboardRoutePath,
  ettHelpRoutePath,
  ettMeteringPointsRoutePath,
  ettOnboardingRoutePath,
  ettReportsRoutePath,
  ettTransferRoutePath,
} from '@energinet-datahub/ett/shared/utilities';
import {
  ContactSupportComponent,
  EttLoginComponent,
} from '@energinet-datahub/ett/auth/feature-login';

import { translations } from '@energinet-datahub/ett/translations';
import { ettLegalRoutes } from '@energinet-datahub/ett/legal/shell';
import { EttShellComponent } from './ett-shell.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'dashboard',
  },
  { path: 'login', component: EttLoginComponent },
  {
    path: 'callback',
    redirectTo: 'onboarding/signin-callback',
  },
  {
    path: ettOnboardingRoutePath,
    loadChildren: () =>
      import('@energinet-datahub/ett/onboarding/shell').then(
        (esModule) => esModule.ettOnbordingRoutes
      ),
  },
  {
    path: '',
    component: EttShellComponent,
    children: [
      ...ettLegalRoutes,
      {
        path: ettCertificatesRoutePath,
        canActivate: [ettScopeGuard],
        loadChildren: () =>
          import('@energinet-datahub/ett/certificates/shell').then(
            (esModule) => esModule.ettCertificatesRoutes
          ),
      },
      {
        path: ettContactSupportRoutePath,
        component: ContactSupportComponent,
        data: { skipGuard: true },
      },
      {
        path: ettDashboardRoutePath,
        canActivate: [ettScopeGuard],
        title: translations.dashboard.title,
        loadChildren: () =>
          import('@energinet-datahub/ett/dashboard/shell').then(
            (esModule) => esModule.ettDashboardRoutes
          ),
      },
      {
        path: ettMeteringPointsRoutePath,
        canActivate: [ettScopeGuard],
        title: translations.meteringPoints.title,
        loadChildren: () =>
          import('@energinet-datahub/ett/metering-points/shell').then(
            (esModule) => esModule.ettMeteringPointsRoutes
          ),
      },
      {
        path: ettActivityLogRoutePath,
        canActivate: [ettScopeGuard, ettActorSelfGuard],
        title: translations.activityLog.title,
        loadChildren: () =>
          import('@energinet-datahub/ett/activity-log/shell').then(
            (esModule) => esModule.ettActivityLogRoutes
          ),
      },
      {
        path: ettTransferRoutePath,
        canActivate: [ettScopeGuard],
        title: translations.transfers.title,
        loadChildren: () =>
          import('@energinet-datahub/ett/transfers').then(
            (esModule) => esModule.ettTransferAgreementsRoutes
          ),
      },
      {
        path: ettConsentRoutePath,
        canActivate: [ettScopeGuard, ettActorSelfGuard],
        title: translations.consent.title,
        loadChildren: () =>
          import('@energinet-datahub/ett/consent/shell').then(
            (esModule) => esModule.ettConsentRoutes
          ),
      },
      {
        path: ettClaimsRoutePath,
        canActivate: [ettScopeGuard, ettActorSelfGuard],
        title: translations.claims.title,
        loadChildren: () =>
          import('@energinet-datahub/ett/claims/shell').then(
            (esModule) => esModule.ettClaimsRoutes
          ),
      },
      {
        path: ettReportsRoutePath,
        canActivate: [ettScopeGuard, ettActorSelfGuard],
        title: translations.reports.title,
        loadChildren: () =>
          import('@energinet-datahub/ett/reports/shell').then(
            (esModule) => esModule.ettReportsRoutes
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
    const urlTree = router.parseUrl(url);
    const segments = urlTree.root.children.primary?.segments;

    if (segments && segments.length > 0) {
      segments.unshift(new UrlSegment(transloco.getActiveLang(), {}));
    } else {
      urlTree.root.children.primary = new UrlSegmentGroup([], {});
      urlTree.root.children.primary.segments = [new UrlSegment(transloco.getActiveLang(), {})];
    }
    router.navigateByUrl(urlTree);
    return false;
  }
  return true;
};

const setDefaultLang: CanActivateFn = (RouterStateSnapshot) => {
  const transloco = inject(TranslocoService);
  transloco.setActiveLang(RouterStateSnapshot.url.toString());
  return true;
};

export const ettShellRoutes: Routes = [
  {
    path: 'en',
    children: routes,
    canActivate: [setDefaultLang],
  },
  {
    path: 'da',
    children: routes,
    canActivate: [setDefaultLang],
  },
  // Redirect from the root to the default language
  { path: '', component: EttLoginComponent, canActivate: [LanguagePrefixGuard], pathMatch: 'full' },
  { path: '**', component: EttLoginComponent, canActivate: [LanguagePrefixGuard] },
];
