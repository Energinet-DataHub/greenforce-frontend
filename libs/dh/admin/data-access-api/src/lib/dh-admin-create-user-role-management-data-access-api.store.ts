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

import { ErrorState, LoadingState } from '@energinet-datahub/dh/shared/data-access-api';
import {
  MarketParticipantUserRoleHttp,
  CreateUserRoleDto,
} from '@energinet-datahub/dh/shared/domain';

interface DhCreateUserRoleManagementState {
  readonly requestState: LoadingState | ErrorState;
}

const initialState: DhCreateUserRoleManagementState = {
  requestState: LoadingState.INIT,
};

@Injectable()
export class DhAdminCreateUserRoleManagementDataAccessApiStore extends ComponentStore<DhCreateUserRoleManagementState> {
  isInit$ = this.select((state) => state.requestState === LoadingState.INIT);
  isLoading$ = this.select((state) => state.requestState === LoadingState.LOADING);
  hasGeneralError$ = this.select((state) => state.requestState === ErrorState.GENERAL_ERROR);

  constructor(private httpClientUserRole: MarketParticipantUserRoleHttp) {
    super(initialState);
  }

  readonly createUserRole = this.effect(
    (
      trigger$: Observable<{
        createUserRoleDto: CreateUserRoleDto;
        onSaveCompletedFn: () => void;
      }>
    ) => {
      return trigger$.pipe(
        tap(() => {
          this.setLoading(LoadingState.INIT);
        }),
        switchMap(({ createUserRoleDto, onSaveCompletedFn }) =>
          this.saveUserRole(createUserRoleDto).pipe(
            tapResponse(
              () => {
                this.setLoading(LoadingState.LOADED);
                onSaveCompletedFn();
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

  private setLoading = this.updater(
    (state, loadingState: LoadingState | ErrorState): DhCreateUserRoleManagementState => ({
      ...state,
      requestState: loadingState,
    })
  );

  private readonly saveUserRole = (newRole: CreateUserRoleDto) => {
    return this.httpClientUserRole.v1MarketParticipantUserRoleCreatePost(newRole);
  };
}
