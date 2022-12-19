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

import { Inject, Injectable } from '@angular/core';
import { MarketParticipantActorQueryHttp } from '@energinet-datahub/dh/shared/domain';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { Observable, switchMap, tap } from 'rxjs';
import { ActorStorage, actorStorageToken } from './actor-storage';

export type SelectedActorState = {
  isLoading: boolean;
  selectedActor: SelectedActor;
};

export type SelectedActor = {
  gln?: string;
  organizationName?: string;
};

@Injectable({
  providedIn: 'root',
})
export class DhSelectedActorStore extends ComponentStore<SelectedActorState> {
  selectedActor$ = this.select((state) => state.selectedActor);
  isLoading$ = this.select((state) => state.isLoading);

  constructor(
    private client: MarketParticipantActorQueryHttp,
    @Inject(actorStorageToken) private actorStorage: ActorStorage
  ) {
    super({
      isLoading: true,
      selectedActor: {},
    });
  }

  readonly init = this.effect((trigger$: Observable<void>) => {
    return trigger$.pipe(
      switchMap(() =>
        this.client.v1MarketParticipantActorQuerySelectionActorsGet().pipe(
          tapResponse(
            (r) => {
              const actorId = this.actorStorage.getSelectedActor();
              const actor = r.find((x) => x.id === actorId);
              return this.patchState({
                isLoading: false,
                selectedActor: {
                  gln: actor?.gln,
                  organizationName: actor?.organizationName,
                },
              });
            },
            (e) => console.log(e)
          )
        )
      )
    );
  });

  gOnInit(): void {
    this.client
      .v1MarketParticipantActorQuerySelectionActorsGet()
      .pipe(tap((x) => console.log(x)))
      .subscribe();
  }
}
