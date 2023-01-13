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
  MarketParticipantUserRoleHttp,
  EicFunction,
  UserRoleStatus,
  UserRoleDto,
} from '@energinet-datahub/dh/shared/domain';

interface DhUserRolesManagementState {
  readonly roles: UserRoleDto[];
  readonly requestState: LoadingState | ErrorState;
  readonly filterModel: { status: UserRoleStatus | null, eicFunctions: EicFunction[] | null };
}

const initialState: DhUserRolesManagementState = {
  roles: [],
  requestState: LoadingState.INIT,
  filterModel: { status: 'Active', eicFunctions: [] }
};

@Injectable()
export class DhAdminUserRolesManagementDataAccessApiStore extends ComponentStore<DhUserRolesManagementState> {
  isInit$ = this.select((state) => state.requestState === LoadingState.INIT);
  isLoading$ = this.select(
    (state) => state.requestState === LoadingState.LOADING
  );
  hasGeneralError$ = this.select(
    (state) => state.requestState === ErrorState.GENERAL_ERROR
  );
  filterModel$ = this.select((state) => state.filterModel);

  roles$ = this.select((state) => state.roles);

  rolesFiltered$ = this.select(
    this.roles$,
    this.filterModel$,
    (roles, filter) =>
      roles.filter(
        (r) =>
          (filter.status == null || r.status == filter.status) &&
          (!filter.eicFunctions ||
            filter.eicFunctions.length == 0 ||
            filter.eicFunctions.includes(r.eicFunction))
      )
  );

  constructor(private httpClientUserRole: MarketParticipantUserRoleHttp) {
    super(initialState);
  }

  readonly getRoles = this.effect((trigger$: Observable<void>) =>
    trigger$.pipe(
      withLatestFrom(this.state$),
      tap(() => {
        this.resetState();
        this.setLoading(LoadingState.LOADING);
      }),
      switchMap(() =>
        this.httpClientUserRole.v1MarketParticipantUserRoleGetAllGet().pipe(
          tapResponse(
            (response) => {
              this.updateUserRoles(response);
              this.setLoading(LoadingState.LOADED);
            },
            () => {
              this.setLoading(LoadingState.LOADED);
              this.updateUserRoles([]);
              this.handleError();
            }
          )
        )
      )
    )
  );

  readonly setFilterStatus = this.updater(
    (
      state: DhUserRolesManagementState,
      statusUpdate: UserRoleStatus | null
    ): DhUserRolesManagementState => ({
      ...state,
      filterModel: {
        status: statusUpdate,
        eicFunctions: state.filterModel.eicFunctions,
      },
    })
  );

  readonly setFilterEicFunction = this.updater(
    (
      state: DhUserRolesManagementState,
      eicFunctions: EicFunction[] | null
    ): DhUserRolesManagementState => ({
      ...state,
      filterModel: {
        status: state.filterModel.status,
        eicFunctions: eicFunctions,
      },
    })
  );

  private updateUserRoles = this.updater(
    (
      state: DhUserRolesManagementState,
      response: UserRoleDto[]
    ): DhUserRolesManagementState => ({
      ...state,
      roles: response,
    })
  );

  private setLoading = this.updater(
    (state, loadingState: LoadingState): DhUserRolesManagementState => ({
      ...state,
      requestState: loadingState,
    })
  );

  private handleError = () => {
    this.updateUserRoles([]);
    this.patchState({ requestState: ErrorState.GENERAL_ERROR });
  };

  private resetState = () => this.setState(initialState);

  ngrxOnStoreInit(): void {
    this.getRoles();
  }
}
