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
import { CanActivateFn, Router } from '@angular/router';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { from, map, zipAll } from 'rxjs';
import { LoginProviderConfigIds } from './auth-config.module';

export const AuthenticationGuard: CanActivateFn = () => {
  const oidcSecurityService = inject(OidcSecurityService);
  const router = inject(Router);

  return from(LoginProviderConfigIds).pipe(
    map((configId) => oidcSecurityService.isAuthenticated(configId)),
    zipAll(),
    map((isAuthenticated) => {
      console.log('AuthGuard returned ', isAuthenticated);
      return isAuthenticated.includes(true) ? true : router.parseUrl('/signin');
    })
  );
};
