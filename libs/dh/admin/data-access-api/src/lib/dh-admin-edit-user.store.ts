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
import { Observable, exhaustMap, tap } from 'rxjs';
import { ComponentStore } from '@ngrx/component-store';
import { tapResponse } from '@ngrx/operators';
import { HttpStatusCode } from '@angular/common/http';

import { ErrorState, SavingState } from '@energinet-datahub/dh/shared/data-access-api';

import { DhAdminUserRolesStore } from './dh-admin-user-roles.store';
import { Apollo } from 'apollo-angular';
import {
  GetUserByIdDocument,
  UpdateActorUserRolesInput,
  UpdateUserAndRolesDocument,
  UserOverviewSearchDocument,
} from '@energinet-datahub/dh/shared/domain/graphql';

interface State {
  readonly requestState: SavingState | ErrorState;
}

const initialState: State = {
  requestState: SavingState.INIT,
};

@Injectable()
export class DhAdminEditUserStore extends ComponentStore<State> {
  private readonly userRolesStore = inject(DhAdminUserRolesStore);
  private readonly apollo = inject(Apollo);

  isSaving$ = this.select((state) => state.requestState === SavingState.SAVING);

  constructor() {
    super(initialState);
  }

  readonly editUser = this.effect(
    (
      trigger$: Observable<{
        userId: string;
        firstName: string;
        lastName: string;
        phoneNumber: string;
        updateUserRoles: UpdateActorUserRolesInput[];
        onSuccessFn: () => void;
        onErrorFn: (statusCode: HttpStatusCode) => void;
      }>
    ) =>
      trigger$.pipe(
        tap(() => {
          this.setSaving(SavingState.SAVING);
        }),
        exhaustMap(
          ({
            userId,
            firstName,
            lastName,
            phoneNumber,
            updateUserRoles,
            onSuccessFn,
            onErrorFn,
          }) => {
            return this.apollo
              .mutate({
                mutation: UpdateUserAndRolesDocument,
                refetchQueries: [UserOverviewSearchDocument, GetUserByIdDocument],
                variables: {
                  updateUserInput: {
                    userId,
                    userIdentityUpdateDto: {
                      firstName,
                      lastName,
                      phoneNumber,
                    },
                  },
                  updateRolesInput: {
                    userId,
                    input: updateUserRoles,
                  },
                },
              })
              .pipe(
                tapResponse(
                  (response) => {
                    if (
                      response.data?.updateUserIdentity?.success &&
                      response.data?.updateUserIdentity.errors === null &&
                      response.data?.updateUserRoleAssignment?.success &&
                      response.data?.updateUserRoleAssignment.errors === null
                    ) {
                      this.setSaving(SavingState.SAVED);
                      onSuccessFn();
                    } else if (response.data?.updateUserIdentity?.errors) {
                      this.setSaving(ErrorState.GENERAL_ERROR);
                      onErrorFn(response.data?.updateUserIdentity.errors[0].statusCode);
                    } else if (response.data?.updateUserRoleAssignment?.errors) {
                      this.setSaving(ErrorState.GENERAL_ERROR);
                      onErrorFn(response.data?.updateUserRoleAssignment.errors[0].statusCode);
                    }
                  },
                  () => {
                    this.setSaving(ErrorState.GENERAL_ERROR);
                  }
                )
              );
          }
        )
      )
  );

  private setSaving = this.updater(
    (state, savingState: SavingState | ErrorState): State => ({
      ...state,
      requestState: savingState,
    })
  );
}
