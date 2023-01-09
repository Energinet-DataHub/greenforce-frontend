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
import { Observable, switchMap, tap, withLatestFrom } from 'rxjs';
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
  readonly pageNumber: number;
  readonly pageSize: number;
  readonly tablePageRequestState: LoadingState;
  readonly hasInitialPageLoaded: boolean;
}

const initialState: DhUserManagementState = {
  users: [],
  totalUserCount: 0,
  requestState: LoadingState.INIT,
  pageNumber: 1,
  pageSize: 50,
  tablePageRequestState: LoadingState.INIT,
  hasInitialPageLoaded: false,
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
  isTablePageLoading$ = this.select(
    (state) => state.tablePageRequestState === LoadingState.LOADING
  );

  users$ = this.select((state) => state.users);
  totalUserCount$ = this.select((state) => state.totalUserCount);

  // 1 needs to be substracted here because our endpoint's `pageNumber` param starts at `1`
  // whereas the paginator's `pageIndex` property starts at `0`
  paginatorPageIndex$ = this.select((state) => state.pageNumber - 1);
  pageSize$ = this.select((state) => state.pageSize);

  constructor(private httpClient: MarketParticipantUserOverviewHttp) {
    super(initialState);
  }

  readonly getUsers = this.effect((trigger$: Observable<void>) =>
    trigger$.pipe(
      withLatestFrom(this.state$),
      tap(([, state]) => {
        if (state.hasInitialPageLoaded === false) {
          this.setLoading(LoadingState.LOADING);
        }

        this.patchState({
          tablePageRequestState: LoadingState.LOADING,
          users: [],
        });
      }),
      switchMap(([, state]) =>
        this.httpClient
          .v1MarketParticipantUserOverviewGetUserOverviewGet(
            state.pageNumber,
            state.pageSize
          )
          .pipe(
            tapResponse(
              (response) => {
                this.setInitialPageLoaded(state);

                this.patchState({
                  tablePageRequestState: LoadingState.LOADED,
                });

                this.updateUsers(response);
              },
              () => {
                this.setInitialPageLoaded(state);

                this.patchState({
                  tablePageRequestState: LoadingState.LOADED,
                });

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
          // 1 needs to be added here because the paginator's `pageIndex` property starts at `0`
          // whereas our endpoint's `pageNumber` param starts at `1`
          this.patchState({ pageNumber: pageIndex + 1, pageSize });

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

  readonly reloadInitialPage = () => {
    this.patchState({ hasInitialPageLoaded: false });

    this.getUsers();
  };

  private setInitialPageLoaded(state: DhUserManagementState) {
    if (state.hasInitialPageLoaded === false) {
      this.patchState({
        requestState: LoadingState.LOADED,
        hasInitialPageLoaded: true,
      });
    }
  }

  ngrxOnStoreInit(): void {
    this.getUsers();
  }
}
