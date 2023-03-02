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
import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateChild,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { AuthOidcQueryParameterName } from '@energinet-datahub/eo/auth/data-access-api';
import {
  AbsoluteUrlGenerator,
  eoLandingPageRelativeUrl,
} from '@energinet-datahub/eo/shared/utilities';

/**
 * Redirects to login page if authentication fails.
 */
@Injectable({
  providedIn: 'root',
})
export class EoAuthenticationGuard implements CanActivateChild {
  constructor(private router: Router, private urlGenerator: AbsoluteUrlGenerator) {}

  #loginUrl(routerState: RouterStateSnapshot): UrlTree {
    const loginUrl = this.router.createUrlTree([eoLandingPageRelativeUrl]);
    const absoluteReturnUrl = new URL(this.urlGenerator.fromUrl(routerState.url));

    if (absoluteReturnUrl.searchParams.has(AuthOidcQueryParameterName.Error)) {
      loginUrl.queryParams[AuthOidcQueryParameterName.Error] = absoluteReturnUrl.searchParams.get(
        AuthOidcQueryParameterName.Error
      );
      absoluteReturnUrl.searchParams.delete(AuthOidcQueryParameterName.Error);
    }

    if (absoluteReturnUrl.searchParams.has(AuthOidcQueryParameterName.ErrorCode)) {
      loginUrl.queryParams[AuthOidcQueryParameterName.ErrorCode] =
        absoluteReturnUrl.searchParams.get(AuthOidcQueryParameterName.ErrorCode);
      absoluteReturnUrl.searchParams.delete(AuthOidcQueryParameterName.ErrorCode);
    }

    absoluteReturnUrl.searchParams.delete(AuthOidcQueryParameterName.Success);

    loginUrl.queryParams[AuthOidcQueryParameterName.ReturnUrl] = absoluteReturnUrl.toString();

    return loginUrl;
  }

  canActivateChild(
    route: ActivatedRouteSnapshot,
    routerState: RouterStateSnapshot
  ): boolean | UrlTree {
    const authenticationSuccess = '1';
    const isAuthenticationCallback = route.queryParamMap.has(AuthOidcQueryParameterName.Success);
    const isAuthenticationSuccessful =
      route.queryParamMap.get(AuthOidcQueryParameterName.Success) === authenticationSuccess;

    const allowNavigation = !isAuthenticationCallback || isAuthenticationSuccessful;

    return allowNavigation ? true : this.#loginUrl(routerState);
  }
}
