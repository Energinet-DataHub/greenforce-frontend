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
import { MarketParticipantActorHttp } from '@energinet-datahub/dh/shared/domain';
import { Observable, finalize, switchMap, tap } from 'rxjs';

interface CertificateState {
  uploadInProgress: boolean;
}

const initialState: CertificateState = {
  uploadInProgress: false,
};

@Injectable()
export class DhMarketParticipantCertificateStore extends ComponentStore<CertificateState> {
  private readonly httpClient = inject(MarketParticipantActorHttp);

  readonly uploadInProgress$ = this.select((state) => state.uploadInProgress);

  constructor() {
    super(initialState);
  }

  readonly uploadCertificate = this.effect(
    (trigger$: Observable<{ actorId: string; file: File }>) =>
      trigger$.pipe(
        tap(() => this.patchState({ uploadInProgress: true })),
        switchMap(({ actorId, file }) =>
          this.httpClient.v1MarketParticipantActorAssignCertificateCredentialsPost(actorId, file)
        ),
        tapResponse(
          () => {
            console.log('done');
          },
          () => {
            console.log('error');
          }
        ),
        finalize(() => this.patchState({ uploadInProgress: false }))
      )
  );
}
