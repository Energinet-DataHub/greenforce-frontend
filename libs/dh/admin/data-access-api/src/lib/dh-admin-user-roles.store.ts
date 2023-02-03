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
import {
  exhaustMap,
  filter,
  from,
  map,
  Observable,
  Subject,
  switchMap,
  tap,
} from 'rxjs';
import { ComponentStore, tapResponse } from '@ngrx/component-store';

import {
  ErrorState,
  LoadingState,
} from '@energinet-datahub/dh/shared/data-access-api';
import {
  MarketParticipantUserRoleHttp,
  MarketParticipantUserRoleAssignmentHttp,
  UserRolesViewDto,
  UserRoleViewDto,
  UpdateUserRoleAssignmentsDto,
} from '@energinet-datahub/dh/shared/domain';

interface DhUserManagementState {
  readonly userRolesView: UserRolesViewDto | null;
  readonly requestState: LoadingState | ErrorState;
  readonly numberOfSelectedRoles: number;
  readonly numberOfAssigenableRoles: number;
  readonly selectedRoles: UserRoleViewDto[];
}

const initialState: DhUserManagementState = {
  userRolesView: null,
  requestState: LoadingState.INIT,
  numberOfSelectedRoles: 0,
  numberOfAssigenableRoles: 0,
  selectedRoles: [],
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
  isLoading$ = this.select(
    (state) => state.requestState === LoadingState.LOADING
  );
  hasGeneralError$ = new Subject<void>();

  userRoleView$: Observable<UserRolesViewDto> = this.select(
    (state) => state.userRolesView
  ).pipe(
    filter((userRolesView) => !!userRolesView),
    map((userRolesView) => userRolesView as UserRolesViewDto)
  );

  numberOfSelectedRoles$ = this.select((state) => state.numberOfSelectedRoles);
  numberOfAssignableRoles$ = this.select(
    (state) => state.numberOfAssigenableRoles
  );

  selectedRoles$ = this.select((state) => state.selectedRoles);

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
                this.setLoading(LoadingState.LOADED);
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
            exhaustMap((actor) => {
              return this.marketParticipantUserRoleAssignmentHttp.v1MarketParticipantUserRoleAssignmentUpdateAssignmentsPut(
                actor.id,
                userId,
                actor.userRolesToUpdate
              );
            }),
            tapResponse(
              () => {
                onSuccess();
                this.getUserRolesView(userId);
              },
              () => this.handleError()
            )
          )
        )
      );
    }
  );

  private updateRoles = this.updater(
    (
      state: DhUserManagementState,
      userRolesView: UserRolesViewDto | null
    ): DhUserManagementState => ({
      ...state,
      numberOfSelectedRoles:
        userRolesView?.organizations.flatMap((org) =>
          org.actors.flatMap((actor) =>
            actor.userRoles.filter((userRole) => userRole.userActorId !== null)
          )
        ).length ?? 0,
      selectedRoles:
        userRolesView?.organizations.flatMap((org) =>
          org.actors.flatMap((actor) =>
            actor.userRoles.filter((userRole) => userRole.userActorId !== null)
          )
        ) ?? [],
      numberOfAssigenableRoles:
        userRolesView?.organizations.flatMap((org) =>
          org.actors.flatMap((actor) => actor.userRoles)
        ).length ?? 0,
      userRolesView: userRolesView,
    })
  );

  private setLoading = this.updater(
    (state, loadingState: LoadingState): DhUserManagementState => ({
      ...state,
      requestState: loadingState,
    })
  );

  private handleError = () => {
    this.updateRoles(null);
    this.hasGeneralError$.next();
  };

  private resetState = () => this.setState(initialState);
}
