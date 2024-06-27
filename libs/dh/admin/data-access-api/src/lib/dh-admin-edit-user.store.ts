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
import { Observable, exhaustMap, forkJoin, tap } from 'rxjs';
import { ComponentStore } from '@ngrx/component-store';
import { tapResponse } from '@ngrx/operators';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';

import { MarketParticipantUserHttp } from '@energinet-datahub/dh/shared/domain';
import { ErrorState, SavingState } from '@energinet-datahub/dh/shared/data-access-api';

import { DhAdminUserRolesStore, UpdateUserRoles } from './dh-admin-user-roles.store';
import { ApiErrorCollection, createApiErrorCollection } from './dh-api-error-utils';

interface State {
  readonly requestState: SavingState | ErrorState;
}

const initialState: State = {
  requestState: SavingState.INIT,
};

@Injectable()
export class DhAdminEditUserStore extends ComponentStore<State> {
  private readonly userRolesStore = inject(DhAdminUserRolesStore);

  isSaving$ = this.select((state) => state.requestState === SavingState.SAVING);

  constructor(private marketParticipantUserHttpClient: MarketParticipantUserHttp) {
    super(initialState);
  }

  readonly editUser = this.effect(
    (
      trigger$: Observable<{
        userId: string;
        firstName: string;
        lastName: string;
        phoneNumber: string;
        updateUserRoles?: UpdateUserRoles;
        onSuccessFn: () => void;
        onErrorFn: (statusCode: HttpStatusCode, error: ApiErrorCollection) => void;
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
            const requests: Observable<unknown>[] = [];

            requests.push(
              this.marketParticipantUserHttpClient.v1MarketParticipantUserUpdateUserIdentityPut(
                userId,
                { firstName, lastName, phoneNumber }
              )
            );

            if (updateUserRoles) {
              requests.push(this.userRolesStore.assignRoles(userId, updateUserRoles));
            }

            return forkJoin(requests).pipe(
              tapResponse(
                () => {
                  this.setSaving(SavingState.SAVED);
                  onSuccessFn();
                },
                (error: HttpErrorResponse) => {
                  this.setSaving(ErrorState.GENERAL_ERROR);
                  onErrorFn(error.status, createApiErrorCollection(error));
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
