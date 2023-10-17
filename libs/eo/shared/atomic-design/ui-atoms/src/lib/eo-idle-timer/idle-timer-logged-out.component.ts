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
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WATT_MODAL } from '@energinet-datahub/watt/modal';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [WattButtonComponent, WATT_MODAL],
  selector: 'eo-idle-timer-modal',
  standalone: true,
  template: `
    <watt-modal #modal title="Automatic logout" size="small">
      <p class="content">For security reasons you have been automatically logged out.</p>

      <watt-modal-actions>
        <watt-button (click)="modal.close(false)">Ok</watt-button>
      </watt-modal-actions>
    </watt-modal>
  `,
})
export class EoIdleTimerLoggedOutModalComponent {
  close(action?: string) {
    this.dialogRef.close(action);
  }

  constructor(private dialogRef: MatDialogRef<EoIdleTimerLoggedOutModalComponent>) {}
}
