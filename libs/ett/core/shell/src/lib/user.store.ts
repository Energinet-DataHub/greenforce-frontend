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
import { ApplicationInitStatus, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  AuthOidcHttp,
  AuthProfile,
} from '@energinet-datahub/ett/auth/data-access-api';
import { ettAuthRoutePath } from '@energinet-datahub/ett/auth/routing-security';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { exhaustMap, from, Observable, switchMapTo, tap } from 'rxjs';

interface UserState {
  readonly error: boolean;
  readonly loading: boolean;
  readonly profile: AuthProfile | null;
}

@Injectable()
export class UserStore extends ComponentStore<UserState> {
  #applicationInitialize$: Observable<void>;

  hasError$: Observable<boolean> = this.select((state) => state.error);
  isLoading: Observable<boolean> = this.select((state) => state.loading);
  profile$: Observable<AuthProfile | null> = this.select(
    (state) => state.profile
  );
  isAuthenticated$: Observable<boolean> = this.select(
    this.profile$,
    (profile) => profile !== null
  );

  constructor(
    private authOidc: AuthOidcHttp,
    applicationInit: ApplicationInitStatus,
    private router: Router
  ) {
    super(initialState);
    this.#applicationInitialize$ = from(applicationInit.donePromise);

    this.loadUserProfile();
  }

  loadUserProfile = this.effect<void>((origin$) =>
    origin$.pipe(
      switchMapTo(this.#applicationInitialize$),
      tap(() => this.patchState({ loading: true })),
      exhaustMap(() =>
        this.authOidc.getProfile().pipe(
          tapResponse(
            (profile) =>
              this.setState({ error: false, profile, loading: false }),
            () => this.setState({ error: true, profile: null, loading: false })
          )
        )
      )
    )
  );

  logOut = this.effect<void>((origin$) =>
    origin$.pipe(
      exhaustMap(() =>
        this.authOidc.logout().pipe(
          exhaustMap(() => this.router.navigate([ettAuthRoutePath])),
          tapResponse(
            () =>
              this.setState({ error: false, profile: null, loading: false }),
            () => this.patchState({ error: true, loading: false })
          )
        )
      )
    )
  );
}

const initialState: UserState = {
  error: false,
  loading: true,
  profile: null,
};
