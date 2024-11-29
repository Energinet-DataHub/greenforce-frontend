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
        'show-actions': true,
      },
    });
    return false;
  } else {
    return true;
  }
};
