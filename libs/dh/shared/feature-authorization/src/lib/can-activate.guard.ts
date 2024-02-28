import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { MsalService } from '@azure/msal-angular';

export const AuthGuard: CanActivateFn = (): boolean => {
  const router = inject(Router);
  const msalService = inject(MsalService);

  if (msalService.instance.getAllAccounts().length > 0) return true;

  router.navigate(['/login']);
  return false;
};
