import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { eoLandingPageRelativeUrl } from '@energinet-datahub/eo/landing-page/routing';
import { AuthHttp } from '@energinet-datahub/ett/auth/data-access-api';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { exhaustMap, mergeMap, of, throwError } from 'rxjs';

// No internal state needed
// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface EoPrimaryNavigationState {}

@Injectable()
export class EoPrimaryNavigationStore extends ComponentStore<EoPrimaryNavigationState> {
  constructor(private authHttp: AuthHttp, private router: Router) {
    super({});
  }

  onLogOut = this.effect<void>((origin$) =>
    origin$.pipe(
      exhaustMap(() =>
        this.authHttp.getLogout().pipe(
          mergeMap((response) =>
            response.success === true
              ? of(undefined)
              : throwError(() => new Error('Log out failed'))
          ),
          tapResponse(
            () => this.router.navigateByUrl(eoLandingPageRelativeUrl),
            (error) => {
              // We only support the happy path for now
              throw error;
            }
          )
        )
      )
    )
  );
}
