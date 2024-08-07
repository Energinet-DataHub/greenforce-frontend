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
import { Observable, Subject, switchMap, tap } from 'rxjs';
import { ComponentStore } from '@ngrx/component-store';
import { tapResponse } from '@ngrx/operators';
import { Apollo } from 'apollo-angular';

import { ErrorState, LoadingState } from '@energinet-datahub/dh/shared/data-access-api';
import {
  ActorViewDto,
  GetUserRoleViewDocument,
  UpdateUserRoleAssignmentsDtoInput,
} from '@energinet-datahub/dh/shared/domain/graphql';

interface DhUserManagementState {
  readonly userRolesPerActor: ActorViewDto[];
  readonly requestState: LoadingState | ErrorState;
}

const initialState: DhUserManagementState = {
  userRolesPerActor: [],
  requestState: LoadingState.INIT,
};

export type UpdateUserRolesWithActorId = {
  id: string;
  atLeastOneRoleIsAssigned: boolean;
  userRolesToUpdate: UpdateUserRoleAssignmentsDtoInput;
};

export type UpdateUserRoles = {
  actors: UpdateUserRolesWithActorId[];
};

@Injectable({ providedIn: 'root' })
export class DhAdminUserRolesStore extends ComponentStore<DhUserManagementState> {
  private readonly apollo = inject(Apollo);

  isInit$ = this.select((state) => state.requestState === LoadingState.INIT);
  isLoading$ = this.select((state) => state.requestState === LoadingState.LOADING);
  hasGeneralError$ = new Subject<void>();

  userRolesPerActor$ = this.select((state) => state.userRolesPerActor);

  constructor() {
    super(initialState);
  }

  readonly getUserRolesView = this.effect((trigger$: Observable<string>) =>
    trigger$.pipe(
      tap(() => {
        this.resetState();
        this.setLoading(LoadingState.LOADING);
      }),
      switchMap((userId) =>
        this.apollo
          .query({
            query: GetUserRoleViewDocument,
            variables: { userId },
          })
          .pipe(
            tapResponse(
              (response) => {
                this.setLoading(LoadingState.LOADED);
                this.updateRoles(response.data.userRoleView);
              },
              () => {
                this.setLoading(ErrorState.GENERAL_ERROR);
                this.handleError();
              }
            )
          )
      )
    )
  );

  private updateRoles = this.updater(
    (state: DhUserManagementState, userRolesPerActor: ActorViewDto[]): DhUserManagementState => ({
      ...state,
      userRolesPerActor,
    })
  );

  private setLoading = this.updater(
    (state, loadingState: LoadingState | ErrorState): DhUserManagementState => ({
      ...state,
      requestState: loadingState,
    })
  );

  private handleError = () => {
    this.updateRoles([]);
    this.hasGeneralError$.next();
  };

  private resetState = () => this.setState(initialState);
}
