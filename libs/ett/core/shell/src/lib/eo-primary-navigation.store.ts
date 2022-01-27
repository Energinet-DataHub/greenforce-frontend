import { Injectable } from '@angular/core';
import { AuthHttp } from '@energinet-datahub/ett/auth/data-access-api';
import { ComponentStore } from '@ngrx/component-store';
import { exhaustMap, map } from 'rxjs';

// No internal state needed
// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface EoPrimaryNavigationState {}

@Injectable()
export class EoPrimaryNavigationStore extends ComponentStore<EoPrimaryNavigationState> {
  constructor(private authHttp: AuthHttp) {
    super({});
  }

  onLogOut = this.effect<void>((origin$) =>
    origin$.pipe(
      exhaustMap(() => this.authHttp.getLogout()),
      map((response) => response.success)
    )
  );
}
