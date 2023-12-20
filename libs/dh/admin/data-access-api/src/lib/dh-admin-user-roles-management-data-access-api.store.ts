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
import { TranslocoService } from '@ngneat/transloco';
import {
  Observable,
  combineLatestWith,
  filter,
  map,
  of,
  switchMap,
  tap,
  withLatestFrom,
} from 'rxjs';
import { ComponentStore, OnStoreInit, tapResponse } from '@ngrx/component-store';
import { ErrorState, LoadingState } from '@energinet-datahub/dh/shared/data-access-api';
import {
  MarketParticipantUserRoleHttp,
  MarketParticipantEicFunction,
  MarketParticipantUserRoleStatus,
  MarketParticipantUserRoleDto,
} from '@energinet-datahub/dh/shared/domain';
import { WattDropdownOptions } from '@energinet-datahub/watt/dropdown';
interface DhUserRolesManagementState {
  readonly roles: MarketParticipantUserRoleDto[];
  readonly requestState: LoadingState | ErrorState;
  validation?: { error: string };
  readonly filterModel: {
    status: MarketParticipantUserRoleStatus | null;
    eicFunctions: MarketParticipantEicFunction[] | null;
    searchTerm: string | null;
  };
}

const initialState: DhUserRolesManagementState = {
  roles: [],
  requestState: LoadingState.INIT,
  filterModel: { status: 'Active', eicFunctions: [], searchTerm: null },
};

@Injectable()
export class DhAdminUserRolesManagementDataAccessApiStore
  extends ComponentStore<DhUserRolesManagementState>
  implements OnStoreInit
{
  private readonly _transloco = inject(TranslocoService);

  isInit$ = this.select((state) => state.requestState === LoadingState.INIT);
  isLoading$ = this.select((state) => state.requestState === LoadingState.LOADING);
  hasGeneralError$ = this.select((state) => state.requestState === ErrorState.GENERAL_ERROR);
  filterModel$ = this.select((state) => state.filterModel);

  roles$ = this.select((state) => state.roles);

  rolesFiltered$ = this.select(this.roles$, this.filterModel$, (roles, filter) =>
    roles.filter(
      (role) =>
        (!filter.status || role.status == filter.status) &&
        (!filter.eicFunctions ||
          filter.eicFunctions.length == 0 ||
          filter.eicFunctions.includes(role.eicFunction)) &&
        (!filter.searchTerm || role.name.toUpperCase().includes(filter.searchTerm.toUpperCase()))
    )
  );

  rolesOptions$: Observable<WattDropdownOptions> = of([]);

  validation$ = this.select((state) => state.validation);

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
      status: MarketParticipantUserRoleStatus | null
    ): DhUserRolesManagementState => ({
      ...state,
      filterModel: {
        ...state.filterModel,
        status,
      },
    })
  );

  readonly updateRoleById = this.updater(
    (
      state: DhUserRolesManagementState,
      roleToUpdate: { id: string; name: string }
    ): DhUserRolesManagementState => {
      const roles = state.roles.map((role) => {
        if (role.id === roleToUpdate.id) {
          return {
            ...role,
            name: roleToUpdate.name,
          };
        }

        return role;
      });

      return {
        ...state,
        roles,
      };
    }
  );

  readonly setFilterEicFunction = this.updater(
    (
      state: DhUserRolesManagementState,
      eicFunctions: MarketParticipantEicFunction[] | null
    ): DhUserRolesManagementState => ({
      ...state,
      filterModel: {
        ...state.filterModel,
        eicFunctions,
      },
    })
  );

  readonly setSearchTerm = this.updater(
    (state: DhUserRolesManagementState, searchTerm: string | null): DhUserRolesManagementState => ({
      ...state,
      filterModel: {
        ...state.filterModel,
        searchTerm,
      },
    })
  );

  private updateUserRoles = this.updater(
    (
      state: DhUserRolesManagementState,
      response: MarketParticipantUserRoleDto[]
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
    this.rolesOptions$ = this._transloco
      .selectTranslateObject('marketParticipant.marketRoles')
      .pipe(
        combineLatestWith(this.select((state) => state.roles)),
        filter(([, roles]) => roles.length > 0),
        // eslint-disable-next-line @ngrx/avoid-mapping-component-store-selectors
        map(([keys, roles]) =>
          roles.map((role: MarketParticipantUserRoleDto) => ({
            displayValue: `${role.name} - ${keys[role.eicFunction]}`,
            value: role.id,
          }))
        )
      );
    this.getRoles();
  }
}
