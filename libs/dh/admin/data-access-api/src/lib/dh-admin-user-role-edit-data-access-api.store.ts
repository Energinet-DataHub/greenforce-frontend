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
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { exhaustMap, filter, Observable, tap } from 'rxjs';

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

  isLoading$ = this.select(
    (state) => state.requestState === LoadingState.LOADING
  );
  hasValidationError$ = this.select(
    (state) => state.requestState === ErrorState.VALIDATION_EXCEPTION
  ).pipe(filter((value) => value));

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
                (error: HttpErrorResponse) => {
                  this.handleError(error);
                }
              )
            )
        )
      )
  );

  private handleError({ status, error }: HttpErrorResponse): void {
    let requestState = ErrorState.GENERAL_ERROR;

    if (
      status === HttpStatusCode.BadRequest &&
      error?.error?.code === ErrorState.VALIDATION_EXCEPTION
    ) {
      requestState = ErrorState.VALIDATION_EXCEPTION;
    }

    this.patchState({ requestState });
  }
}
