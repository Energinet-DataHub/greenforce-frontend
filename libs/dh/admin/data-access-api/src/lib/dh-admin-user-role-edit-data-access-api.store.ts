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
import { inject, Injectable } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { exhaustMap, Observable, tap } from 'rxjs';

import {
  ErrorState,
  LoadingState,
} from '@energinet-datahub/dh/shared/data-access-api';
import {
  MarketParticipantUserRoleHttp,
  UpdateUserRoleDto,
} from '@energinet-datahub/dh/shared/domain';

import { DhAdminUserRolesManagementDataAccessApiStore } from './dh-admin-user-roles-management-data-access-api.store';

interface DhEditUserRoleState {
  readonly requestState: LoadingState | ErrorState;
}

const initialState: DhEditUserRoleState = {
  requestState: LoadingState.INIT,
};

@Injectable()
export class DhAdminUserRoleEditDataAccessApiStore extends ComponentStore<DhEditUserRoleState> {
  private readonly userRolesStore = inject(
    DhAdminUserRolesManagementDataAccessApiStore
  );

  isInit$ = this.select((state) => state.requestState === LoadingState.INIT);
  isLoading$ = this.select(
    (state) => state.requestState === LoadingState.LOADING
  );
  hasGeneralError$ = this.select(
    (state) => state.requestState === ErrorState.GENERAL_ERROR
  );

  constructor(private httpClient: MarketParticipantUserRoleHttp) {
    super(initialState);
  }

  readonly updateUserRole = this.effect(
    (
      trigger$: Observable<{
        userRoleId: string;
        updatedUserRole: UpdateUserRoleDto;
        onSuccessFn: () => void;
      }>
    ) =>
      trigger$.pipe(
        tap(() => {
          this.patchState({ requestState: LoadingState.LOADING });
        }),
        exhaustMap(({ userRoleId, updatedUserRole, onSuccessFn }) =>
          this.httpClient
            .v1MarketParticipantUserRoleUpdatePut(userRoleId, updatedUserRole)
            .pipe(
              tapResponse(
                () => {
                  this.patchState({ requestState: LoadingState.LOADED });

                  this.userRolesStore.updateRoleById({
                    id: userRoleId,
                    name: updatedUserRole.name,
                  });

                  onSuccessFn();
                },
                () => {
                  this.patchState({ requestState: ErrorState.GENERAL_ERROR });
                }
              )
            )
        )
      )
  );
}
