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

import { DhSelectedActorStore } from './dh-selected-actor.store';

@Component({
  selector: 'dh-selected-actor',
  styleUrls: ['./dh-selected-actor.component.scss'],
  templateUrl: './dh-selected-actor.component.html',
  standalone: true,
  imports: [CommonModule, LetModule, PushModule],
})
export class DhSelectedActorComponent {
  selectedActor$ = this.store.selectedActor$;
  isLoading$ = this.store.isLoading$;

  constructor(private store: DhSelectedActorStore) {
    this.store.init();
  }
}
