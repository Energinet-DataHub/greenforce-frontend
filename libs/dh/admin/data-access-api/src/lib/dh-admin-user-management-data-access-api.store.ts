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
import { Observable, of, switchMap, take, tap } from 'rxjs';
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

export interface DhUserManagementUsersFilter {
  userStatus: ('Active' | 'Inactive')[];
}

interface DhUserManagementState {
  readonly users: UserOverviewItemDto[];
  readonly totalUserCount: number;
  readonly usersRequestState: LoadingState | ErrorState;
  readonly pageNumber: number;
  readonly pageSize: number;
  readonly searchText: string | undefined;
}

type FetchUsersParams = Pick<
  DhUserManagementState,
  'pageSize' | 'pageNumber' | 'searchText'
>;

const initialState: DhUserManagementState = {
  users: [],
  totalUserCount: 0,
  usersRequestState: LoadingState.INIT,
  pageNumber: 1,
  pageSize: 50,
  searchText: undefined,
};

@Injectable()
export class DhAdminUserManagementDataAccessApiStore extends ComponentStore<DhUserManagementState> {
  readonly isInit$ = this.select(
    (state) => state.usersRequestState === LoadingState.INIT
  );
  readonly isLoading$ = this.select(
    (state) => state.usersRequestState === LoadingState.LOADING
  );
  readonly hasGeneralError$ = this.select(
    (state) => state.usersRequestState === ErrorState.GENERAL_ERROR
  );

  readonly users$ = this.select((state) => state.users);
  readonly totalUserCount$ = this.select((state) => state.totalUserCount);

  // 1 needs to be substracted here because our endpoint's `pageNumber` param starts at `1`
  // whereas the paginator's `pageIndex` property starts at `0`
  readonly paginatorPageIndex$ = this.select((state) => state.pageNumber - 1);
  readonly pageSize$ = this.select((state) => state.pageSize);

  filter: DhUserManagementUsersFilter = { userStatus: ['Active'] };

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

  readonly updatePageMetadata = this.updater(
    (
      state: DhUserManagementState,
      pageMetadata: { pageIndex: number; pageSize: number }
    ): DhUserManagementState => ({
      ...state,
      pageSize: pageMetadata.pageSize,
      // 1 needs to be added here because the paginator's `pageIndex` property starts at `0`
      // whereas our endpoint's `pageNumber` param starts at `1`
      pageNumber: pageMetadata.pageIndex + 1,
    })
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
      switchMap(({ pageNumber, pageSize }) => {
        const userStatus = this.filter.userStatus;
        if (userStatus?.length > 0) {
          return this.httpClient.v1MarketParticipantUserOverviewGetUserOverviewGet(
            pageNumber,
            pageSize,
            undefined,
            userStatus.length === 2
              ? undefined // If both are selected, no filter is applied.
              : userStatus[0] === 'Active'
              ? true
              : false
          );
        }

        return of({ users: [], totalUserCount: 0 });
      })
    );
  }

  updateSearchText(searchText: string) {
    const searchTextToSave = searchText === '' ? undefined : searchText;

    this.patchState({ searchText: searchTextToSave });
  }

  readonly reloadUsers = () => {
    this.loadUsers(this.fetchUsersParams$);
  };

  ngrxOnStoreInit() {
    this.loadUsers(this.fetchUsersParams$);
  }
}
