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
import { AsyncPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable } from '@apollo/client';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WATT_MODAL } from '@energinet-datahub/watt/modal';
import { map, take, tap, timer } from 'rxjs';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [WattButtonComponent, WATT_MODAL, AsyncPipe, DatePipe],
  selector: 'eo-idle-timer-modal',
  standalone: true,
  styles: [
    `
      :host {
        display: grid;
        grid-template-columns: auto auto;
        grid-template-rows: auto 1fr;
        height: 100%;
        padding: 20px;
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
        border-top: 1px solid var(--watt-color-primary-light);
        display: flex;
        grid-column: span 2;
        gap: var(--watt-space-m);
        justify-content: flex-end;
        padding-top: 10px;
      }
    `,
  ],
  template: `
    <span class="watt-headline-3 modal-header">Automatic logout</span>
    <watt-button variant="icon" icon="close" class="modal-close" (click)="close()"></watt-button>
    <div class="content">
      <p>You will be logged out in:</p>
      <span class="watt-headline-1">{{ countdown$ | async }}</span>
      <br />
      <p>We are logging you out for security reasons.</p>
    </div>
    <div class="actions">
      <watt-button variant="secondary" (click)="close('logout')"> Log out </watt-button>
      <watt-button (click)="close()"> Stay logged in </watt-button>
    </div>
  `,
})
export class EoIdleTimerCountdownModalComponent {
  countdown$!: Observable<string>;

  constructor(
    private dialogRef: MatDialogRef<EoIdleTimerCountdownModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { countdown: Observable<string> }
  ) {
    this.countdown$ = data.countdown;
  }

  close(action?: string) {
    this.dialogRef.close(action);
  }
}
