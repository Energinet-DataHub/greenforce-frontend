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
import { Observable, switchMap, take, tap } from 'rxjs';
import { ComponentStore, OnStoreInit } from '@ngrx/component-store';
import type { ResultOf } from '@graphql-typed-document-node/core';
import { tapResponse } from '@ngrx/operators';

import { ErrorState, LoadingState } from '@energinet-datahub/dh/shared/domain';
import {
  GetAllUsersDocument,
  MarketParticipantSortDirctionType,
  UserOverviewSearchDocument,
  UserOverviewSortProperty,
  UserStatus,
} from '@energinet-datahub/dh/shared/domain/graphql';
import { DhUsers } from '@energinet-datahub/dh/admin/shared';
import { lazyQuery } from '@energinet-datahub/dh/shared/util-apollo';

export type UserToDownload = {
  userName: string;
  userEmail: string;
  marketParticipantName: string;
  organizationName: string;
};

export type UsersToDownload = UserToDownload[];

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

interface DhUserManagementState {
  readonly users: DhUsers;
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
  private readonly apollo = inject(Apollo);

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

  private readonly getAllUsersQuery = lazyQuery(GetAllUsersDocument);

  readonly isDownloading = this.getAllUsersQuery.loading;

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
        return this.getUsers(fetchUsersParams).valueChanges.pipe(
          tapResponse(
            (response) => {
              if (response.data?.userOverviewSearch.users) {
                this.updateUsers(response.data.userOverviewSearch);

                this.patchState({ usersRequestState: LoadingState.LOADED });
              }
            },
            () => {
              this.patchState({ usersRequestState: ErrorState.GENERAL_ERROR });
            }
          )
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
      users: response.users as DhUsers,
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
  }: FetchUsersParams) {
    return this.apollo.watchQuery({
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
    });
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

  downloadUsers(): Promise<UsersToDownload> {
    const { actorIdFilter, userRoleFilter, statusFilter } = this.state();

    return this.getAllUsersQuery
      .query({
        variables: {
          pageNumber: 1,
          pageSize: 10_000,
          actorId: actorIdFilter,
          userStatus: statusFilter,
          userRoleIds: userRoleFilter,
          sortProperty: UserOverviewSortProperty.Email,
          sortDirection: MarketParticipantSortDirctionType.Asc,
        },
      })
      .then((response) => this.mapUsersToDownload(response.data));
  }

  readonly reloadUsers = () => {
    this.loadUsers(this.fetchUsersParams$);
  };

  ngrxOnStoreInit() {
    this.loadUsers(this.fetchUsersParams$);
  }

  private mapUsersToDownload(response: ResultOf<typeof GetAllUsersDocument>): UsersToDownload {
    return response.userOverviewSearch.users.map((user) => ({
      userName: user.name,
      userEmail: user.email,
      marketParticipantName: user.administratedBy?.name ?? '',
      organizationName: user.administratedBy?.organization.name ?? '',
    }));
  }
}
