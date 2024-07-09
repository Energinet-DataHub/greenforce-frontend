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
import { inject } from '@angular/core';
import { CanActivateFn, Route } from '@angular/router';
import { TranslocoService } from '@ngneat/transloco';

const setDefaultLang: CanActivateFn = (RouterStateSnapshot) => {
  const transloco = inject(TranslocoService);
  transloco.setActiveLang(RouterStateSnapshot.url.toString());
  return true;
};

export const appRoutes: Route[] = [
  {
    path: 'en',
    loadChildren: () =>
      import('@energinet-datahub/eo/landing-page/shell').then(
        (esModule) => esModule.eoLandingPageRoutes
      ),
    canActivate: [setDefaultLang],
  },
  {
    path: 'da',
    loadChildren: () =>
      import('@energinet-datahub/eo/landing-page/shell').then(
        (esModule) => esModule.eoLandingPageRoutes
      ),
    canActivate: [setDefaultLang],
  },
  // Redirect from the root to the default language
  { path: '', redirectTo: getDefaultLanguage(), pathMatch: 'full' },
  { path: '**', redirectTo: '/' },
];

function getDefaultLanguage(): string {
  try {
    const lang = navigator.language.split('-')[0];
    return lang === 'da' ? 'da' : 'en';
  } catch (error) {
    return 'en';
  }
}
