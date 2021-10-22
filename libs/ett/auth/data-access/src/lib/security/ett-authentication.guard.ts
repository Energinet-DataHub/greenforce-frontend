import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, UrlTree } from '@angular/router';
import { ettAuthRoutePath } from '@energinet-datahub/ett/auth/feature-shell';

/**
 * Redirects to login page if authentication fails.
 */
@Injectable({
  providedIn: 'root',
})
export class EttAuthenticationGuard implements CanActivate {
  private loginUrl(route: ActivatedRouteSnapshot): UrlTree {
    const loginUrl = this.router.createUrlTree([ettAuthRoutePath]);

    loginUrl.queryParams = {
      error: route.queryParamMap.get('error'),
      error_text: route.queryParamMap.get('error_text'),
      returnUrl: this.router.url,
    };

    return loginUrl;
  }

  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean | UrlTree {
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
