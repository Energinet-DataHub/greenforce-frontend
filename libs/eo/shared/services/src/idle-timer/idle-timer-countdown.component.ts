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
import { map, take, tap, timer } from 'rxjs';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [WattButtonModule, WattModalModule, CommonModule],
  selector: 'eo-idle-timer-modal',
  standalone: true,
  styles: [
    `
      :host {
        height: 500px; // Magic UX number
        display: grid;
        align-items: center;
        grid-template-columns: 1fr auto;
        grid-template-rows: 44px 1fr auto; // Magic UX number
        grid-template-areas:
          'title close'
          'content content'
          '. actions';
      }

      .modal-title {
        grid-area: title;
      }

      .modal-close {
        grid-area: close;
        justify-self: end;
        color: var(--watt-color-primary);
      }

      .content {
        grid-area: content;
        border-top: 1px solid var(--watt-primary-light);
        border-bottom: 1px solid var(--watt-primary-light);
        color: var(--watt-color-primary-dark);
        padding-top: var(--watt-space-m);
        align-self: start;
        height: 100%;
      }

      .actions {
        padding-top: var(--watt-space-m);
        display: flex;
        grid-area: actions;
        gap: var(--watt-space-m);
      }
    `,
  ],
  template: `
    <watt-button
      variant="icon"
      icon="close"
      class="modal-close"
      (click)="close()"
    ></watt-button>
    <h3 class="modal-title">Automatic logout</h3>
    <div class="content">
      <p>You will be logged out in:</p>
      <h1>{{ countDownTimer$ | async | date: 'mm:ss' }}</h1>
      <br />
      <p>We are logging you out for security reasons.</p>
    </div>
    <div class="actions">
      <watt-button variant="secondary" (click)="close('logout')">
        Log out
      </watt-button>
      <watt-button aria-selected="true" (click)="close()">
        Stay logged in
      </watt-button>
    </div>
  `,
})
export class EoIdleTimerCountdownModalComponent {
  logoutAfterSeconds = 300;

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
