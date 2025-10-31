//#region License
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
//#endregion
import { Component, computed, effect, inject } from '@angular/core';

import { TranslocoPipe } from '@jsverse/transloco';
import type { ResultOf } from '@graphql-typed-document-node/core';
import { ConnectionPositionPair, OverlayModule } from '@angular/cdk/overlay';

import { WattIconComponent } from '@energinet/watt/icon';
import { WattSpinnerComponent } from '@energinet/watt/spinner';

import { query } from '@energinet-datahub/dh/shared/util-apollo';
import { GetSelectionMarketParticipantsDocument } from '@energinet-datahub/dh/shared/domain/graphql';

import { windowLocationToken } from './window-location';
import { DhActorStorage } from './dh-actor-storage';

export type SelectionMarketParticipant = ResultOf<
  typeof GetSelectionMarketParticipantsDocument
>['selectionMarketParticipants'][0];

@Component({
  selector: 'dh-selected-actor',
  styleUrls: ['./dh-selected-actor.component.scss'],
  templateUrl: './dh-selected-actor.component.html',
  imports: [WattIconComponent, WattSpinnerComponent, OverlayModule, TranslocoPipe],
})
export class DhSelectedActorComponent {
  private location = inject(windowLocationToken);
  private actorStorage = inject(DhActorStorage);

  selectedMarketParticipants = query(GetSelectionMarketParticipantsDocument);

  marketParticipantGroups = computed(() => {
    const selectedMarketParticipants =
      this.selectedMarketParticipants.data()?.selectionMarketParticipants;
    if (!selectedMarketParticipants) return [];

    const sortedSelectedMarketParticipants = selectedMarketParticipants.toSorted((a, b) => {
      const nameCompare = a.organizationName.localeCompare(b.organizationName);
      return nameCompare !== 0 ? nameCompare : a.gln.localeCompare(b.gln);
    });

    const groupedMarketParticipants = Object.groupBy(
      sortedSelectedMarketParticipants,
      (participant) => participant.organizationName
    );

    return Object.entries(groupedMarketParticipants).map(([key, value]) => ({
      organizationName: key,
      actors: value,
    }));
  });
  selectedMarketParticipant = computed(() =>
    this.selectedMarketParticipants
      .data()
      ?.selectionMarketParticipants.find(
        (participant) => participant.id === this.actorStorage.getSelectedActorId()
      )
  );
  isLoading = this.selectedMarketParticipants.loading;
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
      // If no selected market participant is set in the storage, set the selected market participant.
      const haveParticipant = this.actorStorage.haveSelectedActor();
      const participant = this.selectedMarketParticipant();
      if (participant && !haveParticipant) {
        this.selectMarketParticipant(participant);
      }
    });
  }

  selectMarketParticipant = (marketParticipant: SelectionMarketParticipant) => {
    this.actorStorage.setSelectedActor(marketParticipant);
    this.location.reload();
  };

  isMarketParticipantSelected = (marketParticipant: SelectionMarketParticipant) =>
    marketParticipant.id === this.actorStorage.getSelectedActorId();
}
