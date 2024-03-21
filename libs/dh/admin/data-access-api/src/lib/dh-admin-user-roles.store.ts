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
import { from, mergeMap, Observable, Subject, switchMap, tap } from 'rxjs';
import { ComponentStore, tapResponse } from '@ngrx/component-store';

import { ErrorState, LoadingState } from '@energinet-datahub/dh/shared/data-access-api';
import {
  MarketParticipantUserRoleHttp,
  MarketParticipantUserRoleAssignmentHttp,
  MarketParticipantUpdateUserRoleAssignmentsDto,
  MarketParticipantActorViewDto,
} from '@energinet-datahub/dh/shared/domain';

interface DhUserManagementState {
  readonly userRolesPrActor: MarketParticipantActorViewDto[];
  readonly requestState: LoadingState | ErrorState;
}

const initialState: DhUserManagementState = {
  userRolesPrActor: [],
  requestState: LoadingState.INIT,
};

export type UpdateUserRolesWithActorId = {
  id: string;
  atLeastOneRoleIsAssigned: boolean;
  userRolesToUpdate: MarketParticipantUpdateUserRoleAssignmentsDto;
};

export type UpdateUserRoles = {
  actors: UpdateUserRolesWithActorId[];
};

@Injectable({ providedIn: 'root' })
export class DhAdminUserRolesStore extends ComponentStore<DhUserManagementState> {
  isInit$ = this.select((state) => state.requestState === LoadingState.INIT);
  isLoading$ = this.select((state) => state.requestState === LoadingState.LOADING);
  hasGeneralError$ = new Subject<void>();

  userRolesPrActor$ = this.select((state) => state.userRolesPrActor);

  constructor(
    private marketParticipantUserRoleHttp: MarketParticipantUserRoleHttp,
    private marketParticipantUserRoleAssignmentHttp: MarketParticipantUserRoleAssignmentHttp
  ) {
    super(initialState);
  }

  readonly getUserRolesView = this.effect((trigger$: Observable<string>) =>
    trigger$.pipe(
      tap(() => {
        this.resetState();
        this.setLoading(LoadingState.LOADING);
      }),
      switchMap((userId) => {
        return this.marketParticipantUserRoleHttp
          .v1MarketParticipantUserRoleGetUserRoleViewGet(userId)
          .pipe(
            tapResponse(
              (userRoleView) => {
                this.setLoading(LoadingState.LOADED);
                this.updateRoles(userRoleView);
              },
              () => {
                this.setLoading(ErrorState.GENERAL_ERROR);
                this.handleError();
              }
            )
          );
      })
    )
  );

  private updateRoles = this.updater(
    (
      state: DhUserManagementState,
      userRolesPrActor: MarketParticipantActorViewDto[]
    ): DhUserManagementState => ({
      ...state,
      userRolesPrActor,
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

  readonly assignRoles = (userId: string, updateUserRoles: UpdateUserRoles) => {
    return from(updateUserRoles.actors).pipe(
      mergeMap((actor) => {
        return this.marketParticipantUserRoleAssignmentHttp.v1MarketParticipantUserRoleAssignmentUpdateAssignmentsPut(
          actor.id,
          userId,
          actor.userRolesToUpdate
        );
      }),
      tapResponse(
        () => {
          this.getUserRolesView(userId);
        },
        () => {
          this.handleError();
        }
      )
    );
  };
}
