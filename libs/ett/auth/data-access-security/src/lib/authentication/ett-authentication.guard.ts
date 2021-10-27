/**
 * @license
 * Copyright 2021 Energinet DataHub A/S
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
  UrlTree,
} from '@angular/router';
import { ettAuthRoutePath } from '@energinet-datahub/ett/auth/feature-shell';

/**
 * Redirects to login page if authentication fails.
 */
@Injectable({
  providedIn: 'root',
})
export class EttAuthenticationGuard implements CanActivateChild {
  private loginUrl(route: ActivatedRouteSnapshot): UrlTree {
    const loginUrl = this.router.createUrlTree([ettAuthRoutePath]);

    loginUrl.queryParams = {
      error: route.queryParamMap.get('error') ?? '',
      error_code: route.queryParamMap.get('error_code'),
      return_url: route.url,
    };

    return loginUrl;
  }

  constructor(private router: Router) {}

  canActivateChild(route: ActivatedRouteSnapshot): boolean | UrlTree {
    const authenticationSuccessQueryParameterName = 'success';
    const authenticationSuccess = '1';
    const isAuthenticationCallback = route.queryParamMap.has(
      authenticationSuccessQueryParameterName
    );
    const isAuthenticationSuccessful =
      route.queryParamMap.get(authenticationSuccessQueryParameterName) ===
      authenticationSuccess;

    const allowNavigation =
      !isAuthenticationCallback || isAuthenticationSuccessful;

    return allowNavigation ? true : this.loginUrl(route);
  }
}
