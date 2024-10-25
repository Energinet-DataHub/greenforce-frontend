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
import { Router, ActivatedRouteSnapshot, CanActivateFn } from '@angular/router';
import { TranslocoService } from '@ngneat/transloco';

import { EoAuthService } from './auth.service';

export const eoScopeGuard: CanActivateFn = async (route: ActivatedRouteSnapshot) => {
  const router = inject(Router);
  const authService = inject(EoAuthService);
  const transloco = inject(TranslocoService);

  // Skip authentication for specific routes
  if (route.data && route.data['skipGuard']) {
    return true;
  }

  // Save the current route to redirect to after login
  const path = transloco.getActiveLang() + '/' + route.url.join('/');
  const queryParams = new URLSearchParams(route.queryParams).toString();
  const redirectUrl = queryParams ? `${path}?${queryParams}` : path;

  // Redirect to login if user is not authenticated
  if (!(await authService.isLoggedIn())) {
    authService.login({ redirectUrl });
    return false;
  }

  // Redirect to terms if user has not accepted them
  if (!authService.user()?.profile.tos_accepted) {
    router.navigate([transloco.getActiveLang(), 'terms'], {
      queryParams: { redirectUrl },
      state: {
        'show-actions': true
      }
    });
    return false;
  } else {
    return true;
  }
};
