import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { DhFeatureFlagsService } from '@energinet-datahub/dh/shared/feature-flags';

export const AuthGuard: CanActivateFn = (): boolean => {
  const router = inject(Router);
  const msalService = inject(MsalService);
  const featureFlagService = inject(DhFeatureFlagsService);

  if (!featureFlagService.isEnabled('new-login-flow')) return true;

  if (msalService.instance.getAllAccounts().length > 0) return true;

  router.navigate(['/login']);
  return false;
};
