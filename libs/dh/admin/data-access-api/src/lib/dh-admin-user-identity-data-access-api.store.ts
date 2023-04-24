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
import { Observable, exhaustMap, tap } from 'rxjs';
import { ComponentStore, tapResponse } from '@ngrx/component-store';

import { ErrorState, SavingState } from '@energinet-datahub/dh/shared/data-access-api';
import {
  MarketParticipantUserHttp,
  MarketParticipantUserIdentityUpdateDto,
} from '@energinet-datahub/dh/shared/domain';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';

interface DhUserIdentityState {
  readonly savingState: SavingState | ErrorState;
}

const initialState: DhUserIdentityState = {
  savingState: SavingState.INIT,
};

@Injectable({ providedIn: 'root' })
export class DhAdminUserIdentityDataAccessApiStore extends ComponentStore<DhUserIdentityState> {
  readonly isInit$ = this.select((state) => state.savingState === SavingState.INIT);
  readonly isSaving$ = this.select((state) => state.savingState === SavingState.SAVING);
  readonly hasGeneralError$ = this.select(
    (state) => state.savingState === ErrorState.GENERAL_ERROR
  );

  constructor(private httpClient: MarketParticipantUserHttp) {
    super(initialState);
  }

  readonly updateUserIdentity = this.effect(
    (
      trigger$: Observable<{
        userId: string;
        updatedUserIdentity: MarketParticipantUserIdentityUpdateDto;
        onSuccessFn: () => void;
        onErrorFn: (statusCode: HttpStatusCode) => void;
      }>
    ) =>
      trigger$.pipe(
        tap(() => {
          this.setSaving(SavingState.SAVING);
        }),
        exhaustMap(({ userId, updatedUserIdentity, onSuccessFn, onErrorFn }) =>
          this.httpClient
            .v1MarketParticipantUserUpdateUserIdentityPut(userId, updatedUserIdentity)
            .pipe(
              tapResponse(
                () => {
                  this.setSaving(SavingState.SAVED);
                  onSuccessFn();
                },
                (error: HttpErrorResponse) => {
                  this.handleError(error);
                  onErrorFn(error.status);
                }
              )
            )
        )
      )
  );

  private setSaving = this.updater(
    (state, savingState: SavingState | ErrorState): DhUserIdentityState => ({
      ...state,
      savingState: savingState,
    })
  );

  private handleError({ status, error }: HttpErrorResponse): void {
    this.setSaving(ErrorState.GENERAL_ERROR);
    if (status === HttpStatusCode.BadRequest && error?.error?.code === ErrorState.VALIDATION_EXCEPTION)
    {
      this.setSaving(ErrorState.VALIDATION_EXCEPTION);
    }
  }
}
