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

import { Apollo } from 'apollo-angular';
import { tapResponse } from '@ngrx/operators';
import { Observable, exhaustMap, tap } from 'rxjs';
import { ComponentStore } from '@ngrx/component-store';
import { HttpStatusCode } from '@angular/common/http';

import type { ResultOf } from '@graphql-typed-document-node/core';

import { ErrorState, SavingState } from '@energinet-datahub/dh/shared/domain';

import {
  ApiError,
  GetUserByIdDocument,
  UpdateActorUserRolesInput,
  UpdateUserAndRolesDocument,
  UserOverviewSearchDocument,
} from '@energinet-datahub/dh/shared/domain/graphql';

import { ApiErrorCollection } from './dh-api-error-utils';

interface State {
  readonly requestState: SavingState | ErrorState;
}

const initialState: State = {
  requestState: SavingState.INIT,
};

type MutationResponseType =
  | ResultOf<typeof UpdateUserAndRolesDocument>['updateUserIdentity']
  | ResultOf<typeof UpdateUserAndRolesDocument>['updateUserRoleAssignment'];

@Injectable()
export class DhAdminEditUserStore extends ComponentStore<State> {
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
        onErrorFn: (statusCode: HttpStatusCode, errors: ApiErrorCollection[]) => void;
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
                    if (response.loading || response.data?.updateUserIdentity === undefined) return;

                    const updateUserAndRoles = this.handleResponse([
                      response.data.updateUserIdentity,
                      response.data.updateUserRoleAssignment,
                    ]);

                    if (updateUserAndRoles.success) {
                      this.setSaving(SavingState.SAVED);
                      onSuccessFn();
                    }

                    if (updateUserAndRoles.errors.length > 0) {
                      this.setSaving(ErrorState.GENERAL_ERROR);
                      const firstError = updateUserAndRoles.errors[0];
                      onErrorFn(firstError.statusCode, updateUserAndRoles.errors);
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

  private handleResponse<T extends MutationResponseType>(res: T[]) {
    if (res?.every((x) => x.success)) {
      return { success: true, errors: [] };
    }

    return {
      success: false,
      errors: res
        .map((x) => x.errors)
        .flat()
        .filter((x): x is ApiError => !!x),
    };
  }
}
