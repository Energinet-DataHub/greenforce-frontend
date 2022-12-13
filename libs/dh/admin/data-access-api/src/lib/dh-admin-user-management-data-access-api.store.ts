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
import { filter, map, Observable, switchMap, tap } from 'rxjs';
import { ComponentStore, tapResponse } from '@ngrx/component-store';

import {
  ErrorState,
  LoadingState,
} from '@energinet-datahub/dh/shared/data-access-api';
import {
  MarketParticipantUserOverviewHttp,
  UserOverviewItemDto,
} from '@energinet-datahub/dh/shared/domain';

interface DhUserManagementState {
  readonly users: UserOverviewItemDto[] | null;
  readonly requestState: LoadingState | ErrorState;
}

const initialState: DhUserManagementState = {
  users: null,
  requestState: LoadingState.INIT,
};

@Injectable()
export class DhAdminUserManagementDataAccessApiStore extends ComponentStore<DhUserManagementState> {
  isInit$ = this.select((state) => state.requestState === LoadingState.INIT);
  isLoading$ = this.select(
    (state) => state.requestState === LoadingState.LOADING
  );
  hasGeneralError$ = this.select(
    (state) => state.requestState === ErrorState.GENERAL_ERROR
  );

  users$: Observable<UserOverviewItemDto[]> = this.select(
    (state) => state.users
  ).pipe(
    filter((users) => !!users),
    map((users) => users as UserOverviewItemDto[])
  );

  constructor(private httpClient: MarketParticipantUserOverviewHttp) {
    super(initialState);
  }

  readonly getUsers = this.effect((trigger$: Observable<void>) =>
    trigger$.pipe(
      tap(() => {
        this.resetState();

        this.setLoading(LoadingState.LOADING);
      }),
      switchMap(() =>
        this.httpClient.v1MarketParticipantUserOverviewGet().pipe(
          tapResponse(
            (users) => {
              this.setLoading(LoadingState.LOADED);

              this.updateUsers(users);
            },
            () => {
              this.setLoading(LoadingState.LOADED);

              this.handleError();
            }
          )
        )
      )
    )
  );

  private updateUsers = this.updater(
    (
      state: DhUserManagementState,
      users: UserOverviewItemDto[] | null
    ): DhUserManagementState => ({
      ...state,
      users,
    })
  );

  private setLoading = this.updater(
    (state, loadingState: LoadingState): DhUserManagementState => ({
      ...state,
      requestState: loadingState,
    })
  );

  private handleError = () => {
    this.updateUsers(null);

    this.patchState({ requestState: ErrorState.GENERAL_ERROR });
  };

  private resetState = () => this.setState(initialState);

  ngrxOnStoreInit(): void {
    this.getUsers();
  }
}
