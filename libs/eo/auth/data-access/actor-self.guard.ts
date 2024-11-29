import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { TranslocoService } from '@ngneat/transloco';

import { EoActorService } from './actor.service';

export const eoActorSelfGuard: CanActivateFn = async () => {
  const router = inject(Router);
  const transloco = inject(TranslocoService);
  const actorService = inject(EoActorService);

  // Redirect to dashboard if user is not acting as self
  if (!actorService.isSelf()) {
    router.navigate([transloco.getActiveLang(), 'dashboard']);
    return false;
  } else {
    return true;
  }
};
