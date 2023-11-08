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
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { Observable, switchMap, exhaustMap, tap, finalize } from 'rxjs';

import {
  MarketParticipantActorCredentialsDto,
  MarketParticipantActorHttp,
} from '@energinet-datahub/dh/shared/domain';

interface CredentialsState {
  credentials: MarketParticipantActorCredentialsDto | null;
  loadingCredentials: boolean;
  AddCredentialsInProgress: boolean;
  removeInProgress: boolean;
}

const initialState: CredentialsState = {
  credentials: null,
  loadingCredentials: true,
  AddCredentialsInProgress: false,
  removeInProgress: false,
};

@Injectable()
export class DhMarketParticipantCredentialsStore extends ComponentStore<CredentialsState> {
  private readonly httpClient = inject(MarketParticipantActorHttp);

  readonly certificateMetadata$ = this.select((state) => state.credentials?.certificateCredentials);
  readonly clientSecretMetadata$ = this.select(
    (state) => state.credentials?.clientSecretCredentials
  );
  readonly doesCertificateExist$ = this.select(this.certificateMetadata$, (metadata) => !!metadata);
  readonly doesClientSecretExist$ = this.select(
    this.clientSecretMetadata$,
    (metadata) => !!metadata
  );

  readonly loadingCredentials$ = this.select((state) => state.loadingCredentials);
  readonly AddCredentialsInProgress$ = this.select((state) => state.AddCredentialsInProgress);

  readonly removeInProgress$ = this.select((state) => state.removeInProgress);

  readonly getCredentials = this.effect((actorId$: Observable<string>) =>
    actorId$.pipe(
      tap(() => this.patchState({ loadingCredentials: true })),
      switchMap((actorId) =>
        this.httpClient.v1MarketParticipantActorGetActorCredentialsGet(actorId).pipe(
          tapResponse(
            (response) => this.patchState({ credentials: response }),
            () => this.patchState({ credentials: null })
          ),
          finalize(() => this.patchState({ loadingCredentials: false }))
        )
      )
    )
  );

  readonly uploadCertificate = this.effect(
    (
      trigger$: Observable<{
        actorId: string;
        file: File;
        onSuccess: () => void;
        onError: () => void;
      }>
    ) =>
      trigger$.pipe(
        tap(() => this.patchState({ AddCredentialsInProgress: true })),
        exhaustMap(({ actorId, file, onSuccess, onError }) =>
          this.httpClient
            .v1MarketParticipantActorAssignCertificateCredentialsPost(actorId, file)
            .pipe(
              tapResponse(
                () => onSuccess(),
                () => onError()
              ),
              finalize(() => this.patchState({ AddCredentialsInProgress: false }))
            )
        )
      )
  );

  readonly requestSecret = this.effect(
    (
      trigger$: Observable<{
        actorId: string;
        onSuccess: () => void;
        onError: () => void;
      }>
    ) =>
      trigger$.pipe(
        tap(() => this.patchState({ AddCredentialsInProgress: true })),
        exhaustMap(({ actorId, onSuccess, onError }) =>
          this.httpClient
            .v1MarketParticipantActorAssignCertificateCredentialsPost(actorId, file)
            .pipe(
              tapResponse(
                () => onSuccess(),
                () => onError()
              ),
              finalize(() => this.patchState({ AddCredentialsInProgress: false }))
            )
        )
      )
  );

  readonly removeCertificate = this.effect(
    (
      trigger$: Observable<{
        actorId: string;
        onSuccess: () => void;
        onError: () => void;
      }>
    ) =>
      trigger$.pipe(
        tap(() => this.patchState({ removeInProgress: true })),
        exhaustMap(({ actorId, onSuccess, onError }) =>
          this.httpClient.v1MarketParticipantActorRemoveActorCredentialsDelete(actorId).pipe(
            tapResponse(
              () => {
                this.patchState({ credentials: null });

                onSuccess();
              },
              () => onError()
            ),
            finalize(() => this.patchState({ removeInProgress: false }))
          )
        )
      )
  );

  constructor() {
    super(initialState);
  }
}
