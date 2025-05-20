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

import { eoActorSelfGuard, eoScopeGuard } from '@energinet-datahub/eo/auth/data-access';
import {
  eoActivityLogRoutePath,
  eoCertificatesRoutePath,
  eoClaimsRoutePath,
  eoConsentRoutePath,
  eoContactSupportRoutePath,
  eoDashboardRoutePath,
  eoHelpRoutePath,
  eoMeteringPointsRoutePath,
  eoOnboardingRoutePath,
  eoReportsRoutePath,
  eoTransferRoutePath,
} from '@energinet-datahub/eo/shared/utilities';
import {
  ContactSupportComponent,
  EoLoginComponent,
} from '@energinet-datahub/eo/auth/feature-login';

import { translations } from '@energinet-datahub/eo/translations';
import { eoLegalRoutes } from '@energinet-datahub/eo/legal/shell';
import { EoShellComponent } from './eo-shell.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'dashboard',
  },
  { path: 'login', component: EoLoginComponent },
  {
    path: 'callback',
    redirectTo: 'onboarding/signin-callback',
  },
  {
    path: eoOnboardingRoutePath,
    loadChildren: () =>
      import('@energinet-datahub/eo/onboarding/shell').then(
        (esModule) => esModule.eoOnbordingRoutes
      ),
  },
  {
    path: '',
    component: EoShellComponent,
    children: [
      ...eoLegalRoutes,
      {
        path: eoCertificatesRoutePath,
        canActivate: [eoScopeGuard],
        loadChildren: () =>
          import('@energinet-datahub/eo/certificates/shell').then(
            (esModule) => esModule.eoCertificatesRoutes
          ),
      },
      {
        path: eoContactSupportRoutePath,
        component: ContactSupportComponent,
        data: { skipGuard: true },
      },
      {
        path: eoDashboardRoutePath,
        canActivate: [eoScopeGuard],
        title: translations.dashboard.title,
        loadChildren: () =>
          import('@energinet-datahub/eo/dashboard/shell').then(
            (esModule) => esModule.eoDashboardRoutes
          ),
      },
      {
        path: eoMeteringPointsRoutePath,
        canActivate: [eoScopeGuard],
        title: translations.meteringPoints.title,
        loadChildren: () =>
          import('@energinet-datahub/eo/metering-points/shell').then(
            (esModule) => esModule.eoMeteringPointsRoutes
          ),
      },
      {
        path: eoActivityLogRoutePath,
        canActivate: [eoScopeGuard, eoActorSelfGuard],
        title: translations.activityLog.title,
        loadChildren: () =>
          import('@energinet-datahub/eo/activity-log/shell').then(
            (esModule) => esModule.eoActivityLogRoutes
          ),
      },
      {
        path: eoTransferRoutePath,
        canActivate: [eoScopeGuard],
        title: translations.transfers.title,
        loadChildren: () =>
          import('@energinet-datahub/eo/transfers').then(
            (esModule) => esModule.eoTransferAgreementsRoutes
          ),
      },
      {
        path: eoConsentRoutePath,
        canActivate: [eoScopeGuard, eoActorSelfGuard],
        title: translations.consent.title,
        loadChildren: () =>
          import('@energinet-datahub/eo/consent/shell').then(
            (esModule) => esModule.eoConsentRoutes
          ),
      },
      {
        path: eoClaimsRoutePath,
        canActivate: [eoScopeGuard, eoActorSelfGuard],
        title: translations.claims.title,
        loadChildren: () =>
          import('@energinet-datahub/eo/claims/shell').then((esModule) => esModule.eoClaimsRoutes),
      },
      {
        path: eoReportsRoutePath,
        canActivate: [eoScopeGuard, eoActorSelfGuard],
        title: 'TODO MASEP: Reports',
        loadChildren: () =>
          import('@energinet-datahub/eo/reports/shell').then(
            (esModule) => esModule.eoReportsRoutes
          ),
      },
      {
        path: eoHelpRoutePath,
        loadChildren: () =>
          import('@energinet-datahub/eo/help/shell').then((esModule) => esModule.eoHelpRoutes),
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

export const eoShellRoutes: Routes = [
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
  { path: '', component: EoLoginComponent, canActivate: [LanguagePrefixGuard], pathMatch: 'full' },
  { path: '**', component: EoLoginComponent, canActivate: [LanguagePrefixGuard] },
];
