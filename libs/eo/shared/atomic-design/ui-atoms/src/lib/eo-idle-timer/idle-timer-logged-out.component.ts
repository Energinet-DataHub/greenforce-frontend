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
        height: 500px; // Magic UX number
        display: flex;
        flex-direction: column;
      }

      h3 {
        min-height: 44px; // Magic UX number
      }

      .content {
        color: var(--watt-color-primary-dark);
        padding-top: var(--watt-space-m);
        height: 100%;
      }

      watt-button {
        display: flex;
        justify-content: end;
      }
    `,
  ],
  template: `
    <h3>Automatic logout</h3>
    <p class="content">
      For security reasons you have been automatically logged out.
    </p>
    <watt-button aria-selected="true" (click)="close()">Ok</watt-button>
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
