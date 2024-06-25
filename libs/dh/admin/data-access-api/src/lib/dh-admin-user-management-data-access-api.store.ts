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
import { Injectable, inject } from '@angular/core';

import { Apollo } from 'apollo-angular';
import { Observable, map, of, switchMap, take, tap } from 'rxjs';
import { ComponentStore, OnStoreInit } from '@ngrx/component-store';

import { ErrorState, LoadingState } from '@energinet-datahub/dh/shared/data-access-api';
import {
  MarketParticipantSortDirctionType,
  UserOverviewSearchDocument,
  UserOverviewSortProperty,
  UserStatus,
} from '@energinet-datahub/dh/shared/domain/graphql';

import type { ResultOf } from '@graphql-typed-document-node/core';

export type UserOverviewItem = ResultOf<
  typeof UserOverviewSearchDocument
>['userOverviewSearch']['users'][0];

type UserOverviewResponse = ResultOf<typeof UserOverviewSearchDocument>['userOverviewSearch'];

export type FetchUsersParams = Pick<
  DhUserManagementState,
  | 'pageSize'
  | 'pageNumber'
  | 'sortProperty'
  | 'direction'
  | 'searchText'
  | 'statusFilter'
  | 'actorIdFilter'
  | 'userRoleFilter'
>;

export type DhUserManagementFilters = {
  status: DhUserManagementState['statusFilter'];
  actorId: string | null;
  userRoleIds: string[] | null;
};

type UserResponseType = {
  loading: boolean;
  error: boolean;
  data: UserOverviewResponse | null;
};

interface DhUserManagementState {
  readonly users: UserOverviewItem[];
  readonly totalUserCount: number;
  readonly usersRequestState: LoadingState | ErrorState;
  readonly pageNumber: number;
  readonly pageSize: number;
  readonly sortProperty: UserOverviewSortProperty;
  readonly direction: MarketParticipantSortDirctionType;
  readonly searchText: string | undefined;
  readonly statusFilter: UserStatus[] | null;
  readonly actorIdFilter: string | undefined;
  readonly userRoleFilter: string[];
}

export const initialState: DhUserManagementState = {
  users: [],
  totalUserCount: 0,
  usersRequestState: LoadingState.INIT,
  pageNumber: 1,
  pageSize: 50,
  sortProperty: UserOverviewSortProperty.Email,
  direction: MarketParticipantSortDirctionType.Asc,
  searchText: undefined,
  statusFilter: [UserStatus.Active, UserStatus.Invited, UserStatus.InviteExpired],
  actorIdFilter: undefined,
  userRoleFilter: [],
};

@Injectable()
export class DhAdminUserManagementDataAccessApiStore
  extends ComponentStore<DhUserManagementState>
  implements OnStoreInit
{
  readonly apollo = inject(Apollo);
  readonly isInit$ = this.select((state) => state.usersRequestState === LoadingState.INIT);
  readonly isLoading$ = this.select((state) => state.usersRequestState === LoadingState.LOADING);
  readonly hasGeneralError$ = this.select(
    (state) => state.usersRequestState === ErrorState.GENERAL_ERROR
  );

  readonly initialStatusValue$ = this.select((state) => state.statusFilter).pipe(take(1));

  readonly users$ = this.select((state) => state.users);
  readonly totalUserCount$ = this.select((state) => state.totalUserCount);

  // 1 needs to be substracted here because our endpoint's `pageNumber` param starts at `1`
  // whereas the paginator's `pageIndex` property starts at `0`
  readonly paginatorPageIndex$ = this.select((state) => state.pageNumber - 1);
  readonly pageSize$ = this.select((state) => state.pageSize);

  private readonly fetchUsersParams$: Observable<FetchUsersParams> = this.select(
    {
      pageSize: this.pageSize$,
      pageNumber: this.select((state) => state.pageNumber),
      sortProperty: this.select((state) => state.sortProperty),
      direction: this.select((state) => state.direction),
      searchText: this.select((state) => state.searchText),
      statusFilter: this.select((state) => state.statusFilter),
      actorIdFilter: this.select((state) => state.actorIdFilter),
      userRoleFilter: this.select((state) => state.userRoleFilter),
    },
    { debounce: true }
  );

  constructor() {
    super(initialState);
  }

  private readonly loadUsers = this.effect((fetchUsersParams$: Observable<FetchUsersParams>) =>
    fetchUsersParams$.pipe(
      tap(() => {
        this.patchState({
          usersRequestState: LoadingState.LOADING,
          users: [],
        });
      }),
      switchMap((fetchUsersParams) => {
        return this.getUsers(fetchUsersParams).pipe(
          tap((response) => {
            if (response.loading) {
              this.patchState({ usersRequestState: LoadingState.LOADING });
            } else if (response.error) {
              this.patchState({ usersRequestState: ErrorState.GENERAL_ERROR });
            } else {
              this.patchState({ usersRequestState: LoadingState.LOADED });
              if (response.data?.users && response.data?.totalUserCount) {
                this.updateUsers(response.data);
              }
            }
          })
        );
      })
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
    (state: DhUserManagementState, response: UserOverviewResponse): DhUserManagementState => ({
      ...state,
      users: response.users,
      totalUserCount: response.totalUserCount,
    })
  );

  private getUsers({
    pageNumber,
    pageSize,
    sortProperty,
    direction,
    searchText,
    statusFilter,
    actorIdFilter,
    userRoleFilter,
  }: FetchUsersParams): Observable<UserResponseType> {
    if (!statusFilter || statusFilter.length == 0) {
      return of({ data: null, loading: false, error: false });
    }

    return this.apollo
      .query({
        query: UserOverviewSearchDocument,
        variables: {
          pageNumber,
          pageSize: pageSize,
          sortProperty,
          sortDirection: direction,
          actorId: actorIdFilter,
          userRoleIds: userRoleFilter,
          searchText,
          userStatus: statusFilter,
        },
      })
      .pipe(
        map((response) => ({
          loading: response.loading,
          error: Boolean(response.error) || (response.errors?.length ?? 0) > 0,
          data: response.data?.userOverviewSearch,
        }))
      );
  }

  updateSearchText(searchText: string) {
    this.patchState({
      searchText: searchText === '' ? undefined : searchText,
      pageNumber: 1,
    });
  }

  updateFilters({ actorId, status, userRoleIds }: DhUserManagementFilters) {
    this.patchState({
      statusFilter: status,
      actorIdFilter: actorId ?? undefined,
      userRoleFilter: userRoleIds ?? [],
      pageNumber: 1,
    });
  }

  updateSort(sortProperty: UserOverviewSortProperty, direction: MarketParticipantSortDirctionType) {
    this.patchState({ sortProperty, direction });
  }

  readonly reloadUsers = () => {
    this.loadUsers(this.fetchUsersParams$);
  };

  ngrxOnStoreInit() {
    this.loadUsers(this.fetchUsersParams$);
  }
}
