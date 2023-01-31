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
import { Observable, of, switchMap, tap } from 'rxjs';
import {
  ComponentStore,
  OnStoreInit,
  tapResponse,
} from '@ngrx/component-store';

import {
  ErrorState,
  LoadingState,
} from '@energinet-datahub/dh/shared/data-access-api';
import {
  MarketParticipantUserOverviewHttp,
  UserOverviewItemDto,
  UserOverviewResultDto,
  UserStatus,
} from '@energinet-datahub/dh/shared/domain';

interface DhUserManagementState {
  readonly users: UserOverviewItemDto[];
  readonly totalUserCount: number;
  readonly usersRequestState: LoadingState | ErrorState;
  readonly pageNumber: number;
  readonly pageSize: number;
  readonly searchText: string | undefined;
  readonly statusFilter: UserStatus[];
  readonly actorIdFilter: string | undefined;
  readonly userRoleFilter: string[];
}

export type FetchUsersParams = Pick<
  DhUserManagementState,
  'pageSize' | 'pageNumber' | 'searchText' | 'statusFilter' | 'actorIdFilter' | 'userRoleFilter'
>;

const initialState: DhUserManagementState = {
  users: [],
  totalUserCount: 0,
  usersRequestState: LoadingState.INIT,
  pageNumber: 1,
  pageSize: 50,
  searchText: undefined,
  statusFilter: ['Active'],
  actorIdFilter: undefined,
  userRoleFilter: []
};

@Injectable()
export class DhAdminUserManagementDataAccessApiStore
  extends ComponentStore<DhUserManagementState>
  implements OnStoreInit
{
  readonly isInit$ = this.select(
    (state) => state.usersRequestState === LoadingState.INIT
  );
  readonly isLoading$ = this.select(
    (state) => state.usersRequestState === LoadingState.LOADING
  );
  readonly hasGeneralError$ = this.select(
    (state) => state.usersRequestState === ErrorState.GENERAL_ERROR
  );

  readonly initialStatusFilter$ = this.select((state) => state.statusFilter);

  readonly users$ = this.select((state) => state.users);
  readonly totalUserCount$ = this.select((state) => state.totalUserCount);

  // 1 needs to be substracted here because our endpoint's `pageNumber` param starts at `1`
  // whereas the paginator's `pageIndex` property starts at `0`
  readonly paginatorPageIndex$ = this.select((state) => state.pageNumber - 1);
  readonly pageSize$ = this.select((state) => state.pageSize);

  private readonly fetchUsersParams$: Observable<FetchUsersParams> =
    this.select(
      this.pageSize$,
      this.select((state) => state.pageNumber),
      this.select((state) => state.searchText),
      this.select((state) => state.statusFilter),
      this.select((state) => state.actorIdFilter),
      this.select((state) => state.userRoleFilter),
      (pageSize, pageNumber, searchText, statusFilter, actorIdFilter, userRoleFilter) => ({
        pageSize,
        pageNumber,
        searchText,
        statusFilter,
        actorIdFilter,
        userRoleFilter,
      }),
      { debounce: true }
    );

  constructor(private httpClient: MarketParticipantUserOverviewHttp) {
    super(initialState);
  }

  private readonly loadUsers = this.effect(
    (fetchUsersParams$: Observable<FetchUsersParams>) =>
      fetchUsersParams$.pipe(
        tap(() => {
          this.patchState({
            usersRequestState: LoadingState.LOADING,
            users: [],
          });
        }),
        switchMap((fetchUsersParams) =>
          this.getUsers(fetchUsersParams).pipe(
            tapResponse(
              (response) => {
                this.patchState({ usersRequestState: LoadingState.LOADED });

                this.updateUsers(response);
              },
              () => {
                this.updateUsers({ users: [], totalUserCount: 0 });

                this.patchState({
                  usersRequestState: ErrorState.GENERAL_ERROR,
                });
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

  private getUsers({
    pageNumber,
    pageSize,
    searchText,
    statusFilter,
    //actorIdFilter,
    //userRoleFilter
  }: FetchUsersParams) {
    if (!statusFilter || statusFilter.length == 0) {
      return of({ users: [], totalUserCount: 0 });
    }

    return this.httpClient.v1MarketParticipantUserOverviewGetUserOverviewGet(
      pageNumber,
      pageSize,
      searchText,
      statusFilter,
      //actorIdFilter,
      //userRoleFilter
    );
  }

  updateSearchText(searchText: string) {
    const searchTextToSave = searchText === '' ? undefined : searchText;

    this.patchState({ searchText: searchTextToSave });
  }

  updateStatusFilter(userStatus: UserStatus[]) {
    this.patchState({ statusFilter: userStatus });
  }

  updateActorFilter(actorId: string | undefined) {
    this.patchState({ actorIdFilter: actorId });
  }

  updateUserRoleFilter(userRole: string[]) {
    console.log(userRole);
    this.patchState({ userRoleFilter: userRole });
  }

  readonly reloadUsers = () => {
    this.loadUsers(this.fetchUsersParams$);
  };

  ngrxOnStoreInit() {
    this.loadUsers(this.fetchUsersParams$);
  }
}
