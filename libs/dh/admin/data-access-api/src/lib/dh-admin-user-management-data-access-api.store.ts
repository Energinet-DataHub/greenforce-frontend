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
import { Observable, switchMap, take, tap } from 'rxjs';
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
  readonly usersRequestState: LoadingState | ErrorState;
  readonly pageNumber: number;
  readonly pageSize: number;
}

const initialState: DhUserManagementState = {
  users: [],
  totalUserCount: 0,
  usersRequestState: LoadingState.INIT,
  pageNumber: 1,
  pageSize: 50,
};

@Injectable()
export class DhAdminUserManagementDataAccessApiStore extends ComponentStore<DhUserManagementState> {
  isInit$ = this.select(
    (state) => state.usersRequestState === LoadingState.INIT
  );
  isLoading$ = this.select(
    (state) => state.usersRequestState === LoadingState.LOADING
  );
  hasGeneralError$ = this.select(
    (state) => state.usersRequestState === ErrorState.GENERAL_ERROR
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

  readonly loadUsers = this.effect((trigger$: Observable<void>) =>
    trigger$.pipe(
      tap(() => {
        this.patchState({ usersRequestState: LoadingState.LOADING, users: [] });
      }),
      switchMap(() =>
        this.getUsers().pipe(
          tapResponse(
            (response) => {
              this.patchState({ usersRequestState: LoadingState.LOADED });

              this.updateUsers(response);
            },
            () => {
              this.updateUsers({ users: [], totalUserCount: 0 });

              this.patchState({ usersRequestState: ErrorState.GENERAL_ERROR });
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

          this.loadUsers();
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

  private getUsers() {
    return this.state$.pipe(
      take(1),
      switchMap(({ pageNumber, pageSize }) =>
        this.httpClient.v1MarketParticipantUserOverviewGetUserOverviewGet(
          pageNumber,
          pageSize
        )
      )
    );
  }

  readonly reloadUsers = () => {
    this.loadUsers();
  };

  ngrxOnStoreInit(): void {
    this.loadUsers();
  }
}
