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
import { Observable, switchMap, tap } from 'rxjs';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { EicFunction } from '@energinet-datahub/dh/shared/domain';
import {
  ErrorState,
  LoadingState,
} from '@energinet-datahub/dh/shared/data-access-api';
import {
  MarketParticipantUserRoleHttp,
  CreateUserRoleDto,
  SelectablePermissionsDto,
} from '@energinet-datahub/dh/shared/domain';

interface UserRoleCreate {
  onSaveCompletedFn: () => void;
  createRole: CreateUserRoleDto;
}
interface DhCreateUserRoleManagementState {
  readonly requestState: LoadingState | ErrorState;
  readonly selectablePermissions: SelectablePermissionsDto[];
}

const initialState: DhCreateUserRoleManagementState = {
  requestState: LoadingState.INIT,
  selectablePermissions: [],
};

@Injectable()
export class DhAdminCreateUserRoleManagementDataAccessApiStore extends ComponentStore<DhCreateUserRoleManagementState> {
  isInit$ = this.select((state) => state.requestState === LoadingState.INIT);
  isLoading$ = this.select(
    (state) => state.requestState === LoadingState.LOADING
  );
  hasGeneralError$ = this.select(
    (state) => state.requestState === ErrorState.GENERAL_ERROR
  );

  selectablePermissions$ = this.select((state) => state.selectablePermissions);

  constructor(private httpClientUserRole: MarketParticipantUserRoleHttp) {
    super(initialState);
  }

  private readonly getSelectablePermissions = this.effect(
    (trigger$: Observable<EicFunction>) =>
      trigger$.pipe(
        switchMap(x =>
          this.httpClientUserRole
            .v1MarketParticipantUserRolePermissionsGet(x)
            .pipe(
              tapResponse(
                (response) => {
                  this.updatePermissions(response);
                  this.setLoading(LoadingState.LOADED);
                },
                () => {
                  this.setLoading(LoadingState.LOADED);
                  this.updatePermissions([]);
                  this.handleError();
                }
              )
            )
        )
      )
  );

  readonly createUserRole = this.effect(
    (userRoleCreateDto: Observable<UserRoleCreate>) => {
      return userRoleCreateDto.pipe(
        tap(() => {
          this.setLoading(LoadingState.INIT);
        }),
        switchMap((userRole) =>
          this.saveUserRole(userRole.createRole).pipe(
            tapResponse(
              () => {
                this.setLoading(LoadingState.LOADED);
                userRole.onSaveCompletedFn();
              },
              () => {
                this.setLoading(ErrorState.GENERAL_ERROR);
              }
            )
          )
        )
      );
    }
  );

  private updatePermissions = this.updater(
    (
      state: DhCreateUserRoleManagementState,
      response: SelectablePermissionsDto[]
    ): DhCreateUserRoleManagementState => ({
      ...state,
      selectablePermissions: response,
    })
  );

  private setLoading = this.updater(
    (
      state,
      loadingState: LoadingState | ErrorState
    ): DhCreateUserRoleManagementState => ({
      ...state,
      requestState: loadingState,
    })
  );

  private readonly saveUserRole = (newRole: CreateUserRoleDto) => {
    return this.httpClientUserRole.v1MarketParticipantUserRoleCreatePost(
      newRole
    );
  };

  private handleError = () => {
    this.patchState({ requestState: ErrorState.GENERAL_ERROR });
  };

  private resetState = () => this.setState(initialState);
}
