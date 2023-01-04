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
import { ComponentStore } from '@ngrx/component-store';
import { filter, map, Observable, switchMap, tap } from 'rxjs';
import { ActorStorage, actorStorageToken } from './actor-storage';
import { windowLocationToken } from './window-location';

export type SelectedActorState = {
  isLoading: boolean;
  actorGroups: ActorGroup[];
  selectedActor: Actor | null;
};

export type ActorGroup = {
  organizationName: string;
  actors: Actor[];
};

export type Actor = {
  id: string;
  gln: string;
  actorName: string | null;
  organizationName: string;
  selected: boolean;
  [key: string]: unknown;
};

const initialState = {
  isLoading: true,
  actorGroups: [],
  selectedActor: null,
};

@Injectable({
  providedIn: 'root',
})
export class DhSelectedActorStore extends ComponentStore<SelectedActorState> {
  actorGroups$ = this.select((state) => state.actorGroups);
  selectedActor$ = this.select((state) => state.selectedActor).pipe(
    filter((actor) => !!actor),
    map((actor) => actor as Actor)
  );
  isLoading$ = this.select((state) => state.isLoading);

  constructor(
    private client: MarketParticipantActorQueryHttp,
    @Inject(actorStorageToken) private actorStorage: ActorStorage,
    @Inject(windowLocationToken) private windowLocation: Location
  ) {
    super(initialState);
  }

  readonly init = this.effect((trigger$: Observable<void>) => {
    return trigger$.pipe(
      switchMap(() =>
        this.client.v1MarketParticipantActorQueryGetSelectionActorsGet().pipe(
          tap((r) => {
            const actorId = this.actorStorage.getSelectedActor();

            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const actor = r.find((x) => x.id === actorId)!;

            const actors = r
              .map((x) => ({
                id: x.id,
                gln: x.gln,
                actorName: 'inc.',
                organizationName: x.organizationName,
                selected: x.id === actorId,
              }))
              .sort((a, b) => {
                const nameCompare = a.organizationName.localeCompare(
                  b.organizationName
                );
                return nameCompare !== 0
                  ? nameCompare
                  : a.gln.localeCompare(b.gln);
              });

            const actorGroups = Array.from(
              this.groupBy(actors, 'organizationName').entries()
            ).map((x) => ({ organizationName: x[0], actors: x[1] }));

            return this.patchState({
              isLoading: false,
              actorGroups: actorGroups,
              selectedActor: {
                id: actor.id,
                gln: actor.gln,
                actorName: 'inc.',
                organizationName: actor.organizationName,
                selected: actor.id === actorId,
              },
            });
          })
        )
      )
    );
  });

  public setSelectedActor(actorId: string) {
    this.actorStorage.setSelectedActor(actorId);
    this.windowLocation.reload();
  }

  // todo mjm: shared helper function maybe?
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private groupBy<T extends { [key: string]: any }>(
    source: T[],
    groupingKey: keyof T
  ) {
    return source.reduce((entryMap, e) => {
      const currentKey = e[groupingKey as string];
      return entryMap.set(currentKey, [...(entryMap.get(currentKey) || []), e]);
    }, new Map<string, T[]>());
  }
}
