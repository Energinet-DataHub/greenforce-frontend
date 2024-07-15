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
import { Component, computed, effect, inject } from '@angular/core';

import { TranslocoPipe } from '@ngneat/transloco';
import type { ResultOf } from '@graphql-typed-document-node/core';
import { ConnectionPositionPair, OverlayModule } from '@angular/cdk/overlay';

import { WattIconComponent } from '@energinet-datahub/watt/icon';
import { WattSpinnerComponent } from '@energinet-datahub/watt/spinner';

import { query } from '@energinet-datahub/dh/shared/util-apollo';
import { GetSelectionActorsDocument } from '@energinet-datahub/dh/shared/domain/graphql';

import { windowLocationToken } from './window-location';
import { DhActorStorage } from './dh-actor-storage';

export type SelectionActor = ResultOf<typeof GetSelectionActorsDocument>['selectionActors'][0];

@Component({
  selector: 'dh-selected-actor',
  styleUrls: ['./dh-selected-actor.component.scss'],
  templateUrl: './dh-selected-actor.component.html',
  standalone: true,
  imports: [WattIconComponent, WattSpinnerComponent, OverlayModule, TranslocoPipe],
})
export class DhSelectedActorComponent {
  private location = inject(windowLocationToken);
  private actorStorage = inject(DhActorStorage);

  selectedActors = query(GetSelectionActorsDocument);

  actorGroups = computed(() => {
    const selectedActors = this.selectedActors.data()?.selectionActors;
    if (!selectedActors) return [];

    const sortedSelectedActors = selectedActors.toSorted((a, b) => {
      const nameCompare = a.organizationName.localeCompare(b.organizationName);
      return nameCompare !== 0 ? nameCompare : a.gln.localeCompare(b.gln);
    });

    const groupedActors = Object.groupBy(sortedSelectedActors, (actor) => actor.organizationName);

    return Object.entries(groupedActors).map(([key, value]) => ({
      organizationName: key,
      actors: value,
    }));
  });
  selectedActor = computed(() =>
    this.selectedActors
      .data()
      ?.selectionActors.find((actor) => actor.id === this.actorStorage.getSelectedActorId())
  );
  isLoading = this.selectedActors.loading;
  isOpen = false;
  positionPairs: ConnectionPositionPair[] = [
    {
      offsetX: 0,
      offsetY: -8,
      originX: 'start',
      originY: 'top',
      overlayX: 'start',
      overlayY: 'bottom',
    },
  ];

  constructor() {
    effect(() => {
      // If no selected actor is set in the storage, set the selected actor.
      const haveActor = this.actorStorage.getSelectedActor();
      const actor = this.selectedActor();
      if (actor && !haveActor) {
        this.selectActor(actor);
      }
    });
  }

  selectActor = (actor: SelectionActor) => {
    this.actorStorage.setSelectedActor(actor);
    this.location.reload();
  };

  isActorSelected = (actor: SelectionActor) => actor.id === this.actorStorage.getSelectedActorId();
}
