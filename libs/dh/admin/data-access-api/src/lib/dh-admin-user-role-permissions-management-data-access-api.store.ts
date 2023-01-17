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
import { Observable, switchMap, tap } from 'rxjs';
import { ComponentStore, tapResponse } from '@ngrx/component-store';

import {
  ErrorState,
  LoadingState,
} from '@energinet-datahub/dh/shared/data-access-api';
import {
  MarketParticipantUserRoleHttp,
  UserRoleWithPermissionsDto,
} from '@energinet-datahub/dh/shared/domain';

interface DhUserRoleWithPermissionsManagementState {
  readonly userRole: UserRoleWithPermissionsDto | null;
  readonly requestState: LoadingState | ErrorState;
}

const initialState: DhUserRoleWithPermissionsManagementState = {
  userRole: null,
  requestState: LoadingState.INIT,
};

@Injectable()
export class DhAdminUserRoleWithPermissionsManagementDataAccessApiStore extends ComponentStore<DhUserRoleWithPermissionsManagementState> {
  isInit$ = this.select((state) => state.requestState === LoadingState.INIT);
  isLoading$ = this.select(
    (state) => state.requestState === LoadingState.LOADING
  );
  hasGeneralError$ = this.select(
    (state) => state.requestState === ErrorState.GENERAL_ERROR
  );

  userRole$ = this.select((state) => state.userRole);

  constructor(private httpClientUserRole: MarketParticipantUserRoleHttp) {
    super(initialState);
  }

  readonly getUserRole = this.effect((userId$: Observable<string>) =>
    userId$.pipe(
      tap(() => {
        this.resetState();
        this.setLoading(LoadingState.LOADING);
      }),
      switchMap((userRoleId) =>
        this.httpClientUserRole
          .v1MarketParticipantUserRoleGetUserRoleWithPermissionsGet(userRoleId)
          .pipe(
            tapResponse(
              (response) => {
                this.updateUserRole(response);
                this.setLoading(LoadingState.LOADED);
              },
              () => {
                this.setLoading(LoadingState.LOADED);
                this.updateUserRole(null);
                this.handleError();
              }
            )
          )
      )
    )
  );

  private updateUserRole = this.updater(
    (
      state: DhUserRoleWithPermissionsManagementState,
      response: UserRoleWithPermissionsDto | null
    ): DhUserRoleWithPermissionsManagementState => ({
      ...state,
      userRole: response,
    })
  );

  private setLoading = this.updater(
    (
      state,
      loadingState: LoadingState
    ): DhUserRoleWithPermissionsManagementState => ({
      ...state,
      requestState: loadingState,
    })
  );

  private handleError = () => {
    this.updateUserRole(null);
    this.patchState({ requestState: ErrorState.GENERAL_ERROR });
  };

  private resetState = () => this.setState(initialState);
}
