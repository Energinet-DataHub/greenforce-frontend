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
import { Observable, switchMap, tap } from 'rxjs';

import {
  MarketParticipantActorCredentialsDto,
  MarketParticipantActorHttp,
} from '@energinet-datahub/dh/shared/domain';

interface CertificateState {
  credentials: MarketParticipantActorCredentialsDto | null;
  loadingCredentials: boolean;
  uploadInProgress: boolean;
}

const initialState: CertificateState = {
  credentials: null,
  loadingCredentials: true,
  uploadInProgress: false,
};

@Injectable()
export class DhMarketParticipantCertificateStore extends ComponentStore<CertificateState> {
  private readonly httpClient = inject(MarketParticipantActorHttp);

  readonly doCredentialsExist$ = this.select((state) => !!state.credentials);
  readonly certificateMetaData$ = this.select((state) => state.credentials?.certificateCredentials);

  readonly loadingCredentials$ = this.select((state) => state.loadingCredentials);
  readonly uploadInProgress$ = this.select((state) => state.uploadInProgress);

  readonly getCredentials = this.effect((trigger$) =>
    trigger$.pipe(
      tap(() => this.patchState({ loadingCredentials: true })),
      switchMap(() => this.httpClient.v1MarketParticipantActorGetActorCredentialsGet()),
      tapResponse(
        (response) => {
          this.patchState({ credentials: response });

          this.patchState({ loadingCredentials: false });
        },
        () => {
          this.patchState({ credentials: null });

          this.patchState({ loadingCredentials: false });
        }
      )
    )
  );

  readonly uploadCertificate = this.effect(
    (trigger$: Observable<{ actorId: string; file: File }>) =>
      trigger$.pipe(
        tap(() => this.patchState({ uploadInProgress: true })),
        switchMap(({ actorId, file }) =>
          this.httpClient.v1MarketParticipantActorAssignCertificateCredentialsPost(actorId, file)
        ),
        tapResponse(
          () => {
            this.patchState({ uploadInProgress: false });
          },
          () => {
            this.patchState({ uploadInProgress: false });
          }
        )
      )
  );

  constructor() {
    super(initialState);
  }
}
