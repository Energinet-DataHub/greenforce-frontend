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
import { exhaustMap, from, mergeMap, Observable, Subject, switchMap, tap } from 'rxjs';
import { ComponentStore, tapResponse } from '@ngrx/component-store';

import {
  ErrorState,
  LoadingState,
  SavingState,
} from '@energinet-datahub/dh/shared/data-access-api';
import {
  MarketParticipantUserRoleHttp,
  MarketParticipantUserRoleAssignmentHttp,
  UserRoleViewDto,
  UpdateUserRoleAssignmentsDto,
  ActorViewDto,
} from '@energinet-datahub/dh/shared/domain';

interface DhUserManagementState {
  readonly userRolesPrActor: ActorViewDto[];
  readonly selectedRoles: UserRoleViewDto[];
  readonly requestState: LoadingState | ErrorState;
  readonly savingState: SavingState | ErrorState;
}

const initialState: DhUserManagementState = {
  userRolesPrActor: [],
  selectedRoles: [],
  requestState: LoadingState.INIT,
  savingState: SavingState.INIT,
};

export type UpdateUserRolesWithActorId = {
  id: string;
  userRolesToUpdate: UpdateUserRoleAssignmentsDto;
};

export type UpdateUserRoles = {
  actors: UpdateUserRolesWithActorId[];
};

@Injectable({ providedIn: 'root' })
export class DhAdminUserRolesStore extends ComponentStore<DhUserManagementState> {
  isInit$ = this.select((state) => state.requestState === LoadingState.INIT);
  isLoading$ = this.select((state) => state.requestState === LoadingState.LOADING);
  hasGeneralError$ = new Subject<void>();

  isSaving$ = this.select((state) => state.savingState === SavingState.SAVING);
  selectedRoles$ = this.select((state) => state.selectedRoles);
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

  readonly assignRoles = this.effect(
    (
      trigger$: Observable<{
        userId: string;
        updateUserRoles: UpdateUserRoles;
        onSuccess: () => void;
      }>
    ) => {
      return trigger$.pipe(
        exhaustMap(({ userId, updateUserRoles, onSuccess }) =>
          from(updateUserRoles.actors).pipe(
            tap(() => this.setSaving(SavingState.SAVING)),
            mergeMap((actor) => {
              return this.marketParticipantUserRoleAssignmentHttp.v1MarketParticipantUserRoleAssignmentUpdateAssignmentsPut(
                actor.id,
                userId,
                actor.userRolesToUpdate
              );
            }),
            tapResponse(
              () => {
                onSuccess();
                this.setSaving(SavingState.SAVED);
                this.getUserRolesView(userId);
              },
              () => {
                this.setSaving(ErrorState.GENERAL_ERROR);
                this.handleError();
              }
            )
          )
        )
      );
    }
  );

  private updateRoles = this.updater(
    (state: DhUserManagementState, userRolesPrActor: ActorViewDto[]): DhUserManagementState => ({
      ...state,
      selectedRoles: userRolesPrActor.flatMap((actor) =>
        actor.userRoles.filter((userRole) => userRole.userActorId)
      ),
      userRolesPrActor,
    })
  );

  private setLoading = this.updater(
    (state, loadingState: LoadingState | ErrorState): DhUserManagementState => ({
      ...state,
      requestState: loadingState,
    })
  );

  private setSaving = this.updater(
    (state, savingState: SavingState | ErrorState): DhUserManagementState => ({
      ...state,
      savingState: savingState,
    })
  );

  private handleError = () => {
    this.updateRoles([]);
    this.hasGeneralError$.next();
  };

  private resetState = () => this.setState(initialState);
}
