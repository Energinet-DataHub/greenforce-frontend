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
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LetModule, PushModule } from '@rx-angular/template';
import { ConnectionPositionPair, OverlayModule } from '@angular/cdk/overlay';

import { DhSelectedActorStore, Actor } from './dh-selected-actor.store';
import { WattIconModule } from '@energinet-datahub/watt/icon';
import { WattSpinnerModule } from '@energinet-datahub/watt/spinner';

@Component({
  selector: 'dh-selected-actor',
  styleUrls: ['./dh-selected-actor.component.scss'],
  templateUrl: './dh-selected-actor.component.html',
  standalone: true,
  imports: [
    CommonModule,
    LetModule,
    PushModule,
    WattIconModule,
    WattSpinnerModule,
    OverlayModule,
  ],
})
export class DhSelectedActorComponent {
  actorGroups$ = this.store.actorGroups$;
  selectedActor$ = this.store.selectedActor$;
  isLoading$ = this.store.isLoading$;
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

  constructor(private store: DhSelectedActorStore) {
    this.store.init();
  }

  selectActor = (actor: Actor) => this.store.setSelectedActor(actor.id);
}
