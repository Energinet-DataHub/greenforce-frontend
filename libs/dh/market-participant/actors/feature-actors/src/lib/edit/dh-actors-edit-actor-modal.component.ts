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
import { Component, Input, ViewChild } from '@angular/core';
import { WATT_MODAL, WattModalComponent } from '@energinet-datahub/watt/modal';
import { DhActorExtended } from '../dh-actor';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'dh-actors-edit-actor-modal',
  templateUrl: './dh-actors-edit-actor-modal.component.html',
  styles: [``],
  imports: [WATT_MODAL, CommonModule],
})
export class DhActorsEditActorModalComponent {
  @ViewChild(WattModalComponent)
  innerModal: WattModalComponent | undefined;

  @Input() actor: DhActorExtended | undefined;

  open(): void {
    this.innerModal?.open();
  }
}
