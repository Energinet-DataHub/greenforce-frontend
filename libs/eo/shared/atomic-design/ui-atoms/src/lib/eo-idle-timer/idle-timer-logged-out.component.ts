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
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { WattButtonModule } from '@energinet-datahub/watt/button';
import { WattModalModule } from '@energinet-datahub/watt/modal';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [WattButtonModule, WattModalModule, CommonModule],
  selector: 'eo-idle-timer-modal',
  standalone: true,
  styles: [
    `
      :host {
        display: grid;
        align-items: center;
        grid-template-rows: auto 1fr;
        height: 100%;
      }

      .modal-header {
        height: 44px;
      }

      .content {
        color: var(--watt-color-primary-dark);
        border-top: 1px solid var(--watt-color-primary-light);
        padding-top: var(--watt-space-m);
        align-self: start;
      }

      .actions {
        padding-top: var(--watt-space-m);
        border-top: 1px solid var(--watt-color-primary-light);
        display: flex;
        justify-content: flex-end;
      }
    `,
  ],
  template: `
    <span class="watt-headline-3 modal-header">Automatic logout</span>
    <p class="content">
      For security reasons you have been automatically logged out.
    </p>
    <div class="actions">
      <watt-button (click)="close()">Ok</watt-button>
    </div>
  `,
})
export class EoIdleTimerLoggedOutModalComponent {
  close(action?: string) {
    this.dialogRef.close(action);
  }

  constructor(
    private dialogRef: MatDialogRef<EoIdleTimerLoggedOutModalComponent>
  ) {}
}
