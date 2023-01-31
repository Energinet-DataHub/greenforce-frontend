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
import { MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { WattButtonModule } from '@energinet-datahub/watt/button';
import { WattModalModule } from '@energinet-datahub/watt/modal';
import { map, take, tap, timer } from 'rxjs';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [WattButtonModule, WattModalModule, CommonModule],
  selector: 'eo-idle-timer-modal',
  standalone: true,
  styles: [
    `
      :host {
        display: grid;
        grid-template-columns: auto auto;
        grid-template-rows: auto 1fr;
        height: 100%;
      }

      .modal-close {
        justify-self: flex-end;
        color: var(--watt-color-primary);
      }

      .modal-header {
        align-self: center;
      }

      .content {
        grid-column: span 2;
        margin-top: var(--watt-space-s);
        border-top: 1px solid var(--watt-color-primary-light);
        color: var(--watt-color-primary-dark);
        padding-top: var(--watt-space-m);
        align-self: start;
      }

      .actions {
        padding-top: var(--watt-space-m);
        border-top: 1px solid var(--watt-color-primary-light);
        display: flex;
        grid-column: span 2;
        gap: var(--watt-space-m);
        justify-content: flex-end;
      }
    `,
  ],
  template: `
    <span class="watt-headline-3 modal-header">Automatic logout</span>
    <watt-button
      variant="icon"
      icon="close"
      class="modal-close"
      (click)="close()"
    ></watt-button>
    <div class="content">
      <p>You will be logged out in:</p>
      <span class="watt-headline-1">{{
        countDownTimer$ | async | date: 'mm:ss'
      }}</span>
      <br />
      <p>We are logging you out for security reasons.</p>
    </div>
    <div class="actions">
      <watt-button variant="secondary" (click)="close('logout')">
        Log out
      </watt-button>
      <watt-button (click)="close()"> Stay logged in </watt-button>
    </div>
  `,
})
export class EoIdleTimerCountdownModalComponent {
  logoutAfterSeconds = 300; // 5 minutes

  countDownTimer$ = timer(0, 1000).pipe(
    take(this.logoutAfterSeconds), // Count from 0 to logoutAfterSeconds
    map((time) => this.logoutAfterSeconds - time - 1), // Calculate remaining time from current time
    map((time) => time * 1000), // Convert to milliseconds for the date pipe
    tap((timeLeft) => {
      if (timeLeft === 0) this.dialogRef.close('logout');
    })
  );

  close(action?: string) {
    this.dialogRef.close(action);
  }

  constructor(
    private dialogRef: MatDialogRef<EoIdleTimerCountdownModalComponent>
  ) {}
}
