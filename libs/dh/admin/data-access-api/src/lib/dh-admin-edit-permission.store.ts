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
import { ComponentStore } from '@ngrx/component-store';
import { tapResponse } from '@ngrx/operators';
import { exhaustMap, Observable, tap } from 'rxjs';

import { ErrorState, SavingState } from '@energinet-datahub/dh/shared/data-access-api';
import {
  MarketParticipantPermissionsHttp,
  MarketParticipantUpdatePermissionDto,
} from '@energinet-datahub/dh/shared/domain';

interface DhEditPermissionState {
  readonly requestState: SavingState | ErrorState;
}

const initialState: DhEditPermissionState = {
  requestState: SavingState.INIT,
};

@Injectable()
export class DhAdminEditPermissionStore extends ComponentStore<DhEditPermissionState> {
  isSaving$ = this.select((state) => state.requestState === SavingState.SAVING);

  constructor(private httpClient: MarketParticipantPermissionsHttp) {
    super(initialState);
  }

  readonly updatePermission = this.effect(
    (
      trigger$: Observable<{
        updatedPermission: MarketParticipantUpdatePermissionDto;
        onSuccessFn: () => void;
        onErrorFn: () => void;
      }>
    ) =>
      trigger$.pipe(
        tap(() => {
          this.patchState({ requestState: SavingState.SAVING });
        }),
        exhaustMap(({ updatedPermission, onSuccessFn, onErrorFn }) =>
          this.httpClient.v1MarketParticipantPermissionsUpdatePut(updatedPermission).pipe(
            tapResponse(
              () => {
                this.patchState({ requestState: SavingState.SAVED });

                onSuccessFn();
              },
              () => {
                this.handleError();

                onErrorFn();
              }
            )
          )
        )
      )
  );

  private handleError(): void {
    this.patchState({ requestState: ErrorState.GENERAL_ERROR });
  }
}
