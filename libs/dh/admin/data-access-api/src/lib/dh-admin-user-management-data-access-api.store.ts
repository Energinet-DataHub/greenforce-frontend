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
import { delay, Observable, switchMap, tap, withLatestFrom } from 'rxjs';
import { ComponentStore, tapResponse } from '@ngrx/component-store';

import {
  ErrorState,
  LoadingState,
} from '@energinet-datahub/dh/shared/data-access-api';
import {
  MarketParticipantUserOverviewHttp,
  UserOverviewItemDto,
  UserOverviewResultDto,
} from '@energinet-datahub/dh/shared/domain';

interface DhUserManagementState {
  readonly users: UserOverviewItemDto[];
  readonly totalUserCount: number;
  readonly requestState: LoadingState | ErrorState;
  readonly pageIndex: number;
  readonly pageSize: number;
}

const initialState: DhUserManagementState = {
  users: [],
  totalUserCount: 0,
  requestState: LoadingState.INIT,
  pageIndex: 1,
  pageSize: 50,
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

  users$ = this.select((state) => state.users);
  totalUserCount$ = this.select((state) => state.totalUserCount);

  pageIndex$ = this.select((state) => state.pageIndex);
  pageSize$ = this.select((state) => state.pageSize);

  constructor(private httpClient: MarketParticipantUserOverviewHttp) {
    super(initialState);
  }

  readonly getUsers = this.effect((trigger$: Observable<void>) =>
    trigger$.pipe(
      withLatestFrom(this.state$),
      tap(() => {
        this.setLoading(LoadingState.LOADING);
      }),
      delay(300),
      switchMap(([, state]) =>
        this.httpClient
          .v1MarketParticipantUserOverviewGet(state.pageIndex, state.pageSize)
          .pipe(
            tapResponse(
              (response) => {
                this.setLoading(LoadingState.LOADED);

                this.updateUsers(response);
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

  readonly updatePageMetadata = this.effect(
    (trigger$: Observable<{ pageIndex: number; pageSize: number }>) =>
      trigger$.pipe(
        tap(({ pageIndex, pageSize }) => {
          this.patchState({ pageIndex: pageIndex, pageSize });

          this.getUsers();
        })
      )
  );

  private updateUsers = this.updater(
    (
      state: DhUserManagementState,
      response: UserOverviewResultDto
    ): DhUserManagementState => ({
      ...state,
      users: response.users,
      totalUserCount: response.totalUserCount,
    })
  );

  private setLoading = this.updater(
    (state, loadingState: LoadingState): DhUserManagementState => ({
      ...state,
      requestState: loadingState,
    })
  );

  private handleError = () => {
    this.updateUsers({ users: [], totalUserCount: 0 });

    this.patchState({ requestState: ErrorState.GENERAL_ERROR });
  };

  private resetState = () => this.setState(initialState);

  ngrxOnStoreInit(): void {
    this.getUsers();
  }
}
