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

interface CertificateState {
  credentials: MarketParticipantActorCredentialsDto | null;
  clientSecret: string | undefined;
  loadingCredentials: boolean;
  generateSecretInProgress: boolean;
  uploadInProgress: boolean;
  removeInProgress: boolean;
}

const initialState: CertificateState = {
  credentials: null,
  clientSecret: undefined,
  loadingCredentials: true,
  generateSecretInProgress: false,
  uploadInProgress: false,
  removeInProgress: false,
};

@Injectable()
export class DhMarketPartyCredentialsStore extends ComponentStore<CertificateState> {
  private readonly httpClient = inject(MarketParticipantActorHttp);

  readonly doCredentialsExist$ = this.select((state) => !!state.credentials);

  readonly certificateMetadata$ = this.select((state) => state.credentials?.certificateCredentials);
  readonly doesCertificateExist$ = this.select(this.certificateMetadata$, (metadata) => !!metadata);

  readonly clientSecretMetadata$ = this.select(
    (state) => state.credentials?.clientSecretCredentials
  );
  readonly doesClientSecretMetadataExist$ = this.select(
    this.clientSecretMetadata$,
    (metadata) => !!metadata
  );
  readonly clientSecret$ = this.select((state) => state.clientSecret);
  readonly clientSecretExists$ = this.select(this.clientSecret$, (value) => !!value);

  readonly showSpinner$ = this.select(
    (state) =>
      state.loadingCredentials ||
      state.uploadInProgress ||
      state.removeInProgress ||
      state.generateSecretInProgress
  );

  readonly getCredentials = this.effect((actorId$: Observable<string>) =>
    actorId$.pipe(
      tap(() => this.patchState({ credentials: null, loadingCredentials: true })),
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
        tap(() => this.patchState({ uploadInProgress: true })),
        exhaustMap(({ actorId, file, onSuccess, onError }) =>
          this.httpClient
            .v1MarketParticipantActorAssignCertificateCredentialsPost(actorId, file)
            .pipe(
              tapResponse(
                () => onSuccess(),
                () => onError()
              ),
              finalize(() => this.patchState({ uploadInProgress: false }))
            )
        )
      )
  );

  readonly replaceCertificate = this.effect(
    (
      trigger$: Observable<{
        actorId: string;
        file: File;
        onSuccess: () => void;
        onError: () => void;
      }>
    ) =>
      trigger$.pipe(
        tap(() => this.patchState({ uploadInProgress: true })),
        exhaustMap(({ actorId, file, onSuccess, onError }) =>
          this.httpClient.v1MarketParticipantActorRemoveActorCredentialsDelete(actorId).pipe(
            switchMap(() =>
              this.httpClient
                .v1MarketParticipantActorAssignCertificateCredentialsPost(actorId, file)
                .pipe(
                  tapResponse(
                    () => onSuccess(),
                    () => onError()
                  ),
                  finalize(() => this.patchState({ uploadInProgress: false }))
                )
            )
          )
        )
      )
  );

  readonly generateClientSecret = this.effect(
    (
      trigger$: Observable<{
        actorId: string;
        onSuccess: () => void;
        onError: () => void;
      }>
    ) =>
      trigger$.pipe(
        tap(() => this.patchState({ generateSecretInProgress: true })),
        exhaustMap(({ actorId, onSuccess, onError }) =>
          this.httpClient.v1MarketParticipantActorRequestClientSecretCredentialsPost(actorId).pipe(
            tapResponse(
              (clientSecret) => {
                this.patchState({ clientSecret });

                onSuccess();
              },
              () => onError()
            ),
            finalize(() => this.patchState({ generateSecretInProgress: false }))
          )
        )
      )
  );

  readonly resetClientSecret = this.updater(
    (state): CertificateState => ({
      ...state,
      clientSecret: undefined,
    })
  );

  readonly removeActorCredentials = this.effect(
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
                this.patchState({ credentials: null, clientSecret: undefined });

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
