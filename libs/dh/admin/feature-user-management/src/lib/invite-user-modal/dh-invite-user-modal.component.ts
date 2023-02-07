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

import { Component, ViewChild } from '@angular/core';
import {
  WattModalComponent,
  WattModalModule,
} from '@energinet-datahub/watt/modal';

import { WattButtonModule } from '@energinet-datahub/watt/button';
import { MatStepperModule } from '@angular/material/stepper';
@Component({
  selector: 'dh-invite-user-modal',
  templateUrl: './dh-invite-user-modal.component.html',
  styleUrls: ['./dh-invite-user-modal.component.scss'],
  standalone: true,
  imports: [WattModalModule, MatStepperModule, WattButtonModule],
})
export class DhInviteUserModalComponent {
  @ViewChild('inviteUserModal') inviteUserModal!: WattModalComponent;
  open() {
    this.inviteUserModal.open();
  }
}
