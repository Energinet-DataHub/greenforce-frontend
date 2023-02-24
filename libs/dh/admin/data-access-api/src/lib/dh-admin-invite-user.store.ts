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
import { Observable, Subject, switchMap, tap } from 'rxjs';
import { ComponentStore, tapResponse } from '@ngrx/component-store';

import { ErrorState, SavingState } from '@energinet-datahub/dh/shared/data-access-api';
import { MarketParticipantUserHttp, UserInvitationDto } from '@energinet-datahub/dh/shared/domain';

interface State {
  readonly requestState: SavingState | ErrorState;
}

const initialState: State = {
  requestState: SavingState.INIT,
};

@Injectable()
export class DbAdminInviteUserStore extends ComponentStore<State> {
  isInit$ = this.select((state) => state.requestState === SavingState.INIT);
  isSaving$ = this.select((state) => state.requestState === SavingState.SAVING);
  hasGeneralError$ = new Subject<void>();

  constructor(private marketParticipantUserHttp: MarketParticipantUserHttp) {
    super(initialState);
  }

  readonly inviteUser = this.effect(
    (trigger$: Observable<{ invitation: UserInvitationDto; onSuccess: () => void }>) =>
      trigger$.pipe(
        tap(() => {
          this.resetState();
          this.setSaving(SavingState.SAVING);
        }),
        switchMap(({ invitation, onSuccess }) => {
          return this.marketParticipantUserHttp
            .v1MarketParticipantUserInviteUserPost(invitation)
            .pipe(
              tapResponse(
                () => {
                  this.setSaving(SavingState.SAVED);
                  onSuccess();
                },
                (err) => {
                  this.setSaving(ErrorState.GENERAL_ERROR);
                  this.handleError(err);
                }
              )
            );
        })
      )
  );

  private setSaving = this.updater(
    (state, savingState: SavingState | ErrorState): State => ({
      ...state,
      requestState: savingState,
    })
  );

  private handleError = (err: unknown) => {
    console.log({ err });
    this.hasGeneralError$.next();
  };

  private resetState = () => this.setState(initialState);
}
