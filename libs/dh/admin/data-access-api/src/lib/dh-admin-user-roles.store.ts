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
import { filter, map, Observable, Subject, switchMap, tap } from 'rxjs';
import { ComponentStore, tapResponse } from '@ngrx/component-store';

import {
  ErrorState,
  LoadingState,
} from '@energinet-datahub/dh/shared/data-access-api';
import {
  MarketParticipantUserRoleHttp,
  UserRoleView,
} from '@energinet-datahub/dh/shared/domain';

interface DhUserManagementState {
  readonly userRoleView: UserRoleView | null;
  readonly requestState: LoadingState | ErrorState;
}

const initialState: DhUserManagementState = {
  userRoleView: null,
  requestState: LoadingState.INIT,
};

@Injectable()
export class DhAdminUserRolesStore extends ComponentStore<DhUserManagementState> {
  isInit$ = this.select((state) => state.requestState === LoadingState.INIT);
  isLoading$ = this.select(
    (state) => state.requestState === LoadingState.LOADING
  );
  hasGeneralError$ = new Subject<void>();

  userRoleView$: Observable<UserRoleView> = this.select(
    (state) => state.userRoleView
  ).pipe(
    filter((userRoleView) => !!userRoleView),
    map((userRoleView) => userRoleView as UserRoleView)
  );

  constructor(private httpClient: MarketParticipantUserRoleHttp) {
    super(initialState);
  }

  readonly getUserRoleView = this.effect((trigger$: Observable<string>) =>
    trigger$.pipe(
      tap(() => {
        this.resetState();
        this.setLoading(LoadingState.LOADING);
      }),
      switchMap((userId) => {
        return this.httpClient
          .v1MarketParticipantUserRoleGetUserRoleViewGet(userId)
          .pipe(
            tapResponse(
              (userRoleView) => {
                this.setLoading(LoadingState.LOADED);
                this.updateRoles(userRoleView);
              },
              () => {
                this.setLoading(LoadingState.LOADED);
                this.handleError();
              }
            )
          );
      })
    )
  );

  private updateRoles = this.updater(
    (
      state: DhUserManagementState,
      userRoleView: UserRoleView | null
    ): DhUserManagementState => ({
      ...state,
      userRoleView,
    })
  );

  private setLoading = this.updater(
    (state, loadingState: LoadingState): DhUserManagementState => ({
      ...state,
      requestState: loadingState,
    })
  );

  private handleError = () => {
    this.updateRoles(null);
    console.log('Error');
    this.hasGeneralError$.next();
  };

  private resetState = () => this.setState(initialState);
}
