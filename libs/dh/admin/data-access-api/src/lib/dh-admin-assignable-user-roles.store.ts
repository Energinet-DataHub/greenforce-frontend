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
import { Observable, Subject, switchMap, tap } from 'rxjs';
import { ComponentStore } from '@ngrx/component-store';
import { tapResponse } from '@ngrx/operators';
import { Apollo } from 'apollo-angular';
import type { ResultOf } from '@graphql-typed-document-node/core';

import { ErrorState, LoadingState } from '@energinet-datahub/dh/shared/data-access-api';
import { GetUserRolesByActorIdDocument } from '@energinet-datahub/dh/shared/domain/graphql';

export type UserRoleItem = ResultOf<typeof GetUserRolesByActorIdDocument>['userRolesByActorId'][0];

interface State {
  readonly requestState: LoadingState | ErrorState;
  readonly assignableUserRoles: UserRoleItem[];
}

const initialState: State = {
  requestState: LoadingState.INIT,
  assignableUserRoles: [],
};

@Injectable()
export class DhAdminAssignableUserRolesStore extends ComponentStore<State> {
  private readonly apollo = inject(Apollo);

  isInit$ = this.select((state) => state.requestState === LoadingState.INIT);
  isLoading$ = this.select((state) => state.requestState === LoadingState.LOADING);
  hasGeneralError$ = new Subject<void>();

  assignableUserRoles$ = this.select((state) => state.assignableUserRoles);

  constructor() {
    super(initialState);
  }

  readonly getAssignableUserRoles = this.effect((trigger$: Observable<string>) =>
    trigger$.pipe(
      tap(() => {
        this.resetState();
        this.setLoading(LoadingState.LOADING);
      }),
      switchMap((actorId) =>
        this.apollo.query({ query: GetUserRolesByActorIdDocument, variables: { actorId } }).pipe(
          tapResponse(
            (response) => {
              this.setLoading(LoadingState.LOADED);
              this.updateRoles(response.data.userRolesByActorId);
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
    (state: State, assignableUserRoles: UserRoleItem[]): State => ({
      ...state,
      assignableUserRoles,
    })
  );

  private setLoading = this.updater(
    (state, loadingState: LoadingState | ErrorState): State => ({
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
